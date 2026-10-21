// Study questions · Lecture 3 · Ch 28, 29 · Animals and temperature: thermoregulation
// Model answers grounded in l3.js + walk-l3.js, in the same order as the professor’s sheet.
export default [
  {
    q: 'Explain the concept of homeostasis, and explain the difference between a homeotherm and poikilotherm.',
    a: 'Homeostasis means a stable internal environment, plus the body systems that keep it stable; it keeps things steady but costs energy. A homeotherm (“same temperature”, e.g. mammals and birds) keeps its body temperature constant. A poikilotherm (“varied temperature”, also called an ectotherm because its heat comes from outside) has a body temperature that goes up and down with the outside temperature. Most animals are poikilotherms.',
  },
  {
    q: 'Explain the advantages and disadvantages of homeothermy vs. poikilothermy.',
    a: '• Homeothermy: advantage, a steady warm body means enzymes, muscles and digestion keep working well even when it’s cold outside; disadvantage, it’s expensive, with higher metabolic rates (especially in the cold), so they need much more food.\n• Poikilothermy: advantage, it’s cheap and needs much less food; disadvantage, the body cools with the air and the animal becomes slow and sluggish, though it can partly make up for that by basking or hiding in shade (behavioral thermoregulation).',
  },
  {
    q: 'Explain the ways that homeotherms heat and cool their bodies to maintain homeostasis.',
    a: 'Making heat:\n• Shivering: skeletal muscles contract over and over, and the ATP energy turns into heat.\n• Nonshivering thermogenesis: brown fat’s mitochondria are “uncoupled”, so H⁺ leaks back without making ATP and the energy comes out as heat.\nKeeping heat in:\n• Insulation (fur, feathers, fat) and countercurrent blood flow in the limbs.\n• Narrowing skin blood vessels (vasoconstriction) so less warm blood reaches the surface.\nLosing heat:\n• Evaporative cooling: sweating and panting; water soaks up a lot of heat as it evaporates.\n• Widening skin blood vessels (vasodilation) to send warm blood to the surface. (Not covered in the site’s notes; check your slides.)',
  },
  {
    q: 'Be able to draw a negative feedback loop for homeothermic thermoregulation, showing the controlled variable, sensors, control mechanism, and effectors.',
    a: 'Draw it as a circle of arrows:\n• Controlled variable: body temperature (set point about 37 °C).\n• Sensors: temperature receptors in the skin and brain detect a change.\n• Control mechanism: nerve cells in the hypothalamus compare the real temperature to the set point and decide what to do.\n• Effectors: too cold → shivering muscles and brown fat make heat; too hot → sweat glands (and panting) dump heat.\nThe effectors push the temperature back toward the set point, which feeds back to the sensors, and the effectors switch off once it’s back to normal. Memory trick: “Very Smart Control Engineers”.',
  },
  {
    q: 'Explain (in terms of homeostasis) how a positive feedback system differs from a negative feedback system.',
    a: 'Negative feedback opposes a change and brings the variable back toward its set point, so it maintains homeostasis (like a thermostat). Positive feedback does the opposite: the response pushes the same way as the change, making it bigger and bigger, so it pushes the system away from homeostasis. It’s only useful when something ends it, like childbirth: the cervix stretches → oxytocin is released → stronger contractions → more stretch → more oxytocin, until the baby is born.',
  },
  {
    q: 'Explain some differences in how (and reasons why) small and large mammals might deal with thermoregulation differently.',
    a: 'Small mammals have a larger surface area to volume ratio (lots of skin for their size), so they gain and lose heat fast, and they have a higher metabolic rate, so holding their temperature is expensive. But they can easily duck into a microhabitat (a burrow, under a rock), so they rely mostly on behavior; the kangaroo rat stays in its cool burrow by day and is nocturnal. Large mammals have fewer places to hide, so they rely more on physiology, like Grant’s gazelle letting its core heat up to about 46 °C instead of sweating.',
  },
  {
    q: 'Explain the concepts of phenotypic plasticity and regional hypothermia in terms of thermoregulation.',
    a: 'Phenotypic plasticity means the same animal can change its body to fit conditions, like the season. Reindeer do this in winter: their metabolic rate drops (much lower than a human’s) and they add insulation. Regional hypothermia means letting one region of the body, usually the legs and feet, run much colder than the core. Reindeer and Arctic foxes do this; the fox keeps its foot pads near, but never below, freezing, so they don’t melt the snow and stay dry, while saving body heat.',
  },
  {
    q: 'Explain how countercurrent heat exchange can be used to maintain parts of the body within certain temperature ranges.',
    a: 'In countercurrent heat exchange, an artery and a vein run side by side with blood flowing in opposite directions. In an Arctic fox’s leg, warm blood going down the artery hands its heat across to the cold blood coming back up the vein, all along their length. So the heat returns to the core instead of being lost to the snow, the core stays warm, and the paw gets blood just above freezing. If the vein were far from the artery, warm blood would dump its heat in the paw and cold blood would chill the core. Grant’s gazelle uses a countercurrent system to keep its brain cooler than its body.',
  },
  {
    q: 'Explain some ways (and examples) that behavioral thermoregulation and/or physiological adaptations can be used to maintain physiological function while reducing energy and water demands.',
    a: '• Basking: a lizard or alligator moves into the sun to warm up (or shade to cool down), so its enzymes, muscles and digestion work better without spending metabolic energy.\n• Microhabitats and night activity: the kangaroo rat hides in its cool burrow by day and comes out at night, avoiding heat and water loss.\n• Tolerating heat: Grant’s gazelle lets its core rise to about 46 °C instead of sweating, which saves water, while countercurrent exchange keeps its brain cooler.\n• Regional hypothermia and lower winter metabolism: reindeer and Arctic foxes let their legs run cold and use countercurrent exchange, saving energy in the cold.',
  },
];
