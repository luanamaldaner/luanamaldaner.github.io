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

export function microLabPage(C) {
  const { h } = C;
  return h('div', { class: 'lab-stack' }, gramView(C), dilutionView(C));
}
