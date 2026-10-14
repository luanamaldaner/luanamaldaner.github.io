// Dashboard helper (Cloudflare Worker).
//
// 1. /canvas-feed  Fetches your UF Canvas calendar feed, because Canvas
//    doesn't let other websites read it from the browser. The private feed
//    link arrives with each request and is used once, never stored or logged.
// 2. /push/...    Phone notifications. Stores only *when* to notify and how
//    many items are due (no titles), plus the push address of your device.
//    A cron trigger sends due notifications every 5 minutes.

import Anthropic from '@anthropic-ai/sdk';

const ALLOWED_ORIGINS =['https://luanamaldaner.github.io', 'http://127.0.0.1:8765', 'http://localhost:8765'];
const VAPID_SUBJECT = 'https://luanamaldaner.github.io/private/';
const MAX_SCHEDULE = 200;

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    const cors = ALLOWED_ORIGINS.includes(origin) ? {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Canvas-Feed, X-Dash-Key',
      'Access-Control-Max-Age': '86400',
      Vary: 'Origin',
    } : null;
    if (!cors) return new Response('Forbidden', { status: 403 });
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    const url = new URL(req.url);
    try {
      let res;
      if (url.pathname === '/canvas-feed') res = await canvasFeed(req);
      else if (url.pathname === '/meal' && req.method === 'POST') res = await estimateMeal(req, env);
      else if (url.pathname === '/push/config') res = json({ vapidPublicKey: env.VAPID_PUBLIC_KEY });
      else if (url.pathname === '/push/schedule' && req.method === 'POST') res = await setSchedule(req, env);
      else if (url.pathname === '/push/test' && req.method === 'POST') res = await testPush(req, env);
      else res = new Response('Not found', { status: 404 });
      const out = new Response(res.body, res);
      for (const [k, v] of Object.entries(cors)) out.headers.set(k, v);
      out.headers.set('Cache-Control', 'no-store');
      return out;
    } catch (e) {
      return new Response(JSON.stringify({ error: String(e && e.message || e) }), {
        status: 500, headers: { ...cors, 'Content-Type': 'application/json' } });
    }
  },

  async scheduled(_event, env) {
    await sendDue(env);
  },
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
}

// ------------------------------------------------------------- canvas

// UF doesn't let students make API tokens, so the dashboard uses the private
// calendar feed link instead. It arrives in a header (kept out of URLs/logs)
// and must point at a UF Canvas calendar feed.
const FEED_RE = /^https:\/\/ufl\.instructure\.com\/feeds\/calendars\/user_[A-Za-z0-9]+\.ics$/;

async function canvasFeed(req) {
  if (req.method !== 'GET') return new Response('Method not allowed', { status: 405 });
  const feed = req.headers.get('X-Canvas-Feed') || '';
  if (!FEED_RE.test(feed)) return new Response('Not a UF Canvas calendar feed link', { status: 400 });
  // Canvas rejects requests without a User-Agent.
  const upstream = await fetch(feed, { headers: { Accept: 'text/calendar', 'User-Agent': 'dash-helper (personal calendar sync)' } });
  return new Response(upstream.body, { status: upstream.status, headers: { 'Content-Type': 'text/calendar; charset=utf-8' } });
}

// ------------------------------------------------------------- meal photos

// Body: { image: base64 JPEG, note?: string }. The photo is sent to the vision model
// for an estimate and then forgotten; nothing is stored here.
const MEAL_SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string', description: 'Short name for the whole meal, e.g. "Chicken burrito bowl"' },
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          portion: { type: 'string', description: 'Estimated amount, e.g. "1 cup", "150 g"' },
          cal: { type: 'number' },
          protein: { type: 'number', description: 'grams' },
          carbs: { type: 'number', description: 'grams' },
          fat: { type: 'number', description: 'grams' },
          sugar: { type: 'number', description: 'grams of total sugars' },
          fiber: { type: 'number', description: 'grams of dietary fiber' },
        },
        required: ['name', 'portion', 'cal', 'protein', 'carbs', 'fat', 'sugar', 'fiber'],
        additionalProperties: false,
      },
    },
    notes: { type: 'string', description: 'One short sentence on what was hard to judge, or empty' },
    is_food: { type: 'boolean', description: 'false if the photo does not show food or drink' },
  },
  required: ['name', 'items', 'notes', 'is_food'],
  additionalProperties: false,
};

const MEAL_PROMPT = `Estimate the nutrition of the meal in this photo for a calorie log.
Identify each distinct food or drink, estimate its portion from visual cues (plate size, utensils, packaging), and give calories and grams of protein, carbs, fat, total sugars and dietary fiber per item. Use typical US restaurant or home-cooked values; when unsure, pick the most likely middle estimate rather than a range. Round calories to the nearest 5 and grams to whole numbers.`;

async function estimateMeal(req, env) {
  if (!(await authed(req, env))) return new Response('Unauthorized', { status: 401 });
  if (!env.ANTHROPIC_API_KEY) return json({ error: 'The Anthropic API key has not been added to the helper yet.' }, 503);
  const { image, note } = await req.json();
  if (typeof image !== 'string' || image.length < 100 || image.length > 8_000_000) return json({ error: 'Photo missing or too large.' }, 400);

  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  const content = [
    { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: image } },
    { type: 'text', text: MEAL_PROMPT + (note ? `\n\nThe person added this note about the meal: """${String(note).slice(0, 300)}"""` : '') },
  ];
  let response;
  try {
    response = await client.beta.messages.create({
      model: 'claude-opus-5-5',
      max_tokens: 16000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'medium', format: { type: 'json_schema', schema: MEAL_SCHEMA } },
      messages: [{ role: 'user', content }],
    });
  } catch (e) {
    if (e instanceof Anthropic.AuthenticationError) return json({ error: 'The Anthropic API key was rejected.' }, 502);
    if (e instanceof Anthropic.RateLimitError) return json({ error: 'Too many photos at once. Try again in a minute.' }, 429);
    if (e instanceof Anthropic.APIError) return json({ error: `The photo couldn't be processed (${e.status ?? 'error'}).` }, 502);
    throw e;
  }
  if (response.stop_reason === 'refusal') return json({ error: 'That photo couldn’t be analysed. Try another one.' }, 422);
  if (response.stop_reason === 'max_tokens') return json({ error: 'The estimate was cut off. Try again.' }, 502);
  const text = response.content.filter(b => b.type === 'text').map(b => b.text).join('');
  let meal;
  try { meal = JSON.parse(text); } catch { return json({ error: 'The estimate came back unreadable. Try again.' }, 502); }
  return json(meal);
}

// ------------------------------------------------------------- push: storage

async function authed(req, env) {
  const key = req.headers.get('X-Dash-Key') || '';
  const a = new TextEncoder().encode(key), b = new TextEncoder().encode(env.DASH_KEY || '');
  if (!env.DASH_KEY || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

// Body: { subscription: PushSubscriptionJSON, items: [{ at: epochMs, kind: 'brief'|'due', n: number }] }
async function setSchedule(req, env) {
  if (!(await authed(req, env))) return new Response('Unauthorized', { status: 401 });
  const body = await req.json();
  const sub = body.subscription;
  if (!sub || typeof sub.endpoint !== 'string' || !sub.endpoint.startsWith('https://') || !sub.keys || !sub.keys.p256dh || !sub.keys.auth) {
    return new Response('Bad subscription', { status: 400 });
  }
  const now = Date.now();
  const items = (Array.isArray(body.items) ? body.items : [])
    .filter(i => Number.isFinite(i.at) && i.at > now - 60e3 && (i.kind === 'brief' || i.kind === 'due'))
    .map(i => ({ at: Math.round(i.at), kind: i.kind, n: Math.max(0, Math.min(99, i.n | 0)) }))
    .sort((a, b) => a.at - b.at)
    .slice(0, MAX_SCHEDULE);
  const id = await subId(sub.endpoint);
  const all = await loadAll(env);
  if (items.length || body.keep) all[id] = { sub: { endpoint: sub.endpoint, keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth } }, items };
  else delete all[id];
  // Keep only a handful of devices.
  const ids = Object.keys(all);
  if (ids.length > 10) for (const old of ids.slice(0, ids.length - 10)) delete all[old];
  await env.DASH_KV.put('schedules', JSON.stringify(all));
  return json({ ok: true, scheduled: items.length });
}

async function testPush(req, env) {
  if (!(await authed(req, env))) return new Response('Unauthorized', { status: 401 });
  const { subscription } = await req.json();
  const r = await sendPush(env, subscription, { title: 'Dashboard', body: 'Notifications are working.' });
  return json({ ok: r.ok, status: r.status });
}

async function subId(endpoint) {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(endpoint));
  return b64u(new Uint8Array(d)).slice(0, 22);
}

async function loadAll(env) {
  const raw = await env.DASH_KV.get('schedules');
  return raw ? JSON.parse(raw) : {};
}

function message(item) {
  if (item.kind === 'brief') {
    return { title: 'Good morning', body: item.n ? `${item.n} thing${item.n === 1 ? '' : 's'} due today. Tap to open your dashboard.` : 'Your day is clear. Tap to open your dashboard.' };
  }
  return { title: 'Coming up', body: `${item.n || 1} item${item.n === 1 ? '' : 's'} due soon. Tap to open your dashboard.` };
}

async function sendDue(env) {
  const all = await loadAll(env);
  const now = Date.now();
  let changed = false;
  for (const [id, entry] of Object.entries(all)) {
    const due = entry.items.filter(i => i.at <= now);
    if (!due.length) continue;
    changed = true;
    entry.items = entry.items.filter(i => i.at > now);
    // If several piled up (e.g. cron hiccup), only send the latest one.
    const item = due[due.length - 1];
    if (now - item.at < 2 * 3600e3) {
      const r = await sendPush(env, entry.sub, message(item));
      if (r.status === 404 || r.status === 410) { delete all[id]; continue; } // device unsubscribed
    }
    if (!entry.items.length) delete all[id];
  }
  if (changed) await env.DASH_KV.put('schedules', JSON.stringify(all));
}

// ------------------------------------------------------------- push: Web Push (RFC 8291 + RFC 8292)

const te = new TextEncoder();

function b64u(bytes) {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function unb64u(str) {
  const s = atob(str.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((str.length + 3) % 4));
  return Uint8Array.from(s, c => c.charCodeAt(0));
}
function concat(...arrs) {
  const out = new Uint8Array(arrs.reduce((n, a) => n + a.length, 0));
  let o = 0;
  for (const a of arrs) { out.set(a, o); o += a.length; }
  return out;
}

async function hkdf(salt, ikm, info, length) {
  const key = await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt, info }, key, length * 8));
}

export async function encryptPayload(sub, plaintext) {
  const uaPublic = unb64u(sub.keys.p256dh);
  const authSecret = unb64u(sub.keys.auth);
  const as = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const asPublic = new Uint8Array(await crypto.subtle.exportKey('raw', as.publicKey));
  const uaKey = await crypto.subtle.importKey('raw', uaPublic, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const shared = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: uaKey }, as.privateKey, 256));

  const ikm = await hkdf(authSecret, shared, concat(te.encode('WebPush: info\0'), uaPublic, asPublic), 32);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const cek = await hkdf(salt, ikm, te.encode('Content-Encoding: aes128gcm\0'), 16);
  const nonce = await hkdf(salt, ikm, te.encode('Content-Encoding: nonce\0'), 12);

  const key = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt']);
  const padded = concat(te.encode(plaintext), new Uint8Array([2])); // 0x02 = last record
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, key, padded));

  const header = new Uint8Array(21);
  header.set(salt, 0);
  new DataView(header.buffer).setUint32(16, 4096);
  header[20] = asPublic.length;
  return concat(header, asPublic, ct);
}

async function vapidAuth(env, endpoint) {
  const aud = new URL(endpoint).origin;
  const enc = o => b64u(te.encode(JSON.stringify(o)));
  const unsigned = `${enc({ typ: 'JWT', alg: 'ES256' })}.${enc({ aud, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: VAPID_SUBJECT })}`;
  const key = await crypto.subtle.importKey('jwk', JSON.parse(env.VAPID_PRIVATE_JWK), { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, te.encode(unsigned)));
  return `vapid t=${unsigned}.${b64u(sig)}, k=${env.VAPID_PUBLIC_KEY}`;
}

async function sendPush(env, sub, msg) {
  const body = await encryptPayload(sub, JSON.stringify(msg));
  return fetch(sub.endpoint, {
    method: 'POST',
    headers: {
      Authorization: await vapidAuth(env, sub.endpoint),
      'Content-Encoding': 'aes128gcm',
      'Content-Type': 'application/octet-stream',
      TTL: '3600',
      Urgency: 'normal',
    },
    body,
  });
}
