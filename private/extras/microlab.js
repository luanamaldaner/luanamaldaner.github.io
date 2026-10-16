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
  // real micrographs (generated) per step; [Gram-positive, Gram-negative]
  const IMG = [['staph-0', 'ecoli-0'], ['staph-1', 'ecoli-1'], ['staph-1', 'ecoli-1'], ['staph-1', 'ecoli-3'], ['staph-1', 'ecoli-4']][ms.g];
  const field = (fill, kind) => h('img', { class: 'ml-scope-img', src: `art/micro/${kind === 'cocci' ? IMG[0] : IMG[1]}.webp`, alt: `${kind === 'cocci' ? 'Staphylococcus' : 'E. coli'} under the microscope, ${GRAM[ms.g].name}`, loading: 'lazy' });
  return h('section', { class: 'card lab-card' },
    h('p', { class: 'bio-kicker', style: '--lc: var(--accent)', text: 'Gram stain' }),
    h('h2', { class: 'lab-title', text: s.name }),
    h('div', { class: 'ml-fields' },
      h('div', null, field(s.pos, 'cocci'), h('p', { class: 'small ml-cap' }, h('strong', { text: 'Gram-positive' }), ' · thick peptidoglycan, no outer membrane (e.g. Staphylococcus)')),
      h('div', null, field(s.neg, 'rods'), h('p', { class: 'small ml-cap' }, h('strong', { text: 'Gram-negative' }), ' · thin peptidoglycan + outer membrane (e.g. E. coli)'))),
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


// ---------------------------------------------------------------- name that shape (real-looking micrographs)
// Each organism shows its true arrangement and true Gram reaction.
const MORPH = [
  ['q-staph', 'Staphylococci (grape-like clusters)', 'pos', 'Staphylococcus aureus'],
  ['q-strep', 'Streptococci (chains of cocci)', 'pos', 'Streptococcus pyogenes'],
  ['q-diplo', 'Diplococci (pairs)', 'neg', 'Neisseria gonorrhoeae'],
  ['q-tetrad', 'Tetrads (groups of four)', 'pos', 'Micrococcus luteus'],
  ['q-bacilli', 'Bacilli (single rods)', 'pos', 'Bacillus subtilis'],
  ['q-strepto', 'Streptobacilli (chains of rods)', 'pos', 'Bacillus anthracis'],
  ['q-cocco', 'Coccobacilli (short ovals)', 'neg', 'Haemophilus influenzae'],
  ['q-vibrio', 'Vibrios (comma-shaped)', 'neg', 'Vibrio cholerae'],
  ['q-spiril', 'Spirilla (rigid spirals)', 'neg', 'Spirillum volutans'],
];
const mq = { cur: null, picked: null, gram: null, right: 0, total: 0, last: -1 };
function newMorph() {
  let k; do { k = Math.floor(Math.random() * MORPH.length); } while (k === mq.last && MORPH.length > 1);
  mq.last = k;
  const [img, name, gram, org] = MORPH[k];
  const others = MORPH.filter((_, i) => i !== k).map(m => m[1]).sort(() => Math.random() - 0.5).slice(0, 3);
  mq.cur = { img, name, gram, org, opts: [name, ...others].sort(() => Math.random() - 0.5) };
  mq.picked = null; mq.gram = null;
}
function morphView(C) {
  const { h } = C;
  if (!mq.cur) newMorph();
  const q = mq.cur;
  const done = mq.picked !== null && mq.gram !== null;
  const opt = (label, chosen, right, on) => h('button', { type: 'button', class: `q-opt${chosen !== null && label === right ? ' right' : chosen === label ? ' wrong' : ''}`, disabled: chosen !== null, onclick: on }, label);
  return h('section', { class: 'card lab-card' },
    h('div', { class: 'lab-top' }, h('p', { class: 'bio-kicker', style: '--lc: var(--accent)', text: 'Name that shape' }), h('span', { class: 'muted small', text: `${mq.right} / ${mq.total} right` })),
    h('div', { class: 'ml-morph' },
      h('img', { class: 'ml-scope-img', src: `art/micro/${q.img}.webp`, alt: 'A Gram-stained microscope field' }),
      h('div', { class: 'ml-qs' },
        h('p', { class: 'q-prompt', text: '1. What shape and arrangement is this?' }),
        h('div', { class: 'q-options lab-opts' }, q.opts.map(o => opt(o, mq.picked, q.name, () => { mq.picked = o; mq.total++; if (o === q.name) mq.right++; C.render(); }))),
        h('p', { class: 'q-prompt', text: '2. Gram result?' }),
        h('div', { class: 'q-options' }, ['Gram-positive', 'Gram-negative'].map(o => opt(o, mq.gram, q.gram === 'pos' ? 'Gram-positive' : 'Gram-negative', () => { mq.gram = o; C.render(); }))))),
    done ? h('div', { class: 'row' }, h('span', { class: 'small' }, h('em', { text: q.org }), ` · ${q.gram === 'pos' ? 'purple = Gram-positive (kept the crystal violet)' : 'pink = Gram-negative (took the safranin)'}`),
      h('button', { type: 'button', class: 'btn btn-primary', text: 'Next field →', onclick: () => { newMorph(); C.render(); } })) : null,
    h('p', { class: 'muted small', text: 'AI-generated micrographs made to match textbook images; real slides vary.' }));
}

export function microLabPage(C) {
  const { h } = C;
  return h('div', { class: 'lab-stack' }, gramView(C), morphView(C), dilutionView(C));
}
