// Microbe of the day: one organism per day, in order.
export const MICROBES = [
  {
    name: 'Deinococcus radiodurans', kind: 'Bacterium', emoji: '☢️',
    hook: 'Survives radiation doses thousands of times what would kill a person.',
    facts: [
      'First isolated in 1956 from canned meat that had been sterilized with radiation.',
      'Keeps several copies of its genome and uses them to stitch shattered DNA back together.',
      'Also extremely resistant to drying out; its radiation resistance may be a side effect of that.'
    ],
    why: 'Why microbiologists care: a model for DNA repair and a candidate for cleaning up radioactive waste sites.',
    gram: 'Gram-positive (but has an unusual outer layer)', shape: 'Cocci in tetrads'
  },
  {
    name: 'Escherichia coli K-12', kind: 'Bacterium', emoji: '🧫',
    hook: 'The most-studied living thing on Earth started as one patient\'s stool sample in 1922.',
    facts: [
      'K-12 is a harmless lab strain, unlike the toxin-making strains in food outbreaks.',
      'Lederberg and Tatum discovered bacterial conjugation using K-12 strains.',
      'Can double about every 20 minutes in rich medium.'
    ],
    why: 'Why microbiologists care: the workhorse of cloning; it made the first recombinant human drug, insulin.',
    gram: 'Gram-negative', shape: 'Rod (bacillus)'
  },
  {
    name: 'Plasmodium falciparum', kind: 'Protist', emoji: '🦟',
    hook: 'The deadliest malaria parasite hides inside your red blood cells.',
    facts: [
      'Spread by the bite of female Anopheles mosquitoes.',
      'Multiplies first in liver cells, then in red blood cells, bursting them in cycles.',
      'Sickle cell trait gives partial protection, which is why that allele persists in malaria regions.'
    ],
    why: 'Why microbiologists care: kills hundreds of thousands yearly; artemisinin (from sweet wormwood) earned Tu Youyou a 2015 Nobel.',
    gram: '', shape: 'Apicomplexan parasite'
  },
  {
    name: 'Thermus aquaticus', kind: 'Bacterium', emoji: '♨️',
    hook: 'A hot-spring bacterium made modern DNA testing possible.',
    facts: [
      'Discovered in Yellowstone hot springs by Thomas Brock in the 1960s.',
      'Its DNA polymerase (Taq) survives repeated heating to near boiling.',
      'Taq has no proofreading, so it makes more copying errors than some other polymerases.'
    ],
    why: 'Why microbiologists care: Taq polymerase made PCR fast and automatable, used in diagnostics and forensics.',
    gram: 'Gram-negative', shape: 'Rod'
  },
  {
    name: 'Halobacterium salinarum', kind: 'Archaeon', emoji: '🧂',
    hook: 'Despite its name it is not a bacterium, and it needs water saltier than the sea to live.',
    facts: [
      'Needs near-saturated salt water; in fresh water its cells fall apart.',
      'Bacteriorhodopsin in its purple membrane uses light to pump protons and make ATP.',
      'Its red carotenoid pigments help color salt ponds pink and red.'
    ],
    why: 'Why microbiologists care: bacteriorhodopsin is a classic model for membrane proteins and light-driven pumps.',
    gram: 'Stains Gram-negative (no peptidoglycan)', shape: 'Rod'
  },
  {
    name: 'Vibrio cholerae', kind: 'Bacterium', emoji: '💧',
    hook: 'One toxin can drain the body of liters of water.',
    facts: [
      'Cholera toxin locks a G protein "on", raising cAMP so gut cells pour out chloride and water.',
      'Causes massive watery "rice-water" diarrhea.',
      'John Snow traced an 1854 London outbreak to the Broad Street water pump.'
    ],
    why: 'Why microbiologists care: oral rehydration solution (sugar + salt) uses intact sodium-glucose transport and saves millions.',
    gram: 'Gram-negative', shape: 'Curved (comma) rod, single polar flagellum'
  },
  {
    name: 'Mimivirus', kind: 'Virus', emoji: '🦠',
    hook: 'A virus so big it was first mistaken for a bacterium.',
    facts: [
      'Found inside amoebae; its name means "mimicking microbe".',
      'Large enough to see with an ordinary light microscope.',
      'Its genome is bigger than some bacteria\'s and includes genes linked to protein translation.'
    ],
    why: 'Why microbiologists care: giant viruses blur the line between viruses and cellular life.',
    gram: '', shape: 'dsDNA genome; large icosahedral capsid covered in fibers'
  },
  {
    name: 'Saccharomyces cerevisiae', kind: 'Fungus', emoji: '🍞',
    hook: 'The same yeast makes your bread, your beer, and Nobel Prize research.',
    facts: [
      'First eukaryote to have its genome fully sequenced (1996).',
      'Ferments sugar into ethanol and CO2.',
      'Can live as haploid or diploid cells, with two mating types (a and alpha).'
    ],
    why: 'Why microbiologists care: model for the cell cycle and aging; also produces insulin and the hepatitis B vaccine antigen.',
    gram: '', shape: 'Oval budding yeast'
  },
  {
    name: 'Mycobacterium tuberculosis', kind: 'Bacterium', emoji: '🫁',
    hook: 'An ancient killer wrapped in a waxy coat.',
    facts: [
      'Robert Koch identified it as the cause of TB in 1882.',
      'Divides very slowly, so colonies take weeks to appear.',
      'The immune system walls it off in granulomas, where it can stay latent for years.'
    ],
    why: 'Why microbiologists care: one of the top infectious killers; needs months of multi-drug therapy, and resistant strains are spreading.',
    gram: 'Acid-fast (waxy mycolic acid wall stains poorly with Gram)', shape: 'Rod'
  },
  {
    name: 'Toxoplasma gondii', kind: 'Protist', emoji: '🐈',
    hook: 'A parasite that makes mice stop fearing cats.',
    facts: [
      'Reproduces sexually only inside cats, which shed it in feces.',
      'Infected rodents lose their aversion to cat urine, helping it get back to a cat.',
      'Can cross the placenta, which is why pregnant people are told to avoid litter boxes.'
    ],
    why: 'Why microbiologists care: dangerous for fetuses and people with weak immunity (e.g., AIDS); a model apicomplexan.',
    gram: '', shape: 'Crescent-shaped cells (tachyzoites)'
  },
  {
    name: 'Staphylococcus aureus', kind: 'Bacterium', emoji: '🍇',
    hook: 'Lives quietly in many people\'s noses, until it doesn\'t.',
    facts: [
      'Carried in the nose of many healthy people.',
      'Coagulase-positive, which helps tell it apart from other staph.',
      'Makes toxins behind food poisoning and toxic shock syndrome.'
    ],
    why: 'Why microbiologists care: MRSA, resistant to methicillin and related beta-lactams, is a major hospital and community pathogen.',
    gram: 'Gram-positive', shape: 'Cocci in grape-like clusters'
  },
  {
    name: 'Wolbachia pipientis', kind: 'Bacterium', emoji: '🪲',
    hook: 'A bacterium that rewrites the sex lives of insects.',
    facts: [
      'Lives inside the cells of insects and other arthropods and passes to offspring through eggs.',
      'Can kill males, feminize them, or make uninfected females\' embryos fail when mated with infected males.',
      'Found in a large share of insect species.'
    ],
    why: 'Why microbiologists care: Wolbachia-carrying mosquitoes reduce dengue spread; doxycycline treats some worm diseases by killing their Wolbachia.',
    gram: 'Gram-negative', shape: 'Small intracellular rods'
  },
  {
    name: 'Methanobrevibacter smithii', kind: 'Archaeon', emoji: '💨',
    hook: 'The archaeon in your gut that turns hydrogen into methane.',
    facts: [
      'The most common archaeon in the human gut.',
      'Makes methane by combining H2 with CO2.',
      'Its wall is pseudomurein, not peptidoglycan, so lysozyme and penicillin don\'t affect it.'
    ],
    why: 'Why microbiologists care: proof that archaea are part of the human microbiome; removing H2 helps gut bacteria ferment efficiently.',
    gram: 'Gram-positive (pseudomurein wall)', shape: 'Short rod (coccobacillus)'
  },
  {
    name: 'Bacteriophage T4', kind: 'Virus', emoji: '🚀',
    hook: 'Looks like a lunar lander and injects its DNA like a syringe.',
    facts: [
      'Infects E. coli, injecting DNA through a contractile tail.',
      'Lytic phage: it bursts the host cell to release new phages.',
      'Crick and Brenner used T4 mutants to show the genetic code is read in triplets (1961).'
    ],
    why: 'Why microbiologists care: phage therapy against resistant bacteria, plus lab tools like T4 DNA ligase.',
    gram: '', shape: 'dsDNA genome; icosahedral head with contractile tail'
  },
  {
    name: 'Candida albicans', kind: 'Fungus', emoji: '🍄',
    hook: 'A shape-shifting yeast that lives in most people.',
    facts: [
      'A normal resident of the mouth, gut and vagina.',
      'Switches between yeast and hyphal forms; hyphae help it invade tissue.',
      'Overgrows after antibiotics or with weak immunity, causing thrush and yeast infections.'
    ],
    why: 'Why microbiologists care: a leading cause of fungal bloodstream infections; fungi are eukaryotes like us, so drug targets are limited.',
    gram: '', shape: 'Yeast that can switch to hyphae'
  },
  {
    name: 'Myxococcus xanthus', kind: 'Bacterium', emoji: '🐺',
    hook: 'Bacteria that hunt in wolf packs.',
    facts: [
      'Swarms glide over surfaces and prey on other bacteria together.',
      'When starved, thousands of cells aggregate into a fruiting body.',
      'Cells inside the fruiting body become tough, dormant myxospores.'
    ],
    why: 'Why microbiologists care: a model for multicellularity and cell signaling; myxobacteria are a rich source of new antibiotics.',
    gram: 'Gram-negative', shape: 'Rod'
  },
  {
    name: 'Clostridioides difficile', kind: 'Bacterium', emoji: '🧴',
    hook: 'Takes over when antibiotics clear out your gut.',
    facts: [
      'A strict anaerobe that forms tough spores.',
      'Toxins A and B damage the colon lining, causing colitis.',
      'Alcohol sanitizer doesn\'t kill its spores; soap and water wash them away.'
    ],
    why: 'Why microbiologists care: a top hospital infection; recurrent cases can be treated with fecal microbiota transplant.',
    gram: 'Gram-positive', shape: 'Spore-forming rod'
  },
  {
    name: 'Trypanosoma brucei', kind: 'Protist', emoji: '😴',
    hook: 'Keeps changing its coat so antibodies can never catch up.',
    facts: [
      'Spread by tsetse flies in sub-Saharan Africa.',
      'Causes African sleeping sickness once it reaches the brain.',
      'Swaps its surface glycoprotein (VSG) coat to dodge antibodies.'
    ],
    why: 'Why microbiologists care: the classic model of antigenic variation; RNA editing was first discovered in trypanosomes.',
    gram: '', shape: 'Elongated cell with one flagellum'
  },
  {
    name: 'Helicobacter pylori', kind: 'Bacterium', emoji: '🥤',
    hook: 'A doctor drank it to prove ulcers aren\'t caused by stress.',
    facts: [
      'Makes urease, turning urea into ammonia to neutralize acid around it.',
      'Barry Marshall drank a culture and developed gastritis.',
      'Marshall and Robin Warren won the 2005 Nobel Prize for the discovery.'
    ],
    why: 'Why microbiologists care: causes most peptic ulcers and raises stomach cancer risk; ulcers became curable with antibiotics.',
    gram: 'Gram-negative', shape: 'Curved or spiral rod with flagella'
  },
  {
    name: 'Pyrococcus furiosus', kind: 'Archaeon', emoji: '🔥',
    hook: 'Its name means "rushing fireball", and it grows best near boiling.',
    facts: [
      'Grows best around 100°C.',
      'Isolated from hot marine sediments off Vulcano Island, Italy.',
      'An anaerobe that ferments sugars and peptides, giving off hydrogen gas.'
    ],
    why: 'Why microbiologists care: Pfu DNA polymerase proofreads, so it is used for high-accuracy PCR.',
    gram: '', shape: 'Cocci'
  },
  {
    name: 'Streptococcus pyogenes', kind: 'Bacterium', emoji: '✂️',
    hook: 'The strep throat bug gave us the most popular gene-editing tool.',
    facts: [
      'Group A strep causes strep throat and scarlet fever.',
      'Can cause necrotizing fasciitis, the "flesh-eating" infection.',
      'Untreated strep can trigger rheumatic fever when antibodies cross-react with heart tissue.'
    ],
    why: 'Why microbiologists care: its Cas9 enzyme (SpCas9) is the most widely used CRISPR editor.',
    gram: 'Gram-positive', shape: 'Cocci in chains'
  },
  {
    name: 'Penicillium chrysogenum', kind: 'Fungus', emoji: '💊',
    hook: 'A moldy petri dish started the antibiotic era.',
    facts: [
      'In 1928 Fleming saw a Penicillium mold killing the Staph on his plate.',
      'A high-yield strain came from a moldy cantaloupe in Peoria, Illinois.',
      'Penicillin blocks the enzymes that cross-link peptidoglycan in bacterial walls.'
    ],
    why: 'Why microbiologists care: penicillin production in WWII launched the antibiotic era.',
    gram: '', shape: 'Filamentous mold with brush-like spore stalks'
  },
  {
    name: 'Magnetospirillum magneticum', kind: 'Bacterium', emoji: '🧲',
    hook: 'A bacterium with a built-in compass.',
    facts: [
      'Builds chains of magnetite crystals called magnetosomes.',
      'The chain acts like a compass needle, lining the cell up with Earth\'s magnetic field.',
      'This helps it swim toward the low-oxygen zones it prefers.'
    ],
    why: 'Why microbiologists care: a model for organelle-like structures in bacteria and for making uniform magnetic nanoparticles.',
    gram: 'Gram-negative', shape: 'Spirillum (spiral)'
  },
  {
    name: 'HIV-1', kind: 'Virus', emoji: '🎗️',
    hook: 'Writes itself permanently into the DNA of your immune cells.',
    facts: [
      'Enters cells using CD4 plus a coreceptor (CCR5 or CXCR4).',
      'Reverse transcriptase copies its RNA into DNA; integrase inserts it into the host genome.',
      'Loss of helper T cells over time leads to AIDS.'
    ],
    why: 'Why microbiologists care: combination antiretroviral therapy turned it into a manageable chronic infection.',
    gram: '', shape: 'Enveloped retrovirus; cone-shaped capsid; two copies of ssRNA(+)'
  },
  {
    name: 'Dictyostelium discoideum', kind: 'Protist', emoji: '🐌',
    hook: 'Single cells that team up into a crawling slug when food runs out.',
    facts: [
      'Lives as single amoebae that eat bacteria in soil.',
      'Starving cells signal with cAMP and stream together into a slug.',
      'The slug forms a fruiting body; stalk cells die so spore cells can survive.'
    ],
    why: 'Why microbiologists care: a model for chemotaxis, cell signaling and the evolution of cooperation.',
    gram: '', shape: 'Amoeba'
  },
  {
    name: 'Staphylococcus epidermidis', kind: 'Bacterium', emoji: '🖐️',
    hook: 'Your skin\'s most common roommate.',
    facts: [
      'One of the most common bacteria on human skin.',
      'Coagulase-negative, unlike S. aureus.',
      'Forms sticky biofilms on plastic surfaces.'
    ],
    why: 'Why microbiologists care: a leading cause of infections on catheters, prosthetic joints and other implants.',
    gram: 'Gram-positive', shape: 'Cocci in clusters'
  },
  {
    name: 'Sulfolobus acidocaldarius', kind: 'Archaeon', emoji: '🌋',
    hook: 'Thrives in hot springs as acidic as lemon juice.',
    facts: [
      'Lives in hot, acidic springs (around pH 2 to 3).',
      'First isolated from Yellowstone by Thomas Brock.',
      'Can get energy by oxidizing sulfur.'
    ],
    why: 'Why microbiologists care: a model for archaeal DNA replication and cell division, which resemble the eukaryotic versions.',
    gram: '', shape: 'Irregular lobed cocci'
  },
  {
    name: 'Clostridium botulinum', kind: 'Bacterium', emoji: '🥫',
    hook: 'Makes one of the most potent toxins known, and doctors inject it on purpose.',
    facts: [
      'Its spores can survive in improperly home-canned foods.',
      'Botulinum toxin blocks acetylcholine release at neuromuscular junctions, causing flaccid paralysis.',
      'Babies shouldn\'t eat honey because spores can grow in their gut.'
    ],
    why: 'Why microbiologists care: tiny doses (Botox) treat muscle spasms and migraines; a lesson in dose making the poison.',
    gram: 'Gram-positive', shape: 'Spore-forming rod'
  },
  {
    name: 'Giardia duodenalis (lamblia)', kind: 'Protist', emoji: '👀',
    hook: 'A parasite that looks like it is staring back at you.',
    facts: [
      'Has two nuclei, which give it a "face" under the microscope.',
      'Clings to the small intestine wall with an adhesive ventral disk.',
      'Lacks typical mitochondria; it has tiny remnant organelles called mitosomes.'
    ],
    why: 'Why microbiologists care: a common cause of diarrhea from untreated water; its cysts resist normal chlorine levels.',
    gram: '', shape: 'Pear-shaped, flagellated, two nuclei'
  },
  {
    name: 'Streptococcus pneumoniae', kind: 'Bacterium', emoji: '🧬',
    hook: 'The bacterium that revealed DNA is the genetic material.',
    facts: [
      'Its polysaccharide capsule protects it from being eaten by phagocytes.',
      'Griffith\'s 1928 mouse experiment with it revealed bacterial transformation.',
      'Avery, MacLeod and McCarty showed in 1944 that the transforming factor was DNA.'
    ],
    why: 'Why microbiologists care: a major cause of pneumonia, meningitis and ear infections; vaccines target its capsule types.',
    gram: 'Gram-positive', shape: 'Lancet-shaped diplococci'
  },
  {
    name: 'Ophiocordyceps unilateralis', kind: 'Fungus', emoji: '🐜',
    hook: 'The real "zombie ant" fungus.',
    facts: [
      'Infects carpenter ants and changes their behavior.',
      'Infected ants climb plants and clamp their jaws onto a leaf vein.',
      'A fruiting stalk then grows out of the ant\'s head and drops spores on ants below.'
    ],
    why: 'Why microbiologists care: a model for how parasites manipulate host behavior.',
    gram: '', shape: 'Filamentous fungus'
  },
  {
    name: 'Bacteroides thetaiotaomicron', kind: 'Bacterium', emoji: '🥦',
    hook: 'Your gut\'s fiber-digesting specialist.',
    facts: [
      'A strict anaerobe common in the human colon.',
      'Its genome encodes a huge toolkit of enzymes for breaking down polysaccharides.',
      'Ferments fiber into short-chain fatty acids that your colon cells use.'
    ],
    why: 'Why microbiologists care: a model for how gut microbes digest fiber and interact with the host.',
    gram: 'Gram-negative', shape: 'Rod'
  },
  {
    name: 'Influenza A virus', kind: 'Virus', emoji: '🤧',
    hook: 'Shuffles its genome like a deck of cards.',
    facts: [
      'Subtypes are named for surface proteins hemagglutinin (H) and neuraminidase (N), e.g. H1N1.',
      'Small mutations (antigenic drift) are why the flu vaccine is updated every year.',
      'Swapping whole segments between strains (antigenic shift) can create pandemic viruses.'
    ],
    why: 'Why microbiologists care: causes seasonal epidemics and pandemics like 1918; oseltamivir blocks neuraminidase.',
    gram: '', shape: 'Enveloped; segmented ssRNA(-) genome (8 segments)'
  },
  {
    name: 'Prometheoarchaeum syntrophicum', kind: 'Archaeon', emoji: '🔭',
    hook: 'One of our closest living prokaryotic relatives.',
    facts: [
      'The first Asgard archaeon grown in the lab, from deep-sea sediment off Japan.',
      'It grows so slowly that culturing it took over a decade.',
      'Grows long, branching protrusions and has genes once thought unique to eukaryotes.'
    ],
    why: 'Why microbiologists care: Asgard archaea are key clues to how eukaryotic cells evolved.',
    gram: '', shape: 'Small cocci with long branching protrusions'
  },
  {
    name: 'Pseudomonas aeruginosa', kind: 'Bacterium', emoji: '🟢',
    hook: 'A blue-green, grape-scented survivor.',
    facts: [
      'Makes the blue-green pigment pyocyanin; cultures smell grape-like.',
      'Uses quorum sensing to coordinate virulence and biofilms.',
      'Thrives in moist places like sinks, hot tubs and contact lens cases.'
    ],
    why: 'Why microbiologists care: causes chronic lung infections in cystic fibrosis and resists many antibiotics.',
    gram: 'Gram-negative', shape: 'Rod'
  },
  {
    name: 'Physarum polycephalum', kind: 'Protist', emoji: '🗺️',
    hook: 'A brainless slime mold that solves mazes.',
    facts: [
      'Its plasmodium is one giant cell with many nuclei.',
      'Finds the shortest path through a maze to reach food.',
      'With oats placed like cities, it grew a network resembling the Tokyo rail system.'
    ],
    why: 'Why microbiologists care: used to study cytoplasmic streaming, decision-making without a brain, and network design.',
    gram: '', shape: 'Giant multinucleate plasmodium'
  },
  {
    name: 'Aliivibrio fischeri', kind: 'Bacterium', emoji: '🦑',
    hook: 'Glows only when enough friends are around.',
    facts: [
      'Makes light using luciferase encoded by its lux genes.',
      'Lives in the light organ of the Hawaiian bobtail squid, hiding the squid\'s shadow from below.',
      'Only glows at high cell density, which led to the discovery of quorum sensing.'
    ],
    why: 'Why microbiologists care: the founding model for quorum sensing, now a target for blocking pathogen virulence.',
    gram: 'Gram-negative', shape: 'Curved rod'
  },
  {
    name: 'Aspergillus niger', kind: 'Fungus', emoji: '🧅',
    hook: 'The black mold on old onions flavors your soda.',
    facts: [
      'The black mold often seen on onions.',
      'The main industrial producer of citric acid for foods and drinks.',
      'Secretes large amounts of enzymes into its surroundings.'
    ],
    why: 'Why microbiologists care: a biotech workhorse for organic acids and industrial enzymes.',
    gram: '', shape: 'Filamentous mold with black spores'
  },
  {
    name: 'Treponema pallidum', kind: 'Bacterium', emoji: '🌀',
    hook: 'A corkscrew too thin to see with normal stains.',
    facts: [
      'Causes syphilis, which moves through primary, secondary, latent and tertiary stages.',
      'Seen with dark-field microscopy because it is too thin for regular stains.',
      'Extremely hard to grow outside a host.'
    ],
    why: 'Why microbiologists care: still curable with penicillin, yet cases, including congenital syphilis, have been rising.',
    gram: 'Gram-negative type wall (too thin to Gram stain)', shape: 'Tightly coiled spirochete'
  },
  {
    name: 'Chlamydomonas reinhardtii', kind: 'Protist', emoji: '🌱',
    hook: 'A green alga whose light-sensing protein lets scientists control neurons with light.',
    facts: [
      'A single-celled green alga with one large cup-shaped chloroplast.',
      'Swims with two flagella and steers toward light using an eyespot.',
      'Its light-gated ion channels are called channelrhodopsins.'
    ],
    why: 'Why microbiologists care: channelrhodopsin launched optogenetics; it is also a model for cilia and ciliopathies.',
    gram: '', shape: 'Single cell with two flagella'
  },
  {
    name: 'Bacillus subtilis', kind: 'Bacterium', emoji: '🌾',
    hook: 'A soil bacterium that hits pause by turning into a spore.',
    facts: [
      'A common soil bacterium; a variety of it ferments soybeans into natto.',
      'Forms an endospore when starved, a model for cell differentiation.',
      'Naturally takes up DNA from its surroundings (natural competence).'
    ],
    why: 'Why microbiologists care: the Gram-positive model organism and an industrial producer of enzymes like detergent proteases.',
    gram: 'Gram-positive', shape: 'Rod; forms endospores'
  },
  {
    name: 'Batrachochytrium dendrobatidis', kind: 'Fungus', emoji: '🐸',
    hook: 'A fungus behind one of the worst wildlife disease crises ever recorded.',
    facts: [
      'Infects the keratin in amphibian skin, disrupting water and electrolyte balance.',
      'Spreads by swimming zoospores with a flagellum.',
      'Linked to declines and extinctions of many frog species worldwide.'
    ],
    why: 'Why microbiologists care: a case study in emerging infectious disease and global pathogen spread.',
    gram: '', shape: 'Chytrid with flagellated zoospores'
  },
  {
    name: 'Cutibacterium acnes', kind: 'Bacterium', emoji: '🪞',
    hook: 'Lives in your pores and feeds on skin oil.',
    facts: [
      'Lives deep in hair follicles and oil glands, feeding on sebum.',
      'Prefers low oxygen but tolerates air.',
      'Formerly named Propionibacterium acnes.'
    ],
    why: 'Why microbiologists care: involved in acne and in infections of implants such as shoulder replacements.',
    gram: 'Gram-positive', shape: 'Pleomorphic rod'
  },
  {
    name: 'Tobacco mosaic virus', kind: 'Virus', emoji: '🍃',
    hook: 'The very first virus ever discovered.',
    facts: [
      'Discovered in the 1890s because it passed through filters that trapped bacteria.',
      'Wendell Stanley crystallized it in 1935.',
      'Its RNA and coat protein self-assemble into infectious virus in a test tube.'
    ],
    why: 'Why microbiologists care: it founded virology and is still a model for virus assembly and nanotechnology.',
    gram: '', shape: 'Rod-shaped helical capsid; ssRNA(+)'
  },
  {
    name: 'Prochlorococcus marinus', kind: 'Bacterium', emoji: '🌊',
    hook: 'Probably the most abundant photosynthetic organism on Earth, discovered only in the 1980s.',
    facts: [
      'A marine cyanobacterium and one of the smallest photosynthetic cells known.',
      'Thought to be the most abundant photosynthetic organism on the planet.',
      'Went unnoticed until the late 1980s despite filling the oceans.'
    ],
    why: 'Why microbiologists care: a major contributor to ocean carbon fixation and oxygen production.',
    gram: 'Gram-negative', shape: 'Tiny cocci'
  }
];
