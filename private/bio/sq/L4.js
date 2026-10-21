// Lecture 4 · Ch 30 · Study question model answers (gas exchange and breathing).
// One entry per question, in the same order as the professor’s study sheet.
export default [
  {
    q: 'Explain O₂ diffusion in terms of partial pressure gradients.',
    a: 'Partial pressure is the share of the total gas pressure that comes from one gas (written PO₂ for oxygen). Think of it as how hard that gas is “pushing.” Gases always diffuse (spread passively) from high partial pressure to low, and no energy or pump is needed. O₂ goes downhill the whole way: about 100 mmHg in the alveoli (lung air pockets), about 40 mmHg in the blood arriving at the lungs, and under 40 in body cells. So O₂ moves lungs → blood → cells, and CO₂ goes the opposite way because its partial pressure is highest in the cells.'
  },
  {
    q: 'Explain the difference between diffusion and bulk flow in terms of O₂ movement.',
    a: '• Bulk flow: a whole fluid (air, water or blood) moves together and carries the O₂ along with it, like a conveyor belt. Breathing air into the lungs and blood circulating are bulk flow.\n• Diffusion: individual O₂ molecules spread from high to low partial pressure across a thin barrier, like hopping off the belt and walking the last bit. O₂ crossing from the alveolus into the blood, and from the blood into cells, is diffusion.\n• The two take turns, and both are passive. O₂ and CO₂ are never actively pumped.'
  },
  {
    q: 'Explain what occurs at each of the 4 main steps of external respiration. Refer to the figures on slides 10 and 11 of the PowerPoint slides.',
    a: 'Those slides show O₂’s path from the air to the mitochondria (the site of internal respiration). External respiration has four alternating steps:\n• ① Bulk flow: breathing (ventilation) moves air into the alveoli.\n• ② Diffusion: O₂ crosses the thin alveolus and capillary walls into the blood (PO₂ about 100 in the air vs 40 in the arriving blood).\n• ③ Bulk flow: circulating blood carries O₂ to the tissues, mostly bound to hemoglobin in red blood cells.\n• ④ Diffusion: O₂ moves from the blood (about 100) into body cells (under 40), where mitochondria use it.\nCO₂ follows the same four steps in reverse.'
  },
  {
    q: 'Explain the difference between tidal and flow-through ventilation. Which would typically result in greater partial pressure differences for gas exchange?',
    a: '• Tidal ventilation: air goes in and out through the same tubes into dead-end sacs, like a tide (mammals). Some stale air (the residual volume) always stays behind and mixes with fresh air, so the PO₂ in the lungs is lowered.\n• Flow-through (unidirectional) ventilation: air or water moves one way across the exchange surface (fish gills, bird lungs), so fresh and used never mix.\n• Flow-through gives the greater partial pressure differences. The exchange surface always meets fresh, O₂-rich air or water, so the gradient into the blood stays steep.'
  },
  {
    q: 'How does perfusion affect gas exchange across membranes?',
    a: 'Perfusion is blood flow through the capillaries of a gas exchange surface. As O₂ diffuses into the blood, flowing blood carries it away, so new low-O₂ blood keeps arriving and the partial pressure gradient stays steep. If perfusion is too slow, the blood fills up with O₂ and evens out with the air, and diffusion slows or stops. So good gas exchange needs both ventilation (fresh air or water on one side) and perfusion (fresh blood on the other side) to keep up.'
  },
  {
    q: 'Why is respiration more difficult (less efficient) in water than in air? How would sea turtle eggs be affected if the nest was flooded with water?',
    a: '• Water holds much less O₂ than air at the same partial pressure, because O₂ has low solubility (how much can dissolve) in water. Warm water holds even less.\n• O₂ also diffuses much more slowly through water than through air.\n• Sea turtle eggs in moist sand get O₂ through the air spaces between sand grains. If the nest floods, O₂ has to diffuse through water, which is far too slow. PO₂ around the eggs drops, and the embryos suffocate and die.\n• Also, water is much denser and thicker than air, so pumping it over a gas exchange surface costs more energy. (Not covered in the site’s notes; check your slides.)'
  },
  {
    q: 'What makes gas exchange in fish gills so efficient? Explain countercurrent exchange as it relates to gas exchange in fish gills.',
    a: '• Huge surface area: each gill arch has two rows of filaments, and each filament is covered in thin secondary lamellae (plates) where exchange happens.\n• Unidirectional flow: water goes one way only, in the mouth, over the gills and out under the opercular flaps (gill covers), so fresh water is always arriving.\n• Countercurrent exchange: blood in each lamella flows the opposite way to the water. Everywhere along the lamella, the blood meets water with a little more O₂ than it has, so O₂ keeps diffusing in the whole way. The blood leaves about 90% full of O₂. If both flowed the same way, they would even out at about 50% and exchange would stop.'
  },
  {
    q: 'Explain the differences between ventilation in birds vs. mammals in terms of air sacs and crosscurrent exchange. Which system is more efficient for gas exchange?',
    a: '• Mammals: tidal breathing. Air goes in and out the same airways into dead-end alveoli, so fresh and stale air mix.\n• Birds: air sacs act like bellows (no gas exchange happens in them) and push air one way through tiny tubes in the lungs called parabronchi. One puff takes two full breaths: inhale 1 → posterior sacs, exhale 1 → lungs, inhale 2 → anterior sacs, exhale 2 → out. Fresh and used air never mix.\n• Crosscurrent exchange: in bird lungs, blood capillaries cross the parabronchi at roughly right angles to the airflow. Each bit of blood meets air that is still fairly O₂-rich, so the blood leaving the lung can hold more O₂ than the air leaving it.\n• The bird system is more efficient, which helps birds get the very high O₂ delivery needed for flight. (Not covered in the site’s notes; check your slides.)'
  },
  {
    q: 'What are tidal volume, respiratory minute volume and residual volume? How do these change with exercise?',
    a: '• Tidal volume: the amount of air you move in and out in one breath.\n• Respiratory minute volume: total air breathed per minute = tidal volume × breaths per minute.\n• Residual volume: air that always stays in the lungs, even after a hard exhale. It keeps the lungs from collapsing.\n• With exercise, muscles make more CO₂, so you breathe both deeper (higher tidal volume) and faster, and minute volume goes way up. Residual volume stays about the same, since the lungs never fully empty.'
  },
  {
    q: 'What parts of the brain control breathing rhythm in mammals?',
    a: 'The main control center is the medulla oblongata, the base of the brainstem. It senses CO₂ (through pH) and sets the rhythm and depth of breathing by signaling the diaphragm and rib muscles. It works by negative feedback. Groups of neurons in the medulla generate the basic rhythm, and the pons (just above the medulla in the brainstem) helps smooth and adjust it. You can also override breathing for a short time on purpose (holding your breath) using the cerebral cortex. (Not covered in the site’s notes; check your slides.)'
  },
  {
    q: 'If partial pressure of CO₂ in the blood increases, how does this affect blood pH and breathing rate? Where are the detectors for blood pH changes?',
    a: 'More CO₂ in the blood makes more H⁺ (acid), so blood pH falls (becomes more acidic). The medulla oblongata in the brainstem senses this pH drop and drives faster, deeper breathing (higher minute volume) to blow off the extra CO₂ until pH is back to normal. That is negative feedback. Rising CO₂ is the main everyday trigger for breathing, more than low O₂. (Chemoreceptors in the carotid arteries and aorta can also pick up some pH changes, but the course notes focus on the medulla.)'
  },
  {
    q: 'If partial pressure of O₂ in the blood decreases, how does this affect breathing rate? Where are the detectors for blood O₂ levels?',
    a: 'A drop in blood PO₂ makes you breathe faster and deeper. The detectors are chemoreceptors (chemical sensors) in the aorta and the carotid arteries (the big arteries in the neck). They signal the medulla, which increases breathing. Low O₂ is a backup signal, though: normally rising CO₂ (falling pH) is the main thing that drives breathing.'
  },
];
