// Guided lecture · L3 · Animals and temperature: thermoregulation (Ch 28.3, 29.1)
export default [
  {
    title: 'What this lecture is about',
    say: [
      'This lecture uses body temperature as the classic example of homeostasis. How do some animals stay at 37 °C in a snowstorm, while others just warm up and cool down with the weather?',
      'In order: homeotherms vs poikilotherms, how animals make, keep and dump heat, the feedback loop that runs the body’s thermostat, and finally real animals in extreme places (Arctic fox, reindeer, desert animals).',
    ],
    takeaway: 'Temperature control is the textbook case of homeostasis, and it always comes with an energy cost.',
  },
  {
    title: 'Homeostasis',
    say: [
      'Homeostasis means a stable internal environment, plus the mechanisms that keep it stable. It’s a parallel idea to “regulation” from Lecture 2, with the same pros and cons: it’s stable but energetically expensive.',
      'Humans and many other animals show a high degree of homeostasis, but some animals show very little.',
    ],
    takeaway: 'Homeostasis = a stable internal environment and the mechanisms that maintain it; it costs energy.',
    check: {
      q: 'Homeostasis has the same big downside as regulation. What is it?',
      a: 'It’s energetically expensive',
      o: ['It makes the internal environment unstable', 'It only works in warm climates', 'It stops cells from making ATP'],
      why: 'Keeping the inside stable takes constant work, which costs energy.',
    },
  },
  {
    title: 'Homeotherms and the thermoneutral zone',
    say: [
      'Homeotherms (mammals and birds) keep a constant body temperature: that’s thermoregulation. The thermoneutral zone (TNZ) is the range of outside temperatures where their metabolic rate is lowest and flat.',
      'Watch the red mouse dot on the graph. While the air is inside the TNZ, the line is flat. As the air gets cold, the dot climbs: the mouse burns extra food to stay at 37 °C. When the air gets very hot it climbs again, because cooling off costs energy too.',
    ],
    scene: 'l3-tnz',
    from: 0,
    vars: { sun: 'shade' },
    takeaway: 'Inside the TNZ a homeotherm’s metabolic rate is minimal; outside it, the rate rises.',
    check: {
      q: 'What happens to a homeotherm’s metabolic rate when the air gets colder than its thermoneutral zone?',
      a: 'It rises',
      o: ['It falls', 'It stays flat', 'It drops to zero'],
      why: 'Below the TNZ it has to make extra heat to stay at 37 °C, so metabolic rate goes up.',
    },
  },
  {
    title: 'Poikilotherms and basking',
    say: [
      'Most animals are poikilotherms (ectotherms): their body temperature varies and is set by the outside temperature. In the shade, watch the lizard’s body bar just follow the air down.',
      'Now the toggle is on “basks in the sun”. Ectotherms can steer their temperature with behavior, choosing sun or shade (behavioral thermoregulation). Think of the alligator in Gainesville in January: why bother? Because enzymes, digestion and muscles all work better warm.',
    ],
    scene: 'l3-tnz',
    from: 1.5,
    vars: { sun: 'bask' },
    takeaway: 'Poikilotherms’ body temperature follows the outside, but they can bask or hide (behavioral thermoregulation).',
  },
  {
    title: 'Homeotherms pay more',
    say: [
      'Watch the end of the loop: the mouse’s line sits above the lizard’s almost everywhere. In general, homeotherms have higher metabolic rates than poikilotherms, especially when it’s cold.',
      'So homeotherms also have higher food needs. Staying at 37 °C is like keeping your heater running all winter: comfy, but the bill is big.',
    ],
    scene: 'l3-tnz',
    from: 14,
    vars: { sun: 'shade' },
    takeaway: 'Homeotherms have higher metabolic rates (especially in the cold), so they need more food.',
    check: {
      q: 'Why do homeotherms need more food than poikilotherms?',
      a: 'Their metabolic rates are higher, especially in the cold',
      o: ['They can’t store fat', 'They digest food less completely', 'They have smaller surface area to volume ratios'],
      why: 'Holding a constant warm temperature burns lots of energy.',
    },
  },
  {
    title: 'Making heat: shivering and brown fat',
    say: [
      'In the cold, homeotherms raise their metabolic rate. Shivering: skeletal muscles contract and the energy from ATP turns into heat.',
      'Nonshivering thermogenesis: most mammals have brown adipose tissue (brown fat). Watch the two mitochondria. Normally H⁺ flows back through ATP synthase and the energy is saved as ATP. In brown fat it’s “uncoupled”: H⁺ leaks back without making ATP, so the energy comes out as heat. Like a water wheel with the belt cut: the water still flows, but it only makes heat.',
    ],
    scene: 'l3-effectors',
    from: 0,
    vars: { day: 'cold' },
    takeaway: 'Shivering and brown fat (uncoupled oxidative phosphorylation) turn energy into heat.',
    check: {
      q: 'How does brown fat produce heat?',
      a: 'Its mitochondria are uncoupled, so energy goes to heat instead of ATP',
      o: ['Its fibres contract quickly like muscle', 'It traps heat like a blanket', 'It makes extra ATP that is then burned'],
      why: 'In brown fat, oxidative phosphorylation is uncoupled from ATP production.',
    },
  },
  {
    title: 'Keeping heat in, dumping heat out',
    say: [
      'Insulation like fur and feathers slows heat loss, and special blood-flow patterns can conserve heat (you’ll see one in the fox’s leg soon).',
      'Now it’s a hot day. Watch the sweat beads, then the little heat squiggles leave as they evaporate. Water absorbs a lot of heat energy to change from liquid to gas, so sweating and panting carry heat out of the body. That’s evaporative cooling.',
    ],
    scene: 'l3-effectors',
    from: 0,
    vars: { day: 'hot' },
    takeaway: 'Insulation keeps heat in; evaporative cooling (sweating, panting) dumps heat.',
  },
  {
    title: 'The body’s thermostat: negative feedback',
    say: [
      'Negative feedback activates effectors to bring a variable back into the normal range. It has 4 parts: ① controlled variable (body temperature), ② sensors (temperature receptors in skin and brain), ③ control mechanism (nerve cells of the hypothalamus), ④ effectors (like shivering muscles).',
      'Watch the graph: a cold snap hits, the temperature dips, the hypothalamus turns on shivering and brown fat, and the line comes back to 37 °C. Then a heat wave, and sweating brings it back down. The response always opposes the change, just like a home thermostat.',
    ],
    scene: 'l3-loop',
    from: 0,
    vars: { fb: 'neg' },
    takeaway: 'Negative feedback: sensors → hypothalamus → effectors, always pushing back toward the set point.',
    check: {
      q: 'In the temperature feedback loop, the hypothalamus is the…',
      a: 'Control mechanism',
      o: ['Sensor', 'Effector', 'Controlled variable'],
      why: 'Receptors sense, the hypothalamus decides which effectors to turn on, and muscles or sweat glands are the effectors.',
    },
  },
  {
    title: 'Positive feedback',
    say: [
      'Your professor asked: how would this change if it were positive feedback? The toggle is now on “Positive”. Watch the line: after the cold snap, the effectors push the SAME way as the change, and it runs away from 37 °C.',
      'Positive feedback amplifies a change and destabilizes the system, so it’s only useful when something ends it. Childbirth: the cervix stretches → the pituitary releases oxytocin → stronger contractions → more stretch → more oxytocin… until the baby is born.',
    ],
    scene: 'l3-loop',
    from: 0,
    vars: { fb: 'pos' },
    takeaway: 'Positive feedback amplifies a change (e.g. oxytocin in childbirth) and needs something to end it.',
    check: {
      q: 'Which is an example of positive feedback?',
      a: 'Oxytocin making uterine contractions stronger during childbirth',
      o: ['Shivering when body temperature falls', 'Sweating when body temperature rises', 'Panting on a hot day'],
      why: 'Stretch → oxytocin → stronger contractions → more stretch: the change grows until birth ends it.',
    },
  },
  {
    title: 'Microhabitats, and small vs large animals',
    say: [
      'Now Chapter 29.1: animals in real environments. Adaptations only make sense in the place an animal lives. A microhabitat (microenvironment) is a spot within a habitat that differs from the rest, like a burrow or the shade under a rock. Its conditions are its microclimate.',
      'Small animals mostly use behavior: they have a larger surface area to volume ratio and a higher metabolic rate (so holding temperature is expensive), but it’s easy for them to slip into a microenvironment. Large animals have fewer behavioral options, so they rely more on physiology.',
    ],
    takeaway: 'Small animals defend with behavior (microhabitats); large animals depend more on physiology.',
    check: {
      q: 'Compared with a large animal, a small animal has…',
      a: 'A larger surface area to volume ratio',
      o: ['A smaller surface area to volume ratio', 'A lower metabolic rate per gram', 'Fewer microenvironments it can use'],
      why: 'Small bodies have lots of surface for their volume, so they gain and lose heat fast and lean on behavior.',
    },
  },
  {
    title: 'Reindeer and the Arctic fox’s leg',
    say: [
      'Reindeer show phenotypic plasticity: in winter their metabolic rate is much lower than a human’s, they add insulation, and they use regional hypothermia, letting the legs run cooler than the core. The Arctic fox does it too: just enough heat goes to the foot pads to keep them near, but never below, freezing, so they don’t melt the snow and stay dry.',
      'The trick is countercurrent heat exchange. Watch the warm artery hand its heat across to the cold vein right beside it, so the heat goes back to the core.',
    ],
    scene: 'l3-fox',
    from: 0,
    vars: { cc: 'on' },
    takeaway: 'Countercurrent exchange between artery and vein keeps heat in the core while paws stay just above freezing.',
  },
  {
    title: 'What if the vein were far away?',
    say: [
      'Flip the layout so the vein is far from the artery. Now watch the paw and core numbers: warm blood reaches the paw and its heat drains into the snow, and cold blood comes back and chills the core.',
      'Compare the heat-loss bar with the side-by-side version. Running the two vessels next to each other in opposite directions is what saves the heat.',
    ],
    scene: 'l3-fox',
    from: 0,
    vars: { cc: 'off' },
    takeaway: 'Without countercurrent exchange, lots of body heat is wasted through the limbs.',
    check: {
      q: 'What does countercurrent heat exchange in an Arctic fox’s leg do?',
      a: 'Keeps most heat in the core while the paws stay just above freezing',
      o: ['Keeps the paws as warm as the core', 'Lets the paws freeze solid to save energy', 'Melts the snow under the paws for traction'],
      why: 'Warm arterial blood passes its heat to the returning cold venous blood, so the heat goes back to the body.',
    },
  },
  {
    title: 'Hot deserts: hide or tolerate',
    say: [
      'Hot deserts have two challenges: not enough water and high temperatures. Watch a full day. The small kangaroo rat heads into its cool burrow (a microenvironment) and only comes out at night: it’s nocturnal.',
      'The big Grant’s gazelle can’t hide, so watch its core temperature climb toward about 46 °C. Because it doesn’t sweat, it saves water, and a countercurrent system keeps its brain cooler. Small animal = behavior, large animal = physiology, just like step 10.',
    ],
    scene: 'l3-desert',
    from: 0,
    takeaway: 'Kangaroo rats avoid heat by behavior; Grant’s gazelles tolerate a ~46 °C core to save water.',
    check: {
      q: 'How does Grant’s gazelle cope with desert heat?',
      a: 'It lets its core temperature rise to about 46 °C instead of sweating',
      o: ['It hides in a burrow all day', 'It sweats heavily to stay at 37 °C', 'It becomes nocturnal like the kangaroo rat'],
      why: 'Not sweating saves water, and a countercurrent system keeps its brain cooler than its core.',
    },
  },
  {
    title: 'Putting it together',
    say: [
      'Homeotherms hold a steady temperature, lowest-cost inside the TNZ, and pay for it with higher metabolic rates and food needs. Poikilotherms follow the outside but can bask or hide. Heat is made by shivering and brown fat, kept by insulation and countercurrent flow, and lost by evaporation.',
      'Negative feedback (sensors → hypothalamus → effectors) runs the thermostat; positive feedback amplifies instead. In extreme places, small animals use behavior and microhabitats, while large ones use physiology like regional hypothermia.',
    ],
    takeaway: 'Make heat, keep heat, lose heat, all steered by negative feedback, with behavior or physiology depending on body size.',
  },
];
