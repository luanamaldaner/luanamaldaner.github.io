// Extra dashboard pages: sleep log, week in review (with patterns),
// spaced-repetition cards for Bio + Prog, and a daily "Today I learned".
// Everything is built from the vault through helpers app.js hands over.

import { ALL_CARDS as BASE_CARDS, DECKS as BASE_DECKS, ptToday, ptDay } from './decks.js?v=3';
import { getMistakes } from '../orgo/mistakes.js?v=1';

// Static decks plus the Orgo questions you got wrong (read fresh on every render).
let ALL_CARDS = BASE_CARDS, DECKS = BASE_DECKS;
function refreshDecks() { const m = getMistakes(); ALL_CARDS = [...BASE_CARDS, ...m]; DECKS = m.length ? [...BASE_DECKS, 'Orgo mistakes'] : BASE_DECKS; }
import { TIL, tilIndex } from './til.js?v=1';

let C; // { h, s, card, icon, iconBtn, commit, touch, uid, S, live, todayStr, addDays, parse, toStr, fmtShort, fmtWeekday, fmtTime, totalsFor, focusMinutes, taskItems, forestPlot, render, go }
export function initExtras(ctx) { C = ctx; }

const FACES = [[1, '😫', 'Awful'], [2, '😕', 'Poor'], [3, '😐', 'Okay'], [4, '🙂', 'Good'], [5, '😄', 'Great']];

// ---------------------------------------------------------------- time helpers

const mins = t => { const [a, b] = t.split(':').map(Number); return a * 60 + b; };
/** Hours slept between bed and wake (crossing midnight if needed). */
export function sleepHours(r) {
  if (!r.bed || !r.wake) return 0;
  const d = (mins(r.wake) - mins(r.bed) + 1440) % 1440;
  return d / 60;
}
// Bedtimes are averaged on a clock that runs from noon to noon, so 23:30 and
// 00:30 average to midnight instead of noon.
const bedOffset = t => { const m = mins(t); return m < 720 ? m + 1440 : m; };
const clock = m => { m = Math.round(((m % 1440) + 1440) % 1440); return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; };
const mean = xs => xs.reduce((a, b) => a + b, 0) / (xs.length || 1);
const mad = xs => { const m = mean(xs); return mean(xs.map(x => Math.abs(x - m))); };
const fmtH = hrs => `${Math.floor(hrs)}h ${String(Math.round((hrs % 1) * 60)).padStart(2, '0')}m`;
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;

function sleepLog() {
  return C.live('sleep').filter(r => r.date && r.bed && r.wake).sort((a, b) => a.date.localeCompare(b.date));
}
function sleepTarget() { return Number(C.S().settings.sleepTarget) || 8; }

// ---------------------------------------------------------------- sleep: Today card

/** Morning card. Shows until today's night is logged (or after 3 PM, then hides). */
export function sleepCard() {
  const today = C.todayStr();
  const log = sleepLog();
  const mine = log.find(r => r.date === today);
  const hr = new Date().getHours();
  if (mine || hr >= 15 || hr < 4) return null;
  const last = log[log.length - 1];
  const bed = C.h('input', { type: 'time', value: last ? last.bed : '23:30', 'aria-label': 'Went to bed' });
  const wake = C.h('input', { type: 'time', value: last ? last.wake : '08:00', 'aria-label': 'Woke up' });
  const logIt = q => C.commit(() => {
    C.S().sleep.push(C.touch({ id: C.uid(), date: today, bed: bed.value || '23:30', wake: wake.value || '08:00', quality: q }));
  });
  return C.card('How did you sleep?', C.h('a', { href: '#sleep', class: 'link', text: 'Sleep →', onclick: e => { e.preventDefault(); C.go('sleep'); } }),
    C.h('div', { class: 'sl-times' },
      C.h('label', null, C.h('span', { class: 'muted small', text: 'Bed' }), bed),
      C.h('label', null, C.h('span', { class: 'muted small', text: 'Up' }), wake)),
    C.h('div', { class: 'sl-faces', role: 'group', 'aria-label': 'How rested do you feel? Tap to save' },
      FACES.map(([q, e, label]) => C.h('button', { type: 'button', class: 'sl-face', title: label, 'aria-label': `${label}, save`, onclick: () => logIt(q) },
        C.h('span', { class: 'sl-emoji', text: e }), C.h('span', { class: 'sl-face-label', text: label })))),
    C.h('p', { class: 'muted small sl-hint', text: 'Tap a face to save.' }));
}

// ---------------------------------------------------------------- sleep: page

let sleepSpan = 7;
let editing = null;

// Round axis steps: 1, 2, 2.5 or 5 × a power of ten.
function niceStep(x) {
  const p = 10 ** Math.floor(Math.log10(x)), m = x / p;
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p;
}

function barChart(days, values, { target = null, max = null, unit = '', fmt = v => String(v), axis = v => String(v), labelEvery = 1, color = 'var(--accent)', aria = '' }) {
  const s = C.s;
  const W = 340, H = 150, L = 34, B = 128, T = 10;
  const peak = Math.max(max || 0, target || 0, ...values.map(v => v || 0), 1);
  const step = niceStep(peak / 2);
  const top = Math.ceil(peak / step) * step;
  const bw = (W - L - 6) / days.length;
  const y = v => B - (v / top) * (B - T);
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'xbar', role: 'img', 'aria-label': aria });
  for (let v = 0; v <= top + 1e-9; v += step) {
    svg.append(s('line', { x1: L, x2: W, y1: y(v), y2: y(v), class: 'xbar-grid' }),
      s('text', { x: L - 5, y: y(v) + 3, class: 'xbar-axis', 'text-anchor': 'end' }, document.createTextNode(axis(v))));
  }
  days.forEach((d, i) => {
    const v = values[i];
    const x = L + 3 + i * bw;
    if (v) {
      const r = s('rect', { x: x + bw * 0.18, y: y(v), width: bw * 0.64, height: Math.max(1, B - y(v)), rx: Math.min(4, bw * 0.2), class: 'xbar-bar', style: `fill:${color}` });
      r.append(s('title', {}, document.createTextNode(`${C.fmtShort(d)}: ${fmt(v)}${unit}`)));
      svg.append(r);
    }
    if (i % labelEvery === 0) svg.append(s('text', { x: x + bw / 2, y: H - 6, class: 'xbar-axis', 'text-anchor': 'middle' }, document.createTextNode(days.length <= 7 ? C.fmtWeekday(d).slice(0, 2) : String(Number(d.slice(8))))));
  });
  if (target) svg.append(s('line', { x1: L, x2: W, y1: y(target), y2: y(target), class: 'xbar-target' }));
  return svg;
}

export function renderSleep() {
  const { h, card } = C;
  const today = C.todayStr();
  const log = sleepLog();
  const byDate = new Map(log.map(r => [r.date, r]));
  const days = Array.from({ length: sleepSpan }, (_, i) => C.addDays(today, i - sleepSpan + 1));
  const inSpan = days.map(d => byDate.get(d)).filter(Boolean);
  const hours = days.map(d => (byDate.has(d) ? sleepHours(byDate.get(d)) : 0));
  const target = sleepTarget();

  const avgH = inSpan.length ? mean(inSpan.map(sleepHours)) : 0;
  const avgBed = inSpan.length ? clock(mean(inSpan.map(r => bedOffset(r.bed)))) : null;
  const avgWake = inSpan.length ? clock(mean(inSpan.map(r => mins(r.wake)))) : null;
  // Consistency: 100 when you go to bed and get up at the same times every day,
  // falling to 0 when the times wander by 1.5 hours on average.
  const consistency = inSpan.length >= 3 ? Math.max(0, Math.round(100 - (mad(inSpan.map(r => bedOffset(r.bed))) + mad(inSpan.map(r => mins(r.wake)))) / 2 / 90 * 100)) : null;
  const metTarget = inSpan.filter(r => sleepHours(r) >= target - 0.25).length;

  const span = n => h('button', { type: 'button', class: `chip chip-btn${sleepSpan === n ? ' on' : ''}`, text: `${n} days`, onclick: () => { sleepSpan = n; C.render(); } });
  const chart = card('Hours slept', h('div', { class: 'chips' }, span(7), span(30)),
    inSpan.length ? barChart(days, hours, { target, unit: '', fmt: v => fmtH(v), axis: v => `${v}h`, labelEvery: sleepSpan > 7 ? 5 : 1, color: 'var(--t2)', aria: `Hours slept over the last ${sleepSpan} days` })
      : h('p', { class: 'empty', text: 'Nothing logged in this range yet. Log last night below or on the Today page each morning.' }),
    inSpan.length ? h('p', { class: 'muted small', text: `Dashed line = your ${target} h goal. Hit it ${metTarget} of ${inSpan.length} nights.` }) : null,
    h('dl', { class: 'stats' },
      h('div', null, h('dt', { text: 'Average' }), h('dd', { text: inSpan.length ? fmtH(avgH) : '—' })),
      h('div', null, h('dt', { text: 'Usual bedtime' }), h('dd', { text: avgBed ? C.fmtTime(avgBed) : '—' })),
      h('div', null, h('dt', { text: 'Usual wake-up' }), h('dd', { text: avgWake ? C.fmtTime(avgWake) : '—' })),
      h('div', null, h('dt', { text: 'Consistency' }), h('dd', { text: consistency === null ? 'needs 3+ nights' : `${consistency} / 100` })),
      h('div', null, h('dt', { text: 'Avg rested' }), h('dd', { text: inSpan.length ? `${mean(inSpan.map(r => r.quality || 3)).toFixed(1)} / 5` : '—' }))));

  // add / edit form
  const rec = editing ? log.find(r => r.id === editing) : null;
  const last = log[log.length - 1];
  const date = h('input', { type: 'date', value: rec ? rec.date : today, max: today, 'aria-label': 'Morning you woke up' });
  const bed = h('input', { type: 'time', value: rec ? rec.bed : last ? last.bed : '23:30', 'aria-label': 'Went to bed' });
  const wake = h('input', { type: 'time', value: rec ? rec.wake : last ? last.wake : '08:00', 'aria-label': 'Woke up' });
  const quality = h('select', { 'aria-label': 'How rested' }, FACES.map(([q, e, l]) => h('option', { value: q, text: `${e} ${l}`, selected: (rec ? rec.quality : 4) === q })));
  const note = h('input', { value: rec ? rec.note || '' : '', placeholder: 'Note (optional)', 'aria-label': 'Note', maxlength: 140 });
  const form = card(rec ? 'Edit night' : 'Log a night', null, h('form', {
    class: 'sl-form', onsubmit: ev => {
      ev.preventDefault();
      if (!date.value || !bed.value || !wake.value) return;
      C.commit(() => {
        const S = C.S();
        let r = rec;
        if (!r) {
          r = S.sleep.find(x => !x.deleted && x.date === date.value);
          if (!r) { r = { id: C.uid() }; S.sleep.push(r); }
        }
        Object.assign(r, { date: date.value, bed: bed.value, wake: wake.value, quality: Number(quality.value), note: note.value.trim().slice(0, 140), deleted: false });
        C.touch(r);
        editing = null;
      });
    },
  },
  h('label', null, h('span', { class: 'muted small', text: 'Morning of' }), date),
  h('label', null, h('span', { class: 'muted small', text: 'Bed' }), bed),
  h('label', null, h('span', { class: 'muted small', text: 'Up' }), wake),
  h('label', null, h('span', { class: 'muted small', text: 'Rested' }), quality),
  h('label', { class: 'sl-note' }, h('span', { class: 'muted small', text: 'Note' }), note),
  h('div', { class: 'row' }, h('button', { class: 'btn btn-primary', type: 'submit', text: rec ? 'Save' : 'Add' }),
    rec ? h('button', { class: 'btn', type: 'button', text: 'Cancel', onclick: () => { editing = null; C.render(); } }) : null)));

  const goal = h('select', { 'aria-label': 'Sleep goal', onchange: e => C.commit(() => { const g = C.S().settings; g.sleepTarget = Number(e.target.value); C.touch(g); }) },
    [6, 6.5, 7, 7.5, 8, 8.5, 9].map(n => h('option', { value: n, text: `${n} hours`, selected: target === n })));

  const list = card('Log', h('span', { class: 'card-meta', text: plural(log.length, 'night') }),
    log.length ? h('ul', { class: 'sl-list' }, [...log].reverse().slice(0, 60).map(r => h('li', null,
      h('span', { class: 'sl-date', text: `${C.fmtWeekday(r.date)} ${C.fmtShort(r.date)}` }),
      h('span', { class: 'sl-range', text: `${C.fmtTime(r.bed)} → ${C.fmtTime(r.wake)}` }),
      h('span', { class: 'sl-dur', text: fmtH(sleepHours(r)) }),
      h('span', { class: 'sl-q', title: (FACES.find(f => f[0] === r.quality) || FACES[2])[2], text: (FACES.find(f => f[0] === r.quality) || FACES[2])[1] }),
      r.note ? h('span', { class: 'sl-n muted small', text: r.note }) : null,
      h('span', { class: 'sl-actions' },
        h('button', { type: 'button', class: 'link', text: 'Edit', onclick: () => { editing = r.id; C.render(); window.scrollTo({ top: 0, behavior: 'smooth' }); } }),
        C.iconBtn('x', 'Delete night', () => C.commit(() => { C.touch(r).deleted = true; }), 'row-action')))))
      : h('p', { class: 'empty', text: 'No nights logged yet.' }));

  return h('div', { class: 'page' },
    h('header', { class: 'page-head' }, h('h1', { text: 'Sleep' }),
      h('p', { class: 'meta' }, 'Goal ', goal, ' a night. Log each morning on Today, here, or by telling Claude.')),
    h('div', { class: 'grid' },
      h('div', { class: 'col' }, chart, list),
      h('div', { class: 'col col-narrow' }, form, patternsCard(30))));
}

// ---------------------------------------------------------------- week in review

let weekOffset = 0;
const mondayOf = day => { const dow = C.parse(day).getDay(); return C.addDays(day, -((dow + 6) % 7)); };

function weekData(offset) {
  const from = C.addDays(mondayOf(C.todayStr()), 7 * offset);
  const days = Array.from({ length: 7 }, (_, i) => C.addDays(from, i));
  const to = C.addDays(from, 7);
  const today = C.todayStr();
  const past = days.filter(d => d <= today);
  const tot = days.map(d => C.totalsFor(d));
  const logged = days.map((d, i) => (C.live('food').some(f => f.date === d) ? tot[i] : null));
  const loggedDays = logged.filter(Boolean);
  const focus = days.map(d => C.focusMinutes(d));
  const items = C.taskItems(from, to);
  const doneByDay = days.map(d => items.filter(x => x.date === d).length);
  const sleep = sleepLog().filter(r => r.date >= from && r.date < to);
  return {
    from, to, days, past, logged, focus, items, doneByDay, sleep,
    cal: loggedDays.length ? mean(loggedDays.map(t => t.cal)) : null,
    protein: loggedDays.length ? mean(loggedDays.map(t => t.protein)) : null,
    foodDays: loggedDays.length,
    focusTotal: focus.reduce((a, b) => a + b, 0),
    sleepAvg: sleep.length ? mean(sleep.map(sleepHours)) : null,
  };
}

/** Days in a row (ending on `end`) with at least one task finished. */
function streak(end) {
  const doneDays = new Set(C.live('todos').filter(t => t.done && t.doneAt).map(t => C.toStr(new Date(t.doneAt))));
  let n = 0, d = end;
  if (!doneDays.has(d)) d = C.addDays(d, -1); // today isn't over yet
  while (doneDays.has(d)) { n++; d = C.addDays(d, -1); }
  return n;
}

function weekSummary(w) {
  const g = C.S().settings.goals;
  const bits = [];
  bits.push(w.items.length ? `You finished ${plural(w.items.length, 'task')}` : 'No tasks checked off yet');
  if (w.focusTotal) bits.push(`focused for ${fmtH(w.focusTotal / 60)}`);
  let s = bits.join(' and ') + '.';
  if (w.protein !== null) {
    const p = Math.round(w.protein);
    s += ` Protein averaged ${p} g a day${p >= g.protein ? ', right on goal' : ` (goal ${g.protein} g)`}`;
    s += w.cal !== null ? ` at about ${Math.round(w.cal)} kcal, across ${plural(w.foodDays, 'logged day')}.` : '.';
  }
  if (w.sleepAvg !== null) s += ` You slept ${fmtH(w.sleepAvg)} a night on average.`;
  const best = w.doneByDay.indexOf(Math.max(...w.doneByDay));
  if (w.items.length > 2) s += ` Best day: ${C.fmtWeekday(w.days[best])}.`;
  return s;
}

export function renderWeek() {
  const { h, card } = C;
  const w = weekData(weekOffset);
  const g = C.S().settings.goals;
  const label = `${C.fmtShort(w.from)} – ${C.fmtShort(C.addDays(w.to, -1))}`;
  const head = h('header', { class: 'page-head forest-head' }, h('div', null, h('h1', { text: 'Week in review' }), h('p', { class: 'meta', text: label })),
    h('div', { class: 'row' },
      h('button', { type: 'button', class: 'btn btn-small btn-primary wr-open', text: '✨ Wrapped', onclick: () => openWrapped(weekOffset) }),
      C.iconBtn('left', 'Previous week', () => { weekOffset--; C.render(); }),
      h('span', { class: 'forest-label', text: weekOffset === 0 ? 'This week' : weekOffset === -1 ? 'Last week' : label }),
      C.iconBtn('right', 'Next week', () => { if (weekOffset < 0) { weekOffset++; C.render(); } }, weekOffset < 0 ? '' : 'is-off')));

  const food = card('Food', h('span', { class: 'card-meta', text: `${plural(w.foodDays, 'day')} logged` }),
    w.foodDays ? barChart(w.days, w.logged.map(t => (t ? Math.round(t.cal) : 0)), { target: g.cal, unit: ' kcal', fmt: v => String(Math.round(v)), axis: v => (v >= 1000 ? `${v / 1000}k` : String(v)), color: 'var(--m-cal)', aria: 'Calories per day' })
      : h('p', { class: 'empty', text: 'No meals logged this week.' }),
    h('dl', { class: 'stats' },
      h('div', null, h('dt', { text: 'Calories / day' }), h('dd', { text: w.cal === null ? '—' : `${Math.round(w.cal)} of ${g.cal}` })),
      h('div', null, h('dt', { text: 'Protein / day' }), h('dd', { text: w.protein === null ? '—' : `${Math.round(w.protein)} g of ${g.protein} g` }))));

  const focus = card('Focus', h('span', { class: 'card-meta', text: fmtH(w.focusTotal / 60) }),
    w.focusTotal ? barChart(w.days, w.focus, { unit: ' min', fmt: v => String(Math.round(v)), axis: v => `${v}m`, color: 'var(--petal)', aria: 'Focus minutes per day' })
      : h('p', { class: 'empty', text: 'No focus sessions this week. Start one from the Focus page.' }));

  const tasks = card('Tasks & flowers', h('span', { class: 'card-meta', text: `${w.items.length} done` }),
    h('div', { class: 'wk-forest' }, C.forestPlot(w.items, `${w.items.length} flowers this week`)),
    h('dl', { class: 'stats' },
      h('div', null, h('dt', { text: 'Finished' }), h('dd', { text: String(w.items.length) })),
      h('div', null, h('dt', { text: 'Streak' }), h('dd', { text: weekOffset === 0 ? plural(streak(C.todayStr()), 'day') : '—' }))));

  const sleep = card('Sleep', h('a', { href: '#sleep', class: 'link', text: 'Sleep →', onclick: e => { e.preventDefault(); C.go('sleep'); } }),
    w.sleep.length ? h('dl', { class: 'stats' },
      h('div', null, h('dt', { text: 'Average' }), h('dd', { text: fmtH(w.sleepAvg) })),
      h('div', null, h('dt', { text: 'Nights logged' }), h('dd', { text: String(w.sleep.length) })),
      h('div', null, h('dt', { text: 'Avg rested' }), h('dd', { text: `${mean(w.sleep.map(r => r.quality || 3)).toFixed(1)} / 5` })))
      : h('p', { class: 'empty', text: 'No nights logged this week.' }));

  return h('div', { class: 'page' }, head,
    h('blockquote', { class: 'brief wk-summary', text: weekSummary(w) }),
    h('div', { class: 'grid' },
      h('div', { class: 'col' }, tasks, food, focus),
      h('div', { class: 'col col-narrow' }, weakSpotsCard(), achievementsCard(), sleep, sleepScoresCard(), patternsCard(30))));
}

/** Small card for Today on Sundays and Mondays (Monday shows last week). */
export function weekCard() {
  const dow = new Date().getDay();
  if (dow !== 0 && dow !== 1) return null;
  const off = dow === 1 ? -1 : 0;
  const w = weekData(off);
  return C.card(off ? 'Last week' : 'Your week', C.h('a', { href: '#week', class: 'link', text: 'Review →', onclick: e => { e.preventDefault(); weekOffset = off; C.go('week'); } }),
    C.h('p', { class: 'wk-mini', text: weekSummary(w) }),
    C.h('button', { type: 'button', class: 'btn btn-small btn-primary', text: '✨ Watch your week, wrapped', onclick: () => openWrapped(off) }));
}

// ---------------------------------------------------------------- patterns

function patternsCard(nDays) {
  const { h, card } = C;
  const today = C.todayStr();
  const since = C.addDays(today, -nDays);
  const rows = [];

  // best study hours: focus sessions by the hour they started
  const sessions = C.live('focus').filter(f => f.date > since && f.endedAt && f.minutes);
  if (sessions.length >= 5) {
    const byHour = new Map();
    for (const f of sessions) {
      const start = new Date(f.endedAt - f.minutes * 60e3).getHours();
      const block = Math.floor(start / 3) * 3;
      byHour.set(block, (byHour.get(block) || 0) + f.minutes);
    }
    const [best, m] = [...byHour].sort((a, b) => b[1] - a[1])[0];
    const fmtHr = x => C.fmtTime(`${String(x % 24).padStart(2, '0')}:00`).replace(':00', '');
    rows.push(['Best study hours', `${fmtHr(best)}–${fmtHr(best + 3)}: ${Math.round(m)} of your ${Math.round(sessions.reduce((a, f) => a + f.minutes, 0))} focus minutes (${plural(sessions.length, 'session')}).`]);
  } else rows.push(['Best study hours', `Needs 5+ focus sessions in the last ${nDays} days (you have ${sessions.length}).`]);

  // sleep vs next-day focus and tasks
  const nights = sleepLog().filter(r => r.date > since && r.date <= today);
  // the day after last night isn't over yet, so it doesn't count for "next day"
  const fullDays = nights.filter(r => r.date < today);
  const doneOn = d => C.live('todos').filter(t => t.done && t.doneAt && C.toStr(new Date(t.doneAt)) === d).length;
  const target = sleepTarget();
  const good = fullDays.filter(r => sleepHours(r) >= target - 0.5), short = fullDays.filter(r => sleepHours(r) < target - 0.5);
  if (good.length >= 3 && short.length >= 3) {
    const f = xs => Math.round(mean(xs.map(r => C.focusMinutes(r.date))));
    const t = xs => mean(xs.map(r => doneOn(r.date))).toFixed(1);
    rows.push(['Sleep → next day', `After ${target - 0.5}+ h nights (${good.length}): ${f(good)} min focus, ${t(good)} tasks done. After shorter nights (${short.length}): ${f(short)} min, ${t(short)} tasks. Small samples, so treat it as a hint, not proof.`]);
  } else rows.push(['Sleep → next day', `Needs at least 3 full and 3 short nights logged to compare (you have ${good.length} and ${short.length}).`]);

  // late eating vs sleep: meals logged after 9 PM the evening before
  const lateEve = d => C.live('food').some(f => f.date === d && f.updatedAt && new Date(f.updatedAt).getHours() >= 21 && C.toStr(new Date(f.updatedAt)) === d);
  const after = nights.filter(r => lateEve(C.addDays(r.date, -1))), notAfter = nights.filter(r => !lateEve(C.addDays(r.date, -1)));
  if (after.length >= 3 && notAfter.length >= 3) {
    const q = xs => mean(xs.map(r => r.quality || 3)).toFixed(1);
    const hh = xs => fmtH(mean(xs.map(sleepHours)));
    rows.push(['Late eating', `Nights after food logged past 9 PM (${after.length}): ${hh(after)}, rested ${q(after)}/5. Other nights (${notAfter.length}): ${hh(notAfter)}, rested ${q(notAfter)}/5. Based on when meals were logged, which may not be when you ate.`]);
  } else rows.push(['Late eating', `Needs 3+ nights each with and without late meals logged (you have ${after.length} and ${notAfter.length}).`]);

  return card('Patterns', h('span', { class: 'card-meta', text: `last ${nDays} days` }),
    h('dl', { class: 'pt-list' }, rows.map(([k, v]) => h('div', null, h('dt', { text: k }), h('dd', { text: v })))),
    h('p', { class: 'muted small', text: 'These just compare your own numbers. More logged days = more trustworthy.' }));
}

// ---------------------------------------------------------------- cards (spaced repetition)

// Leitner boxes, same as the Orgo flashcards: days until a card comes back.
const INTERVALS = [0, 1, 2, 4, 8, 16];
const cs = { deck: 'All', current: null, flipped: false, again: new Set() };
const rec = id => (C.S().orgo || []).find(x => x.id === `fc:${id}` && !x.deleted);

export function renderCards() {
  refreshDecks();
  const { h, card } = C;
  const today = C.todayStr();
  const inDeck = c => cs.deck === 'All' || c.deck === cs.deck || (cs.deck === 'All Bio' && c.deck.startsWith('Bio')) || (cs.deck === 'All Prog' && c.deck.startsWith('Prog'));
  const deck = ALL_CARDS.filter(inDeck);
  const due = deck.filter(c => { const r = rec(c.id); return !r || r.due <= today; });
  const reviews = due.filter(c => rec(c.id)).sort((a, b) => rec(a.id).due.localeCompare(rec(b.id).due));
  const fresh = due.filter(c => !rec(c.id)).slice(0, 20); // at most 20 new cards a day
  const queue = [...reviews, ...fresh];
  const ordered = [...queue.filter(c => !cs.again.has(c.id)), ...queue.filter(c => cs.again.has(c.id))];
  if (!ordered.some(c => c.id === cs.current)) { cs.current = ordered[0] ? ordered[0].id : null; cs.flipped = false; }
  const cur = ALL_CARDS.find(c => c.id === cs.current);
  const learned = deck.filter(c => { const r = rec(c.id); return r && r.box >= 3; }).length;
  const seen = deck.filter(c => rec(c.id)).length;

  const answer = good => C.commit(() => {
    const S = C.S();
    if (!S.orgo) S.orgo = [];
    let r = S.orgo.find(x => x.id === `fc:${cur.id}`);
    if (!r) { r = { id: `fc:${cur.id}`, box: 0, due: today }; S.orgo.push(r); }
    r.box = good ? Math.min(5, (r.box || 0) + 1) : 0;
    r.due = good ? C.addDays(today, INTERVALS[r.box]) : today;
    r.deleted = false;
    C.touch(r);
    if (good) cs.again.delete(cur.id); else cs.again.add(cur.id);
    cs.current = null; cs.flipped = false;
  });

  const chip = d => h('button', { type: 'button', class: `chip chip-btn${cs.deck === d ? ' on' : ''}`, text: d.replace('Prog ', ''), onclick: () => { cs.deck = d; cs.current = null; C.render(); } });
  const front = cur ? h('button', {
    type: 'button', class: `flashcard${cs.flipped ? ' flipped' : ''}`, 'aria-label': cs.flipped ? 'Card answer' : 'Card question. Tap to flip.',
    onclick: () => { cs.flipped = !cs.flipped; C.render(); },
  },
  h('span', { class: 'fc-deck', text: cur.deck }),
  cs.flipped ? h('span', { class: 'fc-back fc-text', text: cur.back }) : h('span', { class: 'fc-front fc-text', text: cur.front }),
  h('span', { class: 'fc-hint', text: cs.flipped ? '' : 'Tap to flip' }))
    : h('p', { class: 'empty', text: 'All caught up in this deck ✿ Come back tomorrow.' });

  const perDeck = DECKS.map(d => {
    const cards = ALL_CARDS.filter(c => c.deck === d);
    const n = cards.filter(c => { const r = rec(c.id); return !r || r.due <= today; }).length;
    const l = cards.filter(c => { const r = rec(c.id); return r && r.box >= 3; }).length;
    return h('li', null, h('button', { type: 'button', class: 'link', text: d, onclick: () => { cs.deck = d; cs.current = null; C.render(); } }),
      h('span', { class: 'muted small', text: `${n} due · ${l}/${cards.length} learned` }));
  });

  return h('div', { class: 'page' },
    h('header', { class: 'page-head' }, h('h1', { text: 'Cards' }),
      h('p', { class: 'meta', text: 'Spaced repetition for Bio 2 and Prog 1. "Got it" pushes a card further out (1, 2, 4, 8, 16 days); "Again" brings it back today. Orgo cards live in the Orgo tab.' })),
    h('div', { class: 'grid' },
      h('div', { class: 'col' }, card('Study', h('span', { class: 'card-meta', text: `${queue.length} due` }),
        h('div', { class: 'chips cd-decks' }, ['All', 'All Bio', 'All Prog', ...DECKS].map(chip)),
        front,
        cur && cs.flipped ? h('div', { class: 'row fc-actions' },
          h('button', { type: 'button', class: 'btn', text: 'Again', onclick: () => answer(false) }),
          h('button', { type: 'button', class: 'btn btn-primary', text: 'Got it', onclick: () => answer(true) })) : null,
        h('p', { class: 'muted small', text: `${learned} of ${deck.length} learned · ${seen} seen · progress syncs with your vault` }))),
      h('div', { class: 'col col-narrow' }, card('Decks', null, h('ul', { class: 'cd-list' }, perDeck)))));
}

// ---------------------------------------------------------------- today I learned

let tilShift = 0;
export function tilCard() {
  const { h } = C;
  const [topic, text, source] = TIL[tilIndex(C.todayStr(), tilShift)];
  return h('section', { class: 'card til' },
    h('header', { class: 'card-head' }, h('h2', { text: 'Today I learned' }), h('span', { class: 'chip til-topic', text: topic })),
    h('p', { class: 'til-text', text }),
    h('div', { class: 'til-foot' }, h('span', { class: 'muted small', text: source }),
      h('button', { type: 'button', class: 'link', text: 'Another one', onclick: () => { tilShift++; C.render(); } })));
}

// ---------------------------------------------------------------- palavras do dia (tudo em português)

export function palavrasCard() {
  const { h } = C;
  const words = ptToday(C.todayStr());
  return h('section', { class: 'card pt-card', lang: 'pt-BR' },
    h('header', { class: 'card-head' }, h('h2', { text: 'Palavras do dia' }), h('span', { class: 'card-meta', text: `dia ${ptDay(C.todayStr()) + 1}` })),
    h('ul', { class: 'pt-list' }, words.map(p => h('li', null, h('details', { class: 'pt-word' },
      h('summary', null, h('strong', { text: p.w }), h('span', { class: 'muted small', text: ` · ${p.c}` })),
      h('p', { class: 'pt-def', text: p.d }),
      h('p', { class: 'pt-ex', text: `“${p.ex}”` }),
      p.s && p.s.length ? h('p', { class: 'muted small', text: `Sinônimos: ${p.s.join(', ')}` }) : null)))),
    h('p', { class: 'muted small pt-foot' }, 'Toque numa palavra para ver o significado. Elas também entram no baralho ', h('button', { type: 'button', class: 'link small', text: 'Português', onclick: () => C.go('cards') }), ' para revisar.'));
}

// ---------------------------------------------------------------- wins: achievements, weak spots, sleep vs scores, wrapped
// Study data lives in each tab's localStorage keys (this device); tasks, focus, sleep and cards come from the vault.

const ls = (k, fb) => { try { const v = localStorage.getItem(k); return v === null ? fb : JSON.parse(v); } catch { return fb; } };
const BIO_NAMES = { L1: 'Animal diversity', L2: 'Nutrition', L3: 'Temperature', L4: 'Breathing', L5: 'Circulation', L6: 'Kidney & salt', L7: 'Digestion', L8: 'Nervous system', L9: 'Endocrine', L10: 'Immunology' };

function studyStats() {
  const S = C.S();
  const todos = C.live('todos');
  const focus = C.live('focus');
  const sleep = sleepLog();
  const cards = (S.orgo || []).filter(r => r.id && r.id.startsWith('fc:') && !r.deleted);
  const bioHist = ls('bio.examHistory', []), progHist = ls('prog.mockHistory', []);
  const daily = ls('orgo.rl.daily', {});
  const rlTotal = Object.values(daily).reduce((a, d) => a + d.total, 0), rlRight = Object.values(daily).reduce((a, d) => a + d.right, 0);
  let progSolved = 0, bugsSolved = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k.startsWith('prog.')) continue;
      const v = ls(k, null);
      if (v && v.solved) { if (k.startsWith('prog.b-')) bugsSolved++; else progSolved++; }
    }
  } catch {}
  let goodRun = 0, run = 0;
  for (const r of sleep) { if (sleepHours(r) >= 8) { run++; goodRun = Math.max(goodRun, run); } else run = 0; }
  return {
    tasksDone: todos.filter(t => t.done).length,
    streak: streak(C.todayStr()),
    focusMin: focus.reduce((a, f) => a + (f.minutes || 0), 0),
    longest: focus.filter(f => !f.wilted).reduce((a, f) => Math.max(a, f.minutes || 0), 0),
    nights: sleep.length, goodRun,
    cardsLearned: cards.filter(r => r.box >= 3).length,
    ptLearned: cards.filter(r => r.id.startsWith('fc:pt:') && r.box >= 3).length,
    bioBest: bioHist.reduce((a, x) => Math.max(a, x.pct), 0),
    progBest: progHist.reduce((a, x) => Math.max(a, x.pct), 0),
    guided: ls('bio.done', []).length,
    progSolved, bugsSolved,
    rlBest: Number(ls('orgo.rl.best', 0)),
    rlSpeed: Math.max(Number(ls('orgo.rl.speedBest_sn', 0)), Number(ls('orgo.rl.speedBest_alkene', 0))),
    rlTotal, rlRight,
  };
}

const ACH = [
  ['🌱', 'First bloom', 'Finish your first task', s => [s.tasksDone, 1]],
  ['💐', 'Bouquet', 'Finish 50 tasks', s => [s.tasksDone, 50]],
  ['🔥', 'On a roll', 'A 7-day task streak', s => [s.streak, 7]],
  ['⏱️', 'Deep work', 'Focus for 10 hours in total', s => [Math.floor(s.focusMin / 60), 10]],
  ['🌻', 'Sunflower', 'One 60-minute focus session', s => [s.longest, 60]],
  ['😴', 'Well rested', 'Sleep 8 h+ three nights in a row', s => [s.goodRun, 3]],
  ['🌙', 'Sleep diary', 'Log 14 nights of sleep', s => [s.nights, 14]],
  ['🃏', 'Card shark', 'Learn 100 flashcards', s => [s.cardsLearned, 100]],
  ['🇧🇷', 'Vocabulário afiado', 'Learn 25 Portuguese words', s => [s.ptLearned, 25]],
  ['🧬', 'Guided through', 'Finish 5 guided Bio lectures', s => [s.guided, 5]],
  ['🎓', 'Bio ace', 'Score 90%+ on a Bio mock exam', s => [s.bioBest, 90]],
  ['💯', 'Perfect', 'Score 100% on a Bio mock exam', s => [s.bioBest, 100]],
  ['🐍', 'Pythonista', 'Solve 25 Prog practice problems', s => [s.progSolved, 25]],
  ['🐞', 'Exterminator', 'Fix 10 debug-the-bug drills', s => [s.bugsSolved, 10]],
  ['📝', 'Prog ready', 'Score 85%+ on the Prog mock exam', s => [s.progBest, 85]],
  ['🎰', 'Hot streak', '10 roulette rounds in a row', s => [s.rlBest, 10]],
  ['⚡', 'Speed demon', '15 right in one speed round', s => [s.rlSpeed, 15]],
  ['⚗️', 'Reaction regular', 'Answer 100 roulette questions', s => [s.rlTotal, 100]],
];
const unlocked = s => ACH.filter(a => { const [v, g] = a[3](s); return v >= g; }).length;

export function achievementsCard() {
  const { h, card } = C;
  const s = studyStats();
  const rows = ACH.map(([icon, name, desc, f]) => { const [v, goal] = f(s); return { icon, name, desc, v: Math.min(v, goal), goal, done: v >= goal }; });
  return card('Achievements', h('span', { class: 'card-meta', text: `${rows.filter(r => r.done).length} / ${rows.length}` }),
    h('ul', { class: 'ach' }, rows.sort((a, b) => b.done - a.done || b.v / b.goal - a.v / a.goal).map(r => h('li', { class: `ach-item${r.done ? ' done' : ''}`, title: r.desc },
      h('span', { class: 'ach-ic', text: r.icon }),
      h('span', { class: 'ach-text' }, h('span', { class: 'ach-name', text: r.name }), h('span', { class: 'ach-desc', text: r.desc })),
      r.done ? h('span', { class: 'ach-ok', text: '✓' })
        : h('span', { class: 'ach-prog' }, h('span', { class: 'ach-bar' }, h('span', { style: `width:${(100 * r.v / r.goal).toFixed(0)}%` })), h('span', { class: 'ach-num', text: `${r.v}/${r.goal}` }))))));
}

/** The weakest topics across tabs, lowest first. */
function weakSpots() {
  const out = [];
  const per = {};
  for (const a of ls('bio.examHistory', []).filter(x => x.per).slice(-3)) {
    for (const [l, x] of Object.entries(a.per)) { const p = per[l] || (per[l] = { got: 0, max: 0 }); p.got += x.got; p.max += x.max; }
  }
  for (const [l, p] of Object.entries(per)) if (p.max >= 2) out.push({ area: 'Bio', name: `${l} ${BIO_NAMES[l] || ''}`.trim(), pct: Math.round(100 * p.got / p.max), go: 'bio' });
  const days = Object.entries(ls('orgo.rl.daily', {})).sort().slice(-14).map(e => e[1]);
  for (const [k, name] of [['sn', 'SN1 / SN2 / E1 / E2'], ['alkene', 'Alkene reactions']]) {
    const r = days.reduce((a, d) => a + (d[k] ? d[k][0] : 0), 0), t = days.reduce((a, d) => a + (d[k] ? d[k][1] : 0), 0);
    if (t >= 5) out.push({ area: 'Orgo', name, pct: Math.round(100 * r / t), go: 'orgo' });
  }
  const ph = ls('prog.mockHistory', []);
  if (ph.length) out.push({ area: 'Prog', name: 'Mock Exam 2', pct: ph[ph.length - 1].pct, go: 'prog' });
  return out.sort((a, b) => a.pct - b.pct);
}

export function weakSpotsCard() {
  const { h, card } = C;
  const ws = weakSpots();
  return card('Weak-spot radar', h('span', { class: 'card-meta', text: 'study these first' }),
    ws.length ? h('ul', { class: 'ws' }, ws.slice(0, 6).map(w => h('li', { class: `ws-row${w.pct < 60 ? ' weak' : w.pct < 80 ? ' mid' : ''}` },
      h('span', { class: 'ws-area', text: w.area }),
      h('button', { type: 'button', class: 'link ws-name', text: w.name, onclick: () => C.go(w.go) }),
      h('span', { class: 'ws-bar' }, h('span', { style: `width:${w.pct}%` })),
      h('strong', { class: 'ws-pct', text: `${w.pct}%` }))))
      : h('p', { class: 'empty', text: 'Take a Bio mock exam, spin some Orgo roulette or try the Prog mock exam. Your weakest topics show up here.' }),
    ws.length ? h('p', { class: 'muted small', text: 'From your last 3 Bio mock exams, 2 weeks of roulette and your latest Prog mock exam.' }) : null);
}

/** Do nights with more sleep come before better practice scores? */
export function sleepScoresCard() {
  const { h, card } = C;
  const sleepBy = Object.fromEntries(sleepLog().map(r => [r.date, sleepHours(r)])); // keyed by the morning you woke up
  const day = at => C.toStr(new Date(at));
  const pts = [];
  for (const x of ls('bio.examHistory', [])) pts.push({ d: day(x.at), pct: x.pct });
  for (const x of ls('prog.mockHistory', [])) pts.push({ d: day(x.at), pct: x.pct });
  for (const [d, x] of Object.entries(ls('orgo.rl.daily', {}))) if (x.total >= 5) pts.push({ d, pct: Math.round(100 * x.right / x.total) });
  const withSleep = pts.filter(p => sleepBy[p.d] !== undefined).map(p => ({ ...p, hrs: sleepBy[p.d] }));
  const good = withSleep.filter(p => p.hrs >= 7), short = withSleep.filter(p => p.hrs < 7);
  if (good.length < 2 || short.length < 2) {
    return card('Sleep vs scores', null, h('p', { class: 'empty', text: `Not enough data yet (${withSleep.length} scored day${withSleep.length === 1 ? '' : 's'} with sleep logged). Log your sleep, then take mock exams or do 5+ roulette answers a day, and this shows whether sleep moves your scores.` }));
  }
  const g = Math.round(mean(good.map(p => p.pct))), sh = Math.round(mean(short.map(p => p.pct)));
  const diff = g - sh;
  return card('Sleep vs scores', null,
    h('div', { class: 'ss-cmp' },
      h('div', null, h('strong', { text: `${g}%` }), h('span', { class: 'muted small', text: `after 7 h+ · ${good.length} days` })),
      h('div', null, h('strong', { text: `${sh}%` }), h('span', { class: 'muted small', text: `after < 7 h · ${short.length} days` }))),
    h('p', { class: 'small', text: Math.abs(diff) < 4 ? 'About the same so far. Keep logging to see a real pattern.' : diff > 0 ? `You score about ${diff} points higher after a full night. Sleep is studying too ✿` : `So far you've scored ${-diff} points higher after short nights. That may change with more data.` }));
}

// Wrapped: a story-style recap of a week, one big number per slide.
let wrap = null;
export function openWrapped(offset = 0) {
  const w = weekData(offset);
  const s = studyStats();
  const inWeek = d => d >= w.from && d < w.to;
  const rl = Object.entries(ls('orgo.rl.daily', {})).filter(([d]) => inWeek(d)).reduce((a, [, x]) => [a[0] + x.right, a[1] + x.total], [0, 0]);
  const cardsWk = (C.S().orgo || []).filter(r => r.id && r.id.startsWith('fc:') && r.updatedAt && inWeek(C.toStr(new Date(r.updatedAt)))).length;
  const exams = [...ls('bio.examHistory', []), ...ls('prog.mockHistory', [])].filter(x => inWeek(C.toStr(new Date(x.at))));
  const bestDay = w.doneByDay.indexOf(Math.max(...w.doneByDay));
  wrap = { i: 0, slides: [
    { big: `${C.fmtShort(w.from)} – ${C.fmtShort(C.addDays(w.to, -1))}`, line: 'Your week, wrapped ✨', sub: 'Tap to continue' },
    { big: String(w.items.length), line: w.items.length === 1 ? 'task finished' : 'tasks finished', sub: w.items.length > 2 ? `Best day: ${C.fmtWeekday(w.days[bestDay])} (${w.doneByDay[bestDay]})` : 'Every one planted a flower 🌸' },
    { big: fmtH(w.focusTotal / 60), line: 'of deep focus', sub: s.longest ? `Longest session ever: ${s.longest} min` : 'Try one focus session next week' },
    { big: w.sleepAvg === null ? '—' : fmtH(w.sleepAvg), line: 'average sleep', sub: w.sleep.length ? `${plural(w.sleep.length, 'night')} logged` : 'Log your sleep to see this' },
    { big: String(cardsWk), line: 'flashcards reviewed', sub: `${s.cardsLearned} learned all-time` },
    { big: rl[1] ? `${Math.round(100 * rl[0] / rl[1])}%` : '—', line: 'Orgo roulette accuracy', sub: rl[1] ? `${rl[0]} of ${rl[1]} right` : 'Spin a few next week 🎰' },
    { big: String(exams.length), line: exams.length === 1 ? 'mock exam taken' : 'mock exams taken', sub: exams.length ? `Best: ${Math.max(...exams.map(x => x.pct))}%` : 'Bio and Prog both have one' },
    { big: `${unlocked(s)} / ${ACH.length}`, line: 'achievements unlocked', sub: 'Proud of you. See you next week ✿' },
  ] };
  showWrap();
}

let wrapKey = null;
function closeWrap() { wrap = null; document.querySelector('.wrapped')?.remove(); if (wrapKey) document.removeEventListener('keydown', wrapKey); wrapKey = null; }
function showWrap() {
  const { h } = C;
  document.querySelector('.wrapped')?.remove();
  if (!wrap) return;
  const sl = wrap.slides[wrap.i];
  const next = () => { if (wrap.i + 1 < wrap.slides.length) { wrap.i++; showWrap(); } else closeWrap(); };
  const prev = () => { if (wrap.i > 0) { wrap.i--; showWrap(); } };
  if (!wrapKey) {
    wrapKey = e => { if (!wrap) return; if (e.key === 'Escape') closeWrap(); else if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); } else if (e.key === 'ArrowLeft') prev(); };
    document.addEventListener('keydown', wrapKey);
  }
  const el = h('div', { class: `wrapped wr-${wrap.i % 4}`, role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Your week, wrapped' },
    h('div', { class: 'wr-bars' }, wrap.slides.map((_, k) => h('span', { class: k <= wrap.i ? 'on' : '' }))),
    h('button', { type: 'button', class: 'wr-close', 'aria-label': 'Close', text: '✕', onclick: closeWrap }),
    h('button', { type: 'button', class: 'wr-tap', 'aria-label': 'Next', onclick: next },
      h('span', { class: 'wr-big', text: sl.big }), h('span', { class: 'wr-line', text: sl.line }), h('span', { class: 'wr-sub', text: sl.sub })),
    wrap.i > 0 ? h('button', { type: 'button', class: 'wr-prev', 'aria-label': 'Previous', text: '‹', onclick: prev }) : null);
  document.body.append(el);
  el.querySelector('.wr-tap').focus();
}
