// Little botanical drawings for the focus timer and the forests. Longer focus
// sessions grow bigger plants; within a size the species and colours vary by seed.
// Shapes are fixed paths written here, never user data. Colours come from CSS
// classes (see "forest" in style.css), so plants follow the light/dark theme.

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

// ---------------------------------------------------------------- species

// min = minutes of focus needed; h = rough height, used to fit plants in a frame.
export const SPECIES = {
  sprout:    { label: 'Sprout', min: 0, h: 9 },
  daisy:     { label: 'Daisy', min: 10, h: 20 },
  tulip:     { label: 'Tulip', min: 10, h: 20 },
  bell:      { label: 'Bluebell', min: 10, h: 19 },
  rose:      { label: 'Rose', min: 20, h: 23 },
  sunflower: { label: 'Sunflower', min: 20, h: 28 },
  lavender:  { label: 'Lavender', min: 20, h: 25 },
  cosmos:    { label: 'Cosmos', min: 20, h: 24 },
  hydrangea: { label: 'Hydrangea', min: 35, h: 18 },
  azalea:    { label: 'Azalea', min: 35, h: 18 },
  berry:     { label: 'Berry bush', min: 35, h: 18 },
  oak:       { label: 'Oak', min: 55, h: 36 },
  pine:      { label: 'Pine', min: 55, h: 38 },
  maple:     { label: 'Maple', min: 55, h: 36 },
  cherry:    { label: 'Cherry blossom', min: 55, h: 36 },
  sakura:    { label: 'Grand sakura', min: 90, h: 46 },
  golden:    { label: 'Golden tree', min: 90, h: 46 },
  ancient:   { label: 'Ancient pine', min: 90, h: 48 },
};
export const TIERS = [
  { min: 90, label: 'grand trees', kinds: ['sakura', 'golden', 'ancient'] },
  { min: 55, label: 'trees', kinds: ['oak', 'pine', 'maple', 'cherry'] },
  { min: 35, label: 'flowering shrubs', kinds: ['hydrangea', 'azalea', 'berry'] },
  { min: 20, label: 'roses, sunflowers, lavender & cosmos', kinds: ['rose', 'sunflower', 'lavender', 'cosmos'] },
  { min: 10, label: 'daisies, tulips & bluebells', kinds: ['daisy', 'tulip', 'bell'] },
  { min: 0, label: 'a sprout', kinds: ['sprout'] },
];
// Flowers used for finished tasks, one species per course/tag.
const TASK_KINDS = ['daisy', 'tulip', 'bell', 'rose', 'sunflower', 'lavender', 'cosmos', 'hydrangea', 'azalea', 'berry'];

export function tierFor(minutes) { return TIERS.find(t => minutes >= t.min); }
export function plantForMinutes(minutes, seed) { return pick(rng(`kind:${seed}`), tierFor(minutes).kinds); }
export function plantForTag(tag) { return tag ? TASK_KINDS[hash(`tag:${tag.toLowerCase()}`) % TASK_KINDS.length] : 'daisy'; }

// ---------------------------------------------------------------- drawing
// Base at (0, 0), growing up into negative y. Colour classes:
//   p-stem  p-leaf  p-vein  p-trunk  p-canopy*  p-center  f-<colour> for petals

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
// A tiny five-petal floret, for shrubs and blossom trees.
function floret(x, y, size, cls) {
  return el('g', null, ...ring(x, y, 5, size, size * 0.55, cls), el('circle', { cx: x, cy: y, r: size * 0.22, class: 'p-center' }));
}
// A soft, scalloped canopy outline around an ellipse.
function cloud(cx, cy, rx, ry, bumps, r) {
  const pts = Array.from({ length: bumps }, (_, i) => {
    const a = (i / bumps) * Math.PI * 2 - Math.PI / 2;
    const j = 0.92 + r() * 0.12;
    return [cx + Math.cos(a) * rx * j, cy + Math.sin(a) * ry * j];
  });
  let d = `M${n2(pts[0][0])} ${n2(pts[0][1])}`;
  for (let i = 0; i < bumps; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % bumps];
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const ox = mx + (mx - cx) * 0.32, oy = my + (my - cy) * 0.32; // bulge outward
    d += `Q${n2(ox)} ${n2(oy)} ${n2(x2)} ${n2(y2)}`;
  }
  return d + 'z';
}

const DRAW = {
  sprout() {
    return [stem('M0 0C0 -3 0.4 -5 0 -6.5'), leaf(0, -6.2, -58, 4.6, 1.9), leaf(0, -6.4, 52, 5, 2)];
  },
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
  hydrangea(r) { return shrub(r, ['f-sky', 'f-lilac', 'f-blush']); },
  azalea(r) { return shrub(r, ['f-pink', 'f-blush', 'f-white']); },
  berry(r) { return shrub(r, null); },
  oak(r) { return tree(r, 'p-canopy', null); },
  maple(r) { return tree(r, pick(r, ['p-canopy-amber', 'p-canopy-rust']), null); },
  cherry(r) { return tree(r, 'p-canopy-blossom', ['f-white', 'f-pink']); },
  pine(r) { return pine(false); },
  sakura(r) { return grand(tree(r, 'p-canopy-blossom', ['f-white', 'f-pink', 'f-blush'], 14), r, 'f-blush'); },
  golden(r) { return grand(tree(r, 'p-canopy-gold', ['f-butter'], 10), r, 'f-butter'); },
  ancient(r) { return grand(pine(true), r, 'f-white'); },
};

function shrub(r, colours) {
  const out = [
    stem('M-3 0Q-2.4 -3 -4 -5', 'p-branch'), stem('M2.5 0Q2.2 -3 4 -5.5', 'p-branch'),
    el('path', { d: cloud(0, -9, 9.5, 7, 9, r), class: 'p-canopy' }),
  ];
  const spots = [[-5.5, -10], [-1.5, -13.5], [3.8, -12.5], [6, -7.5], [0.5, -8.5], [-4.5, -5.8], [2.8, -4.8]];
  for (const [x, y] of spots) {
    if (colours) {
      const c = pick(r, colours);
      out.push(floret(x, y, 1.5, c), floret(x + 1.6, y + 1.1, 1.2, c));
    } else {
      out.push(el('circle', { cx: x, cy: y, r: 0.95, class: 'p-berry' }), el('circle', { cx: x + 1.5, cy: y + 0.8, r: 0.8, class: 'p-berry' }));
    }
  }
  return out;
}

function tree(r, canopy, blossoms, count = 9) {
  const out = [
    el('path', { d: 'M-1.4 0C-1 -5 -0.9 -10 -0.6 -14L0.6 -14C0.9 -10 1 -5 1.4 0z', class: 'p-trunk' }),
    stem('M-0.2 -10Q-3 -12.5 -4.5 -15.5', 'p-branch'), stem('M0.2 -12Q2.5 -14 4 -17', 'p-branch'),
    el('path', { d: cloud(0, -24, 11.5, 10.5, 11, r), class: canopy }),
  ];
  // a few loose strokes for texture
  for (let i = 0; i < 5; i++) {
    const x = -7 + r() * 14, y = -31 + r() * 13;
    out.push(el('path', { d: `M${n2(x)} ${n2(y)}q1.2 -0.9 2.4 -0.1`, class: 'p-texture' }));
  }
  if (blossoms) for (let i = 0; i < count; i++) out.push(floret(-8.5 + r() * 17, -32 + r() * 16, 1.3, pick(r, blossoms)));
  return out;
}

function pine(snow) {
  const out = [el('path', { d: 'M-1 0L-0.7 -7L0.7 -7L1 0z', class: 'p-trunk' })];
  const layers = [[10, -6, -21], [8, -14, -29], [5.6, -22, -37.5]];
  for (const [w, y, top] of layers) {
    const mid = (y + top) / 2;
    out.push(el('path', { d: `M${n2(-w)} ${y}Q${n2(-w * 0.4)} ${n2(mid + 2)} 0 ${top}Q${n2(w * 0.4)} ${n2(mid + 2)} ${n2(w)} ${y}Q0 ${n2(y + 2.2)} ${n2(-w)} ${y}z`, class: 'p-canopy-pine' }));
    if (snow) {
      const sy = top + (y - top) * 0.3, sw = w * 0.26;
      out.push(el('path', { d: `M0 ${top}Q${n2(sw * 0.6)} ${n2(top + 2)} ${n2(sw)} ${n2(sy)}Q0 ${n2(sy - 1)} ${n2(-sw)} ${n2(sy)}Q${n2(-sw * 0.6)} ${n2(top + 2)} 0 ${top}z`, class: 'p-snow' }));
    }
  }
  return out;
}

// Grand trees: drawn larger, with a few drifting petals.
function grand(parts, r, c) {
  const extra = [];
  for (let i = 0; i < 4; i++) extra.push(petal(-15 + r() * 30, -44 + r() * 34, Math.round(r() * 180), 1.8, 1, c));
  return [el('g', { transform: 'scale(1.25)' }, ...parts), ...extra];
}

/** A plant as an SVG <g>, base at (0, 0). */
export function plant(kind, seed, title) {
  const g = el('g', { class: 'plant' }, ...(DRAW[kind] || DRAW.sprout)(rng(`look:${seed}`)));
  if (title) { const t = el('title'); t.textContent = title; g.prepend(t); }
  return g;
}

/** A plant in its own little <svg>, for legends. */
export function plantIcon(kind, seed, cls = 'plant-icon') {
  const hgt = Math.max(20, SPECIES[kind].h * (SPECIES[kind].min >= 90 ? 1.25 : 1) + 4);
  return el('svg', { viewBox: `${n2(-hgt / 2)} ${n2(-hgt + 1.5)} ${n2(hgt)} ${n2(hgt)}`, class: cls, 'aria-hidden': 'true' }, plant(kind, seed));
}

/**
 * One garden row: plants lined up along a soil line, evenly spaced.
 * items: [{ kind, seed, title }]
 */
export function gardenRow(items, label) {
  const W = 300, H = 46;
  const step = items.length > 1 ? Math.min(20, (W - 20) / (items.length - 1)) : 0;
  const svg = el('svg', { viewBox: `0 ${-H + 3} ${W} ${H}`, preserveAspectRatio: 'xMinYMax meet', class: 'garden-bed', role: 'img', 'aria-label': label });
  svg.append(el('path', { d: `M1 0.6H${W - 1}`, class: 'p-soil' }));
  items.forEach((it, i) => {
    const sp = SPECIES[it.kind];
    const k = Math.min(1, 42 / (sp.h * (sp.min >= 90 ? 1.25 : 1)));
    svg.append(el('g', { transform: `translate(${n2(10 + i * step)} 0) scale(${k})` }, plant(it.kind, it.seed, it.title)));
  });
  return svg;
}
