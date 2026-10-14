// Turns a chat reply into food log entries.
// Main format (what the copied prompt asks for), one food per line:
//   Chicken burrito bowl | 650 | 45 | 70 | 18 | 5 | 8
// Also understands markdown tables and loose lines like
//   "Greek yogurt: 150 cal, 15g protein, 8g carbs, 4g fat, 6g sugar, 0g fiber"

export const CHAT_PROMPT = 'Estimate the nutrition of this meal for my food log. Reply with one line per food in exactly this format and nothing else:\n' +
  'Food name | calories | protein g | carbs g | fat g | sugar g | fiber g';

const KEYS = ['cal', 'protein', 'carbs', 'fat', 'sugar', 'fiber'];
const num = s => { const m = String(s).replace(/,/g, '').match(/-?\d+(?:\.\d+)?/); return m ? Math.max(0, Math.round(Number(m[0]))) : 0; };

function fromPipes(line) {
  const cells = line.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map(c => c.trim());
  if (cells.length < 2) return null;
  if (cells.every(c => /^:?-{2,}:?$/.test(c) || !c)) return null;            // table divider
  if (!/\d/.test(cells.slice(1).join(''))) return null;                       // header row
  const name = cells[0].replace(/^[*\-•\d.)\s]+/, '').replace(/\*\*/g, '').trim();
  if (!name || /^total\b/i.test(name)) return null;
  const vals = cells.slice(1).map(num);
  const entry = { name };
  KEYS.forEach((k, i) => { entry[k] = vals[i] || 0; });
  return entry.cal ? entry : null;
}

const PATTERNS = {
  cal: /(\d[\d,]*(?:\.\d+)?)\s*(?:k?cals?|calories|kcal)\b/i,
  protein: /(?:(\d+(?:\.\d+)?)\s*g?\s*(?:of\s+)?protein|protein\s*[:=]?\s*(\d+(?:\.\d+)?))/i,
  carbs: /(?:(\d+(?:\.\d+)?)\s*g?\s*(?:of\s+)?carb(?:ohydrate)?s?|carb(?:ohydrate)?s?\s*[:=]?\s*(\d+(?:\.\d+)?))/i,
  fat: /(?:(\d+(?:\.\d+)?)\s*g?\s*(?:of\s+)?fat|fat\s*[:=]?\s*(\d+(?:\.\d+)?))/i,
  sugar: /(?:(\d+(?:\.\d+)?)\s*g?\s*(?:of\s+)?sugars?|sugars?\s*[:=]?\s*(\d+(?:\.\d+)?))/i,
  fiber: /(?:(\d+(?:\.\d+)?)\s*g?\s*(?:of\s+)?fib(?:er|re)|fib(?:er|re)\s*[:=]?\s*(\d+(?:\.\d+)?))/i,
};

function fromWords(line) {
  const cal = line.match(PATTERNS.cal);
  if (!cal) return null;
  const firstNum = line.search(/\d/);
  const name = line.slice(0, firstNum).replace(/[\s—–:\-,(~≈]+$/, '').replace(/^[*\-•\d.)\s]+/, '').replace(/\*\*/g, '').trim();
  if (!name || /^total\b/i.test(name)) return null;
  const entry = { name, cal: num(cal[1]) };
  for (const k of KEYS.slice(1)) {
    const m = line.match(PATTERNS[k]);
    entry[k] = m ? num(m[1] || m[2]) : 0;
  }
  return entry;
}

export function parseFoodText(text) {
  const out = [];
  for (const raw of String(text || '').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const e = line.includes('|') ? fromPipes(line) : fromWords(line);
    if (e) out.push({ ...e, name: e.name.slice(0, 80) });
  }
  return out;
}
