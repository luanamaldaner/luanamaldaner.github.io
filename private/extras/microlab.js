// Micro lab: tap through a Gram stain, and run a serial dilution + plate count (CFU/mL).

const GRAM = [
  { name: 'Heat-fixed smear', pos: '#eceae4', neg: '#eceae4', text: 'Cells are dried and heat-fixed on the slide so they stick. They look almost invisible.' },
  { name: '1 · Crystal violet (primary stain)', pos: '#6b3fb5', neg: '#6b3fb5', text: 'The purple dye soaks into every cell. Gram-positive and Gram-negative both turn purple.' },
  { name: '2 · Iodine (mordant)', pos: '#4f2a90', neg: '#4f2a90', text: 'Iodine binds crystal violet into a big crystal violet–iodine complex that’s hard to wash out. Still all purple.' },
  { name: '3 · Alcohol (decolorizer)', pos: '#4f2a90', neg: '#eceae4', text: 'The key step. Alcohol dehydrates the thick peptidoglycan of Gram-positives and traps the dye. In Gram-negatives it dissolves the outer membrane, and the thin wall lets the dye wash out: they go colorless.' },
  { name: '4 · Safranin (counterstain)', pos: '#4f2a90', neg: '#e06a8c', text: 'The pink counterstain colors the now-clear Gram-negatives. Final result: Gram-positive = purple, Gram-negative = pink.' },
];

const ms = { g: 0, factor: 10, tubes: 6, plated: 0.1, from: 6, colonies: 87 };

function gramView(C) {
  const { h } = C;
  const s = GRAM[ms.g];
  const rod = (x, y, rot, fill, wall) => h('span', { class: 'ml-rod', style: `left:${x}%;top:${y}%;transform:rotate(${rot}deg);background:${fill};box-shadow:0 0 0 ${wall}px rgba(0,0,0,.08)` });
  const field = (fill, wall, seed) => h('div', { class: 'ml-field' }, [0, 1, 2, 3, 4, 5, 6].map(i => rod(12 + ((i * 37 + seed) % 72), 14 + ((i * 53 + seed) % 64), (i * 47 + seed) % 180, fill, wall)));
  return h('section', { class: 'card lab-card' },
    h('p', { class: 'bio-kicker', style: '--lc: var(--accent)', text: 'Gram stain' }),
    h('h2', { class: 'lab-title', text: s.name }),
    h('div', { class: 'ml-fields' },
      h('div', null, field(s.pos, 3, 5), h('p', { class: 'small ml-cap' }, h('strong', { text: 'Gram-positive' }), ' · thick peptidoglycan, no outer membrane (e.g. Staphylococcus)')),
      h('div', null, field(s.neg, 1, 19), h('p', { class: 'small ml-cap' }, h('strong', { text: 'Gram-negative' }), ' · thin peptidoglycan + outer membrane (e.g. E. coli)'))),
    h('p', { text: s.text }),
    h('div', { class: 'row' },
      h('button', { type: 'button', class: 'btn', text: '← Back', disabled: ms.g === 0, onclick: () => { ms.g--; C.render(); } }),
      h('div', { class: 'bio-walk-dots' }, GRAM.map((_, i) => h('button', { type: 'button', class: `bio-walk-dot${i === ms.g ? ' on' : i < ms.g ? ' past' : ''}`, 'aria-label': GRAM[i].name, onclick: () => { ms.g = i; C.render(); } }))),
      h('button', { type: 'button', class: 'btn btn-primary', text: ms.g + 1 < GRAM.length ? 'Next step →' : 'Start over', onclick: () => { ms.g = (ms.g + 1) % GRAM.length; C.render(); } })),
    ms.g === 3 ? h('p', { class: 'muted small', text: 'Exam trap: over-decolorizing (too much alcohol) makes Gram-positives look pink too; under-decolorizing leaves Gram-negatives purple.' }) : null);
}

function dilutionView(C) {
  const { h } = C;
  const num = (label, key, opts) => h('label', { class: 'ml-in' }, h('span', { class: 'small', text: label }),
    h('select', { onchange: e => { ms[key] = Number(e.target.value); if (key === 'tubes' && ms.from > ms.tubes) ms.from = ms.tubes; C.render(); } }, opts.map(([v, t]) => h('option', { value: v, text: t, selected: ms[key] === v }))));
  const tubes = Array.from({ length: ms.tubes }, (_, i) => i + 1);
  const dil = Math.pow(ms.factor, ms.from); // total dilution of the plated tube
  const cfu = ms.colonies / (ms.plated * (1 / dil));
  const sci = n => { if (!isFinite(n) || n <= 0) return '—'; const e = Math.floor(Math.log10(n)); return `${(n / Math.pow(10, e)).toFixed(2)} × 10^${e}`; };
  const countable = ms.colonies >= 30 && ms.colonies <= 300;
  return h('section', { class: 'card lab-card' },
    h('p', { class: 'bio-kicker', style: '--lc: var(--accent)', text: 'Serial dilution & plate count' }),
    h('h2', { class: 'lab-title', text: 'How many bacteria were in the original tube?' }),
    h('div', { class: 'ml-row' },
      num('Each step dilutes', 'factor', [[10, '1:10 (1 mL into 9 mL)'], [100, '1:100 (0.1 mL into 9.9 mL)']]),
      num('Tubes', 'tubes', [4, 5, 6, 7, 8].map(n => [n, String(n)])),
      num('You plate tube #', 'from', tubes.map(n => [n, String(n)])),
      num('Volume plated', 'plated', [[0.1, '0.1 mL'], [1, '1 mL']])),
    h('div', { class: 'ml-tubes' }, tubes.map(i => h('button', { type: 'button', class: `ml-tube${i === ms.from ? ' on' : ''}`, onclick: () => { ms.from = i; C.render(); } },
      h('span', { class: 'ml-liquid', style: `opacity:${Math.max(0.08, 1 - i / (ms.tubes + 1)).toFixed(2)}` }),
      h('span', { class: 'ml-tlabel', text: `10^-${Math.round(Math.log10(Math.pow(ms.factor, i)))}` })))),
    h('label', { class: 'ml-in' }, h('span', { class: 'small', text: 'Colonies counted on the plate' }),
      h('input', { type: 'number', min: 0, max: 2000, value: ms.colonies, onchange: e => { ms.colonies = Math.max(0, Number(e.target.value) || 0); C.render(); } })),
    h('div', { class: 'ml-result' },
      h('p', { class: 'small' }, h('strong', { text: 'CFU/mL = colonies ÷ (volume plated × dilution)' })),
      h('p', { class: 'small', text: `= ${ms.colonies} ÷ (${ms.plated} mL × 10^-${Math.round(Math.log10(dil))})` }),
      h('p', { class: 'ml-big', text: `${sci(cfu)} CFU/mL` }),
      h('p', { class: `small ${countable ? 'ml-ok' : 'ml-warn'}`, text: countable ? '✓ 30–300 colonies: a countable plate, so this estimate is trustworthy.' : ms.colonies > 300 ? '⚠ Over 300 colonies is "too numerous to count": use a more diluted tube.' : '⚠ Under 30 colonies is too few to be reliable: use a less diluted tube.' })));
}


// ---------------------------------------------------------------- name that shape (drawn micrographs)
const NS = 'http://www.w3.org/2000/svg';
const S_ = (tag, a, p) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(a)) e.setAttribute(k, v); if (p) p.append(e); return e; };
const SHAPES = {
  'Diplococci': (g, c) => { for (const [x, y] of [[60, 60], [150, 110], [90, 160], [190, 50]]) { S_('circle', { cx: x, cy: y, r: 9, fill: c }, g); S_('circle', { cx: x + 18, cy: y, r: 9, fill: c }, g); } },
  'Streptococci': (g, c) => { for (const [x0, y0, dx, dy] of [[30, 50, 17, 4], [60, 150, 16, -6], [140, 90, 12, 12]]) for (let i = 0; i < 6; i++) S_('circle', { cx: x0 + i * dx, cy: y0 + i * dy, r: 8, fill: c }, g); },
  'Staphylococci': (g, c) => { for (const [x0, y0] of [[70, 80], [170, 140]]) for (let i = 0; i < 11; i++) S_('circle', { cx: x0 + ((i * 37) % 50) - 25, cy: y0 + ((i * 53) % 44) - 22, r: 8, fill: c }, g); },
  'Tetrads': (g, c) => { for (const [x, y] of [[50, 50], [150, 70], [80, 150], [190, 160]]) for (const [a, b] of [[0, 0], [17, 0], [0, 17], [17, 17]]) S_('circle', { cx: x + a, cy: y + b, r: 8, fill: c }, g); },
  'Bacilli (single rods)': (g, c) => { for (const [x, y, r] of [[50, 50, 20], [150, 60, -30], [90, 140, 60], [180, 150, 10], [40, 180, -60]]) S_('rect', { x: x - 18, y: y - 6, width: 36, height: 12, rx: 6, fill: c, transform: `rotate(${r} ${x} ${y})` }, g); },
  'Streptobacilli': (g, c) => { for (const [x0, y0, ang] of [[25, 60, 8], [40, 160, -12]]) for (let i = 0; i < 5; i++) { const x = x0 + i * 40 * Math.cos(ang * Math.PI / 180), y = y0 + i * 40 * Math.sin(ang * Math.PI / 180); S_('rect', { x: x, y: y - 6, width: 37, height: 12, rx: 6, fill: c, transform: `rotate(${ang} ${x} ${y})` }, g); } },
  'Coccobacilli': (g, c) => { for (let i = 0; i < 12; i++) S_('ellipse', { cx: 30 + ((i * 61) % 180), cy: 30 + ((i * 41) % 160), rx: 11, ry: 7, fill: c, transform: `rotate(${(i * 47) % 180} ${30 + ((i * 61) % 180)} ${30 + ((i * 41) % 160)})` }, g); },
  'Vibrios (comma-shaped)': (g, c) => { for (const [x, y, r] of [[60, 60, 0], [150, 80, 40], [80, 150, -30], [180, 160, 80]]) S_('path', { d: `M${x - 16} ${y} q16 -14 32 0`, stroke: c, 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round', transform: `rotate(${r} ${x} ${y})` }, g); },
  'Spirilla (rigid spirals)': (g, c) => { for (const [x, y, r] of [[40, 70, 10], [60, 160, -15]]) S_('path', { d: `M${x} ${y} q12 -16 24 0 t24 0 t24 0 t24 0`, stroke: c, 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round', transform: `rotate(${r} ${x} ${y})` }, g); },
  'Spirochetes (thin, tight coils)': (g, c) => { for (const [x, y, r] of [[30, 60, 5], [40, 150, -10]]) { let d = `M${x} ${y}`; for (let i = 0; i < 18; i++) d += ` q4 ${i % 2 ? 7 : -7} 8 0`; S_('path', { d, stroke: c, 'stroke-width': 2.5, fill: 'none', transform: `rotate(${r} ${x} ${y})` }, g); } },
};
const SHAPE_NAMES = Object.keys(SHAPES);
const COLORS = { pos: '#5b2fa0', neg: '#df5f88' };
const mq = { cur: null, picked: null, gram: null, right: 0, total: 0 };
function newMorph() {
  const name = SHAPE_NAMES[Math.floor(Math.random() * SHAPE_NAMES.length)];
  const gram = Math.random() < 0.5 ? 'pos' : 'neg';
  const others = SHAPE_NAMES.filter(n => n !== name).sort(() => Math.random() - 0.5).slice(0, 3);
  mq.cur = { name, gram, opts: [name, ...others].sort(() => Math.random() - 0.5) };
  mq.picked = null; mq.gram = null;
}
function morphView(C) {
  const { h } = C;
  if (!mq.cur) newMorph();
  const q = mq.cur;
  const svg = S_('svg', { viewBox: '0 0 240 220', class: 'ml-micro', role: 'img', 'aria-label': 'Drawn microscope field' });
  S_('rect', { x: 0, y: 0, width: 240, height: 220, fill: '#fbf9f2' }, svg);
  SHAPES[q.name](S_('g', { opacity: 0.92 }, svg), COLORS[q.gram]);
  const done = mq.picked !== null && mq.gram !== null;
  const opt = (label, chosen, right, on) => h('button', { type: 'button', class: `q-opt${chosen !== null && label === right ? ' right' : chosen === label ? ' wrong' : ''}`, disabled: chosen !== null, onclick: on }, label);
  return h('section', { class: 'card lab-card' },
    h('div', { class: 'lab-top' }, h('p', { class: 'bio-kicker', style: '--lc: var(--accent)', text: 'Name that shape' }), h('span', { class: 'muted small', text: `${mq.right} / ${mq.total} right` })),
    h('div', { class: 'ml-morph' },
      h('div', { class: 'ml-scope' }, svg),
      h('div', { class: 'ml-qs' },
        h('p', { class: 'q-prompt', text: '1. What shape and arrangement is this?' }),
        h('div', { class: 'q-options lab-opts' }, q.opts.map(o => opt(o, mq.picked, q.name, () => { mq.picked = o; mq.total++; if (o === q.name) mq.right++; C.render(); }))),
        h('p', { class: 'q-prompt', text: '2. Gram result?' }),
        h('div', { class: 'q-options' }, ['Gram-positive', 'Gram-negative'].map(o => opt(o, mq.gram, q.gram === 'pos' ? 'Gram-positive' : 'Gram-negative', () => { mq.gram = o; C.render(); }))))),
    done ? h('div', { class: 'row' }, h('span', { class: 'small', text: `${q.gram === 'pos' ? 'Purple = Gram-positive (kept the crystal violet).' : 'Pink = Gram-negative (took the safranin).'}` }),
      h('button', { type: 'button', class: 'btn btn-primary', text: 'Next field →', onclick: () => { newMorph(); C.render(); } })) : null,
    h('p', { class: 'muted small', text: 'These are drawings, not real micrographs, so you can practice the shapes and arrangements.' }));
}

export function microLabPage(C) {
  const { h } = C;
  return h('div', { class: 'lab-stack' }, gramView(C), morphView(C), dilutionView(C));
}
