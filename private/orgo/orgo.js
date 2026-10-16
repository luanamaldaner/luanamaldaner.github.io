// The Orgo tab: 3D mechanisms, the SN1/SN2/E1/E2 decider, alkene reactions,
// a 3D molecule explorer, and practice (quiz + flashcards).

import { MECHS, mechById } from './mechanisms.js?v=3';
import { energyDiagram, skeletal } from './draw.js?v=2';
import { conceptsPage } from './concepts.js?v=2';
import { problemsPage } from './problems.js?v=2';
import { cheatSheetPage, mockExamPage } from './exam.js?v=1';
import { roulettePage } from './roulette.js?v=2';
import { addMistake } from './mistakes.js?v=1';
import {
  SM, REACTIONS, SUBSTRATES, CLASS_LABEL, REAGENT_TYPES, REAGENTS, tableCell, outcomeLabel,
  OUTCOME_LABELS, decide, CONCEPTS, CARDS,
} from './content.js?v=3';

let C; // helpers handed over by app.js: h, card, commit, touch, S, todayStr, addDays

const TABS = [['mech', 'Mechanisms'], ['concepts', 'Concepts'], ['decide', 'Which one?'], ['alkenes', 'Alkene reactions'], ['mol', 'Molecules'], ['practice', 'Quiz'], ['roulette', 'Roulette 🎰'], ['keys', 'Daily practice'], ['mock', 'Mock exam'], ['cheat', 'Cheat sheet']];
const MECH_FOR = { SN2: 'sn2', SN1: 'sn1', E2: 'e2', E1: 'e1' };

function saved(key, fallback) { try { return localStorage.getItem(`orgo.${key}`) || fallback; } catch { return fallback; } }
function save(key, v) { try { localStorage.setItem(`orgo.${key}`, v); } catch {} }

const st = {
  tab: saved('tab', 'mech'),
  mech: saved('mech', 'sn2'),
  focus: null,
  t: 0, playing: !matchMedia('(prefers-reduced-motion: reduce)').matches, speed: 1, stepPause: false, loop: true, hold: 0, face: 'back',
  show: { orbitals: true, arrows: true, labels: true },
  dec: { cls: '2', reagent: 'NaOEt', solvent: 'protic', heat: false },
  hideAnswers: false, revealed: new Set(),
  mol: { name: '2-bromobutane', style: 'ball', spin: true, loading: false, error: '', frame: null, info: null },
  quiz: { mode: 'mixed', q: null, picked: null, right: 0, total: 0 },
  fc: { deck: 'All', current: null, flipped: false, again: new Set() },
};

// ---------------------------------------------------------------- viewer plumbing

const host = document.createElement('div');
host.className = 'viewer-host';
const capEl = document.createElement('div'); capEl.className = 'viewer-caption'; capEl.setAttribute('aria-live', 'polite');
const hintEl = document.createElement('div'); hintEl.className = 'viewer-hint'; hintEl.textContent = 'Drag to rotate · scroll or pinch to zoom · double-click to reset';
const msgEl = document.createElement('div'); msgEl.className = 'viewer-msg'; msgEl.textContent = 'Loading 3D…';
host.append(capEl, hintEl, msgEl);

let viewer = null, loading = null, parseSdf = null, shownKey = '', drawnT = -1, ui = {};

function ensureViewer() {
  if (viewer) return Promise.resolve(viewer);
  if (!loading) {
    loading = import('./viewer.js?v=6').then(m => {
      parseSdf = m.parseSdf;
      viewer = new m.Viewer();
      viewer.onTick = tick;
      viewer.live = !matchMedia('(prefers-reduced-motion: reduce)').matches;
      msgEl.textContent = '';
      return viewer;
    }).catch(e => {
      loading = null;
      msgEl.textContent = '3D couldn’t start on this device (WebGL is needed).';
      throw e;
    });
  }
  return loading;
}

function isDark() {
  const t = document.documentElement.dataset.theme;
  if (t === 'dark') return true;
  if (t === 'light') return false;
  return matchMedia('(prefers-color-scheme: dark)').matches;
}

function attachViewer() {
  ensureViewer().then(v => {
    if (!host.isConnected) return;
    v.mount(host);
    v.setDark(isDark());
    if (st.tab === 'mech') {
      const m = mechById(st.mech);
      v.setStyle('ball'); v.spin = false;
      if (shownKey !== `mech:${m.id}`) {
        v.fit(m.fit, m.center);
        v.setView(m.view[0], m.view[1], false);
        shownKey = `mech:${m.id}`;
      }
      drawMech(true);
    } else if (st.tab === 'mol') {
      v.setStyle(st.mol.style); v.spin = st.mol.spin;
      capEl.textContent = '';
      if (st.mol.frame) {
        if (shownKey !== `mol:${st.mol.name}`) {
          v.fit(st.mol.frame.radius, st.mol.frame.center);
          v.setView(10, -20, false);
          shownKey = `mol:${st.mol.name}`;
        }
        v.setFrame(st.mol.frame);
      } else if (!st.mol.loading) loadMolecule(st.mol.name);
    }
  }).catch(() => {});
}

function tick(dt) {
  if (st.tab !== 'mech') { if (viewer) viewer.cam = null; return; }
  const m = mechById(st.mech);
  // after the product appears, hold for a moment, then replay
  if (!st.playing && st.loop && st.t >= 1 && st.hold > 0) {
    st.hold -= dt;
    if (st.hold <= 0) { st.t = 0; st.playing = true; }
  }
  if (viewer && viewer.live) {
    // the camera swings around the molecule and moves in close while bonds change
    const u = st.t, arc = Math.sin(Math.PI * u);
    // close up on the action; the viewer backs off as needed to keep every atom in frame
    viewer.cam = { yaw: (u - 0.5) * 0.9, pitch: 0.12 * arc, zoom: st.focus ? 0.8 : 1 };
    viewer.autoFrame = true;
    viewer.focusGoal = st.focus;
  }
  if (st.playing) {
    let nt = st.t + dt * st.speed / m.duration;
    if (st.stepPause) {
      const end = m.steps.map(s => s[1]).find(b => b > st.t + 1e-6 && b < 1);
      if (end !== undefined && nt >= end) { nt = end; st.playing = false; }
    }
    if (nt >= 1) { nt = 1; st.playing = false; st.hold = st.loop ? 2.2 : 0; }
    st.t = nt;
  }
  drawMech(false);
}

function drawMech(force) {
  if (!viewer || st.tab !== 'mech') return;
  if (!force && st.t === drawnT) { syncPlayButton(); return; }
  drawnT = st.t;
  const m = mechById(st.mech);
  const f = m.frame(st.t, { face: st.face });
  st.focus = actionFocus(f, st.t, st.focus);
  if (!st.show.orbitals) { f.lobes = []; f.planes = f.planes.filter(p => p.color === 'metal'); }
  if (!st.show.arrows) f.arrows = [];
  if (!st.show.labels) f.labels = [];
  viewer.setFrame(f);
  // live UI
  const cap = f.captions.reduce((a, c) => (c.opacity > (a ? a.opacity : 0) ? c : a), null);
  capEl.textContent = cap ? cap.text : '';
  capEl.style.opacity = cap ? Math.min(1, cap.opacity * 1.2).toFixed(2) : '0';
  capEl.classList.toggle('is-ts', !!(cap && cap.kind === 'ts'));
  if (ui.scrub) ui.scrub.value = String(Math.round(st.t * 1000));
  if (ui.energy) ui.energy(st.t);
  const si = stepIndex(m, st.t);
  if (ui.step !== si && ui.stepTitle) {
    ui.step = si;
    ui.stepTitle.textContent = `${si + 1}. ${m.steps[si][2]}`;
    ui.stepText.textContent = m.steps[si][3];
    ui.stepItems.forEach((li, i) => li.classList.toggle('on', i === si));
    if (ui.narr) { ui.narr.classList.remove('fresh'); void ui.narr.offsetWidth; ui.narr.classList.add('fresh'); }
  }
  syncPlayButton();
}

// Where the chemistry is happening right now: the middle of the visible curved
// arrows and half-made bonds. Between bursts the camera stays where it was; at
// the very start and once the product forms it pulls back to the whole molecule.
function actionFocus(f, t, last) {
  if (t < 0.04 || t > 0.86) return null;
  const P = new Map(f.atoms.map(a => [a.id, a.p]));
  const pts = [];
  for (const a of f.arrows) if ((a.opacity ?? 1) > 0.35) pts.push(a.from, a.to);
  for (const b of f.bonds) if (b.partial && P.get(b.a) && P.get(b.b)) pts.push(P.get(b.a), P.get(b.b));
  if (!pts.length) return last || null;
  return [0, 1, 2].map(k => pts.reduce((s, p) => s + p[k], 0) / pts.length);
}

function syncPlayButton() {
  if (!ui.play) return;
  const label = st.playing ? 'Pause' : st.t >= 1 ? 'Replay' : 'Play';
  if (ui.play.dataset.state !== label) {
    ui.play.dataset.state = label;
    ui.play.replaceChildren(playIcon(st.playing ? 'pause' : st.t >= 1 ? 'replay' : 'play'), document.createTextNode(label));
  }
}

function stepIndex(m, t) {
  const i = m.steps.findIndex(s => t >= s[0] && t < s[1]);
  return i < 0 ? m.steps.length - 1 : i;
}

function playIcon(kind) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('class', 'icon'); svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = kind === 'pause' ? '<path d="M8 5v14M16 5v14"/>' : kind === 'replay' ? '<path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5"/>' : '<path d="M7 4l13 8-13 8z" fill="currentColor"/>';
  return svg;
}

// Space plays/pauses, arrow keys step, while the mechanism player is on screen.
addEventListener('keydown', e => {
  if (st.tab !== 'mech' || !host.isConnected || e.ctrlKey || e.metaKey || e.altKey) return;
  const a = document.activeElement;
  if (a && (a.tagName === 'INPUT' && a.type !== 'range' || a.tagName === 'TEXTAREA' || a.tagName === 'SELECT' || a.isContentEditable)) return;
  if (e.key === ' ') { e.preventDefault(); if (ui.play) ui.play.click(); }
  else if (e.key === 'ArrowRight' && ui.next) { e.preventDefault(); ui.next(); }
  else if (e.key === 'ArrowLeft' && ui.prev) { e.preventDefault(); ui.prev(); }
});

// ---------------------------------------------------------------- page

export function renderOrgo(ctx) {
  C = ctx;
  const { h } = C;
  ui = {};
  const tabs = h('div', { class: 'orgo-tabs', role: 'tablist' }, TABS.map(([id, label]) => h('button', {
    type: 'button', role: 'tab', class: `orgo-tab${st.tab === id ? ' on' : ''}`, 'aria-selected': String(st.tab === id),
    onclick: () => { if (st.tab !== id) { st.tab = id; save('tab', id); shownKey = ''; C.render(); } },
  }, label)));
  const body = { mech: mechPage, concepts: () => conceptsPage(C), decide: decidePage, keys: () => problemsPage(C), mock: () => mockExamPage(C), cheat: () => cheatSheetPage(C), alkenes: alkenePage, mol: molPage, practice: practicePage, roulette: () => roulettePage(C, { SUBSTRATES, REAGENTS, REACTIONS, SM, OUTCOME_LABELS, decide, skeletal, selectMech, MECH_FOR }) }[st.tab] || mechPage;
  const page = h('div', { class: 'page orgo' },
    h('header', { class: 'page-head' }, h('div', null, h('h1', { text: 'Orgo' }),
      h('p', { class: 'muted small orgo-sub', text: 'Exam 3 · substitution, elimination and alkene reactions' }))),
    tabs, body());
  if (st.tab === 'mech' || st.tab === 'mol') queueMicrotask(attachViewer);
  return page;
}

function chip(label, on, onclick, extra = {}) {
  return C.h('button', { type: 'button', class: `chip chip-btn${on ? ' on' : ''}`, 'aria-pressed': String(!!on), onclick, ...extra }, label);
}

// ---------------------------------------------------------------- mechanisms

function selectMech(id, autoplay = true) {
  st.mech = id; save('mech', id);
  st.t = 0; st.playing = autoplay; shownKey = ''; drawnT = -1;
  if (st.tab !== 'mech') { st.tab = 'mech'; save('tab', 'mech'); }
  C.render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function mechPage() {
  const { h, card } = C;
  const m = mechById(st.mech);
  if (viewer) msgEl.textContent = '';
  const groups = [...new Set(MECHS.map(x => x.group))];
  const picker = h('div', { class: 'mech-picker' }, groups.map(g => h('div', { class: 'mech-group' },
    h('div', { class: 'mech-group-label', text: g }),
    h('div', { class: 'chips' }, MECHS.filter(x => x.group === g).map(x => chip(x.title, x.id === m.id, () => selectMech(x.id)))))));

  const scrub = h('input', {
    type: 'range', min: '0', max: '1000', step: '1', value: String(Math.round(st.t * 1000)), class: 'scrub', 'aria-label': 'Animation position',
    oninput: e => { st.t = Number(e.target.value) / 1000; st.playing = false; drawMech(true); },
  });
  ui.scrub = scrub;
  const play = h('button', {
    type: 'button', class: 'btn btn-primary play-btn',
    onclick: () => {
      if (st.playing) st.playing = false;
      else { if (st.t >= 1) st.t = 0; st.playing = true; }
      drawMech(true);
    },
  });
  ui.play = play;
  const jump = dir => {
    const i = stepIndex(m, st.t);
    let target;
    if (dir < 0) target = st.t - m.steps[i][0] > 0.02 ? m.steps[i][0] : m.steps[Math.max(0, i - 1)][0];
    else target = i + 1 < m.steps.length ? m.steps[i + 1][0] : 1;
    st.t = target; st.playing = false; drawMech(true);
  };
  ui.next = () => jump(1);
  ui.prev = () => jump(-1);
  const controls = h('div', { class: 'player' },
    h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Previous step', title: 'Previous step', onclick: () => jump(-1) }, arrowIcon('left')),
    play,
    h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Next step', title: 'Next step', onclick: () => jump(1) }, arrowIcon('right')),
    scrub);

  const toggles = h('div', { class: 'player-opts' },
    h('div', { class: 'chips' },
      [0.5, 1, 2].map(sp => chip(`${sp}×`, st.speed === sp, () => { st.speed = sp; C.render(); })),
      chip('Stop at each step', st.stepPause, () => { st.stepPause = !st.stepPause; C.render(); }),
      chip('Loop', st.loop, () => { st.loop = !st.loop; st.hold = 0; C.render(); })),
    h('div', { class: 'chips' },
      chip('Orbitals', st.show.orbitals, () => { st.show.orbitals = !st.show.orbitals; C.render(); }),
      chip('Arrows', st.show.arrows, () => { st.show.arrows = !st.show.arrows; C.render(); }),
      chip('Charges', st.show.labels, () => { st.show.labels = !st.show.labels; C.render(); })),
    h('div', { class: 'chips' },
      (m.views || []).map(([label, v]) => chip(label, false, () => viewer && viewer.setView(v[0], v[1]))),
      chip('Reset view', false, () => viewer && viewer.setView(m.view[0], m.view[1]))),
    m.options === 'face' ? h('div', { class: 'chips' },
      h('span', { class: 'muted small', text: 'Water attacks the' }),
      chip('back face', st.face === 'back', () => { st.face = 'back'; C.render(); }),
      chip('front face', st.face === 'front', () => { st.face = 'front'; C.render(); })) : null);

  const si = stepIndex(m, st.t);
  ui.step = si;
  ui.stepTitle = h('h3', { class: 'step-title', text: `${si + 1}. ${m.steps[si][2]}` });
  ui.stepText = h('p', { class: 'step-text', text: m.steps[si][3] });
  ui.stepItems = m.steps.map(([t0, , title], i) => h('li', { class: i === si ? 'on' : null },
    h('button', { type: 'button', onclick: () => { st.t = t0; st.playing = false; drawMech(true); } },
      h('span', { class: 'step-n', text: String(i + 1) }), h('span', { text: title }))));

  const en = energyDiagram(m.energy);
  ui.energy = en.setT;
  en.setT(st.t);

  return h('div', { class: 'grid orgo-grid' },
    h('div', { class: 'col' },
      h('section', { class: 'card mech-card' },
        picker,
        h('div', { class: 'mech-head' }, h('h2', { text: m.title }), h('span', { class: 'muted', text: m.sub })),
        host,
        controls,
        (ui.narr = h('div', { class: 'narration' }, ui.stepTitle, ui.stepText)),
        toggles,
        h('p', { class: 'muted small mech-legend', text: 'Gold dots are electron pairs flowing along each curved arrow. Dashed pink bonds are half-made or half-broken. Purple lobes are empty orbitals; green/pink lobes are filled ones (the two colours are the two phases). The camera swings around as the reaction runs; drag any time to look for yourself.' }))),
    h('div', { class: 'col col-narrow' },
      card('Energy diagram', null, en.svg, h('p', { class: 'muted small', text: 'The dot follows the animation. ‡ = transition state; dips between peaks are intermediates.' })),
      card('Steps', null, h('ol', { class: 'step-list' }, ui.stepItems)),
      card('Key facts', null, h('ul', { class: 'bullets' }, m.facts.map(t => h('li', { text: t }))))));
}

function arrowIcon(dir) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('class', 'icon'); svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = dir === 'left' ? '<path d="M15 6l-6 6 6 6M5 5v14"/>' : '<path d="M9 6l6 6-6 6M19 5v14"/>';
  return svg;
}

// ---------------------------------------------------------------- decider

function decidePage() {
  const { h, card } = C;
  const d = st.dec;
  const sub = SUBSTRATES.find(s => s.cls === d.cls && !s.rearr);
  const res = decide({ cls: d.cls, reagent: d.reagent, solvent: d.solvent, heat: d.heat });

  const subRow = h('div', { class: 'sub-pick' }, ['methyl', '1', '2', '3'].map(cls => {
    const ex = SUBSTRATES.find(s => s.cls === cls && !s.rearr);
    return h('button', {
      type: 'button', class: `sub-opt${d.cls === cls ? ' on' : ''}`, 'aria-pressed': String(d.cls === cls),
      onclick: () => { d.cls = cls; C.render(); },
    }, h('strong', { text: CLASS_LABEL[cls] }), skeletal(ex.spec, { scale: 18 }), h('span', { class: 'muted small', text: ex.name }));
  }));

  const reagentRows = Object.entries(REAGENT_TYPES).map(([type, info]) => h('div', { class: 'reagent-row' },
    h('div', { class: 'reagent-type', text: info.label }),
    h('div', { class: 'chips' }, REAGENTS.filter(r => r.type === type).map(r => chip(r.f, d.reagent === r.id, () => {
      d.reagent = r.id;
      if (type === 'weak') d.solvent = 'protic';
      C.render();
    })))));

  const conditions = card('Conditions', null,
    h('div', { class: 'field-label', text: 'Substrate' }), subRow,
    h('div', { class: 'field-label', text: 'Reagent' }), reagentRows,
    h('div', { class: 'cond-row' },
      h('div', null, h('div', { class: 'field-label', text: 'Solvent' }),
        h('div', { class: 'chips' },
          chip('Polar aprotic (DMSO, acetone)', d.solvent === 'aprotic', () => { d.solvent = 'aprotic'; C.render(); }, { disabled: res.reagent.type === 'weak' }),
          chip('Polar protic (H₂O, ROH)', d.solvent === 'protic', () => { d.solvent = 'protic'; C.render(); }))),
      h('div', null, h('div', { class: 'field-label', text: 'Temperature' }),
        h('div', { class: 'chips' }, chip('Heat (Δ)', d.heat, () => { d.heat = !d.heat; C.render(); })))));

  const badges = h('div', { class: 'verdict-badges' }, res.out.map((o, i) => h('span', {
    class: `mbadge mb-${o.toLowerCase()}${i ? ' minor' : ''}`, text: o === 'none' ? 'No reaction' : o,
  })));
  const verdict = card('Verdict', null,
    h('div', { class: 'verdict' },
      skeletal(sub.spec, { scale: 26 }),
      h('div', { class: 'verdict-arrow' }, h('span', { text: res.reagent.f }), h('span', { class: 'muted small', text: `${d.solvent === 'aprotic' ? 'polar aprotic' : 'polar protic'}${d.heat ? ', heat' : ''}` }), h('span', { class: 'arrow-line' })),
      h('div', null, badges, h('div', { class: 'verdict-label', text: res.label }))),
    h('h3', { class: 'sub-h', text: 'Why' }),
    h('ul', { class: 'bullets' }, res.why.map(t => h('li', { text: t }))),
    res.result.length ? h('h3', { class: 'sub-h', text: 'What you get' }) : null,
    res.result.length ? h('ul', { class: 'bullets' }, res.result.map(t => h('li', { text: t }))) : null,
    h('div', { class: 'row watch-row' }, res.out.filter(o => MECH_FOR[o]).map(o => h('button', {
      type: 'button', class: 'btn btn-small', onclick: () => selectMech(MECH_FOR[o]),
    }, `Watch ${o} in 3D →`))));

  const types = Object.keys(REAGENT_TYPES), classes = ['methyl', '1', '2', '3'];
  const short = out => out[0] === 'none' ? '—' : out.length > 1 ? (out.join('+') === 'SN1+E1' ? 'SN1 + E1' : `${out[0]} > ${out[1]}`) : out[0];
  const table = card('The big table', null,
    h('div', { class: 'table-wrap' }, h('table', { class: 'big-table' },
      h('thead', null, h('tr', null, h('th', { text: '' }), classes.map(c => h('th', { text: CLASS_LABEL[c] })))),
      h('tbody', null, types.map(tp => h('tr', null,
        h('th', { text: REAGENT_TYPES[tp].label }),
        classes.map(c => {
          const out = tableCell(tp, c);
          const on = res.reagent.type === tp && d.cls === c;
          return h('td', { class: `${on ? 'on ' : ''}cell-${out[0].toLowerCase()}` },
            h('button', { type: 'button', title: outcomeLabel(out), onclick: () => {
              d.cls = c;
              if (res.reagent.type !== tp) d.reagent = REAGENTS.find(r => r.type === tp).id;
              if (tp === 'weak') d.solvent = 'protic';
              C.render();
            } }, short(out)));
        })))))),
    h('p', { class: 'muted small', text: '“E2 > SN2” means E2 major, SN2 minor. Heat pushes any of these toward elimination.' }));

  return h('div', { class: 'grid orgo-grid' },
    h('div', { class: 'col' }, conditions, verdict),
    h('div', { class: 'col col-narrow' }, table, card('How to decide', null, h('ol', { class: 'bullets numbered' },
      h('li', { text: 'Classify the reagent: strong nucleophile? strong base? bulky? weak?' }),
      h('li', { text: 'Classify the substrate: methyl, 1°, 2° or 3°.' }),
      h('li', { text: 'Read the table, then check solvent and heat.' }),
      h('li', { text: 'Finish with regio and stereo: inversion (SN2), racemic (SN1), Zaitsev vs Hofmann (E).' })))));
}

// ---------------------------------------------------------------- alkene reactions

function alkenePage() {
  const { h, card } = C;
  const top = card('Starting alkene', h('div', { class: 'chips' },
    chip('Hide products (self-quiz)', st.hideAnswers, () => { st.hideAnswers = !st.hideAnswers; st.revealed.clear(); C.render(); })),
  h('div', { class: 'sm-row' },
    skeletal(SM, { scale: 34 }),
    h('div', null,
      h('p', { text: '1-Methylcyclopentene. C1 (with the methyl) is the more substituted carbon; C2 has the H.' }),
      h('p', { class: 'muted small', text: 'New atoms are pink. Wedge = toward you, dashes = away. “+ enantiomer” means a racemic mixture forms.' }))));

  const cards = REACTIONS.map(r => {
    const hidden = st.hideAnswers && !st.revealed.has(r.id);
    const productArea = hidden
      ? h('button', { type: 'button', class: 'reveal', onclick: () => { st.revealed.add(r.id); C.render(); } }, 'Tap to reveal')
      : h('div', { class: 'rx-product' },
        r.start ? skeletal(r.start, { scale: 19 }) : null,
        r.start ? h('span', { class: 'rx-mini-arrow', text: '→' }) : null,
        skeletal(r.product, { scale: r.start ? 19 : r.wide ? 22 : 26 }),
        h('div', { class: 'rx-name' }, r.name, r.racemic ? h('span', { class: 'muted', text: ' + enantiomer' }) : null));
    return h('section', { class: 'card rx-card' },
      h('div', { class: 'rx-reagents' }, r.reagents.map(t => h('div', { text: t }))),
      productArea,
      hidden ? null : h('div', { class: 'rx-tags' },
        tag('Adds', r.adds), r.regio !== '—' ? tag('Regio', r.regio) : null, r.stereo !== '—' ? tag('Stereo', r.stereo) : null,
        tag('Via', r.via + (r.rearr ? ' · can rearrange' : ''))),
      hidden ? null : h('p', { class: 'muted small rx-note', text: r.note }),
      r.mech ? h('button', { type: 'button', class: 'link rx-watch', onclick: () => selectMech(r.mech) }, 'Watch it in 3D →') : null);
  });
  return h('div', { class: 'orgo-stack' }, top, h('div', { class: 'rx-grid' }, cards));
}

function tag(k, v) {
  return C.h('span', { class: 'rx-tag' }, C.h('span', { class: 'rx-k', text: k }), C.h('span', { text: v }));
}

// ---------------------------------------------------------------- molecules

const PRESETS = [
  ['2-bromobutane', 'C2 is a stereocenter (H, CH₃, CH₂CH₃, Br). It’s the substrate in the SN2 and E2 animations.'],
  ['2-bromo-2-methylpropane', 'tert-Butyl bromide: three methyls guard the back of the C–Br carbon. No room for SN2, but a great 3° carbocation for SN1/E1.'],
  ['cyclohexane', 'The chair. Find the 6 axial H’s (straight up and down) and the 6 equatorial H’s (around the rim). E2 on rings needs H and LG both axial.'],
  ['methylcyclohexane', 'In the stable chair the methyl sits equatorial, away from 1,3-diaxial H’s.'],
  ['1-methylcyclopentene', 'The trisubstituted alkene used in all the alkene animations. C1 (with the methyl) is the more substituted end.'],
  ['cis-2-butene', 'Both methyls on the same side of the C=C. Compare with trans-2-butene.'],
  ['trans-2-butene', 'The major E2 product from 2-bromobutane: methyls on opposite sides, less strained than cis.'],
  ['3-chloroperoxybenzoic acid', 'mCPBA, the epoxidizing reagent. The weak O–O bond hands one oxygen to the alkene.'],
  ['tert-butanol', 'The conjugate acid of t-BuO⁻. Picture how bulky that base is.'],
];
const molCache = new Map();

async function loadMolecule(name) {
  const m = st.mol;
  m.name = name; m.loading = true; m.error = ''; m.info = null;
  C.render();
  try {
    await ensureViewer();
    let entry = molCache.get(name.toLowerCase());
    if (!entry) {
      const base = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}`;
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 20000);
      let r;
      try { r = await fetch(`${base}/SDF?record_type=3d`, { signal: ctrl.signal }); }
      catch { throw new Error('Couldn’t reach PubChem. Check your connection and try again.'); }
      finally { clearTimeout(timer); }
      if (r.status === 404) throw new Error('PubChem doesn’t have a 3D model for that name. Try another spelling or a simpler molecule.');
      if (!r.ok) throw new Error(`PubChem error ${r.status}. Try again in a moment.`);
      entry = { frame: parseSdf(await r.text()), info: null };
      molCache.set(name.toLowerCase(), entry);
      // name and formula are extras: fill them in when they arrive
      fetch(`${base}/property/IUPACName,MolecularFormula,MolecularWeight/JSON`)
        .then(res => res.json())
        .then(pj => { entry.info = pj.PropertyTable.Properties[0]; if (st.mol.name === name) { st.mol.info = entry.info; if (st.tab === 'mol') C.render(); } })
        .catch(() => {});
    }
    if (m.name !== name) return;
    m.frame = entry.frame; m.info = entry.info;
  } catch (e) {
    if (m.name === name) { m.error = e.message || String(e); m.frame = null; }
  } finally {
    if (m.name === name) { m.loading = false; shownKey = ''; C.render(); }
  }
}

function molPage() {
  const { h, card } = C;
  const m = st.mol;
  const input = h('input', { type: 'search', placeholder: 'Any molecule, e.g. “caffeine” or “(R)-2-butanol”', 'aria-label': 'Molecule name', value: '', autocomplete: 'off' });
  const form = h('form', {
    class: 'mol-search',
    onsubmit: e => { e.preventDefault(); const q = input.value.trim(); if (q) loadMolecule(q); },
  }, input, h('button', { class: 'btn btn-primary', type: 'submit', text: 'Show' }));
  const preset = PRESETS.find(p => p[0].toLowerCase() === m.name.toLowerCase());
  const info = m.info;
  const formula = info && info.MolecularFormula ? info.MolecularFormula.replace(/\d+/g, d => [...d].map(c => '₀₁₂₃₄₅₆₇₈₉'[c]).join('')) : '';
  msgEl.textContent = m.loading ? 'Loading from PubChem…' : m.error || '';

  return h('div', { class: 'grid orgo-grid' },
    h('div', { class: 'col' },
      h('section', { class: 'card mech-card' },
        form,
        h('div', { class: 'chips preset-chips' }, PRESETS.map(([n]) => chip(n, n === m.name, () => loadMolecule(n)))),
        h('div', { class: 'mech-head' }, h('h2', { text: m.name }), formula ? h('span', { class: 'muted', text: `${formula} · ${Number(info.MolecularWeight).toFixed(1)} g/mol` }) : null),
        host,
        h('div', { class: 'player-opts' }, h('div', { class: 'chips' },
          chip('Ball & stick', m.style === 'ball', () => { m.style = 'ball'; C.render(); }),
          chip('Space-filling', m.style === 'space', () => { m.style = 'space'; C.render(); }),
          chip('Spin', m.spin, () => { m.spin = !m.spin; C.render(); }),
          chip('Reset view', false, () => viewer && viewer.setView(10, -20)))))),
    h('div', { class: 'col col-narrow' },
      card('About this one', null, h('p', { text: preset ? preset[1] : (info && info.IUPACName ? `IUPAC name: ${info.IUPACName}` : 'Search any name to see its 3D shape.') })),
      card('Colours', null, h('div', { class: 'legend-atoms' },
        [['C', 'carbon'], ['H', 'hydrogen'], ['O', 'oxygen'], ['N', 'nitrogen'], ['Br', 'bromine'], ['Cl', 'chlorine']].map(([e, n]) => h('span', { class: 'atom-key' }, h('span', { class: `atom-dot el-${e}` }), n)))),
      card('Where this comes from', null, h('p', { class: 'muted small', text: '3D structures come from PubChem (NIH). Only the molecule name you type is sent there, nothing from your vault.' }))));
}

// ---------------------------------------------------------------- practice

const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const TWINS = { hydration: 'oxymerc', oxymerc: 'hydration' };

function newQuestion(mode) {
  const kind = mode === 'mixed' ? pick(['mech', 'mech', 'alkene', 'alkene', 'concept']) : mode;
  if (kind === 'mech') {
    const sub = pick(SUBSTRATES), r = pick(REAGENTS);
    const solvent = r.type === 'weak' ? 'protic' : Math.random() < 0.65 ? 'aprotic' : 'protic';
    const heat = r.type === 'nuc' ? false : Math.random() < 0.5;
    const d = decide({ cls: sub.cls, reagent: r.id, solvent, heat, rearr: sub.rearr });
    const solv = r.type === 'weak' ? ' (as solvent)' : solvent === 'aprotic' ? (r.id === 'LDA' ? ', THF' : ', DMSO') : (r.id === 'NaOMe' ? ', CH₃OH' : ', EtOH');
    return {
      kind, prompt: 'Which mechanism(s)?', spec: sub.spec, specName: sub.name, cond: `${r.f}${solv}${heat ? ', heat' : ''}`,
      answer: d.label, options: shuffle([d.label, ...shuffle(OUTCOME_LABELS.filter(x => x !== d.label)).slice(0, 3)]),
      explain: [...d.why, ...d.result], watch: d.out.filter(o => MECH_FOR[o]),
    };
  }
  if (kind === 'alkene') {
    const r = pick(REACTIONS);
    const pool = REACTIONS.filter(x => x.id !== r.id && x.id !== TWINS[r.id]);
    if (Math.random() < 0.5) {
      const opts = shuffle(pool).slice(0, 3);
      return {
        kind, prompt: `Which reagents turn ${r.start ? '1,2-dimethylcyclopentene' : '1-methylcyclopentene'} into this?`,
        spec: r.product, specName: r.name, startSpec: r.start || SM,
        answer: r.reagents.join(' '), options: shuffle([r, ...opts].map(x => x.reagents.join(' '))),
        explain: [`${r.reagents.join(' ')} adds ${r.adds}${r.regio !== '—' ? `, ${r.regio}` : ''}${r.stereo !== '—' ? `, ${r.stereo.toLowerCase()}` : ''}.`, r.note], watch: [], mech: r.mech,
      };
    }
    const desc = x => [x.adds, x.regio !== '—' ? x.regio : null, x.stereo !== '—' ? x.stereo : null].filter(Boolean).join(' · ');
    const opts = shuffle(pool.filter(x => desc(x) !== desc(r))).slice(0, 3);
    return {
      kind, prompt: `What does ${r.reagents.join(' ')} do to an alkene?`,
      answer: desc(r), options: shuffle([r, ...opts].map(desc)), explain: [`via ${r.via}${r.rearr ? ' (rearrangements possible)' : ''}.`, r.note], watch: [], mech: r.mech,
    };
  }
  const c = pick(CONCEPTS);
  return { kind: 'concept', prompt: c.q, answer: c.a, options: shuffle([c.a, ...c.o]), explain: [c.why], watch: [] };
}

function practicePage() {
  const { h, card } = C;
  const q = st.quiz;
  if (!q.q) q.q = newQuestion(q.mode);
  const Q = q.q;
  const modes = [['mixed', 'Mixed'], ['mech', 'Which mechanism?'], ['alkene', 'Alkene reagents'], ['concept', 'Concepts']];
  const answered = q.picked !== null;
  const quiz = card('Quiz', h('span', { class: 'card-meta', text: q.total ? `${q.right} / ${q.total} right` : '' }),
    h('div', { class: 'chips' }, modes.map(([id, label]) => chip(label, q.mode === id, () => { q.mode = id; q.q = newQuestion(id); q.picked = null; C.render(); }))),
    h('div', { class: 'q-box' },
      Q.spec ? h('div', { class: 'q-struct' },
        Q.startSpec ? skeletal(Q.startSpec, { scale: 24 }) : null,
        Q.startSpec ? h('span', { class: 'rx-mini-arrow', text: '→' }) : null,
        skeletal(Q.spec, { scale: Q.startSpec ? 24 : 30 }),
        Q.cond ? h('div', { class: 'q-cond' }, h('span', { text: Q.cond }), h('span', { class: 'arrow-line' })) : null) : null,
      h('p', { class: 'q-prompt', text: Q.prompt }),
      h('div', { class: 'q-options' }, Q.options.map(o => {
        let cls = 'q-opt';
        if (answered && o === Q.answer) cls += ' right';
        else if (answered && o === q.picked) cls += ' wrong';
        return h('button', {
          type: 'button', class: cls, disabled: answered,
          onclick: () => { q.picked = o; q.total++; if (o === Q.answer) q.right++; else addMistake(`${Q.specName ? `${Q.specName}${Q.cond ? ` + ${Q.cond}` : ''}: ` : ''}${Q.prompt}`, `${Q.answer}
${Q.explain.slice(0, 2).join(' ')}`); C.render(); },
        }, o);
      })),
      answered ? h('div', { class: `q-feedback ${q.picked === Q.answer ? 'ok' : 'no'}` },
        h('strong', { text: q.picked === Q.answer ? 'Correct ✿' : `Not quite. Answer: ${Q.answer}` }),
        h('ul', { class: 'bullets' }, Q.explain.map(t => h('li', { text: t }))),
        h('div', { class: 'row' },
          h('button', { type: 'button', class: 'btn btn-primary', text: 'Next question', onclick: () => { q.q = newQuestion(q.mode); q.picked = null; C.render(); } }),
          ...(Q.watch || []).map(o => h('button', { type: 'button', class: 'btn btn-small', onclick: () => selectMech(MECH_FOR[o]) }, `Watch ${o}`)),
          Q.mech ? h('button', { type: 'button', class: 'btn btn-small', onclick: () => selectMech(Q.mech) }, 'Watch it in 3D') : null)) : null));

  return h('div', { class: 'grid orgo-grid' },
    h('div', { class: 'col' }, quiz),
    h('div', { class: 'col col-narrow' }, flashcards()));
}

// Leitner boxes: how many days until a card comes back after each "Got it".
const INTERVALS = [0, 1, 2, 4, 8, 16];

function fcRecord(id) {
  return (C.S().orgo || []).find(x => x.id === `fc:${id}` && !x.deleted);
}

function flashcards() {
  const { h, card } = C;
  const f = st.fc;
  const today = C.todayStr();
  const deck = CARDS.filter(c => f.deck === 'All' || c.deck === f.deck);
  const due = deck.filter(c => { const r = fcRecord(c.id); return !r || r.due <= today; });
  const reviews = due.filter(c => fcRecord(c.id)).sort((a, b) => fcRecord(a.id).due.localeCompare(fcRecord(b.id).due));
  const fresh = due.filter(c => !fcRecord(c.id));
  const queue = [...reviews, ...fresh];
  const ordered = [...queue.filter(c => !f.again.has(c.id)), ...queue.filter(c => f.again.has(c.id))];
  if (!ordered.some(c => c.id === f.current)) { f.current = ordered[0] ? ordered[0].id : null; f.flipped = false; }
  const cur = CARDS.find(c => c.id === f.current);
  const mastered = deck.filter(c => { const r = fcRecord(c.id); return r && r.box >= 3; }).length;

  const answer = good => C.commit(() => {
    const S = C.S();
    if (!S.orgo) S.orgo = [];
    let rec = S.orgo.find(x => x.id === `fc:${cur.id}`);
    if (!rec) { rec = { id: `fc:${cur.id}`, box: 0, due: today }; S.orgo.push(rec); }
    rec.box = good ? Math.min(5, (rec.box || 0) + 1) : 0;
    rec.due = good ? C.addDays(today, INTERVALS[rec.box]) : today;
    rec.deleted = false;
    C.touch(rec);
    if (good) f.again.delete(cur.id); else f.again.add(cur.id);
    f.current = null; f.flipped = false;
  });

  const rx = cur && cur.reaction ? REACTIONS.find(r => r.id === cur.reaction) : null;
  return card('Flashcards', h('span', { class: 'card-meta', text: `${due.length} due` }),
    h('div', { class: 'chips' }, ['All', 'Alkenes', 'SN/E'].map(d => chip(d, f.deck === d, () => { f.deck = d; f.current = null; C.render(); }))),
    cur ? h('button', {
      type: 'button', class: `flashcard${f.flipped ? ' flipped' : ''}`, 'aria-label': f.flipped ? 'Card answer' : 'Card question. Tap to flip.',
      onclick: () => { f.flipped = !f.flipped; C.render(); },
    },
    h('span', { class: 'fc-deck', text: cur.deck }),
    f.flipped
      ? h('span', { class: 'fc-back' }, h('span', { class: 'fc-text', text: cur.back }), rx ? skeletal(rx.product, { scale: 20 }) : null)
      : h('span', { class: 'fc-front fc-text', text: cur.front }),
    h('span', { class: 'fc-hint', text: f.flipped ? '' : 'Tap to flip' }))
      : h('p', { class: 'empty', text: 'All caught up ✿ Come back tomorrow.' }),
    cur && f.flipped ? h('div', { class: 'row fc-actions' },
      h('button', { type: 'button', class: 'btn', text: 'Again', onclick: () => answer(false) }),
      h('button', { type: 'button', class: 'btn btn-primary', text: 'Got it', onclick: () => answer(true) })) : null,
    h('p', { class: 'muted small', text: `${mastered} of ${deck.length} cards learned · progress syncs with your vault` }));
}
