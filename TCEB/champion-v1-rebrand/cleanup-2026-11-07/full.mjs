// Full-page shot of live /champion: node full.mjs prefix width [query]
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const pre = process.argv[2], W = +(process.argv[3] || 1440), q = process.argv[4] || '', port = 9700 + Math.floor(Math.random()*150);
const prof = fs.mkdtempSync('/private/tmp/claude-502/-Users-maggiescott34-Claude-Folder/80c4b99f-f8bc-464e-a726-c4e5843587a0/scratchpad/prof-');
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let tabs;
for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); if (tabs.length) break; } catch {} await sleep(200); }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}; const errs = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.method === 'Runtime.exceptionThrown') errs.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; } };
const send = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async expr => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result;
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: W, height: W < 768 ? 844 : 1000, deviceScaleFactor: 1, mobile: W < 768 });
await send('Page.navigate', { url: (process.env.BASE||'https://www.thecompoundeffect.com')+'/champion?cb=' + Date.now() + q });
await sleep(8000);
const r = await ev(`(async()=>{
  try{Cookiebot.submitCustomConsent(true,true,true)}catch(e){}
  await new Promise(r=>setTimeout(r,800));
  for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}
  scrollTo(0,0);
  document.querySelectorAll('*').forEach(n=>{const cs=getComputedStyle(n); if(cs.opacity==='0' && !n.closest('dialog')) {n.style.opacity=1;n.style.transform='none';}});
  await new Promise(r=>setTimeout(r,1200));
  const st=document.getElementById('stand');
  return JSON.stringify({h:document.documentElement.scrollHeight, signed: st && !st.hidden, link: (document.getElementById('refLink')||{}).value||(document.getElementById('refLink')||{}).textContent});
})()`);
const b = JSON.parse(r.value);
const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 70, captureBeyondViewport: true, clip: { x: 0, y: 0, width: W, height: b.h, scale: W < 768 ? 1 : 0.5 } });
fs.writeFileSync(`${pre}-${W}${q ? '-in' : ''}.jpg`, Buffer.from(shot.result.data, 'base64'));
console.log(pre, W, q, JSON.stringify(b), 'errs', errs);
ws.close(); chrome.kill();
