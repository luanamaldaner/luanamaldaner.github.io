// The Biology tab: Bio 2 (BSC2011) lectures 1–10, each told with plain words
// and small looping animations, a guided step-by-step walkthrough and a quiz.

import { E, NS } from './kit.js';
import L1 from './l1.js?v=2';
import L2 from './l2.js?v=2';
import L3 from './l3.js?v=2';
import L4 from './l4.js?v=2';
import L5 from './l5.js?v=2';
import L6 from './l6.js?v=2';
import L7 from './l7.js?v=2';
import L8 from './l8.js?v=2';
import L9 from './l9.js?v=2';
import L10 from './l10.js?v=2';
import WALKS from './walks.js?v=3';
import GLOSSARY from './glossary.js?v=1';

const LECTURES = [L1, L2, L3, L4, L5, L6, L7, L8, L9, L10];

let C; // h, card, render … handed over by app.js

function saved(key, fallback) { try { const v = localStorage.getItem(`bio.${key}`); return v === null ? fallback : v; } catch { return fallback; } }
function save(key, v) { try { localStorage.setItem(`bio.${key}`, v); } catch {} }
function savedSet(key) { try { return new Set(JSON.parse(localStorage.getItem(`bio.${key}`) || '[]')); } catch { return new Set(); } }
function saveSet(key, s) { save(key, JSON.stringify([...s])); }

const st = {
  lec: saved('lec', 'L5'),
  watched: savedSet('watched'),   // scene ids played through once
  done: savedSet('done'),         // lectures marked as made up
  quiz: {},                        // lecture id -> { i, picked, right, order }
  walk: null,                      // { lec, i, picked } while a guided walkthrough is open
};

const REDUCED = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------------------------------------------------------------- animation engine

const states = new Map();   // scene id -> { t, playing, speed, vars, played }
const live = new Set();     // mounted scene instances
const byId = new Map();     // scene id -> mounted instance
let raf = 0, last = 0;

function sceneState(sc) {
  if (!states.has(sc.id)) states.set(sc.id, { t: 0, playing: !REDUCED, speed: 1, vars: { ...(sc.vars || {}) }, played: 0 });
  return states.get(sc.id);
}

function kick() {
  if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
}

function loop(now) {
  raf = 0;
  const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
  last = now;
  for (const inst of live) {
    if (!inst.svg.isConnected) { live.delete(inst); if (inst.io) inst.io.disconnect(); continue; }
    if (!inst.visible || document.hidden) continue;
    const s = inst.st;
    if (s.playing) {
      const d = dt * s.speed;
      s.t += d;
      s.played += d;
      if (inst.sc.dur && s.played >= inst.sc.dur && !st.watched.has(inst.sc.id)) {
        st.watched.add(inst.sc.id); saveSet('watched', st.watched); markWatched(inst);
      }
      draw(inst, d);
    }
  }
  if (live.size) raf = requestAnimationFrame(loop);
}

function draw(inst, dt) {
  const { sc, st: s } = inst;
  const lt = sc.dur ? s.t % sc.dur : s.t;
  let cap = inst.update(lt, dt, s.t);
  if (typeof cap !== 'string' && sc.beats) {
    cap = '';
    for (const [b, text] of sc.beats) if (lt >= b) cap = text;
  }
  if (typeof cap === 'string' && inst.cap.textContent !== cap) {
    inst.cap.textContent = cap;
    inst.cap.classList.remove('pop'); void inst.cap.offsetWidth; inst.cap.classList.add('pop');
  }
  if (inst.bar && sc.dur) inst.bar.style.transform = `scaleX(${(lt / sc.dur).toFixed(4)})`;
}

function markWatched(inst) {
  if (inst.badge) inst.badge.hidden = false;
  if (inst.onWatched) inst.onWatched();
}

function playIcon(kind) {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('class', 'icon'); svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = kind === 'pause' ? '<path d="M8 5v14M16 5v14"/>' : kind === 'restart' ? '<path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5"/>' : '<path d="M7 4l13 8-13 8z" fill="currentColor"/>';
  return svg;
}

/** One animated scene card. */
function sceneCard(sc, n, onWatched) {
  const { h } = C;
  const s = sceneState(sc);
  const svg = E('svg', { viewBox: sc.viewBox || '0 0 640 360', class: 'bio-svg', role: 'img', 'aria-label': sc.title });
  const cap = h('div', { class: 'bio-cap', 'aria-live': 'polite' });
  const bar = h('span', { class: 'bio-bar-fill' });
  const ctl = h('div', { class: 'bio-ctl' });
  const inst = { sc, st: s, svg, cap, bar: sc.dur ? bar : null, visible: true, onWatched };
  byId.set(sc.id, inst);

  // scene-specific controls (segmented toggles and buttons)
  const ui = {
    seg(key, options, label) {
      const wrap = h('div', { class: 'bio-seg', role: 'group', 'aria-label': label || key });
      const paint = () => [...wrap.children].forEach((b, i) => {
        const on = s.vars[key] === options[i][0];
        b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on));
      });
      options.forEach(([val, text]) => wrap.append(h('button', {
        type: 'button', onclick: () => { s.vars[key] = val; paint(); if (sc.onVar) sc.onVar(key, val, s); draw(inst, 0); },
      }, text)));
      paint();
      ctl.append(wrap);
    },
    button(text, fn, cls = '') {
      ctl.append(h('button', { type: 'button', class: `btn btn-small ${cls}`, onclick: () => { fn(s); if (!s.playing) { s.playing = true; syncPlay(); } draw(inst, 0); } }, text));
    },
    note(text) { ctl.append(h('span', { class: 'muted small', text })); },
  };

  inst.update = sc.build(svg, s, ui);

  const play = h('button', { type: 'button', class: 'icon-btn bio-play' });
  const syncPlay = () => {
    play.replaceChildren(playIcon(s.playing ? 'pause' : 'play'));
    play.setAttribute('aria-label', s.playing ? 'Pause' : 'Play');
    play.title = s.playing ? 'Pause' : 'Play';
  };
  play.onclick = () => { s.playing = !s.playing; syncPlay(); kick(); };
  syncPlay();
  // let the walkthrough jump to a moment and play from there
  inst.cue = (from = 0, vars) => {
    if (vars) { Object.assign(s.vars, vars); }
    s.t = from; if (from === 0 && sc.reset) sc.reset(s); s.playing = true; syncPlay(); draw(inst, 0); kick();
  };
  const restart = h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Start over', title: 'Start over', onclick: () => {
    s.t = 0; if (sc.reset) sc.reset(s); s.playing = true; syncPlay(); draw(inst, 0); kick();
  } }, playIcon('restart'));
  const speeds = h('div', { class: 'bio-seg bio-speed', role: 'group', 'aria-label': 'Speed' }, [0.5, 1, 1.5].map(v => h('button', {
    type: 'button', class: s.speed === v ? 'on' : null, 'aria-pressed': String(s.speed === v),
    onclick: e => { s.speed = v; [...e.currentTarget.parentNode.children].forEach(b => { const on = b === e.currentTarget; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); }); },
  }, `${v}×`)));

  inst.badge = h('span', { class: 'bio-watched', text: '✓ watched', hidden: !st.watched.has(sc.id) });
  const stage = h('div', { class: 'bio-stage' }, svg, h('span', { class: 'bio-bar' }, bar));
  stage.addEventListener('click', e => { if (e.target.closest('button')) return; play.click(); });

  const el = h('section', { class: 'card bio-scene', id: `scene-${sc.id}` },
    h('header', { class: 'bio-scene-head' },
      h('span', { class: 'bio-num', text: String(n) }),
      h('h2', { text: sc.title }),
      inst.badge),
    stage,
    cap,
    h('div', { class: 'bio-controls' }, play, restart, speeds, ctl),
    h('div', { class: 'bio-explain' }, (sc.plain || []).map(p => h('p', { text: p }))),
    sc.terms && sc.terms.length ? h('details', { class: 'bio-terms' },
      h('summary', { text: `Key words (${sc.terms.length})` }),
      h('dl', null, sc.terms.flatMap(([k, v]) => [h('dt', { text: k }), h('dd', { text: v })]))) : null);

  if ('IntersectionObserver' in window) {
    inst.io = new IntersectionObserver(es => { for (const e of es) inst.visible = e.isIntersecting; if (inst.visible) kick(); }, { rootMargin: '80px' });
    inst.io.observe(svg);
  }
  live.add(inst);
  queueMicrotask(() => { draw(inst, 0); kick(); });
  return el;
}

// ---------------------------------------------------------------- page

export function renderBio(ctx) {
  C = ctx;
  const { h, card } = C;
  for (const inst of live) if (inst.io) inst.io.disconnect();
  live.clear(); byId.clear();

  const lec = LECTURES.find(l => l.id === st.lec) || LECTURES[0];
  const tabs = h('div', { class: 'bio-tabs', role: 'tablist' }, LECTURES.map(l => h('button', {
    type: 'button', role: 'tab', class: `bio-tab${l.id === lec.id ? ' on' : ''}`, 'aria-selected': String(l.id === lec.id),
    style: `--lc: var(${l.color})`,
    onclick: () => { if (st.lec !== l.id) { st.lec = l.id; save('lec', l.id); C.render(); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
  }, h('span', { class: 'bio-tab-n', text: l.n }), h('span', { text: l.short }), st.done.has(l.id) ? h('span', { class: 'bio-tab-ok', text: '✓' }) : null)));

  const total = lec.scenes.length;
  const watchedCount = () => lec.scenes.filter(s => st.watched.has(s.id)).length;
  const prog = h('span', { class: 'bio-prog-fill' });
  const progText = h('span', { class: 'muted small' });
  const paintProg = () => {
    const w = watchedCount();
    prog.style.width = `${(100 * w / total).toFixed(0)}%`;
    progText.textContent = `${w} of ${total} animations watched`;
  };
  paintProg();

  const isDone = st.done.has(lec.id);
  const intro = h('section', { class: 'card bio-intro', style: `--lc: var(${lec.color})` },
    h('div', { class: 'bio-intro-top' },
      h('div', null,
        h('p', { class: 'bio-kicker', text: `Lecture ${lec.n} · ${lec.chapter}` }),
        h('h2', { class: 'bio-intro-title', text: lec.title })),
      h('button', {
        type: 'button', class: `btn btn-small${isDone ? '' : ' btn-primary'}`,
        onclick: () => { if (isDone) st.done.delete(lec.id); else st.done.add(lec.id); saveSet('done', st.done); C.render(); },
      }, isDone ? 'Made up ✓ (undo)' : 'Mark as made up')),
    WALKS[lec.id] ? h('button', {
      type: 'button', class: 'bio-start',
      onclick: () => { st.walk = { lec: lec.id, i: 0, picked: null }; C.render(); window.scrollTo({ top: 0, behavior: 'smooth' }); },
    }, h('span', { class: 'bio-start-play', text: '▶' }), h('span', null, h('strong', { text: 'Start the guided lecture' }), h('span', { class: 'muted small', text: ` · ${WALKS[lec.id].length} short steps, about ${Math.max(5, Math.round(WALKS[lec.id].length * 1.5))} min` }))) : null,
    h('h3', { class: 'bio-sub-h', text: 'The whole lecture in one minute' }),
    h('ul', { class: 'bio-minute' }, lec.minute.map(t => h('li', { text: t }))),
    h('div', { class: 'bio-prog' }, h('span', { class: 'bio-prog-track' }, prog), progText),
    h('nav', { class: 'bio-jump', 'aria-label': 'Jump to animation' }, lec.scenes.map((sc, i) => h('a', {
      href: `#scene-${sc.id}`, onclick: e => { e.preventDefault(); document.getElementById(`scene-${sc.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); },
    }, `${i + 1}. ${sc.title}`))));

  const scenes = lec.scenes.map((sc, i) => sceneCard(sc, i + 1, paintProg));
  const walking = st.walk && st.walk.lec === lec.id && WALKS[lec.id];
  if (walking) queueMicrotask(() => focusStep(lec, false));

  const page = h('div', { class: 'page bio' },
    h('header', { class: 'page-head' }, h('div', null, h('h1', { text: 'Biology' }),
      h('p', { class: 'muted small bio-head-sub' }, 'Bio 2 · tap any animation to pause it', h('span', { class: 'bio-phone-hint', text: ' · swipe sideways inside one to see all of it' })))),
    tabs,
    h('div', { class: 'bio-layout' },
      h('div', { class: 'bio-main' }, walking ? walkPanel(lec) : intro, ...scenes, quizCard(lec)),
      h('aside', { class: 'bio-side' },
        card('Connections', null, h('ul', { class: 'bio-links' }, lec.links.map(([text, to]) => h('li', null,
          to ? h('button', { type: 'button', class: 'link', onclick: () => { st.lec = to; save('lec', to); C.render(); window.scrollTo({ top: 0 }); } }, text) : h('span', { text }))))),
        card('Exam traps', null, h('ul', { class: 'bullets bio-traps' }, lec.traps.map(t => h('li', { text: t })))))));
  kick();
  return page;
}

// ---------------------------------------------------------------- guided walkthrough

// Each step: { title, say: [paragraphs], scene?: id, from?: seconds, vars?: {...},
//              takeaway?: string, check?: { q, a, o: [..3], why } }
function focusStep(lec, scroll = true) {
  const steps = WALKS[lec.id];
  const step = steps[st.walk.i];
  document.querySelectorAll('.bio-scene.walk-on').forEach(el => el.classList.remove('walk-on'));
  if (!step || !step.scene) return;
  const inst = byId.get(step.scene);
  const el = document.getElementById(`scene-${step.scene}`);
  // pull the step's animation up into the walkthrough card, right under the text
  const slot = document.querySelector('.bio-walk-stage');
  if (el && slot) { slot.replaceChildren(el); el.classList.add('walk-on'); }
  if (inst) inst.cue(step.from || 0, step.vars);
  const panel = document.querySelector('.bio-walk');
  if (scroll && panel) window.scrollTo({ top: panel.getBoundingClientRect().top + window.scrollY - 12, behavior: 'smooth' });
}

function walkPanel(lec) {
  const { h } = C;
  const steps = WALKS[lec.id];
  const w = st.walk;
  const step = steps[w.i];
  const n = steps.length;
  const go = i => { w.i = Math.max(0, Math.min(n, i)); w.picked = null; C.render(); queueMicrotask(() => focusStep(lec)); };
  if (w.i >= n) {
    return h('section', { class: 'card bio-walk done', style: `--lc: var(${lec.color})` },
      h('p', { class: 'bio-kicker', text: `Lecture ${lec.n} · guided lecture` }),
      h('h2', { class: 'bio-walk-title', text: 'You made it through the whole lecture ✿' }),
      h('p', { text: 'Try the quiz at the bottom of the page to lock it in, or replay any animation below.' }),
      h('div', { class: 'bio-walk-nav' },
        h('button', { type: 'button', class: 'btn', text: '← Back', onclick: () => go(n - 1) }),
        h('button', { type: 'button', class: 'btn btn-primary', text: 'Go to the quiz', onclick: () => { st.walk = null; if (!st.done.has(lec.id)) { st.done.add(lec.id); saveSet('done', st.done); } C.render(); queueMicrotask(() => document.querySelector('.bio-quiz')?.scrollIntoView({ behavior: 'smooth' })); } }),
        h('button', { type: 'button', class: 'link', text: 'Close', onclick: () => { st.walk = null; C.render(); } })));
  }
  const dots = h('div', { class: 'bio-walk-dots', role: 'tablist', 'aria-label': 'Steps' }, steps.map((s2, i) => h('button', {
    type: 'button', class: `bio-walk-dot${i === w.i ? ' on' : i < w.i ? ' past' : ''}`, title: `${i + 1}. ${s2.title}`, 'aria-label': `Step ${i + 1}: ${s2.title}`,
    onclick: () => go(i),
  })));
  const ck = step.check;
  let check = null;
  if (ck) {
    if (!w.opts || w.optsFor !== w.i) { w.opts = shuffle([ck.a, ...ck.o]); w.optsFor = w.i; }
    const answered = w.picked != null;
    check = h('div', { class: 'bio-walk-check' },
      h('p', { class: 'bio-walk-q', text: `Quick check: ${ck.q}` }),
      h('div', { class: 'q-options' }, w.opts.map(o => {
        let cls = 'q-opt';
        if (answered && o === ck.a) cls += ' right'; else if (answered && o === w.picked) cls += ' wrong';
        return h('button', { type: 'button', class: cls, disabled: answered, onclick: () => { w.picked = o; C.render(); } }, o);
      })),
      answered ? h('p', { class: `bio-walk-why ${w.picked === ck.a ? 'ok' : 'no'}`, text: `${w.picked === ck.a ? 'Yes ✿ ' : `It's “${ck.a}”. `}${ck.why}` }) : null);
  }
  return h('section', { class: 'card bio-walk', style: `--lc: var(${lec.color})` },
    h('div', { class: 'bio-walk-top' },
      h('p', { class: 'bio-kicker', text: `Lecture ${lec.n} · step ${w.i + 1} of ${n}` }),
      h('button', { type: 'button', class: 'link', text: 'Exit guided lecture', onclick: () => { st.walk = null; document.querySelectorAll('.bio-scene.walk-on').forEach(el => el.classList.remove('walk-on')); C.render(); } })),
    h('div', { class: 'bio-walk-bar' }, h('span', { style: `width:${(100 * (w.i + 1) / n).toFixed(1)}%` })),
    h('h2', { class: 'bio-walk-title', text: step.title }),
    h('div', { class: 'bio-walk-say' }, (() => { const used = new Set(); return (step.say || []).map(t => h('p', null, ...withTerms(t, used))); })()),
    step.scene ? h('div', { class: 'bio-walk-stage' }) : null,
    step.takeaway ? h('p', { class: 'bio-walk-take' }, h('strong', { text: 'Takeaway: ' }), step.takeaway) : null,
    check,
    questionsBox(lec, w.i, step),
    h('div', { class: 'bio-walk-nav' },
      h('button', { type: 'button', class: 'btn', text: '← Back', disabled: w.i === 0, onclick: () => go(w.i - 1) }),
      dots,
      h('button', { type: 'button', class: 'btn btn-primary', text: w.i + 1 < n ? 'Next →' : 'Finish ✿', onclick: () => go(w.i + 1) })));
}


// ---------------------------------------------------------------- tap-to-explain terms
// Science words from glossary.js become small buttons; tapping (or hovering) shows a plain meaning.
const TERM_KEYS = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
const escRe = k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const TERM_RE = TERM_KEYS.length ? new RegExp('(?<![A-Za-z])(' + TERM_KEYS.map(escRe).join('|') + ')(?![A-Za-z])', 'gi') : null;
function withTerms(text, used) {
  if (!TERM_RE) return [text];
  const out = []; let last = 0;
  for (const m of text.matchAll(TERM_RE)) {
    const key = m[0].toLowerCase();
    if (used.has(key) || !GLOSSARY[key]) continue;
    used.add(key);
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(C.h('button', { type: 'button', class: 'bio-term', 'data-tip': GLOSSARY[key], 'aria-label': `${m[0]}: ${GLOSSARY[key]}`, text: m[0] }));
    last = m.index + m[0].length;
  }
  out.push(text.slice(last));
  return out;
}

// ---------------------------------------------------------------- questions
// Luana's questions while studying; stored as vault notes (kind 'bioq') so every device syncs them.
// Claude answers them later (todo.mjs bioq answer), and the answer shows up right here.
function questionsBox(lec, i, step) {
  const { h } = C;
  const S = C.S();
  const mine = S.notes.filter(n => !n.deleted && n.kind === 'bioq' && n.lec === lec.id && n.step === i)
    .sort((a, b) => (a.askedAt || 0) - (b.askedAt || 0));
  const ta = h('textarea', { class: 'bio-q-input', rows: 2, placeholder: 'Confused by something here? Ask it and it’ll get answered right on this step.', 'aria-label': 'Ask a question about this step' });
  const ask = () => {
    const q = ta.value.trim();
    if (!q) return;
    C.commit(() => { S.notes.push(C.touch({ id: C.uid(), kind: 'bioq', lec: lec.id, step: i, title: `Bio ${lec.n} · ${step.title}`, body: q, answer: '', askedAt: Date.now() })); });
  };
  return h('details', { class: 'bio-q', open: mine.length ? '' : null },
    h('summary', null, `❓ Questions${mine.length ? ` (${mine.length})` : ''}`),
    mine.length ? h('ul', { class: 'bio-q-list' }, mine.map(n => h('li', null,
      h('p', { class: 'bio-q-text' }, h('strong', { text: 'You: ' }), n.body),
      n.answer ? h('p', { class: 'bio-q-answer' }, h('strong', { text: 'Answer: ' }), n.answer)
        : h('p', { class: 'bio-q-pending', text: 'Waiting for an answer ✿' }),
      h('button', { type: 'button', class: 'link small', text: 'Remove', onclick: () => C.commit(() => { C.touch(n).deleted = true; }) })))) : null,
    h('div', { class: 'bio-q-ask' }, ta, h('button', { type: 'button', class: 'btn btn-small btn-primary', text: 'Ask', onclick: ask })));
}

// ---------------------------------------------------------------- quiz

function shuffle(a) { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

function quizCard(lec) {
  const { h } = C;
  if (!st.quiz[lec.id]) st.quiz[lec.id] = { i: 0, picked: null, right: 0, order: shuffle(lec.quiz.map((_, i) => i)), opts: null };
  const q = st.quiz[lec.id];
  const finished = q.i >= q.order.length;
  const body = [];
  if (finished) {
    body.push(h('p', { class: 'bio-score', text: `${q.right} / ${q.order.length} right${q.right === q.order.length ? ' ✿ perfect' : ''}` }),
      h('button', { type: 'button', class: 'btn btn-primary', text: 'Try again (new order)', onclick: () => { delete st.quiz[lec.id]; C.render(); } }));
  } else {
    const Q = lec.quiz[q.order[q.i]];
    if (!q.opts) q.opts = shuffle([Q.a, ...Q.o]);
    const answered = q.picked !== null;
    body.push(
      h('p', { class: 'muted small', text: `Question ${q.i + 1} of ${q.order.length}` }),
      h('p', { class: 'q-prompt', text: Q.q }),
      h('div', { class: 'q-options' }, q.opts.map(o => {
        let cls = 'q-opt';
        if (answered && o === Q.a) cls += ' right';
        else if (answered && o === q.picked) cls += ' wrong';
        return h('button', { type: 'button', class: cls, disabled: answered, onclick: () => { q.picked = o; if (o === Q.a) q.right++; C.render(); } }, o);
      })),
      answered ? h('div', { class: `q-feedback ${q.picked === Q.a ? 'ok' : 'no'}` },
        h('strong', { text: q.picked === Q.a ? 'Yes ✿' : `Not quite. It's: ${Q.a}` }),
        h('p', { text: Q.why }),
        h('button', { type: 'button', class: 'btn btn-primary', text: q.i + 1 < q.order.length ? 'Next' : 'See score', onclick: () => { q.i++; q.picked = null; q.opts = null; C.render(); } })) : null);
  }
  return h('section', { class: 'card bio-quiz' },
    h('header', { class: 'card-head' }, h('h2', { text: 'Check yourself' }), h('span', { class: 'card-meta', text: `${q.right} right so far` })),
    ...body);
}
