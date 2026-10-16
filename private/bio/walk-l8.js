export default [
  {
    title: 'What this lecture is about',
    say: [
      'Every thought, every twitch and every heartbeat change runs on tiny electrical signals in nerve cells. This lecture explains how a neuron makes that signal and passes it on.',
      'We start with the layout (brain, spinal cord, nerves), meet the neuron and its helper cells, then build the signal step by step: resting voltage, action potential, faster travel with myelin, the synapse, and finally the "fight or flight" vs "rest and digest" systems.',
    ],
    takeaway: 'Neurons send messages by controlling where ions like Na⁺ and K⁺ are.',
  },
  {
    title: 'The map: CNS and PNS',
    say: [
      'The central nervous system (CNS) is the brain and spinal cord. The peripheral nervous system (PNS) is everything else. In the PNS, neurons are bundled into nerves, each holding hundreds to thousands of neurons, like wires in a cable.',
      'Direction matters. Afferent neurons carry signals TOWARD the CNS (sensory neurons from sense organs). Efferent neurons carry signals AWAY from the CNS (motor neurons tell muscles to contract). Memory trick: Afferent Arrives, Efferent Exits.',
    ],
    takeaway: 'CNS = brain + spinal cord; afferent = toward the CNS, efferent = away.',
    check: {
      q: 'A neuron carrying touch information from your finger to your spinal cord is…',
      a: 'Afferent (sensory)',
      o: ['Efferent (motor)', 'An interneuron in the PNS', 'A glial cell'],
      why: 'Signals traveling toward the CNS are afferent; sensory neurons are afferent.',
    },
  },
  {
    title: 'The four parts of a neuron',
    scene: 'l8-neuron', from: 0,
    say: [
      'Neurons are excitable: they can make and send impulses called action potentials. Watch the signal travel through the four regions as each label lights up.',
      'Dendrites carry signals toward the cell body. The cell body (nucleus and organelles) adds up the inputs. The axon carries the action potential away, sometimes very far. The presynaptic axon terminals contact the next cell at a synapse: the sender is presynaptic, the receiver is postsynaptic.',
    ],
    takeaway: 'Dendrites → cell body → axon → axon terminals → synapse.',
    check: {
      q: 'Which part of a neuron conducts action potentials AWAY from the cell body?',
      a: 'Axon',
      o: ['Dendrite', 'Nucleus', 'Postsynaptic cell'],
      why: 'Dendrites bring signals in; the axon carries action potentials out to the terminals.',
    },
  },
  {
    title: 'Glia: the support crew',
    scene: 'l8-neuron', from: 5,
    say: [
      'Glial cells are not neurons and are not excitable, but they are essential. They guide neurons to their targets during development, feed them, control the fluid around them, help with immunity and help signals travel. Astrocytes are the most common kind.',
      'Watch the insulated axon here. Oligodendrocytes (brain and spinal cord) and Schwann cells (PNS) wrap axons in myelin, an insulating sheath. Myelinated axons conduct faster and look white, which is why we call it white matter.',
    ],
    takeaway: 'Oligodendrocytes = CNS myelin, Schwann cells = PNS myelin; myelin makes signals faster.',
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
      'A resting neuron is polarized: the inside is negative compared to the outside, about −60 to −70 mV. Only a small number of charges have to move to change that quickly.',
      'The first reason is the Na⁺/K⁺ pump (Na⁺-K⁺ ATPase). Watch it: it uses ATP to throw 3 Na⁺ out for every 2 K⁺ it brings in. That leaves more + outside, and it also builds the Na⁺ and K⁺ concentration gradients the neuron will use later.',
    ],
    takeaway: 'The Na⁺/K⁺ pump moves 3 Na⁺ out and 2 K⁺ in, using ATP.',
  },
  {
    title: 'Resting potential: K⁺ leaks out',
    scene: 'l8-rest', from: 4,
    say: [
      'The second reason: leak channels. A little Na⁺ leaks in, but much more K⁺ leaks out. Watch each K⁺ that leaves carry a + charge with it, so the inside gets even more negative.',
      'Ions are pulled by two things: concentration and charge. When those balance, that is the ion’s equilibrium potential: −90 mV for K⁺ and +60 mV for Na⁺. Because the membrane leaks K⁺ much more, the cell rests close to K⁺’s value, around −70 mV.',
    ],
    takeaway: 'Rest ≈ −70 mV, near K⁺’s equilibrium (−90), because K⁺ leaks out much more than Na⁺ leaks in.',
    check: {
      q: 'Why is the resting potential close to −70 mV instead of +60 mV?',
      a: 'The membrane leaks K⁺ much more than Na⁺',
      o: ['The membrane leaks Na⁺ much more than K⁺', 'The pump moves 3 K⁺ out', 'Neurons have no channels at rest'],
      why: 'K⁺ leak dominates, so the voltage sits near K⁺’s equilibrium potential.',
    },
  },
  {
    title: 'Gated channels: doors with triggers',
    say: [
      'Most ion channels are gated, like doors that only open with the right trigger. Voltage-gated channels respond to changes in membrane voltage. Stretch-gated channels respond to the membrane being pulled. Ligand-gated channels open or close when a specific chemical (a ligand) binds.',
      'Opening channels changes the voltage. If Na⁺ rushes in, the inside gets less negative: depolarized. If the inside gets more negative than rest, it is hyperpolarized.',
    ],
    takeaway: 'Channels open by voltage, stretch or ligand; Na⁺ in = depolarize, more negative = hyperpolarize.',
    check: {
      q: 'A channel that opens when a neurotransmitter binds to it is…',
      a: 'Ligand-gated',
      o: ['Voltage-gated', 'Stretch-gated', 'A leak channel'],
      why: 'Ligand-gated channels respond to a specific chemical binding to them.',
    },
  },
  {
    title: 'Graded potentials: small bumps',
    scene: 'l8-ap', from: 0,
    say: [
      'Signals from other cells open ligand-gated Na⁺ channels. A weak signal lets in a little Na⁺, a strong one lets in more, so the size of the change varies. That is a graded potential.',
      'Watch the graph: at about 1 second there is a small poke. The voltage bumps up a bit and fades away, because it never reaches threshold (−55 mV, the gold line). You can press "Small poke" yourself too.',
    ],
    takeaway: 'Graded potentials vary in size and fade; they only trigger a spike if they reach threshold (−55 mV).',
  },
  {
    title: 'The action potential: all or nothing',
    scene: 'l8-ap', from: 4,
    say: [
      'Now a big poke reaches threshold. Watch: voltage-gated Na⁺ channels fly open, Na⁺ rushes in, and the inside shoots up to about +40 mV. Each opening Na⁺ channel depolarizes the patch and opens more: positive feedback, like a row of dominoes.',
      'Then Na⁺ channels shut and lock, K⁺ channels open, K⁺ rushes out, and the voltage falls (repolarization). K⁺ channels close slowly, so it briefly dips below rest (hyperpolarization). Every spike is the same size: all or none.',
    ],
    takeaway: 'Threshold → Na⁺ in (depolarize) → K⁺ out (repolarize) → brief dip (hyperpolarize).',
    check: {
      q: 'What mainly causes repolarization?',
      a: 'K⁺ flowing out of the cell',
      o: ['Na⁺ flowing into the cell', 'The Na⁺/K⁺ pump alone', 'Ca²⁺ flowing into the cell'],
      why: 'Na⁺ channels inactivate and K⁺ channels open, so K⁺ leaves and the inside turns negative again.',
    },
  },
  {
    title: 'Why the signal only goes one way',
    scene: 'l8-race', from: 3,
    say: [
      'Remember from step 9 that Na⁺ channels lock shut after firing. For a brief moment they cannot open again. That is the refractory period. In step 9’s graph, the too-early third poke did nothing for exactly this reason.',
      'Watch the bottom (unmyelinated) axon: each patch fires the next one ahead, but the patch just behind is still refractory, so the signal can only move forward, toward the axon terminals.',
    ],
    takeaway: 'The refractory period keeps the action potential moving one way, toward the terminals.',
  },
  {
    title: 'Myelin: jumping from node to node',
    scene: 'l8-race', from: 0,
    say: [
      'Two axons get the same signal at the same time. Watch which one wins the race. Without myelin, every bit of membrane must fire in turn, so the signal crawls.',
      'With myelin, the current zips under the insulation and only the gaps, called nodes of Ranvier, fire. The signal hops node to node: saltatory conduction (from the Latin for "jump"). That is why myelin, from step 4, makes signals so much faster.',
    ],
    takeaway: 'Myelin → saltatory conduction: the signal jumps between nodes of Ranvier, much faster.',
    check: {
      q: 'Saltatory conduction happens because…',
      a: 'Myelin insulates the axon so only the nodes of Ranvier fire',
      o: ['Dendrites are myelinated', 'Neurotransmitters jump between nodes', 'The axon has no Na⁺ channels'],
      why: 'Depolarization jumps from node to node between the insulated areas.',
    },
  },
  {
    title: 'The chemical synapse',
    scene: 'l8-synapse', from: 0,
    say: [
      'At a chemical synapse there is a tiny gap, the synaptic cleft, that an action potential cannot cross. So the message turns chemical. Watch the action potential arrive at the terminal, then vesicles fuse and spill neurotransmitter.',
      'The neurotransmitter diffuses across the cleft and binds receptors (ligand-gated channels, from step 7) on the postsynaptic cell. They open, Na⁺ flows in, and you get a graded potential, an action potential, or another change. Then the transmitter is cleared away.',
    ],
    takeaway: 'Electrical → chemical → electrical: neurotransmitter crosses the cleft and opens ligand-gated channels.',
    check: {
      q: 'Why does a chemical synapse need neurotransmitters?',
      a: 'The action potential cannot cross the synaptic cleft',
      o: ['Axons have no Na⁺ channels', 'Neurotransmitters travel in the blood', 'The postsynaptic cell has no receptors'],
      why: 'The cleft is a gap the electrical signal cannot jump, so a chemical carries the message across.',
    },
  },
  {
    title: 'How the system is organized',
    say: [
      'The CNS is mostly interneurons (neurons that stay inside the CNS and connect others) plus glia. Sensory (afferent) neurons bring information in; efferent neurons, including motor neurons, carry commands out to effectors like muscles and glands.',
      'The output side splits. The somatic nervous system controls voluntary skeletal muscle. The autonomic nervous system (ANS) controls everything else, like smooth and cardiac muscle. The vertebrate ANS has three divisions: enteric (nerves inside the gut wall), sympathetic and parasympathetic.',
    ],
    takeaway: 'Somatic = voluntary skeletal muscle; autonomic = involuntary (enteric, sympathetic, parasympathetic).',
    check: {
      q: 'Which system controls cardiac and smooth muscle?',
      a: 'Autonomic nervous system',
      o: ['Somatic nervous system', 'Afferent neurons only', 'Interneurons in the PNS'],
      why: 'The ANS controls effectors other than skeletal muscle.',
    },
  },
  {
    title: 'Fight or flight vs rest and digest',
    scene: 'l8-ans', from: 0, vars: { mode: 'symp' },
    say: [
      'Sympathetic = emergency mode, "fight or flight." Watch the heart race, pupils open wide, blood pressure rise, and digestion slow down.',
      'Now flip the toggle to Parasympathetic: the opposite, "rest and digest." The heart slows, blood pressure drops, and digestion picks up. Think of lying on the couch after a big dinner.',
    ],
    takeaway: 'Sympathetic slows digestion and prepares for emergencies; parasympathetic slows the heart and boosts digestion.',
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
      'A neuron rests at about −70 mV thanks to the Na⁺/K⁺ pump (3 out, 2 in) and K⁺ leaking out. Inputs make graded potentials; if one reaches −55 mV, voltage-gated Na⁺ channels fire an all-or-none action potential: Na⁺ in, then K⁺ out.',
      'The refractory period keeps it moving forward, and myelin makes it jump node to node. At the synapse, neurotransmitter carries the message across. Zoom out, and the ANS runs your organs: sympathetic for emergencies, parasympathetic for rest.',
    ],
    takeaway: 'Rest → threshold → spike → travel → synapse → effect.',
    check: {
      q: 'What happens when a neuron reaches threshold (about −55 mV)?',
      a: 'Voltage-gated Na⁺ channels open and an action potential fires',
      o: ['K⁺ leak channels close permanently', 'The Na⁺/K⁺ pump reverses', 'A graded potential fades away'],
      why: 'At threshold, Na⁺ channels open rapidly and positive feedback drives the spike.',
    },
  },
];
