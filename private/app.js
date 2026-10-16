// Private dashboard. Everything shown here lives in memory only while
// unlocked; what gets stored anywhere is the encrypted vault (see crypto.js).
//
// All user text is rendered with textContent (never innerHTML), so nothing
// typed into a to-do or note can ever run as code.

import { createKey, unlock, open, strength, MIN_LENGTH, MIN_BITS } from './crypto.js';
import {
  REPO, emptyState, normalize, merge, uid, readLocal, readRemote, save, pull,
  checkToken, rekey, forgetLocal,
} from './store.js?v=4';
import {
  CANVAS_WEB, FEED_RE, fetchFeed, pushSupported, needsHomeScreen,
  currentSubscription, subscribe, unsubscribe, sendSchedule, testPush, shrinkPhoto, estimateMeal,
  setInboxKey, fetchInbox, ackInbox,
} from './helper.js';
import { newInboxKeys, openItem } from './inbox.js';
import { parseQuick } from './quickadd.js';
import { parseFoodText, CHAT_PROMPT } from './foodparse.js';
import { SPECIES, plantForTag, plant, plantIcon, forestPlot } from './plants.js?v=2';
import { renderOrgo } from './orgo/orgo.js?v=13';
import { renderProg } from './prog/prog.js?v=3';
import { bossCard } from './extras/boss.js?v=2';
import { renderLab, microbeCard } from './extras/lab.js?v=3';
import { renderBio } from './bio/bio.js?v=10';
import { initExtras, sleepCard, renderSleep, renderWeek, weekCard, renderCards, tilCard, palavrasCard, journalCard } from './extras/extras.js?v=7';

if (window.top !== window.self) { document.documentElement.textContent = ''; throw new Error('framed'); }

// ---------------------------------------------------------------- state

let S = null;          // decrypted state (memory only)
let K = null;          // AES key info (non-extractable key)
let view = 'today';
let calDay = todayStr();
let activeNoteId = null;
const showDone = new Set(); // which lists show their finished items
let openLater = false;      // assignments beyond this week stay hidden until asked
const closedGroups = new Set();
let lastGrowth = null; // previous flower progress, so growth animates from where it was
let addingEvent = false;
let editingTodo = null;
let focusAfter = null;
const sync = { status: 'idle', at: 0, msg: '' };
let saveTimer = null, saving = false, dirty = false;
let lastActive = Date.now(), hiddenAt = 0;
const inboxState = { keySent: false, busy: false, added: 0, addedFood: 0 };
// Focus timer: lives outside render so it keeps going while you move around the app.
const focus = { mode: 'idle', kind: 'focus', minutes: 25, endAt: 0, remaining: 0, taskId: '', timer: null };
let forestSpan = 'week', forestOffset = 0;
const canvasSync = { status: 'idle', at: 0, msg: '' };
const pushState = { sub: null, lastSent: '', timer: null };
// Meal photo flow (memory only; the photo is never saved).
let meal = { status: 'idle', photo: '', note: '', result: null, error: '' };

const root = document.getElementById('root');

// Until you pick one, the theme follows your device; after that it's a simple light/dark switch.
const darkQuery = matchMedia('(prefers-color-scheme: dark)');
function getTheme() { try { const t = localStorage.getItem('pv.theme'); return t === 'light' || t === 'dark' ? t : 'auto'; } catch { return 'auto'; } }
function effectiveTheme() { const t = getTheme(); return t === 'auto' ? (darkQuery.matches ? 'dark' : 'light') : t; }
function applyTheme(t) {
  if (t === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', t);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', getComputedStyle(document.documentElement).getPropertyValue('--bg').trim());
}
function refreshThemeButtons() {
  document.querySelectorAll('.theme-btn').forEach(b => b.replaceWith(themeButton(b.classList.contains('icon-btn'))));
}
function cycleTheme() {
  const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('pv.theme', next); } catch {}
  applyTheme(next);
  refreshThemeButtons();
}
function themeButton(compact = false) {
  const t = effectiveTheme();
  const label = t === 'dark' ? 'Dark mode (switch to light)' : 'Light mode (switch to dark)';
  if (compact) return h('button', { type: 'button', class: 'icon-btn theme-btn lock-theme', 'aria-label': label, title: label, onclick: cycleTheme }, icon(t === 'dark' ? 'moon' : 'sun'));
  return h('button', { type: 'button', class: 'nav-item theme-btn', title: label, 'aria-label': label, onclick: cycleTheme }, icon(t === 'dark' ? 'moon' : 'sun'), h('span', { text: t === 'dark' ? 'Dark' : 'Light' }));
}
applyTheme(getTheme());
darkQuery.addEventListener('change', () => { applyTheme(getTheme()); refreshThemeButtons(); });

// ---------------------------------------------------------------- dom helpers

function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  if (props) {
    for (const [k, v] of Object.entries(props)) {
      if (v === undefined || v === null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k === 'style') el.style.cssText = v; // CSSOM, allowed by the page's CSP
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (k === 'value') el.value = v;
      else if (k === 'checked') el.checked = v;
      else el.setAttribute(k, v === true ? '' : v);
    }
  }
  for (const kid of kids.flat(Infinity)) {
    if (kid === null || kid === undefined || kid === false) continue;
    el.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
  }
  return el;
}

const SVGNS = 'http://www.w3.org/2000/svg';
function s(tag, attrs, ...kids) {
  const el = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === 'style') el.style.cssText = v; else el.setAttribute(k, v);
  }
  for (const kid of kids.flat()) if (kid) el.append(kid);
  return el;
}

// Icons are fixed strings written here, never user data.
const ICONS = {
  today: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  calories: '<path d="M7 2v8a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V2M9 12v10M17 2c-1.7 1.4-3 4-3 7 0 2 1.3 3 3 3v10"/>',
  notes: '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  left: '<path d="M15 6l-6 6 6 6"/>',
  right: '<path d="M9 6l6 6-6 6"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-2.6-6.4M21 4v5h-5"/>',
  flower: '<path d="M12 9.6C14.9 8.2 14.6 3.6 12 2.6C9.4 3.6 9.1 8.2 12 9.6zM14.28 11.26C16.51 13.58 20.79 11.88 20.94 9.1C19.19 6.93 14.72 8.07 14.28 11.26zM13.41 13.94C11.89 16.78 14.83 20.32 17.53 19.6C19.04 17.27 16.58 13.37 13.41 13.94zM10.59 13.94C7.42 13.37 4.96 17.27 6.47 19.6C9.17 20.32 12.11 16.78 10.59 13.94zM9.72 11.26C9.28 8.07 4.81 6.93 3.06 9.1C3.21 11.88 7.49 13.58 9.72 11.26z"/><circle cx="12" cy="12" r="1.7"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  auto: '<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/>',
  orgo: '<path d="M12 2.8l8 4.6v9.2l-8 4.6-8-4.6V7.4z"/><circle cx="12" cy="12" r="3.2"/>',
  bio: '<path d="M12 21c-5-3-8-7-8-11a5 5 0 0 1 8-4 5 5 0 0 1 8 4c0 4-3 8-8 11z"/><path d="M12 6v15"/>',
  code: '<path d="M8.5 7 3.5 12l5 5M15.5 7l5 5-5 5M13.5 4.5l-3 15"/>',
  focus: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6M12 2v3"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 12.5h18"/>',
  tree: '<path d="M12 3l5 6.5h-2.6L18.5 15h-13l4.1-5.5H7z"/><path d="M12 15v6"/>',
  week: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4M7.5 16l2.5-3 2.5 2 3.5-4"/>',
  lab: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3"/><path d="M7.5 15h9"/>',
  cards: '<rect x="3" y="6" width="13" height="14" rx="2"/><path d="M8 3h10a3 3 0 0 1 3 3v11"/><path d="M7 11h5M7 15h3"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>',
};
function icon(name, cls = 'icon') {
  const el = document.createElementNS(SVGNS, 'svg');
  el.setAttribute('viewBox', '0 0 24 24');
  el.setAttribute('class', cls);
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = ICONS[name];
  return el;
}

// ---------------------------------------------------------------- dates

function pad(n) { return String(n).padStart(2, '0'); }
function toStr(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function todayStr() { return toStr(new Date()); }
function parse(str) { const [y, m, d] = str.split('-').map(Number); return new Date(y, m - 1, d); }
function addDays(str, n) { const d = parse(str); d.setDate(d.getDate() + n); return toStr(d); }
function daysBetween(a, b) { return Math.round((parse(b) - parse(a)) / 864e5); }
function fmtLong(str) { return parse(str).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }); }
function fmtShort(str) { return parse(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); }
function fmtWeekday(str) { return parse(str).toLocaleDateString(undefined, { weekday: 'short' }); }
function fmtTime(t) {
  if (!t) return '';
  const [hh, mm] = t.split(':').map(Number);
  return `${((hh + 11) % 12) + 1}:${pad(mm)} ${hh < 12 ? 'AM' : 'PM'}`;
}
function ago(ts) {
  const sec = Math.round((Date.now() - ts) / 1000);
  if (sec < 45) return 'just now';
  const min = Math.round(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} h ago`;
  return fmtShort(toStr(new Date(ts)));
}

function dueLabel(t, inGroup = false) {
  if (!t.due) return null;
  const diff = daysBetween(todayStr(), t.due);
  if (inGroup && (diff === 0 || diff === 1)) return t.time ? h('span', { class: 'due', text: fmtTime(t.time) }) : null;
  let text, cls = 'due';
  if (diff < 0) { text = `overdue · ${fmtShort(t.due)}`; cls += ' overdue'; }
  else if (diff === 0) { text = 'today'; cls += ' today'; }
  else if (diff === 1) text = 'tomorrow';
  else if (diff < 7) text = fmtWeekday(t.due);
  else text = fmtShort(t.due);
  if (t.time) text += ` ${fmtTime(t.time)}`;
  const lead = leadDays(t.title);
  if (lead && diff >= 2) {
    const start = addDays(t.due, -lead);
    const st = daysBetween(todayStr(), start);
    if (st <= 0) return [h('span', { class: cls, text }), h('span', { class: 'due start-now', text: 'start now' })];
    return [h('span', { class: cls, text }), h('span', { class: 'due start-by', text: `start ${st === 1 ? 'tomorrow' : st < 7 ? fmtWeekday(start) : fmtShort(start)}` })];
  }
  return h('span', { class: cls, text });
}

// How many days ahead to start, from what kind of work the title sounds like.
function leadDays(title = '') {
  const t = title.toLowerCase();
  if (/\b(final|midterm|exam)\b/.test(t)) return 7;
  if (/\b(project|paper|essay|presentation|proposal|poster)\b/.test(t)) return 5;
  if (/\blab (report|notes|write-?up)\b|\breport\b/.test(t)) return 3;
  if (/\b(homework|hw|problem set|pset|worksheet|assignment)\b/.test(t)) return 2;
  return 0;
}

const TAG_COLORS = 6;
function tagColor(tag) {
  let x = 0;
  for (const ch of tag || '') x = (x * 31 + ch.charCodeAt(0)) >>> 0;
  return `tag-c${x % TAG_COLORS}`;
}

// ---------------------------------------------------------------- live data

const live = c => S[c].filter(i => !i.deleted);
function touch(item) { item.updatedAt = Date.now(); return item; }

function commit(fn) {
  fn();
  render();
  scheduleSave();
}

// Saves wait until you've stopped tapping for a few seconds, so a burst of
// edits becomes one save. Hiding the tab saves straight away.
function scheduleSave(delay = 4000) {
  dirty = true;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(doSave, delay);
  setSync('pending');
}

async function doSave() {
  if (!S || !K) return;
  if (saving) { saveTimer = setTimeout(doSave, 500); return; }
  saving = true; dirty = false;
  setSync('saving');
  const snapshot = S;
  try {
    const res = await save(snapshot, K);
    if (res.state !== snapshot) { S = merge(S, res.state); rerenderSafely(); }
    setSync(res.synced ? 'synced' : 'local');
    queuePushSchedule();
  } catch (e) {
    if (e.code === 'KEY_MISMATCH') setSync('error', 'Your passphrase was changed on another device. Lock and unlock with the new one.');
    else if (e.code === 'BAD_TOKEN') setSync('error', 'GitHub token expired or was revoked. Add a new one in Settings.');
    else if (e.code === 'BAD_HELPER_KEY') setSync('error', 'The helper key was rejected, so changes are only saved on this device. Check it in Settings.');
    else if (e.code === 'NO_PERMISSION') setSync('error', 'GitHub token can’t save to the repo. Check its permissions in Settings.');
    else if (!navigator.onLine || e instanceof TypeError) setSync('offline');
    else setSync('error', e.message);
  } finally {
    saving = false;
    if (dirty) scheduleSave(1500);
  }
}

function setSync(status, msg = '') {
  sync.status = status; sync.msg = msg;
  if (status === 'synced' || status === 'local') sync.at = Date.now();
  const el = document.getElementById('sync');
  if (el) el.replaceWith(syncBadge());
}

function syncText() {
  switch (sync.status) {
    case 'pending': case 'saving': return 'Saving…';
    case 'synced': return `Encrypted & synced · ${ago(sync.at)}`;
    case 'local': return 'Saved on this device only';
    case 'offline': return 'Offline · saved on this device';
    case 'error': return `Sync problem: ${sync.msg}`;
    default: return S && S.github.token ? 'Encrypted & synced' : 'Saved on this device only';
  }
}
function syncBadge() {
  return h('div', { id: 'sync', class: `sync sync-${sync.status}`, title: syncText() }, syncText());
}

// Re-render unless the user is in the middle of typing.
function rerenderSafely() {
  const a = document.activeElement;
  if (a && (a.tagName === 'TEXTAREA' || (a.tagName === 'INPUT' && a.type !== 'checkbox'))) return;
  render();
}

// ---------------------------------------------------------------- boot / lock

async function boot() {
  const [remote, local] = [await readRemote(null), readLocal()];
  const file = (remote && remote.file) || local;
  if (!file) renderSetup(remote === undefined);
  else renderUnlock(remote, local);
}

function lockScreen(...kids) {
  root.replaceChildren(h('main', { class: 'lock' }, h('div', { class: 'lock-card' },
    themeButton(true),
    h('div', { class: 'lock-mark' }, icon('flower', 'icon icon-lg')), ...kids)));
}

function renderUnlock(remote, local) {
  const err = h('p', { class: 'form-error', role: 'alert' });
  const input = h('input', {
    type: 'password', id: 'pass', autocomplete: 'current-password', required: true,
    placeholder: 'Passphrase', 'aria-label': 'Passphrase',
  });
  const btn = h('button', { class: 'btn btn-primary btn-block', type: 'submit', text: 'Unlock' });
  const form = h('form', {
    onsubmit: async ev => {
      ev.preventDefault();
      err.textContent = '';
      btn.disabled = true; btn.textContent = 'Unlocking…';
      try {
        const primary = (remote && remote.file) || local;
        const res = await unlock(primary, input.value);
        let state = normalize(res.data);
        if (remote && remote.file && local) {
          try { state = merge(state, await open(local, res.keyInfo)); } catch { /* old copy from before a passphrase change */ }
        }
        input.value = '';
        await enter(state, res.keyInfo, !!(local && remote && remote.file));
      } catch (e) {
        err.textContent = e.code === 'BAD_PASSPHRASE' ? 'That passphrase didn’t work.' : e.message;
        btn.disabled = false; btn.textContent = 'Unlock';
        input.select();
      }
    },
  }, input, err, btn);
  lockScreen(
    h('h1', { text: 'Dashboard' }),
    h('p', { class: 'muted', text: 'Locked. Your data is encrypted; enter your passphrase to open it.' }),
    form,
  );
  input.focus();
}

function renderSetup(offline) {
  const pass = h('input', { type: 'password', autocomplete: 'new-password', placeholder: 'New passphrase', 'aria-label': 'New passphrase' });
  const again = h('input', { type: 'password', autocomplete: 'new-password', placeholder: 'Type it again', 'aria-label': 'Confirm passphrase' });
  const meterFill = h('div', { class: 'meter-fill' });
  const meterText = h('p', { class: 'small muted' });
  const ack = h('input', { type: 'checkbox', id: 'ack' });
  const err = h('p', { class: 'form-error', role: 'alert' });
  const btn = h('button', { class: 'btn btn-primary btn-block', type: 'submit', text: 'Create my encrypted dashboard' });

  const update = () => {
    const bits = strength(pass.value);
    const pct = Math.min(100, Math.round((bits / (MIN_BITS * 1.4)) * 100));
    meterFill.style.width = `${pct}%`;
    const ok = pass.value.length >= MIN_LENGTH && bits >= MIN_BITS;
    meterFill.className = `meter-fill ${ok ? 'good' : bits >= MIN_BITS * 0.7 ? 'ok' : 'weak'}`;
    meterText.textContent = !pass.value
      ? `At least ${MIN_LENGTH} characters. A short sentence only you would know works well, e.g. four unrelated words.`
      : ok ? 'Strong enough.' : `Too easy to guess yet: keep going (${pass.value.length}/${MIN_LENGTH}+ characters).`;
  };
  pass.addEventListener('input', update);

  const form = h('form', {
    onsubmit: async ev => {
      ev.preventDefault();
      err.textContent = '';
      if (pass.value.length < MIN_LENGTH || strength(pass.value) < MIN_BITS) { err.textContent = 'Please choose a longer passphrase.'; return; }
      if (pass.value !== again.value) { err.textContent = 'The two passphrases don’t match.'; return; }
      if (!ack.checked) { err.textContent = 'Please tick the box to confirm you understand.'; return; }
      btn.disabled = true; btn.textContent = 'Encrypting…';
      const keyInfo = await createKey(pass.value);
      pass.value = again.value = '';
      view = 'settings';
      await enter(emptyState(), keyInfo, true);
    },
  },
  pass, again, h('div', { class: 'meter' }, meterFill), meterText,
  h('label', { class: 'check-row', for: 'ack' }, ack,
    h('span', { text: 'I understand that if I forget this passphrase, nobody can recover my data. Not GitHub, not anyone.' })),
  err, btn);

  lockScreen(
    h('h1', { text: 'Set up your dashboard' }),
    h('p', { class: 'muted', text: 'Choose a passphrase. It encrypts everything in your browser before it is saved anywhere, and it is never stored or sent.' }),
    offline ? h('p', { class: 'notice warn', text: 'Couldn’t reach GitHub to check for an existing dashboard. If you already set one up, reload when you’re online instead.' }) : null,
    form,
  );
  update();
  pass.focus();
}

async function enter(state, keyInfo, needsSave) {
  S = normalize(state); K = keyInfo;
  if (location.hash.slice(1) in VIEWS) view = location.hash.slice(1);
  render();
  if (S.github.token || S.push.dashKey) {
    try {
      const res = await pull(S, K);
      if (res.changed) { S = res.state; rerenderSafely(); }
      setSync('synced');
    } catch (e) {
      if (e.code === 'BAD_TOKEN') setSync('error', 'GitHub token expired or was revoked. Add a new one in Settings.');
      else setSync('offline');
    }
  }
  if (needsSave) scheduleSave(300);
  startAutoLock();
  syncCanvas();
  setInterval(() => { if (!document.hidden) syncCanvas(); }, 30 * 60e3);
  try { pushState.sub = await currentSubscription(); } catch {}
  queuePushSchedule(1000);
  checkInbox();
  setInterval(() => { if (!document.hidden) checkInbox(); }, 3 * 60e3);
}

// ---------------------------------------------------------------- task inbox

// Picks up tasks sent from elsewhere (e.g. add-task.mjs). They arrive sealed
// to this vault's public key, so the helper holding them can't read them.
async function checkInbox() {
  if (!S || !K || !S.push.dashKey || inboxState.busy) return;
  inboxState.busy = true;
  try {
    if (!S.inbox.priv || !S.inbox.pub) {
      S.inbox = { ...(await newInboxKeys()), updatedAt: Date.now() };
      inboxState.keySent = false;
      scheduleSave(200);
    }
    if (!inboxState.keySent) { await setInboxKey(S.push.dashKey, S.inbox.pub); inboxState.keySent = true; }
    const items = await fetchInbox(S.push.dashKey);
    if (!items.length) return;
    const opened = [];
    let added = 0;
    for (const it of items) {
      let t;
      try { t = await openItem(S.inbox.priv, it); } catch { continue; } // sealed to another key: leave it
      opened.push(it.id);
      const id = `inbox-${String(it.id).replace(/[^A-Za-z0-9_-]/g, '')}`;
      if (t && t.type === 'food') {
        if (typeof t.name === 'string' && t.name.trim() && !S.food.some(x => x.id === id)) {
          S.food.push(touch({
            id, date: /^\d{4}-\d{2}-\d{2}$/.test(t.date || '') ? t.date : todayStr(), name: t.name.trim().slice(0, 80),
            ...Object.fromEntries(NUTRIENTS.map(m => [m.key, Math.max(0, Number(t[m.key]) || 0)])),
          }));
          inboxState.addedFood++;
          added++;
        }
        continue;
      }
      if (!t || typeof t.title !== 'string' || !t.title.trim() || S.todos.some(x => x.id === id)) continue;
      S.todos.push(touch({
        id, title: t.title.trim().slice(0, 200),
        due: /^\d{4}-\d{2}-\d{2}$/.test(t.due || '') ? t.due : '',
        time: /^\d{2}:\d{2}$/.test(t.time || '') ? t.time : '',
        tag: typeof t.tag === 'string' ? t.tag.trim().slice(0, 40) : '',
        done: false, createdAt: Date.now(),
      }));
      added++;
    }
    if (added) {
      inboxState.added += added;
      rerenderSafely();
      // make sure they're saved before the inbox is emptied
      scheduleSave(0);
      for (let i = 0; i < 100 && (dirty || saving); i++) await new Promise(r => setTimeout(r, 100));
    }
    if (opened.length) await ackInbox(S.push.dashKey, opened);
  } catch { /* offline or helper unreachable: try again later */ }
  finally { inboxState.busy = false; }
}

// ---------------------------------------------------------------- Canvas sync

// "Homework 6 [COT3100 Discrete Structures - Fall 2026]" -> title + course tag
function splitSummary(summary) {
  const m = (summary || '').match(/^(.*?)\s*\[([^\]]+)\]\s*$/);
  const title = (m ? m[1] : summary || '').trim() || 'Canvas item';
  const code = m && m[2].match(/[A-Z]{3}\s?\d{4}[A-Z]?/);
  return { title, tag: code ? code[0].replace(/\s/, '') : 'Canvas' };
}

// Insert or update a Canvas item without undoing anything you changed here
// (deleting it, or ticking it off).
function upsert(coll, id, fields) {
  const ex = S[coll].find(x => x.id === id);
  if (!ex) {
    S[coll].push(touch({ id, ...fields, ...(coll === 'todos' ? { done: false, createdAt: Date.now() } : {}) }));
    return true;
  }
  if (ex.deleted) return false;
  const changed = Object.keys(fields).some(k => ex[k] !== fields[k]);
  if (changed) { Object.assign(ex, fields); touch(ex); }
  return changed;
}

function applyCanvas(events) {
  const today = todayStr(), last = addDays(today, 60);
  let changed = false;
  for (const ev of events) {
    const date = toStr(ev.start.date);
    const time = ev.start.allDay ? '' : `${pad(ev.start.date.getHours())}:${pad(ev.start.date.getMinutes())}`;
    // Only what's coming up; past items may already be submitted, and the feed can't tell.
    if (date < today || date > last) continue;
    const { title, tag } = splitSummary(ev.summary);
    const url = typeof ev.url === 'string' && ev.url.startsWith(CANVAS_WEB + '/') ? ev.url : '';
    const key = ev.uid.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 80);
    if (/assignment|quiz|discussion/i.test(ev.uid)) {
      changed = upsert('todos', `canvas-${key}`, { title, due: date, time, tag, source: 'canvas', url }) || changed;
    } else {
      changed = upsert('events', `canvas-${key}`, { title, date, time, location: ev.location || '', tag, source: 'canvas' }) || changed;
    }
  }
  return changed;
}

async function syncCanvas(manual = false) {
  if (!S || !S.canvas.feed || canvasSync.status === 'loading') return;
  if (!manual && Date.now() - canvasSync.at < 10 * 60e3) return;
  canvasSync.status = 'loading';
  if (manual) rerenderSafely();
  try {
    const events = await fetchFeed(S.canvas.feed);
    Object.assign(canvasSync, { status: 'ok', at: Date.now(), msg: '' });
    if (applyCanvas(events)) scheduleSave();
  } catch (e) {
    Object.assign(canvasSync, { status: 'error', at: Date.now(), msg: e.code === 'BAD_FEED' ? 'Canvas feed link stopped working. Paste it again in Settings.' : 'Couldn’t reach Canvas' });
  }
  rerenderSafely();
}

// ---------------------------------------------------------------- notification schedule

// Only times and counts are sent to the helper, never titles.
function pushSchedule() {
  const now = Date.now();
  const today = todayStr();
  const open = openTodos();
  const [bh, bm] = (S.push.briefTime || '08:00').split(':').map(Number);
  const items = [];
  for (let i = 0; i < 7; i++) {
    const day = addDays(today, i);
    const d = parse(day); d.setHours(bh, bm, 0, 0);
    if (+d <= now) continue;
    const n = open.filter(t => t.due === day || (i === 0 && t.due && t.due < day)).length;
    items.push({ at: +d, kind: 'brief', n });
  }
  const due = new Map();
  for (const t of open) {
    if (!t.due || !t.time) continue;
    const [h1, m1] = t.time.split(':').map(Number);
    const d = parse(t.due); d.setHours(h1, m1, 0, 0);
    const at = +d - (S.push.leadMin || 60) * 60e3;
    if (at > now && at < now + 7 * 864e5) due.set(at, (due.get(at) || 0) + 1);
  }
  for (const [at, n] of due) items.push({ at, kind: 'due', n });
  return items.sort((a, b) => a.at - b.at);
}

function queuePushSchedule(delay = 5000) {
  clearTimeout(pushState.timer);
  pushState.timer = setTimeout(sendPushSchedule, delay);
}

async function sendPushSchedule(throwErrors = false) {
  if (!S || !S.push.dashKey || !pushState.sub) return;
  const items = pushSchedule();
  const sig = JSON.stringify(items);
  if (sig === pushState.lastSent) return;
  try { await sendSchedule(S.push.dashKey, pushState.sub, items); pushState.lastSent = sig; } catch (e) { if (throwErrors) throw e; }
}

async function lock() {
  if (dirty || saving) {
    clearTimeout(saveTimer);
    root.replaceChildren(h('div', { class: 'boot', text: 'Saving before locking…' }));
    while (saving) await new Promise(r => setTimeout(r, 100));
    if (dirty) { try { await save(S, K); } catch {} }
  }
  S = null; K = null;
  // A reload is the surest way to wipe every decrypted value from memory.
  location.replace(location.pathname);
}

function startAutoLock() {
  const bump = () => { lastActive = Date.now(); };
  ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(e => addEventListener(e, bump, { passive: true }));
  const limit = () => (S ? S.settings.autoLockMin : 10) * 60e3;
  setInterval(() => { if (S && focus.mode !== 'running' && Date.now() - lastActive > limit()) lock(); }, 15e3);
  document.addEventListener('visibilitychange', async () => {
    if (!S) return;
    if (document.hidden) { hiddenAt = Date.now(); if (dirty) doSave(); return; }
    if (focus.mode === 'running' && focus.kind === 'focus' && focusStrict() && hiddenAt && Date.now() - hiddenAt > WILT_MS) wiltFocus();
    if (hiddenAt && focus.mode !== 'running' && Date.now() - hiddenAt > limit()) { lock(); return; }
    lastActive = Date.now();
    // Pick up edits made on another device while this tab was in the background.
    if ((S.github.token || S.push.dashKey) && !dirty && !saving) {
      try { const res = await pull(S, K); if (res.changed) { S = res.state; rerenderSafely(); } } catch {}
    }
    syncCanvas();
    checkInbox();
    queuePushSchedule(2000);
  });
  setInterval(() => { const el = document.getElementById('sync'); if (el && S) el.replaceWith(syncBadge()); }, 30e3);
}

// ---------------------------------------------------------------- layout

const VIEWS = {
  today: { label: 'Today', icon: 'today', render: renderToday },
  calories: { label: 'Calories', icon: 'calories', render: renderCalories },
  focus: { label: 'Focus', icon: 'focus', render: renderFocus },
  forest: { label: 'Forest', icon: 'tree', render: renderForest },
  week: { label: 'Week', icon: 'week', render: renderWeek },
  sleep: { label: 'Sleep', icon: 'moon', render: renderSleep },
  internships: { label: 'Internships', icon: 'briefcase', render: renderInternships },
  orgo: { label: 'Orgo', icon: 'orgo', render: () => renderOrgo(ORGO_CTX) },
  bio: { label: 'Biology', icon: 'bio', render: () => renderBio(ORGO_CTX) },
  prog: { label: 'Prog 1', icon: 'code', render: () => renderProg(ORGO_CTX) },
  cards: { label: 'Cards', icon: 'cards', render: renderCards },
  lab: { label: 'Study lab', icon: 'lab', render: () => renderLab(ORGO_CTX) },
  notes: { label: 'Quick Notes', icon: 'notes', render: renderNotes },
  settings: { label: 'Settings', icon: 'settings', render: renderSettings },
};

// What the Orgo tab needs from the app (it lives in its own module).
const ORGO_CTX = { h, card, commit, touch, uid, render: () => render(), S: () => S, todayStr, addDays, go };

// Sleep, week in review, cards and "today I learned" live in extras/.
initExtras({
  h, s, card, icon, iconBtn, commit, touch, uid, S: () => S, live, todayStr, addDays, parse, toStr,
  fmtShort, fmtWeekday, fmtTime, totalsFor, focusMinutes, taskItems, forestPlot, render: () => render(), go,
});

function go(v) { view = v; history.replaceState(null, '', `#${v}`); render(); window.scrollTo(0, 0); }

function render() {
  if (!S) return;
  const nav = h('nav', { class: 'nav', 'aria-label': 'Sections' },
    Object.entries(VIEWS).map(([key, v]) => h('a', {
      href: `#${key}`, class: `nav-item${view === key ? ' active' : ''}`,
      'aria-current': view === key ? 'page' : null,
      onclick: e => { e.preventDefault(); go(key); },
    }, icon(v.icon), h('span', { text: v.label }),
    key === 'focus' && focus.mode === 'running' ? h('span', { id: 'focus-nav-badge', class: 'nav-badge', text: fmtClock(focusLeft()) }) : null)));

  const side = h('aside', { class: 'side' },
    h('div', { class: 'brand' },
      h('div', { class: 'brand-name', text: S.settings.name || 'Private' }),
      h('div', { class: 'brand-title' }, icon('flower'), 'Dashboard')),
    nav,
    h('div', { class: 'side-foot' },
      themeButton(),
      h('button', { class: 'nav-item', type: 'button', onclick: lock }, icon('lock'), h('span', { text: 'Lock' })),
      syncBadge()));

  const main = h('main', { class: 'main' }, VIEWS[view].render());
  root.replaceChildren(h('div', { class: 'layout' }, side, main));
  if (focusAfter) { const el = document.getElementById(focusAfter); focusAfter = null; if (el) el.focus(); }
}

function card(title, extra, ...body) {
  return h('section', { class: 'card' },
    h('header', { class: 'card-head' }, h('h2', { text: title }), extra || null),
    ...body);
}

function iconBtn(name, label, onclick, cls = '') {
  return h('button', { type: 'button', class: `icon-btn ${cls}`, 'aria-label': label, title: label, onclick }, icon(name));
}

function tagChip(tag) { return tag ? h('span', { class: `chip ${tagColor(tag)}`, text: tag }) : null; }

function tagList() {
  const tags = new Set([...live('todos'), ...live('events')].map(i => i.tag).filter(Boolean));
  return h('datalist', { id: 'tags' }, [...tags].sort().map(t => h('option', { value: t })));
}

// ---------------------------------------------------------------- today

function openTodos() {
  return live('todos').filter(t => !t.done).sort((a, b) => {
    if (!a.due !== !b.due) return a.due ? -1 : 1;
    return (a.due || '').localeCompare(b.due || '') || (a.time || '99').localeCompare(b.time || '99') || a.createdAt - b.createdAt;
  });
}

function eventsOn(day) {
  return live('events').filter(e => e.date === day)
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
}

function brief() {
  const today = todayStr();
  const todos = openTodos();
  const overdue = todos.filter(t => t.due && t.due < today);
  const dueToday = todos.filter(t => t.due === today);
  const evs = eventsOn(today).filter(e => e.time);
  const parts = [];
  if (dueToday.length) {
    const names = dueToday.slice(0, 3).map(t => t.title);
    const more = dueToday.length - names.length;
    parts.push(`Due today: ${names.join(', ')}${more > 0 ? `, and ${more} more` : ''}.`);
  }
  if (overdue.length) parts.push(`${overdue.length} overdue.`);
  if (evs.length) parts.push(`${dueToday.length ? 'Then' : 'On the calendar:'} ${evs.map(e => `${e.title} at ${fmtTime(e.time)}`).join(', ')}.`);
  const next = todos.find(t => t.due && t.due > today);
  if (next) parts.push(`Next up: ${next.title} (${fmtShort(next.due)}).`);
  const soonExam = upcomingExams().find(x => x.days <= 7);
  if (soonExam) parts.push(`${soonExam.title} ${soonExam.days === 0 ? 'is today' : soonExam.days === 1 ? 'is tomorrow' : `in ${soonExam.days} days`}.`);
  return parts.join(' ') || 'Nothing due today. Enjoy it.';
}

// The Today header at a glance: a few short pills instead of a paragraph.
function glance() {
  const today = todayStr();
  const todos = openTodos();
  const overdue = todos.filter(t => t.due && t.due < today).length;
  const dueToday = todos.filter(t => t.due === today).length;
  const now = new Date();
  const hm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const nextEv = eventsOn(today).filter(e => e.time && e.time >= hm).sort((a, b) => a.time.localeCompare(b.time))[0];
  const exam = upcomingExams()[0];
  const next = todos.filter(t => t.due && t.due > today).sort((a, b) => a.due.localeCompare(b.due))[0];
  const pill = (icon, text, cls = '', title = text) => h('span', { class: `glance-pill ${cls}`, title }, h('span', { class: 'glance-ic', 'aria-hidden': 'true', text: icon }), h('span', { class: 'glance-t', text }));
  const pills = [];
  pills.push(dueToday ? pill('📌', `${dueToday} due today`, 'hot') : pill('✿', 'Nothing due today', 'calm'));
  if (overdue) pills.push(pill('⚠', `${overdue} overdue`, 'warn'));
  if (nextEv) pills.push(pill('🕐', `${fmtTime(nextEv.time)} · ${nextEv.title}`, ''));
  if (exam) pills.push(pill('⏳', `${exam.title.replace(/\s*\(.*?\)\s*/g, ' ').trim()} · ${exam.days === 0 ? 'today' : exam.days === 1 ? 'tomorrow' : `${exam.days} days`}`, exam.days <= 3 ? 'warn' : ''));
  if (next) pills.push(pill('→', `${next.title} · ${fmtShort(next.due)}`, ''));
  return h('div', { class: 'glance', 'aria-label': 'Today at a glance' }, pills);
}

function greeting() {
  const hr = new Date().getHours();
  const part = hr < 5 ? 'Sweet dreams' : hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
  return `${part}${S.settings.name ? `, ${S.settings.name}` : ''}`;
}

function renderToday() {
  const today = todayStr();
  const todos = openTodos();
  const evToday = eventsOn(today);
  return h('div', { class: 'page' },
    h('header', { class: 'page-head today-head' }, h('div', { class: 'today-head-text' },
      h('p', { class: 'greeting', text: greeting() }),
      h('h1', { text: fmtLong(today) }),
      glance(),
      h('p', { class: 'meta sr-only', text: (() => {
        const week = addDays(today, 7);
        const asg = todos.filter(t => isAssignment(t) && t.due && t.due <= week).length;
        const tasks = todos.filter(t => !isAssignment(t)).length;
        const n = (k, w) => `${k} ${w}${k === 1 ? '' : 's'}`;
        const fm = focusMinutes(today);
        return [n(evToday.length, 'event'), asg ? `${n(asg, 'assignment')} this week` : null, n(tasks, 'task'), fm ? `${fm} min focused` : null].filter(Boolean).join(' · ');
      })() })), flowerGadget()),
    h('div', { class: 'grid' },
      h('div', { class: 'col' }, calendarCard(today), h('div', { class: 'todo-split' }, assignmentsCard(), tasksCard())),
      h('div', { class: 'col col-narrow' }, sleepCard(), weekCard(), internsCard(), countdownCard(), studyCorner(), caloriesMini(), tilCard())),
    tagList());
}

function calendarCard(today) {
  const evs = eventsOn(today);

  const row = e => h('div', { class: 'event' },
    h('div', { class: 'event-time', text: e.time ? fmtTime(e.time) : 'All day' }),
    h('div', { class: `event-body ${tagColor(e.tag)}` },
      h('div', { class: 'event-title', text: e.title }),
      e.location ? h('div', { class: 'event-sub', text: e.location }) : null),
    tagChip(e.tag),
    iconBtn('x', 'Delete event', () => commit(() => { touch(e).deleted = true; }), 'row-action'));

  let form = null;
  if (addingEvent) {
    const title = h('input', { id: 'ev-title', placeholder: 'What', required: true, 'aria-label': 'Event title' });
    const date = h('input', { type: 'date', value: today, required: true, 'aria-label': 'Date' });
    const time = h('input', { type: 'time', 'aria-label': 'Time (leave empty for all day)' });
    const where = h('input', { placeholder: 'Where (optional)', 'aria-label': 'Location' });
    const tag = h('input', { placeholder: 'Tag', list: 'tags', 'aria-label': 'Tag' });
    form = h('form', {
      class: 'inline-form',
      onsubmit: ev => {
        ev.preventDefault();
        if (!title.value.trim()) return;
        commit(() => {
          S.events.push(touch({ id: uid(), title: title.value.trim(), date: date.value, time: time.value, location: where.value.trim(), tag: tag.value.trim() }));
          addingEvent = false;
        });
      },
    }, title, h('div', { class: 'row' }, date, time), where, tag,
    h('div', { class: 'row' },
      h('button', { class: 'btn btn-primary', type: 'submit', text: 'Add event' }),
      h('button', { class: 'btn', type: 'button', text: 'Cancel', onclick: () => { addingEvent = false; render(); } })));
    focusAfter = 'ev-title';
  }

  return card('On your calendar',
    addingEvent ? null : h('button', { class: 'btn btn-small', type: 'button', onclick: () => { addingEvent = true; render(); } }, icon('plus'), 'Add'),
    form,
    evs.length ? h('div', { class: 'events' }, evs.map(row)) : h('p', { class: 'empty', text: 'Nothing planned. A free day ✿' }));
}

function assignmentRow(t) {
  if (editingTodo === t.id) return todoRow(t, true);
  const id = `t-${t.id}`;
  const due = t.done ? null : dueLabel(t, true);
  return h('li', { class: `todo asg ${tagColor(t.tag)}${t.done ? ' done' : ''}` },
    h('input', {
      type: 'checkbox', id, checked: !!t.done,
      onchange: e => commit(() => { t.done = e.target.checked; t.doneAt = t.done ? Date.now() : 0; touch(t); }),
    }),
    h('div', { class: 'asg-body' },
      h('label', { for: id, class: 'todo-title' }, h('span', { text: t.title })),
      h('div', { class: 'asg-meta' },
        t.tag ? h('span', { class: 'asg-course', text: t.tag }) : null,
        due)),
    t.url ? h('a', { href: t.url, target: '_blank', rel: 'noopener noreferrer', class: 'ext', title: 'Open in Canvas', 'aria-label': 'Open in Canvas', text: '↗' }) : null,
    iconBtn('notes', 'Edit', () => { editingTodo = t.id; render(); }, 'row-action'));
}

function todoRow(t, inGroup = false) {
  if (editingTodo === t.id) {
    const title = h('input', { id: 'edit-title', value: t.title, 'aria-label': 'To-do' });
    const due = h('input', { type: 'date', value: t.due || '', 'aria-label': 'Due date' });
    const time = h('input', { type: 'time', value: t.time || '', 'aria-label': 'Due time' });
    const tag = h('input', { value: t.tag || '', placeholder: 'Tag', list: 'tags', 'aria-label': 'Tag' });
    focusAfter = 'edit-title';
    return h('li', { class: 'todo editing' }, h('form', {
      class: 'inline-form',
      onsubmit: ev => {
        ev.preventDefault();
        commit(() => {
          Object.assign(t, { title: title.value.trim() || t.title, due: due.value, time: time.value, tag: tag.value.trim() });
          touch(t); editingTodo = null;
        });
      },
    }, title, h('div', { class: 'row' }, due, time, tag),
    h('div', { class: 'row' },
      h('button', { class: 'btn btn-primary', type: 'submit', text: 'Save' }),
      h('button', { class: 'btn', type: 'button', text: 'Cancel', onclick: () => { editingTodo = null; render(); } }),
      h('button', { class: 'btn btn-danger', type: 'button', text: 'Delete', onclick: () => commit(() => { touch(t).deleted = true; editingTodo = null; }) }))));
  }
  const id = `t-${t.id}`;
  return h('li', { class: `todo${t.done ? ' done' : ''}` },
    h('input', {
      type: 'checkbox', id, checked: !!t.done,
      onchange: e => commit(() => { t.done = e.target.checked; t.doneAt = t.done ? Date.now() : 0; touch(t); }),
    }),
    h('label', { for: id, class: 'todo-title' }, h('span', { text: t.title }), ' ', t.done ? null : dueLabel(t, inGroup)),
    t.url ? h('a', { href: t.url, target: '_blank', rel: 'noopener noreferrer', class: 'ext', title: 'Open in Canvas', 'aria-label': 'Open in Canvas', text: '↗' }) : null,
    tagChip(t.tag),
    iconBtn('notes', 'Edit', () => { editingTodo = t.id; render(); }, 'row-action'));
}

const GROUPS = [
  ['Overdue', (t, d) => t.due && t.due < d.today],
  ['Today', (t, d) => t.due === d.today],
  ['Tomorrow', (t, d) => t.due === d.tomorrow],
  ['This week', (t, d) => t.due > d.tomorrow && t.due <= d.week],
  ['Later', (t, d) => t.due > d.week],
  ['No date', t => !t.due],
];

const isAssignment = t => t.source === 'canvas';

function groupedTodos(open, kind) {
  const today = todayStr();
  const d = { today, tomorrow: addDays(today, 1), week: addDays(today, 7) };
  return h('div', { class: 'todo-groups' }, GROUPS.map(([label, test]) => {
    const items = open.filter(t => test(t, d));
    if (!items.length) return null;
    const key = `${kind}:${label}`;
    // Assignments: only the coming week is shown; the rest stays tucked away
    // behind one quiet line until you ask for it.
    if (kind === 'assignments' && (label === 'This week' || label === 'Later') && !openLater) {
      if (label === 'Later' && open.some(t => GROUPS[3][1](t, d))) return null;
      const week = open.filter(t => GROUPS[3][1](t, d)).length, later = open.filter(t => GROUPS[4][1](t, d)).length;
      return h('button', { type: 'button', class: 'more-later', onclick: () => { openLater = true; render(); } },
        [week ? `+ ${week} more this week` : null, later ? `${later} later` : null].filter(Boolean).join(' · '));
    }
    const closed = closedGroups.has(key);
    return h('section', { class: `todo-group group-${label.toLowerCase().replace(/\s+/g, '-')}` },
      h('button', {
        type: 'button', class: 'group-label', 'aria-expanded': String(!closed),
        onclick: () => {
          if (kind === 'assignments' && (label === 'This week' || label === 'Later')) { openLater = false; render(); return; }
          closed ? closedGroups.delete(key) : closedGroups.add(key); render();
        },
      }, h('span', { class: 'group-caret', text: closed ? '▸' : '▾' }), h('span', { text: label }), h('span', { class: 'group-count', text: String(items.length) })),
      closed ? null : h('ul', { class: 'todos' }, items.map(t => kind === 'assignments' ? assignmentRow(t) : todoRow(t, true))));
  }));
}

function doneSection(kind, done) {
  if (!done.length) return [];
  const shown = showDone.has(kind);
  return [
    h('div', { class: 'done-bar' },
      h('button', { class: 'link', type: 'button', text: shown ? `Hide done (${done.length})` : `Show done (${done.length})`, onclick: () => { shown ? showDone.delete(kind) : showDone.add(kind); render(); } }),
      shown ? h('button', { class: 'link', type: 'button', text: 'Clear done', onclick: () => commit(() => done.forEach(t => { touch(t).deleted = true; })) }) : null),
    shown ? h('ul', { class: 'todos' }, done.map(t => kind === 'assignments' ? assignmentRow(t) : todoRow(t))) : null,
  ];
}

function doneOf(test) {
  return live('todos').filter(t => t.done && test(t)).sort((a, b) => (b.doneAt || 0) - (a.doneAt || 0));
}

function tasksCard() {
  const open = openTodos().filter(t => !isAssignment(t));
  const title = h('input', {
    id: 'todo-new', placeholder: 'Try “Orgo flashcards fri 3pm #orgo”', 'aria-label': 'New task', autocomplete: 'off',
    oninput: () => showPreview(),
    onpaste: e => {
      const lines = (e.clipboardData ? e.clipboardData.getData('text') : '').split(/\r?\n/)
        .map(l => l.replace(/^\s*(?:[*\-•–]|\d+[.)]|\[[ x]?\])\s*/i, '').trim()).filter(Boolean);
      if (lines.length < 2) return;
      e.preventDefault();
      commit(() => {
        lines.forEach(text => {
          const q = parseQuick(text);
          S.todos.push(touch({ id: uid(), title: q.title.slice(0, 200), due: due.value || q.due, time: q.time, tag: tag.value.trim() || q.tag, done: false, createdAt: Date.now() }));
        });
        focusAfter = 'todo-new';
      });
    },
  });
  const due = h('input', { type: 'date', 'aria-label': 'Due date' });
  const tag = h('input', { placeholder: 'Tag', list: 'tags', class: 'tag-input', 'aria-label': 'Tag' });
  const preview = h('div', { class: 'quick-preview', 'aria-live': 'polite' });
  function showPreview() {
    const q = parseQuick(title.value);
    const bits = [];
    if (q.due && !due.value) bits.push(fmtShort(q.due) + (daysBetween(todayStr(), q.due) < 7 ? ` (${fmtWeekday(q.due)})` : ''));
    if (q.time) bits.push(fmtTime(q.time));
    if (q.tag && !tag.value.trim()) bits.push(`#${q.tag}`);
    preview.textContent = bits.length ? `✿ ${bits.join(' · ')}` : '';
  }
  const form = h('form', {
    class: 'add-row',
    onsubmit: ev => {
      ev.preventDefault();
      const text = title.value.trim();
      if (!text) return;
      const q = parseQuick(text);
      commit(() => {
        S.todos.push(touch({ id: uid(), title: q.title.slice(0, 200), due: due.value || q.due, time: q.time, tag: tag.value.trim() || q.tag, done: false, createdAt: Date.now() }));
        focusAfter = 'todo-new';
      });
    },
  }, title, preview, h('div', { class: 'add-row-sub' }, due, tag, h('button', { class: 'btn btn-primary', type: 'submit', 'aria-label': 'Add task' }, icon('plus'))));

  const c = card('Tasks', h('span', { class: 'card-meta', text: `${open.length} open` }),
    inboxState.added ? h('button', {
      type: 'button', class: 'inbox-note', title: 'Dismiss',
      onclick: () => { inboxState.added = 0; render(); },
    }, `✿ ${inboxState.added} new from your inbox`) : null,
    form,
    open.length ? groupedTodos(open, 'tasks') : h('p', { class: 'empty', text: 'All clear. Go smell some flowers ✿' }),
    ...doneSection('tasks', doneOf(t => !isAssignment(t))));
  c.classList.add('card-tasks');
  return c;
}

function assignmentsCard() {
  const open = openTodos().filter(isAssignment);
  if (!S.canvas.feed && !open.length) return null;
  const week = addDays(todayStr(), 7);
  const soon = open.filter(t => t.due && t.due <= week).length;
  const text = canvasSync.status === 'loading' ? 'Checking Canvas…'
    : canvasSync.status === 'error' ? canvasSync.msg
    : canvasSync.at ? `Synced from Canvas ${ago(canvasSync.at)}` : 'From Canvas';
  const line = h('div', { class: `source-line${canvasSync.status === 'error' ? ' warn' : ''}` },
    h('span', { text }), iconBtn('refresh', 'Refresh from Canvas', () => syncCanvas(true)));

  const c = card('Assignments', h('span', { class: 'card-meta', text: `${soon} this week` }),
    line,
    open.length ? groupedTodos(open, 'assignments') : h('p', { class: 'empty', text: 'Nothing due. Enjoy it ✿' }),
    ...doneSection('assignments', doneOf(isAssignment)));
  c.classList.add('card-assignments');
  return c;
}

// ---------------------------------------------------------------- today's flower

// Tasks for today: anything due today or earlier that's still open, plus
// whatever you finished today, whenever it was due (or with no due date).
// The flower grows with each one you tick off.
function dayProgress() {
  const today = todayStr();
  const doneToday = t => t.doneAt && toStr(new Date(t.doneAt)) === today;
  const tasks = live('todos').filter(t => doneToday(t) || (!t.done && t.due && t.due <= today));
  return { total: tasks.length, done: tasks.filter(t => t.done).length };
}

// Point on the stem's cubic curve, t from 0 (soil) to 1 (top).
const STEM = [[60, 150], [52, 118], [70, 88], [60, 46]];
function stemAt(t) {
  const u = 1 - t;
  const c = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
  return [0, 1].map(k => STEM.reduce((acc, p, i) => acc + p[k] * c[i], 0));
}

function flowerGadget() {
  const { total, done } = dayProgress();
  const p = total ? done / total : 0;
  const bloomed = total > 0 && done === total;
  const from = lastGrowth === null ? p : lastGrowth;
  lastGrowth = p;
  const reach = 0.3 + 0.7 * p;            // how much of the stem is visible (starts as a seedling with a leaf)
  const reachFrom = 0.3 + 0.7 * from;

  const svg = s('svg', { viewBox: '0 0 120 170', class: `grow${bloomed ? ' bloomed' : ''}`, role: 'img',
    'aria-label': total ? `Flower ${bloomed ? 'in full bloom' : `growing, ${done} of ${total} tasks done`}` : 'Seedling resting, nothing due today' });
  svg.append(s('ellipse', { cx: 60, cy: 152, rx: 34, ry: 6, class: 'grow-soil' }));
  const stem = s('path', {
    d: `M${STEM[0]} C${STEM[1]} ${STEM[2]} ${STEM[3]}`, class: 'grow-stem', pathLength: 100,
    'stroke-dasharray': 100, 'stroke-dashoffset': (100 * (1 - reach)).toFixed(1),
  });
  svg.append(stem);
  if (reach !== reachFrom) {
    requestAnimationFrame(() => stem.animate(
      [{ strokeDashoffset: 100 * (1 - reachFrom) }, { strokeDashoffset: 100 * (1 - reach) }],
      { duration: 700, easing: 'ease-out' }));
  }

  // Leaves unfurl as you go; each sits on the stem.
  [[0.22, -1], [0.42, 1], [0.62, -1]].forEach(([at, side], i) => {
    if (reach < at + 0.06) return;
    const [x, y] = stemAt(at);
    const isNew = reachFrom < at + 0.06;
    svg.append(s('path', {
      d: `M${x} ${y}c${10 * side} -9 ${24 * side} -9 ${30 * side} -2c${-8 * side} 8 ${-20 * side} 9 ${-30 * side} 2z`,
      class: `grow-leaf${isNew ? ' appear' : ''}`, style: `transform-origin:${x}px ${y}px`,
    }));
  });

  const [tx, ty] = stemAt(reach);
  if (bloomed) {
    const g = s('g', { class: `grow-bloom${from < 1 ? ' appear' : ''}`, style: `transform-origin:${tx}px ${ty}px` });
    for (let i = 0; i < 6; i++) {
      g.append(s('ellipse', { cx: tx, cy: ty - 11, rx: 7, ry: 11, class: 'grow-petal', transform: `rotate(${i * 60} ${tx} ${ty})` }));
    }
    g.append(s('circle', { cx: tx, cy: ty, r: 5.5, class: 'grow-center' }));
    svg.append(g);
  } else if (reach > 0.55) {
    // a bud that swells as you get closer
    const size = 3 + 4 * ((reach - 0.55) / 0.45);
    svg.append(s('ellipse', { cx: tx, cy: ty - size * 0.6, rx: size * 0.7, ry: size, class: 'grow-bud' }));
  } else {
    svg.append(s('circle', { cx: tx, cy: ty, r: 2.4, class: 'grow-tip' }));
  }

  const caption = !total ? 'Nothing due today. Your seedling is resting ✿'
    : bloomed ? 'In full bloom. Everything’s done ✿'
    : `${done} of ${total} done today`;
  return h('div', { class: `flower-gadget${bloomed ? ' bloomed' : ''}`, title: caption },
    svg,
    h('span', { class: 'fg-cap', text: !total ? 'resting' : bloomed ? 'bloomed ✿' : `${done} / ${total}` }));
}

// ---------------------------------------------------------------- focus timer

const FOCUS_LENGTHS = [15, 25, 45, 60];
const BREAK_LENGTHS = [5, 10];

function focusMinutes(day) {
  return live('focus').filter(f => f.date === day).reduce((a, f) => a + (f.minutes || 0), 0);
}

function focusLeft() {
  if (focus.mode === 'running') return Math.max(0, focus.endAt - Date.now());
  if (focus.mode === 'paused') return focus.remaining;
  if (focus.mode === 'done') return 0;
  if (focus.mode === 'wilted') return focus.remaining || 0;
  return focus.minutes * 60e3;
}

function fmtClock(ms) {
  const sec = Math.ceil(ms / 1000);
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
}

function focusTasks() {
  return openTodos().slice(0, 40);
}

function chime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [[784, 0], [1047, 0.18], [1319, 0.36]].forEach(([f, t]) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, ctx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.6);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + 0.65);
    });
    setTimeout(() => ctx.close(), 1500);
  } catch {}
}

async function focusNotify(text) {
  try {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const reg = 'serviceWorker' in navigator ? await navigator.serviceWorker.getRegistration('./') : null;
    if (reg) reg.showNotification('Dashboard', { body: text, icon: 'icon-192.png', tag: 'focus' });
    else new Notification('Dashboard', { body: text, icon: 'icon-192.png' });
  } catch {}
}

// Strict mode: leaving the dashboard for more than 15 s during a focus session wilts the flower.
const WILT_MS = 15e3;
function focusStrict() { try { return localStorage.getItem('focus.strict') === '1'; } catch { return false; } }
function setFocusStrict(on) { try { localStorage.setItem('focus.strict', on ? '1' : '0'); } catch {} render(); }
function wiltFocus() {
  clearInterval(focus.timer);
  const spent = Math.round((focus.minutes * 60e3 - focusLeft()) / 60e3);
  if (spent >= 1) {
    const t = live('todos').find(x => x.id === focus.taskId);
    S.focus.push(touch({ id: uid(), date: todayStr(), minutes: spent, taskId: t ? t.id : '', title: t ? t.title : '', endedAt: Date.now(), wilted: true }));
    scheduleSave(500);
  }
  focus.remaining = Math.max(0, focus.endAt - Date.now());
  focus.mode = 'wilted';
  document.title = 'Dashboard';
  rerenderSafely();
}

function startFocus(kind, minutes) {
  clearInterval(focus.timer);
  Object.assign(focus, { mode: 'running', kind, minutes, endAt: Date.now() + minutes * 60e3, remaining: 0 });
  if (kind === 'focus') focus.lastFocus = minutes;
  focus.timer = setInterval(focusTick, 500);
  render();
}

function pauseFocus() {
  if (focus.mode !== 'running') return;
  focus.remaining = Math.max(0, focus.endAt - Date.now());
  focus.mode = 'paused';
  clearInterval(focus.timer);
  render();
}

function resumeFocus() {
  if (focus.mode !== 'paused') return;
  focus.endAt = Date.now() + focus.remaining;
  focus.mode = 'running';
  focus.timer = setInterval(focusTick, 500);
  render();
}

function stopFocus(save) {
  clearInterval(focus.timer);
  const spent = Math.round((focus.minutes * 60e3 - focusLeft()) / 60e3);
  if (save && focus.kind === 'focus' && spent >= 1) logFocus(spent);
  Object.assign(focus, { mode: 'idle', kind: 'focus', endAt: 0, remaining: 0 });
  document.title = 'Dashboard';
  render();
}

function logFocus(minutes) {
  const t = live('todos').find(x => x.id === focus.taskId);
  S.focus.push(touch({ id: uid(), date: todayStr(), minutes, taskId: t ? t.id : '', title: t ? t.title : '', endedAt: Date.now() }));
  scheduleSave(500);
}

function focusTick() {
  if (!S) { clearInterval(focus.timer); return; }
  const left = focusLeft();
  if (left <= 0) {
    clearInterval(focus.timer);
    if (focus.kind === 'focus') logFocus(focus.minutes);
    focus.mode = 'done';
    chime();
    focusNotify(focus.kind === 'focus' ? `${focus.minutes} minutes done. Your ${focusBloom(focus.minutes).label} bloomed ✿` : 'Break’s over. Ready for another round?');
    rerenderSafely();
    return;
  }
  // light update without a full re-render
  const time = document.getElementById('focus-time');
  if (time) time.textContent = fmtClock(left);
  const p = 1 - left / (focus.minutes * 60e3);
  const ring = document.getElementById('focus-ring');
  if (ring) ring.setAttribute('stroke-dashoffset', (100 * (1 - p)).toFixed(2));
  const bud = document.getElementById('focus-bud');
  if (bud) bud.style.transform = `scale(${(0.35 + 0.65 * p).toFixed(3)})`;
  const badge = document.getElementById('focus-nav-badge');
  if (badge) badge.textContent = fmtClock(left);
  document.title = `${fmtClock(left)} · ${focus.kind === 'focus' ? 'Focus' : 'Break'}`;
}

// Longer sessions grow bigger, showier flowers.
// [minutes, flower, height in the dial, look]
const FOCUS_FLOWERS = [[60, 'sunflower', 104, 0], [45, 'rose', 92, 12], [25, 'tulip', 78, 10], [0, 'daisy', 64, 2]];
function focusBloom(minutes) {
  const [, kind, height, look] = FOCUS_FLOWERS.find(([m]) => minutes >= m);
  return { kind, height, seed: `focus-${kind}-${look}`, label: SPECIES[kind].label.toLowerCase() };
}

function focusFlower(p, bloomed) {
  const bloom = focusBloom(focus.kind === 'break' ? (focus.lastFocus || 25) : focus.minutes);
  const svg = s('svg', { viewBox: '0 0 200 200', class: `focus-art${bloomed ? ' bloomed' : ''}${focus.mode === 'wilted' ? ' wilted' : ''}`, role: 'img', 'aria-label': `${bloom.label} ${bloomed ? 'in bloom' : 'growing'}` });
  svg.append(s('circle', { cx: 100, cy: 100, r: 88, class: 'focus-track', pathLength: 100 }));
  svg.append(s('circle', {
    id: 'focus-ring', cx: 100, cy: 100, r: 88, class: `focus-ring${focus.kind === 'break' ? ' break' : ''}`, pathLength: 100,
    'stroke-dasharray': 100, 'stroke-dashoffset': (100 * (1 - p)).toFixed(2), transform: 'rotate(-90 100 100)',
  }));
  svg.append(s('ellipse', { cx: 100, cy: 152, rx: 34, ry: 5, class: 'grow-soil' }));
  const full = bloomed || focus.kind === 'break' || focus.mode === 'idle';
  const k = bloom.height / SPECIES[bloom.kind].h;
  const g = s('g', { id: 'focus-bud', class: 'focus-bud', style: `transform-origin:100px 152px;transform:scale(${full ? 1 : (0.35 + 0.65 * p).toFixed(3)})` },
    s('g', { transform: `translate(100 152) scale(${k.toFixed(2)})` }, plant(bloom.kind, bloom.seed)));
  svg.append(g);
  return svg;
}

// Break buddy: during a break, a box-breathing circle (4 s in, hold, out, hold) and one stretch.
const STRETCHES = [
  ['Neck rolls', 'Slowly roll your head in a circle, 5 times each way.'],
  ['Shoulder shrugs', 'Lift your shoulders to your ears, hold 3 s, drop. Repeat 8 times.'],
  ['Wrist stretch', 'Arm out, palm up, gently pull your fingers back for 15 s. Switch hands.'],
  ['Stand and reach', 'Stand up, reach for the ceiling, then fold forward and let your arms hang.'],
  ['Eye break (20-20-20)', 'Look at something about 20 feet away for 20 seconds.'],
  ['Seated twist', 'Sit tall, turn your chest to the right, hold 15 s, then left.'],
  ['Water', 'Drink a glass of water. Your brain is about 75% water ✿'],
  ['Chest opener', 'Clasp your hands behind your back and gently lift, chest forward, 15 s.'],
];
const BREATH = ['Breathe in', 'Hold', 'Breathe out', 'Hold'];
let breathTimer = null;
function breakBuddy() {
  clearInterval(breathTimer);
  const [name, how] = STRETCHES[Math.floor(Date.now() / 3e5) % STRETCHES.length];
  const label = h('span', { class: 'bb-label', text: BREATH[0] });
  const t0 = Date.now();
  breathTimer = setInterval(() => { if (!label.isConnected) { clearInterval(breathTimer); return; } label.textContent = BREATH[Math.floor((Date.now() - t0) / 4000) % 4]; }, 250);
  return h('div', { class: 'bb' },
    h('div', { class: 'bb-circle', 'aria-hidden': 'true' }), label,
    h('p', { class: 'bb-stretch' }, h('strong', { text: `${name}: ` }), how));
}

function renderFocus() {
  const left = focusLeft();
  const total = focus.minutes * 60e3;
  const p = focus.mode === 'idle' ? 0 : 1 - left / total;
  const bloomed = focus.mode === 'done' && focus.kind === 'focus';
  const tasks = focusTasks();

  const select = h('select', {
    'aria-label': 'What are you working on?', disabled: focus.mode === 'running',
    onchange: e => { focus.taskId = e.target.value; },
  }, h('option', { value: '', text: 'Just focusing' }),
  tasks.map(t => h('option', { value: t.id, text: `${t.title}${t.tag ? ` · ${t.tag}` : ''}`, selected: t.id === focus.taskId })));

  const chips = (list, kind) => h('div', { class: 'chips focus-lengths' }, list.map(m => h('button', {
    type: 'button', class: `chip chip-btn${focus.minutes === m && focus.kind === kind ? ' on' : ''}`,
    onclick: () => { focus.minutes = m; focus.kind = kind; render(); },
  }, `${m} min`)));

  let controls;
  if (focus.mode === 'idle') {
    controls = [
      chips(FOCUS_LENGTHS, 'focus'),
      h('p', { class: 'focus-preview', text: `${focus.minutes} min grows a ${focusBloom(focus.minutes).label}` }),
      h('label', { class: 'focus-strict' }, h('input', { type: 'checkbox', checked: focusStrict(), onchange: e => setFocusStrict(e.target.checked) }),
        h('span', null, h('strong', { text: 'Strict mode 🥀' }), h('span', { class: 'muted small', text: ' Leave the dashboard for more than 15 s (other tabs, apps, phone locked) and your flower wilts.' }))),
      h('button', { class: 'btn btn-primary btn-wide', type: 'button', onclick: () => startFocus('focus', focus.kind === 'focus' ? focus.minutes : 25) }, 'Start focusing'),
    ];
  } else if (focus.mode === 'running' || focus.mode === 'paused') {
    controls = [h('div', { class: 'row center-row' },
      focus.mode === 'running'
        ? h('button', { class: 'btn', type: 'button', text: 'Pause', onclick: pauseFocus })
        : h('button', { class: 'btn btn-primary', type: 'button', text: 'Resume', onclick: resumeFocus }),
      h('button', { class: 'btn', type: 'button', text: focus.kind === 'focus' ? 'Stop & save' : 'Skip break', onclick: () => stopFocus(true) }),
      focus.kind === 'focus' ? h('button', { class: 'btn btn-danger', type: 'button', text: 'Discard', onclick: () => stopFocus(false) }) : null)];
  } else if (focus.mode === 'wilted') {
    controls = [
      h('p', { class: 'focus-done wilted', text: `Your ${focusBloom(focus.minutes).label} wilted 🥀 You left for more than 15 seconds.` }),
      h('div', { class: 'row center-row' },
        h('button', { class: 'btn btn-primary', type: 'button', text: 'Try again', onclick: () => startFocus('focus', focus.minutes) }),
        h('button', { class: 'btn', type: 'button', text: 'Done for now', onclick: () => { focus.mode = 'idle'; render(); } })),
    ];
  } else {
    const t = live('todos').find(x => x.id === focus.taskId && !x.done);
    controls = [
      h('p', { class: 'focus-done', text: focus.kind === 'focus' ? `Nice work. Your ${focusBloom(focus.minutes).label} bloomed ✿` : 'Break’s over.' }),
      h('div', { class: 'row center-row' },
        focus.kind === 'focus' ? BREAK_LENGTHS.map(m => h('button', { class: 'btn', type: 'button', text: `${m}-min break`, onclick: () => startFocus('break', m) })) : null,
        h('button', { class: 'btn btn-primary', type: 'button', text: 'Another round', onclick: () => startFocus('focus', focus.kind === 'focus' ? focus.minutes : 25) }),
        h('button', { class: 'btn', type: 'button', text: 'Done for now', onclick: () => { focus.mode = 'idle'; focus.kind = 'focus'; document.title = 'Dashboard'; render(); } })),
      t ? h('button', { class: 'link center-link', type: 'button', text: `Mark “${t.title}” as done`, onclick: () => commit(() => { t.done = true; t.doneAt = Date.now(); touch(t); }) }) : null,
    ];
  }

  const today = todayStr();
  const sessions = live('focus').filter(f => f.date === today).sort((a, b) => b.endedAt - a.endedAt);
  let week = 0;
  for (let i = 0; i < 7; i++) week += focusMinutes(addDays(today, -i));

  return h('div', { class: 'page' },
    h('header', { class: 'page-head' }, h('h1', { text: 'Focus' })),
    h('div', { class: 'grid' },
      h('div', { class: 'col' },
        h('section', { class: 'card focus-card' },
          h('div', { class: 'focus-kind', text: focus.mode === 'wilted' ? 'Wilted' : focus.mode === 'done' ? (focus.kind === 'break' ? 'Break complete' : 'Session complete') : focus.kind === 'break' ? 'On a break' : focus.mode === 'idle' ? 'Ready when you are' : focus.mode === 'paused' ? 'Paused' : 'Focusing' }),
          h('div', { class: 'focus-dial' }, focusFlower(p, bloomed), h('div', { id: 'focus-time', class: 'focus-time', text: fmtClock(left) })),
          focus.kind === 'break' && (focus.mode === 'running' || focus.mode === 'paused') ? breakBuddy() : null,
          focus.mode === 'done' || focus.mode === 'wilted' || focus.kind === 'break' ? null : select,
          ...controls)),
      h('div', { class: 'col col-narrow' },
        card('Today', h('span', { class: 'card-meta', text: `${focusMinutes(today)} min` }),
          sessions.length ? h('ul', { class: 'mini-list' }, sessions.map(f => h('li', null,
            h('span', { text: `${f.wilted ? '🥀 ' : ''}${f.title || 'Focus session'}` }),
            h('span', { class: 'muted small', text: `${f.minutes} min` }))))
            : h('p', { class: 'empty', text: 'No sessions yet today ✿' }),
          h('dl', { class: 'stats' }, h('div', null, h('dt', { text: 'Last 7 days' }), h('dd', { text: `${week} min` })))),
        card('How it works', null, h('ul', { class: 'bullets' },
          h('li', { text: 'Pick a task and a length, then start. Your flower grows as you go and blooms at the end.' }),
          h('li', { text: 'Longer sessions grow bigger flowers: a daisy, a tulip at 25 min, a rose at 45, a sunflower at 60.' }),
          h('li', { text: 'The timer keeps running while you use the rest of the dashboard.' }),
          h('li', { text: 'Your dashboard won’t auto-lock during a session.' }))))));
}

// ---------------------------------------------------------------- forest

function weekStart(day) { return addDays(day, -parse(day).getDay()); }

function forestRange() {
  const today = todayStr();
  if (forestSpan === 'week') {
    const from = addDays(weekStart(today), 7 * forestOffset);
    const to = addDays(from, 7);
    return { from, to, label: `${fmtShort(from)} – ${fmtShort(addDays(to, -1))}` };
  }
  const d = parse(today);
  const first = new Date(d.getFullYear(), d.getMonth() + forestOffset, 1);
  const next = new Date(d.getFullYear(), d.getMonth() + forestOffset + 1, 1);
  return { from: toStr(first), to: toStr(next), label: first.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) };
}

function taskItems(from, to) {
  return live('todos').filter(t => t.done && t.doneAt).map(t => ({ t, date: toStr(new Date(t.doneAt)) }))
    .filter(x => x.date >= from && x.date < to).sort((a, b) => a.t.doneAt - b.t.doneAt).map(({ t, date }) => {
      const kind = plantForTag(t.tag);
      return { kind, seed: `tag:${(t.tag || '').toLowerCase()}`, date, value: 1, tag: t.tag || '',
        title: `${t.title}${t.tag ? ` · ${t.tag}` : ''} · done ${fmtShort(date)}` };
    });
}

function bestDay(items) {
  const per = new Map();
  for (const it of items) per.set(it.date, (per.get(it.date) || 0) + it.value);
  let best = null;
  for (const [d, v] of per) if (!best || v > best[1]) best = [d, v];
  return best;
}

// Which course grew what: one chip per course with its flower.
function courseLegend(items) {
  const groups = new Map();
  for (const it of items) {
    const k = it.tag.toLowerCase();
    if (!groups.has(k)) groups.set(k, { it, n: 0 });
    groups.get(k).n++;
  }
  return h('ul', { class: 'species-row' }, [...groups.values()].sort((a, b) => b.n - a.n).map(({ it, n }) =>
    h('li', { title: `${it.tag || 'Other'}: ${SPECIES[it.kind].label}` }, plantIcon(it.kind, it.seed), h('span', { text: `${it.tag || 'Other'} · ${n}` }))));
}

function renderForest() {
  const { from, to, label } = forestRange();
  const span = forestSpan === 'week' ? 'week' : 'month';
  const items = taskItems(from, to);
  const best = bestDay(items);
  const courses = new Set(items.map(t => t.tag.toLowerCase()).filter(Boolean)).size;
  const seg = (key, text) => h('button', { type: 'button', class: `chip chip-btn${forestSpan === key ? ' on' : ''}`, text,
    onclick: () => { forestSpan = key; forestOffset = 0; render(); } });

  return h('div', { class: 'page' },
    h('header', { class: 'page-head forest-head' }, h('h1', { text: 'Forest' }),
      h('div', { class: 'forest-nav' },
        h('div', { class: 'chips' }, seg('week', 'Week'), seg('month', 'Month')),
        h('div', { class: 'row' },
          iconBtn('left', `Previous ${span}`, () => { forestOffset--; render(); }),
          h('span', { class: 'forest-label', text: label }),
          iconBtn('right', `Next ${span}`, () => { if (forestOffset < 0) { forestOffset++; render(); } }, forestOffset < 0 ? '' : 'is-off')))),
    h('section', { class: 'card forest-card' },
      h('div', { class: 'forest-stage' }, forestPlot(items, `${items.length} flowers this ${span}`)),
      h('div', { class: 'forest-side' },
        h('p', { class: 'forest-count' }, h('strong', { text: String(items.length) }), ` ${items.length === 1 ? 'task' : 'tasks'} finished this ${span}`),
        items.length ? courseLegend(items)
          : h('p', { class: 'species-empty', text: forestOffset ? `Nothing finished this ${span}.` : 'Every task or assignment you finish plants a flower here. Each course grows its own kind ✿' }),
        h('dl', { class: 'stats' },
          h('div', null, h('dt', { text: 'Courses' }), h('dd', { text: String(courses) })),
          h('div', null, h('dt', { text: 'Best day' }), h('dd', { text: best ? `${fmtShort(best[0])} · ${best[1]} done` : '—' }))))));
}

// ---------------------------------------------------------------- internships

// Filled in by Claude each day (paid or stipended roles only). Three are picked
// for today; the full list lives on its own page.
let internFilter = 'open';

const safeUrl = u => (typeof u === 'string' && /^https:\/\//i.test(u) ? u : null);

function internDeadline(it) {
  if (it.deadline) {
    const days = daysBetween(todayStr(), it.deadline);
    if (days < 0) return { text: `Closed ${fmtShort(it.deadline)}`, cls: 'past', days };
    return { text: days === 0 ? 'Due today' : days <= 14 ? `Due in ${days} days · ${fmtShort(it.deadline)}` : `Due ${fmtShort(it.deadline)}`, cls: days <= 14 ? 'soon' : '', days };
  }
  return { text: it.deadlineNote || 'Deadline not posted', cls: '', days: 9999 };
}

function internOpen(it) { return !it.status && internDeadline(it).days >= 0; }

function internsSorted(list) {
  return list.sort((a, b) => internDeadline(a).days - internDeadline(b).days || (a.org || '').localeCompare(b.org || ''));
}

// Today's three: the ones Claude picked for today (kept even after you apply),
// topped up with the soonest open deadlines if fewer than three were picked.
function todaysInterns() {
  const today = todayStr();
  const all = live('internships');
  // Once today's 3 are shown they stay put: marking one Applied counts it instead of swapping it out.
  const doneToday = it => it.status === 'applied' && it.statusAt && new Date(it.statusAt).toLocaleDateString('en-CA') === today;
  const picked = all.filter(it => (it.pick === today || doneToday(it)) && it.status !== 'skipped');
  const rest = internsSorted(all.filter(it => internOpen(it) && !picked.includes(it)));
  const list = [...picked, ...rest].slice(0, 3);
  if (!all.some(it => it.pick === today) && list.length) setTimeout(() => commit(() => list.forEach(it => { if (it.pick !== today) { it.pick = today; touch(it); } })), 0);
  return list;
}

function setInternStatus(it, status) {
  commit(() => { it.status = status; it.statusAt = status ? Date.now() : 0; touch(it); });
}

function internActions(it, compact) {
  const url = safeUrl(it.url);
  if (it.status === 'applied') {
    return h('div', { class: 'intern-actions' }, h('span', { class: 'intern-badge applied', text: 'Applied ✿' }),
      h('button', { class: 'link', type: 'button', text: 'Undo', onclick: () => setInternStatus(it, '') }));
  }
  if (it.status === 'skipped') {
    return h('div', { class: 'intern-actions' }, h('span', { class: 'intern-badge', text: 'Skipped' }),
      h('button', { class: 'link', type: 'button', text: 'Undo', onclick: () => setInternStatus(it, '') }));
  }
  return h('div', { class: 'intern-actions' },
    url ? h('a', { class: 'btn btn-small btn-primary', href: url, target: '_blank', rel: 'noopener noreferrer', text: 'Apply ↗' }) : null,
    h('button', { class: 'btn btn-small', type: 'button', text: 'Applied', onclick: () => setInternStatus(it, 'applied') }),
    h('button', { class: 'btn btn-small btn-quiet', type: 'button', text: compact ? 'Skip' : 'Not for me', onclick: () => setInternStatus(it, 'skipped') }));
}

function internRow(it, compact = false) {
  const dl = internDeadline(it);
  const isNew = it.addedAt && daysBetween(it.addedAt, todayStr()) <= 1;
  return h('li', { class: `intern${it.status ? ` is-${it.status}` : ''}` },
    h('div', { class: 'intern-top' },
      h('span', { class: `intern-type ${it.type === 'research' ? 'research' : 'industry'}`, text: it.type === 'research' ? 'Research' : 'Industry' }),
      isNew && !compact ? h('span', { class: 'intern-new', text: 'New' }) : null,
      h('span', { class: `intern-due ${dl.cls}`, text: dl.text })),
    h('div', { class: 'intern-title', text: it.title }),
    h('div', { class: 'intern-org', text: [it.org, it.location].filter(Boolean).join(' · ') }),
    it.pay ? h('div', { class: 'intern-pay', text: it.pay }) : null,
    !compact && it.why ? h('p', { class: 'intern-why', text: it.why }) : null,
    !compact && it.eligibility ? h('p', { class: 'intern-elig', text: it.eligibility }) : null,
    !compact && it.fields && it.fields.length ? h('div', { class: 'chips' }, it.fields.slice(0, 5).map(f => h('span', { class: 'chip', text: f }))) : null,
    internActions(it, compact));
}

function internsCard() {
  const all = live('internships');
  if (!all.length) return null;
  const picks = todaysInterns();
  const done = picks.filter(it => it.status === 'applied').length;
  return card('Apply today', h('span', { class: 'card-meta', text: `${done} / ${picks.length} done` }),
    picks.length ? h('ul', { class: 'interns compact' }, picks.map(it => internRow(it, true)))
      : h('p', { class: 'empty', text: 'Nothing open right now. New ones land every day ✿' }),
    h('button', { class: 'link center-link', type: 'button', text: `See all ${all.filter(internOpen).length} open internships →`, onclick: () => go('internships') }));
}

function renderInternships() {
  const all = live('internships');
  const filters = [
    ['open', 'Open', it => internOpen(it)],
    ['industry', 'Industry', it => internOpen(it) && it.type !== 'research'],
    ['research', 'Research', it => internOpen(it) && it.type === 'research'],
    ['abroad', 'Abroad', it => internOpen(it) && it.country && it.country !== 'US'],
    ['new', 'New', it => internOpen(it) && it.addedAt && daysBetween(it.addedAt, todayStr()) <= 1],
    ['applied', 'Applied', it => it.status === 'applied'],
    ['skipped', 'Skipped', it => it.status === 'skipped'],
  ];
  const [, , test] = filters.find(f => f[0] === internFilter) || filters[0];
  const shown = internsSorted(all.filter(test));
  const applied = all.filter(it => it.status === 'applied').length;
  const picks = todaysInterns();

  return h('div', { class: 'page' },
    h('header', { class: 'page-head' },
      h('h1', { text: 'Internships' }),
      h('p', { class: 'meta', text: `Paid or stipended roles in data science, biology, biotech and nearby fields. Updated daily. ${applied} applied so far.` })),
    picks.length ? card('Your three for today', null, h('ul', { class: 'interns picks' }, picks.map(it => internRow(it)))) : null,
    h('section', { class: 'card' },
      h('header', { class: 'card-head' }, h('h2', { text: 'If you want to do more' }), h('span', { class: 'card-meta', text: `${shown.length} shown` })),
      h('div', { class: 'chips intern-filters' }, filters.map(([key, label, t]) => h('button', {
        type: 'button', class: `chip chip-btn${internFilter === key ? ' on' : ''}`,
        onclick: () => { internFilter = key; render(); },
      }, `${label} · ${all.filter(t).length}`))),
      shown.length ? h('ul', { class: 'interns' }, shown.map(it => internRow(it)))
        : h('p', { class: 'empty', text: all.length ? 'Nothing here.' : 'Your first batch is on its way ✿' })));
}

// ---------------------------------------------------------------- quick add from anywhere

let quickOpen = false;

function openQuickAdd() {
  if (!S || quickOpen) return;
  quickOpen = true;
  const input = h('input', { placeholder: 'Add a task… e.g. “Lab report thu 11:59pm #bio”', 'aria-label': 'Quick add task', autocomplete: 'off' });
  const preview = h('div', { class: 'quick-preview' });
  const close = () => { quickOpen = false; overlay.remove(); };
  const update = () => {
    const q = parseQuick(input.value);
    const bits = [];
    if (q.due) bits.push(fmtShort(q.due) + (daysBetween(todayStr(), q.due) < 7 ? ` (${fmtWeekday(q.due)})` : ''));
    if (q.time) bits.push(fmtTime(q.time));
    if (q.tag) bits.push(`#${q.tag}`);
    preview.textContent = bits.length ? `✿ ${bits.join(' · ')}` : '';
  };
  input.addEventListener('input', update);
  const form = h('form', {
    class: 'quick-box',
    onsubmit: ev => {
      ev.preventDefault();
      const text = input.value.trim();
      if (!text) return close();
      const q = parseQuick(text);
      commit(() => { S.todos.push(touch({ id: uid(), title: q.title.slice(0, 200), due: q.due, time: q.time, tag: q.tag, done: false, createdAt: Date.now() })); });
      input.value = ''; update();
      hint.textContent = `Added “${q.title}”. Add another, or press Esc.`;
    },
  }, input, preview);
  const hint = h('div', { class: 'quick-hint', text: 'Enter to add · Esc to close' });
  const overlay = h('div', { class: 'quick-overlay', onclick: e => { if (e.target === overlay) close(); } },
    h('div', { class: 'quick-panel', role: 'dialog', 'aria-label': 'Quick add' }, form, hint));
  overlay.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  document.body.append(overlay);
  input.focus();
}

addEventListener('keydown', e => {
  if (!S) return;
  const a = document.activeElement;
  const typing = a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.tagName === 'SELECT' || a.isContentEditable);
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openQuickAdd(); }
  else if (e.key === '/' && !typing) { e.preventDefault(); openQuickAdd(); }
});

// ---------------------------------------------------------------- countdowns

const EXAM_RE = /\b(exams?|midterms?|finals?|final exam)\b/i;
// Things that mention an exam but aren't one ("Exam 2 practice lab", "exam conflicts survey").
const NOT_EXAM_RE = /\b(survey|practice|review|conflicts?|prep|study guide|lab|grades?|scores?|wrapper|corrections?)\b/i;
const isExam = title => EXAM_RE.test(title) && !NOT_EXAM_RE.test(title);

function upcomingExams() {
  const today = todayStr(), last = addDays(today, 45);
  const seen = new Set();
  const out = [];
  const add = (title, date, tag) => {
    // same course + same day = the same exam (an event and a Canvas item often both exist)
    const key = tag ? `${tag.toLowerCase()}|${date}` : `${title.toLowerCase()}|${date}`;
    const prev = out.find(x => (x.tag ? `${x.tag.toLowerCase()}|${x.date}` : `${x.title.toLowerCase()}|${x.date}`) === key);
    if (prev) { if (title.length > prev.title.length) prev.title = title; return; }
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ title, date, tag, days: daysBetween(today, date) });
  };
  for (const e of live('events')) if (e.date >= today && e.date <= last && isExam(e.title)) add(e.title, e.date, e.tag);
  for (const t of live('todos')) if (!t.done && t.due && t.due >= today && t.due <= last && isExam(t.title)) add(t.title, t.due, t.tag);
  return out.sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4);
}

function countdownCard() {
  const exams = upcomingExams();
  if (!exams.length) return null;
  return card('Countdowns', null, h('ul', { class: 'countdowns' }, exams.map(x => h('li', { class: tagColor(x.tag) },
    h('div', { class: `cd-num${x.days <= 3 ? ' soon' : ''}` },
      h('strong', { text: x.days === 0 ? '✿' : String(x.days) }),
      h('span', { text: x.days === 0 ? 'today' : x.days === 1 ? 'day' : 'days' })),
    h('div', { class: 'cd-body' },
      h('div', { class: 'cd-title', text: x.title }),
      h('div', { class: 'cd-date' }, x.tag ? h('span', { class: 'asg-course', text: x.tag }) : null, fmtLong(x.date)))))));
}

// Study plan: the next 4 days, two review blocks a day, picked by how close each exam is
// (closest first; every third day the second block goes to the exam after that so nothing is
// left for the last minute). Ticks are per device.
const PLAN_VIEW = { COP3502C: ['prog', 'Prog 1'], CHM2210: ['orgo', 'Orgo'], BSC2011: ['bio', 'Biology'] };
function planLoad() { try { return JSON.parse(localStorage.getItem('plan.done') || '{}'); } catch { return {}; } }
function planTick(key) { const d = planLoad(); if (d[key]) delete d[key]; else d[key] = 1; try { localStorage.setItem('plan.done', JSON.stringify(d)); } catch {} render(); }

function studyPlan(nDays = 4) {
  const today = todayStr(), last = addDays(today, 60);
  const exams = [];
  const seen = new Set();
  for (const e of live('events')) {
    if (e.date < today || e.date > last || !isExam(e.title)) continue;
    const k = `${e.title.toLowerCase()}|${e.date}`;
    if (!seen.has(k)) { seen.add(k); exams.push({ title: e.title, date: e.date, tag: e.tag || '' }); }
  }
  exams.sort((a, b) => a.date.localeCompare(b.date));
  const days = [];
  for (let i = 0; i < nDays; i++) {
    const d = addDays(today, i);
    const ahead = exams.filter(x => x.date >= d).map(x => ({ ...x, left: daysBetween(d, x.date) }));
    const byTag = [];
    for (const x of ahead) if (!byTag.some(y => y.tag === x.tag)) byTag.push(x); // nearest exam per course
    const blocks = [];
    if (byTag[0]) blocks.push(byTag[0]);
    const second = i % 3 === 2 && byTag[2] ? byTag[2] : byTag[1];
    if (second) blocks.push(second);
    days.push({ date: d, blocks: blocks.map(x => ({ ...x, what: x.left === 0 ? 'Exam day: light review, then go 🍀' : x.left <= 2 ? 'Mock exam, then redo every miss' : x.left <= 7 ? 'Practice problems + weak topics' : 'Flashcards + one guided lecture' })) });
  }
  return days;
}

function planCard() {
  const days = studyPlan();
  if (!days.some(d => d.blocks.length)) return null;
  const done = planLoad();
  return card('Study plan', h('span', { class: 'card-meta', text: 'next 4 days' }), h('ol', { class: 'plan' }, days.map((d, i) => h('li', { class: `plan-day${i === 0 ? ' today' : ''}` },
    h('div', { class: 'plan-date', text: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : fmtWeekday(d.date) }),
    h('div', { class: 'plan-blocks' }, d.blocks.length ? d.blocks.map(b => {
      const key = `${d.date}|${b.tag}`;
      const v = PLAN_VIEW[b.tag];
      return h('div', { class: `plan-block ${tagColor(b.tag)}${done[key] ? ' done' : ''}` },
        h('button', { type: 'button', class: 'plan-check', 'aria-label': done[key] ? 'Mark not done' : 'Mark done', text: done[key] ? '✓' : '', onclick: () => planTick(key) }),
        h('div', { class: 'plan-body' },
          h('div', { class: 'plan-title' }, h('strong', { text: b.tag || b.title }), h('span', { class: 'muted small', text: ` · ${b.left === 0 ? 'exam today' : `${b.left} day${b.left === 1 ? '' : 's'} to go`}` })),
          h('div', { class: 'small', text: b.what })),
        v ? h('button', { type: 'button', class: 'link small plan-go', text: `${v[1]} →`, onclick: () => go(v[0]) }) : null);
    }) : h('span', { class: 'muted small', text: 'Free day ✿' }))))));
}

// Study corner: the daily study cards share one tabbed card so Today stays calm.
const CORNER = [['plan', '📅 Plan', () => planCard()], ['boss', '👾 Boss', () => bossCard(ORGO_CTX)], ['pt', '✍️ Palavras', () => palavrasCard()], ['jr', '📓 Journal', () => journalCard()], ['mb', '🦠 Microbe', () => microbeCard(ORGO_CTX)]];
function studyCorner() {
  let tab = 'plan';
  try { tab = localStorage.getItem('corner.tab') || 'plan'; } catch {}
  const items = CORNER.map(([id, label, make]) => ({ id, label, el: make() })).filter(x => x.el);
  if (!items.length) return null;
  const cur = items.find(x => x.id === tab) || items[0];
  const head = cur.el.querySelector(':scope > .card-head');
  const meta = head ? head.querySelector('.card-meta') : null;
  if (head) head.remove();
  const body = h('div', { class: `corner-body ${cur.el.className.replace(/\bcard\b/, '')}`, lang: cur.el.getAttribute('lang') || null }, ...cur.el.childNodes);
  return h('section', { class: 'card corner' },
    h('div', { class: 'corner-tabs', role: 'tablist' }, items.map(x => h('button', {
      type: 'button', role: 'tab', class: `corner-tab${x === cur ? ' on' : ''}`, 'aria-selected': String(x === cur),
      onclick: () => { try { localStorage.setItem('corner.tab', x.id); } catch {} render(); },
    }, x.label)), meta),
    body);
}

// ---------------------------------------------------------------- calories

const MACROS = [
  { key: 'cal', label: 'Calories', unit: 'cal' },
  { key: 'protein', label: 'Protein', unit: 'g' },
  { key: 'carbs', label: 'Carbs', unit: 'g' },
  { key: 'fat', label: 'Fat', unit: 'g' },
];
// Tracked and logged like the macros, but shown as bars instead of rings.
// Sugar is a daily limit, fiber a daily target.
const EXTRAS = [
  { key: 'sugar', label: 'Sugar', unit: 'g', limit: true },
  { key: 'fiber', label: 'Fiber', unit: 'g' },
];
const NUTRIENTS = [...MACROS, ...EXTRAS];
const macroLine = f => `P ${Math.round(f.protein || 0)} · C ${Math.round(f.carbs || 0)} · F ${Math.round(f.fat || 0)} · Sugar ${Math.round(f.sugar || 0)} · Fiber ${Math.round(f.fiber || 0)}`;

function totalsFor(day) {
  const t = Object.fromEntries(NUTRIENTS.map(m => [m.key, 0]));
  for (const f of live('food')) if (f.date === day) for (const m of NUTRIENTS) t[m.key] += Number(f[m.key]) || 0;
  return t;
}

function rings(totals, size = 132) {
  const g = S.settings.goals;
  const svg = s('svg', { viewBox: '0 0 132 132', width: size, height: size, class: 'rings', role: 'img', 'aria-label': 'Progress toward today’s goals' });
  MACROS.forEach((m, i) => {
    const r = 58 - i * 12;
    const c = 2 * Math.PI * r;
    const pct = Math.min(1, g[m.key] ? totals[m.key] / g[m.key] : 0);
    svg.append(s('circle', { cx: 66, cy: 66, r, class: 'ring-track' }));
    // nothing eaten yet: skip the arc, otherwise its rounded cap shows as a dot
    if (pct > 0) svg.append(s('circle', { cx: 66, cy: 66, r, class: `ring ring-${m.key}`, 'stroke-dasharray': `${c * pct} ${c}`, transform: 'rotate(-90 66 66)' }));
  });
  return svg;
}

function legend(totals, compact = false) {
  const g = S.settings.goals;
  return h('ul', { class: 'legend' }, MACROS.map(m => h('li', null,
    h('span', { class: `dot dot-${m.key}` }),
    h('span', { class: 'legend-label', text: m.label }),
    h('span', { class: 'legend-val' }, h('strong', { text: Math.round(totals[m.key]).toLocaleString() }),
      ` / ${Number(g[m.key]).toLocaleString()}${m.unit === 'g' ? ' g' : ''}`))),
    compact ? null : EXTRAS.map(m => {
      const goal = Number(g[m.key]) || 0;
      const v = totals[m.key] || 0;
      const over = m.limit && goal && v > goal;
      const bar = h('span', { class: 'extra-bar' }, h('span', { class: `extra-fill extra-${m.key}${over ? ' over' : ''}`, style: `width:${goal ? Math.min(100, (v / goal) * 100) : 0}%` }));
      return h('li', { class: 'legend-extra' },
        h('span', { class: 'legend-label', text: m.limit ? `${m.label} (limit)` : m.label }),
        bar,
        h('span', { class: `legend-val${over ? ' over' : ''}` }, h('strong', { text: Math.round(v).toLocaleString() }), ` / ${goal.toLocaleString()} g`));
    }));
}

function avgNutrient(key, endDay, days = 7) {
  let sum = 0, n = 0;
  for (let i = 0; i < days; i++) {
    const d = addDays(endDay, -i);
    if (live('food').some(f => f.date === d)) { sum += totalsFor(d)[key]; n++; }
  }
  return n ? Math.round(sum / n) : null;
}

function avgCalories(endDay, days = 7) {
  let sum = 0, n = 0;
  for (let i = 0; i < days; i++) {
    const d = addDays(endDay, -i);
    if (live('food').some(f => f.date === d)) { sum += totalsFor(d).cal; n++; }
  }
  return n ? Math.round(sum / n) : null;
}

function weightStats() {
  const w = live('weight').sort((a, b) => a.date.localeCompare(b.date));
  if (!w.length) return null;
  const today = todayStr();
  const avg = (from, to) => {
    const xs = w.filter(x => x.date > from && x.date <= to).map(x => Number(x.lbs));
    return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
  };
  const thisWk = avg(addDays(today, -7), today);
  const lastWk = avg(addDays(today, -14), addDays(today, -7));
  return { latest: w[w.length - 1], thisWk, lastWk, series: w.filter(x => x.date > addDays(today, -60)) };
}

function caloriesMini() {
  const t = totalsFor(todayStr());
  return card('Calories', h('a', { href: '#calories', class: 'link', text: 'Log →', onclick: e => { e.preventDefault(); calDay = todayStr(); go('calories'); } }),
    h('div', { class: 'rings-row' }, rings(t, 84), legend(t, true)));
}

function weightText(ws) {
  const base = ws.thisWk !== null ? `${ws.thisWk.toFixed(1)} lb avg` : `${Number(ws.latest.lbs).toFixed(1)} lb`;
  if (ws.thisWk === null || ws.lastWk === null) return base;
  const d = ws.thisWk - ws.lastWk;
  return `${base} · ${d >= 0 ? '+' : '−'}${Math.abs(d).toFixed(1)} vs last wk`;
}

function recentFoods() {
  const since = addDays(todayStr(), -30);
  const byName = new Map();
  for (const f of live('food')) {
    if (f.date < since) continue;
    const k = f.name.toLowerCase();
    const prev = byName.get(k);
    byName.set(k, { f: !prev || f.updatedAt > prev.f.updatedAt ? f : prev.f, n: (prev ? prev.n : 0) + 1 });
  }
  return [...byName.values()].sort((a, b) => b.n - a.n).slice(0, 10).map(x => x.f);
}

function addFood(src, day) {
  S.food.push(touch({
    id: uid(), date: day, name: src.name,
    ...Object.fromEntries(NUTRIENTS.map(m => [m.key, Number(src[m.key]) || 0])),
  }));
}

function renderCalories() {
  const day = calDay;
  const t = totalsFor(day);
  const entries = live('food').filter(f => f.date === day).sort((a, b) => a.updatedAt - b.updatedAt);
  const recents = recentFoods();

  const name = h('input', { id: 'food-name', placeholder: 'Food', list: 'foods', required: true, autocomplete: 'off', 'aria-label': 'Food' });
  const nums = Object.fromEntries(NUTRIENTS.map(m => [m.key, h('input', {
    type: 'number', min: '0', step: 'any', inputmode: 'decimal', placeholder: m.key === 'cal' ? 'cal' : `${m.label.toLowerCase()} g`, 'aria-label': m.label,
  })]));
  name.addEventListener('change', () => {
    const match = recents.find(f => f.name.toLowerCase() === name.value.trim().toLowerCase());
    if (match) NUTRIENTS.forEach(m => { if (!nums[m.key].value) nums[m.key].value = match[m.key] || ''; });
  });
  const form = h('form', {
    class: 'food-form',
    onsubmit: ev => {
      ev.preventDefault();
      if (!name.value.trim()) return;
      commit(() => {
        addFood({ name: name.value.trim(), ...Object.fromEntries(NUTRIENTS.map(m => [m.key, nums[m.key].value])) }, day);
        focusAfter = 'food-name';
      });
    },
  }, name, h('div', { class: 'row macros' }, MACROS.map(m => nums[m.key])), h('div', { class: 'row macros' }, EXTRAS.map(m => nums[m.key])),
  h('button', { class: 'btn btn-primary', type: 'submit', text: 'Log food' }),
  h('datalist', { id: 'foods' }, recents.map(f => h('option', { value: f.name }))));

  const isToday = day === todayStr();
  const nav = h('div', { class: 'day-nav' },
    iconBtn('left', 'Previous day', () => { calDay = addDays(day, -1); render(); }),
    h('span', { class: 'day-label', text: isToday ? `Today · ${fmtShort(day)}` : fmtLong(day) }),
    iconBtn('right', 'Next day', () => { calDay = addDays(day, 1); render(); }),
    isToday ? null : h('button', { class: 'btn btn-small', type: 'button', text: 'Today', onclick: () => { calDay = todayStr(); render(); } }));

  const ws = weightStats();
  const lbs = h('input', { type: 'number', min: '0', step: '0.1', inputmode: 'decimal', placeholder: 'lb', 'aria-label': 'Weight in pounds', required: true });
  const weightForm = h('form', {
    class: 'add-row',
    onsubmit: ev => {
      ev.preventDefault();
      const v = Number(lbs.value);
      if (!v) return;
      commit(() => {
        const existing = live('weight').find(w => w.date === day);
        if (existing) { existing.lbs = v; touch(existing); }
        else S.weight.push(touch({ id: uid(), date: day, lbs: v }));
      });
    },
  }, lbs, h('button', { class: 'btn btn-primary', type: 'submit', text: `Log weight${isToday ? '' : ` for ${fmtShort(day)}`}` }));

  const g = S.settings.goals;
  const left = Math.round(g.cal - t.cal);

  return h('div', { class: 'page' },
    h('header', { class: 'page-head' }, h('h1', { text: 'Calories' }), nav),
    h('div', { class: 'grid' },
      h('div', { class: 'col' },
        mealCard(day),
        chatFoodCard(day),
        card('Log', null, form,
          recents.length ? h('div', { class: 'quick' },
            h('div', { class: 'subhead', text: 'Quick add' }),
            h('div', { class: 'chips' }, recents.map(f => h('button', {
              type: 'button', class: 'chip chip-btn', title: `${f.cal} cal · ${macroLine(f)}`,
              onclick: () => commit(() => addFood(f, day)),
            }, icon('plus', 'icon icon-xs'), f.name)))) : null),
        card(isToday ? 'Eaten today' : `Eaten ${fmtShort(day)}`, h('span', { class: 'card-meta', text: `${Math.round(t.cal).toLocaleString()} cal` }),
          entries.length ? h('ul', { class: 'food-list' }, entries.map(f => h('li', null,
            h('span', { class: 'food-name', text: f.name }),
            h('span', { class: 'food-macros muted small', text: macroLine(f) }),
            h('span', { class: 'food-cal', text: `${Number(f.cal).toLocaleString()}` }),
            iconBtn('x', 'Remove', () => commit(() => { touch(f).deleted = true; }), 'row-action'))))
            : h('p', { class: 'empty', text: 'Nothing logged yet.' }))),
      h('div', { class: 'col col-narrow' },
        card('Progress', null,
          h('div', { class: 'rings-big' }, rings(t, 168)),
          legend(t),
          h('p', { class: 'muted small center', text: left >= 0 ? `${left.toLocaleString()} cal left` : `${(-left).toLocaleString()} cal over` })),
        waterCard(day),
        card('Weight', null, weightForm,
          ws ? h('dl', { class: 'stats' },
            h('div', null, h('dt', { text: 'Latest' }), h('dd', { text: `${Number(ws.latest.lbs).toFixed(1)} lb · ${fmtShort(ws.latest.date)}` })),
            h('div', null, h('dt', { text: 'This week' }), h('dd', { text: weightText(ws) }))) : h('p', { class: 'empty', text: 'No weigh-ins yet.' }),
          ws && ws.series.length > 1 ? sparkline(ws.series) : null),
        card('Averages', null, h('dl', { class: 'stats' },
          h('div', null, h('dt', { text: 'Last 7 days' }), h('dd', { text: fmtAvg(avgCalories(todayStr(), 7)) })),
          h('div', null, h('dt', { text: 'Last 30 days' }), h('dd', { text: fmtAvg(avgCalories(todayStr(), 30)) })),
          h('div', null, h('dt', { text: 'Sugar, last 7 days' }), h('dd', { text: fmtGrams(avgNutrient('sugar', todayStr(), 7)) })),
          h('div', null, h('dt', { text: 'Fiber, last 7 days' }), h('dd', { text: fmtGrams(avgNutrient('fiber', todayStr(), 7)) })))))));
}

function mealCard(day) {
  const fileInput = h('input', {
    type: 'file', accept: 'image/*', capture: 'environment', class: 'visually-hidden', id: 'meal-file',
    onchange: async e => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      meal = { status: 'ready', photo: '', note: '', result: null, error: '' };
      try { meal.photo = await shrinkPhoto(file); } catch { meal = { ...meal, status: 'error', error: 'Couldn’t read that photo.' }; }
      render();
    },
  });
  const pick = (label, cls = 'btn btn-primary') => h('label', {
    for: 'meal-file', class: cls, role: 'button', tabindex: '0',
    onkeydown: e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); } },
  }, icon('camera'), label);
  const reset = () => { meal = { status: 'idle', photo: '', note: '', result: null, error: '' }; render(); };

  if (!S.push.dashKey) {
    return card('Snap a meal', null, h('p', { class: 'muted small', text: 'Add your helper key in Settings → Notifications to turn this on.' }));
  }
  if (meal.status === 'idle') {
    return card('Snap a meal', null, fileInput,
      h('p', { class: 'muted small', text: 'Take or pick a photo to get an estimate of calories and macros. You check it before anything is logged.' }),
      pick('Take a photo'));
  }

  const preview = meal.photo ? h('img', { src: meal.photo, alt: 'Your meal', class: 'meal-photo' }) : null;
  if (meal.status !== 'review') {
    const note = h('input', { placeholder: 'Anything to know? e.g. “large”, “no cheese” (optional)', value: meal.note, 'aria-label': 'Note about the meal', oninput: e => { meal.note = e.target.value; } });
    const go = h('button', { class: 'btn btn-primary', type: 'submit', disabled: meal.status === 'loading' || !meal.photo }, meal.status === 'loading' ? 'Looking at your meal…' : 'Estimate');
    return card('Snap a meal', null, fileInput,
      h('div', { class: 'meal-row' }, preview,
        h('form', {
          class: 'stack meal-side',
          onsubmit: async ev => {
            ev.preventDefault();
            meal.status = 'loading'; meal.error = ''; render();
            try {
              meal.result = await estimateMeal(S.push.dashKey, meal.photo, meal.note);
              if (meal.result.is_food === false || !meal.result.items || !meal.result.items.length) {
                meal.status = 'error'; meal.error = 'That doesn’t look like food. Try another photo.';
              } else meal.status = 'review';
            } catch (e) { meal.status = 'error'; meal.error = e.message; }
            render();
          },
        }, note,
        h('div', { class: 'row' }, go, pick('Retake', 'btn'), h('button', { class: 'btn', type: 'button', text: 'Cancel', onclick: reset })),
        meal.error ? h('p', { class: 'form-error', role: 'alert', text: meal.error }) : null)));
  }

  const r = meal.result;
  const sum = k => Math.round(r.items.reduce((a, i) => a + (Number(i[k]) || 0), 0));
  const name = h('input', { value: r.name, 'aria-label': 'Meal name' });
  const nums = Object.fromEntries(NUTRIENTS.map(m => [m.key, h('input', { type: 'number', min: '0', step: 'any', inputmode: 'decimal', value: sum(m.key), 'aria-label': m.label })]));
  return card('Snap a meal', h('span', { class: 'card-meta', text: 'Check & log' }), fileInput,
    h('div', { class: 'meal-row' }, preview,
      h('div', { class: 'meal-side' },
        h('ul', { class: 'meal-items' }, r.items.map(i => h('li', null,
          h('span', null, h('strong', { text: i.name }), h('span', { class: 'muted small', text: ` · ${i.portion}` })),
          h('span', { class: 'muted small', text: `${Math.round(i.cal)} cal · ${macroLine(i)}` })))),
        r.notes ? h('p', { class: 'muted small', text: r.notes }) : null)),
    h('form', {
      class: 'food-form',
      onsubmit: ev => {
        ev.preventDefault();
        commit(() => {
          addFood({ name: name.value.trim() || r.name, ...Object.fromEntries(NUTRIENTS.map(m => [m.key, nums[m.key].value])) }, day);
          meal = { status: 'idle', photo: '', note: '', result: null, error: '' };
        });
      },
    }, name,
    h('div', { class: 'row macros' }, MACROS.map(m => h('label', { class: 'mini-label' }, h('span', { text: m.key === 'cal' ? 'cal' : `${m.label.toLowerCase()} g` }), nums[m.key]))),
    h('div', { class: 'row macros' }, EXTRAS.map(m => h('label', { class: 'mini-label' }, h('span', { text: `${m.label.toLowerCase()} g` }), nums[m.key]))),
    h('div', { class: 'row' },
      h('button', { class: 'btn btn-primary', type: 'submit', text: `Log it${day === todayStr() ? '' : ` for ${fmtShort(day)}`}` }),
      h('button', { class: 'btn', type: 'button', text: 'Discard', onclick: reset }))),
    h('p', { class: 'muted small', text: 'Photo estimates can be off by 20% or more. Adjust the numbers if you know better.' }));
}

// Water: glasses per day, kept on that day's record.
function waterFor(day) {
  const rec = live('days').find(d => d.date === day);
  return rec && rec.water ? rec.water : 0;
}

function setWater(day, n) {
  commit(() => {
    const id = `day-${day}`;
    let rec = S.days.find(d => d.id === id);
    if (!rec) { rec = { id, date: day }; S.days.push(rec); }
    rec.water = Math.max(0, Math.min(16, n));
    rec.deleted = false;
    touch(rec);
  });
}

function chatFoodCard(day) {
  const box = h('textarea', { class: 'chat-paste', rows: 3, 'aria-label': 'Paste a chat reply', placeholder: 'Paste the chat’s reply here, e.g.\nChicken burrito bowl | 650 | 45 | 70 | 18 | 5 | 8' });
  const status = h('p', { class: 'small', role: 'status' });
  const copyBtn = h('button', { class: 'btn btn-small', type: 'button', onclick: async () => {
    try { await navigator.clipboard.writeText(CHAT_PROMPT); copyBtn.textContent = 'Copied ✿'; }
    catch { status.textContent = CHAT_PROMPT; status.className = 'small muted'; }
    setTimeout(() => { copyBtn.textContent = 'Copy prompt'; }, 2000);
  } }, 'Copy prompt');
  const form = h('form', {
    class: 'stack',
    onsubmit: ev => {
      ev.preventDefault();
      const foods = parseFoodText(box.value);
      if (!foods.length) {
        status.textContent = 'Couldn’t find any foods with calories in that. Use the copied prompt so the reply comes back one food per line.';
        status.className = 'small form-error';
        return;
      }
      commit(() => { foods.forEach(f => addFood(f, day)); });
    },
  }, box, h('div', { class: 'row' }, h('button', { class: 'btn btn-primary', type: 'submit', text: `Add to ${day === todayStr() ? 'today' : fmtShort(day)}` }), copyBtn), status);
  return card('From a chat', inboxState.addedFood ? h('span', { class: 'card-meta', text: `${inboxState.addedFood} from inbox` }) : null,
    h('p', { class: 'muted small', text: 'Free option: send a meal photo to any chat assistant with the copied prompt, then paste its reply here.' }),
    form);
}

function waterCard(day) {
  const goal = Number(S.settings.goals.water) || 8;
  const n = waterFor(day);
  const drops = [];
  for (let i = 0; i < Math.max(goal, n); i++) {
    const full = i < n;
    const svg = s('svg', { viewBox: '0 0 24 30', class: `drop${full ? ' full' : ''}`, 'aria-hidden': 'true' });
    svg.append(s('path', { d: 'M12 2C9 8 4 13 4 19a8 8 0 0 0 16 0c0-6-5-11-8-17z' }));
    drops.push(h('button', {
      type: 'button', class: 'drop-btn', 'aria-label': full ? `Remove glass ${i + 1}` : `Add glass ${i + 1}`,
      onclick: () => setWater(day, i + 1 === n ? i : i + 1),
    }, svg));
  }
  return card('Water', h('span', { class: 'card-meta', text: `${n} / ${goal} glasses` }),
    h('div', { class: 'drops' }, drops),
    h('p', { class: 'muted small', text: n >= goal ? 'Hydrated ✿' : 'Tap a drop to log a glass.' }));
}

function fmtGrams(v) { return v === null ? '—' : `${v} g/day`; }

function fmtAvg(v) { return v === null ? '—' : `${v.toLocaleString()} cal/day`; }

function sparkline(series) {
  const W = 260, H = 56, P = 4;
  const ys = series.map(x => Number(x.lbs));
  const min = Math.min(...ys), max = Math.max(...ys), span = max - min || 1;
  const t0 = parse(series[0].date).getTime(), t1 = parse(series[series.length - 1].date).getTime(), tspan = t1 - t0 || 1;
  const pts = series.map(x => [P + ((parse(x.date).getTime() - t0) / tspan) * (W - 2 * P), P + (1 - (Number(x.lbs) - min) / span) * (H - 2 * P)]);
  const last = pts[pts.length - 1];
  return s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'spark', role: 'img', 'aria-label': `Weight trend from ${min.toFixed(1)} to ${max.toFixed(1)} lb` },
    s('polyline', { points: pts.map(p => p.join(',')).join(' '), class: 'spark-line' }),
    s('circle', { cx: last[0], cy: last[1], r: 3, class: 'spark-dot' }));
}

// ---------------------------------------------------------------- notes

function noteTitle(n) {
  return (n.title || '').trim() || (n.body || '').trim().split('\n')[0].slice(0, 60) || 'Untitled';
}

function renderNotes() {
  const notes = live('notes').filter(n => n.kind !== 'bioq' && n.kind !== 'journal').sort((a, b) => b.updatedAt - a.updatedAt);
  if (!notes.find(n => n.id === activeNoteId)) activeNoteId = notes[0] ? notes[0].id : null;
  const active = notes.find(n => n.id === activeNoteId);

  const listEl = h('ul', { class: 'note-list' });
  const fillList = (filter = '') => {
    const q = filter.toLowerCase();
    listEl.replaceChildren(...live('notes').filter(n => n.kind !== 'bioq' && n.kind !== 'journal').sort((a, b) => b.updatedAt - a.updatedAt)
      .filter(n => !q || `${n.title}\n${n.body}`.toLowerCase().includes(q))
      .map(n => h('li', null, h('button', {
        type: 'button', class: `note-item${n.id === activeNoteId ? ' active' : ''}`,
        onclick: () => { activeNoteId = n.id; render(); },
      }, h('span', { class: 'note-item-title', text: noteTitle(n) }), h('span', { class: 'muted small', text: ago(n.updatedAt) })))));
  };
  fillList();
  const search = h('input', { type: 'search', placeholder: 'Search notes', 'aria-label': 'Search notes', oninput: e => fillList(e.target.value) });

  const newNote = () => commit(() => {
    const n = touch({ id: uid(), title: '', body: '' });
    S.notes.push(n); activeNoteId = n.id; focusAfter = 'note-title';
  });

  let editor;
  if (active) {
    const onEdit = () => { touch(active); fillList(search.value); scheduleSave(1500); };
    editor = h('div', { class: 'note-editor' },
      h('div', { class: 'row' },
        h('input', { id: 'note-title', class: 'note-title', value: active.title, placeholder: 'Title', 'aria-label': 'Note title', oninput: e => { active.title = e.target.value; onEdit(); } }),
        h('button', { class: 'btn btn-danger btn-small', type: 'button', text: 'Delete', onclick: () => { if (confirm('Delete this note?')) commit(() => { touch(active).deleted = true; activeNoteId = null; }); } })),
      h('textarea', { class: 'note-body', placeholder: 'Write anything…', 'aria-label': 'Note', oninput: e => { active.body = e.target.value; onEdit(); } }, active.body));
  } else {
    editor = h('div', { class: 'note-editor empty-state' }, h('p', { class: 'muted', text: 'No note selected.' }),
      h('button', { class: 'btn btn-primary', type: 'button', onclick: newNote }, icon('plus'), 'New note'));
  }

  return h('div', { class: 'page' },
    h('header', { class: 'page-head row-between' }, h('h1', { text: 'Quick Notes' }),
      h('button', { class: 'btn btn-primary', type: 'button', onclick: newNote }, icon('plus'), 'New note')),
    h('div', { class: 'notes-layout' },
      h('section', { class: 'card note-side' }, search, listEl),
      h('section', { class: 'card note-main' }, editor)));
}

// ---------------------------------------------------------------- settings

function renderSettings() {
  const g = S.settings;
  const msg = (el, text, ok) => { el.textContent = text; el.className = ok ? 'form-ok' : 'form-error'; };

  // Profile
  const name = h('input', { value: g.name, placeholder: 'Your name', 'aria-label': 'Name' });
  const profile = card('Profile', null, h('form', {
    class: 'add-row', onsubmit: ev => { ev.preventDefault(); commit(() => { g.name = name.value.trim(); touch(g); }); },
  }, name, h('button', { class: 'btn', type: 'submit', text: 'Save' })));

  // GitHub sync
  const ghMsg = h('p', { role: 'status' });
  let ghBody;
  if (S.github.token) {
    ghBody = [
      h('p', null, 'Connected. Every change is encrypted on this device, then saved to ',
        h('code', { text: `${REPO.repo}/${REPO.path}` }), '. Open this page on any device and unlock with the same passphrase.'),
      h('div', { class: 'row' },
        h('button', { class: 'btn', type: 'button', onclick: () => doSave() }, icon('refresh'), 'Sync now'),
        h('button', { class: 'btn btn-danger', type: 'button', text: 'Disconnect', onclick: () => {
          if (confirm('Stop syncing? Your data stays on GitHub (encrypted) and on this device.')) commit(() => { S.github = { token: '', updatedAt: Date.now() }; });
        } })),
      ghMsg,
    ];
  } else {
    const token = h('input', { type: 'password', placeholder: 'github_pat_…', autocomplete: 'off', 'aria-label': 'GitHub token', spellcheck: 'false' });
    const btn = h('button', { class: 'btn btn-primary', type: 'submit', text: 'Connect' });
    ghBody = [
      h('p', { class: 'notice', text: 'Right now your data is only saved (encrypted) in this browser. Connect GitHub so it’s backed up and shows up on your phone too.' }),
      h('ol', { class: 'steps' },
        h('li', null, 'Open ', h('a', { href: 'https://github.com/settings/personal-access-tokens/new', target: '_blank', rel: 'noopener noreferrer', text: 'GitHub → new fine-grained token' }), '.'),
        h('li', null, 'Name it “Dashboard”, pick an expiration (1 year is fine).'),
        h('li', null, 'Repository access: ', h('strong', { text: 'Only select repositories' }), ' → ', h('code', { text: REPO.repo }), '.'),
        h('li', null, 'Permissions → Repository permissions → ', h('strong', { text: 'Contents: Read and write' }), '. Nothing else.'),
        h('li', null, 'Generate, copy it, and paste it below. It gets stored inside your encrypted vault, never in plain text.')),
      h('form', {
        class: 'add-row',
        onsubmit: async ev => {
          ev.preventDefault();
          const t = token.value.trim();
          if (!t) return;
          btn.disabled = true; btn.textContent = 'Checking…';
          let problem;
          try { problem = await checkToken(t); } catch { problem = 'Couldn’t reach GitHub. Are you online?'; }
          if (problem) { msg(ghMsg, problem, false); btn.disabled = false; btn.textContent = 'Connect'; return; }
          token.value = '';
          // If a vault is already on GitHub, merge it in before the first save.
          try {
            const remote = await readRemote(t);
            if (remote && remote.file) S = merge(S, await open(remote.file, K));
          } catch (e) {
            if (e.code === 'KEY_MISMATCH' || e.code === 'BAD_PASSPHRASE') {
              msg(ghMsg, 'There is already a dashboard on GitHub locked with a different passphrase. Lock this page and unlock with that passphrase instead.', false);
              btn.disabled = false; btn.textContent = 'Connect'; return;
            }
          }
          S.github = { token: t, updatedAt: Date.now() };
          render(); await doSave();
        },
      }, token, btn),
      ghMsg,
    ];
  }
  const ghCard = card('Sync across devices', null, ...ghBody);

  // Canvas
  const cvMsg = h('p', { role: 'status' });
  let cvBody;
  if (S.canvas.feed) {
    cvBody = [
      h('p', { text: 'Connected. Upcoming assignments, quizzes and events (next 2 months) show up in your to-dos and calendar. Canvas’s feed doesn’t say what you’ve submitted, so tick items off here when you’re done.' }),
      h('div', { class: 'row' },
        h('button', { class: 'btn', type: 'button', onclick: () => syncCanvas(true) }, icon('refresh'), 'Sync now'),
        h('button', { class: 'btn btn-danger', type: 'button', text: 'Disconnect', onclick: () => {
          if (confirm('Disconnect Canvas? Items already imported stay in your list.')) commit(() => { S.canvas = { feed: '', updatedAt: Date.now() }; });
        } })),
      cvMsg,
    ];
  } else {
    const feed = h('input', { type: 'password', placeholder: 'https://ufl.instructure.com/feeds/calendars/user_….ics', autocomplete: 'off', spellcheck: 'false', 'aria-label': 'Canvas calendar feed link' });
    const btn = h('button', { class: 'btn btn-primary', type: 'submit', text: 'Connect' });
    cvBody = [
      h('ol', { class: 'steps' },
        h('li', null, 'Open ', h('a', { href: `${CANVAS_WEB}/calendar`, target: '_blank', rel: 'noopener noreferrer', text: 'Canvas → Calendar' }), '.'),
        h('li', null, 'At the bottom of the right-hand column, click ', h('strong', { text: 'Calendar Feed' }), '.'),
        h('li', null, 'Copy the link it shows (it ends in ', h('code', { text: '.ics' }), ') and paste it below.')),
      h('form', {
        class: 'add-row',
        onsubmit: async ev => {
          ev.preventDefault();
          const f = feed.value.trim();
          if (!FEED_RE.test(f)) { msg(cvMsg, 'That doesn’t look like the Calendar Feed link. It should start with https://ufl.instructure.com/feeds/calendars/ and end in .ics', false); return; }
          btn.disabled = true; btn.textContent = 'Checking…';
          let events;
          try { events = await fetchFeed(f); } catch (e) { msg(cvMsg, e.code === 'BAD_FEED' ? e.message : 'Couldn’t reach Canvas. Are you online?', false); btn.disabled = false; btn.textContent = 'Connect'; return; }
          feed.value = '';
          commit(() => { S.canvas = { feed: f, updatedAt: Date.now() }; applyCanvas(events); });
          Object.assign(canvasSync, { status: 'ok', at: Date.now(), msg: '' });
        },
      }, feed, btn),
      h('p', { class: 'muted small', text: 'Treat this link like a password: anyone with it can see your Canvas calendar. It’s stored inside your encrypted vault. Canvas doesn’t let other sites read it directly, so it’s fetched through your Cloudflare helper, which passes it along and stores nothing.' }),
      cvMsg,
    ];
  }
  const cvCard = card('Canvas (UF)', null, ...cvBody);

  // Notifications
  const nMsg = h('p', { role: 'status' });
  const p = S.push;
  let nBody;
  if (!p.dashKey) {
    const key = h('input', { type: 'password', placeholder: 'Helper key', autocomplete: 'off', spellcheck: 'false', 'aria-label': 'Notification key' });
    nBody = [
      h('p', { text: 'Paste your helper key. It turns on notifications and meal photos. You only need to do this once; it syncs to your other devices inside the vault.' }),
      h('form', { class: 'add-row', onsubmit: ev => { ev.preventDefault(); if (key.value.trim()) { commit(() => { S.push = { ...p, dashKey: key.value.trim(), updatedAt: Date.now() }; }); inboxState.keySent = false; checkInbox(); } } },
        key, h('button', { class: 'btn btn-primary', type: 'submit', text: 'Save' })),
    ];
  } else if (!pushSupported() && !needsHomeScreen()) {
    nBody = [h('p', { class: 'muted', text: 'This browser can’t show notifications.' })];
  } else if (needsHomeScreen()) {
    nBody = [h('p', { text: 'On iPhone, notifications only work from the home-screen app:' }),
      h('ol', { class: 'steps' },
        h('li', null, 'Tap the ', h('strong', { text: 'Share' }), ' button in Safari.'),
        h('li', null, 'Choose ', h('strong', { text: 'Add to Home Screen' }), ', then Add.'),
        h('li', null, 'Open Dashboard from the new icon and come back to this page.'))];
  } else {
    const on = !!pushState.sub;
    const briefTime = h('input', { type: 'time', value: p.briefTime, 'aria-label': 'Morning brief time', onchange: e => commit(() => { S.push = { ...S.push, briefTime: e.target.value || '08:00', updatedAt: Date.now() }; }) });
    const lead = h('select', { 'aria-label': 'Reminder before due time', onchange: e => commit(() => { S.push = { ...S.push, leadMin: Number(e.target.value), updatedAt: Date.now() }; }) },
      [[15, '15 minutes'], [30, '30 minutes'], [60, '1 hour'], [120, '2 hours'], [240, '4 hours']].map(([v, l]) => h('option', { value: v, text: l, selected: p.leadMin === v })));
    nBody = [
      h('div', { class: 'setting-row' },
        h('div', null, h('strong', { text: 'This device' }), h('p', { class: 'muted small', text: on ? 'Notifications are on.' : 'Notifications are off.' })),
        on
          ? h('div', { class: 'row' },
            h('button', { class: 'btn', type: 'button', text: 'Send a test', onclick: async () => {
              try { await testPush(p.dashKey, pushState.sub); msg(nMsg, 'Sent. It should pop up in a few seconds.', true); } catch (e) { msg(nMsg, e.message, false); }
            } }),
            h('button', { class: 'btn btn-danger', type: 'button', text: 'Turn off', onclick: async () => {
              await unsubscribe(p.dashKey); pushState.sub = null; pushState.lastSent = ''; render();
            } }))
          : h('button', { class: 'btn btn-primary', type: 'button', text: 'Turn on', onclick: async () => {
            try {
              pushState.sub = await subscribe(); pushState.lastSent = '';
              await sendPushSchedule(true);
              render();
            } catch (e) {
              if (e.code === 'BAD_KEY') {
                await unsubscribe('').catch(() => {}); pushState.sub = null;
                commit(() => { S.push = { ...S.push, dashKey: '', updatedAt: Date.now() }; });
                alert('That notification key was wrong. Paste it again.');
              } else msg(nMsg, e.message, false);
            }
          } })),
      h('div', { class: 'setting-row' }, h('div', null, h('strong', { text: 'Morning brief' }), h('p', { class: 'muted small', text: 'How many things are due that day.' })), briefTime),
      h('div', { class: 'setting-row' }, h('div', null, h('strong', { text: 'Due-soon reminder' }), h('p', { class: 'muted small', text: 'Before to-dos that have a due time.' })), lead),
      h('p', { class: 'muted small', text: 'Your Cloudflare helper only learns when to notify you and how many items are due. Never what they are.' }),
      nMsg,
    ];
  }
  const nCard = card('Notifications', null, ...nBody);

  // Task inbox
  const inboxReady = !!(S.push.dashKey && S.inbox.pub);
  const ibCard = card('Task inbox', null,
    h('p', { text: inboxReady
      ? 'Ready. Tasks sent to your inbox are encrypted before they leave the sender, and show up in Tasks the next time this dashboard is open.'
      : 'Add your helper key above to turn on the inbox. Then tasks can be sent here from other places, encrypted end to end.' }),
    inboxReady ? h('p', { class: 'muted small' }, 'From a terminal in your website folder: ',
      h('code', { text: 'node cloudflare/add-task.mjs "Read ch. 5" --due 2026-10-28 --tag orgo' })) : null,
    h('p', { class: 'muted small', text: 'The helper only ever holds scrambled data; the key to open it lives inside your vault.' }));


  // Goals
  const goalInputs = Object.fromEntries(NUTRIENTS.map(m => [m.key, h('input', { type: 'number', min: '0', value: g.goals[m.key], 'aria-label': `${m.label} goal` })]));
  const goals = card('Daily goals', null, h('form', {
    class: 'goal-form',
    onsubmit: ev => {
      ev.preventDefault();
      commit(() => { NUTRIENTS.forEach(m => { g.goals[m.key] = Math.max(0, Number(goalInputs[m.key].value) || 0); }); touch(g); });
    },
  }, NUTRIENTS.map(m => h('label', null, h('span', { text: `${m.label}${m.limit ? ' limit' : ''}${m.unit === 'g' ? ' (g)' : ''}` }), goalInputs[m.key])),
  h('button', { class: 'btn', type: 'submit', text: 'Save goals' })));

  // Security
  const autoLock = h('select', { 'aria-label': 'Auto-lock after', onchange: e => commit(() => { g.autoLockMin = Number(e.target.value); touch(g); }) },
    [5, 10, 15, 30, 60].map(n => h('option', { value: n, text: `${n} minutes`, selected: g.autoLockMin === n })));

  const cur = h('input', { type: 'password', autocomplete: 'current-password', placeholder: 'Current passphrase', 'aria-label': 'Current passphrase' });
  const nw = h('input', { type: 'password', autocomplete: 'new-password', placeholder: `New passphrase (${MIN_LENGTH}+ characters)`, 'aria-label': 'New passphrase' });
  const nw2 = h('input', { type: 'password', autocomplete: 'new-password', placeholder: 'New passphrase again', 'aria-label': 'Confirm new passphrase' });
  const pwMsg = h('p', { role: 'status' });
  const pwBtn = h('button', { class: 'btn', type: 'submit', text: 'Change passphrase' });
  const pwForm = h('form', {
    class: 'stack',
    onsubmit: async ev => {
      ev.preventDefault();
      if (nw.value !== nw2.value) return msg(pwMsg, 'New passphrases don’t match.', false);
      if (nw.value.length < MIN_LENGTH || strength(nw.value) < MIN_BITS) return msg(pwMsg, 'New passphrase is too easy to guess. Make it longer.', false);
      pwBtn.disabled = true; pwBtn.textContent = 'Re-encrypting…';
      try {
        const local = readLocal();
        await unlock(local, cur.value); // proves the current passphrase
        const keyInfo = await createKey(nw.value);
        clearTimeout(saveTimer);
        while (saving) await new Promise(r => setTimeout(r, 100));
        await rekey(S, keyInfo);
        K = keyInfo; dirty = false;
        cur.value = nw.value = nw2.value = '';
        msg(pwMsg, 'Done. Use the new passphrase from now on, on every device.', true);
        setSync(S.github.token ? 'synced' : 'local');
      } catch (e) {
        msg(pwMsg, e.code === 'BAD_PASSPHRASE' ? 'Current passphrase is wrong.' : e.message, false);
      }
      pwBtn.disabled = false; pwBtn.textContent = 'Change passphrase';
    },
  }, cur, nw, nw2, pwBtn, pwMsg);

  const appearance = card('Appearance', null,
    h('div', { class: 'setting-row' },
      h('div', null, h('strong', { text: 'Light or dark' }), h('p', { class: 'muted small', text: 'Saved on this device. Follows your system until you choose.' })),
      themeButton(true)));

  const security = card('Security', null,
    h('div', { class: 'setting-row' }, h('div', null, h('strong', { text: 'Auto-lock' }), h('p', { class: 'muted small', text: 'Locks after this long without activity.' })), autoLock),
    h('div', { class: 'subhead', text: 'Change passphrase' }), pwForm,
    h('div', { class: 'subhead', text: 'Backup' }),
    h('p', { class: 'muted small', text: 'Downloads your vault as an encrypted file. It can only be opened with your passphrase.' }),
    h('div', { class: 'row' },
      h('button', { class: 'btn', type: 'button', text: 'Download encrypted backup', onclick: () => {
        const file = readLocal();
        if (!file) return;
        const a = h('a', { href: URL.createObjectURL(new Blob([JSON.stringify(file)], { type: 'application/json' })), download: `dashboard-backup-${todayStr()}.json` });
        a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      } }),
      S.github.token ? h('button', { class: 'btn btn-danger', type: 'button', text: 'Forget this device', onclick: async () => {
        if (!confirm('Remove the encrypted copy from this browser and lock? Your synced copy on GitHub stays.')) return;
        await doSave(); forgetLocal(); S = null; location.replace(location.pathname);
      } }) : null));

  const about = card('How your data is protected', null,
    h('ul', { class: 'bullets' },
      h('li', { text: 'Everything is encrypted in your browser with AES-256, using a key made from your passphrase (PBKDF2, 1,000,000 rounds).' }),
      h('li', { text: 'Only the scrambled file is saved, here and on GitHub. Your passphrase is never stored or sent anywhere.' }),
      h('li', { text: 'This page loads no outside scripts, and can only talk to GitHub and your own Cloudflare helper.' }),
      h('li', { text: 'The helper forwards Canvas requests without storing them, and only knows the times and counts of your reminders.' }),
      h('li', { text: 'Forgetting the passphrase means the data can’t be recovered by anyone.' })));

  return h('div', { class: 'page' },
    h('header', { class: 'page-head' }, h('h1', { text: 'Settings' })),
    h('div', { class: 'settings' }, ghCard, cvCard, nCard, ibCard, profile, goals, appearance, security, about));
}

// ---------------------------------------------------------------- go

boot().catch(e => {
  root.replaceChildren(h('div', { class: 'boot' }, h('p', { text: 'Something went wrong loading the dashboard.' }), h('p', { class: 'muted small', text: e.message })));
});
