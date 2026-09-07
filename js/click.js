/**
 * Click
 *
 * A short button tap on UI controls, in Minecraft mode only.
 *
 * Synthesised with the Web Audio API. Minecraft's own click is Mojang's
 * asset, so nothing from it is shipped here — but its acoustic profile was
 * measured, and these parameters are tuned to that character:
 *
 *   transient      ~115ms, peak decays to -40dB in ~2ms (very percussive)
 *   centroid       ~2.7kHz
 *   dominant bands ~50Hz and ~270Hz
 *   energy         37% below 300Hz, spread fairly evenly 300Hz-8kHz
 *   flatness       0.034 -> TONAL, not a noise burst
 *
 * That last figure is why v2 was wrong: it was built around filtered noise,
 * when the sound is really a stack of short tuned partials with only a whisper
 * of noise on the attack. v3 follows the measurements:
 *
 *   1. sub sine ~52Hz      - the thump under everything
 *   2. body ~270Hz         - the fundamental you actually hear
 *   3. bright ~2.7kHz      - sets the centroid, gives it the "tick"
 *   4. tiny noise attack   - just enough edge to read as a strike
 *
 * TUNING: BRIGHT_HZ is the main knob. Raise it for a sharper tick, lower it
 * for a duller knock. BRIGHT_LVL controls how clicky vs woody it sounds.
 */

const VOLUME     = 0.24;
const SUB_HZ     = 52;     // measured low band
const SUB_MS     = 0.055;
const BODY_HZ    = 272;    // measured dominant band
const BODY_END   = 186;
const BODY_MS    = 0.048;
const BRIGHT_HZ  = 2700;   // measured spectral centroid
const BRIGHT_END = 1500;
const BRIGHT_MS  = 0.018;
const BRIGHT_LVL = 0.34;
const NOISE_MS   = 0.007;  // barely there - the sound is tonal
const NOISE_LVL  = 0.20;
const LOWPASS    = 7800;

const SELECTOR = [
  '#theme-toggle',
  '#music-toggle',
  '#skin-toggle',
  '.nav-link',
  '.social-icon',
  '.carousel-btn',
  '.back-link',
  '.glass-pill',
].join(',');

/**
 * Optional sample, OPT-IN.
 *
 * To use your own click sound instead of the synth, put the file in files/
 * and add the path to the <html> tag:
 *
 *     <html lang="en" data-click-sample="files/click.mp3">
 *
 * Nothing is bundled here. Without that attribute no request is made at all —
 * probing for a file that usually isn't there just logs a 404 on every visit.
 */
function sampleUrl() {
  const rel = document.documentElement.dataset.clickSample;
  if (!rel) return null;
  const base = location.pathname.includes('/projects/') ? '../' : '';
  return base + rel;
}

export default class Click {
  constructor() {
    this.ctx = null;
    this.noise = null;
    this.sample = null;      // decoded AudioBuffer once loaded
    this.sampleTried = false;

    document.addEventListener('pointerdown', (e) => {
      if (document.documentElement.dataset.skin === 'min') return;
      if (!e.target.closest(SELECTOR)) return;
      this.play();
    });
  }

  ensure() {
    if (this.ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try {
      this.ctx = new AC();
    } catch (e) {
      return false;
    }
    const n = Math.ceil(this.ctx.sampleRate * NOISE_MS);
    this.noise = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < n; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3);
    }
    return true;
  }

  /** One decaying partial. */
  partial(type, f0, f1, level, ms, dest, t) {
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f0, t);
    osc.frequency.exponentialRampToValueAtTime(f1, t + ms);
    g.gain.setValueAtTime(level, t);
    g.gain.exponentialRampToValueAtTime(0.0004, t + ms);
    osc.connect(g).connect(dest);
    osc.start(t);
    osc.stop(t + ms + 0.01);
  }

  /** Fetch and decode the optional sample once, quietly. */
  loadSample() {
    if (this.sampleTried) return;
    this.sampleTried = true;
    const url = sampleUrl();
    if (!url) return;                  // not opted in - synth only
    fetch(url)
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject()))
      .then((buf) => this.ctx.decodeAudioData(buf))
      .then((decoded) => { this.sample = decoded; })
      .catch(() => { /* no sample present - the synth handles it */ });
  }

  playSample() {
    const src = this.ctx.createBufferSource();
    const g = this.ctx.createGain();
    g.gain.value = 0.7;
    src.buffer = this.sample;
    src.connect(g).connect(this.ctx.destination);
    src.start(this.ctx.currentTime);
  }

  play() {
    if (!this.ensure()) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    this.loadSample();
    if (this.sample) { this.playSample(); return; }

    const ctx = this.ctx;
    const t = ctx.currentTime;

    const out = ctx.createGain();
    out.gain.value = VOLUME;
    const soften = ctx.createBiquadFilter();
    soften.type = 'lowpass';
    soften.frequency.value = LOWPASS;
    out.connect(soften).connect(ctx.destination);

    this.partial('sine',     SUB_HZ,    SUB_HZ * 0.8, 0.9,        SUB_MS,    out, t);
    this.partial('triangle', BODY_HZ,   BODY_END,     0.75,       BODY_MS,   out, t);
    this.partial('triangle', BRIGHT_HZ, BRIGHT_END,   BRIGHT_LVL, BRIGHT_MS, out, t);

    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(NOISE_LVL, t);
    ng.gain.exponentialRampToValueAtTime(0.0004, t + NOISE_MS);
    src.connect(ng).connect(out);
    src.start(t);
  }
}
