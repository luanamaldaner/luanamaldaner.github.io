/**
 * Skin
 *
 * Switches between the Minecraft look and the plain "classic" look, with a
 * world-loading overlay covering the swap.
 *
 * Rather than trying to unwind the theme with counter-rules — which would be a
 * losing battle, since minecraft-theme.css leans on !important in places — this
 * just disables that stylesheet outright. The site falls back to the original
 * design underneath it, untouched.
 *
 * The scenery elements (panorama, weather, avatar, splash) and the loading
 * overlay itself are styled from a block in the page head, which has to live
 * outside minecraft-theme.css so it still applies once that sheet is off.
 */

const STORAGE_KEY = 'mc-skin';

// Stages shown while the bar fills. Entering the Minecraft world reads as
// generating it; leaving reads as saving it, which is what the game does.
const STAGES = {
  toMc: {
    title: 'Generating world',
    steps: ['Building terrain', 'Growing vegetation', 'Loading spawn area'],
  },
  toClassic: {
    title: 'Saving world',
    steps: ['Saving chunks', 'Closing world'],
  },
};

const TOTAL_MS = 1500;

export default class Skin {
  constructor() {
    this.btn = document.getElementById('skin-toggle');
    this.sheet = document.querySelector('link[href*="minecraft-theme"]');
    if (!this.btn || !this.sheet) return;

    this.loader = document.getElementById('mc-loader');
    this.titleEl = this.loader && this.loader.querySelector('.mc-loader-title');
    this.stageEl = this.loader && this.loader.querySelector('.mc-loader-stage');
    this.barEl = this.loader && this.loader.querySelector('.mc-loader-bar');
    this.busy = false;

    this.min = localStorage.getItem(STORAGE_KEY) === 'min';
    this.apply();                       // initial state, no animation

    this.btn.addEventListener('click', () => this.toggle());
  }

  toggle() {
    if (this.busy) return;              // ignore clicks mid-transition
    const next = !this.min;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!this.loader || reduced) {
      this.min = next;
      this.apply();
      this.save();
      return;
    }

    this.busy = true;
    const plan = next ? STAGES.toClassic : STAGES.toMc;
    this.titleEl.textContent = plan.title;
    this.stageEl.textContent = plan.steps[0];
    this.barEl.style.width = '0%';

    this.loader.classList.remove('fading');
    this.loader.classList.add('showing');

    // Swap the skin once the overlay is opaque, so the change is never seen
    // happening — the same trick the game uses behind its own screen.
    setTimeout(() => {
      this.min = next;
      this.apply();
      this.save();
    }, 200);

    // Walk the bar through the stages.
    const stepMs = TOTAL_MS / plan.steps.length;
    plan.steps.forEach((label, i) => {
      setTimeout(() => {
        this.stageEl.textContent = label;
        this.barEl.style.width = `${Math.round(((i + 1) / plan.steps.length) * 100)}%`;
      }, 120 + i * stepMs);
    });

    setTimeout(() => {
      this.loader.classList.add('fading');
      setTimeout(() => {
        this.loader.classList.remove('showing', 'fading');
        this.busy = false;
      }, 180);
    }, TOTAL_MS + 200);
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, this.min ? 'min' : 'mc');
    } catch (e) { /* private mode */ }
  }

  apply() {
    this.sheet.disabled = this.min;
    document.documentElement.dataset.skin = this.min ? 'min' : 'mc';
    this.btn.setAttribute('aria-pressed', this.min ? 'true' : 'false');
    this.btn.setAttribute(
      'aria-label',
      this.min ? 'Switch to Minecraft mode' : 'Switch to classic mode'
    );
    const label = this.btn.querySelector('.skin-label');
    if (label) label.textContent = this.min ? 'Minecraft' : 'Classic';
  }
}
