/**
 * Glass Interactions
 * 3D tilt effects and glass morphing on hover
 */

/**
 * Tilt Effect Class
 * Adds 3D tilt effect to elements on mouse move
 */
export class TiltEffect {
  constructor(selector, options = {}) {
    this.selector = selector;
    this.options = {
      maxTilt: options.maxTilt || 10, // degrees
      perspective: options.perspective || 1000, // pixels
      scale: options.scale || 1.02,
      speed: options.speed || 400, // transition duration in ms
      glare: options.glare || false,
      ...options
    };

    this.elements = [];
    this.init();
  }

  /**
   * Initialize tilt effect
   */
  init() {
    this.elements = Array.from(document.querySelectorAll(this.selector));

    if (this.elements.length === 0) {
      console.warn(`No elements found for selector: ${this.selector}`);
      return;
    }

    this.elements.forEach(element => {
      this.setupElement(element);
    });

    console.log(`Tilt effect initialized: ${this.elements.length} elements`);
  }

  /**
   * Set up individual element
   * @param {HTMLElement} element
   */
  setupElement(element) {
    // Store original transform style
    element.dataset.originalTransform = element.style.transform || '';

    // Set up event listeners
    element.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
    element.addEventListener('mousemove', this.handleMouseMove.bind(this));
    element.addEventListener('mouseleave', this.handleMouseLeave.bind(this));

    // Set transition
    element.style.transition = `transform ${this.options.speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;
  }

  /**
   * Handle mouse enter
   * @param {MouseEvent} e
   */
  handleMouseEnter(e) {
    const element = e.currentTarget;
    element.style.willChange = 'transform';
  }

  /**
   * Handle mouse move
   * @param {MouseEvent} e
   */
  handleMouseMove(e) {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();

    // Calculate mouse position relative to card center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Calculate percentages
    const percentX = mouseX / (rect.width / 2);
    const percentY = mouseY / (rect.height / 2);

    // Calculate tilt angles
    const rotateY = percentX * this.options.maxTilt;
    const rotateX = -percentY * this.options.maxTilt;

    // Apply 3D transform
    element.style.transform = `
      perspective(${this.options.perspective}px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale3d(${this.options.scale}, ${this.options.scale}, ${this.options.scale})
    `;

    // Add glare effect if enabled
    if (this.options.glare) {
      this.updateGlare(element, percentX, percentY);
    }
  }

  /**
   * Handle mouse leave
   * @param {MouseEvent} e
   */
  handleMouseLeave(e) {
    const element = e.currentTarget;

    // Reset transform
    element.style.transform = `
      perspective(${this.options.perspective}px)
      rotateX(0deg)
      rotateY(0deg)
      scale3d(1, 1, 1)
    `;

    // Remove will-change
    element.style.willChange = 'auto';

    // Remove glare
    if (this.options.glare) {
      const glare = element.querySelector('.tilt-glare');
      if (glare) {
        glare.style.opacity = '0';
      }
    }
  }

  /**
   * Update glare effect
   * @param {HTMLElement} element
   * @param {number} percentX
   * @param {number} percentY
   */
  updateGlare(element, percentX, percentY) {
    let glare = element.querySelector('.tilt-glare');

    if (!glare) {
      glare = document.createElement('div');
      glare.classList.add('tilt-glare');
      glare.style.position = 'absolute';
      glare.style.top = '0';
      glare.style.left = '0';
      glare.style.width = '100%';
      glare.style.height = '100%';
      glare.style.borderRadius = 'inherit';
      glare.style.pointerEvents = 'none';
      glare.style.transition = 'opacity 0.3s ease';
      element.appendChild(glare);
    }

    // Calculate glare position and intensity
    const glareX = (percentX + 1) * 50; // 0-100%
    const glareY = (percentY + 1) * 50; // 0-100%
    const glareIntensity = 0.3;

    glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, ${glareIntensity}) 0%, transparent 50%)`;
    glare.style.opacity = '1';
  }

  /**
   * Add new elements
   * @param {HTMLElement|HTMLElement[]} elements
   */
  add(elements) {
    const elementsArray = Array.isArray(elements) ? elements : [elements];

    elementsArray.forEach(element => {
      if (element instanceof HTMLElement && !this.elements.includes(element)) {
        this.setupElement(element);
        this.elements.push(element);
      }
    });
  }

  /**
   * Remove elements
   * @param {HTMLElement|HTMLElement[]} elements
   */
  remove(elements) {
    const elementsArray = Array.isArray(elements) ? elements : [elements];

    elementsArray.forEach(element => {
      const index = this.elements.indexOf(element);
      if (index > -1) {
        // Remove event listeners
        element.removeEventListener('mouseenter', this.handleMouseEnter.bind(this));
        element.removeEventListener('mousemove', this.handleMouseMove.bind(this));
        element.removeEventListener('mouseleave', this.handleMouseLeave.bind(this));

        // Reset transform
        element.style.transform = '';

        // Remove from array
        this.elements.splice(index, 1);
      }
    });
  }

  /**
   * Destroy tilt effect
   */
  destroy() {
    this.elements.forEach(element => {
      element.removeEventListener('mouseenter', this.handleMouseEnter.bind(this));
      element.removeEventListener('mousemove', this.handleMouseMove.bind(this));
      element.removeEventListener('mouseleave', this.handleMouseLeave.bind(this));
      element.style.transform = '';
      element.style.willChange = 'auto';
    });

    this.elements = [];
  }
}

/**
 * Glass Morph Class
 * Enhanced glass morphing effects on hover
 */
export class GlassMorph {
  constructor(selector) {
    this.selector = selector;
    this.elements = [];
    this.init();
  }

  /**
   * Initialize glass morph
   */
  init() {
    this.elements = Array.from(document.querySelectorAll(this.selector));

    if (this.elements.length === 0) {
      console.warn(`No elements found for selector: ${this.selector}`);
      return;
    }

    this.elements.forEach(element => {
      this.setupElement(element);
    });

    console.log(`Glass morph initialized: ${this.elements.length} elements`);
  }

  /**
   * Set up individual element
   * @param {HTMLElement} element
   */
  setupElement(element) {
    // Store original styles
    const computedStyle = window.getComputedStyle(element);
    element.dataset.originalBlur = computedStyle.getPropertyValue('--blur-strength') || '20px';

    element.addEventListener('mouseenter', this.morphIn.bind(this));
    element.addEventListener('mouseleave', this.morphOut.bind(this));
  }

  /**
   * Morph in (on hover)
   * @param {MouseEvent} e
   */
  morphIn(e) {
    const element = e.currentTarget;

    // Increase blur
    element.style.setProperty('--blur-strength', '30px');

    // Get current theme
    const theme = document.documentElement.getAttribute('data-theme');

    // Adjust background opacity based on theme
    if (theme === 'dark') {
      element.style.background = 'rgba(29, 29, 31, 0.9)';
    } else {
      element.style.background = 'rgba(255, 255, 255, 0.9)';
    }
  }

  /**
   * Morph out (on mouse leave)
   * @param {MouseEvent} e
   */
  morphOut(e) {
    const element = e.currentTarget;

    // Reset blur
    const originalBlur = element.dataset.originalBlur || '20px';
    element.style.setProperty('--blur-strength', originalBlur);

    // Reset background
    element.style.background = '';
  }

  /**
   * Destroy glass morph
   */
  destroy() {
    this.elements.forEach(element => {
      element.removeEventListener('mouseenter', this.morphIn.bind(this));
      element.removeEventListener('mouseleave', this.morphOut.bind(this));
      element.style.setProperty('--blur-strength', '');
      element.style.background = '';
    });

    this.elements = [];
  }
}

// Export individual classes as default export object
export default { TiltEffect, GlassMorph };
