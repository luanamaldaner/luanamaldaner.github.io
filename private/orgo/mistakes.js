// Orgo questions you got wrong (roulette and quiz) become flashcards in the Cards page
// ("Orgo mistakes" deck). Kept on this device; the newest 150 are kept.

const KEY = 'orgo.mistakes';

export function getMistakes() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

export function addMistake(front, back) {
  const list = getMistakes();
  let hash = 0;
  for (const ch of front) hash = (hash * 31 + ch.codePointAt(0)) | 0;
  const id = `om:${(hash >>> 0).toString(36)}`;
  const i = list.findIndex(m => m.id === id);
  if (i >= 0) list.splice(i, 1);
  list.push({ id, deck: 'Orgo mistakes', front, back, at: Date.now() });
  try { localStorage.setItem(KEY, JSON.stringify(list.slice(-150))); } catch {}
}

export function removeMistake(id) {
  try { localStorage.setItem(KEY, JSON.stringify(getMistakes().filter(m => m.id !== id))); } catch {}
}
