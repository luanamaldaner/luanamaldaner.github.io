// The Prog 1 tab: write and run real Python (Pyodide in a worker), with
// auto-checked practice problems per module, "predict the output" drills
// and a free playground.

import { MODULES, EXAM2, PROBLEMS, PREDICT } from './problems.js?v=1';
import { makeEditor, codeBlock } from './highlight.js?v=1';

let C; // { h, card, render, ... } from app.js

const TABS = [['practice', 'Practice'], ['predict', 'Predict the output'], ['play', 'Playground']];
const RUN_LIMIT_MS = 8000;

function load(key, fallback) { try { const v = localStorage.getItem(`prog.${key}`); return v === null ? fallback : JSON.parse(v); } catch { return fallback; } }
function store(key, v) { try { localStorage.setItem(`prog.${key}`, JSON.stringify(v)); } catch {} }

const st = {
  tab: load('tab', 'practice'),
  mod: load('mod', 'exam2'),
  prob: load('prob', 'm7a-encode-rle'),
  showHint: false, showSol: false,
  pq: 0, picked: null, right: 0, total: 0, pmod: 'all',
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
  const body = { practice: practicePage, predict: predictPage, play: playPage }[st.tab] || practicePage;
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
  if (mod === 'all') return () => true;
  if (mod === 'exam2') return p => EXAM2.includes(p.module);
  return p => p.module === mod;
}

// ---------------------------------------------------------------- practice

function practicePage() {
  const { h, card } = C;
  const list = PROBLEMS.filter(modTest(st.mod));
  let p = PROBLEMS.find(x => x.id === st.prob);
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
    const con = w.con;
    con.clear();
    con.line('Checking…\n', 'info');
    const res = await engine.submit({ kind: 'check', code: w.editor.get(), tests: p.tests, recurse: p.recurse || null });
    con.clear();
    if (res.stopped) { con.line(stoppedText(res.stopped), 'err'); return; }
    if (res.error) { con.line(`${res.error}\n`, 'err'); return; }
    const pass = res.results.filter(r => r.ok).length;
    const all = pass === res.results.length;
    con.block(h('div', { class: `prog-verdict ${all ? 'ok' : 'no'}` }, all ? `All ${pass} tests passed ✿` : `${pass} of ${res.results.length} tests passed`));
    for (const r of res.results) {
      con.block(h('div', { class: `prog-test ${r.ok ? 'ok' : 'no'}` },
        h('span', { class: 'prog-test-mark', 'aria-hidden': 'true', text: r.ok ? '✓' : '✗' }),
        h('div', { class: 'prog-test-body' },
          h('code', { class: 'prog-test-label', text: r.label || '' }),
          r.error ? h('pre', { class: 'prog-test-err', text: r.error })
            : r.ok ? (r.io ? null : h('span', { class: 'muted', text: ` → ${r.got}` }))
              : r.io ? h('div', { class: 'prog-io-diff' },
                h('div', null, h('span', { class: 'muted small', text: 'expected' }), h('pre', { text: r.expected || '(nothing)' })),
                h('div', null, h('span', { class: 'muted small', text: 'you printed' }), h('pre', { text: r.got || '(nothing)' })))
                : h('span', { class: 'prog-test-want', text: ` expected ${r.expected}, got ${r.got}` }))));
    }
    requestAnimationFrame(() => { con.el.scrollTop = 0; }); // results read top-down: verdict first
    if (all && !rec.solved) { saveProb(p.id, { solved: true, code: w.editor.get() }); C.render(); }
    else if (all) saveProb(p.id, { code: w.editor.get() });
  };

  const mods = h('div', { class: 'chips prog-mods' },
    chip('Exam 2 (M7A–M8)', st.mod === 'exam2', () => setMod('exam2')),
    MODULES.map(([id, label]) => chip(`${id} · ${label}`, st.mod === id, () => setMod(id))),
    chip('All', st.mod === 'all', () => setMod('all')));

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
