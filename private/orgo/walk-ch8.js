// Guided lecture · Ch 8 · Addition reactions of alkenes (follows Dr. Lopez's slides, sections 8.1–8.15)
export default {
  ch: 8, title: 'Addition reactions of alkenes',
  steps: [
    {
      sec: '8.1', title: 'Addition: elimination in reverse',
      say: [
        'Chapter 7 made alkenes by elimination. Chapter 8 runs it the other way: addition. Two groups add across the C=C, one on each carbon, and the π bond (the weaker second bond of a double bond) is turned into two new σ bonds (single bonds).',
        'Key idea: the π bond is an electron-pair donor. Its electrons sit above and below the plane of the molecule, exposed and easy to reach, so the alkene acts as a nucleophile (Lewis base) and attacks electrophiles (electron-poor species) like H⁺, Br₂, BH₃ or a mercury cation.',
      ],
      takeaway: 'Addition = one π bond → two σ bonds. The alkene is the nucleophile.',
      check: {
        q: 'In alkene addition reactions, the C=C π bond acts as…',
        a: 'A nucleophile (electron-pair donor)',
        o: ['An electrophile (electron-pair acceptor)', 'A leaving group', 'A spectator that doesn’t react'],
        why: 'The π electrons are loosely held and exposed, so they attack electron-poor reagents like H⁺ or Br₂.',
      },
    },
    {
      sec: '8.1–8.2', title: 'Five kinds of addition, and where alkenes come from',
      say: [
        'Additions are named by what adds: hydrohalogenation (H and X, from HCl, HBr or HI), hydration (H and OH), hydrogenation (H and H), halogenation (X and X, like Br₂) and dihydroxylation (OH and OH). Those five families cover the chapter.',
        'Alkenes are everywhere (8.2): in ring-shaped natural products, in insect pheromones (chemical signals), and in industry. Every year over 200 billion pounds of ethylene and 70 billion pounds of propylene are made by cracking petroleum (breaking big hydrocarbons into small ones). They are precursors (starting materials) for plastics and much more.',
      ],
      takeaway: 'Five additions: H/X, H/OH, H/H, X/X, OH/OH.',
      check: {
        q: 'Which addition puts an OH on both carbons of the C=C?',
        a: 'Dihydroxylation',
        o: ['Hydration', 'Hydrogenation', 'Hydrohalogenation'],
        why: 'Dihydroxylation adds two OH groups. Hydration adds only one OH (plus an H).',
      },
    },
    {
      sec: '8.3', title: 'Naming alkenes',
      say: [
        'Same steps as alkanes with small tweaks. 1) The parent chain must include the C=C, and its name ends in -ene instead of -ane. 2) Name the substituents. 3) Number so the C=C gets the lowest number possible (it beats the substituents). 4) List substituents alphabetically, ignoring prefixes like di-, tri-, sec- and tert- (but not iso).',
        'The double bond gets one number: the carbon where it starts. CH₃CH=CHCH₂CH₃ is pent-2-ene (also written 2-pentene): the number goes either before the parent name or just before -ene.',
        'If the alkene is E or Z (the two possible arrangements around a C=C, decided by priorities), put that in parentheses at the front. Slide example: (E)-5,5,6-trimethylhept-2-ene.',
      ],
      takeaway: 'The chain must contain the C=C, which gets the lowest number. Add (E) or (Z) up front when needed.',
      check: {
        q: 'Name CH₂=CHCH(CH₃)CH₂CH₃.',
        a: '3-Methylpent-1-ene',
        o: ['3-Methylpent-4-ene', '2-Ethylbut-3-ene', '3-Methylpentane'],
        why: 'The 5-carbon chain contains the C=C. Number from the end nearest it, so the double bond starts at C1 and the methyl is on C3.',
      },
    },
    {
      sec: '8.4', title: 'Addition vs elimination: temperature decides',
      say: [
        'Addition and elimination are the same reaction run in opposite directions (an equilibrium). Which side wins depends on ΔG = ΔH − TΔS (free energy = enthalpy − temperature × entropy; a negative ΔG means that direction is favored).',
        'Enthalpy (ΔH, the heat from making and breaking bonds) favors addition: σ bonds are stronger than π bonds. In the slide’s example, ΔH = bonds broken − bonds formed = 166 − 185 = −19 kcal/mol. Entropy (ΔS, disorder) favors elimination: addition squeezes two molecules into one, so ΔS is negative.',
        'Temperature sets the balance. At low temperature the −TΔS term is small, enthalpy dominates, and addition wins. At high temperature entropy dominates and elimination wins. That is why additions are run at lower temperatures and eliminations with heat.',
      ],
      takeaway: 'Low T → addition (enthalpy wins). High T → elimination (entropy wins).',
      check: {
        q: 'Why does high temperature favor elimination over addition?',
        a: 'The −TΔS term grows, and elimination increases entropy',
        o: ['Elimination is more exothermic', 'σ bonds become weaker than π bonds when hot', 'Heat makes the π bond a better nucleophile'],
        why: 'Elimination makes two molecules from one (ΔS > 0). Multiplying by a bigger T makes that entropy term outweigh addition’s favorable ΔH.',
      },
    },
    {
      sec: '8.5', title: 'HX addition: Markovnikov’s rule',
      rx: 'hx',
      say: [
        'Hydrohalogenation adds H–X (HCl, HBr or HI) across the C=C. If the alkene is unsymmetrical, two regioisomers (same formula, X on different carbons) are possible, depending on which carbon gets the H and which gets the X.',
        'In 1869 Markovnikov noticed that H adds to the carbon that already has more H’s, so the halogen ends up on the more substituted carbon. A reaction that favors one regioisomer is regioselective; this one shows Markovnikov regioselectivity. Example: propene + HBr → 2-bromopropane, not 1-bromopropane.',
      ],
      takeaway: 'HX: H on the carbon with more H’s, X on the more substituted carbon (Markovnikov).',
      check: {
        q: '2-Methylpropene + HBr (no peroxides) gives mainly…',
        a: '2-Bromo-2-methylpropane',
        o: ['1-Bromo-2-methylpropane', '2-Methylpropan-2-ol', '1,2-Dibromo-2-methylpropane'],
        why: 'H goes to the CH₂ end, which leaves a 3° carbocation, and Br⁻ adds to that 3° carbon.',
      },
    },
    {
      sec: '8.5', title: 'Why Markovnikov? The carbocation',
      mech: 'hbr',
      say: [
        'The mechanism has two steps. 1) The π bond grabs H⁺ from H–X, making a carbocation (a carbon with three bonds and a + charge). 2) X⁻ attacks the carbocation. Step 1 has the higher Ea (activation energy), so it is the rate-determining step.',
        'Markovnikov comes from carbocation stability (3° > 2° > 1° > methyl). Putting H on the less substituted carbon leaves the + on the more substituted carbon, the more stable cation. Its transition state is lower in energy too, so that path is faster and wins. In the 3D viewer, H goes to C2 of 1-methylcyclopentene so the + lands on the 3° C1.',
      ],
      takeaway: 'Markovnikov happens because the more stable carbocation forms faster.',
      check: {
        q: 'In HBr addition, which step is rate-determining?',
        a: 'Protonating the π bond to form the carbocation',
        o: ['Br⁻ attacking the carbocation', 'Loss of Br⁻ from the product', 'Forming a bromonium ion'],
        why: 'Making the carbocation is the highest hill on the energy diagram. Bromide catching it afterward is fast.',
      },
    },
    {
      sec: '8.5', title: 'HX stereochemistry: racemic',
      say: [
        'If the carbon that gets X becomes a new chiral center, you actually get two Markovnikov products: a pair of enantiomers (non-superimposable mirror images) in equal amounts, which is a racemic mixture.',
        'Reason: the carbocation is flat, with its empty p orbital pointing up and down. X⁻ attacks either face with equal chance. General rule from the notes: achiral starting materials with achiral reagents can’t give an optically active product.',
      ],
      takeaway: 'A new stereocenter made from a carbocation → racemic mixture.',
      check: {
        q: 'But-1-ene + HBr gives 2-bromobutane as…',
        a: 'A racemic mixture of (R) and (S)',
        o: ['Only (R)', 'Only (S)', 'A meso compound'],
        why: 'Br⁻ adds to the flat 2° carbocation from either face equally, giving both enantiomers 50:50.',
      },
    },
    {
      sec: '8.5', title: 'HX with rearrangements',
      mech: 'mshift',
      say: [
        'Carbocations rearrange by a hydride or methyl shift if they can become more stable, just like in SN1/E1. Dr. Lopez’s rule: when rearrangements can occur, they DO occur.',
        'Hydride example: 3-methylbut-1-ene + HBr. Protonation gives a 2° cation right next to a 3° C–H. That H shifts over to make a 3° cation, so the major product is 2-bromo-2-methylbutane.',
        'Methyl example (the 3D viewer): 3,3-dimethylbut-1-ene + HBr. The 2° cation sits next to a carbon with three methyls; one methyl shifts over to make a 3° cation, and the major product is 2-bromo-2,3-dimethylbutane, a new carbon skeleton.',
      ],
      takeaway: 'Whenever a 2° carbocation sits next to a 3° or quaternary carbon, expect a shift.',
      check: {
        q: '3-Methylbut-1-ene + HBr gives mainly…',
        a: '2-Bromo-2-methylbutane',
        o: ['2-Bromo-3-methylbutane', '1-Bromo-3-methylbutane', '3-Methylbutan-2-ol'],
        why: 'The first cation is 2°. A 1,2-hydride shift makes the 3° cation, and Br⁻ adds there.',
      },
    },
    {
      sec: '8.5', title: 'HBr with peroxides: anti-Markovnikov',
      rx: 'hbr-roor',
      say: [
        'Add peroxides (ROOR, molecules with an O–O bond) to HBr and the regiochemistry flips: Br goes on the less substituted carbon (anti-Markovnikov). The mechanism has to be different, and it is: a radical chain (species with unpaired electrons) instead of a carbocation.',
        'Short version: the peroxide helps make a Br• radical. Br• adds to the less substituted carbon so that the more stable (more substituted) carbon radical forms, and that radical then takes an H from H–Br. The lesson from the slides: HBr’s regiochemistry can be controlled. HBr alone → Markovnikov; HBr + ROOR → anti-Markovnikov. This works for HBr only, not HCl or HI.',
      ],
      takeaway: 'HBr, ROOR → anti-Markovnikov (Br on the less substituted carbon), by radicals.',
      check: {
        q: 'Propene + HBr with ROOR gives mainly…',
        a: '1-Bromopropane',
        o: ['2-Bromopropane', 'Propan-1-ol', '1,2-Dibromopropane'],
        why: 'With peroxides, Br adds first to the end carbon so the more stable 2° radical forms; then H is added. Br ends up on C1.',
      },
    },
    {
      sec: '8.6', title: 'Acid-catalyzed hydration',
      mech: 'hydration', rx: 'hydration',
      say: [
        'Acid-catalyzed hydration adds water’s H and OH across the π bond, using H₂O with a little H₂SO₄ (sulfuric acid, the catalyst; the real acid in water is H₃O⁺). It follows Markovnikov: OH goes on the more substituted carbon. More substituted alkenes react faster, which fits a carbocation mechanism.',
        'Mechanism: 1) the π bond takes H⁺ from H₃O⁺, making a carbocation (same start as HX). 2) Water attacks the carbocation, giving an oxonium ion (an oxygen with three bonds and a + charge). 3) Another water removes H⁺, giving the alcohol and regenerating H₃O⁺. That is why the acid is called a catalyst.',
      ],
      takeaway: 'H₃O⁺: Markovnikov alcohol via a carbocation (protonate, water attacks, deprotonate).',
      check: {
        q: '2-Methylpropene + H₂O, H₂SO₄ gives…',
        a: '2-Methylpropan-2-ol',
        o: ['2-Methylpropan-1-ol', '2-Methylpropane', '2-Methylpropane-1,2-diol'],
        why: 'Protonation makes the 3° carbocation, water attacks it, and the OH ends up on the more substituted carbon.',
      },
    },
    {
      sec: '8.6', title: 'Hydration is an equilibrium',
      say: [
        'Hydration is reversible: alkene + water ⇌ alcohol. Use Le Châtelier’s principle (a system at equilibrium shifts to undo whatever you change). To make the alcohol, use excess water. To make the alkene from an alcohol, use concentrated acid and no added water (plus heat), which runs it backwards as an E1 dehydration.',
        'Because a carbocation forms, two Chapter 7 rules apply. Stereochemistry works like HX addition: a new stereocenter comes out racemic. And rearrangements are possible, which often gives a mix of products. That weakness is why the next reaction exists.',
      ],
      takeaway: 'Excess water → alcohol; concentrated acid + heat → alkene. Expect racemic products and possible shifts.',
      check: {
        q: 'You want to turn cyclohexanol into cyclohexene. Best conditions?',
        a: 'Concentrated H₂SO₄, heat, no added water',
        o: ['Dilute H₂SO₄ in lots of water', 'NaBH₄', '1) BH₃·THF 2) H₂O₂, NaOH'],
        why: 'Removing water and adding heat pushes the equilibrium toward the alkene (Le Châtelier, and entropy favors elimination at high T).',
      },
    },
    {
      sec: '8.7', title: 'Oxymercuration: Markovnikov, no rearrangements',
      mech: 'oxymerc', rx: 'oxymerc',
      say: [
        'Oxymercuration–demercuration also adds H and OH with Markovnikov regiochemistry, but without rearrangements. Reagents: 1) Hg(OAc)₂ (mercuric acetate) in H₂O/THF, 2) NaBH₄ (sodium borohydride, a reducing agent).',
        'Here the mercury cation (⁺HgOAc) is the Lewis acid (electron-pair acceptor) instead of H⁺. The π bond attacks it and forms a mercurinium ion: Hg bridges both carbons in a three-membered ring. That bridged cation is stabilized, so it doesn’t rearrange like a free carbocation.',
        'Water attacks the more substituted carbon (it carries more δ+), then loses H⁺. Finally NaBH₄ swaps the –HgOAc for an H (by a radical step). Same product as acid hydration, but no shifts. Per the notes, the overall sequence is not stereospecific.',
      ],
      takeaway: '1) Hg(OAc)₂, H₂O 2) NaBH₄: Markovnikov OH, no rearrangements.',
      check: {
        q: '3,3-Dimethylbut-1-ene + 1) Hg(OAc)₂, H₂O 2) NaBH₄ gives…',
        a: '3,3-Dimethylbutan-2-ol',
        o: ['2,3-Dimethylbutan-2-ol', '3,3-Dimethylbutan-1-ol', '2,3-Dimethylbut-2-ene'],
        why: 'Markovnikov OH on C2 with no methyl shift. Acid hydration would rearrange and give 2,3-dimethylbutan-2-ol; hydroboration would give the 1-ol.',
      },
    },
    {
      sec: '8.8', title: 'Hydroboration–oxidation: anti-Markovnikov',
      mech: 'bh3', rx: 'hydroboration',
      say: [
        'Hydroboration–oxidation adds H and OH with anti-Markovnikov regiochemistry: OH on the less substituted carbon. It is a two-reaction sequence: 1) BH₃·THF, 2) H₂O₂, NaOH (hydrogen peroxide and base). It is also syn: H and OH add to the same face. Anti addition is not observed.',
        'Borane (BH₃) is shaped like a carbocation: boron is sp², flat, with an empty p orbital and no octet. On its own it pairs up as B₂H₆ (diborane), but THF (an ether solvent) forms a BH₃·THF complex, the active reagent.',
        'In one concerted step, the π bond attacks boron while an H moves from B to the other carbon. B goes on the less substituted carbon for two reasons: less crowding (sterics), and in the transition state the more substituted carbon carries the δ+, which it handles better. No carbocation, so no rearrangements. One BH₃ can react with three alkenes. Then H₂O₂/NaOH replaces B with OH in the exact same spot.',
      ],
      takeaway: '1) BH₃·THF 2) H₂O₂, NaOH: anti-Markovnikov, syn, no rearrangements.',
      check: {
        q: 'Propene + 1) BH₃·THF 2) H₂O₂, NaOH gives…',
        a: 'Propan-1-ol',
        o: ['Propan-2-ol', 'Propane', 'Propane-1,2-diol'],
        why: 'Boron, and then OH, goes on the less substituted end carbon (anti-Markovnikov).',
      },
    },
    {
      sec: '8.8', title: 'Hydroboration stereochemistry: syn',
      rx: 'hydroboration',
      say: [
        'Hydroboration is stereospecific: only syn addition. If one new chiral center forms, boron can add to either face of the flat alkene, so you get a pair of enantiomers.',
        'If two chiral centers form, syn addition still locks their relationship: you get just one pair of enantiomers, not all four stereoisomers. Example from the notes: 1-methylcyclopentene gives trans-2-methylcyclopentan-1-ol (plus its enantiomer). H and OH went on the same face, so the OH ends up trans to the methyl.',
      ],
      takeaway: 'Syn addition: two new stereocenters → one pair of enantiomers.',
      check: {
        q: '1-Methylcyclopentene + 1) BH₃·THF 2) H₂O₂, NaOH gives…',
        a: 'trans-2-Methylcyclopentan-1-ol (racemic)',
        o: ['cis-2-Methylcyclopentan-1-ol (racemic)', '1-Methylcyclopentan-1-ol', 'Methylcyclopentane'],
        why: 'OH goes on the less substituted ring carbon. The new H (on the methyl carbon) and the OH are syn, which puts the OH trans to the methyl.',
      },
    },
    {
      sec: '8.9', title: 'Catalytic hydrogenation: syn',
      mech: 'h2', rx: 'hydrogenation',
      say: [
        'Catalytic hydrogenation adds H₂ across the C=C, reducing (adding H to) an alkene to an alkane. It needs a metal catalyst (Pt, Pd or Ni). Without one, the activation energy is far too high and nothing happens.',
        'The metal surface holds both the H atoms and the alkene. The alkene lies flat on the metal, so both H’s add to the same face: syn addition, stereospecific. The 3D viewer shows it on a ring.',
        'Watch for meso compounds (molecules with stereocenters but an internal mirror plane, so they are not chiral). Syn addition to a symmetrical alkene like 1,2-dimethylcyclohexene gives cis-1,2-dimethylcyclohexane, one meso compound, not a pair of enantiomers. Catalysts can be heterogeneous (a solid that doesn’t dissolve, like Pt or Pd metal) or homogeneous (dissolves, thanks to ligands on the metal).',
      ],
      takeaway: 'H₂ with Pt, Pd or Ni: syn addition, alkene → alkane.',
      check: {
        q: '1,2-Dimethylcyclohexene + H₂, Pd gives…',
        a: 'cis-1,2-Dimethylcyclohexane (meso)',
        o: ['trans-1,2-Dimethylcyclohexane (racemic)', 'A 50:50 mix of cis and trans', '1,2-Dimethylcyclohexan-1-ol'],
        why: 'Both H’s come from the metal side, so both methyls end up on the other face together (cis). That molecule has a mirror plane: meso.',
      },
    },
    {
      sec: '8.10', title: 'Halogenation: bromonium ion, anti',
      mech: 'br2', rx: 'halogenation',
      say: [
        'Halogenation adds two halogen atoms across the C=C (a key step in making PVC plastic). It is only practical with Cl₂ and Br₂: I₂ works poorly and F₂ is too violent. The solvent is usually CH₂Cl₂.',
        'Br₂ is nonpolar but polarizable: as the π bond approaches, the near Br becomes δ+ (think of it as a Br attached to a good leaving group, Br⁻). The alkene attacks, and instead of a carbocation it forms a bromonium ion, a three-membered ring with + on Br bridging both carbons (like the mercurinium ion).',
        'Br⁻ then attacks from the back, opposite the bridge, in an SN2-like step. So the two Br’s end up on opposite faces: anti addition only, and no rearrangements. Cyclohexene gives trans-1,2-dibromocyclohexane (racemic). From the notes: trans-but-2-ene gives the meso dibromide, and cis-but-2-ene gives a racemic pair.',
      ],
      takeaway: 'Br₂: bromonium ion, then backside attack → anti addition.',
      check: {
        q: 'Cyclopentene + Br₂ in CH₂Cl₂ gives…',
        a: 'trans-1,2-Dibromocyclopentane (racemic)',
        o: ['cis-1,2-Dibromocyclopentane', '1,1-Dibromocyclopentane', 'Bromocyclopentane'],
        why: 'Br⁻ opens the bromonium from the face opposite the first Br, so the two Br’s are anti (trans).',
      },
    },
    {
      sec: '8.10', title: 'Halohydrins: Br₂ in water',
      mech: 'halohydrin', rx: 'halohydrin',
      say: [
        'Run halogenation in water and you get a halohydrin (a halogen and an OH on neighboring carbons). The bromonium ion still forms, but water is the solvent, so there are far more H₂O molecules than Br⁻ ions, and water does the backside attack. A final deprotonation gives the neutral bromohydrin (with Cl₂, a chlorohydrin).',
        'Regiochemistry: OH goes to the more substituted carbon, Br to the less substituted one. Why: in the bromonium ion, the more substituted carbon carries more of the + charge (more cationic character), so water attacks it faster. Stereochemistry is still anti.',
      ],
      takeaway: 'Br₂, H₂O: OH on the more substituted carbon, Br on the less, added anti.',
      check: {
        q: '2-Methylpropene + Br₂, H₂O gives mainly…',
        a: '1-Bromo-2-methylpropan-2-ol',
        o: ['2-Bromo-2-methylpropan-1-ol', '1,2-Dibromo-2-methylpropane', '2-Methylpropane-1,2-diol'],
        why: 'Water opens the bromonium at the 3° carbon (more δ+), so OH sits there and Br stays on the CH₂.',
      },
    },
    {
      sec: '8.11', title: 'Syn dihydroxylation: OsO₄',
      rx: 'syn-diol',
      say: [
        'Syn dihydroxylation adds two OH groups to the same face in one concerted step, giving a 1,2-diol (also called a glycol). The classic reagent is OsO₄ (osmium tetroxide).',
        'OsO₄ adds across the π bond to make a cyclic osmate ester (a ring holding both new oxygens on one face); water then breaks it apart to release the syn diol. OsO₄ is expensive and toxic, so only a catalytic amount is used, plus a co-oxidant (NMO, or a peroxide such as H₂O₂ in the notes) that regenerates it.',
        'Cold, dilute KMnO₄ (potassium permanganate) with NaOH does the same job, but it is less useful because it reacts with many other groups too. Example: cyclopentene + OsO₄ gives cis-cyclopentane-1,2-diol, a meso compound.',
      ],
      takeaway: 'OsO₄ (cat.) + NMO, or cold KMnO₄: two OH’s added syn (cis diol).',
      check: {
        q: 'Which reagents give cis-cyclohexane-1,2-diol from cyclohexene?',
        a: 'OsO₄ (catalytic), NMO',
        o: ['1) RCO₃H 2) H₃O⁺', 'Br₂, H₂O', '1) O₃ 2) DMS'],
        why: 'OsO₄ delivers both oxygens from the same face at once. The epoxide route opens from the back and gives the trans diol.',
      },
    },
    {
      sec: '8.12', title: 'Epoxides and anti dihydroxylation',
      rx: 'anti-diol',
      say: [
        'Anti dihydroxylation takes two steps. Step 1: a peroxyacid (RCO₃H, like mCPBA) turns the alkene into an epoxide (a three-membered ring containing one O). This step is concerted, so the O adds to one face.',
        'Step 2: H₃O⁺ (water with an acid catalyst) opens the epoxide. The acid protonates the epoxide O, then water attacks a carbon from the back, opposite the O, SN2-style. One OH comes from the old epoxide oxygen and the other from water, on opposite faces: an anti (trans) diol.',
        'Notice the pattern: the bromonium, mercurinium and protonated epoxide are all strained three-membered rings with a + charge. That makes them good electrophiles, and all three are opened from the back, so all three give anti products.',
      ],
      takeaway: '1) RCO₃H 2) H₃O⁺: epoxide, then backside opening → anti (trans) diol.',
      check: {
        q: 'Cyclohexene + 1) mCPBA 2) H₃O⁺ gives…',
        a: 'trans-Cyclohexane-1,2-diol (racemic)',
        o: ['cis-Cyclohexane-1,2-diol (meso)', 'Cyclohexanol', 'Hexanedial'],
        why: 'Water opens the protonated epoxide from the opposite face, so the two OH’s end up trans.',
      },
    },
    {
      sec: '8.13', title: 'Ozonolysis: cutting the C=C',
      rx: 'ozonolysis',
      say: [
        'Ozonolysis is an oxidative cleavage: it cuts the C=C completely, σ and π bonds both. Reagents: 1) O₃ (ozone, a resonance hybrid of two structures), 2) a reducing agent, DMS (dimethyl sulfide, (CH₃)₂S) or Zn/H₂O.',
        'Easy way to draw it: erase the double bond and put a C=O on each carbon that was in it. A carbon that had an H becomes an aldehyde (C=O with an H on it); a carbon with two carbon groups becomes a ketone (C=O between two carbons). A ring alkene opens into one chain with two C=O’s.',
        'Example: 2-methylbut-2-ene, (CH₃)₂C=CHCH₃, gives acetone (a ketone) plus acetaldehyde (an aldehyde). Stereocenters not on the C=C stay untouched; the notes show an optically pure ring staying optically pure.',
      ],
      takeaway: '1) O₃ 2) DMS: cut the C=C, put a C=O on each side. C with an H → aldehyde; C with two R’s → ketone.',
      check: {
        q: 'Ozonolysis (1) O₃ 2) DMS) of 2,3-dimethylbut-2-ene gives…',
        a: 'Two molecules of acetone',
        o: ['Two molecules of acetaldehyde', 'One acetone and one acetaldehyde', '2,3-Dimethylbutane-2,3-diol'],
        why: 'Each alkene carbon carries two CH₃ groups and no H, so each half becomes (CH₃)₂C=O, acetone.',
      },
    },
    {
      sec: '8.14', title: 'Predicting addition products',
      say: [
        'For any alkene addition, ask the slide’s three questions. 1) What groups add? Read the reagent: H/X, H/OH, H/H, X/X, X/OH, OH/OH, or cleavage. 2) Regiochemistry: Markovnikov or anti-Markovnikov? (Only matters if the two groups differ and the two alkene carbons differ.) 3) Stereochemistry: syn or anti? (Only matters if new chiral centers form.)',
        'Keep one more check in your pocket: does the mechanism go through a free carbocation? If yes (HX, acid hydration), look for a rearrangement. Bridged ions and concerted steps (oxymercuration, Br₂, hydroboration, hydrogenation, OsO₄) never shift.',
        'Cheat list. Markovnikov: HX, H₃O⁺, Hg(OAc)₂/NaBH₄, and X₂/H₂O (for the OH). Anti-Markovnikov: HBr/ROOR, BH₃ then H₂O₂/NaOH. Syn: hydroboration, H₂/metal, OsO₄ or cold KMnO₄. Anti: X₂, X₂/H₂O, RCO₃H then H₃O⁺.',
      ],
      takeaway: 'Groups added → regiochemistry → stereochemistry. Then check for carbocation rearrangements.',
      check: {
        q: 'Which reaction is BOTH anti-Markovnikov AND syn?',
        a: 'Hydroboration–oxidation',
        o: ['HBr with ROOR', 'Halohydrin formation', 'Oxymercuration–demercuration'],
        why: 'HBr/ROOR is anti-Markovnikov but goes through radicals, so it isn’t syn. Halohydrin formation (anti) and oxymercuration put the OH on the more substituted carbon.',
      },
    },
    {
      sec: '8.15', title: 'One-step synthesis: pick the reagent',
      rx: 'oxymerc',
      say: [
        'Planning a synthesis starts by comparing the starting material and product: what was added, where, and with what stereochemistry? Then choose the reaction that does exactly that.',
        'Slide example: an alkene becomes an alcohol with OH on the more substituted carbon. That is adding H and OH with Markovnikov regiochemistry, so use H₃O⁺ (acid hydration), or 1) Hg(OAc)₂, H₂O 2) NaBH₄ if a rearrangement could happen. If the OH needed to be on the less substituted carbon, you would use hydroboration–oxidation instead.',
      ],
      takeaway: 'Match the change (which groups, which carbon, which face) to the one reaction that gives it.',
      check: {
        q: 'You need 3-methylbutan-2-ol from 3-methylbut-1-ene. Best reagents?',
        a: '1) Hg(OAc)₂, H₂O 2) NaBH₄',
        o: ['H₂O, H₂SO₄', '1) BH₃·THF 2) H₂O₂, NaOH', 'HBr, ROOR'],
        why: 'You need Markovnikov OH with no shift. Acid hydration would hydride-shift and give 2-methylbutan-2-ol; hydroboration would give 3-methylbutan-1-ol.',
      },
    },
    {
      sec: '8.15', title: 'Moving a leaving group',
      decide: { cls: '3', reagent: 'NaOEt', solvent: 'protic', heat: true },
      say: [
        'Some changes can’t be done in one reaction, like moving a halogen to the next carbon over. The trick: eliminate, then add. Example: 2-bromo-2-methylbutane → 2-bromo-3-methylbutane. Step 1: E2 with a non-bulky base (NaOEt) gives the Zaitsev alkene, 2-methylbut-2-ene, which is the alkene we need. Step 2: HBr with ROOR adds the Br anti-Markovnikov, on the less substituted carbon of that C=C.',
        'Moving an OH works the same way, with one extra step. Example: butan-2-ol → butan-1-ol. OH is a bad leaving group, so first make it a tosylate (TsCl, pyridine). Then E2 with a bulky base (t-BuOK) gives the Hofmann alkene, but-1-ene. Finally hydroboration–oxidation adds OH anti-Markovnikov, on C1.',
        'General recipe: pick the base by which alkene you need (small → Zaitsev, bulky → Hofmann), then pick the addition by where the new group has to go. The decider below runs step 1 of the halogen example.',
      ],
      takeaway: 'Moving a group = eliminate (choose the base) + add (choose the regiochemistry).',
      check: {
        q: 'To turn butan-2-ol into butan-1-ol, the correct sequence is…',
        a: '1) TsCl, pyridine 2) t-BuOK 3) BH₃·THF, then H₂O₂, NaOH',
        o: ['1) TsCl, pyridine 2) NaOEt 3) H₃O⁺', '1) H₂SO₄, heat 2) H₃O⁺', '1) TsCl, pyridine 2) t-BuOK 3) Hg(OAc)₂, H₂O, then NaBH₄'],
        why: 'You need the terminal alkene (Hofmann, bulky base) and then OH on the end carbon (anti-Markovnikov, hydroboration). The other routes put OH back on C2.',
      },
    },
    {
      sec: '8.15', title: 'Moving a π bond, and the ten reactions',
      rx: 'hbr-roor',
      decide: { cls: '2', reagent: 'tBuOK', solvent: 'protic', heat: true },
      say: [
        'Moving a π bond also takes two processes: add, then eliminate. Example: 2-methylbut-2-ene → 3-methylbut-1-ene. Step 1: HBr, ROOR puts Br on the less substituted alkene carbon (anti-Markovnikov), giving 2-bromo-3-methylbutane. Step 2: t-BuOK (a bulky base) does E2 and removes an H from the exposed end CH₃, giving the Hofmann alkene, 3-methylbut-1-ene.',
        'To move a π bond the other way (from the end of a chain inward), flip both choices: HBr without peroxides (Markovnikov), then a small base like NaOEt (Zaitsev).',
        'That completes the ten alkene reactions: HX (Markovnikov), HBr/ROOR (anti-Markovnikov), acid hydration and oxymercuration (Markovnikov OH), hydroboration–oxidation (anti-Markovnikov, syn), hydrogenation (syn), bromination (anti), halohydrin formation (anti), anti dihydroxylation, syn dihydroxylation, and ozonolysis.',
      ],
      takeaway: 'Move a π bond to the end: HBr/ROOR then t-BuOK. Move it inward: HBr then NaOEt.',
      check: {
        q: 'Which sequence turns 2-methylbut-2-ene into 3-methylbut-1-ene?',
        a: '1) HBr, ROOR 2) t-BuOK',
        o: ['1) HBr 2) t-BuOK', '1) HBr, ROOR 2) NaOEt', '1) H₂, Pt 2) t-BuOK'],
        why: 'Anti-Markovnikov HBr puts Br on the CH carbon; the bulky base then takes an H from the CH₃ next to it, making the terminal alkene. HBr alone gives the 3° bromide, which with t-BuOK gives 2-methylbut-1-ene instead; NaOEt would go back to the Zaitsev alkene.',
      },
    },
  ],
};
