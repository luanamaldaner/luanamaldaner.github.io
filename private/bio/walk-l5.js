// Guided lecture · L5 · Circulation (Ch 30.4–30.6)
export default [
  {
    title: 'What this lecture is about',
    say: [
      'Last lecture, O₂ got from the air into the blood. This lecture is about how blood carries it (plus nutrients, hormones, heat and wastes) all around the body, fast.',
      'In order: the parts of a circulatory system, what blood is made of, how hemoglobin carries O₂, how the heart pumps and keeps its own beat, and finally the blood vessels, capillary leaks, lymph and a tuna’s heat trick.',
    ],
    takeaway: 'Circulation is bulk flow of blood that delivers O₂ and other materials rapidly around the body.',
  },
  {
    title: 'Pump, fluid and pipes',
    say: [
      'A circulatory system has three parts: a muscular pump (the heart), a fluid (blood) and a series of conduits (blood vessels). Remember bulk flow from Lecture 4? Blood moving as a whole is bulk flow.',
      'Vertebrates have a closed system: blood always stays inside vessels. The heart pumps into arteries → smaller arterioles → microscopic capillaries → venules → bigger veins → back to the heart. Arterioles, capillaries and venules make up the microcirculation.',
      'Capillary walls are only vascular endothelium, under 1 micron thick, and blood cells pass through one at a time. Capillaries sit near every cell and are the main sites of exchange.',
    ],
    takeaway: 'Closed system: heart → arteries → arterioles → capillaries → venules → veins → heart.',
    check: {
      q: 'Which vessels make up the microcirculation?',
      a: 'Arterioles, capillaries and venules',
      o: ['Arteries, veins and the aorta', 'Only the capillaries', 'The heart chambers and valves'],
      why: 'The slides define the microcirculation as arterioles + capillaries + venules.',
    },
  },
  {
    title: 'Open systems and what blood is',
    say: [
      'In an open circulatory system (arthropods and most mollusks), blood leaves the vessels as it flows through the body. There’s no difference between blood and interstitial fluid, so some biologists call it hemolymph.',
      'Blood is plasma plus cells. Plasma is water with solutes: glucose, ions, wastes, hormones, clotting proteins and O₂. Red blood cells (erythrocytes) contain hemoglobin; white blood cells (leukocytes) work in immune responses; and platelets (cell fragments) help blood clot.',
    ],
    takeaway: 'Open systems use hemolymph; vertebrate blood = plasma + red cells + white cells + platelets.',
    check: {
      q: 'Which blood component is a cell fragment involved in clotting?',
      a: 'Platelets',
      o: ['Erythrocytes', 'Leukocytes', 'Plasma'],
      why: 'Platelets are cell fragments for clotting; erythrocytes carry hemoglobin; leukocytes do immunity.',
    },
  },
  {
    title: 'Hemoglobin loads and unloads O₂',
    say: [
      'Respiratory pigments like hemoglobin greatly increase how much O₂ blood can carry, and they bind it reversibly. Picking up O₂ in the lungs is oxygenation; releasing it in the tissues is deoxygenation.',
      'Watch the dot ride along the S-shaped oxygen equilibrium curve. In the lungs O₂ is high, so hemoglobin fills right up (bright red). Out in the tissues O₂ is lower, so it lets some go.',
    ],
    scene: 'l5-hb',
    from: 0,
    vars: { mode: 'rest' },
    takeaway: 'Hemoglobin picks up O₂ where O₂ is high (lungs) and releases it where O₂ is low (tissues).',
  },
  {
    title: 'Working muscle gets more',
    say: [
      'Now switch the tissue to “Working muscle”. Working muscle has even less O₂, so watch the dot slide further down the curve and the percentage given up jump.',
      'Because the curve is steep in the middle, a small drop in O₂ releases a lot. Supply automatically follows demand, like a delivery driver dropping off more boxes at the busiest houses.',
    ],
    scene: 'l5-hb',
    from: 3.6,
    vars: { mode: 'run' },
    takeaway: 'The lower the O₂ in a tissue, the more O₂ hemoglobin unloads there.',
    check: {
      q: 'Releasing O₂ from hemoglobin in the tissues is called…',
      a: 'Deoxygenation',
      o: ['Oxygenation', 'Depolarization', 'Filtration'],
      why: 'Oxygenation = loading in the lungs; deoxygenation = unloading in the tissues.',
    },
  },
  {
    title: 'The heart’s two loops',
    say: [
      'Fish hearts mostly have 2 chambers, amphibians 3, and mammals and birds 4: two atria and two ventricles. One-way valves keep blood flowing the right direction. The heart muscle is the myocardium.',
      'Follow the glowing parts: ① O₂-poor blood from the body enters the right atrium, ② drops into the right ventricle, ③ is pumped through the pulmonary arteries to the lungs, ④ comes back O₂-rich to the left atrium, ⑤ into the left ventricle, ⑥ and out the aorta to the body.',
    ],
    scene: 'l5-heart',
    from: 0,
    vars: { mode: 'rest' },
    takeaway: 'Right side → lungs; left side → body. Atrium → ventricle → artery, with valves preventing backflow.',
    check: {
      q: 'O₂-rich blood returning from the lungs first enters the…',
      a: 'Left atrium',
      o: ['Right atrium', 'Right ventricle', 'Aorta'],
      why: 'Lungs → left atrium → left ventricle → aorta → body.',
    },
  },
  {
    title: 'Cardiac output and the cardiac cycle',
    say: [
      'Cardiac output is the volume of blood pumped per minute. It depends on heart rate (how fast the heart beats) and stroke volume (blood pumped per beat). Toggle is on “Exercising”: watch both numbers rise, and cardiac output with them.',
      'Watch the label under the heart too. The cardiac cycle is contraction and relaxation: systole is when the ventricles contract (max pressure), diastole is when they relax and fill (min pressure).',
    ],
    scene: 'l5-heart',
    from: 0,
    vars: { mode: 'run' },
    takeaway: 'Cardiac output = heart rate × stroke volume; both go up during exercise.',
    check: {
      q: 'During systole, the ventricles are…',
      a: 'Contracting, at maximum pressure',
      o: ['Relaxing and filling', 'At minimum pressure', 'Electrically resetting'],
      why: 'Systole = ventricles contract (max pressure); diastole = they relax (min pressure).',
    },
  },
  {
    title: 'What makes the heart beat',
    say: [
      'The heartbeat starts in pacemaker cells of the sinoatrial (SA) node in the right atrial wall. These modified muscle cells fire on their own (myogenic), so no brain signal is needed.',
      'In slow motion, watch the wave: it spreads over the atria (P wave), reaches the atrioventricular (AV) node, then spreads through the ventricles (QRS spike), which contract. Then the ventricles reset (T wave). An ECG records these voltage changes from the body surface.',
    ],
    scene: 'l5-ecg',
    from: 0,
    vars: { speed: 'slow' },
    takeaway: 'SA node → atria (P) → AV node → ventricles (QRS) → reset (T).',
    check: {
      q: 'On an ECG, the QRS complex shows…',
      a: 'Ventricular depolarization',
      o: ['Atrial depolarization', 'Ventricular repolarization', 'The SA node resting'],
      why: 'P = atria depolarize, QRS = ventricles depolarize, T = ventricles repolarize.',
    },
  },
  {
    title: 'Feeding the heart, and adjusting the pace',
    say: [
      'The heart muscle needs its own blood supply: the coronary circulation. Coronary artery disease is common, and blocked coronary arteries can lead to a heart attack.',
      'Watch it at real speed, about 70 beats a minute. The heart beats on its own but is still under extrinsic control. Epinephrine from the adrenal glands (fright or stress) raises heart rate and stroke volume. Sympathetic nerves (high stress/energy) do the same; parasympathetic nerves (relaxed) slow the heart down.',
    ],
    scene: 'l5-ecg',
    from: 0,
    vars: { speed: 'real' },
    takeaway: 'Coronary arteries feed the heart; sympathetic and epinephrine speed it up, parasympathetic slows it.',
    check: {
      q: 'Which input slows the heart rate?',
      a: 'Parasympathetic stimulation',
      o: ['Sympathetic stimulation', 'Epinephrine from the adrenal glands', 'A rush of fright or stress'],
      why: 'Parasympathetic (relaxed) lowers heart rate; the other three raise it.',
    },
  },
  {
    title: 'Arteries, arterioles and the pressure drop',
    say: [
      'Now the vessels. Arteries leaving the heart take high pressure, so they have thick walls of elastic fibers and smooth muscle. Small arteries and arterioles use their smooth muscle for vasomotor control, sending blood to the capillary beds that need it.',
      'Watch the pressure graph under the vessel as the highlight moves along. Pressure stays high in the big arteries, then drops a lot in the arterioles, keeps falling through the capillaries, and is very low in the veins.',
    ],
    scene: 'l5-vessels',
    from: 0,
    takeaway: 'Blood pressure is high in arteries and falls through arterioles and capillaries to very low in veins.',
  },
  {
    title: 'Capillaries and veins',
    say: [
      'In the capillaries, watch the cells go single file and slow down, and turn from red to blue as they hand off O₂.',
      'In veins, pressure is very low and the walls are thinner and stretch easily. Watch the muscle bumps squeeze the vein and the little valve flaps open: contracting skeletal muscles push blood along, and one-way valves stop it from flowing back. Like squeezing toothpaste up a tube that only lets it go one way.',
    ],
    scene: 'l5-vessels',
    from: 8,
    takeaway: 'Veins rely on skeletal muscle squeezes and one-way valves to get blood back to the heart.',
    check: {
      q: 'What helps push blood through veins, where pressure is very low?',
      a: 'Skeletal muscle contractions, with one-way valves preventing backflow',
      o: ['Thick elastic walls recoiling', 'Vasomotor control by the arterioles', 'The SA node firing in the vein wall'],
      why: 'Squeezing skeletal muscles push venous blood along and valves keep it from sliding back.',
    },
  },
  {
    title: 'Special capillaries: brain and kidney',
    say: [
      'Not all capillaries are alike. In the brain and spinal cord, capillary walls have no pores, so many solutes can’t cross. That’s the blood–brain barrier: it protects neurons from toxins and allows tight control of what gets exchanged.',
      'The kidney is the opposite. Capillaries in the glomerulus have many pores and let many solutes through, and blood pressure drives fluid and solutes into the kidney. (The kidney also helps regulate blood pressure; more in Lecture 6.)',
    ],
    takeaway: 'Brain capillaries have no pores (blood–brain barrier); glomerular capillaries are very porous.',
    check: {
      q: 'Why can’t many solutes cross brain capillaries?',
      a: 'Their walls have no pores',
      o: ['Blood pressure is too high there', 'They are lined with smooth muscle', 'They have one-way valves'],
      why: 'The blood–brain barrier comes from pore-less capillary walls, which protect neurons.',
    },
  },
  {
    title: 'Fluid leaks out of capillaries',
    say: [
      'Capillaries are so permeable that blood pressure (hydrostatic pressure) squeezes fluid out. Watch the artery end: water arrows point outward.',
      'Then watch the vein end. Pressure has dropped, and the blood’s osmotic pressure (from the dissolved proteins left behind) is now stronger, so some water moves back in. Think of the proteins as little sponges pulling water home.',
    ],
    scene: 'l5-exchange',
    from: 0,
    takeaway: 'Artery end: pressure pushes fluid out. Vein end: protein osmotic pressure pulls some back in.',
    check: {
      q: 'At the artery end of a capillary, fluid moves…',
      a: 'Out, because blood pressure beats the osmotic pull',
      o: ['In, because of the plasma proteins', 'Nowhere, the wall is sealed', 'Out, because the proteins leave too'],
      why: 'Blood pressure is high at the start; later it drops below the proteins’ osmotic pull and some water returns.',
    },
  },
  {
    title: 'Lymph brings the rest back',
    say: [
      'Not all the water comes back. The net effect is a loss of 2–4 liters of fluid into a person’s interstitial fluids every day.',
      'Watch the lymph vessel collect the leftover fluid. Lymphatic capillaries keep taking up the extra, merge into bigger and bigger vessels, and finally empty into veins in the neck.',
    ],
    scene: 'l5-exchange',
    from: 8,
    takeaway: 'The lymphatic system returns the 2–4 L/day of leaked fluid to the blood via veins in the neck.',
  },
  {
    title: 'A tuna’s warm muscles',
    say: [
      'Countercurrent heat exchange depends on arteries and veins running side by side in opposite directions (same idea as the fox’s leg and fish gills). Tuna use it to keep their red swimming muscles warm.',
      'The red muscle makes a lot of heat. Watch the colors: cold blue blood flows in along the artery, and the warm blood leaving the muscle passes its heat across, so the incoming blood warms up and the heat goes back to the muscle instead of out to the cold water.',
    ],
    scene: 'l5-tuna',
    from: 0,
    takeaway: 'Side-by-side, opposite-flowing arteries and veins keep a tuna’s swimming muscles warm.',
    check: {
      q: 'In a tuna’s countercurrent system, where does the heat from the red muscle mostly end up?',
      a: 'Back in the swimming muscle',
      o: ['Lost to the cold water through the skin', 'Stored in the liver', 'Carried to the gills to be released'],
      why: 'Outgoing warm blood heats the incoming blood, so heat loops back to the muscle.',
    },
  },
  {
    title: 'Putting it together',
    say: [
      'The heart (pump) pushes blood (fluid) through vessels (pipes). Hemoglobin loads O₂ in the lungs and unloads it where O₂ is low. The 4-chambered heart runs two loops, sets its own beat from the SA node, and is tuned by nerves and epinephrine.',
      'Pressure falls from arteries to veins. Capillaries leak fluid out and pull some back; lymph returns the rest. And countercurrent flow keeps heat where it’s needed.',
    ],
    takeaway: 'Pump + blood + vessels deliver O₂ fast, with pressure, valves and lymph keeping everything flowing.',
  },
];
