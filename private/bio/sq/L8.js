// Study questions · Lecture 8 (Ch 31) · Nervous systems
// Model answers grounded in l8.js + walk-l8.js. One object per question, in sheet order.
export default [
  {
    q: 'Explain the difference between central nervous system and peripheral nervous system, and explain what a “nerve” is in comparison with a “neuron”.',
    a: 'The central nervous system (CNS) is the brain and spinal cord, the “headquarters.” The peripheral nervous system (PNS) is everything else: the wiring that runs out to the rest of the body. A neuron is a single nerve cell. A nerve is a bundle of many neurons’ axons (hundreds to thousands) in the PNS, like many wires inside one cable.'
  },
  {
    q: 'What are afferent and efferent neurons, and which of these terms applies to a sensory neuron and a motor neuron?',
    a: 'Afferent neurons carry signals toward the CNS; efferent neurons carry signals away from the CNS out to effectors (muscles and glands). A sensory neuron is afferent (it brings information in from sense organs like skin and eyes). A motor neuron is efferent (it tells muscles to contract). Memory tricks: Afferent Arrives, Efferent Exits; SAME = Sensory Afferent, Motor Efferent.'
  },
  {
    q: 'When discussing neuron function, explain what the terms polarized and depolarized mean.',
    a: 'Polarized means there’s a voltage difference across the membrane: in a resting neuron the inside is more negative than the outside, about −60 to −70 mV (the resting potential). Depolarized means that difference has shrunk: the inside has become less negative (closer to zero or even positive), usually because Na⁺ (sodium) has rushed in. Memory trick: “de” = undo, so depolarized is less polarized.'
  },
  {
    q: 'What are the four basic parts/regions of a neuron, and what is the primary function of each?',
    a: '• Dendrites: short branches, like antennas, that pick up signals from other cells and carry them toward the cell body.\n• Cell body: holds the nucleus and organelles and adds up all the incoming signals; if they add up to enough, the neuron fires.\n• Axon: a long cable that carries the action potential away from the cell body, sometimes a meter or more.\n• Axon terminals: the ends of the axon, which pass the signal to the next cell at a synapse (the sender is presynaptic, the receiver postsynaptic).\nMemory trick: “Dogs Chase After Tails.”'
  },
  {
    q: 'What are five important functions of glial cells?',
    a: 'Glial cells (glia) can’t fire signals, but neurons can’t work without them. They:\n• guide growing neurons to the right place during development\n• feed neurons (supply nutrients)\n• control the fluid around neurons\n• help with immunity (fighting infection)\n• help signaling, for example by wrapping axons in myelin so signals travel faster\nAstrocytes (star-shaped glia) are the most common type.'
  },
  {
    q: 'Which two cell types produce myelin, and how does myelin help with neuron function?',
    a: 'Oligodendrocytes make myelin in the CNS (brain and spinal cord), and Schwann cells make it in the PNS (memory trick: COPS = CNS Oligodendrocytes, PNS Schwann). Myelin is a fatty insulating wrap around the axon, like the plastic coating on a wire. Current zips along under the insulation and only the bare gaps (nodes of Ranvier) have to fire, so the signal jumps from node to node, called saltatory conduction. That makes signals much faster. Myelin also looks white, which is why myelinated areas are called white matter.'
  },
  {
    q: 'What are the roles of Na+-K+ATPase, K+ leak channels, and K+ equilibrium potential in establishing the resting potential of a neuron?',
    a: '• Na⁺/K⁺ ATPase (the sodium-potassium pump): uses ATP to throw 3 Na⁺ out for every 2 K⁺ it brings in. That leaves more + charge outside and builds the concentration gradients (lots of Na⁺ outside, lots of K⁺ inside).\n• K⁺ leak channels (always-open holes): much more K⁺ leaks out than Na⁺ leaks in, and each K⁺ that leaves takes a + charge with it, making the inside more negative.\n• K⁺ equilibrium potential: the voltage where K⁺’s pull from concentration and its pull from charge cancel out, about −90 mV (Na⁺’s is about +60 mV). Because the membrane leaks K⁺ much more than Na⁺, the resting potential sits close to K⁺’s value, around −70 mV.'
  },
  {
    q: 'In and around a neuron at rest, what are the relative distributions (locations) of Na+ and K+?',
    a: 'At rest, Na⁺ (sodium) is concentrated outside the neuron, and K⁺ (potassium) is concentrated inside it. The Na⁺/K⁺ pump keeps it that way by moving 3 Na⁺ out and 2 K⁺ in. Memory trick: a salty sea outside, potassium kept inside.'
  },
  {
    q: 'Regarding neurons, explain the terms polarized, depolarized, and hyperpolarized. Explain how ligand-gated and voltage-gated Na+ contribute to graded and action potentials.',
    a: '• Polarized: at rest the inside is more negative than the outside (about −70 mV).\n• Depolarized: the inside becomes less negative, e.g. when Na⁺ rushes in.\n• Hyperpolarized: the inside becomes more negative than rest.\n• Ligand-gated Na⁺ channels open when a chemical (ligand, like a neurotransmitter) binds them. A weak signal lets in a little Na⁺, a strong one more, so you get a graded potential: a bump that varies in size and fades.\n• Voltage-gated Na⁺ channels open when the membrane reaches threshold (about −55 mV). Na⁺ rushes in, which opens more channels (positive feedback), and the inside shoots up to about +40 mV: an action potential. It’s all-or-none, always the same size. Then Na⁺ channels lock shut, K⁺ channels open, K⁺ leaves (repolarization), and a brief dip below rest is the hyperpolarization.'
  },
  {
    q: 'Why does an action potential travel in only one direction, and what is the role of myelin in action potential propagation?',
    a: 'An action potential spreads because Na⁺ rushing in at one spot depolarizes the next spot, which opens its Na⁺ channels, and so on. It only goes forward because the patch it just left is in its refractory period: those Na⁺ channels are inactivated (locked) for a moment and can’t fire again, so only the patch ahead can fire. Myelin insulates the axon so only the nodes of Ranvier (bare gaps) need to fire; the signal jumps node to node (saltatory conduction), which is much faster than firing every bit of membrane.'
  },
  {
    q: 'What is the role of neurotransmitters?',
    a: 'Neurotransmitters are chemical messengers that carry the signal across a chemical synapse. The action potential can’t jump the tiny gap between cells (the synaptic cleft), so when it reaches the axon terminal, Ca²⁺ enters and vesicles release neurotransmitter. It diffuses across the cleft and binds receptors (ligand-gated channels) on the receiving cell, which open and cause a graded potential, an action potential, or another change. Then the neurotransmitter is cleared away so the signal stops. Electrical → chemical → electrical.'
  },
  {
    q: 'What are the roles of the somatic and autonomic nervous systems?',
    a: 'Both are parts of the efferent (output) side. The somatic nervous system controls skeletal muscle, the muscles you move on purpose (voluntary). The autonomic nervous system (ANS) runs everything automatic: smooth muscle (in the gut and blood vessels), cardiac muscle (heart) and glands. In vertebrates the ANS has three divisions: sympathetic, parasympathetic and enteric (a nerve network in the gut wall). Memory trick: soma = “body,” autonomic = autopilot.'
  },
  {
    q: 'What are the roles of the sympathetic and parasympathetic divisions of the nervous system?',
    a: '• Sympathetic = “fight or flight” for emergencies and stress: speeds up the heart, raises blood pressure, widens the pupils and puts digestion on hold (adrenaline joins in).\n• Parasympathetic = “rest and digest”: mostly the opposite, slowing the heart, lowering blood pressure and speeding up digestion, like lying on the couch after a big dinner.\nMemory trick: Sympathetic = Stress, Parasympathetic = Peace.'
  },
];
