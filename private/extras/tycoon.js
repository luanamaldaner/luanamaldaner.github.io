// Cell Tycoon: a tiny idle game. Correct answers anywhere pay 10 ATP each; organelles you
// build make ATP on their own (up to 8 hours while you're away). Spend ATP to grow your cell.

import { packState } from './packs.js?v=1';

const KEY = 'tycoon';
const ORGANELLES = [
  { id: 'ribo', name: 'Ribosomes', emoji: '🟣', base: 30, rate: 0.5, fact: 'Ribosomes read mRNA and build proteins, adding a few amino acids per second.' },
  { id: 'mito', name: 'Mitochondria', emoji: '🔋', base: 60, rate: 1.5, fact: 'Mitochondria make most of your ATP and have their own DNA, a leftover from an ancient bacterium.' },
  { id: 'er', name: 'Rough ER', emoji: '🌊', base: 120, rate: 3, fact: 'The rough ER is studded with ribosomes and folds proteins that will be secreted, like insulin.' },
  { id: 'golgi', name: 'Golgi apparatus', emoji: '📦', base: 250, rate: 6, fact: 'The Golgi tags and packages proteins, then ships them out in vesicles.' },
  { id: 'lyso', name: 'Lysosomes', emoji: '♻️', base: 500, rate: 12, fact: 'Lysosomes hold acid hydrolases that recycle worn-out parts (autophagy).' },
  { id: 'nucleus', name: 'Nucleolus boost', emoji: '🧠', base: 1000, rate: 25, fact: 'The nucleolus builds ribosome subunits, so more nucleolus = more protein factories.' },
  { id: 'cilia', name: 'Cilia', emoji: '〰️', base: 2000, rate: 50, fact: 'Cilia beat in waves; in your airway they sweep mucus up and out (the mucociliary escalator).' },
];
const cost = (o, lvl) => Math.round(o.base * Math.pow(1.6, lvl));

function load() { try { return { atp: 0, lv: {}, last: Date.now(), paid: null, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { return { atp: 0, lv: {}, last: Date.now(), paid: null }; } }
function save(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {} }
const perMin = g => ORGANELLES.reduce((a, o) => a + o.rate * (g.lv[o.id] || 0), 0);

function settle() {
  const g = load();
  const now = Date.now();
  const mins = Math.min(8 * 60, (now - g.last) / 60e3);
  const idle = perMin(g) * mins;
  const correct = packState().correct;
  if (g.paid === null) g.paid = Math.max(0, correct - 5); // start with a small welcome bonus
  const earned = Math.max(0, correct - g.paid) * 10;
  g.paid = correct;
  g.atp += idle + earned;
  g.last = now;
  save(g);
  return { g, idle, earned };
}

let tick = null, lastGain = null;
export function tycoonPage(C) {
  const { h, card } = C;
  const { g, idle, earned } = settle();
  if (idle + earned >= 1) lastGain = { idle: Math.round(idle), earned };
  clearInterval(tick);
  const atpEl = h('strong', { class: 'ty-atp-n', text: Math.floor(g.atp).toLocaleString() });
  tick = setInterval(() => { if (!atpEl.isConnected) { clearInterval(tick); return; } const s = settle(); atpEl.textContent = Math.floor(s.g.atp).toLocaleString(); }, 3000);

  // the cell drawing grows one organelle icon per level
  const dots = [];
  ORGANELLES.forEach((o, k) => { for (let i = 0; i < Math.min(8, g.lv[o.id] || 0); i++) { const a = (k * 0.9 + i * 0.78) % (2 * Math.PI), r = 30 + ((k * 13 + i * 17) % 55); dots.push(h('span', { class: 'ty-dot', style: `left:${(50 + r * Math.cos(a) * 0.82).toFixed(1)}%;top:${(50 + r * Math.sin(a) * 0.62).toFixed(1)}%`, text: o.emoji })); } });
  const level = ORGANELLES.reduce((a, o) => a + (g.lv[o.id] || 0), 0);

  return h('div', { class: 'grid orgo-grid' },
    h('div', { class: 'col' }, h('section', { class: 'card lab-card ty' },
      h('div', { class: 'ty-top' },
        h('div', null, h('p', { class: 'bio-kicker', style: '--lc: var(--accent)', text: `Cell level ${level}` }), h('h2', { class: 'lab-title', text: 'Cell Tycoon' })),
        h('div', { class: 'ty-atp' }, '⚡ ', atpEl, h('span', { class: 'muted small', text: ` ATP · +${perMin(g).toFixed(1)}/min` }))),
      lastGain && (lastGain.idle || lastGain.earned) ? h('p', { class: 'small ty-gain', text: `Welcome back! +${lastGain.earned} ATP from correct answers${lastGain.idle ? `, +${lastGain.idle} while you were away` : ''}.` }) : null,
      h('div', { class: 'ty-cell', 'aria-hidden': 'true' }, h('span', { class: 'ty-nuc' }), ...dots),
      h('p', { class: 'muted small', text: 'Every correct answer anywhere on the dashboard pays 10 ATP. Organelles keep producing for up to 8 hours while you’re away.' }))),
    h('div', { class: 'col col-narrow' }, card('Build', null, h('ul', { class: 'ty-shop' }, ORGANELLES.map(o => {
      const lv = g.lv[o.id] || 0, c = cost(o, lv);
      return h('li', { class: 'ty-item' },
        h('span', { class: 'ty-em', text: o.emoji }),
        h('span', { class: 'ty-txt' }, h('strong', { text: `${o.name}${lv ? ` · lv ${lv}` : ''}` }), h('span', { class: 'muted small', text: lv ? o.fact : `+${o.rate} ATP/min each` })),
        h('button', { type: 'button', class: 'btn btn-small', disabled: g.atp < c, text: `${c.toLocaleString()} ⚡`, onclick: () => { const s = settle().g; if (s.atp < c) return; s.atp -= c; s.lv[o.id] = lv + 1; save(s); lastGain = null; C.render(); } }));
    })))));
}
