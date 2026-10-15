// Python syntax highlighting and a small code editor: a transparent textarea
// laid over a highlighted <pre>, with line numbers and Python-friendly keys.

const KEYWORDS = new Set(['False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield', 'match', 'case']);
const CONSTS = new Set(['True', 'False', 'None']);
const BUILTINS = new Set(['print', 'input', 'len', 'range', 'int', 'float', 'str', 'bool', 'list', 'dict', 'set', 'tuple', 'sum', 'min', 'max', 'abs', 'round', 'sorted', 'reversed', 'enumerate', 'zip', 'map', 'filter', 'isinstance', 'type', 'ord', 'chr', 'bin', 'hex', 'oct', 'any', 'all', 'open', 'repr', 'divmod', 'pow', 'iter', 'next', 'super', 'object', 'format', 'id', 'hash', 'frozenset', 'self']);

const TOKEN = new RegExp([
  '(#[^\\n]*)',                                                          // 1 comment
  '((?:[rRbBuU]|[fF][rR]?|[rR][fF])?(?:"""[\\s\\S]*?(?:"""|$)|\'\'\'[\\s\\S]*?(?:\'\'\'|$)))', // 2 triple string
  '((?:[rRbBuU]|[fF][rR]?|[rR][fF])?(?:"(?:\\\\.|[^"\\\\\\n])*"?|\'(?:\\\\.|[^\'\\\\\\n])*\'?))',  // 3 string
  '(@[A-Za-z_][\\w.]*)',                                                 // 4 decorator
  '(\\b(?:0[xX][0-9a-fA-F_]+|0[bB][01_]+|0[oO][0-7_]+|(?:\\d[\\d_]*\\.?[\\d_]*|\\.\\d[\\d_]*)(?:[eE][+-]?\\d+)?j?)\\b)', // 5 number
  '([A-Za-z_]\\w*)',                                                     // 6 name
  '(==|!=|<=|>=|//=?|\\*\\*=?|->|[-+*/%&|^~<>]=?|=)',                   // 7 operator
].join('|'), 'g');

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function stringHTML(s) {
  const m = /^([rRbBuUfF]{0,2})/.exec(s);
  const prefix = m[1];
  if (!/[fF]/.test(prefix)) return `<span class="tok-str">${esc(s)}</span>`;
  // f-string: colour the {expressions} differently ({{ and }} are literal braces)
  let out = '', i = 0, buf = '';
  while (i < s.length) {
    if ((s[i] === '{' && s[i + 1] === '{') || (s[i] === '}' && s[i + 1] === '}')) { buf += s[i] + s[i + 1]; i += 2; continue; }
    if (s[i] === '{') {
      const end = s.indexOf('}', i);
      if (end < 0) { buf += s.slice(i); break; }
      out += `<span class="tok-str">${esc(buf)}</span><span class="tok-fx">${esc(s.slice(i, end + 1))}</span>`;
      buf = ''; i = end + 1; continue;
    }
    buf += s[i++];
  }
  return out + `<span class="tok-str">${esc(buf)}</span>`;
}

/** Python source → HTML with token spans. */
export function highlight(code) {
  let out = '', last = 0, prevName = '';
  TOKEN.lastIndex = 0;
  let m;
  while ((m = TOKEN.exec(code))) {
    if (m[0] === '') { TOKEN.lastIndex++; continue; }
    out += esc(code.slice(last, m.index));
    last = m.index + m[0].length;
    const [tok] = m;
    if (m[1]) out += `<span class="tok-com">${esc(tok)}</span>`;
    else if (m[2] || m[3]) out += stringHTML(tok);
    else if (m[4]) out += `<span class="tok-deco">${esc(tok)}</span>`;
    else if (m[5]) out += `<span class="tok-num">${esc(tok)}</span>`;
    else if (m[6]) {
      let cls = '';
      if (CONSTS.has(tok)) cls = 'tok-const';
      else if (KEYWORDS.has(tok)) cls = 'tok-kw';
      else if (prevName === 'def' || prevName === 'class') cls = 'tok-def';
      else if (BUILTINS.has(tok)) cls = 'tok-builtin';
      else if (/^\s*\(/.test(code.slice(last, last + 8))) cls = 'tok-call';
      out += cls ? `<span class="${cls}">${esc(tok)}</span>` : esc(tok);
      prevName = tok;
      continue;
    } else if (m[7]) out += `<span class="tok-op">${esc(tok)}</span>`;
    else out += esc(tok);
    prevName = '';
  }
  return out + esc(code.slice(last));
}

/** Read-only highlighted block. */
export function codeBlock(code, cls = '') {
  const pre = document.createElement('pre');
  pre.className = `prog-code ${cls}`.trim();
  const c = document.createElement('code');
  c.innerHTML = highlight(code);
  pre.append(c);
  return pre;
}

function insert(ta, text) {
  ta.focus();
  // execCommand keeps the browser's undo history working; fall back if it's gone
  if (!document.execCommand || !document.execCommand('insertText', false, text)) {
    ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, 'end');
    ta.dispatchEvent(new Event('input'));
  }
}

/**
 * Editable highlighted editor. Returns { el, get(), set(code), focus() }.
 * opts: { value, onChange(code), onRun(), label, minLines }
 */
export function makeEditor({ value = '', onChange, onRun, label = 'Python code', minLines = 8 } = {}) {
  const el = document.createElement('div');
  el.className = 'prog-editor';
  const gutter = document.createElement('div');
  gutter.className = 'prog-gutter'; gutter.setAttribute('aria-hidden', 'true');
  const wrap = document.createElement('div');
  wrap.className = 'prog-edit-wrap';
  const pre = document.createElement('pre');
  pre.className = 'prog-hl'; pre.setAttribute('aria-hidden', 'true');
  const code = document.createElement('code');
  pre.append(code);
  const ta = document.createElement('textarea');
  ta.className = 'prog-ta';
  ta.spellcheck = false;
  ta.setAttribute('autocapitalize', 'off'); ta.setAttribute('autocomplete', 'off'); ta.setAttribute('autocorrect', 'off');
  ta.setAttribute('aria-label', `${label}. Tab indents; press Escape then Tab to leave the editor.`);
  ta.wrap = 'off';
  ta.value = value;
  wrap.append(pre, ta);
  el.append(gutter, wrap);

  let lines = 0;
  const paint = () => {
    const v = ta.value;
    code.innerHTML = highlight(v) + '\n';
    const n = v.split('\n').length;
    if (n !== lines) {
      lines = n;
      gutter.textContent = Array.from({ length: Math.max(n, minLines) }, (_, i) => i + 1).join('\n');
      el.style.setProperty('--prog-lines', String(Math.max(n, minLines)));
    }
    sync();
  };
  const sync = () => {
    pre.scrollTop = ta.scrollTop; pre.scrollLeft = ta.scrollLeft;
    gutter.scrollTop = ta.scrollTop;
  };
  ta.addEventListener('input', () => { paint(); if (onChange) onChange(ta.value); });
  ta.addEventListener('scroll', sync);

  let escaped = false;
  ta.addEventListener('keydown', e => {
    if (e.key === 'Escape') { escaped = true; return; }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); if (onRun) onRun(); return; }
    const v = ta.value, s = ta.selectionStart, en = ta.selectionEnd;
    const lineStart = v.lastIndexOf('\n', s - 1) + 1;
    if (e.key === 'Tab') {
      if (escaped) { escaped = false; return; } // let focus move on
      e.preventDefault();
      const multi = v.slice(s, en).includes('\n');
      if (!multi && !e.shiftKey) { insert(ta, '    '); return; }
      // indent / dedent every selected line
      const endLine = v.indexOf('\n', en - (en > s && v[en - 1] === '\n' ? 1 : 0));
      const blockEnd = endLine < 0 ? v.length : endLine;
      const block = v.slice(lineStart, blockEnd);
      const next = block.split('\n').map(l => (e.shiftKey ? l.replace(/^ {1,4}/, '') : `    ${l}`)).join('\n');
      ta.setSelectionRange(lineStart, blockEnd);
      insert(ta, next);
      ta.setSelectionRange(lineStart, lineStart + next.length);
      return;
    }
    escaped = false;
    if (e.key === 'Enter' && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      const before = v.slice(lineStart, s);
      let indent = (/^ */.exec(before) || [''])[0];
      const trimmed = before.replace(/#.*$/, '').trimEnd();
      if (trimmed.endsWith(':')) indent += '    ';
      else if (/^\s*(return|pass|break|continue|raise)\b/.test(before)) indent = indent.slice(0, Math.max(0, indent.length - 4));
      insert(ta, `\n${indent}`);
      return;
    }
    if (e.key === 'Backspace' && s === en && s > lineStart) {
      const before = v.slice(lineStart, s);
      if (/^ +$/.test(before)) {
        e.preventDefault();
        const drop = before.length % 4 || 4;
        ta.setSelectionRange(s - drop, s);
        if (!document.execCommand || !document.execCommand('delete')) {
          ta.setRangeText('', s - drop, s, 'end');
          ta.dispatchEvent(new Event('input'));
        }
      }
    }
  });

  paint();
  return {
    el,
    get: () => ta.value,
    set: v => { ta.value = v; paint(); if (onChange) onChange(v); },
    focus: () => ta.focus(),
  };
}
