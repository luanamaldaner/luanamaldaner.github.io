// Study questions · Lecture 11 · Muscle and movement
// The sheet says “Chapter 34”, but the muscle material is Chapter 33 (33.1–33.2) in the slides.
// Model answers grounded in the lecture slide text, in the same order as the professor’s sheet.
export default [
  {
    q: 'What is special about muscle cells, compared with other cells in the body?',
    a: 'Muscle cells can contract: they develop mechanical force using cycles of interaction between two proteins, actin and myosin. They’re also excitable, meaning their membranes can generate and conduct action potentials (electrical impulses), like nerve cells. Skeletal muscle cells (called muscle fibers) are also unusually large and multinucleate (many nuclei), because each one forms by the fusion of many embryonic cells.',
  },
  {
    q: 'What are the two contractile proteins that make up the filaments of a skeletal muscle sarcomere, and how are they arranged to create the Z line, H zone, I band, and M band. Be able to label these on a figure.',
    a: 'Actin makes the thin filaments and myosin makes the thick filaments. A sarcomere is the repeating unit of a myofibril:\n• Z line: the border at each end of the sarcomere; actin filaments attach here.\n• M band: the line in the center, where the myosin filaments are anchored and extend out from.\n• I band: the light region on either side of a Z line with actin only (no myosin overlap).\n• H zone: the light region in the center with myosin only (no actin overlap).\n(The dark A band is the full length of the myosin filaments.) When the muscle contracts, the filaments slide past each other: the Z lines move closer and the H zone and I band shrink, but the A band stays the same because the myosin filaments don’t change length.',
  },
  {
    q: 'During muscle contraction, what are the roles of troponin, tropomyosin, calcium, actin, and myosin? Where and how does ATP come into play?',
    a: '• Tropomyosin: a protein wrapped around the actin filament that blocks myosin’s binding sites at rest.\n• Troponin: holds tropomyosin in place.\n• Calcium (Ca²⁺): binds troponin, which changes shape and moves tropomyosin out of the way, exposing the binding sites.\n• Myosin: its globular heads bind actin (forming cross-bridges), then bend to pull the actin toward the M band in a rowing motion.\n• Actin: the thin filament that gets pulled, so the filaments slide and the sarcomere shortens.\nATP: the myosin head uses ATP to let go of actin and “re-cock” (unbend) so it can grab again and repeat the cycle; as long as Ca²⁺ and ATP are around, the cycle keeps going. ATP also powers the calcium pumps that remove Ca²⁺ when excitation ends.',
  },
  {
    q: 'Explain what is meant by “muscle cells are excitable”.',
    a: 'It means their cell membranes can generate and conduct action potentials (electrical impulses). Each muscle fiber touches the axon of a motor neuron at a neuromuscular junction. When a nerve impulse arrives there, it starts an action potential in the muscle fiber’s membrane (excitation), which spreads through the cell and triggers contraction.',
  },
  {
    q: 'What is the source of the Ca2+ that initiates muscle contraction, and what causes the Ca2+ to become available?',
    a: 'The Ca²⁺ comes from the sarcoplasmic reticulum, a membrane system that wraps like a sleeve around every myofibril and stores calcium. A nerve impulse at the neuromuscular junction starts an action potential in the muscle fiber membrane; it spreads deep into the fiber through T tubules (inward folds of the membrane) and triggers the sarcoplasmic reticulum to release Ca²⁺ into the sarcoplasm (the muscle cell’s cytoplasm). When excitation ends, calcium pumps move the Ca²⁺ back and contraction stops.',
  },
  {
    q: 'With regards to muscle contractions, what are antagonistic pairs, and what is their purpose?',
    a: 'Muscles can only pull (contract), not push. So skeletal muscles work in antagonistic pairs: two muscles that move a joint in opposite directions. For example, the biceps bends (flexes) your elbow and the triceps straightens (extends) it; when one contracts, the other relaxes and gets stretched. This lets the body move a bone back and forth and control movement precisely. (Not covered in the site’s notes; check your slides.)',
  },
  {
    q: 'Briefly explain the differences between the immediate system, the glycolytic system, and the oxidative system of providing ATP for muscle contraction. Compare speed, endurance, types of muscle (red or white), and functions of the muscle fibers for certain types of [human] performance.',
    a: 'Power output ranks immediate > glycolytic > oxidative; endurance ranks in the opposite order.\n• Immediate system: ATP already stored in the cell plus creatine phosphate; the highest power but only lasts seconds (a sprint start, a jump, one heavy lift).\n• Glycolytic system: anaerobic glycolysis (no O₂ needed) makes ATP fast; intermediate power for about a minute or two (like a 400 m run). Used by fast glycolytic (“white”, fast-twitch) fibers: few mitochondria, no myoglobin, contract fast but tire fast.\n• Oxidative system: aerobic metabolism in mitochondria using O₂; lowest power but lasts a long time (marathons, cycling). Used by slow oxidative (“red”, slow-twitch) fibers: many mitochondria and lots of myoglobin (a red, hemoglobin-like protein that speeds O₂ into the cell).\nChampion endurance athletes tend to have more red fibers; sprinters and wrestlers more white fibers. (Not covered in the site’s notes; check your slides.)',
  },
  {
    q: 'Explain what is meant by phenotypic plasticity and what types of changes might be expected in human muscles that undergo endurance or strength/resistance training.',
    a: 'Phenotypic plasticity means the same body can change its traits in response to how it’s used; muscles get larger with weight lifting, for example.\n• Resistance (strength) training: the amount of actin and myosin increases, and some fibers switch from slow oxidative to fast glycolytic.\n• Endurance training (long-distance running, cycling): cells make more mitochondria, some fibers switch from fast glycolytic to slow oxidative, and more capillaries grow in the muscle.',
  },
  {
    q: 'What are some similarities and differences between cardiac and skeletal muscle? What are pacemaker cells?',
    a: 'Similarities: both are striated (striped), with actin and myosin arranged in regular sarcomeres, and both contract by the same sliding-filament mechanism.\nDifferences: cardiac cells are smaller and have one nucleus (skeletal fibers are huge and multinucleate), and cardiac cells are electrically connected by gap junctions in intercalated discs, so their sarcoplasm is continuous and the heart contracts in a coordinated wave. Skeletal muscle only contracts when a motor neuron tells it to.\nPacemaker cells are specialized heart muscle cells that generate action potentials on their own, rhythmically, without a nerve signal; they set the heartbeat, and the signal spreads to the other cells through the gap junctions. (Not covered in the site’s notes; check your slides.)',
  },
  {
    q: 'What are some similarities and differences between smooth muscle, skeletal muscle, and cardiac muscle?',
    a: 'All three use actin and myosin to contract.\n• Skeletal: striated, attached to bones, large multinucleate fibers, controlled voluntarily via motor neurons.\n• Cardiac: striated, in the heart, smaller cells with one nucleus linked by gap junctions in intercalated discs, involuntary.\n• Smooth: not striated (filaments aren’t regularly arranged, hence “smooth”), found in most internal organs and blood vessel walls, arranged in sheets linked by gap junctions so an action potential in one cell spreads to the whole sheet, involuntary.\nCardiac and smooth muscle share gap-junction connections; cardiac and skeletal share striations. (Not covered in the site’s notes; check your slides.)',
  },
];
