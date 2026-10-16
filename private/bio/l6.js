// Lecture 6 · Ch 29.2 + supplement · Water and ion balance, kidney function

import { E, T, Track, at, move, show, setText, smooth, keys, frac, lerp, clamp, TAU, win, arrowDefs } from './kit.js';
import { fx, pill, pillText, pillAt, ease, eased, env, flow, breathe, scaleAt } from './fx-b.js';

// ---------------------------------------------------------------- 1. fish in fresh water vs seawater

const fish = {
  id: 'l6-fish', title: 'Fresh water vs seawater fish', dur: 12,
  vars: { mode: 'fresh' },
  build(svg, s, ui) {
    ui.seg('mode', [['fresh', 'Freshwater fish'], ['sea', 'Saltwater fish'], ['salmon', 'Salmon (switches)']], 'Water');
    fx(svg);
    // painted artwork underneath; drawn shapes stay on top for motion and highlights
    svg.classList.add('has-art', 'art-l6-fish');
    E('image', { href: new URL('./art/l6-fish.jpg', import.meta.url).href, x: 0, y: 0, width: 640, height: 360, preserveAspectRatio: 'none', class: 'b-art' }, svg);
    const g = E('g', {}, svg);
    E('rect', { x: 0, y: 0, width: 640, height: 360, class: 'b-fresh' }, g);
    const bgS = E('rect', { x: 0, y: 0, width: 640, height: 360, class: 'b-sea' }, g);
    const seaSalt = Array.from({ length: 40 }, (_, i) => E('circle', { cx: (i * 97) % 630 + 5, cy: (i * 53) % 350 + 5, r: 2.2, class: 'p-salt faint' }, g));
    const CX = 320, CY = 180, RX = 150, RY = 62;
    const fishG = E('g', {}, g);
    const tail = E('path', { d: `M${CX - RX + 8},${CY} L${CX - RX - 50},${CY - 44} Q${CX - RX - 34},${CY} ${CX - RX - 50},${CY + 44}z`, class: 'b-fish' }, fishG);
    E('path', { d: `M${CX - RX},${CY} C${CX - 90},${CY - 80} ${CX + 90},${CY - 80} ${CX + RX},${CY} C${CX + 90},${CY + 80} ${CX - 90},${CY + 80} ${CX - RX},${CY}z`, class: 'b-fish' }, fishG);
    E('path', { d: `M${CX - 70},${CY - 44} C${CX - 30},${CY - 60} ${CX + 30},${CY - 60} ${CX + 70},${CY - 44}`, class: 'fxb-sheen-line' }, fishG);
    E('circle', { cx: CX + 105, cy: CY - 14, r: 6, class: 'b-eye' }, fishG);
    E('circle', { cx: CX + 107, cy: CY - 16, r: 1.8, class: 'fxb-glint' }, fishG);
    const gillGlow = E('path', { d: `M${CX + 70},${CY - 34} q-14,34 0,68`, class: 'fxb-gillglow' }, fishG);
    E('path', { d: `M${CX + 70},${CY - 34} q-14,34 0,68`, class: 'b-gill' }, fishG);
    const inside = T(fishG, CX - 20, CY + 5, '', 'bl b-strong', { 'text-anchor': 'middle' });
    const outside = pill(g, 44, 30, '', 'bl b-strong');
    const hormone = pill(g, 598, 30, '', 'bs b-strong b-hor-t', { 'text-anchor': 'end' });
    hormone.previousSibling.classList.add('rose');
    const sets = { fresh: E('g', {}, g), sea: E('g', {}, g) };
    const parts = {};
    for (const [mode, root] of Object.entries(sets)) {
      const fresh = mode === 'fresh';
      const p = parts[mode] = {
        water: Array.from({ length: 22 }, () => E('circle', { r: 4, class: 'p-water' }, root)),
        salt: Array.from({ length: 10 }, () => E('circle', { r: 4, class: 'p-salt' }, root)),
        pump: Array.from({ length: 6 }, () => E('circle', { r: 4.5, class: 'p-salt' }, root)),
        urine: Array.from({ length: fresh ? 10 : 3 }, () => E('circle', { r: 4, class: 'p-water' }, root)),
        drink: fresh ? [] : Array.from({ length: 8 }, (_, i) => E('circle', { r: 4, class: i % 3 ? 'p-water' : 'p-salt' }, root)),
      };
      const lbl = (x, y, text, anchor = 'start') => pill(root, x, y, text, 'bs b-strong', { 'text-anchor': anchor });
      if (fresh) {
        lbl(44, 120, 'water rushes IN →'); lbl(44, 250, '← salt leaks OUT');
        lbl(CX + 138, 66, 'gills pump salt IN', 'start');
        lbl(CX - 150, 330, 'lots of dilute urine', 'start');
      } else {
        lbl(44, 120, '← water leaks OUT'); lbl(44, 250, 'salt leaks IN →');
        lbl(CX + 138, 66, 'gills pump salt OUT', 'start');
        lbl(CX - 150, 330, 'very little urine', 'start');
        lbl(598, 214, 'drinks seawater', 'end');
      }
      p.atp = pill(root, CX + 108, CY - 46, 'ATP', 'bs b-atp');
      p.atp.previousSibling.classList.add('warm');
    }
    T(g, 44, 350, '● water   ', 'bs b-water-t');
    T(g, 108, 350, '● salt ions (Na⁺, Cl⁻)', 'bs b-salt-t');
    const edge = a => [CX + (RX - 18) * Math.cos(a), CY + (RY - 8) * Math.sin(a)];
    const far = a => [CX + (RX + 70) * Math.cos(a), CY + (RY + 70) * Math.sin(a)];
    return (lt, _dt, t) => {
      let k; // 0 = fresh, 1 = sea
      if (s.vars.mode === 'fresh') k = 0;
      else if (s.vars.mode === 'sea') k = 1;
      else k = smooth(0.42, 0.58, lt / 12) - smooth(0.92, 1, lt / 12) + (lt < 0.5 ? 0 : 0);
      show(bgS, k);
      seaSalt.forEach((c, i) => { if (k > 0.004) at(c, (i * 97) % 630 + 5 + 3 * Math.sin(t * 0.5 + i), (i * 53) % 350 + 5 + 2 * Math.cos(t * 0.4 + i * 1.3)); show(c, k); });
      show(sets.fresh, 1 - k); show(sets.sea, k);
      // the fish idles: a slow bob and a lazy tail
      fishG.setAttribute('transform', `translate(0 ${(2.5 * Math.sin(t * 1.1)).toFixed(2)})`);
      tail.setAttribute('transform', `rotate(${(5 * Math.sin(t * 2.2)).toFixed(2)} ${CX - RX + 8} ${CY})`);
      const pumpBeat = 0.5 + 0.5 * Math.sin(TAU * t * 0.8);
      show(gillGlow, 0.2 + 0.6 * pumpBeat);
      setText(inside, k < 0.5 ? 'body is saltier than the water' : 'body is less salty than the sea');
      pillText(outside, k < 0.5 ? 'Fresh water (hardly any salt)' : 'Seawater (very salty)');
      pillText(hormone, s.vars.mode !== 'salmon' ? '' : k < 0.5 ? 'prolactin: “freshwater mode”' : 'cortisol: “saltwater mode”');
      show(hormone.parentNode, s.vars.mode === 'salmon' ? 1 : 0);
      for (const mode of ['fresh', 'sea']) {
        const p = parts[mode], inward = mode === 'fresh';
        if ((inward ? 1 - k : k) < 0.004) continue;
        p.water.forEach((w, i) => {
          const a = (i / p.water.length) * TAU + 0.3, u = frac(t * 0.22 + i * 0.37);
          const [x, y] = inward ? flow(far(a), edge(a), ease(u), i, 12, 3, t) : flow(edge(a), far(a), ease(u), i, 12, 3, t);
          at(w, x, y); show(w, env(u));
        });
        p.salt.forEach((w, i) => {
          const a = (i / p.salt.length) * TAU + 1.1, u = frac(t * 0.16 + i * 0.29);
          const [x, y] = inward ? flow(edge(a), far(a), ease(u), i, -12, 3, t) : flow(far(a), edge(a), ease(u), i, -12, 3, t);
          at(w, x, y); show(w, env(u));
        });
        const G0 = [CX + 124, 64], G1 = [CX + 66, CY - 12];
        p.pump.forEach((w, i) => {
          const u = frac(t * 0.35 + i / p.pump.length);
          const [x, y] = inward ? flow(G0, G1, u, i, 16, 2, t) : flow(G1, G0, u, i, 16, 2, t);
          at(w, x, y); show(w, env(u, 0.25));
        });
        show(p.atp.parentNode, 0.45 + 0.55 * pumpBeat);
        p.urine.forEach((w, i) => {
          const u = frac(t * 0.3 + i / p.urine.length);
          at(w, CX - 80 - u * 30 + 2 * Math.sin(u * 6 + i), CY + 50 + ease(u) * 70); show(w, env(u));
        });
        p.drink.forEach((w, i) => {
          const u = frac(t * 0.3 + i / p.drink.length);
          at(w, lerp(620, CX + RX + 2, ease(u)), CY + 4 + 5 * Math.sin(u * 8 + i)); show(w, env(u));
        });
      }
      if (s.vars.mode === 'salmon') return k < 0.5 ? 'In rivers, salmon act like freshwater fish (prolactin flips the gill pumps to pull salt IN)' : 'In the ocean, cortisol flips the gill “chloride cells” to pump salt OUT';
      if (k < 0.5) return 'Water moves toward more salt, so it floods INTO the fish. The fish fights back: tons of dilute urine, and gills that actively pump salt back in.';
      return 'Here the sea is saltier, so water LEAVES the fish. It drinks seawater, pumps the extra salt out through its gills, and makes very little urine.';
    };
  },
  plain: [
    'Water always moves toward the side with more dissolved stuff (higher osmotic pressure). Salt ions do the opposite and spread from high to low concentration.',
    'A freshwater fish is saltier than its water (hyperosmotic), so water pours in and salt leaks out. It makes lots of dilute urine and uses ATP to pump salt in at the gills.',
    'A bony fish in the sea is less salty than the water (hyposmotic), so it loses water and gains salt. It drinks seawater and pumps salt out. Seabirds, sea turtles and marine lizards use salt glands to dump extra salt.',
    'Most marine invertebrates don’t fight it: they match the sea (osmoconformers). Blue crabs are osmoregulators and keep their inside constant.',
  ],
  terms: [
    ['Isosmotic / hyperosmotic / hyposmotic', 'Same / higher / lower osmotic pressure than the other solution.'],
    ['Osmoconformer', 'Lets its body fluids match the environment (most marine invertebrates).'],
    ['Osmoregulator', 'Keeps its body fluids constant whatever the outside is (fish, blue crab).'],
    ['Salt gland', 'An organ outside the kidney that pumps out extra salt using ATP (seabirds, turtles).'],
  ],
};
const lerpP = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];

// ---------------------------------------------------------------- 2. nitrogen wastes

const nitrogen = {
  id: 'l6-nitrogen', title: 'Getting rid of nitrogen: ammonia, urea, uric acid', dur: 15,
  build(svg) {
    fx(svg);
    const g = E('g', {}, svg);
    const COLS = [
      ['🐟', 'Ammonia', 'NH₃', ['fish and most', 'water animals'], [1, 1, 0.15]],
      ['🧍', 'Urea', 'CO(NH₂)₂', ['mammals, most', 'land animals'], [0.5, 0.55, 0.55]],
      ['🐦', 'Uric acid', 'paste, not liquid', ['birds, reptiles,', 'insects'], [0.12, 0.12, 1]],
    ];
    const ROWS = ['How toxic', 'Water needed', 'Energy cost'];
    const cols = COLS.map(([emoji, name, f, who, vals], i) => {
      const x = 252 + i * 140;
      const grp = E('g', {}, g);
      const box = E('rect', { x: x - 68, y: 10, width: 136, height: 340, rx: 16, class: 'b-colbox' }, grp);
      T(grp, x, 52, emoji, `b-emoji fxb-float d${i}`, { 'text-anchor': 'middle' });
      T(grp, x, 82, name, 'bl b-strong', { 'text-anchor': 'middle' });
      T(grp, x, 100, f, 'bs', { 'text-anchor': 'middle' });
      T(grp, x, 322, who[0], 'bs', { 'text-anchor': 'middle' }); T(grp, x, 337, who[1], 'bs', { 'text-anchor': 'middle' });
      const bars = vals.map((v, r) => {
        const y = 140 + r * 64;
        E('rect', { x: x - 55, y, width: 110, height: 16, rx: 8, class: 'b-track' }, grp);
        return { el: E('rect', { x: x - 55, y, width: 0, height: 16, rx: 8, class: `b-barfill r${r}` }, grp), v, r };
      });
      const drops = Array.from({ length: 6 }, () => E('path', { d: 'M0,-6 C4,0 5,3 0,6 C-5,3 -4,0 0,-6z', class: 'b-drop-w' }, grp));
      return { grp, box, bars, drops, x, vals, f: 0 };
    });
    ROWS.forEach((r, i) => T(g, 40, 153 + i * 64, r, 'bs b-strong'));
    return (lt, dt) => {
      const focus = Math.min(2, Math.floor(lt / 5));
      cols.forEach((c, i) => {
        // bars sweep in at the start of each loop, then hold
        c.bars.forEach(b => {
          const grow = eased(0.2 + i * 0.18 + b.r * 0.12, 1.3 + i * 0.18 + b.r * 0.12, lt) * (1 - eased(14.5, 15, lt));
          b.el.setAttribute('width', Math.max(0, 110 * b.v * grow).toFixed(1));
        });
        c.box.classList.toggle('on', i === focus);
        // the column being talked about lifts a little, the others go quiet
        c.f += ((i === focus ? 1 : 0) - c.f) * Math.min(1, (dt || 1) * 5);
        scaleAt(c.grp, c.x, 180, 1 + 0.025 * c.f);
        c.grp.setAttribute('opacity', (0.62 + 0.38 * c.f).toFixed(3));
        const nd = Math.round(c.vals[1] * 6);
        c.drops.forEach((d, k) => {
          const u = frac(lt * 0.6 + k / 6);
          move(d, c.x - 40 + k * 16, 222 + ease(u) * 26);
          show(d, k < nd ? env(u, 0.3) : 0);
        });
      });
      return [
        'Ammonia: very toxic but dissolves easily. Fish just let it wash away into the water around them.',
        'Urea: costs more energy to make but is much less toxic, so land animals can store it and flush it with less water.',
        'Uric acid: the most expensive, but it barely dissolves, so birds and reptiles lose almost no water getting rid of it (the white part of bird droppings).',
      ][focus];
    };
  },
  plain: [
    'Breaking down proteins and nucleic acids leaves nitrogen behind, mostly as toxic ammonia. Which form an animal excretes depends on how much water it can spare.',
    'Rule of thumb: the less water you have, the more energy you spend to make a less toxic, less soluble waste.',
  ],
  terms: [
    ['Ammonotelic', 'Excretes ammonia (aquatic animals).'],
    ['Ureotelic', 'Excretes urea (mammals, most land animals).'],
    ['Uricotelic', 'Excretes uric acid (birds, reptiles, insects).'],
  ],
};

// ---------------------------------------------------------------- 3. the nephron

const NEPH = [
  'M126,78 C150,40 170,104 195,70 C215,42 238,84 250,112 L250,150',
  'M250,150 L250,318',
  'M250,318 C250,350 290,350 290,318 L290,150',
  'M290,150 L290,124 C290,94 330,84 350,104 C370,124 392,94 412,84 L448,84',
  'M448,84 L470,84 C484,84 490,94 490,108 L490,334',
];
const medullaAt = y => clamp((y - 150) / 190) * 900 + 300;

const nephron = {
  id: 'l6-nephron', title: 'Inside a nephron: how urine is made', dur: 25,
  vars: { adh: 'on' },
  build(svg, s, ui) {
    ui.seg('adh', [['on', 'ADH high (thirsty)'], ['off', 'ADH low (drank lots)']], 'ADH');
    const fid = fx(svg);
    // painted artwork underneath; drawn shapes stay on top for motion and highlights
    svg.classList.add('has-art', 'art-l6-nephron');
    E('image', { href: new URL('./art/l6-nephron.jpg', import.meta.url).href, x: 0, y: 0, width: 640, height: 360, preserveAspectRatio: 'none', class: 'b-art' }, svg);
    const g = E('g', {}, svg);
    E('rect', { x: 0, y: 0, width: 640, height: 150, class: 'b-cortex' }, g);
    const defs = E('defs', {}, svg);
    const grad = E('linearGradient', { id: 'b-med-grad', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    E('stop', { offset: '0', class: 'b-med-top' }, grad); E('stop', { offset: '1', class: 'b-med-bot' }, grad);
    E('rect', { x: 0, y: 150, width: 640, height: 210, fill: 'url(#b-med-grad)', class: 'b-medulla' }, g);
    const concColor = c => `hsl(${lerp(196, 38, clamp((c - 100) / 1100)).toFixed(0)} ${lerp(70, 85, clamp((c - 100) / 1100)).toFixed(0)}% ${lerp(62, 52, clamp((c - 100) / 1100)).toFixed(0)}%)`;
    // the salt scale uses the same colours as the flowing filtrate
    const sg = E('linearGradient', { id: `${fid}-scale`, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    for (let k = 0; k <= 4; k++) E('stop', { offset: k / 4, style: `stop-color: ${concColor(300 + 900 * k / 4)}` }, sg);
    T(g, 584, 22, 'CORTEX', 'bs b-strong', { 'text-anchor': 'end' });
    T(g, 584, 196, 'MEDULLA', 'bs b-strong', { 'text-anchor': 'end' });
    E('rect', { x: 590, y: 152, width: 10, height: 196, rx: 5, fill: `url(#${sg.id})`, class: 'fxb-scale' }, g);
    T(g, 584, 212, 'salt level', 'bs', { 'text-anchor': 'end' });
    [[300, 160], [1200, 346]].forEach(([v, y]) => T(g, 584, y + 4, `${v}`, 'bs b-strong', { 'text-anchor': 'end' }));
    // blood side
    E('path', { d: 'M20,60 C50,60 70,74 92,76', class: 'b-art' }, g);
    E('path', { d: 'M92,84 C70,90 52,108 22,112', class: 'b-art thin' }, g);
    T(g, 22, 50, 'blood in', 'bs');
    T(g, 22, 130, 'blood out', 'bs');
    const capsule = E('path', { d: 'M128,76 a34,34 0 1 0 0,8', class: 'b-capsule' }, g);
    const glom = E('path', { d: 'M92,80 c4,-22 26,-22 24,-4 c-2,14 -22,10 -18,-4 c3,-12 22,-12 22,2 c0,14 -22,22 -26,8 c-3,-10 10,-14 16,-6', class: 'b-glom' }, g);
    // tubule
    const tub = NEPH.map(d => E('path', { d, class: 'b-tubule' }, g));
    NEPH.forEach(d => E('path', { d, class: 'b-lumen-t' }, g));
    const tr = new Track(g, NEPH);
    const aqua = Array.from({ length: 6 }, (_, i) => E('rect', { x: 483, y: 170 + i * 28, width: 14, height: 6, rx: 3, class: 'b-aqua' }, g));
    // one soft pill per part; the one the caption is about turns warm
    const labels = [
      [40, 154, 'glomerulus + Bowman’s capsule', 'start'], [236, 122, 'proximal tubule', 'end'], [238, 240, 'descending limb', 'end'],
      [302, 240, 'ascending limb', 'start'], [384, 62, 'distal tubule', 'start'], [506, 132, 'collecting duct', 'start'],
    ].map(([x, y, text, anchor]) => pill(g, x, y, text, 'bs b-strong', { 'text-anchor': anchor }));
    // flowing filtrate
    const flowDots = Array.from({ length: 40 }, () => E('circle', { r: 3.4, class: 'fxb-flowdot' }, g));
    // exchange streams: [from, to, class, count]
    const streams = [
      { key: 'filt', a: [100, 72], b: [126, 72], cls: 'p-water', n: 5, phase: 0 },
      { key: 'pct', a: [205, 62], b: [205, 18], cls: 'p-glu', n: 4, phase: 1 },
      { key: 'pct', a: [180, 74], b: [180, 22], cls: 'p-water', n: 4, phase: 1 },
      { key: 'pct', a: [228, 76], b: [232, 22], cls: 'p-salt', n: 4, phase: 1 },
      { key: 'desc', a: [246, 200], b: [196, 204], cls: 'p-water', n: 4, phase: 2 },
      { key: 'desc', a: [246, 280], b: [196, 286], cls: 'p-water', n: 4, phase: 2 },
      { key: 'asc', a: [294, 200], b: [340, 204], cls: 'p-salt', n: 4, phase: 2 },
      { key: 'asc', a: [294, 274], b: [340, 280], cls: 'p-salt', n: 4, phase: 2 },
      { key: 'dct', a: [366, 30], b: [366, 92], cls: 'p-k', n: 4, phase: 3 },
      { key: 'cd', a: [486, 190], b: [440, 196], cls: 'p-water', n: 4, phase: 4 },
      { key: 'cd', a: [486, 270], b: [440, 276], cls: 'p-water', n: 4, phase: 4 },
      { key: 'cd', a: [494, 236], b: [540, 242], cls: 'p-water', n: 4, phase: 4 },
    ];
    for (const st of streams) st.dots = Array.from({ length: st.n }, () => E('circle', { r: 3.6, class: st.cls }, g));
    const urine = Array.from({ length: 8 }, () => E('path', { d: 'M0,-7 C4,0 6,3 0,7 C-6,3 -4,0 0,-7z', class: 'fxb-drop' }, g));
    T(g, 330, 316, 'urine leaving:', 'bs'); const out = pill(g, 330, 333, '', 'bs b-strong');
    T(g, 330, 22, '● water', 'bs b-water-t'); T(g, 330, 38, '● salt (Na⁺)', 'bs b-salt-t'); T(g, 420, 22, '● glucose', 'bs b-glu-t'); T(g, 420, 38, '● K⁺, H⁺', 'bs b-k-t');
    const conc = (u, adh) => {
      const [i, k] = tr.seg(u);
      if (i === 0) return 300;
      if (i === 1) return lerp(300, 1200, k);
      if (i === 2) return k < 0.18 ? 1200 : lerp(1200, 100, (k - 0.18) / 0.82);
      if (i === 3) return 100;
      return adh ? lerp(100, 1150, smooth(0.1, 1, k)) : 100;
    };
    let aq = s.vars.adh === 'on' ? 1 : 0.12;
    return (lt, dt, t) => {
      const adh = s.vars.adh === 'on';
      const step = Math.min(4, Math.floor(lt / 5));
      const segOn = [[], [0], [1, 2], [3], [4]][step];
      const labOn = [[0], [1], [2, 3], [4], [5]][step];
      tub.forEach((p, i) => p.classList.toggle('glow', segOn.includes(i)));
      glom.classList.toggle('glow', step === 0);
      labels.forEach((l, i) => l.previousSibling.classList.toggle('warm', labOn.includes(i)));
      // the glomerulus throbs with each heartbeat
      const beat = Math.exp(-((frac(t * 1.1) - 0.1) ** 2) / 0.006);
      scaleAt(glom, 106, 79, 1 + 0.06 * beat);
      scaleAt(capsule, 112, 80, 1 + 0.012 * beat);
      flowDots.forEach((c, i) => {
        const u = frac(t * 0.035 + i / flowDots.length);
        const [x, y] = tr.pos(u);
        at(c, x, y);
        c.style.fill = concColor(conc(u, adh));
      });
      for (const st of streams) {
        const active = st.key !== 'cd' || adh;
        const emph = step === st.phase ? 1 : 0.4;
        st.dots.forEach((d, i) => {
          const u = frac(t * 0.5 + i / st.n + st.phase * 0.13);
          const [x, y] = flow(st.a, st.b, ease(u), i, 5, 1.5, t);
          at(d, x, y);
          show(d, active ? env(u, 0.25) * emph : 0);
        });
      }
      aq += ((adh ? 1 : 0.12) - aq) * Math.min(1, (dt || 1) * 3);
      aqua.forEach((a, i) => { show(a, clamp(aq * 1.3 - i * 0.05)); scaleAt(a, 490, 173 + i * 28, 0.6 + 0.4 * aq); });
      urine.forEach((d, i) => {
        const n = adh ? 2 : 8;
        const u = frac(t * 0.45 + i / 8);
        move(d, 490, 334 + ease(u) * 22, adh ? 0.9 : 1.1);
        d.style.fill = concColor(adh ? 1150 : 100);
        show(d, i < n ? env(u, 0.3) : 0);
      });
      pillText(out, adh ? 'a little, very concentrated' : 'lots, very dilute');
      return [
        '① Filtration: blood pressure pushes water and small solutes out of the glomerulus into Bowman’s capsule. Cells and big proteins stay in the blood.',
        '② Reabsorption: the proximal tubule takes back most of it, including ALL the glucose and amino acids and most of the salt and water',
        '③ Loop of Henle: the descending limb lets only water out, the ascending limb pumps only salt out. That builds a salty medulla (up to 1200).',
        '④ Secretion: the distal tubule moves extra K⁺ and H⁺ from the blood INTO the urine',
        adh ? '⑤ ADH adds aquaporins (water channels) to the collecting duct. Water leaves into the salty medulla → concentrated urine.' : '⑤ Without ADH the collecting duct stays waterproof → water stays in → lots of dilute urine',
      ][step];
    };
  },
  plain: [
    'A nephron is the kidney’s tiny filter-and-tube unit; each kidney has about a million. Blood comes in, gets filtered, and the tube decides what to keep and what to throw away.',
    'Four processes: filtration (push fluid out of the blood), reabsorption (take the good stuff back), secretion (add extra wastes like K⁺ and H⁺), osmoconcentration (pull water out to concentrate urine).',
    'Mammals reabsorb about 99% of filtered salt and water and 100% of glucose and amino acids, mostly in the proximal tubule.',
    'The loop of Henle is a countercurrent multiplier: water leaves going down, salt leaves going up. This makes the medulla very salty, so water can be drawn out of the collecting duct, but only when ADH has opened its aquaporins. Vasa recta capillaries and recycled urea help keep that gradient.',
  ],
  terms: [
    ['Glomerulus', 'Ball of leaky capillaries where filtration happens.'],
    ['Bowman’s capsule', 'Cup that catches the filtrate.'],
    ['Afferent / efferent arteriole', 'Brings blood to / takes blood away from the glomerulus.'],
    ['Peritubular capillaries', 'Wrap the tubule and take back what’s reabsorbed.'],
    ['ADH (vasopressin)', 'Hormone that adds aquaporin-2 water channels to the distal tubule and collecting duct → more water kept.'],
    ['Vasa recta', 'Hairpin capillaries in the medulla that preserve the salt gradient (countercurrent exchange).'],
    ['Juxtaglomerular apparatus', 'Where the distal tubule touches the afferent arteriole. Releases renin.'],
  ],
};

// ---------------------------------------------------------------- 4. renin–angiotensin–aldosterone

const RA_NODES = [
  [20, 24, 180, 64, 'Blood pressure, blood volume or Na⁺ drops', 'warn'],
  [230, 24, 180, 64, 'Kidney (JGA) releases renin', ''],
  [440, 24, 180, 64, 'Renin: angiotensinogen → angiotensin I', ''],
  [440, 128, 180, 64, 'ACE (lungs): angiotensin I → angiotensin II', ''],
  [230, 128, 180, 64, 'Adrenal cortex releases aldosterone', ''],
  [16, 240, 190, 70, 'Kidney keeps more Na⁺ (and water follows)', 'fx'],
  [225, 240, 190, 70, 'Arterioles squeeze (vasoconstriction)', 'fx'],
  [434, 240, 190, 70, 'More ADH → kidney keeps water', 'fx'],
];
const RA_LINKS = ['M200,56 L230,56', 'M410,56 L440,56', 'M530,88 L530,128', 'M440,160 L410,160', 'M320,192 C320,215 111,212 111,240', 'M530,192 C520,214 320,214 320,240', 'M560,192 C562,214 529,220 529,240'];

const raas = {
  id: 'l6-raas', title: 'Renin–angiotensin–aldosterone: raising blood pressure', dur: 18,
  build(svg) {
    fx(svg);
    const g = E('g', {}, svg);
    const head = arrowDefs(svg, 'b-m-raas', 'b-head ink');
    const links = RA_LINKS.map(d => E('path', { d, class: 'b-link', 'marker-end': head }, g));
    const tr = new Track(g, RA_LINKS);
    const ring = E('rect', { rx: 18, class: 'fxb-ring' }, g);
    const nodes = RA_NODES.map(([x, y, w, h, text, kind], ni) => {
      const grp = E('g', {}, g);
      const r = E('rect', { x, y, width: w, height: h, rx: 14, class: `b-node-box ${kind}` }, grp);
      const words = text.split(' ');
      const lines = [''];
      for (const wd of words) { if ((lines[lines.length - 1] + ' ' + wd).length > 24) lines.push(wd); else lines[lines.length - 1] = (lines[lines.length - 1] + ' ' + wd).trim(); }
      const dy = h / 2 + (ni === 2 || ni === 3 ? -4 : 0);
      lines.forEach((ln, i) => T(grp, x + w / 2, y + dy + (i - (lines.length - 1) / 2) * 16 + 5, ln, 'bs b-strong fxb-nohalo', { 'text-anchor': 'middle' }));
      return r;
    });
    // peptide beads: angiotensinogen (long) → angiotensin I (10) → II (8)
    const beads = Array.from({ length: 14 }, () => E('circle', { r: 3.6, class: 'b-bead' }, g));
    // blood pressure gauge
    const GX = 110, GY = 200, GR = 54;
    const arcPt = deg => [GX + GR * Math.sin(deg * Math.PI / 180), GY - GR * Math.cos(deg * Math.PI / 180)];
    E('path', { d: `M${GX - GR},${GY} A${GR},${GR} 0 0 1 ${GX + GR},${GY}`, class: 'b-gauge' }, g);
    const gFill = E('path', { class: 'fxb-gauge-fill' }, g);
    const needle = E('line', { x1: GX, y1: GY, x2: GX, y2: GY - 44, class: 'b-needle' }, g);
    E('circle', { cx: GX, cy: GY, r: 6, class: 'fxb-hub' }, g);
    T(g, GX - 62, GY - 2, 'low', 'bs', { 'text-anchor': 'end' }); T(g, GX + 62, GY - 2, 'normal', 'bs');
    T(g, GX, GY - 64, 'blood pressure', 'bs b-strong', { 'text-anchor': 'middle' });
    const fb = E('path', { d: 'M176,176 C204,150 200,112 170,92', class: 'b-feedback', 'marker-end': head }, g);
    const fbT = pill(g, 214, 113, 'back to normal → renin stops', 'bs b-strong b-good-t');
    fbT.previousSibling.classList.add('cool');
    const token = E('circle', { r: 7, class: 'b-spark' }, g);
    const LIT = [0, 2.5, 4.5, 7, 9, 9.5, 9.5, 9.5];
    return (lt, _dt, t) => {
      // the token runs the main chain (links 0–3), then all three effects light up together
      if (!tr.table) tr.build();
      const chainEnd = tr.starts[4];
      const lit = i => lt >= LIT[i];
      nodes.forEach((r, i) => r.classList.toggle('lit', lit(i)));
      links.forEach((l, i) => l.classList.toggle('lit', i < 4 ? lt >= [2.5, 4.5, 7, 9][i] : lt >= 9.5));
      // a soft ring ripples out of the box that just lit up
      let li = -1; for (let i = 0; i < 5; i++) if (lt >= LIT[i]) li = i;
      const since = li < 0 ? 9 : lt - LIT[li];
      if (li >= 0 && since < 1.1) {
        const [x, y, w, h] = RA_NODES[li], k = ease(since / 1.1), p = 3 + 9 * k;
        ring.setAttribute('x', x - p); ring.setAttribute('y', y - p); ring.setAttribute('width', w + 2 * p); ring.setAttribute('height', h + 2 * p);
        show(ring, 0.8 * (1 - k));
      } else show(ring, 0);
      if (lt < 9) { const [x, y] = tr.pos(keys(lt, [[1.5, 0], [2.5, tr.starts[1]], [3.5, tr.starts[1]], [4.5, tr.starts[2]], [6, tr.starts[2]], [7, tr.starts[3]], [8, tr.starts[3]], [9, chainEnd]])); at(token, x, y); show(token, smooth(1.2, 1.6, lt) * (0.85 + 0.15 * Math.sin(t * 6))); }
      else show(token, 0);
      // beads: the chain sits centred in its box; snipped-off beads drift away and fade
      const nb = lt < 4.5 ? 14 : lt < 7 ? 10 : 8;
      const toII = eased(7, 7.8, lt), by = lerp(80, 184, toII), sp = 8.4;
      beads.forEach((b, i) => {
        const x0 = 530 - (nb - 1) * sp / 2;
        let x = x0 + i * sp, y = by + Math.sin(t * 2 + i * 0.7) * 0.8, o = lt < 2.5 ? 0 : smooth(2.5, 2.9, lt);
        const cut = i >= 10 ? 4.5 : i >= 8 ? 7 : 99;
        if (lt >= cut) {
          const k = eased(cut, cut + 1.2, lt), cx = 530 - ((i >= 10 ? 14 : 10) - 1) * sp / 2 + i * sp;
          x = cx + 14 * k; y = (i >= 10 ? 80 : 80) + 22 * k; o *= 1 - k;
        }
        at(b, x, y); show(b, o);
        b.classList.toggle('active', lt >= 7 && i < 8);
      });
      const bp = keys(lt, [[0, 0.15], [9, 0.15], [13, 0.9]]);
      const ang = lerp(-80, 70, bp);
      needle.setAttribute('transform', `rotate(${ang.toFixed(1)} ${GX} ${GY})`);
      const [ax, ay] = arcPt(ang);
      gFill.setAttribute('d', `M${GX - GR},${GY} A${GR},${GR} 0 0 1 ${ax.toFixed(1)},${ay.toFixed(1)}`);
      gFill.style.stroke = `color-mix(in srgb, var(--b-teal) ${(bp * 100).toFixed(0)}%, var(--b-red))`;
      show(fb, smooth(13, 14, lt)); show(fbT.parentNode, smooth(13, 14, lt));
      if (lt < 2.5) return 'The juxtaglomerular apparatus senses low blood pressure, low blood volume or low Na⁺…';
      if (lt < 4.5) return '…and releases the enzyme renin into the blood';
      if (lt < 7) return 'Renin snips angiotensinogen (a protein from the liver, always in the blood) into angiotensin I';
      if (lt < 9) return 'ACE, mostly in the lungs, trims it into angiotensin II, the active form';
      if (lt < 13) return 'Angiotensin II triggers aldosterone. Together they make the kidney save Na⁺ and water, squeeze arterioles and boost ADH.';
      return 'Blood pressure climbs back to normal, so renin release switches off (negative feedback)';
    };
  },
  plain: [
    'This is the body’s slow, strong way to raise blood pressure. It starts in the kidney, where the juxtaglomerular apparatus (JGA) senses low pressure, low volume or low Na⁺.',
    'The chain: renin → angiotensin I → (ACE in the lungs) → angiotensin II → aldosterone from the adrenal cortex.',
    'Aldosterone makes the distal tubule and collecting duct reabsorb more Na⁺, and water follows the salt. The system also raises ADH (keep water) and squeezes arterioles. All of it pushes blood pressure up.',
    'Heads-up: in real physiology angiotensin II is the one that directly squeezes arterioles and triggers ADH. Your slides list those under aldosterone’s effects, so for the exam just remember the whole system raises blood pressure all three ways.',
  ],
  terms: [
    ['Renin', 'Enzyme from the JGA that starts the chain.'],
    ['Angiotensinogen', 'Inactive protein made by the liver, always floating in blood.'],
    ['ACE', 'Angiotensin-converting enzyme (lungs). Blood-pressure drugs called “ACE inhibitors” block it.'],
    ['Aldosterone', 'Steroid hormone from the adrenal cortex → more Na⁺ reabsorption.'],
  ],
};

export default {
  id: 'L6', n: '6', short: 'Kidney & salt', color: '--b-teal', chapter: 'Ch 29.2 + supplement',
  title: 'Water, salt and the kidney',
  minute: [
    'Water moves toward more solute (osmosis). Ions spread from high to low. Animals spend energy to fight both.',
    'Freshwater fish: water floods in → dilute urine + gills pump salt in. Saltwater fish: water leaks out → drink seawater + pump salt out. Salmon switch (prolactin ↔ cortisol).',
    'Nitrogen waste: ammonia (water animals, toxic) → urea (mammals) → uric acid (birds, reptiles, insects; saves water).',
    'Kidney basics: filtration, reabsorption, secretion, osmoconcentration. The nephron is the working unit.',
    'Loop of Henle builds a salty medulla. ADH opens water channels in the collecting duct → concentrated urine (up to 1200 mOsm).',
    'Low blood pressure → renin → angiotensin I → II → aldosterone → keep Na⁺ and water → pressure back up.',
  ],
  traps: [
    'Water moves toward HIGHER osmotic pressure (more solute). Your slide has a typo there; this is the right version.',
    'Freshwater fish = hyperosmotic regulators. Marine bony fish = hyposmotic regulators.',
    'Descending limb: water out only. Ascending limb: salt out only (active, ATP).',
    'ADH = vasopressin = more water kept = LESS, more concentrated urine. Alcohol blocks ADH → more urine.',
    'Renin is made in the kidney (JGA); ACE works in the lungs; aldosterone comes from the adrenal cortex.',
    'Uric acid saves the most water but costs the most energy.',
  ],
  links: [['Glomerulus = leaky capillaries, pushed by blood pressure → Lecture 5', 'L5'], ['ADH comes from the posterior pituitary → Lecture 9', 'L9'], ['Countercurrent heat exchange in tuna → Lecture 5', 'L5']],
  scenes: [fish, nitrogen, nephron, raas],
  quiz: [
    { q: 'A freshwater fish is surrounded by water with less salt than its body. What happens without regulation?', a: 'Water moves in and salt leaks out', o: ['Water moves out and salt moves in', 'Nothing, they’re isosmotic', 'Salt and water both move in'], why: 'Water moves toward more solute (the fish). Salt diffuses from high (fish) to low (water).' },
    { q: 'How does a saltwater bony fish keep its water?', a: 'Drinks seawater and pumps extra salt out at the gills', o: ['Makes lots of dilute urine', 'Pumps salt in at the gills', 'Becomes isosmotic with the sea'], why: 'It’s hyposmotic to the sea, so it loses water. It drinks, then actively removes the salt it swallowed.' },
    { q: 'Which hormone switches a salmon’s gills to “saltwater mode”?', a: 'Cortisol', o: ['Prolactin', 'ADH', 'Aldosterone'], why: 'Cortisol = saltwater (pump salt out). Prolactin = freshwater (pump salt in).' },
    { q: 'Birds excrete uric acid mainly because it…', a: 'Barely dissolves, so very little water is lost', o: ['Is the cheapest to make', 'Is the most toxic', 'Dissolves easily in urine'], why: 'Uric acid costs the most energy, but it saves water, which matters for animals that lay eggs on land and for flying.' },
    { q: 'Where does filtration happen?', a: 'Glomerulus into Bowman’s capsule', o: ['Loop of Henle', 'Collecting duct', 'Distal tubule'], why: 'Blood pressure pushes plasma (no cells or big proteins) through the leaky glomerulus into the capsule.' },
    { q: 'Which part reabsorbs most substances, including all glucose?', a: 'Proximal tubule', o: ['Distal tubule', 'Collecting duct', 'Ascending limb'], why: 'Most reabsorption, including 100% of glucose and amino acids, happens in the proximal tubule.' },
    { q: 'The ascending limb of the loop of Henle…', a: 'Pumps salt out but doesn’t let water out', o: ['Lets water out but not salt', 'Lets both out freely', 'Secretes K⁺ and H⁺'], why: 'That split (descending = water, ascending = salt) is what builds the salty medulla.' },
    { q: 'More ADH means…', a: 'More aquaporins in the collecting duct → less, more concentrated urine', o: ['Fewer aquaporins → more dilute urine', 'More salt secreted into urine', 'Higher glomerular filtration'], why: 'ADH (vasopressin) inserts aquaporin-2 channels, so water leaves the duct into the salty medulla.' },
    { q: 'What does renin do?', a: 'Converts angiotensinogen into angiotensin I', o: ['Converts angiotensin I into II', 'Stimulates Na⁺ reabsorption directly', 'Lowers blood pressure'], why: 'Renin (from the JGA) starts the chain. ACE does the I → II step.' },
    { q: 'Aldosterone’s main effect on the kidney is to…', a: 'Increase Na⁺ reabsorption in the distal tubule and collecting duct', o: ['Increase glucose secretion', 'Block ADH', 'Increase filtration at the glomerulus'], why: 'More Na⁺ kept → water follows → blood volume and pressure rise.' },
  ],
};
