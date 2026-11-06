// Load /champion-invitation with a referral, open the cart, report which Spiffy checkout loaded: node carttest.mjs out.jpg
import { spawn } from 'node:child_process'; import fs from 'node:fs';
const OUT = process.argv[2], port = 9941, prof = fs.mkdtempSync('/private/tmp/claude-502/-Users-maggiescott34-Claude-Folder/80c4b99f-f8bc-464e-a726-c4e5843587a0/scratchpad/prof-');
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms)); let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); if (tabs.length) break; } catch {} await sleep(200); }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}, errs = []; ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; } if (m.method === 'Runtime.exceptionThrown') errs.push(m.params.exceptionDetails.exception?.description?.slice(0, 160)); };
const send = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
await send('Runtime.enable'); await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'https://www.thecompoundeffect.com/champion-invitation?utm_content=EYZMPM8&ref=EYZMPM8&skip=end&cb=' + Date.now() }); await sleep(6000);
const ev = async x => (await send('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true })).result.result.value;
await ev(`(()=>{try{Cookiebot.submitCustomConsent(true,true,true)}catch(e){} const c=document.getElementById('CybotCookiebotDialog'); if(c) c.remove(); document.documentElement.classList.add('ci-reveal'); const a=document.querySelector('[data-ci-open=cart]'); a && a.click(); })()`);
await sleep(12000);
console.log(await ev(`JSON.stringify({el:(document.querySelector('.pp-checkout spiffy-element')||{}).outerHTML?.slice(0,300), iframe:(document.querySelector('.pp-checkout iframe')||{}).src, h:(document.querySelector('.pp-checkout iframe')||{}).offsetHeight, ready:document.querySelector('.pp-checkout').className})`));
console.log('errors:', errs);
const b = JSON.parse(await ev(`(()=>{const r=document.querySelector('.ci-cart').getBoundingClientRect(); return JSON.stringify({y:r.top+scrollY,h:r.height});})()`));
const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 80, captureBeyondViewport: true, clip: { x: 0, y: b.y, width: 1280, height: Math.min(b.h, 2200), scale: 0.6 } }); fs.writeFileSync(OUT, Buffer.from(s.result.data, 'base64'));
ws.close(); chrome.kill();
