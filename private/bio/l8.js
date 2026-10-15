// Lecture 8 · Ch 31.1–31.5 · Nervous systems

import { E, T, Track, at, move, show, setText, smooth, keys, frac, lerp, clamp, gauss, TAU, win } from './kit.js';

// ---------------------------------------------------------------- 1. the parts of a neuron

const neuron = {
  id: 'l8-neuron', title: 'A neuron, and the path a signal takes', dur: 10,
  build(svg) {
    const g = E('g', {}, svg);
    const DEND = ['M140,170 C110,150 90,120 60,100', 'M90,128 C80,110 70,90 74,70', 'M140,186 C100,190 70,200 34,196', 'M142,198 C116,226 96,250 70,268', 'M96,246 C80,248 60,244 44,236', 'M120,158 C120,120 132,90 150,64'];
    const dend = DEND.map(d => E('path', { d, class: 'b-dendrite' }, g));
    E('circle', { cx: 160, cy: 182, r: 36, class: 'b-soma' }, g);
    E('circle', { cx: 154, cy: 178, r: 13, class: 'b-nucleus' }, g);
    E('path', { d: 'M192,172 L214,178 L214,186 L192,192z', class: 'b-soma' }, g);
    E('line', { x1: 214, y1: 182, x2: 540, y2: 182, class: 'b-axon' }, g);
    const SH = [[226, 280], [292, 346], [358, 412], [424, 478], [490, 532]];
    SH.forEach(([a, b]) => E('rect', { x: a, y: 170, width: b - a, height: 24, rx: 12, class: 'b-myelin' }, g));
    const TERM = ['M540,182 C560,182 566,150 590,140', 'M540,182 C566,182 572,182 596,182', 'M540,182 C560,182 566,214 590,224'];
    TERM.forEach(d => E('path', { d, class: 'b-axon thin' }, g));
    const bulbs = [[594, 138], [600, 182], [594, 226]].map(([x, y]) => E('circle', { cx: x, cy: y, r: 9, class: 'b-bulb' }, g));
    E('rect', { x: 614, y: 110, width: 30, height: 144, rx: 8, class: 'b-target' }, g);
    const L = [[14, 40, 'dendrites: collect incoming signals'], [96, 290, 'cell body: adds them up'], [300, 150, 'axon: carries the action potential'], [318, 222, 'myelin (glia) + nodes'], [520, 92, 'axon terminals → synapse']];
    const labels = L.map(([x, y, text], i) => T(g, x, y, text, 'bs b-strong b-region', { 'text-anchor': i < 2 ? 'start' : 'middle' }));
    const inputs = DEND.map(() => E('circle', { r: 5, class: 'b-spark' }, g));
    const dTracks = DEND.map(d => new Track(g, d));
    const soma = E('circle', { cx: 160, cy: 182, r: 36, class: 'b-somaglow' }, g);
    const ap = E('circle', { r: 8, class: 'b-spark' }, g);
    const vesicles = Array.from({ length: 6 }, () => E('circle', { r: 3, class: 'p-hor' }, g));
    return lt => {
      // 1) inputs travel inward along dendrites
      inputs.forEach((d, i) => {
        const u = smooth(0.2 + i * 0.12, 1.6 + i * 0.12, lt);
        const [x, y] = dTracks[i].pos(1 - u);
        at(d, x, y); show(d, u > 0 && u < 1 ? 1 : 0);
      });
      dend.forEach(d => d.classList.toggle('glow', lt > 0.2 && lt < 2.4));
      show(soma, win(lt, 2.0, 3.2, 0.3));
      // 2) the action potential jumps node to node
      let x = null;
      if (lt > 3.2 && lt < 6.6) {
        const nodes = [214, 286, 352, 418, 484, 540];
        const k = (lt - 3.2) / 3.4 * (nodes.length - 1);
        const i = Math.floor(k), f = k - i;
        x = lerp(nodes[i], nodes[Math.min(i + 1, nodes.length - 1)], smooth(0.55, 1, f));
      }
      if (x === null) show(ap, 0); else { at(ap, x, 182); show(ap, 1); }
      bulbs.forEach(b => b.classList.toggle('glow', lt > 6.5 && lt < 8.5));
      vesicles.forEach((v, i) => {
        const u = smooth(6.6 + i * 0.1, 8 + i * 0.1, lt);
        at(v, lerp(600, 616, u), 140 + i * 17);
        show(v, u > 0 && u < 1 ? 1 : 0);
      });
      const step = lt < 2 ? 0 : lt < 3.2 ? 1 : lt < 5 ? 2 : lt < 6.5 ? 3 : 4;
      labels.forEach((l, i) => l.classList.toggle('on', i === step));
      return [
        'Dendrites pick up signals from other cells and carry them toward the cell body',
        'The cell body (with the nucleus) adds up all the inputs. Enough together → it fires.',
        'The axon carries the action potential away from the cell body, sometimes for a meter',
        'Myelin, made by glial cells, insulates the axon, so the signal jumps from gap to gap (nodes of Ranvier) and goes much faster',
        'At the axon terminals the signal is passed on to the next cell at a synapse',
      ][step];
    };
  },
  plain: [
    'Your nervous system has two parts: the CNS (brain + spinal cord) and the PNS (all the nerves everywhere else). Nerves are bundles of many neurons’ axons.',
    'Afferent (sensory) neurons carry signals toward the CNS. Efferent neurons (e.g. motor neurons) carry signals away from it to muscles and glands.',
    'Glia aren’t excitable, but they’re essential: they guide neurons as they develop, feed them, control the fluid around them, help with immunity and help signalling. Astrocytes are the most common. Oligodendrocytes (CNS) and Schwann cells (PNS) wrap axons in myelin; myelinated axons look white, hence “white matter”.',
  ],
  terms: [
    ['Dendrite', 'Branch that carries signals toward the cell body.'],
    ['Axon', 'Carries action potentials away from the cell body.'],
    ['Synapse', 'Contact point where one cell signals the next. Presynaptic = sender, postsynaptic = receiver.'],
    ['Myelin', 'Insulating wrap made by oligodendrocytes (CNS) or Schwann cells (PNS).'],
  ],
};

// ---------------------------------------------------------------- 2. resting potential

const resting = {
  id: 'l8-rest', title: 'Why a resting neuron is negative inside (−70 mV)', dur: 12,
  build(svg) {
    const g = E('g', {}, svg);
    E('rect', { x: 0, y: 0, width: 640, height: 160, class: 'b-outside' }, g);
    E('rect', { x: 0, y: 204, width: 640, height: 156, class: 'b-inside' }, g);
    for (let x = 6; x < 640; x += 12) { E('circle', { cx: x, cy: 168, r: 5, class: 'b-lipid' }, g); E('circle', { cx: x, cy: 196, r: 5, class: 'b-lipid' }, g); }
    T(g, 14, 24, 'outside the cell', 'bs b-strong'); T(g, 14, 350, 'inside the cell', 'bs b-strong');
    const plus = Array.from({ length: 12 }, (_, i) => T(g, 40 + i * 50, 150, '+', 'bl b-strong b-acid-t', { 'text-anchor': 'middle' }));
    const minus = Array.from({ length: 12 }, (_, i) => T(g, 40 + i * 50, 224, '−', 'bl b-strong blue-t', { 'text-anchor': 'middle' }));
    // pump
    const pump = E('g', {}, g);
    E('rect', { x: -22, y: -28, width: 44, height: 56, rx: 14, class: 'b-pump' }, pump);
    move(pump, 170, 182);
    T(g, 170, 254, 'Na⁺/K⁺ pump', 'bs b-strong', { 'text-anchor': 'middle' });
    const atp = T(g, 204, 236, 'ATP', 'bs b-atp');
    // leak channels
    E('rect', { x: 384, y: 158, width: 32, height: 48, rx: 6, class: 'b-channel k' }, g);
    E('rect', { x: 394, y: 158, width: 12, height: 48, class: 'b-pore' }, g);
    T(g, 400, 254, 'K⁺ leak channel', 'bs b-strong', { 'text-anchor': 'middle' });
    E('rect', { x: 524, y: 158, width: 28, height: 48, rx: 6, class: 'b-channel na' }, g);
    E('rect', { x: 534, y: 158, width: 8, height: 48, class: 'b-pore' }, g);
    T(g, 538, 254, 'Na⁺ leak (small)', 'bs b-strong', { 'text-anchor': 'middle' });
    // background ions
    const bgNa = Array.from({ length: 16 }, (_, i) => ({ x: 20 + (i * 83) % 600, y: 40 + (i * 29) % 90, el: E('circle', { r: 6, class: 'p-salt' }, g) }));
    const bgK = Array.from({ length: 16 }, (_, i) => ({ x: 20 + (i * 71) % 600, y: 270 + (i * 23) % 70, el: E('circle', { r: 6, class: 'p-k' }, g) }));
    const pNa = Array.from({ length: 3 }, () => E('circle', { r: 7, class: 'p-salt' }, g));
    const pK = Array.from({ length: 2 }, () => E('circle', { r: 7, class: 'p-k' }, g));
    const leakK = Array.from({ length: 4 }, () => E('circle', { r: 6.5, class: 'p-k' }, g));
    const leakNa = E('circle', { r: 6.5, class: 'p-salt' }, g);
    // meter
    E('rect', { x: 560, y: 20, width: 70, height: 46, rx: 10, class: 'b-meter' }, g);
    const mv = T(g, 595, 50, '', 'bl b-strong b-meter-t', { 'text-anchor': 'middle' });
    T(g, 16, 128, '● Na⁺', 'bs b-salt-t'); T(g, 16, 330, '● K⁺', 'bs b-k-t');
    return (lt, _dt, t) => {
      [...bgNa, ...bgK].forEach((p, i) => at(p.el, p.x + 5 * Math.sin(t * 1.3 + i), p.y + 4 * Math.cos(t * 1.1 + i * 2)));
      const cyc = 3, u = frac(t / cyc);
      // 3 Na⁺ in → flip → out; 2 K⁺ out → flip → in
      pNa.forEach((n, i) => {
        const p = keys(u, [[0, [130 + i * 18, 300]], [0.3, [160 + i * 10, 194 + i * 2]], [0.5, [160 + i * 10, 170]], [0.8, [130 + i * 22, 80]], [1, [120 + i * 22, 60]]]);
        at(n, p[0], p[1]); show(n, Math.min(1, Math.sin(Math.PI * u) * 3));
      });
      pK.forEach((k, i) => {
        const v = frac(u + 0.5);
        const p = keys(v, [[0, [200 + i * 20, 70]], [0.3, [176 + i * 10, 170]], [0.5, [176 + i * 10, 194]], [0.8, [210 + i * 20, 290]], [1, [220 + i * 20, 310]]]);
        at(k, p[0], p[1]); show(k, Math.min(1, Math.sin(Math.PI * v) * 3));
      });
      move(pump, 170, 182, 1, 6 * Math.sin(TAU * u));
      show(atp, u < 0.2 || (u > 0.5 && u < 0.7) ? 1 : 0.25);
      leakK.forEach((k, i) => {
        const v = frac(t * 0.35 + i / 4);
        at(k, 400 + 4 * Math.sin(v * 9), lerp(300, 60, v)); show(k, Math.sin(Math.PI * v));
      });
      const v = frac(t * 0.12);
      at(leakNa, 538, lerp(60, 300, v)); show(leakNa, Math.sin(Math.PI * v) * 0.8);
      const k = smooth(0, 4, lt);
      setText(mv, `${Math.round(lerp(-60, -70, k))} mV`);
      plus.forEach(p => show(p, 0.4 + 0.6 * k)); minus.forEach(m => show(m, 0.4 + 0.6 * k));
      if (lt < 4) return 'The Na⁺/K⁺ pump uses ATP to throw 3 Na⁺ out for every 2 K⁺ it brings in';
      if (lt < 8) return 'K⁺ leak channels let K⁺ seep back out much more easily than Na⁺ can get in. Every K⁺ that leaves takes a + charge with it.';
      return 'Result: more + outside, relatively − inside. The cell rests near K⁺’s equilibrium (−90 mV), at about −70 mV.';
    };
  },
  plain: [
    'A resting neuron is “polarized”: the outside is more positive than the inside. Only a tiny number of ions need to move to change that, which is why signals can be so fast.',
    'Two things set it up: the Na⁺/K⁺ pump (3 Na⁺ out, 2 K⁺ in, uses ATP) builds the concentration gradients, and leak channels let lots of K⁺ out but only a little Na⁺ in.',
    'Each ion is pulled by its concentration difference and by charge. Where those balance is its equilibrium potential (Nernst equation): K⁺ ≈ −90 mV, Na⁺ ≈ +60 mV. Because the membrane leaks K⁺ much more, the resting potential sits near K⁺’s, about −70 mV.',
  ],
  terms: [
    ['Resting potential', 'Membrane voltage of a quiet neuron, about −60 to −70 mV.'],
    ['Equilibrium potential', 'The voltage where an ion’s chemical and electrical pulls cancel out (Nernst equation).'],
    ['Leak channel', 'Always-open channel. Neurons have many more K⁺ leak channels than Na⁺ ones.'],
  ],
};

// ---------------------------------------------------------------- 3. the action potential

const AP_DUR = 3.4;
function apV(dt) { // dt seconds after a strong stimulus
  if (dt < 0) return 0;
  return keys(dt, [[0, 0], [0.35, 17], [0.8, 105], [1.8, -15], [3.4, 0]]);
}

const action = {
  id: 'l8-ap', title: 'The action potential: all or nothing', dur: 13,
  build(svg, s, ui) {
    const events = [];
    let now = 0;
    const poke = strong => {
      const busy = events.find(e => e.strong && now - e.t < AP_DUR);
      events.push({ t: now, strong, blocked: strong && !!busy });
      if (events.length > 12) events.shift();
    };
    ui.button('Small poke', () => poke(false));
    ui.button('Big poke', () => poke(true), 'btn-primary');
    const g = E('g', {}, svg);
    // membrane patch
    E('rect', { x: 0, y: 0, width: 300, height: 140, class: 'b-outside' }, g);
    E('rect', { x: 0, y: 190, width: 300, height: 170, class: 'b-inside' }, g);
    for (let x = 6; x < 300; x += 12) { E('circle', { cx: x, cy: 148, r: 5, class: 'b-lipid' }, g); E('circle', { cx: x, cy: 182, r: 5, class: 'b-lipid' }, g); }
    T(g, 12, 22, 'outside', 'bs b-strong'); T(g, 12, 350, 'inside', 'bs b-strong');
    const chan = (x, cls, label) => {
      const grp = E('g', {}, g);
      E('rect', { x: x - 22, y: 136, width: 14, height: 58, rx: 5, class: `b-channel ${cls}` }, grp);
      E('rect', { x: x + 8, y: 136, width: 14, height: 58, rx: 5, class: `b-channel ${cls}` }, grp);
      const gate = E('rect', { x: -8, y: -4, width: 16, height: 8, rx: 3, class: `b-gate ${cls}` }, grp);
      T(g, x, 214, label, 'bs b-strong', { 'text-anchor': 'middle' });
      return { gate, x };
    };
    const NA = chan(90, 'na', 'voltage-gated Na⁺');
    const K = chan(220, 'k', 'voltage-gated K⁺');
    const ball = E('circle', { r: 8, class: 'b-ball' }, g);
    const naIons = Array.from({ length: 6 }, () => E('circle', { r: 6, class: 'p-salt' }, g));
    const kIons = Array.from({ length: 6 }, () => E('circle', { r: 6, class: 'p-k' }, g));
    const zap = E('path', { d: 'M40,250 l14,-18 l-4,14 l14,-4 l-16,22 l4,-12z', class: 'b-zap' }, g);
    // graph
    const GX0 = 340, GX1 = 624, GY = v => 140 - v * 1.9, WIN = 6;
    E('rect', { x: GX0 - 10, y: 18, width: GX1 - GX0 + 20, height: 300, rx: 12, class: 'b-monitor' }, g);
    for (const v of [40, 0, -40, -80]) { E('line', { x1: GX0, y1: GY(v), x2: GX1, y2: GY(v), class: 'b-grid' }, g); T(g, GX0 + 2, GY(v) - 3, `${v}`, 'bs'); }
    E('line', { x1: GX0, y1: GY(-55), x2: GX1, y2: GY(-55), class: 'b-threshold' }, g);
    T(g, GX1, GY(-55) - 4, 'threshold −55', 'bs b-strong b-gold-t', { 'text-anchor': 'end' });
    T(g, GX1, GY(-70) + 14, 'rest −70', 'bs', { 'text-anchor': 'end' });
    T(g, GX0, 336, 'membrane voltage (mV) over time', 'bs');
    const trace = E('path', { class: 'b-trace hot' }, g);
    const pen = E('circle', { r: 5, class: 'b-spark' }, g);
    const phase = T(g, GX0 + 100, 40, '', 'bs b-strong b-hor-t', { 'text-anchor': 'middle' });
    const samples = [];
    let lastLt = 0;
    const V = time => {
      let v = -70;
      for (const e of events) {
        const d = time - e.t;
        if (d < 0) continue;
        if (e.strong && !e.blocked) v += apV(d);
        else if (!e.strong) v += 9 * Math.exp(-d / 0.7) * (1 - Math.exp(-d / 0.1));
      }
      return v;
    };
    return (lt, dt, t) => {
      now = t;
      // the built-in demo: small poke at 1 s, big poke at 4.5 s, a too-early poke at 6 s
      if (lastLt > lt) lastLt = 0;
      for (const [at0, strong] of [[1, false], [4.5, true], [5.6, true]]) if (lastLt < at0 && lt >= at0) poke(strong);
      lastLt = lt;
      const v = V(t);
      samples.push([t, v]);
      while (samples.length && samples[0][0] < t - WIN) samples.shift();
      let d = '';
      samples.forEach(([ts, vs], i) => { d += `${i ? 'L' : 'M'}${(GX1 - (t - ts) / WIN * (GX1 - GX0)).toFixed(1)},${GY(vs).toFixed(1)}`; });
      trace.setAttribute('d', d);
      at(pen, GX1, GY(v));
      // channel states from the latest strong event
      const ev = [...events].reverse().find(e => e.strong && !e.blocked);
      const since = ev ? t - ev.t : 99;
      const naOpen = since > 0.3 && since < 0.85;
      const naInact = since >= 0.85 && since < 2.4;
      const kOpen = since > 0.8 && since < 2.6;
      NA.gate.setAttribute('transform', `translate(90 ${naOpen ? 128 : 165}) rotate(${naOpen ? 90 : 0})`);
      K.gate.setAttribute('transform', `translate(220 ${kOpen ? 128 : 165}) rotate(${kOpen ? 90 : 0})`);
      at(ball, 90, naInact ? 186 : 214); show(ball, naInact ? 1 : 0);
      naIons.forEach((n, i) => { const u = frac(t * 1.2 + i / 6); at(n, 90 + 3 * Math.sin(i + u * 8), lerp(80, 280, u)); show(n, naOpen ? Math.sin(Math.PI * u) : 0); });
      kIons.forEach((n, i) => { const u = frac(t * 1.0 + i / 6); at(n, 220 + 3 * Math.sin(i + u * 8), lerp(280, 80, u)); show(n, kOpen ? Math.sin(Math.PI * u) : 0); });
      const lastPoke = events[events.length - 1];
      show(zap, lastPoke && t - lastPoke.t < 0.4 ? 1 : 0);
      let label = '';
      if (since < 0.35) label = 'stimulus';
      else if (since < 0.85) label = 'depolarization';
      else if (since < 1.8) label = 'repolarization';
      else if (since < 2.6) label = 'hyperpolarization';
      else if (since < AP_DUR) label = 'back to rest';
      setText(phase, label);
      if (lastPoke && lastPoke.blocked && t - lastPoke.t < 1.6) return 'Poked again too soon: the Na⁺ channels are still inactivated (refractory period), so nothing happens';
      if (since < 0.35) return 'A strong stimulus pushes the voltage up to the threshold (−55 mV)…';
      if (since < 0.85) return '…voltage-gated Na⁺ channels fly open, Na⁺ rushes in, and the inside shoots up to about +40 mV (positive feedback)';
      if (since < 1.8) return 'Na⁺ channels shut and lock (inactivate). K⁺ channels open, K⁺ rushes out, voltage falls (repolarization)';
      if (since < 2.6) return 'K⁺ channels are slow to close, so it dips below rest for a moment (hyperpolarization)';
      if (lastPoke && !lastPoke.strong && t - lastPoke.t < 2.4) return 'A small poke only makes a small, fading bump (graded potential). It never reaches threshold, so no action potential.';
      return 'Resting at −70 mV. Try the buttons: a small poke vs a big poke.';
    };
  },
  plain: [
    'Most channels are gated: voltage-gated (open when the voltage changes), ligand-gated (open when a chemical binds), stretch-gated (open when the membrane is pulled).',
    'A small input causes a graded potential: a bump that’s bigger or smaller depending on the input, and fades. If the membrane reaches threshold (about −55 mV), voltage-gated Na⁺ channels open and it becomes all-or-nothing: every action potential is the same size.',
    'Depolarized = less negative inside. Hyperpolarized = more negative than rest.',
    'Right after an action potential the Na⁺ channels can’t reopen for a moment (refractory period).',
  ],
  terms: [
    ['Threshold', 'About −55 mV. Reach it and an action potential is guaranteed.'],
    ['All-or-none', 'Action potentials don’t come in sizes; a stronger stimulus makes them more frequent, not bigger.'],
    ['Refractory period', 'Short time when Na⁺ channels are inactivated and can’t fire again.'],
  ],
};

// ---------------------------------------------------------------- 4. propagation: one way, and faster with myelin

const race = {
  id: 'l8-race', title: 'Why myelin makes signals faster (saltatory conduction)', dur: 9,
  build(svg) {
    const g = E('g', {}, svg);
    const A = 60, B = 600;
    T(g, 20, 64, 'No myelin', 'bl b-strong');
    T(g, 20, 210, 'Myelinated', 'bl b-strong');
    E('rect', { x: A, y: 102, width: B - A, height: 24, rx: 12, class: 'b-axonbar' }, g);
    E('rect', { x: A, y: 248, width: B - A, height: 24, rx: 12, class: 'b-axonbar' }, g);
    const nodes = [];
    for (let x = A; x < B; x += 90) { E('rect', { x: x + 8, y: 238, width: 74, height: 44, rx: 18, class: 'b-myelin' }, g); nodes.push(x + 86); }
    nodes.unshift(A + 4);
    T(g, 330, 302, 'nodes of Ranvier = the gaps between myelin', 'bs', { 'text-anchor': 'middle' });
    const refr = E('rect', { y: 100, height: 28, rx: 12, class: 'b-refr' }, g);
    const refT = T(g, 0, 150, 'refractory: can’t fire again yet', 'bs b-strong', { 'text-anchor': 'middle' });
    const ap1 = E('ellipse', { rx: 22, ry: 18, cy: 114, class: 'b-apglow' }, g);
    const ap2 = E('ellipse', { rx: 22, ry: 18, cy: 260, class: 'b-apglow' }, g);
    const jump = E('path', { class: 'b-jump' }, g);
    const f1 = T(g, B, 90, '', 'bs b-strong', { 'text-anchor': 'end' });
    const f2 = T(g, B, 230, '', 'bs b-strong b-good-t', { 'text-anchor': 'end' });
    return lt => {
      const t0 = 0.6;
      const x1 = A + clamp((lt - t0) * 70, 0, B - A);
      ap1.setAttribute('cx', x1.toFixed(1)); show(ap1, lt > t0 && x1 < B ? 1 : 0);
      refr.setAttribute('x', Math.max(A, x1 - 90).toFixed(1)); refr.setAttribute('width', Math.max(0, Math.min(70, x1 - A - 20)).toFixed(1));
      show(refr, lt > t0 + 0.4 && x1 < B ? 1 : 0);
      refT.setAttribute('x', Math.max(A + 60, x1 - 60).toFixed(1)); show(refT, lt > 1.6 && lt < 5 ? 1 : 0);
      const per = 0.22;
      const k = (lt - t0) / per;
      const i = clamp(Math.floor(k), 0, nodes.length - 1);
      const f = k - Math.floor(k);
      const x2 = k < 0 ? null : i >= nodes.length - 1 ? null : lerp(nodes[i], nodes[i + 1], smooth(0.6, 1, f));
      if (x2 === null) show(ap2, 0); else { ap2.setAttribute('cx', x2.toFixed(1)); show(ap2, 1); }
      if (x2 !== null && i < nodes.length - 1) { jump.setAttribute('d', `M${nodes[i]},244 Q${(nodes[i] + nodes[i + 1]) / 2},210 ${nodes[i + 1]},244`); show(jump, f > 0.4 ? 1 : 0.3); } else show(jump, 0);
      const done2 = k >= nodes.length - 1, done1 = x1 >= B;
      setText(f2, done2 ? `finished in ${(per * (nodes.length - 1) * 1000 / 1000).toFixed(1)} s 🏁` : '');
      setText(f1, done1 ? 'finished 🏁' : lt > t0 ? 'still going…' : '');
      if (lt < 3) return 'Both get the same signal at the same time. Watch which one arrives first.';
      if (lt < 6) return 'Without myelin, every bit of membrane has to fire in turn, so it crawls. The part just behind is refractory, so the signal can only go forward.';
      return 'With myelin, current zips under the insulation and only the nodes fire: the signal jumps node to node (saltatory conduction).';
    };
  },
  plain: [
    'An action potential spreads because Na⁺ rushing in at one spot depolarizes the next spot, which opens its Na⁺ channels, and so on (positive feedback), all the way to the axon terminals.',
    'It only goes one way: the patch it just left is refractory and can’t fire again yet.',
    'Myelin insulates the axon, so charge moves sideways quickly and only the nodes of Ranvier need to fire. Jumping node to node is saltatory conduction, and it’s much faster.',
  ],
  terms: [['Saltatory conduction', 'Action potentials jumping between nodes of Ranvier on a myelinated axon.'], ['Node of Ranvier', 'Small uninsulated gap between myelin wraps.']],
};

// ---------------------------------------------------------------- 5. the chemical synapse

const synapse = {
  id: 'l8-synapse', title: 'The chemical synapse', dur: 11,
  build(svg) {
    const g = E('g', {}, svg);
    E('path', { d: 'M250,0 L250,40 C140,60 120,150 160,166 L480,166 C520,150 500,60 390,40 L390,0z', class: 'b-terminal' }, g);
    T(g, 520, 40, 'presynaptic cell', 'bs b-strong');
    E('rect', { x: 60, y: 200, width: 520, height: 160, rx: 20, class: 'b-postcell' }, g);
    T(g, 520, 352, 'postsynaptic cell', 'bs b-strong', { 'text-anchor': 'end' });
    T(g, 600, 186, 'cleft', 'bs', { 'text-anchor': 'end' });
    const apGlow = E('ellipse', { cx: 320, rx: 60, ry: 18, class: 'b-apglow' }, g);
    const VES = [[220, 110], [280, 90], [340, 120], [400, 96], [440, 130], [260, 140]];
    const ves = VES.map(([x, y]) => { const grp = E('g', {}, g); E('circle', { r: 16, class: 'b-vesicle' }, grp); for (let i = 0; i < 4; i++) E('circle', { cx: (i % 2 ? 5 : -5), cy: i < 2 ? -5 : 5, r: 3, class: 'p-hor' }, grp); return { grp, x, y }; });
    const RX = [180, 250, 320, 390, 460];
    const recs = RX.map(x => { E('path', { d: `M${x - 12},202 l0,18 M${x + 12},202 l0,18`, class: 'b-receptor2' }, g); return E('circle', { cx: x, cy: 206, r: 5, class: 'b-site' }, g); });
    const nt = Array.from({ length: 20 }, () => E('circle', { r: 3.4, class: 'p-hor' }, g));
    const ca = Array.from({ length: 4 }, () => E('circle', { r: 5, class: 'p-ca' }, g));
    const na = Array.from({ length: 8 }, () => E('circle', { r: 5.5, class: 'p-salt' }, g));
    const mg = E('path', { class: 'b-trace hot' }, g);
    E('line', { x1: 90, y1: 330, x2: 250, y2: 330, class: 'b-grid' }, g);
    T(g, 90, 352, 'voltage of the receiving cell', 'bs');
    T(g, 14, 24, '● neurotransmitter', 'bs b-hor-t'); T(g, 14, 40, '● Ca²⁺', 'bs b-gold-t'); T(g, 14, 56, '● Na⁺', 'bs b-salt-t');
    return lt => {
      apGlow.setAttribute('cy', lerp(-20, 150, smooth(0, 1.6, lt)).toFixed(1)); show(apGlow, win(lt, 0.1, 1.8, 0.3));
      ca.forEach((c, i) => { const u = smooth(1.6 + i * 0.1, 2.6 + i * 0.1, lt); at(c, 200 + i * 80, lerp(186, 150, u)); show(c, u > 0 && u < 1 ? 1 : 0); });
      ves.forEach((v, i) => {
        const fuse = smooth(2.4 + i * 0.08, 3.4 + i * 0.08, lt) * (1 - smooth(9.5, 10.5, lt));
        move(v.grp, v.x, lerp(v.y, 152, fuse), lerp(1, 0.6, smooth(3.2, 4, lt) * (1 - smooth(9.5, 10.5, lt))));
        show(v.grp, 1 - 0.7 * smooth(3.4, 4, lt) * (1 - smooth(9.5, 10.5, lt)));
      });
      nt.forEach((n, i) => {
        const v = VES[i % VES.length], r = RX[i % RX.length];
        const p = keys(lt, [[3.3, [v.x, 160]], [4.6, [lerp(v.x, r, 0.6) + (i % 3 - 1) * 8, 182 + (i % 4) * 2]], [5.6, [r + (i % 2 ? 4 : -4), 206]], [7.6, [r + (i % 2 ? 4 : -4), 206]], [9, [r + (i % 5 - 2) * 18, 180 + (i % 3) * 4]]]);
        at(n, p[0], p[1]);
        show(n, smooth(3.3, 3.6, lt) * (1 - smooth(8.6, 9.4, lt)));
      });
      const open = win(lt, 5.6, 7.8, 0.3);
      recs.forEach(r => r.classList.toggle('on', open > 0.5));
      na.forEach((n, i) => { const u = frac(lt * 0.9 + i / 8); at(n, RX[i % 5] + 4 * Math.sin(u * 8), lerp(150, 290, u)); show(n, open * Math.sin(Math.PI * u)); });
      let d = '';
      for (let x = 0; x <= 160; x += 4) { const tt = lt - (160 - x) / 160 * 6; const bump = 26 * Math.max(0, smooth(5.6, 6.6, tt) - smooth(7.4, 9, tt)); d += `${x ? 'L' : 'M'}${90 + x},${(330 - bump).toFixed(1)}`; }
      mg.setAttribute('d', d);
      if (lt < 1.8) return 'An action potential arrives at the axon terminal. It can’t jump the gap (the synaptic cleft).';
      if (lt < 3.4) return 'The voltage change lets Ca²⁺ in, which makes vesicles full of neurotransmitter fuse with the membrane';
      if (lt < 5.6) return 'Neurotransmitter spills out and diffuses across the cleft';
      if (lt < 7.8) return 'It binds receptors (ligand-gated channels) on the next cell. They open, Na⁺ flows in → a graded potential.';
      return 'The neurotransmitter is cleared away, so the signal stops. Ready for the next one.';
    };
  },
  plain: [
    'At a chemical synapse the two cells don’t touch: there’s a tiny gap, the synaptic cleft, that an action potential can’t cross.',
    'So the signal turns chemical: the presynaptic cell releases neurotransmitter, it diffuses across, binds receptors on the postsynaptic cell, and opens channels there. That makes a graded potential (or an action potential, or another change) in the receiving cell.',
  ],
  terms: [['Neurotransmitter', 'Chemical messenger released at a synapse.'], ['Ligand-gated channel', 'Opens when a specific chemical binds to it.']],
};

// ---------------------------------------------------------------- 6. organization and the autonomic nervous system

const ans = {
  id: 'l8-ans', title: 'Fight or flight vs rest and digest', dur: 8,
  vars: { mode: 'symp' },
  build(svg, s, ui) {
    ui.seg('mode', [['symp', 'Sympathetic'], ['para', 'Parasympathetic']], 'Division');
    const g = E('g', {}, svg);
    // left: body with CNS and a reflex-style loop
    E('circle', { cx: 120, cy: 52, r: 30, class: 'b-bodyfig' }, g);
    E('path', { d: 'M86,92 L154,92 L162,230 L136,230 L132,340 L108,340 L104,230 L78,230z', class: 'b-bodyfig' }, g);
    E('path', { d: 'M86,96 L40,200 M154,96 L200,200', class: 'b-limb' }, g);
    E('ellipse', { cx: 120, cy: 48, rx: 20, ry: 16, class: 'b-cns' }, g);
    E('line', { x1: 120, y1: 64, x2: 120, y2: 226, class: 'b-cord' }, g);
    T(g, 120, 12, 'CNS = brain + spinal cord', 'bs b-strong', { 'text-anchor': 'middle' });
    E('path', { d: 'M120,140 L176,170 L200,200', class: 'b-nerve' }, g);
    const aff = new Track(g, 'M200,200 L176,170 L122,140'), eff = new Track(g, 'M122,150 L60,180 L40,200');
    E('path', { d: 'M122,150 L60,180 L40,200', class: 'b-nerve' }, g);
    const ad = Array.from({ length: 3 }, () => E('circle', { r: 4.5, class: 'p-deoxy' }, g));
    const ed = Array.from({ length: 3 }, () => E('circle', { r: 4.5, class: 'p-oxy' }, g));
    T(g, 206, 222, 'sensory in', 'bs b-strong blue-t');
    T(g, 8, 222, 'motor out', 'bs b-strong red-t');
    // right: organs
    const X = 290;
    E('rect', { x: X, y: 20, width: 335, height: 320, rx: 18, class: 'b-panel' }, g);
    const title = T(g, X + 168, 48, '', 'bl b-strong', { 'text-anchor': 'middle' });
    const heart = E('path', { d: 'M0,-8 C-4,-18 -20,-16 -20,-4 C-20,8 -6,16 0,22 C6,16 20,8 20,-4 C20,-16 4,-18 0,-8z', class: 'b-heartico' }, g);
    const hrT = T(g, X + 110, 108, '', 'bs b-strong');
    E('ellipse', { cx: X + 60, cy: 170, rx: 26, ry: 16, class: 'b-eye-w' }, g);
    E('circle', { cx: X + 60, cy: 170, r: 13, class: 'b-iris' }, g);
    const pupil = E('circle', { cx: X + 60, cy: 170, r: 6, class: 'b-pupil' }, g);
    const pupT = T(g, X + 110, 175, '', 'bs b-strong');
    const gutP = E('path', { class: 'b-gutline' }, g);
    const gutT = T(g, X + 110, 250, '', 'bs b-strong');
    const bpT = T(g, X + 110, 312, '', 'bs b-strong');
    const bp = E('rect', { x: X + 30, y: 300, width: 0, height: 14, rx: 7, class: 'b-bpbar' }, g);
    let beat = 0, gutPh = 0;
    return (lt, dt, t) => {
      const sym = s.vars.mode === 'symp';
      setText(title, sym ? 'Sympathetic: fight or flight' : 'Parasympathetic: rest and digest');
      beat = frac(beat + dt * (sym ? 2.2 : 0.9));
      const sc = 1 + 0.18 * Math.exp(-((beat - 0.1) ** 2) / 0.004);
      move(heart, X + 60, 100, sc * 1.3);
      setText(hrT, sym ? 'heart rate ↑, stronger beats' : 'heart rate ↓');
      pupil.setAttribute('r', (sym ? 10 : 4).toString());
      setText(pupT, sym ? 'pupils open wide' : 'pupils small');
      gutPh += dt * (sym ? 0.3 : 2.2);
      let d = '';
      for (let x = 0; x <= 60; x += 3) d += `${x ? 'L' : 'M'}${X + 30 + x},${(244 + (sym ? 2 : 8) * Math.sin(x / 8 - gutPh)).toFixed(1)}`;
      gutP.setAttribute('d', d);
      setText(gutT, sym ? 'digestion slows down' : 'digestion speeds up');
      bp.setAttribute('width', sym ? 66 : 30);
      setText(bpT, sym ? '' : '');
      bp.setAttribute('x', X + 30); bpT.setAttribute('x', X + 110);
      setText(bpT, sym ? 'blood pressure ↑' : 'blood pressure ↓');
      ad.forEach((a, i) => { const u = frac(t * 0.4 + i / 3); const [x, y] = aff.pos(u); at(a, x, y); show(a, Math.sin(Math.PI * u)); });
      ed.forEach((a, i) => { const u = frac(t * 0.4 + i / 3 + 0.5); const [x, y] = eff.pos(u); at(a, x, y); show(a, Math.sin(Math.PI * u)); });
      return sym ? 'Sympathetic = emergencies: speeds the heart, raises blood pressure, puts digestion on hold (adrenaline joins in)'
        : 'Parasympathetic = relaxed: slows the heart, lowers blood pressure, gets digestion going';
    };
  },
  plain: [
    'Sensory (afferent) neurons bring information into the CNS; interneurons inside the CNS process it; efferent neurons carry commands out to effectors.',
    'The efferent side splits in two. Somatic = voluntary control of skeletal muscle. Autonomic (ANS) = automatic control of everything else: smooth muscle, cardiac muscle, glands.',
    'The vertebrate ANS has three divisions: sympathetic (fight or flight), parasympathetic (rest and digest, mostly the opposite effects) and enteric (a nerve network inside the gut wall).',
  ],
  terms: [
    ['Interneuron', 'Neuron that stays inside the CNS and connects other neurons.'],
    ['Effector', 'What a signal acts on: a muscle or gland.'],
    ['Somatic vs autonomic', 'Voluntary skeletal muscle vs involuntary smooth/cardiac muscle and glands.'],
    ['Enteric division', 'The gut’s own nerve network.'],
  ],
};

export default {
  id: 'L8', n: '8', short: 'Nervous system', color: '--b-k', chapter: 'Ch 31.1–31.5',
  title: 'Neurons and the nervous system',
  minute: [
    'CNS = brain + spinal cord. PNS = nerves everywhere else. Afferent = toward the CNS (sensory); efferent = away (motor).',
    'Neuron parts: dendrites → cell body → axon → axon terminals → synapse. Glia support neurons; myelin speeds signals.',
    'Resting potential ≈ −70 mV: the Na⁺/K⁺ pump (3 out, 2 in) plus K⁺ leaking out leaves the inside negative.',
    'Graded potentials vary in size and fade. At threshold (−55 mV) voltage-gated Na⁺ channels open → all-or-none action potential.',
    'Na⁺ in = depolarize; K⁺ out = repolarize; brief overshoot = hyperpolarize. Refractory period → one-way travel. Myelin → saltatory conduction.',
    'At chemical synapses, neurotransmitter crosses the cleft and opens ligand-gated channels. Sympathetic = fight or flight, parasympathetic = rest and digest.',
  ],
  traps: [
    'Rest is near K⁺’s equilibrium (−90) because the membrane leaks K⁺ much more than Na⁺ (+60).',
    'The pump moves 3 Na⁺ OUT and 2 K⁺ IN.',
    'Action potentials are all-or-none; graded potentials vary in size.',
    'Depolarization = Na⁺ in. Repolarization = K⁺ out.',
    'Oligodendrocytes = CNS myelin. Schwann cells = PNS myelin.',
    'Sympathetic slows digestion; parasympathetic speeds it up.',
  ],
  links: [['Sympathetic nerves speed the heart → Lecture 5', 'L5'], ['Neurosecretory cells release hormones → Lecture 9', 'L9'], ['Na⁺/K⁺ pump also powers glucose uptake → Lecture 7', 'L7']],
  scenes: [neuron, resting, action, race, synapse, ans],
  quiz: [
    { q: 'Which part of a neuron carries action potentials away from the cell body?', a: 'Axon', o: ['Dendrite', 'Synapse', 'Nucleus'], why: 'Dendrites bring signals in; the axon carries action potentials out to the terminals.' },
    { q: 'The Na⁺/K⁺ pump moves…', a: '3 Na⁺ out and 2 K⁺ in, using ATP', o: ['3 K⁺ out and 2 Na⁺ in', '2 Na⁺ out and 3 K⁺ in', 'Na⁺ and K⁺ both out, no ATP'], why: 'Three positive charges out for every two in. It also builds both concentration gradients.' },
    { q: 'Why is the resting potential close to −70 mV?', a: 'The membrane leaks K⁺ much more than Na⁺', o: ['The membrane leaks Na⁺ much more than K⁺', 'Cl⁻ is pumped in', 'Neurons have no ion channels at rest'], why: 'K⁺ leaking out leaves the inside negative, near K⁺’s equilibrium potential (−90 mV).' },
    { q: 'What happens when a neuron reaches threshold?', a: 'Voltage-gated Na⁺ channels open and an action potential fires', o: ['K⁺ channels open first', 'The pump stops', 'A graded potential fades away'], why: 'At about −55 mV, Na⁺ channels open, Na⁺ rushes in and positive feedback drives the spike.' },
    { q: 'Repolarization is mainly caused by…', a: 'K⁺ leaving the cell', o: ['Na⁺ entering the cell', 'Ca²⁺ entering the cell', 'The Na⁺/K⁺ pump alone'], why: 'Na⁺ channels inactivate and K⁺ channels open, so K⁺ flows out and the inside becomes negative again.' },
    { q: 'Why does an action potential only travel one way along an axon?', a: 'The patch behind it is in its refractory period', o: ['Myelin blocks it going backward', 'Dendrites absorb it', 'Ions can only flow one way'], why: 'Just-used Na⁺ channels are inactivated, so only the patch ahead can fire.' },
    { q: 'Saltatory conduction happens because…', a: 'Myelin insulates the axon, so only the nodes of Ranvier fire', o: ['The axon has no channels', 'Dendrites are myelinated', 'Neurotransmitters jump between cells'], why: 'The signal “jumps” node to node, which is much faster than firing every patch.' },
    { q: 'At a chemical synapse, neurotransmitters…', a: 'Diffuse across the cleft and bind receptors on the next cell', o: ['Travel down the axon as an action potential', 'Enter the next cell through gap junctions', 'Are carried in the blood'], why: 'The action potential can’t cross the cleft, so the message turns chemical.' },
    { q: 'Which glial cells make myelin in the brain and spinal cord?', a: 'Oligodendrocytes', o: ['Schwann cells', 'Astrocytes', 'Neurons'], why: 'Oligodendrocytes = CNS; Schwann cells = PNS. Astrocytes are the most common glia but don’t make myelin.' },
    { q: 'You’re relaxing after a big meal. Which division is in charge?', a: 'Parasympathetic', o: ['Sympathetic', 'Somatic', 'Afferent'], why: 'Rest and digest: slower heart, lower blood pressure, more digestion.' },
  ],
};
