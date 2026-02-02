/**
 * Particle Background
 * Canvas-based particle system with subtle animations
 */

export default class ParticleBackground {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);

    if (!this.canvas) {
      console.warn(`Canvas with id "${canvasId}" not found`);
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];

    // Configuration options - BME-inspired colors
    this.options = {
      particleCount: options.particleCount || 60,
      particleSize: { min: 1, max: 4 },
      speed: { min: -0.3, max: 0.3 },
      opacity: { min: 0.15, max: 0.4 },
      // BME-inspired color palette (teal, purple, pink, cyan)
      colors: options.colors || [
        '8, 145, 178',    // Teal - medical/scientific
        '139, 92, 246',   // Purple - DNA/cellular
        '236, 72, 153',   // Pink - biological
        '34, 211, 238'    // Cyan - bioluminescent
      ],
      darkColors: options.darkColors || [
        '34, 211, 238',   // Cyan
        '168, 85, 247',   // Purple
        '244, 114, 182',  // Pink
        '56, 189, 248'    // Sky blue
      ],
      fps: options.fps || 30,
      ...options
    };

    this.fpsInterval = 1000 / this.options.fps;
    this.then = Date.now();
    this.animationId = null;

    this.init();
  }

  /**
   * Initialize the particle system
   */
  init() {
    this.resize();
    window.addEventListener('resize', this.resize.bind(this));

    // Listen for theme changes to update particle color
    window.addEventListener('themechange', this.handleThemeChange.bind(this));

    this.createParticles();
    this.animate();

    console.log(`Particle background initialized: ${this.particles.length} particles`);
  }

  /**
   * Handle canvas resize
   */
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // Recreate particles if canvas was resized
    if (this.particles.length > 0) {
      this.createParticles();
    }
  }

  /**
   * Create particles with multiple colors
   */
  createParticles() {
    this.particles = [];
    const colors = this.options.colors;

    for (let i = 0; i < this.options.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * (this.options.particleSize.max - this.options.particleSize.min)
              + this.options.particleSize.min,
        speedX: (Math.random() * (this.options.speed.max - this.options.speed.min)
                + this.options.speed.min),
        speedY: (Math.random() * (this.options.speed.max - this.options.speed.min)
                + this.options.speed.min),
        opacity: Math.random() * (this.options.opacity.max - this.options.opacity.min)
                + this.options.opacity.min,
        colorIndex: Math.floor(Math.random() * colors.length),
        pulseOffset: Math.random() * Math.PI * 2 // For subtle pulsing effect
      });
    }
  }

  /**
   * Animation loop (throttled to target FPS)
   */
  animate() {
    this.animationId = requestAnimationFrame(this.animate.bind(this));

    const now = Date.now();
    const elapsed = now - this.then;

    if (elapsed > this.fpsInterval) {
      this.then = now - (elapsed % this.fpsInterval);
      this.draw();
    }
  }

  /**
   * Draw frame
   */
  draw() {
    // Clear canvas - let CSS background show through
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update time for animations
    this.time = (this.time || 0) + 0.01;

    // Update and draw particles
    this.particles.forEach(particle => {
      this.updateParticle(particle);
      this.drawParticle(particle);
    });

    // Optional: Draw connections between nearby particles
    if (this.options.connectParticles) {
      this.drawConnections();
    }
  }

  /**
   * Update particle position
   * @param {Object} particle
   */
  updateParticle(particle) {
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    // Wrap around edges
    if (particle.x < 0) particle.x = this.canvas.width;
    if (particle.x > this.canvas.width) particle.x = 0;
    if (particle.y < 0) particle.y = this.canvas.height;
    if (particle.y > this.canvas.height) particle.y = 0;
  }

  /**
   * Draw a single particle with multi-color and subtle pulsing
   * @param {Object} particle
   */
  drawParticle(particle) {
    // Get current theme colors
    const theme = document.documentElement.getAttribute('data-theme');
    const colors = theme === 'dark' ? this.options.darkColors : this.options.colors;
    const color = colors[particle.colorIndex];

    // Add subtle pulsing to opacity
    const pulse = Math.sin(this.time * 2 + particle.pulseOffset) * 0.1;
    const opacity = Math.max(0.1, Math.min(0.5, particle.opacity + pulse));

    // Draw glow effect
    const gradient = this.ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.size * 3
    );
    gradient.addColorStop(0, `rgba(${color}, ${opacity})`);
    gradient.addColorStop(0.5, `rgba(${color}, ${opacity * 0.3})`);
    gradient.addColorStop(1, `rgba(${color}, 0)`);

    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
    this.ctx.fillStyle = gradient;
    this.ctx.fill();

    // Draw core particle
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(${color}, ${opacity * 1.5})`;
    this.ctx.fill();
  }

  /**
   * Draw connections between nearby particles (optional)
   */
  drawConnections() {
    const maxDistance = 150;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.2;

          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(${this.options.color}, ${opacity})`;
          this.ctx.lineWidth = 1;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  /**
   * Handle theme change event
   * Colors are now handled dynamically in drawParticle
   * @param {CustomEvent} event
   */
  handleThemeChange(event) {
    // Theme colors are handled dynamically in drawParticle
    // No need to update options here
    console.log(`Theme changed to: ${event.detail.theme}`);
  }

  /**
   * Pause animation
   */
  pause() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Resume animation
   */
  resume() {
    if (!this.animationId) {
      this.then = Date.now();
      this.animate();
    }
  }

  /**
   * Destroy the particle system
   */
  destroy() {
    this.pause();
    window.removeEventListener('resize', this.resize.bind(this));
    window.removeEventListener('themechange', this.handleThemeChange.bind(this));
    this.particles = [];

    // Clear canvas
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  /**
   * Update options dynamically
   * @param {Object} options
   */
  updateOptions(options) {
    this.options = { ...this.options, ...options };

    if (options.particleCount) {
      this.createParticles();
    }
  }
}
