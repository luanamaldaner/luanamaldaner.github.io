// Lecture 6 study questions (Ch 29.2 + supplements): osmoregulation and excretion.
// Model answers, grounded in l6.js and walk-l6.js. Same order as the professor’s sheet.

export default [
  {
    q: 'Define hyper-, iso-, and hypoosmotic, and explain how ionic composition of fluids on different sides of a membrane affect osmotic pressures.',
    a: 'These words compare the osmotic pressure (how much dissolved stuff, or solute, is in the water) of two solutions.\n• Hyperosmotic: has MORE solute than the other solution.\n• Isosmotic: has the SAME amount of solute.\n• Hyposmotic: has LESS solute.\nWater moves by osmosis toward the side with more solute (the hyperosmotic side), as if trying to dilute it. Osmotic pressure depends on the total amount of dissolved particles, not which ones they are. Separately, each ion (charged particle like Na⁺, K⁺ or Cl⁻) diffuses down its own gradient, from where it is crowded to where it isn’t. So two fluids can be isosmotic (no net water movement) and still have different ions, which will keep leaking across if the membrane lets them. Example: a freshwater fish is hyperosmotic to the river, so water pours in and salt ions leak out.',
  },
  {
    q: 'Explain each of the following and give an example:\n• Hyperosmotic regulator\n• Hyposmotic regulator\n• Marine osmoconformer',
    a: '• Hyperosmotic regulator: an animal that actively keeps its body fluids SALTIER than its surroundings. Example: a freshwater fish. Water floods in, so it makes lots of dilute urine and uses ATP to pump Na⁺ and Cl⁻ in at its gills.\n• Hyposmotic regulator: an animal that actively keeps its body fluids LESS salty than its surroundings. Example: a marine bony fish. It loses water to the sea, so it drinks seawater, pumps the extra salt out at its gills, and makes very little urine.\n• Marine osmoconformer: a sea animal that doesn’t fight it. Its body fluids simply match the seawater (isosmotic), so it spends no energy on water balance. Example: most marine invertebrates (animals without a backbone), such as mussels.',
  },
  {
    q: 'How do seabirds and marine reptiles get rid of excess salts in their bodies?',
    a: 'They use salt glands: special organs separate from the kidney that use ATP to pump out extra salt. Seabirds, sea turtles and marine iguanas take in lots of salt from their food and seawater, and the salt gland gets rid of it as a very salty fluid (in birds it often drips from the nostrils).',
  },
  {
    q: 'If a fish moved from fresh water to salt water, which hormone would help it to compensate for the saltier environment? How about if a fish moved from salt water to fresh water?',
    a: '• Fresh water → salt water: cortisol. It switches the gill chloride cells to pump salt OUT (“saltwater mode”).\n• Salt water → fresh water: prolactin. It switches the gills to pump salt IN (“freshwater mode”).\nSalmon do this as they move between rivers and the ocean. Memory trick: Prolactin = Pond, Cortisol = Coast.',
  },
  {
    q: 'In fish, where are chloride cells located, and what do they do in fresh water and salt water?',
    a: 'Chloride cells are salt-pumping cells in the gills.\n• In fresh water: they actively pump Na⁺ and Cl⁻ IN from the water, replacing salt that leaks out of the body (prolactin sets this mode).\n• In salt water: they actively pump Na⁺ and Cl⁻ OUT, getting rid of the extra salt the fish gains from the sea and from drinking seawater (cortisol sets this mode).\nEither way it costs ATP, because the salt is moved against its gradient.',
  },
  {
    q: 'On this graph, which is an osconformer and which is an osmoregulator?',
    a: 'I can’t see the graph, but this kind of graph plots the animal’s internal (body fluid) osmotic concentration against the outside water’s concentration.\n• Osmoconformer: the line that rises diagonally, because its insides go up and down to match the outside (internal = external). Example: most marine invertebrates, like mussels.\n• Osmoregulator: the line that stays roughly flat, because it keeps its insides about the same no matter how salty the outside gets. Example: the blue crab, or fish.\nSo: sloped line = conformer, flat line = regulator.',
  },
  {
    q: 'What is the primary form of nitrogenous waste that each of the following would be expected to excrete:\n• A freshwater fish\n• A dog\n• An iguana (lizard)',
    a: 'Breaking down proteins and nucleic acids leaves nitrogen waste, and which form an animal uses depends on how much water it can spare.\n• A freshwater fish: ammonia. Very toxic, but it dissolves easily and the surrounding water just washes it away, and it costs the least energy.\n• A dog: urea. Like other mammals, it makes urea, which is less toxic than ammonia and costs more energy to make.\n• An iguana (lizard): uric acid. Reptiles (and birds and insects) make uric acid, which costs the most energy but barely dissolves, so it saves the most water.',
  },
  {
    q: 'Explain the 4 basic processes that take place in the renal tubules:\n• Filtration\n• Secretion\n• Reabsorption\n• Osmoconcentration',
    a: '“Renal” just means kidney.\n• Filtration: pressure pushes water and small dissolved molecules out of the blood through a barrier, like a strainer; cells and big proteins stay behind. In us this happens from the glomerulus into Bowman’s capsule, and the fluid is now called filtrate.\n• Secretion: chosen substances are moved FROM the blood INTO the tube to get rid of them, e.g. extra K⁺ and H⁺ in the distal tubule.\n• Reabsorption: useful stuff is taken back FROM the tube INTO the blood. Mammals take back about 99% of filtered salt and water and 100% of glucose and amino acids, mostly in the proximal tubule.\n• Osmoconcentration: water is pulled out of the tube so the urine ends up concentrated (in mammals, up to about 1200 mOsm), using the salty kidney medulla and ADH.',
  },
  {
    q: 'Explain the 3 types of renal organs (protonephridia, meso/metanephridia, malpighian tubules) and provide an example of a type of animal with each.',
    a: '• Protonephridia: simple tubes in simple invertebrates, where tiny beating hairs (cilia) pull body fluid into the tube. Example: flatworms such as planaria.\n• Meso/metanephridia: tubes where fluid is pushed in by fluid pressure, so the animal needs a circulatory system to supply it. Example: earthworms (annelids). (Vertebrate kidneys work on the same pressure-filtration idea.)\n• Malpighian tubules: tubes in arthropods (insects and relatives) that branch off the gut. Ions are pumped into the tube and water follows by osmosis; the fluid then empties into the gut. Example: insects, like grasshoppers. The flatworm and earthworm examples come from standard intro bio. (Not covered in the site’s notes; check your slides.)',
  },
  {
    q: 'Identify the key parts of a nephron on a figure and briefly explain the function of each part:\n• Afferent arteriole\n• Glomerulus\n• Efferent arteriole\n• Peritubular capillaries\n• Bowman’s capsule\n• Proximal tubule\n• Loop of Henle\n• Distal tubule\n• Collecting duct\n• Juxtaglomerular apparatus',
    a: 'The nephron is the kidney’s smallest working unit (about a million per kidney): a blood part wrapped around a tube part. On a figure, the ball and its cup sit at the top in the outer kidney (cortex), the hairpin loop dips down into the inner kidney (medulla), and the collecting duct runs straight down.\n• Afferent arteriole: small artery that brings blood INTO the glomerulus (Afferent = Arrives).\n• Glomerulus: ball of leaky capillaries where blood pressure pushes fluid out; this is where filtration happens.\n• Efferent arteriole: carries blood AWAY from the glomerulus (Efferent = Exits) to the peritubular capillaries.\n• Peritubular capillaries: capillaries wrapped around the tubule that take back what is reabsorbed (and supply what is secreted).\n• Bowman’s capsule: the cup around the glomerulus that catches the filtrate.\n• Proximal tubule: first twisty part of the tube; does most reabsorption (all glucose and amino acids, most salt and water). The big bulk step.\n• Loop of Henle: hairpin that dips into the medulla. Descending limb lets water out, ascending limb pumps salt out, making the medulla very salty (countercurrent multiplier).\n• Distal tubule: second twisty part; fine-tuning. Controlled Na⁺ and water reabsorption and secretion of K⁺ and H⁺.\n• Collecting duct: carries urine down through the salty medulla; when ADH adds water channels, water leaves and the urine gets concentrated.\n• Juxtaglomerular apparatus (JGA): spot where the distal tubule touches the afferent arteriole. It senses low blood pressure, volume or Na⁺ and releases renin.',
  },
  {
    q: 'The descending limb of the loop of Henle allows reabsorption of _______ but not ________.',
    a: 'Water, but not salt (Na⁺/NaCl). Water leaves by osmosis into the salty medulla. Memory trick: Descending = water Departs.',
  },
  {
    q: 'The ascending limb of the loop of Henle allows reabsorption of _______ but not ________.',
    a: 'Salt (Na⁺/NaCl), but not water. The salt is actively pumped out using ATP (in the thick upper part), while the walls stay waterproof. Memory trick: Ascending = salt Actively pumped.',
  },
  {
    q: 'What is meant by the “countercurrent multiplier” of the kidney?',
    a: 'It’s the loop of Henle’s trick for making the medulla (inner kidney) very salty. “Countercurrent” means the two limbs sit side by side with fluid flowing in opposite directions (down, then back up). The ascending limb pumps salt out into the surrounding tissue, which draws water out of the descending limb; the fluid that reaches the bottom is now saltier, so the ascending limb has even more salt to pump, and so on. Repeating this “multiplies” a small difference at each level into a big gradient, from about 300 mOsm near the cortex up to about 1200 mOsm deep in the medulla. That salty medulla is what lets the collecting duct pull water out of the urine.',
  },
  {
    q: 'What causes aquaporin 2 channels to be added to the kidney, where are they added, and what do they accomplish?',
    a: '• Cause: the hormone ADH (antidiuretic hormone, also called vasopressin), released from the posterior pituitary when the body needs to save water (e.g. dehydration, when the blood is too concentrated).\n• Where: in the cells of the distal tubule and collecting duct.\n• What they do: aquaporin-2s are water channels (“little doors for water”). With them in place, water leaves the collecting duct by osmosis into the salty medulla and returns to the blood. Result: a small amount of very concentrated urine (up to about 1200 mOsm). With low ADH the duct stays waterproof and you make lots of dilute urine. (Alcohol blocks ADH, which is why it makes you pee more.)',
  },
  {
    q: 'What do the vasa recta accomplish in the kidney and, very briefly, how do they do this?',
    a: 'The vasa recta are hairpin-shaped capillaries running alongside the loop of Henle in the medulla. They bring blood to the medulla and carry away reabsorbed water WITHOUT washing away its salt gradient. How: countercurrent exchange. Blood going down picks up salt and loses water as the tissue gets saltier; blood coming back up does the reverse, dropping the salt and picking up water. So the salt mostly stays in the medulla and the gradient built by the loop of Henle is preserved.',
  },
  {
    q: 'What is meant by “urea recycling” in the kidney, and how does this affect water reabsorption?',
    a: 'Urea (the nitrogen waste in our urine) leaks out of the bottom part of the collecting duct into the deep medulla. Some of it gets back into the loop of Henle and cycles through again, so urea keeps building up in the deep medulla instead of all leaving in the urine. That extra solute makes the medulla even more concentrated (more osmotic pressure), so more water is drawn out of the collecting duct by osmosis. Result: more water reabsorbed and more concentrated urine.',
  },
  {
    q: 'What are the stimuli for renin secretion from the juxtaglomerular apparatus, and how does this ultimately result in aldosterone secretion?',
    a: '• Stimuli: low blood pressure, low blood volume, or low Na⁺, sensed by the juxtaglomerular apparatus (JGA, where the distal tubule touches the afferent arteriole).\n• The chain: the JGA releases the enzyme renin → renin cuts angiotensinogen (an inactive protein from the liver, always in the blood) into angiotensin I → ACE (angiotensin-converting enzyme) in the lungs’ blood vessels converts angiotensin I into angiotensin II → angiotensin II signals the adrenal cortex (outer layer of the adrenal gland, on top of the kidney) to release aldosterone.\nMemory trick: “Really Anxious Aunts Always Act Adorable” = Renin, Angiotensinogen, Angiotensin I, ACE, Angiotensin II, Aldosterone.',
  },
  {
    q: 'What are the primary functions of aldosterone?',
    a: 'Aldosterone’s overall job is to raise blood volume and blood pressure.\n• Main effect: makes the distal tubule and collecting duct reabsorb more Na⁺; water follows the salt, so blood volume and pressure rise.\n• Your slides also list: more ADH (so the kidney keeps more water) and squeezing the arterioles tighter (vasoconstriction). Heads-up: in real physiology angiotensin II is what directly does those two, but for the exam remember the whole system raises pressure all three ways.\n• Once pressure is back to normal, renin release shuts off (negative feedback).\n• Aldosterone also makes the distal tubule and collecting duct secrete more K⁺ into the urine. (Not covered in the site’s notes; check your slides.)',
  },
];
