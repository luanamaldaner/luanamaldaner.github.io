// Career: internships and scholarships Claude finds, the profile it drafts
// applications from, and the review queue where those drafts wait.
//
// Nothing here submits anything. Approving a draft only unlocks the
// "submit kit" (open the form, copy each answer); the final Submit, logins,
// CAPTCHAs, payments and signatures are always Luana's.
//
// Data (all inside the encrypted vault):
//   S.internships[]   openings; kind 'scholarship' or internship (default),
//                     status ''|applied|skipped, skipReason/skipNote,
//                     app { status requested|ready|approved|submitted|rejected, fields, essays, ... }
//   S.notes[]         one note with kind 'profile' whose `data` holds the profile

let C;
export function initCareer(ctx) { C = ctx; }

export const SKIP_REASONS = [
  ['not_qualified', 'I don’t qualify'],
  ['deadline_passed', 'Due date passed'],
  ['not_interested', 'Not interested'],
  ['too_much_work', 'Too much work'],
  ['applied_elsewhere', 'Applied elsewhere'],
  ['other', 'Other'],
];
const reasonLabel = r => (SKIP_REASONS.find(x => x[0] === r) || [0, 'no reason yet'])[1];

const safeUrl = u => (typeof u === 'string' && /^https:\/\//i.test(u) ? u : null);
const isSchol = it => it.kind === 'scholarship';
const appOf = it => (it.app && it.app.status ? it.app : null);

let filter = 'open';
let skipping = null;      // id of the opening whose "why not?" picker is open
let rejecting = null;     // id of the draft whose reject form is open
let openApp = null;       // id of the draft shown expanded on the Applications page

// ---------------------------------------------------------------- deadlines

function deadline(it) {
  const { todayStr, daysBetween, fmtShort } = C;
  if (it.deadline) {
    const days = daysBetween(todayStr(), it.deadline);
    if (days < 0) return { text: `Closed ${fmtShort(it.deadline)}`, cls: 'past', days };
    return { text: days === 0 ? 'Due today' : days <= 14 ? `Due in ${days} days · ${fmtShort(it.deadline)}` : `Due ${fmtShort(it.deadline)}`, cls: days <= 14 ? 'soon' : '', days };
  }
  return { text: it.deadlineNote || 'Deadline not posted', cls: '', days: 9999 };
}

export function internOpen(it) { return !it.status && deadline(it).days >= 0; }
const closedNoAnswer = it => !it.status && deadline(it).days < 0;

function sorted(list) {
  return list.sort((a, b) => deadline(a).days - deadline(b).days || (a.org || '').localeCompare(b.org || ''));
}

// Today's three: the ones Claude picked for today (kept even after you apply),
// topped up with the soonest open deadlines if fewer than three were picked.
function todaysPicks() {
  const today = C.todayStr();
  const all = C.live('internships');
  // Once today's 3 are shown they stay put: marking one Applied counts it instead of swapping it out.
  const doneToday = it => it.status === 'applied' && it.statusAt && new Date(it.statusAt).toLocaleDateString('en-CA') === today;
  const picked = all.filter(it => (it.pick === today || doneToday(it)) && it.status !== 'skipped');
  const rest = sorted(all.filter(it => internOpen(it) && !picked.includes(it)));
  const list = [...picked, ...rest].slice(0, 3);
  if (!all.some(it => it.pick === today) && list.length) setTimeout(() => C.commit(() => list.forEach(it => { if (it.pick !== today) { it.pick = today; C.touch(it); } })), 0);
  return list;
}

// ---------------------------------------------------------------- status changes

function setStatus(it, status) {
  C.commit(() => {
    it.status = status; it.statusAt = status ? Date.now() : 0;
    if (status !== 'skipped') { it.skipReason = ''; it.skipNote = ''; }
    C.touch(it);
  });
}

function setSkip(it, reason, note) {
  skipping = null;
  C.commit(() => {
    it.status = 'skipped'; it.statusAt = Date.now();
    it.skipReason = reason; it.skipNote = (note || '').trim().slice(0, 300);
    if (it.app && it.app.status === 'requested') it.app.status = it.app.fields ? 'rejected' : ''; // no point drafting it now
    C.touch(it);
  });
}

function requestDraft(it) {
  C.commit(() => { it.app = { ...(it.app || {}), status: 'requested', requestedAt: Date.now() }; C.touch(it); });
}

// "Why not?" buttons. The note is optional except for Other.
function skipPicker(it, { closed = false } = {}) {
  const { h } = C;
  const note = h('input', { class: 'skip-note', placeholder: 'Note (optional; needed for Other)', 'aria-label': 'Why not, in your words', maxlength: 300, value: it.skipNote || '' });
  return h('div', { class: 'skip-picker', role: 'group', 'aria-label': 'Why not?' },
    h('div', { class: 'skip-q', text: closed ? 'Closed without applying. Why?' : 'Why not?' }),
    h('div', { class: 'chips' }, SKIP_REASONS.map(([k, label]) => h('button', {
      type: 'button',
      class: `chip chip-btn${it.skipReason === k || (closed && !it.skipReason && k === 'deadline_passed') ? ' on' : ''}`,
      onclick: () => {
        if (k === 'other' && !note.value.trim()) { note.placeholder = 'Say why, then tap Other'; note.focus(); return; }
        setSkip(it, k, note.value);
      },
    }, label))),
    h('div', { class: 'skip-row' }, note,
      closed ? null : h('button', { class: 'link', type: 'button', text: 'Cancel', onclick: () => { skipping = null; C.render(); } })));
}

function appButton(it) {
  const { h } = C;
  const a = appOf(it);
  if (!a || a.status === 'rejected') {
    return h('button', { class: 'btn btn-small', type: 'button', title: 'Claude fills in every field and drafts the essays for you to review', text: a ? 'Redraft' : 'Draft it for me', onclick: () => requestDraft(it) });
  }
  if (a.status === 'requested') {
    return h('span', { class: 'intern-badge drafting', title: 'Pink Slime picks these up; ask it on Discord to hurry', text: 'Draft requested…' });
  }
  if (a.status === 'ready') return h('button', { class: 'btn btn-small btn-primary', type: 'button', text: 'Review draft', onclick: () => { openApp = it.id; C.go('applications'); } });
  if (a.status === 'approved') return h('button', { class: 'btn btn-small btn-primary', type: 'button', text: 'Submit kit', onclick: () => { openApp = it.id; C.go('applications'); } });
  return null;
}

function actions(it, compact) {
  const { h } = C;
  const url = safeUrl(it.url);
  const undo = h('button', { class: 'link', type: 'button', text: 'Undo', onclick: () => setStatus(it, '') });
  if (it.status === 'applied') {
    return h('div', { class: 'intern-actions' }, h('span', { class: 'intern-badge applied', text: 'Applied ✿' }), undo);
  }
  if (skipping === it.id) return skipPicker(it);
  if (it.status === 'skipped') {
    return h('div', { class: 'intern-actions' },
      h('span', { class: 'intern-badge', text: `Skipped · ${reasonLabel(it.skipReason)}${it.skipNote ? ` · “${it.skipNote}”` : ''}` }),
      h('button', { class: 'link', type: 'button', text: it.skipReason ? 'Change' : 'Say why', onclick: () => { skipping = it.id; C.render(); } }),
      undo);
  }
  if (closedNoAnswer(it)) return skipPicker(it, { closed: true });
  return h('div', { class: 'intern-actions' },
    url ? h('a', { class: 'btn btn-small btn-primary', href: url, target: '_blank', rel: 'noopener noreferrer', text: 'Apply ↗' }) : null,
    compact ? null : appButton(it),
    h('button', { class: 'btn btn-small', type: 'button', text: 'Applied', onclick: () => setStatus(it, 'applied') }),
    h('button', { class: 'btn btn-small btn-quiet', type: 'button', text: compact ? 'Skip' : 'Not applying', onclick: () => { skipping = it.id; C.render(); } }));
}

function kindBadge(it) {
  const { h } = C;
  if (isSchol(it)) return h('span', { class: 'intern-type schol', text: 'Scholarship' });
  return h('span', { class: `intern-type ${it.type === 'research' ? 'research' : 'industry'}`, text: it.type === 'research' ? 'Research' : 'Industry' });
}

function row(it, compact = false) {
  const { h, daysBetween, todayStr } = C;
  const dl = deadline(it);
  const isNew = it.addedAt && daysBetween(it.addedAt, todayStr()) <= 1;
  const a = appOf(it);
  return h('li', { class: `intern${it.status ? ` is-${it.status}` : ''}` },
    h('div', { class: 'intern-top' },
      kindBadge(it),
      isNew && !compact ? h('span', { class: 'intern-new', text: 'New' }) : null,
      a && a.status === 'ready' && compact ? h('span', { class: 'intern-new', text: 'Draft ready' }) : null,
      h('span', { class: `intern-due ${dl.cls}`, text: dl.text })),
    h('div', { class: 'intern-title', text: it.title }),
    h('div', { class: 'intern-org', text: [it.org, it.location].filter(Boolean).join(' · ') }),
    it.amount || it.pay ? h('div', { class: 'intern-pay', text: it.amount || it.pay }) : null,
    !compact && it.why ? h('p', { class: 'intern-why', text: it.why }) : null,
    !compact && it.eligibility ? h('p', { class: 'intern-elig', text: it.eligibility }) : null,
    !compact && it.effort ? h('p', { class: 'intern-elig', text: `Effort: ${it.effort}` }) : null,
    !compact && it.fields && it.fields.length ? h('div', { class: 'chips' }, it.fields.slice(0, 5).map(f => h('span', { class: 'chip', text: f }))) : null,
    actions(it, compact));
}

// ---------------------------------------------------------------- Today card

export function internsCard() {
  const { h, card, live, go } = C;
  const all = live('internships');
  if (!all.length) return null;
  const picks = todaysPicks();
  const done = picks.filter(it => it.status === 'applied').length;
  const ready = all.filter(it => appOf(it) && appOf(it).status === 'ready').length;
  return card('Apply today', h('span', { class: 'card-meta', text: `${done} / ${picks.length} done` }),
    ready ? h('button', { class: 'btn btn-small btn-primary drafts-ready', type: 'button', text: `${ready} draft${ready === 1 ? '' : 's'} ready to review →`, onclick: () => go('applications') }) : null,
    picks.length ? h('ul', { class: 'interns compact' }, picks.map(it => row(it, true)))
      : h('p', { class: 'empty', text: 'Nothing open right now. New ones land every day ✿' }),
    h('button', { class: 'link center-link', type: 'button', text: `See all ${all.filter(internOpen).length} open →`, onclick: () => go('internships') }));
}

// ---------------------------------------------------------------- Openings page

export function renderInternships() {
  const { h, card, live, daysBetween, todayStr } = C;
  const all = live('internships');
  const filters = [
    ['open', 'Open', it => internOpen(it)],
    ['intern', 'Internships', it => internOpen(it) && !isSchol(it)],
    ['schol', 'Scholarships', it => internOpen(it) && isSchol(it)],
    ['research', 'Research', it => internOpen(it) && !isSchol(it) && it.type === 'research'],
    ['industry', 'Industry', it => internOpen(it) && !isSchol(it) && it.type !== 'research'],
    ['abroad', 'Abroad', it => internOpen(it) && it.country && it.country !== 'US'],
    ['new', 'New', it => internOpen(it) && it.addedAt && daysBetween(it.addedAt, todayStr()) <= 1],
    ['closed', 'Closed, say why', closedNoAnswer],
    ['applied', 'Applied', it => it.status === 'applied'],
    ['skipped', 'Not applying', it => it.status === 'skipped'],
  ];
  const [, , test] = filters.find(f => f[0] === filter) || filters[0];
  const shown = sorted(all.filter(test));
  const applied = all.filter(it => it.status === 'applied').length;
  const picks = todaysPicks();
  const skipped = all.filter(it => it.status === 'skipped');
  const reasons = SKIP_REASONS.map(([k, l]) => [l, skipped.filter(it => it.skipReason === k).length]).filter(([, n]) => n);
  const unexplained = skipped.filter(it => !it.skipReason).length;

  return h('div', { class: 'page' },
    h('header', { class: 'page-head' },
      h('h1', { text: 'Internships & scholarships' }),
      h('p', { class: 'meta', text: `Paid roles and scholarships in data science, biology, biotech and nearby fields, each checked against the official page. ${applied} applied so far.` })),
    picks.length ? card('Your three for today', null, h('ul', { class: 'interns picks' }, picks.map(it => row(it)))) : null,
    h('section', { class: 'card' },
      h('header', { class: 'card-head' }, h('h2', { text: 'Everything' }), h('span', { class: 'card-meta', text: `${shown.length} shown` })),
      h('div', { class: 'chips intern-filters' }, filters.map(([key, label, t]) => {
        const n = all.filter(t).length;
        if (!n && key !== filter && (key === 'closed' || key === 'abroad' || key === 'new')) return null;
        return h('button', { type: 'button', class: `chip chip-btn${filter === key ? ' on' : ''}`, onclick: () => { filter = key; C.render(); } }, `${label} · ${n}`);
      })),
      filter === 'skipped' && skipped.length ? h('p', { class: 'meta skip-summary', text: `Why: ${reasons.map(([l, n]) => `${l} ${n}`).join(' · ')}${unexplained ? `${reasons.length ? ' · ' : ''}${unexplained} without a reason (tap “Say why”)` : ''}. Claude reads these before each search.` }) : null,
      shown.length ? h('ul', { class: 'interns' }, shown.map(it => row(it)))
        : h('p', { class: 'empty', text: all.length ? 'Nothing here.' : 'Your first batch is on its way ✿' })));
}

// ---------------------------------------------------------------- profile

const PROFILE = [
  ['Contact', [
    ['contact.fullName', 'Full legal name'], ['contact.preferredName', 'Preferred name'],
    ['contact.email', 'School email'], ['contact.altEmail', 'Personal email'], ['contact.phone', 'Phone'],
    ['contact.address', 'Street address'], ['contact.city', 'City'], ['contact.state', 'State'], ['contact.zip', 'ZIP'], ['contact.country', 'Country'],
    ['contact.linkedin', 'LinkedIn'], ['contact.github', 'GitHub'], ['contact.website', 'Website'], ['contact.pronouns', 'Pronouns (optional)'],
  ]],
  ['Eligibility', [
    ['elig.citizenship', 'Citizenship / residency status'], ['elig.workAuth', 'Authorized to work in the US?'],
    ['elig.sponsorship', 'Need visa sponsorship now or later?'], ['elig.firstGen', 'First-generation college student?'],
    ['elig.identity', 'Background you’re happy to share (e.g. Hispanic/Latina, born in Brazil)'],
    ['elig.eeo', 'Default for optional EEO questions (gender, race, veteran, disability)', 'Decline to answer'],
  ]],
  ['School', [
    ['school.university', 'University'], ['school.college', 'College'], ['school.majors', 'Major(s)'], ['school.minors', 'Minor(s)'],
    ['school.standing', 'Class standing'], ['school.start', 'Started'], ['school.grad', 'Expected graduation'],
    ['school.gpa', 'GPA'], ['school.majorGpa', 'Major / science GPA'], ['school.credits', 'Credits completed'],
  ]],
  ['Availability', [
    ['avail.start', 'Earliest start date'], ['avail.end', 'Latest end date'], ['avail.hours', 'Hours/week during the semester'], ['avail.relocate', 'Relocation'],
  ]],
  ['Background', [
    ['courses', 'Relevant courses (one per line)', '', true], ['experience', 'Research and work experience', '', true],
    ['projects', 'Projects', '', true], ['leadership', 'Leadership and activities', '', true],
    ['awards', 'Honors and awards', '', true], ['skills', 'Skills', '', true], ['languages', 'Languages', '', true],
    ['interests', 'Research / career interests and goals', '', true],
  ]],
  ['Resume', [
    ['resume.link', 'Where your resume PDF lives (for uploads)', 'https://…'], ['resume.text', 'Resume text', '', true],
  ]],
  ['References', [['references', 'Recommenders: name, title, email, how they know you, which apps they’ve agreed to', '', true]]],
];
// The ones a typical application can't do without.
const KEY_FIELDS = ['contact.fullName', 'contact.email', 'contact.phone', 'contact.city', 'contact.state', 'elig.citizenship', 'elig.workAuth',
  'school.university', 'school.majors', 'school.grad', 'school.gpa', 'courses', 'experience', 'skills', 'resume.text', 'references'];

const getPath = (o, p) => p.split('.').reduce((x, k) => (x && typeof x === 'object' ? x[k] : undefined), o);
function setPath(o, p, v) {
  const ks = p.split('.');
  let x = o;
  for (const k of ks.slice(0, -1)) { if (!x[k] || typeof x[k] !== 'object') x[k] = {}; x = x[k]; }
  x[ks[ks.length - 1]] = v;
}

function profileNote(create) {
  const { S, touch, uid } = C;
  let n = S().notes.find(x => !x.deleted && x.kind === 'profile');
  if (!n && create) { n = touch({ id: uid(), kind: 'profile', title: 'Application profile', body: '', data: {} }); S().notes.push(n); }
  if (n && (!n.data || typeof n.data !== 'object')) n.data = {};
  return n;
}

export function profileMissing() {
  const n = profileNote(false);
  return KEY_FIELDS.filter(p => !String(getPath(n ? n.data : {}, p) || '').trim());
}

export function renderProfile() {
  const { h, card, touch, uid, scheduleSave, S } = C;
  const n = profileNote(false);
  const data = n ? n.data : {};
  const edit = (path, v) => { const note = profileNote(true); setPath(note.data, path, v); touch(note); scheduleSave(1500); };
  const missing = profileMissing();
  const labelOf = p => PROFILE.flatMap(([, f]) => f).find(f => f[0] === p)[1];

  const field = ([path, label, placeholder, long]) => {
    const v = getPath(data, path) || '';
    const id = `pf-${path.replace(/\./g, '-')}`;
    const input = long
      ? h('textarea', { id, class: 'pf-long', rows: Math.min(14, Math.max(3, String(v).split('\n').length + 1)), placeholder: placeholder || '', value: v, oninput: e => edit(path, e.target.value) })
      : h('input', { id, placeholder: placeholder || '', value: v, autocomplete: 'off', oninput: e => edit(path, e.target.value) });
    return h('div', { class: `pf-field${long ? ' pf-wide' : ''}${KEY_FIELDS.includes(path) && !String(v).trim() ? ' pf-missing' : ''}` },
      h('label', { for: id, text: label }), input);
  };

  // Courses can start from the degree audit Claude already saved.
  const cm = S().notes.find(x => !x.deleted && x.kind === 'coursemap');
  let fromAudit = null;
  if (cm && !String(data.courses || '').trim()) {
    try { const j = JSON.parse(cm.body); fromAudit = [...(j.done || []), ...(j.ip || []).map(c => `${c} (in progress)`)]; } catch {}
  }

  const answers = Array.isArray(data.answers) ? data.answers : [];
  const answersCard = card('Answer library', h('span', { class: 'card-meta', text: `${answers.length} saved` }),
    h('p', { class: 'meta', text: 'Reusable short answers and essays (why this field, career goals, a challenge you overcame, personal statement…). Claude starts from these and tailors them; it never invents experiences.' }),
    h('div', { class: 'pf-answers' }, answers.map(a => h('div', { class: 'pf-answer' },
      h('div', { class: 'row' },
        h('input', { class: 'pf-answer-label', value: a.label || '', placeholder: 'What it answers, e.g. “Why microbiology + data science”', 'aria-label': 'Answer label', oninput: e => { a.label = e.target.value; edit('answers', answers); } }),
        h('button', { class: 'btn btn-small btn-quiet', type: 'button', text: 'Remove', onclick: () => { if (confirm('Remove this answer?')) C.commit(() => { const note = profileNote(true); note.data.answers = answers.filter(x => x !== a); touch(note); }); } })),
      h('textarea', { rows: 6, value: a.text || '', 'aria-label': a.label || 'Answer', oninput: e => { a.text = e.target.value; edit('answers', answers); } }),
      h('div', { class: 'muted small', text: `${words(a.text)} words` })))),
    h('button', { class: 'btn btn-small', type: 'button', text: '+ Add an answer', onclick: () => C.commit(() => {
      const note = profileNote(true);
      note.data.answers = [...answers, { id: uid(), label: '', text: '' }]; touch(note);
    }) }));

  return h('div', { class: 'page' },
    h('header', { class: 'page-head' },
      h('h1', { text: 'Application profile' }),
      h('p', { class: 'meta', text: 'Claude fills applications from this page and nothing else, so anything missing here shows up as a blank for you to fill. Stays encrypted in your vault. Saves as you type.' })),
    missing.length ? h('p', { class: 'pf-todo', text: `Still empty: ${missing.map(labelOf).join(' · ')}` }) : h('p', { class: 'pf-todo done', text: 'All the key fields are filled ✿' }),
    h('p', { class: 'meta', text: 'Never stored here, on purpose: SSN, passport or ID numbers, date of birth, passwords. You type those into the real form yourself.' }),
    PROFILE.map(([title, fields]) => card(title, null,
      title === 'Background' && fromAudit && fromAudit.length ? h('button', { class: 'btn btn-small', type: 'button', text: 'Start courses from my degree audit', onclick: () => C.commit(() => { const note = profileNote(true); note.data.courses = fromAudit.join('\n'); touch(note); }) }) : null,
      h('div', { class: 'pf-grid' }, fields.map(field)))),
    answersCard);
}

// ---------------------------------------------------------------- Applications page

function words(t) { return (String(t || '').trim().match(/\S+/g) || []).length; }

// "500 words" / "2,000 characters" / 500 -> { n, unit }
function parseLimit(l) {
  if (!l) return null;
  const m = String(l).replace(/,/g, '').match(/(\d+)\s*(char|word)?/i);
  if (!m) return null;
  return { n: Number(m[1]), unit: m[2] && /char/i.test(m[2]) ? 'chars' : 'words' };
}
function lengthText(text, limit) {
  const lim = parseLimit(limit);
  const count = lim && lim.unit === 'chars' ? String(text || '').length : words(text);
  return { text: lim ? `${count} / ${lim.n} ${lim.unit}` : `${count} words`, over: lim ? count > lim.n : false };
}

function copyBtn(getText, label = 'Copy') {
  const { h } = C;
  const b = h('button', { class: 'btn btn-small btn-quiet copy-btn', type: 'button', text: label, onclick: async () => {
    try { await navigator.clipboard.writeText(getText()); b.textContent = 'Copied ✓'; } catch { b.textContent = 'Copy failed'; }
    setTimeout(() => { b.textContent = label; }, 1500);
  } });
  return b;
}

function allText(it) {
  const a = it.app;
  const parts = [`${it.org} — ${it.title}`, safeUrl(a.applyUrl) || safeUrl(it.url) || '', ''];
  for (const f of a.fields || []) parts.push(`${f.label}: ${f.value || '(you fill)'}`);
  for (const e of a.essays || []) parts.push('', `## ${e.prompt}`, e.text || '');
  if (a.email) parts.push('', `Email to: ${a.email.to || ''}`, `Subject: ${a.email.subject || ''}`, '', a.email.body || '');
  return parts.join('\n');
}

function appHead(it) {
  const { h } = C;
  const a = it.app;
  const dl = deadline(it);
  return h('div', { class: 'app-head' },
    h('div', { class: 'intern-top' }, kindBadge(it), h('span', { class: `intern-due ${dl.cls}`, text: dl.text })),
    h('div', { class: 'intern-title', text: it.title }),
    h('div', { class: 'intern-org', text: [it.org, it.amount || it.pay].filter(Boolean).join(' · ') }),
    a.portal || a.method ? h('div', { class: 'muted small', text: `How it’s submitted: ${[a.portal, a.method].filter(Boolean).join(', ')}` }) : null);
}

function needsYou(a, { checkable = false, it = null } = {}) {
  const { h, touch, scheduleSave } = C;
  const steps = Array.isArray(a.yourSteps) ? a.yourSteps : [];
  if (!steps.length) return null;
  const done = new Set(a.stepsDone || []);
  return h('div', { class: 'app-needs' },
    h('div', { class: 'field-label', text: 'Still needs you' }),
    h('ul', null, steps.map((s, i) => h('li', null, checkable
      ? h('label', { class: 'app-step' }, h('input', { type: 'checkbox', checked: done.has(i), onchange: e => {
        e.target.checked ? done.add(i) : done.delete(i); a.stepsDone = [...done]; touch(it); scheduleSave(1500);
      } }), h('span', { text: s }))
      : s))));
}

function reviewEditor(it) {
  const { h, touch, scheduleSave } = C;
  const a = it.app;
  const edited = () => { touch(it); scheduleSave(1500); };
  const fields = Array.isArray(a.fields) ? a.fields : [];
  const essays = Array.isArray(a.essays) ? a.essays : [];
  const url = safeUrl(a.applyUrl) || safeUrl(it.url);

  return h('div', { class: 'app-editor' },
    needsYou(a),
    a.notes ? h('p', { class: 'app-notes', text: `Claude’s notes: ${a.notes}` }) : null,
    fields.length ? h('div', { class: 'field-label', text: 'Form fields' }) : null,
    h('div', { class: 'app-fields' }, fields.map((f, i) => {
      const id = `af-${it.id}-${i}`;
      const v = f.value || '';
      const input = f.long || v.length > 90
        ? h('textarea', { id, rows: Math.min(10, Math.max(2, Math.ceil(v.length / 70))), value: v, oninput: e => { f.value = e.target.value; edited(); } })
        : h('input', { id, value: v, placeholder: 'You fill this', oninput: e => { f.value = e.target.value; edited(); } });
      return h('div', { class: `app-field${v ? '' : ' blank'}` },
        h('label', { for: id, text: f.label }), input,
        f.note ? h('div', { class: 'muted small', text: f.note }) : null);
    })),
    essays.map((e, i) => {
      const id = `ae-${it.id}-${i}`;
      const count = h('span', { class: 'app-count' });
      const upd = () => { const r = lengthText(e.text, e.limit); count.textContent = r.text; count.classList.toggle('over', r.over); };
      upd();
      return h('div', { class: 'app-essay' },
        h('label', { for: id, class: 'app-prompt', text: e.prompt || `Essay ${i + 1}` }),
        h('textarea', { id, rows: Math.min(18, Math.max(6, Math.ceil(String(e.text || '').length / 80) + 1)), value: e.text || '', oninput: ev => { e.text = ev.target.value; upd(); edited(); } }),
        h('div', { class: 'app-essay-foot' }, count, e.limit ? h('span', { class: 'muted small', text: `limit: ${e.limit}` }) : null));
    }),
    a.email ? h('div', { class: 'app-essay' },
      h('div', { class: 'field-label', text: `Email application to ${a.email.to || '(address on the listing)'}` }),
      h('input', { value: a.email.subject || '', 'aria-label': 'Email subject', oninput: e => { a.email.subject = e.target.value; edited(); } }),
      h('textarea', { rows: 10, value: a.email.body || '', 'aria-label': 'Email body', oninput: e => { a.email.body = e.target.value; edited(); } })) : null,
    Array.isArray(a.attach) && a.attach.length ? h('div', null, h('div', { class: 'field-label', text: 'Files to attach' }), h('ul', { class: 'app-attach' }, a.attach.map(x => h('li', { text: x })))) : null,
    rejecting === it.id ? rejectForm(it) : h('div', { class: 'intern-actions app-actions' },
      h('button', { class: 'btn btn-primary', type: 'button', text: 'Approve', title: 'Marks it approved and opens the application. Nothing is submitted for you.', onclick: () => {
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
        openApp = it.id;
        C.commit(() => { a.status = 'approved'; a.approvedAt = Date.now(); touch(it); });
      } }),
      h('button', { class: 'btn', type: 'button', text: 'Reject', onclick: () => { rejecting = it.id; C.render(); } }),
      copyBtn(() => allText(it), 'Copy all')));
}

function rejectForm(it) {
  const { h, touch } = C;
  const a = it.app;
  const note = h('input', { placeholder: 'What should change? (optional)', 'aria-label': 'What should change', maxlength: 400 });
  return h('div', { class: 'app-reject' },
    note,
    h('div', { class: 'intern-actions' },
      h('button', { class: 'btn btn-small btn-primary', type: 'button', text: 'Redo the draft', title: 'Claude redrafts it using your note', onclick: () => {
        rejecting = null;
        C.commit(() => { Object.assign(a, { status: 'requested', requestedAt: Date.now(), redoNote: note.value.trim() }); touch(it); });
      } }),
      h('button', { class: 'btn btn-small', type: 'button', text: 'Not applying', onclick: () => {
        rejecting = null; skipping = it.id; filter = 'open';
        C.commit(() => { Object.assign(a, { status: 'rejected', rejectedAt: Date.now(), rejectNote: note.value.trim() }); touch(it); });
        C.go('internships');
      } }),
      h('button', { class: 'link', type: 'button', text: 'Cancel', onclick: () => { rejecting = null; C.render(); } })));
}

function submitKit(it) {
  const { h, touch } = C;
  const a = it.app;
  const url = safeUrl(a.applyUrl) || safeUrl(it.url);
  const mail = a.email && /^[^@\s]+@[^@\s]+$/.test(a.email.to || '')
    ? `mailto:${a.email.to}?subject=${encodeURIComponent(a.email.subject || '')}&body=${encodeURIComponent(a.email.body || '')}` : null;
  return h('div', { class: 'app-editor' },
    h('div', { class: 'intern-actions' },
      url ? h('a', { class: 'btn btn-primary', href: url, target: '_blank', rel: 'noopener noreferrer', text: 'Open application ↗' }) : null,
      mail ? h('a', { class: 'btn', href: mail, text: 'Open email draft ↗' }) : null,
      copyBtn(() => allText(it), 'Copy all'),
      h('button', { class: 'btn', type: 'button', text: 'I submitted it ✿', onclick: () => C.commit(() => {
        a.status = 'submitted'; a.submittedAt = Date.now(); it.status = 'applied'; it.statusAt = Date.now(); touch(it);
      }) }),
      h('button', { class: 'link', type: 'button', text: 'Back to editing', onclick: () => C.commit(() => { a.status = 'ready'; touch(it); }) })),
    needsYou(a, { checkable: true, it }),
    h('ul', { class: 'app-kit' },
      (a.fields || []).map(f => h('li', null,
        h('span', { class: 'app-kit-label', text: f.label }),
        h('span', { class: `app-kit-value${f.value ? '' : ' muted'}`, text: f.value || 'you fill this' }),
        f.value ? copyBtn(() => f.value) : null)),
      (a.essays || []).map(e => h('li', null,
        h('span', { class: 'app-kit-label', text: e.prompt }),
        h('span', { class: 'app-kit-value', text: `${lengthText(e.text, e.limit).text}` }),
        copyBtn(() => e.text || '')))),
    h('p', { class: 'meta', text: 'Want it typed in for you? On your computer, ask Claude (with Claude in Chrome): “fill my approved ' + (it.org || '') + ' application”. It fills the fields in your own browser while you watch and stops before Submit. Logins, CAPTCHAs, uploads of official documents, fees and signature boxes stay yours.' }));
}

export function renderApplications() {
  const { h, card, live, go } = C;
  const all = live('internships').filter(appOf);
  const by = st => sorted(all.filter(it => it.app.status === st));
  const ready = by('ready'), approved = by('approved'), requested = by('requested');
  const finished = all.filter(it => it.app.status === 'submitted' || it.app.status === 'rejected')
    .sort((a, b) => (b.app.submittedAt || b.app.rejectedAt || 0) - (a.app.submittedAt || a.app.rejectedAt || 0));
  if (!all.some(it => it.id === openApp)) openApp = (ready[0] || approved[0] || {}).id || null;
  const missing = profileMissing();

  const expandable = (it, body) => {
    const open = openApp === it.id;
    return h('li', { class: `app-card${open ? ' open' : ''}` },
      h('button', { class: 'app-toggle', type: 'button', 'aria-expanded': String(open), onclick: () => { openApp = open ? null : it.id; rejecting = null; C.render(); } }, appHead(it)),
      open ? body(it) : null);
  };

  return h('div', { class: 'page' },
    h('header', { class: 'page-head' },
      h('h1', { text: 'Applications' }),
      h('p', { class: 'meta', text: 'Claude drafts every field and essay from your profile; you read, edit and approve. Nothing is ever submitted for you: approving opens the form with everything ready to paste.' })),
    missing.length > 4 ? card('Fill in your profile first', null,
      h('p', { text: `Drafts come out with blanks until these are filled: ${missing.length} key fields are empty.` }),
      h('button', { class: 'btn btn-small btn-primary', type: 'button', text: 'Open profile', onclick: () => go('profile') })) : null,
    ready.length ? card(`Ready to review · ${ready.length}`, null, h('ul', { class: 'app-list' }, ready.map(it => expandable(it, reviewEditor)))) : null,
    approved.length ? card(`Approved, ready to submit · ${approved.length}`, null, h('ul', { class: 'app-list' }, approved.map(it => expandable(it, submitKit)))) : null,
    requested.length ? card(`Waiting for Claude · ${requested.length}`, h('span', { class: 'card-meta', text: 'Pink Slime drafts these' }),
      h('ul', { class: 'app-list' }, requested.map(it => h('li', { class: 'app-card' }, appHead(it),
        it.app.redoNote ? h('p', { class: 'muted small', text: `Your note: ${it.app.redoNote}` }) : null,
        h('button', { class: 'link', type: 'button', text: 'Cancel request', onclick: () => C.commit(() => { it.app.status = it.app.fields ? 'ready' : ''; C.touch(it); }) }))))) : null,
    !ready.length && !approved.length && !requested.length ? card('Nothing to review', null,
      h('p', { class: 'empty', text: 'Tap “Draft it for me” on any internship or scholarship, or ask Pink Slime on Discord.' }),
      h('button', { class: 'btn btn-small', type: 'button', text: 'See openings', onclick: () => go('internships') })) : null,
    finished.length ? card('Done', null, h('ul', { class: 'app-list done' }, finished.slice(0, 20).map(it => h('li', { class: 'app-done' },
      h('span', { class: `intern-badge${it.app.status === 'submitted' ? ' applied' : ''}`, text: it.app.status === 'submitted' ? 'Submitted' : 'Draft rejected' }),
      h('span', { text: `${it.org} — ${it.title}` }))))) : null);
}
