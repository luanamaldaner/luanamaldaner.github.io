// Tiny SVG animation kit shared by the Biology scenes.

export const NS = 'http://www.w3.org/2000/svg';

export function E(tag, attrs = {}, parent) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined) continue;
    if (k === 'style') e.style.cssText = v; // CSSOM: allowed by the page's CSP, unlike a style attribute
    else e.setAttribute(k, v);
  }
  if (parent) parent.append(e);
  return e;
}

export function T(parent, x, y, text, cls = 'bl', attrs = {}) {
  const e = E('text', { x, y, class: cls, ...attrs }, parent);
  e.textContent = text;
  return e;
}

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, k) => a + (b - a) * k;
export const frac = x => x - Math.floor(x);
export const gauss = (x, mu, s) => Math.exp(-((x - mu) ** 2) / (2 * s * s));
export const TAU = Math.PI * 2;

/** 0 before a, 1 after b, smooth in between. */
export function smooth(a, b, x) {
  const k = clamp((x - a) / (b - a));
  return k * k * (3 - 2 * k);
}

/** 1 between a and b, fading in/out over f at each end. */
export function win(x, a, b, f = 0.04) {
  return Math.min(smooth(a - f, a, x), 1 - smooth(b, b + f, x));
}

/** Piecewise-smooth keyframes [[t, value], ...] (numbers or [x, y]). */
export function keys(t, list) {
  if (t <= list[0][0]) return list[0][1];
  for (let i = 1; i < list.length; i++) {
    const [t1, v1] = list[i];
    if (t <= t1) {
      const [t0, v0] = list[i - 1];
      const k = smooth(t0, t1, t);
      return Array.isArray(v0) ? v0.map((v, j) => lerp(v, v1[j], k)) : lerp(v0, v1, k);
    }
  }
  return list[list.length - 1][1];
}

const f1 = n => (Math.round(n * 10) / 10).toString();

export function at(el, x, y) { el.setAttribute('cx', f1(x)); el.setAttribute('cy', f1(y)); }

export function move(el, x, y, s = 1, r = 0) {
  el.setAttribute('transform', `translate(${f1(x)} ${f1(y)})${r ? ` rotate(${f1(r)})` : ''}${s !== 1 ? ` scale(${s.toFixed(3)})` : ''}`);
}

export function show(el, o) {
  const v = clamp(o);
  el.setAttribute('opacity', v.toFixed(3));
  el.style.display = v < 0.004 ? 'none' : '';
}

export function setText(el, s) { if (el.textContent !== s) el.textContent = s; }

/**
 * Arc-length lookup over one or more SVG path strings drawn in `parent`
 * (as visible or invisible paths). pos(u) for u in [0, 1] runs along all of
 * them in order; seg(u) says which piece you're on and how far into it.
 */
export class Track {
  constructor(parent, ds, attrs = { class: 'b-hidden' }) {
    this.paths = (Array.isArray(ds) ? ds : [ds]).map(d => E('path', { d, ...attrs }, parent));
    this.table = null;
  }
  build() {
    const lens = this.paths.map(p => p.getTotalLength());
    this.total = lens.reduce((a, b) => a + b, 0) || 1;
    this.lens = lens;
    this.table = [];
    let acc = 0;
    this.paths.forEach((p, i) => {
      const n = Math.max(8, Math.ceil(lens[i] / 4));
      for (let k = 0; k <= n; k++) {
        const pt = p.getPointAtLength(lens[i] * k / n);
        this.table.push([(acc + lens[i] * k / n) / this.total, pt.x, pt.y, i]);
      }
      acc += lens[i];
    });
    this.starts = [];
    let s = 0;
    for (const l of lens) { this.starts.push(s / this.total); s += l; }
  }
  pos(u) {
    if (!this.table) this.build();
    u = clamp(u);
    const tb = this.table;
    let lo = 0, hi = tb.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (tb[m][0] <= u) lo = m; else hi = m; }
    const a = tb[lo], b = tb[hi];
    const k = b[0] > a[0] ? (u - a[0]) / (b[0] - a[0]) : 0;
    return [lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
  }
  angle(u) {
    const e = 0.004;
    const a = this.pos(Math.max(0, u - e)), b = this.pos(Math.min(1, u + e));
    return Math.atan2(b[1] - a[1], b[0] - a[0]);
  }
  /** [piece index, 0..1 within that piece] */
  seg(u) {
    if (!this.table) this.build();
    let i = 0;
    while (i + 1 < this.starts.length && u >= this.starts[i + 1]) i++;
    const len = this.lens[i] / this.total;
    return [i, len ? clamp((u - this.starts[i]) / len) : 0];
  }
}

/** A pool of circles (or any element) created once and placed every frame. */
export function pool(parent, n, make) {
  return Array.from({ length: n }, (_, i) => make(i, parent));
}

export function dot(parent, r, cls, extra = {}) { return E('circle', { r, class: cls, ...extra }, parent); }

/** Label with a coloured pill behind it, e.g. ions: Na⁺. */
export function ion(parent, text, cls, r = 11) {
  const g = E('g', { class: `ion ${cls}` }, parent);
  E('circle', { r }, g);
  T(g, 0, 0.5, text, 'ion-t', { 'font-size': r < 10 ? 8.5 : 10.5 });
  return g;
}

/** Arrow head marker shared by a scene's svg. */
export function arrowDefs(svg, id, cls) {
  const defs = svg.querySelector('defs') || E('defs', {}, svg);
  const m = E('marker', { id, viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse' }, defs);
  E('path', { d: 'M0,0 L10,5 L0,10 z', class: cls }, m);
  return `url(#${id})`;
}

let uid = 0;
export const nextId = p => `${p}${++uid}`;
