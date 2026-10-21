// Guided lecture · Ch 8 · Addition reactions of alkenes (follows Dr. Lopez's slides, sections 8.1–8.15)
// ---------------------------------------------------------------- structures for step.figs
// Built with small helpers so ring and chain geometry stays exact. Coordinates are in bond
// lengths, y up (see skeletal() in draw.js). Unlabeled atoms are carbons.
const rad = d => d * Math.PI / 180;
const rd = v => Math.round(v * 1000) / 1000;
const at = (p, deg, len = 1) => [rd(p[0] + len * Math.cos(rad(deg))), rd(p[1] + len * Math.sin(rad(deg)))];
const side = deg => { const c = Math.cos(rad(deg)); return c < -0.3 ? 'end' : c > 0.3 ? 'start' : 'middle'; };
// zig-zag chain points: (0,0), (0.866,0.5), (1.732,0), …
const zz = (n, x0 = 0, y0 = 0) => Array.from({ length: n }, (_, i) => [rd(x0 + i * 0.866), y0 + (i % 2 ? 0.5 : 0)]);

function build(name, fn) {
  const atoms = [], bonds = [], arrows = [];
  const m = {
    p: i => atoms[i],
    atom(p, label = '', o = {}) { atoms.push([p[0], p[1], label, o]); return atoms.length - 1; },
    bond(i, j, t = 1, o = {}) { bonds.push([i, j, t, o]); },
    // substituent on atom i pointing at angle deg (o.len = bond length, other keys = atom opts)
    sub(i, deg, label = '', t = 1, o = {}) {
      const { len = 1, ...ao } = o;
      const k = m.atom(at(atoms[i], deg, len), label, label ? { align: side(deg), ...ao } : ao);
      m.bond(i, k, t, ao.hl ? { hl: true } : {});
      return k;
    },
    // chain through pts; dbl = indices k of double bonds k→k+1 (second line on the inside of the zig-zag)
    chain(pts, dbl = [], o = {}) {
      const ids = pts.map(q => m.atom(q));
      for (let k = 0; k + 1 < ids.length; k++) {
        const d = dbl.includes(k);
        m.bond(ids[k], ids[k + 1], d ? 2 : 1, d ? { toward: pts[k + 2] || pts[k - 1], hl: !!o.hl } : {});
      }
      return ids;
    },
    // ring: 6 = vertex 0 upper right (30°), then counter-clockwise; 5 = vertex 0 at the top (90°) + rot
    ring(n, c = [0, 0], dbl = [], o = {}) {
      const angs = n === 6 ? [30, 90, 150, 210, 270, 330] : [90, 18, -54, -126, -198].map(a => a + (o.rot || 0));
      const r = n === 6 ? 1 : 0.851;
      const ids = angs.map((a, k) => m.atom(at(c, a, r), ...((o.labels || {})[k] || [])));
      for (let k = 0; k < n; k++) {
        const d = dbl.includes(k);
        m.bond(ids[k], ids[(k + 1) % n], d ? 2 : 1, d ? { toward: c, hl: !!o.hl } : {});
      }
      ids.ang = angs;
      return ids;
    },
    arrow(from, to, bend = 0.5) { arrows.push({ from, to, bend }); },
  };
  fn(m);
  return arrows.length ? { name, atoms, bonds, arrows } : { name, atoms, bonds };
}
// bromide ion with all four lone pairs, charge drawn just outside them
const bromide = (m, p) => { m.atom(p, 'Br', { align: 'middle', lp: [0, 90, 180, 270] }); m.atom(at(p, 45, 0.62), '−', { align: 'middle' }); };

const S = {};   // structures, by name
// --- simple alkenes and their products
S.propene = build('propene', m => m.chain(zz(3), [0]));
S.bromo2propane = build('2-bromopropane', m => { const c = m.chain(zz(3)); m.sub(c[1], 90, 'Br'); });
S.bromo1propane = build('1-bromopropane', m => { const c = m.chain(zz(3)); m.sub(c[2], 30, 'Br'); });
S.propan2ol = build('propan-2-ol', m => { const c = m.chain(zz(3)); m.sub(c[1], 90, 'OH'); });
S.propan1ol = build('propan-1-ol', m => { const c = m.chain(zz(3)); m.sub(c[2], 30, 'OH'); });
S.but1ene = build('but-1-ene', m => m.chain(zz(4), [0]));
S.transBut2ene = build('trans-but-2-ene', m => m.chain(zz(4), [1]));
S.cisBut2ene = build('cis-but-2-ene', m => { const a = m.atom([0, 0]), b = m.atom([1, 0]); m.bond(a, b, 2, { toward: [0.5, 1] }); m.sub(a, 120); m.sub(b, 60); });
S.bromo2butane = build('2-bromobutane', m => { const c = m.chain(zz(4)); m.sub(c[1], 90, 'Br'); });
S.R2bromobutane = build('(R)-2-bromobutane', m => { const c = m.chain(zz(4)); m.sub(c[1], 90, 'Br', 'w'); });
S.S2bromobutane = build('(S)-2-bromobutane', m => { const c = m.chain(zz(4)); m.sub(c[1], 90, 'Br', 'h'); });
S.secBuCation = build('sec-butyl carbocation (2°)', m => { const c = m.chain(zz(4)); m.atom(at(m.p(c[1]), 90, 0.46), '⊕', { align: 'middle' }); });
S.pent1ene = build('pent-1-ene', m => m.chain(zz(5), [0]));
S.R2bromopentane = build('(R)-2-bromopentane', m => { const c = m.chain(zz(5)); m.sub(c[1], 90, 'Br', 'w'); });
S.S2bromopentane = build('(S)-2-bromopentane', m => { const c = m.chain(zz(5)); m.sub(c[1], 90, 'Br', 'h'); });
S.butan2ol = build('butan-2-ol', m => { const c = m.chain(zz(4)); m.sub(c[1], 90, 'OH'); });
S.butan2ylOTs = build('butan-2-yl tosylate', m => { const c = m.chain(zz(4)); m.sub(c[1], 90, 'OTs'); });
S.butan1ol = build('butan-1-ol', m => { const c = m.chain(zz(4)); m.sub(c[3], 330, 'OH'); });
// --- 2-methylpropene (isobutylene) family
const ib = (m, dbl = true) => { const c2 = m.atom([0, 0]), c1 = m.atom([1, 0]); m.bond(c2, c1, dbl ? 2 : 1, dbl ? { toward: [0.5, -1] } : {}); m.sub(c2, 150); m.sub(c2, 210); return [c2, c1]; };
S.isobutylene = build('2-methylpropene', m => ib(m));
const tBu = (m, c = [0, 0]) => { const k = m.atom(c); m.sub(k, 90); m.sub(k, 210); m.sub(k, 330); return k; };
S.tBuCation = build('tert-butyl carbocation (3°)', m => { tBu(m); m.atom([0.5, 0.38], '⊕', { align: 'middle' }); });
S.isobutylCation = build('isobutyl carbocation (1°)', m => { const c = m.chain(zz(3)); m.sub(c[1], 90); m.atom([2.15, 0], '⊕', { align: 'middle' }); });
S.tBuBr = build('2-bromo-2-methylpropane', m => { const c = m.atom([0, 0]); m.sub(c, 90); m.sub(c, 180); m.sub(c, 270); m.sub(c, 0, 'Br'); });
S.tBuOH = build('2-methylpropan-2-ol', m => { const c = m.atom([0, 0]); m.sub(c, 90); m.sub(c, 180); m.sub(c, 270); m.sub(c, 0, 'OH'); });
S.bromohydrinIB = build('1-bromo-2-methylpropan-2-ol', m => { const c = m.atom([0, 0]); m.sub(c, 90); m.sub(c, 180); m.sub(c, 270, 'OH'); const c1 = m.sub(c, 0); m.sub(c1, 60, 'Br'); });
// --- five-carbon chains (2-methylbutane skeleton)
S.MB2 = build('2-methylbut-2-ene', m => { const c = m.chain(zz(4), [1]); m.sub(c[1], 90); });
S.MB2cut = build('2-methylbut-2-ene', m => { const c = m.chain(zz(4), [1], { hl: true }); m.sub(c[1], 90); });
S.MB1 = build('3-methylbut-1-ene', m => { const c = m.chain(zz(4), [0]); m.sub(c[2], 270); });
S.MB1b = build('3-methylbut-1-ene', m => { const c = m.chain(zz(4), [2]); m.sub(c[1], 90); });
S.M2B1 = build('2-methylbut-1-ene', m => { const c = m.chain(zz(4), [0]); m.sub(c[1], 90); });
S.methylbutane = build('2-methylbutane', m => { const c = m.chain(zz(4)); m.sub(c[1], 90); });
S.cat3MB = build('3° carbocation', m => { const c = m.chain(zz(4)); m.sub(c[1], 90); m.atom(at(m.p(c[1]), 30, 0.48), '⊕', { align: 'middle' }); });
S.bromoMB_up = build('2-bromo-2-methylbutane', m => { const c = m.chain(zz(4)); m.sub(c[1], 120); m.sub(c[1], 60, 'Br'); });
S.MB2ol_up = build('2-methylbutan-2-ol', m => { const c = m.chain(zz(4)); m.sub(c[1], 120); m.sub(c[1], 60, 'OH'); });
S.MB2ol3 = build('3-methylbutan-2-ol', m => { const c = m.chain(zz(4)); m.sub(c[1], 90); m.sub(c[2], 270, 'OH'); });
S.bromo3MB = build('2-bromo-3-methylbutane', m => { const c = m.chain(zz(4)); m.sub(c[1], 90); m.sub(c[2], 270, 'Br'); });
// hydride shift: 3-methylbut-1-ene + HBr
S.cat2MBH = build('2° carbocation next to a 3° C–H', m => {
  const c = m.chain(zz(4)); m.atom(at(m.p(c[1]), 90, 0.46), '⊕', { align: 'middle' });
  m.sub(c[2], 240, 'H', 1, { hl: true }); m.sub(c[2], 300);
  m.arrow([1.43, -0.36], [0.93, 0.33], 0.55);
});
S.cat3MBdown = build('3° carbocation', m => { const c = m.chain(zz(4)); m.sub(c[2], 270); m.atom(at(m.p(c[2]), 90, 0.46), '⊕', { align: 'middle' }); });
S.bromoMB_down = build('2-bromo-2-methylbutane', m => { const c = m.chain(zz(4)); m.sub(c[2], 240, 'Br'); m.sub(c[2], 300); });
// methyl shift: 3,3-dimethylbut-1-ene
S.DMB1 = build('3,3-dimethylbut-1-ene', m => { const c = m.chain(zz(4), [0]); m.sub(c[2], 240); m.sub(c[2], 300); });
S.cat2DMB = build('2° carbocation next to a quaternary C', m => {
  const c = m.chain(zz(4)); m.atom(at(m.p(c[1]), 90, 0.46), '⊕', { align: 'middle' });
  m.sub(c[2], 240, '', 1, { hl: true }); m.sub(c[2], 300);
  m.arrow([1.43, -0.36], [0.93, 0.33], 0.55);
});
S.cat3DMB = build('3° carbocation', m => { const c = m.chain(zz(4)); m.sub(c[1], 90); m.sub(c[2], 270); m.atom(at(m.p(c[2]), 90, 0.46), '⊕', { align: 'middle' }); });
S.chloroDMB = build('2-chloro-2,3-dimethylbutane', m => { const c = m.chain(zz(4)); m.sub(c[1], 90); m.sub(c[2], 240, 'Cl'); m.sub(c[2], 300); });
S.DMB2ol23 = build('2,3-dimethylbutan-2-ol', m => { const c = m.chain(zz(4)); m.sub(c[1], 90); m.sub(c[2], 240, 'OH'); m.sub(c[2], 300); });
S.DMB2ol33 = build('3,3-dimethylbutan-2-ol', m => { const c = m.chain(zz(4)); m.sub(c[1], 90, 'OH'); m.sub(c[2], 240); m.sub(c[2], 300); });
// --- radicals (HBr, ROOR)
S.rad2 = build('2° radical', m => { const c = m.chain(zz(3)); m.sub(c[0], 150, 'Br'); m.atom(at(m.p(c[1]), 90, 0.42), '•', { align: 'middle' }); });
S.rad1 = build('1° radical', m => { const c = m.chain(zz(3)); m.sub(c[1], 90, 'Br'); m.atom(at(m.p(c[0]), 180, 0.38), '•', { align: 'middle' }); });
S.bromo1propaneL = build('1-bromopropane', m => { const c = m.chain(zz(3)); m.sub(c[0], 150, 'Br'); });
// --- cyclohexane family (vertex 0 = C1 upper right, vertex 5 = C2 lower right)
S.cyhexene = build('cyclohexene', m => m.ring(6, [0, 0], [5]));
S.cyhexane = build('cyclohexane', m => m.ring(6));
S.bromocyhex = build('bromocyclohexane', m => { const r = m.ring(6); m.sub(r[0], 30, 'Br'); });
S.cyhexanol = build('cyclohexanol', m => { const r = m.ring(6); m.sub(r[0], 30, 'OH'); });
const hex2 = (name, a, b) => build(name, m => { const r = m.ring(6); m.sub(r[0], 30, a[0], a[1]); m.sub(r[5], 330, b[0], b[1]); });
S.transDiBrA = hex2('trans-1,2-dibromocyclohexane', ['Br', 'h'], ['Br', 'w']);
S.transDiBrB = hex2('trans-1,2-dibromocyclohexane (enantiomer)', ['Br', 'w'], ['Br', 'h']);
S.cisDiolHex = hex2('cis-cyclohexane-1,2-diol', ['OH', 'w'], ['OH', 'w']);
S.transDiolA = hex2('trans-cyclohexane-1,2-diol', ['OH', 'h'], ['OH', 'w']);
S.transDiolB = hex2('trans-cyclohexane-1,2-diol (enantiomer)', ['OH', 'w'], ['OH', 'h']);
S.MCH = build('1-methylcyclohexene', m => { const r = m.ring(6, [0, 0], [5]); m.sub(r[0], 30); });
S.MCHcut = build('1-methylcyclohexene', m => { const r = m.ring(6, [0, 0], [5], { hl: true }); m.sub(r[0], 30); });
S.methylcyhex = build('methylcyclohexane', m => { const r = m.ring(6); m.sub(r[0], 30); });
const hexC1 = (name, x, xt, me, extra) => build(name, m => { const r = m.ring(6); m.sub(r[0], 0, '', me || 1); m.sub(r[0], 60, x, xt || 1); if (extra) extra(m, r); });
S.chloroMCH = hexC1('1-chloro-1-methylcyclohexane', 'Cl');
S.bromoMCH = hexC1('1-bromo-1-methylcyclohexane', 'Br');
S.MCHol = hexC1('1-methylcyclohexan-1-ol', 'OH');
S.bromo2MCH = build('1-bromo-2-methylcyclohexane', m => { const r = m.ring(6); m.sub(r[0], 30); m.sub(r[5], 330, 'Br'); });
S.t2MCHolA = hexC1('trans-2-methylcyclohexan-1-ol', 'H', 'w', 'h', (m, r) => m.sub(r[5], 330, 'OH', 'w'));
S.t2MCHolB = hexC1('trans-2-methylcyclohexan-1-ol (enantiomer)', 'H', 'h', 'w', (m, r) => m.sub(r[5], 330, 'OH', 'h'));
S.MCHbrohA = hexC1('trans-2-bromo-1-methylcyclohexan-1-ol', 'OH', 'w', 1, (m, r) => m.sub(r[5], 330, 'Br', 'h'));
S.MCHbrohB = hexC1('trans-2-bromo-1-methylcyclohexan-1-ol (enantiomer)', 'OH', 'h', 1, (m, r) => m.sub(r[5], 330, 'Br', 'w'));
S.MCHdiolA = hexC1('cis-1-methylcyclohexane-1,2-diol', 'OH', 'w', 1, (m, r) => m.sub(r[5], 330, 'OH', 'w'));
S.MCHdiolB = hexC1('cis-1-methylcyclohexane-1,2-diol (enantiomer)', 'OH', 'h', 1, (m, r) => m.sub(r[5], 330, 'OH', 'h'));
S.DMCH = build('1,2-dimethylcyclohexene', m => { const r = m.ring(6, [0, 0], [5]); m.sub(r[0], 30); m.sub(r[5], 330); });
S.cisDMCH = build('cis-1,2-dimethylcyclohexane', m => {
  const r = m.ring(6); m.sub(r[0], 0, '', 'h'); m.sub(r[0], 60, 'H', 'w'); m.sub(r[5], 0, '', 'h'); m.sub(r[5], 300, 'H', 'w');
});
S.cyhexOxide = build('cyclohexene oxide (an epoxide)', m => { const r = m.ring(6); const o = m.atom([1.75, 0], 'O', { align: 'middle' }); m.bond(r[0], o, 'w'); m.bond(r[5], o, 'w'); });
S.cyhexanone = build('cyclohexanone', m => { const r = m.ring(6); m.sub(r[1], 90, 'O', 2); });
S.methyleneCyhex = build('methylenecyclohexane', m => { const r = m.ring(6); m.sub(r[1], 90, '', 2); });
// --- cyclopentane family (pentagon with C1 on top, as in the reaction cards)
S.MCP = build('1-methylcyclopentene', m => { const r = m.ring(5, [0, 0], [0]); m.sub(r[0], 90); });
const pentAB = (name, me, h, x, xl) => build(name, m => { const r = m.ring(5); m.sub(r[0], 125, '', me); m.sub(r[0], 55, 'H', h); m.sub(r[1], 18, xl, x); });
S.MCPborane = pentAB('alkylborane (H and B added syn)', 'h', 'w', 'w', 'BR2');
S.t2MCPolA = pentAB('trans-2-methylcyclopentan-1-ol', 'h', 'w', 'w', 'OH');
S.t2MCPolB = pentAB('trans-2-methylcyclopentan-1-ol (enantiomer)', 'w', 'h', 'h', 'OH');
S.MCPbrohA = build('trans-2-bromo-1-methylcyclopentan-1-ol', m => { const r = m.ring(5); m.sub(r[0], 122); m.sub(r[0], 58, 'OH', 'w'); m.sub(r[1], 18, 'Br', 'h'); });
S.MCPbrohB = build('trans-2-bromo-1-methylcyclopentan-1-ol (enantiomer)', m => { const r = m.ring(5); m.sub(r[0], 122); m.sub(r[0], 58, 'OH', 'h'); m.sub(r[1], 18, 'Br', 'w'); });
// pentagon turned so C1–C2 is the vertical bond on the right
const R5 = { rot: -54 };
S.cypentene = build('cyclopentene', m => m.ring(5, [0, 0], [0], R5));
S.osmate = build('cyclic osmate ester', m => {
  const r = m.ring(5, [0, 0], [], R5);
  const oa = m.atom([1.6, 0.95], 'O', { align: 'middle' }), ob = m.atom([1.6, -0.95], 'O', { align: 'middle' }), os = m.atom([2.5, 0], 'Os', { align: 'middle' });
  m.bond(r[0], oa, 'w'); m.bond(r[1], ob, 'w'); m.bond(oa, os); m.bond(ob, os);
  m.sub(os, 45, 'O', 2, { align: 'middle', len: 1.2 }); m.sub(os, -45, 'O', 2, { align: 'middle', len: 1.2 });
});
const pent2 = (name, a, b) => build(name, m => { const r = m.ring(5, [0, 0], [], R5); m.sub(r[0], 36, a[0], a[1]); m.sub(r[1], -36, b[0], b[1]); });
S.cisDiolPent = pent2('cis-cyclopentane-1,2-diol', ['OH', 'w'], ['OH', 'w']);
S.transDiolPent = pent2('trans-cyclopentane-1,2-diol', ['OH', 'w'], ['OH', 'h']);
S.DMCP = build('1,2-dimethylcyclopentene', m => { const r = m.ring(5, [0, 0], [0], R5); m.sub(r[0], 36); m.sub(r[1], -36); });
S.DMCPdiol = build('cis-1,2-dimethylcyclopentane-1,2-diol', m => {
  const r = m.ring(5, [0, 0], [], R5); m.sub(r[0], 70, 'OH', 'w'); m.sub(r[0], 6); m.sub(r[1], -70, 'OH', 'w'); m.sub(r[1], -6);
});
// --- carbonyls (ozonolysis)
S.acetone = build('acetone', m => { const c = m.atom([0, 0]); m.sub(c, 90, 'O', 2, { hl: true }); m.sub(c, 210); m.sub(c, 330); });
S.acetaldehyde = build('acetaldehyde', m => { const c = m.atom([0, 0]); m.sub(c, 90, 'O', 2, { hl: true }); m.sub(c, 210); m.sub(c, 330, 'H'); });
S.oxoheptanal = build('6-oxoheptanal', m => { const c = m.chain(zz(7)); m.sub(c[1], 90, 'O', 2, { hl: true }); m.sub(c[6], 30, 'O', 2, { hl: true }); m.sub(c[6], 270, 'H'); });

// --- mechanism drawings (pink curved arrows: tail on a bond or lone pair, head where the electrons go)
S.piAttack = build('an alkene π bond attacking an electrophile', m => {
  const a = m.atom([0, 0], 'C', { align: 'middle' }), b = m.atom([1.3, 0], 'C', { align: 'middle' });
  m.bond(a, b, 2); m.sub(a, 150, 'H'); m.sub(a, 210, 'H'); m.sub(b, 30, 'H'); m.sub(b, 330, 'H');
  m.atom([0.65, 1.75], 'E+', { align: 'middle' });
  m.arrow([0.65, 0.12], [0.65, 1.38], 0.35);
});
S.piAttacked = build('carbocation after the attack', m => {
  const a = m.atom([0, 0], 'C', { align: 'middle' }), b = m.atom([1.3, 0], 'C', { align: 'middle' });
  m.bond(a, b); m.sub(a, 150, 'H'); m.sub(a, 210, 'H'); m.sub(b, 90, 'E', 1, { hl: true }); m.atom([0, 0.62], '⊕', { align: 'middle' }); m.sub(b, 30, 'H'); m.sub(b, 330, 'H');
});
// HBr step 1: π bond takes H⁺, H–Br electrons go to Br
S.ibHBr = build('2-methylpropene + HBr', m => {
  ib(m);
  const h = m.atom([1.55, 1.1], 'H', { align: 'middle' }), br = m.atom([2.65, 1.1], 'Br', { align: 'start' });
  m.bond(h, br);
  m.arrow([0.5, 0.14], [1.42, 0.86], -0.4);
  m.arrow([2.1, 1.2], [2.62, 1.5], -0.7);
});
S.tBuCatBr = build('tert-butyl carbocation + bromide', m => {
  tBu(m); m.atom([0.5, 0.38], '⊕', { align: 'middle' });
  bromide(m, [2.3, 0.3]);
  m.arrow([1.82, 0.32], [0.22, 0.08], 0.32);
});
// acid hydration: three steps
S.ibH3O = build('2-methylpropene + H₃O⁺', m => {
  ib(m);
  const h = m.atom([1.55, 1.1], 'H', { align: 'middle' }), o = m.atom([2.65, 1.1], 'OH2+', { align: 'start' });
  m.bond(h, o);
  m.arrow([0.5, 0.14], [1.42, 0.86], -0.4);
  m.arrow([2.1, 1.2], [2.62, 1.5], -0.7);
});
S.tBuCatH2O = build('tert-butyl carbocation + water', m => {
  tBu(m); m.atom([0.5, 0.38], '⊕', { align: 'middle' });
  m.atom([2.2, 0.3], 'OH2', { align: 'start', lp: [180, 90] });
  m.arrow([1.74, 0.32], [0.22, 0.08], 0.32);
});
S.oxonium = build('oxonium ion + water', m => {
  const c = m.atom([0, 0]); m.sub(c, 90); m.sub(c, 180); m.sub(c, 270);
  const o = m.atom([1, 0], 'O', { align: 'middle', lp: [] });
  m.bond(c, o); m.atom([1, -0.55], '⊕', { align: 'middle' });
  m.sub(o, 45, 'H', 1, { len: 1.4 }); m.sub(o, -45, 'H', 1, { len: 1.4 });
  m.atom([3.3, 1.0], 'OH2', { align: 'start', lp: [180, 90] });
  m.arrow([2.84, 1.02], [2.2, 1.0], -0.5);
  m.arrow([1.62, 0.5], [1.25, 0.2], -1.1);
});
// oxymercuration: water opens the mercurinium ion at the more substituted carbon
S.mercurinium = build('mercurinium ion + water', m => {
  const c2 = m.atom([0, 0]), c1 = m.atom([1, 0]); m.bond(c2, c1); m.sub(c2, 150);
  const hg = m.atom([0.5, 1.5], 'Hg', { align: 'middle' }); m.bond(c2, hg); m.bond(c1, hg); m.atom([0.2, 2.05], '⊕', { align: 'middle' });
  m.sub(hg, 15, 'OAc', 1, { len: 1.15 }); m.atom([2.9, 1.8]);
  m.atom([0, -1.4], 'OH2', { align: 'start', lp: [90] });
  m.arrow([0, -0.98], [0, -0.22], 0.25);
  m.arrow([0.2, 0.6], [0.4, 1.18], -0.9);
});
S.organoHg = build('organomercury alcohol', m => { const c = m.chain(zz(3)); m.sub(c[1], 90, 'OH'); m.sub(c[2], 30, 'HgOAc'); m.atom([3.9, 0.5]); });
// hydroboration: one concerted step
S.propeneBH3 = build('propene + BH₃', m => {
  const c2 = m.atom([0, 0]), c1 = m.atom([1, 0]); m.bond(c2, c1, 2, { toward: [0.5, -1] }); m.sub(c2, 210);
  const h = m.atom([-0.2, 1.5], 'H', { align: 'middle' }), b = m.atom([1.15, 1.5], 'BH2', { align: 'start' });
  m.bond(h, b); m.atom([2.1, 1.5]);
  m.arrow([0.6, 0.14], [1.12, 1.2], 0.35);
  m.arrow([0.45, 1.6], [-0.02, 0.3], 0.45);
});
S.propylBorane = build('propylborane', m => { const c = m.chain(zz(3)); m.sub(c[2], 30, 'BH2'); });
S.BH3 = build('borane, BH₃', m => { const b = m.atom([0, 0], 'B', { align: 'middle' }); m.sub(b, 90, 'H'); m.sub(b, 210, 'H'); m.sub(b, 330, 'H'); });
S.BH3THF = build('BH₃·THF complex', m => {
  const r = m.ring(5, [0, 0], [], { rot: -90, labels: { 0: ['O', { align: 'middle' }] } });
  m.atom([0.95, 0.55], '⊕', { align: 'middle' });
  const b = m.atom([2.05, 0], 'B', { align: 'middle' }); m.bond(r[0], b); m.sub(b, 90, 'H'); m.sub(b, 0, 'H'); m.sub(b, 270, 'H'); m.atom([2.5, -0.5], '⊖', { align: 'middle' });
});
// bromination: π bond attacks Br₂, a Br lone pair closes the ring, Br⁻ leaves
S.cyhexBr2 = build('cyclohexene + Br₂', m => {
  m.ring(6, [0, 0], [5]);
  const a = m.atom([2.35, 0], 'Br', { align: 'middle', lp: [270] }), b = m.atom([3.65, 0], 'Br', { align: 'middle' });
  m.bond(a, b);
  m.arrow([0.98, 0.14], [2.08, 0.24], -0.5);
  m.arrow([2.25, -0.46], [1.0, -0.52], -0.4);
  m.arrow([3.0, 0.1], [3.6, 0.36], -0.7);
});
S.bromonium = build('bromonium ion + bromide', m => {
  const r = m.ring(6); const br = m.atom([1.85, 0], 'Br+', { align: 'start' }); m.bond(r[0], br, 'w'); m.bond(r[5], br, 'w');
  bromide(m, [1.25, 2.05]);
  m.arrow([1.23, 1.6], [0.93, 0.72], 0.2);
  m.arrow([1.38, 0.32], [1.78, 0.32], -0.9);
});
// halohydrin: water opens the bromonium at the more substituted (3°) carbon
S.bromoniumIB = build('bromonium ion + water', m => {
  const [c2, c1] = ib(m, false);
  const br = m.atom([0.5, 1.5], 'Br+', { align: 'middle' }); m.bond(c2, br); m.bond(c1, br);
  m.atom([0.02, -1.55], 'OH2', { align: 'start', lp: [90] });
  m.arrow([0.02, -1.12], [0, -0.22], 0.25);
  m.arrow([0.2, 0.6], [0.4, 1.18], -0.9);
});
// anti dihydroxylation: water opens the protonated epoxide from the back face
S.epoxideH = build('protonated epoxide + water', m => {
  const r = m.ring(6); const o = m.atom([1.85, 0], 'OH+', { align: 'start' }); m.bond(r[0], o, 'w'); m.bond(r[5], o, 'w');
  m.atom([1.25, 2.05], 'OH2', { align: 'start', lp: [270] });
  m.arrow([1.25, 1.62], [0.93, 0.72], 0.2);
  m.arrow([1.38, 0.32], [1.78, 0.32], -0.9);
});

// --- naming examples
S.methylpentene = build('3-methylpent-1-ene', m => { const c = m.chain(zz(5), [0]); m.sub(c[2], 270); });
S.Epentene = build('(E)-pent-2-ene', m => m.chain(zz(5), [1]));
S.Zpentene = build('(Z)-pent-2-ene', m => { const a = m.atom([0, 0]), b = m.atom([1, 0]); m.bond(a, b, 2, { toward: [0.5, 1] }); m.sub(a, 120); const c4 = m.sub(b, 60); m.sub(c4, 0); });
S.slideAlkene = build('(E)-5,5,6-trimethylhept-2-ene', m => { const c = m.chain(zz(7), [1]); m.sub(c[4], 240); m.sub(c[4], 300); m.sub(c[5], 90); });
S.Z3MP2 = build('an alkene to name', m => { const a = m.atom([0, 0]), b = m.atom([1, 0]); m.bond(a, b, 2, { toward: [0.5, 1] }); m.sub(a, 120); const c4 = m.sub(b, 60); m.sub(c4, 0); m.sub(b, 300); });
// --- 2,3-dibromobutane stereoisomers (zig-zag: Br up on C2, down on C3)
const dibromo = (name, t2, t3) => build(name, m => { const c = m.chain(zz(4)); m.sub(c[1], 90, 'Br', t2); m.sub(c[2], 270, 'Br', t3); });
S.dibromoRR = dibromo('(2R,3R)-2,3-dibromobutane', 'w', 'w');
S.dibromoSS = dibromo('(2S,3S)-2,3-dibromobutane', 'h', 'h');
S.dibromoMeso = dibromo('meso-2,3-dibromobutane', 'w', 'h');

// shorthand for scheme items
const mol = (s, label, scale) => ({ mol: s, label, scale });
const arr = (top, bottom) => ({ arrow: { top, bottom } });
const plus = { plus: true };
const txt = (text, sub) => ({ text, sub });

export default {
  ch: 8, title: 'Addition reactions of alkenes',
  steps: [
    {
      sec: '8.1', title: 'Addition: elimination in reverse',
      figs: [
        { kind: 'scheme', title: 'The same reaction, run both ways',
          rows: [
            [mol(S.cyhexene, 'cyclohexene'), plus, txt('H–Br'), arr('addition', 'π bond → 2 σ bonds'), mol(S.bromocyhex, 'bromocyclohexane')],
            [mol(S.bromocyhex, 'bromocyclohexane'), arr('elimination (Ch 7)', 'strong base, heat'), mol(S.cyhexene, 'cyclohexene'), plus, txt('H–Br', 'lost (as base–H + Br⁻)')],
          ],
          caption: 'Addition puts H on one alkene carbon and Br on the other. Elimination removes that same H and Br and rebuilds the C=C.' },
        { kind: 'scheme', title: 'The π bond is the nucleophile',
          rows: [[mol(S.piAttack, 'alkene + electrophile (E⁺)', 40), arr('π electrons', 'form a C–E bond'), mol(S.piAttacked, 'carbocation')]],
          caption: 'The arrow starts on the π bond (the electron pair) and points at E⁺ (where the electrons go). The carbon that did not bond to E is left with only three bonds: a carbocation.' },
      ],
      say: [
        'Chapter 7 made alkenes by elimination. Chapter 8 runs it the other way: addition. Two groups add across the C=C, one on each carbon, and the π bond (the weaker second bond of a double bond) is turned into two new σ bonds (single bonds).',
        'Key idea: the π bond is an electron-pair donor. Its electrons sit above and below the plane of the molecule, exposed and easy to reach, so the alkene acts as a nucleophile (Lewis base) and attacks electrophiles (electron-poor species) like H⁺, Br₂, BH₃ or a mercury cation.',
      ],
      takeaway: 'Addition = one π bond → two σ bonds. The alkene is the nucleophile.',
      check: {
        q: 'In alkene addition reactions, the C=C π bond acts as…',
        a: 'A nucleophile (electron-pair donor)',
        o: ['An electrophile (electron-pair acceptor)', 'A leaving group', 'A spectator that doesn’t react'],
        why: 'The π electrons are loosely held and exposed, so they attack electron-poor reagents like H⁺ or Br₂.',
      },
    },
    {
      sec: '8.1–8.2', title: 'Five kinds of addition, and where alkenes come from',
      figs: [
        { kind: 'table', title: 'The five additions (cyclohexene as the example)',
          head: ['Addition', 'Typical reagent', 'What adds'],
          rows: [
            ['Hydrohalogenation', 'HCl, HBr or HI', 'H and X'],
            ['Hydration', 'H₂O with H₂SO₄ (H₃O⁺)', 'H and OH'],
            ['Hydrogenation', 'H₂ with Pt, Pd or Ni', 'H and H'],
            ['Halogenation', 'Br₂ or Cl₂', 'X and X'],
            ['Dihydroxylation', 'OsO₄ (or RCO₃H, then H₃O⁺)', 'OH and OH'],
          ] },
        { kind: 'gallery', title: 'Cyclohexene after each addition',
          items: [
            { mol: S.bromocyhex, label: 'H, Br', note: 'HBr' },
            { mol: S.cyhexanol, label: 'H, OH', note: 'H₂O, H₂SO₄' },
            { mol: S.cyhexane, label: 'H, H', note: 'H₂, Pt' },
            { mol: S.transDiBrA, label: 'Br, Br', note: 'Br₂ (trans)' },
            { mol: S.cisDiolHex, label: 'OH, OH', note: 'OsO₄ (cis)' },
          ],
          caption: 'In every case the C=C becomes a C–C single bond and each of its two carbons picks up one new group. Wedges and hashes show which face each group is on; that stereochemistry comes later in the chapter.' },
        { kind: 'example', q: 'Name the type of addition: (a) propene → propane, (b) propene → 2-chloropropane, (c) propene → propane-1,2-diol.',
          hint: 'Compare the product to the alkene and list the two new groups.',
          steps: ['(a) Two H’s were added: hydrogenation (H₂, Pt).', '(b) H and Cl were added: hydrohalogenation (HCl).', '(c) Two OH groups were added: dihydroxylation.'],
          answer: 'Hydrogenation, hydrohalogenation, dihydroxylation.' },
      ],
      say: [
        'Additions are named by what adds: hydrohalogenation (H and X, from HCl, HBr or HI), hydration (H and OH), hydrogenation (H and H), halogenation (X and X, like Br₂) and dihydroxylation (OH and OH). Those five families cover the chapter.',
        'Alkenes are everywhere (8.2): in ring-shaped natural products, in insect pheromones (chemical signals), and in industry. Every year over 200 billion pounds of ethylene and 70 billion pounds of propylene are made by cracking petroleum (breaking big hydrocarbons into small ones). They are precursors (starting materials) for plastics and much more.',
      ],
      takeaway: 'Five additions: H/X, H/OH, H/H, X/X, OH/OH.',
      check: {
        q: 'Which addition puts an OH on both carbons of the C=C?',
        a: 'Dihydroxylation',
        o: ['Hydration', 'Hydrogenation', 'Hydrohalogenation'],
        why: 'Dihydroxylation adds two OH groups. Hydration adds only one OH (plus an H).',
      },
    },
    {
      sec: '8.3', title: 'Naming alkenes',
      figs: [
        { kind: 'gallery', title: 'Alkene names, drawn',
          items: [
            { mol: S.methylpentene, label: '3-methylpent-1-ene', note: 'C=C at C1 beats the methyl' },
            { mol: S.Epentene, label: '(E)-pent-2-ene', note: 'trans-2-pentene' },
            { mol: S.Zpentene, label: '(Z)-pent-2-ene', note: 'cis-2-pentene' },
            { mol: S.MCH, label: '1-methylcyclohexene', note: 'ring C=C is C1–C2' },
            { mol: S.slideAlkene, label: '(E)-5,5,6-trimethylhept-2-ene', note: 'slide example', scale: 26 },
          ],
          caption: 'Z (zusammen, together) = the higher-priority group on each alkene carbon on the same side; E (entgegen, opposite) = opposite sides. When each carbon has one H, Z matches cis and E matches trans.' },
        { kind: 'example', q: 'Name this alkene, including E or Z.',
          rows: [[mol(S.Z3MP2)]],
          hint: 'Find the longest chain that contains the C=C, then rank the two groups on each alkene carbon.',
          steps: [
            'Longest chain through the C=C: 5 carbons, so the parent is pent-…-ene.',
            'Number from the end nearer the C=C: it starts at C2 (pent-2-ene), and the methyl lands on C3.',
            'Left alkene carbon (C2): CH₃ beats H. Right alkene carbon (C3): CH₂CH₃ (the chain) beats CH₃.',
            'Both higher-priority groups (C1 and the ethyl) point up, on the same side: Z.',
            'cis/trans doesn’t work well here (C3 has no H), which is exactly why E/Z exists.',
          ],
          answer: '(Z)-3-methylpent-2-ene' },
      ],
      say: [
        'Same steps as alkanes with small tweaks. 1) The parent chain must include the C=C, and its name ends in -ene instead of -ane. 2) Name the substituents. 3) Number so the C=C gets the lowest number possible (it beats the substituents). 4) List substituents alphabetically, ignoring prefixes like di-, tri-, sec- and tert- (but not iso).',
        'The double bond gets one number: the carbon where it starts. CH₃CH=CHCH₂CH₃ is pent-2-ene (also written 2-pentene): the number goes either before the parent name or just before -ene.',
        'If the alkene is E or Z (the two possible arrangements around a C=C, decided by priorities), put that in parentheses at the front. Slide example: (E)-5,5,6-trimethylhept-2-ene.',
      ],
      takeaway: 'The chain must contain the C=C, which gets the lowest number. Add (E) or (Z) up front when needed.',
      check: {
        q: 'Name CH₂=CHCH(CH₃)CH₂CH₃.',
        a: '3-Methylpent-1-ene',
        o: ['3-Methylpent-4-ene', '2-Ethylbut-3-ene', '3-Methylpentane'],
        why: 'The 5-carbon chain contains the C=C. Number from the end nearest it, so the double bond starts at C1 and the methyl is on C3.',
      },
    },
    {
      sec: '8.4', title: 'Addition vs elimination: temperature decides',
      figs: [
        { kind: 'table', title: 'ΔG = ΔH − TΔS for an addition',
          head: ['Temperature', 'ΔH', '−TΔS', 'ΔG', 'Wins'],
          rows: [
            ['Low', '− (σ bonds stronger than π)', '+, but small', '−', 'Addition'],
            ['High', '− (unchanged)', '+, and large', '+', 'Elimination'],
          ],
          caption: 'For addition, ΔS is negative (two molecules → one), so −TΔS is positive and grows with T. Elimination is the reverse reaction, so all its signs flip.' },
        { kind: 'scheme', rows: [[mol(S.cyhexene, 'alkene'), plus, txt('HBr'), arr('low T: addition', 'high T: elimination'), mol(S.bromocyhex, 'alkyl halide')]],
          caption: 'One equilibrium. Temperature decides which side is favored.' },
        { kind: 'example', q: 'For an addition, ΔH = −19 kcal/mol (the slide’s value). Assume ΔS = −0.030 kcal/(mol·K), a typical value for two molecules joining. Is addition favored at 25 °C (298 K)? At 600 °C (873 K)?',
          hint: 'Plug into ΔG = ΔH − TΔS. Watch the sign: −T × (negative ΔS) is positive.',
          steps: [
            'At 298 K: −TΔS = −(298)(−0.030) = +8.9 kcal/mol, so ΔG = −19 + 8.9 = −10.1 kcal/mol. Negative: addition is favored.',
            'At 873 K: −TΔS = −(873)(−0.030) = +26.2 kcal/mol, so ΔG = −19 + 26.2 = +7.2 kcal/mol. Positive: the reverse reaction, elimination, is favored.',
            'Crossover where ΔG = 0: T = ΔH/ΔS = (−19)/(−0.030) ≈ 630 K (about 360 °C).',
          ],
          answer: 'Addition at 25 °C (ΔG ≈ −10 kcal/mol); elimination at 600 °C (ΔG ≈ +7 kcal/mol).' },
      ],
      say: [
        'Addition and elimination are the same reaction run in opposite directions (an equilibrium). Which side wins depends on ΔG = ΔH − TΔS (free energy = enthalpy − temperature × entropy; a negative ΔG means that direction is favored).',
        'Enthalpy (ΔH, the heat from making and breaking bonds) favors addition: σ bonds are stronger than π bonds. In the slide’s example, ΔH = bonds broken − bonds formed = 166 − 185 = −19 kcal/mol. Entropy (ΔS, disorder) favors elimination: addition squeezes two molecules into one, so ΔS is negative.',
        'Temperature sets the balance. At low temperature the −TΔS term is small, enthalpy dominates, and addition wins. At high temperature entropy dominates and elimination wins. That is why additions are run at lower temperatures and eliminations with heat.',
      ],
      takeaway: 'Low T → addition (enthalpy wins). High T → elimination (entropy wins).',
      check: {
        q: 'Why does high temperature favor elimination over addition?',
        a: 'The −TΔS term grows, and elimination increases entropy',
        o: ['Elimination is more exothermic', 'σ bonds become weaker than π bonds when hot', 'Heat makes the π bond a better nucleophile'],
        why: 'Elimination makes two molecules from one (ΔS > 0). Multiplying by a bigger T makes that entropy term outweigh addition’s favorable ΔH.',
      },
    },
    {
      sec: '8.5', title: 'HX addition: Markovnikov’s rule',
      figs: [
        { kind: 'scheme', title: 'Propene + HBr: two possible regioisomers',
          rows: [[mol(S.propene, 'propene'), arr('HBr'), mol(S.bromo2propane, '2-bromopropane (major)'), txt('≫', 'much more than'), mol(S.bromo1propane, '1-bromopropane (minor)')]],
          caption: 'H adds to the CH₂ end (the carbon that already has more H’s), so Br ends up on C2, the more substituted carbon.' },
        { kind: 'example', q: 'Predict the major product of 1-methylcyclohexene + HCl.',
          rows: [[mol(S.MCH, '1-methylcyclohexene'), arr('HCl'), txt('?')]],
          hint: 'Which alkene carbon has more H’s? That one gets the H.',
          steps: [
            'The two alkene carbons: C1 (holds the CH₃, no H) and C2 (one H).',
            'H goes to C2, the carbon with more H’s. Cl goes to C1, the more substituted carbon (3° after addition).',
            'C1 now holds CH₃, Cl and two ring paths that are identical (around the ring either way), so it is not a stereocenter: one product, no enantiomers.',
          ],
          answerRows: [[mol(S.MCH), arr('HCl'), mol(S.chloroMCH, '1-chloro-1-methylcyclohexane')]],
          answer: '1-Chloro-1-methylcyclohexane (Cl on the ring carbon that holds the methyl).' },
      ],
      rx: 'hx',
      say: [
        'Hydrohalogenation adds H–X (HCl, HBr or HI) across the C=C. If the alkene is unsymmetrical, two regioisomers (same formula, X on different carbons) are possible, depending on which carbon gets the H and which gets the X.',
        'In 1869 Markovnikov noticed that H adds to the carbon that already has more H’s, so the halogen ends up on the more substituted carbon. A reaction that favors one regioisomer is regioselective; this one shows Markovnikov regioselectivity. Example: propene + HBr → 2-bromopropane, not 1-bromopropane.',
      ],
      takeaway: 'HX: H on the carbon with more H’s, X on the more substituted carbon (Markovnikov).',
      check: {
        q: '2-Methylpropene + HBr (no peroxides) gives mainly…',
        a: '2-Bromo-2-methylpropane',
        o: ['1-Bromo-2-methylpropane', '2-Methylpropan-2-ol', '1,2-Dibromo-2-methylpropane'],
        why: 'H goes to the CH₂ end, which leaves a 3° carbocation, and Br⁻ adds to that 3° carbon.',
      },
    },
    {
      sec: '8.5', title: 'Why Markovnikov? The carbocation',
      figs: [
        { kind: 'scheme', title: 'Mechanism: 2-methylpropene + HBr',
          rows: [
            [mol(S.ibHBr, '2-methylpropene + H–Br', 40), arr('step 1 (slow)', 'π bond takes H⁺'), mol(S.tBuCatBr, '3° carbocation + Br⁻', 40)],
            [arr('step 2 (fast)', 'Br⁻ attacks C⁺'), mol(S.tBuBr, '2-bromo-2-methylpropane')],
          ],
          caption: 'Step 1: the π electrons grab the H, and the H–Br bond’s electrons leave with Br as Br⁻. H went to the CH₂ end, so + sits on the carbon with three alkyl groups. Step 2: a Br⁻ lone pair forms the C–Br bond.' },
        { kind: 'gallery', title: 'The two cations step 1 could make',
          items: [
            { mol: S.tBuCation, label: '3° (forms)', note: 'H added to the CH₂ end; + is stabilized by 3 alkyl groups' },
            { mol: S.isobutylCation, label: '1° (doesn’t form)', note: 'H added to the inner carbon; + on a CH₂ with one alkyl group' },
          ],
          caption: 'Stability 3° > 2° > 1° > methyl. The path to the more stable cation has the lower transition state, so it is much faster.' },
        { kind: 'example', q: '2-Methylbut-2-ene + HBr. Which carbocation forms in step 1, and what is the product?',
          rows: [[mol(S.MB2, '2-methylbut-2-ene'), arr('HBr'), txt('?')]],
          hint: 'Try putting the H on each alkene carbon and compare the cations.',
          steps: [
            'H on C3 (the CH) leaves + on C2, which carries two CH₃’s and the ethyl side: a 3° cation.',
            'H on C2 instead would leave + on C3: only 2°. So the 3° cation forms.',
            'Br⁻ attacks the 3° carbon. C2 now has two CH₃’s, so it is not a stereocenter.',
          ],
          answerRows: [[mol(S.cat3MB, '3° carbocation'), arr('Br⁻'), mol(S.bromoMB_up, '2-bromo-2-methylbutane')]],
          answer: '2-Bromo-2-methylbutane, via the 3° carbocation.' },
      ],
      mech: 'hbr',
      say: [
        'The mechanism has two steps. 1) The π bond grabs H⁺ from H–X, making a carbocation (a carbon with three bonds and a + charge). 2) X⁻ attacks the carbocation. Step 1 has the higher Ea (activation energy), so it is the rate-determining step.',
        'Markovnikov comes from carbocation stability (3° > 2° > 1° > methyl). Putting H on the less substituted carbon leaves the + on the more substituted carbon, the more stable cation. Its transition state is lower in energy too, so that path is faster and wins. In the 3D viewer, H goes to C2 of 1-methylcyclopentene so the + lands on the 3° C1.',
      ],
      takeaway: 'Markovnikov happens because the more stable carbocation forms faster.',
      check: {
        q: 'In HBr addition, which step is rate-determining?',
        a: 'Protonating the π bond to form the carbocation',
        o: ['Br⁻ attacking the carbocation', 'Loss of Br⁻ from the product', 'Forming a bromonium ion'],
        why: 'Making the carbocation is the highest hill on the energy diagram. Bromide catching it afterward is fast.',
      },
    },
    {
      sec: '8.5', title: 'HX stereochemistry: racemic',
      figs: [
        { kind: 'scheme', title: 'But-1-ene + HBr: a new stereocenter',
          rows: [
            [mol(S.but1ene, 'but-1-ene'), arr('HBr', 'H⁺ adds to C1'), mol(S.secBuCation, 'flat 2° carbocation'), arr('Br⁻', 'top or bottom face')],
            [mol(S.R2bromobutane, '(R)-2-bromobutane, 50%'), plus, mol(S.S2bromobutane, '(S)-2-bromobutane, 50%')],
          ],
          caption: 'The carbocation is sp² and flat, with its empty p orbital above and below the plane. Br⁻ attacks either lobe equally, so the wedge (R) and hash (S) products form 50:50: a racemic mixture, optically inactive.' },
        { kind: 'example', q: 'Which of these gives a racemic mixture? (a) propene + HBr, (b) pent-1-ene + HBr, (c) 2-methylpropene + HBr.',
          hint: 'Draw each Markovnikov product and check whether the C–Br carbon has four different groups.',
          steps: [
            '(a) 2-Bromopropane: the C–Br carbon has two CH₃’s. Not a stereocenter, one product.',
            '(b) 2-Bromopentane: the C–Br carbon has H, Br, CH₃ and CH₂CH₂CH₃. A new stereocenter, made from a flat cation, so (R) and (S) form 50:50.',
            '(c) 2-Bromo-2-methylpropane: three CH₃’s. Not a stereocenter.',
          ],
          answerRows: [[mol(S.R2bromopentane, '(R)-2-bromopentane'), plus, mol(S.S2bromopentane, '(S)-2-bromopentane')]],
          answer: 'Only (b), pent-1-ene, gives a racemic product.' },
      ],
      say: [
        'If the carbon that gets X becomes a new chiral center, you actually get two Markovnikov products: a pair of enantiomers (non-superimposable mirror images) in equal amounts, which is a racemic mixture.',
        'Reason: the carbocation is flat, with its empty p orbital pointing up and down. X⁻ attacks either face with equal chance. General rule from the notes: achiral starting materials with achiral reagents can’t give an optically active product.',
      ],
      takeaway: 'A new stereocenter made from a carbocation → racemic mixture.',
      check: {
        q: 'But-1-ene + HBr gives 2-bromobutane as…',
        a: 'A racemic mixture of (R) and (S)',
        o: ['Only (R)', 'Only (S)', 'A meso compound'],
        why: 'Br⁻ adds to the flat 2° carbocation from either face equally, giving both enantiomers 50:50.',
      },
    },
    {
      sec: '8.5', title: 'HX with rearrangements',
      figs: [
        { kind: 'scheme', title: 'Hydride shift: 3-methylbut-1-ene + HBr',
          rows: [
            [mol(S.MB1, '3-methylbut-1-ene'), arr('HBr', 'H⁺ adds to C1'), mol(S.cat2MBH, '2° cation', 40), arr('1,2-H shift', 'H moves with its 2 e⁻')],
            [mol(S.cat3MBdown, '3° cation'), arr('Br⁻'), mol(S.bromoMB_down, '2-bromo-2-methylbutane (major)')],
          ],
          caption: 'The arrow starts on the C–H bond: that H moves to the neighboring C⁺ with both bonding electrons (as a hydride, H⁻). The + moves to the carbon that lost the H, which is 3°. Without the shift you would get 2-bromo-3-methylbutane (minor).' },
        { kind: 'example', q: 'Predict the major product of 3,3-dimethylbut-1-ene + HCl.',
          rows: [[mol(S.DMB1, '3,3-dimethylbut-1-ene'), arr('HCl'), txt('?')]],
          hint: 'The first cation is 2°. Is there an H or a CH₃ on the next carbon that can shift?',
          steps: [
            'H⁺ adds to C1 (Markovnikov), giving a 2° cation on C2.',
            'C3 next door has no H, only three CH₃’s. A methyl shifts over with its bonding electrons (1,2-methyl shift).',
            'The + is now on C3, which carries two CH₃’s and the rest of the chain: a 3° cation.',
            'Cl⁻ attacks the 3° carbon. The carbon skeleton has changed.',
          ],
          answerRows: [
            [mol(S.cat2DMB, '2° cation', 40), arr('CH₃ shift'), mol(S.cat3DMB, '3° cation'), arr('Cl⁻'), mol(S.chloroDMB, '2-chloro-2,3-dimethylbutane')],
          ],
          answer: '2-Chloro-2,3-dimethylbutane (after a methyl shift).' },
      ],
      mech: 'mshift',
      say: [
        'Carbocations rearrange by a hydride or methyl shift if they can become more stable, just like in SN1/E1. Dr. Lopez’s rule: when rearrangements can occur, they DO occur.',
        'Hydride example: 3-methylbut-1-ene + HBr. Protonation gives a 2° cation right next to a 3° C–H. That H shifts over to make a 3° cation, so the major product is 2-bromo-2-methylbutane.',
        'Methyl example (the 3D viewer): 3,3-dimethylbut-1-ene + HBr. The 2° cation sits next to a carbon with three methyls; one methyl shifts over to make a 3° cation, and the major product is 2-bromo-2,3-dimethylbutane, a new carbon skeleton.',
      ],
      takeaway: 'Whenever a 2° carbocation sits next to a 3° or quaternary carbon, expect a shift.',
      check: {
        q: '3-Methylbut-1-ene + HBr gives mainly…',
        a: '2-Bromo-2-methylbutane',
        o: ['2-Bromo-3-methylbutane', '1-Bromo-3-methylbutane', '3-Methylbutan-2-ol'],
        why: 'The first cation is 2°. A 1,2-hydride shift makes the 3° cation, and Br⁻ adds there.',
      },
    },
    {
      sec: '8.5', title: 'HBr with peroxides: anti-Markovnikov',
      figs: [
        { kind: 'scheme', title: 'Same alkene, same HBr, opposite regiochemistry',
          rows: [
            [mol(S.propene, 'propene'), arr('HBr', 'no peroxides'), mol(S.bromo2propane, '2-bromopropane (Markovnikov)')],
            [mol(S.propene, 'propene'), arr('HBr, ROOR', 'hν or heat'), mol(S.bromo1propane, '1-bromopropane (anti-Markovnikov)')],
          ] },
        { kind: 'scheme', title: 'The radical chain (propagation steps)',
          rows: [
            [mol(S.propene, 'propene'), plus, txt('Br•'), arr('Br• adds to C1'), mol(S.rad2, '2° radical')],
            [mol(S.rad2, '2° radical'), plus, txt('H–Br'), arr('takes H•'), mol(S.bromo1propaneL, '1-bromopropane'), plus, txt('Br•', 'carries the chain')],
          ],
          caption: 'Here Br• (not H⁺) adds first, and it adds to the CH₂ end so the unpaired electron (•) sits on the more substituted, more stable 2° carbon. Radical stability follows the carbocation order: 3° > 2° > 1°. The new Br• keeps the chain going.' },
        { kind: 'gallery', title: 'Why Br goes to C1',
          items: [
            { mol: S.rad2, label: '2° radical (forms)', note: 'Br on C1' },
            { mol: S.rad1, label: '1° radical (doesn’t)', note: 'Br on C2' },
          ] },
        { kind: 'example', q: 'Predict the product of 1-methylcyclohexene + HBr, ROOR.',
          rows: [[mol(S.MCH, '1-methylcyclohexene'), arr('HBr, ROOR'), txt('?')]],
          hint: 'With peroxides, Br goes where H would have gone in the Markovnikov reaction.',
          steps: [
            'Br• adds to C2 (the CH carbon), so the radical forms on C1, which is 3°.',
            'That radical takes an H from HBr, so the H ends up on C1, next to the CH₃.',
            'Two new stereocenters (C1 and C2), and radical steps are not stereospecific: a mixture of cis and trans isomers.',
          ],
          answerRows: [[mol(S.MCH), arr('HBr, ROOR'), mol(S.bromo2MCH, '1-bromo-2-methylcyclohexane (cis + trans)')]],
          answer: '1-Bromo-2-methylcyclohexane, Br on the less substituted carbon. (HBr alone would give 1-bromo-1-methylcyclohexane.)' },
      ],
      rx: 'hbr-roor',
      say: [
        'Add peroxides (ROOR, molecules with an O–O bond) to HBr and the regiochemistry flips: Br goes on the less substituted carbon (anti-Markovnikov). The mechanism has to be different, and it is: a radical chain (species with unpaired electrons) instead of a carbocation.',
        'Short version: the peroxide helps make a Br• radical. Br• adds to the less substituted carbon so that the more stable (more substituted) carbon radical forms, and that radical then takes an H from H–Br. The lesson from the slides: HBr’s regiochemistry can be controlled. HBr alone → Markovnikov; HBr + ROOR → anti-Markovnikov. This works for HBr only, not HCl or HI.',
      ],
      takeaway: 'HBr, ROOR → anti-Markovnikov (Br on the less substituted carbon), by radicals.',
      check: {
        q: 'Propene + HBr with ROOR gives mainly…',
        a: '1-Bromopropane',
        o: ['2-Bromopropane', 'Propan-1-ol', '1,2-Dibromopropane'],
        why: 'With peroxides, Br adds first to the end carbon so the more stable 2° radical forms; then H is added. Br ends up on C1.',
      },
    },
    {
      sec: '8.6', title: 'Acid-catalyzed hydration',
      figs: [
        { kind: 'scheme', title: 'Mechanism: 2-methylpropene + H₃O⁺ (3 steps)',
          rows: [
            [mol(S.ibH3O, '2-methylpropene + H₃O⁺', 40), arr('1) protonate', 'slow'), mol(S.tBuCatH2O, '3° carbocation + H₂O', 40)],
            [arr('2) water attacks'), mol(S.oxonium, 'oxonium ion + H₂O', 40), arr('3) deprotonate')],
            [mol(S.tBuOH, '2-methylpropan-2-ol'), plus, txt('H₃O⁺', 'catalyst comes back')],
          ],
          caption: 'Step 1 is the same as HX: H⁺ goes to the CH₂ end and the 3° cation forms. Step 2: a lone pair on water bonds to C⁺. Step 3: a second water takes an H⁺ off the O⁺, and the O–H bond electrons stay on oxygen.' },
        { kind: 'example', q: 'Predict the major product of 1-methylcyclohexene + H₂O, H₂SO₄.',
          rows: [[mol(S.MCH, '1-methylcyclohexene'), arr('H₂O', 'H₂SO₄'), txt('?')]],
          hint: 'Same regiochemistry as HBr: protonate to make the more stable cation.',
          steps: [
            'H⁺ adds to C2, making the 3° cation on C1 (the carbon with the CH₃).',
            'Water attacks C1, then loses H⁺.',
            'C1 has two identical ring paths, so it is not a stereocenter.',
          ],
          answerRows: [[mol(S.MCH), arr('H₃O⁺'), mol(S.MCHol, '1-methylcyclohexan-1-ol')]],
          answer: '1-Methylcyclohexan-1-ol (Markovnikov: OH on the more substituted carbon).' },
      ],
      mech: 'hydration', rx: 'hydration',
      say: [
        'Acid-catalyzed hydration adds water’s H and OH across the π bond, using H₂O with a little H₂SO₄ (sulfuric acid, the catalyst; the real acid in water is H₃O⁺). It follows Markovnikov: OH goes on the more substituted carbon. More substituted alkenes react faster, which fits a carbocation mechanism.',
        'Mechanism: 1) the π bond takes H⁺ from H₃O⁺, making a carbocation (same start as HX). 2) Water attacks the carbocation, giving an oxonium ion (an oxygen with three bonds and a + charge). 3) Another water removes H⁺, giving the alcohol and regenerating H₃O⁺. That is why the acid is called a catalyst.',
      ],
      takeaway: 'H₃O⁺: Markovnikov alcohol via a carbocation (protonate, water attacks, deprotonate).',
      check: {
        q: '2-Methylpropene + H₂O, H₂SO₄ gives…',
        a: '2-Methylpropan-2-ol',
        o: ['2-Methylpropan-1-ol', '2-Methylpropane', '2-Methylpropane-1,2-diol'],
        why: 'Protonation makes the 3° carbocation, water attacks it, and the OH ends up on the more substituted carbon.',
      },
    },
    {
      sec: '8.6', title: 'Hydration is an equilibrium',
      figs: [
        { kind: 'scheme', title: 'One equilibrium, two directions',
          rows: [
            [mol(S.cyhexene, 'cyclohexene'), plus, txt('H₂O'), arr('dilute H₂SO₄', 'excess H₂O'), mol(S.cyhexanol, 'cyclohexanol')],
            [mol(S.cyhexanol, 'cyclohexanol'), arr('conc. H₂SO₄', 'heat, no added H₂O'), mol(S.cyhexene, 'cyclohexene'), plus, txt('H₂O')],
          ] },
        { kind: 'table', title: 'Le Châtelier: push it where you want',
          head: ['You want', 'Conditions', 'Why it works'],
          rows: [
            ['The alcohol (hydration)', 'Dilute acid, lots of water', 'Extra water is a reactant, so the equilibrium shifts toward the alcohol.'],
            ['The alkene (dehydration, E1)', 'Concentrated H₂SO₄, heat', 'Little water is present, and heat favors the side with more molecules (entropy).'],
          ] },
        { kind: 'example', q: 'Predict the major product of 3,3-dimethylbut-1-ene + H₂O, H₂SO₄.',
          rows: [[mol(S.DMB1, '3,3-dimethylbut-1-ene'), arr('H₂O', 'H₂SO₄'), txt('?')]],
          hint: 'A carbocation forms. Look at its neighbor.',
          steps: [
            'Protonation at C1 gives a 2° cation on C2.',
            'C3 is quaternary (three CH₃’s), so a methyl shifts and the + moves to C3, now 3°.',
            'Water attacks the 3° cation, then loses H⁺. A little unrearranged 3,3-dimethylbutan-2-ol also forms, which is why this method often gives mixtures.',
          ],
          answerRows: [[mol(S.DMB1), arr('H₃O⁺'), mol(S.DMB2ol23, '2,3-dimethylbutan-2-ol (major)')]],
          answer: '2,3-Dimethylbutan-2-ol, from a methyl shift.' },
      ],
      say: [
        'Hydration is reversible: alkene + water ⇌ alcohol. Use Le Châtelier’s principle (a system at equilibrium shifts to undo whatever you change). To make the alcohol, use excess water. To make the alkene from an alcohol, use concentrated acid and no added water (plus heat), which runs it backwards as an E1 dehydration.',
        'Because a carbocation forms, two Chapter 7 rules apply. Stereochemistry works like HX addition: a new stereocenter comes out racemic. And rearrangements are possible, which often gives a mix of products. That weakness is why the next reaction exists.',
      ],
      takeaway: 'Excess water → alcohol; concentrated acid + heat → alkene. Expect racemic products and possible shifts.',
      check: {
        q: 'You want to turn cyclohexanol into cyclohexene. Best conditions?',
        a: 'Concentrated H₂SO₄, heat, no added water',
        o: ['Dilute H₂SO₄ in lots of water', 'NaBH₄', '1) BH₃·THF 2) H₂O₂, NaOH'],
        why: 'Removing water and adding heat pushes the equilibrium toward the alkene (Le Châtelier, and entropy favors elimination at high T).',
      },
    },
    {
      sec: '8.7', title: 'Oxymercuration: Markovnikov, no rearrangements',
      figs: [
        { kind: 'scheme', title: 'Mechanism on propene',
          rows: [
            [mol(S.propene, 'propene'), arr('Hg(OAc)₂', 'H₂O, THF'), mol(S.mercurinium, 'mercurinium ion + H₂O', 40)],
            [arr('−H⁺'), mol(S.organoHg, 'organomercury alcohol'), arr('NaBH₄', 'Hg → H'), mol(S.propan2ol, 'propan-2-ol')],
          ],
          caption: 'The bridged mercurinium ion is not a free carbocation, so nothing can shift. Water opens it at the more substituted carbon (C2, more δ+) while the C–Hg bond to that carbon breaks. NaBH₄ then replaces HgOAc with H.' },
        { kind: 'example', q: '3,3-Dimethylbut-1-ene is treated two ways: (a) H₂O, H₂SO₄ and (b) 1) Hg(OAc)₂, H₂O 2) NaBH₄. Draw both major products.',
          rows: [[mol(S.DMB1, '3,3-dimethylbut-1-ene')]],
          hint: 'Both are Markovnikov. Only one goes through a free carbocation.',
          steps: [
            '(a) Acid makes a 2° cation next to a quaternary carbon. A methyl shifts, and water adds to the new 3° cation.',
            '(b) The mercurinium ion can’t rearrange. Water adds to C2 (the more substituted alkene carbon), and NaBH₄ swaps Hg for H.',
            'Product (b) has a new stereocenter at C2 and the reaction is not stereospecific, so it is racemic.',
          ],
          answerRows: [[mol(S.DMB2ol23, '(a) 2,3-dimethylbutan-2-ol (shifted)'), mol(S.DMB2ol33, '(b) 3,3-dimethylbutan-2-ol (no shift)')]],
          answer: '(a) 2,3-dimethylbutan-2-ol; (b) 3,3-dimethylbutan-2-ol.' },
      ],
      mech: 'oxymerc', rx: 'oxymerc',
      say: [
        'Oxymercuration–demercuration also adds H and OH with Markovnikov regiochemistry, but without rearrangements. Reagents: 1) Hg(OAc)₂ (mercuric acetate) in H₂O/THF, 2) NaBH₄ (sodium borohydride, a reducing agent).',
        'Here the mercury cation (⁺HgOAc) is the Lewis acid (electron-pair acceptor) instead of H⁺. The π bond attacks it and forms a mercurinium ion: Hg bridges both carbons in a three-membered ring. That bridged cation is stabilized, so it doesn’t rearrange like a free carbocation.',
        'Water attacks the more substituted carbon (it carries more δ+), then loses H⁺. Finally NaBH₄ swaps the –HgOAc for an H (by a radical step). Same product as acid hydration, but no shifts. Per the notes, the overall sequence is not stereospecific.',
      ],
      takeaway: '1) Hg(OAc)₂, H₂O 2) NaBH₄: Markovnikov OH, no rearrangements.',
      check: {
        q: '3,3-Dimethylbut-1-ene + 1) Hg(OAc)₂, H₂O 2) NaBH₄ gives…',
        a: '3,3-Dimethylbutan-2-ol',
        o: ['2,3-Dimethylbutan-2-ol', '3,3-Dimethylbutan-1-ol', '2,3-Dimethylbut-2-ene'],
        why: 'Markovnikov OH on C2 with no methyl shift. Acid hydration would rearrange and give 2,3-dimethylbutan-2-ol; hydroboration would give the 1-ol.',
      },
    },
    {
      sec: '8.8', title: 'Hydroboration–oxidation: anti-Markovnikov',
      figs: [
        { kind: 'gallery', title: 'Borane and its THF complex',
          items: [
            { mol: S.BH3, label: 'BH₃', note: 'sp², flat, empty p orbital, only 6 e⁻ on B' },
            { mol: S.BH3THF, label: 'BH₃·THF', note: 'an O lone pair fills boron’s empty orbital' },
          ] },
        { kind: 'scheme', title: 'Propene: one concerted step, then oxidation',
          rows: [
            [mol(S.propeneBH3, 'propene + BH₃', 40), arr('concerted', '4-center TS'), mol(S.propylBorane, 'B on the end carbon')],
            [arr('H₂O₂, NaOH', 'B → OH, same spot'), mol(S.propan1ol, 'propan-1-ol')],
          ],
          caption: 'In one step, the π bond bonds to boron (on the less crowded CH₂) while an H moves from B to the other carbon. No carbocation forms, so there are no shifts. Then H₂O₂/NaOH swaps B for OH.' },
        { kind: 'example', q: 'Draw the products of 2-methylbut-2-ene with (a) 1) BH₃·THF 2) H₂O₂, NaOH and (b) H₂O, H₂SO₄.',
          rows: [[mol(S.MB2, '2-methylbut-2-ene')]],
          hint: 'Hydroboration puts OH on the less substituted alkene carbon; acid hydration puts it on the more substituted one.',
          steps: [
            'The alkene carbons are C2 (two CH₃’s, no H: more substituted) and C3 (one H).',
            '(a) B, and then OH, goes on C3; H goes on C2. C3 becomes a stereocenter, and B can add to either face, so the product is racemic.',
            '(b) H⁺ adds to C3 to make the 3° cation at C2, and OH ends up on C2.',
          ],
          answerRows: [[mol(S.MB2ol3, '(a) 3-methylbutan-2-ol (anti-Markovnikov)'), mol(S.MB2ol_up, '(b) 2-methylbutan-2-ol (Markovnikov)')]],
          answer: '(a) 3-methylbutan-2-ol (racemic); (b) 2-methylbutan-2-ol.' },
      ],
      mech: 'bh3', rx: 'hydroboration',
      say: [
        'Hydroboration–oxidation adds H and OH with anti-Markovnikov regiochemistry: OH on the less substituted carbon. It is a two-reaction sequence: 1) BH₃·THF, 2) H₂O₂, NaOH (hydrogen peroxide and base). It is also syn: H and OH add to the same face. Anti addition is not observed.',
        'Borane (BH₃) is shaped like a carbocation: boron is sp², flat, with an empty p orbital and no octet. On its own it pairs up as B₂H₆ (diborane), but THF (an ether solvent) forms a BH₃·THF complex, the active reagent.',
        'In one concerted step, the π bond attacks boron while an H moves from B to the other carbon. B goes on the less substituted carbon for two reasons: less crowding (sterics), and in the transition state the more substituted carbon carries the δ+, which it handles better. No carbocation, so no rearrangements. One BH₃ can react with three alkenes. Then H₂O₂/NaOH replaces B with OH in the exact same spot.',
      ],
      takeaway: '1) BH₃·THF 2) H₂O₂, NaOH: anti-Markovnikov, syn, no rearrangements.',
      check: {
        q: 'Propene + 1) BH₃·THF 2) H₂O₂, NaOH gives…',
        a: 'Propan-1-ol',
        o: ['Propan-2-ol', 'Propane', 'Propane-1,2-diol'],
        why: 'Boron, and then OH, goes on the less substituted end carbon (anti-Markovnikov).',
      },
    },
    {
      sec: '8.8', title: 'Hydroboration stereochemistry: syn',
      figs: [
        { kind: 'scheme', title: '1-Methylcyclopentene: H and OH on the same face',
          rows: [
            [mol(S.MCP, '1-methylcyclopentene'), arr('BH₃·THF', 'H and B add syn'), mol(S.MCPborane, 'H (wedge) and B (wedge) on the same face')],
            [arr('H₂O₂, NaOH', 'OH replaces B in place'), mol(S.t2MCPolA, 'trans-2-methylcyclopentan-1-ol'), plus, mol(S.t2MCPolB, 'its enantiomer')],
          ],
          caption: 'The new H on C1 and the new OH on C2 are both wedged: syn. That pushes the CH₃ (already on C1) to the back face, so OH and CH₃ are trans. BH₃ attacks the top and bottom faces equally, giving both enantiomers (racemic), but never the cis isomer.' },
        { kind: 'example', q: 'Draw the product(s) of 1-methylcyclohexene + 1) BH₃·THF 2) H₂O₂, NaOH.',
          rows: [[mol(S.MCH, '1-methylcyclohexene'), arr('1) BH₃·THF', '2) H₂O₂, NaOH'), txt('?')]],
          hint: 'Regiochemistry first (where does OH go?), then put H and OH on the same face.',
          steps: [
            'Anti-Markovnikov: OH on C2 (the CH), H on C1 (the carbon with CH₃).',
            'Syn: draw the new H on C1 and the OH on C2 both as wedges. The CH₃ on C1 then points back (hash).',
            'Two new stereocenters, one pair of enantiomers: the mirror image has everything flipped.',
          ],
          answerRows: [[mol(S.t2MCHolA, 'trans-2-methylcyclohexan-1-ol'), plus, mol(S.t2MCHolB, 'enantiomer')]],
          answer: 'trans-2-Methylcyclohexan-1-ol, as a racemic mixture.' },
      ],
      rx: 'hydroboration',
      say: [
        'Hydroboration is stereospecific: only syn addition. If one new chiral center forms, boron can add to either face of the flat alkene, so you get a pair of enantiomers.',
        'If two chiral centers form, syn addition still locks their relationship: you get just one pair of enantiomers, not all four stereoisomers. Example from the notes: 1-methylcyclopentene gives trans-2-methylcyclopentan-1-ol (plus its enantiomer). H and OH went on the same face, so the OH ends up trans to the methyl.',
      ],
      takeaway: 'Syn addition: two new stereocenters → one pair of enantiomers.',
      check: {
        q: '1-Methylcyclopentene + 1) BH₃·THF 2) H₂O₂, NaOH gives…',
        a: 'trans-2-Methylcyclopentan-1-ol (racemic)',
        o: ['cis-2-Methylcyclopentan-1-ol (racemic)', '1-Methylcyclopentan-1-ol', 'Methylcyclopentane'],
        why: 'OH goes on the less substituted ring carbon. The new H (on the methyl carbon) and the OH are syn, which puts the OH trans to the methyl.',
      },
    },
    {
      sec: '8.9', title: 'Catalytic hydrogenation: syn',
      figs: [
        { kind: 'scheme', title: '1,2-Dimethylcyclohexene + H₂',
          rows: [[mol(S.DMCH, '1,2-dimethylcyclohexene'), arr('H₂, Pt', 'both H’s, one face'), mol(S.cisDMCH, 'cis-1,2-dimethylcyclohexane (meso)')]],
          caption: 'The alkene lies flat on the metal surface, and both H atoms come from the metal side (drawn here as wedges). The two CH₃’s are pushed to the other face together (hashes): cis. A mirror plane runs between C1 and C2, so it is one meso compound.' },
        { kind: 'table', title: 'Two kinds of catalyst',
          head: ['Type', 'Examples', 'Notes'],
          rows: [
            ['Heterogeneous', 'Pt, Pd/C, Ni (solid metal)', 'Doesn’t dissolve. H₂ and the alkene meet on the metal surface.'],
            ['Homogeneous', 'Metal with ligands (e.g. Wilkinson’s catalyst, Rh)', 'Dissolves in the solvent, thanks to its ligands.'],
          ] },
        { kind: 'example', q: 'Which alkenes give 2-methylbutane when treated with H₂, Pd?',
          rows: [[mol(S.methylbutane, '2-methylbutane')]],
          hint: 'Hydrogenation keeps the carbon skeleton. Put a C=C between any two neighboring carbons that each have an H.',
          steps: [
            'C1=C2: 2-methylbut-1-ene.',
            'C2=C3: 2-methylbut-2-ene.',
            'C3=C4: 3-methylbut-1-ene. (A C=C out to the CH₃ branch just gives 2-methylbut-1-ene again.)',
            'No new stereocenters form, so syn addition doesn’t matter here.',
          ],
          answerRows: [[mol(S.M2B1, '2-methylbut-1-ene'), mol(S.MB2, '2-methylbut-2-ene'), mol(S.MB1, '3-methylbut-1-ene')]],
          answer: 'Three alkenes: 2-methylbut-1-ene, 2-methylbut-2-ene and 3-methylbut-1-ene.' },
      ],
      mech: 'h2', rx: 'hydrogenation',
      say: [
        'Catalytic hydrogenation adds H₂ across the C=C, reducing (adding H to) an alkene to an alkane. It needs a metal catalyst (Pt, Pd or Ni). Without one, the activation energy is far too high and nothing happens.',
        'The metal surface holds both the H atoms and the alkene. The alkene lies flat on the metal, so both H’s add to the same face: syn addition, stereospecific. The 3D viewer shows it on a ring.',
        'Watch for meso compounds (molecules with stereocenters but an internal mirror plane, so they are not chiral). Syn addition to a symmetrical alkene like 1,2-dimethylcyclohexene gives cis-1,2-dimethylcyclohexane, one meso compound, not a pair of enantiomers. Catalysts can be heterogeneous (a solid that doesn’t dissolve, like Pt or Pd metal) or homogeneous (dissolves, thanks to ligands on the metal).',
      ],
      takeaway: 'H₂ with Pt, Pd or Ni: syn addition, alkene → alkane.',
      check: {
        q: '1,2-Dimethylcyclohexene + H₂, Pd gives…',
        a: 'cis-1,2-Dimethylcyclohexane (meso)',
        o: ['trans-1,2-Dimethylcyclohexane (racemic)', 'A 50:50 mix of cis and trans', '1,2-Dimethylcyclohexan-1-ol'],
        why: 'Both H’s come from the metal side, so both methyls end up on the other face together (cis). That molecule has a mirror plane: meso.',
      },
    },
    {
      sec: '8.10', title: 'Halogenation: bromonium ion, anti',
      figs: [
        { kind: 'scheme', title: 'Mechanism: cyclohexene + Br₂',
          rows: [
            [mol(S.cyhexBr2, 'cyclohexene + Br–Br', 40), arr('step 1', 'bromonium forms')],
            [mol(S.bromonium, 'bromonium ion + Br⁻', 40), arr('step 2', 'backside attack'), mol(S.transDiBrA, 'trans'), plus, mol(S.transDiBrB, 'enantiomer')],
          ],
          caption: 'Step 1: the π bond attacks the near Br, a lone pair on that Br bonds back to the other carbon (closing the 3-ring), and Br⁻ leaves. Step 2: Br⁻ attacks from the face opposite the bridge (here, from behind), SN2-style. The two Br’s end up anti: one wedge, one hash. Attack at the other carbon gives the enantiomer.' },
        { kind: 'example', q: 'Br₂ adds to cis-but-2-ene and to trans-but-2-ene. What stereoisomers of 2,3-dibromobutane form from each?',
          rows: [[mol(S.cisBut2ene, 'cis-but-2-ene'), mol(S.transBut2ene, 'trans-but-2-ene')]],
          hint: 'Anti addition. Draw the product in a zig-zag and decide whether the two Br’s are on the same or opposite faces.',
          steps: [
            'Anti addition to the cis alkene gives both Br’s wedged (or both hashed) in a zig-zag drawing: (2R,3R) and (2S,3S), a racemic pair.',
            'Anti addition to the trans alkene gives one wedge and one hash: (2R,3S). That molecule has a mirror plane, so it is meso.',
            'Check: the starting geometry (cis vs trans) decides the product stereochemistry. That is what stereospecific means.',
          ],
          answerRows: [
            [txt('cis →'), mol(S.dibromoRR, '(2R,3R)'), plus, mol(S.dibromoSS, '(2S,3S)')],
            [txt('trans →'), mol(S.dibromoMeso, 'meso (2R,3S)')],
          ],
          answer: 'cis-But-2-ene → racemic (2R,3R) + (2S,3S); trans-but-2-ene → meso-2,3-dibromobutane.' },
      ],
      mech: 'br2', rx: 'halogenation',
      say: [
        'Halogenation adds two halogen atoms across the C=C (a key step in making PVC plastic). It is only practical with Cl₂ and Br₂: I₂ works poorly and F₂ is too violent. The solvent is usually CH₂Cl₂.',
        'Br₂ is nonpolar but polarizable: as the π bond approaches, the near Br becomes δ+ (think of it as a Br attached to a good leaving group, Br⁻). The alkene attacks, and instead of a carbocation it forms a bromonium ion, a three-membered ring with + on Br bridging both carbons (like the mercurinium ion).',
        'Br⁻ then attacks from the back, opposite the bridge, in an SN2-like step. So the two Br’s end up on opposite faces: anti addition only, and no rearrangements. Cyclohexene gives trans-1,2-dibromocyclohexane (racemic). From the notes: trans-but-2-ene gives the meso dibromide, and cis-but-2-ene gives a racemic pair.',
      ],
      takeaway: 'Br₂: bromonium ion, then backside attack → anti addition.',
      check: {
        q: 'Cyclopentene + Br₂ in CH₂Cl₂ gives…',
        a: 'trans-1,2-Dibromocyclopentane (racemic)',
        o: ['cis-1,2-Dibromocyclopentane', '1,1-Dibromocyclopentane', 'Bromocyclopentane'],
        why: 'Br⁻ opens the bromonium from the face opposite the first Br, so the two Br’s are anti (trans).',
      },
    },
    {
      sec: '8.10', title: 'Halohydrins: Br₂ in water',
      figs: [
        { kind: 'scheme', title: 'Mechanism: 2-methylpropene + Br₂, H₂O',
          rows: [
            [mol(S.isobutylene, '2-methylpropene'), arr('Br₂'), mol(S.bromoniumIB, 'bromonium ion + H₂O', 40)],
            [arr('−H⁺', '(water takes it)'), mol(S.bromohydrinIB, '1-bromo-2-methylpropan-2-ol')],
          ],
          caption: 'Water (the solvent, far more plentiful than Br⁻) attacks the 3° carbon of the bromonium ion, the one with more δ+, from the face opposite Br. Losing H⁺ gives the neutral bromohydrin: OH on the more substituted carbon, Br on the CH₂.' },
        { kind: 'example', q: 'Predict the product(s) of 1-methylcyclohexene + Br₂, H₂O.',
          rows: [[mol(S.MCH, '1-methylcyclohexene'), arr('Br₂, H₂O'), txt('?')]],
          hint: 'Regiochemistry: OH on the more substituted carbon. Stereochemistry: anti.',
          steps: [
            'The bromonium ion bridges C1 and C2. C1 (holding CH₃) carries more δ+, so water attacks C1.',
            'Br stays on C2. Water came from the opposite face, so OH and Br are anti (one wedge, one hash).',
            'Bromine can bridge either face to start with, so both enantiomers form (racemic).',
          ],
          answerRows: [[mol(S.MCHbrohA, 'trans-2-bromo-1-methylcyclohexan-1-ol'), plus, mol(S.MCHbrohB, 'enantiomer')]],
          answer: 'trans-2-Bromo-1-methylcyclohexan-1-ol (OH on C1 with the methyl, Br on C2), racemic.' },
      ],
      mech: 'halohydrin', rx: 'halohydrin',
      say: [
        'Run halogenation in water and you get a halohydrin (a halogen and an OH on neighboring carbons). The bromonium ion still forms, but water is the solvent, so there are far more H₂O molecules than Br⁻ ions, and water does the backside attack. A final deprotonation gives the neutral bromohydrin (with Cl₂, a chlorohydrin).',
        'Regiochemistry: OH goes to the more substituted carbon, Br to the less substituted one. Why: in the bromonium ion, the more substituted carbon carries more of the + charge (more cationic character), so water attacks it faster. Stereochemistry is still anti.',
      ],
      takeaway: 'Br₂, H₂O: OH on the more substituted carbon, Br on the less, added anti.',
      check: {
        q: '2-Methylpropene + Br₂, H₂O gives mainly…',
        a: '1-Bromo-2-methylpropan-2-ol',
        o: ['2-Bromo-2-methylpropan-1-ol', '1,2-Dibromo-2-methylpropane', '2-Methylpropane-1,2-diol'],
        why: 'Water opens the bromonium at the 3° carbon (more δ+), so OH sits there and Br stays on the CH₂.',
      },
    },
    {
      sec: '8.11', title: 'Syn dihydroxylation: OsO₄',
      figs: [
        { kind: 'scheme', title: 'Cyclopentene + OsO₄',
          rows: [[mol(S.cypentene, 'cyclopentene'), arr('OsO₄', 'concerted'), mol(S.osmate, 'cyclic osmate ester'), arr('H₂O', '(NMO re-oxidizes Os)'), mol(S.cisDiolPent, 'cis-cyclopentane-1,2-diol (meso)')]],
          caption: 'Both oxygens come from the same OsO₄ molecule on the same face, so the two OH’s are syn (both wedges). The diol has a mirror plane: meso.' },
        { kind: 'example', q: 'Draw the product(s) of 1-methylcyclohexene + OsO₄ (cat.), NMO.',
          rows: [[mol(S.MCH, '1-methylcyclohexene'), arr('OsO₄, NMO'), txt('?')]],
          hint: 'Both OH’s go on the same face. Is the product meso or a pair of enantiomers?',
          steps: [
            'OH adds to C1 and C2, both on the same face (both wedges).',
            'C1 has a CH₃ and C2 has an H, so the molecule has no mirror plane: it is chiral.',
            'OsO₄ attacks the top and bottom faces equally, so you get both enantiomers (both wedges, or both hashes).',
          ],
          answerRows: [[mol(S.MCHdiolA, 'cis-1-methylcyclohexane-1,2-diol'), plus, mol(S.MCHdiolB, 'enantiomer')]],
          answer: 'cis-1-Methylcyclohexane-1,2-diol, racemic.' },
      ],
      rx: 'syn-diol',
      say: [
        'Syn dihydroxylation adds two OH groups to the same face in one concerted step, giving a 1,2-diol (also called a glycol). The classic reagent is OsO₄ (osmium tetroxide).',
        'OsO₄ adds across the π bond to make a cyclic osmate ester (a ring holding both new oxygens on one face); water then breaks it apart to release the syn diol. OsO₄ is expensive and toxic, so only a catalytic amount is used, plus a co-oxidant (NMO, or a peroxide such as H₂O₂ in the notes) that regenerates it.',
        'Cold, dilute KMnO₄ (potassium permanganate) with NaOH does the same job, but it is less useful because it reacts with many other groups too. Example: cyclopentene + OsO₄ gives cis-cyclopentane-1,2-diol, a meso compound.',
      ],
      takeaway: 'OsO₄ (cat.) + NMO, or cold KMnO₄: two OH’s added syn (cis diol).',
      check: {
        q: 'Which reagents give cis-cyclohexane-1,2-diol from cyclohexene?',
        a: 'OsO₄ (catalytic), NMO',
        o: ['1) RCO₃H 2) H₃O⁺', 'Br₂, H₂O', '1) O₃ 2) DMS'],
        why: 'OsO₄ delivers both oxygens from the same face at once. The epoxide route opens from the back and gives the trans diol.',
      },
    },
    {
      sec: '8.12', title: 'Epoxides and anti dihydroxylation',
      figs: [
        { kind: 'scheme', title: 'Cyclohexene → trans diol',
          rows: [
            [mol(S.cyhexene, 'cyclohexene'), arr('RCO₃H', '(mCPBA)'), mol(S.cyhexOxide, 'epoxide (O on the front face)'), arr('H₃O⁺', 'protonate O')],
            [mol(S.epoxideH, 'protonated epoxide + H₂O', 40), arr('backside attack', 'then −H⁺'), mol(S.transDiolA, 'trans'), plus, mol(S.transDiolB, 'enantiomer')],
          ],
          caption: 'The epoxide oxygen stays on the front face (wedge). Water attacks a ring carbon from the back as the C–O bond breaks, so the new OH is a hash: the two OH’s are anti (trans). Attack at either carbon is equally likely, so the product is racemic.' },
        { kind: 'table', title: 'Syn vs anti dihydroxylation',
          head: ['', 'OsO₄, NMO (or cold KMnO₄)', '1) RCO₃H 2) H₃O⁺'],
          rows: [
            ['Steps', 'One, concerted', 'Two: epoxide, then ring opening'],
            ['Where the O’s come from', 'Both from OsO₄', 'One from the peroxyacid, one from water'],
            ['Stereochemistry', 'Syn (cis diol)', 'Anti (trans diol)'],
            ['Cyclopentene gives', 'cis diol (meso)', 'trans diol (racemic)'],
          ] },
        { kind: 'example', q: 'Choose reagents for each conversion of cyclopentene.',
          rows: [[mol(S.cypentene, 'cyclopentene'), arr('?'), mol(S.cisDiolPent, '(a) cis diol')], [mol(S.cypentene, 'cyclopentene'), arr('?'), mol(S.transDiolPent, '(b) trans diol')]],
          hint: 'Both OH’s on one face = syn. One wedge, one hash = anti.',
          steps: ['(a) Both OH’s wedged: syn addition, from OsO₄ (cat.) with NMO, or cold dilute KMnO₄, NaOH.', '(b) One wedge, one hash: anti addition, from the epoxide route.'],
          answer: '(a) OsO₄, NMO; (b) 1) mCPBA 2) H₃O⁺.' },
      ],
      rx: 'anti-diol',
      say: [
        'Anti dihydroxylation takes two steps. Step 1: a peroxyacid (RCO₃H, like mCPBA) turns the alkene into an epoxide (a three-membered ring containing one O). This step is concerted, so the O adds to one face.',
        'Step 2: H₃O⁺ (water with an acid catalyst) opens the epoxide. The acid protonates the epoxide O, then water attacks a carbon from the back, opposite the O, SN2-style. One OH comes from the old epoxide oxygen and the other from water, on opposite faces: an anti (trans) diol.',
        'Notice the pattern: the bromonium, mercurinium and protonated epoxide are all strained three-membered rings with a + charge. That makes them good electrophiles, and all three are opened from the back, so all three give anti products.',
      ],
      takeaway: '1) RCO₃H 2) H₃O⁺: epoxide, then backside opening → anti (trans) diol.',
      check: {
        q: 'Cyclohexene + 1) mCPBA 2) H₃O⁺ gives…',
        a: 'trans-Cyclohexane-1,2-diol (racemic)',
        o: ['cis-Cyclohexane-1,2-diol (meso)', 'Cyclohexanol', 'Hexanedial'],
        why: 'Water opens the protonated epoxide from the opposite face, so the two OH’s end up trans.',
      },
    },
    {
      sec: '8.13', title: 'Ozonolysis: cutting the C=C',
      figs: [
        { kind: 'scheme', title: '2-Methylbut-2-ene: cut the C=C, add an O to each side',
          rows: [[mol(S.MB2cut, '2-methylbut-2-ene'), arr('1) O₃', '2) DMS'), mol(S.acetone, 'acetone (ketone)'), plus, mol(S.acetaldehyde, 'acetaldehyde (aldehyde)')]],
          caption: 'The left alkene carbon had two CH₃’s, so it becomes a ketone. The right one had an H, so it becomes an aldehyde (C=O with H).' },
        { kind: 'example', q: 'Draw the ozonolysis product of 1-methylcyclohexene (1) O₃ 2) DMS).',
          rows: [[mol(S.MCHcut, '1-methylcyclohexene'), arr('1) O₃', '2) DMS'), txt('?')]],
          hint: 'A ring alkene gives one molecule: the ring opens into a chain with a C=O at each end.',
          steps: [
            'Cut the C1=C2 bond and put =O on both carbons.',
            'C1 had the CH₃ and two carbon neighbors, so it becomes a ketone (CH₃–C=O).',
            'C2 had an H, so it becomes an aldehyde (CHO).',
            'The chain is 7 carbons long with the aldehyde as C1: 6-oxoheptanal.',
          ],
          answerRows: [[mol(S.oxoheptanal, '6-oxoheptanal', 28)]],
          answer: '6-Oxoheptanal, CH₃CO(CH₂)₄CHO: one chain with a ketone at one end and an aldehyde at the other.' },
        { kind: 'example', title: 'Working backward', q: 'Which alkene gives cyclohexanone and formaldehyde (H₂C=O) on ozonolysis?',
          rows: [[mol(S.cyhexanone, 'cyclohexanone'), plus, txt('H₂C=O', 'formaldehyde')]],
          hint: 'Remove both O’s and join the two carbonyl carbons with a C=C.',
          steps: ['Erase the O from each C=O.', 'Connect the ring carbon and the CH₂ carbon with a double bond.'],
          answerRows: [[mol(S.methyleneCyhex, 'methylenecyclohexane')]],
          answer: 'Methylenecyclohexane (a ring with an exocyclic C=CH₂).' },
      ],
      rx: 'ozonolysis',
      say: [
        'Ozonolysis is an oxidative cleavage: it cuts the C=C completely, σ and π bonds both. Reagents: 1) O₃ (ozone, a resonance hybrid of two structures), 2) a reducing agent, DMS (dimethyl sulfide, (CH₃)₂S) or Zn/H₂O.',
        'Easy way to draw it: erase the double bond and put a C=O on each carbon that was in it. A carbon that had an H becomes an aldehyde (C=O with an H on it); a carbon with two carbon groups becomes a ketone (C=O between two carbons). A ring alkene opens into one chain with two C=O’s.',
        'Example: 2-methylbut-2-ene, (CH₃)₂C=CHCH₃, gives acetone (a ketone) plus acetaldehyde (an aldehyde). Stereocenters not on the C=C stay untouched; the notes show an optically pure ring staying optically pure.',
      ],
      takeaway: '1) O₃ 2) DMS: cut the C=C, put a C=O on each side. C with an H → aldehyde; C with two R’s → ketone.',
      check: {
        q: 'Ozonolysis (1) O₃ 2) DMS) of 2,3-dimethylbut-2-ene gives…',
        a: 'Two molecules of acetone',
        o: ['Two molecules of acetaldehyde', 'One acetone and one acetaldehyde', '2,3-Dimethylbutane-2,3-diol'],
        why: 'Each alkene carbon carries two CH₃ groups and no H, so each half becomes (CH₃)₂C=O, acetone.',
      },
    },
    {
      sec: '8.14', title: 'Predicting addition products',
      figs: [
        { kind: 'table', title: 'Cheat sheet: the alkene additions',
          head: ['Reagents', 'Adds', 'Regiochemistry', 'Stereochemistry'],
          rows: [
            ['HX', 'H, X', 'Markovnikov (shifts possible)', 'Not stereospecific'],
            ['HBr, ROOR', 'H, Br', 'Anti-Markovnikov', 'Not stereospecific'],
            ['H₂O, H₂SO₄', 'H, OH', 'Markovnikov (shifts possible)', 'Not stereospecific'],
            ['1) Hg(OAc)₂, H₂O 2) NaBH₄', 'H, OH', 'Markovnikov, no shifts', 'Not stereospecific'],
            ['1) BH₃·THF 2) H₂O₂, NaOH', 'H, OH', 'Anti-Markovnikov', 'Syn'],
            ['H₂, Pt / Pd / Ni', 'H, H', '—', 'Syn'],
            ['Br₂ or Cl₂ (CH₂Cl₂)', 'X, X', '—', 'Anti'],
            ['Br₂, H₂O', 'OH, Br', 'OH on the more substituted C', 'Anti'],
            ['OsO₄, NMO (or cold KMnO₄)', 'OH, OH', '—', 'Syn'],
            ['1) RCO₃H 2) H₃O⁺', 'OH, OH', '—', 'Anti'],
            ['1) O₃ 2) DMS', 'Cleaves C=C', 'Two C=O', '—'],
          ] },
        { kind: 'example', title: 'Worked example 1', q: 'Predict the product: 2-methylbut-2-ene + HBr, ROOR.',
          rows: [[mol(S.MB2, '2-methylbut-2-ene'), arr('HBr, ROOR'), txt('?')]],
          steps: [
            'What adds? H and Br.',
            'Regiochemistry? Peroxides: anti-Markovnikov, so Br goes on C3 (the CH), H on C2.',
            'Stereochemistry? One new stereocenter (C3) from a flat radical: racemic.',
          ],
          answerRows: [[mol(S.bromo3MB, '2-bromo-3-methylbutane (racemic)')]],
          answer: '2-Bromo-3-methylbutane, racemic.' },
        { kind: 'example', title: 'Worked example 2', q: 'Predict the product: 1-methylcyclopentene + Br₂, H₂O.',
          rows: [[mol(S.MCP, '1-methylcyclopentene'), arr('Br₂, H₂O'), txt('?')]],
          steps: [
            'What adds? OH and Br.',
            'Regiochemistry? OH on the more substituted carbon (C1, with the CH₃), Br on C2.',
            'Stereochemistry? Anti (bromonium opened from the back): OH and Br on opposite faces, two new stereocenters, racemic.',
          ],
          answerRows: [[mol(S.MCPbrohA, 'trans-2-bromo-1-methylcyclopentan-1-ol'), plus, mol(S.MCPbrohB, 'enantiomer')]],
          answer: 'trans-2-Bromo-1-methylcyclopentan-1-ol, racemic.' },
        { kind: 'example', title: 'Worked example 3', q: 'Predict the product: 1,2-dimethylcyclopentene + OsO₄ (cat.), NMO.',
          rows: [[mol(S.DMCP, '1,2-dimethylcyclopentene'), arr('OsO₄, NMO'), txt('?')]],
          steps: [
            'What adds? OH and OH.',
            'Regiochemistry? Both groups are the same, so it doesn’t matter.',
            'Stereochemistry? Syn: both OH’s on one face, both CH₃’s on the other. The molecule has a mirror plane, so it is a single meso compound.',
          ],
          answerRows: [[mol(S.DMCPdiol, 'cis-1,2-dimethylcyclopentane-1,2-diol (meso)')]],
          answer: 'cis-1,2-Dimethylcyclopentane-1,2-diol, meso.' },
        { kind: 'example', title: 'Worked example 4', q: 'Predict the product: 3-methylbut-1-ene + H₂O, H₂SO₄.',
          rows: [[mol(S.MB1, '3-methylbut-1-ene'), arr('H₂O', 'H₂SO₄'), txt('?')]],
          steps: [
            'What adds? H and OH, Markovnikov.',
            'Free carbocation? Yes, and it is 2° next to a 3° C–H: a hydride shift gives the 3° cation.',
            'Water adds to that 3° carbon. No stereocenter forms (it holds two CH₃’s).',
          ],
          answerRows: [[mol(S.MB2ol_up, '2-methylbutan-2-ol')]],
          answer: '2-Methylbutan-2-ol (after a hydride shift).' },
      ],
      say: [
        'For any alkene addition, ask the slide’s three questions. 1) What groups add? Read the reagent: H/X, H/OH, H/H, X/X, X/OH, OH/OH, or cleavage. 2) Regiochemistry: Markovnikov or anti-Markovnikov? (Only matters if the two groups differ and the two alkene carbons differ.) 3) Stereochemistry: syn or anti? (Only matters if new chiral centers form.)',
        'Keep one more check in your pocket: does the mechanism go through a free carbocation? If yes (HX, acid hydration), look for a rearrangement. Bridged ions and concerted steps (oxymercuration, Br₂, hydroboration, hydrogenation, OsO₄) never shift.',
        'Cheat list. Markovnikov: HX, H₃O⁺, Hg(OAc)₂/NaBH₄, and X₂/H₂O (for the OH). Anti-Markovnikov: HBr/ROOR, BH₃ then H₂O₂/NaOH. Syn: hydroboration, H₂/metal, OsO₄ or cold KMnO₄. Anti: X₂, X₂/H₂O, RCO₃H then H₃O⁺.',
      ],
      takeaway: 'Groups added → regiochemistry → stereochemistry. Then check for carbocation rearrangements.',
      check: {
        q: 'Which reaction is BOTH anti-Markovnikov AND syn?',
        a: 'Hydroboration–oxidation',
        o: ['HBr with ROOR', 'Halohydrin formation', 'Oxymercuration–demercuration'],
        why: 'HBr/ROOR is anti-Markovnikov but goes through radicals, so it isn’t syn. Halohydrin formation (anti) and oxymercuration put the OH on the more substituted carbon.',
      },
    },
    {
      sec: '8.15', title: 'One-step synthesis: pick the reagent',
      figs: [
        { kind: 'scheme', title: 'Slide example: Markovnikov alcohol',
          rows: [[mol(S.MCH, '1-methylcyclohexene'), arr('H₃O⁺', 'or 1) Hg(OAc)₂, H₂O 2) NaBH₄'), mol(S.MCHol, '1-methylcyclohexan-1-ol')]],
          caption: 'Change: H and OH added, OH on the more substituted carbon (Markovnikov). Both reactions do that; oxymercuration is the safe choice whenever a shift is possible.' },
        { kind: 'example', title: 'Worked example 1', q: 'What reagents make this conversion?',
          rows: [[mol(S.MCH, '1-methylcyclohexene'), arr('?'), mol(S.t2MCHolA, 'trans-2-methylcyclohexan-1-ol (+ enantiomer)')]],
          hint: 'Which carbon got the OH? Are the new H and OH on the same face?',
          steps: ['Added: H and OH.', 'OH is on the less substituted carbon: anti-Markovnikov.', 'New H (wedge) and OH (wedge) are on the same face: syn. Only hydroboration–oxidation does both.'],
          answer: '1) BH₃·THF 2) H₂O₂, NaOH' },
        { kind: 'example', title: 'Worked example 2', q: 'What reagents make this conversion?',
          rows: [[mol(S.MCH, '1-methylcyclohexene'), arr('?'), mol(S.bromo2MCH, '1-bromo-2-methylcyclohexane')]],
          hint: 'Where did the Br go compared to HBr alone?',
          steps: ['Added: H and Br.', 'Br is on the less substituted carbon: anti-Markovnikov.', 'For H and Br, anti-Markovnikov means radical conditions.'],
          answer: 'HBr, ROOR' },
        { kind: 'example', title: 'Worked example 3', q: 'What reagents make this conversion?',
          rows: [[mol(S.cyhexene, 'cyclohexene'), arr('?'), mol(S.cisDiolHex, 'cis-cyclohexane-1,2-diol')]],
          hint: 'Two OH’s, both wedges.',
          steps: ['Added: OH and OH.', 'Both on the same face: syn dihydroxylation.'],
          answer: 'OsO₄ (cat.), NMO (or cold, dilute KMnO₄, NaOH)' },
      ],
      rx: 'oxymerc',
      say: [
        'Planning a synthesis starts by comparing the starting material and product: what was added, where, and with what stereochemistry? Then choose the reaction that does exactly that.',
        'Slide example: an alkene becomes an alcohol with OH on the more substituted carbon. That is adding H and OH with Markovnikov regiochemistry, so use H₃O⁺ (acid hydration), or 1) Hg(OAc)₂, H₂O 2) NaBH₄ if a rearrangement could happen. If the OH needed to be on the less substituted carbon, you would use hydroboration–oxidation instead.',
      ],
      takeaway: 'Match the change (which groups, which carbon, which face) to the one reaction that gives it.',
      check: {
        q: 'You need 3-methylbutan-2-ol from 3-methylbut-1-ene. Best reagents?',
        a: '1) Hg(OAc)₂, H₂O 2) NaBH₄',
        o: ['H₂O, H₂SO₄', '1) BH₃·THF 2) H₂O₂, NaOH', 'HBr, ROOR'],
        why: 'You need Markovnikov OH with no shift. Acid hydration would hydride-shift and give 2-methylbutan-2-ol; hydroboration would give 3-methylbutan-1-ol.',
      },
    },
    {
      sec: '8.15', title: 'Moving a leaving group',
      figs: [
        { kind: 'scheme', title: 'Moving Br over one carbon: eliminate, then add',
          rows: [
            [mol(S.bromoMB_up, '2-bromo-2-methylbutane'), arr('NaOEt, heat', 'E2, Zaitsev'), mol(S.MB2, '2-methylbut-2-ene')],
            [arr('HBr, ROOR', 'anti-Markovnikov'), mol(S.bromo3MB, '2-bromo-3-methylbutane')],
          ],
          caption: 'Step 1 removes Br and builds the C=C toward the carbon that should receive the new Br. Step 2 puts Br on the less substituted alkene carbon, one carbon over from where it started.' },
        { kind: 'example', q: 'Plan a synthesis of butan-1-ol from butan-2-ol.',
          rows: [[mol(S.butan2ol, 'butan-2-ol'), arr('?'), mol(S.butan1ol, 'butan-1-ol')]],
          hint: 'OH has to leave first, and it is a bad leaving group. Which alkene do you need so that an anti-Markovnikov addition puts OH on C1?',
          steps: [
            'Make the OH a good leaving group: TsCl, pyridine gives the tosylate.',
            'You need the terminal alkene (but-1-ene), the Hofmann product, so use a bulky base: t-BuOK.',
            'Add H and OH anti-Markovnikov: hydroboration–oxidation puts OH on C1.',
          ],
          answerRows: [
            [mol(S.butan2ol), arr('TsCl', 'pyridine'), mol(S.butan2ylOTs, 'tosylate'), arr('t-BuOK', 'E2, Hofmann')],
            [mol(S.but1ene, 'but-1-ene'), arr('1) BH₃·THF', '2) H₂O₂, NaOH'), mol(S.butan1ol, 'butan-1-ol')],
          ],
          answer: '1) TsCl, pyridine 2) t-BuOK 3) BH₃·THF, then H₂O₂, NaOH' },
      ],
      decide: { cls: '3', reagent: 'NaOEt', solvent: 'protic', heat: true },
      say: [
        'Some changes can’t be done in one reaction, like moving a halogen to the next carbon over. The trick: eliminate, then add. Example: 2-bromo-2-methylbutane → 2-bromo-3-methylbutane. Step 1: E2 with a non-bulky base (NaOEt) gives the Zaitsev alkene, 2-methylbut-2-ene, which is the alkene we need. Step 2: HBr with ROOR adds the Br anti-Markovnikov, on the less substituted carbon of that C=C.',
        'Moving an OH works the same way, with one extra step. Example: butan-2-ol → butan-1-ol. OH is a bad leaving group, so first make it a tosylate (TsCl, pyridine). Then E2 with a bulky base (t-BuOK) gives the Hofmann alkene, but-1-ene. Finally hydroboration–oxidation adds OH anti-Markovnikov, on C1.',
        'General recipe: pick the base by which alkene you need (small → Zaitsev, bulky → Hofmann), then pick the addition by where the new group has to go. The decider below runs step 1 of the halogen example.',
      ],
      takeaway: 'Moving a group = eliminate (choose the base) + add (choose the regiochemistry).',
      check: {
        q: 'To turn butan-2-ol into butan-1-ol, the correct sequence is…',
        a: '1) TsCl, pyridine 2) t-BuOK 3) BH₃·THF, then H₂O₂, NaOH',
        o: ['1) TsCl, pyridine 2) NaOEt 3) H₃O⁺', '1) H₂SO₄, heat 2) H₃O⁺', '1) TsCl, pyridine 2) t-BuOK 3) Hg(OAc)₂, H₂O, then NaBH₄'],
        why: 'You need the terminal alkene (Hofmann, bulky base) and then OH on the end carbon (anti-Markovnikov, hydroboration). The other routes put OH back on C2.',
      },
    },
    {
      sec: '8.15', title: 'Moving a π bond, and the ten reactions',
      figs: [
        { kind: 'scheme', title: 'Moving the C=C to the end: add, then eliminate',
          rows: [
            [mol(S.MB2, '2-methylbut-2-ene'), arr('HBr, ROOR', 'anti-Markovnikov'), mol(S.bromo3MB, '2-bromo-3-methylbutane')],
            [arr('t-BuOK', 'E2, Hofmann'), mol(S.MB1b, '3-methylbut-1-ene')],
          ],
          caption: 'The bulky base can’t reach the H on the crowded CH next door, so it takes an H from the exposed CH₃ and the new C=C forms at the end of the chain.' },
        { kind: 'table', title: 'Two-step recipes',
          head: ['Goal', 'Step 1', 'Step 2'],
          rows: [
            ['Move a π bond to the end', 'HBr, ROOR', 't-BuOK (Hofmann)'],
            ['Move a π bond inward', 'HBr', 'NaOEt, heat (Zaitsev)'],
            ['Move Br to the less substituted C', 'NaOEt, heat (Zaitsev alkene)', 'HBr, ROOR'],
            ['Move OH to the end carbon', 'TsCl, py; then t-BuOK', 'BH₃·THF; then H₂O₂, NaOH'],
          ] },
        { kind: 'example', q: 'Plan a synthesis of but-2-ene from but-1-ene.',
          rows: [[mol(S.but1ene, 'but-1-ene'), arr('?'), mol(S.transBut2ene, 'but-2-ene')]],
          hint: 'You are moving the π bond inward. Which HBr addition, and which base?',
          steps: [
            'HBr without peroxides adds Markovnikov: Br on C2.',
            'A small strong base (NaOEt, heat) does E2 toward the more substituted alkene (Zaitsev): but-2-ene, mostly trans (E).',
          ],
          answerRows: [[mol(S.but1ene), arr('HBr'), mol(S.bromo2butane, '2-bromobutane'), arr('NaOEt', 'heat'), mol(S.transBut2ene, '(E)-but-2-ene (major)')]],
          answer: '1) HBr 2) NaOEt, heat' },
      ],
      rx: 'hbr-roor',
      decide: { cls: '2', reagent: 'tBuOK', solvent: 'protic', heat: true },
      say: [
        'Moving a π bond also takes two processes: add, then eliminate. Example: 2-methylbut-2-ene → 3-methylbut-1-ene. Step 1: HBr, ROOR puts Br on the less substituted alkene carbon (anti-Markovnikov), giving 2-bromo-3-methylbutane. Step 2: t-BuOK (a bulky base) does E2 and removes an H from the exposed end CH₃, giving the Hofmann alkene, 3-methylbut-1-ene.',
        'To move a π bond the other way (from the end of a chain inward), flip both choices: HBr without peroxides (Markovnikov), then a small base like NaOEt (Zaitsev).',
        'That completes the ten alkene reactions: HX (Markovnikov), HBr/ROOR (anti-Markovnikov), acid hydration and oxymercuration (Markovnikov OH), hydroboration–oxidation (anti-Markovnikov, syn), hydrogenation (syn), bromination (anti), halohydrin formation (anti), anti dihydroxylation, syn dihydroxylation, and ozonolysis.',
      ],
      takeaway: 'Move a π bond to the end: HBr/ROOR then t-BuOK. Move it inward: HBr then NaOEt.',
      check: {
        q: 'Which sequence turns 2-methylbut-2-ene into 3-methylbut-1-ene?',
        a: '1) HBr, ROOR 2) t-BuOK',
        o: ['1) HBr 2) t-BuOK', '1) HBr, ROOR 2) NaOEt', '1) H₂, Pt 2) t-BuOK'],
        why: 'Anti-Markovnikov HBr puts Br on the CH carbon; the bulky base then takes an H from the CH₃ next to it, making the terminal alkene. HBr alone gives the 3° bromide, which with t-BuOK gives 2-methylbut-1-ene instead; NaOEt would go back to the Zaitsev alkene.',
      },
    },
  ],
};
