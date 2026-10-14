// Talks to the Cloudflare helper: Canvas calendar feed and phone notifications.
// The helper never receives anything from the vault except, for Canvas, your
// private feed link (forwarded, not stored), and for notifications, the times
// and counts of upcoming reminders (no titles).

export const HELPER = 'https://dash-helper.qwsfzueh.workers.dev';
export const CANVAS_WEB = 'https://ufl.instructure.com';
export const FEED_RE = /^https:\/\/ufl\.instructure\.com\/feeds\/calendars\/user_[A-Za-z0-9]+\.ics$/;

// ---------------------------------------------------------------- Canvas calendar feed

/** Fetch and parse the Canvas calendar feed. Returns a list of VEVENTs. */
export async function fetchFeed(feed) {
  const r = await fetch(`${HELPER}/canvas-feed`, { headers: { 'X-Canvas-Feed': feed }, cache: 'no-store' });
  if (r.status === 400) { const e = new Error('That doesn’t look like a UF Canvas calendar feed link.'); e.code = 'BAD_FEED'; throw e; }
  if (r.status === 401 || r.status === 403 || r.status === 404) { const e = new Error('Canvas didn’t recognise that feed link.'); e.code = 'BAD_FEED'; throw e; }
  if (!r.ok) throw new Error(`Canvas error ${r.status}`);
  const text = await r.text();
  if (!text.includes('BEGIN:VCALENDAR')) { const e = new Error('Canvas didn’t return a calendar.'); e.code = 'BAD_FEED'; throw e; }
  return parseICS(text);
}

function unescapeText(v) {
  return v.replace(/\\n/gi, '\n').replace(/\\([,;\\])/g, '$1');
}

// "20261015T035900Z" (UTC), "20261015T120000" (local) or "20261015" (all day)
function parseICSDate(value, params) {
  const m = value.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/);
  if (!m) return null;
  const [, y, mo, d, hh, mm, ss, z] = m;
  if (!hh || /VALUE=DATE(?!-)/.test(params)) return { allDay: true, date: new Date(+y, mo - 1, +d) };
  const date = z ? new Date(Date.UTC(+y, mo - 1, +d, +hh, +mm, +ss)) : new Date(+y, mo - 1, +d, +hh, +mm, +ss);
  return { allDay: false, date };
}

export function parseICS(text) {
  const lines = text.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '').split(/\r?\n/);
  const events = [];
  let cur = null;
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') { cur = {}; continue; }
    if (line === 'END:VEVENT') { if (cur && cur.uid && cur.start) events.push(cur); cur = null; continue; }
    if (!cur) continue;
    const colon = line.indexOf(':');
    if (colon < 0) continue;
    const [name, ...rest] = line.slice(0, colon).split(';');
    const params = rest.join(';');
    const value = line.slice(colon + 1);
    switch (name.toUpperCase()) {
      case 'UID': cur.uid = value; break;
      case 'SUMMARY': cur.summary = unescapeText(value); break;
      case 'LOCATION': cur.location = unescapeText(value); break;
      case 'URL': cur.url = value; break;
      case 'DTSTART': cur.start = parseICSDate(value, params); break;
    }
  }
  return events;
}

// ---------------------------------------------------------------- notifications

export function pushSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

export function needsHomeScreen() {
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  return ios && !navigator.standalone;
}

async function registration() {
  return navigator.serviceWorker.register('sw.js', { scope: './' }).then(() => navigator.serviceWorker.ready);
}

export async function currentSubscription() {
  if (!pushSupported()) return null;
  const reg = await navigator.serviceWorker.getRegistration('./');
  return reg ? reg.pushManager.getSubscription() : null;
}

function keyBytes(b64u) {
  const s = atob(b64u.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((b64u.length + 3) % 4));
  return Uint8Array.from(s, c => c.charCodeAt(0));
}

export async function subscribe() {
  if ((await Notification.requestPermission()) !== 'granted') throw new Error('Notifications were not allowed. You can turn them on in your browser or phone settings.');
  const { vapidPublicKey } = await (await fetch(`${HELPER}/push/config`, { cache: 'no-store' })).json();
  const reg = await registration();
  const existing = await reg.pushManager.getSubscription();
  if (existing) return existing;
  return reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(vapidPublicKey) });
}

export async function unsubscribe(dashKey) {
  const sub = await currentSubscription();
  if (!sub) return;
  try { await sendSchedule(dashKey, sub, []); } catch {}
  await sub.unsubscribe();
}

export async function sendSchedule(dashKey, sub, items) {
  const r = await fetch(`${HELPER}/push/schedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Dash-Key': dashKey },
    body: JSON.stringify({ subscription: sub.toJSON(), items }),
  });
  if (r.status === 401) { const e = new Error('The notification key is wrong.'); e.code = 'BAD_KEY'; throw e; }
  if (!r.ok) throw new Error(`Notification helper error ${r.status}`);
  return r.json();
}

export async function testPush(dashKey, sub) {
  const r = await fetch(`${HELPER}/push/test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Dash-Key': dashKey },
    body: JSON.stringify({ subscription: sub.toJSON() }),
  });
  if (r.status === 401) throw new Error('The notification key is wrong.');
  const j = await r.json();
  if (!j.ok) throw new Error(`Push service answered ${j.status}.`);
}

// ---------------------------------------------------------------- meal photos

/** Shrink a photo in the browser (keeps uploads small and fast). Returns a JPEG data URL. */
export async function shrinkPhoto(file, maxSide = 1280) {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext('2d').drawImage(bmp, 0, 0, canvas.width, canvas.height);
  bmp.close();
  return canvas.toDataURL('image/jpeg', 0.82);
}

/** Ask the helper to estimate a meal photo. */
export async function estimateMeal(dashKey, dataUrl, note) {
  const r = await fetch(`${HELPER}/meal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Dash-Key': dashKey },
    body: JSON.stringify({ image: dataUrl.slice(dataUrl.indexOf(',') + 1), note: note || '' }),
  });
  if (r.status === 401) throw new Error('The notification key in Settings is missing or wrong (it also unlocks meal photos).');
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || `Helper error ${r.status}`);
  return j;
}

// ---------------------------------------------------------------- task inbox

async function inboxCall(path, dashKey, init = {}) {
  const r = await fetch(`${HELPER}${path}`, { ...init, headers: { 'Content-Type': 'application/json', 'X-Dash-Key': dashKey }, cache: 'no-store' });
  if (!r.ok) throw new Error(`Inbox error ${r.status}`);
  return r.json();
}
export const setInboxKey = (dashKey, publicKey) => inboxCall('/inbox/key', dashKey, { method: 'POST', body: JSON.stringify({ publicKey }) });
export const fetchInbox = async dashKey => (await inboxCall('/inbox', dashKey)).items || [];
export const ackInbox = (dashKey, ids) => inboxCall('/inbox/ack', dashKey, { method: 'POST', body: JSON.stringify({ ids }) });
