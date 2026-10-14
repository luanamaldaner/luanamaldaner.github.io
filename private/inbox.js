// Task inbox encryption. Anyone with the public key can seal a task; only
// the private key (kept inside your encrypted vault) can open it.
// ECDH P-256 + HKDF-SHA-256 + AES-256-GCM, all built into the browser.

const enc = new TextEncoder();
const dec = new TextDecoder();
const INFO = enc.encode('dashboard-inbox-v1');

const b64u = bytes => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), c => c.charCodeAt(0));

export async function newInboxKeys() {
  const kp = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const pub = b64u(new Uint8Array(await crypto.subtle.exportKey('raw', kp.publicKey)));
  const priv = await crypto.subtle.exportKey('jwk', kp.privateKey);
  return { pub, priv };
}

async function aesKey(shared, epkRaw, usage) {
  const ikm = await crypto.subtle.importKey('raw', shared, 'HKDF', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'HKDF', hash: 'SHA-256', salt: epkRaw, info: INFO }, ikm, { name: 'AES-GCM', length: 256 }, false, [usage]);
}

/** Seal an object to the inbox public key (the same code runs in add-task.mjs). */
export async function sealItem(pubB64, obj) {
  const recipient = await crypto.subtle.importKey('raw', unb64u(pubB64), { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const eph = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const epkRaw = new Uint8Array(await crypto.subtle.exportKey('raw', eph.publicKey));
  const shared = await crypto.subtle.deriveBits({ name: 'ECDH', public: recipient }, eph.privateKey, 256);
  const key = await aesKey(shared, epkRaw, 'encrypt');
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(JSON.stringify(obj))));
  return { epk: b64u(epkRaw), iv: b64u(iv), ct: b64u(ct) };
}

/** Open a sealed inbox item with the private key from the vault. */
export async function openItem(privJwk, item) {
  const priv = await crypto.subtle.importKey('jwk', privJwk, { name: 'ECDH', namedCurve: 'P-256' }, false, ['deriveBits']);
  const epkRaw = unb64u(item.epk);
  const epk = await crypto.subtle.importKey('raw', epkRaw, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const shared = await crypto.subtle.deriveBits({ name: 'ECDH', public: epk }, priv, 256);
  const key = await aesKey(shared, epkRaw, 'decrypt');
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64u(item.iv) }, key, unb64u(item.ct));
  return JSON.parse(dec.decode(pt));
}
