// Mnemonics for lists worth memorizing. Each has the list, the mnemonic, and how it maps.
export const MNEMONICS = [
  // ---------- Bio 2 ----------
  {
    topic: 'Bio 2', title: 'Anterior pituitary hormones',
    list: ['FSH', 'LH', 'ACTH', 'TSH', 'Prolactin', 'Endorphins', 'GH'],
    mnemonic: 'FLAT PEG',
    note: 'FLAT are tropic hormones (act on other glands); PEG act directly.'
  },
  {
    topic: 'Bio 2', title: 'Posterior pituitary hormones',
    list: ['ADH (vasopressin)', 'Oxytocin'],
    mnemonic: 'Pee and Push',
    note: 'ADH controls pee (water reabsorption); oxytocin pushes (labor contractions, milk letdown). Both are made in the hypothalamus and only stored/released by the posterior pituitary.'
  },
  {
    topic: 'Bio 2', title: 'Heart valves in the order blood passes them',
    list: ['Tricuspid', 'Pulmonary (semilunar)', 'Mitral (bicuspid)', 'Aortic (semilunar)'],
    mnemonic: 'Try Pulling My Aorta',
    note: 'Full path: venae cavae → right atrium → tricuspid → right ventricle → pulmonary valve → pulmonary artery → lungs → pulmonary veins → left atrium → mitral → left ventricle → aortic valve → aorta.'
  },
  {
    topic: 'Bio 2', title: 'ECG waves',
    list: ['P wave: atria depolarize', 'QRS complex: ventricles depolarize', 'T wave: ventricles repolarize'],
    mnemonic: 'Pump the atria · Quick, Really Strong squeeze · Time-out',
    note: 'P = atria fire; QRS = ventricles fire and squeeze (atrial repolarization is hidden inside it); T = ventricles reset. Order is always P, QRS, T.'
  },
  {
    topic: 'Bio 2', title: 'Nephron segments (filtrate path)',
    list: ['Bowman\'s capsule (with glomerulus)', 'Proximal convoluted tubule', 'Descending limb of loop of Henle', 'Ascending limb of loop of Henle', 'Distal convoluted tubule', 'Collecting duct'],
    mnemonic: 'Big Puddles Don\'t Always Drain Completely',
    note: 'B-P-D-A-D-C. Most reabsorption happens in the PCT; the descending limb is water-permeable, the ascending limb pumps out salt.'
  },
  {
    topic: 'Bio 2', title: 'RAAS steps',
    list: ['Renin (from kidney JG cells)', 'Angiotensinogen (from liver)', 'Angiotensin I', 'ACE (mostly in lungs)', 'Angiotensin II', 'Aldosterone (adrenal cortex)'],
    mnemonic: 'Really Anxious Aunts Always Act Adorable',
    note: 'Low BP → renin cuts angiotensinogen into Ang I → ACE turns it into Ang II → Ang II constricts vessels and triggers aldosterone → Na+ and water retained → BP rises.'
  },
  {
    topic: 'Bio 2', title: 'White blood cells, most to least abundant',
    list: ['Neutrophils', 'Lymphocytes', 'Monocytes', 'Eosinophils', 'Basophils'],
    mnemonic: 'Never Let Monkeys Eat Bananas',
    note: 'Neutrophils are the first responders to bacteria; basophils are the rarest.'
  },
  {
    topic: 'Bio 2', title: 'Cranial nerves (I to XII)',
    list: ['Olfactory', 'Optic', 'Oculomotor', 'Trochlear', 'Trigeminal', 'Abducens', 'Facial', 'Vestibulocochlear', 'Glossopharyngeal', 'Vagus', 'Accessory (spinal accessory)', 'Hypoglossal'],
    mnemonic: 'Oh Oh Oh To Touch And Feel Very Good Velvet, Such Heaven',
    note: 'One word per nerve, in order. "Such" = Spinal accessory.'
  },
  {
    topic: 'Bio 2', title: 'Cranial nerves: sensory, motor or both',
    list: ['I S', 'II S', 'III M', 'IV M', 'V B', 'VI M', 'VII B', 'VIII S', 'IX B', 'X B', 'XI M', 'XII M'],
    mnemonic: 'Some Say Marry Money But My Brother Says Big Brains Matter More',
    note: 'S = sensory, M = motor, B = both, matched to nerves I to XII in order.'
  },
  {
    topic: 'Bio 2', title: 'Germ layers and what they form',
    list: ['Ectoderm: epidermis, hair, nervous system', 'Mesoderm: muscle, bone, blood, heart, kidneys, gonads', 'Endoderm: lining of gut and lungs, liver, pancreas'],
    mnemonic: 'Ecto-attracto, Meso-means, Endo-innards',
    note: 'Ectoderm makes what attracts (skin, hair) plus the nervous system; mesoderm is the means of moving (muscle, bone, blood); endoderm lines the innards.'
  },
  {
    topic: 'Bio 2', title: 'Antibody classes',
    list: ['IgG', 'IgA', 'IgM', 'IgE', 'IgD'],
    mnemonic: 'GAMED',
    note: 'G: most common in blood, crosses the placenta. A: in secretions and breast milk. M: made first, pentamer. E: allergies and parasites (binds mast cells). D: B-cell receptor. (Not a strict abundance order; IgE is the rarest.)'
  },
  {
    topic: 'Bio 2', title: 'Parasympathetic effects (rest and digest)',
    list: ['Salivation', 'Lacrimation (tears)', 'Urination', 'Digestion', 'Defecation'],
    mnemonic: 'SLUDD',
    note: 'Parasympathetic also slows heart rate and constricts pupils and airways. Sympathetic (fight or flight) does the opposite: faster heart, dilated pupils and bronchioles, slowed digestion.'
  },
  {
    topic: 'Bio 2', title: 'Where digestion of each nutrient starts',
    list: ['Starch: mouth (salivary amylase)', 'Protein: stomach (pepsin)', 'Fat: small intestine (pancreatic lipase + bile)'],
    mnemonic: 'Starch Starts in the mouth, Protein in the Pit (stomach), Lipids Last',
    note: 'All three finish in the small intestine: pancreatic amylase; trypsin and chymotrypsin; lipase. Brush border enzymes (maltase, sucrase, lactase, peptidases) do the last step. Enzyme names hint at targets: amyl-ase (starch), lip-ase (lipid), lact-ase (lactose).'
  },
  {
    topic: 'Bio 2', title: 'Adrenal cortex layers (outer to inner)',
    list: ['Zona glomerulosa: aldosterone', 'Zona fasciculata: cortisol', 'Zona reticularis: androgens'],
    mnemonic: 'GFR: Salt, Sugar, Sex (the deeper you go, the sweeter it gets)',
    note: 'Salt = mineralocorticoid, sugar = glucocorticoid, sex = androgens. The medulla in the center makes epinephrine and norepinephrine.'
  },

  // ---------- Orgo 1 ----------
  {
    topic: 'Orgo 1', title: 'SN1 / SN2 / E1 / E2 conditions',
    list: ['SN2: strong nucleophile, methyl or 1° (not 3°), polar aprotic, one step, inversion', 'SN1: weak nucleophile, 3°, polar protic, carbocation, racemization', 'E2: strong base, any degree (3° fastest), anti-periplanar H, one step', 'E1: weak base, 3°, heat, carbocation'],
    mnemonic: 'The number = how many molecules are in the slow step',
    note: '"1" reactions wait for the leaving group to leave alone (carbocation, so 3° and protic solvents help, and rearrangements can happen). "2" reactions happen in one concerted step with both partners, so rate depends on both.'
  },
  {
    topic: 'Orgo 1', title: 'CIP priority and R/S',
    list: ['Higher atomic number = higher priority', 'Tie? Go to the first point of difference', 'Double/triple bonds count as duplicated atoms', 'Point the lowest priority away, trace 1 → 2 → 3'],
    mnemonic: 'R = Right (clockwise), S = Sinister (counterclockwise)',
    note: 'From Latin rectus and sinister. If the lowest priority points toward you, flip your answer.'
  },
  {
    topic: 'Orgo 1', title: 'Carbocation stability',
    list: ['3° (tertiary)', '2° (secondary)', '1° (primary)', 'Methyl'],
    mnemonic: 'More friends, more support',
    note: 'Each alkyl "friend" donates electron density (hyperconjugation and induction). Allylic and benzylic cations get extra stability from resonance. Radicals follow the same order.'
  },
  {
    topic: 'Orgo 1', title: 'Halide leaving group ability',
    list: ['I⁻', 'Br⁻', 'Cl⁻', 'F⁻ (poor)'],
    mnemonic: 'Weak bases leave happily',
    note: 'Good leaving groups are conjugate bases of strong acids (HI > HBr > HCl). Tosylate (TsO⁻) and water are also good; OH⁻ is poor until protonated to H2O.'
  },
  {
    topic: 'Orgo 1', title: 'Markovnikov\'s rule',
    list: ['H adds to the carbon that already has more H\'s', 'The other group (X, OH) goes to the more substituted carbon'],
    mnemonic: 'The rich get richer',
    note: 'Because the more substituted carbocation is more stable. Anti-Markovnikov exceptions: HBr with peroxides, and hydroboration-oxidation.'
  },
  {
    topic: 'Orgo 1', title: 'Alkane prefixes (1 to 10 carbons)',
    list: ['Meth (1)', 'Eth (2)', 'Prop (3)', 'But (4)', 'Pent (5)', 'Hex (6)', 'Hept (7)', 'Oct (8)', 'Non (9)', 'Dec (10)'],
    mnemonic: 'Monkeys Eat Peeled Bananas',
    note: 'Covers 1 to 4. From 5 on, think shapes and words: pentagon, hexagon, heptathlon, octopus, nonagon, decade.'
  },
  {
    topic: 'Orgo 1', title: 'Functional group priority (IUPAC naming)',
    list: ['Carboxylic acid', 'Ester', 'Amide', 'Nitrile', 'Aldehyde', 'Ketone', 'Alcohol', 'Amine', 'alkEnes / alkynes'],
    mnemonic: 'Cats Eat Any Noodle And Keep All Additional Extras',
    note: 'Highest priority gets the suffix. Anhydrides rank just above esters and acid halides just below; halides and ethers are only ever prefixes.'
  },
  {
    topic: 'Orgo 1', title: 'Factors in acid strength (stability of the conjugate base)',
    list: ['Atom (size and electronegativity)', 'Resonance', 'Induction', 'Orbital (more s character)'],
    mnemonic: 'ARIO',
    note: 'Check in this order. The more stable the negative charge on the conjugate base, the stronger the acid.'
  },

  // ---------- Microbiology ----------
  {
    topic: 'Micro', title: 'Gram stain steps',
    list: ['Crystal violet', 'Iodine (mordant)', 'Alcohol (decolorizer)', 'Safranin (counterstain)'],
    mnemonic: 'Come In And Stay',
    note: 'Gram-positive (thick peptidoglycan) stays purple; Gram-negative loses the purple and turns pink. Purple = Positive.'
  },
  {
    topic: 'Micro', title: 'Bacterial growth curve phases',
    list: ['Lag', 'Log (exponential)', 'Stationary', 'Death (decline)'],
    mnemonic: 'Lazy Lions Sleep Deeply',
    note: 'Lag: adjusting, no division yet. Log: fastest growth, most antibiotic-sensitive. Stationary: nutrients run out, births = deaths. Death: cells die exponentially.'
  },
  {
    topic: 'Micro', title: 'Taxonomic ranks',
    list: ['Domain', 'Kingdom', 'Phylum', 'Class', 'Order', 'Family', 'Genus', 'Species'],
    mnemonic: 'Dear King Philip Came Over For Good Soup',
    note: 'Scientific names use the last two: Genus species, italicized (Escherichia coli).'
  },
  {
    topic: 'Micro', title: 'Koch\'s postulates',
    list: ['Find the microbe in every case of the disease', 'Isolate it in pure culture', 'Infect a healthy host and the disease appears', 'Isolate the same microbe again from that host'],
    mnemonic: 'Find, Isolate, Infect, Isolate again',
    note: 'Exceptions: microbes that can\'t be grown in culture (e.g., Treponema pallidum, Mycobacterium leprae) and asymptomatic carriers.'
  },
  {
    topic: 'Micro', title: 'Cell arrangements',
    list: ['Diplo-: pairs', 'Strepto-: chains', 'Staphylo-: grape-like clusters', 'Tetrads: groups of four'],
    mnemonic: 'Strepto = string, Staphylo = grape bunch',
    note: 'Staphyle is Greek for a bunch of grapes; streptos means twisted chain. Example: Streptococcus in chains, Staphylococcus in clusters.'
  },
  {
    topic: 'Micro', title: 'Horizontal gene transfer',
    list: ['Transformation: takes up free DNA', 'Transduction: a phage delivers DNA', 'Conjugation: direct contact through a pilus'],
    mnemonic: 'Take, Deliver, Contact',
    note: 'Transformation = Take it up; transDuction = virus Delivers it; Conjugation = Contact (cell to cell, often passing a plasmid).'
  },
  {
    topic: 'Micro', title: 'Lytic phage replication steps',
    list: ['Attachment', 'Penetration', 'Biosynthesis', 'Maturation (assembly)', 'Release (lysis)'],
    mnemonic: 'All Phages Build More Replicas',
    note: 'Temperate phages can instead enter the lysogenic cycle, inserting their DNA into the host chromosome as a prophage.'
  },
  {
    topic: 'Micro', title: 'Antibiotics that target ribosome subunits',
    list: ['30S: Aminoglycosides', '30S: Tetracyclines', '50S: Chloramphenicol', '50S: Clindamycin', '50S: Erythromycin (macrolides)', '50S: Linezolid'],
    mnemonic: 'Buy AT 30, CCEL (sell) at 50',
    note: 'Bacterial ribosomes are 70S (30S + 50S), different from our 80S, which is why these drugs can be selective.'
  }
];
