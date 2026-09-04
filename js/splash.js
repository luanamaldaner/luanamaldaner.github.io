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
  '100% peer reviewed!',
  'Cultured!',
  'Two degrees!',
  'Made in Brazil!',
  'Fluent in four!',
  'Now with data!',
  'Petri approved!',
  'Go Gators!',
  'Contains no bugs!',
  'Reproducible!',
  'Powered by coffee!',
  'Sniff sniff...',
  'As seen on GitHub!',
  'Statistically sound!',
  'Hire me!',
  'Awesome!',
  'Wow!',
];

export default class Splash {
  constructor() {
    const el = document.querySelector('.mc-splash');
    if (!el) return;
    el.textContent = SPLASHES[Math.floor(Math.random() * SPLASHES.length)];
  }
}
