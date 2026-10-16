// Daily boss: one exam-level question a day, rotating Bio → Orgo → Prog → cross-course.
// Same question all day on every device (picked from the date); one try. Streak = days in a row beaten.

import L1 from '../bio/l1.js?v=2';
import L2 from '../bio/l2.js?v=2';
import L3 from '../bio/l3.js?v=2';
import L4 from '../bio/l4.js?v=2';
import L5 from '../bio/l5.js?v=2';
import L6 from '../bio/l6.js?v=2';
import L7 from '../bio/l7.js?v=2';
import L8 from '../bio/l8.js?v=2';
import L9 from '../bio/l9.js?v=2';
import L10 from '../bio/l10.js?v=2';
import { SUBSTRATES, REAGENTS, decide, OUTCOME_LABELS } from '../orgo/content.js?v=3';
import { MOCK_MCQ } from '../prog/extra.js?v=1';

const LECS = [L1, L2, L3, L4, L5, L6, L7, L8, L9, L10];
let CONNECTIONS = null;
import('./connections.js?v=1').then(m => { CONNECTIONS = m.CONNECTIONS; }).catch(() => { CONNECTIONS = []; });

function load() { try { return JSON.parse(localStorage.getItem('boss.log') || '{}'); } catch { return {}; } }
function save(v) { try { localStorage.setItem('boss.log', JSON.stringify(v)); } catch {} }

// small seeded RNG so the day's question (and option order) is stable
function rng(seed) { let x = 0; for (const ch of seed) x = (x * 31 + ch.charCodeAt(0)) | 0; return () => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return ((x >>> 0) % 1e6) / 1e6; }; }
const pickR = (r, a) => a[Math.floor(r() * a.length)];
const shuffleR = (r, a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

function question(day) {
  const r = rng(`boss:${day}`);
  const n = Math.round(new Date(day + 'T12:00:00') / 864e5);
  const kinds = ['bio', 'orgo', 'prog', 'conn'];
  let kind = kinds[n % 4];
  if (kind === 'conn' && !(CONNECTIONS && CONNECTIONS.length)) kind = 'bio';
  if (kind === 'bio') {
    const L = pickR(r, LECS), q = pickR(r, L.quiz);
    return { kind, label: `Bio · Lecture ${L.n}`, q: q.q, a: q.a, opts: shuffleR(r, [q.a, ...q.o]), why: q.why, go: 'bio' };
  }
  if (kind === 'orgo') {
    const sub = pickR(r, SUBSTRATES.filter(s => s.cls !== 'methyl')), rg = pickR(r, REAGENTS);
    const solvent = rg.type === 'weak' ? 'protic' : r() < 0.6 ? 'aprotic' : 'protic', heat = rg.type !== 'nuc' && r() < 0.5;
    const d = decide({ cls: sub.cls, reagent: rg.id, solvent, heat, rearr: sub.rearr });
    const solv = rg.type === 'weak' ? '(solvent)' : solvent === 'aprotic' ? 'in DMSO' : 'in EtOH';
    return { kind, label: 'Orgo · mechanism', q: `${sub.name} + ${rg.f} ${solv}${heat ? ', heat' : ''}. Which mechanism(s)?`, a: d.label, opts: shuffleR(r, [d.label, ...shuffleR(r, OUTCOME_LABELS.filter(x => x !== d.label)).slice(0, 3)]), why: [...d.why, ...d.result].join(' '), go: 'orgo' };
  }
  if (kind === 'prog') {
    const q = pickR(r, MOCK_MCQ);
    return { kind, label: `Prog · ${q.topic}`, q: q.prompt || 'What does this print?', code: q.code, a: q.answer, opts: shuffleR(r, q.options), why: q.why, go: 'prog' };
  }
  const q = pickR(r, CONNECTIONS);
  return { kind, label: `Cross-course · ${q.tags.join(' ↔ ')}`, q: q.q, a: q.a, opts: shuffleR(r, [q.a, ...q.o]), why: q.why, go: null };
}

function streak(log, today, addDays) {
  let n = 0, d = today;
  if (!log[d]) d = addDays(d, -1);
  while (log[d] && log[d].ok) { n++; d = addDays(d, -1); }
  return n;
}

export function bossCard(C) {
  const { h, card } = C;
  const today = C.todayStr();
  const Q = question(today);
  const log = load();
  const mine = log[today];
  const st = streak(log, today, C.addDays);
  const beaten = Object.values(log).filter(x => x.ok).length;
  return h('section', { class: `card boss${mine ? (mine.ok ? ' won' : ' lost') : ''}` },
    h('header', { class: 'card-head' }, h('h2', { text: 'Daily boss 👾' }), h('span', { class: 'card-meta', text: `🔥 ${st} · ${beaten} beaten` })),
    h('p', { class: 'boss-label', text: Q.label }),
    h('p', { class: 'boss-q', text: Q.q }),
    Q.code ? h('pre', { class: 'boss-code', text: Q.code }) : null,
    h('div', { class: 'boss-opts' }, Q.opts.map(o => {
      let cls = 'q-opt';
      if (mine && o === Q.a) cls += ' right'; else if (mine && o === mine.pick) cls += ' wrong';
      return h('button', { type: 'button', class: cls, disabled: !!mine, onclick: () => { const l = load(); l[today] = { pick: o, ok: o === Q.a }; save(l); C.render(); } }, o);
    })),
    mine ? h('div', { class: `q-feedback ${mine.ok ? 'ok' : 'no'}` },
      h('strong', { text: mine.ok ? 'Boss defeated ✿ Come back tomorrow for the next one.' : 'The boss wins today. Here’s why:' }),
      h('p', { class: 'small', text: Q.why }),
      Q.go ? h('button', { type: 'button', class: 'link small', text: 'Practice this topic →', onclick: () => C.go(Q.go) }) : null) : h('p', { class: 'muted small', text: 'One try. Beat it to keep your streak.' }));
}
