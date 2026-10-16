// Lecture 1 · Ch 22.1–22.2 · Animal origins and diversity

import { E, T, Track, at, move, show, setText, smooth, keys, frac, lerp, gauss, TAU, win, arrowDefs } from './kit.js';
import { polish, fit, pill, pills, breath, scaleAbout, drift, ease, life, flag, beadify } from './fx-a.js';

const DEG = Math.PI / 180;
const MID = { 'text-anchor': 'middle' };

// ---------------------------------------------------------------- 1. from one cell to a team of cells

/** A choanoflagellate-style collar cell, drawn pointing up (flagellum at local −y). */
function collarCell(parent) {
  const g = E('g', {}, parent);
  const flag = E('path', { class: 'b-flag' }, g);
  E('path', { d: 'M-4,-9 L-9,-27 M-2,-10 L-4.5,-28 M0,-10 L0,-28.5 M2,-10 L4.5,-28 M4,-9 L9,-27', class: 'b-collar' }, g);
  const body = E('ellipse', { cx: 0, cy: 0, rx: 8, ry: 11, class: 'b-choano' }, g);
  E('circle', { cx: 0, cy: 2, r: 3, class: 'b-choano-n' }, g);
  return { g, flag, body, role: null };
}
function flagPath(t, ph, len, amp) {
  let d = 'M0,-10';
  for (let k = 1; k <= 12; k++) {
    const f = k / 12;
    d += ` L${(amp * f * Math.sin(f * 7 - t * 10 + ph)).toFixed(1)},${(-10 - f * len).toFixed(1)}`;
  }
  return d;
}

const colony = {
  id: 'l1-colony', title: 'From one cell to a team of cells', dur: 16,
  build(svg) {
    polish(svg);
    // painted pond-water backdrop only: the cells, bacteria and sponge all move or fade, so they stay drawn
    svg.classList.add('has-art', 'art-l1-colony');
    E('image', { href: new URL('./art/l1-colony.jpg', import.meta.url).href, x: 0, y: 0, width: 640, height: 360, preserveAspectRatio: 'none', class: 'b-art' }, svg);
    const g = E('g', {}, svg);
    const CX = 210, CY = 190, N = 8;
    // the sponge (fades in at the end)
    const sponge = E('g', {}, g);
    const wall = new Track(sponge, 'M168,46 C128,70 102,122 100,182 C98,252 128,302 162,334 L258,334 C292,302 322,252 320,182 C318,122 292,70 252,46', { class: 'b-sponge' });
    const poreEls = Array.from({ length: 6 }, () => E('circle', { r: 5.5, class: 'b-spore' }, sponge));
    const spics = Array.from({ length: 6 }, () => E('path', { d: 'M-8,0 L8,0 M-4,-6 L4,6', class: 'b-spic' }, sponge));
    const water = Array.from({ length: 8 }, () => E('circle', { r: 3.5, class: 'p-water' }, g));
    const cells = Array.from({ length: N }, () => collarCell(g));
    const bact = Array.from({ length: 12 }, () => E('ellipse', { rx: 3.8, ry: 2.3, class: 'b-bact' }, g));
    // the story steps on the right
    const STEPS = ['1. A single cell', '2. A colony', '3. Jobs get split up', '4. A sponge: an animal!'];
    const boxes = STEPS.map((text, i) => {
      const r = E('rect', { x: 408, y: 26 + i * 54, width: 196, height: 40, rx: 12, class: 'b-node-box' }, g);
      r.t = T(g, 422, 52 + i * 54, text, 'bl b-strong fx-fade');
      return r;
    });
    const leg = [0, 1, 2].map(i => T(g, 412, 270 + i * 22, '', 'bs b-strong'));
    const LEG_JOBS = [[412, '● eats: collar traps food', 'bs b-strong b-glu-t'], [412, '● swims: long whip', 'bs b-strong b-hor-t'], [412, '● makes new cells', 'bs b-strong b-gold-t']];
    const LEG_SPONGE = [[412, '● collar cells (choanocytes)', 'bs b-strong b-glu-t'], [412, '● water flows in the pores…', 'bs b-strong b-water-t'], [426, '…and out the top', 'bs']];
    const ROLE = i => (i % 4 === 0 ? 'rep' : i % 2 ? 'feed' : 'swim');
    let pores = null;
    const tip = [];
    return (lt, _dt, t) => {
      if (!pores) {
        // place pores and spicules along the sponge wall once the path can be measured
        pores = [0.15, 0.27, 0.38, 0.62, 0.73, 0.85].map(u => wall.pos(u));
        poreEls.forEach((p, i) => at(p, pores[i][0], pores[i][1]));
        [0.08, 0.21, 0.32, 0.68, 0.79, 0.92].forEach((u, i) => { const [x, y] = wall.pos(u); move(spics[i], x, y, 1, wall.angle(u) / DEG); });
      }
      const step = lt < 3.5 ? 0 : lt < 7.5 ? 1 : lt < 11.5 ? 2 : 3;
      boxes.forEach((b, i) => { b.classList.toggle('lit', i === step); flag(b.t, 'fx-dim', i !== step); });
      scaleAbout(sponge, CX, 190, 1 + 0.012 * breath(t, 4.6));
      const spin = keys(lt, [[3.5, 0], [11.5, 40]]) * DEG;
      const Rr = keys(lt, [[11.5, 48], [13, 74]]);
      const flip = smooth(11.5, 13, lt);
      cells.forEach((c, i) => {
        const a = -Math.PI / 2 + i * TAU / N + spin;
        let x = CX + Rr * Math.cos(a), y = CY + Rr * Math.sin(a), sc, rot = a / DEG + 90 + flip * 180;
        if (i === 0) {
          const k = smooth(3.5, 4.7, lt);
          x = lerp(CX, x, k); y = lerp(CY + 10, y, k); sc = lerp(1.7, 1, k); rot = lerp(0, rot, k);
        } else sc = smooth(4 + i * 0.15, 4.9 + i * 0.15, lt);
        const role = step === 2 ? ROLE(i) : step === 3 ? 'feed' : '';
        if (c.role !== role) { c.role = role; c.body.setAttribute('class', `b-choano ${role}`); }
        const big = role === 'rep' ? 1.25 : 1;
        move(c.g, x, y + Math.sin(t * 2 + i) * 1.2, Math.max(0.001, sc * big), rot);
        show(c.g, sc > 0.02 ? 1 : 0);
        const swim = role === 'swim';
        c.flag.setAttribute('d', flagPath(t, i * 1.3, swim ? 50 : 40, swim ? 8 : 4.5));
        show(c.flag, role === 'rep' ? 0.25 : 1);
        const out = rot * DEG - Math.PI / 2;
        tip[i] = [x + Math.cos(out) * 28 * sc * big, y + Math.sin(out) * 28 * sc * big];
      });
      // bacteria drift in and get caught by a collar
      bact.forEach((b, i) => {
        const u = frac(t * 0.28 + i / bact.length);
        const j = step === 0 ? 0 : i % N;
        const vis = step === 3 ? 0 : step === 0 ? (i % 3 === 0 ? 1 : 0) : 1;
        const a0 = i * 2.39;
        const sx = Math.min(380, Math.max(20, CX + 170 * Math.cos(a0))), sy = CY + 150 * Math.sin(a0);
        const k = ease(0, 0.85, u), [jx, jy] = drift(i, t, 3 * (1 - k));
        at(b, lerp(sx, tip[j][0], k) + jx, lerp(sy, tip[j][1], k) + jy);
        show(b, vis * Math.min(1, u * 8) * (1 - smooth(0.85, 0.95, u)) * (1 - win(lt, 3.4, 4.4, 0.2)));
      });
      // water through the sponge
      show(sponge, smooth(11.5, 12.8, lt));
      const wk = smooth(12.2, 13.2, lt);
      water.forEach((w, i) => {
        const u = frac(t * 0.3 + i / water.length);
        const [px, py] = pores[i % 6];
        const p = keys(u, [[0, [px, py]], [0.5, [CX + (px < CX ? -14 : 14), CY + (i % 3 - 1) * 20]], [1, [CX + (i % 2 ? 10 : -10), 22]]]);
        at(w, p[0], p[1]); show(w, wk * Math.sin(Math.PI * u));
      });
      const L = step === 3 ? LEG_SPONGE : LEG_JOBS;
      leg.forEach((l, i) => {
        setText(l, L[i][1]);
        l.setAttribute('x', L[i][0]);
        if (l.getAttribute('class') !== L[i][2]) l.setAttribute('class', L[i][2]);
        show(l, step < 2 ? 0 : step === 2 ? smooth(7.5, 8.1, lt) : smooth(11.6, 12.2, lt));
      });
      return [
        'A choanoflagellate: one cell with a whip (flagellum) and a collar that traps bacteria',
        'Cells that stay together after dividing make a colony. A colony catches more food than one cell alone.',
        'Colony cells start to specialize: some eat, some swim, some make new cells. That’s division of labor.',
        'A sponge’s collar cells (choanocytes) look just like choanoflagellates: a clue to what the first animal was like',
      ][step];
    };
  },
  plain: [
    'Animals share a few traits: they’re multicellular, they eat other living things (heterotrophs), they digest food inside the body, and most can move and have a nervous system.',
    'Gene comparisons show all animals come from one common ancestor (they’re monophyletic). That ancestor was probably a colonial flagellated protist, a lot like today’s choanoflagellates.',
    'Colonies may have caught prey better than single cells. Over time their cells specialized (moving, feeding, reproducing), which led to bigger, more complex animals.',
    'Sponges have no true tissue layers or organs. Hard spicules hold them up: silica in glass sponges and demosponges, calcium carbonate in calcareous sponges.',
  ],
  terms: [
    ['Choanoflagellate', 'A protist with one flagellum and a collar of tiny projections; the closest living relative of animals.'],
    ['Choanocyte', 'A sponge’s collar cell. It beats water through the sponge and traps food.'],
    ['Monophyletic', 'All members come from one common ancestor.'],
    ['Spicule', 'A hard little skeletal piece in a sponge (silica or calcium carbonate).'],
  ],
};

// ---------------------------------------------------------------- 2. cleavage: radial vs spiral

const cleavage = {
  id: 'l1-cleave', title: 'Cleavage: radial vs spiral', dur: 13,
  build(svg) {
    polish(svg);
    svg.classList.add('has-art', 'art-l1-cleave');
    E('image', { href: new URL('./art/l1-cleave.jpg', import.meta.url).href, x: 0, y: 0, width: 640, height: 360, preserveAspectRatio: 'none', class: 'b-art' }, svg);
    const g = E('g', {}, svg);
    const head = arrowDefs(svg, 'l1-twist-head', 'b-head gold');
    const CY = 185;
    const A = [45, 135, 225, 315].map(d => d * DEG);
    const ORDER = [2, 3, 0, 1, 6, 7, 4, 5]; // back cells first, top tier last, so the front ones sit on top
    const embs = [{ cx: 170, spiral: false }, { cx: 470, spiral: true }].map(e => {
      T(g, e.cx, 40, e.spiral ? 'Spiral cleavage' : 'Radial cleavage', 'bl b-strong', MID);
      T(g, e.cx, 60, e.spiral ? 'new cells sit at an angle, in the grooves' : 'new cells stack straight on top', 'bs', MID);
      e.env = E('circle', { cx: e.cx, cy: CY, r: 80, class: 'b-envelope' }, g);
      const cells = [];
      ORDER.forEach(i => { cells[i] = E('circle', { r: 44, class: 'b-blast' }, g); });
      const extra = e.spiral
        ? E('path', { d: `M${e.cx - 46},${CY - 66} A50,16 0 0 1 ${e.cx + 46},${CY - 66}`, class: 'b-twist', 'marker-end': head }, g)
        : E('path', { d: `M${e.cx - 20},${CY - 66} L${e.cx - 20},${CY + 66} M${e.cx + 20},${CY - 66} L${e.cx + 20},${CY + 66}`, class: 'b-guide' }, g);
      T(g, e.cx, 296, e.spiral ? 'e.g. snails, segmented worms' : 'e.g. sea stars, vertebrates', 'bs', MID);
      return { ...e, cells, extra };
    });
    const count = T(g, 320, 334, '', 'bl b-strong', MID);
    const syncCount = pill(count, { px: 12, py: 4, cls: 'warm' });
    const mix = (a, b, k) => a.map((v, n) => lerp(v, b[n], k));
    const place = (e, i, k1, k2, k3, twist) => {
      const j = i & 3, top = i >> 2;
      const p1 = [e.cx, CY, 44];
      const p2 = [e.cx + (j === 0 || j === 3 ? 27 : -27), CY, 31];
      const p4 = [e.cx + 28 * Math.cos(A[j]), CY + 12 * Math.sin(A[j]), 24];
      const a8 = A[j] + (top && e.spiral ? twist : 0);
      const p8 = [e.cx + 28 * Math.cos(a8), CY + (top ? -27 : 27) + 10 * Math.sin(a8), top && e.spiral ? 17 : 20];
      return k3 > 0 ? mix(p4, p8, k3) : k2 > 0 ? mix(p2, p4, k2) : mix(p1, p2, k1);
    };
    return (lt, _dt, t) => {
      const k1 = ease(1.6, 2.8, lt), k2 = ease(4.2, 5.4, lt), k3 = ease(6.8, 8, lt);
      const twist = smooth(8, 9.4, lt) * 45 * DEG;
      embs.forEach(e => {
        e.cells.forEach((c, i) => {
          const [x, y, r] = place(e, i, k1, k2, k3, twist);
          at(c, x, y); c.setAttribute('r', (r * (1 + 0.018 * breath(t, 3.4, i * 0.8))).toFixed(1));
          const cls = k3 > 0.5 ? `b-blast ${i >> 2 ? 'hi' : 'lo'}` : 'b-blast';
          if (c.getAttribute('class') !== cls) c.setAttribute('class', cls);
        });
        e.env.setAttribute('stroke-dashoffset', (t * 4).toFixed(1));
        show(e.extra, e.spiral ? smooth(8, 8.5, lt) * (1 - smooth(12.6, 13, lt)) : smooth(9.4, 10, lt) * (1 - smooth(12.6, 13, lt)));
      });
      setText(count, k3 > 0.5 ? '8 cells' : k2 > 0.5 ? '4 cells' : k1 > 0.5 ? '2 cells' : '1 cell (the zygote)');
      syncCount();
      if (lt < 1.6) return 'Right after fertilization the embryo is one big cell, the zygote';
      if (lt < 4.2) return 'Cleavage = quick divisions with no growth in between: 1 → 2 cells…';
      if (lt < 6.8) return '…→ 4 cells. So far both patterns look the same.';
      if (lt < 9.4) return 'The 3rd division makes a top and a bottom layer. In spiral cleavage the top cells end up turned at an angle.';
      return 'Radial: top cells sit straight above the bottom ones. Spiral: they sit twisted, in the grooves between them.';
    };
  },
  plain: [
    'Cleavage is the first round of cell divisions in an embryo. The cells get smaller each time because nothing grows in between.',
    'Radial cleavage: yolk is spread evenly, cells divide completely and evenly, and new cells line up straight above or beside the old ones.',
    'Spiral cleavage: a twisted version of radial; the new cells sit at an angle to the ones below. The pattern of cleavage helps tell the big animal groups apart.',
  ],
  terms: [
    ['Cleavage', 'The early cell divisions of an embryo.'],
    ['Zygote', 'The single cell made at fertilization.'],
    ['Radial vs spiral', 'New cells stacked straight vs set at an angle.'],
  ],
};

// ---------------------------------------------------------------- 3. gastrulation

const gastrula = {
  id: 'l1-gast', title: 'Gastrulation: germ layers and the blastopore', dur: 16,
  vars: { layers: 'tri', fate: 'proto' },
  build(svg, s, ui) {
    polish(svg);
    ui.seg('layers', [['di', 'Diploblastic'], ['tri', 'Triploblastic']], 'Germ layers');
    ui.seg('fate', [['proto', 'Protostome'], ['deut', 'Deuterostome']], 'Blastopore fate');
    svg.classList.add('has-art', 'art-l1-gast');
    const art = E('image', { href: new URL('./art/l1-gast.jpg', import.meta.url).href, x: 0, y: 0, width: 640, height: 360, preserveAspectRatio: 'none', class: 'b-art' }, svg);
    const g0 = E('g', {}, svg);
    const g = E('g', {}, g0);
    const CX = 190, CY = 172, R = 88, RI = 50, N = 30, PL = 1.4, PL2 = 0.34;
    E('circle', { cx: CX, cy: CY, r: R - 4, class: 'b-blastbg' }, g);
    const gut = E('g', {}, g);
    E('circle', { cx: CX, cy: CY, r: RI - 6, class: 'b-archent' }, gut);
    E('rect', { x: CX - 13, y: CY + 20, width: 26, height: 72, class: 'b-archent' }, gut);
    const topHole = E('rect', { x: CX - 9, y: CY - R - 12, width: 18, height: R - RI + 26, class: 'b-archent' }, g);
    const meso = Array.from({ length: 8 }, () => E('circle', { r: 7.5, class: 'b-germ meso' }, g));
    const cells = Array.from({ length: N }, () => E('circle', { r: 9.5, class: 'b-germ' }, g));
    // the outline of the embryo, finely sampled: blastula circle → folded gastrula
    const M = 240;
    const samp = Array.from({ length: M }, (_, m) => {
      const p = -Math.PI + (m + 0.5) * TAU / M, a = Math.abs(p), sg = Math.sign(p);
      const outer = a >= PL;
      const psi = outer ? sg * (PL2 + (a - PL) / (Math.PI - PL) * (Math.PI - PL2)) : sg * (PL2 + (PL - a) / PL * (Math.PI - 0.12 - PL2));
      const r = outer ? R : RI;
      return { outer, b: [CX + R * Math.sin(p), CY + R * Math.cos(p)], f: [CX + r * Math.sin(psi), CY + r * Math.cos(psi)] };
    });
    const pts = samp.map(() => [0, 0]), cum = new Float64Array(M + 1);
    const stage = T(g0, CX, 336, '', 'bl b-strong', MID);
    const botTag = T(g0, CX, 302, '', 'bs b-strong', MID);
    const topTag = T(g0, CX, 58, '', 'bs b-strong', MID);
    const syncTags = pills([botTag, topTag], { cls: 'warm' });
    // right panel
    const legend = E('g', {}, g0);
    T(legend, 400, 46, 'Germ layers', 'bl b-strong');
    T(legend, 400, 72, '● ectoderm: skin, nerves', 'bs b-strong b-ecto-t');
    const legM = T(legend, 400, 94, '● mesoderm: muscle, blood, bone', 'bs b-strong b-meso-t');
    T(legend, 400, 116, '● endoderm: gut lining', 'bs b-strong b-endo-t');
    const kindT = T(legend, 400, 148, '', 'bs b-strong');
    const kindS = T(legend, 400, 166, '', 'bs');
    const fateBox = E('g', {}, g0);
    E('rect', { x: 392, y: 196, width: 236, height: 140, rx: 14, class: 'b-colbox on' }, fateBox);
    T(fateBox, 406, 222, 'The blastopore becomes the…', 'bs');
    const big = T(fateBox, 406, 252, '', 'bl b-strong');
    const f1 = T(fateBox, 406, 280, '', 'bs b-strong');
    const f2 = T(fateBox, 406, 302, '', 'bs');
    svg.insertBefore(art, fit(svg)); // painting stays full-stage, outside the fit() shrink
    return (lt, _dt, t) => {
      const tri = s.vars.layers === 'tri', proto = s.vars.fate === 'proto';
      scaleAbout(g, CX, CY, 1 + 0.012 * breath(t, 4.4));
      const k = smooth(2.5, 6, lt);
      const open = tri ? smooth(10, 11.5, lt) : 0;
      // cells sit evenly spaced along the folding outline
      samp.forEach((q, m) => { pts[m][0] = lerp(q.b[0], q.f[0], k); pts[m][1] = lerp(q.b[1], q.f[1], k); });
      for (let m = 1; m <= M; m++) { const a = pts[m - 1], b = pts[m % M]; cum[m] = cum[m - 1] + Math.hypot(b[0] - a[0], b[1] - a[1]); }
      const rad = Math.min(11.5, Math.max(8.5, cum[M] / N * 0.5));
      let m = 0;
      cells.forEach((c, i) => {
        const target = (i + 0.5) / N * cum[M];
        while (m < M - 1 && cum[m + 1] < target) m++;
        const seg = cum[m + 1] - cum[m], f = seg ? (target - cum[m]) / seg : 0;
        const a = pts[m], b = pts[(m + 1) % M];
        let x = lerp(a[0], b[0], f);
        const y = lerp(a[1], b[1], f);
        if (open && y < CY) x += Math.sign(x - CX || (i < N / 2 ? -1 : 1)) * open * 12 * gauss(x - CX, 0, 18);
        at(c, x, y); c.setAttribute('r', rad.toFixed(1));
        const outer = samp[f < 0.5 ? m : (m + 1) % M].outer;
        const cls = lt > 5.6 ? (outer ? 'b-germ ecto' : 'b-germ endo') : 'b-germ';
        if (c.getAttribute('class') !== cls) c.setAttribute('class', cls);
      });
      meso.forEach((m, i) => {
        const sg = i % 2 ? 1 : -1, n = i >> 1;
        const km = smooth(6 + n * 0.3, 7.6 + n * 0.3, lt);
        const psi = sg * lerp(0.42, 0.75 + n * 0.55, km), rr = lerp(66, (R + RI) / 2, km);
        at(m, CX + rr * Math.sin(psi), CY + rr * Math.cos(psi));
        show(m, tri ? smooth(6, 6.5, lt) : 0);
      });
      show(gut, smooth(4.8, 6, lt));
      show(topHole, open);
      show(legend, smooth(5.6, 6.2, lt));
      show(legM, tri ? 1 : 0.3);
      setText(kindT, tri ? 'Triploblastic: 3 layers' : 'Diploblastic: 2 layers');
      setText(kindS, tri ? '(all bilaterians)' : '(e.g. cnidarians, ctenophores)');
      show(fateBox, smooth(9.6, 10.2, lt));
      setText(big, !tri ? 'one opening only' : proto ? 'MOUTH (anus comes later)' : 'ANUS (mouth comes later)');
      setText(f1, !tri ? 'it works as mouth AND anus' : proto ? 'Protostomes: insects, snails' : 'Deuterostomes: us, sea stars');
      setText(f2, !tri ? '(cnidarians: jellyfish, corals)' : proto ? 'proto = first: mouth first' : 'deutero = second: mouth 2nd');
      setText(stage, lt < 2.5 ? 'Blastula: a hollow ball' : lt < 5.6 ? 'Gastrula: folding in…' : tri ? 'Gastrula: 3 germ layers' : 'Gastrula: 2 germ layers');
      setText(botTag, lt < 3.5 ? '' : lt < 10 || !tri ? 'blastopore' : proto ? 'blastopore → mouth' : 'blastopore → anus');
      setText(topTag, open > 0.3 ? (proto ? 'anus forms here' : 'mouth forms here') : '');
      syncTags();
      if (lt < 2.5) return 'After cleavage the embryo is a blastula: a hollow ball made of one layer of cells';
      if (lt < 5.6) return 'Gastrulation: one side of the ball pushes inward (invagination), like poking a finger into a soft ball';
      if (lt < 10) return tri
        ? 'Now there are layers: outside = ectoderm, lining the new gut = endoderm, and cells in between = mesoderm'
        : 'Diploblastic animals stop at two layers: ectoderm outside, endoderm inside. No mesoderm.';
      if (!tri) return 'Cnidarians stay like this: one opening is both mouth and anus (a gastrovascular cavity)';
      return proto
        ? 'Protostomes: the blastopore becomes the MOUTH; the anus breaks through later (insects, snails)'
        : 'Deuterostomes: the blastopore becomes the ANUS; the mouth breaks through later (vertebrates, sea stars)';
    };
  },
  plain: [
    'Germ layers are the first cell layers of an embryo. They form during gastrulation, when the hollow ball indents (invaginates). The opening of that pocket is the blastopore.',
    'Diploblastic animals have two layers: ectoderm (outside) and endoderm (inside). Triploblastic animals add mesoderm in between. Triploblastic animals form a clade, and all of them are bilaterians.',
    'Triploblasts split into two clades by what the blastopore becomes. Protostomes: the mouth (e.g. insects, snails). Deuterostomes: the anus, with the mouth forming later (e.g. vertebrates, sea stars).',
  ],
  terms: [
    ['Blastula', 'The hollow ball of cells after cleavage.'],
    ['Gastrulation', 'The ball folds inward and forms the germ layers.'],
    ['Blastopore', 'The opening where the ball folds in.'],
    ['Ectoderm / mesoderm / endoderm', 'Outer / middle / inner germ layer.'],
    ['Bilaterian', 'An animal with bilateral symmetry during development.'],
  ],
};

// ---------------------------------------------------------------- 4. symmetry and cephalization

const symmetry = {
  id: 'l1-sym', title: 'Symmetry, and why bilateral animals have heads', dur: 15,
  build(svg) {
    polish(svg);
    // painted seawater backdrop only: every animal here breathes, spins or fades, so they stay drawn
    svg.classList.add('has-art', 'art-l1-sym');
    E('image', { href: new URL('./art/l1-sym.jpg', import.meta.url).href, x: 0, y: 0, width: 640, height: 360, preserveAspectRatio: 'none', class: 'b-art' }, svg);
    const g = E('g', {}, svg);
    const CY = 160;
    const COLS = [110, 320, 530];
    // radial: a jellyfish seen from above
    const rad = E('g', {}, g); move(rad, COLS[0], CY);
    for (let k = 0; k < 8; k++) {
      const a = k * 45 * DEG;
      E('line', { x1: 30 * Math.cos(a), y1: 30 * Math.sin(a), x2: 54 * Math.cos(a), y2: 54 * Math.sin(a), class: 'b-tent' }, rad);
    }
    E('circle', { r: 34, class: 'b-jelly' }, rad);
    for (let k = 0; k < 4; k++) E('ellipse', { cx: 17, cy: 0, rx: 8, ry: 5, transform: `rotate(${k * 90})`, class: 'b-gonad' }, rad);
    E('circle', { r: 5, class: 'b-jelly-m' }, rad);
    // bilateral: a flatworm, head up
    const bil = E('g', {}, g);
    E('path', { d: 'M0,-60 C22,-60 26,-40 22,-10 C20,20 14,50 0,62 C-14,50 -20,20 -22,-10 C-26,-40 -22,-60 0,-60z', class: 'b-flatworm' }, bil);
    const cords = E('path', { d: 'M-6,-34 C-9,0 -9,30 -5,52 M6,-34 C9,0 9,30 5,52 M-8,-12 L8,-12 M-9,10 L9,10 M-8,32 L8,32', class: 'b-ncord' }, bil);
    const brain = [-6, 6].map(x => E('ellipse', { cx: x, cy: -36, rx: 6, ry: 4.5, class: 'b-wbrain' }, bil));
    [-8, 8].map(x => E('circle', { cx: x, cy: -46, r: 3, class: 'b-eye' }, bil));
    // asymmetric: a sponge
    const asy = E('g', {}, g); move(asy, COLS[2], CY);
    E('path', { d: 'M-30,50 C-52,30 -40,-10 -48,-30 C-54,-52 -20,-62 -6,-44 C6,-60 34,-58 30,-30 C28,-14 52,-4 44,22 C38,46 10,40 4,54 C-6,64 -20,60 -30,50z', class: 'b-sponge-blob' }, asy);
    E('ellipse', { cx: -26, cy: -34, rx: 7, ry: 5, class: 'b-spore' }, asy);
    E('ellipse', { cx: 14, cy: -38, rx: 5, ry: 4, class: 'b-spore' }, asy);
    E('circle', { cx: 24, cy: 14, r: 4, class: 'b-spore' }, asy);
    // mirror lines, ticks, labels
    const mirrors = COLS.map(cx => {
      const mg = E('g', {}, g);
      const line = E('line', { x1: -72, y1: 0, x2: 72, y2: 0, class: 'b-mirror' }, mg);
      const tick = T(g, cx, 76, '', 'bs b-strong b-good-t', MID);
      tick.sync = pill(tick, { px: 9 });
      return { mg, line, tick, cx };
    });
    const LAB = [['Radial', 'parts arranged around a center', '(jellyfish, sea anemones)'], ['Bilateral', 'only one mirror plane', '(worms, insects, you)'], ['Asymmetric', 'no mirror plane at all', '(sponges, placozoans)']];
    const labels = E('g', {}, g);
    LAB.forEach(([a, b, c], i) => { T(labels, COLS[i], 262, a, 'bl b-strong', MID); T(labels, COLS[i], 282, b, 'bs', MID); T(labels, COLS[i], 300, c, 'bs', MID); });
    // cephalization labels
    const head = E('g', {}, g);
    T(head, 362, 112, 'head (anterior)', 'bl b-strong');
    T(head, 362, 131, 'eyes + a brain cluster here', 'bs');
    T(head, 362, 200, 'nerve cords run down the body', 'bs');
    T(head, 362, 272, 'tail (posterior)', 'bs b-strong');
    E('path', { d: 'M356,108 L310,121 M356,196 L303,199 M356,268 L298,268', class: 'b-leader' }, head);
    const food = Array.from({ length: 4 }, () => E('circle', { r: 4.5, class: 'p-glu' }, g));
    return (lt, _dt, t) => {
      const ph2 = smooth(8.4, 9.6, lt);
      const ang = lt * 45;
      mirrors.forEach((m, i) => {
        move(m.mg, m.cx, CY, 1, ang);
        let match = false;
        if (i === 0) { const d = ang % 45; match = d < 7 || d > 38; }
        if (i === 1) { const d = (ang + 90) % 180; match = d < 7 || d > 173; }
        m.line.classList.toggle('on', match);
        setText(m.tick, match ? '✓ matching halves' : i === 2 && lt > 3 ? '✗ never matches' : '');
        show(m.mg, 1 - ph2); show(m.tick, 1 - ph2);
        m.tick.sync();
      });
      const pulse = breath(t, 2.6);
      rad.setAttribute('transform', `translate(${COLS[0]} ${CY}) scale(${(1 + 0.035 * pulse).toFixed(4)} ${(1 - 0.02 * pulse).toFixed(4)})`);
      asy.setAttribute('transform', `translate(${COLS[2]} ${CY}) scale(${(1 + 0.012 * breath(t, 4.8, 1)).toFixed(4)})`);
      show(labels, 1 - ph2);
      show(rad, 1 - ph2); show(asy, 1 - ph2);
      move(bil, lerp(COLS[1], 290, ph2), lerp(CY, 185, ph2), lerp(1, 1.45, ph2), ph2 * 3 * Math.sin(t * 2.4));
      brain.forEach(b => b.classList.toggle('on', lt > 11.6));
      show(cords, 0.35 + 0.65 * ph2);
      show(head, smooth(9.6, 10.4, lt));
      food.forEach((f, i) => {
        const u = frac(t * 0.4 + i / 4);
        const k = ease(0, 1, u);
        at(f, lerp(290 + (i - 1.5) * 50, 290, k) + 3 * Math.sin(t * 2 + i), lerp(14, 104, u));
        show(f, ph2 * Math.sin(Math.PI * u));
      });
      if (lt < 4) return 'Symmetry: can a mirror line cut the body into matching halves? Watch the line spin.';
      if (lt < 8.4) return 'Radial: matches in many directions. Bilateral: only one (left = right). Asymmetric: never.';
      if (lt < 11.6) return 'A bilateral animal moves front-end first, so its front meets food and danger first…';
      return '…so eyes, other senses and a brain cluster at the front: cephalization. Nerve cords run back from it.';
    };
  },
  plain: [
    'Symmetrical = can be cut along at least one plane into similar halves. Radial: body parts arranged around a central axis. Bilateral: mirror halves along only one plane. Asymmetrical: no plane at all (sponges and placozoans).',
    'Bilateral symmetry goes with cephalization: sense organs and nerve tissue concentrated at the front end (the head). Evolution favored it because the front end meets the environment first.',
    'Nervous systems differ too. Ctenophores and cnidarians have a diffuse nerve net; bilaterians have a central nervous system that coordinates muscles and processes sensory information.',
  ],
  terms: [
    ['Radial symmetry', 'Parts arranged around a central axis, like a pie.'],
    ['Bilateral symmetry', 'Left and right halves mirror each other.'],
    ['Cephalization', 'Senses and nerve cells concentrated in a head.'],
    ['Anterior / posterior', 'Front (head) end / back (tail) end.'],
    ['Nerve net', 'A spread-out nervous system with no brain (cnidarians, ctenophores).'],
  ],
};

// ---------------------------------------------------------------- 5. body cavities

const PLANS = {
  acoel: {
    r1: 118, r2: 48, r3: 48, ex: 'e.g. flatworms',
    meso: 'mesoderm fills the space (mesenchyme)', cav: 'no body cavity: solid tissue',
    cap: 'Acoelomate: no fluid-filled cavity. Packed cells (mesenchyme) fill the space between gut and body wall.',
    cap2: 'With no fluid inside it can’t use a hydrostatic skeleton. Flatworms glide by beating cilia.',
  },
  pseudo: {
    r1: 118, r2: 104, r3: 48, ex: 'e.g. roundworms',
    meso: 'mesoderm: only under the body wall', cav: 'pseudocoel: fluid, the gut floats in it',
    cap: 'Pseudocoelomate: a fluid-filled pseudocoel, but mesoderm lines only the body wall, not the gut',
    cap2: 'Fluid can’t be squashed, so squeezing one part makes another part bulge: a hydrostatic skeleton',
  },
  coel: {
    r1: 118, r2: 104, r3: 62, ex: 'e.g. earthworms, insects, you',
    meso: 'mesoderm lines it (peritoneum)', cav: 'coelom: fluid, wrapped in mesoderm',
    cap: 'Coelomate: the coelom forms inside the mesoderm, so mesoderm lines both the body wall and the gut',
    cap2: 'Fluid can’t be squashed, so squeezing one part makes another part bulge: a hydrostatic skeleton',
  },
};

const cavity = {
  id: 'l1-cavity', title: 'Body cavities (and the water-balloon skeleton)', dur: 12,
  vars: { plan: 'coel' },
  build(svg, s, ui) {
    polish(svg);
    ui.seg('plan', [['acoel', 'Acoelomate'], ['pseudo', 'Pseudocoelomate'], ['coel', 'Coelomate']], 'Body cavity');
    svg.classList.add('has-art', 'art-l1-cavity');
    E('image', { href: new URL('./art/l1-cavity.jpg', import.meta.url).href, x: 0, y: 0, width: 640, height: 360, preserveAspectRatio: 'none', class: 'b-art' }, svg);
    const g0 = E('g', {}, svg);
    const g = E('g', { class: 'fx-fade' }, g0);
    const CX = 190, CY = 185;
    E('circle', { cx: CX, cy: CY, r: 130, class: 'b-lay ecto' }, g);
    const m1 = E('circle', { cx: CX, cy: CY, class: 'b-lay meso' }, g);
    const cav = E('circle', { cx: CX, cy: CY, class: 'b-lay cav' }, g);
    const m2 = E('circle', { cx: CX, cy: CY, class: 'b-lay meso' }, g);
    const p1 = E('circle', { cx: CX, cy: CY, class: 'b-perit' }, g);
    const p2 = E('circle', { cx: CX, cy: CY, class: 'b-perit' }, g);
    const mes = Array.from({ length: 18 }, (_, i) => {
      const a = i * 2.4, r = 58 + (i * 37) % 52;
      return E('circle', { cx: CX + r * Math.cos(a), cy: CY + r * Math.sin(a), r: 4.5, class: 'b-mesench' }, g);
    });
    E('circle', { cx: CX, cy: CY, r: 48, class: 'b-lay endo' }, g);
    E('circle', { cx: CX, cy: CY, r: 34, class: 'b-lay lumen' }, g);
    // labels with leader lines
    const LABS = [
      { y: 66, cls: 'bs b-strong b-ecto-t', text: () => 'ectoderm (outer layer)', rm: () => 124 },
      { y: 104, cls: 'bs b-strong b-meso-t', text: p => p.meso, rm: (p, c) => (c.r2 > c.r3 + 4 ? (c.r1 + c.r2) / 2 : (c.r1 + c.r3) / 2) },
      { y: 142, cls: 'bs b-strong b-water-t', text: p => p.cav, rm: (p, c) => (c.r2 > c.r3 + 4 ? (c.r2 + c.r3) / 2 : (c.r1 + c.r3) / 2) },
      { y: 180, cls: 'bs b-strong b-endo-t', text: () => 'endoderm (gut lining)', rm: () => 41 },
      { y: 214, cls: 'bs b-strong', text: () => 'inside of the gut', rm: () => 20 },
    ].map(l => ({ ...l, line: E('line', { class: 'b-leader' }, g0), dot: E('circle', { r: 2.8, class: 'b-dot-ink' }, g0), el: T(g0, 352, l.y, '', l.cls) }));
    const ex = T(g0, CX, 342, '', 'bs b-strong', MID);
    // the hydrostatic-skeleton demo
    const hg = E('g', { class: 'fx-fade' }, g0);
    const hydroTitle = T(hg, 382, 256, 'Hydrostatic skeleton', 'bs b-strong');
    const balloon = E('path', { class: 'b-hydro' }, hg);
    const rings = [0, 1].map(() => E('line', { class: 'b-mring' }, hg));
    const cilia = Array.from({ length: 14 }, () => E('line', { class: 'b-cilia' }, hg));
    const hydroT = T(hg, 382, 346, '', 'bs');
    const cur = { ...PLANS.coel };
    return (lt, dt, t) => {
      const p = PLANS[s.vars.plan];
      const k = dt ? 1 - Math.exp(-dt * 4) : 1;
      scaleAbout(g, CX, CY, 1 + 0.008 * breath(t, 4.6));
      flag(hg, 'fx-dim', lt < 6);
      flag(hydroTitle, 'fx-hot', lt >= 6);
      for (const key of ['r1', 'r2', 'r3']) cur[key] = lerp(cur[key], p[key], k);
      m1.setAttribute('r', cur.r1.toFixed(1)); cav.setAttribute('r', cur.r2.toFixed(1)); m2.setAttribute('r', cur.r3.toFixed(1));
      const coel = s.vars.plan === 'coel', acoel = s.vars.plan === 'acoel';
      p1.setAttribute('r', cur.r2.toFixed(1)); p2.setAttribute('r', cur.r3.toFixed(1));
      // the painting shows the coelomate layers; the drawn rings take over while another plan is shown
      svg.classList.toggle('art-coel', Math.abs(cur.r2 - 104) < 0.6 && Math.abs(cur.r3 - 62) < 0.6);
      show(p1, coel ? 1 : 0); show(p2, coel ? 1 : 0);
      mes.forEach(m => show(m, acoel ? 1 : 0));
      LABS.forEach(l => {
        const rm = l.rm(p, cur), dy = l.y - 4 - CY;
        const px = CX + Math.sqrt(Math.max(0, rm * rm - dy * dy));
        l.line.setAttribute('x1', px.toFixed(1)); l.line.setAttribute('y1', l.y - 4);
        l.line.setAttribute('x2', 346); l.line.setAttribute('y2', l.y - 4);
        at(l.dot, px, l.y - 4);
        setText(l.el, l.text(p));
      });
      setText(ex, p.ex);
      // balloon: a squeeze ring travels along it and pushes fluid ahead
      const xs = 396 + frac(t * 0.22) * 210;
      const H = x => {
        const e = Math.pow(Math.max(0, 1 - ((x - 500) / 118) ** 2), 0.35);
        return acoel ? 18 * e : e * (20 * (1 - 0.55 * gauss(x, xs, 13)) + 8 * gauss(x, xs + 34, 15));
      };
      let top = '', bot = '';
      for (let x = 382; x <= 618; x += 4) top += `${x === 382 ? 'M' : 'L'}${x},${(300 - H(x)).toFixed(1)}`;
      for (let x = 618; x >= 382; x -= 4) bot += `L${x},${(300 + H(x)).toFixed(1)}`;
      balloon.setAttribute('d', `${top}${bot}z`);
      balloon.classList.toggle('solid', acoel);
      rings.forEach((r, i) => {
        const x = xs + (i ? 5 : -5), h = H(x) + 3;
        r.setAttribute('x1', x.toFixed(1)); r.setAttribute('x2', x.toFixed(1));
        r.setAttribute('y1', (300 - h).toFixed(1)); r.setAttribute('y2', (300 + h).toFixed(1));
        show(r, acoel ? 0 : 1);
      });
      cilia.forEach((c, i) => {
        const x = 404 + i * 15, y = 300 + H(x);
        const sw = 5 * Math.sin(t * 9 - i * 0.8);
        c.setAttribute('x1', x); c.setAttribute('y1', y.toFixed(1));
        c.setAttribute('x2', (x + sw).toFixed(1)); c.setAttribute('y2', (y + 8).toFixed(1));
        show(c, acoel ? 1 : 0);
      });
      setText(hydroT, acoel ? 'solid inside: it moves by beating cilia' : 'squeeze here → the fluid bulges there');
      return lt < 6 ? p.cap : p.cap2;
    };
  },
  plain: [
    'Body plan = how the body is laid out. Five key features: symmetry, body cavity, segmentation, appendages and the nervous system.',
    'Body cavities are sorted by where the mesoderm is. Acoelomate: no cavity, packed with mesenchyme cells. Pseudocoelomate: a fluid cavity (pseudocoel) with organs suspended in it, but no mesoderm around the organs. Coelomate: the coelom develops within the mesoderm, so it’s lined on both sides by a muscular layer (peritoneum).',
    'A fluid cavity can work as a hydrostatic skeleton: muscles squeeze the fluid into another part of the body, and that part expands.',
    'Segmentation lets body regions specialize and move precisely (arthropods diversified by changing their segments). Appendages such as legs, antennae, claws and mouthparts help with moving, sensing and feeding.',
  ],
  terms: [
    ['Coelom', 'Fluid-filled body cavity that forms inside the mesoderm.'],
    ['Pseudocoel', 'Fluid-filled cavity with mesoderm only on the body-wall side.'],
    ['Mesenchyme', 'Loosely packed cells filling the space in acoelomates.'],
    ['Peritoneum', 'The mesoderm lining of the coelom.'],
    ['Hydrostatic skeleton', 'Support and movement from squeezing an enclosed fluid.'],
  ],
};

export default {
  id: 'L1', n: '1', short: 'Animal diversity', color: '--b-glu', chapter: 'Ch 22.1–22.2',
  title: 'Animal origins and body plans',
  minute: [
    'Animals are multicellular heterotrophs that digest food inside the body, and most move and have nerves. All of them share one common ancestor (monophyletic).',
    'That ancestor was probably a colonial flagellated protist like a choanoflagellate. Sponge collar cells (choanocytes) look just like one.',
    'Cleavage = the first cell divisions. Radial: new cells stack straight. Spiral: new cells sit at an angle.',
    'Gastrulation folds the hollow ball inward. Diploblastic = ectoderm + endoderm; triploblastic adds mesoderm (all are bilaterians).',
    'Protostomes: blastopore → mouth (insects, snails). Deuterostomes: blastopore → anus (vertebrates, sea stars).',
    'Body plans: radial, bilateral (with a head) or asymmetric; acoelomate, pseudocoelomate or coelomate. Sponges, ctenophores, placozoans and cnidarians are not bilaterians.',
  ],
  traps: [
    'Deuterostome = blastopore becomes the ANUS (mouth second). Protostome = blastopore becomes the MOUTH.',
    'A coelom is lined by mesoderm on BOTH sides; a pseudocoel has mesoderm only on the body-wall side.',
    'Asymmetrical = sponges and placozoans. Ctenophores and cnidarians are radial.',
    'Ctenophores, placozoans and cnidarians are diploblastic. Sponges have no distinct germ layers or true organs.',
    'Ctenophores swim with cilia on 8 comb plates (ctenes). Cnidarians catch prey with nematocysts.',
    'Glass sponges and demosponges: silica spicules. Calcareous sponges: calcium carbonate.',
  ],
  links: [['Mesoderm builds the heart, blood and muscle → Lecture 5', 'L5'], ['Endoderm lines the gut → Lecture 7', 'L7'], ['Cephalization: a brain up front → Lecture 8', 'L8']],
  scenes: [colony, cleavage, gastrula, symmetry, cavity],
  quiz: [
    { q: 'All animals share one common ancestor. That makes animals…', a: 'Monophyletic', o: ['Polyphyletic', 'Diploblastic', 'Autotrophic'], why: 'Gene sequences show one common ancestor for every animal, so they form one group (monophyletic).' },
    { q: 'Which living protists look most like the ancestor of animals?', a: 'Choanoflagellates', o: ['Amoebas', 'Diatoms', 'Green algae'], why: 'Their collar and flagellum match the collar cells (choanocytes) of sponges.' },
    { q: 'In radial cleavage, the new cells…', a: 'Sit straight above or beside the old ones', o: ['Sit at an angle to the old ones', 'Only form in the top half of the egg', 'Never fully separate'], why: 'Radial = cells divide evenly and line up straight. Spiral = new cells are set at an angle.' },
    { q: 'Which germ layer do triploblastic animals have that diploblastic animals don’t?', a: 'Mesoderm', o: ['Ectoderm', 'Endoderm', 'Blastopore'], why: 'Diploblasts have ectoderm + endoderm. Triploblasts add the middle layer, mesoderm.' },
    { q: 'In deuterostomes, the blastopore becomes the…', a: 'Anus', o: ['Mouth', 'Coelom', 'Nerve cord'], why: '“Deutero” = second: the mouth forms second. Vertebrates and sea stars are deuterostomes.' },
    { q: 'A body cavity lined with mesoderm on both the gut side and the body-wall side is a…', a: 'Coelom', o: ['Pseudocoel', 'Mesenchyme', 'Gastrovascular cavity'], why: 'A coelom forms inside the mesoderm. A pseudocoel has mesoderm only on the outside.' },
    { q: 'Cephalization usually comes with which kind of symmetry?', a: 'Bilateral', o: ['Radial', 'Asymmetric', 'None, it’s random'], why: 'Bilateral animals move front-end first, so senses and nerves cluster in a head.' },
    { q: 'Which animals have no plane of symmetry at all?', a: 'Sponges and placozoans', o: ['Cnidarians and ctenophores', 'Insects and snails', 'Sea stars and fish'], why: 'Sponges and placozoans are asymmetrical. Cnidarians and ctenophores are radial.' },
    { q: 'Cnidarians catch large prey using…', a: 'Nematocysts (stinging harpoons)', o: ['Ctenes (comb plates)', 'Spicules', 'Choanocytes'], why: 'Nematocysts fire toxin-loaded harpoons. Ctenes are how ctenophores swim.' },
    { q: 'How does a hydrostatic skeleton work?', a: 'Squeezing fluid in one part makes another part bulge', o: ['Hard plates slide over each other', 'Spicules lock together', 'Cilia push against the ground'], why: 'Fluid can’t be compressed, so when muscles squeeze, the fluid moves and expands another region.' },
  ],
};
