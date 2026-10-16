export default [
  {
    title: 'What this lecture is about',
    say: [
      'Every animal is a little bag of salty water, and the world around it is either too salty, not salty enough, or totally dry. This lecture is about how animals keep their inside water and salt just right.',
      'We go from fish in rivers and oceans, to the nitrogen waste every animal makes, to the star of the show: your kidney and its tiny tubes called nephrons. We finish with the hormone chain that raises blood pressure.',
    ],
    takeaway: 'Animals spend energy to keep their water and salt balanced, and the kidney is the main tool for it.',
  },
  {
    title: 'Osmotic pressure: which way water goes',
    say: [
      'Osmotic pressure is just a measure of how much stuff (solute) is dissolved in water. Water always moves toward the side with MORE dissolved stuff, like it is trying to dilute it. Heads-up: one slide has a typo here, but "water goes toward more solute" is the right rule.',
      'Three words compare two solutions: isosmotic means the same, hyperosmotic means higher, and hyposmotic means lower. Separately, each ion (like Na⁺ or K⁺) spreads from where it is crowded to where it is not, so two solutions with the same osmotic pressure can still have different ions.',
    ],
    takeaway: 'Water moves toward higher osmotic pressure (more solute); ions spread from high to low concentration.',
    check: {
      q: 'Solution A has more dissolved solute than solution B. Compared to B, A is…',
      a: 'Hyperosmotic',
      o: ['Hyposmotic', 'Isosmotic', 'An osmoconformer'],
      why: 'Hyper means higher: A has the higher osmotic pressure, so water would move from B into A.',
    },
  },
  {
    title: 'Freshwater fish: water floods in',
    scene: 'l6-fish', from: 0, vars: { mode: 'fresh' },
    say: [
      'A fish in a river is saltier than the water around it (hyperosmotic). So, using the rule from step 2, water keeps pouring in and salt keeps leaking out. Watch the blue water dots rushing in and the salt dots slipping out.',
      'To fight this, the fish makes lots of very dilute urine to dump the extra water, and spends ATP to pump Na⁺ and Cl⁻ back in at its gills. That makes it a hyperosmotic regulator.',
    ],
    takeaway: 'Freshwater fish: lots of dilute urine + gills actively pump salt IN.',
  },
  {
    title: 'Ocean fish and salt glands',
    scene: 'l6-fish', from: 0, vars: { mode: 'sea' },
    say: [
      'Flip it around. A bony fish in the sea is less salty than the seawater (hyposmotic), so it loses water and gains salt. Watch the water dots leaking out and the salt coming in.',
      'Its fix: drink seawater to get water back, then pump the extra ions out through the gut and gills. That is a hyposmotic regulator. Seabirds, ocean lizards and sea turtles eat salty food, so they use salt glands (organs outside the kidney) that burn ATP to get rid of the extra salt.',
    ],
    takeaway: 'Ocean bony fish drink seawater and pump salt OUT; seabirds and turtles use salt glands.',
    check: {
      q: 'Why does a marine bony fish drink seawater?',
      a: 'It keeps losing water by osmosis to the saltier sea',
      o: ['It needs extra salt', 'It is isosmotic with the sea', 'To make lots of dilute urine'],
      why: 'The fish is hyposmotic to seawater, so water leaves its body; drinking replaces it, and the extra salt is pumped out.',
    },
  },
  {
    title: 'Salmon switch sides, others just conform',
    scene: 'l6-fish', from: 0, vars: { mode: 'salmon' },
    say: [
      'Salmon are born in rivers, grow up in the ocean, then swim back to rivers to spawn. They switch modes. Watch the label at the top right: prolactin is the "freshwater" hormone (gill chloride cells pump salt IN), and cortisol is the "saltwater" hormone (chloride cells pump salt OUT).',
      'Most ocean invertebrates skip all that work. They are osmoconformers: their body fluids just match the sea. Some, like mussels, handle a wide range of salinity. The blue crab is different: it is an osmoregulator that keeps its inside constant.',
    ],
    takeaway: 'Salmon: prolactin = freshwater mode, cortisol = saltwater mode. Most sea invertebrates are osmoconformers.',
  },
  {
    title: 'Getting rid of nitrogen waste',
    scene: 'l6-nitrogen', from: 0,
    say: [
      'Breaking down proteins and nucleic acids leaves nitrogen behind. Which form an animal gets rid of depends on how much water it can spare. Watch each column light up in turn and compare the bars.',
      'Ammonia: most toxic but dissolves easily, so water-breathing animals just let it wash away. Urea (most land animals, like us): costs more energy but is less toxic. Uric acid (insects, reptiles, birds): costs the most, but barely dissolves, so it saves water.',
    ],
    takeaway: 'Less water available → more energy spent → less toxic, less soluble waste (ammonia → urea → uric acid).',
    check: {
      q: 'Which nitrogen waste do birds mainly excrete, and why?',
      a: 'Uric acid, because it is insoluble and saves water',
      o: ['Ammonia, because it is cheapest', 'Urea, because it is the most toxic', 'Ammonia, because it is insoluble'],
      why: 'Uric acid is the most expensive to make but barely dissolves, so very little water is lost getting rid of it.',
    },
  },
  {
    title: 'The four jobs of a kidney tube',
    say: [
      'Every kidney-like tube does four things. Filtration: water and small stuff get pushed through a barrier while cells and big molecules stay behind. Reabsorption: the good stuff is taken back into the body. Secretion: extra wastes are moved INTO the tube. Osmoconcentration: water is pulled out so the urine gets concentrated.',
      'Different animals have different tubes: simple invertebrates use protonephridia (cilia push fluid), many use meso- or metanephridia (fluid pressure, needs a circulatory system), and arthropods use Malpighian tubules (driven by secreting ions).',
    ],
    takeaway: 'Filtration, reabsorption, secretion, osmoconcentration: the four renal processes.',
    check: {
      q: 'Moving a specific solute FROM the blood INTO the tubule for excretion is called…',
      a: 'Secretion',
      o: ['Reabsorption', 'Filtration', 'Osmoconcentration'],
      why: 'Secretion adds selected solutes to the tubule; reabsorption is the opposite direction.',
    },
  },
  {
    title: 'Kidneys and the nephron',
    say: [
      'Your two kidneys sit on the back side of your abdomen. Blood comes in through the renal artery and leaves through the renal vein. Urine drains down the ureters into the bladder, which empties through the urethra (reptiles and birds empty into the hindgut instead).',
      'Each kidney has about a million nephrons, the smallest working unit. Think of a nephron as a coffee filter plus a long sorting tube. The blood part: afferent arteriole, glomerulus, efferent arteriole, peritubular capillaries. The tube part: Bowman’s capsule, proximal tubule, loop of Henle, distal tubule, collecting duct.',
    ],
    takeaway: 'The nephron = a blood part (glomerulus and friends) wrapped around a tube part (capsule → collecting duct).',
    check: {
      q: 'Which vessel brings blood INTO the glomerulus?',
      a: 'Afferent arteriole',
      o: ['Efferent arteriole', 'Peritubular capillaries', 'Renal vein'],
      why: 'Afferent = arriving. The efferent arteriole carries blood away from the glomerulus.',
    },
  },
  {
    title: 'Step ① Filtration',
    scene: 'l6-nephron', from: 0,
    say: [
      'Watch the glowing ball at the top left: that is the glomerulus, a tuft of leaky capillaries. Blood pressure pushes water and small solutes out of it into Bowman’s capsule, the cup around it.',
      'Cells and big proteins are too large to get through, so they stay in the blood. The fluid in the capsule is now called filtrate. It still has lots of good stuff in it, which is why the next step matters.',
    ],
    takeaway: 'Filtration: blood pressure pushes protein-free plasma from the glomerulus into Bowman’s capsule.',
  },
  {
    title: 'Step ② Reabsorption',
    scene: 'l6-nephron', from: 5,
    say: [
      'Now the proximal tubule lights up. Watch the dots leaving the tube back toward the blood. This is reabsorption, and it is very picky.',
      'Mammals take back about 99% of the filtered salt and water and 100% of the glucose and amino acids, mostly right here in the proximal tubule. To get back, a substance crosses the tubule cell and then the capillary wall. Water moves passively by osmosis; Na⁺ is mostly pumped actively with ATP.',
    ],
    takeaway: 'Most reabsorption happens in the proximal tubule: 100% of glucose and amino acids, 99% of salt and water.',
    check: {
      q: 'Where does MOST reabsorption happen?',
      a: 'Proximal tubule',
      o: ['Collecting duct', 'Glomerulus', 'Ascending limb'],
      why: 'The proximal tubule takes back the bulk of filtered water, salt, glucose and amino acids.',
    },
  },
  {
    title: 'Step ③ Loop of Henle makes the medulla salty',
    scene: 'l6-nephron', from: 10,
    say: [
      'Watch the hairpin dip down into the medulla. Going down (descending limb), only water can leave. Coming up (ascending limb), only salt leaves, and that is pumped with ATP. See how the background gets saltier toward the bottom, up to 1200.',
      'This "countercurrent multiplier" builds a salty medulla. Two helpers protect it: the vasa recta, hairpin capillaries that do countercurrent exchange, and urea, which leaks out of the bottom of the collecting duct and gets recycled to add saltiness.',
    ],
    takeaway: 'Descending limb: water out only. Ascending limb: salt out only (active). Result: a salty medulla up to 1200 mOsm.',
    check: {
      q: 'What can leave the DESCENDING limb of the loop of Henle?',
      a: 'Water only',
      o: ['Salt only, using ATP', 'Both salt and water', 'Glucose and amino acids'],
      why: 'The descending limb lets water out but not Na⁺; the ascending limb is the reverse.',
    },
  },
  {
    title: 'Step ④ Secretion',
    scene: 'l6-nephron', from: 15,
    say: [
      'Now the distal tubule glows. Watch dots moving from the blood INTO the tube: that is secretion, the opposite of reabsorption.',
      'Here the body adds extra K⁺ and H⁺ to the urine. The distal tubule and collecting duct are where the "fine-tuning" happens: controlled reabsorption of Na⁺ and water and secretion of K⁺ and H⁺. The proximal tubule from step 10 is the bulk, uncontrolled part.',
    ],
    takeaway: 'Distal tubule and collecting duct: controlled Na⁺/water reabsorption and K⁺/H⁺ secretion.',
  },
  {
    title: 'Step ⑤ ADH decides how concentrated urine is',
    scene: 'l6-nephron', from: 20, vars: { adh: 'on' },
    say: [
      'Last stop, the collecting duct runs down through that salty medulla from step 11. ADH (vasopressin) adds AQ2 water channels (aquaporins) to the distal tubule and collecting duct. Watch water dots leave the duct: you get a little, very concentrated urine, up to 1200 mOsm.',
      'Now try the toggle: set ADH low. The duct stays waterproof, water stays in, and out comes lots of dilute urine. Think of ADH as "save water mode" for when you are thirsty.',
    ],
    takeaway: 'More ADH = more aquaporins = more water kept = less, more concentrated urine.',
    check: {
      q: 'When ADH is high, the urine is…',
      a: 'Small in volume and very concentrated',
      o: ['Large in volume and dilute', 'Large in volume and concentrated', 'Exactly isosmotic with blood'],
      why: 'ADH opens water channels, so water leaves the collecting duct into the salty medulla.',
    },
  },
  {
    title: 'Renin–angiotensin–aldosterone: the chain',
    scene: 'l6-raas', from: 0,
    say: [
      'This is how the kidney raises blood pressure. Follow the glowing spark along the boxes. The juxtaglomerular apparatus (JGA) senses low Na⁺, low blood volume or low blood pressure, and releases the enzyme renin.',
      'Renin cuts angiotensinogen (a protein always floating in blood) into angiotensin I. Watch the bead chain get shorter. Then ACE in the lung circulation trims it into angiotensin II, which is the main trigger for aldosterone from the adrenal cortex.',
    ],
    takeaway: 'Renin → angiotensin I → (ACE, lungs) → angiotensin II → aldosterone.',
    check: {
      q: 'What converts angiotensin I into angiotensin II?',
      a: 'ACE in the lung circulation',
      o: ['Renin from the JGA', 'Aldosterone from the adrenal cortex', 'ADH from the pituitary'],
      why: 'Renin makes angiotensin I; angiotensin-converting enzyme (ACE) in the pulmonary circulation makes angiotensin II.',
    },
  },
  {
    title: 'What aldosterone does',
    scene: 'l6-raas', from: 9,
    say: [
      'Watch the three bottom boxes light up together, and the blood pressure needle climb. Per the slides, aldosterone raises blood pressure three ways: more Na⁺ reabsorbed in the distal tubule and collecting duct (water follows the salt), more ADH so the kidney keeps water (step 13), and squeezing the arterioles.',
      'Once pressure is back to normal, renin release switches off. That is negative feedback, like a thermostat turning off the heater.',
    ],
    takeaway: 'Aldosterone → keep Na⁺ and water + more ADH + tighter arterioles → blood pressure up, then renin stops.',
  },
  {
    title: 'Putting it together',
    say: [
      'Water follows solute, and animals spend energy to fight it: freshwater fish pump salt in and pee a lot, sea fish drink and pump salt out, salmon switch with prolactin and cortisol. Nitrogen waste depends on water: ammonia, urea, uric acid.',
      'In the nephron: filtration at the glomerulus, bulk reabsorption in the proximal tubule, the loop of Henle builds a salty medulla, the distal tubule secretes K⁺ and H⁺, and ADH sets how concentrated the urine is. When pressure drops, renin → angiotensin → aldosterone brings it back up.',
    ],
    takeaway: 'Filter, take back, add wastes, concentrate, and let hormones (ADH, aldosterone) fine-tune water and salt.',
    check: {
      q: 'A person is dehydrated with low blood pressure. Which pair of hormones would rise to help?',
      a: 'ADH and aldosterone',
      o: ['Prolactin and cortisol', 'Insulin and glucagon', 'Less ADH and less aldosterone'],
      why: 'ADH saves water and the renin–angiotensin–aldosterone system saves Na⁺ and raises pressure.',
    },
  },
];
