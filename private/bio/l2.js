// Lecture 2 · Ch 28.1, 28.2, 28.4 · Nutrition, energy and homeostasis

import { E, T, at, move, show, setText, smooth, keys, frac, lerp, clamp, TAU, arrowDefs } from './kit.js';
import { polish, fit, pill, pills, breath, scaleAbout, drift, ease, life, flag, beadify } from './fx-a.js';

const MID = { 'text-anchor': 'middle' };
const END = { 'text-anchor': 'end' };
const SPR = n => new URL(`./art/sprites/${n}.webp`, import.meta.url).href;
/** a painted sprite centred on (cx, cy) */
const sprite = (parent, n, cx, cy, w, h, attrs = {}) => E('image', { href: SPR(n), x: cx - w / 2, y: cy - h / 2, width: w, height: h, preserveAspectRatio: 'xMidYMid meet', ...attrs }, parent);

// ---------------------------------------------------------------- 1. order costs energy

const order = {
  id: 'l2-order', title: 'Staying organized costs energy', dur: 14,
  vars: { food: 'on' },
  build(svg, s, ui) {
    polish(svg);
    ui.seg('food', [['on', 'Energy coming in'], ['off', 'No energy in']], 'Energy');
    svg.classList.add('has-art', 'art-l2-order');
    const art = E('image', { href: new URL('./art/l2-order.jpg', import.meta.url).href, x: 0, y: 0, width: 640, height: 360, preserveAspectRatio: 'none', class: 'b-art' }, svg);
    const g = E('g', {}, svg);
    const head = arrowDefs(svg, 'l2-order-head', 'b-head gold');
    E('line', { x1: 120, y1: 328, x2: 350, y2: 328, class: 'b-axis' }, g);
    let seed = 11;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const blocks = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      const hx = 168 + c * 44, hy = 172 + r * 44;
      E('rect', { x: hx - 20, y: hy - 20, width: 40, height: 40, rx: 7, class: 'b-slot' }, g);
      blocks.push({ hx, hy, row: r, d: 0, state: 'home', ax: hx, ay: hy, rot: 0, wait: 0 });
    }
    blocks.forEach(b => { b.el = E('rect', { x: -20, y: -20, width: 40, height: 40, rx: 7, class: `b-blk c${b.row}` }, g); });
    // the energy chain on the right
    const BOX = [['🍎 food', 30], ['ATP (energy)', 104], ['work: put pieces back', 178]];
    const boxes = BOX.map(([text, y]) => {
      const r = E('rect', { x: 440, y, width: 180, height: 40, rx: 12, class: 'b-node-box' }, g);
      r.t = T(g, 530, y + 26, text, 'bl b-strong fx-fade', MID);
      return r;
    });
    const links = [[70, 100], [144, 174]].map(([a, b]) => E('line', { x1: 530, y1: a, x2: 530, y2: b, class: 'b-link', 'marker-end': head }, g));
    T(g, 440, 252, 'how organized?', 'bs b-strong');
    E('rect', { x: 440, y: 262, width: 180, height: 16, rx: 8, class: 'b-track' }, g);
    const bar = E('rect', { x: 440, y: 262, width: 180, height: 16, rx: 8, class: 'b-barfill r2' }, g);
    const pct = T(g, 620, 298, '', 'bs b-strong', END);
    const sparks = Array.from({ length: 4 }, () => ({ el: E('circle', { r: 5.5, class: 'b-spark' }, g), b: null, t0: 0 }));
    let acc = -1.6, shown = 1;
    const scatter = () => {
      for (let n = 0; n < 12; n++) {
        const x = 34 + rnd() * 362, y = 34 + rnd() * 290;
        if (x < 128 || x > 340 || y < 132) return [x, y];
      }
      return [60, 60];
    };
    svg.insertBefore(art, fit(svg)); // painting stays full-stage, outside the fit() shrink
    return (lt, dt, t) => {
      const on = s.vars.food === 'on';
      acc += dt;
      if (dt && acc >= (on ? 1.1 : 0.8)) {
        acc = 0;
        const home = blocks.filter(b => b.state === 'home');
        if (home.length) {
          const b = home[Math.floor(rnd() * home.length)];
          [b.ax, b.ay] = scatter();
          b.rot = (rnd() - 0.5) * 140; b.state = 'leave';
        }
      }
      blocks.forEach(b => {
        if (b.state === 'leave') { b.d = Math.min(1, b.d + dt * 0.9); if (b.d >= 1) { b.state = 'away'; b.wait = 0; } }
        else if (b.state === 'away') {
          b.wait += dt;
          const free = sparks.find(sp => !sp.b);
          if (on && b.wait > 0.5 && free) { free.b = b; free.t0 = t; b.state = 'call'; b.wait = 0; }
        } else if (b.state === 'call') { b.wait += dt; if (b.wait > 0.7) b.state = 'back'; }
        else if (b.state === 'back') { b.d = Math.max(0, b.d - dt * 1.3); if (b.d <= 0) b.state = 'home'; }
        const k = smooth(0, 1, b.d);
        const loose = b.state === 'away' || b.state === 'call' ? 1 : k;
        const calm = 0.8 * (1 - loose) * Math.sin(t * 1.6 + b.hx * 0.05 + b.hy * 0.03);
        move(b.el, lerp(b.hx, b.ax, k) + loose * 4 * Math.sin(t * 1.3 + b.hx), lerp(b.hy, b.ay, k) + loose * 4 * Math.cos(t * 1.1 + b.hy) + calm, 1, b.rot * k + loose * 6 * Math.sin(t + b.hy));
      });
      sparks.forEach(sp => {
        if (!sp.b) { show(sp.el, 0); return; }
        const u = (t - sp.t0) / 0.7;
        if (u >= 1 || u < 0) { sp.b = null; show(sp.el, 0); return; }
        const p = keys(u, [[0, [530, 124]], [0.35, [530, 198]], [1, [sp.b.hx, sp.b.hy]]]);
        at(sp.el, p[0], p[1] - 18 * Math.sin(Math.PI * clamp((u - 0.35) / 0.65))); show(sp.el, life(u, 0.1));
      });
      boxes.forEach(b => { b.classList.toggle('lit', on); flag(b.t, 'fx-dim', !on); });
      links.forEach(l => l.classList.toggle('lit', on));
      const ord = 1 - blocks.reduce((a, b) => a + b.d, 0) / blocks.length;
      shown = dt ? lerp(shown, ord, 1 - Math.exp(-dt * 5)) : ord;
      bar.setAttribute('width', Math.max(0, 180 * shown).toFixed(1));
      setText(pct, `${Math.round(ord * 100)}% in place`);
      if (!on) return ord < 0.15 ? 'Everything has drifted apart. Switch the energy back on to rebuild it.' : 'No energy in: pieces keep drifting off and nothing puts them back. Order is lost.';
      if (lt < 4.5) return 'Living things are highly organized, like this neat stack: every piece in its place';
      if (lt < 9) return 'But order falls apart on its own, all the time. That’s the 2nd law of thermodynamics.';
      return 'Energy from food (as ATP) pays for the work of putting things back. That’s why animals must keep eating.';
    };
  },
  plain: [
    'Animals are heterotrophs: they can’t make their own food, so they eat ready-made organic molecules from other organisms. Food gives them two things: energy (from breaking chemical bonds) and building blocks (to grow and replace cells).',
    'Organization is the most basic feature of life. The second law of thermodynamics says any organized system left alone gets more random. So it takes a steady supply of energy just to stay organized.',
    'Animals get food in different ways: predation (eating other animals), suspension feeding (filtering small bits out of water) and symbiosis (partners that make food for them).',
  ],
  terms: [
    ['Heterotroph', 'An organism that must eat organic molecules made by others.'],
    ['2nd law of thermodynamics', 'Left alone, an organized system becomes more disordered.'],
    ['Nutrition', 'How animals meet their needs for chemical substances and energy.'],
  ],
};

// ---------------------------------------------------------------- 2. essential amino acids

const AAS = [['P', 'phenylalanine', 'both'], ['V', 'valine', 'both'], ['T', 'threonine', 'both'], ['T', 'tryptophan', 'grain'], ['I', 'isoleucine', 'bean'],
  ['M', 'methionine', 'grain'], ['H', 'histidine', 'extra'], ['A', 'arginine', 'extra'], ['L', 'leucine', 'both'], ['L', 'lysine', 'bean']];
const PHASES = [{ src: 'bean', a: 2, b: 5.8 }, { src: 'grain', a: 6.2, b: 9.8 }, { src: 'both', a: 10.2, b: 14.6 }];

const amino = {
  id: 'l2-amino', title: 'Essential amino acids: beans + grains', dur: 15,
  build(svg) {
    polish(svg);
    svg.classList.add('has-art', 'art-l2-amino');
    const art = E('image', { href: new URL('./art/l2-amino.jpg', import.meta.url).href, x: 0, y: 0, width: 640, height: 360, preserveAspectRatio: 'none', class: 'b-art' }, svg);
    const g = E('g', {}, svg);
    T(g, 22, 40, 'Memory trick: PVT TIM HALL', 'bl b-strong');
    T(g, 22, 62, 'the amino acids you must get from food', 'bs');
    const tiles = AAS.map(([L, name, kind], i) => {
      const x = 22 + (i % 5) * 121, y = 86 + Math.floor(i / 5) * 66;
      const r = E('rect', { x, y, width: 112, height: 56, rx: 10, class: kind === 'extra' ? 'b-tile extra' : 'b-tile' }, g);
      T(g, x + 56, y + 23, L, 'bl b-strong', MID);
      T(g, x + 56, y + 43, name, 'bs', MID);
      return { r, kind, cx: x + 56, cy: y + 28, cls: r.getAttribute('class') };
    });
    T(g, 618, 244, 'H: histidine is essential too', 'bs', END);
    T(g, 618, 262, 'A: arginine, mostly for growing kids', 'bs', END);
    const bowl = (cx, label, bean) => {
      const grp = E('g', {}, g);
      // painted bowl: kidney + black beans, or rice with corn
      sprite(grp, bean ? 'l2-amino-beans' : 'l2-amino-grains', cx, 299, 106, 64);
      T(grp, cx, 340, label, 'bs b-strong', MID);
      return grp;
    };
    const beanBowl = bowl(170, 'beans and other legumes', true);
    const grainBowl = bowl(470, 'grains (corn, rice, wheat)', false);
    const status = T(g, 320, 300, '', 'bl b-strong', MID);
    const syncStatus = pill(status, { px: 12, py: 4, cls: 'warm' });
    const SRC = { bean: [170, 270], grain: [470, 270] };
    const tokens = [];
    for (const src of ['bean', 'grain']) {
      let n = 0;
      tiles.forEach((tl, i) => {
        if (tl.kind === 'both' || tl.kind === src) tokens.push({ src, i, n: n++, el: E('circle', { r: 7, class: src === 'bean' ? 'b-bean-tok' : 'b-grain-tok' }, g) });
      });
    }
    svg.insertBefore(art, fit(svg)); // painting stays full-stage, outside the fit() shrink
    return (lt, _dt, t) => {
      const ph = PHASES.find(p => lt >= p.a && lt < p.b);
      const uses = src => ph && (ph.src === src || ph.src === 'both');
      const got = tiles.map(() => ({ bean: false, grain: false }));
      tokens.forEach(tk => {
        if (!uses(tk.src)) { show(tk.el, 0); return; }
        const t0 = ph.a + 0.3 + tk.n * 0.18;
        const u = (lt - t0) / 0.9;
        if (u >= 1) got[tk.i][tk.src] = true;
        const [sx, sy] = SRC[tk.src], tl = tiles[tk.i];
        const k = ease(0, 1, u);
        at(tk.el, lerp(sx, tl.cx, k), lerp(sy, tl.cy, k) - 60 * Math.sin(Math.PI * k));
        show(tk.el, u > 0 && u < 1 ? Math.min(1, u * 8, (1 - u) * 6) : 0);
      });
      const settled = ph && lt > ph.a + 2.4;
      tiles.forEach((tl, i) => {
        let cls = 'b-tile';
        if (tl.kind === 'extra') cls += ' extra';
        else if (got[i].bean && got[i].grain) cls += ' mix';
        else if (got[i].bean) cls += ' bean';
        else if (got[i].grain) cls += ' grain';
        else if (settled) cls += ' miss';
        if (tl.cls !== cls) { tl.cls = cls; tl.r.setAttribute('class', cls); }
      });
      show(beanBowl, uses('bean') ? 1 : 0.4);
      show(grainBowl, uses('grain') ? 1 : 0.4);
      beanBowl.setAttribute('transform', `translate(0 ${(uses('bean') ? -3 + 1.5 * breath(t, 3) : 0).toFixed(2)})`);
      grainBowl.setAttribute('transform', `translate(0 ${(uses('grain') ? -3 + 1.5 * breath(t, 3, 1) : 0).toFixed(2)})`);
      setText(status, !settled ? '' : ph.src === 'both' ? 'together: all 8 ✓' : `${ph.src === 'bean' ? 'beans' : 'grains'} alone: 2 missing`);
      syncStatus();
      if (lt < 2) return 'Your body can make some amino acids, but 8 (plus histidine) must come from food: the essential amino acids';
      if (lt < 6.2) return 'Beans alone: plenty of isoleucine and lysine, but short on tryptophan and methionine';
      if (lt < 10.2) return 'Grains alone: plenty of tryptophan and methionine, but short on isoleucine and lysine';
      return 'Together they fill every slot. That’s why beans + rice (or corn) is such a classic combo.';
    };
  },
  plain: [
    'The molecules in your body are built from the molecules in your food. Animals can convert some molecules into others (lipids can become carbohydrates, for example), but some must be eaten fully formed. Those are essential nutrients.',
    'Proteins use 20 standard amino acids. You can make some of them (nonessential); the ones you can’t make are the essential amino acids.',
    'Other essential nutrients: fatty acids like omega-3 and omega-6 (the number is the carbon position of the last double bond), vitamins (A for vision, K for blood clotting…) and minerals (calcium and phosphorus for bone, iodine for thyroid hormones, iron for hemoglobin).',
  ],
  terms: [
    ['Essential nutrient', 'Needed by the body but can’t be made by it, so it must be eaten.'],
    ['Essential amino acid', 'An amino acid you can’t make. Mnemonic: PVT TIM HALL.'],
    ['Mineral', 'A chemical element needed besides C, O, H and N (e.g. Ca, P, I, Fe).'],
  ],
};

// ---------------------------------------------------------------- 3. metabolic rate and body size

const ANIMALS = {
  mouse: { e: 'l2-scale-mouse', name: 'Mouse', mass: '25 g', g: 25, verdict: 'needs lots of food for its size' },
  cat: { e: 'l2-scale-cat', name: 'Cat', mass: '4 kg', g: 4000, verdict: 'somewhere in between' },
  human: { e: 'l2-scale-human', name: 'Human', mass: '70 kg', g: 7e4, verdict: 'needs less food for its size' },
  elephant: { e: 'l2-scale-elephant', name: 'Elephant', mass: '4,000 kg', g: 4e6, verdict: 'needs the least food for its size' },
};
const perGram = grams => Math.pow(4e6 / grams, 0.25);

const scaling = {
  id: 'l2-scale', title: 'Metabolic rate: size and activity', dur: 14,
  vars: { animal: 'mouse' },
  build(svg, s, ui) {
    polish(svg);
    ui.seg('animal', Object.entries(ANIMALS).map(([k, a]) => [k, a.name]), 'Animal');
    const g = E('g', {}, svg);
    const X = lg => 50 + (lg - 1) / 5.8 * 250, Y = r => 270 - (r - 1) / 20 * 210;
    E('path', { d: 'M46,40 L46,282 L304,282', class: 'b-axis' }, g);
    T(g, 50, 28, 'energy burned per gram ↑', 'bs b-strong');
    T(g, 304, 302, 'body size (log scale) →', 'bs', END);
    let d = '';
    for (let lg = 1.2; lg <= 6.71; lg += 0.1) d += `${d ? 'L' : 'M'}${X(lg).toFixed(1)},${Y(perGram(10 ** lg)).toFixed(1)}`;
    E('path', { d, class: 'b-curve' }, g);
    const guide = E('path', { class: 'b-leader', fill: 'none' }, g);
    Object.values(ANIMALS).forEach(a => E('circle', { cx: X(Math.log10(a.g)), cy: Y(perGram(a.g)), r: 5, class: 'b-dot' }, g));
    const sel = E('circle', { r: 8, class: 'b-spark' }, g);
    const bigL = T(g, 300, 64, '', 'bl b-strong', END);
    T(g, 300, 84, 'per gram, vs. an elephant', 'bs', END);
    // the animal and its "furnace"
    E('rect', { x: 330, y: 14, width: 296, height: 194, rx: 14, class: 'b-panel' }, g);
    const hdr = T(g, 478, 40, '', 'bl b-strong', MID);
    const eg = E('g', {}, g);
    // painted animal, standing on y = 0 of its group (the group scales with body size)
    const animal = E('image', { x: -36, y: -60, width: 72, height: 60, preserveAspectRatio: 'xMidYMax meet' }, eg);
    let shown = '';
    // painted flame, base at y = 16 so it flickers upward from the bottom
    const flame = E('g', {}, g);
    E('image', { href: SPR('l2-scale-flame'), x: -16, y: -34, width: 32, height: 50, preserveAspectRatio: 'xMidYMax meet', class: 'b-flame' }, flame);
    T(g, 410, 180, 'body size', 'bs', MID);
    T(g, 548, 180, 'burn per gram', 'bs', MID);
    const verdict = T(g, 478, 200, '', 'bs b-strong', MID);
    // activity graph
    T(g, 346, 228, 'moving costs energy too', 'bs b-strong');
    E('path', { d: 'M346,238 L346,330 L520,330', class: 'b-axis' }, g);
    T(g, 520, 348, 'speed →', 'bs', END);
    const MOVES = [
      ['human: run', v => 0.2 + 0.6 * v],
      ['fish: swim', v => 0.1 + 0.75 * (Math.exp(3 * v) - 1) / (Math.exp(3) - 1)],
      ['bird: fly', v => 0.75 - 1.6 * v + 1.7 * v * v],
    ];
    const GX = v => 346 + v * 174, GY = m => 330 - m * 100;
    const dots = MOVES.map(([label, f], i) => {
      let p = '';
      for (let v = 0; v <= 1.001; v += 0.05) p += `${p ? 'L' : 'M'}${GX(v).toFixed(1)},${GY(f(v)).toFixed(1)}`;
      E('path', { d: p, class: `b-hline c${i}` }, g);
      T(g, 534, 256 + i * 22, label, `bs b-strong b-hl-t c${i}`);
      return E('circle', { r: 5.5, class: `b-hdot c${i}` }, g);
    });
    const cur = { x: 0, y: 0, ok: false };
    let fl = 0;
    fit(svg);
    return (lt, dt, t) => {
      const a = ANIMALS[s.vars.animal];
      const r = perGram(a.g), lg = Math.log10(a.g);
      const tx = X(lg), ty = Y(r);
      const k = dt && cur.ok ? 1 - Math.exp(-dt * 6) : 1;
      cur.x = lerp(cur.x, tx, k); cur.y = lerp(cur.y, ty, k); cur.ok = true;
      at(sel, cur.x, cur.y);
      guide.setAttribute('d', `M46,${cur.y.toFixed(1)} L${cur.x.toFixed(1)},${cur.y.toFixed(1)} L${cur.x.toFixed(1)},282`);
      setText(bigL, `${a.name}: ×${r < 1.05 ? 1 : r < 3 ? r.toFixed(1) : Math.round(r)}`);
      setText(hdr, `${a.name} · ${a.mass}`);
      if (shown !== a.e) { shown = a.e; animal.setAttribute('href', SPR(a.e)); }
      move(eg, 410, 142 + 2 * breath(t, 2.4 + lg * 0.4), (0.6 + 1.25 * (lg - 1.4) / 5.2) * (1 + 0.02 * breath(t, 2.4 + lg * 0.4, 1)));
      sel.setAttribute('r', (8 + 1.2 * breath(t, 1.4)).toFixed(2));
      fl += dt * (2 + r * 0.5);
      const fs = 0.7 + 0.9 * (r - 1) / 19, wob = 1 + 0.12 * Math.sin(fl * TAU) + 0.05 * Math.sin(fl * 17);
      const tf = `translate(548 136) scale(${fs.toFixed(3)} ${(fs * wob).toFixed(3)})`;
      flame.setAttribute('transform', tf);
      setText(verdict, a.verdict);
      const v = 0.5 - 0.5 * Math.cos(TAU * t / 5);
      dots.forEach((dt2, i) => at(dt2, GX(v), GY(MOVES[i][1](v))));
      if (lt < 8) return {
        mouse: 'A mouse burns about 20× more energy per gram than an elephant, so it has to eat a lot for its size',
        cat: 'A cat sits in between. The bigger the body, the less energy each gram burns.',
        human: 'You burn about 3× more per gram than an elephant, but far less than a mouse',
        elephant: 'An elephant burns the most energy in total, but the least per gram of body',
      }[s.vars.animal];
      if (lt < 11) return 'Activity raises metabolic rate. Running people: it rises in a straight line with speed. Fish: it shoots up, because water pushes back harder and harder.';
      return 'Birds pay a lot at low speed too, just to stay in the air. Metabolic rate is measured by how fast an animal uses O₂.';
    };
  },
  plain: [
    'Metabolic rate = how much chemical-bond energy an animal uses up (and turns into heat) per day. It’s measured by how fast the animal uses O₂, because aerobic metabolism uses O₂ and gives off heat.',
    'Basal metabolic rate (BMR) is measured at rest, at a comfortable temperature, when the animal hasn’t eaten recently. BMR per gram goes down as body size goes up, so small mammals need more food per gram of body than big ones.',
    'Energy in food is measured by burning it with O₂ (making CO₂ + H₂O) and measuring the heat. 1 calorie heats 1 g of water by 1 °C. Food labels use Calories = kilocalories (1000 calories). 1 joule = 0.239 calories.',
    'Food comes as fats, carbohydrates and proteins. Extra energy is mostly stored as fat, the most energy-dense option.',
  ],
  terms: [
    ['Metabolic rate', 'Energy used (turned to heat) per unit of time.'],
    ['BMR', 'Basal metabolic rate: resting, comfortable, not recently fed.'],
    ['Scaling', 'How a trait changes with body size.'],
    ['Calorie (food)', '= 1 kcal = 1000 calories; 1 calorie heats 1 g of water by 1 °C.'],
  ],
};

// ---------------------------------------------------------------- 4. regulators vs conformers

const regulate = {
  id: 'l2-reg', title: 'Regulators vs conformers', dur: 16,
  build(svg) {
    polish(svg);
    const g = E('g', {}, svg);
    const GX0 = 50, GX1 = 430, Y = T0 => 300 - T0 * 6.5;
    for (const v of [0, 10, 20, 30, 40]) {
      E('line', { x1: GX0, y1: Y(v), x2: GX1, y2: Y(v), class: 'b-grid' }, g);
      T(g, GX0 - 6, Y(v) + 4, `${v} °C`, 'bs', END);
    }
    T(g, GX1, 324, 'time →', 'bs', END);
    [[0, '☾ night'], [1 / 3, '☀ day'], [2 / 3, '☾ night'], [1, '☀ day']].forEach(([u, txt]) => T(g, GX0 + u * (GX1 - GX0), 24, txt, 'bs', MID));
    const Tout = u => 20 - 14 * Math.cos(TAU * u * 1.5);
    const Tgat = u => 20 - 12.5 * Math.cos(TAU * (u - 0.025) * 1.5);
    const Tmouse = u => 37 + 0.4 * Math.sin(TAU * u * 6);
    const LINES = [[Tout, 'b-line out', 'b-dot-ink'], [Tgat, 'b-line glu', 'p-glu'], [Tmouse, 'b-line red', 'p-oxy']].map(([f, lc, dc]) => ({ f, path: E('path', { class: lc }, g), pen: E('circle', { r: 5, class: dc }, g) }));
    // the two cards
    const mCard = E('rect', { x: 448, y: 26, width: 180, height: 132, rx: 12, class: 'b-panel' }, g);
    T(g, 460, 50, 'Mouse', 'bl b-strong');
    sprite(g, 'l2-reg-mouse', 584, 66, 72, 46);
    T(g, 460, 70, 'regulator', 'bs b-strong red-t');
    const mT = T(g, 460, 92, '', 'bs');
    T(g, 460, 114, 'energy it burns', 'bs');
    E('rect', { x: 460, y: 124, width: 156, height: 12, rx: 6, class: 'b-track' }, g);
    const mBar = E('rect', { x: 460, y: 124, width: 0, height: 12, rx: 6, class: 'b-barfill r0' }, g);
    const gCard = E('rect', { x: 448, y: 172, width: 180, height: 134, rx: 12, class: 'b-panel' }, g);
    T(g, 460, 196, 'Alligator', 'bl b-strong');
    sprite(g, 'l2-reg-alligator', 578, 208, 96, 20);
    T(g, 460, 216, 'conformer', 'bs b-strong b-glu-t');
    const gT = T(g, 460, 238, '', 'bs');
    T(g, 460, 260, 'energy it burns', 'bs');
    E('rect', { x: 460, y: 270, width: 156, height: 12, rx: 6, class: 'b-track' }, g);
    const gBar = E('rect', { x: 460, y: 270, width: 0, height: 12, rx: 6, class: 'b-barfill r1' }, g);
    const gNote = T(g, 460, 298, '', 'bs b-strong');
    E('line', { x1: 450, y1: 330, x2: 476, y2: 330, class: 'b-line out' }, g);
    T(g, 484, 334, 'outside air', 'bs');
    fit(svg);
    LINES.forEach(L => L.pen.classList.add('fx-pen'));
    return (lt, _dt, t) => {
      const pen = clamp(lt / 14.5);
      flag(mCard, 'fx-glow', lt >= 4 && lt < 9);
      flag(gCard, 'fx-glow', lt >= 9 && lt < 13);
      LINES.forEach((L, i) => L.pen.setAttribute('r', (5 + 0.8 * breath(t, 1.5, i)).toFixed(2)));
      LINES.forEach(L => {
        let d = '';
        for (let u = 0; u <= pen + 1e-6; u += 0.005) d += `${d ? 'L' : 'M'}${(GX0 + u * (GX1 - GX0)).toFixed(1)},${Y(L.f(u)).toFixed(1)}`;
        L.path.setAttribute('d', d);
        at(L.pen, GX0 + pen * (GX1 - GX0), Y(L.f(pen)));
      });
      const out = Tout(pen), gat = Tgat(pen);
      setText(mT, `inside: ${Math.round(Tmouse(pen))} °C`);
      setText(gT, `inside: ${Math.round(gat)} °C`);
      mBar.setAttribute('width', (156 * clamp(0.15 + 0.85 * (37 - out) / 31)).toFixed(1));
      gBar.setAttribute('width', (14 + 10 * gat / 34).toFixed(1));
      setText(gNote, gat < 14 ? 'cold: slow and sluggish' : gat > 26 ? 'warm: active' : '');
      if (lt < 4) return 'Three lines: the outside air (dashed), a mouse (red) and an alligator (green)';
      if (lt < 9) return 'The mouse is a regulator: its inside stays near 37 °C whatever the weather. That costs lots of energy, most of all in the cold.';
      if (lt < 13) return 'The alligator is a conformer: its body temperature just follows the outside. Cheap, but it gets slow and sluggish when it’s cold.';
      return 'Regulating = stable but expensive. Conforming = cheap, but the cells must cope with the changes.';
    };
  },
  plain: [
    'Your cells are bathed in tissue fluid (interstitial fluid). This is the internal environment, and it’s what animals try to keep steady.',
    'Regulators keep internal conditions (like temperature) constant even when the outside changes. Conformers let their internal environment match the outside.',
    'Regulation gives stability but costs energy and raises metabolic rate (think of a small mouse keeping warm in winter). Conforming is cheap, but the cells have to cope with change (think of an alligator in Gainesville in January).',
    'An animal can regulate one thing and conform in another, e.g. regulate salt but conform in temperature.',
  ],
  terms: [
    ['Internal environment', 'The interstitial fluid around the cells.'],
    ['Regulator', 'Keeps a condition inside constant despite the outside.'],
    ['Conformer', 'Lets a condition inside match the outside.'],
    ['Homeostasis', 'Keeping the internal environment steady.'],
  ],
};

// ---------------------------------------------------------------- 5. fluid compartments and levels of organization

const compart = {
  id: 'l2-fluid', title: 'Body fluids, and cells → tissues → organs', dur: 16,
  build(svg) {
    polish(svg);
    // painted artwork for part A only (it fades out with part A)
    svg.classList.add('has-art', 'art-l2-fluid');
    const art = E('image', { href: new URL('./art/l2-fluid.jpg', import.meta.url).href, x: 0, y: 0, width: 640, height: 360, preserveAspectRatio: 'none', class: 'b-art' }, svg);
    const g = E('g', {}, svg);
    // --- part A: where the water is
    const A = E('g', { class: 'b-partA' }, g);
    E('rect', { x: 10, y: 20, width: 422, height: 326, rx: 14, class: 'b-isf' }, A);
    E('rect', { x: 10, y: 44, width: 422, height: 52, rx: 26, class: 'b-bloodband' }, A);
    for (let k = 0; k < 8; k++) for (const y of [40, 92]) E('rect', { x: 22 + k * 51, y, width: 45, height: 8, rx: 4, class: 'b-endo' }, A);
    T(A, 220, 33, 'capillary wall = a simple epithelium', 'bs', MID);
    const rbc = Array.from({ length: 6 }, () => E('circle', { r: 7, class: 'p-oxy' }, A));
    T(A, 30, 64, 'plasma', 'bs b-strong red-t');
    T(A, 220, 130, 'interstitial fluid', 'bs b-strong b-water-t', MID);
    for (let k = 0; k < 4; k++) {
      E('rect', { x: 30 + k * 100, y: 150, width: 80, height: 150, rx: 18, class: 'b-icfcell' }, A);
      E('circle', { cx: 70 + k * 100, cy: 200, r: 13, class: 'b-nucleus' }, A);
    }
    T(A, 370, 324, 'cell membrane', 'bs', MID);
    E('line', { x1: 370, y1: 312, x2: 370, y2: 301, class: 'b-leader' }, A);
    const wat = Array.from({ length: 6 }, () => E('circle', { r: 4, class: 'p-water' }, A));
    const na = Array.from({ length: 4 }, () => E('circle', { r: 4.5, class: 'p-salt' }, A));
    const hl = E('rect', { rx: 12, class: 'b-hl' }, A);
    const LEG = [['plasma', 'plasma (in blood)'], ['isf', 'interstitial fluid'], ['icf', 'intracellular fluid']];
    const leg = LEG.map(([c, text], i) => {
      E('rect', { x: 450, y: 36 + i * 24, width: 14, height: 14, rx: 3, class: `b-sw ${c}` }, A);
      return T(A, 472, 48 + i * 24, text, 'bs b-strong b-region');
    });
    E('rect', { x: 450, y: 122, width: 120, height: 18, class: 'b-sw icf' }, A);
    E('rect', { x: 570, y: 122, width: 46, height: 18, class: 'b-sw isf' }, A);
    E('rect', { x: 616, y: 122, width: 14, height: 18, class: 'b-sw plasma' }, A);
    T(A, 450, 162, '⅔ inside cells (ICF)', 'bs b-strong');
    T(A, 450, 182, '⅓ outside cells (ECF)', 'bs b-strong');
    T(A, 450, 202, 'ECF = interstitial + plasma', 'bs');
    T(A, 450, 238, 'Kept apart by:', 'bs b-strong');
    T(A, 450, 258, '• cell membranes', 'bs');
    T(A, 450, 278, '• epithelia (cell sheets)', 'bs');
    T(A, 450, 298, 'Both can pump ions.', 'bs');
    // --- part B: levels of organization
    const B = E('g', {}, g);
    const LV = [['Cell', 'the basic unit', 'makes its own ATP'], ['Tissue', 'similar cells', 'e.g. epithelium'], ['Organ', '2+ tissue types', 'e.g. small intestine'], ['Organ system', 'organs teaming up', 'e.g. digestive system']];
    const panels = LV.map(([name, a, b], k) => {
      const x0 = 14 + k * 156, cx = x0 + 72, cy = 136;
      const box = E('rect', { x: x0, y: 40, width: 144, height: 190, rx: 14, class: 'b-colbox' }, B);
      const icon = E('g', {}, B); move(icon, cx, cy);
      if (k === 0) {
        E('circle', { r: 46, class: 'b-icfcell' }, icon);
        E('circle', { cx: -8, cy: -6, r: 13, class: 'b-nucleus' }, icon);
        [[18, 12, 20], [-22, 22, -30], [16, -26, 60]].forEach(([x, y, r]) => E('ellipse', { cx: x, cy: y, rx: 10, ry: 5, transform: `rotate(${r} ${x} ${y})`, class: 'b-mito' }, icon));
      } else if (k === 1) {
        E('line', { x1: -62, y1: 36, x2: 62, y2: 36, class: 'b-basement' }, icon);
        for (let n = 0; n < 5; n++) {
          E('rect', { x: -59 + n * 24, y: -28, width: 22, height: 60, rx: 5, class: 'b-icfcell' }, icon);
          E('circle', { cx: -48 + n * 24, cy: 14, r: 5, class: 'b-nucleus' }, icon);
        }
      } else if (k === 2) {
        E('circle', { r: 58, class: 'b-muscle' }, icon);
        E('circle', { r: 46, class: 'b-epi' }, icon);
        let d = '';
        for (let n = 0; n <= 48; n++) { const a = n / 48 * TAU, rr = 28 + 8 * Math.cos(a * 12); d += `${n ? 'L' : 'M'}${(rr * Math.cos(a)).toFixed(1)},${(rr * Math.sin(a)).toFixed(1)}`; }
        E('path', { d: `${d}z`, class: 'b-villus' }, icon);
        E('circle', { r: 15, class: 'b-gutlumen' }, icon);
      } else {
        E('ellipse', { cx: -26, cy: -34, rx: 20, ry: 11, class: 'b-liver' }, icon);
        E('path', { d: 'M-6,-80 L-6,-44', class: 'b-tract' }, icon);
        E('ellipse', { cx: 8, cy: -32, rx: 24, ry: 14, transform: 'rotate(20 8 -32)', class: 'b-gut' }, icon);
        E('path', { d: 'M-4,-16 C40,-14 40,2 0,4 C-40,6 -40,22 0,24 C40,26 40,42 0,44 C-30,46 -30,60 -8,72', class: 'b-tract' }, icon);
      }
      T(B, cx, 256, name, 'bl b-strong', MID);
      T(B, cx, 276, a, 'bs', MID);
      T(B, cx, 294, b, 'bs', MID);
      if (k < 3) E('path', { d: `M${x0 + 146},128 L${x0 + 153},135 L${x0 + 146},142`, class: 'b-chev' }, B);
      return { box, icon, cx };
    });
    const atp = T(B, 108, 180, 'ATP', 'bs b-atp', MID);
    svg.insertBefore(art, fit(svg)); // painting stays full-stage, outside the fit() shrink
    return (lt, _dt, t) => {
      show(A, smooth(0, 0.4, lt) * (1 - smooth(7.8, 8.4, lt)));
      show(art, smooth(0, 0.4, lt) * (1 - smooth(7.8, 8.4, lt)));
      show(B, smooth(8.2, 8.8, lt) * (1 - smooth(15.6, 16, lt)));
      rbc.forEach((r, i) => at(r, 24 + frac(t * 0.12 + i / 6) * 394, 80 + 3 * Math.sin(t + i)));
      wat.forEach((w, i) => {
        const u = frac(t * 0.4 + i / 6);
        const down = i % 2 === 0;
        at(w, [36, 84, 130, 304, 352, 400][i] + u * 10, down ? lerp(80, 142, u) : lerp(142, 80, u));
        show(w, Math.sin(Math.PI * u));
      });
      na.forEach((n, i) => {
        const u = frac(t * 0.35 + i / 4);
        at(n, lerp(92 + i * 100, 122 + i * 100, u), 252 + 8 * Math.sin(u * 5));
        show(n, Math.sin(Math.PI * u));
      });
      const sub = lt < 2.7 ? 0 : lt < 5.4 ? 1 : 2;
      const R = [[6, 38, 430, 64], [6, 100, 430, 48], [24, 144, 392, 162]][sub];
      hl.setAttribute('x', R[0]); hl.setAttribute('y', R[1]); hl.setAttribute('width', R[2]); hl.setAttribute('height', R[3]);
      leg.forEach((l, i) => l.classList.toggle('on', i === sub));
      const lvl = lt < 8.6 ? -1 : Math.min(3, Math.floor((lt - 8.6) / 1.6));
      panels.forEach((p, k) => {
        p.box.classList.toggle('on', k === lvl);
        const pop = ease(8.6 + k * 1.6, 9.1 + k * 1.6, lt);
        show(p.icon, 0.3 + 0.7 * pop);
        p.icon.setAttribute('transform', `translate(${p.cx} 136) scale(${(1 + 0.06 * Math.sin(Math.PI * pop) + (k === lvl ? 0.015 * breath(t, 3) : 0)).toFixed(4)})`);
      });
      show(atp, lvl >= 0 ? 0.4 + 0.6 * Math.max(0, Math.sin(TAU * t * 0.8)) : 0);
      if (lt < 2.7) return 'Plasma: the fluid part of blood, inside the vessels';
      if (lt < 5.4) return 'Interstitial fluid bathes every cell. It’s the “internal environment” the body keeps steady.';
      if (lt < 8.6) return 'Intracellular fluid is inside the cells: about two-thirds of all body water. Membranes and epithelia keep the compartments apart.';
      return [
        'Zoom out. A cell is the basic unit, and every cell must make its own ATP.',
        'A tissue = cells of a similar type working together, like a simple epithelium: one layer on a basement membrane',
        'An organ = two or more tissue types with a set structure, like the small intestine (epithelium, muscle…)',
        'An organ system = several organs working together. Splitting jobs up like this is division of labor.',
      ][lvl];
    };
  },
  plain: [
    'Animal bodies are mostly water. The water inside cells is intracellular fluid (ICF). Everything else is extracellular fluid (ECF): blood plasma plus the interstitial fluid around the cells.',
    'Compartments are separated by cell membranes and epithelia. Membranes pump ions, control what diffuses (e.g. selective ion channels) and send and receive signals (receptors).',
    'An epithelium is a sheet of cells that covers a surface or lines a cavity. A simple epithelium is one cell layer on a nonliving basement membrane; it lines blood vessels, the intestine and other tubes. Epithelia pump ions, secrete (hormones, mucus, enzymes, milk, sweat), absorb nutrients and sense (smell, taste).',
    'Division of labor: tissue = similar cells; organ = two or more tissue types with a set structure; organ system = several organs working together.',
  ],
  terms: [
    ['Intracellular fluid (ICF)', 'Fluid inside cells.'],
    ['Extracellular fluid (ECF)', 'All fluid outside cells: interstitial fluid + plasma.'],
    ['Interstitial fluid', 'Tissue fluid that bathes cells.'],
    ['Simple epithelium', 'One layer of cells on a basement membrane.'],
    ['Basement membrane', 'Nonliving layer that epithelial cells sit on.'],
  ],
};

export default {
  id: 'L2', n: '2', short: 'Nutrition & homeostasis', color: '--b-na', chapter: 'Ch 28.1, 28.2, 28.4',
  title: 'Nutrition, energy and homeostasis',
  minute: [
    'Animals are heterotrophs: food gives them energy and the building blocks for growth and repair.',
    'Life is organized, and order falls apart on its own (2nd law of thermodynamics). It takes constant energy to keep it.',
    'Essential nutrients can’t be made by the body: 8 essential amino acids (+ histidine), omega-3 and omega-6 fatty acids, vitamins and minerals.',
    '1 calorie heats 1 g of water by 1 °C. A food “Calorie” is a kilocalorie (1000 calories).',
    'Metabolic rate = energy used per day, measured by O₂ use. Small animals burn more per gram; activity raises it.',
    'Regulators keep their insides steady (costly); conformers match the outside (cheap). Body water = ICF (inside cells) + ECF (interstitial fluid + plasma).',
  ],
  traps: [
    'A food label “Calorie” = 1 kcal = 1000 calories.',
    'Small animals have a higher metabolic rate PER GRAM, but a big animal uses more energy in total.',
    '“Essential” means it must come from food, not “most important”. You still need nonessential amino acids; you just make them yourself.',
    'Interstitial fluid is extracellular. ECF = interstitial fluid + blood plasma.',
    'Regulating is stable but expensive; conforming is cheap but the cells must cope with change.',
    'Omega-3 / omega-6: the number is the carbon position of the last double bond.',
  ],
  links: [['Blood carries O₂ to fuel metabolism → Lecture 5', 'L5'], ['Epithelia pump ions in the kidney → Lecture 6', 'L6'], ['Digestion turns food into building blocks → Lecture 7', 'L7']],
  scenes: [order, amino, scaling, regulate, compart],
  quiz: [
    { q: 'A snack label says 200 Calories. How many calories (small c) is that?', a: '200,000', o: ['200', '2,000', '20'], why: 'A food Calorie is a kilocalorie, so 200 × 1000 = 200,000 calories.' },
    { q: 'One calorie is the heat needed to…', a: 'Raise 1 g of water by 1 °C', o: ['Raise 1 kg of water by 1 °C', 'Boil 1 g of water', 'Raise 1 g of water by 100 °C'], why: 'That’s the definition. Raising 1 kg by 1 °C is a kilocalorie (a food Calorie).' },
    { q: 'Why do animals need energy even when they’re resting?', a: 'To keep fighting the natural loss of order (2nd law of thermodynamics)', o: ['To make new energy out of nothing', 'Because energy can only be stored as protein', 'To slow their cells down'], why: 'Organized systems drift toward disorder, so it takes constant work, paid for with energy, to stay organized.' },
    { q: 'An essential amino acid is one that…', a: 'The body can’t make, so it must come from food', o: ['Is the most important one for health', 'Is only needed by infants', 'The body makes from fats'], why: '“Essential” is about where it comes from: you can’t make it, so you have to eat it.' },
    { q: 'Why do beans + grains together give all the essential amino acids?', a: 'Each one has the ones the other is short on', o: ['Beans already have all of them', 'Grains turn into beans when digested', 'Cooking makes the missing ones'], why: 'Beans bring isoleucine and lysine; grains bring tryptophan and methionine.' },
    { q: 'Per gram of body, which has the highest basal metabolic rate?', a: 'A mouse', o: ['A human', 'A horse', 'An elephant'], why: 'BMR per gram falls as body size rises, so small mammals need more food for their size.' },
    { q: 'Metabolic rate is usually measured by…', a: 'How fast the animal uses O₂', o: ['How much the animal weighs', 'How much water it drinks', 'How much it sleeps'], why: 'Aerobic metabolism uses O₂ and releases heat, so O₂ use tracks energy use.' },
    { q: 'An alligator’s body temperature drops on a cold January day. It’s a…', a: 'Conformer', o: ['Regulator', 'Heterotroph that can’t digest', 'Homeostatic regulator'], why: 'Its inside follows the outside. That’s cheap, but it gets sluggish.' },
    { q: 'Which fluid is NOT part of the extracellular fluid?', a: 'Fluid inside the cells', o: ['Blood plasma', 'Interstitial fluid', 'Fluid bathing the cells'], why: 'ECF = interstitial fluid + plasma. Fluid inside cells is intracellular fluid.' },
    { q: 'Two or more tissue types joined in a set structure make up a(n)…', a: 'Organ', o: ['Tissue', 'Organ system', 'Cell'], why: 'Tissue = similar cells; organ = 2+ tissue types; organ system = several organs working together.' },
  ],
};
