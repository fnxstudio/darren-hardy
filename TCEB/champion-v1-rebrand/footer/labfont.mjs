import { spawn } from 'node:child_process'; import fs from 'node:fs';
const port = 9931, prof = fs.mkdtempSync('/private/tmp/claude-502/-Users-maggiescott34-Claude-Folder/80c4b99f-f8bc-464e-a726-c4e5843587a0/scratchpad/prof-');
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms)); let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); if (tabs.length) break; } catch {} await sleep(200); }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}; ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; } };
const send = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
await send('Page.enable'); await send('Page.navigate', { url: 'https://www.thecompoundeffect.com/champion?id=EYZMPM8&cb=' + Date.now() }); await sleep(8000);
const r = await send('Runtime.evaluate', { expression: `(()=>{const l=document.getElementById('refMsg').previousElementSibling; const L=l.classList.contains('champ-msg-head')?l.querySelector('.champ-lab'):l; const c=getComputedStyle(L); return JSON.stringify({font:c.font,ls:c.letterSpacing,color:c.color,tt:c.textTransform, tabs: !!document.querySelector('.champ-msg-tab')});})()`, returnByValue: true });
console.log(r.result.result.value); ws.close(); chrome.kill();
