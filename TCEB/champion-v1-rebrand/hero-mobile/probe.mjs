// Phone probe of the /champion hero: node probe.mjs out.jpg [width] [height] [css-to-inject]
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const out = process.argv[2], W = +(process.argv[3] || 390), H = +(process.argv[4] || 844), CSS = process.argv[5] ? fs.readFileSync(process.argv[5], 'utf8') : '', port = 9871;
const prof = fs.mkdtempSync('/private/tmp/claude-502/-Users-maggiescott34-Claude-Folder/80c4b99f-f8bc-464e-a726-c4e5843587a0/scratchpad/prof-');
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let tabs;
for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); if (tabs.length) break; } catch {} await sleep(200); }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);
let id = 0; const pend = {};
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; } };
const send = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async expr => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result;
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 2, mobile: true });
await send('Page.navigate', { url: 'https://www.thecompoundeffect.com/champion?cb=' + Date.now() });
await sleep(6000);
await ev(`(()=>{const s=document.createElement('style');s.textContent=${JSON.stringify(CSS)};document.head.appendChild(s);const c=document.getElementById('CybotCookiebotDialog');if(c)c.remove();})()`);
const r = await ev(`(async()=>{
  await document.fonts.ready;
  try{Cookiebot.submitCustomConsent(true,true,true)}catch(e){}
  await new Promise(r=>setTimeout(r,800));
  const hero=document.querySelector('.champ-hero');
  const rows=[];
  const walk=(el,d)=>{ if(d>4) return; for(const c of el.children){ const b=c.getBoundingClientRect(); const cs=getComputedStyle(c); if(b.height>0) rows.push('  '.repeat(d)+c.className+' top='+Math.round(b.top)+' h='+Math.round(b.height)+' mt='+cs.marginTop+' mb='+cs.marginBottom+' pt='+cs.paddingTop+' pb='+cs.paddingBottom+' tf='+cs.transform.slice(0,40)); if(!/champ-pcard /.test(c.className+' ')) walk(c,d+1);} };
  const cs=getComputedStyle(hero); rows.unshift('hero pt='+cs.paddingTop+' pb='+cs.paddingBottom+' minh='+cs.minHeight+' h='+Math.round(hero.getBoundingClientRect().height));
  walk(hero,0); return rows.join('\\n');
})()`);
console.log(r?.value);
const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 80 });
fs.writeFileSync(out, Buffer.from(shot.result.data, 'base64'));
ws.close(); chrome.kill();
