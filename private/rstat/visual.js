// Pictures for the R guided lessons. Each `vis.kind` in walk.js has a renderer here; all plain
// HTML/CSS (classes start with rv-) so they follow the page theme. h is app.js's element helper.

import { COLS, TYPES, DATA } from './walk.js?v=1';

let h;

const has = (list, x) => Array.isArray(list) && list.includes(x);
const hasCell = (cells, r, c) => Array.isArray(cells) && cells.some(([a, b]) => a === r && b === c);

// The guitars table with highlighted rows / columns / cells, optional list view and type badges.
function table(v) {
  const anySel = v.rows || v.cols || v.cells;
  const head = h('tr', null,
    h('th', { class: `rv-rn${v.hlRowNames ? ' rv-name' : ''}`, text: '' }),
    COLS.map((name, j) => h('th', {
      class: [`rv-${TYPES[j]}`, has(v.cols, j + 1) ? 'rv-on' : '', v.hlHeader ? 'rv-name' : '', has(v.strike, j + 1) ? 'rv-strike' : ''].join(' ').trim(),
    }, h('span', { text: name }), v.showTypes ? h('small', { class: 'rv-type', text: TYPES[j] }) : null, v.listView ? h('small', { class: 'rv-type', text: `[[${j + 1}]]` }) : null)));
  const body = DATA.map((row, i) => h('tr', { class: has(v.rows, i + 1) ? 'rv-on-row' : '' },
    h('th', { class: `rv-rn${v.hlRowNames ? ' rv-name' : ''}${has(v.rows, i + 1) ? ' rv-on' : ''}`, text: String(i + 1) }),
    row.map((cell, j) => {
      const on = hasCell(v.cells, i + 1, j + 1) || (has(v.rows, i + 1) && (!v.cols || has(v.cols, j + 1))) || (has(v.cols, j + 1) && !v.rows && !v.cells);
      const colOnly = has(v.cols, j + 1) && v.cells && !hasCell(v.cells, i + 1, j + 1);
      return h('td', {
        class: [`rv-${TYPES[j]}`, on ? 'rv-on' : anySel ? 'rv-dim' : '', colOnly ? 'rv-soft' : '', has(v.strike, j + 1) ? 'rv-strike' : ''].join(' ').trim(),
        text: cell,
      });
    }),
    v.flags ? h('td', { class: `rv-flag ${v.flags[i] ? 'yes' : 'no'}`, text: v.flags[i] ? 'TRUE' : 'FALSE' }) : null));
  const tbl = h('table', { class: `rv-table${v.listView ? ' rv-list' : ''}` }, h('thead', null, head), h('tbody', null, body));
  const scroller = h('div', { class: 'rv-scroll' }, tbl);
  // on a narrow screen, slide the table so the highlighted column is in view
  if (v.cols || v.cells) requestAnimationFrame(() => {
    const on = scroller.querySelector('td.rv-on, th.rv-on:not(.rv-rn)');
    if (on && scroller.scrollWidth > scroller.clientWidth) scroller.scrollLeft = Math.max(0, on.offsetLeft - scroller.clientWidth / 2 + on.offsetWidth / 2);
  });
  return h('div', { class: 'rv-wrap' },
    scroller,
    v.result ? arrow() : null,
    v.result ? result(v.result) : null,
    v.caption ? h('p', { class: 'rv-cap', text: v.caption }) : null);
}

function arrow() { return h('div', { class: 'rv-arrow', 'aria-hidden': 'true', text: '↓ returns' }); }

// What an expression gives back: a vector (sideways chips), a small data frame, a hop or a format diagram.
function result(r) {
  if (r.kind === 'vector') {
    return h('div', { class: 'rv-result' },
      h('span', { class: 'rv-badge vec', text: `vector · ${r.type === 'num' ? 'numeric' : 'character'} · length ${r.values.length}` }),
      h('div', { class: 'rv-vec' }, h('span', { class: 'rv-idx', text: '[1]' }), r.values.map(x => h('span', { class: `rv-chip rv-${r.type}`, text: x }))));
  }
  if (r.kind === 'df') {
    const t = h('table', { class: 'rv-table rv-mini' },
      h('thead', null, h('tr', null, h('th', { class: 'rv-rn', text: '' }), r.cols.map(j => h('th', { class: `rv-${TYPES[j - 1]}`, text: COLS[j - 1] })))),
      h('tbody', null, r.rows.map(i => h('tr', null, h('th', { class: 'rv-rn', text: String(i) }), r.cols.map(j => h('td', { class: `rv-${TYPES[j - 1]}`, text: DATA[i - 1][j - 1] }))))));
    return h('div', { class: 'rv-result' },
      h('span', { class: 'rv-badge df', text: `data frame · ${r.rows.length} row${r.rows.length === 1 ? '' : 's'} × ${r.cols.length} column${r.cols.length === 1 ? '' : 's'}` }),
      h('div', { class: 'rv-scroll' }, t));
  }
  if (r.kind === 'hop') {
    return h('div', { class: 'rv-hopbox' }, h('span', { class: 'rv-chip', text: r.from }), h('span', { class: 'rv-hoparrow', text: '+1 →' }), h('span', { class: 'rv-chip rv-hl', text: r.to }));
  }
  if (r.kind === 'format') return format({ parts: r.parts });
  return h('span', { class: 'rv-chip', text: r.text || '' });
}

// Side-by-side comparison of two expressions.
function compare(v) {
  return h('div', { class: 'rv-compare' }, v.items.map(it => h('div', { class: 'rv-cmp' },
    h('code', { class: 'r-inline rv-cmp-label', text: it.label }),
    h('p', { class: 'rv-cmp-note', text: it.note }),
    result(it.result))));
}

// The class label sitting on top of the stored double.
function typebox(v) {
  return h('div', { class: 'rv-typebox' },
    h('div', { class: 'rv-layer rv-outer' },
      h('span', { class: 'rv-layer-tag', text: `class: ${v.cls}` }),
      h('span', { class: 'rv-layer-val', text: `prints as ${v.printed}` }),
      h('div', { class: 'rv-layer rv-inner' },
        h('span', { class: 'rv-layer-tag', text: `typeof: ${v.type}` }),
        h('span', { class: 'rv-layer-val rv-num', text: v.raw }),
        h('span', { class: 'rv-layer-note', text: v.rawNote }))),
    h('p', { class: 'rv-cap', text: 'unclass() / as.numeric() peel off the outer label and show the number inside.' }));
}

// Evenly spaced marks (not to scale) with the zero point emphasized and an optional hop arc.
function timeline(v) {
  const marks = [...v.marks].sort((a, b) => a.v - b.v);
  const n = marks.length;
  const pos = i => (n === 1 ? 50 : 8 + (84 * i) / (n - 1));
  const line = h('div', { class: 'rv-tl' },
    h('div', { class: 'rv-tl-line' }),
    marks.map((m, i) => h('div', { class: `rv-tl-mark${m.zero ? ' zero' : ''}${m.hl ? ' hl' : ''}`, style: `left:${pos(i)}%` },
      h('span', { class: 'rv-tl-dot' }),
      h('span', { class: 'rv-tl-v', text: `${m.v.toLocaleString()}` }),
      h('span', { class: 'rv-tl-label', text: m.label }))),
    v.hop ? h('div', { class: 'rv-tl-hop', style: `left:${pos(v.hop.from)}%;width:${pos(v.hop.to) - pos(v.hop.from)}%` }, h('span', { text: v.hop.label })) : null);
  return h('div', { class: 'rv-wrap' }, line, h('p', { class: 'rv-cap', text: `The stored number = ${v.unit} since 1970-01-01${v.unit === 'seconds' ? ' 00:00 UTC' : ''} (marks not to scale).` }));
}

// Text pieces lined up with the format codes that read them.
function format(v) {
  return h('div', { class: 'rv-wrap' },
    h('div', { class: 'rv-fmt' }, v.fn ? h('span', { class: 'rv-fmt-fn', text: `${v.fn}(` }) : null,
      v.parts.map(([txt, codeStr, what], i) => codeStr
        ? h('span', { class: `rv-fmt-part c${i % 5}` }, h('span', { class: 'rv-fmt-txt', text: txt }), h('span', { class: 'rv-fmt-code', text: codeStr }), h('span', { class: 'rv-fmt-what', text: what }))
        : h('span', { class: 'rv-fmt-sep', text: txt })),
      v.fn ? h('span', { class: 'rv-fmt-fn', text: ')' }) : null),
    v.result ? h('div', { class: 'rv-arrow', text: '↓ becomes' }) : null,
    v.result ? h('span', { class: 'rv-chip rv-hl', text: v.result }) : null);
}

function century() {
  return h('div', { class: 'rv-wrap' },
    h('div', { class: 'rv-century' },
      h('div', { class: 'rv-cen a', style: 'flex: 69' }, h('strong', { text: '00 … 68' }), h('span', { text: '→ 2000s (e.g. 01 → 2001, 68 → 2068)' })),
      h('div', { class: 'rv-cen b', style: 'flex: 31' }, h('strong', { text: '69 … 99' }), h('span', { text: '→ 1900s (86 → 1986)' }))),
    h('p', { class: 'rv-cap', text: 'How %y picks the century for a 2-digit year.' }));
}

function pieces(v) {
  return h('div', { class: 'rv-wrap rv-pieces' },
    h('div', { class: 'rv-row' }, v.parts.map(([k, x]) => h('span', { class: 'rv-piece' }, h('small', { text: k }), h('strong', { text: x })))),
    h('div', { class: 'rv-arrow', text: '↓ ISOdate()' }),
    h('span', { class: 'rv-chip', text: v.mid }),
    h('div', { class: 'rv-arrow', text: '↓ as.Date()' }),
    h('span', { class: 'rv-chip rv-hl', text: v.out }));
}

function span(v) {
  return h('div', { class: 'rv-wrap' },
    h('div', { class: 'rv-span' }, h('span', { class: 'rv-chip', text: v.from }), h('span', { class: 'rv-span-bar' }, h('span', { text: v.label })), h('span', { class: 'rv-chip', text: v.to })),
    h('div', { class: 'rv-units' }, v.units.map(([u, ok]) => h('span', { class: `rv-unit ${ok ? 'ok' : 'no'}`, text: ok ? `✓ ${u}` : `✗ ${u}` }))),
    h('p', { class: 'rv-cap', text: 'Allowed difftime units (months and years are not a fixed length).' }));
}

function checks(v) {
  return h('div', { class: 'rv-checks' }, v.items.map(([label, ok]) => h('div', { class: `rv-check ${ok ? 'ok' : 'no'}` },
    h('code', { class: 'r-inline', text: label }), h('span', { class: 'rv-check-val', text: ok ? 'TRUE' : 'FALSE' }))));
}

function week(v) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return h('div', { class: 'rv-wrap' },
    h('div', { class: 'rv-week' }, days.map((d, i) => h('span', { class: `rv-day${i === v.on ? ' rv-hl' : ''}` }, h('small', { text: String(i + 1) }), h('strong', { text: d })))),
    h('p', { class: 'rv-cap', text: `wday() numbers: ${v.date} → 1. With label = TRUE: Sun < Mon < … < Sat (an ordered factor).` }));
}

function dst() {
  const row = (name, end, note, cls) => h('div', { class: `rv-dst-row ${cls}` },
    h('span', { class: 'rv-dst-name', text: name }),
    h('span', { class: 'rv-chip', text: 'Nov 5 · 12:00' }),
    h('span', { class: 'rv-dst-track' }, h('span', { class: 'rv-dst-fall', text: '⏪ clocks fall back 1 h' })),
    h('span', { class: 'rv-chip rv-hl', text: end }),
    h('span', { class: 'rv-dst-note', text: note }));
  return h('div', { class: 'rv-wrap' },
    row('+ dhours(24)', 'Nov 6 · 11:00', 'duration: exactly 86,400 s', 'dur'),
    row('+ hours(24)', 'Nov 6 · 12:00', 'period: same clock time', 'per'));
}

function intervals(v) {
  const x = d => `${(100 * (d - v.min)) / (v.max - v.min)}%`;
  const w = (a, b) => `${(100 * (b - a)) / (v.max - v.min)}%`;
  return h('div', { class: 'rv-wrap' },
    h('div', { class: 'rv-ints' },
      v.bars.map((b, i) => h('div', { class: `rv-int-row r${i}` }, h('span', { class: 'rv-int-name', text: b.label }),
        h('span', { class: 'rv-int-track' }, h('span', { class: 'rv-int-bar', style: `left:${x(b.from)};width:${w(b.from, b.to)}` })))),
      h('div', { class: 'rv-int-row ov' }, h('span', { class: 'rv-int-name', text: 'overlap' }),
        h('span', { class: 'rv-int-track' }, h('span', { class: 'rv-int-bar', style: `left:${x(v.overlap.from)};width:${w(v.overlap.from, v.overlap.to)}` }))),
      h('div', { class: 'rv-int-row ticks' }, h('span', { class: 'rv-int-name' }),
        h('span', { class: 'rv-int-track' }, v.ticks.map(([d, t]) => h('span', { class: 'rv-int-tick', style: `left:${x(d)}`, text: t }))))),
    h('p', { class: 'rv-cap', text: v.overlap.label }));
}

const KINDS = { table, compare, typebox, timeline, format, century, pieces, span, checks, week, dst, intervals };

export function visual(helper, v) {
  h = helper;
  const fn = v && KINDS[v.kind];
  return fn ? h('div', { class: 'rv' }, fn(v)) : null;
}
