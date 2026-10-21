// Lecture 11 · Ch 33 · Muscle and movement

import { E, T, Track, at, move, show, setText, smooth, keys, frac, lerp, clamp, win, nextId } from './kit.js';
import { fx, pill, pillText, pillAt, ease, eased, env } from './fx-b.js';

// little shape builders --------------------------------------------------------

/**
 * One sarcomere plus the edges of its neighbours, drawn around 0,0.
 * A = A-band length (= thick filament), L = how far thin filaments reach from a Z line, gap = row spacing.
 * Call .set(zh) with zh = half the Z-to-Z distance; it slides the filaments (they never change length).
 */
function sarcomere(parent, { A = 240, L = 150, gap = 34, small = false } = {}) {
  const g = E('g', { class: `m11-sarc${small ? ' small' : ''}` }, parent);
  const bandG = E('g', {}, g), thinG = E('g', {}, g), thickG = E('g', {}, g);
  const top = -2 * gap, h = 4 * gap, hl = gap * 0.2;
  const units = [-1, 0, 1].map(() => {
    const b = E('g', {}, bandG);
    E('rect', { x: -A / 2, y: top, width: A, height: h, class: 'm11-aband' }, b);
    const hz = E('rect', { y: top, height: h, class: 'm11-hzone' }, b);
    const k = E('g', {}, thickG);
    for (const y of [-gap, 0, gap]) {
      E('line', { x1: -A / 2, y1: y, x2: A / 2, y2: y, class: 'm11-myosin' }, k);
      // myosin heads stick out sideways, pointing away from the bare middle (M line)
      let d = '';
      for (let x = A * 0.07; x < A / 2 - 2; x += A * 0.046) d += `M${x.toFixed(1)},${y - 2}l${hl},${-hl}M${x.toFixed(1)},${y + 2}l${hl},${hl}M${(-x).toFixed(1)},${y - 2}l${-hl},${-hl}M${(-x).toFixed(1)},${y + 2}l${-hl},${hl}`;
      E('path', { d, class: 'm11-heads' }, k);
    }
    E('line', { x1: 0, y1: top + 3, x2: 0, y2: top + h - 3, class: 'm11-m' }, k);
    return { b, hz, k };
  });
  // thin filaments hang off both sides of every Z line
  const zs = [0, 1, 2, 3].map(() => {
    const z = E('g', {}, thinG);
    for (const r of [-1.5, -0.5, 0.5, 1.5]) E('line', { x1: -L, y1: r * gap, x2: L, y2: r * gap, class: 'm11-actin' }, z);
    E('line', { x1: 0, y1: top - 4, x2: 0, y2: top + h + 4, class: 'm11-z' }, z);
    return z;
  });
  g.set = zh => {
    const hw = Math.max(0, zh - L);
    units.forEach((u, j) => {
      const x = ((j - 1) * 2 * zh).toFixed(1);
      u.b.setAttribute('transform', `translate(${x} 0)`);
      u.k.setAttribute('transform', `translate(${x} 0)`);
      u.hz.setAttribute('x', (-hw).toFixed(1)); u.hz.setAttribute('width', (2 * hw).toFixed(1));
    });
    zs.forEach((z, i) => z.setAttribute('transform', `translate(${((2 * i - 3) * zh).toFixed(1)} 0)`));
  };
  return g;
}

/** A square bracket ⎴ (or ⎵ when up = true) from x1 to x2 at height y. */
function bracket(parent, cls = 'm11-bracket') {
  const p = E('path', { class: cls }, parent);
  p.span = (x1, x2, y, up = false) => { const k = up ? -5 : 5; p.setAttribute('d', `M${x1.toFixed(1)},${y + k}V${y}H${x2.toFixed(1)}V${y + k}`); };
  return p;
}

/** Pill-label highlight: warm background on, slightly faded off. */
function lit(t, on) { t.previousSibling.classList.toggle('warm', on); t.parentNode.setAttribute('opacity', on ? 1 : 0.78); }

// ---------------------------------------------------------------- 1. muscle → fiber → myofibril → sarcomere

const structure = {
  id: 'l11-structure', title: 'Zooming in: muscle → fiber → myofibril → sarcomere', dur: 14,
  build(svg) {
    fx(svg);
    const g = E('g', {}, svg);
    const MCX = 401;
    // ---- left column: names
    const NAMES = [[52, '① muscle', 'a bundle of fibers'], [122, '② muscle fiber', '1 cell, many nuclei'], [192, '③ myofibril', 'actin + myosin bundle'], [284, '④ sarcomere', 'repeat unit, Z to Z']];
    const names = NAMES.map(([y, a, b]) => {
      const grp = E('g', {}, g);
      T(grp, 14, y - 2, a, 'bl b-strong');
      T(grp, 14, y + 15, b, 'bs');
      return grp;
    });
    const legend = E('g', {}, g);
    E('line', { x1: 16, y1: 323, x2: 36, y2: 323, class: 'm11-actin' }, legend); T(legend, 44, 327, 'actin (thin)', 'bs b-strong b-teal-t');
    E('line', { x1: 16, y1: 342, x2: 36, y2: 342, class: 'm11-myosin' }, legend); T(legend, 44, 346, 'myosin (thick)', 'bs b-strong b-k-t');

    // ---- row 1: the whole muscle between two bones
    const r1 = E('g', {}, g);
    E('rect', { x: 186, y: 24, width: 22, height: 56, rx: 9, class: 'm11-bone' }, r1);
    E('rect', { x: 596, y: 24, width: 22, height: 56, rx: 9, class: 'm11-bone' }, r1);
    const tenL = E('line', { y1: 52, y2: 52, x1: 206, class: 'm11-tendon' }, r1);
    const tenR = E('line', { y1: 52, y2: 52, x2: 598, class: 'm11-tendon' }, r1);
    const belly = E('g', {}, r1);
    E('path', { d: `M236,52 C300,14 502,14 566,52 C502,90 300,90 236,52Z`, class: 'm11-belly' }, belly);
    for (let k = -2; k <= 2; k++) E('path', { d: `M246,52 C312,${52 + k * 11} 490,${52 + k * 11} 556,52`, class: 'm11-fibline' }, belly);
    E('rect', { x: 381, y: 46, width: 40, height: 12, rx: 5, class: 'm11-pick' }, belly);
    T(r1, 607, 16, 'bone', 'bs', { 'text-anchor': 'middle' });
    T(r1, 226, 16, 'tendon', 'bs', { 'text-anchor': 'middle' });

    // ---- row 2: one muscle fiber (a single multinucleate cell)
    const r2 = E('g', {}, g);
    const fib = E('g', {}, r2);
    E('rect', { x: 190, y: 104, width: 422, height: 36, rx: 18, class: 'm11-fiber' }, fib);
    for (const y of [113, 119, 125, 131]) E('line', { x1: 200, y1: y, x2: 602, y2: y, class: 'm11-mfline' }, fib);
    for (let x = 204; x < 600; x += 7) E('line', { x1: x, y1: 108, x2: x, y2: 136, class: 'm11-stri' }, fib);
    const NUC = [214, 258, 306, 352, 404, 452, 500, 548, 590];
    const nuclei = NUC.map((x, i) => E('ellipse', { cx: x, cy: i % 2 ? 135 : 109, rx: 10, ry: 3.6, class: 'm11-nuc' }, fib));
    E('rect', { x: 440, y: 115, width: 80, height: 14, rx: 6, class: 'm11-pick' }, fib);
    const nucT = pill(r2, 300, 160, 'nuclei: many in one cell', 'bs b-strong b-k-t', { 'text-anchor': 'middle' });

    // ---- row 3: one myofibril with its repeating bands
    const r3 = E('g', {}, g);
    const mf = E('g', {}, r3);
    const W = 422 / 8;
    E('rect', { x: 190, y: 180, width: 422, height: 24, rx: 12, class: 'm11-mf' }, mf);
    for (let i = 0; i < 8; i++) {
      const c = 190 + (i + 0.5) * W;
      E('rect', { x: c - W * 0.31, y: 181, width: W * 0.62, height: 22, class: 'm11-mfA' }, mf);
      E('rect', { x: c - W * 0.08, y: 181, width: W * 0.16, height: 22, class: 'm11-mfH' }, mf);
      if (i) E('line', { x1: 190 + i * W, y1: 178, x2: 190 + i * W, y2: 206, class: 'm11-z thin' }, mf);
    }
    E('rect', { x: 190 + 4 * W - 2, y: 176, width: W + 4, height: 32, rx: 4, class: 'm11-pick' }, mf);

    // ---- row 4: one sarcomere, clipped to the drawing area
    const clip = nextId('m11clip');
    E('rect', { x: 182, y: 230, width: 440, height: 120 }, E('clipPath', { id: clip }, E('defs', {}, g)));
    const r4 = E('g', {}, g);
    const r4c = E('g', { 'clip-path': `url(#${clip})` }, r4);
    const sg = E('g', { transform: `translate(${MCX} 284)` }, r4c);
    const sar = sarcomere(sg, { A: 240, L: 150, gap: 14, small: true });
    const zl = [-1, 1].map(() => T(r4, 0, 334, 'Z line', 'bs b-strong', { 'text-anchor': 'middle' }));
    T(r4, MCX, 334, 'M line', 'bs b-strong', { 'text-anchor': 'middle' });

    // ---- zoom connectors
    const Z = [
      [[381, 58], [421, 58], [612, 102], [190, 102]],
      [[440, 129], [520, 129], [612, 178], [190, 178]],
      [[190 + 4 * W, 208], [190 + 5 * W, 208], [600, 250], [202, 250]],
    ].map(p => E('path', { d: `M${p[0]}L${p[3]}M${p[1]}L${p[2]}`, class: 'm11-zoom' }, g));
    const rows = [r1, r2, r3, r4];
    return lt => {
      const step = Math.min(3, Math.floor(lt / 3));
      rows.forEach((r, k) => {
        show(r, k ? smooth(3 * k - 0.6, 3 * k, lt) : 1);
        r.classList.toggle('fxb-dim', k !== step && lt < 11);
        names[k].setAttribute('opacity', k <= step ? (k === step ? 1 : 0.6) : 0.25);
      });
      Z.forEach((z, k) => show(z, smooth(3 * k + 2, 3 * k + 2.8, lt) * 0.9));
      show(legend, smooth(9, 9.6, lt));
      nuclei.forEach((n, i) => n.classList.toggle('glow', lt > 3.4 + i * 0.12 && lt < 6.5));
      show(nucT.parentNode, win(lt, 3.6, 6, 0.3));
      // a quick contraction at the end: every sarcomere shortens, so the whole muscle does too
      const c = smooth(11, 11.9, lt) * (1 - smooth(12.9, 13.7, lt));
      const zh = 190 - 34 * c;
      sar.set(zh);
      zl.forEach((t, i) => t.setAttribute('x', (MCX + (i ? 1 : -1) * zh).toFixed(1)));
      const sx = 1 - 0.08 * c, sy = 1 + 0.14 * c;
      belly.setAttribute('transform', `translate(${MCX} 52) scale(${sx.toFixed(4)} ${sy.toFixed(4)}) translate(${-MCX} -52)`);
      tenL.setAttribute('x2', (MCX - 165 * sx).toFixed(1)); tenR.setAttribute('x1', (MCX + 165 * sx).toFixed(1));
      const fx2 = `translate(${MCX} 0) scale(${(1 - 0.05 * c).toFixed(4)} 1) translate(${-MCX} 0)`;
      fib.setAttribute('transform', fx2); mf.setAttribute('transform', fx2);
      if (lt < 3) return 'A skeletal muscle pulls on bones through tendons. It’s a bundle of many muscle fibers held together by connective tissue';
      if (lt < 6) return 'Zoom in: one muscle fiber is ONE giant cell with many nuclei (multinucleate), made when many embryonic cells fuse';
      if (lt < 9) return 'Inside each fiber run myofibrils: bundles of actin and myosin filaments with a repeating striped pattern';
      if (lt < 11) return 'Each repeat is a sarcomere, from one Z line to the next: thin actin hangs from the Z lines, thick myosin sits in the middle';
      return 'Contraction: every sarcomere shortens a little, and together they shorten the whole muscle';
    };
  },
  plain: [
    'Muscles power almost all behavior (walking, flying, swimming) and many body jobs, like the heart pumping blood. Skeletal muscle is the kind attached to the bones of the skeleton.',
    'One muscle = many muscle fibers bundled together by connective tissue. A muscle fiber is a single, very large cell with many nuclei (multinucleate), formed when many embryonic muscle cells fuse.',
    'Each fiber is packed with myofibrils: bundles of actin (thin) and myosin (thick) filaments arranged in repeating units called sarcomeres. The repeats are why skeletal muscle looks striped (striated).',
  ],
  terms: [
    ['Muscle fiber', 'One skeletal muscle cell: huge, multinucleate.'],
    ['Myofibril', 'Bundle of actin and myosin filaments inside a fiber.'],
    ['Sarcomere', 'The repeating contractile unit, Z line to Z line.'],
    ['Striated', 'Striped: the regular pattern of sarcomeres.'],
  ],
};

// ---------------------------------------------------------------- 2. sliding filaments

const sliding = {
  id: 'l11-sarcomere', title: 'Sliding filaments: what shortens and what doesn’t', dur: 14,
  build(svg) {
    fx(svg);
    const g = E('g', {}, svg);
    const CX = 320, CY = 170, A = 240, L = 150, R = 190, C = 155;
    const ghosts = [-1, 1].map(k => E('line', { x1: CX + k * R, x2: CX + k * R, y1: CY - 76, y2: CY + 76, class: 'm11-ghost' }, g));
    const sg = E('g', { transform: `translate(${CX} ${CY})` }, g);
    const sar = sarcomere(sg, { A, L, gap: 34 });
    // legend
    const lg = E('g', {}, g);
    E('line', { x1: 22, y1: 22, x2: 46, y2: 22, class: 'm11-actin' }, lg); T(lg, 54, 26, 'actin = thin filament', 'bs b-strong b-teal-t');
    E('line', { x1: 618, y1: 22, x2: 594, y2: 22, class: 'm11-myosin' }, lg); T(lg, 586, 26, 'myosin = thick filament', 'bs b-strong b-k-t', { 'text-anchor': 'end' });
    // brackets + labels
    const brA = bracket(g), brH = bracket(g), brI = [bracket(g), bracket(g)], brS = bracket(g);
    const tA = pill(g, CX, 54, 'A band', 'bs b-strong', { 'text-anchor': 'middle' });
    const tH = pill(g, CX, 82, 'H zone', 'bs b-strong', { 'text-anchor': 'middle' });
    const tI = [0, 1].map(() => pill(g, 0, 82, 'I band', 'bs b-strong', { 'text-anchor': 'middle' }));
    const tZ = [0, 1].map(() => pill(g, 0, 260, 'Z line', 'bs b-strong', { 'text-anchor': 'middle' }));
    const tM = pill(g, CX, 260, 'M line', 'bs b-strong', { 'text-anchor': 'middle' });
    const tS = pill(g, CX, 292, 'sarcomere', 'bs b-strong', { 'text-anchor': 'middle' });
    // live length bars along the bottom
    const BAR = [['sarcomere', 'shorter'], ['I band', 'shorter'], ['H zone', 'shorter'], ['A band', 'same!']];
    const bars = BAR.map(([name], i) => {
      const x = 28 + i * 152;
      const t = T(g, x, 322, name, 'bs b-strong');
      const ghost = E('rect', { x, y: 330, height: 10, rx: 5, class: 'm11-barghost' }, g);
      const bar = E('rect', { x, y: 330, height: 10, rx: 5, class: `m11-bar${i === 3 ? ' same' : ''}` }, g);
      return { t, ghost, bar, name };
    });
    const K = 0.3;
    return lt => {
      const c = eased(4.6, 7.6, lt) * (1 - eased(11.5, 13.5, lt));
      const zh = lerp(R, C, c);
      sar.set(zh);
      ghosts.forEach(gh => show(gh, c > 0.02 ? 0.9 : 0));
      const hw = Math.max(0, zh - L), iw = zh - A / 2;
      brA.span(CX - A / 2, CX + A / 2, 64);
      brH.span(CX - Math.max(hw, 2), CX + Math.max(hw, 2), 92);
      brI.forEach((b, i) => { const z = CX + (i ? 1 : -1) * zh; b.span(z - iw, z + iw, 92); pillAt(tI[i], z, 82); pillAt(tZ[i], z, 260); });
      brS.span(CX - zh, CX + zh, 270, true);
      // which labels to highlight
      const zPhase = lt < 2.3, bPhase = lt >= 2.3 && lt < 4.6, after = lt >= 7.6 && lt < 11.5;
      tZ.forEach(t => lit(t, zPhase || (after && c > 0.5))); lit(tM, zPhase);
      tI.forEach(t => lit(t, bPhase || after)); lit(tH, bPhase || after); lit(tA, bPhase); lit(tS, after);
      [zh * 2, 2 * zh - A, 2 * hw, A].forEach((w, i) => {
        const b = bars[i], w0 = [R * 2, 2 * R - A, 2 * (R - L), A][i];
        b.bar.setAttribute('width', Math.max(4, w * K).toFixed(1));
        b.ghost.setAttribute('width', (w0 * K).toFixed(1));
        setText(b.t, c > 0.5 ? `${b.name}: ${BAR[i][1]}` : b.name);
      });
      if (lt < 2.3) return 'One sarcomere runs from Z line to Z line. Thin actin filaments are anchored to the Z lines; thick myosin filaments sit in the middle, held at the M line';
      if (lt < 4.6) return 'Where only one kind of filament is, the band looks light: the I band (actin only) and the H zone (myosin only). The A band is the full length of the myosin';
      if (lt < 7.6) return 'Contraction: myosin pulls the actin toward the M line. The filaments slide past each other; neither one gets shorter';
      if (lt < 11.5) return 'More overlap → Z lines closer, H zone and I band shrink. The A band stays the same because myosin itself never changes length';
      return 'Relaxing: the filaments slide back apart and the sarcomere gets longer again';
    };
  },
  plain: [
    'Sliding filament theory: a muscle contracts because actin and myosin filaments slide past each other, increasing their overlap. Muscle contraction means developing mechanical force.',
    'Each sarcomere starts and ends with a Z line, where the actin (thin) filaments attach. Myosin (thick) filaments extend out from the M band (M line) in the center. The H zone (myosin only) and I band (actin only) have no overlap, so they look light.',
    'When a muscle contracts: sarcomeres shorten (Z lines closer), the H zone shrinks (actin ends move closer together) and the I band shrinks (smaller gap between myosin and the Z line). The A band doesn’t change, because it’s the length of the myosin filaments, and they don’t shrink.',
  ],
  terms: [
    ['Z line', 'End of a sarcomere; actin filaments attach here.'],
    ['M band (M line)', 'Middle of the sarcomere; myosin filaments are anchored here.'],
    ['A band', 'Full length of the myosin filaments. Stays the same.'],
    ['I band', 'Actin only, around each Z line. Shrinks.'],
    ['H zone', 'Myosin only, in the middle. Shrinks.'],
  ],
};

// ---------------------------------------------------------------- 3. cross-bridge cycle

const bridge = {
  id: 'l11-crossbridge', title: 'The cross-bridge cycle: Ca²⁺, troponin, myosin and ATP', dur: 16,
  vars: { ca: 'on' },
  build(svg, s, ui) {
    ui.seg('ca', [['on', 'Ca²⁺ present'], ['off', 'No Ca²⁺']], 'Calcium');
    fx(svg);
    const g = E('g', {}, svg);
    const ACY = 132, PX = 300, PY = 266, BS = 16;
    // legend
    const lg = E('g', {}, g);
    E('circle', { cx: 24, cy: 24, r: 6, class: 'm11-bead' }, lg); T(lg, 34, 28, 'actin', 'bs b-strong');
    E('line', { x1: 82, y1: 24, x2: 102, y2: 24, class: 'm11-tropo' }, lg); T(lg, 108, 28, 'tropomyosin', 'bs b-strong');
    E('ellipse', { cx: 196, cy: 24, rx: 8, ry: 6, class: 'm11-tropn' }, lg); T(lg, 208, 28, 'troponin', 'bs b-strong');
    E('circle', { cx: 278, cy: 24, r: 6, class: 'p-ca' }, lg); T(lg, 288, 28, 'Ca²⁺', 'bs b-strong');
    E('circle', { cx: 330, cy: 24, r: 6, class: 'm11-bead site on' }, lg); T(lg, 340, 28, 'myosin-binding site', 'bs b-strong');
    const srT = pill(g, 618, 56, 'Ca²⁺ from the SR', 'bs b-strong b-gold-t', { 'text-anchor': 'end' });
    // thick filament with a few resting heads
    E('line', { x1: -20, y1: PY + 14, x2: 660, y2: PY + 14, class: 'm11-thick' }, g);
    for (const x of [90, 170, 450, 540]) {
      E('line', { x1: x, y1: PY + 8, x2: x - 26, y2: PY - 44, class: 'm11-neck idle' }, g);
      E('ellipse', { rx: 20, ry: 12, class: 'm11-head idle', transform: `translate(${x - 32} ${PY - 56}) rotate(-116)` }, g);
    }
    pill(g, 20, 320, 'thick filament (myosin)', 'bs b-strong b-k-t');
    pill(g, 620, 320, 'toward the M line →', 'bs b-strong', { 'text-anchor': 'end' });
    pill(g, 20, 90, '← thin filament (actin), from the Z line', 'bs b-strong b-teal-t');
    // actin filament: two twisted strands of beads, tropomyosin and troponin ride on it
    const act = E('g', {}, g);
    const sites = [];
    for (let i = -16; i < 44; i++) {
      const w = Math.sin(i * 0.39);
      E('circle', { cx: i * BS, cy: ACY - 7 + 1.5 * w, r: 8, class: 'm11-bead' }, act);
      const b = E('circle', { cx: i * BS + 4, cy: ACY + 7 - 1.5 * w, r: 8, class: `m11-bead${(i % 5 + 5) % 5 === 1 ? ' site' : ''}` }, act);
      if ((i % 5 + 5) % 5 === 1) sites.push(b);
    }
    const tropo = E('g', {}, act);
    let td = '';
    for (let x = -260; x <= 720; x += 10) td += `${td ? 'L' : 'M'}${x},${(ACY + 9 + 2.2 * Math.sin(x / 34)).toFixed(1)}`;
    E('path', { d: td, class: 'm11-tropo' }, tropo);
    const TROP = [-260, -100, 60, 220, 380, 540, 700];
    TROP.forEach(x => E('ellipse', { cx: x, cy: ACY + 16, rx: 10, ry: 7, class: 'm11-tropn' }, tropo));
    const cas = TROP.map(() => E('circle', { r: 6.5, class: 'p-ca' }, g));
    // the working myosin head
    const neck = E('line', { class: 'm11-neck' }, g);
    const head = E('ellipse', { rx: 23, ry: 13.5, class: 'm11-head' }, g);
    const headT = pill(g, 0, 0, 'myosin head', 'bs b-strong b-k-t');
    const nuc = pill(g, 0, 0, 'ADP + Pᵢ', 'bs b-strong b-gold-t', { 'text-anchor': 'end' });
    const spark = E('circle', { r: 0, class: 'm11-spark' }, g);
    const blockT = pill(g, 150, 196, 'sites covered: no grip', 'bs b-strong b-acid-t', { 'text-anchor': 'middle' });
    return lt => {
      const on = s.vars.ca === 'on';
      let a = 0, d = -40, off = 0, shift = 0, ca = 0;
      if (on) {
        shift = smooth(3.0, 3.9, lt) * (1 - smooth(14.5, 15.2, lt));
        ca = eased(2, 3.1, lt) * (1 - eased(13.8, 14.7, lt));
        a = keys(lt, [[4.1, 0], [5.1, 1], [8.7, 1], [9.4, 0], [11.6, 0], [12.0, 1], [12.9, 1], [13.2, 0]]);
        d = keys(lt, [[5.4, -40], [7.4, 40], [9.6, 40], [11.3, -40], [12.0, -40], [12.8, 40], [13.3, 40], [13.8, -40]]);
        off = keys(lt, [[5.4, 0], [7.4, 80], [12.0, 80], [12.8, 160], [15.0, 160], [16, 0]]);
      } else {
        a = 0.12 * (0.5 + 0.5 * Math.sin(lt * 1.6));
      }
      act.setAttribute('transform', `translate(${off.toFixed(1)} 0)`);
      tropo.setAttribute('transform', `translate(0 ${(-10 * shift).toFixed(2)})`);
      sites.forEach(b => b.classList.toggle('on', shift > 0.6));
      // Ca²⁺ flies in from the SR, docks on troponin (and rides along), then is pumped back
      cas.forEach((c, i) => {
        const dock = [TROP[i] + off, ACY + 27 - 10 * shift];
        const src = [596 - (i % 4) * 11, 70 + (i % 3) * 9];
        at(c, lerp(src[0], dock[0], ca), lerp(src[1], dock[1], ca) - 30 * Math.sin(Math.PI * ca));
        show(c, on ? smooth(1.4, 2, lt) * (1 - smooth(14.7, 15.2, lt)) * (dock[0] > -10 && dock[0] < 650 ? 1 : 1 - ca) : 0);
      });
      show(srT.parentNode, on ? win(lt, 1.2, 15, 0.4) : 0);
      // head geometry: tip at (PX + d, y); bound tip touches the actin
      const tx = PX + d, ty = lerp(ACY + 52, ACY + 19, a);
      const ang = Math.atan2(ty - PY, tx - PX);
      const hx = tx - Math.cos(ang) * 18, hy = ty - Math.sin(ang) * 18;
      neck.setAttribute('x1', PX); neck.setAttribute('y1', PY + 8);
      neck.setAttribute('x2', (hx - Math.cos(ang) * 14).toFixed(1)); neck.setAttribute('y2', (hy - Math.sin(ang) * 14).toFixed(1));
      // the head itself tilts more than the neck, so the oar-like stroke is easy to see
      head.setAttribute('transform', `translate(${hx.toFixed(1)} ${hy.toFixed(1)}) rotate(${(ang * 180 / Math.PI + 0.8 * d).toFixed(1)})`);
      head.classList.toggle('bound', a > 0.6);
      pillAt(headT, hx + 30, hy + 34);
      // the nucleotide on the head: ADP + Pᵢ (cocked) → released in the stroke → ATP binds → split again
      let txt = 'ADP + Pᵢ', op = 1, nx = hx - 30, ny = hy + 34;
      if (on) {
        if (lt >= 5.6 && lt < 7.4) { const u = smooth(5.6, 7.0, lt); op = 1 - u; nx -= 20 * u; ny += 40 * u; }
        else if (lt >= 7.4 && lt < 9.8) { txt = 'ATP'; const u = eased(7.4, 8.6, lt); nx = lerp(560, nx, u); ny = lerp(300, ny, u); op = smooth(7.4, 7.7, lt); }
        else if (lt >= 12.0 && lt < 12.9) op = 1 - smooth(12.0, 12.4, lt);
        else if (lt >= 12.9 && lt < 13.5) { txt = 'ATP'; op = smooth(12.9, 13.1, lt); }
      }
      pillText(nuc, txt); pillAt(nuc, nx, ny); show(nuc.parentNode, op);
      const sp = on ? win(lt, 9.7, 10.5, 0.2) + win(lt, 13.5, 13.9, 0.1) : 0;
      at(spark, hx, hy); spark.setAttribute('r', (8 + 8 * sp).toFixed(1)); show(spark, sp * 0.7);
      show(blockT.parentNode, on ? 0 : 1);
      if (!on) return lt < 8 ? 'No Ca²⁺: tropomyosin lies over the myosin-binding sites on actin, held in place by troponin…'
        : '…so the cocked myosin head can’t form a cross-bridge. No cross-bridges, no contraction: the muscle stays relaxed';
      if (lt < 2) return 'At rest, tropomyosin (yellow) covers the myosin-binding sites on actin. The myosin head is already “cocked”, holding ADP + Pᵢ';
      if (lt < 4.1) return 'Ca²⁺ arrives and binds troponin. Troponin changes shape and pulls tropomyosin off the binding sites';
      if (lt < 5.4) return 'The myosin head grabs an exposed site on actin: a cross-bridge';
      if (lt < 7.5) return 'Power stroke: the head bends like an oar and pulls the actin toward the M line (ADP + Pᵢ are released)';
      if (lt < 9.6) return 'A fresh ATP binds the head, and the head lets go of actin';
      if (lt < 11.6) return 'The head splits the ATP (→ ADP + Pᵢ). That energy re-cocks the head, ready to grab again';
      if (lt < 13.8) return 'As long as Ca²⁺ and ATP are there, the cycle repeats: grab, pull, let go, re-cock. Each pull slides the actin further';
      return 'Ca²⁺ is pumped back into the SR. Tropomyosin covers the sites again, no more cross-bridges, so contraction stops';
    };
  },
  plain: [
    'An actin filament is two twisted chains of actin monomers. The protein tropomyosin twists along it and blocks the myosin-binding sites; troponin molecules hold tropomyosin in place.',
    'A myosin molecule is two polypeptide chains coiled together, ending in a globular head. A thick filament is many myosin molecules with their heads sticking out to the sides.',
    'When Ca²⁺ binds troponin, troponin changes shape and moves tropomyosin, exposing the binding sites. Myosin heads bind actin (cross-bridges), bend to pull actin toward the M band (a rowing motion), then use ATP to let go and re-cock. The cycle repeats as long as Ca²⁺ and ATP are available.',
    'When excitation ends, calcium pumps move Ca²⁺ out of the sarcoplasm (the muscle cell’s cytoplasm) back into the SR. Troponin and tropomyosin return to their original state, tropomyosin blocks the sites again and contraction stops.',
  ],
  terms: [
    ['Tropomyosin', 'Strand on actin that blocks the myosin-binding sites at rest.'],
    ['Troponin', 'Holds tropomyosin in place; binding Ca²⁺ makes it move tropomyosin away.'],
    ['Cross-bridge', 'A myosin head bound to actin.'],
    ['Power stroke', 'The head bends and pulls actin toward the M band.'],
    ['ATP’s jobs', 'Binding ATP releases the head; splitting ATP re-cocks it.'],
  ],
};

// ---------------------------------------------------------------- 4. excitation: nerve → T tubules → SR → Ca²⁺

const excite = {
  id: 'l11-excite', title: 'From nerve signal to Ca²⁺ release', dur: 14,
  build(svg) {
    fx(svg);
    const g = E('g', {}, svg);
    const MY = 120, NX = 150, TX = [90, 240, 390, 540], ROWS = [160, 250], RH = 40;
    // muscle fiber
    E('rect', { x: 20, y: MY, width: 600, height: 228, rx: 18, class: 'm11-fiberbg' }, g);
    // sarcoplasmic reticulum: a sleeve around each myofibril between T tubules
    const segs = [[26, TX[0]], [TX[0], TX[1]], [TX[1], TX[2]], [TX[2], TX[3]], [TX[3], 614]];
    const sr = [];
    ROWS.forEach(y => segs.forEach(([a, b]) => sr.push(E('rect', { x: a + 6, y: y - 9, width: b - a - 12, height: RH + 18, rx: 9, class: 'm11-sr' }, g))));
    // myofibrils
    const mfs = ROWS.map(y => {
      const m = E('g', {}, g);
      E('rect', { x: 30, y, width: 580, height: RH, rx: 8, class: 'm11-mf' }, m);
      for (let x = 44; x < 600; x += 46) {
        if (x + 46 < 610) E('rect', { x: x + 8, y: y + 1, width: 30, height: RH - 2, class: 'm11-mfA' }, m);
        E('line', { x1: x, y1: y + 1, x2: x, y2: y + RH - 1, class: 'm11-z thin' }, m);
      }
      return m;
    });
    // T tubules: tunnels of the surface membrane reaching deep into the fiber
    const tts = TX.map(x => { E('rect', { x: x - 4, y: MY - 1, width: 8, height: 214, rx: 4, class: 'm11-tt' }, g); return E('rect', { x: x - 4, y: MY - 1, width: 8, height: 0, rx: 4, class: 'm11-tt-on' }, g); });
    E('line', { x1: 32, y1: MY, x2: 608, y2: MY, class: 'm11-memb' }, g);
    const ap = E('line', { y1: MY, y2: MY, class: 'm11-ap' }, g);
    // motor neuron
    const AX = 'M-10,26 C70,26 120,40 146,92';
    E('path', { d: AX, class: 'm11-axon' }, g);
    const term = E('ellipse', { cx: NX, cy: 100, rx: 24, ry: 9, class: 'm11-term' }, g);
    const track = new Track(g, AX);
    const spark = E('circle', { r: 7, class: 'b-spark' }, g);
    const nts = Array.from({ length: 6 }, () => E('circle', { r: 2.6, class: 'p-hor' }, g));
    // Ca²⁺ stored in the SR
    const cas = Array.from({ length: 34 }, (_, i) => {
      const row = ROWS[i % 2], seg = segs[Math.floor(i / 2) % 5];
      const x0 = lerp(seg[0] + 16, seg[1] - 16, ((i * 0.37) % 1));
      const home = [x0, i % 4 < 2 ? row - 4 : row + RH + 4];
      const dest = [x0 + 10 * Math.sin(i * 2.3), row + 8 + ((i * 7) % (RH - 16))];
      return { el: E('circle', { r: 4.2, class: 'p-ca' }, g), home, dest, i };
    });
    pill(g, 176, 36, 'motor neuron axon', 'bs b-strong');
    const njT = pill(g, 182, 96, 'neuromuscular junction', 'bs b-strong');
    const mbT = pill(g, 470, 104, 'muscle fiber membrane', 'bs b-strong', { 'text-anchor': 'middle' });
    const ttT = pill(g, 398, 230, '← T tubule', 'bs b-strong');
    const srT = pill(g, 320, 330, 'sarcoplasmic reticulum (SR): stores Ca²⁺', 'bs b-strong b-gold-t', { 'text-anchor': 'middle' });
    const mfT = pill(g, 160, 230, 'myofibrils', 'bs b-strong', { 'text-anchor': 'middle' });
    return (lt, _dt, t) => {
      // 1) action potential down the axon
      const u = smooth(0.2, 2.5, lt);
      const [sx, sy] = track.pos(u);
      at(spark, sx, sy); show(spark, u > 0 && lt < 2.6 ? 1 : 0);
      term.classList.toggle('glow', lt > 2.3 && lt < 4.4);
      lit(njT, lt > 2.3 && lt < 4.4);
      // 2) neurotransmitter crosses the tiny gap
      nts.forEach((n, i) => { const k = smooth(2.6 + i * 0.12, 3.4 + i * 0.12, lt); at(n, NX - 12 + i * 5, lerp(108, MY - 3, k)); show(n, k > 0 && k < 1 ? 1 : 0); });
      // 3) muscle action potential spreads along the membrane and down the T tubules
      const dd = 520 * smooth(3.8, 6.2, lt);
      const on = lt > 3.8 && lt < 8.6;
      ap.setAttribute('x1', Math.max(32, NX - dd).toFixed(1)); ap.setAttribute('x2', Math.min(608, NX + dd).toFixed(1));
      show(ap, on ? 1 - smooth(8, 8.6, lt) : 0);
      lit(mbT, lt > 3.8 && lt < 6);
      tts.forEach((r, i) => {
        const k = clamp((dd - Math.abs(TX[i] - NX)) / 120);
        r.setAttribute('height', (214 * k).toFixed(1));
        show(r, on ? 1 - smooth(8, 8.6, lt) : 0);
      });
      lit(ttT, lt > 5 && lt < 7.2);
      // 4) the SR releases Ca²⁺ into the myofibrils, 5) then pumps it back
      const srOn = lt > 6.6 && lt < 12.6;
      sr.forEach(r => r.classList.toggle('on', srOn));
      lit(srT, lt > 6.6 && lt < 10 || lt > 12.6);
      cas.forEach(c => {
        const k = eased(6.8 + (c.i % 7) * 0.22, 8.4 + (c.i % 7) * 0.22, lt) * (1 - eased(12.4 + (c.i % 5) * 0.12, 13.5 + (c.i % 5) * 0.12, lt));
        const j = 2 * k;
        at(c.el, lerp(c.home[0], c.dest[0], k) + j * Math.sin(t * 2.1 + c.i), lerp(c.home[1], c.dest[1], k) + j * Math.cos(t * 1.7 + c.i * 2));
      });
      // 6) Ca²⁺ in the myofibrils → sarcomeres shorten
      const c = smooth(9.6, 10.8, lt) * (1 - smooth(12.8, 13.8, lt));
      mfs.forEach(m => m.setAttribute('transform', `translate(320 0) scale(${(1 - 0.06 * c).toFixed(4)} 1) translate(-320 0)`));
      lit(mfT, c > 0.3);
      if (lt < 2.6) return 'A motor neuron fires: its action potential races down the axon to the neuromuscular junction';
      if (lt < 3.8) return 'At the junction it releases a neurotransmitter (acetylcholine) onto the muscle fiber';
      if (lt < 6.6) return 'That starts an action potential in the muscle fiber’s own membrane (muscle cells are excitable). It spreads along the surface and down the T tubules';
      if (lt < 9.6) return 'Deep inside the fiber, the signal makes the sarcoplasmic reticulum (SR) release its stored Ca²⁺';
      if (lt < 12.4) return 'Ca²⁺ floods the myofibrils, binds troponin, cross-bridges form and the sarcomeres shorten';
      return 'When the nerve stops firing, calcium pumps move Ca²⁺ back into the SR and the fiber relaxes';
    };
  },
  plain: [
    'Muscle cells are excitable: their membranes can make and conduct action potentials (electrical impulses), just like neurons.',
    'Each muscle fiber is touched by an axon of a motor neuron at a neuromuscular junction. When a nerve impulse arrives there, it starts an action potential in the muscle fiber membrane.',
    'The action potential spreads along the membrane and down the T tubules (tunnels of membrane that dive deep into the fiber). That triggers the sarcoplasmic reticulum (SR), a separate membrane sleeve wrapped around every myofibril, to release the Ca²⁺ it stores. Ca²⁺ binds troponin and contraction starts.',
  ],
  terms: [
    ['Neuromuscular junction', 'Where a motor neuron’s axon meets a muscle fiber.'],
    ['Excitable', 'Able to make and conduct action potentials.'],
    ['T tubules', 'Inward tunnels of the fiber membrane that carry the action potential deep inside.'],
    ['Sarcoplasmic reticulum', 'Membrane sleeve around myofibrils that stores and releases Ca²⁺.'],
  ],
};

// ---------------------------------------------------------------- 5. ATP systems and fiber types

const energy = {
  id: 'l11-energy', title: 'Three ways to make ATP, and red vs white fibers', dur: 12,
  build(svg) {
    fx(svg);
    const g = E('g', {}, svg);
    const GX0 = 70, GX1 = 390, GY = 290, GT = 64;
    const gx = u => GX0 + u / 4 * (GX1 - GX0);        // u = log10(seconds), 1 s … 10 000 s
    const gy = p => GY - p * (GY - GT);
    E('path', { d: `M${GX0},${GT - 16} L${GX0},${GY} L${GX1 + 6},${GY}`, class: 'b-axis' }, g);
    [[0, '1 s'], [1, '10 s'], [Math.log10(60), '1 min'], [Math.log10(600), '10 min'], [Math.log10(3600), '1 h']].forEach(([u, s]) => {
      E('line', { x1: gx(u), y1: GY, x2: gx(u), y2: GY + 5, class: 'b-axis' }, g);
      T(g, gx(u), GY + 18, s, 'bs', { 'text-anchor': 'middle' });
    });
    T(g, (GX0 + GX1) / 2, GY + 38, 'how long all-out effort lasts (log scale)', 'bs', { 'text-anchor': 'middle' });
    T(g, 30, (GY + GT) / 2, 'power output', 'bs', { 'text-anchor': 'middle', transform: `rotate(-90 30 ${(GY + GT) / 2})` });
    const SYS = [
      { name: 'immediate', sub: 'stored ATP + creatine phosphate', cls: 'imm', t: 'b-gold-t', p: u => 0.92 * (1 - smooth(0.85, 1.35, u)), t0: 0.6, lx: 0 },
      { name: 'glycolytic', sub: 'glycolysis, no O₂ needed', cls: 'gly', t: 'blue-t', p: u => 0.56 * (1 - smooth(1.85, 2.45, u)), t0: 2.6, lx: 1.45 },
      { name: 'oxidative', sub: 'mitochondria + O₂', cls: 'oxi', t: 'red-t', p: u => 0.24 * (1 - 0.3 * smooth(2.6, 4, u)), t0: 4.6, lx: 2.6 },
    ];
    const curves = SYS.map(sy => {
      const path = E('path', { class: `m11-cv ${sy.cls}` }, g);
      const lab = E('g', {}, g);
      T(lab, gx(sy.lx) + 8, gy(sy.p(sy.lx)) - 22, sy.name, `bl b-strong ${sy.t}`);
      T(lab, gx(sy.lx) + 8, gy(sy.p(sy.lx)) - 7, sy.sub, 'bs');
      return { ...sy, path, lab };
    });
    // right: the two main fiber types
    E('line', { x1: 410, y1: 30, x2: 410, y2: 330, class: 'b-grid' }, g);
    const fib = (y, red) => {
      const grp = E('g', {}, g);
      T(grp, 524, y - 50, red ? 'slow oxidative = “red”' : 'fast glycolytic = “white”', `bs b-strong ${red ? 'red-t' : 'blue-t'}`, { 'text-anchor': 'middle' });
      const R = red ? 30 : 36, cx = 458;
      const caps = red ? 7 : 2;
      for (let k = 0; k < caps; k++) { const a = k / caps * 6.283 + 0.4; E('circle', { cx: cx + Math.cos(a) * (R + 6), cy: y + Math.sin(a) * (R + 6), r: 3.4, class: 'm11-cap' }, grp); }
      E('circle', { cx, cy: y, r: R, class: red ? 'm11-redfib' : 'm11-whitefib' }, grp);
      const mito = red ? 11 : 3;
      for (let k = 0; k < mito; k++) { const a = k * 2.4, r = R * (0.25 + 0.6 * ((k * 0.37) % 1)); E('ellipse', { cx: cx + Math.cos(a) * r, cy: y + Math.sin(a) * r, rx: 5, ry: 2.6, transform: `rotate(${k * 47} ${cx + Math.cos(a) * r} ${y + Math.sin(a) * r})`, class: 'm11-mito' }, grp); }
      (red ? ['lots of myoglobin', 'many mitochondria', 'slow, lasts long'] : ['no myoglobin', 'few mitochondria', 'fast, tires quickly'])
        .forEach((s2, k) => T(grp, 502, y - 12 + k * 17, s2, 'bs b-strong'));
      return grp;
    };
    const red = fib(112, true), white = fib(246, false);
    const mixT = pill(g, 524, 330, 'mixed in human muscles', 'bs', { 'text-anchor': 'middle' });
    return lt => {
      curves.forEach((c, i) => {
        const k = smooth(c.t0, c.t0 + 2, lt) * 4;
        let d = '';
        for (let u = 0; u <= k + 1e-6; u += 0.04) d += `${d ? 'L' : 'M'}${gx(u).toFixed(1)},${gy(c.p(u)).toFixed(1)}`;
        c.path.setAttribute('d', d || 'M0,0');
        show(c.lab, smooth(c.t0, c.t0 + 0.4, lt));
        const hl = (i === 2 && lt >= 7.6 && lt < 9.8) || (i === 1 && lt >= 9.8);
        c.path.classList.toggle('fxb-hl', hl);
      });
      show(red, smooth(7.6, 8.1, lt)); show(white, smooth(9.8, 10.3, lt));
      red.classList.toggle('fxb-dim', lt >= 9.8); show(mixT.parentNode, smooth(10.8, 11.2, lt));
      if (lt < 2.6) return 'Immediate system: ATP already stored in the cell (plus creatine phosphate). The highest power, but only for seconds';
      if (lt < 4.6) return 'Glycolytic system: glycolysis makes ATP quickly without O₂. Medium power, for about a minute or two';
      if (lt < 7.6) return 'Oxidative system: mitochondria use O₂ to make ATP. The lowest power, but it keeps going for hours';
      if (lt < 9.8) return 'Slow oxidative (“red”) fibers use the oxidative system: myoglobin brings in O₂, lots of mitochondria. Slow but tireless';
      return 'Fast glycolytic (“white”) fibers use glycolysis: quick, strong, but they tire fast. No myoglobin, few mitochondria';
    };
  },
  plain: [
    'Muscles need ATP, from three systems. Power: immediate > glycolytic > oxidative. Endurance: the opposite order (oxidative lasts longest). In real exercise all three run at once.',
    'Slow oxidative (slow-twitch, “red”) fibers: lots of myoglobin, a hemoglobin-like protein that makes them red and speeds O₂ into the cell; many mitochondria; they develop tension slowly but keep up low power for a long time.',
    'Fast glycolytic (fast-twitch, “white”) fibers: lots of enzymes for anaerobic glycolysis, so ATP is made fast; they contract quickly but tire quickly; few mitochondria and no myoglobin. Mammal muscles mix both types; in fish and other animals a muscle can be nearly all red or all white.',
  ],
  terms: [
    ['Immediate system', 'Preformed ATP + creatine phosphate: most power, seconds.'],
    ['Glycolytic system', 'Anaerobic glycolysis: medium power, about a minute or two.'],
    ['Oxidative system', 'Aerobic, in mitochondria: lowest power, hours.'],
    ['Myoglobin', 'Hemoglobin-like O₂ protein in red fibers.'],
  ],
};

export default {
  id: 'L11', n: '11', short: 'Muscle', color: '--b-water', chapter: 'Ch 33',
  title: 'Muscle and movement',
  minute: [
    'Skeletal muscle = bundles of muscle fibers; each fiber is one huge multinucleate cell full of myofibrils, made of repeating sarcomeres.',
    'Sliding filaments: thin actin (anchored at Z lines) slides past thick myosin (anchored at the M line). Sarcomere, I band and H zone shrink; A band stays the same.',
    'Excitation: motor neuron → neuromuscular junction → action potential along the fiber membrane and down T tubules → SR releases Ca²⁺.',
    'Ca²⁺ binds troponin → tropomyosin moves → myosin heads bind actin (cross-bridges) and pull toward the M line. ATP lets the head go and re-cocks it. Pumps return Ca²⁺ to the SR → relax.',
    'Muscles only pull, so they work in antagonistic pairs (biceps bends the arm, triceps straightens it).',
    'ATP: immediate (most power, seconds) > glycolytic > oxidative (least power, hours). Red = slow oxidative (myoglobin, mitochondria); white = fast glycolytic. Training reshapes fibers (phenotypic plasticity).',
    'Cardiac: striated, 1 nucleus, intercalated discs with gap junctions, pacemaker cells. Smooth: not striated, sheets joined by gap junctions, in organs and vessel walls.',
  ],
  traps: [
    'The A band does NOT shorten: it’s the length of the myosin filaments. Sarcomere, I band and H zone do.',
    'Filaments slide; actin and myosin themselves never get shorter.',
    'Ca²⁺ binds TROPONIN (not tropomyosin, not myosin). Troponin then moves tropomyosin.',
    'The Ca²⁺ comes from the sarcoplasmic reticulum inside the fiber, released when the action potential travels down the T tubules.',
    'ATP binding makes myosin LET GO of actin; ATP splitting re-cocks the head. No ATP → heads stay stuck (rigor mortis).',
    'Power: immediate > glycolytic > oxidative. Endurance is the opposite order.',
    'Red fibers = slow oxidative (myoglobin, many mitochondria). White fibers = fast glycolytic (no myoglobin, few mitochondria).',
  ],
  links: [
    ['Motor neurons and action potentials → Lecture 8', 'L8'],
    ['Cardiac muscle and the SA node pacemaker → Lecture 5', 'L5'],
    ['Myoglobin’s cousin hemoglobin carries O₂ → Lecture 5', 'L5'],
    ['Smooth muscle squeezes food along (peristalsis) → Lecture 7', 'L7'],
    ['ATP, the cell’s energy currency → Lecture 2', 'L2'],
    ['Shivering: skeletal muscle making heat → Lecture 3', 'L3'],
  ],
  scenes: [structure, sliding, bridge, excite, energy],
  quiz: [
    { q: 'What is special about a skeletal muscle fiber compared with most body cells?', a: 'It’s one huge cell with many nuclei, formed by fusion of embryonic cells', o: ['It has no nucleus at all', 'It’s a tiny cell with one nucleus', 'It can’t make action potentials'], why: 'Skeletal muscle fibers are large multinucleate cells formed by the fusion of many embryonic muscle cells, and they’re excitable.' },
    { q: 'When a sarcomere contracts, which part stays the same length?', a: 'A band', o: ['I band', 'H zone', 'The distance between Z lines'], why: 'The A band is the length of the myosin filaments, which don’t change. The I band, H zone and sarcomere all shrink as overlap increases.' },
    { q: 'Thin filaments are made mainly of…', a: 'Actin', o: ['Myosin', 'Myoglobin', 'Troponin only'], why: 'Actin = thin filaments (with tropomyosin and troponin). Myosin = thick filaments.' },
    { q: 'Actin filaments are anchored at the…', a: 'Z lines', o: ['M band', 'H zone', 'T tubules'], why: 'Each sarcomere starts and ends with a Z line, where actin attaches. Myosin extends from the M band in the center.' },
    { q: 'What does Ca²⁺ bind to in order to start contraction?', a: 'Troponin', o: ['Tropomyosin', 'The myosin head', 'ATP'], why: 'Ca²⁺ binds troponin, which changes shape and moves tropomyosin off the myosin-binding sites on actin.' },
    { q: 'At rest, what blocks myosin from binding to actin?', a: 'Tropomyosin', o: ['Troponin', 'Ca²⁺', 'Myoglobin'], why: 'Tropomyosin lies over the binding sites; troponin holds it there until Ca²⁺ arrives.' },
    { q: 'Where does the Ca²⁺ for contraction come from?', a: 'The sarcoplasmic reticulum inside the muscle fiber', o: ['The motor neuron’s axon terminal', 'The blood plasma only', 'The mitochondria'], why: 'An action potential spreads down the T tubules and triggers the SR to release its stored Ca²⁺.' },
    { q: 'In the cross-bridge cycle, what happens when a new ATP binds the myosin head?', a: 'The head lets go of actin', o: ['The head binds actin', 'Ca²⁺ is released from troponin', 'The Z lines disappear'], why: 'ATP binding releases the head; splitting ATP then re-cocks it for the next stroke.' },
    { q: 'How does contraction stop?', a: 'Calcium pumps move Ca²⁺ back into the SR, so tropomyosin covers the binding sites again', o: ['Myosin runs out of heads', 'Actin filaments break apart', 'The A band shortens to zero'], why: 'Without Ca²⁺ on troponin, tropomyosin returns to block the sites and no cross-bridges can form.' },
    { q: 'Which ATP system gives the HIGHEST power but lasts the SHORTEST time?', a: 'Immediate system', o: ['Glycolytic system', 'Oxidative system', 'All three are equal'], why: 'Power: immediate > glycolytic > oxidative; endurance is the opposite order.' },
    { q: 'A marathon runner’s leg muscles likely have more…', a: 'Slow oxidative (red) fibers', o: ['Fast glycolytic (white) fibers', 'Smooth muscle cells', 'Cells with no mitochondria'], why: 'Endurance athletes tend to have more red fibers: myoglobin, many mitochondria, slow but fatigue-resistant.' },
    { q: 'What lets cardiac muscle cells contract together as one unit?', a: 'Gap junctions in intercalated discs', o: ['Each cell has many nuclei', 'They lack sarcomeres', 'Antagonistic pairs'], why: 'Gap junctions electrically connect neighbouring cells, so the action potential spreads from cell to cell.' },
  ],
};
