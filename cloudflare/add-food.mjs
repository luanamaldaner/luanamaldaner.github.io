#!/usr/bin/env node
// Log food into your dashboard from the command line, via the encrypted inbox.
//
//   node add-food.mjs "Chicken burrito bowl | 650 | 45 | 70 | 18 | 5 | 8"
//   node add-food.mjs "Greek yogurt | 150 | 15 | 8 | 4 | 6 | 0" "Banana | 105 | 1 | 27 | 0 | 14 | 3" --date 2026-10-15
//
// Format: name | calories | protein g | carbs g | fat g | sugar g | fiber g
// (looser lines like "Oatmeal: 300 calories, 10g protein, ..." work too).
// Needs your helper key: DASH_HELPER_KEY, or ~/.dashboard-helper-key

import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HELPER = 'https://dash-helper.qwsfzueh.workers.dev';
const here = dirname(fileURLToPath(import.meta.url));
const load = f => import(pathToFileURL(join(here, '..', 'private', f)).href);
const { sealItem } = await load('inbox.js');
const { parseFoodText } = await load('foodparse.js');

const args = process.argv.slice(2);
let date = '';
const lines = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--date') date = args[++i];
  else lines.push(args[i]);
}
if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) { console.error('--date must look like 2026-10-15'); process.exit(1); }
const foods = parseFoodText(lines.join('\n'));
if (!foods.length) {
  console.log('Usage: node add-food.mjs "Food | calories | protein | carbs | fat | sugar | fiber" [...] [--date YYYY-MM-DD]');
  process.exit(1);
}

let key = process.env.DASH_HELPER_KEY;
if (!key) { try { key = readFileSync(join(homedir(), '.dashboard-helper-key'), 'utf8').trim(); } catch {} }
if (!key) { console.error('No helper key. Set DASH_HELPER_KEY or save it in ~/.dashboard-helper-key'); process.exit(1); }

const { publicKey, error } = await (await fetch(`${HELPER}/inbox/key`)).json();
if (!publicKey) { console.error(error || 'Could not get the inbox key.'); process.exit(1); }

for (const f of foods) {
  const sealed = await sealItem(publicKey, { type: 'food', date, ...f });
  const r = await fetch(`${HELPER}/inbox`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Dash-Key': key }, body: JSON.stringify(sealed) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) { console.error(`✗ ${f.name}: ${j.error || r.status}`); process.exitCode = 1; continue; }
  console.log(`✓ ${f.name} · ${f.cal} cal · P ${f.protein} · C ${f.carbs} · F ${f.fat} · Sugar ${f.sugar} · Fiber ${f.fiber}`);
}
console.log('It’ll appear in your food log the next time your dashboard is open or unlocked.');
