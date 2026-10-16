export default [
  {
    title: 'What this lecture is about',
    say: [
      'Germs are everywhere, yet most days you don’t get sick. This lecture is about how your body defends itself, and it all rests on one idea: telling "self" (your own molecules) from "nonself" (foreign ones).',
      'We start with the fast, general defenses you are born with (innate), then move to the slow, precise defenses that learn and remember (adaptive): B cells, antibodies, T cells, memory and vaccines.',
    ],
    takeaway: 'Immune defense is built on telling self from nonself.',
  },
  {
    title: 'Three phases, two kinds of defense',
    say: [
      'Every response has three phases: recognition (self or nonself?), activation (mobilize cells and molecules) and effector (destroy the invader). Like a security guard who spots an intruder, calls backup, then removes them.',
      'Innate defenses are nonspecific, the first line, and act within minutes to hours: skin, toxic molecules, phagocytes and inflammation. Adaptive defenses target one specific pathogen, are switched on by the innate system, take days to weeks, and last. B cells make antibodies; T cells kill infected cells (cytotoxic) or help other defenses (helper).',
    ],
    takeaway: 'Innate = fast and general; adaptive = slow, specific and long-lasting.',
    check: {
      q: 'Which describes ADAPTIVE defenses?',
      a: 'Specific to one pathogen and slower to develop',
      o: ['Nonspecific and active within minutes', 'Only physical barriers like skin', 'The same for every pathogen'],
      why: 'Adaptive defenses take days to weeks, target specific pathogens and are long-lasting.',
    },
  },
  {
    title: 'Meet the white blood cells',
    say: [
      'White blood cells (leukocytes) come in teams. Specialists: basophils and eosinophils, involved in allergies and fighting parasites. Phagocytes: big cells that swallow pathogens (phagocytosis). Macrophages and dendritic cells also carry news between the innate and adaptive systems.',
      'Lymphocytes: B cells and T cells work in adaptive immunity. Natural killer (NK) cells are the odd ones out: they work in BOTH innate and adaptive immunity.',
    ],
    takeaway: 'Phagocytes eat; B and T cells are adaptive; NK cells do both innate and adaptive.',
    check: {
      q: 'Which lymphocytes take part in BOTH innate and adaptive immunity?',
      a: 'Natural killer (NK) cells',
      o: ['B cells', 'Helper T cells', 'Basophils'],
      why: 'B and T cells are adaptive; NK cells work in both systems.',
    },
  },
  {
    title: 'The walls: skin and mucus',
    scene: 'l10-layers', from: 0,
    say: [
      'Innate defenses meet germs the moment they land. Watch the bacteria bounce off the skin: it is a physical barrier they can rarely get through.',
      'Openings like the gut and airways are lined with mucosal tissue. Its mucus traps microbes and contains antimicrobial proteins like defensins. Good microbes (bacteria, fungi) living on these surfaces compete with pathogens and keep them in check, like tenants who leave no room for squatters.',
    ],
    takeaway: 'Skin, mucus with defensins, and good microbes are the first wall.',
  },
  {
    title: 'Getting past the wall',
    scene: 'l10-layers', from: 10,
    say: [
      'Harsh conditions kill pathogens too, like the low pH of the stomach and urogenital tract. Anything that gets past the surfaces meets more innate defenses. Watch the phagocytes, like macrophages, swallowing invaders whole.',
      'How do cells spot a microbe? Toll-like receptors (TLRs) recognize and bind common microbe structures called pathogen-associated molecular patterns (PAMPs). Think of them as recognizing the "uniform" that many germs wear.',
    ],
    takeaway: 'TLRs recognize PAMPs; phagocytes eat whatever gets in.',
    check: {
      q: 'What do Toll-like receptors recognize?',
      a: 'Pathogen-associated molecular patterns (PAMPs)',
      o: ['The body’s own self antigens', 'MHC class II proteins', 'Antibody constant regions'],
      why: 'TLRs bind structures common to microbes, called PAMPs.',
    },
  },
  {
    title: 'Complement: a cascade',
    scene: 'l10-complement', from: 0,
    say: [
      'The complement system is a set of blood proteins that work in a cascade, each one activating the next, like falling dominoes. The key one is C3. Watch: ① a convertase cuts C3 into two parts.',
      '② The bigger piece, C3b, sticks to the pathogen and turns on more convertase, so cutting speeds up. ③ The smaller piece, C3a, floats into the blood and triggers inflammation. Other complement proteins punch holes in the invader (lysis), and phagocytes love eating C3b-coated targets.',
    ],
    takeaway: 'C3b (big) tags for eating; C3a (small) triggers inflammation; others lyse the cell.',
    check: {
      q: 'When C3 is cut, what does C3b do?',
      a: 'Coats the pathogen and marks it for phagocytosis',
      o: ['Travels in the blood to trigger inflammation', 'Becomes an antibody', 'Shows antigen on MHC'],
      why: 'C3b is the larger part that tags; C3a is the smaller part that triggers inflammation.',
    },
  },
  {
    title: 'Cytokines, interferons and NK cells',
    say: [
      'When TLRs spot a microbe, they switch on NF-κB, the master regulator of inflammation. It turns on genes for cytokines, signaling proteins including interleukins, tumor necrosis factor and interferons. Many cytokines are pro-inflammatory: they widen vessels and call in white blood cells.',
      'Interferons are a warning to the neighbors: they bind uninfected cells and help them block viral replication. NK cells tell healthy cells from tumor or virus-infected cells and make those self-destruct (apoptosis). They are activated by interferons, antibodies and cytokines, and can kill antibody-tagged cells.',
    ],
    takeaway: 'NF-κB → cytokines; interferons protect neighboring cells; NK cells kill infected and tumor cells.',
    check: {
      q: 'What do interferons do?',
      a: 'Help neighboring cells resist viral infection',
      o: ['Cut C3 into C3a and C3b', 'Form pus after killing bacteria', 'Display antigen on MHC class I'],
      why: 'Interferons bind uninfected cells and trigger pathways that prevent viral replication.',
    },
  },
  {
    title: 'Inflammation',
    scene: 'l10-inflam', from: 0,
    say: [
      'Inflammation is the coordinated response to infection or injury: redness, swelling, heat and pain. Watch bacteria enter through a cut. Macrophages arrive first and release cytokines like TNF-α (the pink alarm signals).',
      'Watch the vessel widen (redness, heat) and get leaky so fluid seeps out (swelling). Cytokines also call in neutrophils, which squeeze out of the vessel and destroy the bacteria. Afterward the neutrophils die and form pus.',
    ],
    takeaway: 'Macrophage cytokines (TNF-α) → leaky, wide vessels + neutrophils → redness, heat, swelling, pain, pus.',
  },
  {
    title: 'Antigens, and not attacking yourself',
    scene: 'l10-clonal', from: 0,
    say: [
      'Now the adaptive side. T cell receptors and antibodies recognize specific nonself substances called antigens, usually proteins or peptides, sometimes lipids or carbohydrates. The exact spot they recognize is an epitope, and one antigen can have several.',
      'The system must not attack you. Watch the start: while B and T cells develop, any that react to your own antigens self-destruct (clonal deletion). If clonal deletion fails, the result is autoimmunity.',
    ],
    takeaway: 'Antigens have epitopes; self-reactive cells are deleted, and failure → autoimmunity.',
    check: {
      q: 'What can happen if clonal deletion fails?',
      a: 'Autoimmunity',
      o: ['No antibodies are made', 'Faster secondary responses', 'More PAMPs are recognized'],
      why: 'Self-reactive B and T cells survive and attack the body’s own antigens.',
    },
  },
  {
    title: 'Diversity and clonal selection',
    scene: 'l10-clonal', from: 3,
    say: [
      'As B and T cells develop, their DNA gets reshuffled, so each one ends up with its own unique receptor. The body makes a huge library of different lymphocytes before it ever sees the germ.',
      'Watch the antigen try the receptors one by one and bind only the one that fits. That cell is "selected" and multiplies into a clone of identical cells. Plasma cells pump out antibodies, and memory cells stay behind. Like trying keys on a key ring, then copying the one that works.',
    ],
    takeaway: 'Clonal selection: the antigen picks the matching lymphocyte, which then multiplies.',
  },
  {
    title: 'Immune memory',
    scene: 'l10-memory', from: 0,
    say: [
      'After the first encounter, memory B and T cells keep the receptor and stay in a partly activated state. Watch the graph: the primary response (first exposure) takes 1–2 weeks to build, and its peak is small.',
      'Around day 45 comes a second exposure. Watch the secondary response: memory cells were waiting, so it is almost immediate and much stronger. With each exposure (tertiary and beyond) it gets stronger and more specific.',
    ],
    takeaway: 'Primary response: slow and small. Secondary: fast and strong, thanks to memory cells.',
    check: {
      q: 'Why is the secondary immune response faster than the primary one?',
      a: 'Memory B and T cells already exist',
      o: ['Innate barriers get thicker', 'Clonal deletion stops', 'Complement is no longer needed'],
      why: 'Memory cells keep the pathogen’s receptor and respond almost immediately.',
    },
  },
  {
    title: 'Presenting the antigen to helper T cells',
    scene: 'l10-tcells', from: 0, vars: { cls: 'two' },
    say: [
      'After eating pathogens, phagocytes travel to lymph nodes and show (present) pieces of the antigen to naïve T cells. Watch the phagocyte display a piece on class II MHC, and a helper T cell recognize it and release cytokines.',
      'B cells also take up antigen, process it and present it to special helper T cells called TFH cells. TFH cells pair up with those B cells and release cytokines, and both become fully activated, ready to make antibodies.',
    ],
    takeaway: 'Antigen-presenting cells activate helper T cells; TFH cells fully activate B cells.',
  },
  {
    title: 'Antibodies: shape and jobs',
    scene: 'l10-antibody', from: 0, vars: { fn: 'neutral' },
    say: [
      'Antibodies (immunoglobulins) are Y-shaped: two heavy chains and two light chains, each with a constant region and a variable region. The constant region is similar within a class (IgA, IgD, IgE, IgG, IgM). The variable region differs for every antibody, thanks to DNA reshuffling in each B cell.',
      'Three jobs. Neutralization: block the pathogen from working (watch the virus bounce off). Use the toggle for opsonization (tag it so phagocytes eat it) and complement activation (switch on the cascade from step 6).',
    ],
    takeaway: 'Antibodies neutralize, opsonize and activate complement; the variable region binds the antigen.',
    check: {
      q: 'Coating a bacterium with antibodies so phagocytes eat it faster is called…',
      a: 'Opsonization',
      o: ['Neutralization', 'Clonal deletion', 'Lysis'],
      why: 'Opsonization tags pathogens for phagocytosis; neutralization blocks them from working.',
    },
  },
  {
    title: 'T cells read antigens on MHC',
    scene: 'l10-tcells', from: 0, vars: { cls: 'one' },
    say: [
      'T cell receptors only bind antigens displayed on an MHC protein (major histocompatibility complex), like a "display cup" on the cell surface. Watch a virus-infected cell show a viral piece on class I MHC.',
      'A cytotoxic T cell that fits docks on and orders the infected cell to self-destruct, virus and all. So: class I MHC activates cytotoxic T cells (kill infected, stressed or cancer cells); class II MHC (step 12) activates helper T cells.',
    ],
    takeaway: 'MHC class I → cytotoxic T cells; MHC class II → helper T cells.',
    check: {
      q: 'Which T cells are activated by class I MHC?',
      a: 'Cytotoxic T cells',
      o: ['Helper T cells', 'TFH cells only', 'Plasma cells'],
      why: 'Class I MHC presents to cytotoxic T cells, which kill infected or cancer cells.',
    },
  },
  {
    title: 'Vaccines',
    scene: 'l10-memory', from: 6,
    say: [
      'Vaccination gives you immune memory and protection without having to get the disease. It is a practice run, so the real infection meets a secondary response instead of a slow primary one (remember step 11).',
      'Because each exposure makes the response stronger and more specific, multiple boosters give better protection. Try the "Booster now" button and watch the next peak climb higher.',
    ],
    takeaway: 'Vaccines build memory without disease; boosters make the response stronger.',
  },
  {
    title: 'Putting it together',
    say: [
      'Defense = self vs nonself, in three phases. Innate (fast, general): skin, mucus, acid, good microbes, TLRs, complement (C3b tags, C3a inflames), cytokines, interferons, NK cells, phagocytes and inflammation.',
      'Adaptive (slow, specific, remembers): unique receptors from DNA reshuffling, self-reactive cells deleted, the antigen selects a clone. B cells make antibodies that neutralize, opsonize and activate complement. T cells read MHC: I → cytotoxic, II → helper. Memory makes later responses faster, which is how vaccines work.',
    ],
    takeaway: 'Innate holds the line fast; adaptive learns the enemy and remembers it.',
    check: {
      q: 'Which pair is correctly matched?',
      a: 'MHC class II → helper T cells',
      o: ['C3a → tags pathogens for phagocytosis', 'Interferons → form pus', 'MHC class I → B cells'],
      why: 'Class II MHC activates helper T cells; C3b tags, neutrophils form pus, class I goes with cytotoxic T cells.',
    },
  },
];
