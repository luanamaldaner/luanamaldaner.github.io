// 3D molecule viewer (three.js). Takes plain frames from mechanisms.js or a
// PubChem SDF and draws them as ball-and-stick, with orbitals, curved
// arrows, charges and planes. Drag to rotate, wheel or pinch to zoom.

import * as THREE from './three.module.min.js';

const ELEMENTS = {
  H: [0xf7f5f0, 0.24, 1.1], C: [0x4d5866, 0.36, 1.7], N: [0x4f7cff, 0.34, 1.55], O: [0xff5d68, 0.34, 1.52],
  F: [0x7fe0a4, 0.3, 1.47], Cl: [0x3fcf72, 0.42, 1.75], Br: [0xc4552f, 0.46, 1.85], I: [0x9a5bd6, 0.5, 1.98],
  S: [0xe1c24a, 0.42, 1.8], P: [0xf0a040, 0.42, 1.8], B: [0xf09a76, 0.36, 1.92], Si: [0xd8c0a0, 0.44, 2.1],
  Na: [0xab7fe0, 0.5, 2.27], K: [0x9b6fd0, 0.55, 2.75], Li: [0xcc80ff, 0.4, 1.82], Mg: [0x7fd08a, 0.46, 1.73],
  Pt: [0xd3d7de, 0.5, 1.75], Pd: [0xc0c8d8, 0.6, 1.63], Hg: [0xb6bac6, 0.5, 1.55], Os: [0x6a8fb0, 0.5, 2.0],
};
const DARK_C = 0x9eabbb;
// Orbital phases: filled orbitals are mint/pink, empty ones a soft violet glow.
const LOBE = { filled: [0x3ddc97, 0xff7eb6], empty: [0xa78bfa, 0xa78bfa] };
// Curved arrows cycle through these so each electron move has its own colour.
const ARROWS = { light: [0xd9467f, 0x7b5cff, 0xe9860f, 0x1fa37a], dark: [0xff8fbc, 0xb3a1ff, 0xffbf66, 0x6ee0b0] };
const ELECTRON = { light: 0xffb020, dark: 0xffd76e };
// Highlight shells: pink = electrophile / bond changing, blue = electron-rich, amber = proton on the move.
const HALO = { pink: [0xff5c9a, 0xff8fbc], blue: [0x4a7dff, 0x8fb0ff], amber: [0xffa31a, 0xffc766], violet: [0x8b5cf6, 0xb8a2ff] };


const Y_UP = new THREE.Vector3(0, 1, 0);

const v3 = p => new THREE.Vector3(p[0], p[1], p[2]);

/**
 * One lobe of a p orbital: a teardrop of length 1 along +Y with its point at
 * the nucleus (origin) and a round bulb at the far end.
 */
function pLobeGeometry() {
  const pts = [];
  const n = 40;
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI;
    const y = (1 - Math.cos(t)) / 2;                       // 0 at the nucleus → 1 at the tip
    const r = 0.5 * Math.sin(t) * Math.pow(y, 0.45);       // thin near the nucleus, fat bulb outward
    pts.push(new THREE.Vector2(Math.max(r, 1e-4), y));
  }
  const geo = new THREE.LatheGeometry(pts, 36);
  geo.computeVertexNormals();
  return geo;
}

export class Viewer {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'viewer-canvas';
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(32, 1, 0.1, 400);
    this.scene.add(this.camera);
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x8a9a90, 1.15));
    const key = new THREE.DirectionalLight(0xffffff, 1.8);
    key.position.set(4, 6, 8);
    this.camera.add(key);
    const rim = new THREE.DirectionalLight(0xffffff, 0.5);
    rim.position.set(-6, -2, 3);
    this.camera.add(rim);
    const rim2 = new THREE.DirectionalLight(0xffffff, 0.25);
    rim2.position.set(6, -4, -2);
    this.camera.add(rim2);

    this.root = new THREE.Group();        // user rotation
    this.swayG = new THREE.Group();       // cinematic camera turn while a reaction plays
    this.mol = new THREE.Group();         // offset so the centre sits at the origin
    this.root.add(this.swayG);
    this.swayG.add(this.mol);
    this.scene.add(this.root);
    this.labelLayer = new THREE.Group();  // sprites live in world space
    this.scene.add(this.labelLayer);
    this.makeMotes();

    this.geo = {
      sphere: new THREE.SphereGeometry(1, 40, 28),
      dot: new THREE.SphereGeometry(1, 14, 10),
      lobe: pLobeGeometry(),
      cyl: new THREE.CylinderGeometry(1, 1, 1, 18, 1),
      cone: new THREE.ConeGeometry(1, 1, 18),
    };
    this.pools = { atoms: new Map(), bonds: new Map(), lobes: new Map(), labels: new Map(), arrows: new Map(), planes: new Map(), halos: new Map() };
    this.textures = new Map();
    this.style = 'ball';
    this.dark = false;
    this.dist = 14; this.distTarget = 14; this.zoom = 1;
    this.spin = false;
    this.live = true;                     // flowing electrons, shimmering bonds
    this.cam = null;                      // { yaw, pitch, zoom } the camera glides toward while a reaction plays
    this.camNow = { yaw: 0, pitch: 0, zoom: 1 };
    this.center = [0, 0, 0];
    this.autoFrame = false;               // keep every visible atom on screen
    this.frameZoom = 1;
    this.focusGoal = null;                // molecule point the camera follows (null = whole molecule)
    this.focusNow = [0, 0, 0];
    this.time = 0;
    this.frame = null;
    this.tween = null;
    this.onTick = null;
    this.running = false;
    this.last = 0;
    this.home = new THREE.Quaternion();
    this.dirty = true;
    this.bindInput();
  }

  // ---------------------------------------------------------- lifecycle

  mount(host) {
    if (this.canvas.parentNode !== host) host.prepend(this.canvas);
    if (this.ro) this.ro.disconnect();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(host);
    this.host = host;
    this.resize();
    this.start();
  }

  resize() {
    if (!this.host) return;
    const w = this.host.clientWidth, h = this.host.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.applyDistance();
    this.dirty = true;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    const loop = now => {
      if (!this.canvas.isConnected) { this.running = false; return; }
      this.raf = requestAnimationFrame(loop);
      const dt = Math.min(0.1, (now - this.last) / 1000);
      this.last = now;
      this.time += dt;
      if (this.onTick) this.onTick(dt);
      // electrons flow along the arrows, so a shown frame is redrawn every tick
      if (this.live && this.frame && this.setAt !== this.time && !document.hidden) this.setFrame(this.frame);
      // only draw when something changed, to save battery
      if (this.step(dt) || this.dirty) { this.renderer.render(this.scene, this.camera); this.dirty = false; }
    };
    this.raf = requestAnimationFrame(loop);
  }

  step(dt) {
    let moving = false;
    if (this.tween) {
      moving = true;
      this.tween.k = Math.min(1, this.tween.k + dt / 0.6);
      const e = this.tween.k * this.tween.k * (3 - 2 * this.tween.k);
      this.root.quaternion.slerpQuaternions(this.tween.from, this.tween.to, e);
      if (this.tween.k >= 1) this.tween = null;
    } else if (this.spin && !this.dragging) {
      this.root.quaternion.premultiply(new THREE.Quaternion().setFromAxisAngle(Y_UP, dt * 0.35));
      moving = true;
    }
    this.driftMotes();
    if (this.motes.visible) moving = true;
    // cinematic camera: the view turns and leans in as the reaction progresses
    const goalCam = this.cam || { yaw: 0, pitch: 0, zoom: 1 };
    const c = this.camNow, kk = Math.min(1, dt * 2.2);
    let camMoving = false;
    for (const key of ['yaw', 'pitch', 'zoom']) {
      const d = goalCam[key] - c[key];
      if (Math.abs(d) > 1e-4) { c[key] += d * kk; camMoving = true; }
    }
    if (camMoving) { this.swayG.rotation.set(c.pitch, c.yaw, 0); moving = true; }
    // glide toward whatever is reacting, so the camera orbits around the action
    const fg = this.focusGoal || this.center, fn = this.focusNow, kf = Math.min(1, dt * 1.8);
    if (Math.hypot(fg[0] - fn[0], fg[1] - fn[1], fg[2] - fn[2]) > 1e-3) {
      for (let i = 0; i < 3; i++) fn[i] += (fg[i] - fn[i]) * kf;
      this.mol.position.set(-fn[0], -fn[1], -fn[2]);
      moving = true;
    }
    if (this.autoFrame) {
      const k = this.frameNeed();
      if (k && Math.abs(k - 1) > 0.01) {
        // back out quickly when something is leaving the frame, ease in slowly
        const rate = k > 1 ? 5 : 1.6;
        this.frameZoom = Math.min(3, Math.max(0.45, this.frameZoom * (1 + (k - 1) * Math.min(1, dt * rate))));
        moving = true;
      }
    } else if (this.frameZoom !== 1) { this.frameZoom = 1; moving = true; }
    const goal = this.distTarget * this.zoom * c.zoom * this.frameZoom;
    if (Math.abs(goal - this.dist) > 1e-3) moving = true;
    this.dist += (goal - this.dist) * Math.min(1, dt * 8);
    this.camera.position.set(0, 0, this.dist);
    this.camera.lookAt(0, 0, 0);
    if (moving) this.placeLabels();
    return moving;
  }

  /** How much farther (>1) or closer (<1) the camera should be so all visible atoms fit. */
  frameNeed() {
    this.root.updateMatrixWorld();
    const v = new THREE.Vector3(), r = new THREE.Vector3();
    let ex = 0, ey = 0, n = 0;
    for (const [, m] of this.pools.atoms) {
      if (!m.visible || (m.material.opacity ?? 1) < 0.3) continue;
      m.getWorldPosition(v);
      const rad = m.scale.x;
      v.project(this.camera);
      // pad by the atom's own radius, roughly in screen units
      r.set(rad, 0, 0);
      const pad = rad / Math.max(0.5, this.dist) * 2.4;
      ex = Math.max(ex, Math.abs(v.x) + pad / this.camera.aspect);
      ey = Math.max(ey, Math.abs(v.y) + pad);
      n++;
    }
    if (!n) return 0;
    // leave room for the caption at the top and the hint at the bottom
    return Math.max(ex / 0.8, ey / 0.68);
  }

  /** Soft specks drifting behind the molecule, like solvent jostling around it. */
  makeMotes() {
    const n = 64;
    const base = new Float32Array(n * 3), pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
    const palette = [0xff8fbc, 0xa78bfa, 0x6ee0b0, 0xffc76b, 0x7fb4ff].map(c => new THREE.Color(c));
    let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    for (let i = 0; i < n; i++) {
      base[i * 3] = (rnd() - 0.5) * 22; base[i * 3 + 1] = (rnd() - 0.5) * 14; base[i * 3 + 2] = -9 + rnd() * 11;
      const c = palette[i % palette.length];
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    pos.set(base);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const cv = document.createElement('canvas'); cv.width = cv.height = 64;
    const g = cv.getContext('2d');
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)'); grad.addColorStop(0.4, 'rgba(255,255,255,0.55)'); grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad; g.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(cv);
    this.motes = new THREE.Points(geo, new THREE.PointsMaterial({
      size: 0.55, map: tex, vertexColors: true, transparent: true, opacity: 0.45, depthWrite: false, sizeAttenuation: true,
    }));
    this.motes.userData.base = base;
    this.motes.renderOrder = -1;
    this.scene.add(this.motes);
  }

  driftMotes() {
    const m = this.motes;
    m.visible = this.live && this.showMotes !== false;
    if (!m.visible) return;
    const b = m.userData.base, a = m.geometry.attributes.position.array, T = this.time;
    for (let i = 0; i < a.length; i += 3) {
      const ph = i * 0.77;
      a[i] = b[i] + 0.9 * Math.sin(T * 0.23 + ph);
      a[i + 1] = b[i + 1] + 0.7 * Math.sin(T * 0.19 + ph * 1.3) + 0.25 * Math.sin(T * 0.9 + ph);
      a[i + 2] = b[i + 2] + 0.5 * Math.sin(T * 0.17 + ph * 0.7);
    }
    m.geometry.attributes.position.needsUpdate = true;
    m.material.opacity = this.dark ? 0.2 : 0.28;
  }

  // ---------------------------------------------------------- camera

  /** Frame a sphere of `radius` around `center` (molecule coordinates). */
  fit(radius, center = [0, 0, 0]) {
    this.fitRadius = radius;
    this.center = center.slice();
    this.focusNow = center.slice();
    this.focusGoal = null;
    this.mol.position.set(-center[0], -center[1], -center[2]);
    this.zoom = 1;
    this.applyDistance(true);
  }

  applyDistance(snap) {
    const r = this.fitRadius || 5;
    const vfov = this.camera.fov * Math.PI / 180;
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * this.camera.aspect);
    this.distTarget = r / Math.sin(Math.min(vfov, hfov) / 2);
    if (snap) this.dist = this.distTarget;
  }

  /** Rotate to Euler angles (degrees): rx tilts toward you, ry turns. */
  setView(rx, ry, animate = true) {
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(rx * Math.PI / 180, ry * Math.PI / 180, 0, 'XYZ'));
    this.home.copy(q);
    if (!animate) { this.root.quaternion.copy(q); this.tween = null; this.dirty = true; return; }
    this.tween = { from: this.root.quaternion.clone(), to: q, k: 0 };
  }

  resetView() {
    this.zoom = 1;
    this.tween = { from: this.root.quaternion.clone(), to: this.home.clone(), k: 0 };
  }

  bindInput() {
    const c = this.canvas;
    const ptrs = new Map();
    let pinch = 0;
    c.addEventListener('pointerdown', e => {
      c.setPointerCapture(e.pointerId);
      ptrs.set(e.pointerId, [e.clientX, e.clientY]);
      this.dragging = true; this.tween = null;
      if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = Math.hypot(a[0] - b[0], a[1] - b[1]); }
    });
    c.addEventListener('pointermove', e => {
      if (!ptrs.has(e.pointerId)) return;
      const prev = ptrs.get(e.pointerId);
      ptrs.set(e.pointerId, [e.clientX, e.clientY]);
      if (ptrs.size === 1) {
        const dx = e.clientX - prev[0], dy = e.clientY - prev[1];
        const qy = new THREE.Quaternion().setFromAxisAngle(Y_UP, dx * 0.009);
        const qx = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), dy * 0.009);
        this.root.quaternion.premultiply(qy).premultiply(qx);
        this.placeLabels(); this.dirty = true;
      } else if (ptrs.size === 2) {
        const [a, b] = [...ptrs.values()];
        const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
        if (pinch) this.zoom = Math.min(2.5, Math.max(0.35, this.zoom * pinch / d));
        pinch = d;
      }
    });
    const up = e => { ptrs.delete(e.pointerId); if (!ptrs.size) this.dragging = false; pinch = 0; };
    c.addEventListener('pointerup', up);
    c.addEventListener('pointercancel', up);
    c.addEventListener('wheel', e => {
      e.preventDefault();
      this.zoom = Math.min(2.5, Math.max(0.35, this.zoom * Math.exp(e.deltaY * 0.0012)));
    }, { passive: false });
    c.addEventListener('dblclick', () => this.resetView());
  }

  // ---------------------------------------------------------- look

  setStyle(style) { this.style = style; }

  setDark(dark) {
    if (this.dark === dark) return;
    this.dark = dark;
    for (const [, a] of this.pools.atoms) a.userData.el = null; // force recolour
    for (const [, l] of this.pools.labels) l.userData.key = null;
  }

  atomColor(el) {
    if (el === 'C' && this.dark) return DARK_C;
    return (ELEMENTS[el] || [0xb0b0b0])[0];
  }

  atomRadius(el) {
    const e = ELEMENTS[el] || [0, 0.4, 1.7];
    return this.style === 'space' ? e[2] * 0.95 : e[1] * 1.12;
  }

  // ---------------------------------------------------------- frame

  setFrame(f) {
    this.frame = f; this.setAt = this.time;
    const T = this.time;
    const pos = new Map(f.atoms.map(a => [a.id, a.p]));
    const elOf = new Map(f.atoms.map(a => [a.id, a.el]));
    const seen = { atoms: new Set(), bonds: new Set(), lobes: new Set(), labels: new Set(), arrows: new Set(), planes: new Set(), halos: new Set() };

    // atoms
    for (const a of f.atoms) {
      const op = a.opacity ?? 1;
      if (op <= 0.01) continue;
      let m = this.pools.atoms.get(a.id);
      if (!m) {
        m = new THREE.Mesh(this.geo.sphere, new THREE.MeshStandardMaterial({ roughness: 0.42, metalness: 0.04 }));
        this.mol.add(m);
        this.pools.atoms.set(a.id, m);
      }
      if (m.userData.el !== a.el || m.userData.style !== this.style) {
        m.material.color.setHex(this.atomColor(a.el));
        if (a.el === 'Pt' || a.el === 'Pd') { m.material.metalness = 0.55; m.material.roughness = 0.3; }
        m.userData.el = a.el; m.userData.style = this.style;
      }
      m.scale.setScalar(this.atomRadius(a.el));
      const p = pos.get(a.id);
      m.position.set(p[0], p[1], p[2]);
      this.setOpacity(m.material, op);
      m.visible = true;
      seen.atoms.add(a.id);
    }

    // highlights: a soft glowing shell around the atoms that matter right now
    for (const hl of f.highlights || []) {
      const p = pos.get(hl.atom);
      const op = hl.opacity ?? 1;
      if (!p || op <= 0.01) continue;
      const key = `${hl.atom}|${hl.color}`;
      let m = this.pools.halos.get(key);
      if (!m) {
        m = new THREE.Mesh(this.geo.sphere, new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, side: THREE.BackSide }));
        m.renderOrder = 0;
        this.mol.add(m);
        this.pools.halos.set(key, m);
      }
      const pal = HALO[hl.color] || HALO.pink;
      m.material.color.setHex(pal[this.dark ? 1 : 0]);
      m.material.opacity = op * (0.34 + 0.1 * Math.sin(T * 3.2));
      m.position.set(p[0], p[1], p[2]);
      m.scale.setScalar(this.atomRadius(elOf.get(hl.atom) || 'C') * 1.45 + 0.07);
      m.visible = true;
      seen.halos.add(key);
    }

    // bonds (hidden in space-filling mode)
    if (this.style !== 'space') {
      const nbrs = new Map();
      for (const b of f.bonds) {
        if (!nbrs.has(b.a)) nbrs.set(b.a, []);
        if (!nbrs.has(b.b)) nbrs.set(b.b, []);
        nbrs.get(b.a).push(b.b); nbrs.get(b.b).push(b.a);
      }
      for (const b of f.bonds) {
        const pa = pos.get(b.a), pb = pos.get(b.b);
        if (!pa || !pb) continue;
        const key = `${b.a}|${b.b}`;
        let g = this.pools.bonds.get(key);
        if (!g) { g = this.makeBond(); this.mol.add(g); this.pools.bonds.set(key, g); }
        this.updateBond(g, pa, pb, b, nbrs, pos, elOf);
        g.visible = true;
        seen.bonds.add(key);
      }
    }

    // orbitals
    for (const l of f.lobes) {
      const op = l.opacity ?? 1;
      if (op <= 0.01) continue;
      let g = this.pools.lobes.get(l.id);
      if (!g) {
        g = new THREE.Group();
        for (let i = 0; i < 2; i++) {
          g.add(new THREE.Mesh(this.geo.lobe, new THREE.MeshStandardMaterial({ transparent: true, depthWrite: false, roughness: 0.6, side: THREE.DoubleSide })));
        }
        this.mol.add(g);
        this.pools.lobes.set(l.id, g);
      }
      const s = l.size || 0.8;
      const dir = v3(l.dir).normalize();
      const q = new THREE.Quaternion().setFromUnitVectors(Y_UP, dir);
      const cols = LOBE[l.color] || LOBE.filled;
      g.children.forEach((mesh, i) => {
        const single = l.kind === 'lobe';
        mesh.visible = !(single && i === 1);
        const sign = i === 0 ? 1 : -1;
        // teardrop lobes: pinched at the nucleus, round at the far end
        mesh.position.copy(v3(l.p));
        mesh.quaternion.copy(sign > 0 ? q : new THREE.Quaternion().setFromUnitVectors(Y_UP, dir.clone().negate()));
        const breathe = l.color === 'empty' ? 1 + 0.05 * Math.sin(T * 2.6) : 1;
        mesh.scale.set(s * 0.95 * breathe, s * 1.8 * breathe, s * 0.95 * breathe);
        mesh.material.color.setHex(cols[i]);
        mesh.material.emissive.setHex(cols[i]);
        mesh.material.emissiveIntensity = this.dark ? 0.45 : 0.22;
        mesh.material.opacity = (l.color === 'empty' ? 0.36 + 0.06 * Math.sin(T * 2.6) : 0.52) * op;
        mesh.renderOrder = 2;
      });
      g.visible = true;
      seen.lobes.add(l.id);
    }

    // planes
    for (const p of f.planes) {
      const op = p.opacity ?? 0.2;
      if (op <= 0.01) continue;
      let m = this.pools.planes.get(p.id);
      if (!m) {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(12), 3));
        geo.setIndex([0, 1, 2, 0, 2, 3]);
        m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide, depthWrite: false }));
        m.renderOrder = 1;
        this.mol.add(m);
        this.pools.planes.set(p.id, m);
      }
      const arr = m.geometry.attributes.position.array;
      p.corners.forEach((c, i) => { arr[i * 3] = c[0]; arr[i * 3 + 1] = c[1]; arr[i * 3 + 2] = c[2]; });
      m.geometry.attributes.position.needsUpdate = true;
      m.geometry.computeBoundingSphere();
      m.material.color.setHex(p.color === 'metal' ? (this.dark ? 0x56606a : 0xb9c0c8) : (this.dark ? 0xf2a3c0 : 0xd4668f));
      m.material.opacity = op;
      m.visible = true;
      seen.planes.add(p.id);
    }

    // curved arrows
    f.arrows.forEach((a, idx) => {
      const op = a.opacity ?? 1;
      if (op <= 0.01) return;
      let g = this.pools.arrows.get(a.id);
      if (!g) {
        const mat = new THREE.MeshBasicMaterial({ transparent: true, depthTest: false });
        const eMat = new THREE.MeshBasicMaterial({ transparent: true, depthTest: false });
        g = new THREE.Group();
        g.add(new THREE.Mesh(new THREE.BufferGeometry(), mat), new THREE.Mesh(this.geo.cone, mat),
          new THREE.Mesh(this.geo.dot, eMat), new THREE.Mesh(this.geo.dot, eMat));
        g.renderOrder = 5; g.children.forEach(c => { c.renderOrder = 5; });
        g.visible = false;
        this.mol.add(g);
        this.pools.arrows.set(a.id, g);
      }
      // the arrow draws itself in as it appears, then stays whole while it fades
      if (!g.visible) g.userData.grow = 0;
      g.userData.grow = Math.max(g.userData.grow || 0, Math.min(1, op * 1.15));
      this.updateArrow(g, a, g.userData.grow);
      const pal = ARROWS[this.dark ? 'dark' : 'light'];
      g.children[0].material.color.setHex(pal[idx % pal.length]);
      g.children[0].material.opacity = op;
      g.children[1].visible = g.userData.grow > 0.9;
      // an electron pair flowing along the arrow
      const curve = g.userData.curve;
      const showE = this.live && curve && g.userData.grow > 0.95;
      [2, 3].forEach((ci, k) => {
        const e = g.children[ci];
        e.visible = !!showE;
        if (!showE) return;
        const u = (T * 0.55 + idx * 0.21) % 1;
        const pt = curve.getPoint(u * 0.86);
        const side = new THREE.Vector3().crossVectors(curve.getTangent(Math.min(0.99, u * 0.86)), new THREE.Vector3(0, 0, 1));
        if (side.lengthSq() < 1e-6) side.set(1, 0, 0);
        side.normalize();
        e.position.copy(pt).addScaledVector(side, (k ? 1 : -1) * 0.09);
        e.scale.setScalar(0.08);
        e.material.color.setHex(ELECTRON[this.dark ? 'dark' : 'light']);
        e.material.opacity = op * Math.sin(Math.PI * u);
      });
      g.visible = true;
      seen.arrows.add(a.id);
    });

    // charges and other labels (sprites in world space, positioned each frame)
    this.labelData = [];
    for (const l of f.labels) {
      const op = l.opacity ?? 1;
      if (op <= 0.01) continue;
      const anchor = l.atom ? pos.get(l.atom) : l.p;
      if (!anchor) continue;
      let sp = this.pools.labels.get(l.id);
      if (!sp) {
        sp = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthTest: false }));
        sp.renderOrder = 10;
        this.labelLayer.add(sp);
        this.pools.labels.set(l.id, sp);
      }
      const key = `${l.kind}|${l.text}|${this.dark}`;
      if (sp.userData.key !== key) {
        const tex = this.texture(l.text, l.kind);
        sp.material.map = tex.tex; sp.material.needsUpdate = true;
        sp.userData.key = key; sp.userData.aspect = tex.aspect;
      }
      const h = l.kind === 'charge' ? (l.text.length > 1 ? 0.5 : 0.46) : 0.5;
      sp.scale.set(h * sp.userData.aspect, h, 1);
      sp.material.opacity = op;
      sp.visible = true;
      this.labelData.push({ sp, anchor, atom: !!l.atom, el: l.atom ? (f.atoms.find(x => x.id === l.atom) || {}).el : null });
      seen.labels.add(l.id);
    }

    for (const [k, pool] of Object.entries(this.pools)) {
      for (const [id, obj] of pool) if (!seen[k].has(id)) obj.visible = false;
    }
    this.placeLabels();
    this.dirty = true;
  }

  setOpacity(mat, op) {
    const t = op < 0.999;
    if (mat.transparent !== t) { mat.transparent = t; mat.needsUpdate = true; }
    mat.opacity = op;
    mat.depthWrite = !t || op > 0.6;
  }

  makeBond() {
    const g = new THREE.Group();
    const mk = () => new THREE.Mesh(this.geo.cyl, new THREE.MeshStandardMaterial({ roughness: 0.5, transparent: true }));
    // each stick is two halves, coloured like the atom at that end
    g.userData.sticks = [mk(), mk()];
    g.userData.halves = [mk(), mk()];
    g.userData.dashes = Array.from({ length: 5 }, mk);
    g.add(...g.userData.sticks, ...g.userData.halves, ...g.userData.dashes);
    return g;
  }

  bondColor(el) {
    const base = new THREE.Color(this.atomColor(el));
    // a touch lighter than the atom so the sticks read as bonds, not atoms
    return base.lerp(new THREE.Color(this.dark ? 0x1a2520 : 0xffffff), el === 'H' ? 0.1 : 0.28);
  }

  updateBond(g, pa, pb, b, nbrs, pos, elOf) {
    const A = v3(pa), B = v3(pb);
    const dir = new THREE.Vector3().subVectors(B, A);
    const length = dir.length();
    dir.normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(Y_UP, dir);
    const op = b.opacity ?? 1;
    const ca = this.bondColor(elOf.get(b.a) || 'C'), cb = this.bondColor(elOf.get(b.b) || 'C');
    const { sticks, halves, dashes } = g.userData;
    const place = (m, from, to, r) => {
      m.position.addVectors(from, to).multiplyScalar(0.5);
      m.quaternion.copy(q);
      m.scale.set(r, from.distanceTo(to), r);
    };
    if (b.partial) {
      sticks.forEach(m => { m.visible = false; });
      halves.forEach(m => { m.visible = false; });
      // a shimmer runs along the half-made (or half-broken) bond
      dashes.forEach((m, i) => {
        const u0 = (i * 2 + 0.5) / 10, u1 = (i * 2 + 1.5) / 10;
        const wave = Math.sin(this.time * 6 - i * 0.9);
        place(m, A.clone().lerp(B, u0), A.clone().lerp(B, u1), 0.075);
        m.material.color.setHex(this.dark ? 0xffa6cc : 0xd94f86);
        m.material.emissive.setHex(this.dark ? 0xff7eb6 : 0xff9cc6);
        m.material.emissiveIntensity = 0.35 + 0.35 * wave;
        this.setOpacity(m.material, (0.7 + 0.3 * wave) * op);
        m.visible = true;
      });
      return;
    }
    dashes.forEach(m => { m.visible = false; });
    const order = Math.max(1, Math.min(2, b.order || 1));
    const extra = order - 1;
    let side = new THREE.Vector3();
    if (extra > 0.01) {
      // offset the second stick in the plane of a neighbouring atom
      const n = (nbrs.get(b.a) || []).find(x => x !== b.b) || (nbrs.get(b.b) || []).find(x => x !== b.a);
      if (n && pos.get(n)) {
        const ref = v3(pos.get(n)).sub(A);
        side = ref.sub(dir.clone().multiplyScalar(ref.dot(dir)));
      }
      if (side.lengthSq() < 1e-6) side = new THREE.Vector3(0, 0, 1).cross(dir);
      if (side.lengthSq() < 1e-6) side = new THREE.Vector3(1, 0, 0).cross(dir);
      side.normalize();
    }
    const off = 0.12 * extra;
    const r = 0.095 - 0.03 * extra;
    // stick k runs A→midpoint (atom A's colour), half k runs midpoint→B (atom B's colour)
    const line = (k, s, opac) => {
      const a0 = A.clone().addScaledVector(side, s), b0 = B.clone().addScaledVector(side, s), m0 = a0.clone().lerp(b0, 0.5);
      place(sticks[k], a0, m0, r); place(halves[k], m0, b0, r);
      sticks[k].material.color.copy(ca); halves[k].material.color.copy(cb);
      this.setOpacity(sticks[k].material, opac); this.setOpacity(halves[k].material, opac);
      sticks[k].visible = halves[k].visible = true;
    };
    line(0, -off, op);
    if (extra > 0.01) line(1, off, op * Math.min(1, extra * 1.5));
    else sticks[1].visible = halves[1].visible = false;
  }

  updateArrow(g, a, grow = 1) {
    const gq = Math.max(0.05, Math.round(grow * 40) / 40);
    const key = [...a.from, ...a.to, ...a.bend].map(v => v.toFixed(2)).join(',') + '|' + gq;
    if (g.userData.key === key) return;
    g.userData.key = key;
    const from = v3(a.from), to = v3(a.to);
    const ctrl = from.clone().add(to).multiplyScalar(0.5).add(v3(a.bend));
    const curve = new THREE.QuadraticBezierCurve3(from, ctrl, to);
    g.userData.curve = curve;
    const pts = [];
    for (let i = 0; i <= 24; i++) pts.push(curve.getPoint(i / 24 * 0.86 * gq));
    const tube = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 32, 0.05, 8, false);
    const [shaft, head] = g.children;
    shaft.geometry.dispose();
    shaft.geometry = tube;
    const tan = curve.getTangent(0.97).normalize();
    head.position.copy(to).addScaledVector(tan, -0.15);
    head.quaternion.setFromUnitVectors(Y_UP, tan);
    head.scale.set(0.13, 0.32, 0.13);
  }

  /** Charges float up and to the right of their atom, whatever the rotation. */
  placeLabels() {
    if (!this.labelData) return;
    this.root.updateMatrixWorld();
    const right = new THREE.Vector3(1, 0, 0), up = new THREE.Vector3(0, 1, 0);
    for (const d of this.labelData) {
      const p = v3(d.anchor);
      this.mol.localToWorld(p);
      if (d.atom) {
        const r = this.atomRadius(d.el || 'C') + 0.22;
        p.addScaledVector(right, r * 0.75).addScaledVector(up, r * 0.75);
        p.z += 0.6;
      }
      d.sp.position.copy(p);
    }
  }

  texture(text, kind) {
    const key = `${kind}|${text}|${this.dark}`;
    if (this.textures.has(key)) return this.textures.get(key);
    const cv = document.createElement('canvas');
    const g = cv.getContext('2d');
    const fs = 72;
    g.font = `600 ${fs}px system-ui, -apple-system, "Segoe UI", sans-serif`;
    const w = Math.max(fs * 1.15, g.measureText(text).width + fs * 0.7);
    cv.width = Math.ceil(w); cv.height = Math.ceil(fs * 1.25);
    g.font = `600 ${fs}px system-ui, -apple-system, "Segoe UI", sans-serif`;
    const minus = text.includes('−') || text.includes('δ−');
    const fill = minus ? (this.dark ? '#6e8cff' : '#3d5fd6') : (this.dark ? '#f29ab9' : '#c2527c');
    const r = cv.height / 2;
    g.fillStyle = this.dark ? 'rgba(24,34,28,0.92)' : 'rgba(255,254,250,0.94)';
    g.strokeStyle = fill; g.lineWidth = 5;
    g.beginPath();
    g.roundRect ? g.roundRect(3, 3, cv.width - 6, cv.height - 6, r - 3) : g.rect(3, 3, cv.width - 6, cv.height - 6);
    g.fill(); g.stroke();
    g.fillStyle = fill;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(text, cv.width / 2, cv.height / 2 + fs * 0.04);
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    const out = { tex, aspect: cv.width / cv.height };
    this.textures.set(key, out);
    return out;
  }
}

// ---------------------------------------------------------------- SDF

/** Parse a V2000 molfile/SDF (PubChem 3D) into a viewer frame. */
export function parseSdf(text) {
  const L = text.split(/\r?\n/);
  const na = parseInt(L[3].slice(0, 3), 10), nb = parseInt(L[3].slice(3, 6), 10);
  if (!(na > 0)) throw new Error('No atoms in that structure.');
  const atoms = [];
  for (let i = 0; i < na; i++) {
    const l = L[4 + i];
    atoms.push({ id: `a${i}`, el: l.slice(31, 34).trim(), p: [parseFloat(l.slice(0, 10)), parseFloat(l.slice(10, 20)), parseFloat(l.slice(20, 30))] });
  }
  const bonds = [];
  for (let i = 0; i < nb; i++) {
    const l = L[4 + na + i];
    const a = parseInt(l.slice(0, 3), 10) - 1, b = parseInt(l.slice(3, 6), 10) - 1, o = parseInt(l.slice(6, 9), 10);
    bonds.push({ a: `a${a}`, b: `a${b}`, order: o === 2 ? 2 : o === 3 ? 2 : 1, triple: o === 3 });
  }
  // centre and size
  const c = [0, 1, 2].map(k => atoms.reduce((s, a) => s + a.p[k], 0) / atoms.length);
  const radius = Math.max(...atoms.map(a => Math.hypot(a.p[0] - c[0], a.p[1] - c[1], a.p[2] - c[2]))) + 1.2;
  return { atoms, bonds, lobes: [], labels: [], arrows: [], planes: [], captions: [], center: c, radius };
}
