// Render the Founders sales page's three "Admit one · Leader" tickets as a transparent portrait PNG.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const out = process.argv[2];
const W = 880, H = 1014; // same 0.868 ratio as the Enroll card image slot
const port = 9850;
const prof = fs.mkdtempSync('/private/tmp/claude-502/-Users-maggiescott34-Claude-Folder/80c4b99f-f8bc-464e-a726-c4e5843587a0/scratchpad/reg/prof-');
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
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1200, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'https://fnxstudio.github.io/darren-hardy/TCEB/founders-event-page/?cb=' + Date.now() });
await sleep(6000);
const r = await ev(`(async()=>{
  await document.fonts.ready;
  const minis=[...document.querySelectorAll('.fan .mini')];
  if(minis.length!==3) return 'minis '+minis.length;
  const stage=document.createElement('div');
  stage.style.cssText='position:fixed;left:0;top:0;width:${W}px;height:${H}px;z-index:2147483647;background:transparent;overflow:visible';
  // back to front: Nº 003, Nº 002, Nº 001 (the original order and dimming)
  const pos=[['-10px','250px','-12deg'],['0px','10px','-5deg'],['10px','-235px','2deg']];
  minis.forEach((m,i)=>{const c=m.cloneNode(true);c.classList.remove('rv');c.style.cssText='position:absolute;left:50%;top:50%;width:690px;transition:none;opacity:1;transform:translate(-50%,-50%) translate('+pos[i][0]+','+pos[i][1]+') rotate('+pos[i][2]+')';stage.appendChild(c);});
  document.body.appendChild(stage);
  document.querySelectorAll('body > *:not(:last-child)').forEach(n=>n.style.visibility='hidden');
  document.documentElement.style.background='transparent';document.body.style.background='transparent';
  window.scrollTo(0,0);
  await new Promise(r=>setTimeout(r,800));
  return 'ok';
})()`);
console.log('stage', r?.value);
await send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: W, height: H, scale: 1 } });
fs.writeFileSync(out, Buffer.from(shot.result.data, 'base64'));
console.log('saved', out);
chrome.kill(); process.exit(0);
