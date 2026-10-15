// Animated reaction mechanisms. Each frame(t) builds the whole scene for
// t in [0, 1] from bond lengths and angles, so every in-between pose is a
// sensible geometry. Stereo labels are computed from the 3D positions.

import {
  TET, DEG, add, sub, mul, norm, lerp, at, mid, cross, rotate, ease, keys, window01,
  perpTo, polar, tetra, Frame, addH, addGroup, cip,
} from './geom.js?v=2';

const X = [1, 0, 0], Y = [0, 1, 0], Z = [0, 0, 1], O0 = [0, 0, 0];
const neg = v => mul(v, -1);
const other = c => (c === 'R' ? 'S' : 'R');

/** Bond that forms: nothing before a, dashed a..b, full after b. */
function forming(f, x, y, t, a, b, extra) {
  if (t >= b) f.bond(x, y, 1, extra);
  else if (t > a) f.bond(x, y, 1, { partial: true, ...extra });
}
/** Bond that breaks: full before a, dashed a..b, gone after b. */
function breaking(f, x, y, t, a, b, extra) {
  if (t <= a) f.bond(x, y, 1, extra);
  else if (t < b) f.bond(x, y, 1, { partial: true, ...extra });
}
const bez = (a, c, b, u) => add(add(mul(a, (1 - u) * (1 - u)), mul(c, 2 * u * (1 - u))), mul(b, u * u));

/** Water: O plus two H's pointing away from `away`'s opposite. */
function water(f, id, O, away, ref, opacity) {
  const e1 = perpTo(ref, away);
  f.atom(id, 'O', O, { opacity });
  [0, 180].forEach((phi, i) => {
    const hid = `${id}h${i}`;
    f.atom(hid, 'H', at(O, polar(away, e1, 52, phi), 0.96), { opacity });
    f.bond(id, hid, 1, { opacity });
  });
}

// ---------------------------------------------------------------- SN2

function sn2(t) {
  const f = new Frame();
  const C = f.atom('C', 'C', O0);
  const th = keys(t, [[0.3, TET], [0.5, 90], [0.68, 180 - TET]]);
  for (const [kind, id, phi] of [['H', 'H', 90], ['CH3', 'Me', 330], ['C2', 'Et', 210]]) {
    addGroup(f, kind, id, 'C', C, polar(X, Y, th, phi), X);
  }
  const Br = f.atom('Br', 'Br', [keys(t, [[0.3, 1.94], [0.5, 2.3], [0.68, 3.4], [1, 7.5]]), 0, 0]);
  breaking(f, 'C', 'Br', t, 0.4, 0.6);
  const O = f.atom('O', 'O', [-keys(t, [[0, 7.5], [0.3, 3.3], [0.5, 2.05], [0.66, 1.43]]), 0, 0]);
  addH(f, 'Oh', O, [-0.326, 0.946, 0], 'O', 0.96);
  forming(f, 'C', 'O', t, 0.4, 0.6);

  f.charge('qO', 'O', '−', window01(t, 0, 0.4));
  f.charge('dO', 'O', 'δ−', window01(t, 0.44, 0.56));
  f.charge('dBr', 'Br', 'δ−', window01(t, 0.44, 0.56));
  f.charge('qBr', 'Br', '−', window01(t, 0.62, 1.1));
  f.charge('dC', 'C', 'δ+', window01(t, 0.02, 0.3));

  f.lobe('sigma', C, neg(X), { kind: 'lobe', color: 'empty', size: 1.05, opacity: window01(t, 0.04, 0.42) });
  f.lobe('lp', O, X, { kind: 'lobe', color: 'filled', size: 0.6, opacity: window01(t, 0.1, 0.42) });
  f.arrow('a1', add(O, [0.45, 0.4, 0]), [-0.85, 0.3, 0], [0, 1.1, 0], { opacity: window01(t, 0.18, 0.44) });
  f.arrow('a2', mid(C, Br), add(Br, [0, -0.35, 0]), [0, -0.9, 0], { opacity: window01(t, 0.18, 0.44) });

  const sm = cip(C, Br, f.p('Et1'), f.p('Me'), f.p('H'));
  const pr = cip(C, O, f.p('Et1'), f.p('Me'), f.p('H'));
  f.caption(`(${sm})-2-bromobutane + HO⁻`, 1 - ease(t, 0.26, 0.32));
  f.caption('Transition state: HO···C···Br, 5 groups on carbon', window01(t, 0.44, 0.56), 'ts');
  f.caption('Umbrella flip (Walden inversion)', window01(t, 0.58, 0.7));
  f.caption(`(${pr})-butan-2-ol + Br⁻ · configuration inverted`, ease(t, 0.72, 0.78));
  return f;
}

// ---------------------------------------------------------------- SN1

function sn1(t, o = {}) {
  const side = o.face === 'front' ? 1 : -1;
  const f = new Frame();
  const C = f.atom('C', 'C', O0);
  const th = keys(t, [[0.1, TET], [0.3, 90], [0.5, 90], [0.64, side < 0 ? 180 - TET : TET]]);
  for (const [kind, id, phi] of [['CH3', 'Me', 90], ['C2', 'Et', 210], ['C3', 'Pr', 330]]) {
    addGroup(f, kind, id, 'C', C, polar(X, Y, th, phi), X);
  }
  const Br = f.atom('Br', 'Br', [keys(t, [[0.1, 1.94], [0.2, 2.6], [0.3, 3.8], [0.44, 6.6]]), keys(t, [[0.3, 0], [0.44, -2.2]]), 0]);
  breaking(f, 'C', 'Br', t, 0.14, 0.26);
  f.fade(['Br'], 1 - 0.6 * ease(t, 0.42, 0.5));

  // water #1 becomes the nucleophile
  const dir = [side, 0, 0];
  const O1 = f.atom('O1', 'O', mul(dir, keys(t, [[0.36, 8], [0.5, 3.3], [0.56, 2.3], [0.64, 1.48]])));
  const k = ease(t, 0.5, 0.64);
  const wd = [polar(dir, Y, 52, 0), polar(dir, Y, 52, 180)];
  const od = tetra(neg(dir), Y);
  const hd = [0, 1].map(i => norm(lerp(wd[i], od[i], k)));
  const dA = hd[0];
  const dOO = keys(t, [[0.6, 7], [0.74, 2.9], [0.78, 2.55]]) + keys(t, [[0.86, 0], [1, 3.6]]);
  const hA = t < 0.84 ? keys(t, [[0.78, 0.97], [0.84, 1.58]]) : dOO - 0.97;
  f.atom('HA', 'H', at(O1, dA, hA));
  f.atom('HB', 'H', at(O1, hd[1], 0.96));
  f.bond('O1', 'HB');
  breaking(f, 'O1', 'HA', t, 0.78, 0.84);
  forming(f, 'C', 'O1', t, 0.52, 0.62);
  // water #2 takes the proton
  const O2 = f.atom('O2', 'O', at(O1, dA, dOO));
  const e1 = perpTo(Z, dA);
  [90, 270].forEach((phi, i) => { addH(f, `O2h${i}`, O2, polar(dA, e1, 70, phi), 'O2', 0.96); });
  forming(f, 'O2', 'HA', t, 0.78, 0.84);

  f.charge('qC', 'C', '+', window01(t, 0.27, 0.54));
  f.charge('qO1', 'O1', '+', window01(t, 0.62, 0.81));
  f.charge('qO2', 'O2', '+', window01(t, 0.85, 1.1));
  f.charge('qBr', 'Br', '−', window01(t, 0.3, 1.1));
  f.lobe('p', C, X, { kind: 'p', color: 'empty', size: 0.95, opacity: window01(t, 0.24, 0.56) });

  f.arrow('ion', mid(C, Br), add(Br, [0, -0.35, 0]), [0, -0.8, 0], { opacity: window01(t, 0.03, 0.18) });
  f.arrow('att', add(O1, [-side * 0.45, 0.45, 0]), [side * 0.9, 0.25, 0], [0, 0.9, 0], { opacity: window01(t, 0.46, 0.56) });
  f.arrow('dp1', add(at(O2, dA, -0.35), [0, 0.4, 0]), add(f.p('HA'), [0, 0.22, 0]), [0, 0.6, 0], { opacity: window01(t, 0.7, 0.79) });
  f.arrow('dp2', mid(O1, f.p('HA')), add(O1, [0, -0.3, 0]), [0, -0.6, 0], { opacity: window01(t, 0.71, 0.79) });

  const sm = cip(C, Br, f.p('Pr1'), f.p('Et1'), f.p('Me'));
  const pr = cip(C, O1, f.p('Pr1'), f.p('Et1'), f.p('Me'));
  f.caption(`(${sm})-3-bromo-3-methylhexane in water`, 1 - ease(t, 0.12, 0.18));
  f.caption('Ionization: C–Br breaks on its own (slow step)', window01(t, 0.16, 0.28));
  f.caption('3° carbocation · flat, empty p orbital', window01(t, 0.3, 0.46));
  f.caption(`Water attacks the ${side < 0 ? 'back' : 'front'} face`, window01(t, 0.47, 0.6));
  f.caption('Oxonium ion (protonated alcohol)', window01(t, 0.64, 0.78));
  f.caption(`(${pr})-3-methylhexan-3-ol · the other face gives (${other(pr)}) → racemic`, ease(t, 0.86, 0.92));
  return f;
}

// ---------------------------------------------------------------- E2

function e2(t) {
  const f = new Frame();
  const L = keys(t, [[0.3, 1.54], [0.6, 1.34]]);
  const C2 = f.atom('C2', 'C', O0);
  const C3 = f.atom('C3', 'C', [L, 0, 0]);
  f.bond('C2', 'C3', keys(t, [[0.32, 1], [0.6, 2]]));
  const th = keys(t, [[0.28, TET], [0.6, 120]]);
  addGroup(f, 'CH3', 'Me2', 'C2', C2, polar(X, Y, th, keys(t, [[0.28, 60], [0.6, 90]])), X);
  addH(f, 'H2', C2, polar(X, Y, th, keys(t, [[0.28, 300], [0.6, 270]])), 'C2');
  const Br = f.atom('Br', 'Br', at(C2, polar(X, Y, keys(t, [[0.3, TET], [0.5, 90]]), 180), keys(t, [[0.32, 1.94], [0.48, 2.4], [0.66, 3.8], [1, 6.5]])));
  breaking(f, 'C2', 'Br', t, 0.38, 0.56);

  const nX = neg(X);
  addGroup(f, 'CH3', 'Me3', 'C3', C3, polar(nX, Y, th, keys(t, [[0.28, 120], [0.6, 90]])), X);
  addH(f, 'H3', C3, polar(nX, Y, th, keys(t, [[0.28, 240], [0.6, 270]])), 'C3');
  const dHa = polar(nX, Y, keys(t, [[0.3, TET], [0.5, 90]]), 0);
  const dH = keys(t, [[0.32, 1.09], [0.44, 1.35], [0.54, 1.95]]);
  const lift = keys(t, [[0.62, 0], [1, 3.5]]);
  const Ha = f.atom('Ha', 'H', at(C3, dHa, dH + lift));
  const O = f.atom('O', 'O', at(C3, dHa, dH + lift + keys(t, [[0, 6.5], [0.3, 1.95], [0.44, 1.3], [0.54, 0.97]])));
  addH(f, 'Oh', O, polar(dHa, Z, 75, 0), 'O', 0.96);
  breaking(f, 'C3', 'Ha', t, 0.36, 0.54);
  forming(f, 'O', 'Ha', t, 0.36, 0.54);

  f.charge('qO', 'O', '−', window01(t, 0, 0.44));
  f.charge('qBr', 'Br', '−', window01(t, 0.6, 1.1));
  const pOp = window01(t, 0.3, 0.6) * 0.85;
  f.lobe('p2', C2, Y, { kind: 'p', color: 'filled', size: 0.8, opacity: pOp });
  f.lobe('p3', C3, Y, { kind: 'p', color: 'filled', size: 0.8, opacity: pOp });
  f.plane('anti', [[-1.1, -2.7, 0], [2.7, -2.7, 0], [2.7, 2.7, 0], [-1.1, 2.7, 0]], { opacity: 0.22 * window01(t, 0, 0.3) });

  f.arrow('a1', add(O, [0.45, -0.15, 0]), add(Ha, [0.28, 0, 0]), [0.7, 0, 0], { opacity: window01(t, 0.16, 0.4) });
  f.arrow('a2', mid(C3, Ha), add(mid(C2, C3), [0, 0.18, 0]), [-0.2, 0.25, 0.45], { opacity: window01(t, 0.18, 0.4) });
  f.arrow('a3', mid(C2, Br), add(Br, [0.32, 0, 0]), [0.6, 0, 0], { opacity: window01(t, 0.2, 0.4) });

  const sm = cip(C2, Br, C3, f.p('Me2'), f.p('H2'));
  f.caption(`(${sm})-2-bromobutane + HO⁻ · H and Br anti-periplanar`, 1 - ease(t, 0.26, 0.32));
  f.caption('One step: C–H breaks, π bond forms, Br leaves', window01(t, 0.36, 0.56), 'ts');
  f.caption('trans-but-2-ene + H₂O + Br⁻', ease(t, 0.66, 0.72));
  return f;
}

// ---------------------------------------------------------------- E1

function e1(t) {
  const f = new Frame();
  const C2 = f.atom('C2', 'C', O0);
  const th = keys(t, [[0.08, TET], [0.3, 90]]);
  const C3 = f.atom('C3', 'C', at(C2, polar(X, Y, th, 90), keys(t, [[0.55, 1.54], [0.75, 1.34]])));
  f.bond('C2', 'C3', keys(t, [[0.56, 1], [0.72, 2]]));
  addGroup(f, 'CH3', 'Ma', 'C2', C2, polar(X, Y, th, 210), X);
  addGroup(f, 'CH3', 'Mb', 'C2', C2, polar(X, Y, th, 330), X);
  const Br = f.atom('Br', 'Br', [keys(t, [[0.08, 1.94], [0.2, 2.7], [0.32, 4], [0.45, 6.4]]), keys(t, [[0.3, 0], [0.45, -2.4]]), 0]);
  breaking(f, 'C2', 'Br', t, 0.12, 0.26);
  f.fade(['Br'], 1 - 0.6 * ease(t, 0.4, 0.5));

  const back = norm(sub(C2, C3)), r = perpTo(X, back);
  const th3 = keys(t, [[0.55, TET], [0.75, 120]]);
  addH(f, 'H3', C3, polar(back, r, th3, keys(t, [[0.55, 120], [0.75, 90]])), 'C3');
  addGroup(f, 'CH3', 'C4', 'C3', C3, polar(back, r, th3, keys(t, [[0.55, 240], [0.75, 270]])), back);
  const dHb = polar(back, r, keys(t, [[0.5, TET], [0.68, 90]]), 0);
  const dH = keys(t, [[0.52, 1.09], [0.6, 1.35], [0.68, 1.95]]);
  const lift = keys(t, [[0.72, 0], [1, 3.5]]);
  const Hb = f.atom('Hb', 'H', at(C3, dHb, dH + lift));
  const O = f.atom('O', 'O', at(C3, dHb, dH + lift + keys(t, [[0.3, 6.5], [0.5, 1.95], [0.6, 1.3], [0.68, 0.97]])));
  const e1v = perpTo(Y, dHb);
  addH(f, 'Oa', O, polar(dHb, e1v, 72, 90), 'O', 0.96);
  addH(f, 'Ob', O, polar(dHb, e1v, 72, 270), 'O', 0.96);
  breaking(f, 'C3', 'Hb', t, 0.54, 0.66);
  forming(f, 'O', 'Hb', t, 0.54, 0.66);

  f.charge('qC', 'C2', '+', window01(t, 0.24, 0.6));
  f.charge('qO', 'O', '+', window01(t, 0.68, 1.1));
  f.charge('qBr', 'Br', '−', window01(t, 0.26, 1.1));
  f.lobe('p2', C2, X, { kind: 'p', color: 'empty', size: 0.95, opacity: window01(t, 0.22, 0.6) });
  f.lobe('p3', C3, X, { kind: 'p', color: 'filled', size: 0.75, opacity: window01(t, 0.58, 0.7) * 0.8 });

  f.arrow('ion', mid(C2, Br), add(Br, [0, -0.35, 0]), [0, -0.8, 0], { opacity: window01(t, 0.03, 0.18) });
  f.arrow('dp', add(at(O, dHb, -0.35), [0, 0.4, 0]), add(Hb, [0, 0.25, 0]), [0, 0.6, 0], { opacity: window01(t, 0.46, 0.58) });
  f.arrow('pi', mid(C3, Hb), add(mid(C2, C3), [0.2, 0, 0]), [0.2, -0.5, 0], { opacity: window01(t, 0.48, 0.58) });

  f.caption('2-bromo-2-methylbutane · H₂O, heat', 1 - ease(t, 0.12, 0.18));
  f.caption('Ionization (slow step), same as SN1', window01(t, 0.16, 0.28));
  f.caption('3° carbocation · a neighbouring C–H lines up with the empty p orbital', window01(t, 0.3, 0.48));
  f.caption('Weak base removes a β-H; its electrons become the π bond', window01(t, 0.52, 0.66));
  f.caption('2-methylbut-2-ene · Zaitsev (more substituted) alkene', ease(t, 0.74, 0.8));
  return f;
}

// ---------------------------------------------------------------- 1,2-hydride shift

function hydride(t) {
  const f = new Frame();
  const C2 = f.atom('C2', 'C', O0);
  const th2 = keys(t, [[0.45, 90], [0.66, TET]]);
  const C3 = f.atom('C3', 'C', at(C2, polar(X, Y, th2, 90), 1.54));
  f.bond('C2', 'C3');
  addGroup(f, 'CH3', 'C1', 'C2', C2, polar(X, Y, th2, 210), X);
  addH(f, 'H2', C2, polar(X, Y, th2, 330), 'C2');
  const back = norm(sub(C2, C3)), r = perpTo(X, back);
  const th3 = keys(t, [[0.42, TET], [0.66, 120]]);
  addGroup(f, 'CH3', 'Ma', 'C3', C3, polar(back, r, th3, keys(t, [[0.42, 120], [0.66, 90]])), back);
  addGroup(f, 'CH3', 'Mb', 'C3', C3, polar(back, r, th3, keys(t, [[0.42, 240], [0.66, 270]])), back);
  const S0 = at(C3, polar(back, r, TET, 0), 1.09);
  const E0 = at(C2, X, 1.09);
  const M = add(mid(C2, C3), mul(X, 1.05));
  const ctrl = sub(mul(M, 2), mul(add(S0, E0), 0.5));
  const Hm = f.atom('Hm', 'H', bez(S0, ctrl, E0, ease(t, 0.3, 0.62)));
  breaking(f, 'C3', 'Hm', t, 0.36, 0.56);
  forming(f, 'C2', 'Hm', t, 0.36, 0.56);

  f.charge('q2', 'C2', '+', 1 - ease(t, 0.4, 0.5));
  f.charge('q3', 'C3', '+', ease(t, 0.5, 0.6));
  f.lobe('p2', C2, X, { kind: 'p', color: 'empty', size: 0.9, opacity: 1 - ease(t, 0.35, 0.55) });
  f.lobe('p3', C3, X, { kind: 'p', color: 'empty', size: 0.9, opacity: ease(t, 0.45, 0.65) });
  f.arrow('a', mid(C3, Hm), add(C2, [0.55, 0.15, 0]), [0.7, 0, 0.1], { opacity: window01(t, 0.1, 0.32) });

  f.caption('2° carbocation next to a carbon that has an H', 1 - ease(t, 0.28, 0.34));
  f.caption('1,2-hydride shift: H moves over with both of its electrons', window01(t, 0.36, 0.58));
  f.caption('Now a 3° carbocation: more stable', ease(t, 0.64, 0.7));
  return f;
}

// ---------------------------------------------------------------- alkene ring

// 1-substituted cyclopentene lying in the xz plane; the π bond is along ±y.
const RING = { C3: [1.189, 0, -0.386], C4: [0, 0, -1.25], C5: [-1.189, 0, -0.386] };

/** Substituent direction: in the ring plane (m = 0) tilting to top (+1) or bottom (−1). */
export function sDir(out, m) {
  return norm(add(mul(out, 1 - 0.42 * Math.abs(m)), [0, 0.82 * m, 0]));
}

function ring(f, { half = 0.67, y = 0, m1 = 0, m2 = 0, sub1 = 'CH3', sub2 = 'H', id1 = 'Me', id2 = 'H2' } = {}) {
  const up = [0, y, 0];
  const C1 = f.atom('C1', 'C', add([-half, 0, 1.011], up));
  const C2 = f.atom('C2', 'C', add([half, 0, 1.011], up));
  for (const [id, p] of Object.entries(RING)) f.atom(id, 'C', add(p, up));
  f.bond('C2', 'C3'); f.bond('C3', 'C4'); f.bond('C4', 'C5'); f.bond('C5', 'C1');
  for (const id of ['C3', 'C4', 'C5']) {
    const P = f.p(id), out = norm([P[0], 0, P[2]]);
    addH(f, `${id}u`, P, sDir(out, 1), id);
    addH(f, `${id}d`, P, sDir(out, -1), id);
  }
  const out1 = norm([C1[0], 0, C1[2]]), out2 = norm([C2[0], 0, C2[2]]);
  addGroup(f, sub1, id1, 'C1', C1, sDir(out1, m1), Y);
  addGroup(f, sub2, id2, 'C2', C2, sDir(out2, m2), Y);
  return { C1, C2, out1, out2 };
}

function piLobes(f, C1, C2, opacity) {
  f.lobe('pi1', C1, Y, { kind: 'p', color: 'filled', size: 0.75, opacity });
  f.lobe('pi2', C2, Y, { kind: 'p', color: 'filled', size: 0.75, opacity });
}

// ---------------------------------------------------------------- HBr (Markovnikov)

function hbr(t) {
  const f = new Frame();
  const k2 = ease(t, 0.24, 0.4), k1 = ease(t, 0.64, 0.78);
  const { C1, C2, out1, out2 } = ring(f, { half: keys(t, [[0.24, 0.67], [0.42, 0.77]]), m1: -k1, m2: -k2 });
  f.bond('C1', 'C2', keys(t, [[0.22, 2], [0.38, 1]]));
  const top1 = sDir(out1, 1), top2 = sDir(out2, 1);
  const Ha = f.atom('Ha', 'H', at(C2, norm(lerp(Y, top2, k2)), keys(t, [[0, 6], [0.2, 2.3], [0.3, 1.5], [0.38, 1.09]])));
  const P50 = at(at(C2, top2, 1.09), Y, 4.6);
  const Br = f.atom('Br', 'Br', t < 0.5
    ? at(Ha, Y, keys(t, [[0.2, 1.41], [0.3, 1.9], [0.4, 3.2], [0.5, 4.6]]))
    : keys(t, [[0.5, P50], [0.6, add(C1, [-1.4, 3.3, 1.4])], [0.7, at(C1, norm(lerp(Y, top1, 0.5)), 2.5)], [0.78, at(C1, top1, 1.94)]]));
  breaking(f, 'Ha', 'Br', t, 0.26, 0.36);
  forming(f, 'C2', 'Ha', t, 0.24, 0.36);
  forming(f, 'C1', 'Br', t, 0.68, 0.76);

  f.charge('dH', 'Ha', 'δ+', window01(t, 0, 0.22));
  f.charge('dBr', 'Br', 'δ−', window01(t, 0, 0.22));
  f.charge('q1', 'C1', '+', window01(t, 0.37, 0.72));
  f.charge('qBr', 'Br', '−', window01(t, 0.38, 0.7));
  piLobes(f, C1, C2, window01(t, 0, 0.26) * 0.75);
  f.lobe('p1', C1, Y, { kind: 'p', color: 'empty', size: 0.95, opacity: window01(t, 0.36, 0.72) });

  f.arrow('a1', add(mid(C1, C2), [0, 0.5, 0]), add(Ha, [-0.15, -0.15, 0]), [-0.3, 0.4, 0.5], { opacity: window01(t, 0.1, 0.3) });
  f.arrow('a2', mid(Ha, Br), add(Br, [0.32, 0, 0]), [0.6, 0, 0], { opacity: window01(t, 0.12, 0.3) });
  f.arrow('a3', add(Br, [0, -0.35, 0]), add(C1, [0, 0.6, 0]), [-0.4, 0.2, 0.5], { opacity: window01(t, 0.62, 0.74) });

  f.caption('1-methylcyclopentene + HBr', 1 - ease(t, 0.16, 0.22));
  f.caption('π electrons grab H⁺ → H goes to C2 so the + lands on C1 (3°)', window01(t, 0.24, 0.36));
  f.caption('3° carbocation intermediate', window01(t, 0.38, 0.58));
  f.caption('Br⁻ attacks the carbocation', window01(t, 0.6, 0.76));
  f.caption('1-bromo-1-methylcyclopentane · Markovnikov', ease(t, 0.8, 0.86));
  return f;
}

// ---------------------------------------------------------------- Br2 (anti)

function br2(t) {
  const f = new Frame();
  const m1 = keys(t, [[0.22, 0], [0.35, -0.45], [0.66, -0.45], [0.78, 1]]);
  const m2 = keys(t, [[0.22, 0], [0.35, -0.45], [0.66, -0.45], [0.78, -1]]);
  const { C1, C2, out1, out2 } = ring(f, { half: keys(t, [[0.22, 0.67], [0.4, 0.77]]), m1, m2 });
  f.bond('C1', 'C2', keys(t, [[0.2, 2], [0.33, 1]]));
  const M = mid(C1, C2);
  const bridge = at(M, Y, keys(t, [[0, 6], [0.2, 2.7], [0.33, 1.86]]));
  const Ba = f.atom('Ba', 'Br', lerp(bridge, at(C2, sDir(out2, 1), 1.94), ease(t, 0.66, 0.78)));
  const P42 = at(at(M, Y, 1.86), Y, 4.6);
  const Bb = f.atom('Bb', 'Br', t < 0.42
    ? at(Ba, Y, keys(t, [[0.2, 2.28], [0.32, 2.9], [0.42, 4.6]]))
    : keys(t, [[0.42, P42], [0.5, add(C1, [-2.4, 2.6, 2.6])], [0.58, add(C1, [-2.0, -1.6, 2.4])], [0.66, add(C1, [-0.5, -2.9, 0.6])], [0.76, at(C1, sDir(out1, -1), 1.94)]]));
  breaking(f, 'Ba', 'Bb', t, 0.3, 0.4);
  if (t > 0.22 && t < 0.33) f.bond('C1', 'Ba', 1, { partial: true });
  else if (t >= 0.33 && t <= 0.66) f.bond('C1', 'Ba');
  else if (t > 0.66 && t < 0.74) f.bond('C1', 'Ba', 1, { partial: true });
  forming(f, 'C2', 'Ba', t, 0.22, 0.33);
  forming(f, 'C1', 'Bb', t, 0.68, 0.76);

  f.charge('dA', 'Ba', 'δ+', window01(t, 0.06, 0.22));
  f.charge('dB', 'Bb', 'δ−', window01(t, 0.06, 0.22));
  f.charge('qA', 'Ba', '+', window01(t, 0.33, 0.68));
  f.charge('qB', 'Bb', '−', window01(t, 0.38, 0.72));
  piLobes(f, C1, C2, window01(t, 0, 0.24) * 0.75);

  f.arrow('a1', add(M, [0, 0.5, 0]), add(Ba, [0, -0.3, 0.1]), [0, 0.2, 0.8], { opacity: window01(t, 0.08, 0.26) });
  f.arrow('a2', mid(Ba, Bb), add(Bb, [0.32, 0, 0]), [0.7, 0, 0], { opacity: window01(t, 0.1, 0.26) });
  f.arrow('a3', add(Bb, [0.2, 0.3, 0]), add(C1, [0, -0.55, 0]), [0, 0, 0.7], { opacity: window01(t, 0.6, 0.72) });
  f.arrow('a4', mid(C1, Ba), add(Ba, [-0.3, 0.1, 0]), [-0.5, 0.1, 0.3], { opacity: window01(t, 0.6, 0.72) });

  f.caption('1-methylcyclopentene + Br₂', 1 - ease(t, 0.14, 0.2));
  f.caption('Bromonium ion: one Br bridges both carbons (top face blocked)', window01(t, 0.34, 0.56));
  f.caption('Br⁻ has to come in from the bottom face', window01(t, 0.58, 0.72));
  f.caption('trans-1,2-dibromo-1-methylcyclopentane (+ enantiomer) · anti addition', ease(t, 0.8, 0.86));
  return f;
}

// ---------------------------------------------------------------- hydroboration–oxidation

function bh3(t) {
  const f = new Frame();
  const k = ease(t, 0.3, 0.45);
  const { C1, C2, out1, out2 } = ring(f, { half: keys(t, [[0.26, 0.67], [0.44, 0.77]]), m1: -k, m2: -k });
  f.bond('C1', 'C2', keys(t, [[0.25, 2], [0.42, 1]]));
  const top1 = sDir(out1, 1), top2 = sDir(out2, 1);
  const B = at(C2, norm(lerp(Y, top2, ease(t, 0.28, 0.45))), keys(t, [[0, 6], [0.2, 2.6], [0.32, 1.95], [0.44, 1.58]]));
  const Hstart = at(B, norm(sub(add(C1, [0, 1.3, 0]), B)), 1.19);
  const Ht = f.atom('Ht', 'H', lerp(Hstart, at(C1, top1, 1.09), ease(t, 0.28, 0.44)));
  const showB = 1 - ease(t, 0.55, 0.7), showO = ease(t, 0.58, 0.72);
  if (showB > 0.01) {
    f.atom('B', 'B', B, { opacity: showB });
    const dref = norm(lerp(norm(sub(Ht, B)), norm(sub(C2, B)), ease(t, 0.3, 0.45)));
    const n = norm(cross(dref, Z));
    [120, -120].forEach((a, i) => {
      f.atom(`Bh${i}`, 'H', at(B, rotate(dref, n, a * DEG), 1.19), { opacity: showB });
      f.bond('B', `Bh${i}`, 1, { opacity: showB });
    });
    breaking(f, 'B', 'Ht', t, 0.28, 0.42);
    forming(f, 'C2', 'B', t, 0.24, 0.4, { opacity: showB });
    f.lobe('pB', B, n, { kind: 'p', color: 'empty', size: 0.7, opacity: window01(t, 0, 0.28) });
  }
  if (showO > 0.01) {
    const O = f.atom('O', 'O', at(C2, top2, 1.43), { opacity: showO });
    f.atom('Oh', 'H', at(O, polar(top2, perpTo(X, top2), 70, 0), 0.96), { opacity: showO });
    f.bond('C2', 'O', 1, { opacity: showO }); f.bond('O', 'Oh', 1, { opacity: showO });
  }
  forming(f, 'C1', 'Ht', t, 0.28, 0.42);

  f.charge('d1', 'C1', 'δ+', window01(t, 0.26, 0.42));
  f.charge('dH', 'Ht', 'δ−', window01(t, 0.26, 0.42));
  piLobes(f, C1, C2, window01(t, 0, 0.28) * 0.75);
  f.arrow('a1', add(mid(C1, C2), [0, 0.5, 0]), add(B, [0, -0.35, 0]), [0.3, 0.2, 0.6], { opacity: window01(t, 0.1, 0.28) });
  f.arrow('a2', mid(B, Ht), add(C1, [0, 0.55, 0]), [0, 0.3, 0.5], { opacity: window01(t, 0.12, 0.28) });

  f.caption('1-methylcyclopentene + BH₃ (in THF)', 1 - ease(t, 0.14, 0.2));
  f.caption('One 4-centre step: B → less substituted C, H → more substituted C, same face', window01(t, 0.26, 0.44), 'ts');
  f.caption('Organoborane: H and B added syn', window01(t, 0.46, 0.56));
  f.caption('H₂O₂, NaOH: B is swapped for OH in the same position', window01(t, 0.58, 0.76));
  f.caption('trans-2-methylcyclopentan-1-ol (+ enantiomer) · anti-Markovnikov, syn', ease(t, 0.8, 0.86));
  return f;
}

// ---------------------------------------------------------------- catalytic hydrogenation

function h2(t) {
  const f = new Frame();
  const ys = -2.6;
  let i = 0;
  for (let gx = -3; gx <= 3.01; gx += 1.5) for (let gz = -2.2; gz <= 2.81; gz += 1.5) f.atom(`pt${i++}`, 'Pt', [gx, ys, gz]);
  f.plane('metal', [[-3.8, ys - 0.62, -2.9], [3.8, ys - 0.62, -2.9], [3.8, ys - 0.62, 3.5], [-3.8, ys - 0.62, 3.5]], { color: 'metal', opacity: 0.5 });
  const ry = keys(t, [[0.2, 1.4], [0.36, -0.25], [0.76, -0.25], [0.95, 1.4]]);
  const k1 = ease(t, 0.4, 0.52), k2 = ease(t, 0.56, 0.68);
  const { C1, C2, out1, out2 } = ring(f, { half: keys(t, [[0.4, 0.67], [0.68, 0.77]]), y: ry, m1: k1, m2: k2, sub2: 'CH3', id1: 'Me1', id2: 'Me2' });
  f.bond('C1', 'C2', keys(t, [[0.42, 2], [0.66, 1]]));
  const hy = ys + 0.95;
  const Hc = keys(t, [[0, [0, hy + 1.8, 4.8]], [0.14, [0, hy, 1.1]]]);
  const SA = [-0.75, hy, 1.0], SB = [0.75, hy, 1.0];
  const split = ease(t, 0.15, 0.25);
  const Ha = lerp(lerp(sub(Hc, [0.37, 0, 0]), SA, split), at(C1, sDir(out1, -1), 1.09), ease(t, 0.4, 0.5));
  const Hb = lerp(lerp(add(Hc, [0.37, 0, 0]), SB, split), at(C2, sDir(out2, -1), 1.09), ease(t, 0.56, 0.66));
  f.atom('Ha', 'H', Ha); f.atom('Hb', 'H', Hb);
  breaking(f, 'Ha', 'Hb', t, 0.15, 0.22);
  forming(f, 'C1', 'Ha', t, 0.4, 0.48);
  forming(f, 'C2', 'Hb', t, 0.56, 0.64);
  piLobes(f, C1, C2, window01(t, 0, 0.42) * 0.75);

  f.caption('1,2-dimethylcyclopentene + H₂ over Pt', 1 - ease(t, 0.12, 0.18));
  f.caption('H₂ splits into H atoms on the metal surface', window01(t, 0.14, 0.3));
  f.caption('The alkene lies flat on the metal, bottom face down', window01(t, 0.31, 0.4));
  f.caption('Both H atoms add from below, one after the other', window01(t, 0.42, 0.7));
  f.caption('cis-1,2-dimethylcyclopentane · syn addition', ease(t, 0.8, 0.86));
  return f;
}

// ---------------------------------------------------------------- catalogue

export const MECHS = [
  {
    id: 'sn2', group: 'Substitution & elimination', title: 'SN2', sub: 'Backside attack, one step',
    frame: sn2, duration: 13, fit: 3.9, center: [0, 0, 0], view: [14, -16],
    energy: [[0, 22, 'start', 'R–Br + HO⁻'], [0.5, 84, 'ts'], [1, 6, 'end', 'R–OH + Br⁻']],
    steps: [
      [0, 0.28, 'The players', 'A 2° alkyl bromide and hydroxide, a strong nucleophile. The C–Br bond is polar, so carbon is δ+. The empty σ* orbital of C–Br (the purple lobe) sticks out of the back of the carbon, directly opposite Br.'],
      [0.28, 0.46, 'Backside attack', 'Hydroxide’s lone pair goes for that back lobe. The new C–O bond starts forming at the same moment the C–Br bond starts breaking.'],
      [0.46, 0.56, 'Transition state', 'Carbon is briefly bonded to five groups: O and Br are each half-bonded, and the other three lie flat in one plane. This crowded TS is why bulky 3° substrates can’t do SN2.'],
      [0.56, 0.74, 'Umbrella flip', 'The three groups snap through to the other side like an umbrella in the wind. This is Walden inversion.'],
      [0.74, 1, 'Product', 'Br⁻ leaves. The configuration is inverted: (S) becomes (R). Everything happened in one step, so rate = k[RX][Nu⁻].'],
    ],
    facts: ['Rate = k[RX][Nu⁻] (bimolecular)', 'One concerted step, no intermediate', '100% inversion of configuration', 'Methyl > 1° > 2° ≫ 3° (3° doesn’t react)', 'Strong nucleophile; polar aprotic solvent (DMSO, DMF, acetone) speeds it up', 'Leaving group: I⁻ > Br⁻ > Cl⁻ ≫ F⁻; OTs is excellent'],
  },
  {
    id: 'sn1', group: 'Substitution & elimination', title: 'SN1', sub: 'Carbocation, then attack',
    frame: sn1, duration: 18, fit: 4.7, center: [0, 0, 0], view: [14, -16], options: 'face',
    energy: [[0, 20, 'start', 'R–Br'], [0.2, 88, 'ts'], [0.38, 60, 'int', 'R⁺'], [0.55, 71, 'ts'], [0.68, 36, 'int', 'R–OH₂⁺'], [0.8, 45, 'ts'], [1, 10, 'end', 'R–OH']],
    steps: [
      [0, 0.12, 'Start', 'A 3° alkyl bromide sitting in water. Water is a weak nucleophile, far too weak to push Br out, so the substrate has to fall apart on its own first.'],
      [0.12, 0.3, 'Ionization (slow step)', 'The C–Br bond breaks heterolytically: Br leaves with both electrons. This is the rate-determining step, and only the substrate is involved, so rate = k[RX].'],
      [0.3, 0.46, 'Carbocation', 'The carbon is now sp² and flat, with an empty p orbital above and below the plane. Three alkyl groups stabilize it (hyperconjugation), which is why 3° works best. Rearrangements can happen at this point.'],
      [0.46, 0.64, 'Nucleophile attacks', 'Water can hit either lobe of the empty p orbital. Attacking from the back gives inversion, from the front gives retention. Flip the toggle to compare: equal amounts of both form, so the product is racemic.'],
      [0.64, 0.78, 'Oxonium ion', 'The new C–O bond leaves oxygen with three bonds and a positive charge: a protonated alcohol.'],
      [0.78, 1, 'Deprotonation', 'A second water molecule pulls off H⁺, giving the neutral alcohol and H₃O⁺.'],
    ],
    facts: ['Rate = k[RX] (unimolecular)', 'Carbocation intermediate: rearrangements possible', 'Racemization: both faces get attacked', '3° > 2° (1° and methyl don’t)', 'Weak nucleophile, polar protic solvent (H₂O, ROH)', 'Usually competes with E1'],
  },
  {
    id: 'e2', group: 'Substitution & elimination', title: 'E2', sub: 'Anti-periplanar, one step',
    frame: e2, duration: 13, fit: 4.2, center: [0.7, 0, 0], view: [16, -28],
    views: [['Newman view', [6, -84]], ['Side view', [16, -28]]],
    energy: [[0, 22, 'start', 'R–Br + HO⁻'], [0.45, 80, 'ts'], [1, 12, 'end', 'alkene']],
    steps: [
      [0, 0.28, 'Line up anti-periplanar', 'E2 needs the β-H and the leaving group anti-periplanar: on opposite sides of the C–C bond and in the same plane (180° dihedral, shaded). Tap “Newman view” to look straight down the C–C bond.'],
      [0.28, 0.4, 'Everything moves at once', 'The base pulls off the β-H. Those C–H electrons swing over to make the π bond, and Br leaves with its pair. Three arrows, one step.'],
      [0.4, 0.58, 'Transition state', 'p orbitals grow on both carbons. Because the C–H and C–Br bonds started out parallel, the new p orbitals are parallel too and overlap into a π bond.'],
      [0.58, 1, 'Product', 'trans-But-2-ene. Which H was anti to Br decides the alkene geometry. Zaitsev: the more substituted alkene wins, unless the base is bulky (then Hofmann).'],
    ],
    facts: ['Rate = k[RX][base]', 'Concerted; β-H and LG must be anti-periplanar', 'Strong base; heat helps', '3° > 2° > 1°', 'Zaitsev with small bases (NaOEt, NaOH)', 'Hofmann (less substituted) with bulky bases (t-BuOK)', 'On cyclohexanes, H and LG must both be axial'],
  },
  {
    id: 'e1', group: 'Substitution & elimination', title: 'E1', sub: 'Carbocation, then lose H⁺',
    frame: e1, duration: 16, fit: 4.4, center: [0, 0, 0.7], view: [18, -30],
    energy: [[0, 24, 'start', 'R–Br'], [0.2, 88, 'ts'], [0.38, 60, 'int', 'R⁺'], [0.6, 70, 'ts'], [1, 18, 'end', 'alkene']],
    steps: [
      [0, 0.12, 'Start', 'A 3° alkyl bromide with a weak base (water) and heat.'],
      [0.12, 0.3, 'Ionization (slow step)', 'Same first step as SN1: Br leaves on its own and a carbocation forms. Rate = k[RX].'],
      [0.3, 0.5, 'Carbocation', 'Look at the C–H bond on the neighbouring carbon: it lines up with the empty p orbital. That overlap (hyperconjugation) both stabilizes the cation and weakens the C–H bond.'],
      [0.5, 0.68, 'Lose a β-H', 'A weak base takes that H⁺. The C–H electrons drop straight into the empty p orbital and become the π bond.'],
      [0.68, 1, 'Product', '2-Methylbut-2-ene, the more substituted (Zaitsev) alkene. SN1 is happening alongside; heat tips the balance toward E1.'],
    ],
    facts: ['Rate = k[RX]', 'Carbocation intermediate: rearrangements possible', 'Zaitsev product (more substituted alkene)', 'Weak base, protic solvent, heat', '3° > 2°', 'Competes with SN1; heat favours E1'],
  },
  {
    id: 'hydride', group: 'Carbocations', title: 'Hydride shift', sub: '2° → 3° carbocation',
    frame: hydride, duration: 10, fit: 3.3, center: [0.3, 0, 0.75], view: [18, -30],
    energy: [[0, 60, 'start', '2° R⁺'], [0.48, 74, 'ts'], [1, 34, 'end', '3° R⁺']],
    steps: [
      [0, 0.3, 'A 2° carbocation', 'The positive carbon has an empty p orbital. The carbon next door is 3° and has an H whose C–H bond lines up with that empty orbital.'],
      [0.3, 0.6, '1,2-Hydride shift', 'The H slides over to the cationic carbon, bringing both of its bonding electrons (it moves as H:⁻). Arrows show electrons, so the arrow starts at the C–H bond.'],
      [0.6, 1, 'A more stable cation', 'The positive charge now sits on the 3° carbon. Any product forms from this rearranged cation, which is why SN1, E1 and HX additions can give “unexpected” skeletons.'],
    ],
    facts: ['Stability: 3° > 2° > 1° > methyl', 'Shifts only happen if they give a more stable (or equal) cation', '1,2-hydride or 1,2-methyl shifts', 'Watch for them in SN1, E1, HX addition, acid hydration', 'No shifts in SN2, E2, oxymercuration, hydroboration, Br₂'],
  },
  {
    id: 'hbr', group: 'Alkene additions', title: 'HBr', sub: 'Markovnikov addition',
    frame: hbr, duration: 15, fit: 4.1, center: [0, 0.5, 0.3], view: [20, -30],
    energy: [[0, 30, 'start', 'alkene + HBr'], [0.3, 82, 'ts'], [0.5, 55, 'int', 'R⁺'], [0.7, 63, 'ts'], [1, 10, 'end', 'R–Br']],
    steps: [
      [0, 0.22, 'Start', '1-Methylcyclopentene and HBr. The π bond (green lobes above and below the ring) is electron-rich, so it acts as the nucleophile. The H of HBr is δ+.'],
      [0.22, 0.38, 'Protonation (slow step)', 'The π electrons grab H⁺. H goes to C2, the carbon with more H’s, so the positive charge ends up on C1, a 3° carbon. Putting H on C1 instead would make a less stable 2° cation.'],
      [0.38, 0.6, 'Carbocation', 'Flat and sp², with an empty p orbital. Because it’s a carbocation, rearrangements are possible with other alkenes.'],
      [0.6, 0.78, 'Br⁻ attacks', 'Bromide adds to the carbocation. Either face works, so this step isn’t stereospecific.'],
      [0.78, 1, 'Product', '1-Bromo-1-methylcyclopentane: H on the less substituted carbon, Br on the more substituted one. That’s Markovnikov’s rule.'],
    ],
    facts: ['Markovnikov: X ends up on the more substituted C', 'Carbocation intermediate: rearrangements possible', 'Not stereospecific (both faces)', 'Works for HCl, HBr, HI', 'HBr with ROOR (peroxides): anti-Markovnikov, radical'],
  },
  {
    id: 'br2', group: 'Alkene additions', title: 'Br₂', sub: 'Bromonium ion, anti addition',
    frame: br2, duration: 16, fit: 4.2, center: [0, 0.3, 0.3], view: [18, -30],
    energy: [[0, 30, 'start', 'alkene + Br₂'], [0.28, 78, 'ts'], [0.47, 50, 'int', 'bromonium'], [0.66, 64, 'ts'], [1, 8, 'end', 'dibromide']],
    steps: [
      [0, 0.2, 'Br₂ approaches', 'The π electrons push into Br–Br, polarizing it: the near Br becomes δ+.'],
      [0.2, 0.36, 'Bromonium ion', 'One Br bonds to both carbons at once, making a 3-membered ring with + on Br, and Br⁻ is released. No free carbocation, so no rearrangements.'],
      [0.36, 0.6, 'The top face is blocked', 'The bulky bromonium sits on top, so the incoming Br⁻ has to travel around to the bottom face.'],
      [0.6, 0.78, 'Backside opening', 'Br⁻ attacks C1 from below (SN2-like) and the ring opens. C1’s methyl flips up as it’s attacked.'],
      [0.78, 1, 'Product', 'trans-1,2-Dibromo-1-methylcyclopentane: the two Br’s are on opposite faces (anti addition). Attack at either carbon gives a racemic mixture.'],
    ],
    facts: ['Anti addition (Br’s on opposite faces)', 'Bromonium intermediate: no rearrangements', 'Solvent: CH₂Cl₂ or CCl₄', 'In water → halohydrin: OH on the more substituted C', 'Cl₂ behaves the same (chloronium)'],
  },
  {
    id: 'bh3', group: 'Alkene additions', title: 'Hydroboration', sub: 'Anti-Markovnikov, syn',
    frame: bh3, duration: 16, fit: 4.0, center: [0.2, 0.5, 0.4], view: [20, -32],
    energy: [[0, 34, 'start', 'alkene + BH₃'], [0.32, 74, 'ts'], [0.5, 16, 'int', 'R–BH₂'], [0.66, 26, 'ts'], [1, 4, 'end', 'R–OH']],
    steps: [
      [0, 0.24, 'BH₃ approaches', 'Boron has only 6 electrons and an empty p orbital (purple), so it’s an electrophile. The π bond attacks B.'],
      [0.24, 0.46, 'One 4-centre step', 'B bonds to C2 (less substituted, less crowded) while an H moves from B to C1 at the same time. C1 carries the δ+ in the TS, and the more substituted carbon handles δ+ better. No carbocation forms, so no rearrangements.'],
      [0.46, 0.56, 'Organoborane', 'H and B added to the same face: syn addition.'],
      [0.56, 0.78, 'Oxidation', 'H₂O₂ and NaOH replace B with OH, keeping exactly the same position (retention).'],
      [0.78, 1, 'Product', 'trans-2-Methylcyclopentan-1-ol (+ enantiomer). OH sits on the less substituted carbon (anti-Markovnikov), and H and OH were added syn, which puts OH trans to the methyl.'],
    ],
    facts: ['Anti-Markovnikov: OH on the less substituted C', 'Syn addition of H and OH', 'Concerted, no carbocation: no rearrangements', 'Reagents: 1) BH₃·THF  2) H₂O₂, NaOH'],
  },
  {
    id: 'h2', group: 'Alkene additions', title: 'Hydrogenation', sub: 'H₂ on a metal surface, syn',
    frame: h2, duration: 15, fit: 4.6, center: [0, -0.9, 0.4], view: [16, -26],
    energy: [[0, 40, 'start', 'alkene + H₂'], [0.24, 58, 'ts'], [0.38, 34, 'int', 'on Pt'], [0.47, 50, 'ts'], [0.56, 30, 'int', ''], [0.63, 44, 'ts'], [1, 6, 'end', 'alkane']],
    steps: [
      [0, 0.3, 'H₂ on the metal', 'H₂ lands on the Pt surface and its H–H bond breaks. The H atoms stay stuck to the metal.'],
      [0.3, 0.4, 'The alkene lands', 'The alkene lies flat on the surface, one face pressed against the metal.'],
      [0.4, 0.7, 'H atoms add from below', 'Two H atoms transfer one at a time, both from the metal side. Both methyls get pushed up.'],
      [0.7, 1, 'Product', 'cis-1,2-Dimethylcyclopentane: both H’s on the same face (syn addition). It leaves the surface.'],
    ],
    facts: ['H₂ with Pt, Pd or Ni', 'Syn addition (both H’s from the metal side)', 'No rearrangements', 'Alkene → alkane; alkynes are reduced too'],
  },
];

export const mechById = id => MECHS.find(m => m.id === id) || MECHS[0];
