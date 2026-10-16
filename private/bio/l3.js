// Lecture 3 · Ch 28.3, 29.1 · Thermoregulation

import { E, T, Track, at, move, show, setText, smooth, keys, frac, lerp, clamp, TAU, win, arrowDefs } from './kit.js';
import { polish, fit, pill, pills, breath, scaleAbout, drift, ease, life, flag, beadify } from './fx-a.js';

const MID = { 'text-anchor': 'middle' };
const END = { 'text-anchor': 'end' };
/** 0 = cold blue, 1 = hot red */
const SPR = n => new URL(`./art/sprites/${n}.webp`, import.meta.url).href;
const sprite = (parent, n, x, y, width, height, extra = {}) => E('image', { href: SPR(n), x, y, width, height, preserveAspectRatio: 'xMidYMid meet', ...extra }, parent);
const heatCol = k => `hsl(${lerp(215, 2, clamp(k)).toFixed(0)} 75% 58%)`;

// ---------------------------------------------------------------- 1. homeotherm vs poikilotherm

const mRate = te => 30 + 1.9 * Math.max(0, 25 - te) + 3 * Math.max(0, te - 34) ** 1.3;
const pRate = tb => 3 + 8 * 2 ** ((tb - 20) / 10);

const zones = {
  id: 'l3-tnz', title: 'Homeotherm vs poikilotherm as the air changes', dur: 16,
  vars: { sun: 'shade' },
  build(svg, s, ui) {
    polish(svg);
    ui.seg('sun', [['shade', 'Lizard in the shade'], ['bask', 'Lizard basks in the sun']], 'Lizard');
    const g = E('g', {}, svg);
    // air thermometer
    T(g, 16, 26, 'Air temperature', 'bs b-strong');
    const airV = T(g, 272, 26, '', 'bl b-strong', END);
    E('rect', { x: 16, y: 36, width: 256, height: 12, rx: 6, class: 'b-track' }, g);
    const airBar = E('rect', { x: 16, y: 36, height: 12, rx: 6 }, g);

    const card = (y, art, name) => {
      E('rect', { x: 14, y, width: 260, height: 118, rx: 16, class: 'b-colbox' }, g);
      const em = sprite(g, art, 18, y + 34, 74, 60);
      T(g, 96, y + 26, name, 'bs b-strong');
      const v = T(g, 96, y + 52, '', 'bl b-strong');
      E('rect', { x: 96, y: y + 62, width: 164, height: 10, rx: 5, class: 'b-track' }, g);
      const bar = E('rect', { x: 96, y: y + 62, height: 10, rx: 5 }, g);
      const note = T(g, 96, y + 98, '', 'bs');
      return { v, bar, note, em };
    };
    const mouse = card(66, 'l3-tnz-mouse', 'Mouse (homeotherm)');
    const liz = card(196, 'l3-tnz-lizard', 'Lizard (ectotherm)');
    const sun = T(g, 256, 226, '☀️', 'b-emoji-s', MID);

    // graph: metabolic rate vs air temperature
    const GX0 = 330, GX1 = 610, GY0 = 290, GH = 220;
    const gx = te => GX0 + te / 40 * (GX1 - GX0), gy = m => GY0 - m / 100 * GH;
    const tnz = E('rect', { x: gx(25), y: GY0 - GH, width: gx(34) - gx(25), height: GH, class: 'b-tnz' }, g);
    T(g, (gx(25) + gx(34)) / 2, GY0 - GH - 6, 'thermoneutral zone', 'bs b-strong b-teal-t', MID);
    T(g, GX0, 26, 'Metabolic rate (energy used)', 'bs b-strong');
    T(g, GX0, 46, '━ mouse', 'bs b-strong red-t');
    T(g, GX0 + 74, 46, '━ lizard', 'bs b-strong b-teal-t');
    E('path', { d: `M${GX0},${GY0 - GH} L${GX0},${GY0} L${GX1 + 6},${GY0}`, class: 'b-axis' }, g);
    for (const v of [0, 10, 20, 30, 40]) T(g, gx(v), GY0 + 18, String(v), 'bs', MID);
    T(g, (GX0 + GX1) / 2, GY0 + 40, 'Air temperature (°C)', 'bs', MID);
    let dm = '', dp = '';
    for (let te = 0; te <= 40; te += 0.5) {
      dm += `${te ? 'L' : 'M'}${gx(te).toFixed(1)},${gy(mRate(te)).toFixed(1)}`;
      dp += `${te ? 'L' : 'M'}${gx(te).toFixed(1)},${gy(pRate(te)).toFixed(1)}`;
    }
    E('path', { d: dm, class: 'b-line red' }, g);
    E('path', { d: dp, class: 'b-line teal' }, g);
    const cursor = E('line', { y1: GY0, y2: GY0 - GH, class: 'b-leader' }, g);
    const dotM = E('circle', { r: 7, class: 'b-pt red' }, g);
    const dotL = E('circle', { r: 7, class: 'b-pt teal' }, g);

    fit(svg);
    return (lt, _dt, t) => {
      const te = keys(lt, [[0, 30], [1.5, 30], [6, 4], [8, 4], [12.5, 39], [14, 39], [16, 30]]);
      flag(tnz, 'on', te >= 25 && te <= 34);
      mouse.em.setAttribute('transform', `translate(0 ${(1.5 * breath(t, 2.2)).toFixed(2)})`);
      liz.em.setAttribute('transform', `translate(0 ${(1.5 * breath(t, 3.1, 1)).toFixed(2)})`);
      sun.setAttribute('transform', `rotate(${(8 * breath(t, 6)).toFixed(1)} 256 220)`);
      dotM.setAttribute('r', (7 + 0.9 * breath(t, 1.4)).toFixed(2));
      dotL.setAttribute('r', (7 + 0.9 * breath(t, 1.4, 2)).toFixed(2));
      const bask = s.vars.sun === 'bask';
      const tbM = 37;
      const tbL = bask && te < 33 ? lerp(te, 33, 0.6) : te;
      setText(airV, `${te.toFixed(0)} °C`);
      airBar.setAttribute('width', (256 * clamp(te / 45)).toFixed(1));
      airBar.style.fill = heatCol(te / 40);
      setText(mouse.v, `body ${tbM} °C`);
      mouse.bar.setAttribute('width', (164 * tbM / 45).toFixed(1));
      mouse.bar.style.fill = heatCol(tbM / 40);
      setText(mouse.note, te < 25 ? 'burns extra food for heat' : te > 34 ? 'working to cool off' : 'resting: lowest energy use');
      setText(liz.v, `body ${tbL.toFixed(0)} °C`);
      liz.bar.setAttribute('width', (164 * clamp(tbL / 45)).toFixed(1));
      liz.bar.style.fill = heatCol(tbL / 40);
      setText(liz.note, bask && te < 33 ? 'basking: warmer than air' : tbL < 15 ? 'too cold: slow, sluggish' : 'body just follows the air');
      show(sun, bask ? 1 : 0);
      cursor.setAttribute('x1', gx(te).toFixed(1)); cursor.setAttribute('x2', gx(te).toFixed(1));
      at(dotM, gx(te), gy(mRate(te)));
      at(dotL, gx(te), gy(pRate(tbL)));
      if (lt < 1.5) return 'Inside the thermoneutral zone the mouse spends the least energy, and the line is flat';
      if (lt < 8) return bask
        ? 'Cold air: the mouse burns extra food to stay at 37 °C. The lizard warms itself in the sun instead (behavioral thermoregulation).'
        : 'Cold air: the mouse burns extra food to stay at 37 °C. The lizard just cools down along with the air.';
      if (lt < 11) return 'As the air warms back up, the mouse needs less and less extra heat';
      if (lt < 14) return 'Above the zone the mouse’s metabolism rises again: cooling itself off costs energy too';
      return 'The mouse’s line sits above the lizard’s almost everywhere: homeotherms need much more food';
    };
  },
  plain: [
    'Homeotherms (mammals, birds) keep a steady body temperature. Most other animals are poikilotherms, or ectotherms: their body temperature goes up and down with the outside.',
    'The thermoneutral zone (TNZ) is the range of air temperatures where a homeotherm’s metabolism is at its lowest and doesn’t change. Colder or hotter than that, its metabolic rate climbs.',
    'An ectotherm isn’t helpless: it can move into sun or shade to steer its temperature (behavioral thermoregulation). An alligator basks on a cold January day because warm muscles, enzymes and digestion all work better.',
    'Homeotherms have higher metabolic rates than poikilotherms, especially in the cold, so they need much more food.',
  ],
  terms: [
    ['Homeostasis', 'Keeping the internal environment stable, plus the mechanisms that do it. It costs energy.'],
    ['Homeotherm', 'Animal that keeps a constant body temperature (thermoregulation), e.g. mammals and birds.'],
    ['Poikilotherm / ectotherm', 'Animal whose body temperature varies and is set by the outside temperature.'],
    ['Thermoneutral zone (TNZ)', 'Range of outside temperatures where a homeotherm’s metabolic rate is lowest and flat.'],
  ],
};

// ---------------------------------------------------------------- 2. making heat, dumping heat

const effectors = {
  id: 'l3-effectors', title: 'Making heat and dumping heat', dur: 12,
  vars: { day: 'cold' },
  build(svg, s, ui) {
    polish(svg);
    // painted artwork underneath (one per weather), kept outside fit() so it fills the stage
    svg.classList.add('has-art', 'art-l3-effectors');
    const artCold = E('image', { href: new URL('./art/l3-effectors.jpg', import.meta.url).href, x: 0, y: 0, width: 640, height: 360, preserveAspectRatio: 'none', class: 'b-art' }, svg);
    const artHot = E('image', { href: new URL('./art/l3-effectors-hot.jpg', import.meta.url).href, x: 0, y: 0, width: 640, height: 360, preserveAspectRatio: 'none', class: 'b-art' }, svg);
    ui.seg('day', [['cold', 'Cold day'], ['hot', 'Hot day']], 'Weather');
    const g = E('g', {}, svg);
    // left: snow or sun
    const flakes = Array.from({ length: 18 }, () => E('circle', { r: 3, class: 'b-flake' }, g));
    const sunG = E('g', {}, g);
    const rays = Array.from({ length: 8 }, () => E('line', { class: 'b-ray' }, sunG));
    E('circle', { cx: 44, cy: 46, r: 18, class: 'b-sun' }, sunG);
    // insulation layer
    const fur = E('path', { d: 'M150,40 C214,40 250,120 248,200 C246,282 212,316 150,316 C88,316 54,282 52,200 C50,120 86,40 150,40z', class: 'b-fur' }, g);
    // the person
    const pg = E('g', {}, g);
    sprite(pg, 'l3-effectors-person', 64, 44, 172, 258);
    const inHeat = Array.from({ length: 5 }, () => E('path', { d: 'M0,0 q4,-6 0,-12 q-4,-6 0,-12', class: 'b-heat' }, g));
    const SKIN = [[118, 130], [182, 140], [116, 170], [184, 186], [100, 170], [200, 172], [126, 92], [174, 88], [120, 204], [180, 120]];
    const sweat = SKIN.map(() => E('circle', { r: 4, class: 'p-water' }, g));
    const outHeat = SKIN.slice(0, 6).map(() => E('path', { d: 'M0,0 q4,-6 0,-12 q-4,-6 0,-12', class: 'b-heat' }, g));
    const headL = T(g, 150, 24, '', 'bl b-strong', MID);
    const footL = T(g, 150, 342, '', 'bs b-strong', MID);

    // right panel
    E('rect', { x: 316, y: 14, width: 312, height: 332, rx: 14, class: 'b-monitor' }, g);
    // cold: mitochondrion
    const mg = E('g', {}, g);
    const mTitle = T(mg, 330, 40, '', 'bs b-strong');
    E('ellipse', { cx: 472, cy: 180, rx: 140, ry: 112, class: 'b-mito' }, mg);
    T(mg, 472, 100, 'lots of H⁺ piled up here', 'bs', MID);
    E('rect', { x: 340, y: 172, width: 264, height: 16, rx: 4, class: 'b-lipid' }, mg);
    const synth = E('rect', { x: 404, y: 166, width: 30, height: 28, rx: 8, class: 'b-pump' }, mg);
    const leak = E('rect', { x: 524, y: 166, width: 24, height: 28, rx: 8, class: 'b-transporter' }, mg);
    T(mg, 419, 212, 'ATP synthase', 'bs b-strong', MID);
    T(mg, 536, 212, 'leak (uncoupled)', 'bs b-strong', MID);
    const pool = Array.from({ length: 10 }, (_, i) => ({ x: 372 + (i * 47) % 210, y: 124 + (i % 3) * 14, el: E('circle', { r: 6, class: 'p-h' }, mg) }));
    const flow = Array.from({ length: 5 }, () => E('circle', { r: 6, class: 'p-h' }, mg));
    const atps = Array.from({ length: 3 }, () => T(mg, 0, 0, 'ATP', 'bs b-atp', MID));
    const mHeat = Array.from({ length: 5 }, () => E('path', { d: 'M0,0 q4,-6 0,-12 q-4,-6 0,-12', class: 'b-heat' }, mg));
    const result = T(mg, 472, 328, '', 'bl b-strong', MID);
    // hot: skin and sweat gland
    const hg = E('g', {}, g);
    T(hg, 330, 40, 'Zoom: skin with sweat glands', 'bs b-strong');
    T(hg, 472, 66, 'water evaporates → takes heat away', 'bs b-strong b-water-t', MID);
    E('rect', { x: 330, y: 150, width: 284, height: 46, class: 'b-skin' }, hg);
    E('rect', { x: 330, y: 196, width: 284, height: 104, class: 'b-tissue-bg' }, hg);
    T(hg, 336, 178, 'skin', 'bs b-strong');
    const GL = [410, 540];
    GL.forEach(x => E('path', { d: `M${x},150 L${x},248 c-14,0 -14,12 0,12 c14,0 14,12 0,12 c-14,0 -14,12 0,12`, class: 'b-sweat' }, hg));
    T(hg, 475, 318, 'sweat glands', 'bs b-strong', MID);
    T(hg, 472, 338, 'Panting does the same from the airways', 'bs', MID);
    const drops = Array.from({ length: 8 }, () => E('circle', { r: 4.5, class: 'p-water' }, hg));
    const vHeat = Array.from({ length: 4 }, () => E('path', { d: 'M0,0 q4,-6 0,-12 q-4,-6 0,-12', class: 'b-heat' }, hg));

    const wrap = fit(svg);
    svg.insertBefore(artCold, wrap); svg.insertBefore(artHot, wrap);
    return (lt, _dt, t) => {
      const cold = s.vars.day === 'cold';
      show(mg, cold ? 1 : 0); show(hg, cold ? 0 : 1);
      show(artCold, cold ? 1 : 0); show(artHot, cold ? 0 : 1);
      flakes.forEach((f, i) => {
        at(f, 20 + (i * 53) % 270 + 8 * Math.sin(t * 0.9 + i * 1.7), 10 + frac(t * (0.1 + (i % 4) * 0.012) + i * 0.137) * 340);
        f.setAttribute('r', (2.2 + (i % 3) * 0.8).toFixed(1));
        show(f, cold ? 0.9 : 0);
      });
      show(sunG, cold ? 0 : 1);
      rays.forEach((r, i) => {
        const a = i / 8 * TAU + t * 0.4, r0 = 24, r1 = 31 + 3 * Math.sin(t * 3 + i);
        r.setAttribute('x1', (44 + Math.cos(a) * r0).toFixed(1)); r.setAttribute('y1', (46 + Math.sin(a) * r0).toFixed(1));
        r.setAttribute('x2', (44 + Math.cos(a) * r1).toFixed(1)); r.setAttribute('y2', (46 + Math.sin(a) * r1).toFixed(1));
      });
      // shivering
      const jx = cold ? 1.2 * Math.sin(t * 60) * (0.6 + 0.4 * Math.sin(t * 3)) : 0;
      const br = 1 + 0.01 * breath(t, 3.6);
      pg.setAttribute('transform', `translate(${(jx + 150 * (1 - br)).toFixed(2)} ${(200 * (1 - br)).toFixed(2)}) scale(${br.toFixed(4)})`);
      show(fur, cold ? 0.4 + 0.6 * smooth(9.5, 10.5, lt) : 0);
      inHeat.forEach((h, i) => {
        const k = frac(t * 0.5 + i / 5);
        h.setAttribute('transform', `translate(${130 + i * 10} ${200 - k * 80})`);
        show(h, cold ? Math.sin(Math.PI * k) : 0);
      });
      sweat.forEach((d, i) => {
        const k = frac(t * 0.35 + i * 0.31);
        const [x, y] = SKIN[i];
        const out = x < 150 ? -1 : 1;
        at(d, x + out * 30 * smooth(0.45, 1, k), y - 40 * smooth(0.45, 1, k));
        show(d, cold ? 0 : smooth(0, 0.15, k) * (1 - smooth(0.5, 1, k)));
      });
      outHeat.forEach((h, i) => {
        const k = frac(t * 0.35 + i * 0.31 - 0.1);
        const [x, y] = SKIN[i];
        const out = x < 150 ? -1 : 1;
        h.setAttribute('transform', `translate(${(x + out * (10 + 40 * k)).toFixed(1)} ${(y - 10 - 30 * k).toFixed(1)})`);
        show(h, cold ? 0 : Math.sin(Math.PI * k) * smooth(0.3, 0.5, k + 0.3));
      });
      setText(headL, cold ? 'Brrr: shivering' : 'Sweating');
      setText(footL, cold ? 'insulation: fur, feathers, fat' : 'sweat evaporating cools the skin');

      if (cold) {
        const brown = lt >= 6;
        setText(mTitle, brown ? 'Zoom: a mitochondrion in brown fat' : 'Zoom: an ordinary mitochondrion');
        synth.classList.toggle('busy', !brown);
        leak.classList.toggle('busy', brown);
        pool.forEach((p, i) => at(p.el, p.x + 4 * Math.sin(t * 2 + i), p.y + 3 * Math.cos(t * 2.4 + i)));
        const cx = brown ? 536 : 419;
        flow.forEach((f, i) => {
          const u = frac(t * 0.45 + i / 5);
          const sx = 380 + (i * 61) % 190;
          const p = keys(u, [[0, [sx, 140]], [0.5, [cx, 160]], [0.85, [cx, 196]], [1, [cx, 202]]]);
          at(f, p[0], p[1]);
          show(f, smooth(0, 0.1, u) * (1 - smooth(0.8, 0.95, u)));
        });
        atps.forEach((a, i) => {
          const u = frac(t * 0.45 + i / 3);
          a.setAttribute('x', 395 + i * 24); a.setAttribute('y', (240 + u * 34).toFixed(1));
          show(a, brown ? 0 : Math.sin(Math.PI * u));
        });
        mHeat.forEach((h, i) => {
          const u = frac(t * 0.5 + i / 5);
          h.setAttribute('transform', `translate(${510 + i * 13} ${(276 - u * 34).toFixed(1)})`);
          show(h, brown ? Math.sin(Math.PI * u) : 0);
        });
        setText(result, brown ? 'energy → HEAT (no ATP made)' : 'energy → stored as ATP');
        result.classList.toggle('b-gold-t', brown);
        if (lt < 3) return 'Cold: skeletal muscles shiver. Burning through ATP that fast releases heat.';
        if (lt < 6) return 'In an ordinary mitochondrion, H⁺ flows back through ATP synthase and the energy is saved as ATP';
        if (lt < 10) return 'Brown fat is “uncoupled”: H⁺ leaks back without making ATP, so the energy comes out as heat (nonshivering thermogenesis)';
        return 'Fur, feathers and fat (insulation) slow down how fast that heat escapes';
      }
      drops.forEach((d, i) => {
        const u = frac(t * 0.3 + i / 8);
        const x = GL[i % 2] + (i % 4 < 2 ? -1 : 1) * (u > 0.5 ? 14 * smooth(0.5, 1, u) : 0);
        const y = u < 0.4 ? lerp(272, 152, u / 0.4) : u < 0.5 ? 146 : lerp(146, 76, smooth(0.5, 1, u));
        at(d, x, y);
        show(d, Math.min(smooth(0, 0.05, u), 1 - 0.85 * smooth(0.5, 1, u)));
      });
      vHeat.forEach((h, i) => {
        const u = frac(t * 0.3 + i / 4 + 0.6);
        h.setAttribute('transform', `translate(${GL[i % 2] + (i < 2 ? -24 : 24)} ${(144 - u * 56).toFixed(1)})`);
        show(h, Math.sin(Math.PI * u));
      });
      if (lt < 4) return 'Hot: sweat glands push water out onto the skin';
      if (lt < 8) return 'Turning liquid water into gas soaks up a lot of heat, so evaporation pulls heat out of the body';
      return 'Panting works the same way: water evaporates from the mouth and airways';
    };
  },
  plain: [
    'To make more heat in the cold, homeotherms raise their metabolic rate. Shivering: skeletal muscles contract and the energy in ATP turns into heat.',
    'Nonshivering thermogenesis: most mammals have brown fat (brown adipose tissue). Its mitochondria are “uncoupled”: the H⁺ gradient isn’t used to make ATP, so the energy is released as heat instead.',
    'To keep heat in: insulation (fur, feathers) and special blood flow patterns, like the countercurrent exchange in scene 4.',
    'To lose heat when it’s hot: evaporative cooling. Water needs a lot of heat energy to change from liquid to gas, so sweating and panting carry heat away.',
  ],
  terms: [
    ['Shivering', 'Muscle contractions whose energy ends up as heat.'],
    ['Brown adipose tissue', 'Brown fat. Oxidative phosphorylation is uncoupled from ATP making, so it produces heat.'],
    ['Nonshivering thermogenesis', 'Making heat without shivering, mainly in brown fat.'],
    ['Evaporative cooling', 'Water absorbs heat as it evaporates (sweating, panting).'],
  ],
};

// ---------------------------------------------------------------- 3. the thermostat: negative feedback

const pulse4 = x => (x >= 0 && x < 4 ? Math.sin(Math.PI * x / 4) : 0);

const loop = {
  id: 'l3-loop', title: 'The body’s thermostat: a negative feedback loop', dur: 16,
  vars: { fb: 'neg' },
  reset(s) { s.vars._T = null; s.vars._h = null; },
  onVar(key, _v, s) { if (key === 'fb') { s.vars._T = 37; s.vars._h = []; } },
  build(svg, s, ui) {
    polish(svg);
    ui.seg('fb', [['neg', 'Negative feedback'], ['pos', 'Positive feedback']], 'Feedback');
    let now = 0, coldAt = -99, hotAt = -99, lastLt = 0;
    ui.button('❄ Cold snap', () => { coldAt = now; });
    ui.button('☀ Heat wave', () => { hotAt = now; });
    const g = E('g', {}, svg);
    const head = arrowDefs(svg, 'b-m-l3loop', 'b-head gold');
    const BW = 150, BH = 58;
    const box = (x, y, title) => {
      const r = E('rect', { x, y, width: BW, height: BH, rx: 14, class: 'b-node-box' }, g);
      T(g, x + BW / 2, y + 24, title, 'bs b-strong', MID);
      const sub = T(g, x + BW / 2, y + 44, '', 'bs', MID);
      return { r, sub };
    };
    const bT = box(14, 232, '① Body temperature');
    const bS = box(14, 28, '② Sensors');
    const bH = box(210, 28, '③ Hypothalamus');
    const bE = box(210, 232, '④ Effectors');
    setText(bT.sub, '(controlled variable)');
    setText(bS.sub, 'temperature receptors');
    setText(bH.sub, 'set point 37 °C');
    const P = ['M89,232 L89,92', 'M164,57 L206,57', 'M285,86 L285,228', 'M210,261 L168,261'];
    P.forEach(d => E('path', { d, class: 'b-link lit', 'marker-end': head }, g));
    const track = new Track(g, P);
    const spark = E('circle', { r: 5, class: 'b-spark' }, g);
    const tempV = T(g, 187, 150, '', 'bl b-strong', MID);
    const state = T(g, 187, 172, '', 'bs b-strong', MID);
    const outside = T(g, 14, 318, '', 'bs b-strong');
    const fbNote = T(g, 14, 338, '', 'bs');

    // graph
    const GX0 = 392, GX1 = 614, WIN = 10;
    const gy = v => 300 - (clamp(v, 33, 41) - 33) / 8 * 240;
    E('rect', { x: 380, y: 14, width: 246, height: 332, rx: 14, class: 'b-monitor' }, g);
    T(g, GX0, 38, 'Body temperature, last 10 s', 'bs b-strong');
    for (const v of [35, 37, 39]) {
      E('line', { x1: GX0, y1: gy(v), x2: GX1, y2: gy(v), class: 'b-grid' }, g);
      if (v !== 37) T(g, GX0 + 2, gy(v) - 4, `${v} °C`, 'bs');
    }
    E('line', { x1: GX0, y1: gy(37), x2: GX1, y2: gy(37), class: 'b-threshold' }, g);
    T(g, GX1, gy(37) - 6, 'set point 37 °C', 'bs b-strong b-gold-t', END);
    T(g, GX1, 322, 'now', 'bs', END);
    T(g, GX0, 322, '10 s ago', 'bs');
    const trace = E('path', { class: 'b-trace' }, g);
    let sp = 0;

    fit(svg);
    return (lt, dt, t) => {
      now = t;
      const neg = s.vars.fb === 'neg';
      if (typeof s.vars._T !== 'number') s.vars._T = 37;
      if (!Array.isArray(s.vars._h)) s.vars._h = [];
      const hist = s.vars._h;
      // auto events each loop
      if (dt > 0 && lt < lastLt) { if (!neg) { s.vars._T = 37; hist.length = 0; } }
      if (dt > 0 && lt >= 1 && lastLt < 1) coldAt = t;
      if (dt > 0 && lt >= 9 && lastLt < 9) hotAt = t;
      lastLt = lt;
      const push = 2.4 * (pulse4(t - hotAt) - pulse4(t - coldAt));
      let T0 = s.vars._T, u = 0;
      const sub = 4, h = dt / sub;
      for (let k = 0; k < sub; k++) {
        u = neg ? clamp(-2.2 * (T0 - 37), -2.6, 2.6) : clamp(1.2 * (T0 - 37), -3, 3);
        T0 = clamp(T0 + h * (push + u), 33, 41);
      }
      if (dt === 0) u = neg ? clamp(-2.2 * (T0 - 37), -2.6, 2.6) : clamp(1.2 * (T0 - 37), -3, 3);
      s.vars._T = T0;
      if (dt > 0) hist.push([t, T0]);
      while (hist.length && hist[0][0] < t - WIN) hist.shift();
      let d = '';
      hist.forEach(([ts, v], j) => { d += `${j ? 'L' : 'M'}${(GX1 - (t - ts) / WIN * (GX1 - GX0)).toFixed(1)},${gy(v).toFixed(1)}`; });
      trace.setAttribute('d', d);

      const err = T0 - 37, off = Math.abs(err) > 0.15;
      setText(tempV, `${T0.toFixed(1)} °C`);
      tempV.style.fill = heatCol((T0 - 33) / 8);
      setText(state, !off ? 'just right' : err < 0 ? 'too cold' : 'too hot');
      const heating = u > 0.3, cooling = u < -0.3;
      setText(bE.sub, heating ? 'shivering + brown fat' : cooling ? 'sweating + panting' : 'resting');
      bE.r.setAttribute('class', `b-node-box${heating ? ' warn lit' : cooling ? ' fx lit' : ''}`);
      bS.r.classList.toggle('lit', off); bH.r.classList.toggle('lit', off);
      bT.r.setAttribute('class', `b-node-box${off ? (err < 0 ? ' fx lit' : ' warn lit') : ''}`);
      sp = frac(sp + dt * (0.12 + 0.5 * Math.min(2, Math.abs(err))));
      const [x, y] = track.pos(sp); at(spark, x, y);
      setText(outside, push < -0.3 ? 'Outside: ❄ cold snap' : push > 0.3 ? 'Outside: ☀ heat wave' : 'Outside: mild');
      setText(fbNote, neg ? 'response OPPOSES the change' : 'response ADDS to the change');

      if (!neg) {
        if (Math.abs(err) > 2.5) return 'Positive feedback runs away: each change makes the next one bigger. That’s the opposite of homeostasis.';
        if (Math.abs(push) > 0.3) return 'Positive feedback: the effectors push the SAME way as the change…';
        return 'With positive feedback a small push keeps growing. Tap a button to see it.';
      }
      if (push < -0.3) return 'Cold snap: sensors detect the drop, and the hypothalamus switches on shivering and brown fat';
      if (push > 0.3) return 'Heat wave: sensors detect the rise, and the hypothalamus switches on sweating and panting';
      if (off) return 'The effectors push the temperature back toward the set point: negative feedback';
      return 'Back at the 37 °C set point, so the effectors switch off. Try the buttons!';
    };
  },
  plain: [
    'Negative feedback brings a variable back into its normal range. It has 4 parts: ① the controlled variable (body temperature), ② sensors (temperature receptors in skin and brain), ③ the control mechanism (nerve cells of the hypothalamus) and ④ effectors (e.g. shivering muscles).',
    'The hypothalamus compares the real temperature with its set point. Too cold → heat-making effectors. Too hot → heat-losing effectors. The response always opposes the change.',
    'Positive feedback amplifies a change instead. It pushes the system away from homeostasis, so it’s only useful when something ends it. Childbirth: the cervix stretches → oxytocin → stronger contractions → more stretch → more oxytocin… until the baby is born.',
  ],
  terms: [
    ['Set point', 'The target value the control center tries to hold (about 37 °C for us).'],
    ['Sensor', 'Detects the current level, e.g. temperature receptors.'],
    ['Effector', 'Tissue or organ that changes the variable, e.g. muscles, sweat glands, brown fat.'],
    ['Positive feedback', 'The response amplifies the change. Example: oxytocin in childbirth.'],
  ],
};

// ---------------------------------------------------------------- 4. countercurrent exchange in the arctic fox leg

const fox = {
  id: 'l3-fox', title: 'Countercurrent heat exchange in an Arctic fox’s leg', dur: 10,
  vars: { cc: 'on' },
  build(svg, s, ui) {
    polish(svg);
    svg.classList.add('has-art', 'art-l3-fox');
    E('image', { href: new URL('./art/l3-fox.jpg', import.meta.url).href, x: 0, y: 0, width: 640, height: 360, preserveAspectRatio: 'none', class: 'b-art' }, svg);
    ui.seg('cc', [['on', 'Artery and vein side by side'], ['off', 'Vein far from the artery']], 'Layout');
    const g = E('g', {}, svg);
    E('rect', { x: 0, y: 326, width: 640, height: 34, class: 'b-snow' }, g);
    T(g, 626, 348, 'snow', 'bs b-strong', END);
    E('rect', { x: 120, y: 16, width: 260, height: 76, rx: 22, class: 'b-muscle-bg' }, g);
    T(g, 250, 48, 'warm body core', 'bl b-strong', MID);
    T(g, 250, 70, 'about 38 °C', 'bs', MID);
    sprite(g, 'l3-fox-fox', 6, 6, 108, 108);
    sprite(g, 'l3-fox-leg', 204, 86, 152, 250, { preserveAspectRatio: 'none' });
    T(g, 212, 320, 'paw', 'bs b-strong', END);
    const A = 'M250,92 L250,292';
    const on = ['M250,292 C250,312 278,312 278,292', 'M278,292 L278,92'];
    const off = ['M250,292 C250,318 318,318 318,292', 'M318,292 L318,92'];
    E('path', { d: A, class: 'b-pipe red' }, g);
    const pOn = on.map(d => E('path', { d, class: 'b-pipe blue' }, g));
    const pOff = off.map(d => E('path', { d, class: 'b-pipe blue' }, g));
    const trOn = new Track(g, [A, ...on]), trOff = new Track(g, [A, ...off]);
    T(g, 206, 150, 'artery: warm blood ↓', 'bs b-strong red-t', END);
    const xLabel = T(g, 206, 194, 'heat crosses over →', 'bs b-strong b-gold-t', END);
    T(g, 206, 238, 'vein: back up ↑', 'bs b-strong blue-t', END);
    const xHeat = Array.from({ length: 8 }, () => E('path', { d: 'M0,0 q3,-4 6,0 q3,4 6,0', class: 'b-heat' }, g));
    const loss = Array.from({ length: 6 }, () => E('path', { d: 'M0,0 q-4,4 0,8 q4,4 0,8', class: 'b-heat' }, g));
    const cells = beadify(Array.from({ length: 16 }, () => E('circle', { r: 6.5 }, g)));
    // panel
    E('rect', { x: 404, y: 110, width: 224, height: 206, rx: 14, class: 'b-monitor' }, g);
    T(g, 418, 136, 'Blood reaching the paw', 'bs');
    const vPaw = T(g, 418, 160, '', 'bl b-strong');
    T(g, 418, 192, 'Blood returning to the core', 'bs');
    const vCore = T(g, 418, 216, '', 'bl b-strong');
    T(g, 418, 248, 'Heat lost to the snow', 'bs');
    E('rect', { x: 418, y: 258, width: 196, height: 14, rx: 7, class: 'b-track' }, g);
    const lossBar = E('rect', { x: 418, y: 258, height: 14, rx: 7, class: 'b-barfill r0' }, g);
    const note = T(g, 418, 298, '', 'bs b-strong');
    let m = 1;

    return (lt, dt, t) => {
      const isOn = s.vars.cc === 'on';
      m += ((isOn ? 1 : 0) - m) * (dt > 0 ? Math.min(1, dt * 2.5) : 1);
      pOn.forEach(p => show(p, isOn ? 1 : 0)); pOff.forEach(p => show(p, isOn ? 0 : 1));
      const tr = isOn ? trOn : trOff;
      cells.forEach((c, i) => {
        const u = frac(t * 0.09 + i / 16);
        const [x, y] = tr.pos(u);
        const [seg, k] = tr.seg(u);
        const kOn = seg === 0 ? lerp(1, 0.07, k) : seg === 1 ? 0.05 : lerp(0.07, 0.92, k);
        const kOff = seg === 0 ? lerp(1, 0.9, k) : seg === 1 ? lerp(0.9, 0.32, k) : lerp(0.32, 0.3, k);
        at(c, x, y);
        c.style.fill = heatCol(lerp(kOff, kOn, m));
      });
      xHeat.forEach((h, i) => {
        const k = frac(t * 0.8 + i * 0.37);
        h.setAttribute('transform', `translate(${(253 + 8 * k).toFixed(1)} ${110 + i * 23})`);
        show(h, m * Math.sin(Math.PI * k));
      });
      show(xLabel, m);
      loss.forEach((h, i) => {
        const k = frac(t * 0.6 + i / 6);
        h.setAttribute('transform', `translate(${246 + i * 15} ${(322 + 14 * k).toFixed(1)})`);
        show(h, (1 - m) * Math.sin(Math.PI * k));
      });
      const paw = lerp(34, 2, m), core = lerp(11, 35, m), lossK = lerp(0.9, 0.18, m);
      setText(vPaw, `${paw.toFixed(0)} °C`); vPaw.style.fill = heatCol(paw / 38);
      setText(vCore, `${core.toFixed(0)} °C`); vCore.style.fill = heatCol(core / 38);
      lossBar.setAttribute('width', (196 * lossK).toFixed(1));
      setText(note, isOn ? 'paw stays just above 0 °C' : 'lots of body heat wasted');
      if (isOn) return lt < 5
        ? 'Warm blood going down the artery hands its heat to the cold blood coming up the vein right beside it…'
        : '…so the heat goes back to the core, and the paw gets blood that is just above freezing';
      return lt < 5
        ? 'With the vein far away, warm blood reaches the paw and its heat drains into the snow…'
        : '…and cold blood flows back and chills the core. A lot of heat is wasted.';
    };
  },
  plain: [
    'Regional hypothermia: an animal lets its legs and feet run much cooler than its core. Reindeer do this in winter, and so does the Arctic fox.',
    'The trick is countercurrent heat exchange. The artery and vein in the leg run side by side in opposite directions, so heat jumps from the outgoing warm blood to the returning cold blood and stays in the body.',
    'The fox meters just enough heat to its foot pads to keep them near, but never below, freezing. The pads are too cold to melt the snow, so the feet stay dry.',
  ],
  terms: [
    ['Regional hypothermia', 'Letting appendages (legs, feet) be much cooler than the core.'],
    ['Countercurrent heat exchange', 'Warm and cold blood flow past each other in opposite directions, so heat passes across along the whole length.'],
  ],
};

// ---------------------------------------------------------------- 5. a desert day: small vs large animals

const gazTemp = lt => keys(lt, [[0, 39], [2, 40.5], [5, 46], [7, 45.6], [9.5, 41], [12, 39], [16, 39]]);
const brainTemp = lt => { const c = gazTemp(lt); return c - 3 * (c - 39) / 7; };
const clock = lt => {
  const h = Math.floor((6 + lt * 1.5) % 24);
  return h === 0 ? 'midnight' : h === 12 ? 'noon' : `${h % 12} ${h < 12 ? 'am' : 'pm'}`;
};

const desert = {
  id: 'l3-desert', title: 'A day in the desert: hide or tolerate', dur: 16,
  build(svg) {
    polish(svg);
    svg.classList.add('has-art', 'art-l3-desert');
    E('image', { href: new URL('./art/l3-desert.jpg', import.meta.url).href, x: 0, y: 0, width: 640, height: 360, preserveAspectRatio: 'none', class: 'b-art' }, svg);
    const g = E('g', {}, svg);
    E('rect', { x: 0, y: 0, width: 640, height: 200, class: 'b-skybg' }, g);
    // the tints stop at the painted sand line, like the drawn sand strip used to cover them
    const dusk = E('rect', { x: 0, y: 0, width: 640, height: 193, class: 'fx-dusk' }, g);
    const night = E('rect', { x: 0, y: 0, width: 640, height: 193, class: 'b-night' }, g);
    const stars = Array.from({ length: 14 }, (_, i) => E('circle', { cx: 30 + (i * 167) % 590, cy: 18 + (i * 61) % 120, r: i % 3 ? 1.1 : 1.6, class: 'fx-star' }, g));
    const halo = E('circle', { r: 34, class: 'fx-sunhalo' }, g);
    const sun = E('circle', { r: 16, class: 'b-sun' }, g);
    const moon = E('circle', { r: 12, class: 'b-moon' }, g);
    E('rect', { x: 0, y: 200, width: 640, height: 160, class: 'b-soil' }, g);
    E('rect', { x: 0, y: 194, width: 640, height: 10, class: 'b-sand' }, g);
    const tun = 'M210,200 C210,236 130,232 128,272 C126,294 150,302 176,302';
    E('path', { d: tun, class: 'b-burrow' }, g);
    E('ellipse', { cx: 184, cy: 302, rx: 56, ry: 24, class: 'b-burrow-fill' }, g);
    T(g, 184, 346, 'cool burrow (microenvironment)', 'bs b-strong', MID);
    const tr = new Track(g, `M210,188 L210,200 ${tun.slice(9)}`);
    const rat = E('g', {}, g);
    sprite(rat, 'l3-desert-krat', -30, -15, 60, 30);
    const ratL = T(rat, 0, -18, 'kangaroo rat', 'bs b-strong', MID);
    sprite(g, 'l3-desert-gazelle', 420, 104, 100, 92);
    T(g, 470, 78, 'Grant’s gazelle', 'bs b-strong', MID);
    const gzV = T(g, 470, 96, '', 'bs b-strong', MID);
    const clk = T(g, 14, 26, '', 'bl b-strong');
    // graph
    E('rect', { x: 330, y: 212, width: 298, height: 140, rx: 12, class: 'b-monitor' }, g);
    T(g, 342, 230, 'Gazelle body temperature over one day', 'bs b-strong');
    const GX0 = 350, GX1 = 604, gx = lt => GX0 + lt / 16 * (GX1 - GX0), gy = v => 340 - (v - 37) * 10;
    E('line', { x1: GX0, y1: gy(46), x2: GX1, y2: gy(46), class: 'b-threshold' }, g);
    T(g, GX0 + 2, gy(46) - 4, '46 °C', 'bs b-strong b-gold-t');
    const core = E('path', { class: 'b-line red' }, g);
    const brain = E('path', { class: 'b-line teal dash' }, g);
    const cur = E('line', { y1: 236, y2: 336, class: 'b-leader' }, g);
    T(g, GX0, 346, '━ core', 'bs b-strong red-t');
    T(g, GX0 + 62, 346, '┅ brain (kept cooler)', 'bs b-strong b-teal-t');

    return (lt, _dt, t) => {
      const day = lt < 8 ? clamp(Math.sin(Math.PI * lt / 8) * 2) : 0;
      show(night, 0.6 * (1 - day));
      const su = lt / 8;
      at(sun, lerp(40, 600, su), 175 - 150 * Math.sin(Math.PI * clamp(su)));
      show(sun, lt < 8 ? 1 : 0);
      at(halo, lerp(40, 600, su), 175 - 150 * Math.sin(Math.PI * clamp(su)));
      halo.setAttribute('r', (34 + 4 * breath(t, 3)).toFixed(1));
      show(halo, lt < 8 ? 0.9 : 0);
      show(dusk, lt < 8 ? 0.8 * Math.max(smooth(0, 0.6, 1.6 - lt) , smooth(5.6, 7.8, lt)) : 0);
      stars.forEach((st, i) => show(st, (1 - day) * (lt >= 8 ? 1 : 0.5) * (0.55 + 0.45 * Math.sin(t * 1.7 + i * 2.3))));
      const mu = (lt - 8) / 8;
      at(moon, lerp(40, 600, mu), 160 - 120 * Math.sin(Math.PI * clamp(mu)));
      show(moon, lt >= 8 ? 1 : 0);
      setText(clk, clock(lt));
      // kangaroo rat: out at night, in the burrow by day
      const b = keys(lt, [[0, 0], [1.4, 1], [8.4, 1], [9.8, 0], [16, 0]]);
      const [x, y] = tr.pos(b);
      const wander = (1 - smooth(0, 0.12, b)) * 70 * Math.sin(t * 0.8);
      move(rat, x + wander, y - Math.abs(Math.sin(t * 6)) * 3 * (1 - smooth(0, 0.12, b)));
      show(ratL, 1);
      // gazelle
      const c = gazTemp(lt);
      setText(gzV, `core ${c.toFixed(1)} °C`);
      gzV.style.fill = `hsl(${lerp(30, 2, clamp((c - 39) / 7)).toFixed(0)} 80% 50%)`;
      let dc = '', db = '';
      for (let k = 0; k <= lt + 0.001; k += 0.2) {
        dc += `${k ? 'L' : 'M'}${gx(k).toFixed(1)},${gy(gazTemp(k)).toFixed(1)}`;
        db += `${k ? 'L' : 'M'}${gx(k).toFixed(1)},${gy(brainTemp(k)).toFixed(1)}`;
      }
      core.setAttribute('d', dc); brain.setAttribute('d', db);
      cur.setAttribute('x1', gx(lt).toFixed(1)); cur.setAttribute('x2', gx(lt).toFixed(1));
      if (lt < 1.4) return 'Sunrise: the small kangaroo rat heads down into its cool burrow (a protective microenvironment)';
      if (lt < 5) return 'Midday heat: the big gazelle can’t hide, so it lets its core temperature climb toward 46 °C';
      if (lt < 8) return 'Because it doesn’t sweat to stay cool, it saves a lot of water. A countercurrent system keeps its brain cooler.';
      if (lt < 9.8) return 'Evening: the kangaroo rat comes out. It’s nocturnal.';
      return 'Night: the air cools, and the gazelle’s temperature drifts back down';
    };
  },
  plain: [
    'Animals are adapted to the environments they live in. A microhabitat (microenvironment) is a spot within a habitat with different conditions from the rest, with its own microclimate: a burrow, under a rock, in the shade.',
    'Small animals mostly use behavior. They have a large surface area for their volume (so they heat up and cool down fast) and a high metabolic rate, but they can easily slip into a microenvironment. Kangaroo rats are nocturnal and stay in burrows all day.',
    'Large animals have fewer places to hide, so they rely more on physiology. Grant’s gazelle lets its core temperature rise to about 46 °C instead of sweating, which saves water, and a countercurrent system keeps its brain cooler.',
    'Hot deserts have two problems at once: high temperatures and too little water.',
  ],
  terms: [
    ['Microhabitat / microenvironment', 'A place within a habitat that differs from the habitat at large.'],
    ['Microclimate', 'The climate conditions inside a microenvironment.'],
    ['Surface area to volume ratio', 'Small bodies have more surface per unit of volume, so they gain and lose heat faster.'],
  ],
};

export default {
  id: 'L3', n: '3', short: 'Temperature', color: '--b-acid', chapter: 'Ch 28.3, 29.1',
  title: 'Animals and temperature: thermoregulation',
  minute: [
    'Homeostasis = keeping the inside of the body stable. It costs energy.',
    'Homeotherms (mammals, birds) hold a constant body temperature. Poikilotherms (ectotherms) let it follow the outside, but can bask or hide in the shade.',
    'In the thermoneutral zone a homeotherm’s metabolic rate is lowest. Colder or hotter, it rises. Homeotherms need more food.',
    'Make heat: shivering and brown fat (uncoupled mitochondria). Keep heat: fur, feathers, countercurrent blood flow. Lose heat: sweating and panting.',
    'Temperature is held by negative feedback: sensors → hypothalamus (set point) → effectors, always opposing the change. Positive feedback (childbirth) amplifies it instead.',
    'Small animals mostly use behavior (burrows, night activity). Large animals rely on physiology (regional hypothermia, tolerating a hot core).',
  ],
  traps: [
    'Homeotherm metabolism is LOWEST and flat inside the thermoneutral zone. It rises both below AND above it.',
    'Brown fat makes heat because its mitochondria do NOT make ATP (uncoupled).',
    'The hypothalamus is the control center, not a sensor. Sensors are temperature receptors in the skin and brain.',
    'Negative feedback opposes the change. Positive feedback amplifies it (childbirth, oxytocin).',
    'Countercurrent exchange keeps heat in the CORE; the paw is allowed to get cold (but not freeze).',
    'Small animals have a LARGER surface area to volume ratio, so they lose heat faster and use behavior more.',
  ],
  links: [
    ['The same countercurrent trick keeps tuna muscles warm → Lecture 5', 'L5'],
    ['Thyroid hormones raise metabolism and heat; hormone axes use negative feedback too → Lecture 9', 'L9'],
    ['The hypothalamus is part of the brain → Lecture 8', 'L8'],
  ],
  scenes: [zones, effectors, loop, fox, desert],
  quiz: [
    { q: 'What is the thermoneutral zone?', a: 'The range of outside temperatures where a homeotherm’s metabolic rate is lowest and flat', o: ['The temperature at which proteins start to break down', 'The range where an ectotherm can’t move', 'The body temperature set point in the hypothalamus'], why: 'Inside the TNZ a homeotherm doesn’t need extra energy to heat or cool itself. Outside it, metabolic rate rises.' },
    { q: 'An alligator lies in the sun on a cold January morning. This is…', a: 'Behavioral thermoregulation', o: ['Nonshivering thermogenesis', 'Evaporative cooling', 'Regional hypothermia'], why: 'Ectotherms steer their body temperature by choosing sun or shade. Warm muscles, enzymes and digestion work better.' },
    { q: 'Why do homeotherms need more food than poikilotherms of the same size?', a: 'Their metabolic rates are higher, especially in the cold', o: ['They have smaller surface area to volume ratios', 'They can’t store fat', 'They digest food less completely'], why: 'Keeping a constant warm body temperature burns a lot of energy.' },
    { q: 'How does brown fat produce heat?', a: 'Its mitochondria are uncoupled, so energy goes to heat instead of ATP', o: ['Its muscle fibres contract quickly', 'It traps heat like insulation', 'It makes extra ATP that is then burned'], why: 'In brown adipose tissue, oxidative phosphorylation is uncoupled from ATP production. That’s nonshivering thermogenesis.' },
    { q: 'Why does sweating cool you down?', a: 'Water absorbs a lot of heat as it changes from liquid to gas', o: ['Sweat is colder than the skin', 'It reflects sunlight', 'It narrows blood vessels in the skin'], why: 'Evaporation pulls heat energy away from the skin. Panting uses the same trick.' },
    { q: 'In the temperature feedback loop, the hypothalamus is the…', a: 'Control mechanism', o: ['Sensor', 'Effector', 'Controlled variable'], why: 'Receptors in skin and brain sense; the hypothalamus decides; muscles, sweat glands and brown fat are the effectors.' },
    { q: 'Which is an example of positive feedback?', a: 'Oxytocin making uterine contractions stronger during childbirth', o: ['Shivering when body temperature falls', 'Sweating when body temperature rises', 'Cortisol switching off ACTH release'], why: 'Stretch → oxytocin → stronger contractions → more stretch… The change is amplified until birth ends it.' },
    { q: 'What does countercurrent heat exchange in an Arctic fox’s leg do?', a: 'Keeps most heat in the core while the paws stay just above freezing', o: ['Keeps the paws as warm as the core', 'Lets the paws freeze to save energy', 'Melts the snow under the paws for traction'], why: 'Warm arterial blood passes its heat to the cold venous blood returning, so the heat goes back to the body.' },
    { q: 'Compared with a large animal, a small animal has…', a: 'A larger surface area to volume ratio, so it gains and loses heat faster', o: ['A smaller surface area to volume ratio', 'A lower metabolic rate per gram', 'Fewer microenvironments it can use'], why: 'Small bodies have lots of surface for their volume. That’s why they rely on behavior like hiding in burrows.' },
    { q: 'How does Grant’s gazelle cope with the desert heat?', a: 'It lets its core temperature rise to about 46 °C instead of sweating', o: ['It hides in a burrow all day', 'It sweats heavily to stay at 37 °C', 'It hibernates through the hot season'], why: 'Not sweating saves water. A countercurrent system keeps its brain cooler than its core.' },
  ],
};
