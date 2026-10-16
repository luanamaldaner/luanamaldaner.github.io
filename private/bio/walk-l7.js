export default [
  {
    title: 'What this lecture is about',
    say: [
      'You eat a sandwich. Hours later your cells are burning glucose (sugar) and building proteins from it. This lecture is the story of how that happens: how a big chunk of food gets broken into tiny pieces and moved into your blood.',
      'We follow food in order: mouth, esophagus (food pipe), stomach, small intestine (with help from the pancreas, liver and gallbladder), and finally the large intestine.',
    ],
    takeaway: 'Digestion = breaking food into building blocks small enough to absorb.',
  },
  {
    title: 'The gut is one long tube',
    scene: 'l7-gut', from: 0,
    say: [
      'Simple animals like cnidarians (jellyfish and relatives) have a dead-end sac with one opening. Later animals have a tube: mouth in, anus out, split into foregut, midgut and hindgut (front, middle, back). Fun twist: the space inside the tube (the lumen) is technically still the outside world until food is absorbed.',
      'Four jobs happen along the tube: motility (muscles mix and push food along), secretion (glands add juices), enzymatic hydrolysis (enzymes split food apart), and absorption (nutrients cross into the body). Watch the badges light up as the food lump travels.',
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
      'Motility comes mostly from smooth muscle (the kind you don’t control), run by the autonomic nervous system (the automatic part of your nervous system). Skeletal muscle (the kind you do control) works at the two ends: swallowing and the final exit. Secretions come from exocrine glands (glands that release juices through ducts) and contain water, electrolytes (dissolved salts) and organic molecules like enzymes.',
      'Now watch the animation: each enzyme snaps one bond by adding a water molecule. That is hydrolysis, "splitting with water." Carbs become monosaccharides (single sugars, like glucose), proteins become amino acids, fats become monoglycerides + fatty acids, and nucleic acids (DNA/RNA) become nucleotides.',
    ],
    takeaway: 'Hydrolysis uses water to split big food molecules into absorbable building blocks.',
    check: {
      q: 'Fats are broken down (hydrolyzed) into…',
      a: 'Monoglycerides and fatty acids',
      o: ['Amino acids', 'Monosaccharides', 'Nucleotides'],
      why: 'Triglycerides (the main fat molecules) are split into monoglycerides and free fatty acids.',
    },
  },
  {
    title: 'Mouth and swallowing',
    scene: 'l7-gut', from: 0,
    say: [
      'Chewing (mastication) grinds food into smaller pieces. That makes it easier to swallow and gives enzymes more surface to work on. It also mixes food with saliva and wakes up your taste buds. Saliva has water, mucus (slippery coating), amylase (an enzyme that starts breaking down starch) and bicarbonate (HCO₃⁻, which neutralizes acid, H⁺).',
      'Swallowing: the tongue pushes the food lump (bolus) into the pharynx (the throat). Pressure sensors there alert the swallowing center in the medulla oblongata (the base of the brainstem). Then a ring-shaped squeeze of muscle called peristalsis pushes it down the esophagus, like squeezing toothpaste. Watch the squeeze ride just behind the bolus.',
    ],
    takeaway: 'Saliva = water, mucus, amylase, bicarbonate. Swallowing is run by the medulla and moved by peristalsis.',
  },
  {
    title: 'The stomach and its cells',
    scene: 'l7-gut', from: 3,
    say: [
      'Watch the bolus slow down and churn in the stomach: it turns into a soupy mix called chyme. The stomach lining is dotted with gastric pits (tiny pockets) full of specialized cells.',
      'Mucous cells make mucus. Chief cells make pepsinogen (the inactive form of a protein-cutting enzyme). Parietal cells make HCl (hydrochloric acid) and intrinsic factor (helps you absorb vitamin B). Hormone-making cells: G cells release gastrin, ECL cells release histamine, and D cells release somatostatin, which is the brake on HCl and pepsinogen.',
    ],
    takeaway: 'Parietal = HCl + intrinsic factor, chief = pepsinogen, G = gastrin, ECL = histamine, D = somatostatin.',
    check: {
      q: 'Which stomach cells release HCl (acid)?',
      a: 'Parietal cells',
      o: ['Chief cells', 'G cells', 'D cells'],
      why: 'Parietal cells make HCl and intrinsic factor; chief cells make pepsinogen.',
    },
  },
  {
    title: 'Three "go" signals for acid',
    scene: 'l7-acid', from: 0, vars: { meal: 'meal' },
    say: [
      'Three signals turn acid up. ① ACh (acetylcholine, a nerve signal chemical) from the vagus nerves, which are parasympathetic ("rest and digest") nerves. These fire even when you’re just expecting food, or when the stomach stretches. ② Gastrin, a hormone from G cells. G cells release it in response to ACh, GRP (a signal from nerve cells), a higher stomach pH (less acidic), and proteins and peptides (protein pieces) in the stomach. ③ Histamine from ECL cells, released in response to gastrin; it acts on H2 receptors (its docking spots on parietal cells).',
      'Watch the three signals arrive at the parietal cell and speed up the pumps. Remember from step 5: somatostatin is the brake.',
    ],
    takeaway: 'ACh, gastrin and histamine all turn stomach acid up.',
  },
  {
    title: 'The proton pump',
    scene: 'l7-acid', from: 5, vars: { meal: 'meal' },
    say: [
      'Inside the parietal cell, CO₂ and water combine to make H⁺ (acid) and HCO₃⁻ (bicarbonate, a base). The H⁺/K⁺ ATPase, nicknamed the proton pump (a proton is just H⁺), uses ATP (cell energy) to push H⁺ into the stomach and bring K⁺ (potassium) into the cell. Watch H⁺ going left into the stomach and HCO₃⁻ going right into the blood.',
      'So the stomach gets more acidic (lower pH) while the blood leaving it gets a bit less acidic (higher pH). Try the toggle "Empty stomach" to see the pumps slow down between meals.',
    ],
    takeaway: 'Proton pump: H⁺ out into the stomach, K⁺ in; HCO₃⁻ goes to the blood.',
    check: {
      q: 'The parietal cell proton pump swaps…',
      a: 'H⁺ out for K⁺ in',
      o: ['Na⁺ out for K⁺ in', 'H⁺ out for Na⁺ in', 'HCO₃⁻ out for Cl⁻ in'],
      why: 'It is the H⁺/K⁺ ATPase; the leftover HCO₃⁻ goes out into the blood.',
    },
  },
  {
    title: 'Pepsin, and why the stomach doesn’t digest itself',
    scene: 'l7-acid', from: 10, vars: { meal: 'meal' },
    say: [
      'Watch the pepsinogen lose its "lid" once the acid builds up. HCl (or pepsin itself) cuts inactive pepsinogen into active pepsin, an enzyme that starts chopping proteins into smaller peptides (short protein chains). Protein digestion starts in the antrum (the lower part of the stomach).',
      'Making it inactive first is like shipping a knife in a sheath. The lining is also protected by a layer of bicarbonate-rich mucus (the gastric mucosal barrier), and the lining cells are replaced about every three days. When that barrier wears away, you get a peptic ulcer (an open sore in the lining).',
    ],
    takeaway: 'HCl activates pepsinogen → pepsin; bicarbonate mucus protects the lining.',
  },
  {
    title: 'The pancreas joins in',
    scene: 'l7-gut', from: 11.5,
    say: [
      'The chyme now enters the duodenum, the first part of the small intestine. Watch the drips arriving here from the pancreas and from the liver/gallbladder.',
      'The exocrine pancreas (the part of the pancreas that sends juices through a duct) adds HCO₃⁻ (bicarbonate). That neutralizes the stomach acid and lets the enzymes work. It also adds a mix of enzymes: protein-cutting ones, amylase (for carbs), chitinase (for chitin, the stuff in insect shells) and lipase (for fats). Like pepsinogen, the protein-cutting enzymes are sent out inactive and only switched on in the duodenum.',
    ],
    takeaway: 'Pancreas → duodenum: bicarbonate to neutralize acid + enzymes (protein enzymes arrive inactive).',
    check: {
      q: 'What neutralizes stomach acid in the duodenum?',
      a: 'Bicarbonate (HCO₃⁻) from the pancreas',
      o: ['HCl from parietal cells', 'Pepsin from chief cells', 'Gastrin from G cells'],
      why: 'The pancreas sends HCO₃⁻ into the duodenum, which neutralizes acid and lets its enzymes work.',
    },
  },
  {
    title: 'The liver: the body’s busy factory',
    say: [
      'Liver cells (hepatocytes) have a huge to-do list: make bile salts, process nutrients, detoxify (clean out) wastes, hormones and drugs, make plasma proteins (proteins in the liquid part of blood), store glycogen (stored sugar), fats, iron, copper and vitamins, activate vitamin D, remove bacteria and old red blood cells, and more (it even helps sharks float).',
      'Blood from the gut goes straight to the liver first through the hepatic portal system (a direct blood route from gut to liver), so the liver gets first look at everything you absorb. The liver makes bile, the gallbladder stores it, and bile salts get recycled back to the liver.',
    ],
    takeaway: 'Liver makes bile, gallbladder stores it; gut blood reaches the liver first via the hepatic portal system.',
  },
  {
    title: 'Bile breaks up fat',
    scene: 'l7-bile', from: 0,
    say: [
      'Fat and water don’t mix, so fat clumps into big droplets, and lipase (the fat-cutting enzyme) can only work on the outside surface. Bile salts work like dish soap: one end likes water (hydrophilic), the other end likes fat (hydrophobic, "water-fearing"). Watch them coat the big droplet.',
      'Mixing then breaks it into smaller and smaller droplets. Same amount of fat, way more surface for lipase. That is emulsification. The tiny bile-salt bubbles that carry fat to the gut wall are called micelles.',
    ],
    takeaway: 'Bile salts emulsify fat (break it up physically, no enzymes), giving lipase more surface.',
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
      'The small intestine is built for absorbing. Its inner wall is folded, the folds are covered in finger-like bumps called villi, and each villus cell has tiny hair-like bumps called microvilli (together they make the "brush border"). All together that is about 600 times more surface.',
      'Think of a towel: the loops let it soak up far more than a flat sheet. Most absorption happens in the duodenum and jejunum, the first two parts of the small intestine.',
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
      'Brush-border enzymes finish splitting disaccharides (double sugars, like table sugar) into monosaccharides (single sugars). Then watch Na⁺ (sodium) and glucose ride through SGLT (a sodium–glucose carrier protein) together: Na⁺ rushes "downhill" into the cell and drags glucose along with it. That is secondary active transport: the energy comes from the Na⁺ difference, not straight from ATP.',
      'Glucose leaves the other side of the cell through GLUT-2 (a glucose doorway) into the blood (GLUT-5 handles fructose, fruit sugar). Then the Na⁺/K⁺ pump spends ATP to throw Na⁺ back out, keeping the downhill slope ready for the next ride. Amino acids get in the same way.',
    ],
    takeaway: 'Glucose, galactose and amino acids enter with Na⁺ (secondary active transport); the Na⁺ difference powers it.',
  },
  {
    title: 'Fats take a different exit',
    scene: 'l7-fat', from: 0,
    say: [
      'Remember the micelles from step 11. Watch one deliver fat to the cell: monoglycerides and fatty acids slip right through the cell membrane because they dissolve in fat (and the membrane is made of fat). Inside, they are rebuilt into triglycerides.',
      'The triglycerides get wrapped in phospholipids and protein to make a little package called a chylomicron. It leaves the cell by exocytosis (being pushed out in a bubble). Chylomicrons are picked up by lacteals, which are lymph vessels (drainage vessels), instead of blood capillaries.',
    ],
    takeaway: 'Fats → rebuilt into triglycerides → chylomicrons → lacteals (lymph), not blood capillaries.',
    check: {
      q: 'Where do chylomicrons go after leaving the intestinal cell?',
      a: 'Into lacteals (lymph vessels)',
      o: ['Directly into blood capillaries', 'Back into the gut lumen', 'Into the gallbladder'],
      why: 'Chylomicrons are picked up by the lacteals (lymph vessels) in each villus.',
    },
  },
  {
    title: 'The large intestine',
    scene: 'l7-gut', from: 19.8,
    say: [
      'By the time food reaches the colon (large intestine), most nutrients are already gone. A human colon gets about 500 mL of leftover, undigestible chyme a day. Watch the water dots leaving the tube.',
      'The colon’s main job is storing feces (poop). It also absorbs water and salt, friendly bacteria living there make vitamins like vitamin K, and undigested cellulose (plant fiber) adds bulk.',
    ],
    takeaway: 'Colon: stores feces, absorbs water and salt, bacteria make vitamin K.',
  },
  {
    title: 'Putting it together',
    say: [
      'Food travels a tube where four jobs happen: motility, secretion, hydrolysis, absorption. Mouth: chewing + saliva. Stomach: parietal cells pump H⁺ (turned up by ACh, gastrin, histamine; turned down by somatostatin), and HCl turns pepsinogen into pepsin.',
      'Duodenum: the pancreas neutralizes acid and adds enzymes, and bile emulsifies fat. Villi absorb: sugars and amino acids ride in with Na⁺ to the blood, and fats leave as chylomicrons into lacteals. The colon takes back water and stores what is left.',
    ],
    takeaway: 'Break it down (mouth, stomach, pancreas, bile), soak it up (small intestine), dry it out (colon).',
    check: {
      q: 'Which signal turns stomach acid DOWN?',
      a: 'Somatostatin',
      o: ['Gastrin', 'Histamine', 'Acetylcholine'],
      why: 'Somatostatin from D cells slows HCl and pepsinogen release; the other three speed it up.',
    },
  },
];
