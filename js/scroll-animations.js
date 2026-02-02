/**
 * Scroll Animations
 * Intersection Observer based reveal animations for Liquid Glass design
 */

export default class ScrollAnimations {
  constructor(options = {}) {
    this.options = {
      threshold: options.threshold || 0.1,
      rootMargin: options.rootMargin || '0px 0px -50px 0px',
      once: options.once !== false
    };

    this.observer = null;
    this.elements = [];
    this.init();
  }

  init() {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.showAllElements();
      return;
    }

    // Check for Intersection Observer support
    if (!('IntersectionObserver' in window)) {
      this.showAllElements();
      return;
    }

    this.createObserver();
    this.observeElements();
  }

  createObserver() {
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        threshold: this.options.threshold,
        rootMargin: this.options.rootMargin
      }
    );
  }

  observeElements() {
    this.elements = Array.from(document.querySelectorAll('[data-animate]'));
    this.elements.forEach(el => this.observer.observe(el));
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.animateElement(entry.target);

        if (this.options.once) {
          this.observer.unobserve(entry.target);
        }
      } else if (!this.options.once) {
        entry.target.classList.remove('is-visible');
      }
    });
  }

  animateElement(element) {
    // Handle staggered animations
    const parent = element.closest('[data-stagger]');
    if (parent) {
      const siblings = Array.from(parent.querySelectorAll('[data-animate]'));
      const index = siblings.indexOf(element);
      element.style.transitionDelay = `${index * 0.1}s`;
    }

    // Trigger the animation
    element.classList.add('is-visible');

    // Reset delay after animation completes
    setTimeout(() => {
      element.style.transitionDelay = '';
    }, 1000);

    // Dispatch event
    element.dispatchEvent(new CustomEvent('animated', {
      detail: { type: element.getAttribute('data-animate') }
    }));
  }

  showAllElements() {
    document.querySelectorAll('[data-animate]').forEach(el => {
      el.classList.add('is-visible');
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.filter = 'none';
    });
  }

  observe(elements) {
    if (!this.observer) return;

    let arr = [];
    if (typeof elements === 'string') {
      arr = Array.from(document.querySelectorAll(elements));
    } else if (elements instanceof HTMLElement) {
      arr = [elements];
    } else if (Array.isArray(elements)) {
      arr = elements;
    }

    arr.forEach(el => {
      if (el instanceof HTMLElement) {
        this.observer.observe(el);
        this.elements.push(el);
      }
    });
  }

  refresh() {
    if (!this.observer) return;
    this.observer.disconnect();
    this.elements = [];
    this.observeElements();
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.elements = [];
  }
}
