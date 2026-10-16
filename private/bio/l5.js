// Lecture 5 · Ch 30.4–30.6 · Circulation

import { E, T, Track, at, move, show, setText, smooth, keys, frac, lerp, gauss, clamp, TAU, arrowDefs } from './kit.js';
import { polish, fit, pill, pills, breath, scaleAbout, drift, ease, life, flag, beadify } from './fx-a.js';

// ---------------------------------------------------------------- 1. heart and the two loops

const heart = {
  id: 'l5-heart', title: 'The heart’s two loops', dur: 18,
  vars: { mode: 'rest' },
  beats: [
    [0, '① Used blood (low O₂, blue) comes back from the body into the right atrium'],
    [3, '② It drops through a one-way valve into the right ventricle'],
    [6, '③ The right ventricle squeezes it up the pulmonary artery to the lungs'],
    [9, '④ In the lungs it picks up O₂ (turns red) and returns to the left atrium'],
    [12, '⑤ It drops into the left ventricle'],
    [15, '⑥ The left ventricle, the strongest chamber, pumps it out the aorta to the whole body'],
  ],
  build(svg, s, ui) {
    polish(svg);
    // painted artwork underneath; the drawn shapes stay on top only for motion and highlights
    svg.classList.add('has-art', 'art-l5-heart');
    E('image', { href: new URL('./art/l5-heart.jpg', import.meta.url).href, x: 0, y: 0, width: 640, height: 360, preserveAspectRatio: 'none', class: 'b-art' }, svg);
    ui.seg('mode', [['rest', 'Resting'], ['run', 'Exercising']], 'Activity');
    const g = E('g', {}, svg);
    // organs
    const lungs = E('g', {}, g);
    const heartG = E('g', {}, g);
    E('path', { d: 'M240,30 q-30,0 -30,26 q0,22 34,22 h52 q12,0 12,-14 v-22 q0,-12 -14,-12z', class: 'b-lung' }, lungs);
    E('path', { d: 'M400,30 q30,0 30,26 q0,22 -34,22 h-52 q-12,0 -12,-14 v-22 q0,-12 14,-12z', class: 'b-lung' }, lungs);
    T(g, 320, 22, 'Lungs: pick up O₂, drop CO₂', 'bs', { 'text-anchor': 'middle' });
    E('rect', { x: 150, y: 300, width: 340, height: 46, rx: 18, class: 'b-body' }, g);
    T(g, 320, 352, 'Body tissues: drop off O₂, pick up CO₂', 'bs', { 'text-anchor': 'middle' });

    // vessels (wide soft strokes) + the track blood follows
    const P = [
      'M470,322 L170,322',
      'M170,322 C120,322 115,300 115,260 L115,175 C115,155 130,150 150,150 L255,150',
      'M255,150 L262,225',
      'M262,225 C290,240 303,215 303,190 L303,95 C303,70 290,55 265,55',
      'M265,55 L375,55',
      'M375,55 C390,55 392,70 392,90 L385,150',
      'M385,150 L378,225',
      'M378,225 C420,235 470,225 520,225 C540,225 545,240 545,260 L545,300 C545,320 530,322 510,322 L470,322',
    ];
    const vessels = P.map((d, i) => E('path', { d, class: [1, 3].includes(i) ? 'b-vessel blue' : [5, 7].includes(i) ? 'b-vessel red' : 'b-hidden' }, g));
    const track = new Track(g, P);

    // heart outline and chambers
    E('path', { d: 'M320,112 C290,92 222,96 214,150 C206,205 262,262 320,292 C378,262 434,205 426,150 C418,96 350,92 320,112z', class: 'b-heart' }, heartG);
    E('line', { x1: 320, y1: 118, x2: 320, y2: 284, class: 'b-septum' }, heartG);
    g.append(heartG);
    const ch = {};
    const chamber = (id, x, y, rx, ry, color, label) => {
      const c = E('g', {}, g);
      E('ellipse', { cx: 0, cy: 0, rx, ry, class: `b-chamber ${color}` }, c);
      ch[id] = { g: c, x, y, el: c.firstChild, label };
    };
    chamber('RA', 258, 152, 34, 28, 'blue', 'RA');
    chamber('RV', 266, 222, 40, 40, 'blue', 'RV');
    chamber('LA', 382, 152, 34, 28, 'red', 'LA');
    chamber('LV', 374, 224, 42, 44, 'red', 'LV');
    T(g, 200, 128, 'right side', 'bs', { 'text-anchor': 'end' });
    T(g, 440, 128, 'left side', 'bs');
    T(g, 98, 240, 'vena cava', 'bs', { transform: 'rotate(-90 98 240)', 'text-anchor': 'middle' });
    T(g, 204, 92, 'pulmonary artery', 'bs', { 'text-anchor': 'end' });
    T(g, 404, 92, 'pulmonary vein', 'bs');
    T(g, 562, 262, 'aorta', 'bs', { transform: 'rotate(90 562 262)', 'text-anchor': 'middle' });

    // blood cells
    const N = 30;
    const cells = Array.from({ length: N }, () => {
      const c = E('g', {}, g);
      return { g: c, red: E('circle', { r: 5.2, class: 'p-oxy' }, c), blue: E('circle', { r: 5.2, class: 'p-deoxy' }, c) };
    });

    // chamber names sit above the moving blood so they never get covered
    for (const k of Object.keys(ch)) ch[k].t = T(g, ch[k].x, ch[k].y + 5, ch[k].label, 'bl b-ch-label', { 'text-anchor': 'middle' });
    // readout
    const rd = E('g', {}, g);
    const r1 = T(rd, 14, 26, '', 'bs');
    const r2 = T(rd, 14, 44, '', 'bs');
    const r3 = T(rd, 14, 66, '', 'bl b-strong');
    const sys = T(g, 320, 284, '', 'bs b-phase', { 'text-anchor': 'middle' });

    let phase = 0, flow = 0, idle = 0;
    const HL = [['RA', 1], ['RV'], ['RV', 3], ['LA', 4, 5], ['LV'], ['LV', 7]];
    return (lt, dt) => {
      const run = s.vars.mode === 'run';
      const hr = run ? 150 : 70, sv = run ? 110 : 70;
      phase = frac(phase + dt * hr / 60 * 0.8);
      const atr = 1 - 0.13 * Math.sin(Math.PI * clamp(phase / 0.16));
      const vsq = phase > 0.2 && phase < 0.55 ? Math.sin(Math.PI * (phase - 0.2) / 0.35) : 0;
      const ven = 1 - (run ? 0.2 : 0.13) * vsq;
      for (const k of ['RA', 'LA']) move(ch[k].g, ch[k].x, ch[k].y, atr);
      for (const k of ['RV', 'LV']) move(ch[k].g, ch[k].x, ch[k].y, ven);
      idle += dt;
      scaleAbout(heartG, 320, 200, 1 - 0.018 * vsq);
      scaleAbout(lungs, 320, 54, 1 + 0.025 * breath(idle, run ? 2.2 : 4.2));
      setText(sys, vsq > 0.05 ? 'systole: ventricles squeeze' : 'diastole: ventricles relax and fill');
      flow = frac(flow + dt * (run ? 0.085 : 0.045) * (0.45 + 1.4 * vsq));

      const step = Math.min(5, Math.floor((lt % 18) / 3));
      const on = new Set(HL[step].map(String));
      for (const k of Object.keys(ch)) { ch[k].el.classList.toggle('glow', on.has(k)); flag(ch[k].t, 'fx-hot', on.has(k)); }
      vessels.forEach((v, i) => v.classList.toggle('glow', on.has(String(i))));

      cells.forEach((c, i) => {
        const u = frac(flow + i / N);
        const [x0, y0] = track.pos(u);
        const [seg, k] = track.seg(u);
        const a = track.angle(u), lane = ((i * 7) % 5 - 2) * 1.6;
        const x = x0 - Math.sin(a) * lane, y = y0 + Math.cos(a) * lane;
        const oxy = seg === 0 ? 1 - smooth(0.25, 0.75, k) : seg === 4 ? smooth(0.25, 0.75, k) : seg >= 5 ? 1 : 0;
        move(c.g, x, y);
        show(c.red, oxy); show(c.blue, 1 - oxy);
      });
      setText(r1, `Heart rate: ${hr} beats/min`);
      setText(r2, `Stroke volume: ${sv} mL per beat`);
      setText(r3, `Cardiac output ≈ ${(hr * sv / 1000).toFixed(1)} L/min`);
    };
  },
  plain: [
    'The heart is really two pumps side by side. The right side only sends blood to the lungs (a short trip). The left side sends blood to the entire body (a long trip), which is why the left ventricle has the thickest muscle.',
    'Blood always goes atrium → ventricle → artery. One-way valves stop it from sliding backwards. Arteries carry blood away from the heart and veins bring it back, whatever colour it is: the pulmonary artery carries low-O₂ blood.',
    'Cardiac output is how much blood the heart pumps per minute: heart rate × stroke volume. When you exercise, both go up. Tap “Exercising” to see it.',
  ],
  terms: [
    ['Closed circulatory system', 'Blood stays inside vessels the whole time (vertebrates). In an open system (insects, most molluscs) it leaves the vessels and bathes the organs as hemolymph.'],
    ['Atrium / ventricle', 'Atria receive blood; ventricles pump it out. Mammals and birds have 4 chambers, amphibians 3, most fish 2.'],
    ['Systole / diastole', 'Systole = ventricles contract (highest pressure). Diastole = ventricles relax and refill (lowest pressure).'],
    ['Cardiac output', 'Heart rate × stroke volume. Stroke volume is the blood pushed out per beat.'],
  ],
};

// ---------------------------------------------------------------- 2. pacemaker and ECG

function ecgAt(ph) {
  return 0.16 * gauss(ph, 0.08, 0.028) - 0.12 * gauss(ph, 0.245, 0.007) + 1.0 * gauss(ph, 0.27, 0.009)
    - 0.26 * gauss(ph, 0.293, 0.008) + 0.3 * gauss(ph, 0.5, 0.045);
}

const ecg = {
  id: 'l5-ecg', title: 'What makes the heart beat (and the ECG)',
  vars: { speed: 'slow' },
  build(svg, s, ui) {
    polish(svg);
    // painted artwork underneath (pre-scaled to cancel fit()); drawn shapes stay on top for motion and highlights
    svg.classList.add('has-art', 'art-l5-ecg');
    E('image', { href: new URL('./art/l5-ecg.jpg', import.meta.url).href, x: -20.43, y: -11.49, width: 680.85, height: 382.98, preserveAspectRatio: 'none', class: 'b-art' }, svg);
    ui.seg('speed', [['slow', 'Slow motion'], ['real', 'Real speed']], 'Speed');
    const g = E('g', {}, svg);
    const defs = E('defs', {}, svg);
    const atriaD = 'M100,170 C80,120 120,92 165,108 C185,96 230,96 248,128 C258,148 252,165 240,172 C200,178 140,178 100,170z';
    const ventD = 'M102,176 C142,184 205,184 240,178 C258,214 228,280 172,318 C118,282 88,216 102,176z';
    const ca = E('clipPath', { id: 'b-atria-clip' }, defs); E('path', { d: atriaD }, ca);
    const cv = E('clipPath', { id: 'b-vent-clip' }, defs); E('path', { d: ventD }, cv);
    const hA = E('g', {}, g), hV = E('g', {}, g);
    E('path', { d: atriaD, class: 'b-heart-part' }, hA);
    E('path', { d: ventD, class: 'b-heart-part' }, hV);
    const wa = E('circle', { cx: 120, cy: 122, r: 0, class: 'b-wave', 'clip-path': 'url(#b-atria-clip)' }, hA);
    const wv = E('circle', { cx: 172, cy: 300, r: 0, class: 'b-wave', 'clip-path': 'url(#b-vent-clip)' }, hV);
    // wiring
    E('path', { d: 'M174,178 L174,282 M174,282 C140,292 112,262 108,206 M174,282 C210,292 236,262 238,206', class: 'b-wire' }, hV);
    const sa = E('circle', { cx: 120, cy: 122, r: 7, class: 'b-node' }, hA);
    const av = E('circle', { cx: 174, cy: 176, r: 7, class: 'b-node' }, g);
    T(g, 110, 100, 'SA node', 'bs b-strong', { 'text-anchor': 'middle' });
    T(g, 188, 200, 'AV node', 'bs b-strong');
    T(g, 60, 140, 'atria', 'bs', { 'text-anchor': 'middle' });
    T(g, 66, 250, 'ventricles', 'bs', { 'text-anchor': 'middle' });
    const pulse = E('circle', { r: 5, class: 'b-spark' }, g);
    const wire = new Track(g, ['M120,122 L174,176', 'M174,178 L174,282', 'M174,282 C140,292 112,262 108,206'], { class: 'b-hidden' });

    // monitor
    const X0 = 300, X1 = 620, Y0 = 70, YB = 230, A = 110;
    E('rect', { x: X0 - 10, y: Y0 - 30, width: X1 - X0 + 20, height: 270, rx: 14, class: 'b-monitor' }, g);
    for (let x = X0; x <= X1; x += 20) E('line', { x1: x, y1: Y0 - 18, x2: x, y2: Y0 + 220, class: 'b-grid' }, g);
    for (let y = Y0 - 10; y <= Y0 + 220; y += 20) E('line', { x1: X0, y1: y, x2: X1, y2: y, class: 'b-grid' }, g);
    T(g, X0, Y0 - 14, 'ECG', 'bs b-strong');
    const trace = E('path', { class: 'b-trace' }, g);
    const cursor = E('circle', { r: 4, class: 'b-spark' }, g);
    const labs = Array.from({ length: 9 }, (_, i) => T(g, 0, 0, ['P', 'QRS', 'T'][i % 3], 'bs b-ecg-label', { 'text-anchor': 'middle' }));

    fit(svg);
    return (_lt, _dt, t) => {
      const slow = s.vars.speed === 'slow';
      const P = slow ? 3.2 : 0.86;
      const ph = frac(t / P);
      // atria: wave spreads from the SA node, fades when ventricles fire
      const ra = smooth(0, 0.15, ph) * 150;
      at(wa, 120, 122); wa.setAttribute('r', ra.toFixed(1));
      show(wa, ph < 0.15 ? 0.85 : 0.85 * (1 - smooth(0.28, 0.4, ph)));
      const rv = smooth(0.24, 0.33, ph) * 170;
      wv.setAttribute('r', rv.toFixed(1));
      show(wv, ph < 0.24 ? 0 : 0.85 * (1 - smooth(0.46, 0.6, ph)));
      const sqA = Math.sin(Math.PI * clamp((ph - 0.06) / 0.2)), sqV = Math.sin(Math.PI * clamp((ph - 0.3) / 0.25));
      scaleAbout(hA, 175, 140, 1 - 0.03 * sqA);
      scaleAbout(hV, 172, 230, 1 - 0.045 * sqV);
      sa.classList.toggle('fire', ph < 0.06);
      av.classList.toggle('fire', ph > 0.14 && ph < 0.25);
      // the spark that runs along the wiring
      let u = null;
      if (ph < 0.14) u = smooth(0, 0.14, ph) * 0.33;
      else if (ph < 0.24) u = 0.33;
      else if (ph < 0.33) u = 0.33 + smooth(0.24, 0.33, ph) * 0.67;
      if (u === null) show(pulse, 0); else { const [x, y] = wire.pos(u); at(pulse, x, y); show(pulse, 1); }

      // sweeping monitor trace
      const W = 2.2 * P;
      const c = frac(t / W);
      let d = '', pen = false;
      const n = 220;
      for (let j = 0; j <= n; j++) {
        const xr = j / n;
        let back = c - xr; if (back < 0) back += 1;
        if (back > 0.965) { pen = false; continue; } // gap ahead of the cursor
        const tt = t - back * W;
        const y = YB - A * ecgAt(frac(tt / P));
        d += `${pen ? 'L' : 'M'}${(X0 + xr * (X1 - X0)).toFixed(1)},${y.toFixed(1)}`;
        pen = true;
      }
      trace.setAttribute('d', d);
      at(cursor, X0 + c * (X1 - X0), YB - A * ecgAt(ph));
      const k0 = Math.floor(t / P);
      [0.08, 0.27, 0.5].forEach((wp, w) => {
        for (let b = 0; b < 3; b++) {
          const el = labs[b * 3 + w];
          const tt = (k0 - b + wp) * P;
          const back = (t - tt) / W;
          if (back < 0 || back > 0.9) { show(el, 0); continue; }
          let xr = c - back; if (xr < 0) xr += 1;
          el.setAttribute('x', (X0 + xr * (X1 - X0)).toFixed(1));
          el.setAttribute('y', (YB - A * ecgAt(wp) - 12).toFixed(1));
          show(el, Math.min(smooth(0, 0.02, back), 1 - smooth(0.78, 0.9, back)));
        }
      });
      if (!slow) return 'Real speed, about 70 beats a minute. Switch back to slow motion to follow each step.';
      if (ph < 0.14) return 'SA node (the pacemaker) fires on its own → the atria depolarize → P wave';
      if (ph < 0.24) return 'The AV node holds the signal for a moment so the atria can finish emptying';
      if (ph < 0.33) return 'The signal races down the septum into the ventricles → QRS (the big spike)';
      if (ph < 0.46) return 'Ventricles contract (systole)';
      if (ph < 0.62) return 'Ventricles reset, or repolarize → T wave';
      return 'Rest and refill (diastole). Then the SA node fires again.';
    };
  },
  plain: [
    'Heart muscle starts its own beat (it’s “myogenic”): no brain signal is needed. Special pacemaker cells in the SA node, in the wall of the right atrium, fire again and again on their own.',
    'The electrical wave spreads over both atria, pauses at the AV node, then shoots down to the ventricles so they squeeze from the bottom up.',
    'An ECG records those electrical waves from the skin. P = atria depolarize. QRS = ventricles depolarize. T = ventricles repolarize (reset).',
    'Nerves and hormones only adjust the rate: sympathetic nerves and epinephrine (adrenaline) speed it up and make each beat stronger. Parasympathetic nerves slow it down.',
  ],
  terms: [
    ['SA node', 'Sinoatrial node, the pacemaker. Sets the heart rate.'],
    ['AV node', 'Atrioventricular node. Delays the signal, then passes it to the ventricles.'],
    ['Depolarize / repolarize', 'Electrically “fire” / reset. Depolarization triggers contraction.'],
    ['Coronary arteries', 'Supply the heart muscle itself with blood. Blockage → heart attack.'],
  ],
};

// ---------------------------------------------------------------- 3. hemoglobin loading and unloading

const satAt = p => { const n = 2.8, p50 = 26; return p ** n / (p ** n + p50 ** n); };

const hemoglobin = {
  id: 'l5-hb', title: 'Hemoglobin loads O₂ in the lungs, drops it in tissues', dur: 9,
  vars: { mode: 'rest' },
  build(svg, s, ui) {
    polish(svg);
    // painted artwork underneath (pre-scaled to cancel fit()); drawn shapes stay on top for motion and highlights
    svg.classList.add('has-art', 'art-l5-hb');
    E('image', { href: new URL('./art/l5-hb.jpg', import.meta.url).href, x: -20.43, y: -11.49, width: 680.85, height: 382.98, preserveAspectRatio: 'none', class: 'b-art' }, svg);
    ui.seg('mode', [['rest', 'Tissue at rest'], ['run', 'Working muscle']], 'Tissue');
    const g = E('g', {}, svg);
    const GX = 70, GY = 300, GW = 300, GH = 240;
    const gx = p => GX + p / 100 * GW, gy = sat => GY - sat * GH;
    E('path', { d: `M${GX},${GY - GH - 10} L${GX},${GY} L${GX + GW + 10},${GY}`, class: 'b-axis' }, g);
    for (const p of [20, 40, 60, 80, 100]) { E('line', { x1: gx(p), y1: GY, x2: gx(p), y2: GY - GH, class: 'b-grid' }, g); T(g, gx(p), GY + 18, String(p), 'bs', { 'text-anchor': 'middle' }); }
    for (const v of [0.25, 0.5, 0.75, 1]) { E('line', { x1: GX, y1: gy(v), x2: GX + GW, y2: gy(v), class: 'b-grid' }, g); T(g, GX - 8, gy(v) + 4, `${v * 100}%`, 'bs', { 'text-anchor': 'end' }); }
    T(g, GX + GW / 2, GY + 40, 'O₂ level around the blood (PO₂, mmHg)', 'bs', { 'text-anchor': 'middle' });
    T(g, 18, GY - GH / 2, 'Hemoglobin carrying O₂', 'bs', { 'text-anchor': 'middle', transform: `rotate(-90 18 ${GY - GH / 2})` });
    let d = '';
    for (let p = 0; p <= 100; p += 1) d += `${p ? 'L' : 'M'}${gx(p).toFixed(1)},${gy(satAt(p)).toFixed(1)}`;
    E('path', { d, class: 'b-curve' }, g);
    const lungMark = E('g', {}, g);
    E('line', { x1: gx(100), y1: GY, x2: gx(100), y2: gy(satAt(100)), class: 'b-mark red' }, lungMark);
    T(lungMark, gx(100), gy(satAt(100)) - 12, 'lungs', 'bs b-strong', { 'text-anchor': 'end' });
    const tisMark = E('line', { class: 'b-mark blue' }, g);
    const tisText = T(g, 0, 0, '', 'bs b-strong', { 'text-anchor': 'middle' });
    const drop = E('line', { class: 'b-drop' }, g);
    const dropT = T(g, 0, 0, '', 'bl b-strong red-t');
    const dropT2 = T(g, 0, 0, 'given', 'bs red-t');
    const dotG = E('circle', { r: 8, class: 'b-dot' }, g);

    // the trip
    const loop = 'M560,90 C620,90 620,140 620,190 C620,240 620,290 560,290 C500,290 480,290 480,240 C480,190 480,140 480,120 C480,95 500,90 560,90';
    const lungBox = E('rect', { x: 488, y: 40, width: 144, height: 40, rx: 14, class: 'b-lung' }, g); T(g, 560, 66, 'lungs', 'bl', { 'text-anchor': 'middle' });
    const tisBox = E('rect', { x: 488, y: 300, width: 144, height: 40, rx: 14, class: 'b-body' }, g);
    const tisLabel = T(g, 560, 326, 'tissues', 'bl', { 'text-anchor': 'middle' });
    E('path', { d: loop, class: 'b-vessel soft' }, g);
    const tr = new Track(g, loop);
    const rbc = E('g', {}, g);
    const rbR = E('ellipse', { rx: 26, ry: 17, class: 'b-rbc red' }, rbc);
    const rbB = E('ellipse', { rx: 26, ry: 17, class: 'b-rbc blue' }, rbc);
    const slots = [[-10, -6], [10, -6], [-10, 6], [10, 6]].map(([x, y]) => {
      E('circle', { cx: x, cy: y, r: 5.5, class: 'b-heme' }, rbc);
      return E('circle', { cx: x, cy: y, r: 3.6, class: 'b-o2' }, rbc);
    });
    T(g, 655, 190, '', 'bs');
    fit(svg);
    return t => {
      const run = s.vars.mode === 'run';
      const pt = run ? 20 : 40;
      const u = t / this.dur;
      const [x, y] = tr.pos(u);
      move(rbc, x, y, 1 + 0.03 * breath(t, 1.6));
      flag(lungBox, 'fx-glow', u < 0.12 || u > 0.92);
      flag(tisBox, 'fx-glow', u > 0.4 && u < 0.62);
      // PO2 along the loop: lungs at the top (u≈0), tissues at the bottom (u≈0.5)
      const pLvl = keys(u, [[0, 100], [0.38, 100], [0.5, pt], [0.88, pt], [1, 100]]);
      const sat = satAt(pLvl);
      at(dotG, gx(pLvl), gy(sat));
      show(rbR, sat); show(rbB, 1 - sat);
      slots.forEach((o, i) => show(o, clamp(sat * 4 - i)));
      tisMark.setAttribute('x1', gx(pt)); tisMark.setAttribute('x2', gx(pt));
      tisMark.setAttribute('y1', GY); tisMark.setAttribute('y2', gy(satAt(pt)));
      tisText.setAttribute('x', gx(pt) + 34); tisText.setAttribute('y', gy(satAt(pt)) + 22);
      setText(tisText, run ? 'muscle' : 'tissues');
      setText(tisLabel, run ? 'working muscle' : 'tissues');
      drop.setAttribute('x1', gx(100) + 14); drop.setAttribute('x2', gx(100) + 14);
      drop.setAttribute('y1', gy(satAt(100))); drop.setAttribute('y2', gy(satAt(pt)));
      dropT.setAttribute('x', gx(100) + 22); dropT.setAttribute('y', (gy(satAt(100)) + gy(satAt(pt))) / 2 + 5);
      const given = Math.round((satAt(100) - satAt(pt)) * 100);
      setText(dropT, `${given}%`);
      dropT2.setAttribute('x', gx(100) + 22); dropT2.setAttribute('y', (gy(satAt(100)) + gy(satAt(pt))) / 2 + 21);
      if (u < 0.12 || u > 0.92) return 'In the lungs O₂ is high, so all 4 sites on each hemoglobin fill up (oxygenation)';
      if (u < 0.4) return 'Bright red, O₂-rich blood travels out to the body';
      if (u < 0.62) return run ? 'Working muscle has very little O₂, so hemoglobin gives up most of its load' : 'Tissues have less O₂, so hemoglobin lets some go (deoxygenation)';
      return 'Blood heads back to the lungs to reload';
    };
  },
  plain: [
    'Plasma can’t dissolve much O₂. Hemoglobin, inside red blood cells, grabs it and carries far more. Each hemoglobin has 4 sites that hold one O₂ each.',
    'The S-shaped curve is the key picture: where O₂ is high (lungs) hemoglobin is almost full. Where O₂ is lower (tissues) it lets go. The steep middle means a small drop in O₂ releases a lot.',
    'Working muscle has even less O₂, so hemoglobin unloads much more there. Supply automatically follows demand.',
  ],
  terms: [
    ['Respiratory pigment', 'A molecule that binds O₂ reversibly, e.g. hemoglobin.'],
    ['Oxygenation / deoxygenation', 'Picking up O₂ in the lungs / releasing it in tissues.'],
    ['Oxygen equilibrium curve', 'Graph of how full hemoglobin is at each O₂ level.'],
    ['Plasma', 'The liquid part of blood: water, glucose, ions, wastes, hormones, clotting proteins.'],
  ],
};

// ---------------------------------------------------------------- 4. vessels and pressure

const REGIONS = [
  ['Aorta & arteries', 30, 200, 'Thick, stretchy walls take the high pressure from each heartbeat'],
  ['Arterioles', 200, 300, 'Smooth muscle squeezes or relaxes to send blood where it’s needed. Pressure drops the most here.'],
  ['Capillaries', 300, 420, 'One cell thick. Cells go single file and slowly: this is where O₂ and nutrients swap'],
  ['Venules', 420, 490, 'Capillaries merge back into bigger vessels'],
  ['Veins', 490, 612, 'Thin walls, very low pressure. Valves + squeezing skeletal muscles push blood home'],
];
const radiusAt = x => x < 200 ? lerp(26, 20, smooth(30, 200, x)) : x < 300 ? lerp(20, 9, smooth(200, 300, x)) : x < 420 ? 6 : x < 490 ? lerp(6, 14, smooth(420, 490, x)) : lerp(14, 24, smooth(490, 560, x));
const meanP = x => x < 200 ? lerp(98, 90, (x - 30) / 170) : x < 300 ? lerp(90, 35, smooth(200, 300, x)) : x < 420 ? lerp(35, 15, (x - 300) / 120) : x < 490 ? lerp(15, 10, (x - 420) / 70) : lerp(10, 3, (x - 490) / 122);
const ampP = x => x < 200 ? 20 : x < 300 ? lerp(20, 0, smooth(200, 300, x)) : 0;
const speedAt = x => x < 200 ? 150 : x < 300 ? lerp(150, 60, smooth(200, 300, x)) : x < 420 ? 22 : x < 490 ? lerp(22, 70, smooth(420, 490, x)) : 90;

const vessels = {
  id: 'l5-vessels', title: 'Arteries → capillaries → veins', dur: 20,
  build(svg) {
    polish(svg);
    // painted artwork underneath (pre-scaled to cancel fit()); drawn shapes stay on top for motion and highlights
    svg.classList.add('has-art', 'art-l5-vessels');
    E('image', { href: new URL('./art/l5-vessels.jpg', import.meta.url).href, x: -20.43, y: -11.49, width: 680.85, height: 382.98, preserveAspectRatio: 'none', class: 'b-art' }, svg);
    const g = E('g', {}, svg);
    const CY = 92;
    const hl = E('rect', { y: 34, height: 290, rx: 12, class: 'b-hl' }, g);
    let top = '', bot = '';
    for (let x = 30; x <= 612; x += 4) { top += `${x === 30 ? 'M' : 'L'}${x},${(CY - radiusAt(x)).toFixed(1)}`; bot = `L${x},${(CY + radiusAt(x)).toFixed(1)}` + bot; }
    E('path', { d: `${top} ${bot.replace(/^L/, 'L')}z`, class: 'b-lumen' }, g);
    // walls: thick for arteries, thin for veins
    let wt = '', wb = '';
    for (let x = 30; x <= 612; x += 4) { wt += `${x === 30 ? 'M' : 'L'}${x},${(CY - radiusAt(x)).toFixed(1)}`; wb += `${x === 30 ? 'M' : 'L'}${x},${(CY + radiusAt(x)).toFixed(1)}`; }
    E('path', { d: wt, class: 'b-wall-art' }, g); E('path', { d: wb, class: 'b-wall-art' }, g);
    const regT = REGIONS.map(([name, a, b]) => T(g, (a + b) / 2, 150, name, 'bs b-strong fx-fade', { 'text-anchor': 'middle' }));
    // valves and muscles on the vein
    const VX = 560;
    const flapT = E('line', { x1: VX, y1: CY - 24, x2: VX + 18, y2: CY - 4, class: 'b-valve' }, g);
    const flapB = E('line', { x1: VX, y1: CY + 24, x2: VX + 18, y2: CY + 4, class: 'b-valve' }, g);
    const mT = E('ellipse', { cx: 540, rx: 34, ry: 9, class: 'b-muscle' }, g);
    const mB = E('ellipse', { cx: 540, rx: 34, ry: 9, class: 'b-muscle' }, g);
    // cells
    const cells = Array.from({ length: 34 }, (_, i) => ({ x: 30 + i * 17, y: (i % 3 - 1) * 0.55, el: E('ellipse', { rx: 5, ry: 3.6, class: 'p-oxy' }, g) }));
    // pressure graph
    const PX0 = 30, PX1 = 612, PY = 320, PH = 140, py = p => PY - p / 130 * PH;
    E('path', { d: `M${PX0},${PY - PH - 8} L${PX0},${PY} L${PX1},${PY}`, class: 'b-axis' }, g);
    for (const p of [40, 80, 120]) { E('line', { x1: PX0, y1: py(p), x2: PX1, y2: py(p), class: 'b-grid' }, g); T(g, PX0 + 4, py(p) - 3, `${p}`, 'bs'); }
    T(g, PX1, PY - PH - 2, 'blood pressure (mmHg)', 'bs', { 'text-anchor': 'end' });
    const curve = E('path', { class: 'b-curve' }, g);
    fit(svg);
    return (lt, dt, t) => {
      const ri = Math.min(4, Math.floor(lt / 4));
      const [, a, b] = REGIONS[ri];
      hl.setAttribute('x', a - 4); hl.setAttribute('width', b - a + 8);
      regT.forEach((r, i) => { flag(r, 'fx-dim', i !== ri); flag(r, 'fx-hot', i === ri); });
      let d = '';
      for (let x = PX0; x <= PX1; x += 4) d += `${x === PX0 ? 'M' : 'L'}${x},${py(meanP(x) + ampP(x) * Math.sin(TAU * (t * 1.1 - x / 260))).toFixed(1)}`;
      curve.setAttribute('d', d);
      const sq = Math.max(0, Math.sin(TAU * t / 2.4));
      mT.setAttribute('cy', (CY - 34 + 8 * sq).toFixed(1)); mB.setAttribute('cy', (CY + 34 - 8 * sq).toFixed(1));
      const open = 0.25 + 0.75 * sq;
      flapT.setAttribute('y2', (lerp(CY - 4, CY - 22, open)).toFixed(1));
      flapB.setAttribute('y2', (lerp(CY + 4, CY + 22, open)).toFixed(1));
      for (const c of cells) {
        const boost = c.x > 500 ? 0.5 + sq : 1;
        c.x += dt * speedAt(c.x) * boost * 0.6;
        if (c.x > 612) c.x -= 582;
        const r = radiusAt(c.x);
        at(c.el, c.x, CY + c.y * Math.max(0, r - 6));
        const blue = smooth(330, 430, c.x);
        c.el.setAttribute('class', blue > 0.5 ? 'p-deoxy' : 'p-oxy');
      }
      return REGIONS[ri][3];
    };
  },
  plain: [
    'Pressure is highest right out of the heart and falls the whole way around. It still pulses in the arteries, smooths out in the arterioles, and is almost zero in the veins.',
    'Capillaries are tiny (one cell thick, under 1 µm) and red cells squeeze through one at a time. Blood moves slowest there, which gives O₂, CO₂ and nutrients time to swap with the cells.',
    'Veins have such low pressure that they need help: when skeletal muscles squeeze, they push blood along, and one-way valves stop it from falling back.',
  ],
  terms: [
    ['Microcirculation', 'Arterioles + capillaries + venules.'],
    ['Vasomotor control', 'Arterioles’ smooth muscle widening or narrowing to direct blood flow.'],
    ['Blood–brain barrier', 'Brain capillaries have no pores, so many solutes can’t get through. This protects neurons.'],
    ['Glomerulus', 'Kidney capillaries with lots of pores: blood pressure pushes fluid out to start urine (Lecture 6).'],
  ],
};

// ---------------------------------------------------------------- 5. capillary exchange and lymph

const exchange = {
  id: 'l5-exchange', title: 'Fluid leaks out of capillaries, lymph brings it back', dur: 12,
  build(svg) {
    polish(svg);
    // painted artwork underneath (pre-scaled to cancel fit()); drawn shapes stay on top for motion and highlights
    svg.classList.add('has-art', 'art-l5-exchange');
    E('image', { href: new URL('./art/l5-exchange.jpg', import.meta.url).href, x: -20.43, y: -11.49, width: 680.85, height: 382.98, preserveAspectRatio: 'none', class: 'b-art' }, svg);
    const g = E('g', {}, svg);
    E('rect', { x: 30, y: 92, width: 580, height: 106, class: 'b-tissue-bg' }, g);
    for (let i = 0; i < 6; i++) E('rect', { x: 50 + i * 96, y: 106, width: 70, height: 40, rx: 12, class: 'b-cell' }, g);
    const isfT = T(g, 36, 168, 'fluid between cells (interstitial fluid)', 'bs');
    // lymph vessel, blind-ended on the left
    E('path', { d: 'M190,74 a14,14 0 0 1 0,-28 H610 v28z', class: 'b-lymph' }, g);
    T(g, 606, 40, 'lymph vessel → back into veins in the neck', 'bs', { 'text-anchor': 'end' });
    // capillary
    E('rect', { x: 30, y: 206, width: 580, height: 40, rx: 20, class: 'b-capillary' }, g);
    const artT = T(g, 40, 200, 'artery end', 'bs b-strong red-t fx-fade');
    const veinT = T(g, 600, 200, 'vein end', 'bs b-strong blue-t fx-fade', { 'text-anchor': 'end' });
    // net arrows
    const arrows = [];
    const mOut = arrowDefs(svg, 'b-m-out', 'b-head red'), mIn = arrowDefs(svg, 'b-m-in', 'b-head blue');
    for (let i = 0; i < 9; i++) {
      const x = 132 + i * 47;
      arrows.push({ x, el: E('path', { class: 'b-arrow' }, g) });
    }
    const water = Array.from({ length: 34 }, () => E('circle', { r: 3.6, class: 'p-water' }, g));
    const prot = Array.from({ length: 10 }, () => E('circle', { r: 6.5, class: 'p-protein' }, g));
    const rbc = Array.from({ length: 8 }, () => E('ellipse', { rx: 7, ry: 5, class: 'p-oxy' }, g));
    // the two forces
    const GX0 = 30, GX1 = 610, GY = 350, gy = v => GY - 6 - v * 2;
    E('line', { x1: GX0, y1: GY, x2: GX1, y2: GY, class: 'b-axis' }, g);
    E('path', { d: `M${GX0},${gy(35)} L${GX1},${gy(15)}`, class: 'b-line red' }, g);
    E('path', { d: `M${GX0},${gy(25)} L${GX1},${gy(25)}`, class: 'b-line blue' }, g);
    T(g, GX0 + 4, gy(35) - 6, 'blood pressure pushes water out', 'bs red-t');
    const labelLayer = E('g', {}, g);
    [isfT, artT, veinT].forEach(el => labelLayer.append(el));
    const syncP = pills([isfT, artT, veinT]);
    T(g, GX1 - 4, gy(25) - 6, 'proteins pull water back in', 'bs blue-t', { 'text-anchor': 'end' });
    fit(svg);
    return (lt, _dt, t) => {
      arrows.forEach(({ x, el }) => {
        const net = (35 - 20 * (x - 30) / 580) - 25; // + means out
        const len = Math.abs(net) * 2.8 * (0.8 + 0.2 * Math.sin(TAU * t - x / 40));
        el.setAttribute('d', net > 0 ? `M${x},212 L${x},${(212 - len).toFixed(1)}` : `M${x},${(196 - len).toFixed(1)} L${x},${196}`);
        el.setAttribute('class', `b-arrow ${net > 0 ? 'out' : 'in'}`);
        el.setAttribute('marker-end', net > 0 ? mOut : mIn);
        show(el, Math.min(1, len / 8));
      });
      water.forEach((w, i) => {
        const life = 6, off = (i * 0.37) % 1;
        const u = frac(t / life + off);
        const x0 = 60 + (i * 53) % 260;
        const toLymph = i % 3 === 0;
        let p;
        if (toLymph) p = keys(u, [[0, [x0, 226]], [0.25, [x0 + 10, 170]], [0.5, [x0 + 40, 120]], [0.7, [x0 + 60, 62]], [1, [Math.min(605, x0 + 360), 62]]]);
        else p = keys(u, [[0, [x0, 226]], [0.25, [x0 + 20, 172]], [0.55, [x0 + 200, 168]], [0.8, [x0 + 240, 226]], [1, [x0 + 300, 226]]]);
        const [jx, jy] = drift(i, t, 1.6);
        at(w, p[0] + jx, p[1] + jy);
        show(w, Math.min(smooth(0, 0.06, u), 1 - smooth(0.94, 1, u)));
      });
      prot.forEach((p, i) => at(p, 30 + frac(t * 0.05 + i / prot.length) * 580, 226 + (i % 2 ? 7 : -7)));
      rbc.forEach((r, i) => {
        const x = 30 + frac(t * 0.05 + (i + 0.5) / rbc.length) * 580;
        at(r, x, 226);
        r.setAttribute('class', x > 330 ? 'p-deoxy' : 'p-oxy');
      });
      g.append(labelLayer);
      syncP();
      flag(artT, 'fx-dim', lt >= 4 && lt < 8); flag(veinT, 'fx-dim', lt < 4);
      if (lt < 4) return 'Artery end: blood pressure is stronger than the protein pull, so water leaks out';
      if (lt < 8) return 'Vein end: pressure has dropped, so the proteins left in the blood pull some water back in';
      return 'A little is left over every time (2–4 L a day!). Lymph vessels collect it and return it to the blood';
    };
  },
  plain: [
    'Capillaries are leaky on purpose. At the artery end, blood pressure squeezes water and small solutes out into the space around cells.',
    'Big proteins stay in the blood. At the vein end pressure is lower, and the proteins’ osmotic pull wins, so some water comes back in.',
    'Not all of it comes back. The lymphatic system soaks up the extra fluid and drains it into veins in the neck. If it didn’t, your tissues would swell.',
  ],
  terms: [
    ['Hydrostatic pressure', 'Blood pressure: pushes fluid out.'],
    ['Osmotic pressure', 'The pull of dissolved stuff (here plasma proteins): draws water in.'],
    ['Lymphatic system', 'Vessels that return leaked fluid (lymph) to the blood.'],
  ],
};

// ---------------------------------------------------------------- 6. countercurrent heat exchange

const tuna = {
  id: 'l5-tuna', title: 'Countercurrent heat exchange (tuna)', dur: 10,
  beats: [[0, 'Cold blood (blue) flows in through the artery toward the warm muscle'], [5, 'Warm blood leaving the muscle passes its heat across to the incoming artery']],
  build(svg) {
    polish(svg);
    // painted artwork underneath; drawn shapes stay on top for motion and highlights
    svg.classList.add('has-art', 'art-l5-tuna');
    E('image', { href: new URL('./art/l5-tuna.jpg', import.meta.url).href, x: 0, y: 0, width: 640, height: 360, preserveAspectRatio: 'none', class: 'b-art' }, svg);
    const g = E('g', {}, svg);
    E('rect', { x: 40, y: 60, width: 120, height: 220, rx: 22, class: 'b-water-bg' }, g);
    T(g, 100, 50, 'cold skin side', 'bs', { 'text-anchor': 'middle' });
    E('rect', { x: 480, y: 60, width: 120, height: 220, rx: 22, class: 'b-muscle-bg' }, g);
    T(g, 540, 50, 'warm red muscle', 'bs', { 'text-anchor': 'middle' });
    const A = 'M150,130 L490,130', V = 'M490,210 L150,210';
    E('path', { d: A, class: 'b-pipe red' }, g); E('path', { d: V, class: 'b-pipe blue' }, g);
    const aT = T(g, 320, 112, 'artery: blood flowing in → gets warmer', 'bs fx-fade', { 'text-anchor': 'middle' });
    const vT = T(g, 320, 244, '← vein: warm blood flowing out gives its heat away', 'bs fx-fade', { 'text-anchor': 'middle' });
    const ta = new Track(g, A), tv = new Track(g, V);
    const heat = Array.from({ length: 7 }, (_, i) => E('path', { d: 'M0,0 l0,-46', class: 'b-heat' }, g));
    const ca = beadify(Array.from({ length: 10 }, () => E('circle', { r: 7 }, g)));
    const cv = beadify(Array.from({ length: 10 }, () => E('circle', { r: 7 }, g)));
    const temp = k => `hsl(${lerp(215, 2, k).toFixed(0)} 75% 58%)`;
    T(g, 320, 312, 'Heat jumps across from vein to artery all along the way,', 'bs', { 'text-anchor': 'middle' });
    T(g, 320, 330, 'so it stays in the muscle instead of being lost to the cold water.', 'bs', { 'text-anchor': 'middle' });
    return (lt, _dt, t) => {
      flag(aT, 'b-strong', lt < 5); flag(vT, 'b-strong', lt >= 5); flag(aT, 'fx-dim', lt >= 5); flag(vT, 'fx-dim', lt < 5);
      ca.forEach((c, i) => { const u = frac(t * 0.08 + i / 10); const [x, y] = ta.pos(u); at(c, x, y + 1.5 * Math.sin(t * 2 + i)); c.style.fill = temp(0.08 + 0.75 * u); });
      cv.forEach((c, i) => { const u = frac(t * 0.08 + i / 10); const [x, y] = tv.pos(u); at(c, x, y + 1.5 * Math.sin(t * 2 + i + 1)); c.style.fill = temp(0.95 - 0.75 * u); });
      heat.forEach((h, i) => {
        const x = 190 + i * 45, k = frac(t * 0.7 + i * 0.13);
        h.setAttribute('transform', `translate(${x} ${208 - k * 22})`);
        show(h, Math.sin(Math.PI * k));
      });
    };
  },
  plain: [
    'Arteries and veins run side by side in opposite directions. Warm blood leaving the muscle heats the cold blood coming in, so the heat loops back to the muscle instead of escaping.',
    'Tuna use this to keep their swimming muscles warm. The same countercurrent idea shows up again in the kidney (Lecture 6).',
  ],
  terms: [['Countercurrent', 'Two flows running in opposite directions next to each other, so heat (or solutes) can be passed along the whole length.']],
};

export default {
  id: 'L5', n: '5', short: 'Circulation', color: '--b-red', chapter: 'Ch 30.4–30.6',
  title: 'Circulation: heart, blood and vessels',
  minute: [
    'A circulatory system = a pump (heart) + a fluid (blood) + pipes (vessels). It moves O₂, nutrients, hormones, heat and wastes fast.',
    'Vertebrates have a closed system: blood never leaves the vessels. Arteries → arterioles → capillaries → venules → veins.',
    'Blood = plasma (water + solutes) + red cells (hemoglobin carries O₂) + white cells (immunity) + platelets (clotting).',
    'The 4-chamber heart is two pumps: right side → lungs, left side → body. Valves keep flow one-way.',
    'The SA node starts each beat, the AV node delays it, and then the ventricles fire. ECG: P, QRS, T.',
    'Pressure falls along the way. Capillaries swap materials. Leftover fluid returns via lymph. Veins rely on valves and muscles.',
  ],
  traps: [
    'Arteries go AWAY from the heart even when the blood is low in O₂ (pulmonary artery).',
    'The SA node is the pacemaker; the AV node only delays the signal.',
    'P = atria depolarize, QRS = ventricles depolarize, T = ventricles repolarize. Atrial repolarization is hidden in the QRS.',
    'Sympathetic speeds the heart up; parasympathetic slows it.',
    'Pressure drops most in the arterioles, but blood moves slowest in the capillaries.',
  ],
  links: [['Kidneys filter blood at the glomerulus → Lecture 6', 'L6'], ['Sympathetic vs parasympathetic → Lecture 8', 'L8'], ['Epinephrine and ADH are hormones → Lecture 9', 'L9']],
  scenes: [heart, ecg, hemoglobin, vessels, exchange, tuna],
  quiz: [
    { q: 'Which chamber pumps blood out to the whole body?', a: 'Left ventricle', o: ['Right ventricle', 'Left atrium', 'Right atrium'], why: 'The left ventricle sends blood out the aorta to the body. That’s why it has the thickest wall.' },
    { q: 'The pulmonary artery carries…', a: 'Low-O₂ blood from the right ventricle to the lungs', o: ['O₂-rich blood from the lungs to the heart', 'O₂-rich blood to the body', 'Low-O₂ blood from the body to the right atrium'], why: 'Arteries always carry blood away from the heart. This one carries used blood to the lungs.' },
    { q: 'What starts each heartbeat?', a: 'Pacemaker cells in the SA node', o: ['A signal from the brain', 'The AV node', 'Epinephrine from the adrenal glands'], why: 'Heart muscle is myogenic: the SA node fires on its own. Nerves and hormones only adjust the rate.' },
    { q: 'On an ECG, the QRS complex shows…', a: 'The ventricles depolarizing', o: ['The atria depolarizing', 'The ventricles repolarizing', 'The AV node delay'], why: 'P = atria depolarize, QRS = ventricles depolarize, T = ventricles repolarize.' },
    { q: 'Cardiac output is…', a: 'Heart rate × stroke volume', o: ['Blood pressure × heart rate', 'Stroke volume ÷ heart rate', 'The pressure in the aorta'], why: 'It’s the volume pumped per minute: beats per minute × mL per beat. Both rise during exercise.' },
    { q: 'Why does hemoglobin drop off more O₂ in a working muscle?', a: 'The muscle’s O₂ level is lower, so hemoglobin lets go of more', o: ['Muscle has more hemoglobin', 'The blood moves faster there', 'Hemoglobin can only carry O₂ when resting'], why: 'On the S-shaped curve, lower O₂ means much lower saturation. The steep middle part releases a lot.' },
    { q: 'At the artery end of a capillary, fluid moves…', a: 'Out, because blood pressure beats the osmotic pull', o: ['In, because of the plasma proteins', 'Nowhere, the wall is sealed', 'Out, because proteins leave too'], why: 'Blood pressure is high at the start. Later it drops below the proteins’ osmotic pull, and some water returns.' },
    { q: 'What happens to the extra fluid that leaks out of capillaries?', a: 'Lymph vessels collect it and return it to the blood', o: ['The kidneys filter it out as urine', 'It stays between the cells', 'It evaporates through the skin'], why: 'About 2–4 L a day goes back through the lymphatic system into veins in the neck.' },
    { q: 'Veins keep blood moving toward the heart mainly by…', a: 'One-way valves plus squeezing skeletal muscles', o: ['High blood pressure', 'Thick muscular walls', 'Their own pacemaker'], why: 'Pressure in veins is very low, so muscles squeeze them and valves stop backflow.' },
    { q: 'Which animal has an open circulatory system?', a: 'A grasshopper (arthropod)', o: ['A trout', 'A frog', 'A human'], why: 'Arthropods and most molluscs have open systems: hemolymph leaves the vessels. Vertebrates are closed.' },
  ],
};
