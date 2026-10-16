// The Prog 1 tab: write and run real Python (Pyodide in a worker), with
// auto-checked practice problems per module, "predict the output" drills,
// a timed Mock Exam 2, coding-interview practice and a free playground.

import { MODULES, EXAM2, PROBLEMS, PREDICT } from './problems.js?v=2';
import { TOPICS, MOCK_MCQ, MOCK_CODE, INTERVIEW } from './extra.js?v=1';
import { makeEditor, codeBlock } from './highlight.js?v=1';
import { BUGS } from './bugs.js?v=1';

// Practice list: the regular problems plus the debug-the-bug drills (broken starter code).
const ALL = [...PROBLEMS, ...BUGS.map(b => ({ ...b, isBug: true }))];

let C; // { h, card, render, ... } from app.js

const TABS = [['practice', 'Practice'], ['predict', 'Predict the output'], ['mock', 'Mock exam'], ['interview', 'Interview'], ['play', 'Playground']];
const RUN_LIMIT_MS = 8000;

function load(key, fallback) { try { const v = localStorage.getItem(`prog.${key}`); return v === null ? fallback : JSON.parse(v); } catch { return fallback; } }
function store(key, v) { try { localStorage.setItem(`prog.${key}`, JSON.stringify(v)); } catch {} }

const st = {
  tab: load('tab', 'practice'),
  mod: load('mod', 'exam2'),
  prob: load('prob', 'm7a-encode-rle'),
  showHint: false, showSol: false,
  pq: 0, picked: null, right: 0, total: 0, pmod: 'all',
  mi: 0, grading: false,
  iv: load('iv', INTERVIEW[0].id), hintLevel: 0, ivSol: false,
};

// ---------------------------------------------------------------- Python engine

const engine = {
  worker: null, state: 'off', version: '', job: null, queue: [], seq: 0, listeners: new Set(),
  start() {
    if (this.worker) return;
    this.state = 'loading'; this.notify();
    let w;
    try { w = new Worker(new URL('./py-worker.js', import.meta.url)); }
    catch (e) { this.state = 'error'; this.error = String(e.message || e); this.notify(); return; }
    this.worker = w;
    w.onmessage = ({ data }) => {
      if (data.type === 'ready') { this.state = 'ready'; this.version = data.version; this.notify(); this.pump(); return; }
      if (data.type === 'boot-error') { this.state = 'error'; this.error = data.error; this.notify(); return; }
      const job = this.job;
      if (!job || data.id !== job.id) return;
      if (data.type === 'out') job.onOut && job.onOut(data.text, data.stream);
      else if (data.type === 'done') this.finish(data);
    };
    w.onerror = e => { if (this.state === 'loading') { this.state = 'error'; this.error = e.message || 'Python couldn’t start.'; this.notify(); } };
  },
  /** Queue a job; resolves with { error?, results?, stopped? }. */
  submit(msg, onOut) {
    this.start();
    return new Promise(resolve => { this.queue.push({ msg, onOut, resolve }); this.pump(); });
  },
  pump() {
    if (this.state !== 'ready' || this.job || !this.queue.length) return;
    const job = this.queue.shift();
    job.id = ++this.seq;
    this.job = job;
    this.state = 'running'; this.notify();
    job.timer = setTimeout(() => this.stop('timeout'), RUN_LIMIT_MS);
    this.worker.postMessage({ ...job.msg, id: job.id });
  },
  finish(data) {
    const job = this.job;
    clearTimeout(job.timer);
    this.job = null;
    this.state = 'ready'; this.notify();
    job.resolve(data);
    this.pump();
  },
  /** Kill the worker (the only way to stop a runaway loop) and boot a fresh one. */
  stop(why = 'stopped') {
    const job = this.job;
    if (!job) return;
    clearTimeout(job.timer);
    this.job = null;
    this.worker.terminate();
    this.worker = null;
    job.resolve({ stopped: why });
    this.start();
  },
  notify() { for (const fn of this.listeners) fn(); },
};

function statusText() {
  return {
    off: 'Python not started', loading: 'Loading Python…', ready: `Python ${engine.version} · ready`,
    running: 'Running…', error: 'Python couldn’t start',
  }[engine.state] || '';
}

// One status pill per render; it updates itself while Python loads or runs.
function statusPill() {
  const el = C.h('span', { class: 'prog-status', role: 'status' });
  const paint = () => {
    if (!el.isConnected && el.dataset.seen) { engine.listeners.delete(paint); return; }
    el.dataset.seen = '1';
    el.textContent = statusText();
    el.dataset.state = engine.state;
  };
  engine.listeners.add(paint);
  paint();
  return el;
}

// ---------------------------------------------------------------- console

function makeConsole() {
  const el = document.createElement('div');
  el.className = 'prog-console';
  el.setAttribute('aria-live', 'polite');
  let pendingScroll = false;
  const scroll = () => {
    if (pendingScroll) return;
    pendingScroll = true;
    requestAnimationFrame(() => { pendingScroll = false; el.scrollTop = el.scrollHeight; });
  };
  const api = {
    el,
    clear() { el.replaceChildren(); },
    line(text, cls = 'out') {
      const last = el.lastElementChild;
      if (last && last.dataset.cls === cls && !last.dataset.block) { last.textContent += text; }
      else {
        const s = document.createElement('span');
        s.className = `con-${cls}`; s.dataset.cls = cls; s.textContent = text;
        el.append(s);
      }
      scroll();
    },
    block(node) { node.dataset.block = '1'; el.append(node); scroll(); },
    placeholder(text) { el.replaceChildren(); const s = document.createElement('span'); s.className = 'con-info'; s.textContent = text; el.append(s); },
  };
  return api;
}

function stoppedText(why) {
  return why === 'timeout'
    ? `\nStopped: it ran for over ${RUN_LIMIT_MS / 1000} s. Is there a loop that never ends (a while whose condition never becomes False)?\n`
    : '\nStopped.\n';
}

async function runCode(code, stdin, con) {
  con.clear();
  if (engine.state !== 'ready' && engine.state !== 'running') con.line('Starting Python (first time takes a few seconds)…\n', 'info');
  const res = await engine.submit({ kind: 'run', code, stdin }, (text, stream) => {
    const info = con.el.querySelector('.con-info');
    if (info && info.textContent.startsWith('Starting Python')) info.remove();
    con.line(text, stream === 'err' ? 'err' : stream === 'stdin' ? 'stdin' : stream === 'info' ? 'info' : 'out');
  });
  const info = con.el.querySelector('.con-info');
  if (info && info.textContent.startsWith('Starting Python')) info.remove();
  if (res.stopped) con.line(stoppedText(res.stopped), 'err');
  else if (res.error) con.line(`${con.el.textContent && !con.el.textContent.endsWith('\n') ? '\n' : ''}${res.error}\n`, 'err');
  else if (!con.el.textContent) con.line('(ran with no output)\n', 'info');
  return res;
}

// ---------------------------------------------------------------- per-problem state (kept across renders)

const editors = new Map(); // key -> { editor, con, stdinEl }

function saved(id) { return load(id, null) || {}; }
function saveProb(id, patch) { store(id, { ...saved(id), ...patch }); }

function workspace(key, { value, onChange, onRun, label }) {
  let w = editors.get(key);
  if (!w) {
    const editor = makeEditor({ value, onChange, onRun: () => w.onRun(), label });
    const con = makeConsole();
    const stdinEl = document.createElement('textarea');
    stdinEl.className = 'prog-stdin';
    stdinEl.rows = 2;
    stdinEl.placeholder = 'One line per input() call';
    stdinEl.spellcheck = false;
    stdinEl.setAttribute('aria-label', 'Input for the program, one line per input() call');
    w = { editor, con, stdinEl };
    editors.set(key, w);
  }
  w.onRun = onRun;
  return w;
}

// ---------------------------------------------------------------- page

export function renderProg(ctx) {
  C = ctx;
  const { h } = C;
  engine.start(); // lazy: Python boots the first time this tab is opened
  const tabs = h('div', { class: 'prog-tabs', role: 'tablist' }, TABS.map(([id, label]) => h('button', {
    type: 'button', role: 'tab', class: `prog-tab${st.tab === id ? ' on' : ''}`, 'aria-selected': String(st.tab === id),
    onclick: () => { if (st.tab !== id) { st.tab = id; store('tab', id); C.render(); } },
  }, label)));
  const solved = PROBLEMS.filter(p => saved(p.id).solved).length;
  const body = { practice: practicePage, predict: predictPage, mock: mockPage, interview: interviewPage, play: playPage }[st.tab] || practicePage;
  return h('div', { class: 'page prog' },
    h('header', { class: 'page-head prog-head' },
      h('div', null,
        h('h1', { text: 'Prog 1' }),
        h('p', { class: 'muted small prog-sub', text: `Python practice · ${solved} of ${PROBLEMS.length} solved · Exam 2 is Oct 23` })),
      statusPill()),
    tabs, body());
}

function chip(label, on, onclick, extra = {}) {
  return C.h('button', { type: 'button', class: `chip chip-btn${on ? ' on' : ''}`, 'aria-pressed': String(!!on), onclick, ...extra }, label);
}

function modTest(mod) {
  if (mod === 'bugs') return p => p.isBug;
  if (mod === 'all') return p => !p.isBug;
  if (mod === 'exam2') return p => !p.isBug && EXAM2.includes(p.module);
  return p => !p.isBug && p.module === mod;
}

// ---------------------------------------------------------------- practice

function practicePage() {
  const { h, card } = C;
  const list = ALL.filter(modTest(st.mod));
  let p = ALL.find(x => x.id === st.prob);
  if (!p || !list.includes(p)) p = list[0];
  st.prob = p.id;
  const rec = saved(p.id);
  const isIO = p.tests.some(t => 'stdin' in t);

  const w = workspace(`p:${p.id}`, {
    value: rec.code ?? p.starter,
    label: `Code for ${p.title}`,
    onChange: debounce(code => saveProb(p.id, { code }), 300),
    onRun: () => run(),
  });
  if (isIO && !w.stdinEl.value) w.stdinEl.value = p.tests[0].stdin;
  if (!w.con.el.childNodes.length) w.con.placeholder('Run your code to see what it prints, or Check to test it.');

  const run = () => runCode(w.editor.get(), w.stdinEl.value, w.con);
  const check = async () => {
    const all = await checkInto(w.con, w.editor.get(), p);
    if (all && !rec.solved) { saveProb(p.id, { solved: true, code: w.editor.get() }); C.render(); }
    else if (all) saveProb(p.id, { code: w.editor.get() });
  };

  const mods = h('div', { class: 'chips prog-mods' },
    chip('Exam 2 (M7A–M8)', st.mod === 'exam2', () => setMod('exam2')),
    MODULES.map(([id, label]) => chip(`${id} · ${label}`, st.mod === id, () => setMod(id))),
    chip('All', st.mod === 'all', () => setMod('all')),
    chip('🐞 Debug the bug', st.mod === 'bugs', () => setMod('bugs')));

  const listEl = h('ol', { class: 'prog-list' }, list.map(x => h('li', null, h('button', {
    type: 'button', class: `prog-item${x.id === p.id ? ' on' : ''}${saved(x.id).solved ? ' done' : ''}`,
    'aria-current': x.id === p.id ? 'true' : null,
    onclick: () => { st.prob = x.id; store('prob', x.id); st.showHint = st.showSol = false; C.render(); },
  }, h('span', { class: 'prog-item-mod', text: x.module }), h('span', { class: 'prog-item-title', text: x.title }),
  h('span', { class: 'prog-item-check', 'aria-label': saved(x.id).solved ? 'solved' : null, text: saved(x.id).solved ? '✓' : '' })))));

  const idx = list.indexOf(p);
  const go = d => { const n = list[(idx + d + list.length) % list.length]; st.prob = n.id; store('prob', n.id); st.showHint = st.showSol = false; C.render(); };
  const stopBtn = h('button', { type: 'button', class: 'btn prog-stop', onclick: () => engine.stop() }, '■ Stop');
  const buttons = h('div', { class: 'prog-actions' },
    h('button', { type: 'button', class: 'btn prog-run', title: 'Run (Ctrl+Enter)', onclick: run }, '▶ Run'),
    h('button', { type: 'button', class: 'btn btn-primary prog-check', onclick: check }, '✓ Check'),
    stopBtn,
    h('span', { class: 'prog-spacer' }),
    h('button', { type: 'button', class: 'btn btn-small btn-quiet', onclick: () => { st.showHint = !st.showHint; C.render(); } }, st.showHint ? 'Hide hint' : 'Hint'),
    h('button', { type: 'button', class: 'btn btn-small btn-quiet', onclick: () => { st.showSol = !st.showSol; C.render(); } }, st.showSol ? 'Hide solution' : 'Solution'),
    h('button', {
      type: 'button', class: 'btn btn-small btn-quiet', onclick: () => {
        if (w.editor.get() !== p.starter && !confirm('Reset to the starter code? Your code for this problem will be replaced.')) return;
        w.editor.set(p.starter);
      },
    }, 'Reset'));
  bindStop(stopBtn);

  const problemCard = h('section', { class: 'card prog-card' },
    h('div', { class: 'prog-prob-head' },
      h('span', { class: `prog-badge mod-${p.module.toLowerCase()}`, text: p.module }),
      h('h2', { text: p.title }),
      rec.solved ? h('span', { class: 'prog-solved', text: 'Solved ✓' }) : null,
      h('span', { class: 'prog-spacer' }),
      h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Previous problem', title: 'Previous problem', onclick: () => go(-1) }, '‹'),
      h('span', { class: 'muted small', text: `${idx + 1} / ${list.length}` }),
      h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Next problem', title: 'Next problem', onclick: () => go(1) }, '›')),
    h('p', { class: 'prog-prompt', text: p.prompt }),
    p.isBug ? h('p', { class: 'prog-bugnote small', text: rec.solved || st.showSol ? `🐞 The bug: ${p.bug}` : '🐞 This code runs (or tries to) but gives the wrong answer. Run it, compare with what it should do, and fix it.' }) : null,
    p.recurse ? h('p', { class: 'muted small', text: `Must be recursive: ${p.recurse}() has to call itself.` }) : null,
    w.editor.el,
    isIO ? h('label', { class: 'prog-stdin-label' }, h('span', { class: 'muted small', text: 'Input (what you\'d type when the program asks)' }), w.stdinEl) : null,
    buttons,
    st.showHint ? h('div', { class: 'prog-hint' }, h('strong', { text: 'Hint: ' }), p.hint) : null,
    st.showSol ? h('div', { class: 'prog-solution' },
      h('div', { class: 'prog-sol-head' }, h('span', { class: 'muted small', text: 'One way to do it' }),
        h('button', { type: 'button', class: 'btn btn-small', onclick: () => { if (confirm('Replace your code with this solution?')) w.editor.set(p.solution); } }, 'Use this code')),
      codeBlock(p.solution)) : null,
    h('div', { class: 'prog-console-head' }, h('span', { text: 'Output' }), h('button', { type: 'button', class: 'link small', onclick: () => w.con.clear() }, 'Clear')),
    w.con.el,
    h('p', { class: 'muted small prog-keys', text: 'Ctrl+Enter runs · Tab indents · Shift+Tab dedents · Esc then Tab leaves the editor' }));

  const solvedHere = list.filter(x => saved(x.id).solved).length;
  return h('div', { class: 'grid orgo-grid prog-grid' },
    h('div', { class: 'col' }, mods, problemCard),
    h('div', { class: 'col col-narrow' },
      card('Problems', h('span', { class: 'card-meta', text: `${solvedHere} / ${list.length} solved` }), listEl),
      st.mod === 'exam2' || st.mod === 'M7A' ? card('Project 2 heads-up', null,
        h('p', { class: 'small', text: 'The RLE problems follow the usual Project 2 function names (to_hex_string, count_runs, encode_rle, decode_rle, string_to_data, to_rle_string). They\'re practice versions: if your project spec says something different, the spec wins.' })) : null));
}

/** Check code against p's tests (quietly). Resolves { pass, total, results } or { error }. */
async function grade(code, p) {
  const res = await engine.submit({ kind: 'check', code, tests: p.tests, recurse: p.recurse || null });
  if (res.stopped) return { error: stoppedText(res.stopped).trim(), pass: 0, total: p.tests.length + (p.recurse ? 1 : 0) };
  if (res.error) return { error: res.error, pass: 0, total: p.tests.length + (p.recurse ? 1 : 0) };
  return { pass: res.results.filter(r => r.ok).length, total: res.results.length, results: res.results };
}

/** Check code against p's tests and show the results in con. Resolves true if every test passed. */
async function checkInto(con, code, p) {
  const { h } = C;
  con.clear();
  con.line('Checking…\n', 'info');
  const g = await grade(code, p);
  con.clear();
  if (g.error) { con.line(`${g.error}\n`, 'err'); return false; }
  const all = g.pass === g.total;
  con.block(h('div', { class: `prog-verdict ${all ? 'ok' : 'no'}` }, all ? `All ${g.pass} tests passed ✿` : `${g.pass} of ${g.total} tests passed`));
  for (const r of g.results) con.block(testRow(r));
  requestAnimationFrame(() => { con.el.scrollTop = 0; }); // results read top-down: verdict first
  return all;
}

function testRow(r) {
  const { h } = C;
  return h('div', { class: `prog-test ${r.ok ? 'ok' : 'no'}` },
    h('span', { class: 'prog-test-mark', 'aria-hidden': 'true', text: r.ok ? '✓' : '✗' }),
    h('div', { class: 'prog-test-body' },
      h('code', { class: 'prog-test-label', text: r.label || '' }),
      r.error ? h('pre', { class: 'prog-test-err', text: r.error })
        : r.ok ? (r.io || r.got === undefined ? null : h('span', { class: 'muted', text: ` → ${r.got}` }))
          : r.io ? h('div', { class: 'prog-io-diff' },
            h('div', null, h('span', { class: 'muted small', text: 'expected' }), h('pre', { text: r.expected || '(nothing)' })),
            h('div', null, h('span', { class: 'muted small', text: 'you printed' }), h('pre', { text: r.got || '(nothing)' })))
            : h('span', { class: 'prog-test-want', text: ` expected ${r.expected}, got ${r.got}` })));
}

function setMod(mod) {
  st.mod = mod; store('mod', mod); st.showHint = st.showSol = false;
  C.render();
}

function bindStop(btn) {
  const paint = () => {
    if (!btn.isConnected && btn.dataset.seen) { engine.listeners.delete(paint); return; }
    btn.dataset.seen = '1';
    btn.disabled = engine.state !== 'running';
  };
  engine.listeners.add(paint);
  paint();
}

function debounce(fn, ms) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

// ---------------------------------------------------------------- predict the output

function predictPage() {
  const { h, card } = C;
  const pool = PREDICT.filter(q => st.pmod === 'all' || (st.pmod === 'exam2' ? EXAM2.includes(q.module) : q.module === st.pmod));
  const q = pool[st.pq % pool.length];
  const answered = st.picked !== null;
  const con = workspace(`q:${q.id}`, { value: q.code, label: 'snippet' }).con;
  const next = d => { st.pq = (st.pq + d + pool.length) % pool.length; st.picked = null; C.render(); };
  const show = s => h('pre', { class: 'prog-opt-text', text: s });

  return h('div', { class: 'grid orgo-grid prog-grid' },
    h('div', { class: 'col' },
      h('div', { class: 'chips prog-mods' },
        chip('All', st.pmod === 'all', () => { st.pmod = 'all'; st.pq = 0; st.picked = null; C.render(); }),
        chip('Exam 2 topics', st.pmod === 'exam2', () => { st.pmod = 'exam2'; st.pq = 0; st.picked = null; C.render(); }),
        chip('Recursion', st.pmod === 'M8', () => { st.pmod = 'M8'; st.pq = 0; st.picked = null; C.render(); })),
      h('section', { class: 'card prog-card' },
        h('div', { class: 'prog-prob-head' },
          h('span', { class: `prog-badge mod-${q.module.toLowerCase()}`, text: q.module }),
          h('h2', { text: 'What does this print?' }),
          h('span', { class: 'prog-spacer' }),
          h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Previous', onclick: () => next(-1) }, '‹'),
          h('span', { class: 'muted small', text: `${(st.pq % pool.length) + 1} / ${pool.length}` }),
          h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Next', onclick: () => next(1) }, '›')),
        codeBlock(q.code, 'prog-snippet'),
        h('div', { class: 'q-options prog-options' }, q.options.map(o => {
          let cls = 'q-opt';
          if (answered && o === q.answer) cls += ' right';
          else if (answered && o === st.picked) cls += ' wrong';
          return h('button', {
            type: 'button', class: cls, disabled: answered,
            onclick: () => { st.picked = o; st.total++; if (o === q.answer) st.right++; C.render(); },
          }, show(o));
        })),
        answered ? h('div', { class: `q-feedback ${st.picked === q.answer ? 'ok' : 'no'}` },
          h('strong', { text: st.picked === q.answer ? 'Correct ✿' : 'Not quite.' }),
          h('p', { class: 'prog-why', text: q.why }),
          h('div', { class: 'row' },
            h('button', { type: 'button', class: 'btn btn-primary', onclick: () => next(1) }, 'Next snippet'),
            h('button', { type: 'button', class: 'btn btn-small', onclick: () => runCode(q.code, '', con) }, '▶ Run it for real'))) : null,
        answered ? con.el : null)),
    h('div', { class: 'col col-narrow' },
      card('Score', h('span', { class: 'card-meta', text: st.total ? `${st.right} / ${st.total}` : '' }),
        h('p', { class: 'small', text: 'Trace the code line by line on paper first, then pick. Exams love aliasing, slicing, // and %, dict.get, and recursion order.' })),
      card('Tracing recursion', null, h('ul', { class: 'bullets small' },
        h('li', { text: 'Write each call on its own line, indented one step deeper.' }),
        h('li', { text: 'Stop when you hit the base case, then fill in return values on the way back up.' }),
        h('li', { text: 'Anything after the recursive call runs on the way back up, in reverse order.' })))));
}

// ---------------------------------------------------------------- playground

const PLAY_START = `# Try anything here. Ctrl+Enter runs it.
name = input("Your name: ")
for i in range(3):
    print(f"{i + 1}. Go Gators, {name}!")
`;

function playPage() {
  const { h, card } = C;
  const w = workspace('play', {
    value: load('playground', PLAY_START),
    label: 'Playground code',
    onChange: debounce(code => store('playground', code), 300),
    onRun: () => runCode(w.editor.get(), w.stdinEl.value, w.con),
  });
  if (!w.stdinEl.dataset.init) { w.stdinEl.dataset.init = '1'; w.stdinEl.value = 'Luana'; }
  if (!w.con.el.childNodes.length) w.con.placeholder('Output shows up here.');
  const stopBtn = h('button', { type: 'button', class: 'btn prog-stop', onclick: () => engine.stop() }, '■ Stop');
  bindStop(stopBtn);
  return h('div', { class: 'grid orgo-grid prog-grid' },
    h('div', { class: 'col' },
      h('section', { class: 'card prog-card' },
        h('div', { class: 'prog-prob-head' }, h('h2', { text: 'Playground' })),
        w.editor.el,
        h('label', { class: 'prog-stdin-label' }, h('span', { class: 'muted small', text: 'Input (one line per input() call)' }), w.stdinEl),
        h('div', { class: 'prog-actions' },
          h('button', { type: 'button', class: 'btn btn-primary prog-run', onclick: () => w.onRun() }, '▶ Run'),
          stopBtn,
          h('span', { class: 'prog-spacer' }),
          h('button', { type: 'button', class: 'btn btn-small btn-quiet', onclick: () => { if (confirm('Clear the playground?')) w.editor.set(''); } }, 'Clear code')),
        h('div', { class: 'prog-console-head' }, h('span', { text: 'Output' }), h('button', { type: 'button', class: 'link small', onclick: () => w.con.clear() }, 'Clear')),
        w.con.el)),
    h('div', { class: 'col col-narrow' },
      card('About this Python', null, h('ul', { class: 'bullets small' },
        h('li', { text: 'Real Python 3.12 running in your browser (Pyodide). Nothing is sent anywhere.' }),
        h('li', { text: 'input() reads from the Input box, one line per call.' }),
        h('li', { text: `Programs stop after ${RUN_LIMIT_MS / 1000} seconds, so an endless loop can't freeze the page. Stop ends one early.` }),
        h('li', { text: 'Your code is saved on this device as you type.' })))));
}

// ---------------------------------------------------------------- mock exam 2

// 15 multiple choice (1 point each) + 3 coding problems (5 points each, partial
// credit per passing test). The clock keeps running while the page is closed,
// like a real exam; Pause is for breaks. Code is only graded on submit.
const EXAM_MIN = 75;
const MCQ_COUNT = 15;
const CODE_POINTS = 5;

const mcqById = id => MOCK_MCQ.find(q => q.id === id);
const codeById = id => MOCK_CODE.find(q => q.id === id);

function shuffled(a) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
  return b;
}

let examCache;
function exam() { if (examCache === undefined) examCache = load('mock', null); return examCache; }
function setExam(ex) {
  examCache = ex;
  if (ex) store('mock', ex);
  else try { localStorage.removeItem('prog.mock'); } catch {}
}

/** A fresh exam, preferring questions you didn't get in your last couple of attempts. */
function newExam() {
  const seen = new Set(load('mockSeen', []));
  const fresh = list => [...shuffled(list.filter(q => !seen.has(q.id))), ...shuffled(list.filter(q => seen.has(q.id)))];
  // round-robin over topics so every topic shows up
  const byTopic = TOPICS.map(t => fresh(MOCK_MCQ.filter(q => q.topic === t)));
  const mcq = [];
  for (let k = 0; mcq.length < MCQ_COUNT && byTopic.some(l => l.length); k++) {
    const l = byTopic[k % byTopic.length];
    if (l.length) mcq.push(l.shift().id);
  }
  // coding: one recursion, one dict/set, one number systems/strings/lists
  const groups = [['Recursion'], ['Dictionaries', 'Tuples & sets'], ['Number systems', 'Strings', 'Lists']];
  const code = groups.map(g => fresh(MOCK_CODE.filter(q => g.includes(q.topic)))[0].id);
  const now = Date.now();
  return { mcq: shuffled(mcq), code, answers: {}, src: {}, elapsed: 0, since: now, started: now, submitted: false, graded: {} };
}

function examItems(ex) {
  return [...ex.mcq.map(id => ({ kind: 'mcq', id })), ...ex.code.map(id => ({ kind: 'code', id }))];
}

function examLeft(ex) {
  return EXAM_MIN * 60e3 - ex.elapsed - (ex.since ? Date.now() - ex.since : 0);
}

function fmtClock(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function itemDone(ex, it) {
  if (it.kind === 'mcq') return ex.answers[it.id] !== undefined;
  const src = ex.src[it.id];
  return src !== undefined && src.trim() !== codeById(it.id).starter.trim();
}

function examScore(ex) {
  const topics = {};
  const add = (t, got, max) => { const x = topics[t] || (topics[t] = { got: 0, max: 0 }); x.got += got; x.max += max; };
  let got = 0, max = 0;
  for (const id of ex.mcq) {
    const q = mcqById(id);
    const ok = ex.answers[id] === q.answer ? 1 : 0;
    got += ok; max += 1; add(q.topic, ok, 1);
  }
  for (const id of ex.code) {
    const p = codeById(id);
    const g = ex.graded[id] || { pass: 0, total: 1 };
    const pts = Math.round((CODE_POINTS * g.pass / g.total) * 10) / 10;
    got += pts; max += CODE_POINTS; add(p.topic, pts, CODE_POINTS);
  }
  got = Math.round(got * 10) / 10;
  return { got, max, pct: Math.round((100 * got) / max), topics };
}

async function submitExam() {
  const ex = exam();
  if (!ex || ex.submitted || st.grading) return;
  if (ex.since) { ex.elapsed += Date.now() - ex.since; ex.since = null; }
  st.grading = true;
  setExam(ex);
  C.render();
  for (const id of ex.code) {
    const p = codeById(id);
    ex.graded[id] = await grade(ex.src[id] ?? p.starter, p);
  }
  ex.submitted = true;
  ex.finishedAt = Date.now();
  const sc = examScore(ex);
  store('mockHistory', [...load('mockHistory', []), { at: ex.finishedAt, got: sc.got, max: sc.max, pct: sc.pct }].slice(-10));
  // remember the last two attempts' questions so a retake gets new ones first
  store('mockSeen', [...load('mockSeen', []), ...ex.mcq, ...ex.code].slice(-36));
  st.grading = false;
  setExam(ex);
  st.mi = 0;
  C.render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function mockPage() {
  const ex = exam();
  if (!ex) return mockIntro();
  if (ex.submitted) return mockResults(ex);
  return mockRunning(ex);
}

function historyCard() {
  const { h, card } = C;
  const hist = load('mockHistory', []);
  if (!hist.length) return null;
  return card('Past attempts', null, h('ol', { class: 'prog-history' }, hist.slice().reverse().map(a => h('li', null,
    h('span', { text: new Date(a.at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) }),
    h('span', { class: 'prog-history-bar' }, h('span', { style: `width:${a.pct}%` })),
    h('strong', { text: `${a.pct}%` })))));
}

function mockIntro() {
  const { h, card } = C;
  return h('div', { class: 'grid orgo-grid prog-grid' },
    h('div', { class: 'col' },
      h('section', { class: 'card prog-card prog-mock-intro' },
        h('div', { class: 'prog-prob-head' }, h('span', { class: 'prog-badge mod-m8', text: 'Exam 2' }), h('h2', { text: 'Mock Exam 2' })),
        h('p', { class: 'prog-prompt', text: 'A practice run of Exam 2: number systems, lists, strings, tuples and sets, dictionaries and recursion (M7A–M8).' }),
        h('ul', { class: 'bullets' },
          h('li', { text: `${MCQ_COUNT} multiple-choice and "what does this print?" questions, 1 point each.` }),
          h('li', { text: `3 coding problems, ${CODE_POINTS} points each, with partial credit for every test that passes.` }),
          h('li', { text: `${EXAM_MIN} minutes. The clock keeps going if you leave the page, like a real exam; use Pause for breaks.` }),
          h('li', { text: 'You can Run your code (add print() calls to test it), but the tests only run when you submit.' }),
          h('li', { text: 'Afterwards: your score by topic, every explanation, and the solutions. Retakes pick new questions first.' })),
        h('div', { class: 'row' }, h('button', {
          type: 'button', class: 'btn btn-primary', onclick: () => { setExam(newExam()); st.mi = 0; C.render(); },
        }, 'Start the exam')))),
    h('div', { class: 'col col-narrow' },
      historyCard(),
      null));
}

function mockRunning(ex) {
  const { h, card } = C;
  const items = examItems(ex);
  st.mi = Math.max(0, Math.min(st.mi, items.length - 1));
  const it = items[st.mi];
  const paused = !ex.since;

  const timerEl = h('div', { class: 'prog-timer', role: 'timer' });
  // a small copy of the clock in the question header, for phones where the timer card is far below
  const miniEl = h('span', { class: 'prog-timer-mini', 'aria-hidden': 'true' });
  const tick = () => {
    if (!timerEl.isConnected && timerEl.dataset.seen) { clearInterval(timer); return; }
    if (timerEl.isConnected) timerEl.dataset.seen = '1';
    const left = examLeft(ex);
    timerEl.textContent = miniEl.textContent = fmtClock(left);
    timerEl.classList.toggle('low', left < 10 * 60e3);
    miniEl.classList.toggle('low', left < 10 * 60e3);
    if (left <= 0 && !ex.submitted && !st.grading) { clearInterval(timer); submitExam(); }
  };
  const timer = setInterval(tick, 1000);
  tick();

  const go = i => { st.mi = (i + items.length) % items.length; C.render(); };
  const head = (badge, title) => h('div', { class: 'prog-prob-head' },
    h('span', { class: 'prog-badge prog-topic', text: badge }),
    h('h2', { text: title }),
    h('span', { class: 'prog-spacer' }),
    miniEl,
    h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Previous question', onclick: () => go(st.mi - 1) }, '‹'),
    h('span', { class: 'muted small', text: `${st.mi + 1} / ${items.length}` }),
    h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Next question', onclick: () => go(st.mi + 1) }, '›'));

  let main;
  if (st.grading) {
    main = h('section', { class: 'card prog-card prog-paused' }, h('h2', { text: 'Grading your code…' }), h('p', { class: 'muted', text: 'Running the tests for each coding problem. This takes a few seconds.' }));
  } else if (paused) {
    main = h('section', { class: 'card prog-card prog-paused' },
      h('h2', { text: 'Paused' }),
      h('p', { class: 'muted', text: 'The questions are hidden while the clock is stopped.' }),
      h('div', { class: 'row' }, h('button', { type: 'button', class: 'btn btn-primary', onclick: () => { ex.since = Date.now(); setExam(ex); C.render(); } }, 'Resume')));
  } else if (it.kind === 'mcq') {
    const q = mcqById(it.id);
    main = h('section', { class: 'card prog-card' },
      head(q.topic, `Question ${st.mi + 1}`),
      q.code ? codeBlock(q.code, 'prog-snippet') : null,
      h('p', { class: 'prog-prompt', text: q.prompt || 'What does this print?' }),
      h('div', { class: 'q-options prog-options' }, q.options.map(o => h('button', {
        type: 'button', class: `q-opt${ex.answers[it.id] === o ? ' prog-picked' : ''}`, 'aria-pressed': String(ex.answers[it.id] === o),
        onclick: () => { ex.answers[it.id] = o; setExam(ex); C.render(); },
      }, h('pre', { class: 'prog-opt-text', text: o })))),
      h('div', { class: 'row prog-exam-nav' },
        h('button', { type: 'button', class: 'btn', onclick: () => go(st.mi - 1), disabled: st.mi === 0 }, '← Back'),
        h('button', { type: 'button', class: 'btn btn-primary', onclick: () => go(st.mi + 1) }, st.mi === items.length - 1 ? 'Back to question 1' : 'Next →')));
  } else {
    const p = codeById(it.id);
    const w = workspace(`mock:${ex.started}:${p.id}`, {
      value: ex.src[p.id] ?? p.starter,
      label: `Code for ${p.title}`,
      onChange: debounce(code => { ex.src[p.id] = code; setExam(ex); }, 300),
      onRun: () => runCode(w.editor.get(), '', w.con),
    });
    if (!w.con.el.childNodes.length) w.con.placeholder('Run your code to test it with print(). The tests run when you submit.');
    const stopBtn = h('button', { type: 'button', class: 'btn prog-stop', onclick: () => engine.stop() }, '■ Stop');
    bindStop(stopBtn);
    main = h('section', { class: 'card prog-card' },
      head(p.topic, `Coding ${st.mi - ex.mcq.length + 1}: ${p.title}`),
      h('p', { class: 'prog-prompt', text: p.prompt }),
      p.recurse ? h('p', { class: 'muted small', text: `Must be recursive: ${p.recurse}() has to call itself.` }) : null,
      w.editor.el,
      h('div', { class: 'prog-actions' },
        h('button', { type: 'button', class: 'btn prog-run', title: 'Run (Ctrl+Enter)', onclick: () => w.onRun() }, '▶ Run'),
        stopBtn,
        h('span', { class: 'prog-spacer' }),
        h('span', { class: 'muted small', text: `${CODE_POINTS} points` })),
      h('div', { class: 'prog-console-head' }, h('span', { text: 'Output' }), h('button', { type: 'button', class: 'link small', onclick: () => w.con.clear() }, 'Clear')),
      w.con.el);
  }

  const answered = items.filter(x => itemDone(ex, x)).length;
  const nav = h('div', { class: 'prog-qnav', role: 'list' }, items.map((x, i) => h('button', {
    type: 'button', role: 'listitem',
    class: `prog-qnav-btn${i === st.mi ? ' on' : ''}${itemDone(ex, x) ? ' done' : ''}${x.kind === 'code' ? ' code' : ''}`,
    'aria-label': `${x.kind === 'code' ? 'Coding problem' : 'Question'} ${i + 1}${itemDone(ex, x) ? ', answered' : ''}`,
    'aria-current': i === st.mi ? 'true' : null,
    disabled: paused || st.grading,
    onclick: () => go(i),
  }, x.kind === 'code' ? `C${i - ex.mcq.length + 1}` : String(i + 1))));

  const submit = () => {
    const left = items.length - answered;
    if (!confirm(left ? `Submit now? ${left} question${left === 1 ? ' is' : 's are'} still blank.` : 'Submit your exam?')) return;
    submitExam();
  };

  return h('div', { class: 'grid orgo-grid prog-grid' },
    h('div', { class: 'col' }, main),
    h('div', { class: 'col col-narrow' },
      h('section', { class: 'card prog-timer-card' },
        h('div', { class: 'prog-timer-row' },
          h('div', null, h('div', { class: 'muted small', text: 'Time left' }), timerEl),
          h('button', {
            type: 'button', class: 'btn btn-small', disabled: st.grading,
            onclick: () => {
              if (ex.since) { ex.elapsed += Date.now() - ex.since; ex.since = null; } else ex.since = Date.now();
              setExam(ex); C.render();
            },
          }, paused ? 'Resume' : 'Pause')),
        h('div', { class: 'muted small', text: `${answered} of ${items.length} answered` }),
        nav,
        h('div', { class: 'row prog-submit-row' },
          h('button', { type: 'button', class: 'btn btn-primary', disabled: st.grading, onclick: submit }, 'Submit exam'),
          h('button', {
            type: 'button', class: 'link small', disabled: st.grading,
            onclick: () => { if (confirm('Throw this attempt away? It won\'t be scored.')) { setExam(null); C.render(); } },
          }, 'Quit without scoring'))),
      card('Reminders', null, h('ul', { class: 'bullets small' },
        h('li', { text: 'You can change any answer until you submit.' }),
        h('li', { text: 'Coding problems get partial credit per passing test.' }),
        h('li', { text: 'At 0:00 the exam submits itself.' })))));
}

function mockResults(ex) {
  const { h, card } = C;
  const sc = examScore(ex);
  const used = Math.min(EXAM_MIN * 60e3, ex.elapsed);
  const verdict = sc.pct >= 90 ? 'Excellent. You\'re ready ✿' : sc.pct >= 80 ? 'Solid. Review the misses below.' : sc.pct >= 70 ? 'Getting there. Focus on your weakest topic.' : 'Keep practicing. Start with the topic bars below.';
  const topicRows = TOPICS.filter(t => sc.topics[t]).map(t => {
    const x = sc.topics[t];
    const pct = Math.round((100 * x.got) / x.max);
    return h('li', { class: 'prog-topic-row' },
      h('span', { class: 'prog-topic-name', text: t }),
      h('span', { class: `prog-topic-bar${pct < 60 ? ' weak' : ''}` }, h('span', { style: `width:${pct}%` })),
      h('span', { class: 'prog-topic-score', text: `${x.got}/${x.max}` }));
  });

  const review = examItems(ex).map((it, i) => {
    if (it.kind === 'mcq') {
      const q = mcqById(it.id);
      const mine = ex.answers[it.id];
      const ok = mine === q.answer;
      return h('li', { class: `prog-review-item ${ok ? 'ok' : 'no'}` },
        h('div', { class: 'prog-review-head' },
          h('span', { class: 'prog-test-mark', 'aria-hidden': 'true', text: ok ? '✓' : '✗' }),
          h('strong', { text: `Question ${i + 1}` }), h('span', { class: 'muted small', text: q.topic })),
        q.code ? codeBlock(q.code, 'prog-snippet') : null,
        h('p', { class: 'small', text: q.prompt || 'What does this print?' }),
        h('div', { class: 'prog-review-answers' },
          h('div', null, h('span', { class: 'muted small', text: 'Your answer' }), h('pre', { class: ok ? '' : 'prog-wrong', text: mine === undefined ? '(blank)' : mine })),
          ok ? null : h('div', null, h('span', { class: 'muted small', text: 'Correct' }), h('pre', { class: 'prog-right', text: q.answer }))),
        h('p', { class: 'small prog-why', text: q.why }));
    }
    const p = codeById(it.id);
    const g = ex.graded[it.id] || { pass: 0, total: 1 };
    const pts = Math.round((CODE_POINTS * g.pass / g.total) * 10) / 10;
    const full = g.pass === g.total;
    return h('li', { class: `prog-review-item ${full ? 'ok' : 'no'}` },
      h('div', { class: 'prog-review-head' },
        h('span', { class: 'prog-test-mark', 'aria-hidden': 'true', text: full ? '✓' : '✗' }),
        h('strong', { text: `Coding: ${p.title}` }), h('span', { class: 'muted small', text: `${pts} / ${CODE_POINTS} points · ${g.pass} of ${g.total} tests` })),
      h('p', { class: 'small', text: p.prompt }),
      g.error ? h('pre', { class: 'prog-test-err', text: g.error }) : null,
      g.results ? h('div', { class: 'prog-review-tests' }, g.results.map(testRow)) : null,
      h('details', { class: 'prog-review-sol' },
        h('summary', null, 'Your code and a model solution'),
        h('div', { class: 'muted small', text: 'Yours' }), codeBlock(ex.src[it.id] ?? p.starter),
        h('div', { class: 'muted small', text: 'One way to do it' }), codeBlock(p.solution)));
  });

  return h('div', { class: 'grid orgo-grid prog-grid' },
    h('div', { class: 'col' },
      h('section', { class: 'card prog-card prog-score-card' },
        h('div', { class: 'prog-score' },
          h('div', { class: 'prog-score-big' }, h('strong', { text: `${sc.pct}%` }), h('span', { class: 'muted', text: `${sc.got} / ${sc.max} points` })),
          h('div', null, h('p', { class: 'prog-prompt', text: verdict }),
            h('p', { class: 'muted small', text: `Time used: ${fmtClock(used)} of ${EXAM_MIN}:00` }))),
        h('ul', { class: 'prog-topics' }, topicRows),
        h('div', { class: 'row' },
          h('button', { type: 'button', class: 'btn btn-primary', onclick: () => { setExam(newExam()); st.mi = 0; C.render(); window.scrollTo({ top: 0 }); } }, 'Retake with new questions'),
          h('button', { type: 'button', class: 'btn', onclick: () => { setExam(null); C.render(); } }, 'Done'))),
      h('section', { class: 'card prog-card' },
        h('div', { class: 'prog-prob-head' }, h('h2', { text: 'Review' })),
        h('ol', { class: 'prog-review' }, review))),
    h('div', { class: 'col col-narrow' },
      historyCard(),
      card('What to do next', null, h('ul', { class: 'bullets small' },
        h('li', { text: 'Redo every question you missed without looking at the answer.' }),
        h('li', { text: 'Weakest topic? Open Practice, pick that module, and do 3 problems.' }),
        h('li', { text: 'Take another mock in a day or two: retakes favour questions you haven\'t seen.' })))));
}

// ---------------------------------------------------------------- interview practice

function interviewPage() {
  const { h, card } = C;
  let p = INTERVIEW.find(x => x.id === st.iv) || INTERVIEW[0];
  st.iv = p.id;
  const rec = saved(p.id);
  const w = workspace(`iv:${p.id}`, {
    value: rec.code ?? p.starter,
    label: `Code for ${p.title}`,
    onChange: debounce(code => saveProb(p.id, { code }), 300),
    onRun: () => runCode(w.editor.get(), '', w.con),
  });
  if (!w.con.el.childNodes.length) w.con.placeholder('Run your code to see what it prints, or Check to test it.');
  const pick = id => { st.iv = id; store('iv', id); st.hintLevel = 0; st.ivSol = false; C.render(); };
  const idx = INTERVIEW.indexOf(p);
  const check = async () => {
    const all = await checkInto(w.con, w.editor.get(), p);
    if (all && !rec.solved) { saveProb(p.id, { solved: true, code: w.editor.get() }); C.render(); }
    else if (all) saveProb(p.id, { code: w.editor.get() });
  };
  const stopBtn = h('button', { type: 'button', class: 'btn prog-stop', onclick: () => engine.stop() }, '■ Stop');
  bindStop(stopBtn);
  const hintsShown = p.hints.slice(0, st.hintLevel);

  const problemCard = h('section', { class: 'card prog-card' },
    h('div', { class: 'prog-prob-head' },
      h('span', { class: `prog-badge prog-level lvl-${p.level.toLowerCase()}`, text: p.level }),
      h('h2', { text: p.title }),
      rec.solved ? h('span', { class: 'prog-solved', text: 'Solved ✓' }) : null,
      h('span', { class: 'prog-spacer' }),
      h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Previous problem', onclick: () => pick(INTERVIEW[(idx - 1 + INTERVIEW.length) % INTERVIEW.length].id) }, '‹'),
      h('span', { class: 'muted small', text: `${idx + 1} / ${INTERVIEW.length}` }),
      h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Next problem', onclick: () => pick(INTERVIEW[(idx + 1) % INTERVIEW.length].id) }, '›')),
    h('p', { class: 'prog-prompt', text: p.prompt }),
    w.editor.el,
    h('div', { class: 'prog-actions' },
      h('button', { type: 'button', class: 'btn prog-run', title: 'Run (Ctrl+Enter)', onclick: () => w.onRun() }, '▶ Run'),
      h('button', { type: 'button', class: 'btn btn-primary prog-check', onclick: check }, '✓ Check'),
      stopBtn,
      h('span', { class: 'prog-spacer' }),
      st.hintLevel < p.hints.length
        ? h('button', { type: 'button', class: 'btn btn-small btn-quiet', onclick: () => { st.hintLevel++; C.render(); } }, `Hint ${st.hintLevel + 1} of ${p.hints.length}`)
        : null,
      h('button', { type: 'button', class: 'btn btn-small btn-quiet', onclick: () => { st.ivSol = !st.ivSol; C.render(); } }, st.ivSol ? 'Hide solution' : 'Solution'),
      h('button', {
        type: 'button', class: 'btn btn-small btn-quiet', onclick: () => {
          if (w.editor.get() !== p.starter && !confirm('Reset to the starter code? Your code for this problem will be replaced.')) return;
          w.editor.set(p.starter);
        },
      }, 'Reset')),
    hintsShown.length ? h('ol', { class: 'prog-hints' }, hintsShown.map(t => h('li', { class: 'prog-hint', text: t }))) : null,
    st.ivSol ? h('div', { class: 'prog-solution' },
      h('div', { class: 'prog-sol-head' }, h('span', { class: 'muted small', text: 'One good answer' }),
        h('button', { type: 'button', class: 'btn btn-small', onclick: () => { if (confirm('Replace your code with this solution?')) w.editor.set(p.solution); } }, 'Use this code')),
      codeBlock(p.solution),
      h('div', { class: 'prog-bigo' },
        h('span', null, h('span', { class: 'muted small', text: 'Time ' }), h('strong', { text: p.big.time })),
        h('span', null, h('span', { class: 'muted small', text: 'Space ' }), h('strong', { text: p.big.space })))) : null,
    h('div', { class: 'prog-console-head' }, h('span', { text: 'Output' }), h('button', { type: 'button', class: 'link small', onclick: () => w.con.clear() }, 'Clear')),
    w.con.el);

  const solvedCount = INTERVIEW.filter(x => saved(x.id).solved).length;
  const listEl = h('ol', { class: 'prog-list' }, INTERVIEW.map(x => h('li', null, h('button', {
    type: 'button', class: `prog-item${x.id === p.id ? ' on' : ''}${saved(x.id).solved ? ' done' : ''}`,
    'aria-current': x.id === p.id ? 'true' : null,
    onclick: () => pick(x.id),
  }, h('span', { class: `prog-item-mod lvl-${x.level.toLowerCase()}`, text: x.level }), h('span', { class: 'prog-item-title', text: x.title }),
  h('span', { class: 'prog-item-check', 'aria-label': saved(x.id).solved ? 'solved' : null, text: saved(x.id).solved ? '✓' : '' })))));

  return h('div', { class: 'grid orgo-grid prog-grid' },
    h('div', { class: 'col' }, problemCard),
    h('div', { class: 'col col-narrow' },
      card('What interviewers look for', null, h('ul', { class: 'bullets small' }, p.tips.map(t => h('li', { text: t })))),
      card('Interview problems', h('span', { class: 'card-meta', text: `${solvedCount} / ${INTERVIEW.length} solved` }), listEl),
      card('How to practice', null, h('ol', { class: 'bullets numbered small' },
        h('li', { text: 'Read the problem and say the edge cases out loud before typing.' }),
        h('li', { text: 'Explain a simple (even slow) approach first, then improve it.' }),
        h('li', { text: 'Use the hints one at a time, only when you\'re stuck for a few minutes.' }),
        h('li', { text: 'After solving, state the time and space complexity, then compare with the solution.' })))));
}
