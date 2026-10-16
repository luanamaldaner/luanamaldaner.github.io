// Study content for Exam 3: alkene reactions, the SN1/SN2/E1/E2 decision,
// quiz questions and flashcards.

// ---------------------------------------------------------------- drawings

// Cyclopentene ring (bond length 1, y up): C1 at the top, C2 upper right.
const P = [[0, 0.851], [0.809, 0.263], [0.5, -0.688], [-0.5, -0.688], [-0.809, 0.263]];
const dirAt = deg => [Math.cos(deg * Math.PI / 180), Math.sin(deg * Math.PI / 180)];

/**
 * subs: [[ringIndex, angleDeg, label, bondType, hl]]; extra: more atoms/bonds.
 */
function cyclopentane({ double = false, subs = [], extra } = {}) {
  const atoms = P.map(p => [p[0], p[1]]);
  const bonds = [[0, 1, double ? 2 : 1, { toward: [0, 0] }], [1, 2], [2, 3], [3, 4], [4, 0]];
  for (const [ri, ang, label, type = 1, hl = false] of subs) {
    const d = dirAt(ang);
    atoms.push([P[ri][0] + d[0], P[ri][1] + d[1], label, { hl, align: d[0] < -0.3 ? 'end' : 'start' }]);
    bonds.push([ri, atoms.length - 1, type, { hl: hl && type !== 1 ? true : hl }]);
  }
  if (extra) extra(atoms, bonds);
  return { atoms, bonds };
}

export const SM = cyclopentane({ double: true, subs: [[0, 90, '']] });
const SM2 = cyclopentane({ double: true, subs: [[0, 90, ''], [1, 18, '']] });

const epoxide = cyclopentane({
  subs: [[0, 125, '']],
  extra: (atoms, bonds) => {
    atoms.push([0.845, 1.164, 'O', { hl: true, align: 'middle' }]);
    const o = atoms.length - 1;
    bonds.push([0, o, 1, { hl: true }], [1, o, 1, { hl: true }]);
  },
});

const ozonolysis = {
  atoms: [[0, 0], [0.866, 0.5], [0.866, 1.5, 'O', { hl: true, align: 'middle' }], [1.732, 0], [2.598, 0.5], [3.464, 0], [4.33, 0.5],
    [4.33, 1.5, 'O', { hl: true, align: 'middle' }], [5.196, 0, 'H', { align: 'middle' }]],
  bonds: [[0, 1], [1, 2, 2, { hl: true }], [1, 3], [3, 4], [4, 5], [5, 6], [6, 7, 2, { hl: true }], [6, 8]],
};

// ---------------------------------------------------------------- alkene reactions

export const REACTIONS = [
  {
    id: 'hx', reagents: ['HBr (or HCl, HI)'], adds: 'H and X', regio: 'Markovnikov', stereo: 'Not stereospecific', via: 'Carbocation', rearr: true,
    product: cyclopentane({ subs: [[0, 122, ''], [0, 58, 'Br', 1, true]] }), name: '1-bromo-1-methylcyclopentane', mech: 'hbr',
    note: 'H goes to the carbon with more H’s; Br ends up on the more substituted carbon.',
  },
  {
    id: 'hbr-roor', reagents: ['HBr, ROOR', '(peroxides, hν or heat)'], adds: 'H and Br', regio: 'Anti-Markovnikov', stereo: 'Mixture (cis + trans)', via: 'Radical',
    product: cyclopentane({ subs: [[0, 90, ''], [1, 18, 'Br', 1, true]] }), name: '1-bromo-2-methylcyclopentane',
    note: 'Only works with HBr. Br· adds first, to the less substituted carbon, so it forms the more stable radical.',
  },
  {
    id: 'hydration', reagents: ['H₃O⁺', '(H₂O, cat. H₂SO₄)'], adds: 'H and OH', regio: 'Markovnikov', stereo: 'Not stereospecific', via: 'Carbocation', rearr: true,
    product: cyclopentane({ subs: [[0, 122, ''], [0, 58, 'OH', 1, true]] }), name: '1-methylcyclopentan-1-ol', mech: 'hydration',
    note: 'Acid-catalysed: protonate, water attacks the carbocation, then deprotonate. Watch for shifts.',
  },
  {
    id: 'oxymerc', reagents: ['1) Hg(OAc)₂, H₂O', '2) NaBH₄'], adds: 'H and OH', regio: 'Markovnikov', stereo: 'Not stereospecific', via: 'Mercurinium ion',
    product: cyclopentane({ subs: [[0, 122, ''], [0, 58, 'OH', 1, true]] }), name: '1-methylcyclopentan-1-ol', mech: 'oxymerc',
    note: 'Same product as acid hydration, but no carbocation, so no rearrangements.',
  },
  {
    id: 'hydroboration', reagents: ['1) BH₃·THF', '2) H₂O₂, NaOH'], adds: 'H and OH', regio: 'Anti-Markovnikov', stereo: 'Syn', via: 'Concerted (4-centre)',
    product: cyclopentane({ subs: [[0, 90, '', 'h'], [1, 18, 'OH', 'w', true]] }), name: 'trans-2-methylcyclopentan-1-ol', racemic: true, mech: 'bh3',
    note: 'OH on the less substituted carbon. H and OH add to the same face, so OH ends up trans to the CH₃.',
  },
  {
    id: 'hydrogenation', reagents: ['H₂, Pt', '(or Pd/C, Ni)'], adds: 'H and H', regio: '—', stereo: 'Syn', via: 'Metal surface',
    start: SM2, product: cyclopentane({ subs: [[0, 90, '', 'w'], [1, 18, '', 'w']] }), name: 'cis-1,2-dimethylcyclopentane', mech: 'h2',
    note: 'Shown on 1,2-dimethylcyclopentene. Both H’s come from the metal side, so both CH₃’s end up on the same face.',
  },
  {
    id: 'halogenation', reagents: ['Br₂', '(CH₂Cl₂)'], adds: 'X and X', regio: '—', stereo: 'Anti', via: 'Bromonium ion',
    product: cyclopentane({ subs: [[0, 122, ''], [0, 58, 'Br', 'w', true], [1, 18, 'Br', 'h', true]] }), name: 'trans-1,2-dibromo-1-methylcyclopentane', racemic: true, mech: 'br2',
    note: 'Br⁻ opens the bromonium from the opposite face. Cl₂ works the same way.',
  },
  {
    id: 'halohydrin', reagents: ['Br₂, H₂O'], adds: 'OH and X', regio: 'OH → more substituted C', stereo: 'Anti', via: 'Bromonium ion',
    product: cyclopentane({ subs: [[0, 122, ''], [0, 58, 'OH', 'w', true], [1, 18, 'Br', 'h', true]] }), name: 'trans-2-bromo-1-methylcyclopentan-1-ol', racemic: true, mech: 'halohydrin',
    note: 'Water outnumbers Br⁻, so water opens the bromonium at the more substituted carbon (it carries more δ+).',
  },
  {
    id: 'epoxidation', reagents: ['mCPBA', '(or another RCO₃H)'], adds: 'O (3-ring)', regio: '—', stereo: 'Syn (stereospecific)', via: 'Concerted',
    product: epoxide, name: '1-methyl-6-oxabicyclo[3.1.0]hexane (an epoxide)', racemic: true,
    note: 'One O is delivered to one face. cis alkenes give cis epoxides, trans give trans.',
  },
  {
    id: 'anti-diol', reagents: ['1) mCPBA', '2) H₃O⁺'], adds: 'OH and OH', regio: 'OH attacks the more substituted C', stereo: 'Anti', via: 'Epoxide, then ring opening',
    product: cyclopentane({ subs: [[0, 122, ''], [0, 58, 'OH', 'w', true], [1, 18, 'OH', 'h', true]] }), name: 'trans-1-methylcyclopentane-1,2-diol', racemic: true,
    note: 'Water opens the protonated epoxide from the back side, so the two OH’s end up trans.',
  },
  {
    id: 'syn-diol', reagents: ['OsO₄, NMO', '(or cold, dilute KMnO₄, NaOH)'], adds: 'OH and OH', regio: '—', stereo: 'Syn', via: 'Cyclic osmate ester',
    product: cyclopentane({ subs: [[0, 122, ''], [0, 58, 'OH', 'w', true], [1, 18, 'OH', 'w', true]] }), name: 'cis-1-methylcyclopentane-1,2-diol', racemic: true,
    note: 'Both O’s are delivered from the same face at once, so the diol is cis.',
  },
  {
    id: 'ozonolysis', reagents: ['1) O₃', '2) DMS (or Zn, H₂O)'], adds: 'Cleaves C=C', regio: '—', stereo: '—', via: 'Ozonide',
    product: ozonolysis, name: '5-oxohexanal', wide: true,
    note: 'The C=C is cut in two and each carbon becomes C=O. On a ring, you get one chain with two carbonyls.',
  },
];

// ---------------------------------------------------------------- substrates

const zig = n => Array.from({ length: n }, (_, i) => [i * 0.866, i % 2 ? 0.5 : 0]);
const hex = () => [30, 90, 150, 210, 270, 330].map(a => dirAt(a));
const hexBonds = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]];

export const SUBSTRATES = [
  { id: 'mebr', cls: 'methyl', name: 'bromomethane', spec: { atoms: [[0, 0, 'H3C', { align: 'end' }], [1, 0, 'Br']], bonds: [[0, 1]] } },
  { id: 'buBr', cls: '1', name: '1-bromobutane', spec: { atoms: [...zig(4), [3.464, 0, 'Br']], bonds: [[0, 1], [1, 2], [2, 3], [3, 4]] } },
  { id: 'etI', cls: '1', name: 'iodoethane', spec: { atoms: [...zig(2), [1.732, 0, 'I']], bonds: [[0, 1], [1, 2]] } },
  { id: 'cyhexCH2Br', cls: '1', name: '(bromomethyl)cyclohexane', spec: { atoms: [...hex(), [1.732, 1], [2.598, 0.5, 'Br']], bonds: [...hexBonds, [0, 6], [6, 7]] } },
  { id: 'secBuBr', cls: '2', name: '2-bromobutane', spec: { atoms: [...zig(4), [0.866, 1.5, 'Br', { align: 'middle' }]], bonds: [[0, 1], [1, 2], [2, 3], [1, 4]] } },
  { id: 'iPrI', cls: '2', name: '2-iodopropane', spec: { atoms: [...zig(3), [0.866, 1.5, 'I', { align: 'middle' }]], bonds: [[0, 1], [1, 2], [1, 3]] } },
  { id: 'cyhexBr', cls: '2', name: 'bromocyclohexane', spec: { atoms: [...hex(), [1.732, 1, 'Br']], bonds: [...hexBonds, [0, 6]] } },
  { id: 'cyhexOTs', cls: '2', name: 'cyclohexyl tosylate', spec: { atoms: [...hex(), [1.732, 1, 'OTs']], bonds: [...hexBonds, [0, 6]] } },
  { id: 'rearr', cls: '2', rearr: true, name: '2-bromo-3-methylbutane', spec: { atoms: [...zig(4), [0.866, 1.5, 'Br', { align: 'middle' }], [1.732, -1]], bonds: [[0, 1], [1, 2], [2, 3], [1, 4], [2, 5]] } },
  { id: 'tBuBr', cls: '3', name: '2-bromo-2-methylpropane', spec: { atoms: [[0, 0], [-1, 0], [0, 1], [0, -1], [1, 0, 'Br']], bonds: [[0, 1], [0, 2], [0, 3], [0, 4]] } },
  { id: 'meCyhexBr', cls: '3', name: '1-bromo-1-methylcyclohexane', spec: { atoms: [...hex(), [1.366, 1.366, 'Br'], [1.866, 0.5]], bonds: [...hexBonds, [0, 6], [0, 7]] } },
];

export const CLASS_LABEL = { methyl: 'Methyl', 1: '1°', 2: '2°', 3: '3°' };

// ---------------------------------------------------------------- reagents

export const REAGENT_TYPES = {
  nuc: { label: 'Strong nucleophile, weak base', short: 'Nucleophile' },
  both: { label: 'Strong nucleophile, strong base', short: 'Nuc + base' },
  bulky: { label: 'Strong, bulky base', short: 'Bulky base' },
  weak: { label: 'Weak nucleophile, weak base', short: 'Weak' },
};

export const REAGENTS = [
  { id: 'NaI', f: 'NaI', type: 'nuc' }, { id: 'NaCN', f: 'NaCN', type: 'nuc' }, { id: 'NaN3', f: 'NaN₃', type: 'nuc' },
  { id: 'NaSH', f: 'NaSH', type: 'nuc' }, { id: 'NaSMe', f: 'NaSCH₃', type: 'nuc' },
  { id: 'NaOH', f: 'NaOH', type: 'both' }, { id: 'NaOMe', f: 'NaOCH₃', type: 'both' }, { id: 'NaOEt', f: 'NaOEt', type: 'both' },
  { id: 'tBuOK', f: 't-BuOK', type: 'bulky' }, { id: 'DBU', f: 'DBU', type: 'bulky' }, { id: 'LDA', f: 'LDA', type: 'bulky' },
  { id: 'H2O', f: 'H₂O', type: 'weak' }, { id: 'MeOH', f: 'CH₃OH', type: 'weak' }, { id: 'EtOH', f: 'EtOH', type: 'weak' },
];

// Outcome table (major first). 'none' = no reaction on any useful timescale.
const TABLE = {
  nuc: { methyl: ['SN2'], 1: ['SN2'], 2: ['SN2'], 3: ['SN1'] },
  both: { methyl: ['SN2'], 1: ['SN2', 'E2'], 2: ['E2', 'SN2'], 3: ['E2'] },
  bulky: { methyl: ['SN2'], 1: ['E2'], 2: ['E2'], 3: ['E2'] },
  weak: { methyl: ['none'], 1: ['none'], 2: ['SN1', 'E1'], 3: ['SN1', 'E1'] },
};
export const tableCell = (type, cls) => TABLE[type][cls];

export function outcomeLabel(out) {
  const k = out.join('+');
  return {
    SN2: 'SN2', SN1: 'SN1', E2: 'E2', none: 'No reaction',
    'SN2+E2': 'SN2 (major) + E2 (minor)', 'E2+SN2': 'E2 (major) + SN2 (minor)', 'SN1+E1': 'SN1 + E1',
  }[k];
}
export const OUTCOME_LABELS = ['SN2', 'SN1', 'E2', 'SN1 + E1', 'SN2 (major) + E2 (minor)', 'E2 (major) + SN2 (minor)', 'No reaction'];

/** The decision, with reasons, for a substrate class + reagent + conditions. */
export function decide({ cls, reagent, solvent, heat, rearr = false }) {
  const r = REAGENTS.find(x => x.id === reagent) || REAGENTS[0];
  const out = TABLE[r.type][cls];
  const why = [];
  const subj = { methyl: 'A methyl carbon', 1: 'A 1° carbon', 2: 'A 2° carbon', 3: 'A 3° carbon' }[cls];
  if (cls === 'methyl' || cls === '1') why.push(`${subj} is unhindered, so backside attack is easy. Its carbocation would be far too unstable for SN1/E1.`);
  if (cls === '2') why.push(`${subj} is in the middle: SN2 is possible but slower, and a carbocation can form if nothing better happens. The reagent decides.`);
  if (cls === '3') why.push(`${subj} is too crowded for backside attack (no SN2), but it forms a stable 3° carbocation.`);
  if (r.type === 'nuc') why.push(`${r.f} is a strong nucleophile but a weak base, so it substitutes rather than eliminates.`);
  if (r.type === 'both') why.push(`${r.f} is both a strong nucleophile and a strong base, so SN2 and E2 compete and sterics decide.`);
  if (r.type === 'bulky') why.push(`${r.f} is a strong base that’s too bulky to reach the carbon, so it pulls off a β-H instead.`);
  if (r.type === 'weak') why.push(`${r.f} is weak, so nothing happens until the substrate ionizes on its own.`);
  if (r.type === 'both' && cls === '1') why.push('On a 1° carbon backside attack is easy: SN2 is major, E2 minor.');
  if (r.type === 'both' && cls === '2') why.push('On a 2° carbon the strong base wins: E2 is major, SN2 minor.');
  if (r.type === 'both' && cls === '3') why.push('SN2 is impossible on 3°, so the strong base does E2.');
  if (r.type === 'nuc' && cls === '3') why.push('SN2 is impossible on 3°, so the substrate ionizes first and the nucleophile catches the carbocation (SN1).');
  if (r.type === 'bulky' && cls === 'methyl') why.push('A methyl halide has no β-H to remove, so even a bulky base can only substitute (slowly).');
  if (out[0] === 'none') why.push('Weak nucleophile + unstable carbocation = no reaction worth drawing.');
  if (out.includes('E1')) why.push(heat ? 'Heat favours elimination, so expect more E1.' : 'Without heat, SN1 usually beats E1; heating shifts it toward E1.');
  if (out.includes('SN2') && solvent === 'aprotic') why.push('A polar aprotic solvent leaves the nucleophile unsolvated (“naked”), which speeds up SN2.');
  if (out[0] === 'SN2' && solvent === 'protic') why.push('A protic solvent H-bonds to the nucleophile and slows SN2, but SN2 still wins here.');
  if (out.includes('SN1') && solvent === 'protic') why.push('A polar protic solvent stabilizes the carbocation and the leaving group, which helps SN1/E1.');
  const result = [];
  if (out.includes('SN2')) result.push('SN2: inversion of configuration at the carbon.');
  if (out.includes('SN1')) result.push('SN1: racemization (both faces attacked).');
  if (out.includes('E2')) result.push(r.type === 'bulky' ? 'E2 with a bulky base: Hofmann (less substituted) alkene.' : 'E2: Zaitsev (more substituted) alkene, anti-periplanar H and LG.');
  if (out.includes('E1')) result.push('E1: Zaitsev (more substituted) alkene.');
  if (rearr && (out.includes('SN1') || out.includes('E1'))) result.push('This substrate can rearrange: a 1,2-hydride shift turns the 2° cation into a 3° one.');
  return { out, label: outcomeLabel(out), why, result, reagent: r };
}

// ---------------------------------------------------------------- concept questions

export const CONCEPTS = [
  { q: 'Which carbocation is the most stable?', a: '3° (tertiary)', o: ['Methyl', '1° (primary)', '2° (secondary)'], why: 'More alkyl groups donate electron density by hyperconjugation and induction: 3° > 2° > 1° > methyl.' },
  { q: 'Which is the best leaving group?', a: 'I⁻', o: ['Br⁻', 'Cl⁻', 'F⁻'], why: 'The weaker the base, the better the leaving group. I⁻ is the weakest base (HI is the strongest acid).' },
  { q: 'What is the rate law for SN1?', a: 'rate = k[RX]', o: ['rate = k[RX][Nu⁻]', 'rate = k[Nu⁻]', 'rate = k[RX]²'], why: 'Only the substrate is in the slow step (ionization). The nucleophile shows up afterwards.' },
  { q: 'You double [Nu⁻] in an SN2 reaction. The rate…', a: 'doubles', o: ['stays the same', 'halves', 'quadruples'], why: 'SN2 is bimolecular: rate = k[RX][Nu⁻], so it’s first order in nucleophile.' },
  { q: 'You double [Nu] in an SN1 reaction. The rate…', a: 'stays the same', o: ['doubles', 'halves', 'quadruples'], why: 'The nucleophile isn’t in the rate-determining step, so rate = k[RX].' },
  { q: 'Which solvent is polar aprotic?', a: 'DMSO', o: ['H₂O', 'CH₃OH', 'CH₃CH₂OH'], why: 'Polar aprotic = polar but no O–H or N–H: DMSO, DMF, acetone, acetonitrile. They speed up SN2.' },
  { q: '(R)-2-Bromobutane + NaCN in DMSO gives…', a: '(S)-2-methylbutanenitrile', o: ['(R)-2-methylbutanenitrile', 'a racemic mixture', 'but-2-ene'], why: 'Strong nucleophile, weak base, 2°, aprotic → SN2 with inversion. CN takes Br’s top priority, so R becomes S.' },
  { q: 'Which substrate reacts fastest by SN2?', a: 'CH₃Br', o: ['(CH₃)₂CHBr', '(CH₃)₃CBr', 'CH₃CH₂Br'], why: 'Less crowding at the back of the carbon = faster SN2: methyl > 1° > 2° ≫ 3°.' },
  { q: 'For E2, the β-H and the leaving group must be…', a: 'anti-periplanar', o: ['syn-periplanar', 'gauche', 'on the same carbon'], why: 'Anti-periplanar (180°) lets the C–H and C–LG orbitals line up into the new π bond. On cyclohexanes both must be axial.' },
  { q: '2-Bromo-2-methylbutane + t-BuOK (heat) gives mainly…', a: '2-methylbut-1-ene (Hofmann)', o: ['2-methylbut-2-ene (Zaitsev)', '2-methylbutan-2-ol', 'a tert-butyl ether'], why: 'A bulky base removes the most accessible H (on the CH₃), giving the less substituted alkene.' },
  { q: '2-Bromo-2-methylbutane + NaOEt (heat) gives mainly…', a: '2-methylbut-2-ene (Zaitsev)', o: ['2-methylbut-1-ene (Hofmann)', 'an ether by SN2', 'no reaction'], why: '3° + strong, small base → E2, giving the more substituted (Zaitsev) alkene.' },
  { q: 'Markovnikov’s rule says that in HX addition…', a: 'H adds to the carbon that already has more H’s', o: ['X adds to the carbon with more H’s', 'H and X add to the same face', 'H and X add to opposite faces'], why: 'H⁺ adds so the carbocation forms on the more substituted carbon. X then bonds there.' },
  { q: 'Which gives an anti-Markovnikov alcohol?', a: '1) BH₃·THF  2) H₂O₂, NaOH', o: ['H₃O⁺', '1) Hg(OAc)₂, H₂O  2) NaBH₄', 'OsO₄, NMO'], why: 'Hydroboration puts B, and then OH, on the less substituted carbon (syn).' },
  { q: 'Which reaction can give a rearranged product?', a: 'HBr addition', o: ['Hydroboration–oxidation', 'Oxymercuration–demercuration', 'Br₂ addition'], why: 'Only reactions with a free carbocation rearrange: HX addition, acid-catalysed hydration, SN1, E1.' },
  { q: 'Oxymercuration–demercuration vs. acid-catalysed hydration:', a: 'Same regiochemistry, but no rearrangements', o: ['Opposite regiochemistry', 'Oxymercuration gives a diol', 'Oxymercuration is anti-Markovnikov'], why: 'Both put OH on the more substituted carbon. The mercurinium ion stops the cation from rearranging.' },
  { q: 'Which gives a cis (syn) diol?', a: 'OsO₄, NMO', o: ['1) mCPBA  2) H₃O⁺', 'Br₂, H₂O', 'O₃ then DMS'], why: 'OsO₄ adds both O’s at once from one face. The epoxide route opens from the back, giving anti.' },
  { q: 'In a polar protic solvent, which is the best nucleophile?', a: 'I⁻', o: ['F⁻', 'Cl⁻', 'Br⁻'], why: 'Protic solvents H-bond tightly to small anions. Big, polarizable I⁻ is least hindered by that.' },
  { q: 'Which is a strong, bulky base?', a: 'KOC(CH₃)₃ (t-BuOK)', o: ['NaOCH₃', 'NaCN', 'NaI'], why: 't-BuOK, LDA and DBU are bulky. They favour E2 and give Hofmann products.' },
  { q: 'In E1, the rate-determining step is…', a: 'loss of the leaving group', o: ['removal of the β-H', 'attack of the base', 'formation of the π bond and loss of LG together'], why: 'Ionization to the carbocation is slow. Deprotonation afterwards is fast.' },
  { q: '3-Methylbut-1-ene + HBr gives mainly…', a: '2-bromo-2-methylbutane', o: ['2-bromo-3-methylbutane', '1-bromo-3-methylbutane', '2-methylbut-2-ene'], why: 'Protonation gives a 2° cation next to a 3° C–H; a 1,2-hydride shift makes the 3° cation, and Br⁻ adds there.' },
  { q: 'Br₂ adds to cyclohexene to give…', a: 'trans-1,2-dibromocyclohexane', o: ['cis-1,2-dibromocyclohexane', '1,1-dibromocyclohexane', 'bromocyclohexane'], why: 'The bromonium is opened from the opposite face, so the addition is anti → trans.' },
  { q: 'Which statement about SN1 is true?', a: 'Rearrangements are possible', o: ['It gives clean inversion', 'It works best on methyl halides', 'Polar aprotic solvents are best'], why: 'SN1 goes through a carbocation, which can undergo hydride or methyl shifts.' },
];

// ---------------------------------------------------------------- flashcards

export const CARDS = [
  ...REACTIONS.map(r => ({
    id: `rx-${r.id}`, deck: 'Alkenes', front: r.reagents.join('\n'),
    back: `Adds ${r.adds}\n${r.regio !== '—' ? `${r.regio} · ` : ''}${r.stereo !== '—' ? r.stereo : ''}\nvia ${r.via}${r.rearr ? ' (rearrangements possible)' : ''}`,
    reaction: r.id,
  })),
  { id: 'c-sn2-rate', deck: 'SN/E', front: 'SN2: rate law and stereochemistry', back: 'rate = k[RX][Nu⁻]\nOne step, backside attack\n100% inversion' },
  { id: 'c-sn1-rate', deck: 'SN/E', front: 'SN1: rate law and stereochemistry', back: 'rate = k[RX]\nCarbocation intermediate\nRacemization; rearrangements possible' },
  { id: 'c-e2', deck: 'SN/E', front: 'E2: requirements', back: 'Strong base, one step\nβ-H anti-periplanar to LG\n(both axial on cyclohexane)\nrate = k[RX][base]' },
  { id: 'c-e1', deck: 'SN/E', front: 'E1: key features', back: 'rate = k[RX], carbocation\nWeak base, heat\nZaitsev product; competes with SN1' },
  { id: 'c-sn2-sub', deck: 'SN/E', front: 'SN2 substrate order', back: 'methyl > 1° > 2° ≫ 3° (no reaction)\nSteric hindrance at the back side' },
  { id: 'c-sn1-sub', deck: 'SN/E', front: 'SN1 / E1 substrate order', back: '3° > 2° (1° and methyl don’t)\nFollows carbocation stability' },
  { id: 'c-cat', deck: 'SN/E', front: 'Carbocation stability', back: '3° > 2° > 1° > methyl\n(allylic and benzylic are stabilized by resonance too)' },
  { id: 'c-aprotic', deck: 'SN/E', front: 'Polar aprotic solvents (examples + effect)', back: 'DMSO, DMF, acetone, CH₃CN\nNucleophile stays “naked” → favours SN2' },
  { id: 'c-protic', deck: 'SN/E', front: 'Polar protic solvents (examples + effect)', back: 'H₂O, CH₃OH, EtOH, AcOH\nStabilize ions → favour SN1/E1' },
  { id: 'c-nuc', deck: 'SN/E', front: 'Strong nucleophiles, weak bases', back: 'I⁻, Br⁻, Cl⁻, HS⁻, RS⁻, CN⁻, N₃⁻\n→ substitution (SN2 on 1°/2°)' },
  { id: 'c-both', deck: 'SN/E', front: 'Strong nucleophiles AND strong bases', back: 'HO⁻, CH₃O⁻, EtO⁻\n1°: SN2 major · 2°: E2 major · 3°: E2' },
  { id: 'c-bulky', deck: 'SN/E', front: 'Bulky bases (name three) and what they do', back: 't-BuOK, LDA, DBU (also DBN)\nE2 → Hofmann (less substituted) alkene' },
  { id: 'c-weak', deck: 'SN/E', front: 'Weak nucleophile / weak base', back: 'H₂O, ROH\n2°/3°: SN1 + E1 (heat → more E1)\n1°/methyl: no reaction' },
  { id: 'c-lg', deck: 'SN/E', front: 'Leaving group ability', back: 'TsO⁻ ≈ I⁻ > Br⁻ > Cl⁻ ≫ F⁻, HO⁻\nWeaker base = better leaving group' },
  { id: 'c-zaitsev', deck: 'SN/E', front: 'Zaitsev vs Hofmann', back: 'Zaitsev: more substituted alkene (small base, E1)\nHofmann: less substituted (bulky base)' },
  { id: 'c-shift', deck: 'SN/E', front: 'When can carbocations rearrange?', back: 'Whenever a free carbocation forms:\nSN1, E1, HX addition, acid hydration\n1,2-H or 1,2-CH₃ shift to a more stable cation' },
  { id: 'c-heat', deck: 'SN/E', front: 'What does heat favour?', back: 'Elimination (E1/E2) over substitution\n(more molecules → entropy)' },
  { id: 'c-markov', deck: 'Alkenes', front: 'Markovnikov’s rule', back: 'H adds to the carbon with more H’s;\nthe other group goes to the more substituted carbon\n(via the more stable carbocation)' },
  { id: 'c-syn-anti', deck: 'Alkenes', front: 'Syn additions vs anti additions', back: 'Syn: H₂/Pt, BH₃, OsO₄, mCPBA\nAnti: Br₂, Br₂/H₂O, mCPBA then H₃O⁺' },
  { id: 'c-norearr', deck: 'Alkenes', front: 'Alkene reactions with NO rearrangements', back: 'Oxymercuration, hydroboration, Br₂ (bromonium),\nhalohydrin, hydrogenation, epoxidation, OsO₄, ozonolysis' },
];
