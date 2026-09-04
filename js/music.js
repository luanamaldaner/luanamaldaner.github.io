/**
 * Music toggle
 *
 * A Minecraft-style note-block button that loops a quiet ambient track.
 *
 * The audio is an ORIGINAL composition generated for this site — Minecraft's
 * real soundtrack is C418's copyrighted work and can't be published here.
 * Swap files/ambient-loop.wav for anything you have the rights to and this
 * keeps working unchanged.
 *
 * Notes:
 *  - Browsers block autoplay, so playback only ever starts from a click.
 *  - The audio element is preload="none"; nothing downloads until first use.
 *  - The choice is remembered, but it never auto-starts on a fresh load.
 */

const STORAGE_KEY = 'mc-music-on';

export default class Music {
  constructor() {
    this.btn = document.getElementById('music-toggle');
    this.audio = document.getElementById('mc-music');
    if (!this.btn || !this.audio) return;

    this.audio.volume = 0.35;
    this.audio.loop = true;
    this.playing = false;

    this.btn.addEventListener('click', () => this.toggle());

    // If it was on last visit, arm it to start at the first interaction —
    // autoplay policy won't allow starting cold.
    if (localStorage.getItem(STORAGE_KEY) === '1') {
      const arm = () => {
        this.play();
        window.removeEventListener('pointerdown', arm);
        window.removeEventListener('keydown', arm);
      };
      window.addEventListener('pointerdown', arm, { once: true });
      window.addEventListener('keydown', arm, { once: true });
    }
  }

  toggle() {
    if (this.playing) this.pause();
    else this.play();
  }

  play() {
    const p = this.audio.play();
    if (p && p.catch) {
      p.catch(() => { /* blocked until a real gesture; ignore */ });
    }
    this.playing = true;
    this.btn.classList.add('playing');
    this.btn.setAttribute('aria-pressed', 'true');
    this.btn.setAttribute('aria-label', 'Turn music off');
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) { /* private mode */ }
  }

  pause() {
    this.audio.pause();
    this.playing = false;
    this.btn.classList.remove('playing');
    this.btn.setAttribute('aria-pressed', 'false');
    this.btn.setAttribute('aria-label', 'Turn music on');
    try { localStorage.setItem(STORAGE_KEY, '0'); } catch (e) { /* private mode */ }
  }
}
