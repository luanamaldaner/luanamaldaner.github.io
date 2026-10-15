// 3D molecule viewer (three.js). Takes plain frames from mechanisms.js or a
// PubChem SDF and draws them as ball-and-stick, with orbitals, curved
// arrows, charges and planes. Drag to rotate, wheel or pinch to zoom.

import * as THREE from './three.module.min.js';

const ELEMENTS = {
  H: [0xf4f4ef, 0.24, 1.1], C: [0x56615b, 0.36, 1.7], N: [0x5b7fe0, 0.34, 1.55], O: [0xe0605f, 0.34, 1.52],
  F: [0x8fd6a0, 0.3, 1.47], Cl: [0x58b866, 0.42, 1.75], Br: [0xa4513b, 0.46, 1.85], I: [0x8a4fb0, 0.5, 1.98],
  S: [0xe1c24a, 0.42, 1.8], P: [0xf0a040, 0.42, 1.8], B: [0xf09a76, 0.36, 1.92], Si: [0xd8c0a0, 0.44, 2.1],
  Na: [0xab7fe0, 0.5, 2.27], K: [0x9b6fd0, 0.55, 2.75], Li: [0xcc80ff, 0.4, 1.82], Mg: [0x7fd08a, 0.46, 1.73],
  Pt: [0xd3d7de, 0.5, 1.75], Pd: [0xc0c8d8, 0.6, 1.63], Hg: [0xb6bac6, 0.5, 1.55], Os: [0x6a8fb0, 0.5, 2.0],
};
const DARK_C = 0x9aa79f;
const LOBE = { filled: [0x7cc99a, 0xf0a0bd], empty: [0xb3a8f0, 0xb3a8f0] };
const Y_UP = new THREE.Vector3(0, 1, 0);

const v3 = p => new THREE.Vector3(p[0], p[1], p[2]);

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
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x8a9a90, 1.25));
    const key = new THREE.DirectionalLight(0xffffff, 1.7);
    key.position.set(4, 6, 8);
    this.camera.add(key);
    const rim = new THREE.DirectionalLight(0xffffff, 0.5);
    rim.position.set(-6, -2, 3);
    this.camera.add(rim);

    this.root = new THREE.Group();        // user rotation
    this.mol = new THREE.Group();         // offset so the centre sits at the origin
    this.root.add(this.mol);
    this.scene.add(this.root);
    this.labelLayer = new THREE.Group();  // sprites live in world space
    this.scene.add(this.labelLayer);

    this.geo = {
      sphere: new THREE.SphereGeometry(1, 32, 22),
      lobe: new THREE.SphereGeometry(1, 28, 18),
      cyl: new THREE.CylinderGeometry(1, 1, 1, 18, 1),
      cone: new THREE.ConeGeometry(1, 1, 18),
    };
    this.pools = { atoms: new Map(), bonds: new Map(), lobes: new Map(), labels: new Map(), arrows: new Map(), planes: new Map() };
    this.textures = new Map();
    this.style = 'ball';
    this.dark = false;
    this.dist = 14; this.distTarget = 14; this.zoom = 1;
    this.spin = false;
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
      if (this.onTick) this.onTick(dt);
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
    const goal = this.distTarget * this.zoom;
    if (Math.abs(goal - this.dist) > 1e-3) moving = true;
    this.dist += (goal - this.dist) * Math.min(1, dt * 8);
    this.camera.position.set(0, 0, this.dist);
    this.camera.lookAt(0, 0, 0);
    if (moving) this.placeLabels();
    return moving;
  }

  // ---------------------------------------------------------- camera

  /** Frame a sphere of `radius` around `center` (molecule coordinates). */
  fit(radius, center = [0, 0, 0]) {
    this.fitRadius = radius;
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
    return this.style === 'space' ? e[2] * 0.95 : e[1];
  }

  // ---------------------------------------------------------- frame

  setFrame(f) {
    const pos = new Map(f.atoms.map(a => [a.id, a.p]));
    const seen = { atoms: new Set(), bonds: new Set(), lobes: new Set(), labels: new Set(), arrows: new Set(), planes: new Set() };

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
      m.position.set(a.p[0], a.p[1], a.p[2]);
      this.setOpacity(m.material, op);
      m.visible = true;
      seen.atoms.add(a.id);
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
        this.updateBond(g, pa, pb, b, nbrs, pos);
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
        mesh.position.copy(v3(l.p)).addScaledVector(dir, sign * s * 0.85);
        mesh.quaternion.copy(q);
        mesh.scale.set(s * 0.46, s * 0.86, s * 0.46);
        mesh.material.color.setHex(cols[i]);
        mesh.material.opacity = (l.color === 'empty' ? 0.32 : 0.5) * op;
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
    for (const a of f.arrows) {
      const op = a.opacity ?? 1;
      if (op <= 0.01) continue;
      let g = this.pools.arrows.get(a.id);
      if (!g) {
        const mat = new THREE.MeshBasicMaterial({ transparent: true, depthTest: false });
        g = new THREE.Group();
        g.add(new THREE.Mesh(new THREE.BufferGeometry(), mat), new THREE.Mesh(this.geo.cone, mat));
        g.renderOrder = 5; g.children.forEach(c => { c.renderOrder = 5; });
        this.mol.add(g);
        this.pools.arrows.set(a.id, g);
      }
      this.updateArrow(g, a);
      g.children[0].material.color.setHex(this.dark ? 0xf5b0c9 : 0xc94f7d);
      g.children[0].material.opacity = op;
      g.visible = true;
      seen.arrows.add(a.id);
    }

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
    g.userData.sticks = [mk(), mk()];
    g.userData.dashes = Array.from({ length: 5 }, mk);
    g.add(...g.userData.sticks, ...g.userData.dashes);
    return g;
  }

  updateBond(g, pa, pb, b, nbrs, pos) {
    const A = v3(pa), B = v3(pb);
    const dir = new THREE.Vector3().subVectors(B, A);
    const length = dir.length();
    dir.normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(Y_UP, dir);
    const op = b.opacity ?? 1;
    const color = this.dark ? 0x7d8a80 : 0xc4ccc0;
    const { sticks, dashes } = g.userData;
    const place = (m, from, to, r) => {
      m.position.addVectors(from, to).multiplyScalar(0.5);
      m.quaternion.copy(q);
      m.scale.set(r, from.distanceTo(to), r);
    };
    if (b.partial) {
      sticks.forEach(m => { m.visible = false; });
      dashes.forEach((m, i) => {
        const u0 = (i * 2 + 0.5) / 10, u1 = (i * 2 + 1.5) / 10;
        place(m, A.clone().lerp(B, u0), A.clone().lerp(B, u1), 0.07);
        m.material.color.setHex(this.dark ? 0xf5b0c9 : 0xd4668f);
        this.setOpacity(m.material, 0.9 * op);
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
    place(sticks[0], A.clone().addScaledVector(side, -off), B.clone().addScaledVector(side, -off), r);
    sticks[0].material.color.setHex(color);
    this.setOpacity(sticks[0].material, op);
    sticks[0].visible = true;
    if (extra > 0.01) {
      place(sticks[1], A.clone().addScaledVector(side, off), B.clone().addScaledVector(side, off), r);
      sticks[1].material.color.setHex(color);
      this.setOpacity(sticks[1].material, op * Math.min(1, extra * 1.5));
      sticks[1].visible = true;
    } else sticks[1].visible = false;
  }

  updateArrow(g, a) {
    const key = [...a.from, ...a.to, ...a.bend].map(v => v.toFixed(2)).join(',');
    if (g.userData.key === key) return;
    g.userData.key = key;
    const from = v3(a.from), to = v3(a.to);
    const ctrl = from.clone().add(to).multiplyScalar(0.5).add(v3(a.bend));
    const curve = new THREE.QuadraticBezierCurve3(from, ctrl, to);
    const pts = [];
    for (let i = 0; i <= 24; i++) pts.push(curve.getPoint(i / 24 * 0.86));
    const tube = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 32, 0.045, 8, false);
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
