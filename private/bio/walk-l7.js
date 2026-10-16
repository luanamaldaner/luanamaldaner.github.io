export default [
  {
    title: 'What this lecture is about',
    say: [
      'You eat a sandwich. Hours later your cells are burning glucose and building proteins from it. This lecture is the story of how that happens: how a big chunk of food gets broken into tiny pieces and moved into your blood.',
      'We follow food in order: mouth, esophagus, stomach, small intestine (with help from the pancreas, liver and gallbladder), and finally the large intestine.',
    ],
    takeaway: 'Digestion = breaking food into building blocks small enough to absorb.',
  },
  {
    title: 'The gut is one long tube',
    scene: 'l7-gut', from: 0,
    say: [
      'Simple animals like cnidarians have a blind sac with one opening. Later animals have a tube with a mouth in and an anus out, split into foregut, midgut and hindgut. Fun twist: the inside of the tube (the lumen) is technically still the outside world until food is absorbed.',
      'Four jobs happen along the tube: motility (muscles mix and push), secretion (glands add juices), enzymatic hydrolysis (enzymes split food), and absorption. Watch the badges light up as the food lump travels.',
    ],
    takeaway: 'Gut jobs: motility, secretion, enzymatic hydrolysis, absorption.',
    check: {
      q: 'Why is food in your gut lumen considered "outside" your body?',
      a: 'The gut is a tube open to the environment at both ends',
      o: ['The gut has no blood supply', 'The gut is lined with skin', 'Food is not digested there'],
      why: 'Food only truly enters your body once it crosses the gut wall during absorption.',
    },
  },
  {
    title: 'Motility, secretion and hydrolysis',
    scene: 'l7-hydro', from: 0,
    say: [
      'Motility comes mostly from smooth muscle run by the autonomic nervous system, with skeletal muscle at the two ends (swallowing and the final exit). Secretions come from exocrine glands and contain water, electrolytes and organic molecules like enzymes.',
      'Now watch the animation: each enzyme snaps one bond by adding a water molecule. That is hydrolysis, "splitting with water." Carbs become monosaccharides (like glucose), proteins become amino acids, fats become monoglycerides + fatty acids, and nucleic acids become nucleotides.',
    ],
    takeaway: 'Hydrolysis uses water to split big food molecules into absorbable building blocks.',
    check: {
      q: 'Fats are hydrolyzed into…',
      a: 'Monoglycerides and fatty acids',
      o: ['Amino acids', 'Monosaccharides', 'Nucleotides'],
      why: 'Triglycerides are split into monoglycerides and free fatty acids.',
    },
  },
  {
    title: 'Mouth and swallowing',
    scene: 'l7-gut', from: 0,
    say: [
      'Chewing (mastication) grinds food into smaller pieces, which makes it easier to swallow and gives enzymes more surface. It also mixes food with saliva and wakes up your taste buds. Saliva has water, mucus, amylase (starts on starch) and bicarbonate (HCO₃⁻, neutralizes H⁺).',
      'Swallowing: the tongue pushes the lump (bolus) into the pharynx. Pressure sensors there tell the swallowing center in the medulla oblongata, and a ring-shaped wave of muscle (peristalsis) squeezes it down the esophagus. Watch the squeeze ride just behind the bolus.',
    ],
    takeaway: 'Saliva = water, mucus, amylase, bicarbonate. Swallowing is run by the medulla and moved by peristalsis.',
  },
  {
    title: 'The stomach and its cells',
    scene: 'l7-gut', from: 3,
    say: [
      'Watch the bolus slow down and churn in the stomach: it turns into a soupy mix called chyme. The stomach lining has gastric pits full of specialized cells.',
      'Mucous cells make mucus. Chief cells make pepsinogen. Parietal cells make HCl and intrinsic factor (helps absorb vitamin B). Hormone cells: G cells release gastrin, ECL cells release histamine, and D cells release somatostatin, which is the brake on HCl and pepsinogen.',
    ],
    takeaway: 'Parietal = HCl + intrinsic factor, chief = pepsinogen, G = gastrin, ECL = histamine, D = somatostatin.',
    check: {
      q: 'Which stomach cells secrete HCl?',
      a: 'Parietal cells',
      o: ['Chief cells', 'G cells', 'D cells'],
      why: 'Parietal cells make HCl and intrinsic factor; chief cells make pepsinogen.',
    },
  },
  {
    title: 'Three "go" signals for acid',
    scene: 'l7-acid', from: 0, vars: { meal: 'meal' },
    say: [
      'Three signals turn up acid. ① ACh from vagus (parasympathetic) nerves, even just from expecting food or stretch in the stomach. ② Gastrin from G cells, released in response to ACh, GRP from neurons, and higher stomach pH, proteins and peptides. ③ Histamine from ECL cells, released in response to gastrin; it acts on H2 receptors.',
      'Watch the three signals arrive at the parietal cell and speed up the pumps. Remember from step 5: somatostatin is the brake.',
    ],
    takeaway: 'ACh, gastrin and histamine all turn stomach acid up.',
  },
  {
    title: 'The proton pump',
    scene: 'l7-acid', from: 5, vars: { meal: 'meal' },
    say: [
      'Inside the parietal cell, CO₂ and water make H⁺ and HCO₃⁻. The H⁺/K⁺ ATPase (the proton pump) uses ATP to push H⁺ into the stomach and bring K⁺ in. Watch H⁺ going left into the stomach and HCO₃⁻ going right into the blood.',
      'So the stomach gets more acidic (lower pH) while the blood leaving it gets a bit less acidic (higher pH). Try the toggle "Empty stomach" to see the pumps slow down between meals.',
    ],
    takeaway: 'Proton pump: H⁺ out into the stomach, K⁺ in; HCO₃⁻ goes to the blood.',
    check: {
      q: 'The parietal cell proton pump exchanges…',
      a: 'H⁺ out for K⁺ in',
      o: ['Na⁺ out for K⁺ in', 'H⁺ out for Na⁺ in', 'HCO₃⁻ out for Cl⁻ in'],
      why: 'It is the H⁺/K⁺ ATPase; the leftover HCO₃⁻ exits into the blood.',
    },
  },
  {
    title: 'Pepsin, and why the stomach doesn’t digest itself',
    scene: 'l7-acid', from: 10, vars: { meal: 'meal' },
    say: [
      'Watch the pepsinogen lose its "lid" once the acid builds up. HCl (or pepsin itself) cuts inactive pepsinogen into active pepsin, which starts chopping proteins into smaller peptides. Protein digestion starts in the antrum.',
      'Making it inactive first is like shipping a knife in a sheath. The lining is also protected by bicarbonate-rich mucus (the gastric mucosal barrier) and replaced about every three days. When that barrier erodes, you get a peptic ulcer.',
    ],
    takeaway: 'HCl activates pepsinogen → pepsin; bicarbonate mucus protects the lining.',
  },
  {
    title: 'The pancreas joins in',
    scene: 'l7-gut', from: 11.5,
    say: [
      'The chyme now enters the duodenum, the first part of the small intestine. Watch the drips arriving here from the pancreas and from the liver/gallbladder.',
      'The exocrine pancreas adds HCO₃⁻, which neutralizes the stomach acid and activates enzymes, plus a mix of enzymes: protein-cutting ones, amylase (carbs), chitinase (chitin) and lipase (fats). Like pepsinogen, the protein-cutting enzymes are sent out inactive and only switched on in the duodenum.',
    ],
    takeaway: 'Pancreas → duodenum: bicarbonate to neutralize acid + enzymes (protein enzymes arrive inactive).',
    check: {
      q: 'What neutralizes stomach acid in the duodenum?',
      a: 'Bicarbonate (HCO₃⁻) from the pancreas',
      o: ['HCl from parietal cells', 'Pepsin from chief cells', 'Gastrin from G cells'],
      why: 'The pancreas secretes HCO₃⁻ into the duodenum, which neutralizes acid and lets its enzymes work.',
    },
  },
  {
    title: 'The liver: the body’s busy factory',
    say: [
      'Liver cells (hepatocytes) have a huge to-do list: make bile salts, process nutrients, detoxify wastes, hormones and drugs, make plasma proteins, store glycogen, fats, iron, copper and vitamins, activate vitamin D, remove bacteria and old red blood cells, and more (even buoyancy in sharks).',
      'Blood from the gut goes straight to the liver first through the hepatic portal system, so it gets first look at everything you absorb. The liver makes bile, the gallbladder stores it, and bile salts get recycled back to the liver.',
    ],
    takeaway: 'Liver makes bile, gallbladder stores it; gut blood reaches the liver first via the hepatic portal system.',
  },
  {
    title: 'Bile breaks up fat',
    scene: 'l7-bile', from: 0,
    say: [
      'Fat and water don’t mix, so fat clumps into big droplets, and lipase can only work at the surface. Bile salts work like dish soap: one end likes water (hydrophilic), the other likes fat (hydrophobic). Watch them coat the big droplet.',
      'Mixing then breaks it into smaller and smaller droplets. Same fat, way more surface for lipase. That is emulsification. The tiny bile-salt bundles that carry fat to the gut wall are called micelles.',
    ],
    takeaway: 'Bile salts emulsify fat (physical breakup, no enzymes), giving lipase more surface.',
    check: {
      q: 'How does bile help digest fat?',
      a: 'It emulsifies fat into small droplets with more surface area',
      o: ['It contains lipase that splits fat', 'It absorbs fat directly into blood', 'It turns fat into glucose'],
      why: 'Bile salts have water-loving and fat-loving ends, so they break big fat drops apart for lipase.',
    },
  },
  {
    title: 'A huge surface for absorption',
    say: [
      'The small intestine is built for absorbing. Its inner wall is folded, the folds are covered in finger-like villi, and each villus cell has tiny hair-like microvilli (the brush border). Together that is about 600 times more surface.',
      'Think of a towel: the loops make it soak up far more than a flat sheet. Most absorption happens in the duodenum and jejunum, the first two parts of the small intestine.',
    ],
    takeaway: 'Folds + villi + microvilli ≈ 600× more surface; most absorption is in the duodenum and jejunum.',
    check: {
      q: 'Where does most absorption happen?',
      a: 'Duodenum and jejunum',
      o: ['Stomach', 'Large intestine', 'Esophagus'],
      why: 'These first two parts of the small intestine do most of the absorbing.',
    },
  },
  {
    title: 'How glucose and amino acids get in',
    scene: 'l7-villi', from: 0,
    say: [
      'Brush-border enzymes finish splitting disaccharides into monosaccharides. Then watch Na⁺ and glucose ride through SGLT together: Na⁺ rushes "downhill" into the cell and drags glucose along. That is secondary active transport.',
      'Glucose leaves the other side through GLUT-2 into the blood (GLUT-5 handles fructose). Then the Na⁺/K⁺ pump spends ATP to throw Na⁺ back out, keeping the gradient ready for the next ride. Amino acids get in the same way.',
    ],
    takeaway: 'Glucose, galactose and amino acids enter with Na⁺ (secondary active transport); the Na⁺ gradient powers it.',
  },
  {
    title: 'Fats take a different exit',
    scene: 'l7-fat', from: 0,
    say: [
      'Remember the micelles from step 11. Watch one deliver fat to the cell: monoglycerides and fatty acids slip right through the membrane because they are fat-soluble. Inside, they are rebuilt into triglycerides.',
      'The triglycerides get wrapped in phospholipids and protein to form a chylomicron, which leaves by exocytosis. Chylomicrons are picked up by lacteals, which are lymph vessels, instead of blood capillaries.',
    ],
    takeaway: 'Fats → rebuilt into triglycerides → chylomicrons → lacteals (lymph), not blood capillaries.',
    check: {
      q: 'Where do chylomicrons go after leaving the intestinal cell?',
      a: 'Into lacteals (lymph vessels)',
      o: ['Directly into blood capillaries', 'Back into the gut lumen', 'Into the gallbladder'],
      why: 'Chylomicrons are picked up by the lymphatic lacteals in each villus.',
    },
  },
  {
    title: 'The large intestine',
    scene: 'l7-gut', from: 19.8,
    say: [
      'By the time food reaches the colon, most nutrients are already gone. A human colon gets about 500 mL of indigestible chyme a day. Watch the water dots leaving the tube.',
      'The colon’s main job is storing fecal material. It also absorbs water and salt, friendly microbes make vitamins like vitamin K, and undigested cellulose adds bulk.',
    ],
    takeaway: 'Colon: stores feces, absorbs water and salt, bacteria make vitamin K.',
  },
  {
    title: 'Putting it together',
    say: [
      'Food travels a tube where four jobs happen: motility, secretion, hydrolysis, absorption. Mouth: chewing + saliva. Stomach: parietal cells pump H⁺ (turned up by ACh, gastrin, histamine; braked by somatostatin), and HCl turns pepsinogen into pepsin.',
      'Duodenum: the pancreas neutralizes acid and adds enzymes, bile emulsifies fat. Villi absorb: sugars and amino acids ride in with Na⁺ to the blood, fats leave as chylomicrons into lacteals. The colon takes back water and stores what is left.',
    ],
    takeaway: 'Break it down (mouth, stomach, pancreas, bile), soak it up (small intestine), dry it out (colon).',
    check: {
      q: 'Which signal turns stomach acid DOWN?',
      a: 'Somatostatin',
      o: ['Gastrin', 'Histamine', 'Acetylcholine'],
      why: 'Somatostatin from D cells inhibits HCl and pepsinogen secretion; the other three stimulate it.',
    },
  },
];
