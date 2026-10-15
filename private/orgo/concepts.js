// Concept animations for the Orgo tab: small looping canvases that show the
// "why" behind SN1/SN2/E1/E2 and alkene additions. Each one draws into a
// 520×300 virtual stage that scales with its card.

const VW = 520, VH = 300, TAU = Math.PI * 2;
const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const seg = (u, a, b) => smooth((u - a) / (b - a));
const lerp = (a, b, k) => a + (b - a) * k;
const frac = x => x - Math.floor(x);
const qb = (a, c, b, u) => (1 - u) * (1 - u) * a + 2 * u * (1 - u) * c + u * u * b;

// ---------------------------------------------------------------- colours

function hexRgb(hex) {
  const n = parseInt(String(hex).replace('#', '').slice(0, 6), 16) || 0;
  return [n >> 16 & 255, n >> 8 & 255, n & 255];
}
const rgba = (hex, a) => { const [r, g, b] = hexRgb(hex); return `rgba(${r},${g},${b},${a})`; };
const mix = (a, b, k) => { const x = hexRgb(a), y = hexRgb(b); return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * k)).join(',')})`; };
const lum = hex => { const [r, g, b] = hexRgb(hex); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; };

const VARS = {
  text: '--text', muted: '--muted', card: '--card', line: '--line',
  pink: '--oc-pink', violet: '--oc-violet', mint: '--oc-mint', amber: '--oc-amber', blue: '--oc-blue', red: '--oc-red',
  C: '--oc-c', H: '--oc-h', F: '--oc-f', Cl: '--oc-cl', Br: '--oc-br', I: '--oc-i',
};
let P = {}; // palette for the frame being drawn

function palette(el) {
  const cs = getComputedStyle(el);
  const p = {};
  for (const [k, v] of Object.entries(VARS)) p[k] = cs.getPropertyValue(v).trim() || '#888888';
  p.bond = mix(p.muted, p.card, 0.25);
  return p;
}

// ---------------------------------------------------------------- drawing kit

function glow(g, x, y, r, col, a = 0.6) {
  const gr = g.createRadialGradient(x, y, 0, x, y, r);
  gr.addColorStop(0, rgba(col, a));
  gr.addColorStop(1, rgba(col, 0));
  g.fillStyle = gr;
  g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
}

function ball(g, x, y, r, col, label = '', alpha = 1) {
  g.save();
  g.globalAlpha *= alpha;
  const gr = g.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.08, x, y, r);
  gr.addColorStop(0, mix(col, '#ffffff', 0.6));
  gr.addColorStop(0.6, col);
  gr.addColorStop(1, mix(col, '#000000', 0.22));
  g.fillStyle = gr;
  g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
  if (label) {
    g.fillStyle = lum(col) > 0.62 ? '#33403a' : '#ffffff';
    g.font = `600 ${Math.round(clamp(r * 0.8, 9, 15))}px ${FONT}`;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(label, x, y + 0.5);
  }
  g.restore();
}

function stick(g, x1, y1, x2, y2, w = 5, alpha = 1, dash = false, col = P.bond) {
  g.save();
  g.globalAlpha *= alpha;
  g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round';
  if (dash) g.setLineDash([w * 0.9, w * 1.3]);
  g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
  g.restore();
}

/** Double bond: a second, glowing line beside the first. */
function piBond(g, x1, y1, x2, y2, k) {
  if (k <= 0.01) return;
  const dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy), ox = -dy / l * 9, oy = dx / l * 9;
  g.save();
  g.globalAlpha *= k;
  g.shadowColor = rgba(P.mint, 0.9); g.shadowBlur = 12;
  stick(g, x1 + ox, y1 + oy, x2 + ox, y2 + oy, 4.5, 1, false, P.mint);
  g.restore();
}

function txt(g, s, x, y, { size = 13, col = P.text, weight = 500, align = 'center', alpha = 1, base = 'middle' } = {}) {
  g.save();
  g.globalAlpha *= alpha;
  g.fillStyle = col; g.font = `${weight} ${size * (P.fs || 1)}px ${FONT}`;
  g.textAlign = align; g.textBaseline = base;
  g.fillText(s, x, y);
  g.restore();
}

/** Little charge badge (+ or −) beside an atom. */
function badge(g, x, y, sign, alpha = 1) {
  if (alpha <= 0.01) return;
  const col = sign === '+' ? P.pink : P.blue;
  g.save();
  g.globalAlpha *= alpha;
  g.fillStyle = P.card; g.strokeStyle = col; g.lineWidth = 2;
  g.beginPath(); g.arc(x, y, 8, 0, TAU); g.fill(); g.stroke();
  txt(g, sign, x, y + 0.5, { size: 13, col, weight: 700 });
  g.restore();
}

function ripple(g, x, y, k, col) {
  if (k <= 0 || k >= 1) return;
  g.save();
  g.strokeStyle = rgba(col, (1 - k) * 0.8); g.lineWidth = 3 * (1 - k) + 1;
  g.beginPath(); g.arc(x, y, 10 + 40 * k, 0, TAU); g.stroke();
  g.restore();
}

/** Teardrop orbital lobe from (x, y) along dir (−1 up, +1 down). */
function lobe(g, x, y, dir, len, wid, col, fillA, dashed) {
  g.save();
  g.beginPath();
  g.moveTo(x, y);
  g.bezierCurveTo(x - wid, y + dir * len * 0.3, x - wid * 0.95, y + dir * len, x, y + dir * len);
  g.bezierCurveTo(x + wid * 0.95, y + dir * len, x + wid, y + dir * len * 0.3, x, y);
  const gr = g.createLinearGradient(x, y, x, y + dir * len);
  gr.addColorStop(0, rgba(col, fillA * 0.35));
  gr.addColorStop(1, rgba(col, fillA));
  g.fillStyle = gr; g.fill();
  g.strokeStyle = rgba(col, 0.75); g.lineWidth = 1.6;
  if (dashed) g.setLineDash([5, 4]);
  g.stroke();
  g.restore();
}

/** Smooth curve through [x, y] points (cosine ease between neighbours). */
function curveY(pts, x) {
  if (x <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    if (x <= x1) {
      const [x0, y0] = pts[i - 1];
      return y0 + (y1 - y0) * (1 - Math.cos(Math.PI * (x - x0) / (x1 - x0))) / 2;
    }
  }
  return pts[pts.length - 1][1];
}

function strokeCurve(g, pts, x0, x1, { col, w = 4, dash = false, alpha = 1, glowCol } = {}) {
  g.save();
  g.globalAlpha *= alpha;
  g.beginPath();
  for (let x = x0; x <= x1; x += 3) { const y = curveY(pts, x); x === x0 ? g.moveTo(x, y) : g.lineTo(x, y); }
  g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = col;
  if (dash) g.setLineDash([7, 6]);
  if (glowCol) { g.shadowColor = glowCol; g.shadowBlur = 10; }
  g.stroke();
  g.restore();
}

// ---------------------------------------------------------------- stage

/** A canvas that runs anim.draw every frame while it's on screen. */
function stage(anim, state) {
  const canvas = document.createElement('canvas');
  canvas.className = 'oc-canvas';
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', anim.label);
  const g = canvas.getContext('2d');
  let w = 0, dpr = 1, pal = null, palAt = -1, time = anim.still, last = performance.now(), born = last, attached = false, onScreen = true, raf = 0;

  const size = () => {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    w = r.width; dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.width * VH / VW * dpr);
    pal = null;
  };
  const paint = dt => {
    if (!w) return;
    const now = performance.now();
    if (!pal || now - palAt > 700) { pal = palette(canvas); palAt = now; }
    P = pal;
    P.fs = clamp(440 / w, 1, 1.3); // bigger labels on small screens
    const s = canvas.width / VW;
    g.setTransform(s, 0, 0, s, 0, 0);
    g.clearRect(0, 0, VW, VH);
    anim.draw(g, reduced.matches ? anim.still : time, state, reduced.matches ? 1 : dt);
  };
  const ro = new ResizeObserver(() => { size(); paint(0); });
  const io = new IntersectionObserver(es => { onScreen = es[es.length - 1].isIntersecting; });
  const loop = now => {
    if (!canvas.isConnected) {
      if (attached || now - born > 8000) { ro.disconnect(); io.disconnect(); return; }
    } else if (!attached) {
      attached = true; ro.observe(canvas); io.observe(canvas); size();
    }
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (attached && onScreen && !reduced.matches) { time += dt; paint(dt); }
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  return {
    canvas,
    restart() { time = 0.4; paint(0); }, // just past each loop's fade-in
  };
}

function conceptCard(C, a) {
  const { h } = C;
  const state = { mode: a.modes ? a.modes[0][0] : null };
  const st = stage(a, state);
  const note = a.notes ? h('p', { class: 'oc-note', text: a.notes[state.mode] }) : null;
  let chips = null;
  if (a.modes) {
    const btns = a.modes.map(([id, label]) => h('button', {
      type: 'button', class: `chip chip-btn${id === state.mode ? ' on' : ''}`, 'aria-pressed': String(id === state.mode),
      onclick: () => {
        state.mode = id;
        for (const k in state) if (k !== 'mode') delete state[k];
        btns.forEach((b, i) => { const on = a.modes[i][0] === id; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });
        if (note) note.textContent = a.notes[id];
        st.restart();
      },
    }, label));
    chips = h('div', { class: 'chips oc-chips' }, btns);
  }
  return h('section', { class: 'card oc-card' },
    h('header', { class: 'card-head' }, h('h2', { text: a.title }), h('span', { class: 'oc-tag', text: a.tag })),
    h('p', { class: 'oc-blurb', text: a.blurb }),
    chips,
    h('div', { class: 'oc-stage' }, st.canvas),
    note);
}

// ---------------------------------------------------------------- 1. carbocation stability

const CATION = {
  title: 'Carbocation stability', tag: 'SN1 · E1', label: 'Animated carbocation with neighbouring C–H bonds feeding electron density into its empty p orbital',
  blurb: 'A carbocation is flat with an empty p orbital. Neighbouring C–H bonds can lean in and share a little electron density with it (hyperconjugation).',
  modes: [['methyl', 'Methyl'], ['1', '1°'], ['2', '2°'], ['3', '3°']],
  notes: {
    methyl: 'No alkyl groups, so nothing shares electrons with the empty orbital. Methyl cations basically never form: no SN1 or E1.',
    1: 'One alkyl group helps a little, but 1° cations are still too unstable for SN1 or E1.',
    2: 'Two alkyl groups: 2° cations can form (slowly) and may rearrange into a 3° one.',
    3: 'Three alkyl groups share the most: 3° cations are the most stable, which is why SN1 and E1 love 3° substrates.',
  },
  still: 2.2,
  draw(g, t, s, dt) {
    const n = { methyl: 0, 1: 1, 2: 2, 3: 3 }[s.mode];
    s.level = s.level === undefined ? n : s.level + (n - s.level) * Math.min(1, dt * 4);
    const cx = 200, cy = 168, lv = s.level;

    g.fillStyle = rgba(P.mint, 0.1); g.strokeStyle = rgba(P.mint, 0.35); g.lineWidth = 1.5;
    g.beginPath(); g.ellipse(cx, cy, 158, 44, 0, 0, TAU); g.fill(); g.stroke();

    const subs = [210, 330, 90].map((phi, i) => {
      const alkyl = i < n, d = alkyl ? 112 : 78, a = phi * Math.PI / 180;
      return { alkyl, i, x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d * 0.36 };
    });
    // each methyl's C–H that lines up with the p orbital (the front one reaches the lower lobe)
    const up = sb => (sb.i === 2 ? 1 : -1);
    const ch = sb => ({ x: sb.x + (cx - sb.x) * 0.1, y: sb.y + up(sb) * 46 });
    const drawSub = sb => {
      stick(g, cx, cy, sb.x, sb.y, 6);
      if (!sb.alkyl) { ball(g, sb.x, sb.y, 11, P.H, 'H'); return; }
      const out = Math.sign(sb.x - cx) || 1, hU = ch(sb);
      const pulse = 0.5 + 0.5 * Math.sin(t * 3 + sb.i * 2);
      glow(g, (sb.x + hU.x) / 2, (sb.y + hU.y) / 2, 30, P.mint, 0.3 + 0.3 * pulse);
      stick(g, sb.x, sb.y, hU.x, hU.y, 4);
      const v = -up(sb);
      stick(g, sb.x, sb.y, sb.x + out * 30, sb.y + v * 20, 4); stick(g, sb.x, sb.y, sb.x + out * 6, sb.y + v * 32, 4);
      ball(g, sb.x + out * 30, sb.y + v * 20, 8, P.H); ball(g, sb.x + out * 6, sb.y + v * 32, 8, P.H);
      ball(g, hU.x, hU.y, 8, P.H);
      ball(g, sb.x, sb.y, 15, P.C, 'C');
    };
    subs.filter(sb => sb.i < 2).forEach(drawSub);

    // empty p orbital, filling with shared density as more alkyl groups help
    const fillA = 0.14 + 0.12 * lv + 0.04 * Math.sin(t * 2.4);
    lobe(g, cx, cy, -1, 78, 30, P.violet, fillA, true);
    lobe(g, cx, cy, 1, 78, 30, P.violet, fillA * 0.8, true);
    glow(g, cx, cy, 34 + 20 * lv, P.pink, 0.6 - 0.1 * lv);
    ball(g, cx, cy, 17, P.C, 'C');
    badge(g, cx + 18, cy - 17, '+');
    subs.filter(sb => sb.i === 2).forEach(drawSub);

    // electron density flowing from aligned C–H bonds into the p orbital
    subs.filter(sb => sb.alkyl).forEach(sb => {
      const hU = ch(sb), mx = (sb.x + hU.x) / 2, my = (sb.y + hU.y) / 2;
      for (let k = 0; k < 7; k++) {
        const u = frac(t * 0.42 + k / 7 + sb.i * 0.31);
        const x = qb(mx, (mx + cx) / 2, cx + (sb.x - cx) * 0.08, u), y = qb(my, my + up(sb) * 52, cy + up(sb) * 52, u);
        const a = Math.sin(Math.PI * u);
        glow(g, x, y, 9, P.mint, 0.55 * a);
        g.fillStyle = rgba(P.mint, 0.95 * a); g.beginPath(); g.arc(x, y, 2.4, 0, TAU); g.fill();
      }
    });

    txt(g, 'empty p orbital', cx + 40, cy - 92, { size: 12, col: P.violet, align: 'left', weight: 600 });
    txt(g, ['CH₃⁺ · methyl', 'CH₃CH₂⁺ · 1°', '(CH₃)₂CH⁺ · 2°', '(CH₃)₃C⁺ · 3°'][n], cx, 284, { size: 14, weight: 600 });

    // stability meter
    const mx = 438, top = 52, hgt = 180, lvl = k => top + hgt - hgt * (0.1 + 0.9 * k / 3);
    txt(g, 'stability', mx + 10, 30, { size: 12, col: P.muted, weight: 600 });
    g.fillStyle = rgba(P.muted, 0.15);
    g.beginPath(); g.roundRect(mx, top, 20, hgt, 10); g.fill();
    const fy = lvl(lv);
    const gr = g.createLinearGradient(0, top + hgt, 0, top);
    gr.addColorStop(0, P.violet); gr.addColorStop(0.5, P.pink); gr.addColorStop(1, P.mint);
    g.save(); g.beginPath(); g.roundRect(mx, top, 20, hgt, 10); g.clip();
    g.fillStyle = gr; g.fillRect(mx, fy, 20, top + hgt - fy);
    g.restore();
    glow(g, mx + 10, fy, 18, P.pink, 0.45);
    ['methyl', '1°', '2°', '3°'].forEach((l, k) => txt(g, l, mx + 30, lvl(k), { size: 12, align: 'left', col: k === n ? P.text : P.muted, weight: k === n ? 700 : 500 }));
  },
};

// ---------------------------------------------------------------- 2. SN2 sterics

const STERIC = {
  title: 'Crowding blocks SN2', tag: 'SN2', label: 'Animated nucleophile approaching the back side of a carbon with more or fewer alkyl groups in the way',
  blurb: 'In SN2 the nucleophile has to reach the back of the carbon, opposite the leaving group. Every alkyl group on that carbon gets in the way.',
  modes: [['methyl', 'Methyl'], ['1', '1°'], ['2', '2°'], ['3', '3°']],
  notes: {
    methyl: 'Nothing in the way: the nucleophile walks right up to the back side. Fastest SN2.',
    1: 'One alkyl group: still easy. 1° substrates are great for SN2.',
    2: 'Two alkyl groups crowd the back side. SN2 is slow, and E2 starts to compete.',
    3: 'Three groups wall off the back side completely. 3° substrates never do SN2.',
  },
  still: 1.9,
  draw(g, t, s) {
    const n = { methyl: 0, 1: 1, 2: 2, 3: 3 }[s.mode];
    const T = [3.4, 3.8, 5.8, 3.8][n], u = frac(t / T), ok = n < 3;
    const cx = 300, cy = 160;
    let nuX, nuY = cy, f = 0, brOut = 0, nuBond = 0;
    if (ok) {
      const ua = n === 2 ? seg(u, 0, 0.52) : seg(u, 0, 0.4);
      nuX = lerp(36, cx - 64, ua);
      if (n === 2) nuY = cy + Math.sin(u * 42) * 7 * (1 - ua);
      const fs = n === 2 ? 0.52 : 0.4;
      f = seg(u, fs, fs + 0.18);
      brOut = seg(u, fs + 0.1, fs + 0.36);
      nuBond = ua > 0.85 ? (f > 0.5 ? 2 : 1) : 0;
    } else {
      nuX = lerp(lerp(36, cx - 96, seg(u, 0, 0.36)), 36, seg(u, 0.42, 0.82));
    }
    const fade = seg(u, 0, 0.05) * (1 - seg(u, 0.92, 1));
    const dx = -0.36 * (1 - 2 * f);
    const groups = [
      { dir: [dx, -0.93], alkyl: n >= 1 },
      { dir: [dx, 0.93], alkyl: n >= 2 },
      { dir: [dx * 1.6, 0.26], alkyl: n >= 3, front: true },
    ].map(gp => { const d = gp.alkyl ? 58 : 44; return { ...gp, x: cx + gp.dir[0] * d, y: cy + gp.dir[1] * d }; });

    // rate chart
    const rates = [['methyl', '30', 46], ['1°', '1', 30], ['2°', '0.03', 9], ['3°', '≈0', 1.5]];
    txt(g, 'relative SN2 rate', 26, 14, { size: 12, col: P.muted, align: 'left', weight: 600 });
    rates.forEach(([l, v, hgt], k) => {
      const x = 30 + k * 40, on = k === n;
      g.fillStyle = on ? P.pink : rgba(P.muted, 0.3);
      g.beginPath(); g.roundRect(x, 90 - hgt, 24, hgt, 4); g.fill();
      txt(g, v, x + 12, 90 - hgt - 8, { size: 11, col: on ? P.pink : P.muted, weight: 700 });
      txt(g, l, x + 12, 102, { size: 11, col: on ? P.text : P.muted, weight: on ? 700 : 500 });
    });

    g.save(); g.globalAlpha = fade;
    // C–Br
    const brX = cx + 66 + brOut * 170;
    if (brOut < 0.15) stick(g, cx, cy, brX, cy, 6, 1, f > 0.05);
    ball(g, brX, cy, 23, P.Br, 'Br', 1 - brOut * 0.4);
    badge(g, brX + 20, cy - 20, '−', seg(brOut, 0.3, 0.6));
    const drawGroup = gp => {
      stick(g, cx, cy, gp.x, gp.y, 5);
      if (gp.alkyl) {
        g.fillStyle = rgba(P.amber, 0.2); g.strokeStyle = rgba(P.amber, 0.55); g.lineWidth = 1.5; g.setLineDash([4, 4]);
        g.beginPath(); g.arc(gp.x, gp.y, 33, 0, TAU); g.fill(); g.stroke(); g.setLineDash([]);
        ball(g, gp.x, gp.y, 15, P.C, 'CH₃');
      } else {
        glow(g, gp.x, gp.y, 18, P.H, 0.4);
        ball(g, gp.x, gp.y, 10, P.H, 'H');
      }
    };
    groups.filter(gp => !gp.front).forEach(drawGroup);
    ball(g, cx, cy, 17, P.C, 'C');
    drawGroup(groups[2]);
    if (nuBond) stick(g, nuX + 14, nuY, cx - 16, cy, 5, 1, nuBond === 1);
    glow(g, nuX, nuY, 34, P.violet, 0.45);
    ball(g, nuX, nuY, 16, P.violet, 'OH');
    badge(g, nuX + 15, nuY - 16, '−', f < 0.5 ? 1 : 1 - seg(f, 0.5, 0.7));
    if (!ok) {
      const k = (u - 0.36) / 0.16;
      ripple(g, cx - 80, cy, k, P.amber);
      txt(g, 'blocked!', cx - 80, cy + 64, { size: 14, col: P.amber, weight: 700, alpha: k > 0 && k < 1.6 ? Math.sin(Math.min(1, k / 1.6) * Math.PI) : 0 });
    }
    if (ok) txt(g, 'inversion ✿', cx + 4, 272, { size: 14, col: P.mint, weight: 700, alpha: seg(u, 0.72, 0.8) });
    g.restore();
  },
};

// ---------------------------------------------------------------- 3. solvent

const SOLVENT = {
  title: 'Protic vs aprotic solvent', tag: 'SN1 · SN2', label: 'Animated nucleophile caged by hydrogen-bonding water versus moving freely in DMSO',
  blurb: 'Solvents with O–H or N–H bonds can hydrogen-bond to anions. That changes how free the nucleophile is.',
  modes: [['protic', 'Protic (H₂O, ROH)'], ['aprotic', 'Aprotic (DMSO, acetone)']],
  notes: {
    protic: 'Water and alcohols H-bond to the anion and wrap it in a cage. The nucleophile is calmer and slower. Protic solvents favour SN1 and E1 (they also stabilize the carbocation and the leaving group).',
    aprotic: 'DMSO, DMF and acetone have no O–H. They cling to the cation (Na⁺) but leave the anion bare and much more reactive. Aprotic solvents speed up SN2.',
  },
  still: 1.4,
  draw(g, t, s) {
    const sx = 462, sy = 150;
    const water = (ox, oy, a, alpha, hb, nx, ny) => {
      const h1 = [ox + Math.cos(a) * 18, oy + Math.sin(a) * 18], h2 = [ox + Math.cos(a + 1.82) * 18, oy + Math.sin(a + 1.82) * 18];
      if (hb) {
        g.save(); g.strokeStyle = rgba(P.blue, 0.55 * alpha); g.lineWidth = 2; g.setLineDash([3, 4]);
        g.beginPath(); g.moveTo(h1[0], h1[1]); g.lineTo(nx, ny); g.stroke(); g.restore();
      }
      stick(g, ox, oy, h1[0], h1[1], 3.5, alpha); stick(g, ox, oy, h2[0], h2[1], 3.5, alpha);
      ball(g, h1[0], h1[1], 6.5, P.H, '', alpha); ball(g, h2[0], h2[1], 6.5, P.H, '', alpha);
      ball(g, ox, oy, 11, P.red, 'O', alpha);
    };
    const dmso = (x, y, a, alpha = 1) => {
      const o = [x + Math.cos(a) * 22, y + Math.sin(a) * 22];
      const m1 = [x + Math.cos(a + 2.1) * 24, y + Math.sin(a + 2.1) * 24], m2 = [x + Math.cos(a - 2.1) * 24, y + Math.sin(a - 2.1) * 24];
      stick(g, x, y, o[0], o[1], 3.5, alpha); stick(g, x, y, m1[0], m1[1], 3.5, alpha); stick(g, x, y, m2[0], m2[1], 3.5, alpha);
      ball(g, m1[0], m1[1], 8.5, P.C, '', alpha); ball(g, m2[0], m2[1], 8.5, P.C, '', alpha);
      ball(g, o[0], o[1], 8.5, P.red, '', alpha);
      ball(g, x, y, 11, P.amber, 'S', alpha);
    };
    let nx, ny, bright;
    if (s.mode === 'protic') {
      nx = 210 + 16 * Math.sin(t * 0.6); ny = 150 + 10 * Math.sin(t * 0.83 + 1);
      bright = 0.35;
      for (let i = 0; i < 9; i++) {
        const a = i * 0.7 + t * 0.15, r = 128 + 10 * Math.sin(t + i);
        water(nx + Math.cos(a) * r * 1.3, ny + Math.sin(a) * r * 0.85, a + Math.PI + Math.sin(t * 2 + i) * 0.6, 0.35, false);
      }
      for (let i = 0; i < 6; i++) {
        const a = i * TAU / 6 + t * 0.25, r = 60 + 3 * Math.sin(t * 3 + i);
        const ox = nx + Math.cos(a) * r, oy = ny + Math.sin(a) * r;
        water(ox, oy, a + Math.PI + 0.12 * Math.sin(t * 2.5 + i), 1, true, nx + Math.cos(a) * 17, ny + Math.sin(a) * 17);
      }
    } else {
      nx = 240 + 165 * Math.sin(t * 1.15); ny = 150 + 92 * Math.sin(t * 1.9 + 0.6);
      bright = 0.75;
      const na = [[78, 70], [380, 248]];
      na.forEach(([x, y], j) => {
        for (let i = 0; i < 4; i++) {
          const a = i * TAU / 4 + t * 0.3 * (j ? -1 : 1);
          dmso(x + Math.cos(a) * 46, y + Math.sin(a) * 46, a + Math.PI);
        }
        glow(g, x, y, 26, P.blue, 0.35);
        ball(g, x, y, 13, P.blue, 'Na⁺');
      });
      // trail
      for (let k = 14; k > 0; k--) {
        const tt = t - k * 0.035;
        const x = 240 + 165 * Math.sin(tt * 1.15), y = 150 + 92 * Math.sin(tt * 1.9 + 0.6);
        glow(g, x, y, 14 - k * 0.6, P.violet, 0.3 * (1 - k / 15));
      }
    }
    // substrate R–X
    const hit = s.mode === 'aprotic' ? clamp(1 - Math.hypot(nx - sx, ny - sy) / 70) : 0;
    glow(g, sx, sy, 40, P.mint, 0.25 + 0.6 * hit);
    stick(g, sx - 18, sy, sx + 16, sy, 5);
    ball(g, sx + 18, sy, 15, P.Br, 'X');
    ball(g, sx - 18, sy, 14, P.C, 'C');
    txt(g, 'R–X', sx, sy + 34, { size: 12, col: P.muted, weight: 600 });

    glow(g, nx, ny, 40, P.violet, bright);
    ball(g, nx, ny, 15, P.violet, 'Nu');
    badge(g, nx + 14, ny - 14, '−');
    txt(g, s.mode === 'protic' ? 'caged by H-bonds' : '“naked” and fast', 20, 286, { size: 13, align: 'left', col: s.mode === 'protic' ? P.blue : P.violet, weight: 700 });
  },
};

// ---------------------------------------------------------------- 4. leaving groups

const LGS = { F: { r: 13, tb: null, pka: '3.2' }, Cl: { r: 19, tb: 0.56, pka: '−7' }, Br: { r: 23, tb: 0.44, pka: '−9' }, I: { r: 28, tb: 0.32, pka: '−10' } };

const LEAVING = {
  title: 'Leaving groups', tag: 'SN1 · SN2 · E1 · E2', label: 'Animated carbon–halogen bond stretching and breaking, with the halide charge spreading over a bigger cloud',
  blurb: 'A good leaving group is happy to carry the electrons away on its own. The bigger the ion, the more its − charge spreads out, and the more stable it is.',
  modes: [['F', 'F'], ['Cl', 'Cl'], ['Br', 'Br'], ['I', 'I']],
  notes: {
    F: 'Fluoride is tiny, so its charge is packed tight: F⁻ is unhappy on its own and C–F is very strong. Fluoride basically never leaves.',
    Cl: 'A bigger ion with its charge more spread out: Cl⁻ is a decent leaving group.',
    Br: 'Bigger and softer again: Br⁻ is a good leaving group.',
    I: 'Iodide is the biggest, so its charge is the most spread out. I⁻ is the best halide leaving group (and HI is the strongest acid). Weak base = good leaving group.',
  },
  still: 2.8,
  draw(g, t, s) {
    const X = s.mode, L = LGS[X], r = L.r, col = P[X];
    const T = 4.4, u = frac(t / T);
    const cx = 130, cy = 150, L0 = 50 + r;
    [[-0.5, -0.87], [-1, 0], [-0.5, 0.87]].forEach(([dx, dy]) => { stick(g, cx, cy, cx + dx * 46, cy + dy * 46, 5); ball(g, cx + dx * 46, cy + dy * 46, 10, P.H, 'H'); });
    let xx, bond, gone = 0;
    if (L.tb === null) {
      xx = cx + L0 + 4 * Math.sin(t * 14) * (0.6 + 0.4 * Math.sin(t * 1.3));
      bond = 'solid';
    } else {
      const k = seg(u, L.tb - 0.24, L.tb);
      gone = seg(u, L.tb, L.tb + 0.22);
      xx = lerp(cx + L0 + k * 22 + Math.sin(t * 16) * 4 * k, 400, gone);
      bond = u < L.tb - 0.08 ? 'solid' : u < L.tb ? 'dash' : 'none';
    }
    const fade = L.tb === null ? 1 : seg(u, 0, 0.05) * (1 - seg(u, 0.93, 1));
    g.save(); g.globalAlpha = fade;
    if (bond !== 'none') stick(g, cx + 14, cy, xx - r + 2, cy, 6, 1, bond === 'dash');
    glow(g, cx, cy, 30 + 10 * gone, P.pink, 0.55 * gone);
    ball(g, cx, cy, 17, P.C, 'C');
    badge(g, cx + 18, cy - 18, '+', gone);
    const cloud = (x, y, rad, a) => {
      const gr = g.createRadialGradient(x, y, rad * 0.5, x, y, rad * 2.4);
      gr.addColorStop(0, rgba(P.blue, a)); gr.addColorStop(1, rgba(P.blue, 0));
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, rad * 2.4, 0, TAU); g.fill();
    };
    const density = 0.75 * (13 / r) ** 2;
    cloud(xx, cy, r, density * (L.tb === null ? 0.3 : 0.3 + 0.7 * gone) * (1 + 0.12 * Math.sin(t * 3)));
    ball(g, xx, cy, r, col, X);
    badge(g, xx + r * 0.8, cy - r * 0.8 - 2, '−', L.tb === null ? 0 : gone);
    g.restore();
    if (L.tb === null) {
      ball(g, 400, cy, r, col, 'F', 0.35);
      cloud(400, cy, r, density * (0.8 + 0.15 * Math.sin(t * 3)));
      txt(g, 'if it did leave: charge squeezed', 400, cy + 62, { size: 12, col: P.muted, weight: 600 });
      txt(g, 'into a tiny ion', 400, cy + 78, { size: 12, col: P.muted, weight: 600 });
    } else {
      txt(g, `${X}⁻ · from H${X}, pKa ${L.pka}`, 400, cy + 70, { size: 13, weight: 600, alpha: gone });
    }
    // ranking strip
    const order = ['F', 'Cl', 'Br', 'I'];
    order.forEach((e, k) => {
      const x = 200 + k * 64, on = e === X;
      ball(g, x, 34, LGS[e].r * 0.55, P[e], '', on ? 1 : 0.45);
      txt(g, `${e}⁻`, x + LGS[e].r * 0.55 + 12, 34, { size: 12, col: on ? P.text : P.muted, weight: on ? 700 : 500 });
    });
    txt(g, 'better leaving group →', 296, 66, { size: 11, col: P.muted, weight: 600 });
    txt(g, X === 'F' ? 'C–F holds on' : 'C–X stretches, then breaks', 20, 286, { size: 13, align: 'left', col: X === 'F' ? P.amber : P.mint, weight: 700 });
  },
};

// ---------------------------------------------------------------- 5. Zaitsev vs Hofmann

const ZAITSEV = {
  title: 'Zaitsev vs Hofmann', tag: 'E2', label: 'Animated small and bulky bases removing different β-hydrogens from 2-bromo-2-methylbutane',
  blurb: '2-Bromo-2-methylbutane has β-H’s in two places. Which one the base grabs decides which alkene you get.',
  modes: [['small', 'Small base (EtO⁻)'], ['bulky', 'Bulky base (t-BuO⁻)']],
  notes: {
    small: 'A small base slips in and takes the inside β-H, giving the more substituted, more stable alkene: Zaitsev product (major).',
    bulky: 't-BuO⁻ is too bulky to reach the crowded inside H, so it grabs an easy H on the end CH₃. The less substituted alkene wins: Hofmann product.',
  },
  still: 4.6,
  draw(g, t, s) {
    const bulky = s.mode === 'bulky', T = bulky ? 7.6 : 6.2, u = frac(t / T);
    const A = { C1: [92, 180], C2: [182, 124], C3: [272, 180], C4: [362, 124], C5: [232, 48] };
    const brHome = [128, 52];
    const H3 = [272, 238], H1 = [48, 222];
    const target = bulky ? H1 : H3;
    let base, pick, piK, brK, bump = -1;
    if (!bulky) {
      base = [lerp(480, 296, seg(u, 0, 0.3)), lerp(330, 268, seg(u, 0, 0.3))];
      pick = seg(u, 0.3, 0.42); piK = seg(u, 0.32, 0.48); brK = seg(u, 0.36, 0.6);
    } else {
      const a = seg(u, 0, 0.22), b = seg(u, 0.3, 0.55);
      const p0 = [lerp(480, 352, a), lerp(330, 262, a)];
      base = [qb(p0[0], 210, 22, b), qb(p0[1], 330, 262, b)];
      bump = (u - 0.2) / 0.12;
      pick = seg(u, 0.55, 0.65); piK = seg(u, 0.56, 0.7); brK = seg(u, 0.58, 0.8);
    }
    const fade = seg(u, 0, 0.05) * (1 - seg(u, 0.92, 1));
    const piA = bulky ? 'C1' : 'C3';
    g.save(); g.globalAlpha = fade;
    // skeleton
    [['C1', 'C2'], ['C2', 'C3'], ['C3', 'C4'], ['C2', 'C5']].forEach(([p, q]) => stick(g, ...A[p], ...A[q], 6));
    piBond(g, ...A.C2, ...A[piA], piK);
    if (piK > 0.05) glow(g, (A.C2[0] + A[piA][0]) / 2, (A.C2[1] + A[piA][1]) / 2, 40, P.mint, 0.35 * piK);
    // Br leaves
    const br = [lerp(brHome[0], 60, brK), lerp(brHome[1], 26, brK)];
    if (brK < 0.2) stick(g, ...A.C2, ...br, 6, 1, brK > 0.02);
    ball(g, ...br, 21, P.Br, 'Br', 1 - 0.4 * brK);
    badge(g, br[0] + 18, br[1] - 16, '−', seg(brK, 0.3, 0.6));
    // β-H's
    const hs = [[H3, A.C3, 'inside β-H', P.mint, !bulky], [H1, A.C1, 'end β-H', P.amber, bulky]];
    hs.forEach(([hp, cp, label, col, taken]) => {
      const k = taken ? pick : 0;
      const p = [lerp(hp[0], base[0], k), lerp(hp[1], base[1] - 4, k)];
      if (k < 0.5) stick(g, ...cp, ...p, 4, 1 - k * 2, k > 0.05);
      glow(g, ...p, 22, col, 0.5 + 0.2 * Math.sin(t * 4));
      ball(g, ...p, 9, P.H, 'H', k > 0.9 ? 0 : 1);
      txt(g, label, hp === H1 ? 8 : hp[0] + 14, hp === H1 ? 192 : hp[1] + 4, { size: 11, col, weight: 700, align: 'left', alpha: 1 - pick * (taken ? 1 : 0) });
    });
    Object.entries(A).forEach(([id, p]) => ball(g, ...p, id === 'C5' || id === 'C4' || id === 'C1' ? 14 : 13, P.C, id === 'C2' || id === 'C3' ? 'C' : 'CH₃'));
    // base
    glow(g, ...base, bulky ? 52 : 34, P.violet, 0.4);
    if (bulky) {
      const ang = Math.atan2(target[1] - base[1], target[0] - base[0]) + Math.PI;
      const c = [base[0] + Math.cos(ang) * 22, base[1] + Math.sin(ang) * 22];
      [-1.1, 0, 1.1].forEach(d => ball(g, c[0] + Math.cos(ang + d) * 22, c[1] + Math.sin(ang + d) * 22, 12, P.C, 'CH₃'));
      ball(g, ...c, 11, P.C);
    } else {
      const ang = Math.atan2(target[1] - base[1], target[0] - base[0]) + Math.PI;
      ball(g, base[0] + Math.cos(ang) * 22, base[1] + Math.sin(ang) * 22, 10, P.C, 'Et');
    }
    ball(g, ...base, 13, P.violet, 'O');
    badge(g, base[0] + 13, base[1] - 14, '−', 1 - pick);
    if (bulky) {
      ripple(g, 324, 232, bump, P.amber);
      txt(g, 'too crowded', 450, 210, { size: 13, col: P.amber, weight: 700, alpha: bump > 0 && bump < 2 ? Math.sin(Math.min(1, bump / 2) * Math.PI) : 0 });
    }
    const prodA = seg(u, bulky ? 0.72 : 0.55, bulky ? 0.8 : 0.63);
    txt(g, bulky ? '2-methylbut-1-ene' : '2-methylbut-2-ene', 504, 30, { size: 14, weight: 700, align: 'right', alpha: prodA });
    txt(g, bulky ? 'Hofmann · less substituted' : 'Zaitsev · more substituted', 504, 50, { size: 12, col: bulky ? P.amber : P.mint, weight: 700, align: 'right', alpha: prodA });
    g.restore();
  },
};

// ---------------------------------------------------------------- 6. Markovnikov

const MARKOV = {
  title: 'Why Markovnikov?', tag: 'HX addition', label: 'Animated energy paths for the two possible carbocations when HBr adds to an alkene',
  blurb: 'H⁺ can add to either alkene carbon. Most molecules take the path through the more stable carbocation, because its hill is lower.',
  modes: [['propene', 'Propene'], ['isobutylene', '2-Methylpropene']],
  notes: {
    propene: 'H goes on the CH₂ end so the + sits on the middle carbon (2°). The 1° cation path is so much higher that almost nothing goes that way. Br⁻ then adds to the 2° carbon: 2-bromopropane.',
    isobutylene: 'Here the choice is 3° vs 1°, so the gap is even bigger. H goes on the CH₂ end, + lands on the 3° carbon, and Br⁻ follows: tert-butyl bromide.',
  },
  still: 2.3,
  draw(g, t, s) {
    const iso = s.mode === 'isobutylene';
    const A = [[40, 214], [170, 136], [262, iso ? 190 : 176], [322, iso ? 166 : 156], [486, 248]];
    const B = [[40, 214], [170, iso ? 46 : 60], [262, iso ? 96 : 104], [300, 92]];
    // axes
    stick(g, 24, 270, 24, 26, 2, 0.6, false, P.muted); stick(g, 24, 270, 500, 270, 2, 0.6, false, P.muted);
    txt(g, 'energy ↑', 32, 22, { size: 11, col: P.muted, weight: 600, align: 'left' });
    strokeCurve(g, B, 40, 300, { col: rgba(P.amber, 0.85), w: 2.5, dash: true });
    strokeCurve(g, A, 40, 486, { col: P.mint, w: 4.5, glowCol: rgba(P.mint, 0.7) });
    // flowing molecules: most take the low road
    const N = 18;
    for (let k = 0; k < N; k++) {
      const high = iso ? k === 5 : k === 5 || k === 14;
      const u = frac(t / 6 + k / N);
      const x = high ? lerp(40, 300, u) : lerp(40, 486, u);
      const y = curveY(high ? B : A, x);
      const a = high ? Math.sin(Math.PI * u) * 0.9 : seg(u, 0, 0.06) * (1 - seg(u, 0.94, 1));
      const col = high ? P.amber : P.pink;
      glow(g, x, y - 6, 12, col, 0.6 * a);
      g.fillStyle = rgba(col, a); g.beginPath(); g.arc(x, y - 6, 3.2, 0, TAU); g.fill();
    }
    txt(g, iso ? 'CH₂=C(CH₃)₂ + HBr' : 'CH₂=CH–CH₃ + HBr', 40, 236, { size: 12, align: 'left', weight: 600 });
    txt(g, iso ? '(CH₃)₃C⁺  3°' : 'CH₃–C⁺H–CH₃  2°', 262, A[2][1] + 24, { size: 13, col: P.mint, weight: 700 });
    txt(g, 'more stable · lower hill', 262, A[2][1] + 41, { size: 11, col: P.muted, weight: 600 });
    txt(g, iso ? '⁺CH₂–CH(CH₃)₂  1°' : '⁺CH₂–CH₂–CH₃  1°', 312, B[3][1] - 6, { size: 13, col: P.amber, weight: 700, align: 'left' });
    txt(g, 'rarely forms', 312, B[3][1] - 24, { size: 11, col: P.muted, weight: 600, align: 'left' });
    txt(g, iso ? '(CH₃)₃C–Br' : 'CH₃–CHBr–CH₃', 500, 132, { size: 13, weight: 700, align: 'right' });
    txt(g, 'Markovnikov product', 500, 114, { size: 11, col: P.pink, weight: 700, align: 'right' });
    txt(g, 'H⁺ adds', 170, A[1][1] - 16, { size: 11, col: P.muted, weight: 600 });
    txt(g, 'Br⁻ adds', 330, A[3][1] - 18, { size: 11, col: P.muted, weight: 600 });
  },
};

// ---------------------------------------------------------------- 7. rate-determining step

const RDS = {
  title: 'The slow step sets the rate', tag: 'kinetics', label: 'Animated balls rolling over a reaction energy profile and bunching up at the highest hill',
  blurb: 'Molecules have to climb every hill, and they pile up in front of the highest one. That step decides the rate, so only what’s in it shows up in the rate law.',
  modes: [['one', 'SN2 / E2 (one step)'], ['two', 'SN1 / E1 (two steps)']],
  notes: {
    one: 'One step, one hill. Both the substrate and the nucleophile/base are in it: rate = k[RX][Nu⁻].',
    two: 'Two hills. The first (C–X breaking to make the carbocation) is the tallest, so it’s rate-determining. Only RX is in that step: rate = k[RX], and nucleophile strength doesn’t matter.',
  },
  still: 3,
  draw(g, t, s, dt) {
    const two = s.mode === 'two';
    const E = two ? [[0, 25], [0.3, 86], [0.5, 54], [0.68, 66], [1, 12]] : [[0, 25], [0.5, 84], [1, 12]];
    const X = p => 44 + p * 440, Y = e => 262 - e * 2.3;
    const pts = E.map(([p, e]) => [X(p), Y(e)]);
    stick(g, 24, 276, 24, 24, 2, 0.6, false, P.muted); stick(g, 24, 276, 500, 276, 2, 0.6, false, P.muted);
    txt(g, 'reaction progress →', 490, 290, { size: 11, col: P.muted, weight: 600, align: 'right' });
    // soft area under curve
    g.save();
    g.beginPath(); g.moveTo(X(0), 276);
    for (let x = X(0); x <= X(1); x += 3) g.lineTo(x, curveY(pts, x));
    g.lineTo(X(1), 276); g.closePath();
    const ar = g.createLinearGradient(0, 40, 0, 276);
    ar.addColorStop(0, rgba(P.violet, 0.22)); ar.addColorStop(1, rgba(P.violet, 0));
    g.fillStyle = ar; g.fill(); g.restore();
    const lg = g.createLinearGradient(X(0), 0, X(1), 0);
    lg.addColorStop(0, P.violet); lg.addColorStop(0.5, P.pink); lg.addColorStop(1, P.mint);
    strokeCurve(g, pts, X(0), X(1), { col: lg, w: 4.5 });

    const top = pts[1];
    glow(g, top[0], top[1], 46, P.pink, 0.3 + 0.12 * Math.sin(t * 3));
    txt(g, two ? 'slow step (rate-determining)' : 'transition state', top[0], top[1] - 22, { size: 12, col: P.pink, weight: 700 });
    if (two) {
      txt(g, 'carbocation', pts[2][0], pts[2][1] + 22, { size: 12, col: P.violet, weight: 700 });
      txt(g, 'fast', pts[3][0] + 10, pts[3][1] - 16, { size: 12, col: P.mint, weight: 700 });
    }
    txt(g, two ? 'rate = k[RX]' : 'rate = k[RX][Nu⁻]', 500, 30, { size: 15, weight: 700, align: 'right' });

    if (!s.balls) s.balls = Array.from({ length: 7 }, (_, k) => k / 7);
    const v = p => { const e = curveY(E, p); return 0.045 + 0.5 * Math.max(0, 1 - e / 90) ** 2; };
    s.balls = s.balls.map(p => { const n = p + dt * v(p); return n >= 1 ? n - 1 : n; });
    s.balls.forEach((p, k) => {
      const x = X(p), y = curveY(pts, x) - 8;
      const a = seg(p, 0, 0.04) * (1 - seg(p, 0.96, 1));
      const col = [P.pink, P.violet, P.mint, P.amber, P.blue][k % 5];
      glow(g, x, y, 16, col, 0.55 * a);
      ball(g, x, y, 6.5, col, '', a);
    });
  },
};

const CONCEPT_ANIMS = [CATION, STERIC, LEAVING, SOLVENT, ZAITSEV, MARKOV, RDS];

export function conceptsPage(C) {
  const { h } = C;
  return h('div', { class: 'oc' },
    h('p', { class: 'muted small oc-intro', text: 'Short loops that show why the rules work. Tap the chips to compare cases.' }),
    h('div', { class: 'oc-grid' }, CONCEPT_ANIMS.map(a => conceptCard(C, a))));
}
