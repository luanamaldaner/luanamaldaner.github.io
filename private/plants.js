// Little plants for the focus timer and the forests. Longer focus sessions grow
// bigger, fancier plants; within a size the species and colours vary by seed.
// Every drawing is fixed shapes and colours written here, never user data.

const SVGNS = 'http://www.w3.org/2000/svg';
function el(tag, attrs, ...kids) {
  const e = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs || {})) e.setAttribute(k, typeof v === 'number' ? +v.toFixed(2) : v);
  for (const k of kids.flat()) if (k) e.append(k);
  return e;
}

function hash(str) {
  let x = 2166136261;
  for (const ch of String(str)) x = Math.imul(x ^ ch.charCodeAt(0), 16777619) >>> 0;
  return x;
}
function rng(seed) {
  let a = hash(seed);
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = (r, list) => list[Math.floor(r() * list.length)];

// ---------------------------------------------------------------- species

// min = minutes of focus needed; h = rough height, used to fit plants in a frame.
export const SPECIES = {
  sprout:    { label: 'Sprout', min: 0, h: 10 },
  daisy:     { label: 'Daisy', min: 10, h: 22 },
  tulip:     { label: 'Tulip', min: 10, h: 23 },
  bell:      { label: 'Bluebell', min: 10, h: 20 },
  rose:      { label: 'Rose', min: 20, h: 25 },
  sunflower: { label: 'Sunflower', min: 20, h: 31 },
  lavender:  { label: 'Lavender', min: 20, h: 27 },
  poppy:     { label: 'Poppy', min: 20, h: 24 },
  hydrangea: { label: 'Hydrangea bush', min: 35, h: 20 },
  azalea:    { label: 'Azalea bush', min: 35, h: 20 },
  berry:     { label: 'Berry bush', min: 35, h: 20 },
  oak:       { label: 'Oak tree', min: 55, h: 42 },
  pine:      { label: 'Pine tree', min: 55, h: 42 },
  maple:     { label: 'Maple tree', min: 55, h: 42 },
  cherry:    { label: 'Cherry blossom', min: 55, h: 42 },
  sakura:    { label: 'Grand sakura', min: 90, h: 54 },
  golden:    { label: 'Golden tree', min: 90, h: 54 },
  ancient:   { label: 'Ancient pine', min: 90, h: 54 },
};
export const TIERS = [
  { min: 90, label: 'grand trees', kinds: ['sakura', 'golden', 'ancient'] },
  { min: 55, label: 'trees', kinds: ['oak', 'pine', 'maple', 'cherry'] },
  { min: 35, label: 'flowering bushes', kinds: ['hydrangea', 'azalea', 'berry'] },
  { min: 20, label: 'roses, sunflowers, lavender & poppies', kinds: ['rose', 'sunflower', 'lavender', 'poppy'] },
  { min: 10, label: 'daisies, tulips & bluebells', kinds: ['daisy', 'tulip', 'bell'] },
  { min: 0, label: 'a sprout', kinds: ['sprout'] },
];
// Flowers used for finished tasks, one species per course/tag.
const TASK_KINDS = ['daisy', 'tulip', 'bell', 'rose', 'sunflower', 'lavender', 'poppy', 'hydrangea', 'azalea', 'berry'];

export function tierFor(minutes) { return TIERS.find(t => minutes >= t.min); }
export function plantForMinutes(minutes, seed) { return pick(rng(`kind:${seed}`), tierFor(minutes).kinds); }
export function plantForTag(tag) { return tag ? TASK_KINDS[hash(`tag:${tag.toLowerCase()}`) % TASK_KINDS.length] : 'daisy'; }

// ---------------------------------------------------------------- drawing
// Every plant is drawn with its base at (0, 0), growing up into negative y.

const GREEN = ['#5f9e5a', '#4f8f57', '#6aa86a'];
const LEAF = '#7cbf6e';
const TRUNK = '#8a5a3b';

const stem = (d, w = 1.6, c = '#5f9e5a') => el('path', { d, fill: 'none', stroke: c, 'stroke-width': w, 'stroke-linecap': 'round' });
const leaf = (x, y, side, len = 6, c = LEAF) =>
  el('path', { d: `M${x} ${y}c${2.4 * side} ${-len * 0.5} ${len * side} ${-len * 0.55} ${len * 1.1 * side} ${-len * 0.2}c${-len * 0.35 * side} ${len * 0.45} ${-len * 0.8 * side} ${len * 0.5} ${-len * 1.1 * side} ${len * 0.2}z`, fill: c });
const petals = (cx, cy, n, rx, ry, off, fill, edge) =>
  Array.from({ length: n }, (_, i) => el('ellipse', { cx, cy: cy - off, rx, ry, fill, transform: `rotate(${i * 360 / n} ${cx} ${cy})`, ...(edge ? { stroke: edge, 'stroke-width': 0.35 } : {}) }));

const DRAW = {
  sprout(r) {
    return [stem('M0 0 C0 -3 0.5 -5 0 -7'),
      el('ellipse', { cx: -3, cy: -8, rx: 3.2, ry: 1.7, fill: LEAF, transform: 'rotate(-30 -3 -8)' }),
      el('ellipse', { cx: 3, cy: -8.5, rx: 3.4, ry: 1.8, fill: pick(r, GREEN), transform: 'rotate(28 3 -8.5)' })];
  },
  daisy(r) {
    const c = pick(r, ['#ffffff', '#ffe3ee', '#efe4ff', '#fff4c9']);
    return [stem('M0 0 C-1 -6 1 -11 0 -16'), leaf(0, -6, -1, 5), leaf(0, -9, 1, 4.5),
      ...petals(0, -17, 9, 1.5, 3.3, 3.4, c, '#cdbfae'), el('circle', { cx: 0, cy: -17, r: 2.1, fill: '#f2c53d' })];
  },
  tulip(r) {
    const c = pick(r, ['#e8496b', '#f58fb0', '#f7c948', '#9b6fd3', '#f27a3d']);
    return [stem('M0 0 C0.5 -6 -0.5 -11 0 -15'),
      el('path', { d: 'M0 -1 C-6 -5 -6 -10 -3.5 -13 C-3 -8 -1.5 -5 0 -3z', fill: LEAF }),
      el('path', { d: 'M0 -1 C5 -4 6 -9 4 -11 C3 -7 1.5 -4.5 0 -3z', fill: '#6aa86a' }),
      el('path', { d: 'M-4.2 -15 C-5.2 -19 -4 -22.5 -2.6 -23.2 L0 -20.4 L2.6 -23.2 C4 -22.5 5.2 -19 4.2 -15 C3 -13.2 -3 -13.2 -4.2 -15z', fill: c }),
      el('path', { d: 'M-1.6 -14 C-2.2 -18 -1 -21 0 -21.6 C1 -21 2.2 -18 1.6 -14z', fill: '#ffffff', opacity: 0.18 })];
  },
  bell(r) {
    const c = pick(r, ['#6f8fe0', '#8c7ae6', '#b38be8']);
    const bells = [[3.2, -15.5], [6.2, -13.2], [8.6, -10.4]].map(([x, y]) =>
      el('path', { d: `M${x} ${y} C${x - 2.4} ${y + 0.4} ${x - 2.5} ${y + 3} ${x - 2.9} ${y + 4.6} Q${x - 1.5} ${y + 3.8} ${x} ${y + 4.8} Q${x + 1.5} ${y + 3.8} ${x + 2.9} ${y + 4.6} C${x + 2.5} ${y + 3} ${x + 2.4} ${y + 0.4} ${x} ${y}z`, fill: c }));
    return [stem('M0 0 C-0.5 -10 2 -17 9 -17.5'), leaf(0, -4, -1, 6), leaf(0, -7, 1, 5), ...bells];
  },
  rose(r) {
    const c = pick(r, [['#d6304f', '#f05a74'], ['#f27fa2', '#ffadc4'], ['#f5845b', '#ffb08f'], ['#f3efe6', '#ffffff'], ['#b8325f', '#de5c88']]);
    return [stem('M0 0 C-1 -7 1 -13 0 -18', 1.9, '#4f8f57'), leaf(0, -7, -1, 6, '#5f9e5a'), leaf(0, -11, 1, 5.5, '#5f9e5a'),
      el('circle', { cx: 0, cy: -21, r: 5.2, fill: c[0] }),
      el('path', { d: 'M-5 -21 C-5 -16 5 -16 5 -21 C3 -18 -3 -18 -5 -21z', fill: '#000', opacity: 0.12 }),
      el('circle', { cx: 0, cy: -21.6, r: 3.3, fill: c[1] }),
      el('path', { d: 'M-1.8 -21.6 C-1.8 -24 1.8 -24 1.8 -21.6 C1.8 -20.2 -0.6 -20 -0.6 -21.4', fill: 'none', stroke: c[0], 'stroke-width': 0.9, 'stroke-linecap': 'round' })];
  },
  sunflower(r) {
    const c = pick(r, ['#f7c331', '#f5a623', '#ffd95a']);
    return [stem('M0 0 C-1 -9 1 -17 0 -24', 2.2, '#4f8f57'), leaf(0, -8, -1, 8, '#5f9e5a'), leaf(0, -13, 1, 7.5, '#6aa86a'),
      ...petals(0, -25, 14, 1.7, 3.6, 5, c), el('circle', { cx: 0, cy: -25, r: 3.9, fill: '#7a4a24' }),
      el('circle', { cx: -1, cy: -26, r: 1.4, fill: '#9b6538' })];
  },
  lavender(r) {
    const c = pick(r, ['#9b7fd8', '#b393e6', '#8467c9']);
    const spikes = [[-3.5, -17, -8], [0, -20, 0], [3.5, -17, 8]];
    const out = [];
    for (const [x, top, tilt] of spikes) {
      out.push(stem(`M0 0 Q${x * 0.3} ${top * 0.5} ${x} ${top}`, 1.1, '#6a9a6a'));
      for (let i = 0; i < 5; i++) out.push(el('ellipse', { cx: x + tilt * 0.02 * i, cy: top - i * 1.6, rx: 1.2, ry: 1.6, fill: i % 2 ? c : '#c4abf0', transform: `rotate(${tilt} ${x} ${top})` }));
    }
    return [leaf(0, -2, -1, 5, '#7aa877'), leaf(0, -3, 1, 5, '#7aa877'), ...out];
  },
  poppy(r) {
    const c = pick(r, ['#e8432e', '#f57c2e', '#f56a8f', '#ffffff']);
    return [stem('M0 0 C2 -6 -2 -12 0 -18', 1.3, '#6a9a6a'), leaf(0, -4, -1, 5, '#7aa877'),
      ...[[-2.6, -19.6], [2.6, -19.6], [-1.8, -22.4], [1.8, -22.4]].map(([x, y]) => el('circle', { cx: x, cy: y, r: 3, fill: c })),
      el('circle', { cx: 0, cy: -20.8, r: 1.5, fill: '#2b2230' })];
  },
  hydrangea(r) { return bush(r, ['#7aa7f0', '#a58bf0', '#9ec9f5', '#e7a0d6']); },
  azalea(r) { return bush(r, ['#f26d9d', '#ff9cbf', '#f7f0f4', '#f48fb1']); },
  berry(r) { return bush(r, ['#d9334f', '#b0224a'], true); },
  oak(r) { return roundTree(r, pick(r, [['#5aa95e', '#7cc274'], ['#4f9a5c', '#78be70']]), null); },
  maple(r) { return roundTree(r, pick(r, [['#e8743b', '#f59f55'], ['#d9493a', '#f07a5a'], ['#e9a63b', '#f5c85e']]), null); },
  cherry(r) { return roundTree(r, pick(r, [['#f4a7c3', '#ffd0e0'], ['#f08fb5', '#ffc2d8']]), '#ffffff'); },
  pine(r) { return pineTree(r, pick(r, ['#2f7d55', '#3d8a5f', '#2a6f62'])); },
  sakura(r) { return grand(roundTree(r, pick(r, [['#f39bbd', '#ffd3e3'], ['#ea7fac', '#ffb9d3']]), '#ffffff'), r, '#ffc2d8'); },
  golden(r) { return grand(roundTree(r, [['#e6b422'], ['#f7d55c']].flat(), '#fff3b0'), r, '#f7d55c'); },
  ancient(r) { return grand(pineTree(r, '#24684b', true), r, '#ffffff'); },
};

function bush(r, colors, berries = false) {
  const out = [
    el('circle', { cx: -6.5, cy: -6.5, r: 6.5, fill: '#4f8f57' }),
    el('circle', { cx: 6.5, cy: -6.5, r: 6.5, fill: '#4f8f57' }),
    el('circle', { cx: 0, cy: -10.5, r: 8, fill: '#5f9e5a' }),
    el('circle', { cx: -3, cy: -13, r: 4, fill: '#6fae67', opacity: 0.8 }),
  ];
  const spots = [[-7, -8], [-2, -15], [5, -13], [8, -6], [0, -6], [-5, -12.5], [3, -9]];
  for (const [x, y] of spots) {
    const c = pick(r, colors);
    if (berries) { out.push(el('circle', { cx: x, cy: y, r: 1.3, fill: c }), el('circle', { cx: x + 1.8, cy: y + 1, r: 1.1, fill: c })); continue; }
    for (const [dx, dy] of [[0, 0], [1.6, 0.8], [-1.4, 1], [0.2, 1.8]]) out.push(el('circle', { cx: x + dx, cy: y + dy, r: 1.35, fill: c }));
  }
  return out;
}

function roundTree(r, [base, light], dots) {
  const out = [
    el('path', { d: 'M-1.8 0 L-1.2 -16 L1.2 -16 L1.8 0z', fill: TRUNK }),
    stem('M0 -11 L-5 -16', 1.3, TRUNK), stem('M0 -13 L4.5 -18', 1.2, TRUNK),
  ];
  const blobs = [[0, -27, 11], [-8.5, -21.5, 7.5], [8.5, -21.5, 7.5], [-5, -33, 7], [5.5, -32.5, 7]];
  for (const [x, y, rad] of blobs) out.push(el('circle', { cx: x, cy: y, r: rad, fill: base }));
  out.push(el('circle', { cx: -3.5, cy: -31, r: 5, fill: light, opacity: 0.85 }), el('circle', { cx: 4.5, cy: -25, r: 4, fill: light, opacity: 0.6 }));
  if (dots) for (let i = 0; i < 9; i++) out.push(el('circle', { cx: -11 + r() * 22, cy: -38 + r() * 20, r: 0.9 + r() * 0.6, fill: dots, opacity: 0.9 }));
  return out;
}

function pineTree(r, c, snow = false) {
  const out = [el('path', { d: 'M-1.6 0 L-1.2 -8 L1.2 -8 L1.6 0z', fill: TRUNK })];
  const layers = [[-11, -7, -23], [-9, -16, -31], [-6.5, -25, -40]];
  for (const [w, y, top] of layers) {
    out.push(el('path', { d: `M${w} ${y} Q0 ${y + 2.4} ${-w} ${y} L0 ${top}z`, fill: c }));
    out.push(el('path', { d: `M0 ${top} L${-w * 0.9} ${y} Q${-w * 0.45} ${y + 1.4} 0 ${y + 1.2}z`, fill: '#ffffff', opacity: 0.08 }));
    if (snow) out.push(el('path', { d: `M0 ${top} L${w * 0.28} ${top + (y - top) * 0.3} L0 ${top + (y - top) * 0.22} L${-w * 0.28} ${top + (y - top) * 0.3}z`, fill: '#f4f8ff' }));
  }
  return out;
}

// Grand trees: drawn larger, with a few drifting petals or sparkles.
function grand(parts, r, c) {
  const g = el('g', { transform: 'scale(1.28)' }, ...parts);
  const extra = [];
  for (let i = 0; i < 5; i++) {
    const x = -17 + r() * 34, y = -48 + r() * 40;
    extra.push(el('ellipse', { cx: x, cy: y, rx: 1.1, ry: 0.7, fill: c, opacity: 0.85, transform: `rotate(${Math.round(r() * 180)} ${x.toFixed(1)} ${y.toFixed(1)})` }));
  }
  return [g, ...extra];
}

/** A plant as an SVG <g>, base at (0, 0). */
export function plant(kind, seed, title) {
  const r = rng(`look:${seed}`);
  const g = el('g', { class: 'plant' },
    el('ellipse', { cx: 0, cy: 0.6, rx: SPECIES[kind].h > 35 ? 8 : 5.5, ry: 1.7, fill: '#000', opacity: 0.13 }),
    ...(DRAW[kind] || DRAW.sprout)(r));
  if (title) { const t = el('title'); t.textContent = title; g.prepend(t); }
  return g;
}

/** A plant in its own little <svg>, for lists and legends. */
export function plantIcon(kind, seed, cls = 'plant-icon') {
  const hgt = Math.max(24, SPECIES[kind].h + 6);
  return el('svg', { viewBox: `${-hgt / 2} ${-hgt + 2} ${hgt} ${hgt}`, class: cls, 'aria-hidden': 'true' }, plant(kind, seed));
}

/**
 * An isometric patch of land with one plant per item, oldest at the back.
 * items: [{ kind, seed, title }]
 */
export function forestPlot(items, label) {
  const n = Math.max(4, Math.ceil(Math.sqrt(items.length)));
  const dx = 18, dy = 9, depth = 9;
  const cells = [];
  for (let c = 0; c < n; c++) for (let rr = 0; rr < n; rr++) cells.push([c, rr]);
  const order = rng(`cells:${n}`);
  cells.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]) || (order() - 0.5));
  const pos = ([c, rr]) => [(c - rr) * dx, (c + rr) * dy];

  const top = [0, -dy], right = [n * dx, (n - 1) * dy], bottom = [0, (2 * n - 1) * dy], left = [-n * dx, (n - 1) * dy];
  const P = pts => pts.map(p => p.join(' ')).join(' L');
  const ground = [
    el('path', { d: `M${P([left, bottom, [bottom[0], bottom[1] + depth], [left[0], left[1] + depth]])}z`, fill: '#a87a4f' }),
    el('path', { d: `M${P([bottom, right, [right[0], right[1] + depth], [bottom[0], bottom[1] + depth]])}z`, fill: '#8c623d' }),
    el('path', { d: `M${P([top, right, bottom, left])}z`, fill: '#93cf78' }),
  ];
  for (const cell of cells) {
    if ((cell[0] + cell[1]) % 2) continue;
    const [x, y] = pos(cell);
    ground.push(el('path', { d: `M${x} ${y - dy} L${x + dx} ${y} L${x} ${y + dy} L${x - dx} ${y}z`, fill: '#a3d986', opacity: 0.7 }));
  }
  const tufts = rng(`tufts:${n}`);
  for (const cell of cells.slice(items.length)) {
    if (tufts() > 0.35) continue;
    const [x, y] = pos(cell);
    ground.push(el('path', { d: `M${x - 2} ${y + 1} l1 -3 l1 3 l1 -3.5 l1 3.5`, fill: 'none', stroke: '#6fae5f', 'stroke-width': 0.8, 'stroke-linecap': 'round' }));
  }
  const plants = items.slice(0, cells.length).map((it, i) => {
    const [x, y] = pos(cells[i]);
    const k = SPECIES[it.kind].h > 35 ? 0.9 : 1.1;
    const g = el('g', { transform: `translate(${x} ${y + 2}) scale(${k})` }, plant(it.kind, it.seed, it.title));
    return g;
  });
  const tallest = items.length ? Math.max(24, ...items.map(it => SPECIES[it.kind].h * 1.1)) : 6;
  const vb = [-n * dx - 6, -dy - tallest * 0.95, 2 * n * dx + 12, 2 * n * dy + depth + tallest * 0.95 + 6];
  const svg = el('svg', { viewBox: vb.join(' '), class: 'forest-plot', role: 'img', 'aria-label': label }, ...ground, ...plants);
  return svg;
}
