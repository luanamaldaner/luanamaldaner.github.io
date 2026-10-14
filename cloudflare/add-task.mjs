#!/usr/bin/env node
// Drop tasks into your dashboard's inbox from the command line.
//
//   node add-task.mjs "Make Orgo flashcards" "Pick up package" --due 2026-10-28 --tag Orgo
//
// Options (apply to every title given): --due YYYY-MM-DD  --time HH:MM  --tag NAME
// Needs your helper key: set DASH_HELPER_KEY, or save it in ~/.dashboard-helper-key
// Tasks are encrypted here before sending; the helper only stores scrambled data.

import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HELPER = 'https://dash-helper.qwsfzueh.workers.dev';
const here = dirname(fileURLToPath(import.meta.url));
const { sealItem } = await import(pathToFileURL(join(here, '..', 'private', 'inbox.js')).href);

const args = process.argv.slice(2);
const opts = {};
const titles = [];
for (let i = 0; i < args.length; i++) {
  const m = args[i].match(/^--(due|time|tag)$/);
  if (m) opts[m[1]] = args[++i];
  else titles.push(args[i]);
}
if (!titles.length) {
  console.log('Usage: node add-task.mjs "Task one" ["Task two" ...] [--due YYYY-MM-DD] [--time HH:MM] [--tag NAME]');
  process.exit(1);
}
if (opts.due && !/^\d{4}-\d{2}-\d{2}$/.test(opts.due)) { console.error('--due must look like 2026-10-28'); process.exit(1); }
if (opts.time && !/^\d{2}:\d{2}$/.test(opts.time)) { console.error('--time must look like 23:59'); process.exit(1); }

let key = process.env.DASH_HELPER_KEY;
if (!key) {
  try { key = readFileSync(join(homedir(), '.dashboard-helper-key'), 'utf8').trim(); } catch {}
}
if (!key) { console.error('No helper key. Set DASH_HELPER_KEY or save it in ~/.dashboard-helper-key'); process.exit(1); }

const kr = await fetch(`${HELPER}/inbox/key`);
const { publicKey, error } = await kr.json();
if (!publicKey) { console.error(error || 'Could not get the inbox key.'); process.exit(1); }

for (const title of titles) {
  const sealed = await sealItem(publicKey, { title, due: opts.due || '', time: opts.time || '', tag: opts.tag || '' });
  const r = await fetch(`${HELPER}/inbox`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Dash-Key': key }, body: JSON.stringify(sealed) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) { console.error(`✗ ${title}: ${j.error || r.status}`); process.exitCode = 1; continue; }
  console.log(`✓ ${title}`);
}
console.log('They’ll appear in Tasks the next time your dashboard is open or unlocked.');
