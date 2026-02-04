// Shooting Stars (dark mode only)
(function() {
  const container = document.querySelector('.shooting-stars');
  if (!container) return;

  // Create background dots
  function createBackgroundDots() {
    // Small dim dots
    for (let i = 0; i < 40; i++) {
      const dot = document.createElement('div');
      dot.className = 'star-dot';
      dot.style.top = Math.random() * 100 + '%';
      dot.style.left = Math.random() * 100 + '%';
      dot.style.animationDelay = Math.random() * 4 + 's';
      container.appendChild(dot);
    }
    // Brighter larger dots
    for (let i = 0; i < 15; i++) {
      const dot = document.createElement('div');
      dot.className = 'star-dot star-dot-bright';
      dot.style.top = Math.random() * 100 + '%';
      dot.style.left = Math.random() * 100 + '%';
      dot.style.animationDelay = Math.random() * 5 + 's';
      container.appendChild(dot);
    }
  }

  function createShootingStar() {
    const star = document.createElement('div');
    star.className = 'shooting-star';

    // Random position - top half of screen, favor edges
    star.style.top = Math.random() * 35 + '%';

    // Favor left and right edges (avoid middle 30-70%)
    let left;
    if (Math.random() < 0.7) {
      // 70% chance to spawn on edges
      left = Math.random() < 0.5 ? Math.random() * 25 : 75 + Math.random() * 20;
    } else {
      // 30% chance for middle
      left = 25 + Math.random() * 50;
    }
    star.style.left = left + '%';

    // Random size - smaller
    const height = 50 + Math.random() * 40;
    star.style.height = height + 'px';

    // Add to container
    container.appendChild(star);

    // Trigger animation
    const duration = 0.8 + Math.random() * 0.4;
    star.style.animation = `falling ${duration}s ease-in forwards`;

    // Remove after animation
    setTimeout(() => {
      star.remove();
    }, duration * 1000 + 100);
  }

  function scheduleNext() {
    // Random delay between 3-6 seconds
    const delay = 3000 + Math.random() * 3000;
    setTimeout(() => {
      createShootingStar();
      scheduleNext();
    }, delay);
  }

  // Initialize
  createBackgroundDots();

  // Start after a short delay
  setTimeout(() => {
    createShootingStar();
    scheduleNext();
  }, 1500);
})();
