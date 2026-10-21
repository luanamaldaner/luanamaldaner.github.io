// Guided lecture · Ch 7 · Alkyl halides: substitution & elimination (follows Dr. Lopez's slides, sections 7.1–7.13)

// ---------------------------------------------------------------- drawings for the figures (orgo/draw.js skeletal specs)
// Coordinates in bond lengths, y up. Unlabeled atoms are carbons. K = cos 30°.
const K = 0.866;
const mark = (x, y, t) => [x, y, t, { align: 'middle', hl: true }]; // pink α / β / δ annotation (no bonds)
const chg = (x, y, t = '⊕') => [x, y, t, { align: 'middle' }]; // a formal charge next to an atom (circled, Klein style: ⊕ / ⊖)
const hexV = (cx = 0, cy = 0) => [30, 90, 150, 210, 270, 330].map(a => [cx + Math.round(Math.cos(a * Math.PI / 180) * 1000) / 1000, cy + Math.round(Math.sin(a * Math.PI / 180) * 1000) / 1000]);
const HEX = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]];
// cyclopentane: vertex 0 on top
const PENT = [[0, 0.851], [0.809, 0.263], [0.5, -0.688], [-0.5, -0.688], [-0.809, 0.263]];
const PB = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]];
const mol = (name, atoms, bonds, arrows) => ({ name, atoms, bonds, ...(arrows ? { arrows } : {}) });

const butane4 = [[0, 0], [K, 0.5], [2 * K, 0], [3 * K, 0.5]];
const M = {
  bromomethane: mol('bromomethane', [[0, 0, 'H3C', { align: 'end' }], [1, 0, 'Br', { hl: true }]], [[0, 1, 1, { hl: true }]]),
  bromoethane: mol('bromoethane', [[0, 0], [K, 0.5], [2 * K, 0, 'Br', { hl: true }]], [[0, 1], [1, 2, 1, { hl: true }]]),
  chloroethane: mol('chloroethane', [[0, 0], [K, 0.5], [2 * K, 0, 'Cl', { hl: true }]], [[0, 1], [1, 2, 1, { hl: true }]]),
  ethanol: mol('ethanol', [[0, 0], [K, 0.5], [2 * K, 0, 'OH', { hl: true }]], [[0, 1], [1, 2, 1, { hl: true }]]),
  bromopropane: mol('1-bromopropane', [[0, 0], [K, 0.5], [2 * K, 0], [3 * K, 0.5, 'Br', { hl: true }]], [[0, 1], [1, 2], [2, 3, 1, { hl: true }]]),
  bromobutane: mol('1-bromobutane', [...butane4, [4 * K, 0, 'Br', { hl: true }]], [[0, 1], [1, 2], [2, 3], [3, 4, 1, { hl: true }]]),
  pentanenitrile: mol('pentanenitrile', [...butane4, [4 * K, 0, 'CN', { hl: true }]], [[0, 1], [1, 2], [2, 3], [3, 4, 1, { hl: true }]]),
  ipBr: mol('2-bromopropane', [[0, 0], [K, 0.5], [2 * K, 0], [K, 1.5, 'Br', { align: 'middle', hl: true }]], [[0, 1], [1, 2], [1, 3, 1, { hl: true }]]),
  secBuBr: mol('2-bromobutane', [...butane4, [K, 1.5, 'Br', { align: 'middle', hl: true }]], [[0, 1], [1, 2], [2, 3], [1, 4, 1, { hl: true }]]),
  tBuBr: mol('2-bromo-2-methylpropane', [[0, 0], [-1, 0], [0, 1], [0, -1], [1, 0, 'Br', { hl: true }]], [[0, 1], [0, 2], [0, 3], [0, 4, 1, { hl: true }]]),
  tBuOH: mol('2-methylpropan-2-ol', [[0, 0], [-1, 0], [0, 1], [0, -1], [1, 0, 'OH', { hl: true }]], [[0, 1], [0, 2], [0, 3], [0, 4, 1, { hl: true }]]),
  neopentylBr: mol('1-bromo-2,2-dimethylpropane (neopentyl bromide)', [[0, 0], [-1, 0], [0, 1], [0, -1], [K, -0.5], [2 * K, 0, 'Br', { hl: true }]],
    [[0, 1, 1, { hl: true }], [0, 2, 1, { hl: true }], [0, 3, 1, { hl: true }], [0, 4], [4, 5, 1, { hl: true }]]),
  isobutylene: mol('2-methylpropene', [[0, 0], [-K, 0.5], [-K, -0.5], [1, 0]], [[0, 1], [0, 2], [0, 3, 2, { hl: true }]]),
  propene: mol('propene', [[0, 0], [K, 0.5], [2 * K, 0]], [[0, 1], [1, 2, 2, { toward: [K, -0.5], hl: true }]]),
  // 2-bromo-2-methylbutane: C2 is the top vertex, carrying CH3 (up-left) and Br (up-right)
  tAmylBr: mol('2-bromo-2-methylbutane', [...butane4, [K - 0.5, 1.366], [K + 0.5, 1.366, 'Br', { hl: true }]],
    [[0, 1], [1, 2], [2, 3], [1, 4], [1, 5, 1, { hl: true }]]),
  mb2ene: mol('2-methylbut-2-ene', [...butane4, [K, 1.5]], [[0, 1], [1, 2, 2, { toward: [K, -0.6], hl: true }], [2, 3], [1, 4]]),
  mb1ene: mol('2-methylbut-1-ene', [...butane4, [K, 1.5]], [[0, 1, 2, { toward: [1, -0.4], hl: true }], [1, 2], [2, 3], [1, 4]]),
  mb3ene: mol('3-methylbut-1-ene', [...butane4, [2 * K, -1]], [[0, 1, 2, { toward: [1, -0.4], hl: true }], [1, 2], [2, 3], [2, 4]]),
  but1ene: mol('but-1-ene', butane4, [[0, 1, 2, { toward: [1, -0.4], hl: true }], [1, 2], [2, 3]]),
  cis2butene: mol('cis-but-2-ene', [[0, 0], [1, 0], [-0.5, K], [1.5, K]], [[0, 1, 2, { toward: [0.5, 1], hl: true }], [0, 2], [1, 3]]),
  trans2butene: mol('trans-but-2-ene', butane4, [[0, 1], [1, 2, 2, { toward: [K, -0.6], hl: true }], [2, 3]]),
  tetraMe: mol('2,3-dimethylbut-2-ene', [[0, 0], [1, 0], [-0.5, K], [-0.5, -K], [1.5, K], [1.5, -K]],
    [[0, 1, 2, { toward: [0.5, 1], hl: true }], [0, 2], [0, 3], [1, 4], [1, 5]]),
  cyhexBr: mol('bromocyclohexane', [...hexV(), [2 * K, 1, 'Br', { hl: true }]], [...HEX, [0, 6, 1, { hl: true }]]),
  cyhexene: mol('cyclohexene', hexV(), [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0, 2, { toward: [0, 0], hl: true }]]),
  cypBr: mol('bromocyclopentane', [...PENT, [0, 1.851, 'Br', { align: 'middle', hl: true }]], [...PB, [0, 5, 1, { hl: true }]]),
  cypene: mol('cyclopentene', PENT, [[0, 1, 2, { toward: [0, 0], hl: true }], [1, 2], [2, 3], [3, 4], [4, 0]]),
};

// 2-substituted butanes/pentanes in zig-zag: C2 is the top vertex, X on a wedge (w) or hash (h) pointing up.
// Drawn like this, a top-priority X on a wedge is R and on a hash is S (X outranks the chain on the right).
const but2 = (x, type, name) => mol(name, [...butane4, [K, 1.5, x, { align: 'middle', hl: true }]], [[0, 1], [1, 2], [2, 3], [1, 4, type, { hl: true }]]);
const pent2 = (x, type, name) => mol(name, [...butane4, [4 * K, 0], [K, 1.5, x, { align: 'middle', hl: true }]], [[0, 1], [1, 2], [2, 3], [3, 4], [1, 5, type, { hl: true }]]);

// Umbrella view of SN2 on (R)-2-bromobutane, Br in the plane on the right; H in plane (up), CH3 wedge, CH2CH3 hash.
// Checked with 3D vectors: this arrangement is R, and the mirror-image product (CN on the left) is S.
const umbrellaR = mol('(R)-2-bromobutane with cyanide approaching from the back', [
  [-1.75, 0, 'N≡C', { align: 'end', lp: [0] }], chg(-1.75, 0.42, '⊖'),
  [0, 0, 'C', { align: 'middle' }], [-0.35, 0.94, 'H', { align: 'middle' }], [-0.62, -0.82, 'H3C', { align: 'end' }], [0.1, -1.02, 'CH2CH3', { align: 'start' }],
  [1.25, 0, 'Br', { hl: true }],
], [[2, 3], [2, 4, 'w'], [2, 5, 'h'], [2, 6, 1, { hl: true }]],
[{ from: [-1.25, 0.08], to: [-0.32, 0.12], bend: -0.25 }, { from: [0.6, 0.08], to: [1.3, 0.38], bend: -0.55 }]);
const umbrellaS = mol('(S)-2-methylbutanenitrile', [
  [-1.15, 0, 'N≡C', { align: 'end', hl: true }], [0, 0, 'C', { align: 'middle' }], [0.35, 0.94, 'H', { align: 'middle' }],
  [0.62, -0.82, 'CH3', { align: 'start' }], [-0.1, -1.02, 'CH3CH2', { align: 'end' }],
], [[0, 1, 1, { hl: true }], [1, 2], [1, 3, 'w'], [1, 4, 'h']]);

// Simple chair, projected from 3D. Atom 0 = right tip (its axial bond points up); axial directions alternate up/down.
const CHAIR_PHI = 0.2;
function chairPts() {
  const s = 1.6, out = [], phi = CHAIR_PHI;
  for (let i = 0; i < 6; i++) {
    const t = i * Math.PI / 3 + phi, z = i % 2 ? -0.25 : 0.25, x = 0.866 * Math.cos(t), y = 0.866 * Math.sin(t);
    out.push([Math.round(s * x * 1000) / 1000, Math.round(s * (z * 1.2 + y * 0.4) * 1000) / 1000]); // CHAIR_PHI turns the ring a little so neighboring axial bonds do not overlap
  }
  return out;
}
const CH6 = chairPts();
// Br axial up on C1 (right tip); the axial H's on C2 and C6 point down = anti-periplanar (trans-diaxial)
const chairE2 = mol('chair cyclohexane with axial Br and two axial β-H’s', [
  ...CH6,
  [CH6[0][0], CH6[0][1] + 1, 'Br', { align: 'middle', hl: true }],
  [CH6[1][0], CH6[1][1] - 0.6, 'H', { align: 'middle', hl: true }], // back carbon: short bond so its H sits inside the ring
  [CH6[5][0], CH6[5][1] - 1, 'H', { align: 'middle', hl: true }],
], [...HEX, [0, 6, 1, { hl: true }], [1, 7, 1, { hl: true }], [5, 8, 1, { hl: true }]]);

// 1-bromo-2-methylcyclohexanes (flat ring): C1 = vertex 0 (Br, wedge), C2 = vertex 1 (CH3)
const brMeCyhex = (meType, name) => mol(name, [...hexV(), [2 * K, 1, 'Br', { hl: true }], [0, 2]], [...HEX, [0, 6, 'w', { hl: true }], [1, 7, meType]]);
const meCyhexene1 = mol('1-methylcyclohexene', [...hexV(), [0, 2]], [[0, 1, 2, { toward: [0, 0], hl: true }], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [1, 6]]);
const meCyhexene3 = mol('3-methylcyclohexene', [...hexV(), [0, 2]], [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0, 2, { toward: [0, 0], hl: true }], [1, 6]]);

const tBuCation = mol('tert-butyl cation', [[0, 0], [0, 1], [-K, -0.5], [K, -0.5], chg(0.36, 0.3)], [[0, 1], [0, 2], [0, 3]]);
// ---------------------------------------------------------------- figures, one entry per step (keyed by topic)
const T = (text, sub) => ({ text, sub });
const A = (top, bottom) => ({ arrow: { top, bottom } });
const P = { plus: true };
const FIG = {};

// 7.1 two reactions
FIG.intro = [
  { kind: 'scheme', title: 'Same kind of substrate, two outcomes',
    rows: [
      [{ mol: M.bromoethane, label: 'bromoethane' }, P, T('HO⁻', 'nucleophile'), A('substitution', 'HO⁻ attacks C'), { mol: M.ethanol, label: 'ethanol' }, P, T('Br⁻', 'leaving group')],
      [{ mol: M.tBuBr, label: '2-bromo-2-methylpropane' }, P, T('EtO⁻', 'base'), A('elimination', 'EtO⁻ takes a β-H'), { mol: M.isobutylene, label: '2-methylpropene' }, P, T('EtOH'), P, T('Br⁻')],
    ],
    caption: 'Top: the OH swaps in where Br was. Bottom: an H and the Br leave from neighboring carbons and a C=C forms.' },
  { kind: 'example', q: 'Substitution or elimination? (a) 1-bromobutane + NaCN → pentanenitrile. (b) bromocyclohexane + t-BuOK → cyclohexene.',
    rows: [
      [{ mol: M.bromobutane, label: '1-bromobutane', scale: 28 }, A('NaCN'), { mol: M.pentanenitrile, label: 'pentanenitrile', scale: 28 }],
      [{ mol: M.cyhexBr, label: 'bromocyclohexane', scale: 28 }, A('t-BuOK'), { mol: M.cyhexene, label: 'cyclohexene', scale: 28 }],
    ],
    hint: 'Did a group swap in for Br, or did a double bond appear?',
    steps: [
      '(a) Br is gone and CN sits on the same carbon. Nothing else changed, so a group was swapped in: substitution. CN⁻ acted as a nucleophile.',
      '(b) The product has one fewer H and no Br, and there is a new C=C between the carbon that held Br and its neighbor: elimination. t-BuO⁻ acted as a base.',
    ],
    answer: '(a) substitution (CN⁻ = nucleophile); (b) elimination (t-BuO⁻ = base).' },
];

// 7.1 leaving groups
FIG.lg = [
  { kind: 'scheme', title: 'The polarized C–X bond',
    rows: [[{ mol: mol('polarized C–Br bond', [[0, 0, 'H3C', { align: 'end' }], [1.1, 0, 'Br'], mark(-0.1, 0.62, 'δ+'), mark(1.3, 0.62, 'δ−')], [[0, 1]]), label: 'electrophilic carbon (δ+)', scale: 40 },
      A('Nu⁻ attacks δ+ C'), T('Nu–CH₃'), P, T('Br⁻', 'leaves with the pair')]],
    caption: 'Br pulls the bonding electrons toward itself, so carbon is δ+ (the target) and Br⁻ is the piece that leaves.' },
  { kind: 'table', title: 'Leaving-group ability follows acid strength',
    head: ['Leaving group', 'Conjugate acid', 'pKa (approx.)', 'As a leaving group'],
    rows: [['I⁻', 'HI', '−10', 'excellent'], ['Br⁻', 'HBr', '−9', 'very good'], ['Cl⁻', 'HCl', '−7', 'good'], ['F⁻', 'HF', '3.2', 'poor'], ['HO⁻', 'H₂O', '15.7', 'bad']],
    caption: 'Lower pKa = stronger acid = weaker, more stable conjugate base = better leaving group.' },
  { kind: 'example', q: 'Pick the better leaving group in each pair: (a) Br⁻ or F⁻   (b) HO⁻ or H₂O   (c) Cl⁻ or I⁻',
    hint: 'Look up each one’s conjugate acid. The stronger the acid, the better the leaving group.',
    steps: [
      '(a) HBr (pKa ≈ −9) is a far stronger acid than HF (3.2), so Br⁻ is the weaker base and leaves better.',
      '(b) H₂O’s conjugate acid is H₃O⁺ (pKa ≈ −1.7, strong); HO⁻’s conjugate acid is H₂O (15.7, weak). So neutral H₂O is the good leaving group. That is why acid makes alcohols react (section 7.11).',
      '(c) HI (−10) is stronger than HCl (−7), and the big I⁻ spreads its charge better, so I⁻ wins.',
    ],
    answer: '(a) Br⁻  (b) H₂O  (c) I⁻' },
];

// 7.2 naming + classification
FIG.naming = [
  { kind: 'gallery', title: 'Naming examples (IUPAC · common name)',
    items: [
      { mol: M.secBuBr, label: '2-bromobutane', note: 'sec-butyl bromide' },
      { mol: M.tBuBr, label: '2-bromo-2-methylpropane', note: 'tert-butyl bromide' },
      { mol: M.chloroethane, label: 'chloroethane', note: 'ethyl chloride' },
      { mol: mol('1-iodo-2-methylpropane', [[0, 0], [K, 0.5], [2 * K, 0], [3 * K, 0.5, 'I', { hl: true }], [K, 1.5]], [[0, 1], [1, 2], [2, 3, 1, { hl: true }], [1, 4]]), label: '1-iodo-2-methylpropane', note: 'isobutyl iodide' },
      { mol: M.cyhexBr, label: 'bromocyclohexane', note: 'cyclohexyl bromide' },
    ] },
  { kind: 'gallery', title: 'Classify by counting carbons on the α carbon',
    items: [
      { mol: mol('bromomethane', [[0, 0, 'H3C', { align: 'end' }], [1, 0, 'Br', { hl: true }], mark(0, -0.55, 'α')], [[0, 1, 1, { hl: true }]]), label: 'methyl', note: 'no C on α' },
      { mol: mol('1-bromopropane', [[0, 0], [K, 0.5], [2 * K, 0], [3 * K, 0.5, 'Br', { hl: true }], mark(2 * K, -0.45, 'α'), mark(K, 0.98, 'β')], [[0, 1], [1, 2], [2, 3, 1, { hl: true }]]), label: '1° (primary)', note: '1 C on α' },
      { mol: mol('2-bromopropane', [[0, 0], [K, 0.5], [2 * K, 0], [K, 1.5, 'Br', { align: 'middle', hl: true }], mark(K, 0.02, 'α'), mark(0, -0.45, 'β'), mark(2 * K, -0.45, 'β')], [[0, 1], [1, 2], [1, 3, 1, { hl: true }]]), label: '2° (secondary)', note: '2 C on α' },
      { mol: mol('2-bromo-2-methylpropane', [[0, 0], [-1, 0], [0, 1], [0, -1], [1, 0, 'Br', { hl: true }], mark(-0.33, 0.33, 'α')], [[0, 1], [0, 2], [0, 3], [0, 4, 1, { hl: true }]]), label: '3° (tertiary)', note: '3 C on α' },
    ],
    caption: 'α = the carbon holding the halogen (substitution happens here). β = its neighbors (elimination takes an H from here).' },
  { kind: 'example', q: 'Name this alkyl halide and classify it as 1°, 2° or 3°.',
    rows: [[{ mol: mol('2-chloro-3-methylpentane', [[0, 0], [K, 0.5], [2 * K, 0], [3 * K, 0.5], [4 * K, 0], [K, 1.5, 'Cl', { align: 'middle', hl: true }], [2 * K, -1]], [[0, 1], [1, 2], [2, 3], [3, 4], [1, 5, 1, { hl: true }], [2, 6]]) }]],
    hint: 'Longest chain first, then number so the substituents get the lowest numbers.',
    steps: [
      'Longest chain: 5 carbons, so the parent is pentane.',
      'Numbering from the left puts the substituents on C2 (Cl) and C3 (CH₃). From the right they would be on 3 and 4, so number from the left.',
      'List alphabetically: chloro before methyl → 2-chloro-3-methylpentane.',
      'The carbon holding Cl (C2) is bonded to C1 and C3: two carbons, so it is secondary.',
    ],
    answer: '2-Chloro-3-methylpentane, a 2° alkyl halide.' },
];

// 7.3 SN2 one step
FIG.sn2 = [
  { kind: 'scheme', title: 'SN2 with curved arrows',
    rows: [[
      { mol: mol('hydroxide attacking bromomethane', [
        [-2.5, 0, 'H', { align: 'middle' }], [-1.75, 0, 'O', { align: 'middle', lp: [90, 270, 0] }], chg(-1.5, 0.42, '⊖'),
        [0, 0, 'C', { align: 'middle' }], [-0.35, 0.94, 'H', { align: 'middle' }], [-0.62, -0.82, 'H', { align: 'middle' }], [0.1, -1.02, 'H', { align: 'middle' }],
        [1.25, 0, 'Br', { hl: true }],
      ], [[0, 1], [3, 4], [3, 5, 'w'], [3, 6, 'h'], [3, 7, 1, { hl: true }]],
      [{ from: [-1.3, 0.05], to: [-0.32, 0.1], bend: -0.3 }, { from: [0.6, 0.08], to: [1.32, 0.38], bend: -0.55 }]), label: 'HO⁻ + CH₃Br', scale: 38 },
      A('one step', 'concerted'),
      T('[HO···CH₃···Br]⁻ ‡', 'transition state'),
    ], [
      A('', 'umbrella flips'),
      { mol: mol('methanol', [[-1.15, 0, 'HO', { align: 'end', hl: true }], [0, 0, 'C', { align: 'middle' }], [0.35, 0.94, 'H', { align: 'middle' }], [0.62, -0.82, 'H', { align: 'middle' }], [-0.1, -1.02, 'H', { align: 'middle' }]],
        [[0, 1, 1, { hl: true }], [1, 2], [1, 3, 'w'], [1, 4, 'h']]), label: 'CH₃OH', scale: 38 },
      P, T('Br⁻', 'leaving group'),
    ]],
    caption: 'Arrow 1: a lone pair on O attacks the δ+ carbon from the back. Arrow 2: at the same time, the C–Br bond breaks and Br leaves with both electrons. The three H’s flip to the other side.' },
  { kind: 'table', title: 'How the rate law shows up in the lab (CH₃Br + HO⁻)',
    head: ['Run', '[CH₃Br]', '[HO⁻]', 'Relative rate'],
    rows: [['1', '0.10 M', '0.10 M', '1×'], ['2', '0.20 M', '0.10 M', '2×'], ['3', '0.10 M', '0.20 M', '2×'], ['4', '0.20 M', '0.20 M', '4×']],
    caption: 'Doubling either concentration doubles the rate, so both appear in the rate law: rate = k[CH₃Br][HO⁻].' },
  { kind: 'example', q: 'Run 1 above has rate = 1.0 × 10⁻⁴ M/s. What is the rate with [CH₃Br] = 0.30 M and [HO⁻] = 0.05 M?',
    hint: 'Change each concentration by a factor, then multiply the factors.',
    steps: ['[CH₃Br] goes 0.10 → 0.30 M: ×3.', '[HO⁻] goes 0.10 → 0.05 M: ×½.', 'Rate = k[RX][Nu⁻], so the rate changes by 3 × ½ = 1.5.'],
    answer: '1.5 × 10⁻⁴ M/s' },
];

// 7.3 backside attack + inversion
FIG.inversion = [
  { kind: 'scheme', title: 'Backside attack flips the carbon like an umbrella',
    rows: [[{ mol: umbrellaR, label: '(R)-2-bromobutane + ⁻CN', scale: 36 }, A('DMSO'), T('[N≡C···C···Br]⁻ ‡', 'H, CH₃, Et flat in the TS')], [A('', 'umbrella flips'), { mol: umbrellaS, label: '(S)-2-methylbutanenitrile', scale: 36 }, P, T('Br⁻')]],
    caption: 'CN⁻ comes in exactly opposite Br. The H, CH₃ and CH₂CH₃ pass through a flat arrangement and end up pointing the other way.' },
  { kind: 'scheme', title: 'The same reaction in zig-zag form',
    rows: [[{ mol: but2('Br', 'w', '(R)-2-bromobutane'), label: '(R)-2-bromobutane' }, A('NaCN', 'DMSO, SN2'), { mol: but2('CN', 'h', '(S)-2-methylbutanenitrile'), label: '(S)-2-methylbutanenitrile' }]],
    caption: 'Wedge in, hash out: the nucleophile ends up on the opposite face from where the leaving group was.' },
  { kind: 'example', q: '(S)-2-Chlorobutane reacts with NaI in acetone (SN2). Draw the product and assign R or S.',
    rows: [[{ mol: but2('Cl', 'h', '(S)-2-chlorobutane'), label: '(S)-2-chlorobutane' }, A('NaI', 'acetone')]],
    hint: 'Put I on the opposite face from Cl, then rank I, CH₂CH₃, CH₃, H.',
    steps: [
      'SN2 = backside attack, so I goes on a wedge (Cl was on a hash).',
      'Priorities in the product: I > CH₂CH₃ > CH₃ > H. I takes the top rank, exactly like Cl did.',
      'Same ranking, opposite face, so the label flips: S → R. (It would not flip if the new group ranked lower than the old one. Always re-assign.)',
    ],
    answerRows: [[{ mol: but2('I', 'w', '(R)-2-iodobutane'), label: '(R)-2-iodobutane' }]],
    answer: '(R)-2-Iodobutane, a single inverted stereoisomer.' },
];

// 7.3 crowding
FIG.crowding = [
  { kind: 'gallery', title: 'More groups on the α carbon = a more crowded back side',
    items: [
      { mol: M.bromomethane, label: 'CH₃Br (methyl)', note: 'fastest' },
      { mol: M.bromoethane, label: 'CH₃CH₂Br (1°)', note: 'fast' },
      { mol: M.ipBr, label: '(CH₃)₂CHBr (2°)', note: 'slow' },
      { mol: M.tBuBr, label: '(CH₃)₃CBr (3°)', note: 'no SN2' },
      { mol: M.neopentylBr, label: 'neopentyl bromide (1°)', note: 'extremely slow: bulky β carbon' },
    ],
    caption: 'SN2 rate: methyl > 1° > 2° ≫ 3°. Neopentyl is 1°, but the three CH₃’s on the β carbon (pink) sit right where the nucleophile has to come in.' },
  { kind: 'example', q: 'Rank from fastest to slowest SN2 reaction with NaI in acetone.',
    rows: [[{ mol: M.tAmylBr, label: 'A: 2-bromo-2-methylbutane', scale: 28 }, { mol: M.bromobutane, label: 'B: 1-bromobutane', scale: 28 }, { mol: M.secBuBr, label: 'C: 2-bromobutane', scale: 28 }, { mol: M.bromomethane, label: 'D: bromomethane', scale: 28 }]],
    hint: 'Classify each one: methyl, 1°, 2° or 3°? Same leaving group, so only crowding differs.',
    steps: ['D is a methyl halide (nothing blocking the back side).', 'B is 1° with no branching next door.', 'C is 2°: two carbons crowd the back side.', 'A is 3°: SN2 is essentially impossible.'],
    answer: 'D > B > C > A (A does not react by SN2).' },
];

// 7.4 nucleophiles
FIG.nucs = [
  { kind: 'table', title: 'Which one is the stronger nucleophile?',
    head: ['Pair', 'Stronger', 'Why'],
    rows: [
      ['HO⁻ vs H₂O', 'HO⁻', 'negative charge'],
      ['CH₃O⁻ vs CH₃OH', 'CH₃O⁻', 'negative charge'],
      ['HS⁻ vs HO⁻', 'HS⁻', 'S is bigger and more polarizable'],
      ['I⁻ vs F⁻ (protic solvent)', 'I⁻', 'big and polarizable; small F⁻ is caged by H-bonds'],
      ['CH₃O⁻ vs CH₃CO₂⁻', 'CH₃O⁻', 'acetate’s charge is spread by resonance'],
      ['CH₃CH₂O⁻ vs (CH₃)₃CO⁻', 'CH₃CH₂O⁻', 't-BuO⁻ is too bulky (but still a strong base)'],
    ] },
  { kind: 'scheme', title: 'A strong nucleophile on a 1° halide: clean SN2',
    rows: [[{ mol: M.bromopropane, label: '1-bromopropane' }, A('NaN₃', 'DMSO'), { mol: mol('1-azidopropane', [[0, 0], [K, 0.5], [2 * K, 0], [3 * K, 0.5, 'N3', { hl: true }]], [[0, 1], [1, 2], [2, 3, 1, { hl: true }]]), label: '1-azidopropane' }, P, T('NaBr')]],
    caption: 'N₃⁻ (azide) is a strong nucleophile and a weak base, so it substitutes and does not eliminate.' },
  { kind: 'example', q: 'Pick the stronger nucleophile in each pair: (a) NH₃ or NH₂⁻   (b) H₂S or H₂O   (c) CH₃CO₂⁻ or CH₃O⁻   (d) (CH₃)₃CO⁻ or CH₃CH₂O⁻',
    hint: 'Check charge, atom size, resonance and bulk, in that order.',
    steps: ['(a) Same atom; the anion wins: NH₂⁻.', '(b) Both neutral; S is bigger and more polarizable: H₂S.', '(c) Acetate spreads its charge over two O’s by resonance, so it is weaker: CH₃O⁻.', '(d) Both are alkoxides, but tert-butoxide is too bulky to reach carbon: CH₃CH₂O⁻.'],
    answer: '(a) NH₂⁻  (b) H₂S  (c) CH₃O⁻  (d) CH₃CH₂O⁻' },
];

// 7.5 E2
FIG.e2 = [
  { kind: 'scheme', title: 'E2 with curved arrows: three arrows, one step',
    rows: [[
      { mol: mol('ethoxide removing a β-H from 2-bromo-2-methylpropane', [
        [0, 0], [1.4, 0], [0, 1.1, 'H', { align: 'middle', hl: true }], [1.4, -1.1, 'Br', { align: 'middle', hl: true }], [2.0, 0.85], [2.35, -0.45],
        [-1.2, 1.75, 'EtO', { align: 'end', lp: [-35, 90, 270] }], chg(-0.87, 2.13, '⊖'),
        mark(-0.35, -0.3, 'β'), mark(1.25, 0.42, 'α'),
      ], [[0, 1], [0, 2, 1, { hl: true }], [1, 3, 1, { hl: true }], [1, 4], [1, 5]],
      [{ from: [-0.8, 1.48], to: [-0.25, 1.16], bend: -0.4 }, { from: [0.1, 0.55], to: [0.72, 0.1], bend: -0.55 }, { from: [1.5, -0.55], to: [1.75, -0.95], bend: -0.7 }]), label: '2-bromo-2-methylpropane + EtO⁻', scale: 40 },
      A('E2', 'one step'),
      { mol: M.isobutylene, label: '2-methylpropene' }, P, T('EtOH'), P, T('Br⁻'),
    ]],
    caption: 'Arrow 1: the base’s lone pair grabs the β-H. Arrow 2: the C–H bond’s electrons become the new π bond. Arrow 3: the C–Br bond breaks and Br⁻ leaves. All at once.' },
  { kind: 'example', q: 'Bromocyclopentane is heated with NaOEt. (a) Draw the E2 product. (b) If you double [NaOEt] and halve [bromocyclopentane], what happens to the rate?',
    rows: [[{ mol: M.cypBr, label: 'bromocyclopentane' }, A('NaOEt', 'heat')]],
    hint: 'Remove an H from a carbon next to the C–Br and put the C=C there. For (b), use rate = k[RX][base].',
    steps: ['(a) Both β carbons are ring CH₂’s and are equivalent, so there is only one alkene: cyclopentene (plus EtOH and NaBr).', '(b) Rate = k[RX][base]: (½)(2) = 1, so the rate does not change.'],
    answerRows: [[{ mol: M.cypene, label: 'cyclopentene' }, P, T('EtOH'), P, T('NaBr')]],
    answer: '(a) Cyclopentene. (b) No change: the two factors cancel.' },
];

// 7.6 alkene stability
FIG.alkenes = [
  { kind: 'gallery', title: 'Least → most stable (heat of hydrogenation, kJ/mol)',
    items: [
      { mol: M.but1ene, label: 'monosubstituted', note: 'but-1-ene · −127' },
      { mol: M.cis2butene, label: 'cis-disubstituted', note: 'cis-but-2-ene · −120' },
      { mol: M.isobutylene, label: 'geminal (1,1)', note: '2-methylpropene · −119' },
      { mol: M.trans2butene, label: 'trans-disubstituted', note: 'trans-but-2-ene · −116' },
      { mol: M.mb2ene, label: 'trisubstituted', note: '2-methylbut-2-ene · −113' },
      { mol: M.tetraMe, label: 'tetrasubstituted', note: '2,3-dimethylbut-2-ene · −111' },
    ],
    caption: 'Less heat released on adding H₂ = the alkene started lower in energy = more stable. (Ethylene, with no alkyl groups, releases about −137.)' },
  { kind: 'example', q: 'Rank these alkenes from least to most stable.',
    rows: [[{ mol: M.mb2ene, label: 'A: 2-methylbut-2-ene', scale: 28 }, { mol: M.mb3ene, label: 'B: 3-methylbut-1-ene', scale: 28 }, { mol: M.mb1ene, label: 'C: 2-methylbut-1-ene', scale: 28 }]],
    hint: 'Count the carbons attached directly to the two C=C carbons.',
    steps: ['A: the C=C carbons carry three alkyl groups (two CH₃ on one end, one CH₃ on the other): trisubstituted.', 'B: only one alkyl group (the isopropyl) on the C=C: monosubstituted.', 'C: two alkyl groups, both on the same carbon: disubstituted (geminal).'],
    answer: 'B < C < A' },
];

// 7.7 Zaitsev vs Hofmann
const tAmylBeta = mol('2-bromo-2-methylbutane with its β carbons marked', [...butane4, [K - 0.5, 1.366], [K + 0.5, 1.366, 'Br', { hl: true }],
  mark(-0.05, -0.42, 'β'), mark(2 * K, -0.42, 'β'), mark(K - 0.92, 1.45, 'β')], [[0, 1], [1, 2], [2, 3], [1, 4], [1, 5, 1, { hl: true }]]);
FIG.zaitsev = [
  { kind: 'scheme', title: 'Same substrate, different base',
    rows: [
      [{ mol: tAmylBeta, label: '2-bromo-2-methylbutane' }, A('NaOEt', 'EtOH, heat'), { mol: M.mb2ene, label: 'major: 2-methylbut-2-ene (Zaitsev)' }, P, { mol: M.mb1ene, label: 'minor: 2-methylbut-1-ene (Hofmann)' }],
      [{ mol: tAmylBeta, label: '2-bromo-2-methylbutane' }, A('t-BuOK', 'heat'), { mol: M.mb2ene, label: 'minor (Zaitsev)' }, P, { mol: M.mb1ene, label: 'major (Hofmann)' }],
    ],
    caption: 'Three β carbons: the two CH₃’s are equivalent (both give 2-methylbut-1-ene); the CH₂ gives 2-methylbut-2-ene. Small EtO⁻ reaches the inner CH₂; bulky t-BuO⁻ takes the exposed CH₃ hydrogens.' },
  { kind: 'example', q: 'Predict the major E2 product of 2-bromo-2,3-dimethylbutane with (a) NaOEt and (b) t-BuOK.',
    rows: [[{ mol: mol('2-bromo-2,3-dimethylbutane', [...butane4, [K - 0.5, 1.366], [K + 0.5, 1.366, 'Br', { hl: true }], [2 * K, -1]], [[0, 1], [1, 2], [2, 3], [1, 4], [1, 5, 1, { hl: true }], [2, 6]]), label: '2-bromo-2,3-dimethylbutane' }]],
    hint: 'Find each β carbon and the alkene its H would give. Then ask: small base or bulky base?',
    steps: [
      'β carbons: the two CH₃’s on C2 (equivalent, 3 H each, easy to reach) and C3 (one H, tucked between two CH₃’s).',
      'Removing the C3 H gives 2,3-dimethylbut-2-ene (tetrasubstituted, most stable). Removing a CH₃ H gives 2,3-dimethylbut-1-ene (disubstituted).',
      '(a) Ethoxide is small, so the more stable Zaitsev alkene is major.',
      '(b) tert-Butoxide is bulky and can’t reach the crowded C3 H, so the Hofmann alkene is major.',
    ],
    answerRows: [[
      { mol: mol('2,3-dimethylbut-2-ene', [...butane4, [K, 1.5], [2 * K, -1]], [[0, 1], [1, 2, 2, { toward: [2.2, 0.7], hl: true }], [2, 3], [1, 4], [2, 5]]), label: '(a) 2,3-dimethylbut-2-ene' },
      { mol: mol('2,3-dimethylbut-1-ene', [...butane4, [K, 1.5], [2 * K, -1]], [[0, 1, 2, { toward: [1, -0.4], hl: true }], [1, 2], [2, 3], [1, 4], [2, 5]]), label: '(b) 2,3-dimethylbut-1-ene' },
    ]],
    answer: '(a) 2,3-Dimethylbut-2-ene (Zaitsev). (b) 2,3-Dimethylbut-1-ene (Hofmann).' },
];

// 7.7 anti-periplanar
const antiSub = mol('one stereoisomer of 1-bromo-1,2-diphenylpropane, drawn with H and Br anti-periplanar', [
  [0, 0], [1, 0], [0, 1, 'H', { align: 'middle', hl: true }], [1, -1, 'Br', { align: 'middle', hl: true }],
  [-0.85, -0.55, 'H3C', { align: 'end' }], [-0.25, -0.98, 'Ph', { align: 'middle' }], [1.85, 0.55, 'Ph', { align: 'start' }], [1.25, 0.98, 'H', { align: 'middle' }],
], [[0, 1], [0, 2, 1, { hl: true }], [1, 3, 1, { hl: true }], [0, 4, 'w'], [0, 5, 'h'], [1, 6, 'w'], [1, 7, 'h']]);
const antiProd = mol('(E)-1,2-diphenylprop-1-ene', [[0, 0], [1, 0], [-0.5, K, 'H3C', { align: 'end' }], [-0.5, -K, 'Ph', { align: 'end' }], [1.5, K, 'Ph', { align: 'start' }], [1.5, -K, 'H', { align: 'start' }]],
  [[0, 1, 2, { toward: [0.5, 1], hl: true }], [0, 2], [0, 3], [1, 4], [1, 5]]);
const pent5 = [[0, 0], [K, 0.5], [2 * K, 0], [3 * K, 0.5], [4 * K, 0]];
FIG.anti = [
  { kind: 'table', title: 'The two coplanar arrangements',
    head: ['', 'Anti-periplanar', 'Syn-periplanar'],
    rows: [['H–C–C–LG angle', '180° (opposite sides)', '0° (same side)'], ['Conformation', 'staggered, low energy', 'eclipsed, high energy'], ['In E2', 'the normal pathway', 'rare']] },
  { kind: 'example', title: 'Worked example: stereospecific E2', q: 'This stereoisomer is drawn with the only β-H anti-periplanar to Br. Which alkene stereoisomer does E2 give, E or Z?',
    rows: [[{ mol: antiSub, label: 'H (top) and Br (bottom) anti, in the plane', scale: 40 }, A('NaOEt', 'E2')]],
    hint: 'When H and Br leave, the two wedged groups end up on the same side of the C=C (and so do the two hashed groups).',
    steps: [
      'The β carbon has only one H, so this is the only anti-periplanar arrangement: one product (stereospecific).',
      'Wedge groups end up cis: CH₃ (β carbon) and Ph (α carbon) are on the same side.',
      'Hash groups end up cis: Ph (β carbon) and H (α carbon).',
      'Priorities: Ph > CH₃ on one carbon, Ph > H on the other. The two Ph’s are on opposite sides → E.',
    ],
    answerRows: [[{ mol: antiProd, label: '(E)-1,2-diphenylprop-1-ene only', scale: 40 }]],
    answer: 'Only the E alkene. Its diastereomer would give only the Z alkene.' },
  { kind: 'example', title: 'Worked example: stereoselective E2', q: '3-Bromopentane is heated with NaOEt. Which alkene(s) form, and which is major?',
    rows: [[{ mol: mol('3-bromopentane', [...pent5, [2 * K, -1, 'Br', { align: 'middle', hl: true }]], [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5, 1, { hl: true }]]), label: '3-bromopentane' }, A('NaOEt', 'heat')]],
    hint: 'Both β carbons are the same CH₂. How many H’s does each have?',
    steps: ['Both β carbons are equivalent, so only pent-2-ene can form.', 'Each β carbon has two H’s, so either one can rotate into the anti position: both E and Z can form.', 'The conformation leading to E is less crowded, so E (trans) is major: stereoselective.'],
    answerRows: [[
      { mol: mol('(E)-pent-2-ene', pent5, [[0, 1], [1, 2, 2, { toward: [K, -0.6], hl: true }], [2, 3], [3, 4]]), label: 'major: (E)-pent-2-ene' }, P,
      { mol: mol('(Z)-pent-2-ene', [[-0.5, K], [0, 0], [1, 0], [1.5, K], [2.5, K]], [[0, 1], [1, 2, 2, { toward: [0.5, 1], hl: true }], [2, 3], [3, 4]]), label: 'minor: (Z)-pent-2-ene' },
    ]],
    answer: 'Both pent-2-enes; (E) is major.' },
];

// 7.7 rings
FIG.ring = [
  { kind: 'scheme', title: 'Trans-diaxial: the only E2 geometry on a chair',
    rows: [[{ mol: chairE2, label: 'Br axial (up); axial H’s on both neighbors point down', scale: 40 }]],
    caption: 'Axial bonds point straight up or down and alternate around the ring. An axial Br on one carbon is exactly anti to the axial H’s on its two neighbors. An equatorial Br is anti to ring C–C bonds only, so it can’t do E2.' },
  { kind: 'example', q: 'Predict the E2 product(s) of each isomer with NaOEt: cis- and trans-1-bromo-2-methylcyclohexane.',
    rows: [[{ mol: brMeCyhex('w', 'cis-1-bromo-2-methylcyclohexane'), label: 'cis (both wedges)' }, { mol: brMeCyhex('h', 'trans-1-bromo-2-methylcyclohexane'), label: 'trans (wedge + hash)' }]],
    hint: 'Put Br axial. Then ask: is the H on C2 (the carbon with CH₃) axial too?',
    steps: [
      'cis: with Br axial, the CH₃ on C2 is equatorial, so the H on C2 is axial (anti to Br). C6 also has an axial H. Both alkenes can form, and the more substituted one (Zaitsev) is major.',
      'trans: with Br axial, the CH₃ on C2 is axial too (trans-1,2 = both axial or both equatorial), so the H on C2 is equatorial and can’t be removed. Only C6 has an axial H, so only the less substituted alkene forms.',
      'This is the “diastereomers give different alkenes” point from the notes.',
    ],
    answerRows: [
      [T('cis →'), { mol: meCyhexene1, label: '1-methylcyclohexene (major)', scale: 30 }, P, { mol: meCyhexene3, label: '3-methylcyclohexene (minor)', scale: 30 }],
      [T('trans →'), { mol: meCyhexene3, label: '3-methylcyclohexene only', scale: 30 }],
    ],
    answer: 'cis gives mostly 1-methylcyclohexene (Zaitsev); trans gives only 3-methylcyclohexene.' },
  { kind: 'table', title: 'Summary: 1-bromo-2-methylcyclohexane + NaOEt',
    head: ['Isomer', 'Chair with Br axial', 'Axial H on C2?', 'Axial H on C6?', 'Product'],
    rows: [['cis', 'CH₃ equatorial', 'yes', 'yes', '1-methylcyclohexene major'], ['trans', 'CH₃ axial', 'no', 'yes', '3-methylcyclohexene only']] },
];

// 7.8 SN2 vs E2
const ethoxypropane2 = mol('2-ethoxypropane', [[0, 0], [K, 0.5], [2 * K, 0], [K, 1.5, 'O', { align: 'middle', hl: true }], [2 * K, 2], [3 * K, 1.5]], [[0, 1], [1, 2], [1, 3, 1, { hl: true }], [3, 4, 1, { hl: true }], [4, 5]]);
FIG.compete = [
  { kind: 'table', title: 'HO⁻, MeO⁻, EtO⁻ (strong nucleophile + strong base): who wins?',
    head: ['Substrate', 'Major', 'Minor', 'Why'],
    rows: [['1°', 'SN2', 'E2', 'open back side'], ['2°', 'E2', 'SN2', 'crowding slows SN2'], ['3°', 'E2 only', '—', 'SN2 impossible'], ['any, with t-BuOK', 'E2', '(some SN2 on 1°)', 'too bulky to attack carbon']] },
  { kind: 'scheme', title: '2° halide + ethoxide (the decider below)',
    rows: [[{ mol: M.ipBr, label: '2-bromopropane' }, A('NaOEt', 'EtOH, heat'), { mol: M.propene, label: 'propene (E2, major)' }, P, { mol: ethoxypropane2, label: '2-ethoxypropane (SN2, minor)' }]] },
  { kind: 'example', q: '1-Bromobutane reacts (a) with NaOEt and (b) with t-BuOK. Give the major product of each.',
    rows: [[{ mol: M.bromobutane, label: '1-bromobutane' }]],
    hint: 'It is 1°. Which reagent is too bulky to reach the carbon?',
    steps: ['(a) EtO⁻ is a strong nucleophile and strong base, and the 1° back side is open: SN2 is major, giving the ether. E2 (but-1-ene) is minor.', '(b) t-BuO⁻ is too bulky to attack carbon, so it removes a β-H: E2 gives but-1-ene.'],
    answerRows: [
      [T('(a)'), { mol: mol('1-ethoxybutane', [...butane4, [4 * K, 0, 'O', { align: 'middle', hl: true }], [5 * K, 0.5], [6 * K, 0]], [[0, 1], [1, 2], [2, 3], [3, 4, 1, { hl: true }], [4, 5, 1, { hl: true }], [5, 6]]), label: '1-ethoxybutane (SN2, major)', scale: 28 }],
      [T('(b)'), { mol: M.but1ene, label: 'but-1-ene (E2, major)', scale: 28 }],
    ],
    answer: '(a) 1-Ethoxybutane (SN2). (b) But-1-ene (E2).' },
];

// 7.9 SN1 mechanism
const tBuBrIon = mol('2-bromo-2-methylpropane ionizing', [[0, 0], [-1, 0], [0, 1], [0, -1], [1, 0, 'Br', { hl: true }]], [[0, 1], [0, 2], [0, 3], [0, 4, 1, { hl: true }]],
  [{ from: [0.5, 0.08], to: [1.2, 0.42], bend: -0.55 }]);
const cationWater = mol('water attacking the tert-butyl cation', [[0, 0], [0, 1], [-K, -0.5], [K, -0.5], chg(-0.42, 0.3),
  [1.9, 0.25, 'O', { align: 'middle', lp: [150, 210] }], [2.5, 0.85, 'H', { align: 'middle' }], [2.5, -0.35, 'H', { align: 'middle' }]],
[[0, 1], [0, 2], [0, 3], [5, 6], [5, 7]], [{ from: [1.48, 0.47], to: [0.3, 0.12], bend: 0.35 }]);
const oxonium = mol('protonated tert-butyl alcohol losing H⁺ to water', [[0, 0], [-1, 0], [0, 1], [0, -1], [1, 0, 'O', { align: 'middle' }], [1.55, 1.0, 'H', { align: 'middle' }], [1.5, -K, 'H', { align: 'middle' }], chg(0.72, 0.42),
  [3.0, 1.45, 'OH2', { lp: [200] }]],
[[0, 1], [0, 2], [0, 3], [0, 4], [4, 5], [4, 6]], [{ from: [2.55, 1.32], to: [1.8, 1.05], bend: 0.3 }, { from: [1.35, 0.55], to: [1.32, 0.06], bend: -0.7 }]);
FIG.sn1 = [
  { kind: 'scheme', title: 'SN1 (solvolysis in water): three steps',
    rows: [
      [{ mol: tBuBrIon, label: '2-bromo-2-methylpropane' }, A('step 1 (slow)', 'ionization'), { mol: tBuCation, label: 'tert-butyl carbocation (flat, sp²)' }, P, T('Br⁻')],
      [{ mol: cationWater, label: 'water attacks C⁺' }, A('step 2', 'fast'), { mol: oxonium, label: 'proton transfer to water', scale: 38 }, A('step 3', 'fast'), { mol: M.tBuOH, label: '2-methylpropan-2-ol' }, P, T('H₃O⁺')],
    ],
    caption: 'Only step 1 is slow, and only the substrate is in it: rate = k[RX]. Step 3 is needed because the nucleophile (H₂O) was neutral.' },
  { kind: 'example', q: '1-Bromo-1-methylcyclohexane is dissolved in ethanol. Draw the SN1 product and the intermediate it goes through.',
    rows: [[{ mol: mol('1-bromo-1-methylcyclohexane', [...hexV(), [1.366, 1.366, 'Br', { hl: true }], [1.866, 0.5]], [...HEX, [0, 6, 1, { hl: true }], [0, 7]]), label: '1-bromo-1-methylcyclohexane' }, A('EtOH')]],
    hint: 'Ethanol is weak, so wait for Br⁻ to leave first. Where is the + charge?',
    steps: ['Br⁻ leaves on its own, giving a 3° carbocation at the ring carbon that held Br.', 'An ethanol O lone pair attacks C⁺, giving a protonated ether (an oxonium ion).', 'Another ethanol takes the extra H⁺ off O.', 'Expect some E1 alkene too (section 7.9, E1).'],
    answerRows: [[
      { mol: mol('1-methylcyclohexyl cation', [...hexV(), [1.866, 0.5], chg(1.05, 1.0)], [...HEX, [0, 6]]), label: '3° carbocation' }, A('1) EtOH', '2) −H⁺'),
      { mol: mol('1-ethoxy-1-methylcyclohexane', [...hexV(), [1.366, 1.366, 'OEt', { hl: true }], [1.866, 0.5]], [...HEX, [0, 6, 1, { hl: true }], [0, 7]]), label: '1-ethoxy-1-methylcyclohexane' },
    ]],
    answer: '1-Ethoxy-1-methylcyclohexane, via the 3° carbocation.' },
];

// 7.9 energy diagram + carbocation stability
FIG.sn1energy = [
  { kind: 'table', title: 'Reading the SN1 energy diagram (left to right)',
    head: ['Point', 'What it is', 'Energy'],
    rows: [
      ['R–Br + H₂O', 'reactants', 'start'],
      ['TS 1 ‡', 'C–Br half broken', 'tallest hill: rate-determining step'],
      ['R⁺ + Br⁻', 'carbocation intermediate (valley)', 'high; TS 1 looks like it (Hammond)'],
      ['TS 2 ‡', 'O–C bond forming', 'small hill (fast)'],
      ['R–OH₂⁺', 'second intermediate', 'valley'],
      ['TS 3 ‡', 'proton transfer', 'small hill (fast)'],
      ['R–OH + H₃O⁺', 'products', 'end'],
    ],
    caption: 'Anything that lowers the carbocation’s energy also lowers TS 1, so it speeds up the whole reaction.' },
  { kind: 'gallery', title: 'Carbocation stability (least → most stable)',
    items: [
      { mol: mol('methyl cation', [[0, 0, 'CH3+', { align: 'middle' }]], []), label: 'methyl', note: 'never forms in SN1' },
      { mol: mol('ethyl cation (1°)', [[0, 0], [K, 0.5], chg(K + 0.3, 0.82)], [[0, 1]]), label: '1°', note: 'too unstable' },
      { mol: mol('isopropyl cation (2°)', [[0, 0], [K, 0.5], [2 * K, 0], chg(K, 0.95)], [[0, 1], [1, 2]]), label: '2°', note: 'slow' },
      { mol: tBuCation, label: '3°', note: 'fast' },
      { mol: mol('allyl cation', [[0, 0], [K, 0.5], [2 * K, 0], chg(2 * K + 0.32, 0.25)], [[0, 1, 2, { toward: [K, -0.3] }], [1, 2]]), label: 'allylic', note: '+ spread by resonance' },
      { mol: mol('benzyl cation', [...hexV(), [2 * K, 1], chg(2 * K + 0.35, 1.25)], [[0, 1], [1, 2, 2, { toward: [0, 0] }], [2, 3], [3, 4, 2, { toward: [0, 0] }], [4, 5], [5, 0, 2, { toward: [0, 0] }], [0, 6]]), label: 'benzylic', note: '+ spread into the ring' },
    ],
    caption: 'Alkyl groups donate electron density (hyperconjugation): 3° > 2° > 1° > methyl. Allylic and benzylic cations spread the charge by resonance.' },
  { kind: 'example', q: 'Rank from fastest to slowest SN1 solvolysis in ethanol: (A) 2-bromopropane, (B) 2-chloro-2-methylpropane, (C) 2-bromo-2-methylpropane, (D) 1-bromopropane.',
    hint: 'First compare carbocations (3° vs 2° vs 1°), then break ties with the leaving group.',
    steps: ['B and C both give the 3° tert-butyl cation, so they are fastest. C has the better leaving group (Br⁻ > Cl⁻), so C > B.', 'A gives a 2° cation: slower.', 'D would need a 1° cation, which doesn’t form: essentially no SN1.'],
    answer: 'C > B > A > D' },
];

// 7.9 rearrangements
FIG.shifts = [
  { kind: 'scheme', title: '1,2-Hydride shift (the notes’ example: 2-chloro-3-phenylbutane in methanol)',
    rows: [
      [{ mol: mol('2-chloro-3-phenylbutane', [...butane4, [K, 1.5, 'Cl', { align: 'middle', hl: true }], [2 * K, -1, 'Ph', { align: 'middle' }]], [[0, 1], [1, 2], [2, 3], [1, 4, 1, { hl: true }], [2, 5]]), label: '2-chloro-3-phenylbutane' },
        A('−Cl⁻', 'slow'),
        { mol: mol('2° carbocation with the shifting H drawn', [...butane4, chg(K, 0.95), [2 * K - 0.5, -K, 'H', { align: 'middle', hl: true }], [2 * K + 0.5, -K, 'Ph', { align: 'start' }]],
          [[0, 1], [1, 2], [2, 3], [2, 5, 1, { hl: true }], [2, 6]], [{ from: [1.42, -0.42], to: [0.92, 0.3], bend: -0.5 }]), label: '2° cation: H slides over with its pair', scale: 44 }],
      [A('1,2-H shift'), { mol: mol('3° benzylic carbocation', [...butane4, [2 * K, -1, 'Ph', { align: 'middle' }], chg(2 * K, 0.42)], [[0, 1], [1, 2], [2, 3], [2, 4]]), label: '3° benzylic cation (more stable)' },
        A('CH₃OH', '−H⁺'),
        { mol: mol('2-methoxy-2-phenylbutane', [...butane4, [2 * K - 0.5, -K, 'H3CO', { align: 'end', hl: true }], [2 * K + 0.5, -K, 'Ph', { align: 'start' }]], [[0, 1], [1, 2], [2, 3], [2, 4, 1, { hl: true }], [2, 5]]), label: '2-methoxy-2-phenylbutane (racemic)' }],
    ],
    caption: 'The arrow starts at the C–H bond: the H moves with both electrons (as H⁻) to the C⁺ next door, so the + moves to the carbon holding the phenyl.' },
  { kind: 'example', title: 'Worked example: methyl shift', q: '2-Bromo-3,3-dimethylbutane is dissolved in methanol. Predict the major SN1 product.',
    rows: [[{ mol: mol('2-bromo-3,3-dimethylbutane', [...butane4, [K, 1.5, 'Br', { align: 'middle', hl: true }], [2 * K - 0.5, -K], [2 * K + 0.5, -K]], [[0, 1], [1, 2], [2, 3], [1, 4, 1, { hl: true }], [2, 5], [2, 6]]), label: '2-bromo-3,3-dimethylbutane' }, A('CH₃OH')]],
    hint: 'The first cation is 2°. Its neighbor has no H, but it does have CH₃ groups.',
    steps: [
      'Br⁻ leaves → 2° cation on C2.',
      'C3 has no H to shift, but it has three CH₃ groups. One CH₃ slides to C2 with its bonding pair (1,2-methyl shift).',
      'Now the + is on C3, which is bonded to three carbons: a 3° cation (more stable).',
      'Methanol attacks C3, then loses H⁺: 2-methoxy-2,3-dimethylbutane.',
    ],
    answerRows: [
      [{ mol: mol('2° cation, methyl about to shift', [...butane4, chg(K, 0.95), [2 * K - 0.5, -K], [2 * K + 0.5, -K]], [[0, 1], [1, 2], [2, 3], [2, 5, 1, { hl: true }], [2, 6]], [{ from: [1.42, -0.42], to: [0.92, 0.3], bend: -0.5 }]), label: '2° cation', scale: 44 },
        A('CH₃ shift'), { mol: mol('3° cation', [...butane4, [K, 1.5], [2 * K, -1], chg(2 * K, 0.42)], [[0, 1], [1, 2], [2, 3], [1, 4], [2, 5]]), label: '3° cation' }],
      [A('CH₃OH', '−H⁺'), { mol: mol('2-methoxy-2,3-dimethylbutane', [...butane4, [K, 1.5], [2 * K - 0.5, -K, 'H3CO', { align: 'end', hl: true }], [2 * K + 0.5, -K]], [[0, 1], [1, 2], [2, 3], [1, 4], [2, 5, 1, { hl: true }], [2, 6]]), label: '2-methoxy-2,3-dimethylbutane' }],
    ],
    answer: '2-Methoxy-2,3-dimethylbutane (rearranged). The unrearranged ether is at most minor.' },
];

// 7.9 E1
const cationE1 = mol('water removing a β-H from the tert-butyl cation', [[0, 0], [-K, 0.5], [-K, 1.5, 'H', { align: 'middle', hl: true }], [K, 0.5], [0, -1], chg(0, 0.45),
  [-2.25, 1.85, 'H2O', { align: 'end', lp: [-15] }]],
[[0, 1], [1, 2, 1, { hl: true }], [0, 3], [0, 4]], [{ from: [-1.8, 1.72], to: [-1.12, 1.55], bend: -0.35 }, { from: [-0.8, 1.0], to: [-0.38, 0.32], bend: -0.5 }]);
const tAmylOEt = mol('2-ethoxy-2-methylbutane', [...butane4, [K - 0.5, 1.366], [K + 0.5, 1.366, 'OEt', { hl: true }]], [[0, 1], [1, 2], [2, 3], [1, 4], [1, 5, 1, { hl: true }]]);
FIG.e1 = [
  { kind: 'scheme', title: 'E1: same first step as SN1, then lose a β-H',
    rows: [
      [{ mol: tBuBrIon, label: '2-bromo-2-methylpropane' }, A('step 1 (slow)', '−Br⁻'), { mol: cationE1, label: 'H₂O acts as a base on a β-H' }],
      [A('step 2', 'fast'), { mol: M.isobutylene, label: '2-methylpropene' }, P, T('H₃O⁺')],
    ],
    caption: 'Arrow 1: water’s lone pair takes the β-H. Arrow 2: the C–H electrons swing over to form the π bond to C⁺.' },
  { kind: 'gallery', title: 'The notes’ example: 2-bromo-2-methylpropane in water/acetone, heat',
    items: [{ mol: M.tBuOH, label: '≈ 80%', note: 'SN1 (alcohol)' }, { mol: M.isobutylene, label: '≈ 20%', note: 'E1 (alkene)' }] },
  { kind: 'example', q: '2-Bromo-2-methylbutane is heated in ethanol. List the E1 products (major and minor) and the SN1 product.',
    rows: [[{ mol: M.tAmylBr, label: '2-bromo-2-methylbutane' }, A('EtOH', 'heat')]],
    hint: 'Draw the 3° cation, then remove an H from each different β carbon.',
    steps: ['Ionization gives the 3° cation at C2 (no shift needed; it is already 3°).', 'Losing an H from the inner CH₂ gives 2-methylbut-2-ene (trisubstituted): E1 major alkene (Zaitsev).', 'Losing an H from a CH₃ gives 2-methylbut-1-ene (disubstituted): minor.', 'Ethanol attacking C⁺ gives the SN1 ether.'],
    answerRows: [[{ mol: M.mb2ene, label: 'E1 major', scale: 28 }, P, { mol: M.mb1ene, label: 'E1 minor', scale: 28 }, P, { mol: tAmylOEt, label: 'SN1: 2-ethoxy-2-methylbutane', scale: 28 }]],
    answer: '2-Methylbut-2-ene (major alkene), 2-methylbut-1-ene (minor), plus the ether 2-ethoxy-2-methylbutane.' },
];

// 7.9 SN1 stereochemistry. (S)-3-bromo-3-methylhexane: C3 = valley vertex, Br wedge (down-left), CH3 hash (down-right).
// Checked with 3D vectors (Br > propyl > ethyl > methyl). The OMe product with the same drawing is S (retention); swapped wedge/hash is R (inversion).
const hex6 = [[0, 0], [K, 0.5], [2 * K, 0], [3 * K, 0.5], [4 * K, 0], [5 * K, 0.5]];
const C3sub = (x, xt, mt, name) => mol(name, [...hex6, [2 * K - 0.5, -K, x, { align: 'end', hl: true }], [2 * K + 0.5, -K]], [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [2, 6, xt, { hl: true }], [2, 7, mt]]);
const pent3 = (x, name) => mol(name, [...pent5, [2 * K - 0.5, -K, x, { align: 'end', hl: true }], [2 * K + 0.5, -K]], [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5, 1, { hl: true }], [2, 6]]);
FIG.racemic = [
  { kind: 'scheme', title: 'One enantiomer in, both configurations out',
    rows: [
      [{ mol: C3sub('Br', 'w', 'h', '(S)-3-bromo-3-methylhexane'), label: '(S)-3-bromo-3-methylhexane' }, A('CH₃OH', 'slow, −Br⁻'), { mol: mol('flat 3° carbocation', [...hex6, [2 * K, -1], chg(2 * K, 0.42)], [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [2, 6]]), label: 'flat cation: both faces open' }],
      [A('CH₃OH', 'then −H⁺'), { mol: C3sub('H3CO', 'h', 'w', '(R)-3-methoxy-3-methylhexane'), label: '(R): inversion, slight excess' }, P, { mol: C3sub('H3CO', 'w', 'h', '(S)-3-methoxy-3-methylhexane'), label: '(S): retention' }],
    ],
    caption: 'Attack from the side opposite the departing Br⁻ gives inversion; attack from the same side gives retention. The Br⁻ still nearby partly blocks its side, so inversion wins slightly (the notes’ example: about 60:40).' },
  { kind: 'example', q: 'Each 3° bromide is warmed in water (SN1). Which one gives a (nearly) racemic product? (a) (S)-3-bromo-3-methylhexane  (b) 3-bromo-3-methylpentane',
    rows: [[{ mol: C3sub('Br', 'w', 'h', '(S)-3-bromo-3-methylhexane'), label: '(a)', scale: 28 }, { mol: pent3('Br', '3-bromo-3-methylpentane'), label: '(b)', scale: 28 }]],
    hint: 'Does the product carbon carry four different groups?',
    steps: ['(a) The product carbon has OH, CH₃, ethyl and propyl: a stereocenter. The flat cation is attacked on both faces, so both enantiomers form (slight excess of inversion).', '(b) The product carbon has OH, CH₃ and two ethyl groups: not a stereocenter. Both faces give the same achiral molecule, so “racemic” doesn’t apply.'],
    answerRows: [[
      { mol: C3sub('HO', 'h', 'w', '(R)-3-methylhexan-3-ol'), label: '(a) (R), slightly more', scale: 28 }, P, { mol: C3sub('HO', 'w', 'h', '(S)-3-methylhexan-3-ol'), label: '(a) (S)', scale: 28 },
      { mol: pent3('HO', '3-methylpentan-3-ol'), label: '(b) one achiral product', scale: 28 },
    ]],
    answer: 'Only (a) gives a nearly racemic mixture. (b) gives a single achiral alcohol.' },
];

// 7.10 predicting products, part 1
const meCyhexBr = mol('1-bromo-1-methylcyclohexane', [...hexV(), [1.366, 1.366, 'Br', { hl: true }], [1.866, 0.5]], [...HEX, [0, 6, 1, { hl: true }], [0, 7]]);
FIG.predict1 = [
  { kind: 'table', title: 'Step 1 + step 2 in one table (major pathway)',
    head: ['Reagent type', 'Examples', '1°', '2°', '3°'],
    rows: [
      ['Strong Nu, weak base', 'I⁻, Br⁻, Cl⁻, HS⁻, RS⁻, CN⁻, N₃⁻', 'SN2', 'SN2', 'SN1'],
      ['Strong Nu + strong base', 'HO⁻, MeO⁻, EtO⁻', 'SN2 (E2 minor)', 'E2 (SN2 minor)', 'E2'],
      ['Strong bulky base', 't-BuOK, DBU, LDA', 'E2', 'E2', 'E2'],
      ['Weak Nu, weak base', 'H₂O, MeOH, EtOH', 'no reaction', 'SN1 + E1 (slow)', 'SN1 + E1'],
    ] },
  { kind: 'example', title: 'Predict it #1', q: '(R)-2-Bromobutane + NaSH in DMSO. Major product?',
    rows: [[{ mol: but2('Br', 'w', '(R)-2-bromobutane'), label: '(R)-2-bromobutane' }, A('NaSH', 'DMSO')]],
    hint: 'Reagent type first, then 1°/2°/3°, then stereochemistry.',
    steps: ['HS⁻: strong nucleophile, weak base → substitution.', '2° carbon, polar aprotic solvent → SN2.', 'SN2 inverts: SH goes on the hash. SH outranks ethyl, methyl and H, just like Br did, so R → S.'],
    answerRows: [[{ mol: but2('SH', 'h', '(S)-butane-2-thiol'), label: '(S)-butane-2-thiol' }]],
    answer: '(S)-Butane-2-thiol, by SN2 (inversion).' },
  { kind: 'example', title: 'Predict it #2', q: '1-Bromo-1-methylcyclohexane + NaOEt, heat. Major and minor products?',
    rows: [[{ mol: meCyhexBr, label: '1-bromo-1-methylcyclohexane' }, A('NaOEt', 'heat')]],
    hint: '3° + strong base. Which β-H’s are there, and is the base bulky?',
    steps: ['EtO⁻: strong nucleophile + strong base. On a 3° carbon SN2 is impossible → E2.', 'β-H’s: on the two ring CH₂’s (equivalent) and on the CH₃.', 'Small base → Zaitsev: the ring C=C (trisubstituted) is major; the exocyclic C=CH₂ (disubstituted) is minor.'],
    answerRows: [[
      { mol: mol('1-methylcyclohexene', [...hexV(), [1.866, 0.5]], [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0, 2, { toward: [0, 0], hl: true }], [0, 6]]), label: '1-methylcyclohexene (major)' }, P,
      { mol: mol('methylenecyclohexane', [...hexV(), [1.866, 0.5]], [...HEX, [0, 6, 2, { hl: true }]]), label: 'methylenecyclohexane (minor)' },
    ]],
    answer: '1-Methylcyclohexene (Zaitsev, major) + methylenecyclohexane (minor), by E2.' },
  { kind: 'example', title: 'Predict it #3', q: '1-Bromobutane is stirred in methanol at room temperature. What happens?',
    rows: [[{ mol: M.bromobutane, label: '1-bromobutane' }, A('CH₃OH')]],
    hint: 'Methanol is weak. What would a weak reagent need the substrate to do first?',
    steps: ['CH₃OH: weak nucleophile, weak base → it can only do SN1/E1, which need a carbocation.', 'A 1° carbocation is far too unstable to form.', 'And CH₃OH is too weak for SN2.'],
    answer: 'No reaction (on any useful timescale).' },
];

// 7.10 predicting products, part 2
FIG.predict2 = [
  { kind: 'table', title: 'Step 3: each mechanism’s rules',
    head: ['Mechanism', 'Where things go', 'Stereochemistry', 'Rearranges?'],
    rows: [
      ['SN2', 'Nu on the α carbon', 'inversion (one product)', 'no'],
      ['SN1', 'Nu on the (possibly shifted) C⁺', 'both configurations, ≈ racemic', 'yes'],
      ['E2', 'small base: Zaitsev; bulky: Hofmann', 'anti-periplanar; one β-H → stereospecific', 'no'],
      ['E1', 'Zaitsev, always', 'trans > cis (stereoselective)', 'yes'],
    ] },
  { kind: 'example', title: 'Predict it #4', q: '1-Bromopropane + NaOCH₃ in CH₃OH. Major and minor products?',
    rows: [[{ mol: M.bromopropane, label: '1-bromopropane' }, A('NaOCH₃', 'CH₃OH')]],
    hint: 'Strong Nu + strong base on a 1° carbon.',
    steps: ['CH₃O⁻ is a strong nucleophile and a strong base: SN2 and E2 compete.', '1° carbon: the back side is open, so SN2 is major.', 'E2 removes a β-H to give propene (minor).'],
    answerRows: [[{ mol: mol('1-methoxypropane', [[0, 0], [K, 0.5], [2 * K, 0], [3 * K, 0.5, 'O', { align: 'middle', hl: true }], [4 * K, 0]], [[0, 1], [1, 2], [2, 3, 1, { hl: true }], [3, 4, 1, { hl: true }]]), label: '1-methoxypropane (SN2, major)' }, P, { mol: M.propene, label: 'propene (E2, minor)' }]],
    answer: '1-Methoxypropane (major) + propene (minor).' },
  { kind: 'example', title: 'Predict it #5', q: '2-Bromo-3-methylbutane is heated in ethanol. Predict the SN1 product and the major E1 product.',
    rows: [[{ mol: mol('2-bromo-3-methylbutane', [...butane4, [K, 1.5, 'Br', { align: 'middle', hl: true }], [2 * K, -1]], [[0, 1], [1, 2], [2, 3], [1, 4, 1, { hl: true }], [2, 5]]), label: '2-bromo-3-methylbutane' }, A('EtOH', 'heat')]],
    hint: 'Weak reagent → carbocation. Is the first cation the best one available?',
    steps: ['EtOH is weak, and the substrate is 2°: SN1 + E1.', 'Br⁻ leaves → 2° cation on C2. C3 next door is 3° and has an H.', '1,2-Hydride shift: the + moves to C3, now a 3° cation.', 'SN1: EtOH attacks the 3° carbon → 2-ethoxy-2-methylbutane (rearranged).', 'E1: lose an H next to the 3° C⁺. The trisubstituted 2-methylbut-2-ene is the major alkene.'],
    answerRows: [[{ mol: tAmylOEt, label: 'SN1: 2-ethoxy-2-methylbutane' }, P, { mol: M.mb2ene, label: 'E1 major: 2-methylbut-2-ene' }]],
    answer: '2-Ethoxy-2-methylbutane (after a hydride shift) and 2-methylbut-2-ene.' },
  { kind: 'example', title: 'Predict it #6', q: '2-Bromobutane + NaOEt, heat. Which alkenes form, and which one is major?',
    rows: [[{ mol: M.secBuBr, label: '2-bromobutane' }, A('NaOEt', 'heat')]],
    hint: '2° + strong base → E2. Two different β carbons; one of them has two H’s.',
    steps: ['2° + strong, small base → E2 major (2-ethoxybutane by SN2 is minor).', 'β-H on C1 → but-1-ene (monosubstituted). β-H on C3 → but-2-ene (disubstituted, Zaitsev).', 'C3 has two H’s, so both E and Z but-2-ene can form; trans (E) is favored.'],
    answerRows: [[{ mol: M.trans2butene, label: '(E)-but-2-ene (major)' }, P, { mol: M.cis2butene, label: '(Z)-but-2-ene (minor)' }, P, { mol: M.but1ene, label: 'but-1-ene (minor)' }]],
    answer: '(E)-But-2-ene is major; (Z)-but-2-ene and but-1-ene are minor (plus a little 2-ethoxybutane from SN2).' },
];

// 7.11 sulfonates
const benzP = [[1, 0], [0.5, K], [-0.5, K], [-1, 0], [-0.5, -K], [0.5, -K]]; // vertex 0 on the right, para pair = 0 and 3
FIG.sulfonates = [
  { kind: 'gallery', title: 'The leaving groups (as anions)',
    items: [
      { mol: mol('tosylate anion', [...benzP, [-2, 0], [2.1, 0, 'S', { align: 'middle' }], [2.1, 1.05, 'O', { align: 'middle' }], [2.1, -1.05, 'O', { align: 'middle' }], [3.15, 0, 'O⊖', { hl: true }]],
        [[0, 1, 2, { toward: [0, 0] }], [1, 2], [2, 3, 2, { toward: [0, 0] }], [3, 4], [4, 5, 2, { toward: [0, 0] }], [5, 0], [3, 6], [0, 7], [7, 8, 2], [7, 9, 2], [7, 10, 1, { hl: true }]]), label: 'tosylate, TsO⁻', note: 'from p-toluenesulfonic acid (pKa ≈ −3)' },
      { mol: mol('triflate anion', [[0, 0, 'F3C', { align: 'end' }], [1.05, 0, 'S', { align: 'middle' }], [1.05, 1.05, 'O', { align: 'middle' }], [1.05, -1.05, 'O', { align: 'middle' }], [2.1, 0, 'O⊖', { hl: true }]],
        [[0, 1], [1, 2, 2], [1, 3, 2], [1, 4, 1, { hl: true }]]), label: 'triflate, TfO⁻', note: 'from triflic acid (pKa ≈ −14)' },
    ],
    caption: 'The negative charge is shared by resonance over all three O’s. The CF₃ group pulls even more electron density away, so triflate is the better leaving group.' },
  { kind: 'scheme', title: 'Alcohol → tosylate → SN2',
    rows: [[{ mol: but2('OH', 'w', '(R)-butan-2-ol'), label: '(R)-butan-2-ol' }, A('TsCl', 'pyridine'), { mol: but2('OTs', 'w', '(R)-butan-2-yl tosylate'), label: '(R) tosylate: retention' }, A('NaCN', 'DMSO'), { mol: but2('CN', 'h', '(S)-2-methylbutanenitrile'), label: '(S) nitrile: inversion' }]],
    caption: 'Tosylation only touches the O–H, so the stereocenter keeps its configuration. The SN2 step then inverts it: one inversion overall.' },
  { kind: 'example', q: '(S)-Pentan-2-ol is treated with 1) TsCl, pyridine, then 2) NaN₃ in DMSO. Draw the product and assign R/S.',
    rows: [[{ mol: pent2('OH', 'h', '(S)-pentan-2-ol'), label: '(S)-pentan-2-ol' }, A('1) TsCl, pyridine', '2) NaN₃, DMSO')]],
    hint: 'Step 1 keeps the configuration. Step 2 is SN2.',
    steps: ['Step 1: OH → OTs on the same hash bond (retention), still S.', 'Step 2: N₃⁻ (strong nucleophile, weak base) does SN2 on the 2° carbon in DMSO: backside attack puts N₃ on a wedge.', 'N₃ ranks first (N beats C), like O did, so the label flips: S → R.'],
    answerRows: [[{ mol: pent2('OTs', 'h', '(S)-pentan-2-yl tosylate'), label: 'tosylate (S)' }, A('NaN₃'), { mol: pent2('N3', 'w', '(R)-2-azidopentane'), label: '(R)-2-azidopentane' }]],
    answer: '(R)-2-Azidopentane.' },
];

// 7.11 alcohols
const tBuOHprot = mol('tert-butyl alcohol taking H⁺ from HBr', [[0, 0], [-1, 0], [0, 1], [0, -1], [1, 0, 'O', { align: 'middle', lp: [60, 120] }], [1.5, -K, 'H', { align: 'middle' }],
  [2.35, 0.95, 'H', { align: 'middle', hl: true }], [3.35, 0.95, 'Br', { align: 'middle' }]],
[[0, 1], [0, 2], [0, 3], [0, 4], [4, 5], [6, 7]], [{ from: [1.3, 0.48], to: [2.1, 0.9], bend: -0.35 }, { from: [2.85, 1.02], to: [3.4, 1.35], bend: -0.6 }]);
const tBuOH2 = mol('protonated tert-butyl alcohol', [[0, 0], [-1, 0], [0, 1], [0, -1], [1, 0, 'O', { align: 'middle', hl: true }], [1.5, K, 'H', { align: 'middle' }], [1.5, -K, 'H', { align: 'middle' }], chg(0.72, 0.42)],
  [[0, 1], [0, 2], [0, 3], [0, 4, 1, { hl: true }], [4, 5], [4, 6]]);
FIG.alcohols = [
  { kind: 'scheme', title: '3° alcohol + HBr: protonate, then SN1',
    rows: [
      [{ mol: tBuOHprot, label: '2-methylpropan-2-ol + HBr', scale: 38 }, A('fast', 'proton transfer'), { mol: tBuOH2, label: 'leaving group is now H₂O' }, P, T('Br⁻')],
      [A('slow', '−H₂O'), { mol: tBuCation, label: '3° carbocation' }, A('Br⁻', 'fast'), { mol: M.tBuBr, label: '2-bromo-2-methylpropane' }],
    ],
    caption: 'Arrow 1: an O lone pair takes the H of HBr. Arrow 2: the H–Br electrons go to Br. Now water (a weak base) can leave.' },
  { kind: 'table', title: 'What acid does with each kind of alcohol',
    head: ['Alcohol', '+ HX (HBr, HCl, HI)', '+ conc. H₂SO₄, heat'],
    rows: [['1°', 'SN2 on R–OH₂⁺ (no carbocation)', '(not covered here)'], ['2°', 'SN1 (rearrangements possible)', 'E1 → alkene'], ['3°', 'SN1', 'E1 → alkene (fastest)']] },
  { kind: 'example', q: '2-Methylcyclohexan-1-ol is heated with concentrated H₂SO₄. Predict the major and minor alkenes.',
    rows: [[{ mol: mol('2-methylcyclohexan-1-ol', [...hexV(), [2 * K, 1, 'OH', { hl: true }], [0, 2]], [...HEX, [0, 6, 1, { hl: true }], [1, 7]]), label: '2-methylcyclohexan-1-ol' }, A('conc. H₂SO₄', 'heat')]],
    hint: 'No good nucleophile, plus heat → E1. Where is the cation, and which neighbors have H’s?',
    steps: ['The OH is protonated and leaves as water → 2° carbocation on C1.', 'Losing the H on C2 (the carbon with CH₃) gives 1-methylcyclohexene (trisubstituted). A hydride shift to the 3° cation on C2 leads to the same alkene.', 'Losing an H on C6 gives 3-methylcyclohexene (disubstituted).', 'E1 → Zaitsev: the more substituted alkene is major.'],
    answerRows: [[{ mol: meCyhexene1, label: '1-methylcyclohexene (major)' }, P, { mol: meCyhexene3, label: '3-methylcyclohexene (minor)' }]],
    answer: '1-Methylcyclohexene (major) + 3-methylcyclohexene (minor).' },
];

// 7.12 retrosynthesis
const cypEther = mol('cyclopentyl ethyl ether (ethoxycyclopentane)', [...PENT, [0, 1.851, 'O', { align: 'middle', hl: true }], [K, 2.351], [2 * K, 1.851]], [...PB, [0, 5], [5, 6, 1, { hl: true }], [6, 7]]);
const cypO = mol('cyclopentoxide', [...PENT, [0, 1.851, 'O⊖', { align: 'middle', hl: true }]], [...PB, [0, 5]]);
FIG.retro = [
  { kind: 'scheme', title: 'Retrosynthesis of cyclopentyl ethyl ether',
    rows: [
      [{ mol: cypEther, label: 'target' }, T('⇒', 'could be made from'), { mol: cypO, label: 'cyclopentoxide' }, P, { mol: M.bromoethane, label: 'bromoethane (1°)' }],
      [{ mol: cypO, label: 'Na⁺ salt' }, P, { mol: M.bromoethane, label: 'bromoethane' }, A('SN2', 'works: 1° halide'), { mol: cypEther, label: 'ether' }, P, T('NaBr')],
      [{ mol: M.cypBr, label: 'bromocyclopentane (2°)' }, P, T('EtO⁻'), A('E2 wins', 'the wrong disconnection'), { mol: M.cypene, label: 'mostly cyclopentene' }],
    ],
    caption: 'Both C–O bonds could be “disconnected”, but only the version with the halide on the unhindered (1°) carbon works forward.' },
  { kind: 'example', q: 'Plan an SN2 (Williamson) synthesis of methoxycyclohexane from an alcohol and an alkyl halide.',
    rows: [[{ mol: mol('methoxycyclohexane', [...hexV(), [2 * K, 1, 'O', { align: 'middle', hl: true }], [3 * K, 0.5]], [...HEX, [0, 6, 1, { hl: true }], [6, 7, 1, { hl: true }]]), label: 'target: methoxycyclohexane' }]],
    hint: 'Two C–O bonds to choose from. Which carbon can take a backside attack?',
    steps: ['Option A: cyclohexoxide + CH₃I. The halide is on a methyl carbon: perfect for SN2.', 'Option B: CH₃O⁻ + bromocyclohexane. A strong base on a 2° halide gives mostly E2 (cyclohexene).', 'So choose A: deprotonate cyclohexanol to make the alkoxide (for example with NaH), then add CH₃I.'],
    answerRows: [[{ mol: mol('cyclohexoxide', [...hexV(), [2 * K, 1, 'O⊖', { align: 'start', hl: true }]], [...HEX, [0, 6]]), label: 'cyclohexoxide' }, P, T('CH₃I'), A('SN2'), { mol: mol('methoxycyclohexane', [...hexV(), [2 * K, 1, 'O', { align: 'middle', hl: true }], [3 * K, 0.5]], [...HEX, [0, 6, 1, { hl: true }], [6, 7, 1, { hl: true }]]), label: 'methoxycyclohexane' }]],
    answer: 'Cyclohexoxide + CH₃I (not CH₃O⁻ + bromocyclohexane).' },
];

// 7.13 solvents
FIG.solvents = [
  { kind: 'gallery', title: 'Polar protic: have an O–H (H-bond donors)',
    items: [
      { mol: mol('water', [[0, 0, 'O', { align: 'middle', hl: true }], [-0.8, -0.6, 'H', { align: 'middle' }], [0.8, -0.6, 'H', { align: 'middle' }]], [[0, 1, 1, { hl: true }], [0, 2, 1, { hl: true }]]), label: 'water' },
      { mol: mol('methanol', [[0, 0, 'H3C', { align: 'end' }], [1, 0, 'OH', { hl: true }]], [[0, 1, 1, { hl: true }]]), label: 'methanol' },
      { mol: M.ethanol, label: 'ethanol' },
      { mol: mol('acetic acid', [[0, 0], [0, 1, 'O', { align: 'middle' }], [-K, -0.5], [K, -0.5, 'OH', { hl: true }]], [[0, 1, 2], [0, 2], [0, 3, 1, { hl: true }]]), label: 'acetic acid' },
    ] },
  { kind: 'gallery', title: 'Polar aprotic: polar, but no O–H or N–H',
    items: [
      { mol: mol('DMSO', [[0, 0, 'S', { align: 'middle' }], [0, 1, 'O', { align: 'middle' }], [-K, -0.5], [K, -0.5]], [[0, 1, 2], [0, 2], [0, 3]]), label: 'DMSO' },
      { mol: mol('DMF', [[0, 0], [0, 1, 'O', { align: 'middle' }], [-K, -0.5, 'H', { align: 'middle' }], [K, -0.5, 'N', { align: 'middle' }], [2 * K, 0], [K, -1.5]], [[0, 1, 2], [0, 2], [0, 3], [3, 4], [3, 5]]), label: 'DMF' },
      { mol: mol('acetone', [[0, 0], [0, 1, 'O', { align: 'middle' }], [-K, -0.5], [K, -0.5]], [[0, 1, 2], [0, 2], [0, 3]]), label: 'acetone' },
      // triple bond = a centred double bond plus a single bond on the same atoms
      { mol: mol('acetonitrile', [[0, 0], [1, 0], [2, 0, 'N', { align: 'middle' }]], [[0, 1], [1, 2, 2], [1, 2, 1]]), label: 'acetonitrile' },
    ] },
  { kind: 'table', title: 'Which solvent for which mechanism?',
    head: ['Solvent type', 'Examples', 'What it does', 'Favors'],
    rows: [
      ['Polar protic', 'H₂O, CH₃OH, EtOH, CH₃CO₂H', 'H-bonds to anions (cages the nucleophile); stabilizes C⁺ and the leaving group', 'SN1 / E1'],
      ['Polar aprotic', 'DMSO, DMF, acetone, CH₃CN', 'solvates the cation (Na⁺, K⁺) but leaves the anion “naked”', 'SN2'],
    ] },
  { kind: 'example', q: 'Pick the better solvent: (a) CH₃CH₂CH₂Br + NaN₃ → 1-azidopropane: ethanol or DMF?  (b) (CH₃)₃CBr → (CH₃)₃COH: water or DMSO?',
    hint: 'Decide the mechanism first.',
    steps: ['(a) 1° halide + strong nucleophile → SN2. SN2 wants polar aprotic: DMF keeps N₃⁻ unsolvated and reactive.', '(b) 3° halide, no strong nucleophile → SN1. SN1 wants polar protic: water stabilizes the carbocation and Br⁻ (and is also the nucleophile).'],
    answer: '(a) DMF  (b) water' },
];

export default {
  ch: 7, title: 'Alkyl halides: substitution & elimination',
  steps: [
    {
      sec: '7.1', title: 'Two reactions, one molecule',
      figs: FIG.intro,
      say: [
        'This chapter is about alkyl halides (a carbon chain with a halogen like Cl, Br or I attached). The carbon holding the halogen is sp³ (four single bonds, tetrahedral shape). These molecules do two main things: substitution, where a new group swaps in for the halogen, and elimination, where the halogen and a neighboring H both leave and a C=C double bond forms.',
        'Which one happens depends on the reagent. A nucleophile ("nucleus lover", an electron-rich species that attacks a carbon) does substitution. A base (an electron-rich species that grabs a proton, H⁺) does elimination. What they have in common: both use a lone pair of electrons.',
        'Many reagents, like hydroxide (HO⁻), can act as both, so the two pathways compete. The molecule being attacked (here, the alkyl halide) is called the substrate.',
      ],
      takeaway: 'Nucleophile → substitution; base → elimination. Same lone pair, different target, so they often compete.',
      check: {
        q: 'Ethoxide (EtO⁻) pulls an H off the carbon next to the C–Br, and an alkene forms. Ethoxide acted as a…',
        a: 'Base (elimination)',
        o: ['Nucleophile (substitution)', 'Leaving group', 'Substrate'],
        why: 'Grabbing a proton is base behavior. If ethoxide had attacked the carbon and pushed out Br⁻, that would be nucleophile behavior (substitution).',
      },
    },
    {
      sec: '7.1', title: 'Why halogens matter: the leaving group',
      figs: FIG.lg,
      say: [
        'Two reasons alkyl halides react. First, the halogen is electronegative (it pulls electrons toward itself), so the carbon attached to it gets a partial positive charge (δ+). That makes the carbon an electrophile ("electron lover", a target for nucleophiles).',
        'Second, the halogen is a leaving group (the piece that departs, taking the bond’s two electrons with it). To do substitution or elimination, a substrate must have a good leaving group.',
        'Dr. Lopez’s rule: good leaving groups are the conjugate bases of strong acids (what is left after a strong acid gives away its H⁺). HI, HBr and HCl are strong acids, so I⁻, Br⁻ and Cl⁻ leave well. HF is a weak acid, so F⁻ is poor, and HO⁻ is a bad leaving group. Order: I⁻ > Br⁻ > Cl⁻ ≫ F⁻. Weaker base = better leaving group.',
      ],
      takeaway: 'Good leaving group = weak base = conjugate base of a strong acid. I⁻ > Br⁻ > Cl⁻ ≫ F⁻; HO⁻ is bad.',
      check: {
        q: 'Which is the best leaving group?',
        a: 'I⁻',
        o: ['F⁻', 'HO⁻', 'Cl⁻'],
        why: 'HI is the strongest of these acids, so I⁻ is the weakest, most stable base. Its big, polarizable atom also spreads out the negative charge.',
      },
    },
    {
      sec: '7.2', title: 'Naming and 1°/2°/3° classification',
      figs: FIG.naming,
      say: [
        'Alkyl halides are named like alkanes (Ch 4 steps: find the parent chain, name the substituents, number them, list them alphabetically). The halogen is just a substituent with a prefix: fluoro, chloro, bromo, iodo. Number the chain so the substituents get the lowest numbers; halogens and alkyl groups count the same. Example: CH₃CHBrCH₂CH₃ is 2-bromobutane.',
        'Simple ones also have common names: the alkyl group, then the halide as a separate word. (CH₃)₃CBr is tert-butyl bromide; CH₃CH₂Cl is ethyl chloride. Halides show up in insecticides (DDT), dyes (Tyrian purple), drugs and even Splenda.',
        'Greek letters label the carbons: the α carbon (alpha) holds the halogen, the β carbon (beta) is next door, then γ, δ. Substitution happens at α (the δ+ carbon); elimination removes an H from β. Classify by how many carbons are attached to α: one = primary (1°), two = secondary (2°), three = tertiary (3°). CH₃X, with none, is a methyl halide. This branching decides the mechanism.',
      ],
      takeaway: 'Halogen = prefix (bromo-, chloro-…). Count the carbons on the α carbon: 1 = 1°, 2 = 2°, 3 = 3°.',
      check: {
        q: '2-Bromo-2-methylpropane, (CH₃)₃CBr, is a…',
        a: 'Tertiary (3°) alkyl halide',
        o: ['Primary (1°) alkyl halide', 'Secondary (2°) alkyl halide', 'Methyl halide'],
        why: 'The carbon holding Br is bonded to three other carbons (three CH₃ groups), so it is 3°.',
      },
    },
    {
      sec: '7.3', title: 'SN2: everything in one step',
      figs: FIG.sn2,
      mech: 'sn2',
      say: [
        'A substitution needs two events: the leaving group leaves and the nucleophile attacks. They can happen at the same time (concerted, one step) or one after the other (stepwise). The concerted version is SN2; the stepwise one is SN1 (section 7.9).',
        'SN2 stands for Substitution, Nucleophilic, bimolecular (2 = two molecules meet in the slow step). Both the nucleophile and the substrate are in that one step, so rate = k[substrate][nucleophile]. That is second order: double either one and the rate doubles. To test it in the lab, change one concentration at a time and measure the rate.',
        'Open the 3D viewer: hydroxide hits the carbon while Br⁻ leaves, all in one motion.',
      ],
      takeaway: 'SN2 = one concerted step. Rate = k[RX][Nu⁻] (second order).',
      check: {
        q: 'In an SN2 reaction you triple the nucleophile concentration and keep the substrate the same. The rate…',
        a: 'Triples',
        o: ['Stays the same', 'Goes up 9×', 'Drops to one third'],
        why: 'Rate = k[RX][Nu⁻] is first order in nucleophile, so the rate scales directly with [Nu⁻].',
      },
    },
    {
      sec: '7.3', title: 'Backside attack and inversion',
      figs: FIG.inversion,
      mech: 'sn2',
      say: [
        'The nucleophile always attacks from the backside, directly opposite the leaving group. Two reasons. The leaving group’s electron cloud blocks the front. And orbitals: the nucleophile’s electrons sit in its HOMO (highest occupied molecular orbital, its most available electrons) and flow into the substrate’s LUMO (lowest unoccupied molecular orbital, the empty C–LG antibonding orbital). That LUMO has its big lobe on the back and a node (a spot with zero electron density) on the front, so only backside attack overlaps.',
        'In the transition state (the highest-energy moment, drawn in brackets with ‡), carbon is half-bonded to both the nucleophile and the leaving group, with the other three groups flat in a plane. Then those three groups flip to the other side, like an umbrella in the wind.',
        'Result: inversion of configuration at that carbon. An optically pure (single-enantiomer) substrate gives one inverted product, which is the evidence that SN2 is one step. Careful: the R/S label usually flips, but not always, because priorities can change when the new group comes in. Draw it, then re-assign.',
      ],
      takeaway: 'Backside attack → 100% inversion of configuration at the α carbon.',
      check: {
        q: '(R)-2-Bromobutane reacts with NaCN in DMSO by SN2. The product is…',
        a: '(S)-2-Methylbutanenitrile, a single inverted product',
        o: ['(R)-2-Methylbutanenitrile only', 'A racemic 50:50 mix', 'But-2-ene'],
        why: 'Backside attack inverts the carbon. Here CN takes over Br’s top priority, so the label goes from R to S.',
      },
    },
    {
      sec: '7.3', title: 'Crowding slows SN2',
      figs: FIG.crowding,
      say: [
        'The nucleophile has to squeeze in at the back of the carbon. Every extra alkyl group there is like furniture blocking a doorway (steric hindrance, crowding by nearby atoms). So SN2 rates go methyl > 1° > 2° ≫ 3°. Tertiary halides are too crowded: their SN2 is too slow to measure.',
        'Read it off the energy diagram. The climb from reactants up to the transition state is the activation energy (Ea), and it sets the rate (lower hill = faster). The overall drop from reactants to products (ΔG) tells you the thermodynamics (whether products are favored). Crowding raises the transition state’s energy, so Ea goes up and the reaction slows.',
        'Branching on the β carbon matters too. Neopentyl bromide, (CH₃)₃CCH₂Br, is technically 1°, but the bulky group right next door blocks the backside, so its SN2 is extremely slow.',
      ],
      takeaway: 'Less crowded = faster SN2: methyl > 1° > 2° ≫ 3° (no SN2). β-branching (neopentyl) also blocks it.',
      check: {
        q: 'Which reacts fastest by SN2?',
        a: 'CH₃CH₂Br (1°)',
        o: ['(CH₃)₂CHBr (2°)', '(CH₃)₃CBr (3°)', '(CH₃)₃CCH₂Br (neopentyl)'],
        why: 'Ethyl bromide has the most open backside. Neopentyl is 1° but its bulky β carbon blocks attack, and 3° can’t do SN2 at all.',
      },
    },
    {
      sec: '7.4', title: 'Strong vs weak nucleophiles',
      figs: FIG.nucs,
      decide: { cls: '1', reagent: 'NaCN', solvent: 'aprotic', heat: false },
      say: [
        'SN2 needs a strong nucleophile, because it has to push the leaving group out on its own. How to spot one (review section 6.7):',
        'Charge: an anion beats the same atom when neutral (HO⁻ > H₂O, RO⁻ > ROH). Polarizability (how easily an atom’s electron cloud gets pushed around): big atoms like S and I make great nucleophiles (HS⁻, RS⁻, I⁻). Electrons held tightly by electronegativity or spread out by resonance make weaker nucleophiles. Bulk matters too: t-BuO⁻ is a strong base but a poor nucleophile.',
        'Strong: I⁻, Br⁻, Cl⁻, HS⁻, RS⁻, CN⁻, N₃⁻, HO⁻, RO⁻. Weak: H₂O and ROH (alcohols). The solvent changes nucleophile strength too (section 7.13). The decider below runs a 1° halide with NaCN in DMSO: clean SN2.',
      ],
      takeaway: 'Anions and big polarizable atoms (I⁻, HS⁻, CN⁻) are strong nucleophiles; H₂O and ROH are weak.',
      check: {
        q: 'Which is the strongest nucleophile?',
        a: 'CH₃S⁻',
        o: ['CH₃SH', 'CH₃OH', 'H₂O'],
        why: 'It is negatively charged and sulfur is big and polarizable. The neutral molecules are much weaker nucleophiles.',
      },
    },
    {
      sec: '7.5', title: 'E2: elimination in one step',
      figs: FIG.e2,
      mech: 'e2',
      say: [
        'Give an alkyl halide a strong base and it can do β-elimination (also called 1,2-elimination): the base removes an H from the β carbon, the leaving group leaves from the α carbon, and a C=C forms between them. With a strong base this happens in one concerted step called E2 (Elimination, bimolecular).',
        'Three things happen at once: the base takes the β-H, those C–H electrons become the π bond (the second bond of the double bond), and the leaving group leaves. The base and the substrate are both in that single step, so rate = k[substrate][base], second order.',
        'E2 vs SN2: both are one step, second order, and need a strong reagent and a good leaving group. The difference is the target: SN2’s nucleophile attacks the α carbon, E2’s base attacks a β hydrogen. That is why 3° halides, which block SN2, still do E2 easily: the outer H’s are easy to reach.',
      ],
      takeaway: 'E2: strong base, one step, rate = k[RX][base]. Base takes a β-H, leaving group leaves, C=C forms.',
      check: {
        q: 'What is the rate law for an E2 reaction?',
        a: 'rate = k[RX][base]',
        o: ['rate = k[RX]', 'rate = k[base]', 'rate = k[RX]²'],
        why: 'E2 is one concerted step involving both the substrate and the base, so it is bimolecular (second order).',
      },
    },
    {
      sec: '7.6', title: 'Which alkenes are most stable?',
      figs: FIG.alkenes,
      say: [
        'Eliminations make alkenes, so we need to rank alkene stability. Rule 1: trans is more stable than cis. In a cis alkene the two big groups sit on the same side and bump into each other (steric strain).',
        'Rule 2: more alkyl groups on the C=C = more stable. Alkyl groups feed a little electron density into the π bond (hyperconjugation, overlap of neighboring C–H bonds with the double bond). The ranking from the notes: tetrasubstituted > trisubstituted > trans-disubstituted > geminal (both groups on one carbon) ≥ cis > monosubstituted > ethylene.',
        'Heats of hydrogenation (heat released when H₂ is added to the alkene) prove it: a more stable alkene starts lower in energy, so it releases less heat. Rings: a trans double bond is too strained to fit in a ring smaller than eight carbons, so those cycloalkenes are always cis.',
      ],
      takeaway: 'More substituted = more stable; trans beats cis.',
      check: {
        q: 'Which alkene is the most stable?',
        a: '2,3-Dimethylbut-2-ene (tetrasubstituted)',
        o: ['trans-But-2-ene', 'cis-But-2-ene', 'But-1-ene'],
        why: 'Four alkyl groups on the C=C give the most hyperconjugation. After that: trans-disubstituted > cis > monosubstituted.',
      },
    },
    {
      sec: '7.7', title: 'E2 regiochemistry: Zaitsev vs Hofmann',
      figs: FIG.zaitsev,
      decide: { cls: '3', reagent: 'tBuOK', solvent: 'protic', heat: true },
      say: [
        'Often the substrate has more than one β carbon with H’s, so E2 can make more than one alkene. Slide example: 2-bromo-2-methylbutane with ethoxide gives two alkenes. The more substituted, more stable one (2-methylbut-2-ene) is the Zaitsev product and is major. The less substituted one (2-methylbut-1-ene) is the Hofmann product and is minor.',
        'When a reaction can form constitutional isomers (same atoms, connected differently) but favors one, it is regioselective (picky about where the new bond goes).',
        'You can flip the outcome with the base. A bulky base like tert-butoxide (t-BuOK) can’t reach the crowded inner H’s, so it takes an exposed H on the end CH₃, and Hofmann becomes major. Small bases (HO⁻, MeO⁻, EtO⁻) give Zaitsev. Other bulky bases: DBU and LDA. They are also called non-nucleophilic bases, since they are too big to attack carbon.',
      ],
      takeaway: 'Small base → Zaitsev (more substituted). Bulky base (t-BuOK) → Hofmann (less substituted).',
      check: {
        q: '2-Bromo-2-methylbutane + t-BuOK (heat) gives mainly…',
        a: '2-Methylbut-1-ene (Hofmann)',
        o: ['2-Methylbut-2-ene (Zaitsev)', '2-Methylbutan-2-ol', '2-tert-Butoxy-2-methylbutane'],
        why: 'The bulky base removes the most accessible H (on the end CH₃), giving the less substituted alkene. A 3° carbon can’t do SN2, so no ether forms.',
      },
    },
    {
      sec: '7.7', title: 'E2 stereochemistry: anti-periplanar',
      figs: FIG.anti,
      mech: 'e2',
      say: [
        'E2 has a geometry rule. In the transition state, the C–H and C–LG bonds that break must line up in the same plane as the forming π bond (coplanar). There are two ways: anti (H and LG on opposite sides, 180°, staggered) or syn (same side, eclipsed). Newman projections (looking straight down the C–C bond) show this best.',
        'The anti arrangement is staggered and much lower in energy, so that is the one that reacts. About 175–179° is close enough, so it is called anti-periplanar. In the 3D viewer, tap “Newman view” to see the H and Br on opposite sides.',
        'Two consequences. If the β carbon has only ONE H, only one alkene geometry can form, so E2 is stereospecific (the substrate’s stereochemistry dictates exactly one product stereoisomer), even if that means the less stable Z alkene. If the β carbon has TWO H’s (like 3-bromopentane), either can line up, so both form, but trans is major: E2 is then stereoselective (both form, one is favored).',
      ],
      takeaway: 'β-H and leaving group must be anti-periplanar. One β-H → stereospecific; two β-H’s → stereoselective (trans major).',
      check: {
        q: 'In a stereoselective reaction…',
        a: 'Two stereoisomers can form, and one is major',
        o: ['Only one stereoisomer can form, set by the substrate’s stereochemistry', 'No stereoisomers form', 'The product is always racemic'],
        why: 'Stereoselective = a preference. Stereospecific = the substrate’s configuration dictates exactly one product configuration.',
      },
    },
    {
      sec: '7.7', title: 'E2 on cyclohexane rings',
      figs: FIG.ring,
      say: [
        'On a cyclohexane chair, anti-periplanar means trans-diaxial: the leaving group must be axial (pointing straight up or down) and the β-H must be axial on the opposite face. An equatorial leaving group has no anti β-H, so E2 waits until the ring flips it axial.',
        'So: draw the chair, flip it if needed to put the leaving group axial, then find the axial H’s on the neighboring carbons. Only those can be removed. If only one neighbor has an axial H, you get that alkene even if it is the less substituted one. The notes show exactly this: one isomer gives the Zaitsev alkene as major, while its diastereomer can only give the less substituted alkene.',
        'If the ring is locked (a big group like tert-butyl holds one chair) with the leaving group equatorial, E2 can’t happen.',
      ],
      takeaway: 'Ring E2: leaving group and β-H must both be axial (trans-diaxial).',
      check: {
        q: 'Why can’t a cyclohexyl bromide with Br locked equatorial do E2?',
        a: 'No β-H is anti-periplanar to an equatorial Br',
        o: ['Equatorial Br is a poor leaving group', 'The ring is too small to hold a C=C', 'The base can’t reach axial H’s'],
        why: 'An equatorial C–Br bond is anti to ring C–C bonds, not to any C–H. E2 needs Br axial with an axial H next door.',
      },
    },
    {
      sec: '7.8', title: 'When SN2 and E2 compete',
      figs: FIG.compete,
      decide: { cls: '2', reagent: 'NaOEt', solvent: 'protic', heat: true },
      say: [
        'Some reagents are both a strong nucleophile and a strong base: HO⁻, MeO⁻ (methoxide) and EtO⁻ (ethoxide). With these, SN2 and E2 compete, and the substrate’s crowding picks the winner.',
        '1°: the backside is open, so SN2 is major (E2 minor). 2°: crowding slows SN2, so E2 is major (SN2 minor). 3°: SN2 is impossible, so E2 only. Heat pushes things further toward elimination.',
        'A bulky base like t-BuOK mostly does E2 because it is too big to attack carbon. (One example in Dr. Lopez’s notes, a 1° iodide with t-BuOK in DMSO, still gave a good amount of SN2, so on 1° expect some substitution.) The decider below runs a 2° halide with NaOEt and heat.',
      ],
      takeaway: 'Strong Nu + strong base: 1° → SN2 major, 2° → E2 major, 3° → E2 only.',
      check: {
        q: '2-Bromopropane + NaOH (heat). Major pathway?',
        a: 'E2',
        o: ['SN2', 'SN1', 'No reaction'],
        why: 'Hydroxide is a strong nucleophile and a strong base. On a 2° carbon the base wins, so E2 is major and SN2 minor.',
      },
    },
    {
      sec: '7.9', title: 'SN1: the leaving group leaves first',
      figs: FIG.sn1,
      mech: 'sn1',
      say: [
        'A puzzle from the slides: a 3° halide dissolved in ethanol gives both a substitution and an elimination product. But 3° can’t do SN2, and ethanol isn’t a strong base, so E2 is unlikely. Experiments show rate = k[substrate] only (first order), so neither SN2 nor E2 is happening.',
        'Both products share a first step: ionization. The leaving group leaves on its own with its electrons, leaving a carbocation (a carbon with only three bonds and a + charge; flat, sp², with an empty p orbital). The carbocation then either gets attacked by the solvent (substitution) or loses a β-H to the solvent (elimination).',
        'SN1 (Substitution, Nucleophilic, unimolecular): 1) leaving group leaves → carbocation, 2) nucleophile attacks, 3) if the nucleophile was neutral (H₂O, ROH), a proton transfer removes the extra H⁺. When the solvent is also the nucleophile, it is called solvolysis.',
      ],
      takeaway: 'SN1: leaving group leaves first (carbocation), then the nucleophile attacks. Rate = k[RX].',
      check: {
        q: 'In an SN1 reaction you double the nucleophile concentration. The rate…',
        a: 'Stays the same',
        o: ['Doubles', 'Quadruples', 'Is cut in half'],
        why: 'The nucleophile only shows up after the slow step, so rate = k[RX] doesn’t include it.',
      },
    },
    {
      sec: '7.9', title: 'SN1 energy diagram and carbocation stability',
      figs: FIG.sn1energy,
      say: [
        'The SN1 energy diagram has several hills with valleys between them. A valley is an intermediate (a real but short-lived species, here the carbocation). The tallest hill is the first one, making the carbocation, so that is the rate-determining step (the slowest step, which sets the overall speed). It is uphill (endothermic).',
        'By the Hammond postulate (a transition state resembles the species closest to it in energy), that first transition state looks like the carbocation. So whatever stabilizes the carbocation speeds the reaction: 3° > 2° > 1°. Allylic (next to a C=C) and benzylic (next to a benzene ring) carbocations are resonance-stabilized (charge spread over several atoms), so they react fast too. A better leaving group also speeds ionization.',
        'Rule of thumb: 3°, allylic and benzylic halides undergo solvolysis and give a mix of SN1 and E1 products. 1° and 2° are usually too slow, unless they can rearrange to a more stable carbocation.',
      ],
      takeaway: 'SN1/E1 speed follows carbocation stability: 3°, allylic, benzylic are fast; 1° and methyl essentially never.',
      check: {
        q: 'Which reacts fastest by SN1 in ethanol?',
        a: '(CH₃)₃CBr',
        o: ['CH₃CH₂Br', 'CH₃Br', '(CH₃)₂CHCl'],
        why: '3° gives the most stable carbocation, and the slow step (ionization) depends on that. 2° chloride is slower (less stable cation, poorer leaving group); methyl and 1° cations are too unstable to form.',
      },
    },
    {
      sec: '7.9', title: 'Carbocation rearrangements',
      figs: FIG.shifts,
      mech: 'hydride',
      say: [
        'Because SN1 and E1 go through a carbocation, it can rearrange into a more stable one before the nucleophile or base arrives. Two kinds: a 1,2-hydride shift (an H on the neighboring carbon slides over with its two electrons, as H⁻) and a 1,2-methyl shift (also called a methide shift; a CH₃ slides over with its electrons).',
        'Shifts only happen if they make a more stable carbocation, like 2° → 3°. Open the 3D viewer to watch a 2° cation become 3° by a hydride shift.',
        'Example from the notes: 2-chloro-3-phenylbutane in methanol. The 2° cation takes a hydride from its neighbor, making a 3° benzylic cation (extra stable), so the OCH₃ ends up on the carbon holding the phenyl: 2-methoxy-2-phenylbutane, racemic.',
      ],
      takeaway: 'Carbocations shift (1,2-H or 1,2-CH₃) whenever that makes a more stable cation. SN2 and E2 never rearrange.',
      check: {
        q: 'Which mechanism can give a rearranged carbon skeleton?',
        a: 'SN1',
        o: ['SN2', 'E2', 'Both SN2 and E2'],
        why: 'Only pathways with a carbocation intermediate (SN1 and E1) can rearrange. SN2 and E2 are single steps with no carbocation.',
      },
    },
    {
      sec: '7.9', title: 'E1: carbocation, then lose a proton',
      figs: FIG.e1,
      mech: 'e1',
      decide: { cls: '3', reagent: 'EtOH', solvent: 'protic', heat: true },
      say: [
        'E1 (Elimination, unimolecular) shares its first step with SN1: the leaving group leaves and a carbocation forms. Then, instead of attacking the carbon, the solvent acts as a base and removes a β-H, and those electrons form the C=C. Same kinetics: rate = k[substrate].',
        'SN1 and E1 almost always happen together. From the notes: 2-bromo-2-methylpropane in water/acetone with heat gives about 80% SN1 (alcohol) and 20% E1 (alkene). Heat shifts the mix toward elimination.',
        'E1 always gives the most stable (most substituted, Zaitsev) alkene as major. Unlike E2, you can’t steer it with a bulky base, because the base is just the solvent. It is stereoselective (trans over cis) but not stereospecific, and every possible alkene forms in some amount.',
      ],
      takeaway: 'E1 = carbocation, then lose a β-H. Zaitsev always major; trans over cis; competes with SN1.',
      check: {
        q: 'How do you get the Hofmann (less substituted) alkene from an E1 reaction?',
        a: 'You can’t; E1 always favors the Zaitsev alkene',
        o: ['Use a bulkier solvent', 'Heat it more', 'Use a better leaving group'],
        why: 'In E1 the alkene comes from a free carbocation and a weak base, so the most stable alkene wins. For Hofmann you need E2 with a bulky base.',
      },
    },
    {
      sec: '7.9', title: 'SN1 stereochemistry: (nearly) racemic',
      figs: FIG.racemic,
      mech: 'sn1',
      say: [
        'If the α carbon is a stereocenter (a chiral carbon), SN1 gives two products with opposite configurations. The carbocation is flat, so the nucleophile can attack either face of the empty p orbital: one face gives inversion, the other gives retention.',
        'The result is close to racemic (a 50:50 mix of enantiomers), but usually with a little extra inversion. Why: right after ionizing, the leaving group is still hanging next to the front face (an ion pair), partly blocking it. The notes’ example: about 60% inversion, 40% retention.',
        'Compare SN2: 100% inversion, one product.',
      ],
      takeaway: 'SN1 at a stereocenter → both configurations (nearly racemic, slight excess of inversion).',
      check: {
        q: 'An optically pure 3° alkyl bromide (stereocenter at the C–Br carbon) reacts in methanol by SN1. You get…',
        a: 'A nearly racemic mix with slightly more inversion',
        o: ['Only the inverted product', 'Only the retained product', 'Exactly 50:50, every time'],
        why: 'The flat carbocation is attacked from both faces. The departing leaving group partly shields the front, so inversion is slightly favored.',
      },
    },
    {
      sec: '7.10', title: 'Predicting products: what does the reagent do?',
      figs: FIG.predict1,
      decide: { cls: '2', reagent: 'H2O', solvent: 'protic', heat: false },
      say: [
        'Dr. Lopez’s three-step plan for any substitution/elimination problem: 1) decide what the reagent does, 2) look at the substrate (1°, 2°, 3°) to see which mechanism wins, 3) draw the regio- and stereochemistry and pick the major product.',
        'Step 1 sorts reagents into four groups. Strong nucleophile, weak base (I⁻, Br⁻, Cl⁻, HS⁻, RS⁻, CN⁻, N₃⁻): substitution. Strong nucleophile AND strong base (HO⁻, MeO⁻, EtO⁻): SN2 and E2 compete. Strong bulky base (t-BuOK, DBU, LDA): E2. Weak nucleophile, weak base (H₂O, MeOH, EtOH): SN1 and E1.',
        'Step 2 uses the substrate. 1°: SN2 (E2 with a bulky base); weak reagents do nothing. 2°: SN2 with nucleophiles, E2 with strong bases, slow SN1/E1 with weak reagents. 3°: never SN2; E2 with strong bases, SN1/E1 with weak reagents, SN1 with a strong nucleophile that is a weak base. The decider below runs a 2° halide in water.',
      ],
      takeaway: 'Reagent first (which of the four types?), then substrate (1°/2°/3°), then regio/stereo.',
      check: {
        q: 'NaSH reacts with a 2° alkyl bromide in DMSO. Main pathway?',
        a: 'SN2 (with inversion)',
        o: ['E2', 'SN1 + E1', 'E1'],
        why: 'HS⁻ is a strong nucleophile but a weak base, so it substitutes. On a 2° carbon in a polar aprotic solvent, that means SN2.',
      },
    },
    {
      sec: '7.10', title: 'Predicting products: draw them right',
      figs: FIG.predict2,
      decide: { cls: '1', reagent: 'NaOMe', solvent: 'protic', heat: false },
      say: [
        'Step 3 applies each mechanism’s rules. SN2: one product, nucleophile on the α carbon, inversion. E2: draw every alkene from a β-H that can be anti-periplanar to the leaving group; a small base makes Zaitsev major, a bulky base makes Hofmann major; trans beats cis; one β-H means stereospecific.',
        'SN1: draw the carbocation, check for a rearrangement, then attach the nucleophile (to the rearranged carbon if it shifted). If a new stereocenter forms, draw both R and S. E1: draw the (possibly rearranged) carbocation, then every alkene from losing a β-H; the most stable alkene is major (Zaitsev always), trans over cis.',
        'Expect mixtures. The real skill is ranking major vs minor. The decider below shows a 1° halide with methoxide: SN2 major, E2 minor.',
      ],
      takeaway: 'SN2: invert. E2: anti-periplanar + base size. SN1/E1: check for shifts; SN1 gives both configurations; E1 gives Zaitsev.',
      check: {
        q: 'Before attaching the nucleophile to draw an SN1 product, what must you check?',
        a: 'Whether the carbocation can rearrange to a more stable one',
        o: ['Whether a β-H is anti-periplanar', 'Whether the base is bulky', 'Whether the solvent is aprotic'],
        why: 'The nucleophile adds wherever the + charge ends up. If a hydride or methyl shift can make a more stable cation, it happens first.',
      },
    },
    {
      sec: '7.11', title: 'Sulfonates: OTs, OTf',
      figs: FIG.sulfonates,
      decide: { cls: '2', reagent: 'NaN3', solvent: 'aprotic', heat: false },
      say: [
        'Halides aren’t the only leaving groups. Alkyl sulfonates, like tosylates (OTs) and triflates (OTf), are excellent ones. Like halides, they are conjugate bases of strong acids, and their negative charge is spread by resonance over three oxygens. Lower pKa means stronger acid and a better leaving group, so triflate (from triflic acid, far stronger than tosic acid) is the best.',
        'Make a tosylate from an alcohol with TsCl (tosyl chloride) and pyridine (a mild base that soaks up the HCl). Only the O–H bond changes: you are strapping the Ts group onto the oxygen. The carbon holding the O is untouched, so its configuration is kept (retention).',
        'Then treat R–OTs exactly like R–Br: a strong nucleophile does SN2 with inversion, a strong base does E2. This is the cleanest way to turn a bad leaving group (OH) into a great one.',
      ],
      takeaway: 'ROH + TsCl, pyridine → ROTs (retention). Then ROTs reacts like an alkyl halide.',
      check: {
        q: '(R)-Butan-2-ol is treated with 1) TsCl, pyridine, then 2) NaCN in DMSO. The nitrile product is…',
        a: 'Inverted at that carbon, a single stereoisomer',
        o: ['Retained at that carbon, a single stereoisomer', 'Racemic', 'An alkene instead'],
        why: 'Tosylation keeps the configuration; the SN2 step then inverts it. Net result: one inversion.',
      },
    },
    {
      sec: '7.11', title: 'Alcohols: make OH leave',
      figs: FIG.alcohols,
      say: [
        'Alcohols can do substitution and elimination too, but HO⁻ is a bad leaving group. Besides tosylates, the other trick is strong acid: protonate the OH to make –OH₂⁺, and now the leaving group is water, which is a good one.',
        'With HX (like HBr): 1° alcohols react by SN2, because 1° carbocations are too unstable to form. 2° and 3° alcohols react by SN1 (strong acid conditions are protic, which helps SN1), so rearrangements are possible.',
        'With concentrated H₂SO₄ and heat (no good nucleophile around), 2° and 3° alcohols do E1 to give alkenes. This is called dehydration (losing water), and the Zaitsev alkene is major.',
      ],
      takeaway: 'Acid turns OH into OH₂⁺ (good leaving group). HX: 1° SN2, 2°/3° SN1. H₂SO₄ + heat: E1 → alkene.',
      check: {
        q: 'tert-Butyl alcohol + HBr gives tert-butyl bromide by which mechanism?',
        a: 'SN1',
        o: ['SN2', 'E2', 'E1'],
        why: 'After protonation, water leaves from the 3° carbon to form a stable carbocation, and Br⁻ attacks it. 3° can’t do SN2.',
      },
    },
    {
      sec: '7.12', title: 'Retrosynthesis: think backwards',
      figs: FIG.retro,
      say: [
        'Synthesis means making valuable, complex molecules from cheap ones. To plan, work backwards: picture the finished target, then ask what pieces it could be built from. This is retrosynthetic analysis, drawn with an open arrow (⇒) meaning “could be made from”. It only works if you remember the reactions.',
        'Dr. Lopez’s four steps: 1) find a bond in the target you know how to make, 2) draw the substrate and nucleophile needed, 3) check the reaction is reasonable, 4) write it forward.',
        'Example: an ether (R–O–R′). Either C–O bond could come from SN2 between an alkoxide (RO⁻) and an alkyl halide (the Williamson ether synthesis). Choose the version with the halide on the less hindered carbon. For cyclopentyl ethyl ether, use cyclopentoxide + ethyl bromide (1°, SN2 works), not ethoxide + bromocyclopentane (2° + strong base gives mostly E2).',
      ],
      takeaway: 'Work backwards from the target, then check it forwards. For ethers: alkoxide + the less hindered halide.',
      check: {
        q: 'Best SN2 route to CH₃CH₂–O–C(CH₃)₃?',
        a: '(CH₃)₃CO⁻ + CH₃CH₂Br',
        o: ['CH₃CH₂O⁻ + (CH₃)₃CBr', '(CH₃)₃COH + CH₃CH₂OH', 'CH₃CH₂O⁻ + (CH₃)₃COH'],
        why: 'The halide must sit on the unhindered side. A 3° bromide can’t do SN2, and ethoxide would just eliminate it (E2). Alcohols on their own have no good leaving group.',
      },
    },
    {
      sec: '7.13', title: 'Solvent effects: protic vs aprotic',
      figs: FIG.solvents,
      decide: { cls: '3', reagent: 'H2O', solvent: 'protic', heat: false },
      say: [
        'Polar protic solvents have an O–H or N–H, so they can hydrogen-bond: H₂O, MeOH, EtOH, acetic acid. Polar aprotic solvents are polar but have no O–H or N–H: DMSO, DMF, acetone, acetonitrile (the notes also use THF).',
        'SN2 wants polar aprotic. Protic solvents wrap an anionic nucleophile in a cage of H-bonds, stabilizing it and making it sluggish. Aprotic solvents surround the cation (Na⁺, K⁺) but leave the anion “naked”, higher in energy and more reactive, so Ea drops and SN2 speeds up. (If a slide line reads as if aprotic solvents stabilize anions too, the point to remember is that they solvate anions poorly.)',
        'SN1 wants polar protic. Its H-bonds stabilize the carbocation, the leaving-group anion and the transition state between them, lowering Ea for the slow ionization step. The decider below runs a 3° halide in water.',
      ],
      takeaway: 'SN2 → polar aprotic (DMSO, DMF, acetone). SN1 → polar protic (H₂O, ROH).',
      check: {
        q: 'Which solvent speeds up the SN2 reaction of CH₃CH₂Br with NaCN the most?',
        a: 'DMSO',
        o: ['Water', 'Methanol', 'Ethanol'],
        why: 'DMSO is polar aprotic: it can’t H-bond to CN⁻, so the nucleophile stays reactive. The others are protic and cage the nucleophile.',
      },
    },
  ],
};
