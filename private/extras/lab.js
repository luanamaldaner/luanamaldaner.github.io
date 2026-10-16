// Study lab: cross-course questions, pathway puzzles, mnemonics and the microbe library.
// Progress lives in localStorage (this device).

import { CONNECTIONS } from './connections.js?v=1';
import { PATHWAYS } from '../bio/pathways.js?v=1';
import { MNEMONICS } from './mnemonics.js?v=1';
import { MICROBES } from './microbes.js?v=1';
import { addCorrect, packState, openPack, RARITY, PER_PACK } from './packs.js?v=1';
import { tycoonPage } from './tycoon.js?v=2';
import { microLabPage } from './microlab.js?v=1';

const ls = (k, fb) => { try { const v = localStorage.getItem(`lab.${k}`); return v === null ? fb : JSON.parse(v); } catch { return fb; } };
const put = (k, v) => { try { localStorage.setItem(`lab.${k}`, JSON.stringify(v)); } catch {} };
const shuffle = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

const TABS = [['conn', '🔗 Connections'], ['path', '🧩 Pathways'], ['mnem', '🧠 Mnemonics'], ['microbe', '🦠 Microbes'], ['micro', '🧫 Micro lab'], ['packs', '🎴 Packs'], ['tycoon', '🔬 Cell Tycoon']];
const lab = { tab: ls('tab', 'conn'), conn: null, path: null, mnemHide: false, mnemTopic: 'All', microbe: null };

export function microbeOfDay(today) {
  const n = Math.round(new Date(today + 'T12:00:00') / 864e5);
  return MICROBES[((n % MICROBES.length) + MICROBES.length) % MICROBES.length];
}

function microbeView(C, m, big = false) {
  const { h } = C;
  return h('div', { class: `mb${big ? ' big' : ''}` },
    h('div', { class: 'mb-top' }, h('span', { class: 'mb-emoji', text: m.emoji }),
      h('div', null, h('p', { class: 'mb-name', text: m.name }), h('p', { class: 'muted small', text: [m.kind, m.gram, m.shape].filter(Boolean).join(' · ') }))),
    h('p', { class: 'mb-hook', text: m.hook }),
    h('ul', { class: 'bullets small' }, m.facts.map(f => h('li', { text: f }))),
    h('p', { class: 'small mb-why', text: m.why }));
}

export function microbeCard(C) {
  const { h, card } = C;
  return card('Microbe of the day', h('span', { class: 'card-meta', text: microbeOfDay(C.todayStr()).kind }),
    microbeView(C, microbeOfDay(C.todayStr())),
    h('button', { type: 'button', class: 'link small', text: 'Browse all 45 →', onclick: () => { lab.tab = 'microbe'; put('tab', 'microbe'); C.go('lab'); } }));
}

function connPage(C) {
  const { h } = C;
  const seen = new Set(ls('connSeen', []));
  if (!lab.conn) {
    const pool = shuffle(CONNECTIONS.map((_, i) => i));
    const order = [...pool.filter(i => !seen.has(i)), ...pool.filter(i => seen.has(i))];
    lab.conn = { order, i: 0, picked: null, right: 0, opts: null };
  }
  const s = lab.conn;
  if (s.i >= s.order.length) s.i = 0;
  const Q = CONNECTIONS[s.order[s.i]];
  if (!s.opts) s.opts = shuffle([Q.a, ...Q.o]);
  const done = s.picked !== null;
  return h('section', { class: 'card lab-card' },
    h('div', { class: 'lab-top' }, h('div', { class: 'chips' }, Q.tags.map(t => h('span', { class: `chip lab-tag tag-${t.toLowerCase()}`, text: t }))),
      h('span', { class: 'muted small', text: `${s.right} right · ${seen.size} / ${CONNECTIONS.length} seen` })),
    h('p', { class: 'q-prompt', text: Q.q }),
    h('div', { class: 'q-options lab-opts' }, s.opts.map(o => {
      let cls = 'q-opt';
      if (done && o === Q.a) cls += ' right'; else if (done && o === s.picked) cls += ' wrong';
      return h('button', { type: 'button', class: cls, disabled: done, onclick: () => { s.picked = o; if (o === Q.a) { s.right++; addCorrect(); } seen.add(s.order[s.i]); put('connSeen', [...seen]); C.render(); } }, o);
    })),
    done ? h('div', { class: `q-feedback ${s.picked === Q.a ? 'ok' : 'no'}` },
      h('strong', { text: s.picked === Q.a ? 'Yes ✿' : `It's: ${Q.a}` }), h('p', { text: Q.why }),
      h('button', { type: 'button', class: 'btn btn-primary', text: 'Next question', onclick: () => { s.i++; s.picked = null; s.opts = null; C.render(); } })) : null);
}

function pathPage(C) {
  const { h } = C;
  const solved = new Set(ls('pathSolved', []));
  if (!lab.path) lab.path = { id: PATHWAYS[0].id };
  const P = PATHWAYS.find(p => p.id === lab.path.id) || PATHWAYS[0];
  const s = lab.path;
  if (s.for !== P.id) { s.for = P.id; s.pool = shuffle(P.steps.map((_, i) => i)); while (P.steps.length > 1 && s.pool.every((v, i) => v === i)) s.pool = shuffle(s.pool); s.placed = []; s.checked = false; }
  const remaining = s.pool.filter(i => !s.placed.includes(i));
  const allPlaced = !remaining.length;
  const correct = s.placed.filter((v, k) => v === k).length;
  const pick = id => { s.id = id; C.render(); };
  return h('div', { class: 'grid orgo-grid' },
    h('div', { class: 'col' }, h('section', { class: 'card lab-card' },
      h('p', { class: 'bio-kicker', style: '--lc: var(--accent)', text: `Lecture ${P.lec.slice(1)} · put the steps in order` }),
      h('h2', { class: 'lab-title', text: P.title }),
      h('ol', { class: 'pw-placed' }, s.placed.map((v, k) => h('li', { class: `pw-step${s.checked ? (v === k ? ' ok' : ' no') : ''}` },
        h('span', { class: 'pw-n', text: String(k + 1) }), h('span', { text: P.steps[v] }),
        !s.checked ? h('button', { type: 'button', class: 'pw-x', 'aria-label': 'Take this step back', text: '✕', onclick: () => { s.placed = s.placed.filter(x => x !== v); C.render(); } }) : null))),
      remaining.length ? h('p', { class: 'muted small', text: s.placed.length ? 'Tap the next step:' : 'Tap the FIRST step, then the next, and so on:' }) : null,
      h('div', { class: 'pw-pool' }, remaining.map(i => h('button', { type: 'button', class: 'pw-chip', text: P.steps[i], onclick: () => { s.placed.push(i); C.render(); } }))),
      h('div', { class: 'row' },
        allPlaced && !s.checked ? h('button', { type: 'button', class: 'btn btn-primary', text: 'Check', onclick: () => { s.checked = true; if (s.placed.every((v, k) => v === k)) { solved.add(P.id); put('pathSolved', [...solved]); } C.render(); } }) : null,
        s.placed.length ? h('button', { type: 'button', class: 'btn', text: s.checked ? 'Try again' : 'Reset', onclick: () => { s.for = null; C.render(); } }) : null),
      s.checked ? h('div', { class: `q-feedback ${correct === P.steps.length ? 'ok' : 'no'}` },
        h('strong', { text: correct === P.steps.length ? 'Perfect order ✿' : `${correct} of ${P.steps.length} in the right spot` }),
        correct === P.steps.length ? null : h('ol', { class: 'small pw-answer' }, P.steps.map(t => h('li', { text: t }))),
        h('p', { class: 'small', text: P.why })) : null)),
    h('div', { class: 'col col-narrow' }, C.card('Puzzles', h('span', { class: 'card-meta', text: `${solved.size} / ${PATHWAYS.length} solved` }),
      h('ul', { class: 'pw-list' }, PATHWAYS.map(p => h('li', null, h('button', { type: 'button', class: `prog-item${p.id === P.id ? ' on' : ''}${solved.has(p.id) ? ' done' : ''}`, onclick: () => pick(p.id) },
        h('span', { class: 'prog-item-mod', text: p.lec }), h('span', { class: 'prog-item-title', text: p.title }), h('span', { class: 'prog-item-check', text: solved.has(p.id) ? '✓' : '' }))))))));
}

function mnemPage(C) {
  const { h } = C;
  const topics = ['All', ...new Set(MNEMONICS.map(m => m.topic))];
  const list = MNEMONICS.filter(m => lab.mnemTopic === 'All' || m.topic === lab.mnemTopic);
  return h('div', { class: 'lab-stack' },
    h('div', { class: 'row lab-filters' },
      h('div', { class: 'chips' }, topics.map(t => h('button', { type: 'button', class: `chip chip-btn${lab.mnemTopic === t ? ' on' : ''}`, text: t, onclick: () => { lab.mnemTopic = t; C.render(); } }))),
      h('label', { class: 'small lab-hide' }, h('input', { type: 'checkbox', checked: lab.mnemHide, onchange: e => { lab.mnemHide = e.target.checked; C.render(); } }), ' Quiz me (hide the lists)')),
    h('div', { class: 'mn-grid' }, list.map(m => h('section', { class: 'card mn' },
      h('p', { class: 'bio-kicker', style: '--lc: var(--accent)', text: m.topic }),
      h('h3', { class: 'mn-title', text: m.title }),
      h('p', { class: 'mn-mn', text: m.mnemonic }),
      lab.mnemHide ? h('details', { class: 'mn-reveal' }, h('summary', null, 'Show the list'), h('ol', { class: 'small' }, m.list.map(x => h('li', { text: x }))))
        : h('ol', { class: 'small mn-list' }, m.list.map(x => h('li', { text: x }))),
      m.note ? h('p', { class: 'muted small', text: m.note }) : null))));
}

function microbePage(C) {
  const { h } = C;
  const today = microbeOfDay(C.todayStr());
  const kinds = ['All', ...new Set(MICROBES.map(m => m.kind))];
  if (!lab.microbe) lab.microbe = { kind: 'All', open: today.name };
  const list = MICROBES.filter(m => lab.microbe.kind === 'All' || m.kind === lab.microbe.kind);
  const cur = MICROBES.find(m => m.name === lab.microbe.open) || today;
  return h('div', { class: 'grid orgo-grid' },
    h('div', { class: 'col' }, h('section', { class: 'card lab-card' },
      cur === today ? h('p', { class: 'bio-kicker', style: '--lc: var(--accent)', text: 'Microbe of the day' }) : null,
      microbeView(C, cur, true))),
    h('div', { class: 'col col-narrow' }, C.card('Library', h('span', { class: 'card-meta', text: `${list.length}` }),
      h('div', { class: 'chips' }, kinds.map(k => h('button', { type: 'button', class: `chip chip-btn${lab.microbe.kind === k ? ' on' : ''}`, text: k, onclick: () => { lab.microbe.kind = k; C.render(); } }))),
      h('ul', { class: 'pw-list' }, list.map(m => h('li', null, h('button', { type: 'button', class: `prog-item${m === cur ? ' on' : ''}`, onclick: () => { lab.microbe.open = m.name; C.render(); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
        h('span', { class: 'prog-item-mod', text: m.emoji }), h('span', { class: 'prog-item-title', text: m.name }))))))));
}


let lastPull = null;
function packsPage(C) {
  const { h } = C;
  const p = packState();
  const owned = p.owned;
  const have = MICROBES.filter(m => owned[m.name]).length;
  const pull = lastPull;
  return h('div', { class: 'grid orgo-grid' },
    h('div', { class: 'col' },
      h('section', { class: 'card lab-card pk-shop' },
        h('p', { class: 'bio-kicker', style: '--lc: var(--accent)', text: 'Collectible packs' }),
        h('h2', { class: 'lab-title', text: p.ready > 0 ? `${p.ready} pack${p.ready === 1 ? '' : 's'} ready to open 🎁` : 'Earn your next pack' }),
        h('p', { class: 'small', text: `Every ${PER_PACK} correct answers anywhere (roulette, quizzes, the daily boss, mock exams) earns a pack of 3 microbe cards. ${p.ready > 0 ? '' : `${p.toNext} more to go.`}` }),
        h('div', { class: 'pk-meter' }, h('span', { style: `width:${(100 * (PER_PACK - p.toNext) / PER_PACK).toFixed(0)}%` })),
        h('div', { class: 'row' }, h('button', { type: 'button', class: 'btn btn-primary', disabled: p.ready <= 0, text: '🎁 Open a pack', onclick: () => { lastPull = openPack(MICROBES); C.render(); } })),
        pull ? h('div', { class: 'pk-pull' }, pull.map((x, k) => { const m = MICROBES.find(y => y.name === x.name); return h('button', { type: 'button', class: `pk-card r-${RARITY[m.kind].toLowerCase()}`, style: `animation-delay:${k * 180}ms`, onclick: () => { lab.tab = 'microbe'; lab.microbe = { kind: 'All', open: m.name }; put('tab', 'microbe'); C.render(); } },
          h('span', { class: 'pk-emoji', text: m.emoji }), h('span', { class: 'pk-name', text: m.name }), h('span', { class: 'pk-rar', text: `${RARITY[m.kind]}${x.isNew ? ' · NEW ✨' : ''}` })); })) : null)),
    h('div', { class: 'col col-narrow' }, C.card('Collection', h('span', { class: 'card-meta', text: `${have} / ${MICROBES.length}` }),
      h('div', { class: 'pk-grid' }, MICROBES.map(m => owned[m.name]
        ? h('span', { class: `pk-mini r-${RARITY[m.kind].toLowerCase()}`, title: `${m.name} ×${owned[m.name]}`, text: m.emoji })
        : h('span', { class: 'pk-mini locked', title: 'Not found yet', text: '?' }))))));
}

export function renderLab(C) {
  const { h } = C;
  const tabs = h('div', { class: 'orgo-tabs', role: 'tablist' }, TABS.map(([id, label]) => h('button', {
    type: 'button', role: 'tab', class: `orgo-tab${lab.tab === id ? ' on' : ''}`, 'aria-selected': String(lab.tab === id),
    onclick: () => { lab.tab = id; put('tab', id); C.render(); },
  }, label)));
  const body = { conn: connPage, path: pathPage, mnem: mnemPage, microbe: microbePage, packs: packsPage, tycoon: tycoonPage, micro: microLabPage }[lab.tab] || connPage;
  return h('div', { class: 'page' },
    h('header', { class: 'page-head' }, h('div', null, h('h1', { text: 'Study lab' }),
      h('p', { class: 'muted small', text: 'Cross-course questions, pathway puzzles, mnemonics, microbes and games' }))),
    tabs, body(C));
}
