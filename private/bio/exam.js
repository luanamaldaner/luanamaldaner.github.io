// Bio mock exam: a timed mix of questions from the chosen lectures (each lecture's quiz plus
// the quick checks from its guided lecture). No feedback until you submit, like the real thing;
// then a score per lecture and every miss explained. Saved in localStorage so a refresh keeps it.

import { addCorrect } from '../extras/packs.js?v=1';

const COUNTS = [20, 40, 60];
const SEC_PER_Q = 72; // ~1.2 min per question

function load(k, fb) { try { const v = localStorage.getItem(`bio.${k}`); return v === null ? fb : JSON.parse(v); } catch { return fb; } }
function store(k, v) { try { localStorage.setItem(`bio.${k}`, JSON.stringify(v)); } catch {} }
function drop(k) { try { localStorage.removeItem(`bio.${k}`); } catch {} }
function shuffled(a) { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

let POOL = null; // id -> { id, lec, q, a, o, why }
function pool(LECTURES, WALKS) {
  if (POOL) return POOL;
  POOL = new Map();
  for (const L of LECTURES) {
    (L.quiz || []).forEach((q, i) => POOL.set(`${L.id}:q${i}`, { id: `${L.id}:q${i}`, lec: L.id, ...q }));
    (WALKS[L.id] || []).forEach((s, i) => { if (s.check) POOL.set(`${L.id}:w${i}`, { id: `${L.id}:w${i}`, lec: L.id, ...s.check }); });
  }
  return POOL;
}

const es = { pick: null, count: 40, timer: null };

function newExam(P, lecs, count) {
  const seen = new Set(load('examSeen', []));
  const fresh = l => [...shuffled(l.filter(q => !seen.has(q.id))), ...shuffled(l.filter(q => seen.has(q.id)))];
  const by = lecs.map(id => fresh([...P.values()].filter(q => q.lec === id)));
  const ids = [];
  for (let k = 0; ids.length < count && by.some(l => l.length); k++) { const l = by[k % by.length]; if (l.length) ids.push(l.shift().id); }
  const order = shuffled(ids);
  const opts = {};
  for (const id of order) { const q = P.get(id); opts[id] = shuffled([q.a, ...q.o]); }
  const now = Date.now();
  return { lecs, ids: order, opts, answers: {}, flags: [], i: 0, limit: order.length * SEC_PER_Q * 1000, elapsed: 0, since: now, submitted: false };
}

const left = ex => ex.limit - ex.elapsed - (ex.since ? Date.now() - ex.since : 0);
const clock = ms => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };

function score(ex, P) {
  const per = {}; let got = 0;
  for (const id of ex.ids) {
    const q = P.get(id); const ok = ex.answers[id] === q.a ? 1 : 0; got += ok;
    const x = per[q.lec] || (per[q.lec] = { got: 0, max: 0 }); x.got += ok; x.max++;
  }
  return { got, max: ex.ids.length, pct: Math.round(100 * got / Math.max(1, ex.ids.length)), per };
}

export function examPage(C, LECTURES, WALKS) {
  const P = pool(LECTURES, WALKS);
  if (es.timer) { clearInterval(es.timer); es.timer = null; }
  const ex = load('exam', null);
  if (!ex) return intro(C, LECTURES, P);
  if (!ex.submitted && left(ex) <= 0) { finish(ex, P); }
  return ex.submitted ? results(C, LECTURES, P, ex) : running(C, LECTURES, P, ex);
}

function finish(ex, P) {
  if (ex.since) { ex.elapsed += Date.now() - ex.since; ex.since = null; }
  ex.submitted = true; ex.finishedAt = Date.now();
  const sc = score(ex, P);
  addCorrect(sc.got);
  store('examHistory', [...load('examHistory', []), { at: ex.finishedAt, pct: sc.pct, got: sc.got, max: sc.max, lecs: ex.lecs, per: sc.per }].slice(-10));
  store('examSeen', [...load('examSeen', []), ...ex.ids].slice(-120));
  store('exam', ex);
}

function history(C, LECTURES) {
  const { h, card } = C;
  const hist = load('examHistory', []);
  if (!hist.length) return null;
  const nm = ids => ids.length === LECTURES.length ? 'All' : `L${ids.map(i => i.slice(1)).join(', L')}`;
  return card('Past attempts', null, h('ol', { class: 'prog-history' }, hist.slice().reverse().map(a => h('li', { title: nm(a.lecs) },
    h('span', { text: new Date(a.at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) }),
    h('span', { class: 'prog-history-bar' }, h('span', { style: `width:${a.pct}%` })),
    h('strong', { text: `${a.pct}%` })))));
}

function intro(C, LECTURES, P) {
  const { h, card } = C;
  if (!es.pick) es.pick = new Set(load('examPick', LECTURES.map(l => l.id)));
  const avail = [...P.values()].filter(q => es.pick.has(q.lec)).length;
  const n = Math.min(es.count, avail);
  const toggle = id => { if (es.pick.has(id)) es.pick.delete(id); else es.pick.add(id); store('examPick', [...es.pick]); C.render(); };
  return h('div', { class: 'bio-layout' },
    h('div', { class: 'bio-main' },
      h('section', { class: 'card bio-exam' },
        h('p', { class: 'bio-kicker', style: '--lc: var(--accent)', text: 'Bio 2 · practice test' }),
        h('h2', { class: 'bio-intro-title', text: 'Mock exam' }),
        h('p', { text: 'Questions mixed from the lectures you pick: the end-of-lecture quizzes plus the quick checks from the guided lectures. No answers until you submit, just like the real test.' }),
        h('h3', { class: 'bio-sub-h', text: 'Which lectures?' }),
        h('div', { class: 'chips bio-exam-lecs' },
          LECTURES.map(l => h('button', { type: 'button', class: `chip chip-btn${es.pick.has(l.id) ? ' on' : ''}`, style: `--lc: var(${l.color})`, onclick: () => toggle(l.id) }, `L${l.n} ${l.short}`)),
          h('button', { type: 'button', class: 'link small', text: es.pick.size === LECTURES.length ? 'Clear' : 'All', onclick: () => { es.pick = es.pick.size === LECTURES.length ? new Set() : new Set(LECTURES.map(l => l.id)); store('examPick', [...es.pick]); C.render(); } })),
        h('h3', { class: 'bio-sub-h', text: 'How long?' }),
        h('div', { class: 'chips' }, COUNTS.map(c => h('button', { type: 'button', class: `chip chip-btn${es.count === c ? ' on' : ''}`, onclick: () => { es.count = c; C.render(); } }, `${c} questions`))),
        h('p', { class: 'muted small', text: avail ? `${n} questions · ${Math.round(n * SEC_PER_Q / 60)} minutes · ${avail} in the pool for these lectures` : 'Pick at least one lecture.' }),
        h('div', { class: 'row' }, h('button', {
          type: 'button', class: 'btn btn-primary', disabled: !avail,
          onclick: () => { store('exam', newExam(P, LECTURES.filter(l => es.pick.has(l.id)).map(l => l.id), n)); C.render(); window.scrollTo({ top: 0, behavior: 'smooth' }); },
        }, 'Start the exam'),
        h('button', { type: 'button', class: 'btn', disabled: !avail, onclick: () => printExam(C, LECTURES, P, newExam(P, LECTURES.filter(l => es.pick.has(l.id)).map(l => l.id), n)) }, '🖨️ Print a paper version')))),
    h('aside', { class: 'bio-side' },
      history(C, LECTURES),
      null));
}

function running(C, LECTURES, P, ex) {
  const { h } = C;
  const save = () => store('exam', ex);
  const id = ex.ids[ex.i];
  const q = P.get(id);
  const L = LECTURES.find(l => l.id === q.lec);
  const paused = !ex.since;
  const done = ex.ids.filter(x => ex.answers[x] !== undefined).length;
  const tEl = h('strong', { class: 'bio-exam-clock', text: clock(left(ex)) });
  if (!paused) es.timer = setInterval(() => {
    if (!tEl.isConnected) { clearInterval(es.timer); es.timer = null; return; }
    const ms = left(ex); tEl.textContent = clock(ms);
    tEl.classList.toggle('low', ms < 5 * 60e3);
    if (ms <= 0) { clearInterval(es.timer); es.timer = null; finish(ex, P); C.render(); }
  }, 1000);
  const go = i => { ex.i = Math.max(0, Math.min(ex.ids.length - 1, i)); save(); C.render(); };
  const flagged = ex.flags.includes(id);
  const submit = () => {
    const blank = ex.ids.length - done;
    if (blank && !es.sure) { es.sure = true; C.render(); return; }
    es.sure = false; finish(ex, P); C.render(); window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return h('div', { class: 'bio-main bio-exam-run' },
    h('section', { class: `card bio-exam${paused ? ' is-paused' : ''}`, style: `--lc: var(${L.color})` },
      h('div', { class: 'bio-exam-top' },
        h('span', { class: 'muted small', text: `Question ${ex.i + 1} of ${ex.ids.length} · ${done} answered` }),
        h('span', { class: 'bio-exam-time' }, '⏱ ', tEl,
          h('button', { type: 'button', class: 'link small', text: paused ? 'Resume' : 'Pause', onclick: () => {
            if (paused) ex.since = Date.now(); else { ex.elapsed += Date.now() - ex.since; ex.since = null; }
            save(); C.render();
          } }))),
      h('div', { class: 'bio-walk-bar' }, h('span', { style: `width:${(100 * done / ex.ids.length).toFixed(1)}%` })),
      paused ? h('p', { class: 'bio-exam-paused', text: 'Paused. The clock is stopped ✿' }) : null,
      h('p', { class: 'bio-kicker', text: `Lecture ${L.n} · ${L.short}` }),
      h('p', { class: 'q-prompt', text: q.q }),
      h('div', { class: 'q-options' }, ex.opts[id].map(o => h('button', {
        type: 'button', class: `q-opt${ex.answers[id] === o ? ' chosen' : ''}`, disabled: paused,
        onclick: () => { ex.answers[id] = o; save(); C.render(); },
      }, o))),
      h('div', { class: 'bio-walk-nav' },
        h('button', { type: 'button', class: 'btn', text: '← Back', disabled: ex.i === 0, onclick: () => go(ex.i - 1) }),
        h('button', { type: 'button', class: `btn btn-small${flagged ? ' btn-primary' : ''}`, text: flagged ? '⚑ Flagged' : '⚐ Flag', onclick: () => { ex.flags = flagged ? ex.flags.filter(x => x !== id) : [...ex.flags, id]; save(); C.render(); } }),
        ex.i + 1 < ex.ids.length
          ? h('button', { type: 'button', class: 'btn btn-primary', text: 'Next →', onclick: () => go(ex.i + 1) })
          : h('button', { type: 'button', class: 'btn btn-primary', text: 'Submit', onclick: submit }))),
    h('section', { class: 'card' },
      h('div', { class: 'bio-exam-grid', role: 'list', 'aria-label': 'All questions' }, ex.ids.map((x, i) => h('button', {
        type: 'button', role: 'listitem',
        class: `bio-exam-cell${i === ex.i ? ' on' : ''}${ex.answers[x] !== undefined ? ' ans' : ''}${ex.flags.includes(x) ? ' flag' : ''}`,
        'aria-label': `Question ${i + 1}${ex.answers[x] !== undefined ? ', answered' : ''}${ex.flags.includes(x) ? ', flagged' : ''}`,
        text: String(i + 1), onclick: () => go(i),
      }))),
      es.sure ? h('p', { class: 'bio-exam-warn', text: `${ex.ids.length - done} question${ex.ids.length - done === 1 ? ' is' : 's are'} still blank. Tap Submit again to hand it in anyway.` }) : null,
      h('div', { class: 'row' },
        h('button', { type: 'button', class: 'btn btn-primary', text: 'Submit exam', onclick: submit }),
        h('button', { type: 'button', class: 'link small', text: 'Quit (throws this attempt away)', onclick: () => { if (es.quit) { es.quit = false; drop('exam'); C.render(); } else { es.quit = true; C.render(); } } }),
        es.quit ? h('span', { class: 'small bio-exam-warn', text: 'Tap Quit again to confirm.' }) : null)));
}

function results(C, LECTURES, P, ex) {
  const { h, card } = C;
  const sc = score(ex, P);
  const verdict = sc.pct >= 90 ? 'Excellent. You’re ready ✿' : sc.pct >= 80 ? 'Solid. Review the misses below.' : sc.pct >= 70 ? 'Getting there. Focus on your weakest lecture.' : 'Keep going. Start with the guided lecture for the red bars.';
  const rows = LECTURES.filter(l => sc.per[l.id]).map(l => {
    const x = sc.per[l.id]; const pct = Math.round(100 * x.got / x.max);
    return h('li', { class: 'prog-topic-row' },
      h('span', { class: 'prog-topic-name', text: `L${l.n} ${l.short}` }),
      h('span', { class: `prog-topic-bar${pct < 60 ? ' weak' : ''}` }, h('span', { style: `width:${pct}%` })),
      h('span', { class: 'prog-topic-score', text: `${x.got}/${x.max}` }));
  });
  const misses = ex.ids.filter(id => ex.answers[id] !== P.get(id).a);
  const mins = Math.round(ex.elapsed / 60e3);
  return h('div', { class: 'bio-layout' },
    h('div', { class: 'bio-main' },
      h('section', { class: 'card bio-exam' },
        h('p', { class: 'bio-kicker', style: '--lc: var(--accent)', text: 'Mock exam · results' }),
        h('p', { class: 'bio-score', text: `${sc.got} / ${sc.max} · ${sc.pct}%` }),
        h('p', { text: `${verdict} (${mins} min)` }),
        h('ul', { class: 'prog-topics' }, rows),
        h('div', { class: 'row' },
          h('button', { type: 'button', class: 'btn btn-primary', text: 'New exam', onclick: () => { drop('exam'); C.render(); window.scrollTo({ top: 0 }); } }))),
      h('section', { class: 'card' },
        h('h2', { text: misses.length ? `To review (${misses.length})` : 'Nothing to review ✿' }),
        h('ol', { class: 'bio-exam-review' }, misses.map(id => {
          const q = P.get(id); const L = LECTURES.find(l => l.id === q.lec); const mine = ex.answers[id];
          return h('li', null,
            h('p', { class: 'bio-kicker', style: `--lc: var(${L.color})`, text: `Lecture ${L.n} · ${L.short}` }),
            h('p', { class: 'q-prompt', text: q.q }),
            mine !== undefined ? h('p', { class: 'bio-exam-mine', text: `Your answer: ${mine}` }) : h('p', { class: 'bio-exam-mine', text: 'Left blank' }),
            h('p', { class: 'bio-exam-right' }, h('strong', { text: 'Right answer: ' }), q.a),
            h('p', { class: 'muted small', text: q.why }));
        })))),
    h('aside', { class: 'bio-side' }, history(C, LECTURES)));
}

// Paper version: the same kind of exam, printed with an answer key on its own page.
function printExam(C, LECTURES, P, ex) {
  const { h } = C;
  const L = id => LECTURES.find(l => l.id === id);
  const letters = 'ABCD';
  const sheet = h('div', { class: 'print-sheet' },
    h('h1', { text: 'Bio 2 practice exam' }),
    h('p', { class: 'ps-meta', text: `${ex.ids.length} questions · ${Math.round(ex.ids.length * SEC_PER_Q / 60)} minutes · Name: ______________________` }),
    h('ol', { class: 'ps-qs' }, ex.ids.map(id => { const q = P.get(id); return h('li', null,
      h('p', null, q.q, h('span', { class: 'ps-lec', text: ` (L${L(q.lec).n})` })),
      h('ol', { class: 'ps-opts', type: 'A' }, ex.opts[id].map(o => h('li', { text: o })))); })),
    h('section', { class: 'ps-key' }, h('h2', { text: 'Answer key' }),
      h('ol', null, ex.ids.map(id => { const q = P.get(id); return h('li', null, h('strong', { text: `${letters[ex.opts[id].indexOf(q.a)]}. ` }), q.a, h('span', { class: 'ps-why', text: ` · ${q.why}` })); }))));
  document.querySelector('.print-sheet')?.remove();
  document.body.append(sheet);
  document.body.classList.add('printing');
  const done = () => { document.body.classList.remove('printing'); sheet.remove(); removeEventListener('afterprint', done); };
  addEventListener('afterprint', done);
  setTimeout(() => window.print(), 50);
}
