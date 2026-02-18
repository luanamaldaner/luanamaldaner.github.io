// Fireflies — tiny glowing particles drifting like dust in sunlight
(function () {
  // Only in light mode
  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  const COUNT = 18;
  const fireflies = [];

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createFirefly() {
    const el = document.createElement('div');
    el.className = 'firefly';
    const size = random(3, 7);
    el.style.width = size + 'px';
    el.style.height = size + 'px';

    // Start position — center-biased
    let x = random(15, 85);
    let y = random(10, 80);
    el.style.left = x + 'vw';
    el.style.top = y + 'vh';
    el.style.opacity = '0';

    document.body.appendChild(el);

    return {
      el,
      x,
      y,
      size,
      // Drift direction & speed
      dx: random(-0.15, 0.15),
      dy: random(-0.1, 0.08),
      // Glow cycle
      phase: random(0, Math.PI * 2),
      speed: random(0.3, 0.8),
    };
  }

  function init() {
    for (let i = 0; i < COUNT; i++) {
      fireflies.push(createFirefly());
    }
    requestAnimationFrame(animate);
  }

  let lastTime = 0;
  function animate(time) {
    if (!lastTime) lastTime = time;
    const dt = (time - lastTime) / 1000;
    lastTime = time;

    const dark = isDark();

    for (const f of fireflies) {
      if (dark) {
        f.el.style.opacity = '0';
        continue;
      }

      // Drift
      f.x += f.dx * dt * 8;
      f.y += f.dy * dt * 8;

      // Wrap around gently
      if (f.x < -5) f.x = 105;
      if (f.x > 105) f.x = -5;
      if (f.y < -5) f.y = 105;
      if (f.y > 105) f.y = -5;

      // Glow pulse
      f.phase += f.speed * dt;
      const glow = 0.15 + 0.55 * Math.pow(Math.sin(f.phase), 2);

      f.el.style.left = f.x + 'vw';
      f.el.style.top = f.y + 'vh';
      f.el.style.opacity = glow.toFixed(3);
      f.el.style.boxShadow = `0 0 ${f.size * 2}px rgba(255, 235, 150, ${(glow * 0.6).toFixed(3)})`;
    }

    requestAnimationFrame(animate);
  }

  // Start after page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
