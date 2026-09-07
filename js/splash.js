/**
 * Splash
 *
 * Minecraft picks a random line from splashes.txt every time the title
 * screen loads. Same idea here — short, exclamatory, a bit silly, in the
 * spirit of the real ones ("100% pure!", "Also try Terraria!").
 *
 * Keep these SHORT. The splash is pinned diagonally at the title's right
 * corner, so a long line swings a long way vertically and collides with
 * the major line and the avatar. MC's own splashes are ~10-25 chars.
 */

const SPLASHES = [
  'Also try R!',
  'Two degrees!',
  'Made in Brazil!',
  'Fluent in four!',
  'Go Gators!',
  'Cultured!',
  'Petri approved!',
  'Now with data!',
  'Statistically sound!',
  'Peer reviewed!',
  'Reproducible!',
  'Hypothesis tested!',
  'p < 0.05!',
  'Significant!',
  'Gainesville grown!',
  'Herbarium certified!',
  '3.61 and climbing!',
  'Bilingual!',
  'Ask me about plants!',
  'Astragalus enjoyer!',
  'As seen on GitHub!',
  'Contains no bugs!',
  'Compiles first try!',
  'Version controlled!',
  'No merge conflicts!',
  'Fully documented!',
  'Zero dependencies!',
  'Works on my machine!',
  'Ctrl+S!',
  'git commit -m wow!',
  'Shipped on Friday!',
  'More R!',
  'O(1) charisma!',
  'Crafted by hand!',
  'Not mob-dropped!',
  'Diamond tier!',
  'No creepers here!',
  'Rendered at 64x!',
  'Chunk loaded!',
  'Spawn point set!',
  'Nether-free!',
  'Redstone powered!',
  'Hardcore mode!',
  'Achievement get!',
  'Survival tested!',
  'Dig carefully!',
  'Enchanted!',
  'Awesome!',
  'Wow!',
  '100% pure!',
  'Free of charge!',
  'Batteries included!',
  'Try the dark mode!',
  'Click the music!',
  'Scroll down!',
  'Hire me!',
  'Powered by coffee!',
  'Sniff sniff...',
  'Now in colour!',
  'Handmade!',
  'Still loading...!',
  'It works!',
];

// Keep these to 20 characters or fewer. The splash is pinned beside the
// title, so anything longer runs back across your name and into the avatar.
const MAX_LEN = 20;

const LAST_KEY = 'mc-splash-last';

export default class Splash {
  constructor() {
    const el = document.querySelector('.mc-splash');
    if (!el) return;

    // Don't repeat the line the visitor just saw - with a big pool, drawing
    // the same one twice running is the only thing that reads as "broken".
    let last = null;
    try { last = sessionStorage.getItem(LAST_KEY); } catch (e) { /* ignore */ }

    let pool = SPLASHES.filter((x) => x.length <= MAX_LEN);
    if (last && SPLASHES.length > 1) {
      pool = SPLASHES.filter((s) => s !== last);
    }
    const pick = pool[Math.floor(Math.random() * pool.length)];

    el.textContent = pick;
    try { sessionStorage.setItem(LAST_KEY, pick); } catch (e) { /* ignore */ }
  }
}
