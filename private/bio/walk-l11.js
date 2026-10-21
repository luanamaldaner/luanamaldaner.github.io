export default [
  {
    title: 'What this lecture is about',
    say: [
      'Almost everything you do is muscle: walking, talking, breathing, even your heartbeat. This lecture zooms all the way into a muscle cell to see how it makes force, and then back out to how muscles are built for power or endurance.',
      'The plan: how skeletal muscle is built, the sliding filament theory (how it shortens), the proteins and the Ca²⁺ switch that start and stop it, where the ATP comes from, red vs white fibers and training, and finally the two other kinds of muscle: cardiac and smooth.',
    ],
    takeaway: 'Muscle contraction = developing mechanical force, by proteins pulling on each other over and over.',
  },
  {
    title: 'Muscle fibers: giant cells with many nuclei',
    scene: 'l11-structure', from: 0,
    say: [
      'Skeletal muscle is the kind attached to the bones of your skeleton (by tendons, tough cords of connective tissue). It powers walking, flying, swimming and so on. One muscle is many muscle fibers bundled together by connective tissue.',
      'Watch the zoom: a single muscle fiber is ONE cell, but a huge one, with many nuclei along its edge. That’s called multinucleate. It happens because the fiber forms when many embryonic muscle cells (cells in the developing embryo) fuse into one.',
    ],
    takeaway: 'Muscle → bundles of fibers; each fiber is one big multinucleate cell made by fusion.',
    remember: 'Think of a rope: the muscle is the rope, fibers are the cables in it, myofibrils are the wires in each cable, and sarcomeres are the links in each wire. Big to small: Muscle → Fiber → Myofibril → Sarcomere.',
    check: {
      q: 'Why does a skeletal muscle fiber have many nuclei?',
      a: 'It forms when many embryonic muscle cells fuse together',
      o: ['It divides constantly but never splits apart', 'Its nuclei come from nearby nerve cells', 'It actually has no nucleus'],
      why: 'Skeletal muscle fibers are large multinucleate cells formed by the fusion of many embryonic muscle cells.',
    },
  },
  {
    title: 'Myofibrils and sarcomeres',
    scene: 'l11-structure', from: 6,
    say: [
      'Each muscle fiber is packed with myofibrils: long bundles of two contractile proteins (proteins that make movement), actin and myosin, arranged as filaments. Actin makes the thin filaments; myosin makes the thick filaments.',
      'Along each myofibril the filaments repeat in units called sarcomeres. Watch the last zoom: thin actin hangs from the Z lines at each end, and thick myosin sits in the middle. Those neat repeats are why skeletal muscle looks striped (striated) under a microscope.',
    ],
    takeaway: 'Fiber → myofibrils → repeating sarcomeres of thin actin and thick myosin.',
  },
  {
    title: 'Labeling the sarcomere',
    scene: 'l11-sarcomere', from: 0,
    say: [
      'Each sarcomere starts and ends with a Z line, where the actin filaments attach. The myosin filaments extend out from the M band (also called the M line) in the center.',
      'Now the bands. The A band is the whole length of the myosin filaments, so it looks dark. The I band is the part around each Z line with only actin (no myosin), and the H zone is the middle part with only myosin (no actin). With no overlap there, the I band and H zone look light. Be ready to label all five on a figure.',
    ],
    takeaway: 'Z line = actin anchor at each end; M line = myosin anchor in the middle; A band = myosin length; I band = actin only; H zone = myosin only.',
    remember: 'dArk = A band, lIght = I band. The H zone is the “Hole” in the middle where actin doesn’t reach.',
    check: {
      q: 'Which region contains ONLY thin (actin) filaments?',
      a: 'I band',
      o: ['A band', 'H zone', 'M band'],
      why: 'The I band surrounds the Z line and has actin but no myosin. The H zone is myosin only.',
    },
  },
  {
    title: 'Sliding filaments: what shortens',
    scene: 'l11-sarcomere', from: 4.6,
    say: [
      'The sliding filament theory is the current explanation of how muscle contracts. Watch: the actin and myosin filaments slide past each other, so they overlap more, and the sarcomere shortens. Neither filament gets any shorter itself.',
      'So what shortens? The sarcomere (the Z lines get closer together), the H zone (the actin ends get closer together) and the I band (the gap between the myosin and the Z line gets smaller). Why doesn’t the A band change? Because the A band IS the length of the myosin filaments, and myosin doesn’t change length.',
    ],
    takeaway: 'Filaments slide, they don’t shrink: sarcomere, I band and H zone shorten; the A band stays the same.',
    remember: 'H-I-Z shrink: H zone, I band, Z-to-Z distance. The A band is Always the same.',
    check: {
      q: 'During contraction, why does the A band stay the same length?',
      a: 'It is the length of the myosin filaments, which don’t shorten',
      o: ['Actin filaments get longer to make up for it', 'The A band has no filaments in it', 'Z lines stay where they are'],
      why: 'Filaments slide past each other but keep their own length; the A band matches the myosin length.',
    },
  },
  {
    title: 'Muscle cells are excitable',
    scene: 'l11-excite', from: 0,
    say: [
      'What is special about muscle cells? Like neurons, they’re excitable: their membranes can make and conduct action potentials (electrical impulses). And they contract, which other cells can’t do like this.',
      'Each muscle fiber is touched by the axon of a motor neuron (a neuron that carries commands to muscles, from Lecture 8) at a neuromuscular junction. Watch the signal race down the axon. When a nerve impulse arrives, the axon releases a neurotransmitter (acetylcholine) and an action potential starts in the muscle fiber’s own membrane. That’s called excitation.',
    ],
    takeaway: 'Nerve impulse at the neuromuscular junction → action potential in the muscle fiber membrane.',
    check: {
      q: 'What does “muscle cells are excitable” mean?',
      a: 'Their membranes can generate and conduct action potentials',
      o: ['They divide quickly when stimulated', 'They can make their own ATP without food', 'They release hormones into the blood'],
      why: 'Excitable cells (neurons and muscle cells) make and pass along electrical impulses.',
    },
  },
  {
    title: 'T tubules and the SR: where the Ca²⁺ comes from',
    scene: 'l11-excite', from: 3.8,
    say: [
      'Watch the action potential spread along the fiber membrane and dive down the T tubules (tunnels of the cell membrane that reach deep into the fiber). That way the signal reaches every myofibril at once, even in the middle of a thick fiber.',
      'Wrapped around every myofibril is the sarcoplasmic reticulum (SR), a separate membrane sleeve that stores Ca²⁺ (calcium ions). When the action potential passes by in the T tubules, the SR releases its Ca²⁺ into the sarcoplasm (the muscle cell’s cytoplasm). Watch the gold Ca²⁺ flood the myofibrils.',
    ],
    takeaway: 'The action potential travels down T tubules → the SR releases its stored Ca²⁺.',
    remember: 'The path is Nerve → Membrane → T tubules → SR → Ca²⁺. Think of the T tubules as the Tunnels that carry the message inside, and the SR as the Ca²⁺ Storage Room.',
    check: {
      q: 'What is the direct source of the Ca²⁺ that starts contraction?',
      a: 'The sarcoplasmic reticulum',
      o: ['The motor neuron', 'The T tubules themselves', 'The mitochondria'],
      why: 'The SR stores Ca²⁺ and releases it when an action potential arrives through the T tubules.',
    },
  },
  {
    title: 'The lock and key: tropomyosin, troponin and Ca²⁺',
    scene: 'l11-crossbridge', from: 0, vars: { ca: 'on' },
    say: [
      'Zoom in on one thin filament. Actin filaments are two twisted chains of actin monomers (single actin units, the beads). The protein tropomyosin (yellow) twists along the actin and covers the myosin-binding sites. Molecules of troponin (red) hold the tropomyosin in place.',
      'Myosin looks different: each myosin molecule is two polypeptide chains (protein chains) coiled together, ending in a globular (round) head. A thick filament is many myosin molecules bundled together with their heads sticking out the sides. While the sites are covered, the head can’t grab actin, so nothing happens.',
      'Now watch the gold Ca²⁺ ions arrive and bind to troponin. Troponin changes its shape (a conformation change), which releases tropomyosin and moves it off the binding sites. Watch the sites light up: now a myosin head can bind actin. A myosin head bound to actin is called a cross-bridge. Flip the toggle to “No Ca²⁺” to see the sites stay locked.',
    ],
    takeaway: 'Ca²⁺ binds troponin → tropomyosin moves off the binding sites → cross-bridges can form.',
    remember: 'Tropomyosin is the door covering the keyhole, troponin is the lock on that door, and Ca²⁺ is the key. Key (Ca²⁺) turns the lock (troponin), the door (tropomyosin) swings open.',
    check: {
      q: 'What does Ca²⁺ bind to in order to start contraction?',
      a: 'Troponin',
      o: ['Tropomyosin', 'Myosin', 'Actin directly'],
      why: 'Ca²⁺ binds troponin, which then shifts tropomyosin off the myosin-binding sites.',
    },
  },
  {
    title: 'The cross-bridge cycle and ATP',
    scene: 'l11-crossbridge', from: 4.1, vars: { ca: 'on' },
    say: [
      'Watch one cycle. ① The myosin head binds actin (a cross-bridge). ② It changes shape and pulls the actin toward the M band, like an oar in a rowing stroke (the power stroke). ③ A new ATP binds the head and it lets go of actin. ④ The head splits the ATP (hydrolysis, into ADP + Pᵢ), and the released energy straightens it back out (re-cocks it), ready to grab again.',
      'As long as Ca²⁺ is around and ATP is available, the cycle repeats over and over, with thousands of heads pulling, and the filaments slide. Fun fact: without ATP, heads can’t let go, which is why muscles stiffen after death (rigor mortis).',
    ],
    takeaway: 'Bind, pull toward the M band, ATP binds and releases, ATP is split and re-cocks. Repeat while Ca²⁺ and ATP last.',
    remember: 'Grab, Row, Release, Reload. ATP does the Release (binding it) and the Reload (splitting it). No ATP, no release: rigor mortis.',
    check: {
      q: 'What does ATP do in the cross-bridge cycle?',
      a: 'It lets the myosin head detach from actin and re-cock for the next stroke',
      o: ['It binds troponin to move tropomyosin', 'It carries the action potential down the T tubules', 'It makes the A band shorter'],
      why: 'ATP binding releases the head from actin; hydrolyzing ATP supplies the energy to re-cock it.',
    },
  },
  {
    title: 'How contraction stops',
    scene: 'l11-crossbridge', from: 13.8, vars: { ca: 'on' },
    say: [
      'When excitation ends (the motor neuron stops firing), calcium pumps move Ca²⁺ out of the sarcoplasm and back into the SR, using ATP. Watch the Ca²⁺ fly back.',
      'Troponin and tropomyosin return to their original positions, tropomyosin blocks the binding sites again, no cross-bridges can form, and the contraction stops. The muscle relaxes.',
    ],
    takeaway: 'Ca²⁺ pumped back into the SR → tropomyosin covers the sites → contraction stops.',
  },
  {
    title: 'Antagonistic pairs: muscles only pull',
    say: [
      'A muscle can only contract and pull; it can’t push itself longer again. So skeletal muscles work in antagonistic pairs: two muscles (or groups) that pull a bone in opposite directions across a joint.',
      'Your biceps contracts to bend your elbow, while your triceps relaxes. To straighten the arm, the triceps contracts and pulls, which also stretches the relaxed biceps back out. The purpose: every movement can be reversed, and the pair working together gives smooth, controlled motion.',
    ],
    takeaway: 'Muscles only pull, so they come in opposing (antagonistic) pairs, like biceps and triceps.',
    check: {
      q: 'Why are skeletal muscles arranged in antagonistic pairs?',
      a: 'A muscle can only pull, so a second muscle is needed to move the bone back',
      o: ['Each muscle can push and pull, so pairs double the force', 'One muscle makes ATP for the other', 'Pairs share one motor neuron'],
      why: 'Contraction only shortens a muscle; the opposing muscle pulls the joint the other way and re-stretches it.',
    },
  },
  {
    title: 'Three ways to make ATP',
    scene: 'l11-energy', from: 0,
    say: [
      'Contraction runs on ATP, and muscle cells have three systems for supplying it. The immediate system uses ATP already in the cell (plus creatine phosphate, a quick backup that recharges ADP). The glycolytic system makes ATP by glycolysis (breaking down glucose without O₂). The oxidative system makes ATP in mitochondria using O₂.',
      'Watch the graph. In power output: immediate is highest, glycolytic is in the middle, oxidative is lowest. In endurance (how long it lasts), it’s the opposite order: oxidative lasts for hours, glycolytic about a minute or two, immediate only seconds. In real exercise, all three work at the same time.',
    ],
    takeaway: 'Power: immediate > glycolytic > oxidative. Endurance: oxidative > glycolytic > immediate.',
    remember: 'I-G-O, like three runners: Immediate = 100 m sprinter (huge power, seconds), Glycolytic = 400 m runner (strong, a minute or two), Oxidative = marathoner (slow, hours). Power goes down the line; endurance goes up.',
    check: {
      q: 'Which ATP system allows the LONGEST effort?',
      a: 'The oxidative system',
      o: ['The immediate system', 'The glycolytic system', 'They all last the same'],
      why: 'Oxidative has the lowest power but the most endurance; the immediate system is the reverse.',
    },
  },
  {
    title: 'Red vs white fibers',
    scene: 'l11-energy', from: 7.6,
    say: [
      'There are two major types of skeletal muscle cells. Slow oxidative cells (slow-twitch, “red”) use the oxidative system. They’re full of myoglobin, a hemoglobin-like protein that makes them red and speeds O₂ into the cell, and they have many mitochondria. They contract and build tension slowly, but keep up low power for a long time.',
      'Fast glycolytic cells (fast-twitch, “white”) have lots of enzymes for anaerobic (no O₂) glycolysis, so ATP is made quickly. They contract quickly and strongly, but tire (fatigue) quickly. They have few mitochondria and no myoglobin. In mammals the two types are mixed in each muscle; in other animals a muscle can be almost all red or all white.',
    ],
    takeaway: 'Red = slow oxidative (myoglobin, many mitochondria, endurance). White = fast glycolytic (fast, powerful, tires quickly).',
    remember: 'Think of a chicken: dark leg meat is red fibers (walking all day), white breast meat is white fibers (short bursts of flapping). Red = Runs long; white = quick burst.',
    check: {
      q: 'Which is true of slow oxidative (red) fibers?',
      a: 'They have lots of myoglobin and many mitochondria',
      o: ['They have no myoglobin and few mitochondria', 'They tire very quickly', 'They rely mainly on anaerobic glycolysis'],
      why: 'Red fibers use the oxidative system: myoglobin brings in O₂ and mitochondria make ATP for long, steady work.',
    },
  },
  {
    title: 'Fish and athletes',
    say: [
      'Fish keep their red and white muscle in separate places. They use red muscle for routine cruising and white muscle for bursts of speed, to catch prey or escape predators. In most fish the red muscle is a thin strip along each side, just under the skin; the rest of the body is white muscle. In tunas the red muscle sits deep inside, near the backbone, where heat exchange keeps it warm (remember the tuna heat trick from Lecture 5), and warm muscle works faster and stronger.',
      'People vary in their proportion of red and white cells. Champion endurance athletes (like long-distance runners) tend to have more red cells; champion sprinters and wrestlers have more white cells. That’s a correlation, though: genes, development, training and choosing a sport you’re good at all play a part.',
    ],
    takeaway: 'Red muscle for cruising and endurance; white muscle for bursts and sprints.',
  },
  {
    title: 'Training changes muscle',
    say: [
      'Skeletal muscle shows phenotypic plasticity: the same body changes its traits to match how it’s used. For example, muscles get bigger when you lift weights.',
      'Resistance exercise (like weightlifting, which makes large forces) increases the amount of actin and myosin, and some cells change from slow oxidative to fast glycolytic. Endurance training (like long-distance running or cycling) increases the number of mitochondria, changes some cells from fast glycolytic to slow oxidative, and stimulates the growth of new capillaries (tiny blood vessels) in the muscle.',
    ],
    takeaway: 'Lifting → more actin and myosin (some red → white). Endurance → more mitochondria and capillaries (some white → red).',
    check: {
      q: 'Which change is expected after months of endurance training?',
      a: 'More mitochondria and more capillaries in the muscle',
      o: ['Many slow oxidative cells turning into fast glycolytic cells', 'Less myoglobin in the muscle', 'Fewer capillaries so more blood stays in the heart'],
      why: 'Endurance training boosts the oxidative machinery: mitochondria, capillaries and some white → red conversion.',
    },
  },
  {
    title: 'Cardiac muscle',
    say: [
      'Cardiac muscle (heart muscle) is like skeletal muscle in one way: it’s striated, with actin and myosin arranged in regular sarcomeres, and it contracts the same sliding-filament way. But its cells are smaller and have just one nucleus each.',
      'Neighboring cardiac cells are joined end to end at intercalated discs, which contain gap junctions (tiny channels that connect the inside of two cells, so their sarcoplasm is continuous). An action potential flows straight from cell to cell, so the heart contracts in a coordinated way. Some special cardiac cells, the pacemaker cells, start action potentials on their own, without a nerve telling them to. They make up the SA node, the heart’s built-in pacemaker from Lecture 5.',
    ],
    takeaway: 'Cardiac = striated, one nucleus per cell, intercalated discs with gap junctions; pacemaker cells set the beat.',
    remember: 'Cardiac cells hold hands: intercalated discs with gap junctions let the signal pass hand to hand, so the whole heart squeezes together. The pacemaker cells are the drummer that sets the beat.',
    check: {
      q: 'How is cardiac muscle DIFFERENT from skeletal muscle?',
      a: 'Its cells are smaller, have one nucleus and are linked by gap junctions',
      o: ['It isn’t striated at all', 'It has no actin or myosin', 'Each cell has many nuclei from fusion'],
      why: 'Both are striated, but cardiac cells are small, single-nucleus and electrically coupled at intercalated discs.',
    },
  },
  {
    title: 'Smooth muscle',
    say: [
      'Smooth muscle is not striated: its actin and myosin filaments aren’t lined up in regular sarcomeres, so there are no clear stripes. That’s where the name “smooth” comes from.',
      'It’s found in most internal organs and in the walls of blood vessels (for example, the gut wall that squeezes food along by peristalsis in Lecture 7). Smooth muscle cells are arranged in sheets and are electrically connected by gap junctions, so an action potential in one cell can spread to all the others in the sheet.',
    ],
    takeaway: 'Smooth = no stripes, sheets of cells linked by gap junctions, in internal organs and blood vessel walls.',
  },
  {
    title: 'Putting it together',
    say: [
      'Skeletal muscle: fibers (big multinucleate cells) → myofibrils → sarcomeres. Thin actin slides past thick myosin; the sarcomere, I band and H zone shorten while the A band stays the same. Motor neuron → neuromuscular junction → action potential along the membrane and down T tubules → SR releases Ca²⁺ → Ca²⁺ binds troponin → tropomyosin moves → cross-bridges pull toward the M band, with ATP releasing and re-cocking the heads → pumps return Ca²⁺ to the SR and it stops. Muscles only pull, so they work in antagonistic pairs.',
      'ATP comes from immediate (most power), glycolytic and oxidative (most endurance) systems. Red slow oxidative vs white fast glycolytic fibers, and training reshapes them. Comparing the three muscle types: skeletal and cardiac are striated, smooth is not; skeletal cells have many nuclei, cardiac cells one; cardiac and smooth cells are linked by gap junctions, and cardiac has its own pacemaker cells.',
    ],
    takeaway: 'Nerve → Ca²⁺ → cross-bridges + ATP → sliding filaments → force.',
    check: {
      q: 'Which feature do cardiac and smooth muscle share, but skeletal muscle fibers lack?',
      a: 'Cells electrically connected by gap junctions',
      o: ['Striations from regular sarcomeres', 'Many nuclei per cell', 'No actin or myosin'],
      why: 'Cardiac (at intercalated discs) and smooth muscle sheets pass action potentials cell to cell through gap junctions; each skeletal fiber is triggered by its own motor neuron.',
    },
  },
];
