// Lecture 5 · Ch 30 · Study question model answers (circulation).
// One entry per question, in the same order as the professor’s study sheet.
export default [
  {
    q: 'Explain the important components of a closed circulatory system.',
    a: 'Every circulatory system has three parts: a pump (the heart), a fluid (blood) and pipes (blood vessels). In a closed system, like ours and all vertebrates’, the blood never leaves the vessels. The path is heart → arteries (big vessels leaving the heart) → arterioles (small branches) → capillaries (tiniest vessels, one cell thick, where O₂, nutrients and wastes are swapped) → venules → veins → back to the heart. Arterioles, capillaries and venules together are called the microcirculation. Blood moving through the vessels is bulk flow, so delivery is fast.'
  },
  {
    q: 'What mechanism in the arterioles controls the rate of blood flow through the capillaries?',
    a: 'Vasomotor control. Arterioles have smooth muscle in their walls that can tighten (narrowing the vessel, less flow) or relax (widening it, more flow). This works like turning valves on a sprinkler system, sending more blood to the capillary beds that need it most (for example, working muscles) and less to others. It is also where blood pressure drops the most.'
  },
  {
    q: 'Explain the basic characteristics of an open circulatory system.',
    a: 'In an open system (arthropods like insects and crabs, and most mollusks like snails), the heart pumps the fluid out of the vessels, and it sloshes freely around the organs instead of staying in pipes. Because it mixes with the fluid between cells (interstitial fluid), the two can’t be told apart, so it’s called hemolymph. It then drifts back to the heart. Open systems run at lower pressure and deliver more slowly than closed ones. In insects this works fine because their tracheal tubes bring O₂ straight to the cells.'
  },
  {
    q: 'Where is hemoglobin in the body and what does it do?',
    a: 'Hemoglobin is inside red blood cells (erythrocytes). It is a respiratory pigment, a colored protein that binds O₂ reversibly (it can grab O₂ and let it go again). Plasma can dissolve only a little O₂, so hemoglobin lets blood carry far more. Each hemoglobin has 4 binding sites, each holding one O₂. It loads O₂ in the lungs (oxygenation) and drops it off in the tissues (deoxygenation).'
  },
  {
    q: 'How does partial pressure of O₂ in the blood affect the percent of hemoglobin that is bound to O₂?',
    a: 'The higher the PO₂, the more hemoglobin is bound to O₂ (its percent saturation), but the relationship is an S-shaped curve (the oxygen equilibrium curve), not a straight line. In the lungs PO₂ is high (about 100 mmHg), so hemoglobin is almost 100% full. In tissues PO₂ is lower (about 40), so hemoglobin lets some O₂ go. The middle of the curve is steep, so a small drop in PO₂ makes hemoglobin release a lot of O₂.'
  },
  {
    q: 'How does exercise affect heart performance (stroke volume, heart rate) and hemoglobin-O₂ interactions?',
    a: '• Heart: heart rate (beats per minute) and stroke volume (blood pushed out per beat) both go up, so cardiac output (heart rate × stroke volume) rises a lot.\n• Hemoglobin: working muscle uses up O₂, so its PO₂ is much lower. On the steep part of the S-curve this makes hemoglobin unload much more O₂ there. Supply automatically matches demand.\n• Extra boost: exercising muscle also makes more CO₂, acid and heat, which lower hemoglobin’s grip on O₂ (the curve shifts right, called the Bohr effect), so even more O₂ is released. (Not covered in the site’s notes; check your slides.)'
  },
  {
    q: 'How many heart chambers do mammals, birds, amphibians, and fish typically have?',
    a: '• Mammals: 4 (two atria, two ventricles)\n• Birds: 4\n• Amphibians: 3 (two atria, one ventricle)\n• Fish: 2 (one atrium, one ventricle)\nAtria are the receiving chambers; ventricles are the pumping chambers.'
  },
  {
    q: 'In a mammal, starting with the vena cava, explain the blood flow through all chambers of the heart, through pulmonary blood flow, and then out of the heart to the systemic tissues. Explain when/where the blood is oxygen-rich or oxygen-depleted.',
    a: '• O₂-depleted blood from the body comes in through the vena cava → right atrium.\n• Through a one-way valve → right ventricle (still O₂-poor).\n• The right ventricle pumps it through the pulmonary arteries → lungs. These arteries carry O₂-poor blood, because “artery” means away from the heart, not “O₂-rich.”\n• In the lung capillaries it drops CO₂ and picks up O₂, becoming O₂-rich.\n• O₂-rich blood returns through the pulmonary veins → left atrium → left ventricle.\n• The left ventricle, the thickest and strongest chamber, pumps it out the aorta to the systemic (body) tissues. There it gives up O₂ and picks up CO₂, becoming O₂-depleted again on its way back to the vena cava.'
  },
  {
    q: 'What are systole and diastole, and how do they relate to blood pressure readings?',
    a: 'Systole is when the ventricles contract and push blood out, so arterial pressure is at its highest. Diastole is when the ventricles relax and refill, so arterial pressure is at its lowest. A blood pressure reading gives both as “systolic over diastolic” in mmHg; for example, 120/80 means 120 at peak (systole) and 80 at rest between beats (diastole). (Not covered in the site’s notes; check your slides.)'
  },
  {
    q: 'What are the functions of the SA node, the AV node, and the conducting system in the electrical activity of the heart?',
    a: '• SA (sinoatrial) node: the pacemaker, a patch of special muscle cells in the wall of the right atrium that fire on their own (the heart is “myogenic,” so no brain signal is needed). It sets the heart rate and starts each beat, which spreads across both atria so they contract.\n• AV (atrioventricular) node: a relay between atria and ventricles. It delays the signal briefly so the atria finish emptying into the ventricles.\n• Conducting system: after the AV node, special fibers carry the signal quickly down the septum (the wall between the ventricles) and through the ventricles, so they squeeze together from the bottom up and push blood out.'
  },
  {
    q: 'How do epinephrine, sympathetic, and parasympathetic stimulation affect heart rate and stroke volume?',
    a: 'The SA node sets the beat on its own, but nerves and hormones adjust it:\n• Epinephrine (adrenaline, a hormone from the adrenal glands during stress or fright): raises heart rate and stroke volume (stronger beats).\n• Sympathetic nerves (“fight or flight”): also raise heart rate and stroke volume.\n• Parasympathetic nerves (“rest and digest”): slow the heart rate down.'
  },
  {
    q: 'In an ECG/EKG readout, what do the P wave, the QRS complex, and the T wave represent?',
    a: 'An ECG records the heart’s electrical waves through stickers on the skin. Depolarization is the electrical “fire” signal that makes muscle contract; repolarization is the reset afterward.\n• P wave: the atria depolarize (then contract).\n• QRS complex: the ventricles depolarize (then contract). It’s the big spike. The atria’s reset is hidden inside it.\n• T wave: the ventricles repolarize (reset) before the next beat.'
  },
  {
    q: 'What is coronary circulation, and why is it so dangerous if coronary vessels are blocked?',
    a: 'Coronary circulation is the set of coronary arteries that wrap around the heart and supply the heart muscle (myocardium) itself with blood. The heart can’t use the blood inside its chambers for its own O₂. If a coronary artery is blocked (coronary artery disease is common), the heart muscle beyond the blockage gets no O₂ and starts to die. That is a heart attack, and it can stop the heart from pumping properly.'
  },
  {
    q: 'Which types of blood vessels function as reservoirs, holding large amounts of blood at very low blood pressure?',
    a: 'Veins (and venules). They have thin, stretchy walls and very low pressure, so they expand easily and hold most of the body’s blood at any moment, about 60–70% of it. When needed (for example, during exercise), the veins can tighten and send more of this stored blood back to the heart. (Not covered in the site’s notes; check your slides.)'
  },
  {
    q: 'What characteristics make the blood-brain barrier different from other parts of the circulatory system?',
    a: 'In most of the body, capillary walls are leaky, so water and many solutes (dissolved substances) pass through easily. In the brain and spinal cord, the capillary walls have no pores (their cells are sealed tightly together), so many solutes can’t get through. This blood-brain barrier acts like a strict security gate, protecting neurons from toxins and tightly controlling what reaches the brain.'
  },
  {
    q: 'What is unique about the capillaries in the kidney glomerulus?',
    a: 'They are the opposite of brain capillaries: very leaky, with lots of pores. The glomerulus is a little ball of these capillaries in the kidney. Blood pressure pushes lots of water and small solutes out through the pores into the kidney tubule to be filtered, which is the first step of making urine (more in Lecture 6).'
  },
  {
    q: 'In which type of blood vessel is blood pressure the lowest?',
    a: 'In the veins, especially the large veins closest to the heart (the vena cavae), where pressure is almost zero. Pressure is highest leaving the heart, drops the most in the arterioles, keeps falling through the capillaries, and is lowest in the veins. That’s why veins need one-way valves and squeezing skeletal muscles to get blood back to the heart. Don’t mix this up with speed: blood moves slowest in the capillaries.'
  },
  {
    q: 'Blood pressure tends to force fluid out of capillaries. What force opposes this blood pressure by pushing fluid back into the capillaries?',
    a: 'Osmotic pressure from the plasma proteins. Big proteins stay in the blood because they are too large to leak out, and they pull water toward them like little sponges. At the artery end, blood pressure (hydrostatic pressure, a fluid pushing on its container) is stronger, so fluid leaks out. At the vein end, blood pressure has dropped, so the proteins’ osmotic pull wins and some water moves back in.'
  },
  {
    q: 'What mechanism returns fluid from interstitial tissues back to the circulatory system?',
    a: 'The lymphatic system. Not all the fluid that leaks out of capillaries gets pulled back in; about 2–4 liters a day stays in the interstitial fluid (the fluid around cells). Tiny lymphatic capillaries soak up this extra fluid (now called lymph), join into bigger lymph vessels, and empty it back into veins in the neck. Without this, tissues would swell.'
  },
  {
    q: 'Explain how a countercurrent system helps to keep swimming muscles warm in tuna.',
    a: 'In a tuna, the arteries and veins serving the red swimming muscle run side by side with blood flowing in opposite directions (countercurrent: “counter” = opposite, “current” = flow). Cold blood coming in from the gills flows in the artery toward the muscle. Warm blood leaving the muscle in the vein passes right next to it and hands its heat across, all along the way. So the incoming blood warms up before it reaches the muscle, and the heat loops back to the muscle instead of being lost to the cold water. It’s the same trick as the fox’s leg and the fish gill.'
  },
];
