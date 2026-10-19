// champion-sync.mjs
// Champion Board CMS sync for thecompoundeffect.com/champion (Webflow).
// Node 18+ with no dependencies. Run it after the hourly HubSpot sync.
//
// Usage as a module:
//   import { syncChampions } from './champion-sync.mjs';
//   await syncChampions(champions, { token: process.env.WEBFLOW_TOKEN });
//
// Usage from the command line:
//   WEBFLOW_TOKEN=... node champion-sync.mjs champions.json            (writes and publishes)
//   WEBFLOW_TOKEN=... node champion-sync.mjs champions.json --dry-run  (prints the plan, writes nothing)
//   node champion-sync.mjs --selftest                                  (checks the rules offline)
//
// Each Champion passed in looks like this:
//   {
//     referralId: "ABC123",                  // the console's referral ID, as printed on the mailer
//     name:       "Brenda Huntley",
//     firstName:  "Brenda",                  // optional; defaults to the first word of name
//     email:      "brenda@example.com",      // the HubSpot email they sign in with
//     credits: [                             // every credited Founders Event seat, ever
//       { dealId: "1234567", paidAt: "2026-11-02T18:04:00Z", refunded: false },
//       ...
//     ]
//   }
//
// Season impacts = seats in `credits` that are not refunded (the console sets refunded for refunded OR cancelled deals). Sprint impacts are the same seats,
// counted only inside a sprint's dates. Sprints are records in the Webflow "Champion Sprints"
// collection, so new sprints never need a code change.

import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

// ---- Fixed IDs on the Webflow site (do not change) ----
const API = 'https://api.webflow.com/v2';
const COLLECTIONS = {
  champions: '6ac88291653ad8734d1bd847',
  logins: '6acf13c97a9a39ec5acbee1a',
  boardPages: '6ac89043132e0bf5aad97b4a',
  sprints: '6ad15edd5f23f38cd51f5b83',
};
const COINS = [ // highest first
  { name: 'Platinum', min: 10, id: '1d3650743ca4c70aef69155f3c1f44a7' },
  { name: 'Gold', min: 5, id: 'd412b7374ee3ec2980be561aeebd0220' },
  { name: 'Silver', min: 3, id: '5e1f014253a7a1e45a1d6bdb8f50342d' },
  { name: 'Copper', min: 1, id: 'a49b5c01443a208160da4cb973415dca' },
];

// ---- Board rules (we will tell you if any of these change) ----
const TABLE_SEATS = 5;       // Darren's Table: top 5
const STUDIO_SEATS = 40;     // In the Studio: top 40 at the final count
const ROWS_PER_PAGE = 250;   // Board Pages: Champions per record
const BATCH = 100;           // Webflow max items per request
const ZONE = 'America/New_York'; // sprint days and the weekly snapshot run on Eastern time

// ---- Calculations ----

export function signInKey(email) {
  return createHash('sha256').update(String(email).trim().toLowerCase()).digest('hex').slice(0, 40);
}

export function slugFor(referralId) {
  const slug = String(referralId).trim().toLowerCase();
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error(`Referral ID "${referralId}" has characters a Webflow slug cannot hold`);
  return slug;
}

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

export function coinFor(impacts) {
  return COINS.find((c) => impacts >= c.min) || null;
}

export function nextCoinFor(impacts) {
  const above = COINS.filter((c) => c.min > impacts);
  return above.length ? above[above.length - 1] : null; // the lowest coin still above them
}

export function statusLine(rank, impacts) {
  if (impacts < 1) return 'Your first impact puts you on the board.';
  if (rank <= TABLE_SEATS) return "At Darren's Table right now.";
  if (rank <= STUDIO_SEATS) return `${plural(rank - TABLE_SEATS, 'spot')} behind the Top 5 right now.`;
  return `${plural(rank - STUDIO_SEATS, 'spot')} behind In Studio eligibility right now.`;
}

export function sprintStatusLine(rank, sprintImpacts, leaderImpacts) {
  if (sprintImpacts < 1) return 'Your first impact this sprint puts you on the sprint board.';
  if (rank === 1) return 'Leading this sprint.';
  const gap = leaderImpacts - sprintImpacts;
  return gap > 0 ? `${plural(gap, 'impact')} behind the sprint leader.` : 'Tied with the sprint leader.';
}

// Seats that still count (not refunded or cancelled), with their paid time in ms.
function liveCredits(c) {
  return (c.credits || [])
    .filter((x) => x && !x.refunded && x.paidAt && !Number.isNaN(Date.parse(x.paidAt)))
    .map((x) => Date.parse(x.paidAt));
}

// Rank by a count, highest first. Ties go to whoever reached their count first.
function rankBy(list, count, reachedAt) {
  return [...list]
    .sort((a, b) => (count(b) - count(a)) || (reachedAt(a) - reachedAt(b)) || String(a.name).localeCompare(String(b.name)))
    .map((c, i) => ({ c, rank: i + 1 }));
}

// Season ranking: most impacts first; ties go to whoever reached their count first.
export function rankChampions(champions) {
  const time = (c) => (c.lastCreditAt ? Date.parse(c.lastCreditAt) : Number.MAX_SAFE_INTEGER);
  return rankBy(champions, (c) => c.impacts, time).map(({ c, rank }) => ({ ...c, rank }));
}

// ---- Eastern-time sprint windows ----

// Offset (ms) between New York wall-clock time and UTC at instant t.
function zoneOffset(t) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: ZONE, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(new Date(t)).map((p) => [p.type, p.value]));
  return Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second) - t;
}

// 12:00 am Eastern on a calendar day ("2026-11-01"), as UTC ms.
export function easternDayStart(ymd) {
  const [y, m, d] = ymd.split('-').map(Number);
  const guess = Date.UTC(y, m - 1, d);
  let t = guess - zoneOffset(guess);
  t = guess - zoneOffset(t); // second pass settles daylight-saving edges
  return t;
}

const nextDay = (ymd) => {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);
};

// A sprint record's window: from 12:00 am Eastern on its start day up to (not including)
// 12:00 am Eastern the day after its end day. Only the calendar date of each field is used.
export function sprintWindow(item) {
  const f = item.fieldData || {};
  if (!f.start || !f.end) return null;
  const from = easternDayStart(String(f.start).slice(0, 10));
  const to = easternDayStart(nextDay(String(f.end).slice(0, 10)));
  return to > from ? { from, to } : null;
}

// Count and rank everyone's seats inside one window.
export function sprintStandings(champions, win) {
  const scored = champions.map((c) => {
    const inside = liveCredits(c).filter((t) => t >= win.from && t < win.to).sort((a, b) => a - b);
    return { c, n: inside.length, reached: inside.length ? inside[inside.length - 1] : Number.MAX_SAFE_INTEGER };
  });
  const ranked = rankBy(scored.filter((s) => s.n > 0), (s) => s.n, (s) => s.reached)
    .map(({ c: s, rank }) => ({ slug: slugFor(s.c.referralId), name: s.c.name, n: s.n, rank }));
  const rows = ranked.map((r) => [r.rank, String(r.name).replace(/\|/g, ' '), r.n].join('|')).join('\n');
  return { ranked, rows, leader: ranked.length ? ranked[0].n : 0 };
}

// Every field we own on a Champions record. Hands-off fields (headshot, featured,
// new-coin-this-month, team-line) are never included, so updates leave them alone.
// `sprint` is { impacts, rank, status } for the live sprint, null when no sprint is live,
// or undefined to leave the sprint fields as they are (live sprint that is locked).
export function fieldsFor(c, lastWeekRank, sprint) {
  const impacts = Math.max(0, Math.floor(Number(c.impacts) || 0));
  const coin = coinFor(impacts);
  const next = nextCoinFor(impacts);
  const f = {
    name: c.name,
    slug: slugFor(c.referralId),
    'champion-id': String(c.referralId).trim(),
    'first-name': c.firstName || String(c.name).trim().split(/\s+/)[0],
    email: String(c.email || '').trim().toLowerCase(),
    impacts,
    rank: c.rank,
    coin: coin ? coin.id : null,
    'next-coin': next ? next.name : '',
    'to-next-coin': next ? next.min - impacts : 0,
    'spots-to-studio-line': Math.max(0, c.rank - STUDIO_SEATS),
    'move-this-week': lastWeekRank ? lastWeekRank - c.rank : 0,
    'status-line': statusLine(c.rank, impacts),
  };
  if (sprint !== undefined) {
    f['sprint-impacts'] = sprint ? sprint.impacts : null;
    f['sprint-rank'] = sprint ? sprint.rank : null;
    f['sprint-status'] = sprint ? sprint.status : '';
  }
  return f;
}

export function boardPageRows(ranked) {
  const onBoard = ranked.filter((c) => c.impacts > 0);
  const lines = onBoard.map((c) => [c.rank, String(c.name).replace(/\|/g, ' '), coinFor(c.impacts).name, c.impacts].join('|'));
  const pages = Math.max(1, Math.ceil(lines.length / ROWS_PER_PAGE));
  const out = [];
  for (let p = 0; p < pages; p++) {
    const chunk = lines.slice(p * ROWS_PER_PAGE, (p + 1) * ROWS_PER_PAGE);
    out.push(p === 0 ? [`pages=${pages}`, ...chunk].join('\n') : chunk.join('\n'));
  }
  return out; // out[0] -> p1, out[1] -> p2 ...
}

// ---- Weekly snapshot for "move this week" ----
// Default store is a JSON file. Pass { snapshot: { load, save } } to use your own database instead.

function fileSnapshot(path) {
  return {
    async load() { try { return JSON.parse(await readFile(path, 'utf8')); } catch { return { takenAt: null, ranks: {} }; } },
    async save(data) { await writeFile(path, JSON.stringify(data, null, 2)); },
  };
}

// Most recent Monday 12:00 am Eastern, as a Date.
function lastMondayET(now = Date.now()) {
  const today = new Date(now + zoneOffset(now)).toISOString().slice(0, 10);
  const [y, m, d] = today.split('-').map(Number);
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  const monday = new Date(Date.UTC(y, m - 1, d - ((dow + 6) % 7))).toISOString().slice(0, 10);
  return new Date(easternDayStart(monday));
}

// ---- Webflow API ----

function client(token, log) {
  async function call(method, path, body) {
    for (let attempt = 0; attempt < 6; attempt++) {
      const res = await fetch(API + path, {
        method,
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', accept: 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (res.status === 429) {
        const wait = (Number(res.headers.get('retry-after')) || 30) * 1000;
        log(`Rate limited, waiting ${wait / 1000}s`);
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }
      const text = await res.text();
      if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}: ${text}`);
      return text ? JSON.parse(text) : {};
    }
    throw new Error(`${method} ${path} -> still rate limited after 6 tries`);
  }
  return {
    async listAll(collection) {
      const items = [];
      for (let offset = 0; ; offset += BATCH) {
        const page = await call('GET', `/collections/${collection}/items?limit=${BATCH}&offset=${offset}`);
        items.push(...page.items);
        if (items.length >= page.pagination.total || !page.items.length) return items;
      }
    },
    async create(collection, fieldDatas) {
      const ids = [];
      for (let i = 0; i < fieldDatas.length; i += BATCH) {
        const res = await call('POST', `/collections/${collection}/items`, {
          items: fieldDatas.slice(i, i + BATCH).map((fieldData) => ({ fieldData, isDraft: false, isArchived: false })),
        });
        ids.push(...(res.items || [res]).map((it) => it.id));
      }
      return ids;
    },
    async update(collection, items) {
      for (let i = 0; i < items.length; i += BATCH) {
        await call('PATCH', `/collections/${collection}/items`, { items: items.slice(i, i + BATCH) });
      }
    },
    async remove(collection, ids) {
      for (let i = 0; i < ids.length; i += BATCH) {
        const items = ids.slice(i, i + BATCH).map((id) => ({ id }));
        await call('DELETE', `/collections/${collection}/items/live`, { items }).catch(() => {}); // take it off the live site
        await call('DELETE', `/collections/${collection}/items`, { items });
      }
    },
    async publish(collection, ids) {
      for (let i = 0; i < ids.length; i += BATCH) {
        await call('POST', `/collections/${collection}/items/publish`, { itemIds: ids.slice(i, i + BATCH) });
      }
    },
  };
}

// True when every field we would send already holds that value.
function unchanged(existing, wanted) {
  return Object.entries(wanted).every(([k, v]) => {
    const have = existing[k];
    if ((v === null || v === '') && (have === null || have === undefined || have === '')) return true;
    return have === v;
  });
}

// One Champion from the console, cleaned. `credits` is the source of truth for impacts.
// (A plain `impacts` number is still accepted for testing, but then sprints cannot be counted.)
export function normalize(c) {
  const out = { ...c };
  if (Array.isArray(c.credits)) {
    const times = liveCredits(c).sort((a, b) => a - b);
    out.impacts = times.length;
    out.lastCreditAt = times.length ? new Date(times[times.length - 1]).toISOString() : null;
  } else {
    out.impacts = Math.max(0, Math.floor(Number(c.impacts) || 0));
  }
  return out;
}

// ---- The sync ----

export async function syncChampions(input, opts = {}) {
  const log = opts.log || ((m) => console.log(m));
  const dryRun = !!opts.dryRun;
  const now = opts.now ? Date.parse(opts.now) : Date.now();
  if (!dryRun && !opts.token) throw new Error('Missing Webflow token');
  const wf = client(opts.token, log);
  const offline = dryRun && !opts.token;
  const snapshot = opts.snapshot || fileSnapshot(opts.snapshotPath || './champion-rank-snapshot.json');

  // 1. Clean the input: one entry per referral ID.
  const byId = new Map();
  for (const c of input) {
    if (!c.referralId || !c.name) { log(`Skipped (missing referralId or name): ${JSON.stringify(c)}`); continue; }
    byId.set(slugFor(c.referralId), normalize(c));
  }
  const everyone = [...byId.values()];
  if (everyone.some((c) => !Array.isArray(c.credits))) log('Note: some Champions were sent without `credits`, so their sprint impacts count as 0.');

  // 2. Season ranking, then every field, before writing anything.
  const ranked = rankChampions(everyone);
  let snap = await snapshot.load();
  if (!snap.takenAt || new Date(snap.takenAt) < lastMondayET(now)) {
    // A new week started: last week's final ranks become the baseline.
    snap = { takenAt: new Date(now).toISOString(), ranks: Object.fromEntries(ranked.map((c) => [slugFor(c.referralId), c.rank])) };
    if (!dryRun) await snapshot.save(snap);
  }

  // 3. Sprints: read the sprint records and count each one that has started and is not locked.
  const sprintItems = offline ? (opts.sprints || []) : await wf.listAll(COLLECTIONS.sprints);
  const sprintUpdates = [];
  let live = null; // { item, standings, locked }
  for (const item of sprintItems) {
    const win = sprintWindow(item);
    if (!win || now < win.from) continue; // no dates yet, or not started
    const locked = !!item.fieldData.locked;
    const standings = sprintStandings(everyone, win);
    if (now < win.to) {
      if (live) log(`Note: sprints "${live.item.fieldData.name}" and "${item.fieldData.name}" overlap. Using the first.`);
      else live = { item, standings, locked };
    }
    if (!locked && (item.fieldData.rows || '') !== standings.rows) sprintUpdates.push({ id: item.id, fieldData: { rows: standings.rows } });
  }
  const sprintFor = (slug) => {
    if (!live) return null; // no sprint live: clear the sprint fields
    if (live.locked) return undefined; // live but locked: leave them alone
    const r = live.standings.ranked.find((x) => x.slug === slug);
    return {
      impacts: r ? r.n : 0,
      rank: r ? r.rank : null,
      status: sprintStatusLine(r ? r.rank : null, r ? r.n : 0, live.standings.leader),
    };
  };
  const wanted = ranked.map((c) => {
    const slug = slugFor(c.referralId);
    return fieldsFor(c, snap.ranks[slug], sprintFor(slug));
  });

  // 4. Read what is in Webflow now.
  const existingChampions = offline ? [] : await wf.listAll(COLLECTIONS.champions);
  const existingLogins = offline ? [] : await wf.listAll(COLLECTIONS.logins);
  const existingPages = offline ? [] : await wf.listAll(COLLECTIONS.boardPages);
  const champBySlug = new Map(existingChampions.map((it) => [it.fieldData.slug, it]));

  // 5. Champions: create new, update changed.
  const toCreate = [], toUpdate = [];
  for (const f of wanted) {
    const have = champBySlug.get(f.slug);
    if (!have) toCreate.push(f);
    else if (!unchanged(have.fieldData, f)) {
      const { slug, ...rest } = f; // never rewrite a slug
      toUpdate.push({ id: have.id, fieldData: rest });
    }
  }
  const missing = existingChampions.filter((it) => it.fieldData['champion-id'] && !byId.has(it.fieldData.slug));
  if (missing.length) log(`Note: ${missing.length} Champions in Webflow are not in this sync (left untouched): ${missing.map((m) => m.fieldData['champion-id']).join(', ')}`);

  // 6. Champion Logins: one key per email, pointing at the referral ID.
  const loginBySlug = new Map(existingLogins.map((it) => [it.fieldData.slug, it]));
  const wantKeys = new Map();
  for (const f of wanted) if (f.email) wantKeys.set(signInKey(f.email), { slug: signInKey(f.email), ref: f.slug, name: f.name });
  const loginCreate = [], loginUpdate = [], loginRemove = [];
  for (const k of wantKeys.values()) {
    const have = loginBySlug.get(k.slug);
    if (!have) loginCreate.push(k);
    else if (have.fieldData.ref !== k.ref || have.fieldData.name !== k.name) loginUpdate.push({ id: have.id, fieldData: { ref: k.ref, name: k.name } });
  }
  for (const it of existingLogins) {
    // An old key for a Champion we sync, whose email has since changed.
    if (byId.has(it.fieldData.ref) && !wantKeys.has(it.fieldData.slug)) loginRemove.push(it.id);
  }

  // 7. Board Pages (the season's full standings list).
  const pageRows = boardPageRows(ranked);
  const pageBySlug = new Map(existingPages.map((it) => [it.fieldData.slug, it]));
  const pageCreate = [], pageUpdate = [];
  pageRows.forEach((rows, i) => {
    const slug = `p${i + 1}`, have = pageBySlug.get(slug);
    if (!have) pageCreate.push({ name: `Board page ${i + 1}`, slug, rows });
    else if (have.fieldData.rows !== rows) pageUpdate.push({ id: have.id, fieldData: { rows } });
  });
  for (const it of existingPages) {
    const n = Number(String(it.fieldData.slug).slice(1));
    if (n > pageRows.length && it.fieldData.rows) pageUpdate.push({ id: it.id, fieldData: { rows: '' } }); // empty pages no longer needed
  }

  const plan = {
    champions: { create: toCreate.length, update: toUpdate.length },
    logins: { create: loginCreate.length, update: loginUpdate.length, remove: loginRemove.length },
    boardPages: { create: pageCreate.length, update: pageUpdate.length, pages: pageRows.length },
    sprints: { live: live ? live.item.fieldData.name : null, update: sprintUpdates.length },
  };
  log(`Plan: ${JSON.stringify(plan)}`);
  if (dryRun) {
    log('Dry run. First 5 Champions as they would be written:');
    wanted.slice(0, 5).forEach((f) => log(JSON.stringify(f)));
    if (live) log(`Live sprint "${live.item.fieldData.name}" standings:\n${live.standings.rows || '(nobody yet)'}`);
    return { plan, wanted, sprintUpdates };
  }

  // 8. Write, then publish only what changed.
  const champIds = [...(await wf.create(COLLECTIONS.champions, toCreate)), ...toUpdate.map((u) => u.id)];
  await wf.update(COLLECTIONS.champions, toUpdate);
  const loginIds = [...(await wf.create(COLLECTIONS.logins, loginCreate)), ...loginUpdate.map((u) => u.id)];
  await wf.update(COLLECTIONS.logins, loginUpdate);
  await wf.remove(COLLECTIONS.logins, loginRemove);
  const pageIds = [...(await wf.create(COLLECTIONS.boardPages, pageCreate)), ...pageUpdate.map((u) => u.id)];
  await wf.update(COLLECTIONS.boardPages, pageUpdate);
  await wf.update(COLLECTIONS.sprints, sprintUpdates);

  await wf.publish(COLLECTIONS.champions, champIds);
  await wf.publish(COLLECTIONS.logins, loginIds);
  await wf.publish(COLLECTIONS.boardPages, pageIds);
  await wf.publish(COLLECTIONS.sprints, sprintUpdates.map((u) => u.id));
  log('Sync complete.');
  return { plan };
}

// ---- Offline checks ----

export async function selfTest() {
  const assert = (ok, msg) => { if (!ok) throw new Error('Self-test failed: ' + msg); };
  assert(signInKey(' Demo@TheCompoundEffect.com ') === 'a7dd10d16281b6d4f01adbba751aab21a27dc6b9', 'sign-in key');
  assert(statusLine(3, 12) === "At Darren's Table right now.", 'table');
  assert(statusLine(8, 11) === '3 spots behind the Top 5 right now.', 'top 5 gap');
  assert(statusLine(6, 10) === '1 spot behind the Top 5 right now.', 'singular spot');
  assert(statusLine(27, 2) === '22 spots behind the Top 5 right now.', 'inside top 40, any impacts');
  assert(statusLine(43, 4) === '3 spots behind In Studio eligibility right now.', 'studio gap');
  assert(statusLine(2, 0) === 'Your first impact puts you on the board.', 'zero impacts');
  assert(coinFor(0) === null && coinFor(2).name === 'Copper' && coinFor(4).name === 'Silver' && coinFor(9).name === 'Gold' && coinFor(10).name === 'Platinum', 'coins');
  const f = fieldsFor({ referralId: 'ABC123', name: 'Pat Lee', email: 'P@x.com', impacts: 8, rank: 27 }, 29);
  assert(f.slug === 'abc123' && f['next-coin'] === 'Platinum' && f['to-next-coin'] === 2 && f['move-this-week'] === 2 && f.coin === COINS[1].id, 'fields');
  assert(!('sprint-impacts' in f), 'sprint fields left alone when undefined');
  const r = rankChampions([
    { name: 'A', impacts: 3, lastCreditAt: '2026-11-02T00:00:00Z' },
    { name: 'B', impacts: 3, lastCreditAt: '2026-11-01T00:00:00Z' },
    { name: 'C', impacts: 5 },
  ]);
  assert(r.map((c) => c.name).join('') === 'CBA', 'rank and tie-break');
  const rows = boardPageRows(r.concat({ name: 'Z|ero', impacts: 0, rank: 4 }));
  assert(rows.length === 1 && rows[0].startsWith('pages=1\n1|C|Gold|5') && !rows[0].includes('ero'), 'board rows');

  // Eastern-time windows, including the daylight-saving change on Nov 1, 2026.
  assert(new Date(easternDayStart('2026-11-01')).toISOString() === '2026-11-01T04:00:00.000Z', 'EDT midnight');
  assert(new Date(easternDayStart('2026-11-05')).toISOString() === '2026-11-05T05:00:00.000Z', 'EST midnight');
  const sprint = { id: 's1', fieldData: { name: 'Nov 1 to 4', start: '2026-11-01T00:00:00.000Z', end: '2026-11-04T00:00:00.000Z', rows: '' } };
  const win = sprintWindow(sprint);
  assert(win.from === Date.parse('2026-11-01T04:00:00Z') && win.to === Date.parse('2026-11-05T05:00:00Z'), 'sprint window');

  // A pretend sprint: Brenda earns 5 inside the window, Taylor 7, Pat only before it.
  const seat = (at, refunded = false) => ({ dealId: at, paidAt: at, refunded });
  const people = [
    { referralId: 'BRENDA1', name: 'Brenda Huntley', email: 'b@x.com', credits: [
      seat('2026-10-20T15:00:00Z'), seat('2026-11-01T14:00:00Z'), seat('2026-11-02T14:00:00Z'), seat('2026-11-02T18:00:00Z'),
      seat('2026-11-03T14:00:00Z'), seat('2026-11-05T03:30:00Z'), // 10:30 pm Eastern Nov 4: inside
      seat('2026-11-05T06:00:00Z'), // 1 am Eastern Nov 5: outside
    ] },
    { referralId: 'TAYLOR1', name: 'Taylor Richardson', email: 't@x.com', credits: [
      ...['01', '01', '02', '02', '03', '03', '04'].map((d, i) => seat(`2026-11-${d}T1${i}:00:00Z`)),
      seat('2026-11-04T20:00:00Z', true), // refunded: never counts
    ] },
    { referralId: 'PAT1', name: 'Pat Lee', email: 'p@x.com', credits: [seat('2026-10-10T15:00:00Z'), seat('2026-10-11T15:00:00Z')] },
  ].map(normalize);
  assert(people[0].impacts === 7 && people[1].impacts === 7 && people[2].impacts === 2, 'season impacts from credits');
  const st = sprintStandings(people, win);
  assert(st.rows === '1|Taylor Richardson|7\n2|Brenda Huntley|5', 'sprint standings');
  assert(sprintStatusLine(2, 5, 7) === '2 impacts behind the sprint leader.' && sprintStatusLine(1, 7, 7) === 'Leading this sprint.', 'sprint status');

  // Full offline run during the sprint, then after it ends, then with no sprints at all.
  const quiet = { log: () => {}, dryRun: true, snapshot: { load: async () => ({ takenAt: null, ranks: {} }), save: async () => {} } };
  const during = await syncChampions(people, { ...quiet, now: '2026-11-03T12:00:00Z', sprints: [sprint] });
  const b = during.wanted.find((w) => w.slug === 'brenda1'), p = during.wanted.find((w) => w.slug === 'pat1');
  assert(b['sprint-impacts'] === 5 && b['sprint-rank'] === 2 && b.impacts === 7, 'Brenda during sprint');
  assert(p['sprint-impacts'] === 0 && p['sprint-rank'] === null, 'Pat during sprint');
  assert(during.plan.sprints.live === 'Nov 1 to 4' && during.sprintUpdates.length === 1, 'sprint record updated');
  const after = await syncChampions(people, { ...quiet, now: '2026-11-10T12:00:00Z', sprints: [sprint] });
  assert(after.plan.sprints.live === null && after.wanted[0]['sprint-impacts'] === null, 'sprint fields clear after it ends');
  const lockedRun = await syncChampions(people, { ...quiet, now: '2026-11-03T12:00:00Z', sprints: [{ ...sprint, fieldData: { ...sprint.fieldData, locked: true } }] });
  assert(lockedRun.sprintUpdates.length === 0 && !('sprint-impacts' in lockedRun.wanted[0]), 'locked sprint left alone');
  const none = await syncChampions(people, { ...quiet, now: '2026-11-03T12:00:00Z', sprints: [] });
  assert(none.plan.sprints.live === null, 'no sprints');
  console.log('Self-test passed.');
}

// ---- Command line ----

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const args = process.argv.slice(2);
  if (args.includes('--selftest')) await selfTest();
  else if (!args[0]) console.log('Usage: node champion-sync.mjs champions.json [--dry-run] | --selftest');
  else {
    const champions = JSON.parse(await readFile(args[0], 'utf8'));
    await syncChampions(champions, { token: process.env.WEBFLOW_TOKEN, dryRun: args.includes('--dry-run') });
  }
}
