/* =========================================================
   WIRA SIBER — ADEGAN 3D HERO (Three.js)
   Perisai siber di tengah, sfera rangkaian dengan "paket data"
   bergerak, dan 5 orb pilar yang mengorbit. Ketik orb untuk
   pergi ke pilar berkenaan.

   Sandaran: jika WebGL / Three.js gagal dimuatkan, atau pengguna
   memilih "kurangkan gerakan", gambar maskot asal kekal dipaparkan.
   ========================================================= */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const PILLARS = [
  { n: 1, name: 'Lindungi Maklumat Peribadi', color: 0x6366f1, css: '#6366f1' },
  { n: 2, name: 'Gunakan Kata Laluan Kuat',   color: 0xf59e0b, css: '#f59e0b' },
  { n: 3, name: 'Berfikir Sebelum Kongsi',    color: 0x0284c7, css: '#0284c7' },
  { n: 4, name: 'Elak Orang Tidak Dikenali',  color: 0xf43f5e, css: '#f43f5e' },
  { n: 5, name: 'Laporkan Segera',            color: 0x10b981, css: '#10b981' },
];

const host = document.getElementById('hero3d');
const visual = host && host.closest('.hero-visual');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (host && visual && !reduceMotion) {
  try { init(); } catch (err) { console.warn('Adegan 3D tidak dapat dimulakan:', err); }
}

/* ---------- Bentuk & tekstur pembantu ---------- */
function shieldShape(k = 1) {
  const s = new THREE.Shape();
  s.moveTo(0, 1.35 * k);
  s.bezierCurveTo(0.45 * k, 1.05 * k, 0.85 * k, 1.0 * k, 1.1 * k, 1.0 * k);
  s.lineTo(1.1 * k, 0.1 * k);
  s.bezierCurveTo(1.1 * k, -0.65 * k, 0.55 * k, -1.1 * k, 0, -1.4 * k);
  s.bezierCurveTo(-0.55 * k, -1.1 * k, -1.1 * k, -0.65 * k, -1.1 * k, 0.1 * k);
  s.lineTo(-1.1 * k, 1.0 * k);
  s.bezierCurveTo(-0.85 * k, 1.0 * k, -0.45 * k, 1.05 * k, 0, 1.35 * k);
  return s;
}

function dotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.45, 'rgba(255,255,255,0.9)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function labelTexture(num, css) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  g.beginPath();
  g.arc(64, 64, 54, 0, Math.PI * 2);
  g.fillStyle = '#ffffff';
  g.fill();
  g.lineWidth = 10;
  g.strokeStyle = css;
  g.stroke();
  g.fillStyle = css;
  g.font = '800 64px "Outfit", "Plus Jakarta Sans", system-ui, sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(String(num), 64, 68);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ---------- Adegan ---------- */
function init() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  if (!renderer.getContext()) return;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0.25, 9.5);

  // Cahaya
  scene.add(new THREE.HemisphereLight(0xffffff, 0xc7d2fe, 0.7));
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
  keyLight.position.set(3, 4, 5);
  scene.add(keyLight);
  const cyan = new THREE.PointLight(0x22d3ee, 20, 14);
  cyan.position.set(-3.2, 1.2, 2.5);
  scene.add(cyan);
  const violet = new THREE.PointLight(0xa78bfa, 16, 14);
  violet.position.set(3.2, -1.8, 2.5);
  scene.add(violet);

  const root = new THREE.Group();
  scene.add(root);
  const DOT = dotTexture();

  /* Perisai */
  const shieldGroup = new THREE.Group();
  root.add(shieldGroup);

  const shieldGeo = new THREE.ExtrudeGeometry(shieldShape(1), {
    depth: 0.3, bevelEnabled: true, bevelThickness: 0.14, bevelSize: 0.1, bevelSegments: 8, curveSegments: 48,
  });
  shieldGeo.center();
  shieldGroup.add(new THREE.Mesh(shieldGeo, new THREE.MeshPhysicalMaterial({
    color: 0x4f46e5, metalness: 0.45, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.1,
  })));

  const insetGeo = new THREE.ExtrudeGeometry(shieldShape(0.74), {
    depth: 0.12, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.04, bevelSegments: 4, curveSegments: 48,
  });
  insetGeo.center();
  const inset = new THREE.Mesh(insetGeo, new THREE.MeshPhysicalMaterial({
    color: 0x818cf8, metalness: 0.3, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.15,
  }));
  inset.position.set(0, 0.02, 0.27);
  shieldGroup.add(inset);

  // Lubang kunci
  const keyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.35, roughness: 0.35 });
  const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.08, 40), keyMat);
  knob.rotation.x = Math.PI / 2;
  knob.position.set(0, 0.24, 0.41);
  shieldGroup.add(knob);
  const slotShape = new THREE.Shape();
  slotShape.moveTo(-0.08, 0.12);
  slotShape.lineTo(0.08, 0.12);
  slotShape.lineTo(0.15, -0.5);
  slotShape.lineTo(-0.15, -0.5);
  slotShape.closePath();
  const slot = new THREE.Mesh(new THREE.ExtrudeGeometry(slotShape, { depth: 0.08, bevelEnabled: false }), keyMat);
  slot.position.set(0, 0.18, 0.37);
  shieldGroup.add(slot);

  /* Sfera rangkaian + paket data */
  const net = new THREE.Group();
  root.add(net);
  const ico = new THREE.IcosahedronGeometry(2.3, 1);
  const edges = new THREE.EdgesGeometry(ico);
  net.add(new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x14b8a6, transparent: true, opacity: 0.22 })));

  const seen = new Map();
  const ip = ico.attributes.position;
  for (let i = 0; i < ip.count; i++) {
    const key = `${ip.getX(i).toFixed(3)},${ip.getY(i).toFixed(3)},${ip.getZ(i).toFixed(3)}`;
    if (!seen.has(key)) seen.set(key, [ip.getX(i), ip.getY(i), ip.getZ(i)]);
  }
  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute('position', new THREE.Float32BufferAttribute([...seen.values()].flat(), 3));
  net.add(new THREE.Points(nodeGeo, new THREE.PointsMaterial({
    color: 0x0d9488, size: 0.13, map: DOT, transparent: true, depthWrite: false, opacity: 0.9,
  })));

  const ep = edges.attributes.position;
  const edgeCount = ep.count / 2;
  const PACKETS = 16;
  const packets = Array.from({ length: PACKETS }, () => ({ e: (Math.random() * edgeCount) | 0, t: Math.random(), s: 0.35 + Math.random() * 0.5 }));
  const packetPos = new Float32Array(PACKETS * 3);
  const packetGeo = new THREE.BufferGeometry();
  packetGeo.setAttribute('position', new THREE.BufferAttribute(packetPos, 3));
  net.add(new THREE.Points(packetGeo, new THREE.PointsMaterial({
    color: 0x22d3ee, size: 0.2, map: DOT, transparent: true, depthWrite: false,
  })));

  /* Zarah latar */
  const STARS = 420;
  const starPos = new Float32Array(STARS * 3);
  for (let i = 0; i < STARS; i++) {
    const r = 4.5 + Math.random() * 4.5;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    starPos.set([r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph) * 0.7, r * Math.sin(ph) * Math.sin(th) - 2], i * 3);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
    color: 0x818cf8, size: 0.07, map: DOT, transparent: true, depthWrite: false, opacity: 0.55,
  }));
  scene.add(stars);

  /* Orbit 5 pilar */
  const orbit = new THREE.Group();
  orbit.rotation.set(1.18, 0, -0.28);
  root.add(orbit);
  const R = 3.15;
  const ringPts = new THREE.EllipseCurve(0, 0, R, R).getPoints(180).map(p => new THREE.Vector3(p.x, p.y, 0));
  orbit.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(ringPts),
    new THREE.LineBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.3 })));

  const orbGeo = new THREE.SphereGeometry(0.24, 48, 48);
  // Kawasan sentuhan lebih besar (tidak kelihatan) supaya mudah diketik di smart board
  const hitGeo = new THREE.SphereGeometry(0.5, 12, 12);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitAreas = [];
  const orbs = PILLARS.map((p, i) => {
    const mesh = new THREE.Mesh(orbGeo, new THREE.MeshPhysicalMaterial({
      color: p.color, emissive: p.color, emissiveIntensity: 0.3, metalness: 0.15, roughness: 0.15, clearcoat: 1,
    }));
    mesh.userData = { ...p, base: (i / PILLARS.length) * Math.PI * 2, scale: 1 };
    orbit.add(mesh);
    const hit = new THREE.Mesh(hitGeo, hitMat);
    hit.userData.orb = mesh;
    mesh.add(hit);
    hitAreas.push(hit);
    const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: labelTexture(p.n, p.css), transparent: true, depthWrite: false }));
    label.scale.setScalar(0.38);
    scene.add(label);
    mesh.userData.label = label;
    return mesh;
  });

  /* Tooltip & interaksi */
  const tip = host.querySelector('.hero-3d-tip');
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const mouse = { x: 0, y: 0 };
  let hovered = null;

  function setNdc(e) {
    const r = host.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
  }
  function pick() {
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects(hitAreas, false)[0];
    return hit ? hit.object.userData.orb : null;
  }
  function showTip(orb) {
    if (!tip) return;
    if (!orb) { tip.classList.remove('show'); return; }
    tip.innerHTML = `Pilar ${orb.userData.n}: ${orb.userData.name}<small>Ketik untuk terokai ➜</small>`;
    tip.style.borderColor = orb.userData.css;
    tip.classList.add('show');
  }

  window.addEventListener('pointermove', e => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  host.addEventListener('pointermove', e => {
    setNdc(e);
    const o = pick();
    if (o !== hovered) {
      hovered = o;
      host.style.cursor = o ? 'pointer' : '';
      showTip(o);
    }
  });
  host.addEventListener('pointerleave', () => { hovered = null; host.style.cursor = ''; showTip(null); });
  host.addEventListener('click', e => {
    setNdc(e);
    const o = pick() || hovered;
    if (!o) return;
    const target = document.getElementById(`pilar-${o.userData.n}`);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* Saiz */
  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = camera.aspect < 1.05 ? 10.8 : 9.5;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(host);
  resize();

  /* Gelung animasi (berhenti bila tidak kelihatan / dalam mod slaid) */
  const clock = new THREE.Clock();
  const tmp = new THREE.Vector3();
  const A = new THREE.Vector3(), B = new THREE.Vector3();
  let t = 0, orbitAngle = 0, orbitSpeed = 0.22, running = false, inView = true, first = true;

  function update(dt) {
    t += dt;
    root.rotation.y += ((mouse.x * 0.35 + Math.sin(t * 0.25) * 0.12) - root.rotation.y) * 0.05;
    root.rotation.x += ((mouse.y * 0.18) - root.rotation.x) * 0.05;

    shieldGroup.position.y = Math.sin(t * 1.2) * 0.08;
    shieldGroup.rotation.y = Math.sin(t * 0.6) * 0.28;

    net.rotation.y += dt * 0.08;
    net.rotation.x += dt * 0.025;
    stars.rotation.y += dt * 0.015;

    for (let i = 0; i < PACKETS; i++) {
      const p = packets[i];
      p.t += dt * p.s;
      if (p.t >= 1) { p.t = 0; p.e = (Math.random() * edgeCount) | 0; }
      A.fromBufferAttribute(ep, p.e * 2);
      B.fromBufferAttribute(ep, p.e * 2 + 1);
      A.lerp(B, p.t);
      packetPos.set([A.x, A.y, A.z], i * 3);
    }
    packetGeo.attributes.position.needsUpdate = true;

    orbitSpeed += ((hovered ? 0 : 0.22) - orbitSpeed) * 0.08;
    orbitAngle += orbitSpeed * dt;
    orbs.forEach(o => {
      const a = o.userData.base + orbitAngle;
      o.position.set(Math.cos(a) * R, Math.sin(a) * R, 0);
      o.userData.scale += ((o === hovered ? 1.45 : 1) - o.userData.scale) * 0.15;
      o.scale.setScalar(o.userData.scale);
      o.getWorldPosition(tmp);
      o.userData.label.position.set(tmp.x, tmp.y + 0.42 * o.userData.scale, tmp.z);
    });

    if (hovered && tip) {
      hovered.getWorldPosition(tmp).project(camera);
      tip.style.left = `${(tmp.x + 1) / 2 * host.clientWidth}px`;
      tip.style.top = `${(1 - tmp.y) / 2 * host.clientHeight}px`;
    }
  }

  function frame() {
    if (!running) return;
    update(Math.min(clock.getDelta(), 0.05));
    renderer.render(scene, camera);
    if (first) { first = false; visual.classList.add('has-3d'); }
    requestAnimationFrame(frame);
  }

  function sync() {
    const should = inView && !document.hidden && !document.body.classList.contains('mode-deck');
    if (should && !running) { running = true; clock.getDelta(); requestAnimationFrame(frame); }
    else if (!should) running = false;
  }

  new IntersectionObserver(([en]) => { inView = en.isIntersecting; sync(); }).observe(host);
  document.addEventListener('visibilitychange', sync);
  new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  sync();
}
