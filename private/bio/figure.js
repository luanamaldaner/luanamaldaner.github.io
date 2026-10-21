// Labeled diagrams for guided-lecture steps that name a lot of structures.
// The picture is an unlabeled illustration (bio/art/figs/*.webp); labels are drawn on top here so the
// text is always correct. Each label: { x, y } = the point on the picture (percent), { lx, ly } = where
// the label sits (percent), a = 'l' | 'r' | 'c' (label ends at / starts at / centred on lx; default: by side), t = name, d = one-line "what it does". Tap a label (or its dot) to read it.

import FA from './figures-a.js?v=1';
import FB from './figures-b.js?v=1';
import FC from './figures-c.js?v=2';

export const FIGURES = { ...FA, ...FB, ...FC };

const NS = 'http://www.w3.org/2000/svg';
const fs = { key: null, on: -1 };

export function figureFor(C, lecId, stepIndex) {
  const fig = FIGURES[`${lecId}:${stepIndex}`];
  if (!fig) return null;
  const { h } = C;
  const key = `${lecId}:${stepIndex}`;
  if (fs.key !== key) { fs.key = key; fs.on = -1; }
  const wrap = h('div', { class: 'bfig-stage', style: `aspect-ratio:${fig.ratio || '3 / 2'}` });
  wrap.append(h('img', { class: 'bfig-img', src: new URL(`./art/figs/${fig.img}`, import.meta.url).href, alt: fig.alt || '', loading: 'lazy' }));
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 100 100'); svg.setAttribute('preserveAspectRatio', 'none'); svg.setAttribute('class', 'bfig-lines');
  fig.labels.forEach((l, i) => {
    const line = document.createElementNS(NS, 'line');
    for (const [k, v] of Object.entries({ x1: l.lx, y1: l.ly, x2: l.x, y2: l.y })) line.setAttribute(k, v);
    line.setAttribute('class', `bfig-line${fs.on === i ? ' on' : ''}`);
    line.setAttribute('vector-effect', 'non-scaling-stroke');
    svg.append(line);
  });
  wrap.append(svg);
  const pick = i => { fs.on = fs.on === i ? -1 : i; C.render(); };
  fig.labels.forEach((l, i) => {
    wrap.append(h('button', { type: 'button', class: `bfig-dot${fs.on === i ? ' on' : ''}`, style: `left:${l.x}%;top:${l.y}%`, 'aria-label': l.t, onclick: () => pick(i) }));
    wrap.append(h('button', { type: 'button', class: `bfig-label${fs.on === i ? ' on' : ''} ${l.a === 'l' ? 'left' : l.a === 'r' ? 'right' : l.a === 'c' ? '' : l.lx > 60 ? 'right' : l.lx < 40 ? 'left' : ''}`, style: `left:${l.lx}%;top:${l.ly}%`, onclick: () => pick(i) }, l.t));
  });
  const cur = fig.labels[fs.on];
  // pop-up next to the tapped label: above it in the lower half, below it in the upper half, kept inside the picture
  if (cur) wrap.append(h('div', { class: `bfig-pop ${cur.ly > 50 ? 'up' : 'down'}`, role: 'status', style: `left:${Math.min(80, Math.max(20, cur.lx))}%;top:${cur.ly}%` },
    h('button', { type: 'button', class: 'bfig-pop-x', 'aria-label': 'Close', text: '×', onclick: () => pick(fs.on) }),
    h('strong', { text: cur.t }), cur.d ? h('span', { text: cur.d }) : null));
  return h('figure', { class: 'bfig' }, wrap,
    h('figcaption', { class: 'bfig-cap muted', text: fig.caption || 'Tap a label to see what that part does.' }));
}
