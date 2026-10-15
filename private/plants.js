// Little botanical flowers for the task garden. Each course gets its own
// flower; colours vary by seed. Shapes are fixed paths written here, never user
// data. Colours come from CSS classes (see "forest" in style.css), so the
// flowers follow the light/dark theme.

const SVGNS = 'http://www.w3.org/2000/svg';
const n2 = v => (typeof v === 'number' ? +v.toFixed(2) : v);
function el(tag, attrs, ...kids) {
  const e = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs || {})) e.setAttribute(k, n2(v));
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

// Finished tasks grow a flower garden. h = rough height, used to fit flowers in a frame.
export const SPECIES = {
  daisy:     { label: 'Daisy', h: 20 },
  tulip:     { label: 'Tulip', h: 20 },
  bell:      { label: 'Bluebell', h: 19 },
  rose:      { label: 'Rose', h: 23 },
  sunflower: { label: 'Sunflower', h: 28 },
  lavender:  { label: 'Lavender', h: 25 },
  cosmos:    { label: 'Cosmos', h: 24 },
  poppy:     { label: 'Poppy', h: 21 },
};
const KINDS = Object.keys(SPECIES);

/** The flower for a course: always the same one for the same tag. */
export function plantForTag(tag) { return tag ? KINDS[hash(`tag:${tag.toLowerCase()}`) % KINDS.length] : 'daisy'; }

// ---------------------------------------------------------------- drawing
// Base at (0, 0), growing up into negative y. Colour classes:
//   p-stem  p-leaf  p-vein  p-center  f-<colour> for petals

const at = (x, y, rot = 0) => `translate(${n2(x)} ${n2(y)}) rotate(${n2(rot)})`;
const stem = (d, cls = 'p-stem') => el('path', { d, class: cls });

// A pointed leaf with a midrib, pointing up before rotation.
function leaf(x, y, rot, len = 6, w = 2.4) {
  return el('g', { transform: at(x, y, rot) },
    el('path', { d: `M0 0Q${n2(w)} ${n2(-len * 0.45)} 0 ${n2(-len)}Q${n2(-w)} ${n2(-len * 0.45)} 0 0z`, class: 'p-leaf' }),
    el('path', { d: `M0 -0.4L0 ${n2(-len * 0.8)}`, class: 'p-vein' }));
}
// A teardrop petal from the centre outward.
function petal(x, y, rot, len, w, cls) {
  return el('path', { d: `M0 0C${n2(w)} ${n2(-len * 0.25)} ${n2(w * 0.9)} ${n2(-len * 0.9)} 0 ${n2(-len)}C${n2(-w * 0.9)} ${n2(-len * 0.9)} ${n2(-w)} ${n2(-len * 0.25)} 0 0z`, class: cls, transform: at(x, y, rot) });
}
function ring(x, y, count, len, w, cls, start = 0) {
  return Array.from({ length: count }, (_, i) => petal(x, y, start + i * 360 / count, len, w, cls));
}

const DRAW = {
  daisy(r) {
    const c = pick(r, ['f-white', 'f-white', 'f-blush', 'f-lilac']);
    return [stem('M0 0C-0.8 -6 0.8 -11 0 -15.5'), leaf(0, -4, -52, 5.5), leaf(0.2, -8, 48, 4.6),
      ...ring(0, -16.5, 10, 4, 1.15, c, r() * 30), el('circle', { cx: 0, cy: -16.5, r: 1.5, class: 'p-center' })];
  },
  tulip(r) {
    const c = pick(r, ['f-pink', 'f-blush', 'f-peach', 'f-lilac', 'f-butter']);
    return [stem('M0 0C0.4 -5 -0.4 -10 0 -13.5'),
      leaf(0, 0, -16, 10, 2.6), leaf(0, 0, 20, 8, 2.2),
      petal(0, -12.5, -22, 7, 2.6, c), petal(0, -12.5, 22, 7, 2.6, c), petal(0, -12.5, 0, 8, 3, c)];
  },
  bell(r) {
    const c = pick(r, ['f-sky', 'f-lilac', 'f-white']);
    const bell = (x, y) => el('path', { class: c,
      d: `M${n2(x)} ${n2(y)}C${n2(x - 2)} ${n2(y + 0.3)} ${n2(x - 2.2)} ${n2(y + 2.6)} ${n2(x - 2.5)} ${n2(y + 3.8)}Q${n2(x - 1.2)} ${n2(y + 3.1)} ${n2(x)} ${n2(y + 4)}Q${n2(x + 1.2)} ${n2(y + 3.1)} ${n2(x + 2.5)} ${n2(y + 3.8)}C${n2(x + 2.2)} ${n2(y + 2.6)} ${n2(x + 2)} ${n2(y + 0.3)} ${n2(x)} ${n2(y)}z` });
    return [leaf(0, 0, -22, 9, 2.2), stem('M0 0C-0.4 -9 2 -16 8.4 -16.6'),
      stem('M3 -15.4L3.1 -14.2'), stem('M5.8 -16.2L5.9 -12.8'), stem('M8.4 -16.6L8.4 -11.6'),
      bell(3.1, -14.2), bell(5.9, -12.8), bell(8.4, -11.6)];
  },
  rose(r) {
    const c = pick(r, ['f-pink', 'f-blush', 'f-peach', 'f-white']);
    return [stem('M0 0C-0.8 -6 0.8 -12 0 -17'), leaf(0, -6, -55, 5.5, 2.4), leaf(0, -10, 50, 5, 2.2),
      ...ring(0, -19.5, 5, 4.4, 3, c, 36), ...ring(0, -19.5, 4, 3, 2.3, c, 0),
      el('path', { d: 'M-1.1 -19.7C-1.1 -21.4 1.2 -21.4 1.2 -19.8C1.2 -18.8 -0.3 -18.6 -0.4 -19.6', class: 'p-swirl' })];
  },
  sunflower() {
    return [stem('M0 0C-0.9 -8 0.9 -16 0 -22.5'), leaf(0, -7, -58, 7, 3), leaf(0.2, -12, 54, 6.5, 2.8),
      ...ring(0, -23.5, 16, 4.6, 1.15, 'f-butter'), el('circle', { cx: 0, cy: -23.5, r: 2.7, class: 'p-seedhead' })];
  },
  lavender(r) {
    const c = pick(r, ['f-lilac', 'f-lilac', 'f-sky']);
    const out = [leaf(0, 0, -30, 7, 1.4), leaf(0, 0, 28, 6.5, 1.4)];
    for (const [x, top] of [[-3.2, -18], [0, -22], [3.2, -18.5]]) {
      out.push(stem(`M0 0Q${n2(x * 0.3)} ${n2(top * 0.5)} ${n2(x)} ${n2(top)}`));
      for (let i = 0; i < 5; i++) {
        const y = top - i * 1.5 + 0.5;
        out.push(petal(x, y, -32, 2.1, 0.9, c), petal(x, y, 32, 2.1, 0.9, c));
      }
    }
    return out;
  },
  cosmos(r) {
    const c = pick(r, ['f-pink', 'f-blush', 'f-white', 'f-peach']);
    return [stem('M0 0C1.4 -6 -1.4 -12 0 -18.5'), stem('M0 -7L-3 -10'), stem('M0.3 -11L3 -13.5'),
      ...ring(0, -19.5, 8, 4.8, 2.1, c, r() * 40), el('circle', { cx: 0, cy: -19.5, r: 1.4, class: 'p-center' })];
  },
  poppy(r) {
    const c = pick(r, ['f-coral', 'f-peach', 'f-pink', 'f-white']);
    return [stem('M0 0C1.2 -5 -1.2 -11 0 -16'), leaf(0, -3, -48, 5, 1.8), leaf(0, -5, 44, 4.4, 1.7),
      ...ring(0, -18, 4, 4.4, 3.4, c, 45), ...ring(0, -18, 4, 3.2, 2.6, c, 0),
      el('circle', { cx: 0, cy: -18, r: 1.25, class: 'p-poppy-eye' })];
  },
};

/** A flower as an SVG <g>, base at (0, 0). */
export function plant(kind, seed, title) {
  const g = el('g', { class: 'plant' }, ...(DRAW[kind] || DRAW.daisy)(rng(`look:${seed}`)));
  if (title) { const t = el('title'); t.textContent = title; g.prepend(t); }
  return g;
}

/** A flower in its own little <svg>, for legends. */
export function plantIcon(kind, seed, cls = 'plant-icon') {
  const hgt = SPECIES[kind].h + 4;
  return el('svg', { viewBox: `${n2(-hgt / 2)} ${n2(-hgt + 1.5)} ${n2(hgt)} ${n2(hgt)}`, class: cls, 'aria-hidden': 'true' }, plant(kind, seed));
}

/**
 * A square patch of garden seen from above at an angle: one flower per item
 * on a tidy grid, the first ones at the back. items: [{ kind, seed, title }]
 */
export function forestPlot(items, label) {
  const n = Math.max(5, Math.ceil(Math.sqrt(items.length)));
  const dx = 14, dy = 7, depth = 5;
  const pos = (c, r) => [(c - r) * dx, (c + r) * dy];
  const cells = [];
  for (let c = 0; c < n; c++) for (let r = 0; r < n; r++) cells.push([c, r]);
  cells.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]) || a[0] - b[0]);

  const top = [0, -dy], right = [n * dx, (n - 1) * dy], bottom = [0, (2 * n - 1) * dy], left = [-n * dx, (n - 1) * dy];
  const down = ([x, y], k = depth) => [x, y + k];
  const poly = pts => `M${pts.map(([x, y]) => `${n2(x)} ${n2(y)}`).join('L')}z`;
  const out = [
    el('path', { d: poly([down(left, depth + 3), down(bottom, depth + 6), down(right, depth + 3), right, bottom, left]), class: 'iso-shadow' }),
    el('path', { d: poly([left, bottom, down(bottom), down(left)]), class: 'iso-left' }),
    el('path', { d: poly([bottom, right, down(right), down(bottom)]), class: 'iso-right' }),
    el('path', { d: poly([top, right, bottom, left]), class: 'iso-top' }),
  ];
  // faint row lines, like a planted bed
  let grid = '';
  for (let i = 1; i < n; i++) {
    grid += `M${n2(i * dx)} ${n2((i - 1) * dy)}L${n2((i - n) * dx)} ${n2((i + n - 1) * dy)}`;
    grid += `M${n2(-i * dx)} ${n2((i - 1) * dy)}L${n2((n - i) * dx)} ${n2((i + n - 1) * dy)}`;
  }
  out.push(el('path', { d: grid, class: 'iso-grid' }));

  const tufts = rng(`tufts:${n}`);
  cells.forEach(([c, r], i) => {
    const [x, y] = pos(c, r);
    const it = items[i];
    if (!it) {
      if (tufts() < 0.3) out.push(el('path', { d: `M${n2(x - 1.6)} ${n2(y + 0.8)}l0.6 -2.2M${n2(x)} ${n2(y + 0.8)}l0 -2.8M${n2(x + 1.6)} ${n2(y + 0.8)}l-0.6 -2.2`, class: 'iso-tuft' }));
      return;
    }
    out.push(el('ellipse', { cx: x, cy: y + 0.8, rx: 4, ry: 1.4, class: 'iso-plant-shadow' }),
      el('g', { transform: `translate(${n2(x)} ${n2(y + 0.8)}) scale(0.82)` }, plant(it.kind, it.seed, it.title)));
  });

  const tallest = items.length ? Math.max(...items.slice(0, n * 2).map(it => SPECIES[it.kind].h * 0.82)) : 4;
  const vb = [-n * dx - 4, -dy - tallest - 2, 2 * n * dx + 8, 2 * n * dy + depth + tallest + 12];
  return el('svg', { viewBox: vb.map(n2).join(' '), class: 'forest-plot', role: 'img', 'aria-label': label }, ...out);
}
