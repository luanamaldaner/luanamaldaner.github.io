/**
 * Panorama
 *
 * Cross-fades the background scenes as the page scrolls, the way Minecraft's
 * title screen keeps a scene alive behind the GUI.
 *
 * Works over any number of `.mc-pano` layers. Layer 0 is the base and is
 * always visible; every later layer declares `data-start="<selector>"` and
 * fades in as that section approaches. Boundaries are measured from the real
 * element positions on every resize, so they can't drift out of sync when
 * the copy changes.
 *
 * Setting `data-mode="single"` on `.mc-panorama` pins layer 0 and skips all
 * cross-fading.
 */

export default class Panorama {
  constructor() {
    this.root = document.querySelector('.mc-panorama');
    this.layers = Array.from(document.querySelectorAll('.mc-pano'));
    if (!this.root || this.layers.length === 0) return;

    if (this.root.dataset.mode === 'single' || this.layers.length === 1) {
      this.layers.forEach((l, i) => { l.style.opacity = i === 0 ? '1' : '0'; });
      return;
    }

    this.ticking = false;
    this.onScroll = this.onScroll.bind(this);

    this.measure();
    this.update();

    window.addEventListener('scroll', this.onScroll, { passive: true });
    const remeasure = () => { this.measure(); this.update(); };
    window.addEventListener('resize', remeasure, { passive: true });
    // section heights settle once images have loaded
    window.addEventListener('load', remeasure);
  }

  /** Absolute page offset where each non-base layer takes over. */
  measure() {
    const pageEnd = document.documentElement.scrollHeight;

    this.stops = this.layers.slice(1).map((layer, i) => {
      const sel = layer.dataset.start;
      const el = sel ? document.querySelector(sel) : null;
      if (el) return el.getBoundingClientRect().top + window.scrollY;
      // even split as a fallback when the selector matches nothing
      return (pageEnd * (i + 1)) / this.layers.length;
    });

    // Fade across roughly a viewport of scrolling — short blends read as a
    // cut. But with several backdrops the boundaries can sit closer together
    // than that, and overlapping fades muddy into each other, so cap the
    // blend at 80% of the tightest gap between stops.
    let gap = Infinity;
    for (let i = 1; i < this.stops.length; i++) {
      gap = Math.min(gap, this.stops[i] - this.stops[i - 1]);
    }
    if (this.stops.length) {
      gap = Math.min(gap, this.stops[0]);          // top of page -> first stop
    }

    const ideal = window.innerHeight * 1.1;
    this.blend = Math.max(420, Math.min(ideal, gap * 0.8));
  }

  onScroll() {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => {
      this.update();
      this.ticking = false;
    });
  }

  update() {
    const probe = window.scrollY + window.innerHeight * 0.5;
    const blend = this.blend;

    this.layers.forEach((layer, i) => {
      if (i === 0) {
        layer.style.opacity = '1';
        return;
      }
      const edge = this.stops[i - 1];
      const t = Math.min(1, Math.max(0, (probe - (edge - blend * 0.5)) / blend));
      // Smoothstep. A linear ramp starts and stops abruptly at both ends,
      // which is what makes the change register as a jolt; easing in and out
      // means the fade begins and finishes imperceptibly.
      const eased = t * t * (3 - 2 * t);
      layer.style.opacity = eased.toFixed(4);
    });
  }
}
