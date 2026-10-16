// Guided lecture · Ch 7 · Alkyl halides: substitution & elimination (follows Dr. Lopez's slides, sections 7.1–7.13)
export default {
  ch: 7, title: 'Alkyl halides: substitution & elimination',
  steps: [
    {
      sec: '7.1', title: 'Two reactions, one molecule',
      say: [
        'This chapter is about alkyl halides (a carbon chain with a halogen like Cl, Br or I attached). The carbon holding the halogen is sp³ (four single bonds, tetrahedral shape). These molecules do two main things: substitution, where a new group swaps in for the halogen, and elimination, where the halogen and a neighboring H both leave and a C=C double bond forms.',
        'Which one happens depends on the reagent. A nucleophile ("nucleus lover", an electron-rich species that attacks a carbon) does substitution. A base (an electron-rich species that grabs a proton, H⁺) does elimination. What they have in common: both use a lone pair of electrons.',
        'Many reagents, like hydroxide (HO⁻), can act as both, so the two pathways compete. The molecule being attacked (here, the alkyl halide) is called the substrate.',
      ],
      takeaway: 'Nucleophile → substitution; base → elimination. Same lone pair, different target, so they often compete.',
      check: {
        q: 'Ethoxide (EtO⁻) pulls an H off the carbon next to the C–Br, and an alkene forms. Ethoxide acted as a…',
        a: 'Base (elimination)',
        o: ['Nucleophile (substitution)', 'Leaving group', 'Substrate'],
        why: 'Grabbing a proton is base behavior. If ethoxide had attacked the carbon and pushed out Br⁻, that would be nucleophile behavior (substitution).',
      },
    },
    {
      sec: '7.1', title: 'Why halogens matter: the leaving group',
      say: [
        'Two reasons alkyl halides react. First, the halogen is electronegative (it pulls electrons toward itself), so the carbon attached to it gets a partial positive charge (δ+). That makes the carbon an electrophile ("electron lover", a target for nucleophiles).',
        'Second, the halogen is a leaving group (the piece that departs, taking the bond’s two electrons with it). To do substitution or elimination, a substrate must have a good leaving group.',
        'Dr. Lopez’s rule: good leaving groups are the conjugate bases of strong acids (what is left after a strong acid gives away its H⁺). HI, HBr and HCl are strong acids, so I⁻, Br⁻ and Cl⁻ leave well. HF is a weak acid, so F⁻ is poor, and HO⁻ is a bad leaving group. Order: I⁻ > Br⁻ > Cl⁻ ≫ F⁻. Weaker base = better leaving group.',
      ],
      takeaway: 'Good leaving group = weak base = conjugate base of a strong acid. I⁻ > Br⁻ > Cl⁻ ≫ F⁻; HO⁻ is bad.',
      check: {
        q: 'Which is the best leaving group?',
        a: 'I⁻',
        o: ['F⁻', 'HO⁻', 'Cl⁻'],
        why: 'HI is the strongest of these acids, so I⁻ is the weakest, most stable base. Its big, polarizable atom also spreads out the negative charge.',
      },
    },
    {
      sec: '7.2', title: 'Naming and 1°/2°/3° classification',
      say: [
        'Alkyl halides are named like alkanes (Ch 4 steps: find the parent chain, name the substituents, number them, list them alphabetically). The halogen is just a substituent with a prefix: fluoro, chloro, bromo, iodo. Number the chain so the substituents get the lowest numbers; halogens and alkyl groups count the same. Example: CH₃CHBrCH₂CH₃ is 2-bromobutane.',
        'Simple ones also have common names: the alkyl group, then the halide as a separate word. (CH₃)₃CBr is tert-butyl bromide; CH₃CH₂Cl is ethyl chloride. Halides show up in insecticides (DDT), dyes (Tyrian purple), drugs and even Splenda.',
        'Greek letters label the carbons: the α carbon (alpha) holds the halogen, the β carbon (beta) is next door, then γ, δ. Substitution happens at α (the δ+ carbon); elimination removes an H from β. Classify by how many carbons are attached to α: one = primary (1°), two = secondary (2°), three = tertiary (3°). CH₃X, with none, is a methyl halide. This branching decides the mechanism.',
      ],
      takeaway: 'Halogen = prefix (bromo-, chloro-…). Count the carbons on the α carbon: 1 = 1°, 2 = 2°, 3 = 3°.',
      check: {
        q: '2-Bromo-2-methylpropane, (CH₃)₃CBr, is a…',
        a: 'Tertiary (3°) alkyl halide',
        o: ['Primary (1°) alkyl halide', 'Secondary (2°) alkyl halide', 'Methyl halide'],
        why: 'The carbon holding Br is bonded to three other carbons (three CH₃ groups), so it is 3°.',
      },
    },
    {
      sec: '7.3', title: 'SN2: everything in one step',
      mech: 'sn2',
      say: [
        'A substitution needs two events: the leaving group leaves and the nucleophile attacks. They can happen at the same time (concerted, one step) or one after the other (stepwise). The concerted version is SN2; the stepwise one is SN1 (section 7.9).',
        'SN2 stands for Substitution, Nucleophilic, bimolecular (2 = two molecules meet in the slow step). Both the nucleophile and the substrate are in that one step, so rate = k[substrate][nucleophile]. That is second order: double either one and the rate doubles. To test it in the lab, change one concentration at a time and measure the rate.',
        'Open the 3D viewer: hydroxide hits the carbon while Br⁻ leaves, all in one motion.',
      ],
      takeaway: 'SN2 = one concerted step. Rate = k[RX][Nu⁻] (second order).',
      check: {
        q: 'In an SN2 reaction you triple the nucleophile concentration and keep the substrate the same. The rate…',
        a: 'Triples',
        o: ['Stays the same', 'Goes up 9×', 'Drops to one third'],
        why: 'Rate = k[RX][Nu⁻] is first order in nucleophile, so the rate scales directly with [Nu⁻].',
      },
    },
    {
      sec: '7.3', title: 'Backside attack and inversion',
      mech: 'sn2',
      say: [
        'The nucleophile always attacks from the backside, directly opposite the leaving group. Two reasons. The leaving group’s electron cloud blocks the front. And orbitals: the nucleophile’s electrons sit in its HOMO (highest occupied molecular orbital, its most available electrons) and flow into the substrate’s LUMO (lowest unoccupied molecular orbital, the empty C–LG antibonding orbital). That LUMO has its big lobe on the back and a node (a spot with zero electron density) on the front, so only backside attack overlaps.',
        'In the transition state (the highest-energy moment, drawn in brackets with ‡), carbon is half-bonded to both the nucleophile and the leaving group, with the other three groups flat in a plane. Then those three groups flip to the other side, like an umbrella in the wind.',
        'Result: inversion of configuration at that carbon. An optically pure (single-enantiomer) substrate gives one inverted product, which is the evidence that SN2 is one step. Careful: the R/S label usually flips, but not always, because priorities can change when the new group comes in. Draw it, then re-assign.',
      ],
      takeaway: 'Backside attack → 100% inversion of configuration at the α carbon.',
      check: {
        q: '(R)-2-Bromobutane reacts with NaCN in DMSO by SN2. The product is…',
        a: '(S)-2-Methylbutanenitrile, a single inverted product',
        o: ['(R)-2-Methylbutanenitrile only', 'A racemic 50:50 mix', 'But-2-ene'],
        why: 'Backside attack inverts the carbon. Here CN takes over Br’s top priority, so the label goes from R to S.',
      },
    },
    {
      sec: '7.3', title: 'Crowding slows SN2',
      say: [
        'The nucleophile has to squeeze in at the back of the carbon. Every extra alkyl group there is like furniture blocking a doorway (steric hindrance, crowding by nearby atoms). So SN2 rates go methyl > 1° > 2° ≫ 3°. Tertiary halides are too crowded: their SN2 is too slow to measure.',
        'Read it off the energy diagram. The climb from reactants up to the transition state is the activation energy (Ea), and it sets the rate (lower hill = faster). The overall drop from reactants to products (ΔG) tells you the thermodynamics (whether products are favored). Crowding raises the transition state’s energy, so Ea goes up and the reaction slows.',
        'Branching on the β carbon matters too. Neopentyl bromide, (CH₃)₃CCH₂Br, is technically 1°, but the bulky group right next door blocks the backside, so its SN2 is extremely slow.',
      ],
      takeaway: 'Less crowded = faster SN2: methyl > 1° > 2° ≫ 3° (no SN2). β-branching (neopentyl) also blocks it.',
      check: {
        q: 'Which reacts fastest by SN2?',
        a: 'CH₃CH₂Br (1°)',
        o: ['(CH₃)₂CHBr (2°)', '(CH₃)₃CBr (3°)', '(CH₃)₃CCH₂Br (neopentyl)'],
        why: 'Ethyl bromide has the most open backside. Neopentyl is 1° but its bulky β carbon blocks attack, and 3° can’t do SN2 at all.',
      },
    },
    {
      sec: '7.4', title: 'Strong vs weak nucleophiles',
      decide: { cls: '1', reagent: 'NaCN', solvent: 'aprotic', heat: false },
      say: [
        'SN2 needs a strong nucleophile, because it has to push the leaving group out on its own. How to spot one (review section 6.7):',
        'Charge: an anion beats the same atom when neutral (HO⁻ > H₂O, RO⁻ > ROH). Polarizability (how easily an atom’s electron cloud gets pushed around): big atoms like S and I make great nucleophiles (HS⁻, RS⁻, I⁻). Electrons held tightly by electronegativity or spread out by resonance make weaker nucleophiles. Bulk matters too: t-BuO⁻ is a strong base but a poor nucleophile.',
        'Strong: I⁻, Br⁻, Cl⁻, HS⁻, RS⁻, CN⁻, N₃⁻, HO⁻, RO⁻. Weak: H₂O and ROH (alcohols). The solvent changes nucleophile strength too (section 7.13). The decider below runs a 1° halide with NaCN in DMSO: clean SN2.',
      ],
      takeaway: 'Anions and big polarizable atoms (I⁻, HS⁻, CN⁻) are strong nucleophiles; H₂O and ROH are weak.',
      check: {
        q: 'Which is the strongest nucleophile?',
        a: 'CH₃S⁻',
        o: ['CH₃SH', 'CH₃OH', 'H₂O'],
        why: 'It is negatively charged and sulfur is big and polarizable. The neutral molecules are much weaker nucleophiles.',
      },
    },
    {
      sec: '7.5', title: 'E2: elimination in one step',
      mech: 'e2',
      say: [
        'Give an alkyl halide a strong base and it can do β-elimination (also called 1,2-elimination): the base removes an H from the β carbon, the leaving group leaves from the α carbon, and a C=C forms between them. With a strong base this happens in one concerted step called E2 (Elimination, bimolecular).',
        'Three things happen at once: the base takes the β-H, those C–H electrons become the π bond (the second bond of the double bond), and the leaving group leaves. The base and the substrate are both in that single step, so rate = k[substrate][base], second order.',
        'E2 vs SN2: both are one step, second order, and need a strong reagent and a good leaving group. The difference is the target: SN2’s nucleophile attacks the α carbon, E2’s base attacks a β hydrogen. That is why 3° halides, which block SN2, still do E2 easily: the outer H’s are easy to reach.',
      ],
      takeaway: 'E2: strong base, one step, rate = k[RX][base]. Base takes a β-H, leaving group leaves, C=C forms.',
      check: {
        q: 'What is the rate law for an E2 reaction?',
        a: 'rate = k[RX][base]',
        o: ['rate = k[RX]', 'rate = k[base]', 'rate = k[RX]²'],
        why: 'E2 is one concerted step involving both the substrate and the base, so it is bimolecular (second order).',
      },
    },
    {
      sec: '7.6', title: 'Which alkenes are most stable?',
      say: [
        'Eliminations make alkenes, so we need to rank alkene stability. Rule 1: trans is more stable than cis. In a cis alkene the two big groups sit on the same side and bump into each other (steric strain).',
        'Rule 2: more alkyl groups on the C=C = more stable. Alkyl groups feed a little electron density into the π bond (hyperconjugation, overlap of neighboring C–H bonds with the double bond). The ranking from the notes: tetrasubstituted > trisubstituted > trans-disubstituted > geminal (both groups on one carbon) ≥ cis > monosubstituted > ethylene.',
        'Heats of hydrogenation (heat released when H₂ is added to the alkene) prove it: a more stable alkene starts lower in energy, so it releases less heat. Rings: a trans double bond is too strained to fit in a ring smaller than eight carbons, so those cycloalkenes are always cis.',
      ],
      takeaway: 'More substituted = more stable; trans beats cis.',
      check: {
        q: 'Which alkene is the most stable?',
        a: '2,3-Dimethylbut-2-ene (tetrasubstituted)',
        o: ['trans-But-2-ene', 'cis-But-2-ene', 'But-1-ene'],
        why: 'Four alkyl groups on the C=C give the most hyperconjugation. After that: trans-disubstituted > cis > monosubstituted.',
      },
    },
    {
      sec: '7.7', title: 'E2 regiochemistry: Zaitsev vs Hofmann',
      decide: { cls: '3', reagent: 'tBuOK', solvent: 'protic', heat: true },
      say: [
        'Often the substrate has more than one β carbon with H’s, so E2 can make more than one alkene. Slide example: 2-bromo-2-methylbutane with ethoxide gives two alkenes. The more substituted, more stable one (2-methylbut-2-ene) is the Zaitsev product and is major. The less substituted one (2-methylbut-1-ene) is the Hofmann product and is minor.',
        'When a reaction can form constitutional isomers (same atoms, connected differently) but favors one, it is regioselective (picky about where the new bond goes).',
        'You can flip the outcome with the base. A bulky base like tert-butoxide (t-BuOK) can’t reach the crowded inner H’s, so it takes an exposed H on the end CH₃, and Hofmann becomes major. Small bases (HO⁻, MeO⁻, EtO⁻) give Zaitsev. Other bulky bases: DBU and LDA. They are also called non-nucleophilic bases, since they are too big to attack carbon.',
      ],
      takeaway: 'Small base → Zaitsev (more substituted). Bulky base (t-BuOK) → Hofmann (less substituted).',
      check: {
        q: '2-Bromo-2-methylbutane + t-BuOK (heat) gives mainly…',
        a: '2-Methylbut-1-ene (Hofmann)',
        o: ['2-Methylbut-2-ene (Zaitsev)', '2-Methylbutan-2-ol', '2-tert-Butoxy-2-methylbutane'],
        why: 'The bulky base removes the most accessible H (on the end CH₃), giving the less substituted alkene. A 3° carbon can’t do SN2, so no ether forms.',
      },
    },
    {
      sec: '7.7', title: 'E2 stereochemistry: anti-periplanar',
      mech: 'e2',
      say: [
        'E2 has a geometry rule. In the transition state, the C–H and C–LG bonds that break must line up in the same plane as the forming π bond (coplanar). There are two ways: anti (H and LG on opposite sides, 180°, staggered) or syn (same side, eclipsed). Newman projections (looking straight down the C–C bond) show this best.',
        'The anti arrangement is staggered and much lower in energy, so that is the one that reacts. About 175–179° is close enough, so it is called anti-periplanar. In the 3D viewer, tap “Newman view” to see the H and Br on opposite sides.',
        'Two consequences. If the β carbon has only ONE H, only one alkene geometry can form, so E2 is stereospecific (the substrate’s stereochemistry dictates exactly one product stereoisomer), even if that means the less stable Z alkene. If the β carbon has TWO H’s (like 3-bromopentane), either can line up, so both form, but trans is major: E2 is then stereoselective (both form, one is favored).',
      ],
      takeaway: 'β-H and leaving group must be anti-periplanar. One β-H → stereospecific; two β-H’s → stereoselective (trans major).',
      check: {
        q: 'In a stereoselective reaction…',
        a: 'Two stereoisomers can form, and one is major',
        o: ['Only one stereoisomer can form, set by the substrate’s stereochemistry', 'No stereoisomers form', 'The product is always racemic'],
        why: 'Stereoselective = a preference. Stereospecific = the substrate’s configuration dictates exactly one product configuration.',
      },
    },
    {
      sec: '7.7', title: 'E2 on cyclohexane rings',
      say: [
        'On a cyclohexane chair, anti-periplanar means trans-diaxial: the leaving group must be axial (pointing straight up or down) and the β-H must be axial on the opposite face. An equatorial leaving group has no anti β-H, so E2 waits until the ring flips it axial.',
        'So: draw the chair, flip it if needed to put the leaving group axial, then find the axial H’s on the neighboring carbons. Only those can be removed. If only one neighbor has an axial H, you get that alkene even if it is the less substituted one. The notes show exactly this: one isomer gives the Zaitsev alkene as major, while its diastereomer can only give the less substituted alkene.',
        'If the ring is locked (a big group like tert-butyl holds one chair) with the leaving group equatorial, E2 can’t happen.',
      ],
      takeaway: 'Ring E2: leaving group and β-H must both be axial (trans-diaxial).',
      check: {
        q: 'Why can’t a cyclohexyl bromide with Br locked equatorial do E2?',
        a: 'No β-H is anti-periplanar to an equatorial Br',
        o: ['Equatorial Br is a poor leaving group', 'The ring is too small to hold a C=C', 'The base can’t reach axial H’s'],
        why: 'An equatorial C–Br bond is anti to ring C–C bonds, not to any C–H. E2 needs Br axial with an axial H next door.',
      },
    },
    {
      sec: '7.8', title: 'When SN2 and E2 compete',
      decide: { cls: '2', reagent: 'NaOEt', solvent: 'protic', heat: true },
      say: [
        'Some reagents are both a strong nucleophile and a strong base: HO⁻, MeO⁻ (methoxide) and EtO⁻ (ethoxide). With these, SN2 and E2 compete, and the substrate’s crowding picks the winner.',
        '1°: the backside is open, so SN2 is major (E2 minor). 2°: crowding slows SN2, so E2 is major (SN2 minor). 3°: SN2 is impossible, so E2 only. Heat pushes things further toward elimination.',
        'A bulky base like t-BuOK mostly does E2 because it is too big to attack carbon. (One example in Dr. Lopez’s notes, a 1° iodide with t-BuOK in DMSO, still gave a good amount of SN2, so on 1° expect some substitution.) The decider below runs a 2° halide with NaOEt and heat.',
      ],
      takeaway: 'Strong Nu + strong base: 1° → SN2 major, 2° → E2 major, 3° → E2 only.',
      check: {
        q: '2-Bromopropane + NaOH (heat). Major pathway?',
        a: 'E2',
        o: ['SN2', 'SN1', 'No reaction'],
        why: 'Hydroxide is a strong nucleophile and a strong base. On a 2° carbon the base wins, so E2 is major and SN2 minor.',
      },
    },
    {
      sec: '7.9', title: 'SN1: the leaving group leaves first',
      mech: 'sn1',
      say: [
        'A puzzle from the slides: a 3° halide dissolved in ethanol gives both a substitution and an elimination product. But 3° can’t do SN2, and ethanol isn’t a strong base, so E2 is unlikely. Experiments show rate = k[substrate] only (first order), so neither SN2 nor E2 is happening.',
        'Both products share a first step: ionization. The leaving group leaves on its own with its electrons, leaving a carbocation (a carbon with only three bonds and a + charge; flat, sp², with an empty p orbital). The carbocation then either gets attacked by the solvent (substitution) or loses a β-H to the solvent (elimination).',
        'SN1 (Substitution, Nucleophilic, unimolecular): 1) leaving group leaves → carbocation, 2) nucleophile attacks, 3) if the nucleophile was neutral (H₂O, ROH), a proton transfer removes the extra H⁺. When the solvent is also the nucleophile, it is called solvolysis.',
      ],
      takeaway: 'SN1: leaving group leaves first (carbocation), then the nucleophile attacks. Rate = k[RX].',
      check: {
        q: 'In an SN1 reaction you double the nucleophile concentration. The rate…',
        a: 'Stays the same',
        o: ['Doubles', 'Quadruples', 'Is cut in half'],
        why: 'The nucleophile only shows up after the slow step, so rate = k[RX] doesn’t include it.',
      },
    },
    {
      sec: '7.9', title: 'SN1 energy diagram and carbocation stability',
      say: [
        'The SN1 energy diagram has several hills with valleys between them. A valley is an intermediate (a real but short-lived species, here the carbocation). The tallest hill is the first one, making the carbocation, so that is the rate-determining step (the slowest step, which sets the overall speed). It is uphill (endothermic).',
        'By the Hammond postulate (a transition state resembles the species closest to it in energy), that first transition state looks like the carbocation. So whatever stabilizes the carbocation speeds the reaction: 3° > 2° > 1°. Allylic (next to a C=C) and benzylic (next to a benzene ring) carbocations are resonance-stabilized (charge spread over several atoms), so they react fast too. A better leaving group also speeds ionization.',
        'Rule of thumb: 3°, allylic and benzylic halides undergo solvolysis and give a mix of SN1 and E1 products. 1° and 2° are usually too slow, unless they can rearrange to a more stable carbocation.',
      ],
      takeaway: 'SN1/E1 speed follows carbocation stability: 3°, allylic, benzylic are fast; 1° and methyl essentially never.',
      check: {
        q: 'Which reacts fastest by SN1 in ethanol?',
        a: '(CH₃)₃CBr',
        o: ['CH₃CH₂Br', 'CH₃Br', '(CH₃)₂CHCl'],
        why: '3° gives the most stable carbocation, and the slow step (ionization) depends on that. 2° chloride is slower (less stable cation, poorer leaving group); methyl and 1° cations are too unstable to form.',
      },
    },
    {
      sec: '7.9', title: 'Carbocation rearrangements',
      mech: 'hydride',
      say: [
        'Because SN1 and E1 go through a carbocation, it can rearrange into a more stable one before the nucleophile or base arrives. Two kinds: a 1,2-hydride shift (an H on the neighboring carbon slides over with its two electrons, as H⁻) and a 1,2-methyl shift (also called a methide shift; a CH₃ slides over with its electrons).',
        'Shifts only happen if they make a more stable carbocation, like 2° → 3°. Open the 3D viewer to watch a 2° cation become 3° by a hydride shift.',
        'Example from the notes: 2-chloro-3-phenylbutane in methanol. The 2° cation takes a hydride from its neighbor, making a 3° benzylic cation (extra stable), so the OCH₃ ends up on the carbon holding the phenyl: 2-methoxy-2-phenylbutane, racemic.',
      ],
      takeaway: 'Carbocations shift (1,2-H or 1,2-CH₃) whenever that makes a more stable cation. SN2 and E2 never rearrange.',
      check: {
        q: 'Which mechanism can give a rearranged carbon skeleton?',
        a: 'SN1',
        o: ['SN2', 'E2', 'Both SN2 and E2'],
        why: 'Only pathways with a carbocation intermediate (SN1 and E1) can rearrange. SN2 and E2 are single steps with no carbocation.',
      },
    },
    {
      sec: '7.9', title: 'E1: carbocation, then lose a proton',
      mech: 'e1',
      decide: { cls: '3', reagent: 'EtOH', solvent: 'protic', heat: true },
      say: [
        'E1 (Elimination, unimolecular) shares its first step with SN1: the leaving group leaves and a carbocation forms. Then, instead of attacking the carbon, the solvent acts as a base and removes a β-H, and those electrons form the C=C. Same kinetics: rate = k[substrate].',
        'SN1 and E1 almost always happen together. From the notes: 2-bromo-2-methylpropane in water/acetone with heat gives about 80% SN1 (alcohol) and 20% E1 (alkene). Heat shifts the mix toward elimination.',
        'E1 always gives the most stable (most substituted, Zaitsev) alkene as major. Unlike E2, you can’t steer it with a bulky base, because the base is just the solvent. It is stereoselective (trans over cis) but not stereospecific, and every possible alkene forms in some amount.',
      ],
      takeaway: 'E1 = carbocation, then lose a β-H. Zaitsev always major; trans over cis; competes with SN1.',
      check: {
        q: 'How do you get the Hofmann (less substituted) alkene from an E1 reaction?',
        a: 'You can’t; E1 always favors the Zaitsev alkene',
        o: ['Use a bulkier solvent', 'Heat it more', 'Use a better leaving group'],
        why: 'In E1 the alkene comes from a free carbocation and a weak base, so the most stable alkene wins. For Hofmann you need E2 with a bulky base.',
      },
    },
    {
      sec: '7.9', title: 'SN1 stereochemistry: (nearly) racemic',
      mech: 'sn1',
      say: [
        'If the α carbon is a stereocenter (a chiral carbon), SN1 gives two products with opposite configurations. The carbocation is flat, so the nucleophile can attack either face of the empty p orbital: one face gives inversion, the other gives retention.',
        'The result is close to racemic (a 50:50 mix of enantiomers), but usually with a little extra inversion. Why: right after ionizing, the leaving group is still hanging next to the front face (an ion pair), partly blocking it. The notes’ example: about 60% inversion, 40% retention.',
        'Compare SN2: 100% inversion, one product.',
      ],
      takeaway: 'SN1 at a stereocenter → both configurations (nearly racemic, slight excess of inversion).',
      check: {
        q: 'An optically pure 3° alkyl bromide (stereocenter at the C–Br carbon) reacts in methanol by SN1. You get…',
        a: 'A nearly racemic mix with slightly more inversion',
        o: ['Only the inverted product', 'Only the retained product', 'Exactly 50:50, every time'],
        why: 'The flat carbocation is attacked from both faces. The departing leaving group partly shields the front, so inversion is slightly favored.',
      },
    },
    {
      sec: '7.10', title: 'Predicting products: what does the reagent do?',
      decide: { cls: '2', reagent: 'H2O', solvent: 'protic', heat: false },
      say: [
        'Dr. Lopez’s three-step plan for any substitution/elimination problem: 1) decide what the reagent does, 2) look at the substrate (1°, 2°, 3°) to see which mechanism wins, 3) draw the regio- and stereochemistry and pick the major product.',
        'Step 1 sorts reagents into four groups. Strong nucleophile, weak base (I⁻, Br⁻, Cl⁻, HS⁻, RS⁻, CN⁻, N₃⁻): substitution. Strong nucleophile AND strong base (HO⁻, MeO⁻, EtO⁻): SN2 and E2 compete. Strong bulky base (t-BuOK, DBU, LDA): E2. Weak nucleophile, weak base (H₂O, MeOH, EtOH): SN1 and E1.',
        'Step 2 uses the substrate. 1°: SN2 (E2 with a bulky base); weak reagents do nothing. 2°: SN2 with nucleophiles, E2 with strong bases, slow SN1/E1 with weak reagents. 3°: never SN2; E2 with strong bases, SN1/E1 with weak reagents, SN1 with a strong nucleophile that is a weak base. The decider below runs a 2° halide in water.',
      ],
      takeaway: 'Reagent first (which of the four types?), then substrate (1°/2°/3°), then regio/stereo.',
      check: {
        q: 'NaSH reacts with a 2° alkyl bromide in DMSO. Main pathway?',
        a: 'SN2 (with inversion)',
        o: ['E2', 'SN1 + E1', 'E1'],
        why: 'HS⁻ is a strong nucleophile but a weak base, so it substitutes. On a 2° carbon in a polar aprotic solvent, that means SN2.',
      },
    },
    {
      sec: '7.10', title: 'Predicting products: draw them right',
      decide: { cls: '1', reagent: 'NaOMe', solvent: 'protic', heat: false },
      say: [
        'Step 3 applies each mechanism’s rules. SN2: one product, nucleophile on the α carbon, inversion. E2: draw every alkene from a β-H that can be anti-periplanar to the leaving group; a small base makes Zaitsev major, a bulky base makes Hofmann major; trans beats cis; one β-H means stereospecific.',
        'SN1: draw the carbocation, check for a rearrangement, then attach the nucleophile (to the rearranged carbon if it shifted). If a new stereocenter forms, draw both R and S. E1: draw the (possibly rearranged) carbocation, then every alkene from losing a β-H; the most stable alkene is major (Zaitsev always), trans over cis.',
        'Expect mixtures. The real skill is ranking major vs minor. The decider below shows a 1° halide with methoxide: SN2 major, E2 minor.',
      ],
      takeaway: 'SN2: invert. E2: anti-periplanar + base size. SN1/E1: check for shifts; SN1 gives both configurations; E1 gives Zaitsev.',
      check: {
        q: 'Before attaching the nucleophile to draw an SN1 product, what must you check?',
        a: 'Whether the carbocation can rearrange to a more stable one',
        o: ['Whether a β-H is anti-periplanar', 'Whether the base is bulky', 'Whether the solvent is aprotic'],
        why: 'The nucleophile adds wherever the + charge ends up. If a hydride or methyl shift can make a more stable cation, it happens first.',
      },
    },
    {
      sec: '7.11', title: 'Sulfonates: OTs, OTf',
      decide: { cls: '2', reagent: 'NaN3', solvent: 'aprotic', heat: false },
      say: [
        'Halides aren’t the only leaving groups. Alkyl sulfonates, like tosylates (OTs) and triflates (OTf), are excellent ones. Like halides, they are conjugate bases of strong acids, and their negative charge is spread by resonance over three oxygens. Lower pKa means stronger acid and a better leaving group, so triflate (from triflic acid, far stronger than tosic acid) is the best.',
        'Make a tosylate from an alcohol with TsCl (tosyl chloride) and pyridine (a mild base that soaks up the HCl). Only the O–H bond changes: you are strapping the Ts group onto the oxygen. The carbon holding the O is untouched, so its configuration is kept (retention).',
        'Then treat R–OTs exactly like R–Br: a strong nucleophile does SN2 with inversion, a strong base does E2. This is the cleanest way to turn a bad leaving group (OH) into a great one.',
      ],
      takeaway: 'ROH + TsCl, pyridine → ROTs (retention). Then ROTs reacts like an alkyl halide.',
      check: {
        q: '(R)-Butan-2-ol is treated with 1) TsCl, pyridine, then 2) NaCN in DMSO. The nitrile product is…',
        a: 'Inverted at that carbon, a single stereoisomer',
        o: ['Retained at that carbon, a single stereoisomer', 'Racemic', 'An alkene instead'],
        why: 'Tosylation keeps the configuration; the SN2 step then inverts it. Net result: one inversion.',
      },
    },
    {
      sec: '7.11', title: 'Alcohols: make OH leave',
      say: [
        'Alcohols can do substitution and elimination too, but HO⁻ is a bad leaving group. Besides tosylates, the other trick is strong acid: protonate the OH to make –OH₂⁺, and now the leaving group is water, which is a good one.',
        'With HX (like HBr): 1° alcohols react by SN2, because 1° carbocations are too unstable to form. 2° and 3° alcohols react by SN1 (strong acid conditions are protic, which helps SN1), so rearrangements are possible.',
        'With concentrated H₂SO₄ and heat (no good nucleophile around), 2° and 3° alcohols do E1 to give alkenes. This is called dehydration (losing water), and the Zaitsev alkene is major.',
      ],
      takeaway: 'Acid turns OH into OH₂⁺ (good leaving group). HX: 1° SN2, 2°/3° SN1. H₂SO₄ + heat: E1 → alkene.',
      check: {
        q: 'tert-Butyl alcohol + HBr gives tert-butyl bromide by which mechanism?',
        a: 'SN1',
        o: ['SN2', 'E2', 'E1'],
        why: 'After protonation, water leaves from the 3° carbon to form a stable carbocation, and Br⁻ attacks it. 3° can’t do SN2.',
      },
    },
    {
      sec: '7.12', title: 'Retrosynthesis: think backwards',
      say: [
        'Synthesis means making valuable, complex molecules from cheap ones. To plan, work backwards: picture the finished target, then ask what pieces it could be built from. This is retrosynthetic analysis, drawn with an open arrow (⇒) meaning “could be made from”. It only works if you remember the reactions.',
        'Dr. Lopez’s four steps: 1) find a bond in the target you know how to make, 2) draw the substrate and nucleophile needed, 3) check the reaction is reasonable, 4) write it forward.',
        'Example: an ether (R–O–R′). Either C–O bond could come from SN2 between an alkoxide (RO⁻) and an alkyl halide (the Williamson ether synthesis). Choose the version with the halide on the less hindered carbon. For cyclopentyl ethyl ether, use cyclopentoxide + ethyl bromide (1°, SN2 works), not ethoxide + bromocyclopentane (2° + strong base gives mostly E2).',
      ],
      takeaway: 'Work backwards from the target, then check it forwards. For ethers: alkoxide + the less hindered halide.',
      check: {
        q: 'Best SN2 route to CH₃CH₂–O–C(CH₃)₃?',
        a: '(CH₃)₃CO⁻ + CH₃CH₂Br',
        o: ['CH₃CH₂O⁻ + (CH₃)₃CBr', '(CH₃)₃COH + CH₃CH₂OH', 'CH₃CH₂O⁻ + (CH₃)₃COH'],
        why: 'The halide must sit on the unhindered side. A 3° bromide can’t do SN2, and ethoxide would just eliminate it (E2). Alcohols on their own have no good leaving group.',
      },
    },
    {
      sec: '7.13', title: 'Solvent effects: protic vs aprotic',
      decide: { cls: '3', reagent: 'H2O', solvent: 'protic', heat: false },
      say: [
        'Polar protic solvents have an O–H or N–H, so they can hydrogen-bond: H₂O, MeOH, EtOH, acetic acid. Polar aprotic solvents are polar but have no O–H or N–H: DMSO, DMF, acetone, acetonitrile (the notes also use THF).',
        'SN2 wants polar aprotic. Protic solvents wrap an anionic nucleophile in a cage of H-bonds, stabilizing it and making it sluggish. Aprotic solvents surround the cation (Na⁺, K⁺) but leave the anion “naked”, higher in energy and more reactive, so Ea drops and SN2 speeds up. (If a slide line reads as if aprotic solvents stabilize anions too, the point to remember is that they solvate anions poorly.)',
        'SN1 wants polar protic. Its H-bonds stabilize the carbocation, the leaving-group anion and the transition state between them, lowering Ea for the slow ionization step. The decider below runs a 3° halide in water.',
      ],
      takeaway: 'SN2 → polar aprotic (DMSO, DMF, acetone). SN1 → polar protic (H₂O, ROH).',
      check: {
        q: 'Which solvent speeds up the SN2 reaction of CH₃CH₂Br with NaCN the most?',
        a: 'DMSO',
        o: ['Water', 'Methanol', 'Ethanol'],
        why: 'DMSO is polar aprotic: it can’t H-bond to CN⁻, so the nucleophile stays reactive. The others are protic and cage the nucleophile.',
      },
    },
  ],
};
