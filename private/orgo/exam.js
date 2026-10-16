// Exam 3 prep: a one-page printable cheat sheet and a timed mock exam.
// The mock mixes questions from the daily practice keys with new ones on the
// alkene additions and rearrangements, in the same style.

import { PROBLEM_SETS } from './problems.js?v=2';

// ---------------------------------------------------------------- cheat sheet

const T = (h, head, rows, cls = '') => h('table', { class: `cheat-table ${cls}` },
  h('thead', null, h('tr', null, head.map(x => h('th', { text: x })))),
  h('tbody', null, rows.map(r => h('tr', null, r.map(x => h('td', { text: x }))))));

export function cheatSheetPage(C) {
  const { h } = C;
  const sec = (title, ...kids) => h('section', { class: 'cheat-sec' }, h('h3', { text: title }), ...kids);
  const ul = items => h('ul', { class: 'cheat-list' }, items.map(t => h('li', { text: t })));

  return h('div', { class: 'cheat' },
    h('div', { class: 'cheat-head' },
      h('div', null, h('h2', { text: 'Exam 3 cheat sheet' }), h('p', { class: 'muted small', text: 'CHM 2210 · substitution, elimination, alkene additions' })),
      h('button', { type: 'button', class: 'btn btn-small cheat-print', onclick: () => window.print() }, 'Print')),
    h('div', { class: 'cheat-grid' },
      sec('1 · How to predict the product',
        h('ol', { class: 'cheat-list numbered' },
          h('li', { text: 'What does the reagent do? Strong Nu, strong base, both, or weak (solvent).' }),
          h('li', { text: 'Classify the substrate: methyl, 1°, 2°, 3° (and allylic/benzylic).' }),
          h('li', { text: 'Pick the mechanism(s), then work out regio- and stereochemistry.' }))),
      sec('2 · Reagent classes',
        T(h, ['Type', 'Examples', 'Does'], [
          ['Strong Nu, weak base', 'NaCl, NaBr, NaI, NaSH, NaCN, NaN₃, NaOAc', 'SN2 only'],
          ['Strong base, poor Nu', 'NaH, t-BuOK, LDA, DBU, DBN', 'E2 only (bulky → Hofmann)'],
          ['Strong Nu + strong base', 'NaOH, NaOMe, NaOEt', 'SN2 and/or E2'],
          ['Weak Nu, weak base', 'H₂O, MeOH, EtOH (solvent)', 'SN1 / E1 (needs 2°/3°)'],
        ])),
      sec('3 · The decision table',
        T(h, ['', 'Methyl', '1°', '2°', '3°'], [
          ['SN2-only Nu', 'SN2', 'SN2', 'SN2', 'no SN2 (SN1 in protic solvent)'],
          ['Strong Nu + base', 'SN2', 'SN2 (E2 minor)', 'E2 major, SN2 minor', 'E2 only'],
          ['Bulky base', 'SN2', 'E2 (Hofmann)', 'E2 (Hofmann)', 'E2 (Hofmann)'],
          ['Weak (solvent)', '—', '—', 'SN1 + E1 (slow)', 'SN1 + E1; heat → E1'],
        ], 'cheat-decide')),
      sec('4 · Mechanism facts',
        T(h, ['', 'Rate law', 'Steps', 'Stereo', 'Rearranges?'], [
          ['SN2', 'k[RX][Nu]', '1, backside', '100% inversion', 'No'],
          ['SN1', 'k[RX]', '2, R⁺', 'Racemic (slight inversion)', 'Yes'],
          ['E2', 'k[RX][B]', '1, anti-periplanar', 'Stereospecific', 'No'],
          ['E1', 'k[RX]', '2, R⁺', 'Zaitsev, trans', 'Yes'],
        ])),
      sec('5 · Solvent',
        ul(['Polar protic (has O–H/N–H): H₂O, ROH, AcOH. H-bonds to Nu → slows SN2; stabilizes R⁺ → helps SN1/E1.',
          'Polar aprotic: DMSO, DMF, acetone, THF, CH₂Cl₂, MeCN. Leaves Nu "naked" → speeds SN2.',
          'Nonpolar: hexane, benzene, dioxane.'])),
      sec('6 · Leaving groups (better = weaker conjugate base)',
        ul(['TfO⁻ > I⁻, TsO⁻, MsO⁻ > Br⁻ > Cl⁻, H₂O (from R–OH₂⁺) ≫ F⁻, HO⁻, RO⁻ (bad).',
          'Judge by the pKa of the conjugate acid: lower pKa → better LG.',
          'Turn OH into a LG: protonate (HX, H₂SO₄) or make a tosylate (TsCl, pyridine: keeps configuration).'])),
      sec('7 · Elimination regiochemistry and stereo',
        ul(['Zaitsev (more substituted alkene): small bases (NaOH, NaOEt, NaOMe) and E1.',
          'Hofmann (less substituted): bulky bases (t-BuOK, LDA, DBU, DBN).',
          'E2 needs β-H anti-periplanar to LG (180°). On cyclohexanes both must be axial.',
          'E1 always gives Zaitsev/trans and can’t be steered. Bredt: no C=C at a bridgehead.'])),
      sec('8 · Carbocations and rearrangements',
        ul(['Stability: 3° > 2° > 1° > methyl; allylic/benzylic ≈ 3° (resonance).',
          'Shifts happen whenever R⁺ forms (SN1, E1, HX, H₃O⁺) and give a more stable cation.',
          '1,2-H shift or 1,2-CH₃ shift; the group moves with its electron pair.',
          'Ring expansion: cyclobutyl-carbinyl cation → cyclopentyl.',
          'No R⁺ (SN2, E2, oxymercuration, hydroboration, Br₂, H₂) → no shifts.'])),
      sec('9 · Alkene additions',
        T(h, ['Reagent', 'Adds', 'Regio', 'Stereo', 'Shifts?'], [
          ['HX', 'H, X', 'Markovnikov', 'Not specific', 'Yes'],
          ['HBr, ROOR', 'H, Br', 'Anti-Markovnikov', 'Mixture', 'No (radical)'],
          ['H₃O⁺', 'H, OH', 'Markovnikov', 'Not specific', 'Yes'],
          ['1) Hg(OAc)₂, H₂O 2) NaBH₄', 'H, OH', 'Markovnikov', 'Not specific', 'No'],
          ['1) BH₃·THF 2) H₂O₂, NaOH', 'H, OH', 'Anti-Markovnikov', 'Syn', 'No'],
          ['H₂, Pt/Pd/Ni', 'H, H', '—', 'Syn', 'No'],
          ['Br₂ (CH₂Cl₂)', 'Br, Br', '—', 'Anti', 'No'],
          ['Br₂, H₂O', 'OH, Br', 'OH → more subst. C', 'Anti', 'No'],
          ['mCPBA', 'epoxide', '—', 'Syn', 'No'],
          ['1) mCPBA 2) H₃O⁺', 'OH, OH', 'OH → more subst. C', 'Anti', 'No'],
          ['OsO₄, NMO', 'OH, OH', '—', 'Syn', 'No'],
          ['1) O₃ 2) DMS', 'C=O + O=C', 'cleaves', '—', 'No'],
        ], 'cheat-adds')),
      sec('10 · Stereo outcomes',
        ul(['Inversion: SN2. Racemic: SN1, and any addition that makes one new stereocenter from a flat C.',
          'Syn vs anti only matters when both carbons become stereocenters.',
          'Anti addition to a ring → trans product; syn → cis. Two new stereocenters → racemic pair unless meso.',
          'Optical activity: racemic = 0°; ee = (major − minor) %; observed rotation = ee × [α] of pure.'])),
      sec('11 · Traps',
        ul(['Neopentyl (β-branched 1°): SN2 is extremely slow.',
          'Vinyl/aryl halides (sp² C–X): no SN1, no SN2.',
          'NaH, t-BuOK on 1°: E2, not SN2. NaCN/NaN₃ on 3°: no SN2.',
          'Heat favours elimination. Weak Nu + 1°: essentially no reaction.']))));
}

// ---------------------------------------------------------------- mock exam

const FROM_KEYS = ['oct04-1c', 'oct04-5', 'oct04-12', 'oct05-5', 'oct06-2b', 'oct09-2b', 'oct09-7', 'oct12-2', 'oct13-6g', 'oct14-6g', 'oct15-1c', 'oct09-3a', 'oct12-6d'];

const NEW = [
  { id: 'mx-1', topic: 'Alkene additions', prompt: '1-Methylcyclopentene + Br₂ in H₂O. Major product?',
    choices: ['trans-2-Bromo-1-methylcyclopentan-1-ol (+ enantiomer)', 'cis-2-Bromo-1-methylcyclopentan-1-ol', '2-Bromo-2-methylcyclopentan-1-ol', 'trans-1,2-Dibromo-1-methylcyclopentane'],
    answer: 'trans-2-Bromo-1-methylcyclopentan-1-ol (+ enantiomer)',
    explain: 'Bromonium ion first. Water (the solvent) opens it at the more substituted carbon, from the face opposite Br: OH on C1, Br on C2, anti → trans.' },
  { id: 'mx-2', topic: 'Alkene additions', prompt: '3,3-Dimethylbut-1-ene + H₂O, cat. H₂SO₄. Major product?',
    choices: ['2,3-Dimethylbutan-2-ol', '3,3-Dimethylbutan-2-ol', '3,3-Dimethylbutan-1-ol', '2,2-Dimethylbutan-1-ol'],
    answer: '2,3-Dimethylbutan-2-ol',
    explain: 'Protonation gives a 2° cation next to a quaternary carbon. A 1,2-methyl shift makes a 3° cation, and water attacks there.' },
  { id: 'mx-3', topic: 'Alkene additions', prompt: '3,3-Dimethylbut-1-ene, 1) Hg(OAc)₂, H₂O 2) NaBH₄. Major product?',
    choices: ['3,3-Dimethylbutan-2-ol', '2,3-Dimethylbutan-2-ol', '3,3-Dimethylbutan-1-ol', '2,2-Dimethylbutan-1-ol'],
    answer: '3,3-Dimethylbutan-2-ol',
    explain: 'Markovnikov OH, but the mercurinium bridge means no free carbocation, so no methyl shift. Compare with acid hydration of the same alkene.' },
  { id: 'mx-4', topic: 'Alkene additions', prompt: '1-Methylcyclopentene, 1) BH₃·THF 2) H₂O₂, NaOH. Product?',
    choices: ['trans-2-Methylcyclopentan-1-ol (+ enantiomer)', 'cis-2-Methylcyclopentan-1-ol', '1-Methylcyclopentan-1-ol', 'Cyclopentylmethanol'],
    answer: 'trans-2-Methylcyclopentan-1-ol (+ enantiomer)',
    explain: 'Anti-Markovnikov (OH on the less substituted C) and syn addition of H and OH. The H joins C1 on the same face as OH, which puts OH trans to the CH₃.' },
  { id: 'mx-5', topic: 'Alkene additions', prompt: 'Which reagent turns 1-methylcyclohexene into 1-bromo-1-methylcyclohexane?',
    choices: ['HBr', 'HBr, ROOR', 'Br₂, CH₂Cl₂', 'NBS, hν'], answer: 'HBr',
    explain: 'Markovnikov H–Br addition through the 3° carbocation. With peroxides the Br goes to the other carbon (anti-Markovnikov, radical).' },
  { id: 'mx-6', topic: 'Alkene additions', prompt: '1,2-Dimethylcyclohexene + H₂, Pd/C. Product?',
    choices: ['cis-1,2-Dimethylcyclohexane', 'trans-1,2-Dimethylcyclohexane', 'A racemic mixture of trans isomers', '1,2-Dimethylcyclohexanol'],
    answer: 'cis-1,2-Dimethylcyclohexane',
    explain: 'Both H’s add from the metal side (syn), so the two methyls end up on the same face. cis-1,2-Dimethylcyclohexane is meso.' },
  { id: 'mx-7', topic: 'Rearrangements', prompt: '3-Methylbutan-2-ol + HBr. Major product?',
    choices: ['2-Bromo-2-methylbutane', '2-Bromo-3-methylbutane', '1-Bromo-3-methylbutane', '3-Methylbut-1-ene'],
    answer: '2-Bromo-2-methylbutane',
    explain: 'Protonated OH leaves (SN1) to give a 2° cation; a 1,2-hydride shift gives the 3° cation; Br⁻ attacks it.' },
  { id: 'mx-8', topic: 'Rearrangements', prompt: 'Which reaction can give a rearranged carbon skeleton?',
    choices: ['3,3-Dimethylbut-1-ene + HCl', '3,3-Dimethylbut-1-ene, BH₃ then H₂O₂/NaOH', '3,3-Dimethylbut-1-ene + Br₂', '1-Bromo-3,3-dimethylbutane + NaCN'],
    answer: '3,3-Dimethylbut-1-ene + HCl',
    explain: 'Only HCl addition goes through a free carbocation. Hydroboration (concerted), Br₂ (bromonium) and SN2 have none.' },
  { id: 'mx-9', topic: 'Energy diagrams', prompt: 'An energy diagram has two humps with a valley between them, and the first hump is the tallest. Which fits?',
    choices: ['SN1 of a 3° bromide in water', 'SN2 of a 1° bromide with NaCN', 'E2 of a 2° bromide with NaOEt', 'Hydroboration of an alkene'],
    answer: 'SN1 of a 3° bromide in water',
    explain: 'Two transition states with an intermediate (the carbocation) between them = stepwise. Ionization is the slow (tallest) step. SN2, E2 and hydroboration are one step: one hump.' },
  { id: 'mx-10', topic: 'Energy diagrams', prompt: 'For the SN1 reaction of t-BuBr in methanol, which change raises the rate?',
    choices: ['Using t-BuI instead of t-BuBr', 'Doubling [CH₃OH] by adding more methanol', 'Adding NaOMe', 'Switching to DMSO'],
    answer: 'Using t-BuI instead of t-BuBr',
    explain: 'Rate = k[RX]: only the substrate is in the slow step. A better leaving group lowers the ionization barrier. Adding NaOMe would push toward E2 instead.' },
  { id: 'mx-11', topic: 'Mechanism ID', prompt: '(R)-3-Bromo-3-methylhexane in ethanol, room temperature. Mechanism and stereo outcome?',
    choices: ['SN1, racemic ether (slightly more inversion)', 'SN2, pure (S) ether', 'E2, Zaitsev alkene only', 'No reaction'],
    answer: 'SN1, racemic ether (slightly more inversion)',
    explain: '3° substrate + weak nucleophile (solvent) → SN1 (with some E1). The flat cation is attacked on both faces; ion pairing gives a little extra inversion.' },
  { id: 'mx-12', topic: 'Mechanism ID', prompt: 'cis-1-Bromo-4-tert-butylcyclohexane + NaOEt reacts much faster in E2 than the trans isomer. Why?',
    choices: ['In the cis isomer Br is axial, anti-periplanar to axial β-H’s', 'The cis isomer forms a more stable carbocation', 'The trans isomer is more hindered to SN2', 'NaOEt is bulky'],
    answer: 'In the cis isomer Br is axial, anti-periplanar to axial β-H’s',
    explain: 't-Bu locks the chair with t-Bu equatorial. In the cis isomer that forces Br axial, which is what E2 needs on a ring. In trans, Br is equatorial and has no anti-periplanar β-H.' },
];

const pool = () => {
  const all = PROBLEM_SETS.flatMap(s => s.problems.map(p => ({ ...p, from: s.label })));
  const picked = FROM_KEYS.map(id => all.find(p => p.id === id)).filter(p => p && p.choices);
  return [...picked, ...NEW.map(p => ({ ...p, from: 'New' }))];
};
const shuffle = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

const LIMIT_MIN = 50;
const ex = { qs: null, answers: {}, startedAt: 0, spent: 0, paused: true, done: false, timer: null };

function fmtTime(ms) {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
const elapsed = () => ex.spent + (ex.paused ? 0 : Date.now() - ex.startedAt);

export function mockExamPage(C) {
  const { h, card } = C;
  const root = h('div', { class: 'orgo-stack mock' });

  const start = () => {
    ex.qs = shuffle(pool()).map(q => ({ ...q, opts: shuffle(q.choices) }));
    ex.answers = {}; ex.spent = 0; ex.done = false; ex.paused = false; ex.startedAt = Date.now();
    draw();
  };
  const togglePause = () => {
    if (ex.paused) { ex.startedAt = Date.now(); ex.paused = false; }
    else { ex.spent += Date.now() - ex.startedAt; ex.paused = true; }
    draw();
  };
  const finish = () => { if (!ex.paused) { ex.spent += Date.now() - ex.startedAt; ex.paused = true; } ex.done = true; draw(); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  function tick(el) {
    clearInterval(ex.timer);
    ex.timer = setInterval(() => {
      if (!el.isConnected) { clearInterval(ex.timer); return; }
      const left = LIMIT_MIN * 60e3 - elapsed();
      el.textContent = left > 0 ? `${fmtTime(left)} left` : `Time! (+${fmtTime(-left)})`;
      el.classList.toggle('late', left <= 0);
    }, 500);
  }

  function draw() {
    if (!ex.qs) {
      root.replaceChildren(card('Mock Exam 3', null,
        h('p', { text: `${pool().length} multiple-choice questions mixing SN1/SN2/E1/E2, alkene additions, rearrangements and energy diagrams: about half from your daily keys, half new in the same style.` }),
        h('ul', { class: 'bullets' },
          h('li', { text: `${LIMIT_MIN}-minute timer. You can pause it.` }),
          h('li', { text: 'Answers and explanations appear after you submit.' }),
          h('li', { text: 'Questions and answer order are shuffled each time.' })),
        h('button', { type: 'button', class: 'btn btn-primary', onclick: start }, 'Start the mock exam')));
      return;
    }
    const answered = Object.keys(ex.answers).length;
    const right = ex.qs.filter(q => ex.answers[q.id] === q.answer).length;
    const clock = h('span', { class: 'mock-clock', text: '' });
    const bar = h('div', { class: 'mock-bar' },
      ex.done
        ? h('strong', { class: 'mock-score', text: `Score: ${right} / ${ex.qs.length} (${Math.round(100 * right / ex.qs.length)}%) · ${fmtTime(ex.spent)}` })
        : clock,
      h('span', { class: 'muted small', text: ex.done ? '' : `${answered} / ${ex.qs.length} answered` }),
      h('div', { class: 'row' },
        ex.done ? null : h('button', { type: 'button', class: 'btn btn-small', onclick: togglePause }, ex.paused ? 'Resume' : 'Pause'),
        ex.done ? null : h('button', { type: 'button', class: 'btn btn-small btn-primary', onclick: finish }, 'Submit'),
        h('button', { type: 'button', class: 'btn btn-small btn-quiet', onclick: start }, ex.done ? 'New mock exam' : 'Restart')));
    const list = h('ol', { class: `mock-qs${ex.paused && !ex.done ? ' is-paused' : ''}` }, ex.qs.map((q, n) => {
      const mine = ex.answers[q.id];
      return h('li', { class: 'mock-q' },
        h('div', { class: 'mock-q-head' }, h('span', { class: 'mock-n', text: String(n + 1) }), h('span', { class: 'prob-topic', text: q.topic })),
        h('p', { class: 'q-prompt', text: q.prompt }),
        h('div', { class: 'q-options' }, q.opts.map(o => {
          let cls = 'q-opt';
          if (ex.done && o === q.answer) cls += ' right';
          else if (ex.done && o === mine) cls += ' wrong';
          else if (!ex.done && o === mine) cls += ' chosen';
          return h('button', {
            type: 'button', class: cls, disabled: ex.done || ex.paused, 'aria-pressed': String(o === mine),
            onclick: () => { ex.answers[q.id] = o; draw(); },
          }, o);
        })),
        ex.done ? h('div', { class: `q-feedback ${mine === q.answer ? 'ok' : 'no'}` },
          h('strong', { text: mine === q.answer ? 'Correct ✿' : mine ? `Answer: ${q.answer}` : `Skipped. Answer: ${q.answer}` }),
          q.explain ? h('p', { class: 'prob-explain', text: q.explain }) : null,
          h('p', { class: 'muted small', text: q.from === 'New' ? 'New question' : `From the ${q.from} key` })) : null);
    }));
    root.replaceChildren(card('Mock Exam 3', null, bar, ex.paused && !ex.done ? h('p', { class: 'mock-paused', text: 'Paused. Questions are locked until you resume.' }) : null, list));
    if (!ex.done) {
      const left = LIMIT_MIN * 60e3 - elapsed();
      clock.textContent = `${fmtTime(left)} left`;
      tick(clock);
    }
  }

  draw();
  return root;
}
