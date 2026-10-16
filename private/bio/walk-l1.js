// Guided lecture · L1 · Animal origins and diversity (Ch 22.1–22.2)
export default [
  {
    title: 'What this lecture is about',
    say: [
      'Welcome to Bio 2! This first lecture asks a big question: what makes something an animal, and how did animals end up with so many different body shapes?',
      'We’ll go in the same order as your professor: where animals came from, how an embryo (a baby animal in its earliest stage) builds its first layers, and then the “body plan” features (symmetry, body cavity and more) used to sort animals into groups.',
      'Think of it as learning the vocabulary the rest of the course keeps using. Lots of new words, but each one is simple once you see it.',
    ],
    takeaway: 'This lecture is about how animals are related and the few features that describe any animal’s body plan (its basic layout).',
  },
  {
    title: 'What every animal has in common',
    say: [
      'All animals share four general traits. They’re multicellular (made of many cells). They’re heterotrophic (they eat other living things instead of making their own food like plants do). They digest food inside their body. And most can move and have a nervous system.',
      'Gene sequences (comparing DNA) show that all animals come from one common ancestor. A group made of one ancestor plus all of its descendants is called monophyletic (“one family line”). Picture one big family tree with a single great-great-grandparent at the root.',
    ],
    takeaway: 'Animals are many-celled eaters (heterotrophs) that digest food inside, and they’re monophyletic (all from one common ancestor).',
    check: {
      q: 'Gene sequences show all animals share one common ancestor. That makes animals…',
      a: 'Monophyletic',
      o: ['Polyphyletic', 'Autotrophic', 'Diploblastic'],
      why: 'One ancestor plus all its descendants = a monophyletic group.',
    },
  },
  {
    title: 'The first animal: a team of cells',
    say: [
      'So what was that first ancestor? Probably a colonial flagellated protist: a tiny single-celled organism (protist) with a whip-like tail (flagellum) that lived in groups (colonial). It was a lot like today’s choanoflagellates. Watch the single cell first: a whip to swim and a little collar that catches bacteria to eat.',
      'Then watch it divide, with the cells staying stuck together as a colony. A colony is probably better at catching food than one lonely cell, like a fishing net beats a single hook.',
    ],
    scene: 'l1-colony',
    from: 0,
    takeaway: 'The first animal ancestor was probably a group-living, whip-tailed protist, similar to choanoflagellates.',
  },
  {
    title: 'Cells start to split the jobs',
    say: [
      'Once cells live together, they can specialize (each one focuses on one job). Watch the colors change: some cells focus on eating, some on swimming, some on making new cells. That division of labor is what eventually led to bigger, more complex animals.',
      'Now watch the end: a sponge appears. Sponges have collar cells called choanocytes, and they look almost exactly like choanoflagellates. That look-alike is the main clue behind the whole “colony ancestor” idea.',
    ],
    scene: 'l1-colony',
    from: 7.5,
    takeaway: 'Colony cells split up jobs (moving, eating, reproducing), and sponge choanocytes (collar cells) look just like choanoflagellates.',
    check: {
      q: 'Sponge collar cells (choanocytes) look most like which protists?',
      a: 'Choanoflagellates',
      o: ['Amoebas', 'Diatoms', 'Green algae'],
      why: 'Both have one whip-like flagellum circled by a collar that traps food, a hint that animals came from a choanoflagellate-like ancestor.',
    },
  },
  {
    title: 'Cleavage: radial vs spiral',
    say: [
      'Now we jump to how an embryo develops. Right after fertilization (sperm meets egg), the embryo is one cell, called the zygote. Cleavage is its first fast rounds of cell division: 1 → 2 → 4 → 8 cells, with no growing in between. The pattern of these divisions helps tell the major animal groups apart.',
      'Watch the top layer at 8 cells. Radial cleavage (left): the yolk (food supply) is spread evenly, cells split completely and evenly, and the top cells stack straight above the bottom ones, like a neat stack of oranges. Spiral cleavage (right) is a twisted version: watch the gold arrow turn the top cells so they sit at an angle, in the grooves between the cells below.',
    ],
    scene: 'l1-cleave',
    from: 0,
    takeaway: 'Cleavage = the embryo’s first cell divisions. Radial: new cells line up straight. Spiral: new cells sit at an angle.',
    check: {
      q: 'In spiral cleavage, the new cells…',
      a: 'Sit at an angle to the cells below',
      o: ['Stack straight on top of the cells below', 'Only form at the bottom of the egg', 'Never fully separate'],
      why: 'Spiral cleavage is a twisted version of radial: the new cells are set at an angle.',
    },
  },
  {
    title: 'Gastrulation and germ layers',
    say: [
      'After cleavage, the embryo is a blastula: a hollow ball of cells. In gastrulation, one side of the ball pushes inward (called invagination), like poking your finger into a soft ball. The opening of that new pocket is the blastopore.',
      'This creates the germ layers (the starting tissue layers that all body parts grow from). Ectoderm is the outside layer, endoderm lines the new gut, and in triploblastic (“three-layered”) animals, mesoderm forms in between. Watch the extra dots slide in. Triploblastic animals form a clade (a group with one common ancestor).',
    ],
    scene: 'l1-gast',
    from: 0,
    vars: { layers: 'tri', fate: 'proto' },
    takeaway: 'Gastrulation folds the hollow ball inward to make germ layers; triploblasts have ectoderm (outside), mesoderm (middle) and endoderm (inside).',
  },
  {
    title: 'Two layers or three?',
    say: [
      'Now the toggle is on “Diploblastic” (“two-layered”). Watch: no middle mesoderm dots this time. Diploblastic animals have just two layers, ectoderm and endoderm.',
      'Remember this for later: ctenophores (comb jellies), placozoans (tiny flat blobs) and cnidarians (jellyfish and relatives) are diploblastic. In cnidarians, the single opening has to work as both mouth and anus.',
    ],
    scene: 'l1-gast',
    from: 2.5,
    vars: { layers: 'di', fate: 'proto' },
    takeaway: 'Diploblastic = ectoderm + endoderm only. Triploblastic adds mesoderm in the middle.',
    check: {
      q: 'Which germ layer do triploblastic animals have that diploblastic animals don’t?',
      a: 'Mesoderm',
      o: ['Ectoderm', 'Endoderm', 'Blastula'],
      why: 'Diploblasts stop at ectoderm + endoderm; triploblasts add mesoderm in the middle.',
    },
  },
  {
    title: 'Protostomes vs deuterostomes',
    say: [
      'All triploblasts are bilaterians (animals with a left and right side that mirror each other, at least as embryos). They split into two big groups based on what the blastopore turns into. Watch the box on the right.',
      'Protostomes: the blastopore becomes the MOUTH, and the anus forms later (insects, snails). Flip to deuterostomes and it’s the reverse: the blastopore becomes the ANUS, and the mouth forms later (vertebrates, sea stars, so you!). Memory trick: “deutero” = second, so the mouth comes second.',
    ],
    scene: 'l1-gast',
    from: 10,
    vars: { layers: 'tri', fate: 'deut' },
    takeaway: 'Protostome: blastopore → mouth. Deuterostome: blastopore → anus (mouth comes second).',
    check: {
      q: 'In deuterostomes, the blastopore becomes the…',
      a: 'Anus',
      o: ['Mouth', 'Coelom', 'Nerve cord'],
      why: '“Deutero” means second: the mouth forms second, so the blastopore becomes the anus.',
    },
  },
  {
    title: 'Body plans and symmetry',
    say: [
      'A body plan is the basic layout of an animal: how its organ systems are arranged and work together. There are five key features: symmetry, body cavity, segmentation, appendages and nervous system. We’ll go through them in that order.',
      'Symmetry first (how well the body matches itself when you cut it). Watch the mirror line spin. Radial (jellyfish): parts arranged in a circle around a center, like a pizza, so it matches in many directions. Bilateral (worm): left and right halves mirror each other along only one line. Asymmetrical (sponge): it never matches. Sponges and placozoans are the asymmetrical ones.',
    ],
    scene: 'l1-sym',
    from: 0,
    takeaway: 'Radial = arranged around a center; bilateral = one mirror line (left/right); asymmetrical = no match at all (sponges, placozoans).',
    check: {
      q: 'Which animals have no line of symmetry at all?',
      a: 'Sponges and placozoans',
      o: ['Cnidarians and ctenophores', 'Insects and snails', 'Sea stars and fish'],
      why: 'Sponges and placozoans are asymmetrical; cnidarians and ctenophores are radial.',
    },
  },
  {
    title: 'Why bilateral animals have heads',
    say: [
      'Bilateral symmetry goes hand in hand with cephalization: having sense organs and nerve tissue bunched up at the front (anterior) end, which becomes the head.',
      'Why? A bilateral animal moves front-end first, so the front runs into food and danger first, just like a car’s headlights are on the front, not the back. Watch the food dots arrive at the worm’s head, and the brain cluster light up with nerve cords running back from it.',
    ],
    scene: 'l1-sym',
    from: 8.4,
    takeaway: 'Cephalization (having a head with senses and a brain) was favored because the front end meets the world first.',
  },
  {
    title: 'Body cavities',
    say: [
      'Feature two: the body cavity (a space between the gut and the outer body wall). Groups are sorted by where the mesoderm (the middle germ layer) sits. Acoelomate (“no cavity”): no fluid space at all. Cells called mesenchyme fill the gap between gut and body wall, and these animals get around by beating cilia (tiny hairs).',
      'Pseudocoelomate (“false cavity”): a fluid-filled space called a pseudocoel, with organs floating in it, but no mesoderm wrapping the organs. Coelomate: a true coelom forms inside the mesoderm, so it’s lined on both sides by a muscular layer called the peritoneum. Use the toggle to flip between all three.',
    ],
    scene: 'l1-cavity',
    from: 0,
    vars: { plan: 'acoel' },
    takeaway: 'Acoelomate = no cavity; pseudocoel = mesoderm on the body-wall side only; coelom = mesoderm on both sides.',
    check: {
      q: 'A fluid-filled cavity lined with mesoderm on both the gut side and the body-wall side is a…',
      a: 'Coelom',
      o: ['Pseudocoel', 'Mesenchyme', 'Blastopore'],
      why: 'A coelom forms inside the mesoderm, so mesoderm surrounds it inside and out.',
    },
  },
  {
    title: 'The water-balloon skeleton',
    say: [
      'A fluid-filled cavity can work as a hydrostatic skeleton (a “skeleton” made of trapped fluid instead of bone). Fluid can’t be squashed, so when muscles squeeze one part, the fluid gets pushed somewhere else and that part bulges out.',
      'Watch the balloon at bottom right: the squeeze ring moves along and the bulge travels just ahead of it. It’s exactly like squeezing one end of a water balloon.',
    ],
    scene: 'l1-cavity',
    from: 6,
    vars: { plan: 'coel' },
    takeaway: 'Hydrostatic skeleton: muscles push the trapped fluid somewhere else, and that part bulges out.',
  },
  {
    title: 'Segments, appendages and nerves',
    say: [
      'The last three body-plan features. Segmentation means the body is built from repeated sections (like train cars). It lets body regions specialize and helps the animal change shape and control movement precisely. Arthropods (insects, crabs, spiders) diversified through changes to their segments.',
      'Appendages are parts sticking out of the body. They help animals move, and also include antennae, claws, mouthparts and reproductive organs. Nervous systems: ctenophores and cnidarians have a nerve net (nerves spread out like a mesh, with no brain), while bilaterians have a central nervous system (a brain and main nerve cords) that runs the muscles and handles sensory info.',
    ],
    takeaway: 'Segmentation and appendages allow specialization; bilaterians have a central nervous system, cnidarians and ctenophores a nerve net.',
    check: {
      q: 'Cnidarians and ctenophores have what kind of nervous system?',
      a: 'A diffuse nerve net',
      o: ['A central nervous system with a brain', 'No nerve cells at all', 'Paired nerve cords and a head'],
      why: 'Ctenophores and cnidarians have spread-out nerve nets; bilaterians have central nervous systems.',
    },
  },
  {
    title: 'The non-bilaterians',
    say: [
      'Four groups are not bilaterians: sponges, ctenophores, placozoans and cnidarians. Most biologists agree sponges and ctenophores branched off first, but they argue about which one came first. Big, complex animals seem to have evolved more than once, side by side.',
      'Sponges: no separate germ layers, no true organs, and hard little support needles called spicules (made of silica, basically glass, in glass sponges and demosponges; made of calcium carbonate, like chalk, in calcareous sponges). Ctenophores (comb jellies): radial, diploblastic, and swim using cilia (tiny hairs) on eight comb rows called ctenes. Placozoans: super simple, only 4 cell types, diploblastic, with a swimming stage and a stuck-to-surfaces stage.',
    ],
    takeaway: 'Sponges, ctenophores, placozoans and cnidarians are the non-bilaterians.',
    check: {
      q: 'Glass sponges and demosponges have spicules made of…',
      a: 'Silicon dioxide (silica)',
      o: ['Calcium carbonate', 'Chitin', 'Keratin'],
      why: 'Calcareous sponges use calcium carbonate; glass sponges and demosponges use silica.',
    },
  },
  {
    title: 'Cnidarians',
    say: [
      'Cnidarians are jellyfish, sea anemones, corals and hydrozoans. They’re diploblastic, and their gastrovascular cavity (one big inner pouch with a single opening) does it all: digesting food, moving fluid around (circulation), swapping gases, and even acting as a hydrostatic skeleton.',
      'Their life cycle has a polyp stage that is sessile (stuck in one place, like an anemone) and a medusa stage that swims (like a jellyfish). To catch big prey, they fire nematocysts: tiny harpoons loaded with venom.',
    ],
    takeaway: 'Cnidarians: diploblastic, polyp + medusa stages, a gastrovascular cavity, and venomous nematocysts.',
  },
  {
    title: 'Putting it together',
    say: [
      'Let’s connect it all. Animals came from a group-living, choanoflagellate-like ancestor. Embryos divide (cleavage, radial or spiral), then fold inward (gastrulation) to make 2 or 3 germ layers. Triploblasts are bilaterians and split into protostomes (mouth first) and deuterostomes (anus first).',
      'Any animal’s body plan can be described with five features: symmetry, body cavity, segmentation, appendages and nervous system. Sponges, ctenophores, placozoans and cnidarians are the simpler, non-bilaterian groups.',
    ],
    takeaway: 'Ancestor → embryo layers → body plan features: that chain explains how animal groups are sorted.',
    check: {
      q: 'Which pairing is correct?',
      a: 'Protostome: blastopore becomes the mouth',
      o: ['Deuterostome: blastopore becomes the mouth', 'Diploblastic: has mesoderm', 'Acoelomate: has a fluid-filled coelom'],
      why: 'Protostomes form the mouth first from the blastopore; the other three pairings are backwards.',
    },
  },
];
