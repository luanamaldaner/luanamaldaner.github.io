// Lecture 4 · Ch 30.1–30.3 · Gas exchange and breathing

import { E, T, Track, at, move, show, setText, smooth, keys, frac, lerp, clamp, TAU } from './kit.js';
import { polish, fit, pill, pills, breath, scaleAbout, drift, ease, life, flag, beadify } from './fx-a.js';

const MID = { 'text-anchor': 'middle' };
const END = { 'text-anchor': 'end' };
/** 0 = low O₂ (blue), 1 = full of O₂ (red) */
const o2Col = k => `hsl(${lerp(225, 355, clamp(k)).toFixed(0)} 70% 58%)`;
const tri = x => 1 - Math.abs(1 - 2 * frac(x));

// ---------------------------------------------------------------- 1. the pathway for oxygen

const STEPS = [
  ['① Bulk flow: breathing moves air in', [4, 60, 176, 60]],
  ['② Diffusion: alveolus → blood', [140, 54, 120, 162]],
  ['③ Bulk flow: blood circulation', [116, 170, 448, 48]],
  ['④ Diffusion: blood → cells', [446, 24, 188, 194]],
];

const pathway = {
  id: 'l4-path', title: 'The pathway for oxygen', dur: 16,
  build(svg) {
    polish(svg);
    // painted artwork underneath (pre-scaled to cancel fit()); drawn shapes stay on top for motion and highlights
    svg.classList.add('has-art', 'art-l4-path');
    E('image', { href: new URL('./art/l4-path.jpg', import.meta.url).href, x: -20.43, y: -11.49, width: 680.85, height: 382.98, preserveAspectRatio: 'none', class: 'b-art' }, svg);
    const g = E('g', {}, svg);
    const hl = E('rect', { rx: 12, class: 'b-hl' }, g);
    E('path', { d: 'M8,92 L150,100', class: 'b-airway' }, g);
    T(g, 12, 76, 'air breathed in', 'bs b-strong');
    const alv = E('circle', { cx: 200, cy: 110, r: 54, class: 'b-lung' }, g);
    T(g, 200, 46, 'alveolus (in the lung)', 'bs b-strong', MID);
    const alvP = T(g, 222, 96, 'PO₂ ≈ 100', 'bs b-strong red-t', MID);
    E('rect', { x: 120, y: 176, width: 440, height: 36, rx: 18, class: 'b-capillary' }, g);
    E('rect', { x: 452, y: 30, width: 178, height: 130, rx: 20, class: 'b-cellbody' }, g);
    T(g, 464, 52, 'body cell', 'bs b-strong');
    T(g, 620, 52, 'PO₂ < 40', 'bs b-strong blue-t', END);
    E('ellipse', { cx: 548, cy: 104, rx: 44, ry: 22, class: 'b-mito' }, g);
    const mitoT = T(g, 548, 146, 'mitochondrion', 'bs', MID);
    T(g, 124, 232, 'arriving: PO₂ ≈ 40', 'bs b-strong blue-t');
    T(g, 370, 232, 'loaded: PO₂ ≈ 100', 'bs b-strong red-t', MID);
    T(g, 556, 232, 'blood flows →', 'bs', END);
    const tr = [
      new Track(g, 'M8,92 L172,104'),
      new Track(g, 'M176,112 L204,192'),
      new Track(g, 'M204,194 L470,194'),
      new Track(g, 'M470,186 L530,110'),
    ];
    const rbcs = beadify(Array.from({ length: 7 }, () => E('ellipse', { rx: 10, ry: 7 }, g)));
    const SEG = [0, 0.22, 0.42, 0.75, 1];
    const o2 = Array.from({ length: 16 }, () => E('circle', { r: 4.5, class: 'p-oxy' }, g));
    const co2 = Array.from({ length: 8 }, () => E('circle', { r: 4.5, class: 'p-co2' }, g));
    const top = E('g', {}, g);
    [alvP, mitoT].forEach(el => top.append(el));
    const syncP = pills([alvP, mitoT]);
    const badges = STEPS.map(([text], i) => {
      const bg = E('g', {}, g);
      const x = i % 2 ? 326 : 14, y = i < 2 ? 266 : 304;
      E('rect', { x, y, width: 300, height: 30, rx: 10, class: 'b-badge' }, bg);
      T(bg, x + 12, y + 20, text, 'bs b-strong');
      return bg;
    });
    fit(svg);
    return (lt, _dt, t) => {
      const step = Math.min(3, Math.floor(lt / 4));
      const [hx, hy, hw, hh] = STEPS[step][1];
      hl.setAttribute('x', hx); hl.setAttribute('y', hy); hl.setAttribute('width', hw); hl.setAttribute('height', hh);
      badges.forEach((b, i) => b.classList.toggle('on', i === step));
      alv.setAttribute('r', (54 + 2.2 * breath(t, 4)).toFixed(2));
      flag(alv, 'fx-glow', step === 1);
      syncP();
      rbcs.forEach((r, i) => {
        const x = 130 + frac(t * 0.05 + i / 7) * 420;
        at(r, x, 194 + 1.5 * Math.sin(t * 1.8 + i * 1.3));
        r.style.fill = o2Col(smooth(190, 250, x) * (1 - 0.7 * smooth(470, 540, x)));
      });
      o2.forEach((d, i) => {
        const u = frac(t * 0.08 + i / o2.length);
        let s = 0; while (s < 3 && u >= SEG[s + 1]) s++;
        const k = (u - SEG[s]) / (SEG[s + 1] - SEG[s]);
        let [x, y] = tr[s].pos(k);
        if (s === 1 || s === 3) { const w = Math.sin(Math.PI * k); x += 6 * w * Math.sin(t * 6 + i * 2.3); y += 5 * w * Math.cos(t * 5.3 + i * 1.7); }
        if (s === 2) y += ((i % 3) - 1) * 6;
        at(d, x, y);
        show(d, Math.min(smooth(0, 0.03, u), 1 - smooth(0.95, 1, u)));
      });
      co2.forEach((d, i) => {
        const u = frac(t * 0.12 + i / co2.length);
        let x, y;
        if (i % 2) { [x, y] = tr[3].pos(1 - u); }
        else if (u < 0.5) { [x, y] = tr[1].pos(1 - u * 2); }
        else { [x, y] = tr[0].pos(1 - (u - 0.5) * 2); }
        const w = Math.sin(Math.PI * u);
        at(d, x + 5 * w * Math.sin(t * 5 + i), y + 4 * w * Math.cos(t * 4 + i));
        show(d, 0.85 * Math.min(smooth(0, 0.08, u), 1 - smooth(0.9, 1, u)));
      });
      return [
        '① Breathing moves air into the alveoli by bulk flow: the whole mass of air moves together',
        '② O₂ diffuses across two thin layers (alveolus and capillary wall): PO₂ is about 100 in the air but 40 in the blood arriving',
        '③ The blood carries O₂ away by bulk flow, held on hemoglobin in red blood cells',
        '④ O₂ diffuses from the blood (≈ 100) into cells (under 40) and is used by the mitochondria. CO₂ (purple) goes the other way.',
      ][step];
    };
  },
  plain: [
    'Mitochondria need O₂ as the final electron acceptor in aerobic respiration (internal respiration). Getting O₂ from the outside world to them is external respiration.',
    'O₂ and CO₂ are never actively pumped. They travel by two passive steps, again and again: bulk flow (air or blood moving as a whole) and diffusion (molecules spreading from high to low partial pressure).',
    'O₂ always moves down a partial pressure gradient: about 100 mmHg in the lungs, about 40 in the blood arriving there, and under 40 in body cells.',
    'CO₂, the waste of respiration, makes body fluids acidic, so it has to be removed just as efficiently. It follows the same route backwards.',
  ],
  terms: [
    ['Partial pressure (PO₂)', 'The share of the total gas pressure due to one gas. Gases diffuse from high to low partial pressure.'],
    ['Bulk flow', 'A whole fluid (air, water, blood) moving and carrying gases with it.'],
    ['Diffusion', 'Molecules spreading from where they’re more concentrated to where they’re less.'],
    ['Alveoli', 'Tiny air pockets at the ends of the lung’s airways, where gas exchange happens.'],
  ],
};

// ---------------------------------------------------------------- 2. air vs water

const airWater = {
  id: 'l4-airwater', title: 'Breathing air vs breathing water', dur: 12,
  vars: { temp: 'cool' },
  build(svg, s, ui) {
    polish(svg);
    // painted artwork underneath (pre-scaled to cancel fit()); drawn shapes stay on top for motion and highlights
    svg.classList.add('has-art', 'art-l4-airwater');
    E('image', { href: new URL('./art/l4-airwater.jpg', import.meta.url).href, x: -20.43, y: -11.49, width: 680.85, height: 382.98, preserveAspectRatio: 'none', class: 'b-art' }, svg);
    ui.seg('temp', [['cool', 'Cool water'], ['warm', 'Warm water']], 'Water temperature');
    const g = E('g', {}, svg);
    T(g, 162, 30, 'Air and water with the SAME PO₂', 'bs b-strong', MID);
    E('rect', { x: 24, y: 46, width: 276, height: 124, class: 'b-skybg' }, g);
    E('rect', { x: 24, y: 170, width: 276, height: 148, class: 'b-water-bg' }, g);
    E('rect', { x: 24, y: 46, width: 276, height: 272, rx: 6, class: 'b-jar' }, g);
    const air = Array.from({ length: 40 }, (_, i) => ({ ax: (i * 0.618) % 1, ay: (i * 0.377) % 1, vx: 0.05 + (i % 5) * 0.012, vy: 0.04 + (i % 7) * 0.01, el: E('circle', { r: 4.5, class: 'p-oxy' }, g) }));
    const wat = Array.from({ length: 8 }, (_, i) => ({ ax: (i * 0.618 + 0.2) % 1, ay: (i * 0.41) % 1, vx: 0.012 + (i % 3) * 0.004, vy: 0.01 + (i % 4) * 0.003, el: E('circle', { r: 4.5, class: 'p-oxy' }, g) }));
    T(g, 32, 66, 'air', 'bs b-strong');
    T(g, 32, 190, 'water', 'bs b-strong b-water-t');
    const count = T(g, 162, 338, '', 'bs b-strong', MID);
    const syncCount = pill(count, { px: 10 });
    const warmT = T(g, 162, 356, '', 'bs b-strong b-acid-t', MID);
    // diffusion race
    E('rect', { x: 324, y: 14, width: 304, height: 332, rx: 14, class: 'b-monitor' }, g);
    T(g, 338, 38, 'How far O₂ spreads by diffusion', 'bs b-strong');
    E('rect', { x: 338, y: 56, width: 276, height: 96, rx: 10, class: 'b-skybg' }, g);
    E('rect', { x: 338, y: 186, width: 276, height: 96, rx: 10, class: 'b-water-bg' }, g);
    T(g, 346, 70, 'through air', 'bs b-strong');
    T(g, 346, 204, 'through water', 'bs b-strong b-water-t');
    T(g, 346, 170, 'fast: spreads a long way', 'bs');
    T(g, 346, 300, 'very slow: barely moves', 'bs');
    T(g, 338, 330, 'Flooded turtle nest → eggs suffocate', 'bs b-strong');
    const lanes = [[104, 250], [234, 18]].map(([mid, far]) => ({ mid, far, els: Array.from({ length: 22 }, () => E('circle', { r: 4, class: 'p-oxy' }, g)) }));
    lanes.forEach(l => E('circle', { cx: 352, cy: l.mid, r: 6, class: 'b-pt gold' }, g));
    fit(svg);
    return (lt, _dt, t) => {
      const warm = s.vars.temp === 'warm';
      const n = warm ? 3 : 6;
      air.forEach(p => at(p.el, 34 + 256 * tri(p.ax + t * p.vx), 74 + 88 * tri(p.ay + t * p.vy)));
      wat.forEach((p, i) => { at(p.el, 34 + 256 * tri(p.ax + t * p.vx), 200 + 108 * tri(p.ay + t * p.vy)); show(p.el, i < n ? 1 : 0); });
      setText(count, `O₂ molecules here: air 40 · water ${n}`);
      syncCount();
      setText(warmT, warm ? 'warm water holds even less O₂' : '');
      const grow = Math.sqrt(smooth(0, 10, lt));
      lanes.forEach(l => l.els.forEach((d, i) => {
        const r = (i * 0.618 + 0.1) % 1, v = (i * 0.381) % 1 - 0.5;
        const sp = l.far * grow;
        at(d, Math.min(608, 356 + r * sp + 2 * Math.sin(t * 3 + i)), l.mid + v * Math.min(56, 10 + sp * 0.5) + 2 * Math.cos(t * 2.6 + i));
        show(d, 1 - smooth(10.8, 11.8, lt));
      }));
      if (lt < 4) return 'Left: O₂ pushes into the water until its partial pressure matches the air above…';
      if (lt < 8) return '…but at the same partial pressure, water holds far fewer O₂ molecules than air';
      return warm
        ? 'Warm water holds even less O₂. And O₂ diffuses much more slowly through water than air (right).'
        : 'Right: O₂ also diffuses much faster through air than through water';
    };
  },
  plain: [
    'The partial pressure of a gas evens out between air and water. But at the same partial pressure, water holds much less of the gas than air does.',
    'O₂ dissolves poorly in water, and even less as water warms up. So water breathers start with much less O₂ to work with.',
    'Diffusion is also much faster through air than through water. Sea turtle eggs get plenty of O₂ in moist sand, but if the nest floods, PO₂ around them drops and the eggs die.',
  ],
  terms: [
    ['Solubility', 'How much of a gas can dissolve in a liquid. O₂’s solubility in water is low and falls as temperature rises.'],
    ['Gas exchange membrane', 'A thin layer of tissue where gases pass between the environment and the body.'],
  ],
};

// ---------------------------------------------------------------- 3. fish gills: countercurrent

const gillW = (x, cc) => (cc ? 100 - 80 * x : 50 + 50 * Math.exp(-4 * x));
const gillB = (x, cc) => (cc ? 90 - 80 * x : 50 - 50 * Math.exp(-4 * x));

const gills = {
  id: 'l4-gills', title: 'Fish gills: countercurrent exchange', dur: 10,
  vars: { flow: 'cc' },
  build(svg, s, ui) {
    polish(svg);
    // painted artwork underneath (pre-scaled to cancel fit()); drawn shapes stay on top for motion and highlights
    svg.classList.add('has-art', 'art-l4-gills');
    E('image', { href: new URL('./art/l4-gills.jpg', import.meta.url).href, x: -20.43, y: -11.49, width: 680.85, height: 382.98, preserveAspectRatio: 'none', class: 'b-art' }, svg);
    ui.seg('flow', [['cc', 'Countercurrent (real fish)'], ['co', 'Same direction (what if?)']], 'Blood flow');
    const g = E('g', {}, svg);
    const X0 = 70, X1 = 560, gx = x => X0 + x * (X1 - X0);
    T(g, (X0 + X1) / 2, 46, 'water flows this way →', 'bs b-strong b-water-t', MID);
    E('rect', { x: X0, y: 60, width: X1 - X0, height: 48, rx: 10, class: 'b-water-bg' }, g);
    E('rect', { x: X0, y: 108, width: X1 - X0, height: 6, class: 'b-lipid' }, g);
    E('rect', { x: X0, y: 114, width: X1 - X0, height: 48, rx: 10, class: 'b-capillary' }, g);
    T(g, X0 - 8, 90, 'water', 'bs b-strong', END);
    T(g, X0 - 8, 142, 'blood', 'bs b-strong', END);
    T(g, X1 + 8, 114, 'lamella', 'bs');
    const bDir = T(g, (X0 + X1) / 2, 184, '', 'bs b-strong red-t', MID);
    const wO2 = Array.from({ length: 20 }, () => E('circle', { r: 4.5, class: 'p-oxy' }, g));
    const cells = beadify(Array.from({ length: 12 }, () => E('ellipse', { rx: 10, ry: 7 }, g)));
    const arrows = Array.from({ length: 9 }, (_, i) => ({ x: gx((i + 0.5) / 9), el: E('path', { class: 'b-o2flow' }, g) }));
    const readout = T(g, X0, 210, '', 'bl b-strong');
    // graph
    const GY0 = 322, gy = v => GY0 - v;
    E('path', { d: `M${X0},${GY0 - 104} L${X0},${GY0} L${X1 + 4},${GY0}`, class: 'b-axis' }, g);
    E('line', { x1: X0, y1: gy(50), x2: X1, y2: gy(50), class: 'b-grid' }, g);
    T(g, X0 - 6, gy(100) + 4, '100%', 'bs', END);
    T(g, X0 - 6, gy(50) + 4, '50%', 'bs', END);
    T(g, X0 - 6, gy(0) + 4, '0%', 'bs', END);
    T(g, (X0 + X1) / 2, 346, 'O₂ along the lamella (in the direction the water flows →)', 'bs', MID);
    const wl = E('path', { class: 'b-line water' }, g), bl = E('path', { class: 'b-line red' }, g);
    const wLab = T(g, X1 + 6, 0, 'water', 'bs b-strong b-water-t');
    const bLab = T(g, X1 + 6, 0, 'blood', 'bs b-strong red-t');
    fit(svg);
    return (lt, _dt, t) => {
      const cc = s.vars.flow === 'cc';
      setText(bDir, cc ? '← blood flows the opposite way' : 'blood flows the same way →');
      wO2.forEach((d, i) => {
        const x = frac(t * 0.1 + i / wO2.length);
        at(d, gx(x), 72 + (i % 4) * 8 + 2 * Math.sin(t * 3 + i));
        show(d, 0.1 + 0.9 * gillW(x, cc) / 100);
      });
      cells.forEach((c, i) => {
        const u = frac(t * 0.08 + i / cells.length);
        const x = cc ? 1 - u : u;
        c.setAttribute('cx', gx(x).toFixed(1)); c.setAttribute('cy', (130 + (i % 2) * 16 + 1.5 * Math.sin(t * 2 + i)).toFixed(1));
        c.style.fill = o2Col(gillB(x, cc) / 100);
      });
      arrows.forEach(({ x, el }) => {
        const xr = (x - X0) / (X1 - X0);
        const gap = gillW(xr, cc) - gillB(xr, cc);
        const k = frac(t * 0.9 + xr * 2);
        el.setAttribute('d', `M${x.toFixed(1)},${(98 + k * 14).toFixed(1)} l0,10`);
        show(el, clamp(gap / 25) * Math.sin(Math.PI * k));
      });
      let dw = '', db = '';
      for (let k = 0; k <= 50; k++) {
        const x = k / 50;
        dw += `${k ? 'L' : 'M'}${gx(x).toFixed(1)},${gy(gillW(x, cc)).toFixed(1)}`;
        db += `${k ? 'L' : 'M'}${gx(x).toFixed(1)},${gy(gillB(x, cc)).toFixed(1)}`;
      }
      wl.setAttribute('d', dw); bl.setAttribute('d', db);
      let yw = gy(gillW(1, cc)) + 4, yb = gy(gillB(1, cc)) + 4;
      if (yb - yw < 15) { const m = (yw + yb) / 2; yw = m - 7.5; yb = m + 7.5; }
      wLab.setAttribute('y', yw.toFixed(1)); bLab.setAttribute('y', yb.toFixed(1));
      setText(readout, cc ? 'Blood leaves the gill ≈ 90% full of O₂' : 'Blood leaves the gill only ≈ 50% full');
      if (cc) return lt < 5
        ? 'Countercurrent: all along the lamella, blood meets water that has a bit more O₂ than it does…'
        : '…so O₂ keeps diffusing in the whole way, and the blood leaves almost as rich as the fresh water';
      return lt < 5
        ? 'Same direction: fresh water meets the emptiest blood, so the gap is big at first…'
        : '…but they quickly even out at about half, and exchange stops. Much less O₂ picked up.';
    };
  },
  plain: [
    'Gills are folded outward (evaginated) and surrounded by water. Lungs are folded inward (invaginated) and hold the air inside. Both fold and branch to get a huge surface area.',
    'Each gill arch has two rows of gill filaments, and each filament is covered in thin secondary lamellae where exchange happens.',
    'A fish pumps water one way only: in the mouth, over the gills and out under the opercular flaps (unidirectional ventilation). Blood in each lamella flows the opposite way: a countercurrent system.',
    'Because the blood always meets water with a little more O₂, there is a gradient along the whole length, and the blood can pick up most of the water’s O₂.',
  ],
  terms: [
    ['Lamellae', 'Thin plates on gill filaments: the actual gas exchange surface.'],
    ['Unidirectional ventilation', 'Water (or air) flows one way over the exchange surface. No mixing of fresh and used.'],
    ['Countercurrent exchange', 'Two flows in opposite directions so a gradient exists along the whole length.'],
    ['Perfusion', 'Blood flow through the capillaries of a tissue. It must be fast enough to carry O₂ away.'],
  ],
};

// ---------------------------------------------------------------- 4. bird lungs: two breaths, one-way air

const PHASES = ['Inhale 1', 'Exhale 1', 'Inhale 2', 'Exhale 2'];

const bird = {
  id: 'l4-bird', title: 'Bird lungs: air sacs and one-way airflow', dur: 16,
  build(svg) {
    polish(svg);
    // painted artwork underneath (pre-scaled to cancel fit()); drawn shapes stay on top for motion and highlights
    svg.classList.add('has-art', 'art-l4-bird');
    E('image', { href: new URL('./art/l4-bird.jpg', import.meta.url).href, x: -20.43, y: -11.49, width: 680.85, height: 382.98, preserveAspectRatio: 'none', class: 'b-art' }, svg);
    const g = E('g', {}, svg);
    const AIR = {
      trachea: 'M16,74 L150,74 C186,74 200,96 200,130 L200,160',
      bronchus: 'M200,160 L470,160 C510,160 535,200 535,240',
      toLung: 'M550,240 C560,160 520,100 440,100',
      lung: 'M440,100 L240,100',
      toAnt: 'M240,100 C190,100 130,160 115,240',
      out: 'M115,240 C130,180 196,180 200,140 C200,96 186,74 150,74 L16,74',
    };
    const sacImg = new URL('./art/sprites/l4-bird-sac.webp', import.meta.url).href;
    const sacP = E('g', {}, g); E('image', { href: sacImg, x: -22, y: -18, width: 100, height: 108, preserveAspectRatio: 'xMidYMid meet' }, sacP);
    const sacA = E('g', {}, g); E('image', { href: sacImg, x: -22, y: -18, width: 100, height: 108, preserveAspectRatio: 'xMidYMid meet', transform: 'scale(-1 1)' }, sacA);
    E('path', { d: AIR.trachea + ' ' + AIR.bronchus.replace('M200,160 ', ''), class: 'b-airway' }, g);
    E('path', { d: AIR.toLung, class: 'b-airway thin' }, g);
    E('path', { d: AIR.toAnt, class: 'b-airway thin' }, g);
    E('path', { d: 'M115,240 C130,180 196,180 200,140', class: 'b-airway thin' }, g);
    E('image', { href: new URL('./art/sprites/l4-bird-lung.webp', import.meta.url).href, x: 232, y: 67, width: 216, height: 66, preserveAspectRatio: 'none' }, g);
    const lungR = E('rect', { x: 236, y: 70, width: 208, height: 60, rx: 22, class: 'b-lung' }, g);
    const parab = [84, 100, 116].map(y => E('path', { d: `M252,${y} L428,${y}`, class: 'b-parab' }, g));
    T(g, 18, 62, 'trachea', 'bs b-strong');
    T(g, 340, 62, 'lungs (parabronchi)', 'bs b-strong', MID);
    T(g, 160, 302, 'anterior air sacs', 'bs b-strong');
    T(g, 494, 302, 'posterior air sacs', 'bs b-strong', END);
    T(g, 320, 354, 'One puff of air takes two full breaths to get through', 'bs', MID);
    const badges = PHASES.map((p, i) => {
      const bg = E('g', {}, g);
      E('rect', { x: 250 + i * 96, y: 8, width: 90, height: 26, rx: 9, class: 'b-badge' }, bg);
      T(bg, 295 + i * 96, 26, p, 'bs b-strong', MID);
      return bg;
    });
    const tr = {
      in1: new Track(g, [AIR.trachea, AIR.bronchus]),
      ex1: new Track(g, [AIR.toLung, AIR.lung]),
      in2: new Track(g, AIR.toAnt),
      ex2: new Track(g, AIR.out),
    };
    const OFF = [[0, 0], [-7, -5], [7, -5], [-7, 5], [7, 5], [0, -9], [0, 9]];
    const puffA = OFF.map(() => E('circle', { r: 5, class: 'p-puff a' }, g));
    const puffB = OFF.map(() => E('circle', { r: 5, class: 'p-puff b' }, g));
    const place = (dots, track, u, op, t) => {
      const [x, y] = track.pos(u);
      const br = 1 + 0.08 * Math.sin(t * 2.2);
      dots.forEach((d, i) => { at(d, x + OFF[i][0] * br + 1.5 * Math.sin(t * 4 + i), y + OFF[i][1] * br + 1.5 * Math.cos(t * 3 + i)); show(d, op); });
    };
    fit(svg);
    return (lt, _dt, t) => {
      const ph = Math.min(3, Math.floor(lt / 4)), p0 = ph * 4;
      const inh = ph % 2 === 0;
      const k = smooth(p0 + 0.2, p0 + 3.6, lt);
      const sc = 1 + 0.08 * (inh ? k : 1 - k);
      move(sacP, 545, 255, sc); move(sacA, 110, 255, sc);
      badges.forEach((b, i) => b.classList.toggle('on', i === ph));
      flag(lungR, 'fx-glow', ph === 1 || ph === 3);
      parab.forEach(p => p.setAttribute('stroke-dashoffset', (t * 24).toFixed(1)));
      // gold puff: all four phases
      const fadeA = Math.min(smooth(0, 0.4, lt), 1 - smooth(14.8, 15.6, lt));
      place(puffA, [tr.in1, tr.ex1, tr.in2, tr.ex2][ph], k, fadeA, t);
      // pink puff: arrives on the second breath
      if (ph >= 2) place(puffB, ph === 2 ? tr.in1 : tr.ex1, k, Math.min(smooth(8, 8.4, lt), 1 - smooth(15.4, 16, lt)), t);
      else puffB.forEach(d => show(d, 0));
      return [
        'Inhale 1: the gold puff goes down the trachea, past the lungs, into the posterior air sacs',
        'Exhale 1: the posterior sacs squeeze it forward through the lungs, where gas exchange happens',
        'Inhale 2: it moves on into the anterior air sacs, while a new pink puff fills the posterior sacs',
        'Exhale 2: the anterior sacs push it out the trachea. Air always crosses the lungs in ONE direction.',
      ][ph];
    };
  },
  plain: [
    'Most land vertebrates use tidal ventilation: air goes in and out the same tubes into dead-end sacs, so some fresh and used air always mix.',
    'Birds are different. Their air sacs expand and contract like bellows and push air through the lungs in one direction, through tiny tubes called parabronchi. Fresh and used air never mix.',
    'It takes two full breaths for one puff of air to pass all the way through. The payoff: birds can deliver O₂ to their tissues at very high rates.',
  ],
  terms: [
    ['Tidal ventilation', 'Air moves in and out through the same passages. Fresh and stale air mix.'],
    ['Unidirectional (flow-through) ventilation', 'Air or water moves one way across the exchange surface. More efficient.'],
    ['Air sacs', 'Bird structures that act like bellows. No gas exchange happens in them.'],
    ['Parabronchi', 'Tiny tubes in bird lungs where gas exchange happens.'],
  ],
};

// ---------------------------------------------------------------- 5. mammal ventilation and its control

const LOBE = 'M0,-62 C30,-62 40,-20 40,20 C40,52 20,62 0,62 C-24,62 -38,52 -38,20 C-38,-20 -28,-62 0,-62z';

const mammal = {
  id: 'l4-mammal', title: 'Mammal breathing: the diaphragm, and CO₂ sets the pace', dur: 12,
  vars: { mode: 'rest' },
  reset(s) { s.vars._m = null; },
  build(svg, s, ui) {
    polish(svg);
    // painted artwork underneath (pre-scaled to cancel fit()); drawn shapes stay on top for motion and highlights
    svg.classList.add('has-art', 'art-l4-mammal');
    E('image', { href: new URL('./art/l4-mammal.jpg', import.meta.url).href, x: -20.43, y: -11.49, width: 680.85, height: 382.98, preserveAspectRatio: 'none', class: 'b-art' }, svg);
    ui.seg('mode', [['rest', 'Resting'], ['run', 'Exercising']], 'Activity');
    let now = 0;
    ui.button('Hold your breath', st => { if (st.vars._m) st.vars._m.holdUntil = now + 7; });
    const g = E('g', {}, svg);
    // chest
    E('path', { d: 'M62,92 C62,58 110,48 145,48 C180,48 228,58 228,92 L240,250 L50,250 Z', class: 'b-chest' }, g);
    E('path', { d: 'M145,14 L145,88', class: 'b-airway' }, g);
    E('path', { d: 'M145,86 L112,104 M145,86 L178,104', class: 'b-airway thin' }, g);
    T(g, 162, 30, 'trachea', 'bs b-strong');
    const lobes = [100, 190].map(x => { const lg = E('g', {}, g); E('path', { d: LOBE, class: 'b-lung' }, lg); return [lg, x]; });
    [110, 145, 180, 215].forEach(y => {
      const xl = lerp(62, 50, (y - 92) / 158), xr = lerp(228, 240, (y - 92) / 158);
      E('path', { d: `M${xl.toFixed(1)},${y} Q145,${y + 18} ${xr.toFixed(1)},${y}`, class: 'b-rib' }, g);
    });
    const dia = E('path', { class: 'b-diaphragm' }, g);
    T(g, 145, 272, 'diaphragm', 'bs b-strong red-t', MID);
    const air = Array.from({ length: 5 }, () => E('circle', { r: 4, class: 'p-puff a' }, g));
    const st1 = T(g, 20, 300, '', 'bs b-strong');
    const st2 = T(g, 20, 320, '', 'bs');
    // volume trace
    E('rect', { x: 300, y: 14, width: 326, height: 186, rx: 12, class: 'b-monitor' }, g);
    T(g, 312, 32, 'Lung volume, last 12 s', 'bs b-strong');
    const GX0 = 312, GX1 = 588, WIN = 12, gy = L => 186 - L / 6 * 146;
    E('rect', { x: GX0, y: gy(1.2), width: GX1 - GX0, height: gy(0) - gy(1.2), class: 'b-resid' }, g);
    T(g, GX0 + 6, 180, 'residual volume: always left in the lungs', 'bs');
    for (const v of [2, 4, 6]) { E('line', { x1: GX0, y1: gy(v), x2: GX1, y2: gy(v), class: 'b-grid' }, g); T(g, GX1 + 6, gy(v) + 4, `${v} L`, 'bs'); }
    const trace = E('path', { class: 'b-trace' }, g);
    // control panel
    E('rect', { x: 300, y: 212, width: 326, height: 140, rx: 12, class: 'b-monitor' }, g);
    T(g, 312, 236, 'Blood CO₂', 'bs b-strong');
    E('rect', { x: 384, y: 226, width: 150, height: 12, rx: 6, class: 'b-track' }, g);
    const co2Bar = E('rect', { x: 384, y: 226, height: 12, rx: 6, class: 'b-barfill r0' }, g);
    const co2T = T(g, 544, 236, '', 'bs b-strong');
    T(g, 312, 262, 'Medulla:', 'bs b-strong');
    const medT = T(g, 372, 262, '', 'bs');
    const rateT = T(g, 312, 290, '', 'bs');
    const tvT = T(g, 470, 290, '', 'bs');
    const mvT = T(g, 312, 318, '', 'bl b-strong');
    T(g, 312, 340, 'Low O₂ is also sensed, in the aorta and carotids', 'bs');

    fit(svg);
    return (lt, dt, t) => {
      now = t;
      if (!s.vars._m) s.vars._m = { ph: 0, c: 1, v: 0, acc: 0, holdUntil: -1, hist: [] };
      const m = s.vars._m;
      const run = s.vars.mode === 'run';
      const hold = t < m.holdUntil;
      const drive = clamp(1 + 4 * (m.c - 1), 1, 3);
      const rate = 12 + 10 * (drive - 1);
      const tv = 0.5 + 0.9 * (drive - 1);
      if (!hold) m.ph = frac(m.ph + dt * rate / 60);
      const vNew = hold ? m.v : tv * (0.5 - 0.5 * Math.cos(TAU * m.ph));
      m.acc += (vNew - m.v) * 1.4;
      m.v = vNew;
      const vent = hold ? 0 : rate * tv / 6;
      m.c = clamp(m.c + dt * ((run ? 3 : 1) - m.c * Math.sqrt(vent)) / 8, 0.8, 2.6);
      const L = 2.4 - 0.25 * (drive - 1) + m.v;
      if (dt > 0) m.hist.push([t, L]);
      while (m.hist.length && m.hist[0][0] < t - WIN) m.hist.shift();
      let d = '';
      m.hist.forEach(([ts, v], j) => { d += `${j ? 'L' : 'M'}${(GX1 - (t - ts) / WIN * (GX1 - GX0)).toFixed(1)},${gy(v).toFixed(1)}`; });
      trace.setAttribute('d', d);
      // picture
      const k = tv > 0 ? m.v / tv : 0;
      const deep = clamp((tv - 0.5) / 1.8);
      lobes.forEach(([lg, x]) => move(lg, x, 140, 0.84 + 0.06 * k + 0.12 * k * deep));
      const cy = 150 + 40 * k + 46 * k * deep;
      dia.setAttribute('d', `M50,250 Q145,${cy.toFixed(1)} 240,250`);
      air.forEach((a, i) => { at(a, 145 + 2 * Math.sin(i * 2), 20 + 64 * frac(i / 5 + m.acc)); show(a, hold ? 0.3 : 0.9); });
      const inhaling = !hold && Math.sin(TAU * m.ph) > 0;
      setText(st1, hold ? 'Holding: nothing moves' : inhaling ? 'Inhale: diaphragm contracts ↓' : 'Exhale: muscles relax, lungs recoil');
      setText(st2, hold ? 'no air in or out' : inhaling ? 'lungs below outside pressure → air in' : 'lungs above outside pressure → air out');
      // panel
      co2Bar.setAttribute('width', (150 * clamp((m.c - 0.6) / 2)).toFixed(1));
      setText(co2T, m.c > 1.6 ? 'very high' : m.c > 1.12 ? 'high' : 'normal');
      setText(medT, drive > 1.25 ? 'CO₂ up, pH down → breathe more!' : 'all calm: breathe normally');
      setText(rateT, `Breaths/min: ${rate.toFixed(0)}`);
      setText(tvT, `Tidal volume: ${tv.toFixed(1)} L`);
      setText(mvT, `Minute volume ≈ ${(rate * tv).toFixed(0)} L/min`);
      if (hold) return 'Holding your breath: no air moves, so CO₂ builds up in the blood and the pH falls…';
      if (m.holdUntil > 0 && t - m.holdUntil < 8 && drive > 1.2 && !run) return '…the medulla oblongata senses it and drives faster, deeper breaths until CO₂ is back to normal';
      if (run) return 'Exercising: muscles make more CO₂, so the medulla raises both the breathing rate and the tidal volume';
      return inhaling
        ? 'Inhale: the diaphragm contracts and flattens, the chest gets bigger and pulls the lungs open, and air is sucked in'
        : 'Exhale: the diaphragm relaxes and the stretchy lungs and chest recoil, pushing air out';
    };
  },
  plain: [
    'Air goes trachea → two bronchi → smaller bronchi → bronchioles → alveolar sacs. The walls of each sac are made of tiny pockets, the alveoli, where gas exchange happens. A surfactant coats them so they don’t stick together.',
    'Inhaling is active: the diaphragm (a sheet of muscle under the lungs) contracts, the chest cavity grows, and air is sucked in. Exhaling at rest is passive: the muscles relax and the lungs spring back.',
    'Tidal volume = air in and out per breath. Respiratory minute volume = tidal volume × breaths per minute. Exercise raises both. Some stale air (the residual volume) is always left, so each breath mixes fresh and stale air.',
    'Breathing is controlled by negative feedback, mainly by CO₂. More CO₂ → more H⁺ → lower pH, sensed in the medulla oblongata → breathe more. A drop in O₂ is sensed by chemoreceptors in the aorta and carotid arteries.',
  ],
  terms: [
    ['Tidal volume', 'Amount of air moved in and out in one breath.'],
    ['Respiratory minute volume', 'Total air breathed in and out per minute.'],
    ['Residual volume', 'Air that always stays in the lungs, which keeps them from collapsing.'],
    ['Lung surfactant', 'Coating that lowers surface tension so the exchange surfaces don’t stick together.'],
    ['Medulla oblongata', 'Brainstem region that senses CO₂ / pH and sets the breathing rhythm.'],
  ],
};

export default {
  id: 'L4', n: '4', short: 'Breathing', color: '--b-blue', chapter: 'Ch 30.1–30.3',
  title: 'Gas exchange and breathing',
  minute: [
    'Cells need O₂ for aerobic respiration and must get rid of CO₂, which makes body fluids acidic.',
    'Gases move only passively: bulk flow (air, water or blood moving) alternating with diffusion down a partial pressure gradient.',
    'Water is a tough medium: it holds much less O₂ than air at the same partial pressure (less when warm), and diffusion through it is slow.',
    'Breathing organs fold and branch for a huge surface. Gills fold out; lungs fold in. Insects use tracheae: tubes that bring air right to every cell.',
    'Fish gills: one-way water + countercurrent blood. Birds: air sacs push air one way through the lungs. Mammals: tidal breathing with dead-end alveoli.',
    'The diaphragm contracts to inhale. Minute volume = tidal volume × breaths/min. CO₂ (via pH) sensed in the medulla sets the pace.',
  ],
  traps: [
    'No active transport of O₂ or CO₂: only bulk flow and diffusion.',
    'At the same partial pressure, water holds far LESS O₂ than air, and warm water holds even less.',
    'Countercurrent in gills: water and blood flow in OPPOSITE directions. Same direction would only reach about half.',
    'Bird lungs don’t inflate like ours: the air sacs act as bellows, and air flows ONE way through the parabronchi.',
    'Inhaling is active (diaphragm contracts); quiet exhaling is passive (elastic recoil).',
    'The main breathing trigger is rising CO₂ (falling pH) sensed in the medulla, not low O₂.',
  ],
  links: [
    ['Hemoglobin loads O₂ in the lungs and unloads it in tissues → Lecture 5', 'L5'],
    ['Countercurrent flow also keeps tuna muscles warm → Lecture 5', 'L5'],
    ['The medulla oblongata is part of the brainstem → Lecture 8', 'L8'],
  ],
  scenes: [pathway, airWater, gills, bird, mammal],
  quiz: [
    { q: 'How do O₂ and CO₂ move through the body?', a: 'Only by bulk flow and diffusion', o: ['By active transport pumps', 'Only by diffusion', 'By osmosis'], why: 'There is no active transport of respiratory gases. Bulk flow of air and blood alternates with diffusion.' },
    { q: 'O₂ moves from the alveoli into the blood because…', a: 'PO₂ is higher in the alveoli (≈ 100) than in the blood arriving (≈ 40)', o: ['Hemoglobin pumps it in', 'CO₂ pushes it across', 'Blood pressure pulls it in'], why: 'Gases diffuse down their partial pressure gradient, from high to low.' },
    { q: 'At the same partial pressure, water compared to air holds…', a: 'Much less O₂', o: ['The same amount of O₂', 'More O₂', 'More O₂ when it’s warm'], why: 'O₂ is poorly soluble in water, and solubility drops further as temperature rises.' },
    { q: 'Why do sea turtle eggs die in a flooded nest?', a: 'O₂ diffuses much more slowly through water, so PO₂ around the eggs drops', o: ['The water is too cold for them', 'Water carries too much CO₂ in', 'The sand gets too heavy'], why: 'Moist sand still has air spaces. Once flooded, O₂ has to diffuse through water, which is very slow.' },
    { q: 'In a fish gill, water and blood flow…', a: 'In opposite directions (countercurrent)', o: ['In the same direction', 'Back and forth (tidal)', 'Only when the fish swims fast'], why: 'Countercurrent flow keeps a gradient along the whole lamella, so blood picks up most of the O₂.' },
    { q: 'Gills differ from lungs because gills are…', a: 'Folded outward and surrounded by water', o: ['Folded inward and filled with water', 'Not folded at all', 'Only used for CO₂ removal'], why: 'Gills are evaginated (out from the body). Lungs are invaginated (into the body) and hold the air.' },
    { q: 'How does an insect get O₂ to its cells?', a: 'Spiracles open into branching tracheae that reach every cell', o: ['Hemolymph carries O₂ on hemoglobin', 'Gills on its abdomen', 'Lungs with alveoli'], why: 'Gases are exchanged directly through the tracheal tubes, so the circulatory system plays little part.' },
    { q: 'What do a bird’s air sacs do?', a: 'Act as bellows that push air one way through the lungs', o: ['Exchange most of the gases', 'Store O₂ for diving', 'Make the bird lighter only'], why: 'The sacs expand and contract; gas exchange happens in the parabronchi of the lungs, with one-way airflow.' },
    { q: 'During inhalation in a mammal, the diaphragm…', a: 'Contracts and flattens, expanding the chest so air is sucked in', o: ['Relaxes and moves up', 'Pushes air out of the lungs', 'Doesn’t move; only the ribs do'], why: 'Contracting the diaphragm enlarges the thoracic cavity and pulls the lungs open.' },
    { q: 'What mainly makes you breathe faster?', a: 'Rising blood CO₂ (lower pH) sensed in the medulla', o: ['Falling blood CO₂', 'Rising blood O₂', 'Signals from the stomach'], why: 'More CO₂ → more H⁺ → lower pH → the medulla oblongata increases minute volume. Low O₂ is a backup signal sensed in the aorta and carotids.' },
  ],
};
