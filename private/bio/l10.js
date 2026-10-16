// Lecture 10 · Ch 36 · Immunology

import { E, T, Track, at, move, show, setText, smooth, keys, frac, lerp, clamp, gauss, TAU, win, arrowDefs } from './kit.js';
import { fx, pill, pillText, pillAt, ease, eased, env, flow, scaleAt } from './fx-b.js';

// little shape builders --------------------------------------------------------

function bacterium(parent, cls = 'b-bact') {
  const g = E('g', {}, parent);
  E('path', { d: 'M-16,0 q-6,10 -14,8', class: 'b-flag' }, g);
  E('rect', { x: -16, y: -8, width: 32, height: 16, rx: 8, class: cls }, g);
  return g;
}

function virus(parent) {
  const g = E('g', {}, parent);
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * TAU;
    E('line', { x1: Math.cos(a) * 9, y1: Math.sin(a) * 9, x2: Math.cos(a) * 15, y2: Math.sin(a) * 15, class: 'b-spike' }, g);
    E('circle', { cx: Math.cos(a) * 15, cy: Math.sin(a) * 15, r: 2.2, class: 'b-spiketip' }, g);
  }
  E('circle', { r: 10, class: 'b-virus' }, g);
  return g;
}

// Wobbly blob outline for macrophages and other cells.
function blob(r, t, wob = 0.08, seed = 0) {
  let d = '';
  for (let i = 0; i <= 36; i++) {
    const a = i / 36 * TAU;
    const rr = r * (1 + wob * Math.sin(a * 3 + t * 1.7 + seed) + wob * 0.6 * Math.sin(a * 5 - t * 1.3 + seed));
    d += `${i ? 'L' : 'M'}${(Math.cos(a) * rr).toFixed(1)},${(Math.sin(a) * rr).toFixed(1)}`;
  }
  return d + 'z';
}

function antibody(parent, cls = '', tip = 'b-ab-tip') {
  const g = E('g', { class: `b-ab ${cls}` }, parent);
  E('path', { d: 'M0,14 L0,0 L-9,-11 M0,0 L9,-11', class: 'b-ab-heavy' }, g);
  E('path', { d: 'M-4,-1 L-12,-9 M4,-1 L12,-9', class: 'b-ab-light' }, g);
  E('circle', { cx: -10, cy: -12, r: 2.6, class: tip }, g);
  E('circle', { cx: 10, cy: -12, r: 2.6, class: tip }, g);
  return g;
}

// ---------------------------------------------------------------- 1. layers of defense

const layers = {
  id: 'l10-layers', title: 'Layers of defense: innate first, adaptive later', dur: 15,
  build(svg) {
    fx(svg);
    svg.classList.add('has-art', 'art-l10-layers');
    E('image', { href: new URL('./art/l10-layers.jpg', import.meta.url).href, x: 0, y: 0, width: 640, height: 360, preserveAspectRatio: 'none', class: 'b-art' }, svg);
    const g = E('g', {}, svg);
    E('rect', { x: 0, y: 0, width: 160, height: 250, class: 'b-outside' }, g);
    const skinG = E('g', {}, g);
    for (let y = 0; y < 250; y += 20) for (let x = 0; x < 2; x++) E('rect', { x: 160 + x * 22 + (y % 40 ? 11 : 0), y, width: 20, height: 18, rx: 4, class: 'b-skin' }, skinG);
    T(g, 182, 268, 'skin', 'bs b-strong', { 'text-anchor': 'middle' });
    const mucus = E('path', { d: 'M222,0 C232,40 212,80 226,120 C238,160 214,200 226,250 L268,250 C254,200 278,160 266,120 C254,80 274,40 262,0z', class: 'b-mucusband' }, g);
    T(g, 246, 268, 'mucus', 'bs b-strong', { 'text-anchor': 'middle' });
    const defs = Array.from({ length: 6 }, (_, i) => E('circle', { cx: 236 + (i % 2) * 18, cy: 30 + i * 38, r: 3, class: 'p-def' }, g));
    E('rect', { x: 280, y: 0, width: 360, height: 250, class: 'b-tissue-bg' }, g);
    T(g, 600, 22, 'inside the body', 'bs b-strong', { 'text-anchor': 'end' });
    const mac = E('path', { class: 'b-macro' }, g);
    const macN = E('circle', { r: 9, class: 'b-macro-n' }, g);
    T(g, 470, 236, 'macrophage (phagocyte)', 'bs b-strong', { 'text-anchor': 'middle' });
    const germs = Array.from({ length: 11 }, () => bacterium(g));
    pill(g, 40, 22, 'outside world', 'bs b-strong');
    // timeline
    const TX0 = 40, TX1 = 620, TY = 340;
    E('line', { x1: TX0, y1: TY, x2: TX1, y2: TY, class: 'b-axis' }, g);
    [['minutes', 0.03], ['hours', 0.15], ['days', 0.45], ['weeks', 0.85]].forEach(([w, k]) => T(g, lerp(TX0, TX1, k), TY + 15, w, 'bs', { 'text-anchor': 'middle' }));
    const innate = E('path', { class: 'b-resp innate' }, g);
    const adapt = E('path', { class: 'b-resp adaptive' }, g);
    T(g, TX0 + 60, 282, 'innate: fast, general', 'bs b-strong b-teal-t');
    T(g, TX0 + 330, 282, 'adaptive: slow, specific, remembers', 'bs b-strong b-hor-t');
    return (lt, _dt, t) => {
      const MX = 470, MY = 150;
      skinG.classList.toggle('fxb-hl', lt < 5); mucus.classList.toggle('fxb-hl', lt >= 5 && lt < 10); mac.classList.toggle('fxb-hl', lt >= 10);
      mac.setAttribute('d', blob(38, t, 0.07)); mac.setAttribute('transform', `translate(${MX} ${MY})`);
      at(macN, MX - 8, MY - 4);
      defs.forEach((d, i) => d.setAttribute('cx', (236 + (i % 2) * 18 + 4 * Math.sin(t * 2 + i)).toFixed(1)));
      germs.forEach((gm, i) => {
        const u = frac(lt / 5 + i / germs.length);
        const y0 = 20 + (i * 47) % 210;
        let p, op = Math.min(1, Math.sin(Math.PI * u) * 3);
        if (i % 11 < 6) p = keys(u, [[0, [10, y0]], [0.45, [150, y0 + 6]], [1, [40, y0 + 30]]]);           // bounce off skin
        else if (i % 11 < 9) { p = keys(u, [[0, [10, y0]], [0.35, [150, y0]], [0.5, [214, y0 + 4]], [0.6, [238, y0 + 8]], [1, [240, y0 + 12]]]); op *= 1 - smooth(0.7, 1, u); } // stuck + killed in mucus
        else { p = keys(u, [[0, [10, 120]], [0.3, [200, 130]], [0.6, [400, 150]], [0.85, [MX, MY]]]); op *= 1 - smooth(0.8, 0.95, u); } // gets in → eaten
        move(gm, p[0], p[1], 0.85);
        show(gm, op);
      });
      const k = smooth(0, 12, lt);
      let di = '', da = '';
      for (let x = 0; x <= 1.0001; x += 0.01) {
        if (x > k) break;
        di += `${di ? 'L' : 'M'}${lerp(TX0, TX1, x).toFixed(1)},${(TY - 44 * gauss(x, 0.12, 0.07) - 6).toFixed(1)}`;
        da += `${da ? 'L' : 'M'}${lerp(TX0, TX1, x).toFixed(1)},${(TY - 50 * smooth(0.35, 0.7, x) * (1 - 0.3 * smooth(0.8, 1, x)) - 2).toFixed(1)}`;
      }
      innate.setAttribute('d', di || 'M0,0'); adapt.setAttribute('d', da || 'M0,0');
      if (lt < 5) return 'Skin is the first wall: bacteria can rarely get through it';
      if (lt < 10) return 'Openings (gut, airways) are lined with mucus that traps germs, with antimicrobial defensins and friendly microbes that crowd pathogens out. Stomach acid helps too.';
      return 'Anything that gets in meets phagocytes like macrophages that swallow it whole. That’s all innate. The adaptive system takes days to ramp up.';
    };
  },
  plain: [
    'Immunity is about telling self (your own molecules) from nonself (foreign ones). Every response runs in three phases: recognition, activation, effector (destroy the invader).',
    'Innate defenses are general and fast (minutes to hours): barriers, toxic molecules, phagocytes and inflammation. Adaptive defenses target one specific pathogen, take days to weeks, last long and remember.',
    'White blood cells: phagocytes (macrophages, dendritic cells, neutrophils) eat invaders. Lymphocytes: B cells make antibodies, T cells kill or help, NK cells work in both systems. Basophils and eosinophils handle parasites and allergies.',
    'Inside the body, Toll-like receptors (TLRs) spot common microbe patterns (PAMPs) and raise the alarm.',
  ],
  terms: [
    ['Innate vs adaptive', 'General & fast vs specific, slow & with memory.'],
    ['Phagocyte', 'Cell that engulfs invaders (phagocytosis).'],
    ['Defensins', 'Antimicrobial proteins secreted into mucus.'],
    ['TLR / PAMP', 'Toll-like receptors recognize pathogen-associated molecular patterns.'],
  ],
};

// ---------------------------------------------------------------- 2. complement

const complement = {
  id: 'l10-complement', title: 'Complement: a cascade that tags, alarms and punches holes', dur: 14,
  build(svg) {
    fx(svg);
    svg.classList.add('has-art', 'art-l10-complement');
    E('image', { href: new URL('./art/l10-complement.jpg', import.meta.url).href, x: 0, y: 0, width: 640, height: 360, preserveAspectRatio: 'none', class: 'b-art' }, svg);
    const g = E('g', {}, svg);
    const CX = 300, CY = 190, RX = 130, RY = 62;
    E('rect', { x: CX - RX, y: CY - RY, width: RX * 2, height: RY * 2, rx: RY, class: 'b-bact big' }, g);
    T(g, CX, CY + 5, 'bacterium', 'bl b-strong', { 'text-anchor': 'middle' });
    const blood = E('rect', { x: 440, y: 8, width: 160, height: 62, rx: 14, class: 'b-bloodband' }, g);
    T(g, 520, 40, 'to the blood →', 'bs b-strong', { 'text-anchor': 'middle' });
    T(g, 520, 56, 'inflammation', 'bs b-strong b-acid-t', { 'text-anchor': 'middle' });
    const N = 12;
    const perim = i => { const a = (i / N) * TAU + 0.2; return [CX + Math.cos(a) * (RX - 10), CY + Math.sin(a) * (RY + 2)]; };
    const conv = Array.from({ length: 4 }, () => E('path', { d: 'M0,0 L10,-6 A12,12 0 1 0 10,6 Z', class: 'b-enzyme' }, g));
    const c3 = Array.from({ length: N }, () => { const grp = E('g', {}, g); E('circle', { r: 8, class: 'b-c3' }, grp); T(grp, 0, 3.5, 'C3', 'b-c3-t', { 'text-anchor': 'middle' }); return grp; });
    const c3b = Array.from({ length: N }, () => E('circle', { r: 6, class: 'b-c3b' }, g));
    const c3a = Array.from({ length: N }, () => E('circle', { r: 3.5, class: 'b-c3a' }, g));
    const holes = Array.from({ length: 4 }, (_, i) => E('circle', { cx: CX - 60 + i * 40, cy: CY - 30 + (i % 2) * 50, r: 0, class: 'b-hole' }, g));
    const mac = E('path', { class: 'b-macro' }, g);
    T(g, 40, 22, '● C3b: “eat me” tag', 'bs b-strong b-k-t'); T(g, 40, 38, '● C3a: inflammation signal', 'bs b-strong b-acid-t');
    return (lt, _dt, t) => {
      // more convertases appear as C3b piles up (the cascade amplifies itself)
      const nConv = 1 + Math.floor(smooth(2, 8, lt) * 3);
      conv.forEach((c, i) => { const [x, y] = perim(i * 3); move(c, x, y - 4, 1, 180 + 20 * Math.sin(t * 8 + i)); show(c, i < nConv ? 1 : 0); });
      for (let i = 0; i < N; i++) {
        const tc = 1 + i * 0.6; // time this C3 gets cut
        const [px, py] = perim(i);
        const p = keys(lt, [[tc - 1.2, [px - 160, py - 90 + (i % 3) * 40]], [tc, [px, py - 10]]]);
        p[1] += 3 * Math.sin(t * 2 + i) * (lt < tc ? 1 : 0);
        move(c3[i], p[0], p[1]); show(c3[i], lt < tc ? smooth(tc - 1.2, tc - 0.9, lt) : 0);
        at(c3b[i], px, py); show(c3b[i], smooth(tc, tc + 0.3, lt));
        const q = keys(lt, [[tc, [px, py - 10]], [tc + 2.2, [492 + (i % 5) * 14, 22 + (i % 3) * 12]]]);
        at(c3a[i], q[0], q[1]); show(c3a[i], win(lt, tc, tc + 2.4, 0.2));
      }
      holes.forEach((h, i) => h.setAttribute('r', (6 * smooth(9 + i * 0.3, 10 + i * 0.3, lt)).toFixed(1)));
      const mp = keys(lt, [[10.5, [700, 300]], [13, [CX + 150, CY + 40]]]);
      mac.setAttribute('d', blob(40, t, 0.08)); mac.setAttribute('transform', `translate(${mp[0]} ${mp[1]})`);
      blood.classList.toggle('fxb-hl', lt >= 6.5 && lt < 9);
      if (lt < 3) return '① An enzyme called a convertase cuts the complement protein C3 into two pieces';
      if (lt < 6.5) return '② C3b (big piece) sticks to the bacterium and switches on MORE convertase, so the cutting speeds up (a cascade)';
      if (lt < 9) return '③ C3a (small piece) floats off into the blood and triggers inflammation';
      if (lt < 10.5) return 'Other complement proteins punch holes in the invader’s membrane (lysis)';
      return 'And phagocytes love C3b-coated targets: tagged cells get eaten much faster';
    };
  },
  plain: [
    'The complement system is a set of blood proteins that work as a cascade: each one activates the next, so a small trigger turns into a big response.',
    'The key protein is C3. Convertase cuts it: C3b (larger) coats the invader and marks it for phagocytosis; C3a (smaller) activates inflammation. Other complement proteins lyse (burst) invading cells.',
  ],
  terms: [['Complement', 'Antimicrobial blood proteins acting in a cascade.'], ['C3b / C3a', 'Tag for phagocytes / inflammation signal.'], ['Lysis', 'Bursting a cell by punching holes in its membrane.']],
};

// ---------------------------------------------------------------- 3. inflammation

const inflammation = {
  id: 'l10-inflam', title: 'Inflammation: red, hot, swollen, painful', dur: 15,
  build(svg) {
    fx(svg);
    svg.classList.add('has-art', 'art-l10-inflam');
    E('image', { href: new URL('./art/l10-inflam.jpg', import.meta.url).href, x: 0, y: 0, width: 640, height: 360, preserveAspectRatio: 'none', class: 'b-art' }, svg);
    const g = E('g', {}, svg);
    E('rect', { x: 0, y: 0, width: 640, height: 360, class: 'b-tissue-bg' }, g);
    const vessel = E('rect', { x: -10, rx: 20, width: 660, class: 'b-capillary' }, g);
    T(g, 600, 22, 'blood vessel', 'bs b-strong', { 'text-anchor': 'end' });
    const rbc = Array.from({ length: 12 }, () => E('ellipse', { rx: 8, ry: 5, class: 'p-oxy' }, g));
    E('path', { d: 'M300,360 L350,250 L360,256 L312,360z', class: 'b-splinter' }, g);
    T(g, 368, 318, 'splinter', 'bs b-strong');
    const bact = Array.from({ length: 6 }, () => bacterium(g));
    const mac = E('path', { class: 'b-macro' }, g);
    T(g, 150, 330, 'macrophage', 'bs b-strong', { 'text-anchor': 'middle' });
    const cyto = Array.from({ length: 10 }, () => E('circle', { r: 3.4, class: 'p-hor' }, g));
    const neut = Array.from({ length: 3 }, () => { const grp = E('g', {}, g); E('circle', { r: 13, class: 'b-neut' }, grp); E('path', { d: 'M-6,-2 a3,3 0 1 1 5,2 a3,3 0 1 1 4,4 a3,3 0 1 1 -3,4', class: 'b-neut-n' }, grp); return grp; });
    const fluid = Array.from({ length: 10 }, () => E('circle', { r: 3, class: 'p-water' }, g));
    const signs = ['redness', 'heat', 'swelling', 'pain'].map((s, i) => T(g, 470 + (i % 2) * 80, 236 + Math.floor(i / 2) * 22, `● ${s}`, 'bs b-strong b-acid-t'));
    const pus = pill(g, 420, 292, '', 'bs b-strong');
    return (lt, _dt, t) => {
      const dil = smooth(3, 6, lt) * (1 - smooth(13.5, 15, lt));
      const h = 46 + 26 * dil;
      vessel.setAttribute('y', (70 - h / 2).toFixed(1)); vessel.setAttribute('height', h.toFixed(1));
      vessel.classList.toggle('leaky', dil > 0.5);
      rbc.forEach((r, i) => at(r, frac(t * 0.06 + i / 12) * 660 - 10, 70 + (i % 3 - 1) * h * 0.22));
      const MX = 150, MY = 260;
      mac.setAttribute('d', blob(34, t)); mac.setAttribute('transform', `translate(${MX} ${MY})`);
      bact.forEach((b, i) => {
        const home = [320 + (i % 3) * 34, 220 + Math.floor(i / 3) * 30];
        const eatenAt = 9 + i * 0.5;
        move(b, home[0] + Math.sin(t + i) * 4, home[1] + Math.cos(t * 1.2 + i) * 3, 0.8);
        show(b, smooth(0.5, 1.5, lt) * (1 - smooth(eatenAt, eatenAt + 0.4, lt)));
      });
      cyto.forEach((c, i) => {
        const u = frac(t * 0.4 + i / 10);
        const [cx, cy] = flow([MX + 20, MY - 30], [120 + i * 40, 96], ease(u), i, 18, 3, t);
        at(c, cx, cy);
        show(c, win(lt, 2, 13, 0.5) * env(u, 0.2));
      });
      fluid.forEach((f, i) => { const u = frac(t * 0.35 + i / 10); at(f, 60 + i * 55, lerp(70 + h / 2, 170, u)); show(f, dil * Math.sin(Math.PI * u)); });
      neut.forEach((n, i) => {
        const p = keys(lt, [[5 + i * 0.5, [-30 - i * 40, 70]], [7 + i * 0.5, [230 + i * 50, 74]], [8 + i * 0.5, [250 + i * 50, 130]], [9.5 + i * 0.6, [330 + i * 34, 222]]]);
        move(n, p[0], p[1]); show(n, smooth(5, 5.5, lt) * (1 - smooth(13, 14, lt)));
      });
      signs.forEach((s, i) => show(s, smooth(4 + i * 0.8, 5 + i * 0.8, lt)));
      pillText(pus, lt > 11.5 ? 'used-up neutrophils = pus' : ''); show(pus.parentNode, smooth(11.5, 12, lt));
      if (lt < 2) return 'Bacteria get in through a cut';
      if (lt < 5) return 'Macrophages are first on the scene and release cytokines like TNF-α (pink), the alarm signals';
      if (lt < 8) return 'Cytokines widen the vessels (redness, heat) and make them leaky, so fluid seeps out (swelling)';
      if (lt < 11.5) return 'Cytokines also call in neutrophils, which squeeze out of the vessel and eat the bacteria';
      return 'Neutrophils die after the fight and form pus. As the invaders disappear, things calm down again.';
    };
  },
  plain: [
    'Inflammation is a coordinated response to infection or injury: redness, swelling, heat and pain at the site.',
    'TLRs switch on NF-κB, the master regulator of inflammation, which turns on cytokine genes. Cytokines include interleukins, tumor necrosis factor (TNF) and interferons.',
    'Interferons make neighbouring uninfected cells resist viruses. Natural killer (NK) cells recognize virus-infected or tumour cells and make them self-destruct (apoptosis).',
  ],
  terms: [['Cytokines', 'Signalling proteins of the immune system (interleukins, TNF, interferons).'], ['NF-κB', 'Master switch for inflammation genes.'], ['Neutrophil', 'Phagocyte that arrives fast, eats bacteria, then dies (pus).'], ['NK cell', 'Lymphocyte that kills infected and tumour cells.']],
};

// ---------------------------------------------------------------- 4. clonal selection

const SHAPES = ['M0,-7 L7,6 L-7,6z', 'M-6,-6 h12 v12 h-12z', 'M0,-7 L7,0 L0,7 L-7,0z', 'M-7,-3 h14 v6 h-14z', 'M0,-8 L2,-2 L8,-2 L3,2 L5,8 L0,4 L-5,8 L-3,2 L-8,-2 L-2,-2z', 'M-7,0 a7,7 0 1 0 14,0 a7,7 0 1 0 -14,0'];

const clonal = {
  id: 'l10-clonal', title: 'Clonal selection: the antigen picks its B cell', dur: 16,
  build(svg) {
    fx(svg);
    const g = E('g', {}, svg);
    const cells = Array.from({ length: 6 }, (_, i) => {
      const grp = E('g', {}, g);
      E('circle', { r: 22, class: 'b-bcell' }, grp);
      E('circle', { r: 9, class: 'b-bcell-n' }, grp);
      for (let k = 0; k < 4; k++) { const a = k / 4 * TAU + 0.6; const s = E('path', { d: SHAPES[i], class: `b-receptor-s s${i}`, transform: `translate(${Math.cos(a) * 26} ${Math.sin(a) * 26}) scale(0.7)` }, grp); void s; }
      return { grp, x: 60 + i * 104, y: 70 };
    });
    T(g, 320, 22, 'every B cell is born with its own unique receptor', 'bs b-strong', { 'text-anchor': 'middle' });
    const selfX = pill(g, 0, 0, 'reacts to self → deleted', 'bs b-strong b-acid-t', { 'text-anchor': 'middle' });
    const antigen = E('path', { d: SHAPES[4], class: 'b-antigen', transform: 'scale(1.6)' }, g);
    const agWrap = E('g', {}, g); agWrap.append(antigen);
    const agT = T(g, 0, 0, 'antigen', 'bs b-strong b-gold-t', { 'text-anchor': 'middle' });
    // clones
    const clones = Array.from({ length: 10 }, (_, i) => {
      const grp = E('g', {}, g);
      const plasma = i % 3 !== 2;
      E('circle', { r: plasma ? 18 : 15, class: plasma ? 'b-plasma' : 'b-memory' }, grp);
      T(grp, 0, 4, plasma ? '' : 'M', 'bs b-strong', { 'text-anchor': 'middle' });
      return { grp, plasma, x: 120 + (i % 5) * 100, y: 210 + Math.floor(i / 5) * 70 };
    });
    const abs = Array.from({ length: 16 }, () => antibody(g, '', 'b-ab-tip s4f'));
    T(g, 600, 350, 'M = memory cell', 'bs', { 'text-anchor': 'end' });
    return (lt, _dt, t) => {
      // a self-reactive cell (index 1) is deleted during development
      const del = smooth(1, 2.6, lt);
      cells.forEach((c, i) => {
        const sel = i === 4 && lt > 6;
        move(c.grp, c.x, c.y + (sel ? -4 * Math.sin(t * 6) : 1.5 * Math.sin(t * 1.4 + i)), i === 1 ? 1 - 0.9 * del : sel ? 1.12 : 1);
        show(c.grp, i === 1 ? 1 - del : 1);
        c.grp.classList.toggle('chosen', sel);
      });
      pillAt(selfX, cells[1].x, 120); show(selfX.parentNode, win(lt, 0.6, 3.4, 0.3));
      const ap = keys(lt, [[3, [40, 330]], [4, [cells[0].x, 112]], [4.6, [cells[2].x, 112]], [5.2, [cells[3].x, 112]], [6, [cells[4].x, 104]]]);
      agWrap.setAttribute('transform', `translate(${ap[0]} ${ap[1]})`);
      show(agWrap, smooth(3, 3.3, lt)); agT.setAttribute('x', ap[0]); agT.setAttribute('y', ap[1] + 26); show(agT, win(lt, 3, 6, 0.2));
      clones.forEach((c, i) => {
        const k = eased(7 + i * 0.25, 8.2 + i * 0.25, lt);
        move(c.grp, lerp(cells[4].x, c.x, k), lerp(cells[4].y, c.y, k) + 1.5 * Math.sin(t * 1.3 + i) * k, 0.4 + 0.6 * k);
        show(c.grp, k);
      });
      abs.forEach((a, i) => {
        const src = clones.filter(c => c.plasma)[i % 7];
        const u = frac(t * 0.35 + i / abs.length);
        a.setAttribute('transform', `translate(${(src.x + Math.cos(i) * u * 50).toFixed(1)} ${(src.y + 20 + u * 40).toFixed(1)}) rotate(${(i * 40 + t * 30) % 360})`);
        show(a, smooth(10, 11, lt) * Math.sin(Math.PI * u));
      });
      if (lt < 3) return 'While B cells develop, any that would attack your own molecules self-destruct (clonal deletion). If that fails → autoimmunity.';
      if (lt < 6) return 'An antigen tries the receptors one by one…';
      if (lt < 7) return '…and binds only the B cell whose receptor fits. That cell is “selected”.';
      if (lt < 10) return 'The selected cell multiplies into a clone: an army of identical cells (clonal selection)';
      return 'Plasma cells pump out antibodies; memory cells stay behind for next time';
    };
  },
  plain: [
    'Your body pre-makes millions of different B and T cells, each with a random, unique receptor (made by shuffling DNA while the cell develops). That’s how it can recognize almost anything.',
    'When an antigen shows up, it binds the matching cell and “selects” it to multiply: clonal selection. The clone becomes effector cells (e.g. antibody-making plasma cells) and memory cells.',
    'Cells that react to self are deleted during development (clonal deletion). When that fails, the result is autoimmunity.',
    'Antigens are usually proteins, sometimes lipids or carbohydrates. The exact spot a receptor or antibody binds is an epitope; one antigen can have many.',
  ],
  terms: [['Antigen', 'Foreign molecule recognized by T-cell receptors or antibodies.'], ['Epitope', 'The specific part of the antigen that’s recognized.'], ['Clonal selection', 'The antigen picks the matching lymphocyte, which then multiplies.'], ['Clonal deletion', 'Removal of self-reactive lymphocytes during development.']],
};

// ---------------------------------------------------------------- 5. antibodies

const antibodies = {
  id: 'l10-antibody', title: 'Antibodies: what they look like and what they do', dur: 10,
  vars: { fn: 'neutral' },
  build(svg, s, ui) {
    ui.seg('fn', [['neutral', 'Neutralization'], ['opson', 'Opsonization'], ['comp', 'Complement']], 'Function');
    fx(svg);
    svg.classList.add('has-art', 'art-l10-antibody');
    E('image', { href: new URL('./art/l10-antibody.jpg', import.meta.url).href, x: 0, y: 0, width: 640, height: 360, preserveAspectRatio: 'none', class: 'b-art' }, svg);
    const g = E('g', {}, svg);
    // big labelled Y on the left
    const Y = E('g', { transform: 'translate(120 200) scale(4.6)' }, g);
    const yBreath = t => Y.setAttribute('transform', `translate(120 ${(200 + 1.5 * Math.sin(t * 1.2)).toFixed(2)}) scale(4.6)`);
    E('path', { d: 'M0,22 L0,0 L-12,-14 M0,0 L12,-14', class: 'b-ab-heavy big' }, Y);
    E('path', { d: 'M-5,-2 L-15,-12 M5,-2 L15,-12', class: 'b-ab-light big' }, Y);
    E('path', { d: 'M-12,-14 l-3,-3 M12,-14 l3,-3', class: 'b-ab-var' }, Y);
    T(g, 120, 60, 'variable region', 'bs b-strong b-gold-t', { 'text-anchor': 'middle' });
    T(g, 120, 76, '(unique: binds the antigen)', 'bs', { 'text-anchor': 'middle' });
    T(g, 154, 286, 'constant region', 'bs b-strong');
    T(g, 154, 302, '(sets the class: IgA, IgD,', 'bs'); T(g, 154, 318, 'IgE, IgG, IgM)', 'bs');
    T(g, 40, 250, '— heavy chains', 'bs b-strong b-k-t'); T(g, 40, 268, '— light chains', 'bs b-strong b-teal-t');
    E('line', { x1: 290, y1: 20, x2: 290, y2: 340, class: 'b-grid' }, g);
    // right: the selected function
    const host = E('rect', { x: 440, y: 280, width: 160, height: 60, rx: 14, class: 'b-cellbody' }, g);
    const hostT = T(g, 520, 316, 'your cell', 'bs b-strong', { 'text-anchor': 'middle' });
    const vir = virus(g);
    const bac = bacterium(g, 'b-bact');
    const coat = Array.from({ length: 6 }, () => antibody(g));
    const c3 = Array.from({ length: 6 }, () => E('circle', { r: 4.5, class: 'b-c3b' }, g));
    const mac = E('path', { class: 'b-macro' }, g);
    const burst = Array.from({ length: 8 }, () => E('circle', { r: 3, class: 'b-bact-bit' }, g));
    return (lt, _dt, t) => {
      const fn = s.vars.fn;
      const k = lt / 10;
      yBreath(t);
      show(host, fn === 'neutral' ? 1 : 0); show(hostT, fn === 'neutral' ? 1 : 0);
      show(vir, fn === 'neutral' ? 1 : 0); show(bac, fn === 'neutral' ? 0 : 1 - (fn === 'comp' ? smooth(0.75, 0.8, k) : smooth(0.8, 0.85, k)));
      const target = fn === 'neutral' ? keys(k, [[0, [420, 60]], [0.4, [500, 160]], [0.6, [540, 252]], [0.75, [520, 200]], [1, [430, 120]]]) : [470, 170];
      if (fn === 'neutral') move(vir, target[0], target[1]); else move(bac, target[0], target[1], 2);
      coat.forEach((a, i) => {
        const ang = i / 6 * TAU;
        const r = fn === 'neutral' ? 22 : 40;
        const from = [340 + (i % 3) * 30, 20 + Math.floor(i / 3) * 300];
        const to = [target[0] + Math.cos(ang) * r, target[1] + Math.sin(ang) * r * (fn === 'neutral' ? 1 : 0.6)];
        const u = smooth(0.05 + i * 0.03, 0.3 + i * 0.03, k);
        a.setAttribute('transform', `translate(${lerp(from[0], to[0], u).toFixed(1)} ${lerp(from[1], to[1], u).toFixed(1)}) rotate(${(ang * 180 / Math.PI + 90).toFixed(0)}) scale(0.9)`);
        show(a, fn === 'comp' ? 1 - smooth(0.75, 0.8, k) : fn === 'opson' ? 1 - smooth(0.8, 0.85, k) : 1);
      });
      c3.forEach((c, i) => { const ang = i / 6 * TAU + 0.5; at(c, target[0] + Math.cos(ang) * 52, target[1] + Math.sin(ang) * 30); show(c, fn === 'comp' ? smooth(0.35 + i * 0.03, 0.45 + i * 0.03, k) * (1 - smooth(0.75, 0.8, k)) : 0); });
      burst.forEach((b, i) => { const ang = i / 8 * TAU; const u = smooth(0.78, 0.95, k); at(b, target[0] + Math.cos(ang) * u * 70, target[1] + Math.sin(ang) * u * 50); show(b, fn === 'comp' ? win(k, 0.78, 0.95, 0.03) : 0); });
      const mp = keys(k, [[0.4, [700, 300]], [0.75, [target[0] + 30, target[1] + 30]]]);
      mac.setAttribute('d', blob(fn === 'opson' && k > 0.75 ? 62 : 46, t)); mac.setAttribute('transform', `translate(${mp[0]} ${mp[1]})`);
      show(mac, fn === 'opson' ? 1 : 0);
      if (fn === 'neutral') return k < 0.4 ? 'Neutralization: antibodies cover the virus’s spikes…' : '…so it can’t latch onto your cell and just bounces off';
      if (fn === 'opson') return k < 0.4 ? 'Opsonization: antibodies coat the bacterium like “eat me” tags…' : '…and phagocytes grab and swallow coated targets much faster';
      return k < 0.4 ? 'Complement activation: bound antibodies switch on the complement cascade…' : '…complement proteins pile on and burst the invader';
    };
  },
  plain: [
    'Antibodies (immunoglobulins) are Y-shaped: two heavy chains and two light chains. Each chain has a variable region (different in every antibody, it binds the antigen) and a constant region (shared within a class: IgA, IgD, IgE, IgG, IgM).',
    'Three jobs: neutralization (block the pathogen from working), opsonization (tag it for phagocytes) and complement activation.',
  ],
  terms: [['Immunoglobulin', 'Another name for antibody.'], ['Variable vs constant region', 'Antigen-binding tips vs the stem that sets the class.'], ['Opsonization', 'Coating a pathogen so phagocytes eat it.']],
};

// ---------------------------------------------------------------- 6. T cells and MHC

const tcells = {
  id: 'l10-tcells', title: 'T cells only look at antigens shown on MHC', dur: 12,
  vars: { cls: 'one' },
  build(svg, s, ui) {
    ui.seg('cls', [['one', 'Class I → cytotoxic T'], ['two', 'Class II → helper T']], 'MHC class');
    fx(svg);
    const g = E('g', {}, svg);
    const left = E('path', { class: 'b-cellshape' }, g);
    const leftT = T(g, 150, 330, '', 'bs b-strong', { 'text-anchor': 'middle' });
    const mhc = E('path', { d: 'M-12,-14 L-12,0 Q0,8 12,0 L12,-14', class: 'b-mhc' }, g);
    const pep = E('circle', { r: 5, class: 'b-pep' }, g);
    const viruses = Array.from({ length: 4 }, () => virus(g));
    const tcell = E('g', {}, g);
    E('circle', { r: 30, class: 'b-tcell' }, tcell);
    E('circle', { r: 12, class: 'b-tcell-n' }, tcell);
    E('path', { d: 'M-34,-6 l-8,0 M-34,6 l-8,0', class: 'b-tcr' }, tcell);
    const tT = T(g, 0, 0, '', 'bs b-strong', { 'text-anchor': 'middle' });
    const bits = Array.from({ length: 8 }, () => E('circle', { r: 6, class: 'b-cellbit' }, g));
    const cyt = Array.from({ length: 8 }, () => E('circle', { r: 3.5, class: 'p-hor' }, g));
    const bcell = E('g', {}, g); E('circle', { r: 22, class: 'b-bcell' }, bcell); E('circle', { r: 9, class: 'b-bcell-n' }, bcell);
    const abs = Array.from({ length: 6 }, () => antibody(g));
    return (lt, _dt, t) => {
      const one = s.vars.cls === 'one';
      const CX = 150, CY = 190;
      const dying = one ? smooth(8, 9.5, lt) : 0;
      left.setAttribute('d', blob(one ? 70 : 64, t, one ? 0.03 + 0.15 * dying : 0.08, 2));
      left.setAttribute('transform', `translate(${CX} ${CY}) scale(${1 - 0.5 * dying})`);
      left.setAttribute('class', `b-cellshape ${one ? 'infected' : 'apc'}`);
      show(left, 1 - smooth(9.3, 9.8, lt) * (one ? 1 : 0));
      setText(leftT, one ? 'infected body cell' : 'antigen-presenting cell (macrophage / dendritic)');
      viruses.forEach((v, i) => { move(v, CX - 30 + (i % 2) * 40 + 2 * Math.sin(t * 1.6 + i), CY - 20 + Math.floor(i / 2) * 36 + 2 * Math.cos(t * 1.3 + i * 2), 0.7, (t * 20 + i * 40) % 360); show(v, one ? 1 - dying : 0); });
      move(mhc, CX + 70, CY, 1, 90); show(mhc, 1 - dying);
      at(pep, CX + 80, CY); show(pep, smooth(1, 2, lt) * (1 - dying));
      const tp = keys(lt, [[2, [700, CY]], [5, [CX + 128, CY]]]);
      tp[1] += 2 * Math.sin(t * 1.5);
      move(tcell, tp[0], tp[1]);
      tcell.setAttribute('class', one ? 'tc-killer' : 'tc-helper');
      setText(tT, one ? 'cytotoxic T cell' : 'helper T cell'); tT.setAttribute('x', tp[0]); tT.setAttribute('y', tp[1] + 50);
      bits.forEach((b, i) => { const a = i / 8 * TAU; const u = smooth(9.2, 11, lt); at(b, CX + Math.cos(a) * (20 + u * 60), CY + Math.sin(a) * (20 + u * 50)); show(b, one ? win(lt, 9.2, 11.5, 0.3) : 0); });
      cyt.forEach((c, i) => { const u = frac(t * 0.5 + i / 8); at(c, lerp(tp[0] + 20, 520, u), lerp(tp[1] - 10, 90 + (i % 3) * 10, u)); show(c, one ? 0 : smooth(6, 6.5, lt) * Math.sin(Math.PI * u)); });
      move(bcell, 540, 90, 1 + 0.08 * Math.sin(t * 4) * smooth(7, 8, lt)); show(bcell, one ? 0 : smooth(5.5, 6, lt));
      abs.forEach((a, i) => { const u = frac(t * 0.4 + i / 6); a.setAttribute('transform', `translate(${(540 + Math.cos(i * 1.3) * u * 70).toFixed(1)} ${(90 + Math.sin(i * 1.3) * u * 50 + 20).toFixed(1)}) rotate(${i * 60})`); show(a, one ? 0 : smooth(8.5, 9.5, lt) * Math.sin(Math.PI * u)); });
      if (one) {
        if (lt < 2) return 'A virus is hiding inside this body cell';
        if (lt < 5) return 'The cell chops up viral proteins and shows a piece on its surface in a class I MHC “display cup”';
        if (lt < 8) return 'A cytotoxic T cell whose receptor fits that MHC + peptide combo docks on';
        return 'It orders the infected cell to self-destruct (apoptosis), taking the virus down with it';
      }
      if (lt < 2) return 'A phagocyte has eaten a pathogen and travelled to a lymph node';
      if (lt < 5) return 'It shows pieces of the pathogen on class II MHC';
      if (lt < 8) return 'A helper T cell recognizes it, becomes activated and releases cytokines';
      return 'Helper T cells (T_FH) team up with B cells that saw the same antigen → the B cells fully activate and make antibodies';
    };
  },
  plain: [
    'T-cell receptors can’t see a free-floating antigen. They only bind antigen pieces displayed by MHC (major histocompatibility complex) proteins on another cell.',
    'Class I MHC → activates cytotoxic T cells, which kill virus-infected, stressed or cancer cells. Class II MHC → activates helper T cells, which help many other immune cells.',
    'Phagocytes that ate invaders carry them to lymph nodes and present the antigen to naïve T cells. B cells process antigen too and present it to T_FH helper cells; the pair activate each other with cytokines.',
  ],
  terms: [['MHC', 'Surface protein that displays antigen pieces to T cells.'], ['Cytotoxic T cell', 'Kills infected cells (class I MHC).'], ['Helper T cell', 'Coordinates and activates other cells (class II MHC).'], ['Antigen-presenting cell', 'Macrophage, dendritic cell or B cell showing antigen on MHC II.']],
};

// ---------------------------------------------------------------- 7. memory and vaccines

const memory = {
  id: 'l10-memory', title: 'Immune memory and vaccines', dur: 16,
  reset(s) { s.vars._ex = null; },
  build(svg, s, ui) {
    ui.button('Booster now', st => { const ex = st.vars._ex || (st.vars._ex = [0, 45]); const day = curDay; if (!ex.some(d => Math.abs(d - day) < 6)) ex.push(day); ex.sort((a, b) => a - b); });
    let curDay = 0;
    const fid = fx(svg);
    const g = E('g', {}, svg);
    const GX0 = 60, GX1 = 620, GY = 300, GH = 250, DAYS = 120;
    const gx = d => GX0 + d / DAYS * (GX1 - GX0);
    E('path', { d: `M${GX0},${GY - GH} L${GX0},${GY} L${GX1},${GY}`, class: 'b-axis' }, g);
    for (let d = 0; d <= DAYS; d += 20) T(g, gx(d), GY + 16, `${d}`, 'bs', { 'text-anchor': 'middle' });
    T(g, (GX0 + GX1) / 2, GY + 36, 'days', 'bs', { 'text-anchor': 'middle' });
    T(g, 24, GY - GH / 2, 'antibodies in blood', 'bs', { 'text-anchor': 'middle', transform: `rotate(-90 24 ${GY - GH / 2})` });
    const ag = E('linearGradient', { id: `${fid}-area`, x1: 0, y1: 0, x2: 0, y2: 1 }, svg.querySelector('defs'));
    E('stop', { offset: 0, style: 'stop-color: var(--b-hor); stop-opacity: .28' }, ag); E('stop', { offset: 1, style: 'stop-color: var(--b-hor); stop-opacity: 0' }, ag);
    const area = E('path', { fill: `url(#${fid}-area)` }, g);
    const curve = E('path', { class: 'b-curve' }, g);
    const pen = E('circle', { r: 5, class: 'b-spark' }, g);
    const marks = Array.from({ length: 8 }, () => { const grp = E('g', {}, g); E('line', { y1: GY, y2: GY - GH, class: 'b-mark blue' }, grp); T(grp, 0, GY - GH - 6, '💉', 'bs fxb-nohalo', { 'text-anchor': 'middle' }); return grp; });
    const labels = Array.from({ length: 8 }, () => pill(g, 0, 0, '', 'bs b-strong b-hor-t', { 'text-anchor': 'middle' }));
    const cursor = E('line', { y1: GY, y2: GY - GH, class: 'b-grid' }, g);
    const level = (day, ex) => {
      let v = 0;
      ex.forEach((d0, k) => {
        const dt = day - d0; if (dt < 0) return;
        const lag = k === 0 ? 10 : 3, peak = Math.min(1, 0.22 * 2.6 ** k), rise = k === 0 ? 6 : 3;
        v += peak * smooth(lag, lag + rise, dt) * Math.exp(-Math.max(0, dt - lag - rise) / (k === 0 ? 14 : 30));
      });
      return Math.min(1.05, v);
    };
    return (lt) => {
      if (!s.vars._ex) s.vars._ex = [0, 45];
      const ex = s.vars._ex;
      curDay = lt / this.dur * DAYS;
      let d = '';
      for (let day = 0; day <= curDay; day += 0.5) d += `${day ? 'L' : 'M'}${gx(day).toFixed(1)},${(GY - level(day, ex) * GH * 0.9).toFixed(1)}`;
      curve.setAttribute('d', d || 'M0,0');
      area.setAttribute('d', d ? `${d}L${gx(curDay).toFixed(1)},${GY}L${GX0},${GY}z` : 'M0,0');
      at(pen, gx(curDay), GY - level(curDay, ex) * GH * 0.9);
      cursor.setAttribute('x1', gx(curDay)); cursor.setAttribute('x2', gx(curDay));
      marks.forEach((m, i) => { if (i < ex.length && ex[i] <= curDay) { m.setAttribute('transform', `translate(${gx(ex[i])} 0)`); show(m, 1); } else show(m, 0); });
      labels.forEach((l, i) => {
        if (i < ex.length && curDay > ex[i] + 14) {
          pillText(l, ['primary', 'secondary', 'tertiary', '4th', '5th', '6th', '7th', '8th'][i]);
          pillAt(l, gx(ex[i] + 22), GY - level(ex[i] + 14, ex.slice(0, i + 1)) * GH * 0.9 - 18); show(l.parentNode, smooth(ex[i] + 14, ex[i] + 18, curDay));
        } else show(l.parentNode, 0);
      });
      const last = [...ex].reverse().find(e => e <= curDay);
      const idx = ex.indexOf(last);
      if (idx <= 0) return curDay < 10 ? 'First exposure (or first vaccine dose): nothing happens for a while…' : 'Primary response: it takes 1–2 weeks to build antibodies and T cells, and the peak is small';
      return idx === 1 ? 'Second exposure: memory cells were waiting, so the response is almost immediate and much bigger' : 'Each exposure makes the response stronger and more specific. That’s why boosters work!';
    };
  },
  plain: [
    'After the first encounter, memory B and T cells stay around in a partly-activated state. Next time, they respond faster and stronger (secondary response), and stronger still after that.',
    'Vaccines give you that memory without having the disease. Multiple boosters → more protection. Try the “Booster now” button.',
  ],
  terms: [['Primary response', 'First exposure: slow (1–2 weeks), small.'], ['Secondary response', 'Later exposures: fast, big, specific, thanks to memory cells.'], ['Vaccination', 'Building immune memory without getting sick.']],
};

export default {
  id: 'L10', n: '10', short: 'Immunology', color: '--b-teal', chapter: 'Ch 36',
  title: 'Immunology: how the body defends itself',
  minute: [
    'Immunity = telling self from nonself. Three phases: recognize, activate, destroy (effector).',
    'Innate = general, fast (minutes–hours): skin, mucus, acid, good microbes, TLRs, complement, phagocytes, NK cells, inflammation.',
    'Complement: convertase splits C3 → C3b tags invaders for eating, C3a triggers inflammation; others punch holes.',
    'Inflammation: macrophage cytokines (e.g. TNF-α) → vessels widen and leak, neutrophils arrive (redness, heat, swelling, pain; pus).',
    'Adaptive = specific, slow, remembers. Unique receptors from DNA shuffling; antigen selects a clone; self-reactive cells deleted.',
    'Antibodies (B cells): neutralize, opsonize, activate complement. T cells read antigen on MHC: I → cytotoxic, II → helper. Memory → stronger 2nd response; vaccines.',
  ],
  traps: [
    'C3b = big piece = tags for phagocytosis. C3a = small piece = inflammation.',
    'MHC class I → cytotoxic T cells. MHC class II → helper T cells.',
    'NK cells work in BOTH innate and adaptive defense.',
    'Interferons protect NEIGHBOURING cells from viruses.',
    'Variable region = binds antigen (unique). Constant region = antibody class.',
    'Failed clonal deletion → autoimmunity.',
  ],
  links: [['Lymph nodes and lymph vessels → Lecture 5', 'L5'], ['Stomach acid as a barrier → Lecture 7', 'L7'], ['Cytokines are chemical signals, like hormones → Lecture 9', 'L9']],
  scenes: [layers, complement, inflammation, clonal, antibodies, tcells, memory],
  quiz: [
    { q: 'Which is an innate defense?', a: 'Mucus with defensins', o: ['Antibodies from plasma cells', 'Memory T cells', 'Clonal selection'], why: 'Innate defenses are general and fast: barriers, mucus, acid, phagocytes, complement, inflammation.' },
    { q: 'What do Toll-like receptors recognize?', a: 'Pathogen-associated molecular patterns (PAMPs)', o: ['Self antigens', 'MHC class II', 'Antibody constant regions'], why: 'TLRs spot common microbe structures and switch on inflammation (via NF-κB).' },
    { q: 'When convertase splits C3, what does C3b do?', a: 'Coats the pathogen and marks it for phagocytosis', o: ['Travels in blood to trigger inflammation', 'Becomes an antibody', 'Kills virus-infected cells'], why: 'C3b (larger piece) tags; C3a (smaller) triggers inflammation.' },
    { q: 'Which cells form pus?', a: 'Neutrophils that died after eating bacteria', o: ['Plasma cells', 'Red blood cells', 'Memory B cells'], why: 'Cytokines call neutrophils in; they destroy pathogens, then die and form pus.' },
    { q: 'Interferons mainly…', a: 'Help nearby uninfected cells resist viruses', o: ['Punch holes in bacteria', 'Bind antigens like antibodies', 'Present antigen on MHC'], why: 'They bind uninfected cells and trigger pathways that block viral replication.' },
    { q: 'Clonal selection means…', a: 'An antigen activates the one lymphocyte whose receptor fits, which then multiplies', o: ['Self-reactive cells are destroyed', 'All B cells multiply when any antigen appears', 'T cells choose which antibodies to make'], why: 'The antigen “selects” the matching cell, which forms a clone. Destroying self-reactive cells is clonal deletion.' },
    { q: 'Which part of an antibody binds the antigen?', a: 'The variable region at the tips', o: ['The constant region', 'The heavy-chain stem only', 'The MHC'], why: 'Variable regions differ in every antibody; constant regions define the class (IgA, IgD, IgE, IgG, IgM).' },
    { q: 'Opsonization is when antibodies…', a: 'Coat a pathogen so phagocytes eat it', o: ['Block a virus from entering cells', 'Burst a cell with complement', 'Make memory cells'], why: 'Neutralization = blocking; opsonization = tagging for phagocytes; complement activation = lysis.' },
    { q: 'A cytotoxic T cell recognizes antigen presented on…', a: 'Class I MHC', o: ['Class II MHC', 'Free antigen in the blood', 'An antibody'], why: 'Class I → cytotoxic T (kill infected cells). Class II → helper T.' },
    { q: 'Why is the secondary immune response faster?', a: 'Memory B and T cells already exist', o: ['The pathogen is weaker the second time', 'Innate defenses learn', 'Antibodies from the first time never leave'], why: 'Memory cells stay partially activated, so they respond almost immediately and more strongly.' },
  ],
};
