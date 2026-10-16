// Collectible packs: every 10 correct answers anywhere (roulette, boss, quizzes, mock exams)
// earns a pack of 3 microbe cards. Rarer kinds show up less often. Kept on this device.

const KEY = 'packs';
function load() { try { return { correct: 0, opened: 0, owned: {}, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { return { correct: 0, opened: 0, owned: {} }; } }
function save(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {} }

export const PER_PACK = 10;
export function addCorrect(n = 1) { const p = load(); p.correct += n; save(p); }
export function packState() { const p = load(); return { ...p, ready: Math.floor(p.correct / PER_PACK) - p.opened, toNext: PER_PACK - (p.correct % PER_PACK) }; }

// rarity by kind: viruses and archaea are the rare pulls
const WEIGHT = { Bacterium: 5, Fungus: 4, Protist: 3, Archaeon: 2, Virus: 1.5 };
export const RARITY = { Bacterium: 'Common', Fungus: 'Common', Protist: 'Uncommon', Archaeon: 'Rare', Virus: 'Rare' };

export function openPack(MICROBES) {
  const p = load();
  if (Math.floor(p.correct / PER_PACK) - p.opened <= 0) return null;
  const total = MICROBES.reduce((a, m) => a + (WEIGHT[m.kind] || 3), 0);
  const pulls = [];
  for (let k = 0; k < 3; k++) {
    let r = Math.random() * total;
    const m = MICROBES.find(x => (r -= WEIGHT[x.kind] || 3) <= 0) || MICROBES[0];
    pulls.push({ name: m.name, isNew: !p.owned[m.name] && !pulls.some(q => q.name === m.name) });
    p.owned[m.name] = (p.owned[m.name] || 0) + 1;
  }
  p.opened++;
  save(p);
  return pulls;
}
