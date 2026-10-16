// Guided lecture · L3 · Animals and temperature: thermoregulation (Ch 28.3, 29.1)
export default [
  {
    title: 'What this lecture is about',
    say: [
      'This lecture uses body temperature as the classic example of homeostasis (keeping the inside of the body steady). How do some animals stay at 37 °C in a snowstorm, while others just warm up and cool down with the weather?',
      'Here’s the plan: homeotherms vs poikilotherms, how animals make, keep and get rid of heat, the feedback loop that works as the body’s thermostat, and finally real animals in extreme places (Arctic fox, reindeer, desert animals).',
    ],
    takeaway: 'Temperature control is the textbook example of homeostasis, and it always costs energy.',
  },
  {
    title: 'Homeostasis',
    say: [
      'Homeostasis means a stable inside environment, plus the body systems that keep it stable. It’s the same idea as “regulation” from Lecture 2, with the same pros and cons: things stay stable, but it costs a lot of energy.',
      'Humans and many other animals keep things very steady inside, but some animals barely do at all.',
    ],
    takeaway: 'Homeostasis = a stable inside environment and the systems that keep it that way; it costs energy.',
    check: {
      q: 'Homeostasis has the same big downside as regulation. What is it?',
      a: 'It’s energetically expensive',
      o: ['It makes the internal environment unstable', 'It only works in warm climates', 'It stops cells from making ATP'],
      why: 'Keeping the inside stable takes nonstop work, which costs energy.',
    },
  },
  {
    title: 'Homeotherms and the thermoneutral zone',
    say: [
      'Homeotherms (“same temperature” animals: mammals and birds) keep their body temperature constant. Controlling body temperature is called thermoregulation. The thermoneutral zone (TNZ) is the “comfort range” of outside temperatures where their metabolic rate (energy use) is lowest and flat.',
      'Watch the red mouse dot on the graph. While the air is inside the TNZ, the line stays flat. As the air gets cold, the dot climbs: the mouse burns extra food to stay at 37 °C. When the air gets very hot it climbs again, because cooling down costs energy too.',
    ],
    scene: 'l3-tnz',
    from: 0,
    vars: { sun: 'shade' },
    takeaway: 'Inside the TNZ a homeotherm uses the least energy; outside it, energy use goes up.',
    check: {
      q: 'What happens to a homeotherm’s metabolic rate when the air gets colder than its thermoneutral zone?',
      a: 'It rises',
      o: ['It falls', 'It stays flat', 'It drops to zero'],
      why: 'Below the TNZ it has to make extra heat to stay at 37 °C, so its metabolic rate goes up.',
    },
  },
  {
    title: 'Poikilotherms and basking',
    say: [
      'Most animals are poikilotherms (“changing temperature” animals, also called ectotherms, meaning heat comes from outside). Their body temperature goes up and down with the outside temperature. In the shade, watch the lizard’s body bar just follow the air down.',
      'Now the toggle is on “basks in the sun”. Ectotherms can control their temperature with behavior, by choosing sun or shade. That’s behavioral thermoregulation. Think of the alligator in Gainesville in January: why bother? Because enzymes, digestion and muscles all work better when warm.',
    ],
    scene: 'l3-tnz',
    from: 1.5,
    vars: { sun: 'bask' },
    takeaway: 'Poikilotherms’ body temperature follows the outside, but they can bask or hide (behavioral thermoregulation).',
  },
  {
    title: 'Homeotherms pay more',
    say: [
      'Watch the end of the loop: the mouse’s line sits above the lizard’s almost everywhere. In general, homeotherms burn energy faster (higher metabolic rates) than poikilotherms, especially in the cold.',
      'So homeotherms also need more food. Staying at 37 °C is like running your heater all winter: cozy, but the bill is big.',
    ],
    scene: 'l3-tnz',
    from: 14,
    vars: { sun: 'shade' },
    takeaway: 'Homeotherms have higher metabolic rates (especially in the cold), so they need more food.',
    check: {
      q: 'Why do homeotherms need more food than poikilotherms?',
      a: 'Their metabolic rates are higher, especially in the cold',
      o: ['They can’t store fat', 'They digest food less completely', 'They have smaller surface area to volume ratios'],
      why: 'Holding a steady warm temperature burns lots of energy.',
    },
  },
  {
    title: 'Making heat: shivering and brown fat',
    say: [
      'In the cold, homeotherms burn energy faster to make heat. Shivering: skeletal muscles (the ones you move on purpose) twitch over and over, and the energy from ATP turns into heat.',
      'Nonshivering thermogenesis (“making heat without shivering”): most mammals have brown adipose tissue (brown fat). Watch the two mitochondria (the cell’s power plants). Normally H⁺ (hydrogen ions) flow back through a protein called ATP synthase, and that energy is saved as ATP. In brown fat this is “uncoupled”: H⁺ leaks back without making ATP, so the energy comes out as heat. Like a water wheel with the belt cut: the water still flows, but all it makes is heat.',
    ],
    scene: 'l3-effectors',
    from: 0,
    vars: { day: 'cold' },
    takeaway: 'Shivering and brown fat (where ATP-making is “uncoupled”) turn energy into heat.',
    check: {
      q: 'How does brown fat make heat?',
      a: 'Its mitochondria are uncoupled, so energy goes to heat instead of ATP',
      o: ['Its fibres contract quickly like muscle', 'It traps heat like a blanket', 'It makes extra ATP that is then burned'],
      why: 'In brown fat, oxidative phosphorylation (the ATP-making step in mitochondria) is uncoupled from making ATP.',
    },
  },
  {
    title: 'Keeping heat in, dumping heat out',
    say: [
      'Insulation like fur and feathers slows heat loss, and special blood-flow setups can save heat (you’ll see one in the fox’s leg soon).',
      'Now it’s a hot day. Watch the sweat beads, then the little heat squiggles leave as they evaporate. Water soaks up a lot of heat when it turns from liquid to gas, so sweating and panting carry heat out of the body. That’s evaporative cooling.',
    ],
    scene: 'l3-effectors',
    from: 0,
    vars: { day: 'hot' },
    takeaway: 'Insulation keeps heat in; evaporative cooling (sweating, panting) gets rid of heat.',
  },
  {
    title: 'The body’s thermostat: negative feedback',
    say: [
      'Negative feedback turns on effectors (the parts that act) to bring something back to normal. It has 4 parts: ① controlled variable (the thing being kept steady: body temperature), ② sensors (temperature detectors in the skin and brain), ③ control mechanism (the decision-maker: nerve cells in the hypothalamus, a small brain region), ④ effectors (the doers, like shivering muscles).',
      'Watch the graph: a cold snap hits, the temperature dips, the hypothalamus turns on shivering and brown fat, and the line comes back to 37 °C. Then a heat wave, and sweating brings it back down. The response always pushes against the change, just like a home thermostat.',
    ],
    scene: 'l3-loop',
    from: 0,
    vars: { fb: 'neg' },
    takeaway: 'Negative feedback: sensors → hypothalamus → effectors, always pushing back toward the set point (the normal value).',
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
      'Your professor asked: how would this change with positive feedback? The toggle is now on “Positive”. Watch the line: after the cold snap, the effectors push the SAME way as the change, and it runs away from 37 °C.',
      'Positive feedback makes a change bigger and bigger, so it throws the system off balance. It’s only useful when something ends it. Childbirth: the cervix (opening of the uterus) stretches → the pituitary gland releases the hormone oxytocin → stronger contractions → more stretch → more oxytocin… until the baby is born.',
    ],
    scene: 'l3-loop',
    from: 0,
    vars: { fb: 'pos' },
    takeaway: 'Positive feedback makes a change bigger (e.g. oxytocin in childbirth) and needs something to end it.',
    check: {
      q: 'Which is an example of positive feedback?',
      a: 'Oxytocin making uterine contractions stronger during childbirth',
      o: ['Shivering when body temperature falls', 'Sweating when body temperature rises', 'Panting on a hot day'],
      why: 'Stretch → oxytocin → stronger contractions → more stretch: the change keeps growing until birth ends it.',
    },
  },
  {
    title: 'Microhabitats, and small vs large animals',
    say: [
      'Now Chapter 29.1: animals in real environments. An adaptation only makes sense in the place an animal lives. A microhabitat (or microenvironment) is a small spot that’s different from the area around it, like a burrow or the shade under a rock. The conditions there are its microclimate.',
      'Small animals mostly use behavior. They have a larger surface area to volume ratio (lots of skin for their size, so they gain and lose heat fast) and a higher metabolic rate, so holding their temperature is expensive. But it’s easy for them to duck into a microhabitat. Large animals have fewer hiding options, so they rely more on physiology (how their body works inside).',
    ],
    takeaway: 'Small animals cope with behavior (microhabitats); large animals depend more on physiology.',
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
      'Reindeer show phenotypic plasticity (the same animal changing its body to fit the season). In winter their metabolic rate is much lower than a human’s, they add insulation, and they use regional hypothermia: letting their legs run colder than the core (the center of the body). The Arctic fox does it too: just enough heat goes to its foot pads to keep them near, but never below, freezing. That way they don’t melt the snow and stay dry.',
      'The trick is countercurrent heat exchange (an artery and a vein running side by side, with blood flowing in opposite directions). Watch the warm artery hand its heat across to the cold vein right next to it, so the heat goes back to the core.',
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
      'Compare the heat-loss bar with the side-by-side version. Running the two vessels next to each other, in opposite directions, is what saves the heat.',
    ],
    scene: 'l3-fox',
    from: 0,
    vars: { cc: 'off' },
    takeaway: 'Without countercurrent exchange, lots of body heat is wasted through the legs.',
    check: {
      q: 'What does countercurrent heat exchange in an Arctic fox’s leg do?',
      a: 'Keeps most heat in the core while the paws stay just above freezing',
      o: ['Keeps the paws as warm as the core', 'Lets the paws freeze solid to save energy', 'Melts the snow under the paws for traction'],
      why: 'Warm blood in the artery passes its heat to the cold blood coming back in the vein, so the heat returns to the body.',
    },
  },
  {
    title: 'Hot deserts: hide or tolerate',
    say: [
      'Hot deserts have two problems: not enough water and very high temperatures. Watch a full day. The small kangaroo rat heads into its cool burrow (a microhabitat) and only comes out at night: it’s nocturnal (active at night).',
      'The big Grant’s gazelle can’t hide, so watch its core temperature climb to about 46 °C. Because it doesn’t sweat, it saves water, and a countercurrent system keeps its brain cooler than the rest of its body. Small animal = behavior, large animal = physiology, just like step 10.',
    ],
    scene: 'l3-desert',
    from: 0,
    takeaway: 'Kangaroo rats avoid heat with behavior; Grant’s gazelles put up with a ~46 °C core to save water.',
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
      'Homeotherms keep a steady temperature, cheapest inside the TNZ, and pay for it with higher metabolic rates and more food. Poikilotherms follow the outside temperature but can bask or hide. Heat is made by shivering and brown fat, kept in by insulation and countercurrent flow, and lost by evaporation.',
      'Negative feedback (sensors → hypothalamus → effectors) runs the thermostat; positive feedback makes changes bigger instead. In extreme places, small animals use behavior and microhabitats, while large ones use physiology like regional hypothermia.',
    ],
    takeaway: 'Make heat, keep heat, lose heat, all steered by negative feedback, with behavior or physiology depending on body size.',
  },
];
