// Small 3D geometry kit for building molecules frame by frame.
// Vectors are plain [x, y, z] arrays; distances are in ångströms.

export const TET = 109.47;
export const DEG = Math.PI / 180;

export const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const len = a => Math.hypot(a[0], a[1], a[2]);
export const norm = a => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
export const lerp = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
export const at = (p, dir, d) => add(p, mul(dir, d));
export const mid = (a, b) => lerp(a, b, 0.5);

/** 0 before a, 1 after b, smooth in between. */
export function ease(t, a, b) {
  if (t <= a) return 0;
  if (t >= b) return 1;
  const x = (t - a) / (b - a);
  return x * x * (3 - 2 * x);
}

/** Smoothly interpolate through [[t, value], ...] keyframes (numbers or vectors). */
export function keys(t, list) {
  if (t <= list[0][0]) return list[0][1];
  for (let i = 1; i < list.length; i++) {
    const [t1, v1] = list[i];
    if (t <= t1) {
      const [t0, v0] = list[i - 1];
      const k = ease(t, t0, t1);
      return Array.isArray(v0) ? lerp(v0, v1, k) : v0 + (v1 - v0) * k;
    }
  }
  return list[list.length - 1][1];
}

/** Visible between a and b, fading over f at each end. */
export function window01(t, a, b, f = 0.04) {
  if (t < a - f || t > b + f) return 0;
  return Math.min(ease(t, a - f, a), 1 - ease(t, b, b + f));
}

/** Component of v perpendicular to unit axis a, normalised. */
export function perpTo(v, a) {
  return norm(sub(v, mul(a, dot(v, a))));
}

/** Rodrigues rotation of v about unit axis k. */
export function rotate(v, k, ang) {
  const c = Math.cos(ang), s = Math.sin(ang);
  return add(add(mul(v, c), mul(cross(k, v), s)), mul(k, dot(k, v) * (1 - c)));
}

/**
 * Direction at polar angle theta (deg) from unit axis a, azimuth phi (deg)
 * measured from reference e1 (perpendicular to a) towards a × e1.
 */
export function polar(a, e1, theta, phi) {
  const e2 = cross(a, e1);
  const st = Math.sin(theta * DEG);
  return norm(add(mul(a, Math.cos(theta * DEG)),
    add(mul(e1, st * Math.cos(phi * DEG)), mul(e2, st * Math.sin(phi * DEG)))));
}

/**
 * The three tetrahedral directions on an atom whose fourth bond points along
 * `back`. The first one lies in the plane of back and ref.
 */
export function tetra(back, ref, theta = TET) {
  const e1 = perpTo(ref, back);
  return [0, 120, 240].map(phi => polar(back, e1, theta, phi));
}

// ---------------------------------------------------------------- builder

/** Accumulates atoms, bonds and decorations for one animation frame. */
export class Frame {
  constructor() {
    this.atoms = []; this.bonds = []; this.lobes = []; this.labels = [];
    this.arrows = []; this.planes = []; this.captions = []; this.pos = new Map();
  }
  atom(id, el, p, extra = {}) {
    this.atoms.push({ id, el, p, ...extra });
    this.pos.set(id, p);
    return p;
  }
  bond(a, b, order = 1, extra = {}) {
    if (order > 0) this.bonds.push({ a, b, order, ...extra });
  }
  p(id) { return this.pos.get(id); }
  lobe(id, p, dir, extra = {}) { this.lobes.push({ id, p, dir, ...extra }); }
  label(id, p, text, kind = 'name', extra = {}) { this.labels.push({ id, p, text, kind, ...extra }); }
  arrow(id, from, to, bend, extra = {}) { this.arrows.push({ id, from, to, bend, ...extra }); }
  plane(id, corners, extra = {}) { this.planes.push({ id, corners, ...extra }); }
  caption(text, opacity = 1, kind = '') { if (opacity > 0.01) this.captions.push({ text, opacity, kind }); }
  charge(id, atomId, text, opacity = 1) { if (opacity > 0.01) this.labels.push({ id, atom: atomId, text, kind: 'charge', opacity }); }

  /** Fade a set of atoms (and bonds touching them). */
  fade(ids, opacity) {
    const set = new Set(ids);
    for (const a of this.atoms) if (set.has(a.id)) a.opacity = Math.min(a.opacity ?? 1, opacity);
    for (const b of this.bonds) if (set.has(b.a) || set.has(b.b)) b.opacity = Math.min(b.opacity ?? 1, opacity);
  }
}

/** H at a bond's end. */
export function addH(f, id, from, dir, parent, d = 1.09) {
  f.atom(id, 'H', at(from, dir, d));
  f.bond(parent, id);
}

/** CH3 attached to `parent` at `from`, pointing along dir; ref twists the H's. */
export function addMethyl(f, id, parent, from, dir, ref, d = 1.54) {
  const c = f.atom(id, 'C', at(from, dir, d));
  f.bond(parent, id);
  tetra(mul(dir, -1), ref).forEach((u, i) => addH(f, `${id}h${i}`, c, u, id));
  return c;
}

/**
 * Straight-chain alkyl group (n carbons, anti zig-zag) attached to `parent`.
 * Carbon ids are `${id}1` … `${id}n`.
 */
export function addChain(f, id, parent, from, dir, n, ref) {
  let prevId = parent, prevP = from, d = dir, r = perpTo(ref, dir);
  for (let i = 1; i <= n; i++) {
    const cid = `${id}${i}`;
    const c = f.atom(cid, 'C', at(prevP, d, 1.54));
    f.bond(prevId, cid);
    const back = mul(d, -1);
    const dirs = tetra(back, r);
    const hs = i < n ? dirs.slice(1) : dirs;
    hs.forEach((u, k) => addH(f, `${cid}h${k}`, c, u, cid));
    if (i < n) {
      const next = dirs[0];
      r = mul(perpTo(back, next), -1); // keeps the chain anti (zig-zag)
      prevId = cid; prevP = c; d = next;
    }
  }
}

/** Place any of 'H', 'CH3', or an n-carbon chain ('C2', 'C3') along dir. */
export function addGroup(f, kind, id, parent, from, dir, ref) {
  if (kind === 'H') return addH(f, id, from, dir, parent);
  if (kind === 'CH3') return addMethyl(f, id, parent, from, dir, ref);
  const n = Number(kind.slice(1));
  return addChain(f, id, parent, from, dir, n, ref);
}

/**
 * CIP descriptor from positions of the four groups in priority order
 * (1 highest … 4 lowest). Returns 'R' or 'S'.
 */
export function cip(center, p1, p2, p3, p4) {
  // Look from the side opposite the lowest-priority group.
  const v1 = sub(p1, center), v2 = sub(p2, center), v3 = sub(p3, center);
  const v4 = norm(sub(p4, center));
  // Project onto the plane perpendicular to v4 so a flattened TS still works.
  const q = v => sub(v, mul(v4, dot(v, v4)));
  const s = dot(cross(q(v1), q(v2)), v4) + dot(cross(q(v2), q(v3)), v4) + dot(cross(q(v3), q(v1)), v4);
  return s > 0 ? 'R' : 'S';
}
