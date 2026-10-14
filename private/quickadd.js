// Reads a date, time and #tag out of a quick-add line, e.g.
//   "Orgo flashcards fri 3pm #orgo"  ->  { title: "Orgo flashcards", due: <next Friday>, time: "15:00", tag: "orgo" }
// Only clear signals are taken (a weekday word, "tomorrow", "oct 28", "10/28",
// "in 3 days", "3pm", "at 15:30", "#tag"), so ordinary titles stay untouched.

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

const pad = n => String(n).padStart(2, '0');
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

const FULL_MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
function monthIndex(word) {
  const w = word.toLowerCase();
  const i = MONTHS.indexOf(w.slice(0, 3));
  if (i < 0) return -1;
  return w === MONTHS[i] || w === FULL_MONTHS[i] || w === 'sept' ? i : -1;
}

export function parseQuick(input, now = new Date()) {
  let s = ` ${input} `;
  let due = '', time = '', tag = '';
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const take = (re, fn) => { s = s.replace(re, (...m) => { const keep = fn(...m); return keep === false ? m[0] : ' '; }); };

  // #tag
  take(/\s#([\p{L}\p{N}_-]+)(?=\s)/u, (_, t) => { tag = t; });

  // time: 3pm, 3:15 pm, at 9am, at 15:30, noon
  take(/\s(?:at\s+)?(\d{1,2})(?::([0-5]\d))?\s?(am|pm)(?=\s)/i, (_, h, m, ap) => {
    const hh = (Number(h) % 12) + (ap.toLowerCase() === 'pm' ? 12 : 0);
    if (Number(h) > 12) return false;
    time = `${pad(hh)}:${m || '00'}`;
  });
  if (!time) take(/\sat\s+([01]?\d|2[0-3]):([0-5]\d)(?=\s)/i, (_, h, m) => { time = `${pad(Number(h))}:${m}`; });
  if (!time) take(/\s(?:at\s+)?noon(?=\s)/i, () => { time = '12:00'; });

  // relative days
  take(/\s(?:due\s+|by\s+)?(today|tonight)(?=\s)/i, () => { due = ymd(today); });
  if (!due) take(/\s(?:due\s+|by\s+)?(tomorrow|tmrw|tmr)(?=\s)/i, () => { due = ymd(addDays(today, 1)); });
  if (!due) take(/\sin\s+(\d{1,2})\s+(day|days|week|weeks)(?=\s)/i, (_, n, unit) => {
    due = ymd(addDays(today, Number(n) * (unit.toLowerCase().startsWith('week') ? 7 : 1)));
  });
  if (!due) take(/\s(?:due\s+|by\s+)?next\s+week(?=\s)/i, () => { due = ymd(addDays(today, 7 - today.getDay() + 1)); });

  // month + day: oct 28, october 28th
  if (!due) take(/\s(?:due\s+|by\s+|on\s+)?([a-z]{3,9})\.?\s+(\d{1,2})(?:st|nd|rd|th)?(?=\s)/i, (_, mon, d) => {
    const mi = monthIndex(mon);
    if (mi < 0 || Number(d) < 1 || Number(d) > 31) return false;
    let date = new Date(today.getFullYear(), mi, Number(d));
    if (date < addDays(today, -30)) date = new Date(today.getFullYear() + 1, mi, Number(d));
    due = ymd(date);
  });
  // numeric: 10/28 or 10/28/2026
  if (!due) take(/\s(?:due\s+|by\s+|on\s+)?(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?(?=\s)/, (_, m, d, y) => {
    if (Number(m) < 1 || Number(m) > 12 || Number(d) < 1 || Number(d) > 31) return false;
    let year = y ? (y.length === 2 ? 2000 + Number(y) : Number(y)) : today.getFullYear();
    let date = new Date(year, Number(m) - 1, Number(d));
    if (!y && date < addDays(today, -30)) date = new Date(year + 1, Number(m) - 1, Number(d));
    due = ymd(date);
  });
  // weekday: full names anywhere ("friday"), short forms only after due/by/on/this/next or at the end ("fri")
  const toDay = word => {
    const target = DAYS.findIndex(d => d.startsWith(word.toLowerCase().slice(0, 3)));
    let diff = (target - today.getDay() + 7) % 7;
    if (diff === 0) diff = 7; // "friday" said on a Friday means next week's
    due = ymd(addDays(today, diff));
  };
  if (!due) take(/\s(?:due\s+|by\s+|on\s+|this\s+|next\s+)?(sunday|monday|tuesday|wednesday|thursday|friday|saturday)(?=\s)/i, (_, w) => toDay(w));
  if (!due) take(/\s(?:due|by|on|this|next)\s+(sun|mon|tues?|wed|thu(?:rs?)?|fri|sat)(?=\s)/i, (_, w) => toDay(w));
  if (!due) take(/\s(sun|mon|tues?|wed|thu(?:rs?)?|fri|sat)\s*$/i, (_, w) => toDay(w));

  let title = s.replace(/\s+/g, ' ').trim();
  // keep the sentence-style capital if a leading date word was removed ("Monday lab prep" -> "Lab prep")
  if (title && /^[A-Z]/.test(input.trim()) && /^[a-z]/.test(title)) title = title[0].toUpperCase() + title.slice(1);
  return { title: title || input.trim(), due, time, tag };
}

