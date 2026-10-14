// Client-side encryption for the private vault.
//
// The passphrase never leaves the browser. It is stretched with PBKDF2
// (1,000,000 rounds of SHA-256) into an AES-256-GCM key, and only the
// ciphertext is ever written to localStorage or committed to GitHub.
// Without the passphrase the vault file is just random-looking bytes.

const enc = new TextEncoder();
const dec = new TextDecoder();

export const KDF_ITERATIONS = 1_000_000;
const MIN_ITERATIONS = 600_000; // refuse vault files weaker than this
const FORMAT = 'private-vault';
const VERSION = 1;

function toB64(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  }
  return btoa(s);
}

function fromB64(str) {
  const s = atob(str);
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}

async function deriveKey(passphrase, salt, iterations) {
  const base = await crypto.subtle.importKey(
    'raw', enc.encode(passphrase.normalize('NFKC')), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    base,
    { name: 'AES-GCM', length: 256 },
    false, // the key can never be exported out of the browser's crypto engine
    ['encrypt', 'decrypt']);
}

// The header is bound to the ciphertext, so tampering with it breaks decryption.
function aad(kdf) {
  return enc.encode(`${FORMAT}/v${VERSION}/${kdf.name}/${kdf.hash}/${kdf.iterations}/${kdf.salt}`);
}

/** Make a brand-new key from a passphrase (fresh random salt). */
export async function createKey(passphrase) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const kdf = { name: 'PBKDF2', hash: 'SHA-256', iterations: KDF_ITERATIONS, salt: toB64(salt) };
  const key = await deriveKey(passphrase, salt, KDF_ITERATIONS);
  return { key, kdf };
}

/** Encrypt a JS object into a vault file object. */
export async function seal(data, { key, kdf }) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, additionalData: aad(kdf) },
    key, enc.encode(JSON.stringify(data)));
  return { format: FORMAT, v: VERSION, kdf, iv: toB64(iv), ct: toB64(new Uint8Array(ct)) };
}

function checkFile(file) {
  if (!file || file.format !== FORMAT || file.v !== VERSION || !file.kdf) {
    throw new Error('This is not a vault file this page understands.');
  }
  const k = file.kdf;
  if (k.name !== 'PBKDF2' || k.hash !== 'SHA-256' || !(k.iterations >= MIN_ITERATIONS)) {
    throw new Error('Vault file uses unexpected (weaker) settings; refusing to use it.');
  }
}

/** Unlock a vault file with a passphrase. Returns { data, keyInfo }. */
export async function unlock(file, passphrase) {
  checkFile(file);
  const key = await deriveKey(passphrase, fromB64(file.kdf.salt), file.kdf.iterations);
  const keyInfo = { key, kdf: file.kdf };
  return { data: await open(file, keyInfo), keyInfo };
}

/** Decrypt a vault file with an already-derived key (same salt). */
export async function open(file, keyInfo) {
  checkFile(file);
  if (file.kdf.salt !== keyInfo.kdf.salt || file.kdf.iterations !== keyInfo.kdf.iterations) {
    const err = new Error('This vault was locked with a different passphrase.');
    err.code = 'KEY_MISMATCH';
    throw err;
  }
  try {
    const pt = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: fromB64(file.iv), additionalData: aad(file.kdf) },
      keyInfo.key, fromB64(file.ct));
    return JSON.parse(dec.decode(pt));
  } catch {
    const err = new Error('Wrong passphrase.');
    err.code = 'BAD_PASSPHRASE';
    throw err;
  }
}

/**
 * Rough passphrase strength in bits. The vault file is public, so anyone can
 * try guesses offline; we require enough length that guessing is hopeless.
 */
export function strength(p) {
  if (!p) return 0;
  let pool = 0;
  if (/[a-z]/.test(p)) pool += 26;
  if (/[A-Z]/.test(p)) pool += 26;
  if (/[0-9]/.test(p)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(p)) pool += 33;
  const unique = new Set(p).size;
  // Penalise heavy repetition ("aaaaaaaaaaaaaaaa").
  const effectiveLen = Math.min(p.length, unique * 3);
  return Math.round(effectiveLen * Math.log2(Math.max(pool, 2)));
}

export const MIN_LENGTH = 16;
export const MIN_BITS = 75;
