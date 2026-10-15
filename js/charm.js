/**
 * Charm
 *
 * Adds the decorative bits for the classic (professional) skin: soft sunrays
 * and drifting clouds (daytime only) and a small meadow in the footer.
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

const CLOUD = 'M26 58c-12 0-20-8-20-18s8-18 19-18c3-12 14-20 27-20 14 0 25 9 28 22 2-1 5-1 7-1 12 0 21 8 21 18s-9 17-21 17z';

const CLOUDS = [
  // left%, top px, width, opacity, drift px, duration s, delay s (kept to the edges, away from text)
  [1, 64, 190, 0.85, 50, 110, 0],
  [73, 34, 230, 0.8, 70, 140, -30],
  [88, 190, 130, 0.65, 40, 125, -70],
  [-2, 250, 110, 0.5, 35, 135, -50],
  [0, 450, 140, 0.55, 40, 100, -20],
  [86, 520, 150, 0.6, 40, 120, -60],
  [4, 860, 120, 0.45, 40, 130, -45],
  [80, 980, 170, 0.45, 50, 150, -15],
  [12, 1240, 130, 0.4, 40, 120, -80],
  [70, 1380, 110, 0.35, 40, 140, -35],
];

function addSky() {
  if (document.querySelector('.charm-sky')) return;
  const sky = document.createElement('div');
  sky.className = 'charm-sky';
  sky.setAttribute('aria-hidden', 'true');
  const sun = document.createElement('div');
  sun.className = 'charm-sun';
  const rays = document.createElement('div');
  rays.className = 'charm-rays';
  sky.append(sun, rays);
  for (const [left, top, w, o, x, d, delay] of CLOUDS) {
    const c = svg('0 0 130 62', 'charm-cloud', `<path d="${CLOUD}"/>`);
    c.style.cssText = `left:${left}%;top:${top}px;--w:${w}px;--o:${o};--x:${x}px;--d:${d}s;--delay:${delay}s`;
    sky.append(c);
  }
  document.body.prepend(sky);
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

export default function initCharm() {
  addSky();
  addMeadow();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initCharm);
else initCharm();
