// Guided lecture · L1 · Animal origins and diversity (Ch 22.1–22.2)
export default [
  {
    title: 'What this lecture is about',
    say: [
      'Welcome to Bio 2! This first lecture asks a big question: what makes something an animal, and how did animals get so many different body shapes?',
      'We’ll go in the order your professor did: where animals came from, how an embryo builds its first layers, and then the “body plan” features (symmetry, body cavity and more) used to sort animals into groups.',
      'Think of it as learning the vocabulary that the rest of the course keeps using. Lots of new words, but each one is simple once you see it.',
    ],
    takeaway: 'This lecture is about how animals are related and the few features that describe any animal’s body plan.',
  },
  {
    title: 'What every animal has in common',
    say: [
      'Animals share four general traits: they’re multicellular (many cells), heterotrophic (they eat other living things instead of making food), they digest food inside the body, and most can move and have a nervous system.',
      'Gene sequences show all animals come from one common ancestor. A group like that, one ancestor plus all its descendants, is called monophyletic. Picture one big family tree with a single great-great-grandparent at the root.',
    ],
    takeaway: 'Animals are multicellular heterotrophs with internal digestion, and they’re monophyletic (one common ancestor).',
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
      'So what was that ancestor? Probably a colonial flagellated protist, a lot like today’s choanoflagellates. Watch the single cell first: a whip (flagellum) to move and a little collar that catches bacteria.',
      'Then watch it divide and the cells stay stuck together as a colony. A colony is likely better at catching prey than one lonely cell, like a fishing net beats a single hook.',
    ],
    scene: 'l1-colony',
    from: 0,
    takeaway: 'The animal ancestor was probably a colonial flagellated protist, similar to choanoflagellates.',
  },
  {
    title: 'Cells start to split the jobs',
    say: [
      'Once cells live together, they can specialize. Watch the colors change: some cells focus on eating, some on swimming, some on making new cells. That division of labor is what eventually led to bigger, more complex animals.',
      'Now watch the end: a sponge appears. Sponge collar cells, called choanocytes, look almost exactly like choanoflagellates. That resemblance is the clue behind the whole “colonial ancestor” idea.',
    ],
    scene: 'l1-colony',
    from: 7.5,
    takeaway: 'Colony cells specialized (moving, feeding, reproducing), and sponge choanocytes look just like choanoflagellates.',
    check: {
      q: 'Sponge collar cells (choanocytes) look most like which protists?',
      a: 'Choanoflagellates',
      o: ['Amoebas', 'Diatoms', 'Green algae'],
      why: 'Both have one flagellum ringed by a collar that traps food, a hint that animals came from a choanoflagellate-like ancestor.',
    },
  },
  {
    title: 'Cleavage: radial vs spiral',
    say: [
      'Now we jump to development. Right after fertilization the embryo is one cell, the zygote. Cleavage is its first quick rounds of division: 1 → 2 → 4 → 8 cells, with no growing in between. Its pattern helps tell the major animal groups apart.',
      'Watch the top layer at 8 cells. Radial cleavage (left): yolk is spread evenly, cells divide completely and evenly, and the top cells stack straight above the bottom ones, like a neat stack of oranges. Spiral cleavage (right) is a twisted version: watch the gold arrow turn the top cells so they sit at an angle, in the grooves below.',
    ],
    scene: 'l1-cleave',
    from: 0,
    takeaway: 'Cleavage = early embryo divisions. Radial: new cells line up straight. Spiral: new cells sit at an angle.',
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
      'After cleavage the embryo is a blastula, a hollow ball of cells. In gastrulation one side pushes inward (invagination), like poking your finger into a soft ball. The opening of that pocket is the blastopore.',
      'This makes the germ layers: ectoderm outside, endoderm lining the new gut, and, in triploblastic animals, mesoderm in between (watch the extra dots slide in). Triploblastic animals form a clade.',
    ],
    scene: 'l1-gast',
    from: 0,
    vars: { layers: 'tri', fate: 'proto' },
    takeaway: 'Gastrulation folds the hollow ball inward to make germ layers; triploblasts have ectoderm, mesoderm and endoderm.',
  },
  {
    title: 'Two layers or three?',
    say: [
      'Now the toggle is on “Diploblastic”. Watch: no middle mesoderm dots this time. Diploblastic animals have just two layers, ectoderm and endoderm.',
      'Remember this for later in the lecture: ctenophores, placozoans and cnidarians are diploblastic. In cnidarians the single opening has to work as both mouth and anus.',
    ],
    scene: 'l1-gast',
    from: 2.5,
    vars: { layers: 'di', fate: 'proto' },
    takeaway: 'Diploblastic = ectoderm + endoderm only. Triploblastic adds mesoderm.',
    check: {
      q: 'Which germ layer do triploblastic animals have that diploblastic animals lack?',
      a: 'Mesoderm',
      o: ['Ectoderm', 'Endoderm', 'Blastula'],
      why: 'Diploblasts stop at ectoderm + endoderm; triploblasts add mesoderm in the middle.',
    },
  },
  {
    title: 'Protostomes vs deuterostomes',
    say: [
      'All triploblasts are bilaterians (bilaterally symmetric during development), and they split into two clades by what the blastopore becomes. Watch the box on the right.',
      'Protostomes: the blastopore becomes the MOUTH, and the anus forms later (insects, snails). Flip to deuterostomes and it’s the reverse: the blastopore becomes the ANUS, and the mouth forms later (vertebrates, sea stars, so you!). Memory trick: “deutero” = second, so the mouth comes second.',
    ],
    scene: 'l1-gast',
    from: 10,
    vars: { layers: 'tri', fate: 'deut' },
    takeaway: 'Protostome: blastopore → mouth. Deuterostome: blastopore → anus (mouth second).',
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
      'A body plan is the general structure of an animal: how its organ systems are arranged and work together. There are five key features: symmetry, body cavity, segmentation, appendages and nervous system. We’ll go through them in that order.',
      'Symmetry first. Watch the mirror line spin. Radial (jellyfish): parts arranged around a central axis, so it matches in many directions. Bilateral (worm): mirror halves on only one plane. Asymmetrical (sponge): it never matches. Sponges and placozoans are the asymmetrical ones.',
    ],
    scene: 'l1-sym',
    from: 0,
    takeaway: 'Radial = around a central axis; bilateral = one mirror plane; asymmetrical = none (sponges, placozoans).',
    check: {
      q: 'Which animals have no plane of symmetry at all?',
      a: 'Sponges and placozoans',
      o: ['Cnidarians and ctenophores', 'Insects and snails', 'Sea stars and fish'],
      why: 'Sponges and placozoans are asymmetrical; cnidarians and ctenophores are radial.',
    },
  },
  {
    title: 'Why bilateral animals have heads',
    say: [
      'Bilateral symmetry goes hand in hand with cephalization: sense organs and nerve tissue concentrated at the front (anterior) end, the head.',
      'Why? A bilateral animal moves front-end first, so the front meets food and danger first, just like your car’s headlights are on the front, not the back. Watch the food dots arrive at the worm’s head, and the brain cluster light up with nerve cords running back from it.',
    ],
    scene: 'l1-sym',
    from: 8.4,
    takeaway: 'Cephalization (a head with senses and a brain) was favored because the front end meets the environment first.',
  },
  {
    title: 'Body cavities',
    say: [
      'Feature two: the body cavity, sorted by where the mesoderm (from step 6) sits. Acoelomate: no fluid cavity at all; cells called mesenchyme pack the space between gut and body wall, and these animals move by beating cilia.',
      'Pseudocoelomate: a fluid-filled pseudocoel with organs floating in it, but no mesoderm around the organs. Coelomate: the coelom forms inside the mesoderm, so it’s lined on both sides by a muscular layer called the peritoneum. Use the toggle to flip between all three.',
    ],
    scene: 'l1-cavity',
    from: 0,
    vars: { plan: 'acoel' },
    takeaway: 'Acoelomate = no cavity; pseudocoel = mesoderm on the body-wall side only; coelom = mesoderm on both sides.',
    check: {
      q: 'A fluid cavity lined with mesoderm on both the gut side and the body-wall side is a…',
      a: 'Coelom',
      o: ['Pseudocoel', 'Mesenchyme', 'Blastopore'],
      why: 'A coelom develops within the mesoderm, so mesoderm encloses it inside and out.',
    },
  },
  {
    title: 'The water-balloon skeleton',
    say: [
      'A fluid-filled cavity can work as a hydrostatic skeleton. Fluid can’t be squashed, so when muscles squeeze one part, the fluid gets pushed to another part and that region expands.',
      'Watch the balloon at bottom right: the squeeze ring moves along and the bulge travels just ahead of it. It’s exactly like squeezing one end of a water balloon.',
    ],
    scene: 'l1-cavity',
    from: 6,
    vars: { plan: 'coel' },
    takeaway: 'Hydrostatic skeleton: muscles push the fluid somewhere else, and that part bulges out.',
  },
  {
    title: 'Segments, appendages and nerves',
    say: [
      'The last three body-plan features. Segmentation lets body regions specialize and lets the animal change shape and control movement precisely; arthropods diversified through changes to their segments.',
      'Appendages help animals move, and also include antennae, claws, mouthparts and reproductive organs. Nervous systems: ctenophores and cnidarians have a diffuse nerve net, while bilaterians have a central nervous system that coordinates muscles and processes sensory info.',
    ],
    takeaway: 'Segmentation and appendages add specialization; bilaterians have a central nervous system, cnidarians and ctenophores a nerve net.',
    check: {
      q: 'Cnidarians and ctenophores have what kind of nervous system?',
      a: 'A diffuse nerve net',
      o: ['A central nervous system with a brain', 'No nerve cells at all', 'Paired nerve cords and a head'],
      why: 'The slides say ctenophores and cnidarians have nerve nets; bilaterians have central nervous systems.',
    },
  },
  {
    title: 'The non-bilaterians',
    say: [
      'Four groups are not bilaterians: sponges, ctenophores, placozoans and cnidarians. Most biologists agree sponges and ctenophores split off first, but they disagree on which one was first. Big animals seem to have evolved several times in parallel.',
      'Sponges: no distinct germ layers, no true organs, and hard spicules (silica in glass sponges and demosponges, calcium carbonate in calcareous sponges). Ctenophores (comb jellies): radial, diploblastic, swim with cilia on eight comb plates called ctenes. Placozoans: super simple, only 4 cell types, diploblastic, with a swimming stage and a stuck-to-surfaces stage.',
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
      'Cnidarians are jellyfish, sea anemones, corals and hydrozoans. They’re diploblastic, and their gastrovascular cavity does it all: digestion, circulation, gas exchange and even acts as a hydrostatic skeleton.',
      'Their life cycle has a sessile (stuck in place) polyp stage and a swimming medusa stage. To catch large prey they fire nematocysts, harpoon-like structures loaded with toxins.',
    ],
    takeaway: 'Cnidarians: diploblastic, polyp + medusa stages, gastrovascular cavity, and toxic nematocysts.',
  },
  {
    title: 'Putting it together',
    say: [
      'Let’s connect it all. Animals came from a colonial, choanoflagellate-like ancestor. Embryos cleave (radial or spiral), then gastrulate to make 2 or 3 germ layers. Triploblasts are bilaterians and split into protostomes (mouth first) and deuterostomes (anus first).',
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
