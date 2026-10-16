// Guided lecture · L4 · Gas exchange and breathing (Ch 30.1–30.3)
export default [
  {
    title: 'What this lecture is about',
    say: [
      'Every cell in your body needs a steady supply of O₂ and has to get rid of CO₂. This lecture is about how animals move those gases between the outside world and their mitochondria (the cell’s power plants).',
      'Here’s the plan: why we need O₂, what partial pressure means, the path O₂ takes, different breathing organs (gills, bird lungs, insect tubes), and finally how mammals breathe and how breathing is controlled.',
    ],
    takeaway: 'Gas exchange means getting O₂ from outside to the mitochondria, and getting CO₂ back out.',
  },
  {
    title: 'Why O₂ in, why CO₂ out',
    say: [
      'Internal respiration happens inside the mitochondria. There, O₂ is the final electron acceptor in aerobic respiration (the last stop that catches the used electrons when cells burn food with oxygen). External respiration is the other half: how an animal gets O₂ from its surroundings and moves it along a path to those mitochondria.',
      'CO₂ is the waste product of aerobic respiration. It has to be removed quickly because it acidifies body fluids (makes them more acidic, lowering pH).',
    ],
    takeaway: 'Mitochondria use O₂ as the final electron acceptor; CO₂ must leave because it makes body fluids acidic.',
    check: {
      q: 'Why does CO₂ need to be removed quickly?',
      a: 'It acidifies body fluids',
      o: ['It is the final electron acceptor', 'It binds to hemoglobin and blocks O₂ forever', 'It makes cells swell with water'],
      why: 'CO₂ forms acid in body fluids and lowers pH, so it has to be cleared out.',
    },
  },
  {
    title: 'Partial pressure, air vs water',
    say: [
      'Partial pressure is how hard one gas in a mix is “pushing” (written PO₂ for oxygen). Gases always move from high partial pressure to low, and the partial pressure evens out between air and a liquid touching it. Watch the left side: O₂ pushes into the water until its partial pressure matches the air above.',
      'But count the dots: at the same partial pressure, the water holds far fewer O₂ molecules than the air does. Same “push”, much less actual O₂.',
    ],
    scene: 'l4-airwater',
    from: 0,
    vars: { temp: 'cool' },
    takeaway: 'At the same partial pressure, water holds much less O₂ than air.',
  },
  {
    title: 'The pathway for oxygen',
    say: [
      'Now follow the O₂ dots through four stages. ① Air fills the lungs. ② O₂ diffuses (spreads from high to low) across the thin walls of the alveoli (tiny air pockets in the lungs) and capillaries (tiniest blood vessels). It goes down its partial pressure gradient (the high-to-low difference): about 100 mmHg in the lungs vs about 40 in the blood arriving there.',
      '③ O₂ grabs onto hemoglobin (the O₂-carrying protein) in red blood cells (watch them turn red) and rides along in the blood. ④ O₂ diffuses out of the blood into body cells (100 → under 40). Watch the purple CO₂ dots take the same route backwards.',
    ],
    scene: 'l4-path',
    from: 0,
    takeaway: 'O₂ always moves from high to low partial pressure: lungs (~100) → blood → cells (<40).',
    check: {
      q: 'Roughly what is the PO₂ in the lungs compared with the blood arriving there?',
      a: 'About 100 mmHg in the lungs vs about 40 in the blood',
      o: ['About 40 in the lungs vs about 100 in the blood', 'Both are about 100', 'About 760 in the lungs vs about 100 in the blood'],
      why: 'O₂ moves from high (~100 mmHg in the lungs) to low (~40 mmHg in the arriving blood).',
    },
  },
  {
    title: 'Bulk flow + diffusion, no pumps',
    say: [
      'Notice the pattern in those four stages: they take turns. O₂ and CO₂ move only by diffusion and bulk flow. There is no active transport (no energy-using pumps).',
      'Bulk flow is a whole fluid moving together and carrying stuff with it: air flowing into the lungs, blood flowing to the tissues. Think of a conveyor belt (bulk flow) and then someone hopping off and walking the last bit (diffusion), again and again.',
    ],
    scene: 'l4-path',
    from: 8,
    takeaway: 'Gases move by taking turns between bulk flow and diffusion; they are never actively pumped.',
    check: {
      q: 'How are O₂ and CO₂ moved through an animal?',
      a: 'By bulk flow and diffusion only',
      o: ['By active transport pumps', 'By diffusion only', 'By bulk flow only'],
      why: 'Gases ride bulk flow and then diffuse, over and over; no active transport.',
    },
  },
  {
    title: 'Breathing organs, ventilation and perfusion',
    say: [
      'Gas exchange membranes are thin sheets of tissue where gases cross. Breathing organs fold and branch a lot to get a huge surface area. Lungs are invaginated (folded inward, holding air inside the body). Gills are evaginated (folded outward, sticking out into the water).',
      'Ventilation means moving air or water over that membrane (bulk flow). Tidal ventilation goes in and out through the same tubes, like a tide, so fresh and used air mix. Unidirectional ventilation is a one-way stream, so there’s no mixing, which works better. Perfusion is blood flow through the capillaries, and it has to be fast enough to pick up the O₂ and carry it away.',
    ],
    takeaway: 'Lungs fold in, gills fold out; one-way ventilation beats tidal; perfusion (blood flow) must keep up.',
    check: {
      q: 'Which type of ventilation avoids mixing fresh and used air or water?',
      a: 'Unidirectional (flow-through)',
      o: ['Tidal', 'Residual', 'Invaginated'],
      why: 'In unidirectional ventilation the air or water flows one way, so fresh and used never mix.',
    },
  },
  {
    title: 'Water is a tough place to breathe',
    say: [
      'Now the water is warm. Watch the dot count drop. O₂ solubility (how much O₂ can dissolve) in water is low, and it gets even lower as water warms up. So water has a low PO₂ compared to air.',
      'Then watch the right side: O₂ diffuses much faster through air than through water. Sea turtle eggs buried in damp sand get plenty of O₂, but if the nest floods, PO₂ drops and the eggs die.',
    ],
    scene: 'l4-airwater',
    from: 4,
    vars: { temp: 'warm' },
    takeaway: 'Water holds little O₂ (even less when warm), and O₂ spreads much slower in water than in air.',
    check: {
      q: 'What happens to O₂ solubility in water as the water gets warmer?',
      a: 'It decreases',
      o: ['It increases', 'It stays the same', 'It doubles'],
      why: 'O₂ dissolves poorly in water, and even less as temperature goes up.',
    },
  },
  {
    title: 'Fish gills: countercurrent exchange',
    say: [
      'Fish gills have a huge surface area. Each gill arch has two rows of filaments (thin strands), and each filament is covered in even thinner flaps called secondary lamellae, where gas exchange happens. Water is pumped one way: in the mouth, over the gills, and out under the opercular flaps (the gill covers).',
      'Blood inside each lamella flows the opposite way to the water. That’s a countercurrent system (“counter” = opposite, “current” = flow). Watch the two lines on the graph: all along the lamella, the blood meets water with a little more O₂ than it has, so O₂ keeps moving in and the blood leaves about 90% full. Same trick as the fox’s leg in Lecture 3!',
    ],
    scene: 'l4-gills',
    from: 0,
    vars: { flow: 'cc' },
    takeaway: 'Water and blood flow in opposite directions, so there’s a high-to-low difference along the whole lamella.',
  },
  {
    title: 'What if they flowed the same way?',
    say: [
      'Flip the toggle to “Same direction”. Now the freshest water meets the emptiest blood, so the difference is big at first.',
      'But watch the two lines meet in the middle at about 50%. Once they’re equal, diffusion stops. That’s why real fish use countercurrent flow.',
    ],
    scene: 'l4-gills',
    from: 0,
    vars: { flow: 'co' },
    takeaway: 'Same-direction flow evens out at ~50%; countercurrent lets blood get ~90% full.',
    check: {
      q: 'Why is countercurrent flow in gills so effective?',
      a: 'Blood always meets water with a bit more O₂, so diffusion continues the whole way',
      o: ['Water and blood mix together in the lamellae', 'Gills pump O₂ by active transport', 'Water flows in and out the same opening'],
      why: 'Opposite flows keep a difference along the whole length; same-direction flow evens out halfway.',
    },
  },
  {
    title: 'Land vertebrates and bird lungs',
    say: [
      'Most land vertebrates use tidal ventilation into dead-end sacs. Their lungs are coated with lung surfactant, a soapy-like coating that lowers surface tension so the thin, wet walls don’t stick together.',
      'Birds use one-way airflow instead. Watch the gold puff: it takes two full breaths to pass all the way through. Inhale 1: into the posterior (back) air sacs. Exhale 1: through the lungs. Inhale 2: into the anterior (front) air sacs. Exhale 2: out. The air sacs work like bellows, so air crosses the lungs in ONE direction.',
    ],
    scene: 'l4-bird',
    from: 0,
    takeaway: 'Bird air sacs act like bellows, pushing air one way through the lungs to supply lots of O₂.',
    check: {
      q: 'In birds, how many breaths does it take one puff of air to pass all the way through?',
      a: 'Two',
      o: ['One', 'Three', 'Four'],
      why: 'Inhale → back sacs, exhale → lungs, inhale → front sacs, exhale → out: two full breaths.',
    },
  },
  {
    title: 'Insects: tubes to every cell',
    say: [
      'Insects and spiders use a tracheal system. Little holes on the abdomen called spiracles lead into air tubes called tracheae, which branch so finely that an air-filled tube reaches close to every cell.',
      'Gases are swapped directly with the outside air, so the circulatory system (blood) does very little to move O₂ and CO₂. It’s like having a straw delivered to every room of the house.',
    ],
    takeaway: 'Insect tracheae (air tubes) bring air right to the cells, so blood barely helps with gas transport.',
  },
  {
    title: 'The mammal airway and lung volumes',
    say: [
      'Mammal airways branch like an upside-down tree: trachea (windpipe) → two primary bronchi (main branches) → secondary bronchi → bronchioles (tiny branches) → alveolar sacs. Each sac’s wall is made of tiny pockets, the alveoli, and that’s where gas exchange happens.',
      'Tidal volume is how much air you move in one breath. Respiratory minute volume is the total air moved in and out per minute. Exercise raises both. Lungs never fully empty: some stale air always stays behind (the residual volume), which keeps the lungs from collapsing. So each breath mixes fresh air with stale air.',
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
      'Mammal lungs sit in the thoracic cavity (the chest space), with the diaphragm, a dome-shaped sheet of muscle, underneath. Watch the curved line under the lungs.',
      'Inhale: the diaphragm contracts and flattens, the chest gets bigger, the lungs get pulled open, and air is sucked in. Exhale: the diaphragm and intercostal muscles (the muscles between the ribs) relax, and the stretchy lungs and chest spring back. That spring-back is called elastic recoil, and it pushes air out. Like letting go of a stretched rubber band.',
    ],
    scene: 'l4-mammal',
    from: 0,
    vars: { mode: 'rest' },
    takeaway: 'Inhaling = diaphragm contracts; exhaling at rest = muscles relax and the lungs spring back.',
  },
  {
    title: 'CO₂ sets the pace',
    say: [
      'Breathing is controlled by negative feedback (a change triggers a response that undoes it, like the thermostat in Lecture 3). If PCO₂ (CO₂ level) rises, H⁺ (acid) goes up and pH falls. The medulla oblongata (the base of the brainstem) senses this and makes you breathe more air per minute. If PO₂ falls, chemoreceptors (chemical sensors) in the aorta and carotid arteries (big neck arteries) alert the medulla too.',
      'The toggle is on “Exercising”: watch the CO₂ bar and the breaths/min and tidal volume numbers climb. Then tap “Hold your breath” and watch CO₂ build up until the medulla pushes faster, deeper breaths.',
    ],
    scene: 'l4-mammal',
    from: 0,
    vars: { mode: 'run' },
    takeaway: 'Rising CO₂ (falling pH) is sensed by the medulla, which makes breathing faster and deeper.',
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
      'Mitochondria need O₂ and make CO₂. Gases move only by bulk flow and diffusion, always from high to low partial pressure. Water is a hard place to breathe (little O₂, slow diffusion), so fish use one-way flow plus countercurrent gills. Birds use air sacs for one-way flow; insects pipe air straight to their cells.',
      'Mammals breathe in and out the same way (tidal) using the diaphragm, always keep some residual air, and adjust breathing by negative feedback from CO₂ sensed in the medulla.',
    ],
    takeaway: 'Big folded surfaces, steep high-to-low differences and smart flow patterns get O₂ in and CO₂ out.',
  },
];
