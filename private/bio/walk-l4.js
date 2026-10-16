// Guided lecture · L4 · Gas exchange and breathing (Ch 30.1–30.3)
export default [
  {
    title: 'What this lecture is about',
    say: [
      'Every cell in your body needs a steady supply of O₂ and has to get rid of CO₂. This lecture is about how animals move those gases between the outside world and their mitochondria.',
      'In order: why we need O₂ and partial pressure, the pathway O₂ takes, breathing organs (gills, bird lungs, insect tubes), and finally how mammal breathing works and is controlled.',
    ],
    takeaway: 'Gas exchange is about getting O₂ from the environment to the mitochondria, and CO₂ back out.',
  },
  {
    title: 'Why O₂ in, why CO₂ out',
    say: [
      'Internal respiration happens in the mitochondria: O₂ is the final electron acceptor in aerobic respiration. External respiration is how animals get O₂ from the environment and send it along a pathway to those mitochondria.',
      'CO₂ is the waste product of aerobic respiration, and it must be removed efficiently because it acidifies body fluids.',
    ],
    takeaway: 'Mitochondria use O₂ as the final electron acceptor; CO₂ must leave because it makes body fluids acidic.',
    check: {
      q: 'Why does CO₂ need to be removed efficiently?',
      a: 'It acidifies body fluids',
      o: ['It is the final electron acceptor', 'It binds to hemoglobin and blocks O₂ forever', 'It makes cells swell with water'],
      why: 'CO₂ forms acid in body fluids, lowering pH, so it has to be cleared.',
    },
  },
  {
    title: 'Partial pressure, air vs water',
    say: [
      'Gases move from high to low partial pressure, and the partial pressure of a gas evens out between air and a liquid. Watch the left side: O₂ pushes into the water until its partial pressure matches the air above.',
      'But count the dots: at the same partial pressure, the water holds far fewer O₂ molecules than the air. Same “push”, much less actual O₂.',
    ],
    scene: 'l4-airwater',
    from: 0,
    vars: { temp: 'cool' },
    takeaway: 'At the same partial pressure, there is much less O₂ dissolved in water than in air.',
  },
  {
    title: 'The pathway for oxygen',
    say: [
      'Now follow the O₂ dots through four stages. ① Air fills the lungs. ② O₂ diffuses across the alveolar and capillary walls, down its partial pressure gradient: about 100 mmHg in the lungs vs about 40 in the arriving blood.',
      '③ O₂ binds to hemoglobin on red blood cells (watch them turn red) and rides in the blood. ④ O₂ diffuses from the blood into body cells (100 → under 40). Watch the purple CO₂ dots travel the same route backwards.',
    ],
    scene: 'l4-path',
    from: 0,
    takeaway: 'O₂ always moves down its partial pressure gradient: lungs (~100) → blood → cells (<40).',
    check: {
      q: 'Roughly what is the PO₂ in the lungs compared with the blood arriving there?',
      a: 'About 100 mmHg in the lungs vs about 40 in the blood',
      o: ['About 40 in the lungs vs about 100 in the blood', 'Both are about 100', 'About 760 in the lungs vs about 100 in the blood'],
      why: 'O₂ diffuses from high (~100 mmHg, lungs) to low (~40 mmHg, arriving blood).',
    },
  },
  {
    title: 'Bulk flow + diffusion, no pumps',
    say: [
      'Notice the pattern in those four stages: they alternate. O₂ and CO₂ move only by diffusion and bulk flow. There is no active transport.',
      'Bulk flow is the passive flow of a whole medium carrying stuff with it: air flowing into the lungs, blood flowing to the tissues. Think of a conveyor belt (bulk flow) and then someone hopping off it on foot (diffusion), again and again.',
    ],
    scene: 'l4-path',
    from: 8,
    takeaway: 'Gas transport alternates bulk flow and diffusion; gases are never actively pumped.',
    check: {
      q: 'How are O₂ and CO₂ moved through an animal?',
      a: 'By bulk flow and diffusion only',
      o: ['By active transport pumps', 'By diffusion only', 'By bulk flow only'],
      why: 'The slides stress it: diffusion and bulk flow, no active transport.',
    },
  },
  {
    title: 'Breathing organs, ventilation and perfusion',
    say: [
      'Gas exchange membranes are thin tissue layers where gases cross. Breathing organs fold and branch to get a huge surface area. Lungs are invaginated (folded inward, holding the air inside). Gills are evaginated (folded outward, surrounded by water).',
      'Ventilation is the bulk flow of air or water over the membrane. Tidal ventilation: in and out the same tubes, so fresh and used air mix. Unidirectional ventilation: a one-way stream, no mixing, more efficient. And perfusion (blood flow through the capillaries) must be fast enough to pick O₂ up and deliver it.',
    ],
    takeaway: 'Lungs fold in, gills fold out; one-way ventilation beats tidal; perfusion must keep up.',
    check: {
      q: 'Which type of ventilation avoids mixing fresh and O₂-depleted air or water?',
      a: 'Unidirectional (flow-through)',
      o: ['Tidal', 'Residual', 'Invaginated'],
      why: 'In unidirectional ventilation the medium flows one way, so fresh and used never mix.',
    },
  },
  {
    title: 'Water is a tough place to breathe',
    say: [
      'Now the water is warm. Watch the dot count drop: O₂ solubility in water is low and gets even lower as temperature rises, so water has low PO₂ compared to air.',
      'Then watch the right side: O₂ diffuses much faster through air than through water. Sea turtle eggs in moist sand get plenty of O₂, but if the nest floods, PO₂ drops and the eggs die.',
    ],
    scene: 'l4-airwater',
    from: 4,
    vars: { temp: 'warm' },
    takeaway: 'Water holds little O₂ (even less when warm), and O₂ diffuses much slower in water than in air.',
    check: {
      q: 'What happens to O₂ solubility in water as the water gets warmer?',
      a: 'It decreases',
      o: ['It increases', 'It stays the same', 'It doubles'],
      why: 'O₂ dissolves poorly in water, and even less as temperature rises.',
    },
  },
  {
    title: 'Fish gills: countercurrent exchange',
    say: [
      'Fish gills have an enormous surface area: each gill arch has two rows of filaments, each covered in thin secondary lamellae. Water is pumped one way: in the mouth, over the gills, out under the opercular flaps.',
      'Blood in each lamella flows the opposite way: a countercurrent system. Watch the two lines on the graph: all along the lamella the blood meets water with a bit more O₂, so O₂ keeps diffusing in and the blood leaves about 90% full. Same trick as the fox’s leg in Lecture 3!',
    ],
    scene: 'l4-gills',
    from: 0,
    vars: { flow: 'cc' },
    takeaway: 'Water and blood flow in opposite directions, so a gradient exists along the whole lamella.',
  },
  {
    title: 'What if they flowed the same way?',
    say: [
      'Flip the toggle to “Same direction”. Fresh water meets the emptiest blood, so the gap is big at first.',
      'But watch the two lines meet in the middle at about 50%. Once they’re even, diffusion stops. That’s why the real fish uses countercurrent flow.',
    ],
    scene: 'l4-gills',
    from: 0,
    vars: { flow: 'co' },
    takeaway: 'Same-direction flow evens out at ~50%; countercurrent lets blood get ~90% full.',
    check: {
      q: 'Why is countercurrent flow in gills so effective?',
      a: 'Blood always meets water with a bit more O₂, so diffusion continues the whole way',
      o: ['Water and blood mix together in the lamellae', 'Gills pump O₂ by active transport', 'Water flows in and out the same opening'],
      why: 'Opposite flows keep a gradient along the whole length; same-direction flow evens out halfway.',
    },
  },
  {
    title: 'Land vertebrates and bird lungs',
    say: [
      'Most land vertebrates use tidal ventilation into dead-end sacs. Their lungs are coated with lung surfactant, which reduces surface tension so the exchange tissue doesn’t stick together.',
      'Birds use one-way airflow instead. Watch the gold puff: it takes two full breaths to pass through. Inhale 1: into the posterior air sacs. Exhale 1: through the lungs. Inhale 2: into the anterior sacs. Exhale 2: out. The air sacs work like bellows, so air crosses the lungs in ONE direction.',
    ],
    scene: 'l4-bird',
    from: 0,
    takeaway: 'Bird air sacs act like bellows, pushing air one way through the lungs to supply O₂ at high rates.',
    check: {
      q: 'In birds, how many breaths does it take one puff of air to pass all the way through?',
      a: 'Two',
      o: ['One', 'Three', 'Four'],
      why: 'Inhale → posterior sacs, exhale → lungs, inhale → anterior sacs, exhale → out: two full breaths.',
    },
  },
  {
    title: 'Insects: tubes to every cell',
    say: [
      'Insects and spiders use a tracheal system. Openings called spiracles in the abdomen lead into tubes called tracheae, which branch so a gas-filled tube comes close to every cell.',
      'Gases are exchanged directly with the atmosphere, so the circulatory system plays little role in moving O₂ and CO₂. It’s like having a straw delivered to every room of the house.',
    ],
    takeaway: 'Insect tracheae bring air right to the cells, so blood barely helps with gas transport.',
  },
  {
    title: 'The mammal airway and lung volumes',
    say: [
      'Mammal airways are highly branched: trachea → two primary bronchi → secondary bronchi → bronchioles → alveolar sacs. Each sac’s wall is made of tiny pockets, the alveoli, where gas exchange happens.',
      'Tidal volume is the air moved per breath; respiratory minute volume is the total air in and out per minute. Exercise raises both. Lungs are never fully empty: the residual volume of stale air stays behind (keeping the lungs from collapsing), so each breath mixes fresh and stale air.',
    ],
    takeaway: 'Trachea → bronchi → bronchioles → alveoli; some residual air always stays in the lungs.',
    check: {
      q: 'The air that always stays in the lungs, even after you breathe out hard, is the…',
      a: 'Residual volume',
      o: ['Tidal volume', 'Respiratory minute volume', 'Dead-end volume'],
      why: 'Residual volume is the stale air left behind; it keeps the lung walls from sticking together.',
    },
  },
  {
    title: 'The diaphragm does the work',
    say: [
      'Mammal lungs hang in the thoracic cavity with the diaphragm, a sheet of muscle, underneath. Watch the curved line under the lungs.',
      'Inhale: the diaphragm contracts and flattens, the chest gets bigger, it pulls the lungs open, and air is sucked in. Exhale: the diaphragm and intercostal muscles relax, and the stretchy lungs and chest spring back (elastic recoil), pushing air out. Like letting go of a stretched rubber band.',
    ],
    scene: 'l4-mammal',
    from: 0,
    vars: { mode: 'rest' },
    takeaway: 'Inhaling = diaphragm contracts; exhaling at rest = muscles relax and the lungs recoil.',
  },
  {
    title: 'CO₂ sets the pace',
    say: [
      'Breathing is under negative feedback control (remember the thermostat in Lecture 3). If PCO₂ rises, H⁺ goes up and pH falls. The medulla oblongata detects it and increases respiratory minute volume. If PO₂ falls, chemoreceptors in the aorta and carotid arteries signal the medulla too.',
      'The toggle is on “Exercising”: watch the CO₂ bar and the breaths/min and tidal volume numbers climb. Then tap “Hold your breath” and watch CO₂ build up until the medulla drives faster, deeper breaths.',
    ],
    scene: 'l4-mammal',
    from: 0,
    vars: { mode: 'run' },
    takeaway: 'Rising CO₂ (falling pH) is sensed by the medulla, which speeds up and deepens breathing.',
    check: {
      q: 'Where is a rise in blood CO₂ (fall in pH) mainly detected to drive more breathing?',
      a: 'The medulla oblongata',
      o: ['The hypothalamus', 'The alveoli', 'The diaphragm'],
      why: 'The medulla senses the pH drop; chemoreceptors in the aorta and carotids report low O₂.',
    },
  },
  {
    title: 'Putting it together',
    say: [
      'Mitochondria need O₂ and make CO₂. Gases move only by bulk flow and diffusion, always down partial pressure gradients. Water is a hard medium (little O₂, slow diffusion), so fish use one-way flow plus countercurrent gills. Birds use air sacs for one-way flow; insects pipe air straight to cells.',
      'Mammals breathe tidally with the diaphragm, always keep a residual volume, and adjust breathing by negative feedback from CO₂ sensed in the medulla.',
    ],
    takeaway: 'Big folded surfaces, steep gradients and smart flow patterns get O₂ in and CO₂ out.',
  },
];
