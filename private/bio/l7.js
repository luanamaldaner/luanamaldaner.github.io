// Lecture 7 · Ch 28.1, 28.4 + supplement · Digestion

import { E, T, Track, at, move, show, setText, smooth, keys, frac, lerp, clamp, gauss, TAU, win, arrowDefs } from './kit.js';

// ---------------------------------------------------------------- 1. a trip down the gut

const GUT_REGIONS = [
  { name: 'Mouth', a: 40, b: 90, r: 15, speed: 60, procs: ['Motility', 'Secretion', 'Hydrolysis'],
    cap: 'Mouth: chewing breaks food into small pieces (more surface). Saliva adds water, mucus, bicarbonate and amylase, which starts digesting starch.' },
  { name: 'Esophagus', a: 90, b: 180, r: 8, speed: 70, procs: ['Motility'],
    cap: 'Swallowing: the tongue pushes the bolus into the pharynx, the medulla’s swallowing center takes over, and a ring of muscle squeezes it down (peristalsis).' },
  { name: 'Stomach', a: 180, b: 280, r: 44, speed: 14, procs: ['Motility', 'Secretion', 'Hydrolysis'],
    cap: 'Stomach: HCl and pepsin start digesting protein while the walls churn everything into a soupy chyme.' },
  { name: 'Small intestine', a: 280, b: 490, r: 9, speed: 30, procs: ['Motility', 'Secretion', 'Hydrolysis', 'Absorption'],
    cap: 'Small intestine: the pancreas adds enzymes + bicarbonate, the liver/gallbladder add bile. Almost all nutrients are absorbed here.' },
  { name: 'Large intestine', a: 490, b: 612, r: 15, speed: 26, procs: ['Motility', 'Absorption'],
    cap: 'Large intestine (colon): soaks up water and salt, gut bacteria make vitamin K, and it stores what’s left (cellulose = bulk).' },
];
const gutY = x => 172 + 30 * gauss(x, 230, 34) + (x > 280 && x < 490 ? 46 * Math.sin((x - 280) / 210 * 3 * Math.PI) * smooth(280, 300, x) * (1 - smooth(470, 490, x)) : 0) - 20 * smooth(500, 600, x);
const regionOf = x => GUT_REGIONS.find(r => x >= r.a && x < r.b) || GUT_REGIONS[GUT_REGIONS.length - 1];
const gutR = x => {
  let r = 0, w = 0;
  for (const g of GUT_REGIONS) { const k = gauss(x, (g.a + g.b) / 2, (g.b - g.a) / 2.2); r += g.r * k; w += k; }
  return r / w;
};

const gut = {
  id: 'l7-gut', title: 'A trip down the gut', dur: 26,
  build(svg) {
    const g = E('g', {}, svg);
    E('rect', { x: 0, y: 300, width: 640, height: 60, class: 'b-bloodband' }, g);
    T(g, 628, 350, 'blood (absorbed nutrients go here)', 'bs', { 'text-anchor': 'end' });
    const wall = E('path', { class: 'b-gut' }, g);
    const inner = E('path', { class: 'b-gut-in' }, g);
    // accessory organs
    E('ellipse', { cx: 34, cy: 124, rx: 20, ry: 12, class: 'b-gland' }, g); T(g, 12, 102, 'salivary glands', 'bs');
    E('path', { d: 'M232,62 C262,40 330,44 344,70 C352,90 318,98 286,96 C260,94 236,84 232,62z', class: 'b-liver' }, g); T(g, 290, 36, 'liver', 'bs b-strong', { 'text-anchor': 'middle' });
    E('ellipse', { cx: 318, cy: 106, rx: 12, ry: 9, class: 'b-gall' }, g); T(g, 356, 110, 'gallbladder (bile)', 'bs');
    E('path', { d: 'M318,115 C312,130 300,140 296,150', class: 'b-duct' }, g);
    E('path', { d: 'M318,262 C350,270 380,262 392,254 C400,248 392,240 380,242 C360,246 336,250 318,262z', class: 'b-pancreas' }, g); T(g, 400, 270, 'pancreas (enzymes + HCO₃⁻)', 'bs');
    E('path', { d: 'M320,262 C304,246 300,230 298,214', class: 'b-duct' }, g);
    const drops = { saliva: [], bile: [], panc: [] };
    for (let i = 0; i < 4; i++) {
      drops.saliva.push(E('circle', { r: 3, class: 'p-water' }, g));
      drops.bile.push(E('circle', { r: 3.4, class: 'p-bile' }, g));
      drops.panc.push(E('circle', { r: 3.4, class: 'p-salt' }, g));
    }
    const labels = GUT_REGIONS.map(r => T(g, (r.a + r.b) / 2, r.name === 'Small intestine' ? 292 : r.name === 'Stomach' ? 262 : r.name === 'Large intestine' ? 118 : 80, r.name, 'bs b-strong b-region', { 'text-anchor': 'middle' }));
    const bolus = E('ellipse', { class: 'b-bolus' }, g);
    const nutr = Array.from({ length: 10 }, (_, i) => E('circle', { r: 3, class: i % 2 ? 'p-glu' : 'p-fatdot' }, g));
    const waterOut = Array.from({ length: 5 }, () => E('circle', { r: 3, class: 'p-water' }, g));
    const PROCS = ['Motility', 'Secretion', 'Hydrolysis', 'Absorption'];
    const badges = PROCS.map((p, i) => {
      const grp = E('g', {}, g);
      E('rect', { x: 340 + i * 74, y: 12, width: 70, height: 22, rx: 11, class: 'b-badge' }, grp);
      T(grp, 375 + i * 74, 27, p, 'bs b-strong', { 'text-anchor': 'middle' });
      return grp;
    });
    // pre-compute the time→position mapping (slow in the stomach, quick in the esophagus)
    const xs = [40]; const ts = [0];
    for (let x = 40; x < 612; x += 2) { xs.push(x + 2); ts.push(ts[ts.length - 1] + 2 / regionOf(x).speed); }
    const total = ts[ts.length - 1];
    const xAt = tt => { const target = tt * total; let i = 0; while (i < ts.length - 1 && ts[i + 1] < target) i++; const k = (target - ts[i]) / ((ts[i + 1] - ts[i]) || 1); return lerp(xs[i], xs[Math.min(i + 1, xs.length - 1)], k); };
    return (lt, _dt, t) => {
      const xb = xAt(clamp(lt / (this.dur - 1)));
      const reg = regionOf(xb);
      // tube outline with a peristaltic squeeze just behind the bolus
      let top = '', bot = '';
      const pts = [];
      for (let x = 40; x <= 612; x += 4) {
        let r = gutR(x);
        const reg2 = regionOf(x);
        if (reg2.name === 'Stomach' && reg.name === 'Stomach') r *= 1 + 0.12 * Math.sin(TAU * (t * 0.8 - x / 60));
        r *= 1 - 0.5 * gauss(x, xb - 20, 10) * (r < 20 ? 1 : 0.4);
        r += (r < 14 ? 5 : 0) * gauss(x, xb, 9);
        const y = gutY(x), dy = (gutY(x + 1) - gutY(x - 1)) / 2;
        const n = Math.hypot(1, dy);
        pts.push([x - dy / n * r, y + r / n, x + dy / n * r, y - r / n]);
      }
      pts.forEach(([x1, y1, x2, y2], i) => { top += `${i ? 'L' : 'M'}${x2.toFixed(1)},${y2.toFixed(1)}`; });
      for (let i = pts.length - 1; i >= 0; i--) bot += `L${pts[i][0].toFixed(1)},${pts[i][1].toFixed(1)}`;
      wall.setAttribute('d', `${top}${bot}z`);
      inner.setAttribute('d', `${top}${bot}z`);
      // bolus → chyme → feces
      const size = reg.name === 'Mouth' ? 11 : reg.name === 'Esophagus' ? 8 : reg.name === 'Stomach' ? 14 : reg.name === 'Small intestine' ? lerp(8, 5, (xb - 280) / 210) : 7;
      bolus.setAttribute('cx', xb.toFixed(1)); bolus.setAttribute('cy', gutY(xb).toFixed(1));
      bolus.setAttribute('rx', (size * 1.2).toFixed(1)); bolus.setAttribute('ry', size.toFixed(1));
      bolus.style.fill = xb < 180 ? 'var(--b-gold)' : xb < 490 ? 'color-mix(in srgb, var(--b-gold) 60%, var(--b-mem))' : 'color-mix(in srgb, var(--b-wall) 70%, #5a3a2a)';
      labels.forEach((l, i) => l.classList.toggle('on', GUT_REGIONS[i] === reg));
      badges.forEach((b, i) => b.classList.toggle('on', reg.procs.includes(PROCS[i])));
      // secretions drip when the bolus passes
      const drip = (arr, a, b, on) => arr.forEach((d, i) => { const u = frac(t * 0.9 + i / arr.length); at(d, lerp(a[0], b[0], u), lerp(a[1], b[1], u)); show(d, on ? Math.sin(Math.PI * u) : 0); });
      drip(drops.saliva, [44, 132], [60, gutY(60) - 4], reg.name === 'Mouth');
      drip(drops.bile, [312, 118], [296, 152], reg.name === 'Small intestine' && xb < 380);
      drip(drops.panc, [318, 258], [298, 214], reg.name === 'Small intestine' && xb < 380);
      nutr.forEach((d, i) => {
        const u = frac(t * 0.6 + i / nutr.length);
        const x0 = xb + (i % 5 - 2) * 6;
        at(d, x0, lerp(gutY(x0), 320, u));
        show(d, reg.name === 'Small intestine' ? Math.sin(Math.PI * u) : 0);
      });
      waterOut.forEach((d, i) => {
        const u = frac(t * 0.6 + i / waterOut.length);
        at(d, xb + (i - 2) * 7, lerp(gutY(xb), 320, u));
        show(d, reg.name === 'Large intestine' ? Math.sin(Math.PI * u) : 0);
      });
      return reg.cap;
    };
  },
  plain: [
    'The gut is basically one long tube with a way in (mouth) and a way out (anus). Anything inside the tube is technically still outside your body until it’s absorbed.',
    'Four jobs happen along the way: motility (muscles mix and push food), secretion (glands add juices and enzymes), hydrolysis (enzymes split food into building blocks), absorption (building blocks move into the blood).',
    'The muscles are mostly smooth muscle run by the autonomic nervous system, with skeletal muscle at the two ends (swallowing and the final exit).',
  ],
  terms: [
    ['Bolus', 'A swallowed lump of chewed food.'],
    ['Chyme', 'The soupy mix leaving the stomach.'],
    ['Peristalsis', 'A ring-shaped wave of muscle contraction that pushes contents forward.'],
    ['Exocrine gland', 'Secretes through a duct into the gut (salivary glands, pancreas, liver).'],
    ['Duodenum', 'The first part of the small intestine, where pancreatic juice and bile arrive.'],
  ],
};

// ---------------------------------------------------------------- 2. hydrolysis: splitting with water

const hydrolysis = {
  id: 'l7-hydro', title: 'Enzymes split food into building blocks', dur: 12,
  build(svg) {
    const g = E('g', {}, svg);
    const rows = [
      { y: 70, label: 'Carbohydrates', sub: 'amylase → monosaccharides (glucose)', kind: 'hex', enz: 'amylase' },
      { y: 175, label: 'Proteins', sub: 'pepsin, trypsin → amino acids', kind: 'bead', enz: 'pepsin' },
      { y: 285, label: 'Fats', sub: 'lipase → monoglyceride + fatty acids', kind: 'fat', enz: 'lipase' },
    ];
    const COLORS = ['#e0566b', '#e9a23b', '#45b072', '#5a7fe0', '#9a6be0', '#2fa59a'];
    for (const r of rows) {
      T(g, 16, r.y - 6, r.label, 'bl b-strong');
      T(g, 16, r.y + 12, r.sub, 'bs');
      r.units = [];
      if (r.kind !== 'fat') {
        for (let i = 0; i < 6; i++) {
          const u = r.kind === 'hex'
            ? E('path', { d: 'M-13,0 L-6.5,-11 L6.5,-11 L13,0 L6.5,11 L-6.5,11z', class: 'b-sugar' }, g)
            : E('circle', { r: 11, class: 'b-aa', style: `fill:${COLORS[i]}` }, g);
          r.units.push(u);
        }
        r.bonds = Array.from({ length: 5 }, () => E('line', { class: 'b-bondline' }, g));
      } else {
        r.glycerol = E('rect', { width: 14, height: 66, rx: 6, class: 'b-glycerol' }, g);
        r.tails = [-22, 0, 22].map(() => E('polyline', { class: 'b-tail' }, g));
      }
      r.enzyme = E('path', { d: 'M0,0 L16,-9 A18,18 0 1 0 16,9 Z', class: 'b-enzyme' }, g);
      r.enzT = T(g, 0, 0, r.enz, 'bs b-strong', { 'text-anchor': 'middle' });
      r.waters = Array.from({ length: 5 }, () => T(g, 0, 0, 'H₂O', 'bs b-water-t b-strong', { 'text-anchor': 'middle' }));
    }
    const X0 = 270, GAP = 30;
    return lt => {
      const fade = 1 - smooth(11.2, 12, lt);
      for (const r of rows) {
        const ex = keys(lt, [[1, 230], [7.5, X0 + 5 * GAP + 30], [9, 680]]);
        move(r.enzyme, ex, r.y + 2, 1, 180 + 18 * Math.sin(lt * 9));
        r.enzT.setAttribute('x', ex); r.enzT.setAttribute('y', r.y - 22);
        show(r.enzyme, fade * smooth(0.6, 1, lt)); show(r.enzT, fade * smooth(0.6, 1, lt) * (1 - smooth(8, 8.6, lt)));
        if (r.kind !== 'fat') {
          const cutT = i => 1.6 + i * 1.2; // bond i breaks at this time
          r.units.forEach((u, i) => {
            const spread = smooth(cutT(i - 1) + 0.2, cutT(i - 1) + 1.0, lt) * (i > 0 ? 1 : 0);
            const drift = smooth(8, 10, lt);
            const x = X0 + i * GAP + i * 14 * spread + i * 10 * drift;
            const y = r.y + (i > 0 ? Math.sin(lt * 2 + i) * 6 * spread : 0) + (i % 2 ? -1 : 1) * 10 * drift;
            move(u, x, y, 1, r.kind === 'hex' ? 30 * drift * (i % 2 ? 1 : -1) : 0);
            show(u, fade);
            u.userData = [x, y];
          });
          r.bonds.forEach((b, i) => {
            const [x1, y1] = r.units[i].userData, [x2, y2] = r.units[i + 1].userData;
            b.setAttribute('x1', x1 + 12); b.setAttribute('y1', y1); b.setAttribute('x2', x2 - 12); b.setAttribute('y2', y2);
            show(b, fade * (1 - smooth(cutT(i), cutT(i) + 0.25, lt)));
            const w = r.waters[i];
            w.setAttribute('x', (x1 + x2) / 2); w.setAttribute('y', y1 - 14 - 10 * smooth(cutT(i), cutT(i) + 1, lt));
            show(w, fade * win(lt, cutT(i) - 0.2, cutT(i) + 0.9, 0.2));
          });
        } else {
          const gx = X0 - 10;
          move(r.glycerol, gx, r.y - 33);
          show(r.glycerol, fade);
          r.tails.forEach((tl, i) => {
            const cut = i !== 1 ? 2.4 + (i ? 2.4 : 0) : 99;
            const k = smooth(cut + 0.2, cut + 1.6, lt);
            const ox = gx + 14 + k * 70, oy = r.y - 22 + i * 22 + (i - 1) * 26 * k;
            let pts = '';
            for (let j = 0; j <= 9; j++) pts += `${(ox + j * 15).toFixed(1)},${(oy + (j % 2 ? -5 : 5) + Math.sin(lt * 3 + j) * 2 * k).toFixed(1)} `;
            tl.setAttribute('points', pts);
            show(tl, fade);
            if (i !== 1) {
              const w = r.waters[i];
              w.setAttribute('x', gx + 40); w.setAttribute('y', oy - 10);
              show(w, fade * win(lt, cut - 0.2, cut + 0.9, 0.2));
            }
          });
          r.waters.slice(3).forEach(w => show(w, 0));
          show(r.waters[1], 0);
        }
      }
      if (lt < 1.5) return 'Food molecules are long chains, far too big to absorb';
      if (lt < 8) return 'Each enzyme breaks one bond at a time by adding a water molecule: that’s hydrolysis (“splitting with water”)';
      return 'Now they’re small building blocks (glucose, amino acids, fatty acids) that can cross into your cells';
    };
  },
  plain: [
    'Enzymatic hydrolysis = enzymes use water to split big food molecules into pieces small enough to absorb.',
    'Carbohydrates → monosaccharides (e.g. glucose). Proteins → amino acids. Fats (triglycerides) → monoglycerides + fatty acids. Nucleic acids → nucleotides.',
  ],
  terms: [
    ['Amylase', 'Splits starch (in saliva and pancreatic juice).'],
    ['Pepsin, trypsin', 'Protein-cutting enzymes from the stomach and pancreas.'],
    ['Lipase', 'Splits fats.'],
  ],
};

// ---------------------------------------------------------------- 3. stomach acid

const stomach = {
  id: 'l7-acid', title: 'How the stomach makes acid (and doesn’t digest itself)', dur: 14,
  vars: { meal: 'meal' },
  build(svg, s, ui) {
    ui.seg('meal', [['fast', 'Empty stomach'], ['meal', 'Meal arrives']], 'Meal');
    const g = E('g', {}, svg);
    E('rect', { x: 0, y: 0, width: 196, height: 360, class: 'b-lumen-acid' }, g);
    T(g, 14, 24, 'inside the stomach', 'bs b-strong');
    E('rect', { x: 470, y: 0, width: 170, height: 360, class: 'b-bloodband' }, g);
    T(g, 626, 24, 'blood', 'bs b-strong', { 'text-anchor': 'end' });
    E('rect', { x: 196, y: 0, width: 10, height: 360, class: 'b-mucus' }, g);
    T(g, 201, 350, 'mucus', 'bs', { 'text-anchor': 'middle' });
    E('rect', { x: 212, y: 40, width: 248, height: 280, rx: 30, class: 'b-cellbody' }, g);
    T(g, 336, 66, 'parietal cell', 'bl b-strong', { 'text-anchor': 'middle' });
    // pump on the lumen side
    const pump = E('g', {}, g);
    E('rect', { x: -12, y: -26, width: 24, height: 52, rx: 10, class: 'b-pump' }, pump);
    move(pump, 212, 150);
    T(g, 230, 112, 'H⁺/K⁺ pump', 'bs b-strong');
    const atp = T(g, 236, 186, 'ATP', 'bs b-atp');
    // receptors on the blood side
    const recs = [['ACh', 110, 'nerve'], ['gastrin', 180, 'blood'], ['histamine', 250, 'ECL cell']];
    const sig = recs.map(([name, y, from]) => {
      E('path', { d: `M460,${y - 10} q-12,10 0,20`, class: 'b-receptor' }, g);
      T(g, 600, y - 14, name, 'bs b-strong b-hor-t', { 'text-anchor': 'middle' });
      T(g, 600, y + 2, `(${from})`, 'bs', { 'text-anchor': 'middle' });
      return { y, dots: Array.from({ length: 3 }, () => E('circle', { r: 5, class: 'p-hor' }, g)) };
    });
    // chemistry inside the cell
    const co2 = Array.from({ length: 3 }, () => T(g, 0, 0, 'CO₂', 'bs b-strong', { 'text-anchor': 'middle' }));
    const H = Array.from({ length: 6 }, () => E('circle', { r: 6, class: 'p-h' }, g));
    const Hl = Array.from({ length: 14 }, (_, i) => E('circle', { r: 5, cx: 20 + (i * 37) % 160, cy: 60 + (i * 61) % 260, class: 'p-h' }, g));
    const K = Array.from({ length: 3 }, () => E('circle', { r: 6, class: 'p-k' }, g));
    const HCO = Array.from({ length: 4 }, () => E('circle', { r: 6, class: 'p-hco3' }, g));
    T(g, 336, 300, 'CO₂ + H₂O → H⁺ + HCO₃⁻', 'bs b-strong', { 'text-anchor': 'middle' });
    // pepsinogen → pepsin
    const pg = Array.from({ length: 3 }, () => { const grp = E('g', {}, g); E('path', { d: 'M0,0 L14,-8 A16,16 0 1 0 14,8 Z', class: 'b-enzyme' }, grp); const lid = E('path', { d: 'M2,-1 L16,-8 L16,8z', class: 'b-lid' }, grp); return { grp, lid }; });
    const prot = Array.from({ length: 6 }, (_, i) => E('circle', { r: 6, class: 'b-aa', style: `fill:${['#e0566b', '#e9a23b', '#45b072', '#5a7fe0', '#9a6be0', '#2fa59a'][i]}` }, g));
    const ph = T(g, 14, 48, '', 'bl b-strong b-acid-t');
    T(g, 16, 330, '● H⁺', 'bs b-acid-t'); T(g, 60, 330, '● K⁺', 'bs b-k-t'); T(g, 100, 330, '● HCO₃⁻', 'bs blue-t');
    let pH = 4;
    return (lt, dt, t) => {
      const meal = s.vars.meal === 'meal';
      const rate = meal ? 1 : 0.25;
      pH += ((meal ? 1.8 : 4) - pH) * Math.min(1, dt * 0.6);
      setText(ph, `pH ≈ ${pH.toFixed(1)}`);
      sig.forEach((sg, j) => sg.dots.forEach((d, i) => {
        const u = frac(t * 0.5 + i / 3 + j * 0.2);
        at(d, lerp(560, 466, u), sg.y + Math.sin(u * 6 + i) * 4);
        show(d, meal ? Math.sin(Math.PI * u) : 0);
      }));
      co2.forEach((c, i) => {
        const u = frac(t * 0.3 * rate + i / 3);
        c.setAttribute('x', lerp(470, 360, u).toFixed(1)); c.setAttribute('y', (230 + i * 22).toFixed(1));
        show(c, Math.sin(Math.PI * u));
      });
      H.forEach((h, i) => {
        const u = frac(t * 0.45 * rate + i / H.length);
        const p = keys(u, [[0, [360, 250 - (i % 3) * 18]], [0.5, [226, 150]], [0.7, [205, 150]], [1, [120 - (i % 3) * 30, 110 + (i * 37) % 120]]]);
        at(h, p[0], p[1]); show(h, Math.min(1, Math.sin(Math.PI * u) * 2));
      });
      Hl.forEach((h, i) => show(h, clamp((4.2 - pH) / 2.2 - i / 20)));
      K.forEach((k, i) => {
        const u = frac(t * 0.45 * rate + i / K.length + 0.5);
        const p = keys(u, [[0, [150, 200 + i * 20]], [0.4, [200, 156]], [0.6, [226, 156]], [1, [300, 200 + i * 15]]]);
        at(k, p[0], p[1]); show(k, Math.sin(Math.PI * u));
      });
      HCO.forEach((c, i) => {
        const u = frac(t * 0.4 * rate + i / HCO.length);
        at(c, lerp(380, 560, u), 262 + (i % 2) * 18 + Math.sin(u * 7) * 4);
        show(c, Math.sin(Math.PI * u));
      });
      show(atp, 0.3 + 0.7 * Math.max(0, Math.sin(TAU * t * rate * 1.2)));
      // pepsinogen gets its lid knocked off by acid, then chops a protein
      const act = clamp((4 - pH) / 2);
      pg.forEach(({ grp, lid }, i) => {
        const x = 40 + i * 50, y = 230 + Math.sin(t + i) * 6;
        move(grp, x, y, 1, 180 + (act > 0.6 ? 20 * Math.sin(t * 6 + i) : 0));
        show(lid, 1 - act);
      });
      prot.forEach((p, i) => {
        const sep = act * (0.5 + 0.5 * Math.sin(t * 0.7)) * 12;
        at(p, 40 + i * (14 + sep), 280 + (i % 2 ? -1 : 1) * sep * 0.5);
      });
      if (!meal) return 'Between meals the pumps tick over slowly and the stomach is only mildly acidic.';
      if (lt < 5) return 'Food triggers three “go” signals: ACh from nerves, the hormone gastrin, and histamine. All three speed up the acid pumps.';
      if (lt < 10) return 'Inside the parietal cell CO₂ + water make H⁺ and HCO₃⁻. The H⁺/K⁺ pump (uses ATP) pushes H⁺ into the stomach and swaps it for K⁺; HCO₃⁻ goes to the blood.';
      return 'Acid turns inactive pepsinogen into pepsin, which starts cutting proteins. A thick bicarbonate-rich mucus layer protects the lining.';
    };
  },
  plain: [
    'Gastric pits are lined with different cells: mucous cells (mucus), chief cells (pepsinogen), parietal cells (HCl + intrinsic factor, needed for vitamin B₁₂). G cells release gastrin, ECL cells histamine, D cells somatostatin (the brake).',
    'The proton pump (H⁺/K⁺ ATPase) swaps H⁺ out for K⁺ in. The leftover HCO₃⁻ goes into the blood.',
    'Pepsinogen is made inactive so it doesn’t digest the cells that make it. HCl (or pepsin itself) cuts it into active pepsin.',
    'The lining survives thanks to bicarbonate-rich mucus and is replaced every ~3 days. When that barrier fails you get a peptic ulcer.',
  ],
  terms: [
    ['Parietal cell', 'Secretes HCl and intrinsic factor.'],
    ['Chief cell', 'Secretes pepsinogen.'],
    ['Gastrin', 'Hormone from G cells that boosts acid secretion (directly and via histamine).'],
    ['Somatostatin', 'From D cells; slows acid and pepsinogen release.'],
    ['H2 receptor', 'Histamine’s receptor on parietal cells (what heartburn pills like famotidine block).'],
  ],
};

// ---------------------------------------------------------------- 4. bile breaks up fat

const bile = {
  id: 'l7-bile', title: 'Bile breaks fat into tiny droplets', dur: 16,
  build(svg) {
    const g = E('g', {}, svg);
    const R = 62, C0 = [250, 180];
    const MAXL = 4;
    // droplet positions: each level splits every droplet in two
    const lv = [[{ p: C0, r: R }]];
    for (let k = 1; k <= MAXL; k++) {
      const r = R / Math.pow(2, k / 3);
      const prev = lv[k - 1];
      const dir = k % 2 ? [1, 0] : [0, 1];
      const off = r * (k < 3 ? 1.2 : 1.35) * (k === 4 ? 1.25 : 1);
      lv.push(prev.flatMap(d => [{ p: [d.p[0] - dir[0] * off, d.p[1] - dir[1] * off], r }, { p: [d.p[0] + dir[0] * off, d.p[1] + dir[1] * off], r }]));
    }
    const drops = Array.from({ length: 16 }, () => { const grp = E('g', {}, g); return { grp, fat: E('circle', { r: 1, class: 'b-fatdrop' }, grp), coat: E('circle', { r: 1, class: 'b-coat' }, grp) }; });
    const salts = Array.from({ length: 12 }, () => { const grp = E('g', {}, g); E('line', { x1: 0, y1: 0, x2: 14, y2: 0, class: 'b-salttail' }, grp); E('circle', { r: 4.5, class: 'b-salthead' }, grp); return grp; });
    const lip = Array.from({ length: 4 }, () => E('path', { d: 'M0,0 L12,-7 A14,14 0 1 0 12,7 Z', class: 'b-enzyme' }, g));
    const mic = Array.from({ length: 8 }, () => { const grp = E('g', {}, g); E('circle', { r: 9, class: 'b-coat' }, grp); E('circle', { r: 5, class: 'b-fatdrop' }, grp); return grp; });
    E('rect', { x: 560, y: 30, width: 70, height: 300, rx: 16, class: 'b-epi' }, g);
    T(g, 595, 350, 'gut wall', 'bs', { 'text-anchor': 'middle' });
    T(g, 18, 30, '● bile salt: one end likes water, the other likes fat', 'bs b-bile-t');
    return lt => {
      const L = keys(lt, [[4.5, 0], [10, MAXL]]);
      const k0 = Math.floor(Math.min(L, MAXL - 1e-6)), f = L - k0;
      const shrink = smooth(12, 15, lt);
      drops.forEach((d, i) => {
        const nNext = 2 ** Math.min(MAXL, k0 + 1);
        if (i >= nNext) { show(d.grp, 0); return; }
        const child = lv[Math.min(MAXL, k0 + 1)][i];
        const parent = lv[k0][i >> 1] || lv[k0][0];
        const exists = i < 2 ** k0;
        const from = exists ? lv[k0][i] : parent;
        const p = L >= MAXL ? lv[MAXL][i] : { p: [lerp(parent.p[0], child.p[0], smooth(0, 1, f)), lerp(parent.p[1], child.p[1], smooth(0, 1, f))], r: lerp(parent.r, child.r, f) };
        void from;
        const r = p.r * (1 - 0.55 * shrink);
        move(d.grp, p.p[0], p.p[1]);
        d.fat.setAttribute('r', r.toFixed(1)); d.coat.setAttribute('r', (r + 3).toFixed(1));
        show(d.grp, 1);
        show(d.coat, smooth(1.5, 4.5, lt));
      });
      salts.forEach((sl, i) => {
        const a = i / salts.length * TAU;
        const k = smooth(0.5 + i * 0.12, 3.5 + i * 0.12, lt);
        const rr = lerp(170, R + 8, k);
        move(sl, C0[0] + Math.cos(a) * rr, C0[1] + Math.sin(a) * rr, 1, a * 180 / Math.PI);
        show(sl, 1 - smooth(4.5, 5.5, lt));
      });
      lip.forEach((e, i) => {
        const k = smooth(10.5, 12, lt);
        move(e, lerp(-30, 160 + i * 60, k), 70 + i * 70, 1, 0);
        show(e, k * (1 - smooth(15, 16, lt)));
      });
      mic.forEach((m, i) => {
        const u = frac(lt * 0.25 + i / mic.length);
        move(m, lerp(330, 556, u), 80 + (i * 37) % 200);
        show(m, smooth(12.5, 13.5, lt) * Math.sin(Math.PI * u));
      });
      if (lt < 4.5) return 'Fat clumps into big droplets in watery chyme. Bile salts arrive: one end sticks to water, the other to fat, so they coat the droplet.';
      if (lt < 10.5) return 'Mixing breaks it into smaller and smaller coated droplets. Same amount of fat, much more surface (emulsification).';
      return 'Lipase can now work on all that surface. The fatty acids end up in tiny bile-salt bundles called micelles, which carry them to the gut wall.';
    };
  },
  plain: [
    'Fat and water don’t mix, and lipase can only work at a droplet’s surface. Bile salts (made by the liver, stored in the gallbladder) act like soap: they break big droplets into many small ones, which gives lipase much more surface.',
    'The liver also does a long list of other jobs: processes nutrients, detoxifies drugs and hormones, makes plasma proteins, stores glycogen, iron and vitamins, activates vitamin D, and removes old red blood cells. Blood from the gut reaches it first through the hepatic portal vein.',
    'Bile salts are recycled back to the liver after use.',
  ],
  terms: [
    ['Emulsify', 'Break fat into small droplets suspended in water.'],
    ['Micelle', 'A tiny ball of bile salts with fatty acids and monoglycerides inside.'],
    ['Hepatic portal system', 'Veins that carry blood from the gut straight to the liver.'],
  ],
};

// ---------------------------------------------------------------- 5. villi and sugar uptake

const villi = {
  id: 'l7-villi', title: 'Villi, and how glucose gets absorbed', dur: 10,
  build(svg) {
    const g = E('g', {}, svg);
    // left: swaying villi
    E('rect', { x: 10, y: 250, width: 270, height: 60, rx: 10, class: 'b-epi' }, g);
    const fingers = Array.from({ length: 6 }, () => E('path', { class: 'b-villus' }, g));
    const lacteals = Array.from({ length: 6 }, () => E('path', { class: 'b-lacteal-line' }, g));
    T(g, 145, 332, 'villi (each covered in microvilli)', 'bs b-strong', { 'text-anchor': 'middle' });
    T(g, 145, 350, '→ about 600× more surface', 'bs', { 'text-anchor': 'middle' });
    // right: one cell
    const CX0 = 330, CX1 = 600, CY0 = 110, CY1 = 268;
    T(g, 465, 22, 'gut lumen', 'bs b-strong', { 'text-anchor': 'middle' });
    E('rect', { x: CX0, y: CY0, width: CX1 - CX0, height: CY1 - CY0, rx: 18, class: 'b-cellbody' }, g);
    for (let x = CX0 + 10; x < CX1 - 6; x += 12) E('rect', { x, y: CY0 - 18, width: 7, height: 22, rx: 3.5, class: 'b-microvillus' }, g);
    T(g, CX1 + 4, CY0 - 22, 'microvilli', 'bs', { 'text-anchor': 'end' });
    E('rect', { x: CX0 - 6, y: 300, width: CX1 - CX0 + 12, height: 40, rx: 14, class: 'b-bloodband' }, g);
    T(g, 465, 326, 'blood capillary', 'bs b-strong', { 'text-anchor': 'middle' });
    const sglt = E('rect', { x: 384, y: CY0 - 6, width: 26, height: 22, rx: 8, class: 'b-transporter' }, g);
    T(g, 397, 74, 'SGLT', 'bs b-strong', { 'text-anchor': 'middle' });
    E('rect', { x: 384, y: CY1 - 14, width: 26, height: 22, rx: 8, class: 'b-transporter g2' }, g);
    T(g, 397, CY1 + 26, 'GLUT-2', 'bs b-strong', { 'text-anchor': 'middle' });
    const pump = E('rect', { x: 520, y: CY1 - 14, width: 26, height: 22, rx: 8, class: 'b-pump' }, g);
    T(g, 533, CY1 + 26, 'Na⁺/K⁺ pump', 'bs b-strong', { 'text-anchor': 'middle' });
    const atp = T(g, 556, CY1 - 20, 'ATP', 'bs b-atp');
    const na = Array.from({ length: 3 }, () => E('circle', { r: 7, class: 'p-salt' }, g));
    const glu = Array.from({ length: 3 }, () => E('path', { d: 'M-8,0 L-4,-7 L4,-7 L8,0 L4,7 L-4,7z', class: 'b-sugar' }, g));
    const k = Array.from({ length: 2 }, () => E('circle', { r: 6, class: 'p-k' }, g));
    const lumNa = Array.from({ length: 8 }, (_, i) => E('circle', { r: 6, cx: 340 + i * 34, cy: 46 + (i % 2) * 18, class: 'p-salt faint' }, g));
    void lumNa;
    T(g, 330, 300 - 6, '', 'bs');
    T(g, 18, 26, '● Na⁺  ', 'bs b-salt-t'); T(g, 66, 26, '⬢ glucose  ', 'bs b-glu-t'); T(g, 150, 26, '● K⁺', 'bs b-k-t');
    return (lt, _dt, t) => {
      fingers.forEach((f, i) => {
        const x = 30 + i * 44, sway = Math.sin(t * 1.4 + i * 0.8) * 8;
        f.setAttribute('d', `M${x},252 C${x},200 ${x + sway},150 ${x + 10 + sway},${120 + (i % 2) * 14} C${x + 20 + sway},${150 + (i % 2) * 14} ${x + 20},200 ${x + 20},252z`);
        lacteals[i].setAttribute('d', `M${x + 10},250 C${x + 10},210 ${x + 10 + sway * 0.6},170 ${x + 10 + sway * 0.8},${140 + (i % 2) * 14}`);
      });
      const cyc = 3.3;
      na.forEach((n, i) => {
        const u = frac((t + i * cyc / 3) / cyc);
        const p = keys(u, [[0, [360, 40]], [0.25, [392, CY0 - 2]], [0.4, [392, CY0 + 26]], [0.75, [520, CY1 - 34]], [0.85, [533, CY1 - 4]], [1, [533, 296]]]);
        at(n, p[0], p[1]); show(n, Math.min(1, Math.sin(Math.PI * u) * 3));
      });
      glu.forEach((gl, i) => {
        const u = frac((t + i * cyc / 3) / cyc);
        const p = keys(u, [[0, [430, 40]], [0.25, [402, CY0 - 2]], [0.4, [402, CY0 + 26]], [0.75, [397, CY1 - 30]], [0.88, [397, CY1 + 2]], [1, [410, 312]]]);
        move(gl, p[0], p[1]); show(gl, Math.min(1, Math.sin(Math.PI * u) * 3));
      });
      k.forEach((kk, i) => {
        const u = frac((t + i * cyc / 2) / cyc + 0.4);
        const p = keys(u, [[0, [540, 330]], [0.3, [540, CY1 + 4]], [0.5, [540, CY1 - 22]], [1, [480, 200]]]);
        at(kk, p[0], p[1]); show(kk, Math.sin(Math.PI * u));
      });
      sglt.classList.toggle('busy', frac(t / cyc * 3) > 0.2 && frac(t / cyc * 3) < 0.45);
      pump.classList.toggle('busy', frac(t / cyc * 3) > 0.75);
      show(atp, frac(t / cyc * 3) > 0.75 ? 1 : 0.25);
      if (lt < 3.4) return 'Na⁺ and glucose ride through SGLT together. Na⁺ is rushing “downhill” into the cell and drags glucose along (secondary active transport).';
      if (lt < 6.7) return 'Glucose leaves the bottom of the cell through GLUT-2 and enters the blood';
      return 'The Na⁺/K⁺ pump (ATP) throws Na⁺ back out, which keeps Na⁺ low inside so the next ride can happen. Amino acids get in the same way.';
    };
  },
  plain: [
    'The small intestine’s inner wall is folded, the folds are covered in finger-like villi, and each villus cell has a brush border of microvilli. Together that’s about 600× more surface for absorption. Most absorption happens in the duodenum and jejunum.',
    'Brush-border enzymes finish splitting disaccharides into monosaccharides. Glucose and galactose (and amino acids) enter cells by secondary active transport: the Na⁺ gradient, built by the ATP-using Na⁺/K⁺ pump, powers the trip.',
  ],
  terms: [
    ['Villus / microvillus', 'Finger-like fold / tiny hair-like projections on each cell (brush border).'],
    ['SGLT', 'Na⁺–glucose cotransporter on the lumen side.'],
    ['GLUT-2', 'Lets glucose out the blood side. (GLUT-5 brings in fructose.)'],
    ['Secondary active transport', 'Uses an existing ion gradient (made with ATP) instead of ATP directly.'],
  ],
};

// ---------------------------------------------------------------- 6. fat goes to the lymph

const fat = {
  id: 'l7-fat', title: 'Fats take a different exit: the lacteal', dur: 12,
  build(svg) {
    const g = E('g', {}, svg);
    T(g, 320, 22, 'gut lumen', 'bs b-strong', { 'text-anchor': 'middle' });
    E('rect', { x: 120, y: 80, width: 400, height: 150, rx: 22, class: 'b-cellbody' }, g);
    for (let x = 130; x < 512; x += 12) E('rect', { x, y: 62, width: 7, height: 22, rx: 3.5, class: 'b-microvillus' }, g);
    T(g, 136, 106, 'intestinal cell', 'bs b-strong');
    E('ellipse', { cx: 320, cy: 160, rx: 70, ry: 30, class: 'b-er' }, g);
    T(g, 320, 206, 'rebuilds triglycerides', 'bs', { 'text-anchor': 'middle' });
    E('rect', { x: 120, y: 268, width: 180, height: 46, rx: 22, class: 'b-lymphv' }, g);
    T(g, 210, 340, 'lacteal (lymph)', 'bs b-strong', { 'text-anchor': 'middle' });
    E('rect', { x: 340, y: 268, width: 180, height: 46, rx: 22, class: 'b-bloodband' }, g);
    T(g, 430, 340, 'blood capillary', 'bs b-strong', { 'text-anchor': 'middle' });
    const block = T(g, 430, 296, '✕ too big', 'bs b-strong b-acid-t', { 'text-anchor': 'middle' });
    const mic = E('g', {}, g); E('circle', { r: 16, class: 'b-coat' }, mic); E('circle', { r: 10, class: 'b-fatdrop' }, mic);
    const bits = Array.from({ length: 6 }, () => E('circle', { r: 4, class: 'b-fatdrop' }, g));
    const chylo = E('g', {}, g); E('circle', { r: 20, class: 'b-chylo' }, chylo); E('circle', { r: 13, class: 'b-fatdrop' }, chylo);
    const ghost = E('g', {}, g); E('circle', { r: 20, class: 'b-chylo' }, ghost);
    return lt => {
      const mp = keys(lt, [[0, [320, -20]], [2, [320, 40]]]);
      move(mic, mp[0], mp[1]); show(mic, 1 - smooth(2.4, 3.2, lt));
      bits.forEach((b, i) => {
        const p = keys(lt, [[2.2, [312 + (i % 3) * 8, 44 + (i >> 1) * 4]], [4.2, [280 + i * 14, 150 + (i % 2) * 14]], [5.4, [314 + (i % 3) * 6, 156 + (i % 2) * 6]]]);
        at(b, p[0], p[1]); show(b, smooth(2.2, 2.6, lt) * (1 - smooth(5.6, 6.2, lt)));
      });
      const cp = keys(lt, [[5.6, [320, 160]], [7.4, [320, 222]], [9, [210, 291]], [11.5, [140, 291]]]);
      move(chylo, cp[0], cp[1]); show(chylo, smooth(5.6, 6.2, lt) * (1 - smooth(11.4, 12, lt)));
      const gp = keys(lt, [[7.4, [320, 222]], [8.4, [404, 262]]]);
      move(ghost, gp[0], gp[1]); show(ghost, win(lt, 7.6, 8.6, 0.3) * 0.5); show(block, win(lt, 8, 9.6, 0.3));
      if (lt < 2.4) return 'A micelle carries digested fat (fatty acids + monoglycerides) to the cell';
      if (lt < 5.6) return 'They slip straight through the cell membrane (they’re fat-soluble), then get rebuilt into triglycerides';
      if (lt < 8.5) return 'Triglycerides are wrapped in a protein coat → a chylomicron, which leaves the cell by exocytosis';
      return 'Chylomicrons are too big for blood capillaries, so they enter the lacteal, a lymph vessel, and reach the blood later';
    };
  },
  plain: [
    'Sugars and amino acids go into blood capillaries. Fats are different: they’re reassembled into triglycerides inside the cell, packed into chylomicrons and sent into lacteals (lymph vessels).',
    'The large intestine then mostly absorbs water and salt and stores what’s left.',
  ],
  terms: [
    ['Chylomicron', 'Triglycerides wrapped in phospholipids and protein.'],
    ['Lacteal', 'The lymph vessel in the middle of each villus.'],
  ],
};

export default {
  id: 'L7', n: '7', short: 'Digestion', color: '--b-gold', chapter: 'Ch 28.1, 28.4 + supplement',
  title: 'Digestion: from food to fuel',
  minute: [
    'The gut is a tube: foregut, midgut, hindgut. Four processes: motility, secretion, enzymatic hydrolysis, absorption.',
    'Mouth: chewing + saliva (amylase, mucus, bicarbonate). Swallowing → peristalsis down the esophagus.',
    'Stomach: parietal cells make HCl (H⁺/K⁺ pump), chief cells make pepsinogen → pepsin. ACh, gastrin and histamine turn acid up; somatostatin turns it down.',
    'Pancreas adds bicarbonate (neutralizes acid) and enzymes (activated in the duodenum). Liver makes bile; gallbladder stores it; bile emulsifies fat.',
    'Small intestine: villi + microvilli = huge surface. Glucose and amino acids enter with Na⁺ (SGLT); fats leave cells as chylomicrons into lacteals.',
    'Large intestine: absorbs water and salt, bacteria make vitamin K, stores feces.',
  ],
  traps: [
    'Pepsin is secreted as inactive pepsinogen; HCl activates it.',
    'Parietal = HCl + intrinsic factor. Chief = pepsinogen. G cells = gastrin. D cells = somatostatin.',
    'Bile has no enzymes. It emulsifies fat (physical, not chemical).',
    'Glucose absorption uses the Na⁺ gradient (secondary active), not ATP directly.',
    'Fats go to lacteals (lymph), not straight into blood capillaries.',
    'Most absorption: duodenum and jejunum. The colon mainly absorbs water.',
  ],
  links: [['Lymph vessels drain into veins → Lecture 5', 'L5'], ['Parasympathetic “rest and digest” → Lecture 8', 'L8'], ['Gastrin, somatostatin are hormones → Lecture 9', 'L9']],
  scenes: [gut, hydrolysis, stomach, bile, villi, fat],
  quiz: [
    { q: 'Which cells in the stomach secrete HCl?', a: 'Parietal cells', o: ['Chief cells', 'G cells', 'Mucous cells'], why: 'Parietal cells make HCl (and intrinsic factor). Chief cells make pepsinogen.' },
    { q: 'What activates pepsinogen?', a: 'HCl (and pepsin itself)', o: ['Bile salts', 'Bicarbonate', 'Amylase'], why: 'Acid cuts pepsinogen into active pepsin. Once some pepsin exists, it activates more.' },
    { q: 'The proton pump in parietal cells exchanges…', a: 'H⁺ out for K⁺ in', o: ['Na⁺ out for K⁺ in', 'H⁺ out for Na⁺ in', 'Cl⁻ out for HCO₃⁻ in'], why: 'It’s the H⁺/K⁺ ATPase. Bicarbonate exits to the blood on the other side.' },
    { q: 'Which signal is NOT a “turn acid up” signal?', a: 'Somatostatin', o: ['Acetylcholine', 'Gastrin', 'Histamine'], why: 'Somatostatin from D cells inhibits HCl and pepsinogen secretion.' },
    { q: 'What does bile do to fats?', a: 'Emulsifies them into small droplets', o: ['Hydrolyzes them into fatty acids', 'Absorbs them into the blood', 'Converts them to glucose'], why: 'Bile salts have water-loving and fat-loving ends. They break fat apart so lipase has more surface to act on.' },
    { q: 'Glucose enters intestinal cells by…', a: 'Secondary active transport with Na⁺ (SGLT)', o: ['Simple diffusion', 'The H⁺/K⁺ pump', 'Endocytosis of whole starch'], why: 'Na⁺ flowing down its gradient drags glucose along. The gradient is kept by the Na⁺/K⁺ pump.' },
    { q: 'Where do chylomicrons go after leaving the intestinal cell?', a: 'Into lacteals (lymph vessels)', o: ['Directly into blood capillaries', 'Back into the gut lumen', 'Into the gallbladder'], why: 'They’re too big for blood capillaries, so they enter the lymph first.' },
    { q: 'What’s the main job of the large intestine?', a: 'Absorb water and salt, and store feces', o: ['Digest proteins', 'Absorb most nutrients', 'Make bile'], why: 'Most nutrients are already absorbed in the small intestine. The colon takes back water; bacteria make vitamin K.' },
    { q: 'Why is the gut lumen considered “outside” the body?', a: 'It’s a tube open to the environment at both ends', o: ['It has no blood supply', 'It’s lined with skin', 'It contains bacteria'], why: 'Food isn’t really inside you until it’s absorbed across the gut wall.' },
    { q: 'Proteins are hydrolyzed into…', a: 'Amino acids', o: ['Monosaccharides', 'Fatty acids', 'Nucleotides'], why: 'Carbs → monosaccharides, proteins → amino acids, fats → monoglycerides + fatty acids, nucleic acids → nucleotides.' },
  ],
};
