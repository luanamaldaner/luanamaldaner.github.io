// Guided lecture · L2 · Nutrition, energy and homeostasis (Ch 28.1, 28.2, 28.4)
export default [
  {
    title: 'What this lecture is about',
    say: [
      'This lecture is about why animals eat and how their bodies stay steady on the inside. It’s the foundation for every organ system we’ll study later.',
      'Here’s the plan, in the professor’s order: why animals need energy at all, which nutrients have to come from food, how we measure energy use (metabolic rate), regulators vs conformers, and finally the body’s fluid compartments and how cells build up into organs.',
    ],
    takeaway: 'Food gives energy and building blocks; the body spends that energy keeping its inside organized and steady.',
  },
  {
    title: 'Animals are heterotrophs',
    say: [
      'Animals are heterotrophs: they can’t make their own food like plants do. So they need ready-made organic molecules (carbon-based molecules like sugars, fats and proteins) from other living things.',
      'Food gives them two things. Energy, released by breaking the chemical bonds in those molecules. And building blocks, the raw material for building tissues, needed for growth and for replacing cells all through life. Think of food as both the fuel and the bricks.',
    ],
    takeaway: 'Food = energy (from breaking bonds) + building blocks (for growth and repair).',
    check: {
      q: 'Heterotrophs get their energy by…',
      a: 'Breaking chemical bonds in organic compounds from other organisms',
      o: ['Making sugars from sunlight', 'Absorbing heat from their surroundings', 'Splitting water into H₂ and O₂'],
      why: 'Heterotrophs eat ready-made organic molecules and release energy by breaking their bonds.',
    },
  },
  {
    title: 'Staying organized costs energy',
    say: [
      'Being organized is the most basic feature of life. But the second law of thermodynamics says anything organized, left alone, tends to fall apart and get more random. Your bedroom gets messy on its own; it never tidies itself.',
      'Watch the neat stack of blocks: pieces keep drifting out of place. Energy from food (in the form of ATP, the cell’s energy currency) pays for the work of putting them back.',
    ],
    scene: 'l2-order',
    from: 0,
    vars: { food: 'on' },
    takeaway: 'It takes energy to build and keep order, because order falls apart on its own.',
  },
  {
    title: 'What happens with no energy',
    say: [
      'Now the toggle is set to “No energy in”. Watch the blocks drift off with nothing putting them back. The “how organized?” bar keeps dropping.',
      'That’s why animals have to keep eating even while resting: the fight against the second law never stops.',
      'Animals get food in three main ways: predation (eating other animals), suspension feeding (filtering tiny bits of food out of water) and symbiosis (living with partners that make food for them).',
    ],
    scene: 'l2-order',
    from: 4.5,
    vars: { food: 'off' },
    takeaway: 'No energy in = order is lost. Animals feed by predation, suspension feeding or symbiosis.',
    check: {
      q: 'Why do animals need energy even at rest?',
      a: 'To keep fighting the natural loss of order (2nd law of thermodynamics)',
      o: ['To make new energy out of nothing', 'Because energy can only be stored as protein', 'To slow their cells down'],
      why: 'Organized things drift toward randomness, so it takes nonstop work, paid for with energy, to stay organized.',
    },
  },
  {
    title: 'Essential nutrients',
    say: [
      'Nutrition is how animals get the chemicals and energy they need. The molecules in your body are built from the molecules in your food.',
      'Animals can turn some molecules into others (fats can be turned into carbohydrates, for example). But some have to be eaten already made. Those are essential nutrients: the body needs them but can’t make them. Careful: “essential” means “must come from food”, not “most important”.',
    ],
    takeaway: 'Essential nutrients are needed but can’t be made by the body, so they must come from food.',
  },
  {
    title: 'Essential amino acids: beans + grains',
    say: [
      'Proteins are built from 20 standard amino acids (the building blocks of protein). Your body can make some of them (nonessential). The ones it can’t make are the essential amino acids. Memory trick on the screen: PVT TIM HALL. Histidine was, until recently, thought to be needed only by babies.',
      'Watch the beans fill some slots and the grains fill others. Beans are low in tryptophan and methionine; grains are low in isoleucine and lysine. Together they fill every slot, like two puzzle halves.',
    ],
    scene: 'l2-amino',
    from: 0,
    takeaway: 'Beans + grains together provide all the essential amino acids.',
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
      'Other essential nutrients include essential fatty acids (building blocks of fats) like omega-3 and omega-6. The 3 and 6 tell you where the last double bond sits in the carbon chain.',
      'Essential vitamins: vitamin A (for vision), vitamin K (for blood clotting) and more. Essential minerals are elements you need besides carbon, oxygen, hydrogen and nitrogen: calcium and phosphorus for bones, iodine for thyroid hormones, and iron to make hemoglobin (the O₂-carrying protein in blood).',
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
      'To measure the energy in food, scientists burn it completely with O₂ (turning it into CO₂ and water) and measure how much heat comes off.',
      'One calorie is the heat needed to warm 1 gram of water by 1 °C. Food labels say “Calories” but really mean kilocalories (1 kilocalorie = 1000 calories). Another energy unit is the joule: 1 joule = 0.239 calories.',
      'Food comes as lipids (fats), carbohydrates (sugars and starches) and proteins. If you eat more energy than you need, the extra is usually stored as fat, which packs a lot of energy into a small space.',
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
      'Metabolic rate is how much energy an animal burns (and turns into heat) per day. A high metabolic rate means it has to find and eat lots of food; a low one means it needs less. It’s measured by how much O₂ the animal uses, because aerobic metabolism (burning food with oxygen) uses O₂ and gives off heat.',
      'Basal metabolic rate (BMR) is the “resting” rate: measured at a comfortable temperature, with no recent meal. Watch the curve and the flame: BMR per gram of body goes down as animals get bigger. Tap mouse, then elephant to compare.',
    ],
    scene: 'l2-scale',
    from: 0,
    vars: { animal: 'mouse' },
    takeaway: 'BMR per gram goes down as body size goes up, so small mammals need more food per gram.',
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
      'Exercise raises metabolic rate, but the pattern is different for different animals. Watch the three dots on the graph.',
      'Running humans: it goes up in a straight line as speed goes up. Swimming fish: it shoots up faster and faster (exponentially), because water pushes back harder the faster you go. Flying birds: it’s already high at slow speeds, just to stay in the air.',
    ],
    scene: 'l2-scale',
    from: 8,
    vars: { animal: 'human' },
    takeaway: 'Running humans: straight-line rise. Swimming fish: exponential rise. Slow-flying birds: high just to stay up.',
  },
  {
    title: 'Regulators vs conformers',
    say: [
      'Your cells are bathed in tissue fluid, called interstitial fluid (the fluid between cells). That’s your internal environment. Regulation means keeping it steady even when the outside world changes.',
      'Watch the three lines. The mouse (red) is a regulator: it stays near 37 °C no matter the weather. The alligator (green) is a conformer: its inside just goes along with the outside (dashed line).',
    ],
    scene: 'l2-reg',
    from: 0,
    takeaway: 'Regulators keep their inside steady; conformers let their inside match the outside.',
  },
  {
    title: 'The cost of staying steady',
    say: [
      'Regulating keeps things stable, but it costs a lot of energy and raises metabolic rate. Picture a small mouse staying warm in winter: it has to burn lots of fuel.',
      'Conforming is cheap, but the cells have to handle the changes. Picture an alligator in Gainesville in January: it saves energy, but watch it get slow and sluggish in the cold.',
    ],
    scene: 'l2-reg',
    from: 9,
    takeaway: 'Regulating = stable but costly; conforming = cheap, but cells must put up with change.',
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
      'Animal bodies are mostly water, split into separate compartments (like rooms in a house). Watch the highlight move: plasma (the liquid part of blood), interstitial fluid (around the cells), and intracellular fluid (inside the cells).',
      'Fluid inside cells = intracellular fluid (ICF). Everything outside cells = extracellular fluid (ECF), which includes blood plasma and interstitial fluid. The compartments are walled off by epithelia (sheets of cells) and cell membranes.',
    ],
    scene: 'l2-fluid',
    from: 0,
    takeaway: 'ECF (outside cells) = plasma + interstitial fluid; ICF = fluid inside cells.',
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
      'An epithelium is a sheet of cells that covers a body surface or organ, or lines a hollow space. A simple epithelium is just one layer of cells sitting on a nonliving base layer (the basement membrane). It lines all blood vessels, the intestines and other tubes in the body.',
      'Epithelia pump ions (charged particles like Na⁺), secrete things (hormones, mucus, digestive enzymes, milk, sweat), absorb nutrients from the gut, and sense things (smell, taste). Cell membranes also pump ions, send and receive signals (using receptors), and control what leaks through (using selective ion channels, gates that only let certain ions pass).',
    ],
    takeaway: 'Epithelia and cell membranes are the walls between compartments, and they actively pump, secrete, absorb and signal.',
  },
  {
    title: 'Cells → tissues → organs → systems',
    say: [
      'Now zoom out. Watch the panels light up one by one. In a many-celled animal, cells specialize for different jobs. That’s division of labor, just like the colony cells back in Lecture 1.',
      'Tissue = a group of similar cells. Organ = two or more tissue types put together in a set structure (like the small intestine). Organ system = several organs working together. And notice the pulsing ATP: every cell still has to make its own energy.',
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
      'Animals eat for energy and building blocks. They need energy because order falls apart on its own. Some nutrients are essential and must be eaten. Energy use (metabolic rate) is measured by O₂ use, is higher per gram in small animals, and goes up with activity.',
      'Regulators spend energy to keep their inside steady; conformers save energy but have to cope with change. That inside world is the interstitial fluid, walled off by epithelia and membranes, in a body built from tissues, organs and systems.',
    ],
    takeaway: 'Eat → get energy → spend it keeping the body organized and its inside steady.',
  },
];
