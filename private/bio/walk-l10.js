export default [
  {
    title: 'What this lecture is about',
    say: [
      'Germs are everywhere, yet most days you don’t get sick. This lecture is about how your body defends itself, and it all comes down to one idea: telling “self” (your own molecules) apart from “nonself” (foreign ones).',
      'First come the fast, general defenses you’re born with (innate immunity). Then the slow, precise defenses that learn and remember (adaptive immunity): B cells, antibodies, T cells, memory and vaccines.',
    ],
    takeaway: 'Immune defense is built on telling self from nonself.',
  },
  {
    title: 'Three phases, two kinds of defense',
    say: [
      'Every immune response has three phases: recognition (is this self or nonself?), activation (call up cells and molecules) and effector (destroy the invader). Like a security guard who spots an intruder, calls backup, then removes them.',
      'Innate defenses are nonspecific (they treat all germs about the same). They’re the first line and act within minutes to hours: skin, toxic molecules, phagocytes (cells that eat germs) and inflammation. Adaptive defenses target one specific pathogen (disease-causing germ). They’re switched on by the innate system, take days to weeks to build, and last a long time. B cells make antibodies. T cells either kill infected cells (cytotoxic T cells) or help other defenses (helper T cells).',
    ],
    takeaway: 'Innate = fast and general; adaptive = slow, specific and long-lasting.',
    remember: 'Spot it, call it, stop it = recognition, activation, effector. Innate = Instant (you’re born with it, works in minutes); Adaptive = Acquired (learns one germ, takes days to weeks).',
    check: {
      q: 'Which describes ADAPTIVE defenses?',
      a: 'Specific to one pathogen and slower to develop',
      o: ['Nonspecific and active within minutes', 'Only physical barriers like skin', 'The same for every pathogen'],
      why: 'Adaptive defenses take days to weeks, target one specific pathogen and last a long time.',
    },
  },
  {
    title: 'Meet the white blood cells',
    say: [
      'White blood cells (leukocytes) come in teams. Specialists: basophils and eosinophils, which are involved in allergies and fighting parasites. Phagocytes: big cells that swallow germs whole (phagocytosis, “cell eating”). Two kinds of phagocytes, macrophages and dendritic cells, also carry news from the innate system to the adaptive system.',
      'Lymphocytes (a type of white blood cell): B cells and T cells work in adaptive immunity. Natural killer (NK) cells are the odd ones out: they work in BOTH innate and adaptive immunity.',
    ],
    takeaway: 'Phagocytes eat; B and T cells are adaptive; NK cells do both innate and adaptive.',
    remember: 'Phago-cyte = “eating cell.” B cells make antiBodies; T cells Terminate infected cells or help. NK cells are the double agents: they work for both innate and adaptive immunity.',
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
      'Innate defenses meet germs the moment they land. Watch the bacteria bounce off the skin: it’s a physical barrier they can rarely get through.',
      'Openings like the gut and airways are lined with mucosal tissue (moist, mucus-making lining). Its mucus traps microbes and contains germ-killing proteins like defensins. Good microbes (bacteria and fungi) living on these surfaces compete with pathogens and keep them in check, like tenants who leave no room for squatters.',
    ],
    takeaway: 'Skin, mucus with defensins, and good microbes are the first wall.',
  },
  {
    title: 'Getting past the wall',
    scene: 'l10-layers', from: 10,
    say: [
      'Harsh conditions kill germs too, like the acid (low pH) in the stomach and the urogenital tract (urinary and reproductive openings). Anything that gets past the surfaces meets more innate defenses. Watch the phagocytes, like macrophages, swallowing invaders whole.',
      'How do cells spot a microbe? Toll-like receptors (TLRs, “germ detectors” on immune cells) recognize and grab common microbe parts called pathogen-associated molecular patterns (PAMPs). Think of PAMPs as the “uniform” many germs wear, and TLRs as guards trained to spot it.',
    ],
    takeaway: 'TLRs recognize PAMPs; phagocytes eat whatever gets in.',
    remember: 'PAMPs are the germ’s uniform (a Pattern shared by many microbes); TLRs are the guards trained to spot it. Guard (TLR) sees uniform (PAMP) → alarm.',
    check: {
      q: 'What do Toll-like receptors recognize?',
      a: 'Pathogen-associated molecular patterns (PAMPs)',
      o: ['The body’s own self antigens', 'MHC class II proteins', 'Antibody constant regions'],
      why: 'TLRs bind parts that are common to microbes, called PAMPs.',
    },
  },
  {
    title: 'Complement: a cascade',
    scene: 'l10-complement', from: 0,
    say: [
      'The complement system is a team of proteins in the blood that work in a cascade: each one switches on the next, like falling dominoes. The key one is C3. Watch: ① an enzyme called a convertase cuts C3 into two pieces.',
      '② The bigger piece, C3b, sticks to the germ and turns on more convertase, so the cutting speeds up. ③ The smaller piece, C3a, floats off into the blood and triggers inflammation. Other complement proteins punch holes in the invader so it bursts (lysis), and phagocytes love eating C3b-coated targets.',
    ],
    takeaway: 'C3b (big) tags germs to be eaten; C3a (small) triggers inflammation; others burst the cell (lysis).',
    remember: 'C3b: b = big and binds (sticks to the germ so phagocytes eat it). C3a: a = away (the small piece floats off in the blood and sets off inflammation).',
    check: {
      q: 'When C3 is cut, what does C3b do?',
      a: 'Coats the pathogen and marks it for phagocytosis',
      o: ['Travels in the blood to trigger inflammation', 'Becomes an antibody', 'Shows antigen on MHC'],
      why: 'C3b is the bigger piece that tags germs; C3a is the smaller piece that triggers inflammation.',
    },
  },
  {
    title: 'Cytokines, interferons and NK cells',
    say: [
      'When TLRs spot a microbe, they switch on NF-κB, the main on-switch for inflammation. It turns on genes for cytokines (signaling proteins immune cells use to talk), including interleukins, tumor necrosis factor and interferons. Many cytokines are pro-inflammatory: they widen blood vessels and call in white blood cells.',
      'Interferons are a warning to the neighbors: they stick to uninfected cells and help them block viruses from copying themselves. NK cells can tell healthy cells apart from tumor or virus-infected cells, and make the bad ones self-destruct (apoptosis, programmed cell death). NK cells are switched on by interferons, antibodies and cytokines, and can kill cells that antibodies have tagged.',
    ],
    takeaway: 'NF-κB → cytokines; interferons protect neighboring cells; NK cells kill infected and tumor cells.',
    remember: 'INTERFERons INTERFERE with viruses copying in neighboring cells. NK = Natural Killer: it makes infected and tumor cells self-destruct (apoptosis).',
    check: {
      q: 'What do interferons do?',
      a: 'Help neighboring cells resist viral infection',
      o: ['Cut C3 into C3a and C3b', 'Form pus after killing bacteria', 'Display antigen on MHC class I'],
      why: 'Interferons bind uninfected cells and switch on defenses that stop viruses from copying.',
    },
  },
  {
    title: 'Inflammation',
    scene: 'l10-inflam', from: 0,
    say: [
      'Inflammation is the body’s team response to infection or injury: redness, swelling, heat and pain. Watch bacteria get in through a cut. Macrophages arrive first and release cytokines like TNF-α (the pink alarm signals).',
      'Watch the blood vessel widen (causing redness and heat) and get leaky so fluid seeps out (causing swelling). Cytokines also call in neutrophils (fast-acting germ-eating white blood cells), which squeeze out of the vessel and destroy the bacteria. Afterward the neutrophils die and form pus.',
    ],
    takeaway: 'Macrophage cytokines (TNF-α) → wide, leaky vessels + neutrophils → redness, heat, swelling, pain, pus.',
    remember: 'Four signs: Red, Hot, Swollen, Sore. Wide vessel → red and hot; leaky vessel → swollen. Neutrophils rush in to eat the bacteria, and dead neutrophils = pus.',
  },
  {
    title: 'Antigens, and not attacking yourself',
    scene: 'l10-clonal', from: 0,
    say: [
      'Now the adaptive side. T cell receptors and antibodies recognize specific nonself things called antigens (any molecule the immune system can recognize). Antigens are usually proteins or peptides, sometimes lipids (fats) or carbohydrates (sugars). The exact spot that gets recognized is the epitope, and one antigen can have several.',
      'The system must not attack you. Watch the start: while B and T cells are developing, any that react to your own antigens are made to self-destruct. That’s clonal deletion. If clonal deletion fails, the immune system attacks your own body. That’s autoimmunity.',
    ],
    takeaway: 'Antigens have epitopes; cells that react to “self” are deleted, and if that fails → autoimmunity.',
    check: {
      q: 'What can happen if clonal deletion fails?',
      a: 'Autoimmunity',
      o: ['No antibodies are made', 'Faster secondary responses', 'More PAMPs are recognized'],
      why: 'B and T cells that react to self survive and attack the body’s own antigens.',
    },
  },
  {
    title: 'Diversity and clonal selection',
    scene: 'l10-clonal', from: 3,
    say: [
      'As B and T cells develop, pieces of their DNA get reshuffled, so each one ends up with its own one-of-a-kind receptor. The body builds a huge library of different lymphocytes before it ever meets the germ.',
      'Watch the antigen try the receptors one by one and stick only to the one that fits. That cell is “selected” and multiplies into a clone (a crowd of identical copies). That’s clonal selection. Some copies become plasma cells, which pump out antibodies, and others become memory cells that stick around. Like trying keys on a key ring, then copying the one that works.',
    ],
    takeaway: 'Clonal selection: the antigen picks the matching lymphocyte, which then multiplies.',
    remember: 'Don’t mix them up: clonal DELETION deletes self-reacting cells while they develop; clonal SELECTION selects the cell whose receptor fits the antigen and copies it. Plasma cells pump out antibodies; memory cells remember.',
  },
  {
    title: 'Immune memory',
    scene: 'l10-memory', from: 0,
    say: [
      'After the first meeting, memory B and T cells keep the matching receptor and stay partly switched on, ready to go. Watch the graph: the primary response (first exposure) takes 1–2 weeks to build, and its peak is small.',
      'Around day 45 comes a second exposure. Watch the secondary response: the memory cells were waiting, so it’s almost instant and much stronger. With each new exposure (third and beyond) it gets stronger and more precise.',
    ],
    takeaway: 'Primary response: slow and small. Secondary: fast and strong, thanks to memory cells.',
    check: {
      q: 'Why is the secondary immune response faster than the primary one?',
      a: 'Memory B and T cells already exist',
      o: ['Innate barriers get thicker', 'Clonal deletion stops', 'Complement is no longer needed'],
      why: 'Memory cells keep the matching receptor and respond almost right away.',
    },
  },
  {
    title: 'Presenting the antigen to helper T cells',
    scene: 'l10-tcells', from: 0, vars: { cls: 'two' },
    say: [
      'After eating germs, phagocytes travel to lymph nodes (small immune “meeting spots” along lymph vessels) and show pieces of the antigen to naïve T cells (T cells that haven’t met their antigen yet). That’s called presenting the antigen. Watch the phagocyte hold up a piece on a class II MHC protein, and a helper T cell recognize it and release cytokines.',
      'B cells also grab antigen, chop it up and present it to special helper T cells called TFH cells. The TFH cells pair up with those B cells and release cytokines, and both become fully switched on, ready to make antibodies.',
    ],
    takeaway: 'Antigen-presenting cells switch on helper T cells; TFH cells fully switch on B cells.',
  },
  {
    title: 'Antibodies: shape and jobs',
    scene: 'l10-antibody', from: 0, vars: { fn: 'neutral' },
    say: [
      'Antibodies (also called immunoglobulins) are Y-shaped proteins made of two heavy chains and two light chains. Each chain has a constant region (the same within a class: IgA, IgD, IgE, IgG, IgM) and a variable region (the tips of the Y, different for every antibody thanks to DNA reshuffling in each B cell). The variable region is what grabs the antigen.',
      'Antibodies have three jobs. Neutralization: block the germ so it can’t work (watch the virus bounce off). Use the toggle for opsonization (coat the germ so phagocytes eat it) and complement activation (switch on the domino cascade from step 6).',
    ],
    takeaway: 'Antibodies neutralize, opsonize and activate complement; the variable region grabs the antigen.',
    remember: 'Jobs = N.O.C.: Neutralize (block it), Opsonize (Greek “opson” = seasoning: makes germs tasty to phagocytes), Complement (start the dominoes). The five classes spell GAMED: IgG, IgA, IgM, IgE, IgD.',
    check: {
      q: 'Coating a bacterium with antibodies so phagocytes eat it faster is called…',
      a: 'Opsonization',
      o: ['Neutralization', 'Clonal deletion', 'Lysis'],
      why: 'Opsonization tags germs to be eaten; neutralization blocks them from working.',
    },
  },
  {
    title: 'T cells read antigens on MHC',
    scene: 'l10-tcells', from: 0, vars: { cls: 'one' },
    say: [
      'T cell receptors only grab antigens that are held up on an MHC protein (major histocompatibility complex), like a “display stand” on the cell surface. Watch a virus-infected cell show a piece of the virus on a class I MHC protein.',
      'A cytotoxic (“cell-killing”) T cell that fits docks on and orders the infected cell to self-destruct, virus and all. So: class I MHC switches on cytotoxic T cells (which kill infected, stressed or cancer cells); class II MHC (step 12) switches on helper T cells.',
    ],
    takeaway: 'MHC class I → cytotoxic T cells; MHC class II → helper T cells.',
    remember: '“One kills, two helps”: MHC class I → cytotoxic (killer) T cells; MHC class II → helper T cells (like the phagocyte in the lymph node, step 12).',
    check: {
      q: 'Which T cells are activated by class I MHC?',
      a: 'Cytotoxic T cells',
      o: ['Helper T cells', 'TFH cells only', 'Plasma cells'],
      why: 'Class I MHC shows antigen to cytotoxic T cells, which kill infected or cancer cells.',
    },
  },
  {
    title: 'Vaccines',
    scene: 'l10-memory', from: 6,
    say: [
      'Vaccination gives you immune memory and protection without having to catch the disease. It’s a practice run, so the real infection meets a fast secondary response instead of a slow primary one (remember step 11).',
      'Each exposure makes the response stronger and more precise, so several booster shots give better protection. Try the “Booster now” button and watch the next peak climb higher.',
    ],
    takeaway: 'Vaccines build memory without the disease; boosters make the response stronger.',
  },
  {
    title: 'Putting it together',
    say: [
      'Defense = self vs nonself, in three phases. Innate (fast, general): skin, mucus, acid, good microbes, TLRs, complement (C3b tags, C3a inflames), cytokines, interferons, NK cells, phagocytes and inflammation.',
      'Adaptive (slow, specific, remembers): every lymphocyte gets a unique receptor from DNA reshuffling, cells that attack self are deleted, and the antigen selects the matching cell to clone. B cells make antibodies that neutralize, opsonize and switch on complement. T cells read MHC: class I → cytotoxic, class II → helper. Memory makes later responses faster, which is how vaccines work.',
    ],
    takeaway: 'Innate holds the line fast; adaptive learns the enemy and remembers it.',
    check: {
      q: 'Which pair is correctly matched?',
      a: 'MHC class II → helper T cells',
      o: ['C3a → tags pathogens for phagocytosis', 'Interferons → form pus', 'MHC class I → B cells'],
      why: 'Class II MHC switches on helper T cells; C3b tags, neutrophils form pus, and class I goes with cytotoxic T cells.',
    },
  },
];
