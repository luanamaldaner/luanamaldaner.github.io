// Degree map: both majors' requirements (public catalog info in dsreqs.js / mcbreqs.js) checked
// against her course record, which lives encrypted in the vault (a note with kind 'coursemap').

import { DS } from './dsreqs.js?v=1';
import { MCB } from './mcbreqs.js?v=1';

const norm = s => s.replace(/\s+/g, '').toUpperCase();
// "BSC 2010 & 2010L" -> ['BSC2010','BSC2010L'];  "CHM 2210 or CHM 2200" handled by alternatives
function parts(code) {
  const m = code.match(/^([A-Z]{3})\s*(\d{4}[A-Z]?)\s*&\s*(\d{4}[A-Z]?)$/);
  if (m) return [m[1] + m[2], m[1] + m[3]];
  return [norm(code)];
}
function status(alts, rec) {
  // alts: list of alternatives, each a list of parts; done if one alternative is fully done
  let best = 'need';
  for (const a of alts) {
    if (a.every(p => rec.done.has(p))) return 'done';
    if (a.every(p => rec.done.has(p) || rec.ip.has(p))) best = 'ip';
  }
  return best;
}
const ICON = { done: '✓', ip: '◐', need: '○', unknown: '·' };

function record(C) {
  let n = C.S().notes.find(x => !x.deleted && x.kind === 'coursemap');
  if (!n) { try { const t = localStorage.getItem('degree.preview'); if (t) n = { body: t }; } catch {} } // local preview only
  if (!n) return null;
  try { const j = JSON.parse(n.body); return { done: new Set(j.done.map(norm)), ip: new Set(j.ip.map(norm)), notes: j.notes || [], updated: j.updated, credits: j.credits, mcbAudit: j.mcbAudit || null, whatIfs: j.whatIfs || [], whatIfsRun: j.whatIfsRun }; } catch { return null; }
}

function row(C, label, title, st) {
  const { h } = C;
  return h('li', { class: `dg-row ${st}` }, h('span', { class: 'dg-ic', text: ICON[st] }), h('span', { class: 'dg-code', text: label }), h('span', { class: 'dg-title', text: title || '' }));
}

export function renderDegree(C) {
  const { h, card } = C;
  const rec = record(C);
  if (!rec) {
    return h('div', { class: 'page' }, h('header', { class: 'page-head' }, h('h1', { text: 'Degree map' })),
      card('No course record yet', null, h('p', { text: 'Ask Claude to read your ONE.UF degree audit; your completed courses get saved (encrypted) and this page fills in.' })));
  }
  const count = { done: 0, ip: 0, need: 0 };
  const tally = st => { if (count[st] !== undefined) count[st]++; return st; };

  const dsGroups = DS.groups.map(g => card(g.name, null, h('ul', { class: 'dg-list' }, g.courses.map(([code, title]) => {
    if (code === 'ELECTIVE') return row(C, 'Electives', title, 'unknown');
    const alts = code.split('|').map(c => [norm(c)]);
    return row(C, code.replace(/(\D)(\d)/, '$1 $2').replace('|', ' / '), title, tally(status(alts, rec)));
  }))));

  // Prefer the What-If audit (her real record) over the catalog list when it's saved.
  const mcbGroups = rec.mcbAudit ? rec.mcbAudit.map(g => card(g.group, null, h('ul', { class: 'dg-list' }, g.items.map(it => {
    tally(it.status);
    return h('li', { class: `dg-row ${it.status}` }, h('span', { class: 'dg-ic', text: ICON[it.status] || '·' }), h('span', { class: 'dg-code', text: it.label }), h('span', { class: 'dg-title muted', text: it.detail || '' }));
  })))) : MCB.groups.filter(g => g.name !== 'Programming Requirement').map(g => {
    // Physics is "option 1 OR option 2"; show both rows but they read as alternatives
    return card(g.name, g.note ? h('span', { class: 'card-meta', text: g.note }) : null, h('ul', { class: 'dg-list' }, g.courses.map(c => {
      const alts = [parts(c.code), ...(c.alt || []).map(parts)];
      const label = [c.code, ...(c.alt || [])].join(' / ');
      return row(C, label, c.title, tally(status(alts, rec)));
    })));
  });

  // what to aim for next: the next critical-tracking items that aren't done yet
  const nextDS = DS.tracking.flatMap(t => t.items.map(i => ({ i, sem: t.sem }))).filter(x => x.i !== 'ELECTIVE' && status(x.i.split('|').map(c => [norm(c)]), rec) === 'need').slice(0, 6);
  const mcbTrack = rec.mcbAudit ? rec.mcbAudit[0].items.filter(i => i.status === 'need').map(i => ({ i: i.label, sem: (i.detail || '').replace('tracking semester ', '') })) : MCB.tracking.flatMap(t => t.items.map(i => ({ i, sem: t.sem }))).filter(x => {
    const alts = x.i.split(/\s+or\s+/).map(a => a.split('/').map(norm));
    return status(alts, rec) === 'need';
  }).slice(0, 4);

  // other majors / minors she asked to compare (ONE.UF What-If runs)
  const whatIfs = rec.whatIfs.length ? card('What-if options', h('span', { class: 'card-meta', text: `checked ${rec.whatIfsRun || ''}` }),
    h('div', { class: 'dg-wi' }, rec.whatIfs.map(w => h('details', { class: 'dg-wi-item' },
      h('summary', null, h('span', { class: 'dg-wi-name', text: w.name }),
        h('span', { class: `chip dg-wi-tag${w.audit === 'none' ? ' warn' : ''}`, text: w.audit === 'none' ? 'no audit' : w.credits ? `${w.credits} cr to go` : `${w.need.length} items to go` })),
      w.need.length ? h('ul', { class: 'bullets small' }, w.need.map(t => h('li', { text: t }))) : null,
      w.note ? h('p', { class: 'small muted', text: w.note }) : null)))) : null;

  return h('div', { class: 'page' },
    h('header', { class: 'page-head' }, h('div', null, h('h1', { text: 'Degree map' }),
      h('p', { class: 'muted small', text: `Data Science + Microbiology & Cell Science · record from your degree audit (${rec.updated}) · ✓ done ◐ in progress ○ still needed` }))),
    h('div', { class: 'dg-summary' },
      h('div', null, h('strong', { text: String(count.done) }), h('span', { text: 'requirements done' })),
      h('div', null, h('strong', { text: String(count.ip) }), h('span', { text: 'in progress now' })),
      h('div', null, h('strong', { text: String(count.need) }), h('span', { text: 'still to take' })),
      rec.credits ? h('div', null, h('strong', { text: `${rec.credits.taken}` }), h('span', { text: 'credits counted so far' })) : null),
    h('div', { class: 'grid' },
      h('div', { class: 'col' },
        h('h2', { class: 'dg-h', text: 'Data Science' }), ...dsGroups,
        h('h2', { class: 'dg-h', text: 'Microbiology & Cell Science' }), ...mcbGroups),
      h('div', { class: 'col col-narrow' },
        whatIfs,
        card('Up next (critical tracking)', null,
          h('p', { class: 'small', text: 'Data Science:' }),
          h('ul', { class: 'bullets small' }, nextDS.map(x => h('li', { text: `${x.i.replace('|', ' or ').replace(/([A-Z]{3})(\d)/g, '$1 $2')} · tracking semester ${x.sem}` }))),
          h('p', { class: 'small', text: 'Microbiology:' }),
          h('ul', { class: 'bullets small' }, mcbTrack.map(x => h('li', { text: `${x.i} · tracking semester ${x.sem}` })))),
        rec.notes.length ? card('Other things your audit flags', null, h('ul', { class: 'bullets small' }, rec.notes.map(t => h('li', { text: t })))) : null,
        h('p', { class: 'muted small', text: 'Study aid, not an official audit: your ONE.UF audit and advisors have the final word. The Microbiology side comes from the UF catalog.' }))));
}
