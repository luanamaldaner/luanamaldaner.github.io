// Shared visual polish for the Biology scenes of lectures 6–10:
// per-svg gradients (glossy beads, soft organ fills), soft label pills and
// small motion helpers. Colours always come from the --b-* variables, so the
// gradients follow light/dark mode automatically.

import { E, T, clamp, lerp, smooth, TAU } from './kit.js';

const PAL = ['red', 'blue', 'na', 'k', 'water', 'glu', 'fat', 'hor', 'acid', 'gold', 'teal', 'mem', 'wall'];
let uid = 0;

function stop(parent, offset, color, opacity) {
  return E('stop', { offset, style: `stop-color: ${color};${opacity !== undefined ? ` stop-opacity: ${opacity};` : ''}` }, parent);
}

/**
 * Give an svg its polish layer: adds the `fxb` class (all design-b.css rules
 * hang off it) and gradient defs, exposed as CSS custom properties
 * (--fxb-bead-<colour>, --fxb-soft-<colour>, --fxb-cell, --fxb-sheen).
 */
export function fx(svg) {
  svg.classList.add('fxb');
  const id = `fxb${++uid}`;
  const defs = E('defs', {}, svg);
  svg.prepend(defs);
  const set = (k, v) => svg.style.setProperty(k, v);
  for (const c of PAL) {
    const v = `var(--b-${c})`;
    const b = E('radialGradient', { id: `${id}-b-${c}`, cx: 0.4, cy: 0.36, r: 0.7, fx: 0.32, fy: 0.26 }, defs);
    stop(b, 0, `color-mix(in srgb, ${v} 40%, #fff)`);
    stop(b, 0.5, v);
    stop(b, 1, `color-mix(in srgb, ${v} 78%, #000)`);
    set(`--fxb-bead-${c}`, `url(#${id}-b-${c})`);
    const s = E('linearGradient', { id: `${id}-s-${c}`, x1: 0, y1: 0, x2: 0.25, y2: 1 }, defs);
    stop(s, 0, `color-mix(in srgb, ${v} 12%, var(--b-stage))`);
    stop(s, 1, `color-mix(in srgb, ${v} 34%, var(--b-stage))`);
    set(`--fxb-soft-${c}`, `url(#${id}-s-${c})`);
    const r = E('radialGradient', { id: `${id}-r-${c}`, cx: 0.42, cy: 0.38, r: 0.75 }, defs);
    stop(r, 0, `color-mix(in srgb, ${v} 14%, var(--b-stage))`);
    stop(r, 1, `color-mix(in srgb, ${v} 40%, var(--b-stage))`);
    set(`--fxb-round-${c}`, `url(#${id}-r-${c})`);
    const vv = E('linearGradient', { id: `${id}-v-${c}`, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    stop(vv, 0, `color-mix(in srgb, ${v} 62%, #fff)`);
    stop(vv, 1, v);
    set(`--fxb-vivid-${c}`, `url(#${id}-v-${c})`);
  }
  const cell = E('radialGradient', { id: `${id}-cell`, cx: 0.45, cy: 0.35, r: 0.8 }, defs);
  stop(cell, 0, 'var(--b-cell)');
  stop(cell, 1, 'color-mix(in srgb, var(--b-wall) 16%, var(--b-cell))');
  set('--fxb-cell', `url(#${id}-cell)`);
  const sheen = E('linearGradient', { id: `${id}-sheen`, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
  stop(sheen, 0, '#fff', 0.5);
  stop(sheen, 0.6, '#fff', 0);
  set('--fxb-sheen', `url(#${id}-sheen)`);
  return id;
}

/** Ids of the gradients made by fx() for direct use in attributes. */
export const grad = (id, kind, c) => `url(#${id}-${kind}-${c})`;

// ------------------------------------------------------------ label pills

const pills = new Set();

/**
 * A label with a soft rounded background, for text sitting over busy areas.
 * Returns the <text>; its <g> is `el.parentNode`. Call pillText() to change
 * the words (the pill refits itself on the next frame it is visible).
 */
export function pill(parent, x, y, text, cls = 'bs b-strong', attrs = {}, padX = 7) {
  const g = E('g', { class: 'fxb-pillg' }, parent);
  const r = E('rect', { class: 'fxb-pill', rx: 9, ry: 9 }, g);
  const t = T(g, x, y, text, cls, attrs);
  t._pill = { r, padX, dirty: true };
  pills.add(t);
  fitSoon(t);
  return t;
}

function fit(t) {
  const p = t._pill;
  if (!t.isConnected) return false;
  let b;
  try { b = t.getBBox(); } catch { return false; }
  if (!b || !b.width) { p.r.setAttribute('width', 0); return !t.textContent; }
  p.r.setAttribute('x', (b.x - p.padX).toFixed(1));
  p.r.setAttribute('y', (b.y - 3).toFixed(1));
  p.r.setAttribute('width', (b.width + 2 * p.padX).toFixed(1));
  p.r.setAttribute('height', (b.height + 6).toFixed(1));
  p.dirty = false;
  return true;
}

let raf = 0;
function fitSoon(t) {
  t._pill.dirty = true;
  if (!raf) raf = requestAnimationFrame(sweep);
}
function sweep() {
  raf = 0;
  let again = false;
  for (const t of pills) {
    if (!t.isConnected && t._pill.seen) { pills.delete(t); continue; }
    if (t.isConnected) t._pill.seen = true;
    if (t._pill.dirty && !fit(t)) again = true;
  }
  if (again) raf = requestAnimationFrame(sweep);
}

export function pillText(t, s) {
  if (t.textContent === s) return;
  t.textContent = s;
  if (t._pill) fitSoon(t);
}

/** Move a pill label (text x/y) and its background together. */
export function pillAt(t, x, y) {
  const ox = +t.getAttribute('x'), oy = +t.getAttribute('y');
  if (Math.abs(ox - x) < 0.05 && Math.abs(oy - y) < 0.05) return;
  t.setAttribute('x', x.toFixed(1)); t.setAttribute('y', y.toFixed(1));
  if (t._pill) fitSoon(t);
}

// ------------------------------------------------------------ motion helpers

/** Ease in-out (cubic). */
export const ease = k => { k = clamp(k); return k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2; };

/** 0..1 eased progress between a and b. */
export const eased = (a, b, x) => ease((x - a) / (b - a));

/** Opacity envelope for a looping particle: quick fade in/out, solid in the middle. */
export const env = (u, e = 0.18) => smooth(0, e, u) * (1 - smooth(1 - e, 1, u));

/**
 * Point along a gently curved path from a to b. `bend` bows it sideways
 * (in px), `wob` adds a small personal wiggle per particle i.
 */
export function flow(a, b, u, i = 0, bend = 0, wob = 2.5, t = 0) {
  const k = u;
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L, ny = dx / L;
  const side = bend * 4 * k * (1 - k) * (i % 2 ? 1 : 0.8);
  const w = wob * Math.sin(k * 7 + i * 1.7 + t * 1.3) * Math.sin(Math.PI * k);
  return [lerp(a[0], b[0], k) + nx * (side + w), lerp(a[1], b[1], k) + ny * (side + w)];
}

/** Idle breathing factor around 1 (period in s, amplitude as a fraction). */
export const breathe = (t, period = 4, amp = 0.02, phase = 0) => 1 + amp * Math.sin(TAU * t / period + phase);

/** Scale an element about a fixed centre without disturbing its coordinates. */
export function scaleAt(el, cx, cy, s) {
  if (Math.abs(s - 1) < 0.0005) { el.removeAttribute('transform'); return; }
  el.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${s.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
}

/** Toggle the gentle focus glow / calm dimming classes. */
export function focus(el, on) { el.classList.toggle('fxb-hl', !!on); }
export function calm(el, on) { el.classList.toggle('fxb-dim', !!on); }
