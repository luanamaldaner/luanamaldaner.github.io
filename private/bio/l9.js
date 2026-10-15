// Lecture 9 · Ch 32.1–32.4 · Endocrine system

import { E, T, Track, at, move, show, setText, smooth, keys, frac, lerp, clamp, TAU, win, arrowDefs } from './kit.js';

// ---------------------------------------------------------------- 1. how far does the message go?

const KINDS = [
  ['Autocrine', 'Signals itself'],
  ['Paracrine', 'Signals its neighbours'],
  ['Endocrine (hormone)', 'Rides the blood to far-away targets'],
  ['Neurotransmitter', 'Crosses a synapse'],
  ['Pheromone', 'Leaves the body and signals another animal'],
];

const signals = {
  id: 'l9-signals', title: 'Chemical signals at different distances', dur: 15,
  build(svg) {
    const g = E('g', {}, svg);
    const P = [[14, 14], [222, 14], [430, 14], [118, 190], [326, 190]];
    const W = 196, H = 160;
    const boxes = P.map(([x, y], i) => {
      const grp = E('g', {}, g);
      const r = E('rect', { x, y, width: W, height: H, rx: 16, class: 'b-colbox' }, grp);
      T(grp, x + 12, y + 22, KINDS[i][0], 'bs b-strong');
      return { r, x, y };
    });
    const dots = [];
    const cell = (x, y, r = 18, cls = 'b-sigcell') => E('circle', { cx: x, cy: y, r, class: cls }, g);
    // autocrine
    { const { x, y } = boxes[0]; cell(x + 98, y + 92, 24); dots.push({ n: 6, path: (u, i) => { const a = i / 6 * TAU; const r = 24 + 26 * Math.sin(Math.PI * u); return [x + 98 + Math.cos(a) * r, y + 92 + Math.sin(a) * r]; } }); }
    // paracrine
    { const { x, y } = boxes[1]; cell(x + 98, y + 92, 20); cell(x + 38, y + 70, 15, 'b-sigcell t'); cell(x + 160, y + 72, 15, 'b-sigcell t'); cell(x + 98, y + 140, 13, 'b-sigcell t');
      const tg = [[x + 38, y + 70], [x + 160, y + 72], [x + 98, y + 140]];
      dots.push({ n: 6, path: (u, i) => { const t = tg[i % 3]; return [lerp(x + 98, t[0], u), lerp(y + 92, t[1], u)]; } }); }
    // endocrine
    { const { x, y } = boxes[2]; cell(x + 30, y + 60, 16); E('rect', { x: x + 14, y: y + 92, width: 170, height: 22, rx: 11, class: 'b-vesselband' }, g); cell(x + 168, y + 60, 16, 'b-sigcell t');
      dots.push({ n: 6, path: u => keys(u, [[0, [x + 30, y + 72]], [0.2, [x + 34, y + 102]], [0.8, [x + 164, y + 104]], [1, [x + 168, y + 74]]]) }); }
    // neurotransmitter
    { const { x, y } = boxes[3]; E('path', { d: `M${x + 20},${y + 92} L${x + 80},${y + 92} C${x + 104},${y + 70} ${x + 104},${y + 114} ${x + 80},${y + 92}`, class: 'b-axon thin' }, g);
      E('circle', { cx: x + 98, cy: y + 92, r: 16, class: 'b-sigcell' }, g); E('rect', { x: x + 124, y: y + 62, width: 40, height: 60, rx: 10, class: 'b-sigcell t' }, g);
      dots.push({ n: 6, path: (u, i) => [lerp(x + 112, x + 126, u), y + 78 + i * 6] }); }
    // pheromone
    { const { x, y } = boxes[4]; T(g, x + 36, y + 104, '🦋', 'b-emoji', { 'text-anchor': 'middle' }); T(g, x + 162, y + 104, '🦋', 'b-emoji', { 'text-anchor': 'middle' });
      dots.push({ n: 7, path: (u, i) => [lerp(x + 56, x + 142, u), y + 92 + Math.sin(u * 9 + i) * 14] }); }
    dots.forEach(d => { d.els = Array.from({ length: d.n }, () => E('circle', { r: 4, class: 'p-hor' }, g)); });
    return (lt, _dt, t) => {
      const focus = Math.min(4, Math.floor(lt / 3));
      boxes.forEach((b, i) => b.r.classList.toggle('on', i === focus));
      dots.forEach((d, j) => d.els.forEach((el, i) => {
        const u = frac(t * 0.4 + i / d.n);
        const [x, y] = d.path(u, i);
        at(el, x, y); show(el, Math.sin(Math.PI * u) * (j === focus ? 1 : 0.45));
      }));
      return `${KINDS[focus][0]}: ${KINDS[focus][1].toLowerCase()}`;
    };
  },
  plain: [
    'Cells talk with chemicals that bind receptors on target cells. What changes is how far the message travels.',
    'Endocrine cells release hormones into the blood: slow, but they reach huge numbers of cells. Neurons are wired directly to their targets: fast and precise, but only a few cells.',
  ],
  terms: [
    ['Hormone', 'Chemical secreted into the blood by endocrine cells; acts on (usually distant) target cells at very low concentrations.'],
    ['Target cell', 'Any cell that has the right receptor for that signal.'],
  ],
};

// ---------------------------------------------------------------- 2. peptide vs steroid hormones

const receptors = {
  id: 'l9-receptors', title: 'Peptide vs steroid hormones: outside vs inside receptors', dur: 15,
  build(svg) {
    const g = E('g', {}, svg);
    T(g, 160, 22, 'Peptide hormone (e.g. insulin)', 'bl b-strong', { 'text-anchor': 'middle' });
    T(g, 160, 40, 'water-soluble → can’t cross the membrane', 'bs', { 'text-anchor': 'middle' });
    T(g, 480, 22, 'Steroid hormone (e.g. cortisol)', 'bl b-strong', { 'text-anchor': 'middle' });
    T(g, 480, 40, 'lipid-soluble → slips right through', 'bs', { 'text-anchor': 'middle' });
    E('line', { x1: 320, y1: 10, x2: 320, y2: 350, class: 'b-grid' }, g);
    // left cell
    E('rect', { x: 24, y: 96, width: 272, height: 240, rx: 28, class: 'b-cellbody' }, g);
    E('rect', { x: 120, y: 84, width: 22, height: 30, rx: 8, class: 'b-transporter' }, g);
    T(g, 112, 78, 'receptor', 'bs', { 'text-anchor': 'end' });
    const gp = E('ellipse', { rx: 13, ry: 9, class: 'b-gprot' }, g);
    E('rect', { x: 210, y: 92, width: 34, height: 26, rx: 10, class: 'b-pump' }, g);
    T(g, 254, 84, 'enzyme', 'bs');
    const pep = E('g', {}, g); [0, 1, 2].forEach(i => E('circle', { cx: i * 10 - 10, cy: 0, r: 6, class: 'p-deoxy' }, pep));
    const gT = T(g, 0, 0, 'G protein', 'bs b-strong', { 'text-anchor': 'middle' });
    const msgs = Array.from({ length: 18 }, () => E('circle', { r: 4, class: 'p-hor' }, g));
    const resp = T(g, 160, 316, '', 'bs b-strong', { 'text-anchor': 'middle' });
    const clock1 = T(g, 30, 356, '', 'bs b-strong b-good-t');
    // right cell
    E('rect', { x: 344, y: 96, width: 272, height: 240, rx: 28, class: 'b-cellbody' }, g);
    E('circle', { cx: 520, cy: 240, r: 58, class: 'b-nucleusbig' }, g);
    T(g, 520, 316, 'nucleus', 'bs', { 'text-anchor': 'middle' });
    E('path', { d: 'M482,232 C496,222 510,242 524,232 C538,222 552,242 566,232', class: 'b-dna' }, g);
    E('path', { d: 'M482,244 C496,234 510,254 524,244 C538,234 552,254 566,244', class: 'b-dna' }, g);
    const ster = E('g', {}, g);
    E('path', { d: 'M-16,-6 l8,-8 l10,0 l8,8 l10,0 l8,-8 l10,0 M-16,-6 l8,8 l10,0 l8,-8 M2,2 l8,8 l10,0 l8,-8 l-8,-8', class: 'b-steroid' }, ster);
    const rec = E('ellipse', { rx: 16, ry: 11, class: 'b-irec' }, g);
    const mrna = E('path', { class: 'b-mrna' }, g);
    const prot = Array.from({ length: 7 }, () => E('circle', { r: 5, class: 'b-protbead' }, g));
    const clock2 = T(g, 350, 356, '', 'bs b-strong b-acid-t');
    return lt => {
      // peptide: bind → G protein → enzyme → many messengers
      const pp = keys(lt, [[0, [131, 60]], [1.5, [131, 74]]]);
      move(pep, pp[0], pp[1]);
      const gx = keys(lt, [[2, 136], [3.4, 206]]);
      at(gp, gx, 122); gT.setAttribute('x', gx); gT.setAttribute('y', 146); show(gT, win(lt, 2, 4, 0.3));
      msgs.forEach((m, i) => {
        const start = 3.6 + i * 0.12;
        const u = smooth(start, start + 1.4, lt);
        const a = (i / msgs.length) * Math.PI + 0.1;
        at(m, 227 + Math.cos(a) * -1 * u * (40 + (i % 4) * 22), 130 + Math.sin(a) * u * (60 + (i % 3) * 30));
        show(m, u > 0 ? 1 : 0);
      });
      setText(resp, lt > 5.5 ? 'one hormone → thousands of messengers (amplification)' : '');
      setText(clock1, lt > 6 ? '⏱ fast: seconds to minutes' : '');
      // steroid: cross membrane → receptor in cytoplasm → nucleus → mRNA → protein
      const sp = keys(lt, [[0, [404, 72]], [1.6, [404, 150]], [3, [430, 170]], [5, [512, 214]]]);
      move(ster, sp[0], sp[1], 0.9);
      const rp = keys(lt, [[1.6, [430, 186]], [3, [430, 182]], [5, [512, 226]]]);
      at(rec, rp[0], rp[1]);
      const grow = smooth(5.5, 8.5, lt);
      let d = `M524,238`;
      for (let k = 1; k <= 12; k++) { const x = 524 - k * 8 * grow, y = 238 - k * 7 * grow + Math.sin(k) * 4 * grow; d += ` L${x.toFixed(1)},${y.toFixed(1)}`; }
      mrna.setAttribute('d', d); show(mrna, grow > 0 ? 1 : 0);
      prot.forEach((p, i) => { const k = smooth(9 + i * 0.4, 9.6 + i * 0.4, lt); at(p, 400 + i * 11, 136 - (i % 2) * 6); show(p, k); });
      setText(clock2, lt > 10 ? '⏱ slow: hours (new protein has to be built)' : '');
      if (lt < 3.4) return 'Left: a peptide hormone can’t get in, so it binds a receptor on the surface, which switches on a G protein inside';
      if (lt < 5.5) return 'The G protein turns on an enzyme that makes lots of “second messengers”. Right: the steroid slips through the membrane and finds its receptor inside.';
      if (lt < 9) return 'The steroid–receptor pair moves into the nucleus and switches genes on: an mRNA copy is made';
      return 'The mRNA is used to build a new protein. Peptides act fast; steroids act slowly but last.';
    };
  },
  plain: [
    'Three classes: peptide/protein hormones (insulin, growth hormone), steroid hormones (cortisol, aldosterone, testosterone, estradiol; made from cholesterol) and amine hormones (epinephrine, thyroxine).',
    'Water-soluble hormones (peptides, epinephrine) bind surface receptors, often G protein–linked receptors that set off a second-messenger cascade. Lipid-soluble hormones (steroids, thyroid hormone) cross the membrane, bind receptors inside, and change gene expression.',
    'Timing: peptides and amines are made ahead and stored, so they can be released quickly. Steroids are usually made on demand, so their release starts slowly. A hormone’s half-life is how long it takes for half of it to be cleared from the blood.',
    'The same hormone can do different things in different cells (different receptors) or different species (prolactin in mammals vs fish). Cells can also become less sensitive if they reduce their number of receptors.',
  ],
  terms: [
    ['G protein–linked receptor', 'Surface receptor that activates a G protein inside the cell.'],
    ['Second messenger', 'Small molecule (like cAMP) made inside the cell that spreads the signal.'],
    ['Half-life', 'Time for half of a hormone to be removed from the blood.'],
  ],
};

// ---------------------------------------------------------------- 3. hypothalamus and pituitary

const pituitary = {
  id: 'l9-pit', title: 'Hypothalamus and pituitary: brain meets glands', dur: 18,
  build(svg) {
    const g = E('g', {}, svg);
    E('path', { d: 'M0,0 L640,0 L640,120 C520,130 420,120 380,150 L260,150 C220,120 120,130 0,120z', class: 'b-brain' }, g);
    T(g, 320, 26, 'Hypothalamus (brain)', 'bl b-strong', { 'text-anchor': 'middle' });
    E('path', { d: 'M286,150 L354,150 L346,206 L294,206z', class: 'b-stalk' }, g);
    const ant = E('path', { d: 'M300,206 C220,196 176,240 190,290 C204,336 290,340 316,300 L318,206z', class: 'b-ant' }, g);
    const post = E('path', { d: 'M322,206 L324,300 C350,340 430,330 440,290 C452,240 410,200 322,206z', class: 'b-post' }, g);
    T(g, 150, 330, 'anterior pituitary', 'bs b-strong', { 'text-anchor': 'middle' });
    T(g, 150, 346, '(a real gland)', 'bs', { 'text-anchor': 'middle' });
    T(g, 500, 330, 'posterior pituitary', 'bs b-strong', { 'text-anchor': 'middle' });
    T(g, 500, 346, '(an extension of the brain)', 'bs', { 'text-anchor': 'middle' });
    // posterior route: neuron from hypothalamus straight down
    E('circle', { cx: 440, cy: 70, r: 16, class: 'b-soma' }, g);
    const pAx = 'M440,86 C430,130 360,150 340,190 C330,220 360,250 372,270';
    E('path', { d: pAx, class: 'b-axon thin' }, g);
    const pTr = new Track(g, pAx);
    E('path', { d: 'M470,260 C420,262 400,284 360,282 C330,280 330,260 360,252 C400,244 440,238 640,236', class: 'b-cap' }, g);
    const pOut = new Track(g, 'M372,272 C400,262 440,240 640,236');
    // anterior route: releasing hormone → portal vessels → endocrine cells
    E('circle', { cx: 200, cy: 70, r: 16, class: 'b-soma' }, g);
    const aAx = 'M200,86 C220,110 270,120 296,140';
    E('path', { d: aAx, class: 'b-axon thin' }, g);
    const aTr = new Track(g, aAx);
    E('path', { d: 'M260,150 C280,130 310,140 304,160 C300,175 296,190 290,206 C280,232 250,236 240,260', class: 'b-cap' }, g);
    const portal = new Track(g, 'M300,146 C304,165 296,190 290,206 C280,232 250,236 240,258');
    T(g, 360, 186, 'portal vessels', 'bs');
    const cells = [[220, 262], [252, 286], [214, 300], [262, 252]].map(([x, y]) => E('circle', { cx: x, cy: y, r: 11, class: 'b-endocell' }, g));
    E('path', { d: 'M250,300 C230,320 160,300 0,290', class: 'b-cap' }, g);
    const aOut = new Track(g, 'M240,280 C220,300 160,300 0,290');
    const dP = Array.from({ length: 6 }, () => E('circle', { r: 4.5, class: 'p-hor' }, g));
    const dPo = Array.from({ length: 6 }, () => E('circle', { r: 4.5, class: 'p-hor' }, g));
    const dA = Array.from({ length: 5 }, () => E('circle', { r: 4.5, class: 'p-rh' }, g));
    const dPor = Array.from({ length: 6 }, () => E('circle', { r: 4.5, class: 'p-rh' }, g));
    const dAo = Array.from({ length: 8 }, (_, i) => E('circle', { r: 4.5, class: `p-trop c${i % 4}` }, g));
    const lp = T(g, 630, 222, 'ADH, oxytocin → blood', 'bs b-strong b-hor-t', { 'text-anchor': 'end' });
    const la = E('g', {}, g); T(la, 8, 236, 'TSH, ACTH, LH, FSH,', 'bs b-strong'); T(la, 8, 252, 'GH, prolactin → blood', 'bs b-strong');
    const lr = T(g, 190, 122, 'releasing hormones', 'bs b-strong b-teal-t', { 'text-anchor': 'end' });
    return (lt, _dt, t) => {
      const postFocus = lt < 8 ? 1 : 0.3, antFocus = lt < 8 ? 0.3 : 1;
      post.classList.toggle('on', lt < 8); ant.classList.toggle('on', lt >= 8);
      const run = (arr, tr, speed, op, off = 0) => arr.forEach((d, i) => { const u = frac(t * speed + i / arr.length + off); const [x, y] = tr.pos(u); at(d, x, y); show(d, op * Math.min(1, Math.sin(Math.PI * u) * 2)); });
      run(dP, pTr, 0.35, postFocus);
      run(dPo, pOut, 0.3, postFocus, 0.3);
      run(dA, aTr, 0.4, antFocus);
      run(dPor, portal, 0.35, antFocus, 0.2);
      run(dAo, aOut, 0.3, antFocus, 0.5);
      cells.forEach((c, i) => c.classList.toggle('on', antFocus > 0.5 && frac(t * 0.7 + i / 4) < 0.5));
      show(lp, postFocus); show(la, antFocus); show(lr, antFocus);
      if (lt < 4) return 'Posterior pituitary: hormones are made by neurons in the hypothalamus and shipped down their own axons';
      if (lt < 8) return '…then released straight into the blood: ADH (keep water) and oxytocin (birth contractions, milk let-down)';
      if (lt < 13) return 'Anterior pituitary: hypothalamus neurons release releasing (or inhibiting) hormones into a capillary bed, which flows down portal vessels…';
      return '…to a second capillary bed in the anterior pituitary, telling its gland cells to release their own hormones into general circulation';
    };
  },
  plain: [
    'The pituitary is the “master gland”: it controls many other glands. But the hypothalamus, right above it in the brain, controls the pituitary.',
    'Posterior pituitary = part of the brain. Its two hormones, ADH (vasopressin) and oxytocin, are made in the hypothalamus and released from axon endings.',
    'Anterior pituitary = a true endocrine gland. The hypothalamus controls it with releasing hormones (e.g. TRH, GHRH) and inhibiting hormones (e.g. somatostatin) sent through the hypothalamo-hypophysial portal system.',
    'Anterior pituitary hormones: tropic ones that control other glands (ACTH → adrenal cortex, TSH → thyroid, LH and FSH → gonads), plus growth hormone, prolactin and MSH.',
  ],
  terms: [
    ['Neurosecretory cell', 'A neuron that releases hormones into the blood.'],
    ['Tropic hormone', 'A hormone that controls another endocrine gland (ACTH, TSH, LH, FSH).'],
    ['Portal system', 'Two capillary beds connected by vessels, here hypothalamus → anterior pituitary.'],
    ['Somatostatin', 'Inhibiting hormone: blocks growth hormone release.'],
  ],
};

// ---------------------------------------------------------------- 4. axes and negative feedback

const AXES = {
  hpa: { names: ['Hypothalamus', 'Anterior pituitary', 'Adrenal cortex'], hormones: ['CRH', 'ACTH', 'cortisol'], trigger: 'Stress!',
    effects: ['blood glucose ↑ (gluconeogenesis)', 'fats mobilized for energy', 'proteins broken into amino acids'] },
  thy: { names: ['Hypothalamus', 'Anterior pituitary', 'Thyroid gland'], hormones: ['TRH', 'TSH', 'T3 / T4'], trigger: 'Cold!',
    effects: ['metabolism and heat ↑', 'growth, CNS development', 'boosts sympathetic response'] },
};

const feedback = {
  id: 'l9-feedback', title: 'Hormone axes and negative feedback', dur: 14,
  vars: { axis: 'hpa', fb: 'on' },
  reset(s) { s.vars._x = null; },
  build(svg, s, ui) {
    ui.seg('axis', [['hpa', 'Stress (cortisol)'], ['thy', 'Thyroid']], 'Axis');
    ui.seg('fb', [['on', 'Feedback on'], ['off', 'Feedback broken']], 'Feedback');
    let pulse = -99;
    ui.button('Trigger it', () => { pulse = now; });
    let now = 0;
    const g = E('g', {}, svg);
    const head = arrowDefs(svg, 'b-m-fb', 'b-head ink');
    const inhib = arrowDefs(svg, 'b-m-inh', 'b-head red');
    const NX = 30, NW = 170, NY = [20, 112, 204], NH = 52;
    const boxes = NY.map(y => E('rect', { x: NX, y, width: NW, height: NH, rx: 14, class: 'b-node-box' }, g));
    const names = NY.map(y => T(g, NX + NW / 2, y + 31, '', 'bs b-strong', { 'text-anchor': 'middle' }));
    const links = [[NY[0] + NH, NY[1]], [NY[1] + NH, NY[2]], [NY[2] + NH, 300]].map(([a, b]) => E('path', { d: `M${NX + 70},${a} L${NX + 70},${b - 4}`, class: 'b-link lit', 'marker-end': head }, g));
    const hn = [0, 1, 2].map(i => T(g, NX + 80, [NY[0] + NH, NY[1] + NH, NY[2] + NH][i] + 26, '', 'bs b-strong b-hor-t'));
    const flows = [0, 1, 2].map(i => Array.from({ length: 4 }, () => E('circle', { r: 4.5, class: 'p-hor' }, g)));
    const fbA = E('path', { d: `M${NX + NW},${NY[2] + 26} C${NX + NW + 60},${NY[2] + 20} ${NX + NW + 60},${NY[1] + 30} ${NX + NW + 4},${NY[1] + 30}`, class: 'b-inhib', 'marker-end': inhib }, g);
    const fbB = E('path', { d: `M${NX + NW},${NY[2] + 34} C${NX + NW + 110},${NY[2] + 30} ${NX + NW + 110},${NY[0] + 26} ${NX + NW + 4},${NY[0] + 26}`, class: 'b-inhib', 'marker-end': inhib }, g);
    const minus = [T(g, NX + NW + 46, NY[1] + 72, '⊖', 'bl b-strong red-t'), T(g, NX + NW + 86, NY[0] + 84, '⊖', 'bl b-strong red-t')];
    const eff = E('rect', { x: NX, y: 300, width: NW + 40, height: 54, rx: 12, class: 'b-node-box fx lit' }, g);
    const effT = [0, 1, 2].map(i => T(g, NX + 10, 316 + i * 15, '', 'bs'));
    void eff;
    // graph
    const GX0 = 360, GX1 = 624, GY0 = 40, GY1 = 300, WIN = 10;
    E('rect', { x: GX0 - 10, y: GY0 - 26, width: GX1 - GX0 + 20, height: GY1 - GY0 + 46, rx: 12, class: 'b-monitor' }, g);
    for (const v of [1, 2, 3]) { E('line', { x1: GX0, y1: GY1 - v * 60, x2: GX1, y2: GY1 - v * 60, class: 'b-grid' }, g); }
    T(g, GX0, GY1 + 14, 'normal level = 1 line', 'bs');
    const lines = ['c0', 'c1', 'c2'].map(c => E('path', { class: `b-hline ${c}` }, g));
    const legend = [0, 1, 2].map(i => T(g, GX0 + i * 88, GY0 - 8, '', `bs b-strong b-hl-t c${i}`));
    const hist = [];
    return (lt, dt, t) => {
      now = t;
      const ax = AXES[s.vars.axis];
      const fbOn = s.vars.fb === 'on';
      names.forEach((n, i) => setText(n, ax.names[i]));
      hn.forEach((n, i) => setText(n, ax.hormones[i]));
      legend.forEach((n, i) => setText(n, `— ${ax.hormones[i]}`));
      effT.forEach((n, i) => setText(n, ax.effects[i]));
      if (!s.vars._x) s.vars._x = [1, 1, 1];
      const x = s.vars._x;
      // auto trigger once per loop, plus the button
      if (dt > 0 && lt >= 1.5 && lt - dt < 1.5) pulse = t;
      const drive = 1 + 2.4 * (t - pulse >= 0 && t - pulse < 3 ? Math.sin(Math.PI * (t - pulse) / 3) : 0);
      const inh = v => fbOn ? 2 / (1 + v * v) : 1;
      const sub = 4, h = dt / sub;
      for (let k = 0; k < sub; k++) {
        x[0] += h * (drive * inh(x[2]) - x[0]) / 0.5;
        x[1] += h * (x[0] * inh(x[2]) - x[1]) / 0.6;
        x[2] += h * (x[1] - x[2]) / 0.9;
      }
      if (dt > 0) hist.push([t, [...x]]);
      while (hist.length && hist[0][0] < t - WIN) hist.shift();
      lines.forEach((ln, i) => {
        let d = '';
        hist.forEach(([ts, v], j) => { d += `${j ? 'L' : 'M'}${(GX1 - (t - ts) / WIN * (GX1 - GX0)).toFixed(1)},${(GY1 - Math.min(4.2, v[i]) * 60).toFixed(1)}`; });
        ln.setAttribute('d', d);
      });
      flows.forEach((arr, i) => arr.forEach((dd, j) => {
        const u = frac(t * 0.6 * Math.max(0.3, x[i]) + j / 4);
        const y0 = [NY[0] + NH, NY[1] + NH, NY[2] + NH][i], y1 = [NY[1], NY[2], 300][i];
        at(dd, NX + 70, lerp(y0, y1, u)); show(dd, Math.min(1, x[i] / 1.4) * Math.sin(Math.PI * u));
      }));
      [fbA, fbB, ...minus].forEach(el => show(el, fbOn ? 0.4 + 0.6 * clamp(x[2] - 0.6) : 0.12));
      boxes.forEach((b, i) => b.classList.toggle('lit', x[i] > 1.3));
      const hi = x[2] > 1.3;
      if (!fbOn) return hi ? `Without feedback nothing applies the brakes, so ${ax.hormones[2]} overshoots and stays high` : `Feedback is broken. Hit Trigger and watch ${ax.hormones[2]} overshoot.`;
      if (t - pulse < 3) return `${ax.trigger.replace('!', '')} → hypothalamus releases ${ax.hormones[0]} → pituitary releases ${ax.hormones[1]} → gland releases ${ax.hormones[2]}`;
      if (hi) return `High ${ax.hormones[2]} shuts down the hypothalamus and pituitary (negative feedback ⊖)…`;
      return '…so everything settles back to normal. Tap Trigger to set it off again.';
    };
  },
  plain: [
    'Endocrine glands work in chains called axes. The hypothalamus–pituitary–adrenal (HPA) axis: stress → CRH → ACTH → cortisol. The thyroid axis: TRH → TSH → T3/T4.',
    'The final hormone travels back and tells the hypothalamus and pituitary to ease off. That’s negative feedback, and it keeps levels in a normal range.',
    'Cortisol (mostly chronic stress) makes energy available: raises blood glucose by gluconeogenesis (making glucose from amino acids) and mobilizes fats. Thyroid hormones raise metabolism and heat, support growth (especially the CNS) and strengthen the sympathetic response.',
  ],
  terms: [
    ['Axis', 'A chain of glands acting on each other in sequence.'],
    ['Negative feedback', 'The output reduces its own production, keeping it stable.'],
    ['Gluconeogenesis', 'Making new glucose from non-carbohydrates such as amino acids.'],
  ],
};

export default {
  id: 'L9', n: '9', short: 'Endocrine', color: '--b-hor', chapter: 'Ch 32.1–32.4',
  title: 'Hormones and the endocrine system',
  minute: [
    'Endocrine signals (hormones) ride the blood: slower, wide reach. Neurons are wired: fast and targeted. Other ranges: autocrine, paracrine, pheromones.',
    'Hormones work at tiny concentrations and only on cells with the right receptor.',
    'Peptide/amine hormones (water-soluble) → surface receptors, G proteins, second messengers, fast. Steroids (lipid-soluble) → inside receptors → genes, slow.',
    'Hypothalamus controls the pituitary. Posterior = brain tissue (ADH, oxytocin). Anterior = gland, controlled by releasing/inhibiting hormones through portal vessels.',
    'Tropic hormones: ACTH → adrenal cortex, TSH → thyroid, LH/FSH → gonads. Also GH, prolactin, MSH.',
    'Axes + negative feedback: CRH → ACTH → cortisol; TRH → TSH → T3/T4. The end hormone brakes the start.',
  ],
  traps: [
    'ADH and oxytocin are MADE in the hypothalamus and RELEASED from the posterior pituitary.',
    'The anterior pituitary makes its own hormones; the hypothalamus only tells it when (via portal vessels).',
    'Steroids = receptors inside the cell; peptides = receptors on the surface.',
    'Peptides are stored and released fast; steroids are made on demand.',
    'Fewer receptors → the cell becomes less sensitive to that hormone.',
    'Somatostatin is an INHIBITING hormone (it blocks growth hormone release).',
  ],
  links: [['ADH and aldosterone act on the kidney → Lecture 6', 'L6'], ['Neurons vs hormones: speed and reach → Lecture 8', 'L8'], ['Epinephrine speeds up the heart → Lecture 5', 'L5']],
  scenes: [signals, receptors, pituitary, feedback],
  quiz: [
    { q: 'Compared with nervous signals, hormones are…', a: 'Slower but reach many cells around the body', o: ['Faster and more targeted', 'Only able to affect neighbouring cells', 'Carried along axons'], why: 'Hormones travel in the blood, so they spread widely but take longer.' },
    { q: 'A chemical that acts on the same cell that released it is…', a: 'Autocrine', o: ['Paracrine', 'Endocrine', 'A pheromone'], why: 'Auto = self. Paracrine = neighbours. Endocrine = through the blood. Pheromone = another individual.' },
    { q: 'Where are steroid hormone receptors found?', a: 'Inside the cell (cytoplasm or nucleus)', o: ['Only on the cell surface', 'In the blood', 'On the hypothalamus only'], why: 'Steroids are lipid-soluble, cross the membrane, and the hormone–receptor complex changes gene expression.' },
    { q: 'Why can peptide hormones act faster than steroid hormones?', a: 'They’re stored ahead of time and act through second messengers', o: ['They’re made from cholesterol', 'They enter the nucleus directly', 'They have longer half-lives'], why: 'Peptides are made in advance and stored. Steroids are usually synthesized on demand and change gene expression.' },
    { q: 'Which hormones are released by the posterior pituitary?', a: 'ADH and oxytocin', o: ['TSH and ACTH', 'LH and FSH', 'Growth hormone and prolactin'], why: 'They’re made by hypothalamic neurons and released from their axon endings in the posterior pituitary.' },
    { q: 'How does the hypothalamus control the anterior pituitary?', a: 'Releasing/inhibiting hormones carried by portal blood vessels', o: ['Axons that release hormones directly into the anterior lobe', 'Electrical signals through gap junctions', 'It doesn’t; the anterior pituitary is independent'], why: 'Hypothalamic neurohormones enter a capillary bed, travel down portal vessels, and reach a second capillary bed in the anterior pituitary.' },
    { q: 'ACTH acts on the…', a: 'Adrenal cortex', o: ['Thyroid gland', 'Gonads', 'Kidney tubules'], why: 'ACTH (adrenocorticotropic hormone) stimulates the adrenal cortex to secrete cortisol.' },
    { q: 'In the HPA axis, high cortisol…', a: 'Inhibits CRH and ACTH release (negative feedback)', o: ['Stimulates more CRH (positive feedback)', 'Has no effect on the hypothalamus', 'Blocks the thyroid'], why: 'The end hormone feeds back to turn down the start of the chain, keeping levels stable.' },
    { q: 'Which is an effect of cortisol?', a: 'Raises blood glucose by gluconeogenesis', o: ['Lowers blood glucose', 'Stops fat breakdown', 'Builds muscle protein'], why: 'Cortisol makes energy available: glucose from amino acids, mobilized fats and broken-down proteins.' },
    { q: 'TRH → TSH → ? ', a: 'T3/T4 from the thyroid', o: ['Cortisol from the adrenal cortex', 'ADH from the posterior pituitary', 'Insulin from the pancreas'], why: 'TRH (hypothalamus) → TSH (anterior pituitary) → thyroid hormones T3/T4, which feed back negatively.' },
    { q: 'If a target cell loses many of its receptors for a hormone, it becomes…', a: 'Less sensitive to that hormone', o: ['More sensitive', 'Unaffected', 'A hormone-producing cell'], why: 'Fewer receptors = fewer hormone molecules can bind = smaller response.' },
  ],
};
