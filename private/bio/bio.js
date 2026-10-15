// The Biology tab: make-up lectures 5–9 for Bio 2 (BSC2011), each told with
// plain words and small looping animations, plus a quick quiz per lecture.

import { E, NS } from './kit.js';
import L5 from './l5.js';
import L6 from './l6.js';
import L7 from './l7.js';
import L8 from './l8.js';
import L9 from './l9.js';

const LECTURES = [L5, L6, L7, L8, L9];

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
};

const REDUCED = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------------------------------------------------------------- animation engine

const states = new Map();   // scene id -> { t, playing, speed, vars, played }
const live = new Set();     // mounted scene instances
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
  live.clear();

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
    h('h3', { class: 'bio-sub-h', text: 'The whole lecture in one minute' }),
    h('ul', { class: 'bio-minute' }, lec.minute.map(t => h('li', { text: t }))),
    h('div', { class: 'bio-prog' }, h('span', { class: 'bio-prog-track' }, prog), progText),
    h('nav', { class: 'bio-jump', 'aria-label': 'Jump to animation' }, lec.scenes.map((sc, i) => h('a', {
      href: `#scene-${sc.id}`, onclick: e => { e.preventDefault(); document.getElementById(`scene-${sc.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); },
    }, `${i + 1}. ${sc.title}`))));

  const scenes = lec.scenes.map((sc, i) => sceneCard(sc, i + 1, paintProg));

  const page = h('div', { class: 'page bio' },
    h('header', { class: 'page-head' }, h('div', null, h('h1', { text: 'Biology' }),
      h('p', { class: 'muted small bio-head-sub' }, 'Bio 2 · make-up lectures 5–9 · tap any animation to pause it', h('span', { class: 'bio-phone-hint', text: ' · swipe sideways inside one to see all of it' })))),
    tabs,
    h('div', { class: 'bio-layout' },
      h('div', { class: 'bio-main' }, intro, ...scenes, quizCard(lec)),
      h('aside', { class: 'bio-side' },
        card('Connections', null, h('ul', { class: 'bio-links' }, lec.links.map(([text, to]) => h('li', null,
          to ? h('button', { type: 'button', class: 'link', onclick: () => { st.lec = to; save('lec', to); C.render(); window.scrollTo({ top: 0 }); } }, text) : h('span', { text }))))),
        card('Exam traps', null, h('ul', { class: 'bullets bio-traps' }, lec.traps.map(t => h('li', { text: t })))))));
  kick();
  return page;
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
