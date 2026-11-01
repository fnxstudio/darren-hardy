// Founders ticket as a real 3D brushed-metal plate.
// The CSS ticket stays in the page as the fallback; this hides it only once WebGL is running.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const stage = document.getElementById('stage');
const canvas = document.getElementById('gl');
if (!stage || !canvas) throw new Error('no stage');

const W = 2.35, H = 1;                // ticket proportions (matches the CSS ticket)
const STUB = 0.74;                    // stub line at 74% of the width
const NOTCH = 0.021 * W;              // notch radius
const DEPTH = 0.035;                  // plate thickness

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
} catch (e) { throw new Error('webgl unavailable'); }
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.92;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

const camera = new THREE.PerspectiveCamera(22, 1, 0.1, 50);

// ---------- shape: rectangle with two semicircle notches at the stub line ----------
const x0 = -W / 2, x1 = W / 2, y0 = -H / 2, y1 = H / 2, xs = x0 + STUB * W;
const shape = new THREE.Shape();
shape.moveTo(x0, y0);
shape.lineTo(xs - NOTCH, y0);
shape.absarc(xs, y0, NOTCH, Math.PI, 0, true);
shape.lineTo(x1, y0);
shape.lineTo(x1, y1);
shape.lineTo(xs + NOTCH, y1);
shape.absarc(xs, y1, NOTCH, 0, Math.PI, true);
shape.lineTo(x0, y1);
shape.lineTo(x0, y0);

const geo = new THREE.ExtrudeGeometry(shape, {
  depth: DEPTH, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 4, curveSegments: 24
});
geo.translate(0, 0, -DEPTH / 2);

// ---------- textures: engraved face + brushed grain ----------
const TW = 2048, TH = Math.round(TW / W);
function faceCanvas(lockImg) {
  const c = document.createElement('canvas'); c.width = TW; c.height = TH;
  const g = c.getContext('2d');
  g.fillStyle = '#fff'; g.fillRect(0, 0, TW, TH);
  const ink = '#151719';
  const u = TW / 100;                                  // 1cqw equivalent
  g.strokeStyle = ink; g.lineWidth = 2.2;
  const sx = STUB * TW;
  g.strokeRect(2.2 * u, 2.2 * u, sx - 3.6 * u, TH - 4.4 * u);       // main frame
  g.strokeRect(sx + 1.4 * u, 2.2 * u, TW - sx - 3.6 * u, TH - 4.4 * u); // stub frame
  // perforation
  g.fillStyle = ink;
  for (let y = 4 * u; y < TH - 4 * u; y += 1.5 * u) { g.beginPath(); g.arc(sx, y, 0.25 * u, 0, Math.PI * 2); g.fill(); }
  // top labels
  const label = (t, x, y, size, align, weight, track) => {
    g.font = `${weight} ${size}px Inter, Helvetica, Arial, sans-serif`;
    g.textAlign = align; g.textBaseline = 'middle';
    if ('letterSpacing' in g) g.letterSpacing = `${track}px`;
    g.fillText(t.toUpperCase(), x, y);
    if ('letterSpacing' in g) g.letterSpacing = '0px';
  };
  label('Admit one', 5 * u, 7.2 * u, 1.5 * u, 'left', 600, 0.45 * u);
  label('Founder', sx - 5 * u, 7.2 * u, 1.5 * u, 'right', 600, 0.45 * u);
  // lockup, recoloured to ink
  if (lockImg) {
    const lw = sx - 24 * u, lh = lw * (lockImg.naturalHeight / lockImg.naturalWidth);
    const t = document.createElement('canvas'); t.width = Math.round(lw); t.height = Math.round(lh);
    const tg = t.getContext('2d'); tg.drawImage(lockImg, 0, 0, t.width, t.height);
    tg.globalCompositeOperation = 'source-in'; tg.fillStyle = ink; tg.fillRect(0, 0, t.width, t.height);
    g.drawImage(t, (sx - lw) / 2, 10.5 * u);
  }
  // meta row
  const my = TH - 8.5 * u;
  g.beginPath(); g.moveTo(5 * u, my - 4.6 * u); g.lineTo(sx - 5 * u, my - 4.6 * u); g.lineWidth = 1.6; g.stroke();
  const cols = [['Mon + Tue', 'April 26 + 27, 2027'], ['Live', 'From anywhere'], ['Exclusively with', 'Darren Hardy']];
  const cw = (sx - 10 * u) / 3;
  cols.forEach((c, i) => {
    const cx = 5 * u + cw * i + cw / 2;
    label(c[0], cx, my - 1.2 * u, 1.45 * u, 'center', 700, 0.2 * u);
    label(c[1], cx, my + 1.4 * u, 1.45 * u, 'center', 500, 0.2 * u);
  });
  // stub: vertical label, barcode, number
  const scx = sx + (TW - sx) / 2;
  g.save(); g.translate(scx, 14 * u); g.rotate(-Math.PI / 2);
  label('Founder ticket', 0, 0, 1.45 * u, 'center', 600, 0.46 * u); g.restore();
  const bw = (TW - sx) * 0.55, bx = scx - bw / 2, by = TH - 17.5 * u, bh = 7 * u;
  let x = bx; const pat = [2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2];
  let k = 0; while (x < bx + bw) { const w = pat[k % pat.length] * 2.6; if (k % 2 === 0) g.fillRect(x, by, w, bh); x += w; k++; }
  g.font = `600 ${2.6 * u}px "kepler-3-display", Georgia, serif`; g.textAlign = 'center';
  if ('letterSpacing' in g) g.letterSpacing = `${0.3 * u}px`;
  g.textBaseline = 'middle'; g.fillText('Nº 001', scx, TH - 6.8 * u);
  return c;
}

function brushedCanvas() {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512;
  const g = c.getContext('2d');
  g.fillStyle = 'rgb(90,90,90)'; g.fillRect(0, 0, c.width, c.height);
  for (let i = 0; i < 2600; i++) {
    const y = Math.random() * c.height, v = 60 + Math.random() * 70;
    g.fillStyle = `rgba(${v},${v},${v},${0.25 + Math.random() * 0.35})`;
    g.fillRect(Math.random() * c.width - 200, y, 200 + Math.random() * 900, 0.6 + Math.random() * 1.1);
  }
  return c;
}

function loadImg(src) { return new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; }); }

async function build() {
  try { await document.fonts.ready; } catch (e) {}
  const lock = await loadImg('img/lockup-steel.webp');
  const face = new THREE.CanvasTexture(faceCanvas(lock));
  face.colorSpace = THREE.SRGBColorSpace;
  face.anisotropy = renderer.capabilities.getMaxAnisotropy();
  // ExtrudeGeometry cap UVs are shape coordinates: map them to 0..1
  face.repeat.set(1 / W, 1 / H); face.offset.set(0.5, 0.5);

  const bumpTex = new THREE.CanvasTexture(face.image);
  bumpTex.repeat.copy(face.repeat); bumpTex.offset.copy(face.offset);

  const brushed = new THREE.CanvasTexture(brushedCanvas());
  brushed.wrapS = brushed.wrapT = THREE.RepeatWrapping;
  brushed.repeat.set(1 / W, 2 / H); brushed.offset.set(0.5, 0.5);

  const faceMat = new THREE.MeshPhysicalMaterial({
    color: 0xd6dbe1, metalness: 1, roughness: 0.3,
    map: face, bumpMap: bumpTex, bumpScale: 2.2,
    roughnessMap: brushed, anisotropy: 0.75, anisotropyRotation: 0,
    clearcoat: 0.25, clearcoatRoughness: 0.18
  });
  const edgeMat = new THREE.MeshPhysicalMaterial({ color: 0xe8ebef, metalness: 1, roughness: 0.18 });

  const mesh = new THREE.Mesh(geo, [faceMat, edgeMat]);
  const rig = new THREE.Group(); rig.add(mesh); scene.add(rig);

  // a soft key light that follows the pointer, so highlights slide across the metal
  const key = new THREE.DirectionalLight(0xffffff, 1.2); key.position.set(-1.5, 2, 3); scene.add(key);
  const rimL = new THREE.DirectionalLight(0xb9c8e6, 0.6); rimL.position.set(2.5, -1, 1.5); scene.add(rimL);

  // ---------- sizing ----------
  function resize() {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    const stageW = stage.getBoundingClientRect().width;
    const visibleW = W * (r.width / stageW);              // ticket spans the stage width
    const d = visibleW / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect);
    camera.position.set(0, 0, d); camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }
  resize(); addEventListener('resize', resize);

  // ---------- motion: rest near square, float, tilt toward pointer, grow on hover ----------
  const rest = { x: THREE.MathUtils.degToRad(2), y: THREE.MathUtils.degToRad(-2), z: THREE.MathUtils.degToRad(-0.8) };
  const target = { x: rest.x, y: rest.y, s: 1 }, cur = { x: rest.x, y: rest.y, s: 1 };
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  stage.addEventListener('pointermove', e => {
    const r = stage.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    target.y = rest.y + px * THREE.MathUtils.degToRad(16);
    target.x = rest.x + py * THREE.MathUtils.degToRad(12);
    target.s = 1.05;
    key.position.set(-1.5 + px * 4, 2 - py * 3, 3);
  });
  stage.addEventListener('pointerleave', () => { target.x = rest.x; target.y = rest.y; target.s = 1; key.position.set(-1.5, 2, 3); });

  const clock = new THREE.Clock();
  function frame() {
    if (!document.hidden) {
      const t = clock.getElapsedTime();
      const ease = 0.07;
      cur.x += (target.x - cur.x) * ease; cur.y += (target.y - cur.y) * ease; cur.s += (target.s - cur.s) * ease;
      const bob = reduce ? 0 : Math.sin(t * (Math.PI * 2 / 8)) * 0.02;
      const sway = reduce ? 0 : Math.sin(t * 0.35) * THREE.MathUtils.degToRad(1.2);
      rig.rotation.set(cur.x, cur.y + sway, rest.z);
      rig.position.y = bob;
      rig.scale.setScalar(cur.s);
      renderer.render(scene, camera);
    }
    requestAnimationFrame(frame);
  }
  frame();
  stage.classList.add('gl-on');
}

build().catch(() => {});
