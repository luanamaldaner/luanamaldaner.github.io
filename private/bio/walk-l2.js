// Guided lecture · L2 · Nutrition, energy and homeostasis (Ch 28.1, 28.2, 28.4)
export default [
  {
    title: 'What this lecture is about',
    say: [
      'This lecture is about why animals eat and how their bodies stay steady inside. It’s the foundation for every organ system we’ll study later.',
      'We’ll go in the professor’s order: why animals need energy at all, which nutrients must come from food, how we measure energy use (metabolic rate), regulators vs conformers, and finally the body’s fluid compartments and levels of organization.',
    ],
    takeaway: 'Food gives energy and building blocks; the body spends that energy keeping its inside organized and steady.',
  },
  {
    title: 'Animals are heterotrophs',
    say: [
      'Animals are heterotrophs: they can’t make their own food, so they need preformed organic molecules from other organisms.',
      'Food gives them two things. Energy, from breaking the chemical bonds in those molecules. And building blocks, the matter they build their tissues from, needed for growth and to replace cells throughout life. Think of food as both the fuel and the bricks.',
    ],
    takeaway: 'Food = energy (from breaking bonds) + chemical building blocks (for growth and repair).',
    check: {
      q: 'Heterotrophs get their energy by…',
      a: 'Breaking chemical bonds in organic compounds from other organisms',
      o: ['Making sugars from sunlight', 'Absorbing heat from their surroundings', 'Splitting water into H₂ and O₂'],
      why: 'Heterotrophs eat preformed organic molecules and release energy by breaking their bonds.',
    },
  },
  {
    title: 'Staying organized costs energy',
    say: [
      'Organization is the most essential attribute of life. But the second law of thermodynamics says any organized system left to itself tends to lose organization and become more random. Your bedroom gets messy on its own; it never tidies itself.',
      'Watch the neat stack of blocks: pieces keep drifting out of place. Energy from food (as ATP) pays for the work of putting them back.',
    ],
    scene: 'l2-order',
    from: 0,
    vars: { food: 'on' },
    takeaway: 'It takes energy to create and maintain organization, because order falls apart on its own.',
  },
  {
    title: 'What happens with no energy',
    say: [
      'Now the toggle is set to “No energy in”. Watch the blocks drift off and nothing puts them back. The “how organized?” bar keeps dropping.',
      'That’s why animals have to keep eating even when they’re resting: the fight against the second law never stops.',
      'Animals get that food in three main ways: predation (eating other animals), suspension feeding (filtering small bits out of water) and symbiosis (partners that make food for them).',
    ],
    scene: 'l2-order',
    from: 4.5,
    vars: { food: 'off' },
    takeaway: 'No energy in = order is lost. Animals feed by predation, suspension feeding or symbiosis.',
    check: {
      q: 'Why do animals need energy even at rest?',
      a: 'To keep fighting the natural loss of order (2nd law of thermodynamics)',
      o: ['To make new energy out of nothing', 'Because energy can only be stored as protein', 'To slow their cells down'],
      why: 'Organized systems drift toward randomness, so it takes constant work, paid for with energy, to stay organized.',
    },
  },
  {
    title: 'Essential nutrients',
    say: [
      'Nutrition is how animals meet their needs for chemical substances and energy. The molecules in your body are made from the molecules in your food.',
      'Animals can interconvert some molecules (lipids can be turned into carbohydrates, for example). But some must be eaten fully formed. Those are essential nutrients: required, but the animal can’t make them. Careful: “essential” means “must come from food”, not “most important”.',
    ],
    takeaway: 'Essential nutrients are required but can’t be synthesized, so they must come from food.',
  },
  {
    title: 'Essential amino acids: beans + grains',
    say: [
      'Proteins use 20 standard amino acids. You can make some (nonessential); the ones you can’t are the essential amino acids. Memory trick on the screen: PVT TIM HALL. Histidine was until recently thought to be needed only by infants.',
      'Watch the beans fill some slots and grains fill others. Beans are short on tryptophan and methionine; grains are short on isoleucine and lysine. Together they fill every slot, like two puzzle halves.',
    ],
    scene: 'l2-amino',
    from: 0,
    takeaway: 'Beans + grains together provide all eight essential amino acids.',
    check: {
      q: 'Why do beans and grains together give all the essential amino acids?',
      a: 'Each one has the ones the other is short on',
      o: ['Beans already have all of them', 'Grains turn into beans when digested', 'Cooking makes the missing ones'],
      why: 'Beans bring isoleucine and lysine; grains bring tryptophan and methionine.',
    },
  },
  {
    title: 'Fatty acids, vitamins and minerals',
    say: [
      'Other essential nutrients: essential fatty acids like omega-3 and omega-6. The 3 and 6 refer to the carbon position of the last double bond.',
      'Essential vitamins: vitamin A (vision), vitamin K (blood clotting) and more. Essential minerals are elements needed besides C, O, H and N: calcium and phosphorus for bone, iodine for thyroid hormones, and iron to make hemoglobin.',
    ],
    takeaway: 'Omega-3/6 fatty acids, vitamins (A, K…) and minerals (Ca, P, I, Fe) are also essential.',
    check: {
      q: 'Iodine is an essential mineral because it’s needed to make…',
      a: 'Thyroid hormones',
      o: ['Hemoglobin', 'Bone', 'Blood-clotting factors'],
      why: 'Iodine → thyroid hormones; iron → hemoglobin; calcium and phosphorus → bone.',
    },
  },
  {
    title: 'Measuring energy in food',
    say: [
      'The energy in food is measured by burning it completely with O₂ (making CO₂ and H₂O) and measuring the heat it gives off.',
      'One calorie is the heat needed to raise 1 gram of water by 1 °C. Food labels say “calories” but actually mean kilocalories (1000 calories). And 1 joule = 0.239 calories.',
      'Food comes as lipids, carbohydrates and proteins. Eat more energy than you need, and the extra is usually stored as energy-dense lipids.',
    ],
    takeaway: 'A food-label Calorie is a kilocalorie = 1000 calories; extra energy is stored mostly as fat.',
    check: {
      q: 'A snack label says 200 Calories. How many calories (small c) is that?',
      a: '200,000',
      o: ['200', '2,000', '20'],
      why: 'A food Calorie is a kilocalorie, so 200 × 1000 = 200,000 calories.',
    },
  },
  {
    title: 'Metabolic rate and body size',
    say: [
      'Metabolic rate is the chemical-bond energy an animal uses (and turns into heat) per day. High metabolic rate = must find and eat lots of food; low rate = lower food needs. It’s measured by O₂ consumption, since aerobic metabolism uses O₂ and makes heat.',
      'Basal metabolic rate (BMR) is measured at a comfortable temperature with no recent meal. Watch the curve and the flame: BMR per gram drops as size goes up. Tap mouse, then elephant to compare.',
    ],
    scene: 'l2-scale',
    from: 0,
    vars: { animal: 'mouse' },
    takeaway: 'BMR per gram decreases as body size increases, so small mammals need more food per gram.',
    check: {
      q: 'Per gram of body, which has the highest basal metabolic rate?',
      a: 'A mouse',
      o: ['A human', 'A cat', 'An elephant'],
      why: 'BMR per gram falls as body size rises; the mouse is the smallest.',
    },
  },
  {
    title: 'Activity raises metabolic rate',
    say: [
      'Physical activity increases metabolic rate, but the shape differs. Watch the three dots on the graph.',
      'Humans running: it rises in a straight line with speed. Fish: it rises exponentially, because water pushes back harder and harder. Birds: at low speed it’s already high, just to stay in the air.',
    ],
    scene: 'l2-scale',
    from: 8,
    vars: { animal: 'human' },
    takeaway: 'Running humans: linear rise. Swimming fish: exponential rise. Slow-flying birds: high just to stay up.',
  },
  {
    title: 'Regulators vs conformers',
    say: [
      'Your cells are bathed in tissue fluid (interstitial fluid): the internal environment. Regulation means keeping it constant even when the outside changes.',
      'Watch the three lines. The mouse (red) is a regulator: it stays near 37 °C whatever the weather. The alligator (green) is a conformer: its inside just follows the outside (dashed line).',
    ],
    scene: 'l2-reg',
    from: 0,
    takeaway: 'Regulators keep internal conditions constant; conformers let them match the outside.',
  },
  {
    title: 'The cost of staying steady',
    say: [
      'Regulating gives stability, but it’s energetically expensive and raises metabolic rate. Picture a small mouse keeping warm in winter: it has to burn lots of fuel.',
      'Conforming is cheap, but the cells must cope with changes. Picture an alligator in Gainesville in January: it saves energy, but watch it get slow and sluggish in the cold.',
    ],
    scene: 'l2-reg',
    from: 9,
    takeaway: 'Regulating = stable but costly; conforming = cheap, but cells must tolerate change.',
    check: {
      q: 'An alligator’s body temperature drops on a cold January day. It’s a…',
      a: 'Conformer',
      o: ['Regulator', 'Autotroph', 'Homeostatic regulator'],
      why: 'Its inside follows the outside: cheap, but it gets sluggish.',
    },
  },
  {
    title: 'The body’s fluid compartments',
    say: [
      'Animal bodies are mostly water, split into compartments. Watch the highlight move: plasma (fluid part of blood), interstitial fluid around the cells, and intracellular fluid inside the cells.',
      'Fluid inside cells = intracellular fluid. Everything else = extracellular fluid, which includes blood plasma and interstitial fluid. The compartments are separated by epithelia and cell membranes.',
    ],
    scene: 'l2-fluid',
    from: 0,
    takeaway: 'ECF = plasma + interstitial fluid; ICF = fluid inside cells.',
    check: {
      q: 'Which fluid is NOT part of the extracellular fluid?',
      a: 'Fluid inside the cells',
      o: ['Blood plasma', 'Interstitial fluid', 'Fluid bathing the cells'],
      why: 'ECF = interstitial fluid + plasma; fluid inside cells is intracellular fluid.',
    },
  },
  {
    title: 'Epithelia and membranes',
    say: [
      'An epithelium is a sheet of cells covering a body surface or organ, or lining a cavity. A simple epithelium is one layer of cells on a nonliving basement membrane; it lines all blood vessels, the intestines and other tubules.',
      'Epithelia pump ions, secrete things (hormones, mucus, digestive enzymes, milk, sweat), absorb nutrients from the gut, and sense (smell, taste). Cell membranes also pump ions, help make and receive signals (receptors), and control diffusion (selective ion channels).',
    ],
    takeaway: 'Epithelia and cell membranes are the walls between compartments, and they actively pump, secrete, absorb and signal.',
  },
  {
    title: 'Cells → tissues → organs → systems',
    say: [
      'Now zoom out. Watch the panels light up one by one. In a multicellular animal, cells specialize for different jobs: division of labor, just like the colony cells back in Lecture 1.',
      'Tissue = cells of a similar type. Organ = two or more tissue types with a defined structural relationship (like the small intestine). Multi-organ system = several organs working together. And notice the pulsing ATP: each cell still has to make its own.',
    ],
    scene: 'l2-fluid',
    from: 8.6,
    takeaway: 'Tissue (similar cells) → organ (2+ tissues) → organ system; every cell makes its own ATP.',
    check: {
      q: 'Two or more tissue types joined in a set structure make up a(n)…',
      a: 'Organ',
      o: ['Tissue', 'Organ system', 'Cell'],
      why: 'Tissue = similar cells; organ = 2+ tissue types; organ system = several organs working together.',
    },
  },
  {
    title: 'Putting it together',
    say: [
      'Animals eat for energy and building blocks. They need energy because order falls apart on its own. Some nutrients are essential and must be eaten. Energy use (metabolic rate) is measured by O₂ use, is higher per gram in small animals, and rises with activity.',
      'Regulators spend energy to keep the internal environment steady; conformers save energy but must cope. That internal environment is the interstitial fluid, walled off by epithelia and membranes, inside a body built from tissues, organs and systems.',
    ],
    takeaway: 'Eat → get energy → spend it keeping the body organized and its internal environment steady.',
  },
];
