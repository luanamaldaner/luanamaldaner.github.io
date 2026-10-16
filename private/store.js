// Vault storage: an encrypted copy in this browser, plus an encrypted copy in
// the Cloudflare helper (KV) so every device sees the same data. Older
// versions committed the vault to the website repo as vault.json; that copy is
// still read and merged on every pull (so edits from tabs running the old code
// aren't lost), and is used for saving only when no helper key is set up.
// Only ciphertext ever leaves this file.

import { seal, open } from './crypto.js';

export const REPO = {
  owner: 'luanamaldaner',
  repo: 'luanamaldaner.github.io',
  branch: 'main',
  path: 'private/vault.json',
};

const LS_VAULT = 'pv.vault';
const LS_SHA = 'pv.sha';
const LS_REV = 'pv.rev';
export const VAULT_URL = 'https://dash-helper.qwsfzueh.workers.dev/vault';
const COLLECTIONS = ['todos', 'events', 'notes', 'food', 'weight', 'days', 'focus', 'internships', 'orgo', 'sleep'];
const OBJECTS = ['settings', 'github', 'canvas', 'push', 'inbox'];
const TOMBSTONE_DAYS = 45;

export function emptyState() {
  const now = Date.now();
  return {
    v: 1,
    todos: [], events: [], notes: [], food: [], weight: [], days: [], focus: [], internships: [], orgo: [], sleep: [],
    settings: {
      name: '',
      goals: { cal: 2000, protein: 150, carbs: 200, fat: 60, sugar: 50, fiber: 28, water: 8 },
      autoLockMin: 10,
      updatedAt: now,
    },
    github: { token: '', updatedAt: 0 },
    canvas: { feed: '', updatedAt: 0 },
    // subscription is per device, so it lives in this browser, not here.
    push: { dashKey: '', briefTime: '08:00', leadMin: 60, updatedAt: 0 },
    // key pair for the task inbox; the private half never leaves the vault
    inbox: { pub: '', priv: null, updatedAt: 0 },
  };
}

function normalize(s) {
  const base = emptyState();
  const out = { ...base, ...s };
  for (const c of COLLECTIONS) if (!Array.isArray(out[c])) out[c] = [];
  out.settings = { ...base.settings, ...(s && s.settings) };
  out.settings.goals = { ...base.settings.goals, ...(s && s.settings && s.settings.goals) };
  out.github = { ...base.github, ...(s && s.github) };
  out.canvas = { ...base.canvas, ...(s && s.canvas) };
  out.push = { ...base.push, ...(s && s.push) };
  out.inbox = { ...base.inbox, ...(s && s.inbox) };
  return out;
}

/** Combine two copies of the vault: newest edit of each item wins. */
export function merge(a, b) {
  a = normalize(a); b = normalize(b);
  const out = normalize({});
  const cutoff = Date.now() - TOMBSTONE_DAYS * 864e5;
  for (const c of COLLECTIONS) {
    const byId = new Map();
    for (const item of [...a[c], ...b[c]]) {
      const prev = byId.get(item.id);
      if (!prev || (item.updatedAt || 0) > (prev.updatedAt || 0)) byId.set(item.id, item);
    }
    out[c] = [...byId.values()].filter(i => !(i.deleted && (i.updatedAt || 0) < cutoff));
  }
  for (const o of OBJECTS) {
    out[o] = (b[o].updatedAt || 0) > (a[o].updatedAt || 0) ? b[o] : a[o];
  }
  return out;
}

export function uid() {
  const b = crypto.getRandomValues(new Uint8Array(9));
  return Array.from(b, x => x.toString(16).padStart(2, '0')).join('');
}

// ---------- local copy ----------

export function readLocal() {
  try {
    const raw = localStorage.getItem(LS_VAULT);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function writeLocal(file, sha) {
  try {
    localStorage.setItem(LS_VAULT, JSON.stringify(file));
    if (sha !== undefined) localStorage.setItem(LS_SHA, sha || '');
  } catch { /* storage full or blocked: GitHub copy still works */ }
}

function localSha() {
  try { return localStorage.getItem(LS_SHA) || ''; } catch { return ''; }
}

function localRev() {
  try { return Number(localStorage.getItem(LS_REV)) || 0; } catch { return 0; }
}

function setLocalRev(rev) {
  try { localStorage.setItem(LS_REV, String(rev || 0)); } catch {}
}

export function forgetLocal() {
  try { localStorage.removeItem(LS_VAULT); localStorage.removeItem(LS_SHA); localStorage.removeItem(LS_REV); } catch {}
}

// ---------- Cloudflare copy ----------

/** { file, rev } | null (nothing stored yet) | undefined (unreachable). */
async function readKV() {
  try {
    const r = await fetch(VAULT_URL, { cache: 'no-store' });
    if (r.status === 404) return null;
    if (r.ok) { const j = await r.json(); return { file: j.file, rev: j.rev || 0 }; }
  } catch {}
  return undefined;
}

async function writeKV(file, base, dashKey) {
  const r = await fetch(VAULT_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Dash-Key': dashKey },
    body: JSON.stringify({ file, base }),
  });
  if (r.ok) return (await r.json()).rev;
  if (r.status === 409) {
    const j = await r.json();
    const e = new Error('Another device saved first.');
    e.code = 'CONFLICT'; e.rev = j.rev; e.file = j.file;
    throw e;
  }
  const e = new Error(r.status === 401 ? 'The helper key was rejected. Check it in Settings.' : `Cloud save failed (${r.status}).`);
  e.status = r.status;
  if (r.status === 401) e.code = 'BAD_HELPER_KEY';
  throw e;
}

// ---------- GitHub copy ----------

const API = `https://api.github.com/repos/${REPO.owner}/${REPO.repo}/contents/${REPO.path}`;

function b64ToText(b64) {
  const bin = atob(b64.replace(/\n/g, ''));
  return new TextDecoder().decode(Uint8Array.from(bin, ch => ch.charCodeAt(0)));
}

function textToB64(text) {
  const bytes = new TextEncoder().encode(text);
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

function headers(token) {
  const h = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

/** Fetch the committed vault. Returns { file, sha } or null if none exists yet. */
async function readGitHub(token) {
  try {
    const r = await fetch(`${API}?ref=${REPO.branch}`, { headers: headers(token), cache: 'no-store' });
    if (r.status === 404) return null;
    if (r.ok) {
      const j = await r.json();
      return { file: JSON.parse(b64ToText(j.content)), sha: j.sha };
    }
    if (r.status === 401) { const e = new Error('GitHub rejected the token.'); e.code = 'BAD_TOKEN'; throw e; }
  } catch (e) {
    if (e.code === 'BAD_TOKEN') throw e;
  }
  // API unavailable (offline, rate-limited): fall back to the published file.
  try {
    const r = await fetch('vault.json', { cache: 'no-store' });
    if (r.ok) return { file: await r.json(), sha: null };
  } catch {}
  return undefined; // unknown (offline)
}

async function writeRemote(file, sha, token) {
  const body = {
    message: 'Update private vault (encrypted)',
    content: textToB64(JSON.stringify(file, null, 0) + '\n'),
    branch: REPO.branch,
  };
  if (sha) body.sha = sha;
  const r = await fetch(API, { method: 'PUT', headers: headers(token), body: JSON.stringify(body) });
  if (r.ok) return (await r.json()).content.sha;
  const e = new Error(`GitHub save failed (${r.status}).`);
  e.status = r.status;
  if (r.status === 401) e.code = 'BAD_TOKEN';
  if (r.status === 403 || r.status === 404) e.code = 'NO_PERMISSION';
  if (r.status === 409 || r.status === 422) e.code = 'CONFLICT';
  throw e;
}

/**
 * Fetch both remote copies. Returns { file, sha, rev, kv, gh }, null when
 * neither exists yet, or undefined when both are unreachable. `file` prefers
 * the Cloudflare copy.
 */
export async function readRemote(token) {
  const [kv, gh] = await Promise.all([readKV(), readGitHub(token).catch(e => { if (e.code === 'BAD_TOKEN') return undefined; throw e; })]);
  if (kv === undefined && gh === undefined) return undefined;
  if (!kv && !gh) return null;
  return { file: (kv && kv.file) || (gh && gh.file), sha: gh ? gh.sha : null, rev: kv ? kv.rev : 0, kv, gh };
}

/** Check that a token can write to the website repo. */
export async function checkToken(token) {
  const r = await fetch(`https://api.github.com/repos/${REPO.owner}/${REPO.repo}`,
    { headers: headers(token), cache: 'no-store' });
  if (r.status === 401) return 'That token is not valid (or has expired).';
  if (!r.ok) return `That token can't see ${REPO.repo}. Make sure the token gives access to that repository.`;
  const j = await r.json();
  if (!j.permissions || !j.permissions.push) {
    return 'That token can read the repo but not save to it. Give it "Contents: Read and write".';
  }
  return '';
}

/**
 * Save state: always to this browser, and to GitHub if a token is set.
 * If another device saved in between, pull its copy, merge, and retry.
 * Returns { state, synced } where state may include the other device's edits.
 */
export async function save(state, keyInfo) {
  let file = await seal(state, keyInfo);
  writeLocal(file);
  const dashKey = state.push && state.push.dashKey;
  if (dashKey) {
    let base = localRev();
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        setLocalRev(await writeKV(file, base, dashKey));
        return { state, synced: true };
      } catch (e) {
        if (e.code !== 'CONFLICT') throw e;
        // someone else saved first: merge their copy into ours and try again
        if (e.file) state = merge(state, await open(e.file, keyInfo));
        file = await seal(state, keyInfo);
        writeLocal(file);
        base = e.rev;
      }
    }
    throw new Error('Could not save after several tries.');
  }
  const token = state.github.token;
  if (!token) return { state, synced: false };

  let sha = localSha() || undefined;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const newSha = await writeRemote(file, sha, token);
      writeLocal(file, newSha);
      return { state, synced: true };
    } catch (e) {
      if (e.code !== 'CONFLICT') throw e;
      const remote = await readRemote(token);
      if (!remote) { sha = undefined; continue; }
      const theirs = await open(remote.file, keyInfo); // throws KEY_MISMATCH if passphrase changed elsewhere
      state = merge(state, theirs);
      file = await seal(state, keyInfo);
      writeLocal(file);
      sha = remote.sha;
    }
  }
  throw new Error('Could not save to GitHub after several tries.');
}

/** Pull the latest committed copy and merge it in (used on unlock and refocus). */
export async function pull(state, keyInfo) {
  const remote = await readRemote(state.github.token);
  if (!remote) return { state, changed: false };
  let merged = state;
  if (remote.kv) {
    merged = merge(merged, await open(remote.kv.file, keyInfo));
    // only move our revision forward if we have no unsaved edits of our own
    if (remote.kv.rev > localRev()) setLocalRev(remote.kv.rev);
  }
  if (remote.gh) {
    if (remote.sha) writeLocal(readLocal() || remote.gh.file, remote.sha);
    try { merged = merge(merged, await open(remote.gh.file, keyInfo)); } catch (e) {
      // after a passphrase change the old GitHub copy can't be opened; the cloud copy wins
      if (!(remote.kv && e.code === 'KEY_MISMATCH')) throw e;
    }
  }
  return { state: merged, changed: JSON.stringify(merged) !== JSON.stringify(state) };
}

/** Re-encrypt everything under a new key (passphrase change). */
export async function rekey(state, newKeyInfo) {
  const file = await seal(state, newKeyInfo);
  writeLocal(file);
  let done = false;
  if (state.push && state.push.dashKey) {
    const kv = await readKV();
    setLocalRev(await writeKV(file, kv ? kv.rev : 0, state.push.dashKey));
    done = true;
  }
  if (state.github.token) {
    const gh = await readGitHub(state.github.token);
    const sha = await writeRemote(file, gh && gh.sha, state.github.token);
    writeLocal(file, sha);
    done = true;
  }
  return done;
}

export { normalize };
