// The R tab (STA 3100): study notes plus "predict the output" practice for data frames and dates.
// Progress (which questions were missed) is kept in localStorage on this device.

import { SETUP, GUITARS_TABLE, NOTES, QUESTIONS } from './content.js?v=1';

let C; // { h, card, render, ... } from app.js

const TOPICS = [['all', 'Everything'], ['df', 'Data frames'], ['date', 'Dates (base R)'], ['lub', 'lubridate']];
const TABS = [['notes', 'Notes'], ['practice', 'Practice'], ['missed', 'Missed']];

function load(key, fallback) { try { const v = localStorage.getItem(`rstat.${key}`); return v === null ? fallback : JSON.parse(v); } catch { return fallback; } }
function store(key, v) { try { localStorage.setItem(`rstat.${key}`, JSON.stringify(v)); } catch {} }

const st = {
  tab: load('tab', 'notes'),
  topic: load('topic', 'all'),
  missed: new Set(load('missed', [])),   // question indexes answered wrong (cleared when answered right)
  run: null,                              // { ids, i, picked, right, opts }
};

function shuffle(a) { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

function code(text) {
  const pre = document.createElement('pre');
  pre.className = 'prog-code r-code';
  const c = document.createElement('code');
  c.textContent = text;
  pre.append(c);
  return pre;
}

function pool(tab, topic) {
  const ids = QUESTIONS.map((_, i) => i).filter(i => topic === 'all' || QUESTIONS[i].topic === topic);
  return tab === 'missed' ? ids.filter(i => st.missed.has(i)) : ids;
}

function startRun() {
  st.run = { ids: shuffle(pool(st.tab, st.topic)), i: 0, picked: null, right: 0, opts: null, tab: st.tab, topic: st.topic };
}

function notesPage() {
  const { h, card } = C;
  const secs = NOTES.filter(n => st.topic === 'all' || (st.topic === 'df' ? n.id.startsWith('df') : st.topic === 'lub' ? n.id.startsWith('lub') : !n.id.startsWith('df') && !n.id.startsWith('lub')));
  const setup = st.topic === 'all' || st.topic === 'df'
    ? card('The guitars data frame (used in the examples)', h('span', { class: 'card-meta', text: 'Lecture 9' }),
      h('details', { class: 'r-setup' }, h('summary', null, 'Show the code that builds it'), code(SETUP)), code(GUITARS_TABLE))
    : null;
  return [setup, ...secs.map(n => card(n.title, h('span', { class: 'card-meta', text: n.lecture }),
    ...n.blocks.map(([text, c]) => h('div', { class: 'r-block' }, h('p', { text }), c ? code(c) : null))))];
}

function practicePage() {
  const { h, card } = C;
  const ids = pool(st.tab, st.topic);
  if (!ids.length) {
    return [card(st.tab === 'missed' ? 'Nothing to review' : 'No questions', null,
      h('p', { class: 'empty', text: st.tab === 'missed' ? 'No missed questions here. Anything you get wrong in Practice shows up in this tab until you get it right ✿' : 'No questions for this topic yet.' }))];
  }
  if (!st.run || st.run.tab !== st.tab || st.run.topic !== st.topic) startRun();
  const r = st.run;
  if (r.i >= r.ids.length) {
    return [card('Round done', null,
      h('p', { class: 'bio-score', text: `${r.right} / ${r.ids.length} right${r.right === r.ids.length ? ' ✿ perfect' : ''}` }),
      h('p', { class: 'muted small', text: st.missed.size ? `${st.missed.size} question${st.missed.size === 1 ? '' : 's'} saved in the Missed tab.` : 'Nothing in the Missed tab. Nice.' }),
      h('div', { class: 'row' },
        h('button', { type: 'button', class: 'btn btn-primary', text: 'New round (new order)', onclick: () => { startRun(); C.render(); } }),
        st.missed.size && st.tab !== 'missed' ? h('button', { type: 'button', class: 'btn', text: 'Redo the missed ones', onclick: () => { st.tab = 'missed'; store('tab', 'missed'); st.run = null; C.render(); } }) : null))];
  }
  const qi = r.ids[r.i];
  const Q = QUESTIONS[qi];
  if (!r.opts) r.opts = shuffle([Q.a, ...Q.o]);
  const answered = r.picked !== null;
  const pick = o => {
    r.picked = o;
    if (o === Q.a) { r.right++; st.missed.delete(qi); } else st.missed.add(qi);
    store('missed', [...st.missed]);
    C.render();
  };
  return [card(`Question ${r.i + 1} of ${r.ids.length}`, h('span', { class: 'card-meta', text: `${r.right} right so far` }),
    Q.topic === 'df' && /guitars|tib/.test(Q.code) ? h('p', { class: 'muted small', text: 'Uses the guitars data frame from the Notes tab.' }) : null,
    code(Q.code),
    h('p', { class: 'q-prompt', text: Q.q }),
    h('div', { class: 'q-options r-options' }, r.opts.map(o => {
      let cls = 'q-opt';
      if (answered && o === Q.a) cls += ' right';
      else if (answered && o === r.picked) cls += ' wrong';
      return h('button', { type: 'button', class: cls, disabled: answered, onclick: () => pick(o) }, o);
    })),
    answered ? h('p', { class: `r-why ${r.picked === Q.a ? 'ok' : 'no'}`, text: `${r.picked === Q.a ? 'Yes ✿ ' : `It’s ${Q.a}. `}${Q.why}` }) : null,
    answered ? h('div', { class: 'row' }, h('button', { type: 'button', class: 'btn btn-primary', text: r.i + 1 < r.ids.length ? 'Next →' : 'See score', onclick: () => { r.i++; r.picked = null; r.opts = null; C.render(); } })) : null)];
}

export function renderRstat(ctx) {
  C = ctx;
  const { h } = C;
  const tabs = h('div', { class: 'chips r-tabs' }, TABS.map(([k, label]) => h('button', {
    type: 'button', class: `chip chip-btn${st.tab === k ? ' on' : ''}`,
    text: k === 'missed' && st.missed.size ? `${label} (${st.missed.size})` : label,
    onclick: () => { st.tab = k; store('tab', k); st.run = null; C.render(); },
  })));
  const topics = h('div', { class: 'chips r-topics' }, TOPICS.map(([k, label]) => h('button', {
    type: 'button', class: `chip chip-btn${st.topic === k ? ' on' : ''}`, text: label,
    onclick: () => { st.topic = k; store('topic', k); st.run = null; C.render(); },
  })));
  return h('div', { class: 'page rstat' },
    h('header', { class: 'page-head' }, h('div', null, h('h1', { text: 'R · STA 3100' }),
      h('p', { class: 'muted small', text: 'Data frames (L9), dates & times (L11) and lubridate (L18). Notes from your lectures, then predict-the-output practice.' }))),
    tabs, topics,
    h('div', { class: 'r-main' }, ...(st.tab === 'notes' ? notesPage() : practicePage())));
}
