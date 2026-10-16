// Bio concept map: the 10 lectures sit on an outer ring, cross-lecture ideas float inside,
// and lines show where each idea shows up. Tap an idea for a plain summary and buttons that
// jump straight into the guided lecture at that step; tap a lecture to light up its ideas.

import { E } from './kit.js';
import { THEMES, CONCEPTS } from './mapdata.js?v=1';

const W = 1000, H = 760, CX = 500, CY = 380;
const ms = { sel: null, theme: null }; // sel: { kind: 'c' | 'l', id }

let LAYOUT = null;
function layout(LECTURES) {
  if (LAYOUT) return LAYOUT;
  const lec = {};
  LECTURES.forEach((l, i) => {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / LECTURES.length;
    lec[l.id] = { x: CX + 430 * Math.cos(a), y: CY + 320 * Math.sin(a) };
  });
  // start each idea between its lectures, pulled toward the middle, then push overlapping ones apart
  const pts = CONCEPTS.map(c => {
    const ls = [...new Set(c.links.map(k => k[0]))];
    const mx = ls.reduce((s, id) => s + lec[id].x, 0) / ls.length, my = ls.reduce((s, id) => s + lec[id].y, 0) / ls.length;
    return { c, x: CX + (mx - CX) * 0.6, y: CY + (my - CY) * 0.6 };
  });
  for (let it = 0; it < 300; it++) {
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const a = pts[i], b = pts[j];
      let dx = b.x - a.x, dy = (b.y - a.y) * 1.9;
      const d = Math.hypot(dx, dy) || 0.01;
      if (d < 170) { const p = (170 - d) / d * 0.08; dx *= p; dy *= p / 1.9; a.x -= dx; a.y -= dy; b.x += dx; b.y += dy; }
    }
    for (const p of pts) {
      const ex = (p.x - CX) / 330, ey = (p.y - CY) / 245, r = Math.hypot(ex, ey);
      if (r > 1) { p.x = CX + (p.x - CX) / r; p.y = CY + (p.y - CY) / r; }
    }
  }
  const con = {};
  for (const p of pts) con[p.c.id] = { x: p.x, y: p.y };
  return (LAYOUT = { lec, con });
}

function wrap(name) {
  if (name.length <= 17) return [name];
  const words = name.split(' '); let a = '';
  const lines = [];
  for (const w of words) { if ((a + ' ' + w).trim().length > 17 && a) { lines.push(a); a = w; } else a = (a + ' ' + w).trim(); }
  lines.push(a);
  return lines.slice(0, 3);
}

export function mapPage(C, LECTURES, WALKS, jump) {
  const { h, card } = C;
  const { lec, con } = layout(LECTURES);
  const themeColor = Object.fromEntries(THEMES.map(([id, , col]) => [id, col]));
  const L = id => LECTURES.find(l => l.id === id);
  const sel = ms.sel;
  const visible = c => !ms.theme || c.theme === ms.theme;
  const lit = c => {
    if (!sel) return true;
    if (sel.kind === 'c') return c.id === sel.id;
    return c.links.some(k => k[0] === sel.id);
  };
  const pick = s => { ms.sel = ms.sel && s && ms.sel.kind === s.kind && ms.sel.id === s.id ? null : s; C.render(); };

  const svg = E('svg', { viewBox: `0 0 ${W} ${H}`, class: 'bio-map-svg', role: 'img', 'aria-label': 'Concept map of Bio 2: ideas in the middle, lectures around the edge' });
  const gEdges = E('g', { class: 'bm-edges' }, svg);
  const gLec = E('g', {}, svg);
  const gCon = E('g', {}, svg);

  for (const c of CONCEPTS) {
    if (!visible(c)) continue;
    const on = lit(c);
    const seen = new Set();
    for (const [lid] of c.links) {
      if (seen.has(lid)) continue; seen.add(lid);
      const a = con[c.id], b = lec[lid];
      const mx = (a.x + b.x) / 2 + (CY - (a.y + b.y) / 2) * 0.12, my = (a.y + b.y) / 2 + ((a.x + b.x) / 2 - CX) * 0.12;
      const hot = sel && on && (sel.kind === 'c' || sel.id === lid);
      E('path', { d: `M${a.x.toFixed(1)},${a.y.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)}`, class: `bm-edge${hot ? ' hot' : ''}${sel && !hot ? ' dim' : ''}`, style: `stroke:${themeColor[c.theme]}` }, gEdges);
    }
  }

  for (const l of LECTURES) {
    const p = lec[l.id];
    const on = !sel || (sel.kind === 'l' && sel.id === l.id) || (sel.kind === 'c' && CONCEPTS.find(c => c.id === sel.id).links.some(k => k[0] === l.id));
    const g = E('g', { class: `bm-lec${on ? '' : ' dim'}${sel && sel.kind === 'l' && sel.id === l.id ? ' sel' : ''}`, transform: `translate(${p.x.toFixed(1)},${p.y.toFixed(1)})`, tabindex: '0', role: 'button', 'aria-label': `Lecture ${l.n}: ${l.short}` }, gLec);
    E('circle', { r: 30, style: `fill: var(${l.color})` }, g);
    const n = E('text', { y: 6, class: 'bm-lec-n' }, g); n.textContent = l.n;
    const t = E('text', { y: p.y > CY + 100 ? 50 : -42, class: 'bm-lec-t' }, g); t.textContent = l.short;
    g.addEventListener('click', () => pick({ kind: 'l', id: l.id }));
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick({ kind: 'l', id: l.id }); } });
  }

  for (const c of CONCEPTS) {
    if (!visible(c)) continue;
    const p = con[c.id];
    const lines = wrap(c.name);
    const w = Math.max(...lines.map(s => s.length)) * 7.6 + 26, hh = lines.length * 17 + 14;
    const isSel = sel && sel.kind === 'c' && sel.id === c.id;
    const g = E('g', { class: `bm-con${lit(c) ? '' : ' dim'}${isSel ? ' sel' : ''}`, transform: `translate(${p.x.toFixed(1)},${p.y.toFixed(1)})`, tabindex: '0', role: 'button', 'aria-label': c.name }, gCon);
    E('rect', { x: -w / 2, y: -hh / 2, width: w, height: hh, rx: hh / 2 > 20 ? 18 : hh / 2, style: `stroke:${themeColor[c.theme]}` }, g);
    lines.forEach((s, i) => { const t = E('text', { y: -hh / 2 + 22 + i * 17, class: 'bm-con-t' }, g); t.textContent = s; });
    g.addEventListener('click', () => pick({ kind: 'c', id: c.id }));
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick({ kind: 'c', id: c.id }); } });
  }
  svg.addEventListener('click', e => { if (e.target === svg && ms.sel) pick(null); });

  const stepBtn = (lid, i) => {
    const l = L(lid), s = WALKS[lid] && WALKS[lid][i];
    return h('button', { type: 'button', class: 'bm-step', style: `--lc: var(${l.color})`, onclick: () => jump(lid, i) },
      h('span', { class: 'bio-tab-n', text: l.n }), h('span', null, h('strong', { text: s ? s.title : `Lecture ${l.n}` }), h('span', { class: 'muted small', text: ` · step ${i + 1}` })), h('span', { class: 'bm-go', text: '▶' }));
  };

  let side;
  if (sel && sel.kind === 'c') {
    const c = CONCEPTS.find(x => x.id === sel.id);
    side = h('section', { class: 'card bm-panel', style: `--tc:${themeColor[c.theme]}` },
      h('div', { class: 'bm-panel-top' }, h('p', { class: 'bm-kicker', text: THEMES.find(t => t[0] === c.theme)[1] }), h('button', { type: 'button', class: 'link small', text: 'Close ✕', onclick: () => pick(null) })),
      h('h2', { class: 'bm-title', text: c.name }),
      h('p', { text: c.text }),
      h('h3', { class: 'bio-sub-h', text: `Shows up in ${new Set(c.links.map(k => k[0])).size} lectures` }),
      h('div', { class: 'bm-steps' }, c.links.map(([lid, i]) => stepBtn(lid, i))));
  } else if (sel && sel.kind === 'l') {
    const l = L(sel.id);
    const mine = CONCEPTS.filter(c => c.links.some(k => k[0] === l.id));
    side = h('section', { class: 'card bm-panel', style: `--tc: var(${l.color})` },
      h('div', { class: 'bm-panel-top' }, h('p', { class: 'bm-kicker', text: `Lecture ${l.n} · ${l.chapter}` }), h('button', { type: 'button', class: 'link small', text: 'Close ✕', onclick: () => pick(null) })),
      h('h2', { class: 'bm-title', text: l.title }),
      h('p', { class: 'muted small', text: `${mine.length} big ideas connect this lecture to the rest of the course:` }),
      h('ul', { class: 'bm-list' }, mine.map(c => h('li', null, h('button', { type: 'button', class: 'link', style: `color:${themeColor[c.theme]}`, text: c.name, onclick: () => pick({ kind: 'c', id: c.id }) })))));
  } else {
    side = h('p', { class: 'card bm-panel bm-help muted small', text: 'Tap an idea for a plain summary and buttons that open the guided lecture at that exact step. Tap a lecture to light up the ideas it shares with the rest of the course. Exam tip: pick an idea and explain it in each of its lectures out loud.' });
  }

  const chips = h('div', { class: 'chips bm-themes' },
    h('button', { type: 'button', class: `chip chip-btn${!ms.theme ? ' on' : ''}`, text: 'All ideas', onclick: () => { ms.theme = null; C.render(); } }),
    THEMES.map(([id, name, col]) => h('button', { type: 'button', class: `chip chip-btn bm-chip${ms.theme === id ? ' on' : ''}`, style: `--tc:${col}`, onclick: () => { ms.theme = ms.theme === id ? null : id; if (ms.sel && ms.sel.kind === 'c' && CONCEPTS.find(c => c.id === ms.sel.id).theme !== ms.theme) ms.sel = null; C.render(); } },
      h('span', { class: 'bm-dot' }), name)));

  return h('div', { class: 'bm' },
      h('section', { class: 'card bm-card' },
        h('div', { class: 'bm-head' },
          h('div', null, h('p', { class: 'bio-kicker', style: '--lc: var(--accent)', text: 'Bio 2 · how it all connects' }), h('h2', { class: 'bio-intro-title', text: 'Concept map' })),
          chips),
        h('div', { class: 'bm-scroll' }, svg),
        h('p', { class: 'muted small bm-hint', text: `${CONCEPTS.length} ideas · ${CONCEPTS.reduce((s, c) => s + c.links.length, 0)} links into the guided lectures` })),
    side);
}
