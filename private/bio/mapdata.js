// Concept map: big ideas that show up in more than one Bio 2 lecture.
// Each link is [lecture id, guided-lecture step index, keyword that step's text mentions].
// The keyword is only used by the build check (every link must really talk about the idea).

export const THEMES = [
  ['flow', 'Moving stuff', '#3a8fd8'],
  ['control', 'Control & feedback', '#d0533a'],
  ['balance', 'Water, salt & energy', '#2a9d8f'],
  ['defense', 'Cells & defense', '#8b5cf6'],
];

export const CONCEPTS = [
  {
    id: 'counter', name: 'Countercurrent exchange', theme: 'flow',
    text: 'Two flows run side by side in opposite directions, so heat, gas or salt gets passed along the whole length instead of evening out halfway. Same trick, four different jobs.',
    links: [['L3', 10, 'countercurrent'], ['L4', 7, 'countercurrent'], ['L5', 14, 'countercurrent'], ['L6', 10, 'countercurrent']],
  },
  {
    id: 'diffusion', name: 'Diffusion & partial pressure', theme: 'flow',
    text: 'Gases move on their own from high partial pressure to low. Lungs, gills, capillaries and hemoglobin all just set up the right pressure differences and let diffusion do the work.',
    links: [['L4', 2, 'partial pressure'], ['L4', 4, 'diffusion'], ['L5', 3, 'O₂'], ['L5', 10, 'capillar']],
  },
  {
    id: 'bulk', name: 'Bulk flow (pushing fluid)', theme: 'flow',
    text: 'Moving a whole fluid by pressure: breathing air in, the heart pushing blood, blood pressure pushing fluid out of capillaries and into the kidney filter.',
    links: [['L4', 4, 'bulk flow'], ['L5', 1, 'pump'], ['L5', 12, 'pressure'], ['L6', 8, 'pressure']],
  },
  {
    id: 'surface', name: 'Surface area', theme: 'flow',
    text: 'Exchange happens across surfaces, so bodies fold, branch and fringe them: alveoli, gill filaments, capillary beds, intestinal villi. Size matters too: small animals have lots of surface for their volume and lose heat fast.',
    links: [['L2', 8, 'size'], ['L3', 9, 'small'], ['L4', 5, 'surface'], ['L5', 10, 'capillar'], ['L7', 11, 'surface']],
  },
  {
    id: 'pumps', name: 'Ion pumps & gradients', theme: 'flow',
    text: 'Cells spend ATP pumping ions to build gradients, then let the gradients do jobs: the Na⁺/K⁺ pump sets the neuron’s resting potential, Na⁺ drags glucose into gut cells, the proton pump makes stomach acid, kidney tubes pull salt back in.',
    links: [['L8', 4, 'pump'], ['L7', 6, 'pump'], ['L7', 12, 'Na'], ['L6', 9, 'reabsor']],
  },
  {
    id: 'lymph', name: 'Lymph', theme: 'flow',
    text: 'Fluid that leaks out of capillaries is brought back by lymph vessels. The same system carries absorbed fat out of the gut (fat goes into lymph before blood).',
    links: [['L5', 12, 'leak'], ['L5', 13, 'lymph'], ['L7', 13, 'lymph']],
  },
  {
    id: 'negfb', name: 'Negative feedback', theme: 'control',
    text: 'Sense a change, push it back the other way. It keeps body temperature, CO₂, water and hormone levels near a set point. Most of homeostasis is this one loop.',
    links: [['L3', 7, 'negative feedback'], ['L4', 13, 'CO₂'], ['L6', 12, 'ADH'], ['L9', 12, 'feedback'], ['L9', 13, 'thyroid']],
  },
  {
    id: 'posfb', name: 'Positive feedback', theme: 'control',
    text: 'A change makes itself bigger until something ends it. Rare in the body, but key: Na⁺ channels opening in an action potential, and oxytocin during childbirth.',
    links: [['L3', 8, 'positive feedback'], ['L8', 8, 'Na'], ['L9', 9, 'oxytocin']],
  },
  {
    id: 'homeo', name: 'Homeostasis: regulate or conform', theme: 'control',
    text: 'Regulators keep the inside steady no matter the outside (and pay energy for it). Conformers let the inside follow the outside. You can be a regulator for one thing and a conformer for another.',
    links: [['L2', 10, 'conform'], ['L3', 1, 'homeostasis'], ['L6', 4, 'conform']],
  },
  {
    id: 'adh', name: 'ADH (water-saving hormone)', theme: 'control',
    text: 'Made in the hypothalamus, released from the posterior pituitary, acts on the kidney’s collecting duct to put water back into the blood. More ADH = less, more concentrated urine.',
    links: [['L9', 9, 'ADH'], ['L6', 12, 'ADH']],
  },
  {
    id: 'nervhorm', name: 'Nerves vs hormones', theme: 'control',
    text: 'Two ways to send a message. Nerves: fast, wired to one target, short-lived. Hormones: slower, travel in blood to every cell with the right receptor, effects last longer.',
    links: [['L8', 1, 'CNS'], ['L9', 1, 'nerve'], ['L8', 13, 'fight']],
  },
  {
    id: 'receptors', name: 'Receptors & channels', theme: 'control',
    text: 'A signal only works on cells with a matching receptor. Some receptors are ion channels that open (synapses, gated channels); others start a chain inside the cell (second messengers) or sit inside the cell (steroid hormones).',
    links: [['L8', 6, 'channel'], ['L8', 11, 'receptor'], ['L9', 5, 'second messenger'], ['L9', 6, 'receptor']],
  },
  {
    id: 'osmo', name: 'Osmosis & osmotic pressure', theme: 'balance',
    text: 'Water moves toward the side with more dissolved stuff. That decides whether a fish floods or dries out, how plasma proteins pull fluid back into capillaries, and how the kidney concentrates urine.',
    links: [['L6', 1, 'osmotic'], ['L6', 2, 'water'], ['L5', 12, 'osmotic'], ['L2', 12, 'fluid']],
  },
  {
    id: 'energy', name: 'Energy & metabolic rate', theme: 'balance',
    text: 'Staying alive and organized costs energy. Metabolic rate depends on size and activity, and keeping warm (homeotherms) costs far more than letting the outside set your temperature.',
    links: [['L2', 2, 'energy'], ['L2', 8, 'metabolic rate'], ['L2', 9, 'activity'], ['L3', 4, 'food'], ['L3', 5, 'heat']],
  },
  {
    id: 'nwaste', name: 'Nitrogen waste', theme: 'balance',
    text: 'Breaking down proteins leaves nitrogen (as ammonia). Animals get rid of it as ammonia, urea or uric acid depending on how much water they can spare. The liver turns ammonia into urea.',
    links: [['L6', 5, 'nitrogen'], ['L7', 9, 'liver']],
  },
  {
    id: 'kidneyfilter', name: 'Special capillaries', theme: 'balance',
    text: 'Not all capillaries are the same: brain capillaries have no pores (blood–brain barrier), while the kidney’s glomerulus is full of them so blood pressure can push fluid out to start urine.',
    links: [['L5', 11, 'brain'], ['L6', 8, 'filtration']],
  },
  {
    id: 'water', name: 'Life in water vs air', theme: 'balance',
    text: 'Water holds far less O₂ and is heavy to move, so gills need countercurrent flow. Water also pushes salt and water in or out of the body, so fish need ways to fight osmosis.',
    links: [['L4', 6, 'water'], ['L4', 7, 'gill'], ['L6', 2, 'freshwater'], ['L6', 3, 'salt']],
  },
  {
    id: 'hydrolysis', name: 'Digestion = hydrolysis', theme: 'balance',
    text: 'Big food molecules get split with water by enzymes (pepsin in the stomach, pancreatic enzymes in the small intestine) into pieces small enough to absorb.',
    links: [['L7', 2, 'hydrolysis'], ['L7', 7, 'pepsin'], ['L7', 8, 'pancrea']],
  },
  {
    id: 'layers', name: 'Germ layers & the gut tube', theme: 'defense',
    text: 'Early embryos form layers (ecto-, endo-, mesoderm) and a gut opening. That ‘tube’ plan is still there in you: the digestive tract is one long tube through the body.',
    links: [['L1', 5, 'germ layer'], ['L1', 6, 'mesoderm'], ['L7', 1, 'tube']],
  },
  {
    id: 'levels', name: 'Cells → tissues → organs', theme: 'defense',
    text: 'The first animals were teams of cells; then cells specialized. Today cells form tissues (like epithelia), tissues form organs, and organs form systems.',
    links: [['L1', 3, 'cell'], ['L2', 13, 'epitheli'], ['L2', 14, 'tissue']],
  },
  {
    id: 'self', name: 'Self vs non-self', theme: 'defense',
    text: 'The immune system has to attack invaders but not you. Antigens are the shapes it recognizes; T cells read them on MHC molecules, and cells that would attack your own body are removed.',
    links: [['L10', 8, 'antigen'], ['L10', 13, 'MHC'], ['L10', 9, 'clonal']],
  },
  {
    id: 'memory', name: 'Immune memory & vaccines', theme: 'defense',
    text: 'After an infection, memory cells stay around, so the second response is faster and bigger. Vaccines give you that memory without the disease.',
    links: [['L10', 10, 'memory'], ['L10', 14, 'vaccin']],
  },
  {
    id: 'inflam', name: 'Inflammation', theme: 'defense',
    text: 'Injury or infection makes nearby vessels widen and leak, so fluid and white blood cells reach the spot: redness, heat, swelling. It reuses the same capillary leak from circulation.',
    links: [['L10', 7, 'inflammation'], ['L10', 2, 'white blood cell'], ['L5', 12, 'leak']],
  },
];
