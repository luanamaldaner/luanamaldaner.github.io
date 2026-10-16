// Visual polish helpers for the Biology scenes of lectures 1–5 (styles live in design-a.css).
// polish(svg) tags a scene svg with .bio-a and makes sure the shared gradients exist;
// pill() puts a soft rounded backing behind a label; the rest are small motion helpers.

import { E, TAU, clamp } from './kit.js';

const NS = 'http://www.w3.org/2000/svg';
/** Palette names that get gradients: --b-<name>. */
const PAL = ['red', 'blue', 'na', 'k', 'water', 'glu', 'fat', 'hor', 'acid', 'gold', 'teal', 'mem', 'wall'];

/**
 * One hidden svg in <body> holds every shared gradient, so scene css can say fill: url(#fxa-bead-red).
 * Stop colours come from css classes that use the --b-* variables, so dark mode follows automatically.
 */
function ensureDefs() {
  if (document.getElementById('fxa-defs')) return;
  const svg = document.createElementNS(NS, 'svg');
  svg.id = 'fxa-defs';
  svg.setAttribute('class', 'bio-svg fxa-defs');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.cssText = 'position:absolute;left:0;top:0;width:0;height:0;overflow:hidden;pointer-events:none;min-width:0';
  const defs = E('defs', {}, svg);
  const lin = (id, stops) => {
    const gr = E('linearGradient', { id, x1: 0, y1: 0, x2: 0.3, y2: 1 }, defs);
    stops.forEach(([o, c]) => E('stop', { offset: o, class: c }, gr));
  };
  const rad = (id, stops, f = {}) => {
    const gr = E('radialGradient', { id, cx: 0.5, cy: 0.5, r: 0.5, ...f }, defs);
    stops.forEach(([o, c]) => E('stop', { offset: o, class: c }, gr));
  };
  for (const c of PAL) {
    // glossy bead: bright spot up-left, darker rim
    rad(`fxa-bead-${c}`, [[0, `fxs-${c}-hi`], [0.5, `fxs-${c}`], [1, `fxs-${c}-lo`]], { fx: 0.36, fy: 0.3, r: 0.56 });
    // soft organ wash (light top, a little deeper at the bottom)
    lin(`fxa-soft-${c}`, [[0, `fxs-${c}-s0`], [1, `fxs-${c}-s1`]]);
    // stronger wash for chambers and highlighted parts
    lin(`fxa-mid-${c}`, [[0, `fxs-${c}-m0`], [1, `fxs-${c}-m1`]]);
    // a cell seen from above: pale middle, deeper rim
    rad(`fxa-cell-${c}`, [[0, `fxs-${c}-c0`], [0.7, `fxs-${c}-c1`], [1, `fxs-${c}-c2`]], { fx: 0.42, fy: 0.36, r: 0.55 });
  }
  // a spreading electrical wave: clear middle, glowing front edge
  rad('fxa-wave', [[0, 'fxs-wave-0'], [0.72, 'fxs-wave-1'], [1, 'fxs-wave-2']]);
  // soft glow for highlighted organs
  rad('fxa-glow-gold', [[0, 'fxs-glow-0'], [1, 'fxs-glow-1']]);
  lin('fxa-dusk', [[0, 'fxs-dusk-0'], [1, 'fxs-dusk-1']]);
  lin('fxa-plain-cell', [[0, 'fxs-cell-0'], [1, 'fxs-cell-1']]);
  lin('fxa-panel', [[0, 'fxs-panel-0'], [1, 'fxs-panel-1']]);
  (document.body || document.documentElement).append(svg);
}

/** Opt a scene into the lecture 1–5 look. Call first thing in build(). */
export function polish(svg) {
  ensureDefs();
  svg.classList.add('bio-a');
  return svg;
}

/**
 * Shrink everything drawn so far toward the middle, so the important bits sit inside
 * the central ~560 px that phones show without much sideways scrolling. Call at the end of build().
 */
export function fit(svg, k = 0.94, cx = 320, cy = 180) {
  const wrap = document.createElementNS(NS, 'g');
  wrap.setAttribute('class', 'fx-fit');
  wrap.setAttribute('transform', `translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`);
  for (const n of [...svg.childNodes]) if (n.nodeName !== 'defs') wrap.append(n);
  svg.append(wrap);
  svg.classList.add('fx-fitted');
  return wrap;
}

/**
 * A soft rounded backing behind a label, kept in sync with the label's text, position and opacity.
 * Returns sync(); call it every frame (it only measures when something changed).
 */
export function pill(textEl, { px = 7, py = 3, cls = '' } = {}) {
  const r = document.createElementNS(NS, 'rect');
  r.setAttribute('class', `fx-pill ${cls}`.trim());
  textEl.parentNode.insertBefore(r, textEl);
  let key = '';
  const sync = () => {
    const hidden = textEl.style.display === 'none' || !textEl.textContent;
    if (hidden) { if (r.style.display !== 'none') r.style.display = 'none'; return; }
    if (r.style.display) r.style.display = '';
    const op = textEl.getAttribute('opacity');
    if (op !== r.getAttribute('opacity')) { if (op === null) r.removeAttribute('opacity'); else r.setAttribute('opacity', op); }
    const k = `${textEl.textContent}|${textEl.getAttribute('x')}|${textEl.getAttribute('y')}|${textEl.getAttribute('transform') || ''}|${textEl.getAttribute('class')}`;
    if (k === key) return;
    let b;
    try { b = textEl.getBBox(); } catch { return; }
    if (!b || !b.width) return;
    key = k;
    const h = b.height + 2 * py;
    r.setAttribute('x', (b.x - px).toFixed(1));
    r.setAttribute('y', (b.y - py).toFixed(1));
    r.setAttribute('width', (b.width + 2 * px).toFixed(1));
    r.setAttribute('height', h.toFixed(1));
    r.setAttribute('rx', (h / 2).toFixed(1));
    const tf = textEl.getAttribute('transform');
    if (tf) r.setAttribute('transform', tf); else r.removeAttribute('transform');
  };
  sync();
  return sync;
}

/** Several pills at once; returns one sync() for all of them. */
export function pills(texts, opts) {
  const fns = texts.map(t => pill(t, opts));
  return () => fns.forEach(f => f());
}

/** Gentle idle wave in [-1, 1]. */
export const breath = (t, period = 4.2, ph = 0) => Math.sin(TAU * t / period + ph);

/** Scale an element around a fixed point (for breathing / emphasis on static shapes). */
export function scaleAbout(el, cx, cy, s) {
  el.setAttribute('transform', s === 1 ? '' : `translate(${cx} ${cy}) scale(${s.toFixed(4)}) translate(${-cx} ${-cy})`);
}

/** Smooth organic jitter for particle i: [dx, dy] in roughly [-a, a]. */
export function drift(i, t, a = 2) {
  const p = i * 1.618;
  return [
    a * (0.6 * Math.sin(t * 1.3 + p * 2.1) + 0.4 * Math.sin(t * 2.1 + p * 3.7)),
    a * (0.6 * Math.cos(t * 1.1 + p * 1.7) + 0.4 * Math.sin(t * 1.9 + p * 2.9)),
  ];
}

/** Ease in and out (stronger than smoothstep) over [a, b]. */
export function ease(a, b, x) {
  const k = clamp((x - a) / (b - a));
  return k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2;
}

/** Fade in over the first f and out over the last f of a 0..1 life. */
export const life = (u, f = 0.12) => Math.min(clamp(u / f), clamp((1 - u) / f));

/** Toggle a class only when it changes. */
export function flag(el, cls, on) { if (el.classList.contains(cls) !== on) el.classList.toggle(cls, on); }

/** Mark elements as glossy beads (used for particles whose colour is set inline). */
export function beadify(els, cls = 'fx-hbead') { els.forEach(e => e.classList.add(cls)); return els; }

export { E };
