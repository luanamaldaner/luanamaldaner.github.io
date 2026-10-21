// Study questions · Lecture 7 (Ch 28 + supplementary info) · Digestion
// Model answers grounded in l7.js + walk-l7.js. One object per question, in sheet order.
export default [
  {
    q: 'Briefly explain the 4 mechanisms involved in extracellular digestion- motility, secretion, enzymatic hydrolysis, absorption',
    a: '• Motility: muscle contractions that mix food and push it along the gut. It’s mostly smooth muscle run by the autonomic nervous system, with skeletal muscle at the two ends (swallowing and the final exit).\n• Secretion: exocrine glands (glands that release juices through ducts, like salivary glands, pancreas and liver) add water, electrolytes (dissolved salts) and enzymes.\n• Enzymatic hydrolysis: enzymes split big food molecules by adding water to each bond (“splitting with water”). Carbs → monosaccharides, proteins → amino acids, fats → monoglycerides + fatty acids, nucleic acids → nucleotides.\n• Absorption: those small building blocks cross the gut wall into the blood or lymph. Until then, food in the gut lumen is technically still “outside” your body.'
  },
  {
    q: 'What are the 4 important components of mammalian saliva?',
    a: '• Water: moistens and dissolves food so you can taste and swallow it.\n• Mucus: a slippery coating that lubricates the food lump (bolus).\n• Amylase: an enzyme that starts breaking down starch (starch starts in the mouth).\n• Bicarbonate (HCO₃⁻): a base that neutralizes acid.\nMemory trick: “We Must Always Brush.”'
  },
  {
    q: 'What are the main types of stimuli that initiate the salivary reflex? How can other stimuli become associate with and stimulate salivation (like a dog seeing food)?',
    a: 'The salivary reflex is mainly started by food in the mouth: chemoreceptors (taste buds sensing chemicals) and mechanoreceptors (touch/pressure sensors) send signals to the salivary center in the medulla (brainstem), which tells the salivary glands to secrete, mostly through parasympathetic nerves. Other stimuli like the sight, smell or sound of food can become linked to salivation by learning, called a conditioned reflex (classical conditioning). In Pavlov’s famous experiment, a dog that repeatedly heard a bell right before getting food eventually salivated to the bell alone, because the brain learned to connect the bell with food. (Not covered in the site’s notes; check your slides.)'
  },
  {
    q: 'What are the stimulus and control center for the swallowing reflex?',
    a: 'The stimulus is the food lump (bolus) pushed by the tongue into the pharynx (throat), where pressure receptors detect it. The control center is the swallowing center in the medulla oblongata (the base of the brainstem). Once it takes over, swallowing is automatic, and a ring-shaped wave of muscle contraction called peristalsis squeezes the bolus down the esophagus, like squeezing a toothpaste tube from behind.'
  },
  {
    q: 'What are 7 secretions from stomach cells, what are their main functions, and what cell types secrete them?',
    a: '• Mucus (mucous cells): bicarbonate-rich coating that protects the lining from acid and pepsin.\n• Pepsinogen (chief cells): inactive form of pepsin, a protein-cutting enzyme; acid switches it on.\n• HCl, hydrochloric acid (parietal cells): makes the stomach acidic, activates pepsinogen and helps break down food.\n• Intrinsic factor (parietal cells): needed to absorb vitamin B₁₂.\n• Gastrin (G cells): hormone that boosts acid secretion, directly and by triggering histamine release.\n• Histamine (ECL cells): binds H2 receptors on parietal cells and turns acid up.\n• Somatostatin (D cells): the brake; it slows HCl and pepsinogen release.\nMemory trick: Parietal Pumps acid, Chief is the Chef with the protein knife, G → Gastrin, D → “Don’t.”'
  },
  {
    q: 'What are the 3 stimuli for HCl secretion in the stomach, and what controls secretion of each of these stimulatory molecules?',
    a: '• ACh (acetylcholine, a nerve signal chemical): released by the vagus nerves (parasympathetic, “rest and digest”). They fire when you’re just expecting food and when the stomach stretches.\n• Gastrin (a hormone from G cells): released in response to ACh, GRP (a signal from nerve cells), a higher stomach pH (less acidic), and proteins/peptides in the stomach.\n• Histamine (from ECL cells): released in response to gastrin; it acts on H2 receptors on parietal cells.\nSomatostatin from D cells is the brake that turns acid down. Memory trick: “AGH, heartburn!” = ACh, Gastrin, Histamine.'
  },
  {
    q: 'How does the proton pump work in the stomach, and as H+ is secreted into the stomach, what is secreted into the blood? How does this affect blood pH?',
    a: 'Inside a parietal cell, CO₂ and water combine to make H⁺ (acid) and HCO₃⁻ (bicarbonate, a base). The proton pump, the H⁺/K⁺ ATPase, uses ATP to push H⁺ out into the stomach while bringing K⁺ (potassium) into the cell. The leftover HCO₃⁻ goes out the other side into the blood. So the stomach gets more acidic (lower pH) while the blood leaving the stomach becomes slightly less acidic (higher pH). Memory trick: acid to the gut, base to the blood.'
  },
  {
    q: 'What are the general types of enzymes secreted by the mammalian pancreas? Why is bicarbonate secreted by the pancreas?',
    a: 'The exocrine pancreas sends a mix of enzymes into the duodenum (first part of the small intestine): protein-cutting enzymes (proteases like trypsin), amylase for carbohydrates, lipase for fats, and chitinase for chitin (the material in insect shells). The protein-cutting enzymes are sent out inactive and only switched on in the duodenum, so they don’t digest the pancreas. Bicarbonate (HCO₃⁻) is secreted to neutralize the acidic chyme arriving from the stomach, which protects the intestine and gives the pancreatic enzymes the less acidic conditions they need to work.'
  },
  {
    q: 'What is the function of bile salts produced by the liver? What are micelles?',
    a: 'Bile salts emulsify fat: they break big fat droplets into many small ones. They work like dish soap, with one end that likes water (hydrophilic) and one that likes fat (hydrophobic), so they coat fat droplets and mixing breaks them apart. Same amount of fat, much more surface for lipase (the fat-cutting enzyme) to work on. Bile cuts no bonds and has no enzymes; it’s a physical change. Micelles are tiny balls of bile salts with digested fat (fatty acids and monoglycerides) tucked inside, which carry the fat to the intestinal wall. The liver makes bile, the gallbladder stores it, and bile salts are recycled back to the liver.'
  },
  {
    q: 'What are the structures that increase surface area of the (small) intestinal epithelium?',
    a: '• Folds: the inner wall of the small intestine is folded.\n• Villi: finger-like projections covering the folds.\n• Microvilli: tiny hair-like projections on each villus cell, together called the brush border.\nAll together they give about 600 times more surface for absorption, like the loops on a towel. Most absorption happens in the duodenum and jejunum, the first two parts of the small intestine.'
  },
  {
    q: 'What is the mechanism by which amino acids and monosaccharides are absorbed in the small intestine?',
    a: 'They enter intestinal cells by secondary active transport, which uses an ion gradient made with ATP instead of using ATP directly. First, brush-border enzymes split disaccharides into monosaccharides. Then Na⁺ and glucose (or galactose) ride through the SGLT carrier together: Na⁺ rushes “downhill” into the cell and drags glucose along. Glucose leaves the blood side of the cell through GLUT-2 into the blood (GLUT-5 handles fructose). The Na⁺/K⁺ pump spends ATP to throw Na⁺ back out, keeping Na⁺ low inside so the next ride can happen. Amino acids get in the same way, riding with Na⁺.'
  },
  {
    q: 'Briefly explain the absorption of fats/lipids in the small intestine, including the roles of micelles, chylomicrons, and lacteals.',
    a: '• Micelles: bile-salt bundles carry digested fat (fatty acids + monoglycerides) to the intestinal cell.\n• The fatty acids and monoglycerides slip straight through the cell membrane because they’re fat-soluble.\n• Inside the cell they’re rebuilt into triglycerides.\n• Chylomicrons: the triglycerides are wrapped in phospholipids and protein to make a package called a chylomicron, which leaves the cell by exocytosis.\n• Lacteals: chylomicrons are too big for blood capillaries, so they enter lacteals (lymph vessels in each villus) and reach the blood later.\nMemory trick: Lipids go to Lacteals, which are Lymph.'
  },
];
