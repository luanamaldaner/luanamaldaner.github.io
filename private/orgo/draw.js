// SVG drawing: reaction energy diagrams and skeletal (line-angle) structures.

const NS = 'http://www.w3.org/2000/svg';
function el(tag, attrs = {}, ...kids) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v !== null && v !== undefined) e.setAttribute(k, v);
  for (const k of kids.flat()) if (k) e.append(k);
  return e;
}
function text(x, y, str, attrs = {}) {
  const t = el('text', { x, y, ...attrs });
  t.textContent = str;
  return t;
}

// ---------------------------------------------------------------- energy diagram

/** Energy at reaction progress x for stationary points [[x, y, kind, label], ...]. */
export function energyAt(points, x) {
  if (x <= points[0][0]) return points[0][1];
  for (let i = 1; i < points.length; i++) {
    const [x1, y1] = points[i];
    if (x <= x1) {
      const [x0, y0] = points[i - 1];
      const u = (x - x0) / (x1 - x0);
      return y0 + (y1 - y0) * (1 - Math.cos(Math.PI * u)) / 2;
    }
  }
  return points[points.length - 1][1];
}

const W = 340, H = 200, L = 30, R = 330, T = 16, B = 168;
let energyIds = 0;
const px = x => L + 6 + x * (R - L - 12);
const py = y => B - (y / 100) * (B - T);

/** Returns { svg, setT(t) }. */
export function energyDiagram(points) {
  const d = [];
  for (let i = 0; i <= 160; i++) {
    const x = i / 160;
    d.push(`${i ? 'L' : 'M'}${px(x).toFixed(1)},${py(energyAt(points, x)).toFixed(1)}`);
  }
  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, class: 'energy', role: 'img', 'aria-label': 'Reaction energy diagram' });
  svg.append(
    el('path', { d: `M${L},${T - 6} L${L},${B} L${R},${B}`, class: 'en-axis' }),
    el('path', { d: `M${L - 4},${T} L${L},${T - 7} L${L + 4},${T}`, class: 'en-axis' }),
    text(12, (T + B) / 2, 'Energy', { class: 'en-axis-label', transform: `rotate(-90 12 ${(T + B) / 2})`, 'text-anchor': 'middle' }),
    text((L + R) / 2, B + 22, 'Reaction progress →', { class: 'en-axis-label', 'text-anchor': 'middle' }),
  );
  // activation energy for the highest barrier, measured from the start
  const start = points[0];
  const top = points.reduce((a, p) => (p[2] === 'ts' && p[1] > a[1] ? p : a), [0, -1]);
  if (top[1] > 0) {
    const ax = px(top[0]) - 14;
    svg.append(
      el('line', { x1: px(start[0]), y1: py(start[1]), x2: px(top[0]) + 8, y2: py(start[1]), class: 'en-guide' }),
      el('line', { x1: ax, y1: py(start[1]) - 2, x2: ax, y2: py(top[1]) + 5, class: 'en-ea' }),
      el('path', { d: `M${ax - 3.5},${py(top[1]) + 9} L${ax},${py(top[1]) + 3} L${ax + 3.5},${py(top[1]) + 9}`, class: 'en-ea' }),
      text(ax - 5, (py(start[1]) + py(top[1])) / 2 + 4, 'Ea', { class: 'en-ea-label', 'text-anchor': 'end' }),
    );
  }
  // colourful curve: a soft filled area, the whole path faint, and the part
  // already travelled drawn bright (clipped to the dot's x)
  const uid = `en${++energyIds}`;
  const area = `${d.join(' ')} L${px(1).toFixed(1)},${B} L${px(0).toFixed(1)},${B} Z`;
  const clipRect = el('rect', { x: 0, y: 0, width: px(0), height: H });
  svg.append(
    el('defs', {},
      el('linearGradient', { id: `${uid}-g`, x1: 0, y1: 0, x2: 1, y2: 0 },
        el('stop', { offset: '0%', class: 'en-stop-a' }), el('stop', { offset: '50%', class: 'en-stop-b' }), el('stop', { offset: '100%', class: 'en-stop-c' })),
      el('linearGradient', { id: `${uid}-f`, x1: 0, y1: 0, x2: 0, y2: 1 },
        el('stop', { offset: '0%', class: 'en-fill-top' }), el('stop', { offset: '100%', class: 'en-fill-bottom' })),
      el('clipPath', { id: `${uid}-c` }, clipRect)),
    el('path', { d: area, class: 'en-area', fill: `url(#${uid}-f)` }),
    el('path', { d: d.join(' '), class: 'en-curve en-curve-faint', stroke: `url(#${uid}-g)` }),
    el('path', { d: d.join(' '), class: 'en-curve', stroke: `url(#${uid}-g)`, 'clip-path': `url(#${uid}-c)` }));
  for (const [x, y, kind, label] of points) {
    if (kind === 'ts') svg.append(text(px(x), py(y) - 7, '‡', { class: 'en-ts', 'text-anchor': 'middle' }));
    else if (label) {
      const anchor = x === 0 ? 'start' : x === 1 ? 'end' : 'middle';
      const ly = y < 28 ? py(y) - 9 : py(y) + 16; // low points: label above the curve, clear of the axis
      svg.append(text(px(x) + (x === 0 ? -2 : x === 1 ? 2 : 0), ly, label, { class: `en-label en-${kind}`, 'text-anchor': anchor }));
    }
  }
  const dot = el('circle', { r: 6, class: 'en-dot' });
  const halo = el('circle', { r: 11, class: 'en-halo' });
  svg.append(halo, dot);
  const setT = t => {
    const x = px(t), y = py(energyAt(points, t));
    clipRect.setAttribute('width', x + 3);
    dot.setAttribute('cx', x); dot.setAttribute('cy', y);
    halo.setAttribute('cx', x); halo.setAttribute('cy', y);
  };
  setT(0);
  return { svg, setT };
}

// ---------------------------------------------------------------- skeletal structures

/**
 * spec = { atoms: [[x, y, label?, opts?]], bonds: [[i, j, type, opts?]] }
 * Coordinates in bond lengths, y up. type: 1 | 2 | 'w' (wedge, narrow at i)
 * | 'h' (hash, narrow at i). Double bonds draw their second line toward
 * opts.toward ([x, y]) or centred. opts.hl colours a bond or label pink.
 */
export function skeletal(spec, { scale = 30, className = 'skel' } = {}) {
  const pts = spec.atoms.map(a => [a[0], -a[1]]);
  const lab = spec.atoms.map(a => a[2] || '');
  const aopt = spec.atoms.map(a => a[3] || {});
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const pad = 0.75;
  const minX = Math.min(...xs) - pad, maxX = Math.max(...xs) + pad;
  const minY = Math.min(...ys) - pad, maxY = Math.max(...ys) + pad;
  const svg = el('svg', {
    viewBox: `${minX} ${minY} ${maxX - minX} ${maxY - minY}`,
    width: ((maxX - minX) * scale).toFixed(0), height: ((maxY - minY) * scale).toFixed(0),
    class: className, role: 'img', 'aria-label': spec.name || 'structure',
  });
  const trim = (i, j) => {
    // shorten a bond end that meets a text label
    const [x1, y1] = pts[i], [x2, y2] = pts[j];
    const dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy) || 1;
    const t1 = lab[i] ? 0.3 : 0, t2 = lab[j] ? 0.3 : 0;
    return [[x1 + dx / l * t1, y1 + dy / l * t1], [x2 - dx / l * t2, y2 - dy / l * t2], [dx / l, dy / l]];
  };
  for (const [i, j, type = 1, o = {}] of spec.bonds) {
    const [a, b, u] = trim(i, j);
    const cls = `sk-bond${o.hl ? ' hl' : ''}`;
    if (type === 'w') {
      const n = [-u[1] * 0.13, u[0] * 0.13];
      svg.append(el('path', { d: `M${a[0]},${a[1]} L${b[0] + n[0]},${b[1] + n[1]} L${b[0] - n[0]},${b[1] - n[1]} Z`, class: `sk-wedge${o.hl ? ' hl' : ''}` }));
    } else if (type === 'h') {
      const g = el('g', { class: cls });
      for (let k = 1; k <= 6; k++) {
        const f = k / 6.4, w = 0.03 + 0.11 * f;
        const c = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
        g.append(el('line', { x1: c[0] - u[1] * w, y1: c[1] + u[0] * w, x2: c[0] + u[1] * w, y2: c[1] - u[0] * w }));
      }
      svg.append(g);
    } else {
      svg.append(el('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: cls }));
      if (type === 2) {
        let n = [-u[1], u[0]];
        if (o.toward) {
          const tw = [o.toward[0], -o.toward[1]];
          const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
          if ((tw[0] - m[0]) * n[0] + (tw[1] - m[1]) * n[1] < 0) n = [-n[0], -n[1]];
          const off = 0.17, sh = 0.16;
          svg.append(el('line', {
            x1: a[0] + n[0] * off + u[0] * sh, y1: a[1] + n[1] * off + u[1] * sh,
            x2: b[0] + n[0] * off - u[0] * sh, y2: b[1] + n[1] * off - u[1] * sh, class: cls,
          }));
        } else {
          // centred double bond (e.g. C=O): shift both lines
          const off = 0.08;
          svg.lastChild.remove();
          for (const s of [1, -1]) {
            svg.append(el('line', { x1: a[0] + n[0] * off * s, y1: a[1] + n[1] * off * s, x2: b[0] + n[0] * off * s, y2: b[1] + n[1] * off * s, class: cls }));
          }
        }
      }
    }
  }
  pts.forEach(([x, y], i) => {
    if (!lab[i]) return;
    const o = aopt[i];
    const align = o.align || 'start';
    const fs = 0.56;
    const first = 0.62 * fs * 0.5;
    const t = el('text', {
      x: align === 'start' ? x - first : align === 'end' ? x + first : x,
      y: y + fs * 0.36, 'font-size': fs,
      'text-anchor': align === 'start' ? 'start' : align === 'end' ? 'end' : 'middle',
      class: `sk-label${o.hl ? ' hl' : ''}`,
    });
    // digits become subscripts, + and − superscripts
    for (const part of lab[i].match(/\d+|[+−-]|[^\d+−-]+/g)) {
      const ts = el('tspan', {});
      ts.textContent = part;
      if (/^\d+$/.test(part)) { ts.setAttribute('font-size', fs * 0.72); ts.setAttribute('dy', fs * 0.2); }
      else if (/^[+−-]$/.test(part)) { ts.setAttribute('font-size', fs * 0.72); ts.setAttribute('dy', -fs * 0.35); }
      t.append(ts);
      if (/^\d+$/.test(part) || /^[+−-]$/.test(part)) {
        const back = el('tspan', { dy: /^\d+$/.test(part) ? -fs * 0.2 : fs * 0.35 });
        back.textContent = '​';
        t.append(back);
      }
    }
    svg.append(t);
  });
  return svg;
}
