export default [
  {
    title: 'What this lecture is about',
    say: [
      'Last lecture, neurons sent fast, wired messages. Your body has a second messaging system: hormones, chemicals that ride the blood to reach cells all over the body.',
      'We will see the different ranges chemical signals travel, the kinds of hormones and their receptors, then the boss duo, the hypothalamus and pituitary, and finally how hormone chains (axes) switch themselves off with negative feedback.',
    ],
    takeaway: 'Hormones are the body’s slow, wide-reaching messages carried by the blood.',
  },
  {
    title: 'Hormones vs nerves',
    say: [
      'Think of hormones as a radio broadcast and neurons as a phone call. Endocrine cells release hormones into the blood: slower, but they reach large numbers of cells. Neurons are wired directly to their targets: fewer cells, but precise and much faster.',
      'Either way, the message is a chemical that travels to a target cell and binds a receptor on it, which triggers a response. Hormones are endocrine signals; neurons use neurotransmitters.',
    ],
    takeaway: 'Endocrine = slow + wide; nervous = fast + targeted. Both use chemicals binding receptors.',
    check: {
      q: 'Compared with nerve signals, hormone signals are…',
      a: 'Slower but reach many cells',
      o: ['Faster and more targeted', 'Carried along axons', 'Only able to reach neighboring cells'],
      why: 'Hormones travel through the blood, so they spread widely but take longer.',
    },
  },
  {
    title: 'Signals at different distances',
    scene: 'l9-signals', from: 0,
    say: [
      'Watch each box light up in turn. Autocrine: a cell signals itself. Paracrine: a cell signals its neighbors. Endocrine: hormones ride the blood around the body.',
      'Neurotransmitters cross the synaptic cleft (their release may be triggered by impulses from far away). Pheromones leave the body entirely and affect other individuals, like a scent message.',
    ],
    takeaway: 'Autocrine = self, paracrine = neighbors, endocrine = blood, neurotransmitter = synapse, pheromone = other animals.',
    check: {
      q: 'A chemical that affects the very same cell that released it is…',
      a: 'Autocrine',
      o: ['Paracrine', 'Endocrine', 'A pheromone'],
      why: 'Auto means self; paracrine acts on neighbors.',
    },
  },
  {
    title: 'What counts as a hormone',
    say: [
      'A hormone is secreted into the blood by endocrine cells and regulates other, usually distant, cells. It works at very low concentrations. It only affects cells with the matching receptor, which gives it specificity, like a key that fits only certain locks.',
      'Two kinds of cells make hormones. Neurosecretory (neuroendocrine) cells are excitable neurons whose axon terminals release hormones into the blood. Nonneural endocrine cells are not excitable and are often told to secrete by other hormones.',
    ],
    takeaway: 'Hormones work at tiny concentrations and only on cells with the right receptor.',
    check: {
      q: 'An excitable neuron that releases a hormone into the blood is a…',
      a: 'Neurosecretory cell',
      o: ['Nonneural endocrine cell', 'Target cell', 'Paracrine cell'],
      why: 'Neurosecretory (neuroendocrine) cells are neurons whose axon terminals release hormones into blood.',
    },
  },
  {
    title: 'Three classes of hormones',
    say: [
      'Peptide and protein hormones (like insulin and growth hormone) are water-soluble, so they cannot cross the fatty cell membrane. Their receptors are on the cell surface.',
      'Steroid hormones (like aldosterone, cortisol, testosterone and estradiol) are made from cholesterol and are lipid-soluble, so they slip through the membrane and have receptors inside the cell. Amine hormones include epinephrine (adrenaline) and thyroxine (T4).',
    ],
    takeaway: 'Peptides: water-soluble, surface receptors. Steroids: from cholesterol, lipid-soluble, receptors inside.',
    check: {
      q: 'Which hormone is a steroid?',
      a: 'Cortisol',
      o: ['Insulin', 'Growth hormone', 'Epinephrine'],
      why: 'Cortisol is a corticosteroid made from cholesterol; insulin and GH are peptides, epinephrine is an amine.',
    },
  },
  {
    title: 'Surface receptors and second messengers',
    scene: 'l9-receptors', from: 0,
    say: [
      'Watch the left side. A peptide hormone cannot get in, so it binds the part of the receptor sticking outside the cell. Many of these are G protein–linked receptors: the G protein inside switches on an enzyme.',
      'That enzyme makes lots of "second messengers" inside the cell. Watch the burst: one hormone outside leads to thousands of messengers inside, a signaling cascade. That is why this route is fast, working in seconds to minutes.',
    ],
    takeaway: 'Peptide → surface receptor → G protein → second messengers (fast, amplified).',
  },
  {
    title: 'Receptors inside the cell',
    scene: 'l9-receptors', from: 5.5,
    say: [
      'Now watch the right side. Remember from step 5: steroids are lipid-soluble. The steroid diffuses right through the membrane and finds its receptor in the cytoplasm or nucleus.',
      'The hormone–receptor pair moves into the nucleus and changes gene expression: an mRNA copy is made and then a new protein is built. Building new protein takes time, so this route is slower (hours).',
    ],
    takeaway: 'Steroid → receptor inside the cell → nucleus → genes switched on (slow).',
    check: {
      q: 'Where do steroid hormones find their receptors?',
      a: 'Inside the cell (cytoplasm or nucleus)',
      o: ['Only on the cell surface', 'On G proteins outside the cell', 'In the synaptic cleft'],
      why: 'Steroids are lipid-soluble, cross the membrane, and the complex alters gene expression.',
    },
  },
  {
    title: 'Same hormone, different effects, different timing',
    say: [
      'A cell can have receptors for several hormones, and one hormone can do different things in different cells (because receptors differ) or different species (prolactin in mammals vs fish). Feedback can change how many receptors a cell has: fewer receptors make the cell less sensitive.',
      'Timing differs too. Peptide and amine hormones are made ahead and stored, so they are released quickly. Steroids are usually made on demand, so they start slowly. Half-life is how long it takes for half the hormone to be removed from the blood.',
    ],
    takeaway: 'Fewer receptors = less sensitive. Peptides are stored and fast; steroids are made on demand.',
    check: {
      q: 'A cell loses many of its receptors for a hormone. What happens?',
      a: 'It becomes less sensitive to that hormone',
      o: ['It becomes more sensitive', 'The hormone’s half-life doubles', 'It starts making the hormone itself'],
      why: 'A decrease in receptor number tends to reduce cell sensitivity to a hormone.',
    },
  },
  {
    title: 'The pituitary: the "master gland"',
    say: [
      'The pituitary controls many other glands, so it is called the master gland. But it has a boss: it hangs from the hypothalamus of the brain, which controls what it releases.',
      'It has two very different halves. The posterior pituitary is an extension of the brain: its hormones are made by hypothalamus neurons and released from their axons. The anterior pituitary is a true gland: its own endocrine cells make tropic hormones that control other glands.',
    ],
    takeaway: 'Hypothalamus bosses the pituitary; posterior = brain tissue, anterior = gland.',
  },
  {
    title: 'Posterior pituitary: ADH and oxytocin',
    scene: 'l9-pit', from: 0,
    say: [
      'Watch the hormones being made in hypothalamus neurons and shipped down their own axons into the posterior pituitary, then released straight into the blood.',
      'Two peptide hormones go this way. ADH (vasopressin) controls how much water the kidneys excrete (remember it from the kidney lecture). Oxytocin causes uterine contractions during birth and milk flow from the breasts.',
    ],
    takeaway: 'ADH and oxytocin are MADE in the hypothalamus and RELEASED from the posterior pituitary.',
    check: {
      q: 'Which hormones are released from the posterior pituitary?',
      a: 'ADH and oxytocin',
      o: ['TSH and ACTH', 'LH and FSH', 'Growth hormone and prolactin'],
      why: 'They are made by hypothalamic neurons and released from their axon endings in the posterior pituitary.',
    },
  },
  {
    title: 'Anterior pituitary hormones',
    say: [
      'Tropic hormones (tropins) control other glands: ACTH controls the adrenal cortex, TSH controls the thyroid, and LH and FSH (the gonadotropins) control the ovaries and testes.',
      'The anterior pituitary also makes growth hormone (GH, promotes growth in many tissues), prolactin, and MSH (named for its effect on skin-color cells in amphibians).',
    ],
    takeaway: 'Anterior pituitary: ACTH, TSH, LH, FSH (tropic) plus GH, prolactin, MSH.',
    check: {
      q: 'Which hormone controls the thyroid gland?',
      a: 'TSH',
      o: ['ACTH', 'FSH', 'Oxytocin'],
      why: 'Thyroid-stimulating hormone comes from the anterior pituitary and acts on the thyroid.',
    },
  },
  {
    title: 'How the hypothalamus controls the anterior pituitary',
    scene: 'l9-pit', from: 8,
    say: [
      'The anterior pituitary is not wired to the brain, so the hypothalamus sends notes by blood. Watch neurosecretory cells release hormones into a capillary bed, which flows down portal vessels to a second capillary bed in the anterior pituitary (the hypothalamo–hypophysial portal system). Its own hormones then enter general circulation.',
      'These notes are releasing hormones (RH) or inhibiting hormones (IH). GHRH releases growth hormone, TRH releases TSH, and somatostatin inhibits growth hormone release.',
    ],
    takeaway: 'Hypothalamus → releasing/inhibiting hormones → portal vessels → anterior pituitary.',
  },
  {
    title: 'The stress axis and negative feedback',
    scene: 'l9-feedback', from: 0, vars: { axis: 'hpa', fb: 'on' },
    say: [
      'Glands acting on each other in sequence form an axis. Watch the stress trigger: the hypothalamus releases CRH → the anterior pituitary releases ACTH → the adrenal cortex releases cortisol.',
      'Cortisol makes energy available: raises blood glucose (gluconeogenesis), mobilizes fats and breaks down proteins into amino acids. Then watch the brakes: high cortisol tells the hypothalamus and pituitary to slow down. That is negative feedback, like a thermostat.',
    ],
    takeaway: 'HPA axis: CRH → ACTH → cortisol, and cortisol shuts the chain off.',
    check: {
      q: 'In the HPA axis, what does ACTH stimulate?',
      a: 'The adrenal cortex to release cortisol',
      o: ['The thyroid to release T3/T4', 'The hypothalamus to release CRH', 'The posterior pituitary to release ADH'],
      why: 'CRH → ACTH (anterior pituitary) → cortisol from the adrenal cortex.',
    },
  },
  {
    title: 'The thyroid axis',
    scene: 'l9-feedback', from: 0, vars: { axis: 'thy', fb: 'on' },
    say: [
      'Same pattern, different gland. Triggers like cold (in infants) or stress make the hypothalamus release TRH → the anterior pituitary releases TSH → the thyroid releases T3 and T4.',
      'Thyroid hormones raise metabolism and heat production, support growth (especially CNS development) and boost the sympathetic "fight or flight" response. Watch high T3/T4 feed back to quiet the top of the chain.',
    ],
    takeaway: 'TRH → TSH → T3/T4, with negative feedback from T3/T4.',
  },
  {
    title: 'What if feedback breaks?',
    scene: 'l9-feedback', from: 0, vars: { axis: 'hpa', fb: 'off' },
    say: [
      'Now the feedback is switched off. Tap "Trigger it" and watch the end hormone overshoot and stay high, because nothing applies the brakes.',
      'This shows why feedback matters: the end hormone’s level is the information the hypothalamus uses to decide whether to make more or less releasing hormone.',
    ],
    takeaway: 'Without negative feedback, an axis overshoots and stays high.',
    check: {
      q: 'In negative feedback, high cortisol levels cause the hypothalamus to…',
      a: 'Release less CRH',
      o: ['Release more CRH', 'Release more ADH', 'Stop the thyroid'],
      why: 'The target gland’s hormone tells the hypothalamus to cut back its releasing hormone.',
    },
  },
  {
    title: 'Putting it together',
    say: [
      'Hormones are chemical messages in the blood: slow and wide, versus fast wired neurons. Peptides use surface receptors and second messengers (fast); steroids go inside and change genes (slow). Receptor numbers set how sensitive a cell is.',
      'The hypothalamus runs the pituitary: it makes ADH and oxytocin for the posterior pituitary, and sends releasing/inhibiting hormones through portal vessels to the anterior pituitary. Axes like CRH → ACTH → cortisol and TRH → TSH → T3/T4 shut themselves off by negative feedback.',
    ],
    takeaway: 'Brain (hypothalamus) → pituitary → gland → hormone, which feeds back to the brain.',
    check: {
      q: 'Why can peptide hormones act faster than steroid hormones?',
      a: 'They are stored ahead and act through second messengers',
      o: ['They are made from cholesterol', 'They enter the nucleus directly', 'They have no receptors'],
      why: 'Peptides are made in advance and stored; steroids are usually made on demand and change gene expression.',
    },
  },
];
