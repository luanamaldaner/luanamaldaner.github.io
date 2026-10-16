export default [
  {
    title: 'What this lecture is about',
    say: [
      'Every thought, every twitch and every change in your heartbeat runs on tiny electrical signals in nerve cells (neurons). This lecture explains how a neuron makes that signal and passes it on.',
      'Here’s the plan: the layout (brain, spinal cord, nerves), the neuron and its helper cells, then the signal step by step: the resting voltage, the action potential (the nerve “spike”), faster travel with myelin, the synapse (where neurons talk), and finally the “fight or flight” vs “rest and digest” systems.',
    ],
    takeaway: 'Neurons send messages by controlling where charged particles (ions) like Na⁺ and K⁺ are.',
  },
  {
    title: 'The map: CNS and PNS',
    say: [
      'The central nervous system (CNS) is the brain and spinal cord, the “headquarters.” The peripheral nervous system (PNS) is everything else, the wiring out to the body. In the PNS, neurons are bundled into nerves, each holding hundreds to thousands of neurons, like wires in a cable.',
      'Direction matters. Afferent neurons carry signals TOWARD the CNS (sensory neurons, from sense organs like skin and eyes). Efferent neurons carry signals AWAY from the CNS (motor neurons, which tell muscles to contract). Memory trick: Afferent Arrives, Efferent Exits.',
    ],
    takeaway: 'CNS = brain + spinal cord; afferent = toward the CNS, efferent = away from it.',
    check: {
      q: 'A neuron carrying touch information from your finger to your spinal cord is…',
      a: 'Afferent (sensory)',
      o: ['Efferent (motor)', 'An interneuron in the PNS', 'A glial cell'],
      why: 'Signals traveling toward the CNS are afferent, and sensory neurons are afferent.',
    },
  },
  {
    title: 'The four parts of a neuron',
    scene: 'l8-neuron', from: 0,
    say: [
      'Neurons are excitable, meaning they can make and send electrical impulses called action potentials. Watch the signal travel through the four parts as each label lights up.',
      'Dendrites (short branches, like antennas) carry signals toward the cell body. The cell body (with the nucleus and organelles) adds up all the incoming signals. The axon (a long cable) carries the action potential away, sometimes very far. The axon terminals at the end meet the next cell at a synapse (the meeting point). The sending cell is presynaptic (“before the synapse”); the receiving cell is postsynaptic (“after the synapse”).',
    ],
    takeaway: 'Dendrites → cell body → axon → axon terminals → synapse.',
    check: {
      q: 'Which part of a neuron carries action potentials AWAY from the cell body?',
      a: 'Axon',
      o: ['Dendrite', 'Nucleus', 'Postsynaptic cell'],
      why: 'Dendrites bring signals in; the axon carries action potentials out to the terminals.',
    },
  },
  {
    title: 'Glia: the support crew',
    scene: 'l8-neuron', from: 5,
    say: [
      'Glial cells (glia) are not neurons and can’t fire signals, but neurons can’t work without them. They guide growing neurons to the right place, feed them, control the fluid around them, help fight infection and help signals travel. Astrocytes (star-shaped glia) are the most common kind.',
      'Watch the wrapped-up axon here. Oligodendrocytes (in the brain and spinal cord) and Schwann cells (in the PNS) wrap axons in myelin, a fatty insulating layer, like the plastic coating on a wire. Myelin makes signals travel faster, and it looks white, which is why those areas are called white matter.',
    ],
    takeaway: 'Oligodendrocytes = myelin in the CNS, Schwann cells = myelin in the PNS; myelin makes signals faster.',
    check: {
      q: 'Which cells make myelin in the brain and spinal cord?',
      a: 'Oligodendrocytes',
      o: ['Schwann cells', 'Astrocytes', 'Motor neurons'],
      why: 'Oligodendrocytes insulate CNS axons; Schwann cells do it in the PNS.',
    },
  },
  {
    title: 'Resting potential: the pump',
    scene: 'l8-rest', from: 0,
    say: [
      'A resting neuron is polarized: the inside is more negative than the outside, about −60 to −70 mV (millivolts, a tiny voltage). This is the resting potential. Only a few charges need to move to change it quickly.',
      'Reason #1 is the Na⁺/K⁺ pump (also called Na⁺-K⁺ ATPase). Watch it: it spends energy (ATP) to throw 3 sodium (Na⁺) out for every 2 potassium (K⁺) it brings in. That leaves more + charge outside. It also sets up the concentration gradients (lots of Na⁺ outside, lots of K⁺ inside) that the neuron uses later.',
    ],
    takeaway: 'The Na⁺/K⁺ pump uses ATP to move 3 Na⁺ out and 2 K⁺ in.',
  },
  {
    title: 'Resting potential: K⁺ leaks out',
    scene: 'l8-rest', from: 4,
    say: [
      'Reason #2: leak channels (little holes that are always open). A little Na⁺ leaks in, but much more K⁺ leaks out. Watch each K⁺ that leaves take a + charge with it, so the inside gets even more negative.',
      'Ions get pulled two ways: by concentration (from crowded to less crowded) and by charge (opposites attract). The voltage where those two pulls cancel out is that ion’s equilibrium potential: −90 mV for K⁺ and +60 mV for Na⁺. Since the membrane leaks much more K⁺, the cell rests close to K⁺’s number, around −70 mV.',
    ],
    takeaway: 'Rest ≈ −70 mV, near K⁺’s equilibrium potential (−90), because K⁺ leaks out much more than Na⁺ leaks in.',
    check: {
      q: 'Why is the resting potential close to −70 mV instead of +60 mV?',
      a: 'The membrane leaks K⁺ much more than Na⁺',
      o: ['The membrane leaks Na⁺ much more than K⁺', 'The pump moves 3 K⁺ out', 'Neurons have no channels at rest'],
      why: 'K⁺ leaking out wins, so the voltage sits near K⁺’s equilibrium potential.',
    },
  },
  {
    title: 'Gated channels: doors with triggers',
    say: [
      'Most ion channels are gated, like doors that only open with the right trigger. Voltage-gated channels open when the voltage changes. Stretch-gated channels open when the membrane gets pulled. Ligand-gated channels open or close when a specific chemical (a ligand, like a key) sticks to them.',
      'Opening channels changes the voltage. If Na⁺ rushes in, the inside gets less negative; that’s depolarized. If the inside gets more negative than rest, that’s hyperpolarized.',
    ],
    takeaway: 'Channels open by voltage, stretch or ligand; Na⁺ in = depolarize, more negative = hyperpolarize.',
    check: {
      q: 'A channel that opens when a neurotransmitter sticks to it is…',
      a: 'Ligand-gated',
      o: ['Voltage-gated', 'Stretch-gated', 'A leak channel'],
      why: 'Ligand-gated channels respond to a specific chemical binding to them.',
    },
  },
  {
    title: 'Graded potentials: small bumps',
    scene: 'l8-ap', from: 0,
    say: [
      'Signals from other cells open ligand-gated Na⁺ channels. A weak signal lets in a little Na⁺, a strong one lets in more, so the size of the change varies. That’s a graded potential (“graded” = it comes in different sizes).',
      'Watch the graph: at about 1 second there’s a small poke. The voltage bumps up a bit and fades away, because it never reaches threshold (−55 mV, the gold line; the “trigger point”). You can press “Small poke” yourself too.',
    ],
    takeaway: 'Graded potentials vary in size and fade; they only trigger a spike if they reach threshold (−55 mV).',
  },
  {
    title: 'The action potential: all or nothing',
    scene: 'l8-ap', from: 4,
    say: [
      'Now a big poke reaches threshold. Watch: voltage-gated Na⁺ channels fly open, Na⁺ rushes in, and the inside shoots up to about +40 mV. Each Na⁺ channel that opens makes more open. That’s positive feedback (a change that causes more of the same change), like a row of dominoes.',
      'Then the Na⁺ channels shut and lock, K⁺ channels open, K⁺ rushes out, and the voltage falls back down (repolarization, “getting negative again”). K⁺ channels are slow to close, so the voltage briefly dips below rest (hyperpolarization). Every spike is the same size: all or none, like a light switch, never halfway.',
    ],
    takeaway: 'Threshold → Na⁺ in (depolarize) → K⁺ out (repolarize) → brief dip (hyperpolarize).',
    check: {
      q: 'What mainly causes repolarization?',
      a: 'K⁺ flowing out of the cell',
      o: ['Na⁺ flowing into the cell', 'The Na⁺/K⁺ pump alone', 'Ca²⁺ flowing into the cell'],
      why: 'Na⁺ channels lock shut and K⁺ channels open, so K⁺ leaves and the inside turns negative again.',
    },
  },
  {
    title: 'Why the signal only goes one way',
    scene: 'l8-race', from: 3,
    say: [
      'Remember from step 9 that Na⁺ channels lock shut after firing. For a short moment they can’t open again. That’s the refractory period (a “cool-down” time). In step 9’s graph, the too-early third poke did nothing for exactly this reason.',
      'Watch the bottom axon (no myelin): each patch fires the next patch ahead, but the patch just behind is still cooling down, so the signal can only move forward, toward the axon terminals.',
    ],
    takeaway: 'The refractory period keeps the action potential moving one way, toward the terminals.',
  },
  {
    title: 'Myelin: jumping from node to node',
    scene: 'l8-race', from: 0,
    say: [
      'Two axons get the same signal at the same time. Watch which one wins the race. Without myelin (unmyelinated), every bit of membrane has to fire in turn, so the signal crawls.',
      'With myelin, the current zips along under the insulation and only the bare gaps, called nodes of Ranvier, fire. The signal hops node to node. That’s saltatory conduction (from the Latin for “jump”). It’s why myelin, from step 4, makes signals so much faster.',
    ],
    takeaway: 'Myelin → saltatory conduction: the signal jumps between nodes of Ranvier, much faster.',
    check: {
      q: 'Saltatory conduction happens because…',
      a: 'Myelin insulates the axon so only the nodes of Ranvier fire',
      o: ['Dendrites are myelinated', 'Neurotransmitters jump between nodes', 'The axon has no Na⁺ channels'],
      why: 'The signal jumps from node to node, skipping the insulated parts.',
    },
  },
  {
    title: 'The chemical synapse',
    scene: 'l8-synapse', from: 0,
    say: [
      'At a chemical synapse there’s a tiny gap between the cells, the synaptic cleft, that an electrical signal can’t jump. So the message switches to chemicals. Watch the action potential reach the terminal. Then vesicles (tiny bubbles) merge with the membrane and spill out neurotransmitter (chemical messenger).',
      'The neurotransmitter drifts across the gap and sticks to receptors (ligand-gated channels, from step 7) on the postsynaptic (receiving) cell. They open, Na⁺ flows in, and you get a graded potential, an action potential, or another change. Then the neurotransmitter is cleared away.',
    ],
    takeaway: 'Electrical → chemical → electrical: neurotransmitter crosses the cleft and opens ligand-gated channels.',
    check: {
      q: 'Why does a chemical synapse need neurotransmitters?',
      a: 'The action potential cannot cross the synaptic cleft',
      o: ['Axons have no Na⁺ channels', 'Neurotransmitters travel in the blood', 'The postsynaptic cell has no receptors'],
      why: 'The cleft is a gap the electrical signal can’t jump, so a chemical carries the message across.',
    },
  },
  {
    title: 'How the system is organized',
    say: [
      'The CNS is mostly interneurons (neurons that stay inside the CNS and connect other neurons) plus glia. Sensory (afferent) neurons bring information in. Efferent neurons, including motor neurons, carry commands out to effectors (the body parts that respond, like muscles and glands).',
      'The output side splits in two. The somatic nervous system controls skeletal muscle, the muscles you move on purpose (voluntary). The autonomic nervous system (ANS) runs everything automatic, like smooth muscle (in guts and vessels) and cardiac muscle (heart). The vertebrate ANS has three parts: enteric (nerves in the gut wall), sympathetic and parasympathetic.',
    ],
    takeaway: 'Somatic = voluntary skeletal muscle; autonomic = automatic (enteric, sympathetic, parasympathetic).',
    check: {
      q: 'Which system controls cardiac and smooth muscle?',
      a: 'Autonomic nervous system',
      o: ['Somatic nervous system', 'Afferent neurons only', 'Interneurons in the PNS'],
      why: 'The ANS controls everything automatic, which means everything except skeletal muscle.',
    },
  },
  {
    title: 'Fight or flight vs rest and digest',
    scene: 'l8-ans', from: 0, vars: { mode: 'symp' },
    say: [
      'Sympathetic = emergency mode, “fight or flight.” Watch the heart race, pupils open wide, blood pressure rise, and digestion slow down.',
      'Now flip the toggle to Parasympathetic: the opposite, “rest and digest.” The heart slows, blood pressure drops, and digestion speeds up. Think of lying on the couch after a big dinner.',
    ],
    takeaway: 'Sympathetic gets you ready for emergencies and slows digestion; parasympathetic slows the heart and boosts digestion.',
    check: {
      q: 'You are relaxing after a big meal. Which division is in charge?',
      a: 'Parasympathetic',
      o: ['Sympathetic', 'Somatic', 'Afferent'],
      why: 'Rest and digest: slower heart, lower blood pressure, more digestion.',
    },
  },
  {
    title: 'Putting it together',
    say: [
      'A neuron rests at about −70 mV because of the Na⁺/K⁺ pump (3 out, 2 in) and K⁺ leaking out. Incoming signals make small graded potentials. If one reaches −55 mV (threshold), voltage-gated Na⁺ channels fire an all-or-none action potential: Na⁺ rushes in, then K⁺ rushes out.',
      'The refractory period (cool-down) keeps it moving forward, and myelin makes it jump node to node. At the synapse, neurotransmitter carries the message across the gap. Zoom out, and the ANS runs your organs: sympathetic for emergencies, parasympathetic for rest.',
    ],
    takeaway: 'Rest → threshold → spike → travel → synapse → effect.',
    check: {
      q: 'What happens when a neuron reaches threshold (about −55 mV)?',
      a: 'Voltage-gated Na⁺ channels open and an action potential fires',
      o: ['K⁺ leak channels close permanently', 'The Na⁺/K⁺ pump reverses', 'A graded potential fades away'],
      why: 'At threshold, Na⁺ channels open fast and positive feedback drives the spike.',
    },
  },
];
