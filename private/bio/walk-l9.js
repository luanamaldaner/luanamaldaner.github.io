export default [
  {
    title: 'What this lecture is about',
    say: [
      'Last lecture, neurons sent fast, wired messages. Your body has a second messaging system: hormones, chemical messages that ride the blood to reach cells all over the body.',
      'Here’s the plan: how far different chemical signals travel, the kinds of hormones and their receptors (the “locks” they fit), then the boss duo in the brain (the hypothalamus and pituitary), and finally how hormone chains (called axes) switch themselves off with negative feedback.',
    ],
    takeaway: 'Hormones are the body’s slow, wide-reaching messages carried by the blood.',
  },
  {
    title: 'Hormones vs nerves',
    say: [
      'Think of hormones as a radio broadcast and neurons as a phone call. Endocrine cells (hormone-making cells) release hormones into the blood: slower, but they reach lots of cells. Neurons are wired straight to their targets: fewer cells, but precise and much faster.',
      'Either way, the message is a chemical that travels to a target cell and sticks to a receptor on it, which sets off a response. Hormones are endocrine signals; neurons use neurotransmitters.',
    ],
    takeaway: 'Endocrine = slow + wide; nervous = fast + targeted. Both use chemicals that stick to receptors.',
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
      'Watch each box light up in turn. Autocrine (“auto” = self): a cell signals itself. Paracrine (“para” = beside): a cell signals its neighbors. Endocrine: hormones ride the blood all around the body.',
      'Neurotransmitters cross the synaptic cleft (the tiny gap between neurons), though the signal that releases them may have come from far away. Pheromones leave the body completely and affect other animals of the same species, like a scent message.',
    ],
    takeaway: 'Autocrine = self, paracrine = neighbors, endocrine = blood, neurotransmitter = synapse, pheromone = other animals.',
    remember: 'Read the prefixes: AUTO = self (like an autograph), PARA = beside (like parallel), ENDO = within (secreted inside you, into the blood). Pheromones go farthest of all: out of your body to another animal.',
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
      'A hormone is released into the blood by endocrine cells and controls other cells, usually far away. A tiny amount is enough. It only affects cells with the matching receptor. That’s called specificity, like a key that only fits certain locks.',
      'Two kinds of cells make hormones. Neurosecretory (or neuroendocrine) cells are neurons that release hormones into the blood from their axon ends. Nonneural endocrine cells are regular gland cells, not neurons, and often release hormones because another hormone told them to.',
    ],
    takeaway: 'Hormones work in tiny amounts and only on cells with the right receptor.',
    check: {
      q: 'A neuron that releases a hormone into the blood is a…',
      a: 'Neurosecretory cell',
      o: ['Nonneural endocrine cell', 'Target cell', 'Paracrine cell'],
      why: 'Neurosecretory (neuroendocrine) cells are neurons whose axon ends release hormones into the blood.',
    },
  },
  {
    title: 'Three classes of hormones',
    say: [
      'Peptide and protein hormones (made of amino acids, like insulin and growth hormone) are water-soluble (they dissolve in water). That means they can’t get through the fatty cell membrane, so their receptors sit on the cell surface.',
      'Steroid hormones (like aldosterone, cortisol, testosterone and estradiol) are made from cholesterol and are lipid-soluble (they dissolve in fat). So they slip right through the membrane, and their receptors are inside the cell. Amine hormones (made from a single amino acid) include epinephrine (adrenaline) and thyroxine (T4, a thyroid hormone).',
    ],
    takeaway: 'Peptides: water-soluble, receptors on the surface. Steroids: from cholesterol, fat-soluble, receptors inside.',
    remember: 'Like dissolves like: steroids are made from cholesterol (a fat), so they slip through the fatty membrane to receptors inside. Water-soluble peptides can’t get in, so they ring the doorbell (a surface receptor).',
    check: {
      q: 'Which hormone is a steroid?',
      a: 'Cortisol',
      o: ['Insulin', 'Growth hormone', 'Epinephrine'],
      why: 'Cortisol is made from cholesterol; insulin and growth hormone are peptides, epinephrine is an amine.',
    },
  },
  {
    title: 'Surface receptors and second messengers',
    scene: 'l9-receptors', from: 0,
    say: [
      'Watch the left side. A peptide hormone can’t get in, so it sticks to the part of the receptor poking outside the cell. Many of these are G protein–linked receptors: when the hormone binds, a G protein (a relay switch inside the cell) turns on an enzyme.',
      'That enzyme makes lots of second messengers (small molecules that carry the message inside the cell). Watch the burst: one hormone outside leads to thousands of messengers inside. That’s a signaling cascade, like one domino knocking over a whole room of them. This route is fast, working in seconds to minutes.',
    ],
    takeaway: 'Peptide → surface receptor → G protein → second messengers (fast and amplified).',
  },
  {
    title: 'Receptors inside the cell',
    scene: 'l9-receptors', from: 5.5,
    say: [
      'Now watch the right side. Remember from step 5: steroids are fat-soluble. The steroid passes right through the membrane and finds its receptor in the cytoplasm (the cell’s inside fluid) or the nucleus.',
      'The hormone + receptor pair moves into the nucleus and changes gene expression (which genes are turned on). An mRNA copy of the gene is made, then a new protein is built from it. Building new protein takes time, so this route is slow (hours).',
    ],
    takeaway: 'Steroid → receptor inside the cell → nucleus → genes switched on (slow).',
    check: {
      q: 'Where do steroid hormones find their receptors?',
      a: 'Inside the cell (cytoplasm or nucleus)',
      o: ['Only on the cell surface', 'On G proteins outside the cell', 'In the synaptic cleft'],
      why: 'Steroids are fat-soluble, cross the membrane, and the hormone + receptor pair changes which genes are on.',
    },
  },
  {
    title: 'Same hormone, different effects, different timing',
    say: [
      'A cell can have receptors for several hormones. One hormone can do different things in different cells (because their receptors differ) or in different species (prolactin does different jobs in mammals and fish). Feedback can change how many receptors a cell has: fewer receptors make the cell less sensitive, like turning down the volume.',
      'Timing differs too. Peptide and amine hormones are made ahead of time and stored, so they can be released quickly. Steroids are usually made only when needed, so they start slowly. Half-life is how long it takes for half of a hormone to be cleared from the blood.',
    ],
    takeaway: 'Fewer receptors = less sensitive. Peptides are stored and fast; steroids are made when needed.',
    remember: 'Peptides are fast food: made ahead and stored, ready to serve in seconds. Steroids are cooked to order: made only when needed, so they show up late.',
    check: {
      q: 'A cell loses many of its receptors for a hormone. What happens?',
      a: 'It becomes less sensitive to that hormone',
      o: ['It becomes more sensitive', 'The hormone’s half-life doubles', 'It starts making the hormone itself'],
      why: 'Fewer receptors means fewer places for the hormone to act, so the cell responds less.',
    },
  },
  {
    title: 'The pituitary: the "master gland"',
    say: [
      'The pituitary (a pea-sized gland under the brain) controls many other glands, so it’s called the master gland. But it has a boss: it hangs from the hypothalamus (a small control center at the base of the brain), which decides what it releases.',
      'It has two very different halves. The posterior (back) pituitary is really part of the brain: its hormones are made by hypothalamus neurons and released from their axon ends. The anterior (front) pituitary is a true gland: its own cells make tropic hormones (hormones that tell other glands what to do).',
    ],
    takeaway: 'The hypothalamus bosses the pituitary; posterior = brain tissue, anterior = real gland.',
    remember: 'A for Anterior = A real gland (makes its own hormones). P for Posterior = Part of the brain (just releases hormones that hypothalamus neurons made).',
  },
  {
    title: 'Posterior pituitary: ADH and oxytocin',
    scene: 'l9-pit', from: 0,
    say: [
      'Watch the hormones get made in hypothalamus neurons, shipped down their own axons into the posterior pituitary, then released straight into the blood.',
      'Two peptide hormones go this way. ADH (antidiuretic hormone, also called vasopressin) controls how much water the kidneys get rid of (remember it from the kidney lecture). Oxytocin causes the uterus to contract during birth and makes milk flow from the breasts.',
    ],
    takeaway: 'ADH and oxytocin are MADE in the hypothalamus and RELEASED from the posterior pituitary.',
    remember: 'Pee and Push: ADH controls pee (how much water the kidneys get rid of); oxytocin pushes (uterus contractions at birth, milk flow). Both are made in the hypothalamus, released from the posterior pituitary.',
    check: {
      q: 'Which hormones are released from the posterior pituitary?',
      a: 'ADH and oxytocin',
      o: ['TSH and ACTH', 'LH and FSH', 'Growth hormone and prolactin'],
      why: 'They are made by hypothalamus neurons and released from their axon ends in the posterior pituitary.',
    },
  },
  {
    title: 'Anterior pituitary hormones',
    say: [
      'Tropic hormones (tropins) are “boss” hormones that control other glands. ACTH (adrenocorticotropic hormone) controls the adrenal cortex (outer layer of the adrenal glands on top of the kidneys). TSH (thyroid-stimulating hormone) controls the thyroid. LH and FSH (the gonadotropins) control the gonads: ovaries and testes.',
      'The anterior pituitary also makes growth hormone (GH, which helps many tissues grow), prolactin (milk production in mammals), and MSH (named for its effect on skin-color cells in amphibians).',
    ],
    takeaway: 'Anterior pituitary: ACTH, TSH, LH, FSH (tropic) plus GH, prolactin, MSH.',
    remember: 'FLAT PEG: FSH, LH, ACTH, TSH are the tropic ones (they boss other glands); Prolactin, Endorphins and GH act directly. Just add MSH, which this lecture also lists.',
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
      'The anterior pituitary isn’t wired to the brain, so the hypothalamus sends it notes by blood. Watch neurosecretory cells release hormones into a capillary bed (a patch of tiny vessels). These flow down portal vessels (short vessels connecting two capillary beds) to a second capillary bed in the anterior pituitary. This private delivery route is the hypothalamo–hypophysial portal system. The pituitary’s own hormones then go out into the general blood.',
      'These notes are releasing hormones (RH, “make more”) or inhibiting hormones (IH, “make less”). GHRH releases growth hormone, TRH releases TSH, and somatostatin blocks growth hormone release.',
    ],
    takeaway: 'Hypothalamus → releasing/inhibiting hormones → portal vessels → anterior pituitary.',
    remember: 'The names give the job: GHRH = GH-Releasing Hormone, TRH releases TSH. Somato-STAT-in keeps body (“soma”) growth STATic by blocking GH. RH = “make more,” IH = “make less.”',
  },
  {
    title: 'The stress axis and negative feedback',
    scene: 'l9-feedback', from: 0, vars: { axis: 'hpa', fb: 'on' },
    say: [
      'Glands that trigger each other in a chain form an axis. Watch the stress trigger: the hypothalamus releases CRH → the anterior pituitary releases ACTH → the adrenal cortex releases cortisol (the main stress hormone). This chain is the HPA (hypothalamus–pituitary–adrenal) axis.',
      'Cortisol makes energy available: it raises blood sugar by making new glucose (gluconeogenesis), frees up stored fat and breaks proteins down into amino acids. Then watch the brakes: high cortisol tells the hypothalamus and pituitary to slow down. That’s negative feedback (the result turns off its own cause), like a thermostat turning off the heat once the room is warm.',
    ],
    takeaway: 'HPA axis: CRH → ACTH → cortisol, and cortisol shuts the chain off.',
    remember: 'Stress spells C-A-C: CRH → ACTH → Cortisol (“Can’t Always Cope”). ACTH = AdrenoCorticoTropic Hormone, so its name tells you its target: the ADRENAL CORTEX.',
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
      'Same pattern, different gland. Triggers like cold (in babies) or stress make the hypothalamus release TRH → the anterior pituitary releases TSH → the thyroid releases T3 and T4 (thyroid hormones).',
      'Thyroid hormones raise metabolism (how fast the body burns energy) and heat production, support growth (especially brain and spinal cord development) and boost the sympathetic “fight or flight” response. Watch high T3/T4 feed back to quiet the top of the chain.',
    ],
    takeaway: 'TRH → TSH → T3/T4, with negative feedback from T3/T4.',
    remember: 'The thyroid axis is all T’s: TRH → TSH → T3/T4, the same three-step shape as C-A-C for stress. Thyroid = thermostat: it turns up metabolism and heat.',
  },
  {
    title: 'Same pattern for the sex hormones',
    say: [
      'One more axis, from the reproduction lecture. Reproduction itself isn’t on your exam, but its hormones follow the exact chain you just learned. The hypothalamus releases GnRH (gonadotropin-releasing hormone) → the anterior pituitary releases FSH and LH (follicle-stimulating hormone and luteinizing hormone, the “F” and “L” in FLAT PEG) → the gonads (testes or ovaries) release the sex steroids: testosterone, estrogens and progesterone.',
      'In the testes, LH makes the interstitial (Leydig) cells release testosterone. In the ovaries, follicle cells release estrogens and progesterone. These are steroid hormones, so like cortisol they’re made from cholesterol and work through receptors inside the cell.',
      'Feedback: after ovulation, progesterone, estrogen and inhibin suppress FSH and LH, which is negative feedback just like cortisol. The big exception: mid-cycle, rising estrogen makes the anterior pituitary release a surge of LH, and that LH surge is the direct trigger for ovulation (releasing the egg). Oxytocin’s birth loop (Lecture 3) is the other classic positive feedback, and after birth oxytocin and prolactin drive milk secretion.',
    ],
    takeaway: 'GnRH → FSH + LH → testosterone, estrogens, progesterone. Mostly negative feedback, but the LH surge (ovulation) and oxytocin at birth are positive.',
    remember: 'Gonadotropins Go to the Gonads: GnRH → FSH + LH → sex steroids. LH = the “Launch” hormone: its surge launches the egg (ovulation).',
    check: {
      q: 'What is the direct trigger for ovulation?',
      a: 'A surge of LH',
      o: ['A surge of GnRH', 'A drop in FSH', 'Oxytocin from the posterior pituitary'],
      why: 'The slides: the immediate stimulus for ovulation is a surge in blood LH (caused by rising estrogen acting on the anterior pituitary).',
    },
  },
  {
    title: 'What if feedback breaks?',
    scene: 'l9-feedback', from: 0, vars: { axis: 'hpa', fb: 'off' },
    say: [
      'Now feedback is switched off. Tap “Trigger it” and watch the final hormone overshoot and stay high, because nothing is hitting the brakes.',
      'This shows why feedback matters: the level of the final hormone is how the hypothalamus knows whether to make more or less releasing hormone.',
    ],
    takeaway: 'Without negative feedback, an axis overshoots and stays high.',
    check: {
      q: 'In negative feedback, high cortisol levels cause the hypothalamus to…',
      a: 'Release less CRH',
      o: ['Release more CRH', 'Release more ADH', 'Stop the thyroid'],
      why: 'The final hormone tells the hypothalamus to cut back on its releasing hormone.',
    },
  },
  {
    title: 'Putting it together',
    say: [
      'Hormones are chemical messages in the blood: slow and wide, compared to fast, wired neurons. Peptides use surface receptors and second messengers (fast); steroids go inside the cell and change genes (slow). How many receptors a cell has sets how sensitive it is.',
      'The hypothalamus runs the pituitary. It makes ADH and oxytocin for the posterior pituitary, and sends releasing/inhibiting hormones through portal vessels to the anterior pituitary. Chains like CRH → ACTH → cortisol and TRH → TSH → T3/T4 shut themselves off by negative feedback.',
    ],
    takeaway: 'Brain (hypothalamus) → pituitary → gland → hormone, which reports back to the brain.',
    check: {
      q: 'Why can peptide hormones act faster than steroid hormones?',
      a: 'They are stored ahead and act through second messengers',
      o: ['They are made from cholesterol', 'They enter the nucleus directly', 'They have no receptors'],
      why: 'Peptides are made in advance and stored; steroids are usually made when needed and work by changing genes.',
    },
  },
];
