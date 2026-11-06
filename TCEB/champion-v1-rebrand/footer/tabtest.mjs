// Test the Email | Text switch by swapping the footer + CSS into the live page: node tabtest.mjs <width> <prefix> [live]
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const W = +process.argv[2], PRE = process.argv[3], LIVE = process.argv[4] === 'live', port = 9921 + (W < 768 ? 1 : 0);
const NEWJS = fs.readFileSync('/private/tmp/claude-502/-Users-maggiescott34-Claude-Folder/80c4b99f-f8bc-464e-a726-c4e5843587a0/scratchpad/footer-new.js', 'utf8');
const CSS = fs.readFileSync('msg-tabs.css', 'utf8');
const prof = fs.mkdtempSync('/private/tmp/claude-502/-Users-maggiescott34-Claude-Folder/80c4b99f-f8bc-464e-a726-c4e5843587a0/scratchpad/prof-');
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); if (tabs.length) break; } catch {} await sleep(200); }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}, errs = [];
ws.onmessage = async e => { const m = JSON.parse(e.data);
  if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; }
  if (m.method === 'Runtime.exceptionThrown') errs.push(m.params.exceptionDetails.exception?.description?.slice(0, 200));
  if (m.method === 'Fetch.requestPaused') {
    const html = await (await fetch(m.params.request.url)).text();
    const a = html.indexOf('<script>\n/* ====='), b = html.indexOf('</script>', a);
    let out = html.slice(0, a) + '<script>' + NEWJS + html.slice(b);
    out = out.replace('</head>', '<style>' + CSS + '</style></head>');
    send('Fetch.fulfillRequest', { requestId: m.params.requestId, responseCode: 200, responseHeaders: [{ name: 'Content-Type', value: 'text/html; charset=utf-8' }], body: Buffer.from(out).toString('base64') });
  } };
const send = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
await send('Runtime.enable'); await send('Page.enable');
if (!LIVE) await send('Fetch.enable', { patterns: [{ urlPattern: '*thecompoundeffect.com/champion?*', resourceType: 'Document' }] });
await send('Emulation.setDeviceMetricsOverride', { width: W, height: W < 768 ? 844 : 1000, deviceScaleFactor: W < 768 ? 2 : 1, mobile: W < 768 });
await send('Page.navigate', { url: 'https://www.thecompoundeffect.com/champion?id=EYZMPM8&cb=' + Date.now() }); await sleep(9000);
const ev = async x => (await send('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true })).result.result.value;
const state = () => ev(`JSON.stringify({tabs:[...document.querySelectorAll('.champ-msg-tab')].map(b=>b.textContent+(b.classList.contains('is-on')?'*':'')), box: document.getElementById('refMsg').value, sms: decodeURIComponent(document.getElementById('refSms').href), mail: decodeURIComponent(document.getElementById('refMail').href).slice(0,120)})`);
await ev(`(()=>{try{Cookiebot.submitCustomConsent(true,true,true)}catch(e){} const c=document.getElementById('CybotCookiebotDialog'); if(c) c.remove(); document.getElementById('hubOut').scrollIntoView({block:'center'});})()`); await sleep(800);
console.log('EMAIL', await state());
const shot = async n => { const b = JSON.parse(await ev(`(()=>{const r=document.getElementById('hubOut').getBoundingClientRect(); return JSON.stringify({y:r.top+scrollY,h:r.height,x:r.left,w:r.width});})()`));
  const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 85, captureBeyondViewport: true, clip: { x: b.x, y: b.y, width: b.w, height: b.h, scale: 1 } }); fs.writeFileSync(`${PRE}-${n}-${W}.jpg`, Buffer.from(s.result.data, 'base64')); };
await shot('email');
await sleep(1500); await ev(`document.querySelector('.champ-msg-tab[data-mode=text]').click()`); await sleep(400); console.log('after 1st click', JSON.parse(await state()).tabs); await ev(`document.querySelector('.champ-msg-tab[data-mode=text]').click()`); await sleep(400);
console.log('TEXT', await state()); await shot('text');
await ev(`document.querySelector('[data-opt=leader]').click()`); await sleep(300); await ev(`document.querySelector('[data-opt=audio]').click()`); await sleep(300);
console.log('AFTER OPTION SWITCH', JSON.parse(await state()).tabs);
console.log('errors:', errs);
ws.close(); chrome.kill();
