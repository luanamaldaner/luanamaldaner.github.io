// Runs Python (Pyodide, self-hosted in ./pyodide/) off the main thread, so a
// runaway loop can be stopped by terminating this worker.
//
// Messages in:  { id, kind: 'run', code, stdin }
//               { id, kind: 'check', code, tests, recurse }
// Messages out: { type: 'ready', version } | { type: 'boot-error', error }
//               { type: 'out', id, text, stream }   (streamed while running)
//               { type: 'done', id, error, results }

/* global importScripts, loadPyodide */
importScripts('./pyodide/pyodide.js');

const HELPER = String.raw`
import sys, io, traceback, linecache, builtins, json

FILE = '<your code>'
MAX_OUT = 20000

class Emit:
    def __init__(self, stream):
        self.stream = stream
        self.n = 0
        self.cut = False
    def write(self, s):
        if not s:
            return 0
        if self.n > MAX_OUT:
            if not self.cut:
                self.cut = True
                _emit('\n… output cut off (over 20,000 characters)\n', 'info')
            return len(s)
        self.n += len(s)
        _emit(s, self.stream)
        return len(s)
    def flush(self):
        pass
    def isatty(self):
        return False

def _remember(code):
    linecache.cache[FILE] = (len(code), None, code.splitlines(True), FILE)

def _fmt(e):
    if isinstance(e, SyntaxError) and e.filename == FILE:
        msg = f'SyntaxError: {e.msg} (line {e.lineno})'
        if e.text:
            msg += '\n    ' + e.text.rstrip()
            if e.offset:
                msg += '\n    ' + ' ' * (e.offset - 1 - (len(e.text) - len(e.text.lstrip()))) + '^'
        return msg
    frames = [f for f in traceback.extract_tb(e.__traceback__) if f.filename == FILE]
    out = []
    if frames:
        out.append('Traceback (most recent call last):')
        for f in frames[-4:]:
            where = '' if f.name == '<module>' else f', in {f.name}'
            out.append(f'  line {f.lineno}{where}')
            if f.line:
                out.append('    ' + f.line.strip())
    name = type(e).__name__
    text = str(e)
    out.append(f'{name}: {text}' if text else name)
    if isinstance(e, EOFError):
        out.append('Hint: input() ran out of lines. Type more lines in the Input box (one per input() call).')
    if isinstance(e, RecursionError):
        out.append('Hint: the recursion never reached a base case (or went too deep).')
    return '\n'.join(out)

def _input_echo(prompt=''):
    sys.stdout.write(str(prompt))
    line = sys.stdin.readline()
    if not line:
        raise EOFError('EOF when reading a line')
    line = line.rstrip('\n')
    _emit(line + '\n', 'stdin')
    return line

def _input_quiet(prompt=''):
    line = sys.stdin.readline()
    if not line:
        raise EOFError('EOF when reading a line')
    return line.rstrip('\n')

def run_user(code, stdin):
    _remember(code)
    sys.stdout, sys.stderr = Emit('out'), Emit('err')
    sys.stdin = io.StringIO(stdin)
    builtins.input = _input_echo
    sys.setrecursionlimit(900)
    try:
        exec(compile(code, FILE, 'exec'), {'__name__': '__main__'})
        return None
    except SystemExit:
        return None
    except BaseException as e:
        return _fmt(e)
    finally:
        sys.stdout.flush()

def _norm(s):
    lines = [l.rstrip() for l in str(s).replace('\r\n', '\n').split('\n')]
    while lines and not lines[-1]:
        lines.pop()
    return '\n'.join(lines)

def _same(a, b):
    if isinstance(a, bool) or isinstance(b, bool):
        return type(a) is type(b) and a == b
    if isinstance(a, (int, float)) and isinstance(b, (int, float)):
        if isinstance(a, float) or isinstance(b, float):
            return abs(a - b) < 1e-6
        return a == b
    return type(a) is type(b) and a == b

def check_user(code, tests_json, recurse):
    tests = json.loads(tests_json)
    _remember(code)
    results = []
    builtins.input = _input_quiet
    sys.setrecursionlimit(900)
    for t in tests:
        quiet = io.StringIO()
        sys.stdout = sys.stderr = quiet
        r = {'ok': False}
        try:
            if 'stdin' in t:
                sys.stdin = io.StringIO(t['stdin'])
                r['label'] = 'input: ' + (t['stdin'].replace('\n', ' ⏎ ') or '(none)')
                try:
                    exec(compile(code, FILE, 'exec'), {'__name__': '__main__'})
                except SystemExit:
                    pass
                got = _norm(quiet.getvalue())
                want = _norm(t['expected'])
                r.update(ok=(got == want), got=got, expected=want, io=True)
            else:
                sys.stdin = io.StringIO('')
                ns = {'__name__': '__main__'}
                exec(compile(code, FILE, 'exec'), ns)
                r['label'] = t['call']
                got = eval(t['call'], ns)
                want = eval(t['expected'], {})
                r.update(ok=_same(got, want), got=repr(got), expected=repr(want))
        except BaseException as e:
            r['error'] = _fmt(e)
        finally:
            sys.stdout, sys.stderr = sys.__stdout__, sys.__stderr__
        results.append(r)
    if recurse:
        ns = {'__name__': '__main__'}
        sys.stdout = sys.stderr = io.StringIO()
        try:
            exec(compile(code, FILE, 'exec'), ns)
            fn = ns.get(recurse)
            ok = callable(fn) and recurse in fn.__code__.co_names
        except BaseException:
            ok = False
        finally:
            sys.stdout, sys.stderr = sys.__stdout__, sys.__stderr__
        results.append({'label': f'{recurse}() calls itself (recursion)', 'ok': ok,
                        'error': None if ok else f'{recurse} should call {recurse}(...) inside itself.'})
    return json.dumps(results)
`;

let py = null;
let current = null;

// Output is batched: one message per ~40 ms or 4 KB instead of one per print().
let buf = '', bufStream = '', lastPost = 0;
function flush() {
  if (!buf) return;
  postMessage({ type: 'out', id: current, text: buf, stream: bufStream });
  buf = ''; lastPost = performance.now();
}
function emit(text, stream) {
  stream = String(stream);
  if (buf && stream !== bufStream) flush();
  bufStream = stream;
  buf += String(text);
  if (stream === 'info' || buf.length > 4096 || performance.now() - lastPost > 40) flush();
}

const booting = (async () => {
  try {
    py = await loadPyodide({ indexURL: new URL('./pyodide/', self.location.href).href, stdout: () => {}, stderr: () => {} });
    py.globals.set('_emit', emit);
    py.runPython(HELPER);
    postMessage({ type: 'ready', version: py.runPython('import sys; sys.version.split()[0]') });
  } catch (e) {
    postMessage({ type: 'boot-error', error: String(e && e.message || e) });
  }
})();

self.onmessage = async ({ data }) => {
  await booting;
  if (!py) return;
  current = data.id;
  try {
    if (data.kind === 'run') {
      const err = py.globals.get('run_user')(data.code, data.stdin || '');
      flush();
      postMessage({ type: 'done', id: data.id, error: err || null });
    } else if (data.kind === 'check') {
      const out = py.globals.get('check_user')(data.code, JSON.stringify(data.tests), data.recurse || null);
      postMessage({ type: 'done', id: data.id, results: JSON.parse(out) });
    }
  } catch (e) {
    flush();
    postMessage({ type: 'done', id: data.id, error: String(e && e.message || e) });
  }
};
