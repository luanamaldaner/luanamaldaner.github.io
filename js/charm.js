/**
 * Charm
 *
 * Adds the decorative bits for the classic (professional) skin: soft sunrays
 * and fluffy pastel clouds on the sides where the background circles used to
 * be (daytime only), flowers in the empty corners and margins, and a small
 * meadow in the footer.
 * They're plain inline SVG/CSS, hidden from screen readers and click-through,
 * and css/charm.css only shows them when html[data-skin="min"] is set, so the
 * Minecraft skin never sees them.
 */

const NS = 'http://www.w3.org/2000/svg';

function svg(viewBox, cls, inner) {
  const el = document.createElementNS(NS, 'svg');
  el.setAttribute('viewBox', viewBox);
  el.setAttribute('class', cls);
  el.setAttribute('aria-hidden', 'true');
  el.setAttribute('focusable', 'false');
  el.innerHTML = inner;
  return el;
}

// Five petals around a centre, at (x, y) with petal length r.
function flower(x, y, r, alt = false) {
  let s = `<g transform="translate(${x} ${y})">`;
  for (let i = 0; i < 5; i++) {
    s += `<ellipse class="petal${alt ? ' b' : ''}" cx="0" cy="${-r * 0.55}" rx="${r * 0.36}" ry="${r * 0.55}" transform="rotate(${i * 72})"/>`;
  }
  return `${s}<circle class="center" r="${r * 0.28}"/></g>`;
}

// ---------------------------------------------------------------- flowers

const IMG = name => new URL(`../images/charm/${name}`, import.meta.url).href;

function img(name, cls, style) {
  const el = document.createElement('img');
  el.src = IMG(name);
  el.alt = '';
  el.setAttribute('aria-hidden', 'true');
  el.decoding = 'async';
  el.loading = 'lazy';
  el.className = cls;
  if (style) el.style.cssText = style;
  return el;
}

// Soft white puffy clouds (generated from her reference, cut out into
// images/charm/cloud-N.png) peeking in from the sides where the circles were.
const SIDE_CLOUDS = [
  { cls: 'c1', img: 'mcloud-3.png' },  // top right
  { cls: 'c2', img: 'mcloud-1.png' },  // lower left
  { cls: 'c3', img: 'mcloud-6.png' },  // middle right
  { cls: 'c4', img: 'mcloud-2.png' },  // bottom left
  { cls: 'c5', img: 'mcloud-4.png' },  // upper left
  { cls: 'c6', img: 'mcloud-5.png' },  // lower right
];

function addSky() {
  if (document.querySelector('.charm-sky')) return;
  const sky = document.createElement('div');
  sky.className = 'charm-sky';
  sky.setAttribute('aria-hidden', 'true');
  const rays = document.createElement('div');
  rays.className = 'charm-rays';
  sky.append(rays);
  // Frutiger Aero look: glossy bubbles
  for (let i = 0; i < 7; i++) {
    const b = document.createElement('span');
    b.className = `charm-bubble b${i}`;
    sky.append(b);
  }
  const layer = document.querySelector('.deco-shapes');
  if (layer) layer.append(sky); else document.body.prepend(sky);
}

function addMeadow() {
  const footer = document.querySelector('.site-footer .container') || document.querySelector('.site-footer');
  if (!footer || footer.querySelector('.charm-meadow')) return;
  let grass = '';
  for (let x = 6; x < 560; x += 9) {
    const h = 6 + ((x * 37) % 11);
    grass += `M${x} 40 q${(x % 3) - 1} -${h / 2} ${(x % 5) - 2} -${h} `;
  }
  const blooms = [[60, 22, 7, false], [150, 26, 5, true], [268, 18, 8, false], [300, 27, 5, true], [410, 22, 6, false], [500, 25, 7, true]];
  let inner = `<path class="grass" d="${grass}"/>`;
  for (const [x, y, r, alt] of blooms) inner += `<path class="stem" d="M${x} 40 L${x} ${y + r}"/>` + flower(x, y, r, alt);
  footer.prepend(svg('0 0 560 44', 'charm-meadow', inner));
}

// A few open five-petal blossoms in tidy spots: beside the name and the footer.
const SPOTS = [
  ['.site-header', 'left:calc(50% - 300px);top:40%', 30, 1, -10],
  ['.site-header', 'left:calc(50% - 268px);top:52%', 20, 4, 18],
  ['.site-header', 'right:calc(50% - 300px);top:38%', 30, 6, 12],
  ['.site-header', 'right:calc(50% - 270px);top:50%', 20, 8, -16],
  ['.site-footer', 'left:calc(50% - 330px);top:34%', 24, 2, -8],
  ['.site-footer', 'right:calc(50% - 330px);top:34%', 24, 7, 14],
];

function addBlossoms() {
  SPOTS.forEach(([sel, pos, size, n, rot], i) => {
    const box = document.querySelector(sel);
    if (!box || box.querySelector(`.charm-spot[data-i="${i}"]`)) return;
    const el = img(`blossom-${n}.png`, 'charm-blossom charm-spot', `${pos};--s:${size}px;--r:${rot}deg;--bob:${5 + (i % 3)}s;--delay:${(-i * 0.9).toFixed(1)}s`);
    el.dataset.i = i;
    box.append(el);
  });
}

// Which look to show. A = soft minimal (default), B = nature, C = Frutiger Aero.
// Preview the others with ?look=b or ?look=c; the choice is remembered.
function pickLook() {
  let look = 'e';
  try {
    const q = new URLSearchParams(location.search).get('look');
    if (q && /^[a-e]$/.test(q)) localStorage.setItem('charm-look', q);
    look = localStorage.getItem('charm-look') || 'e';
  } catch {}
  document.documentElement.dataset.look = look;
}

// Lily pads tucked beside the footer and the education section.
function addLilies() {
  const spots = [['.site-footer', 'charm-lily foot'], ['#education', 'charm-lily edu']];
  for (const [sel, cls] of spots) {
    const box = document.querySelector(sel);
    if (box && !box.querySelector('.charm-lily')) box.append(img('lilypads.png', cls));
  }
}

// Nature look: rolling hills along the bottom of the header and the footer.
function addHills() {
  for (const sel of ['.site-header', '.site-footer']) {
    const box = document.querySelector(sel);
    if (box && !box.querySelector('.charm-hills')) box.append(img('hills-min.png', 'charm-hills'));
  }
}

// Bubbles that scroll with the page: spread down the whole document, alternating
// sides and sizes, peeking in from the edges, each gently floating.
function addPageBubbles() {
  let layer = document.querySelector('.charm-bubbles');
  if (!layer) {
    layer = document.createElement('div');
    layer.className = 'charm-bubbles';
    layer.setAttribute('aria-hidden', 'true');
    document.body.prepend(layer);
  }
  const place = () => {
    const H = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    const W = document.documentElement.clientWidth;
    const phone = W < 720;
    layer.style.height = `${H}px`;
    layer.replaceChildren();
    // a fixed pseudo-random sequence so the layout is the same on every visit
    let seed = 7;
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    let y = -80, side = 1, i = 0;
    while (y < H - 120) {
      const big = i % 3 !== 2;
      const d = big ? (phone ? 130 + rnd() * 70 : 220 + rnd() * 140) : (phone ? 34 + rnd() * 20 : 46 + rnd() * 40);
      const b = document.createElement('span');
      b.className = `charm-pbubble ${side < 0 ? 'L' : 'R'}`;
      const peek = big ? d * (0.38 + rnd() * 0.16) : -(W * (0.06 + rnd() * 0.08));
      b.style.cssText = `width:${d.toFixed(0)}px;height:${d.toFixed(0)}px;top:${y.toFixed(0)}px;${side < 0 ? 'left' : 'right'}:${(-peek).toFixed(0)}px;` +
        `--fx:${(6 + rnd() * 10).toFixed(0)}px;--fy:${(10 + rnd() * 16).toFixed(0)}px;--fd:${(9 + rnd() * 8).toFixed(1)}s;--fdl:${(-rnd() * 10).toFixed(1)}s`;
      layer.append(b);
      y += big ? (phone ? 260 + rnd() * 160 : 380 + rnd() * 260) : 120 + rnd() * 80;
      if (big) side = -side;
      i++;
    }
  };
  place();
  let t; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(place, 200); });
  addEventListener('load', place);
  setTimeout(place, 1500);
}

export default function initCharm() {
  pickLook();
  addSky();
  addMeadow();
  addPageBubbles();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initCharm);
else initCharm();
