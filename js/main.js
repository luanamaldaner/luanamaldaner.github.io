/**
 * Apple Liquid Glass Portfolio
 * Main JavaScript
 */

import ThemeSwitcher from './theme-switcher.js';
import ScrollAnimations from './scroll-animations.js';

class App {
  constructor() {
    this.themeSwitcher = null;
    this.scrollAnimations = null;
    this.nav = null;
    this.lastScrollY = 0;
    this.ticking = false;

    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.onReady());
    } else {
      this.onReady();
    }
  }

  onReady() {
    this.initThemeSwitcher();
    this.initScrollAnimations();
    this.initSmoothScroll();
    this.initScrollProgress();
    this.initNavigation();
    this.initAccessibility();
    this.initCarousels();
  }

  initThemeSwitcher() {
    try {
      this.themeSwitcher = new ThemeSwitcher();
    } catch (e) {
      console.error('Theme switcher error:', e);
    }
  }

  initScrollAnimations() {
    try {
      this.scrollAnimations = new ScrollAnimations({
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
    } catch (e) {
      console.error('Scroll animations error:', e);
    }
  }

  initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    };

    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          updateProgress();
          this.ticking = false;
        });
        this.ticking = true;
      }
    }, { passive: true });

    updateProgress();
  }

  initNavigation() {
    this.nav = document.querySelector('.floating-nav');
    if (!this.nav) return;

    const navLinks = this.nav.querySelectorAll('a');
    const sections = document.querySelectorAll('section[id]');

    // Scroll behavior for nav
    let lastScrollY = window.scrollY;
    let navHidden = false;

    const handleNavScroll = () => {
      const currentScrollY = window.scrollY;

      // Add scrolled class when scrolled
      if (currentScrollY > 50) {
        this.nav.classList.add('scrolled');
      } else {
        this.nav.classList.remove('scrolled');
      }

      // Hide/show nav based on scroll direction (only on desktop)
      if (window.innerWidth >= 768) {
        if (currentScrollY > lastScrollY && currentScrollY > 200 && !navHidden) {
          this.nav.classList.add('hidden');
          navHidden = true;
        } else if (currentScrollY < lastScrollY && navHidden) {
          this.nav.classList.remove('hidden');
          navHidden = false;
        }
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', () => {
      window.requestAnimationFrame(handleNavScroll);
    }, { passive: true });

    // Active link highlighting
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));
  }

  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();

          // Close mobile nav if open
          if (this.nav) {
            this.nav.classList.remove('hidden');
          }

          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          // Update URL
          history.pushState(null, null, href);
        }
      });
    });
  }

  initAccessibility() {
    // Reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleMotion = (e) => {
      if (e.matches) {
        document.documentElement.style.setProperty('--transition-fast', '0.01ms');
        document.documentElement.style.setProperty('--transition-medium', '0.01ms');
        document.documentElement.style.setProperty('--transition-slow', '0.01ms');
      } else {
        document.documentElement.style.removeProperty('--transition-fast');
        document.documentElement.style.removeProperty('--transition-medium');
        document.documentElement.style.removeProperty('--transition-slow');
      }
    };

    handleMotion(prefersReducedMotion);
    prefersReducedMotion.addEventListener('change', handleMotion);

    // Keyboard navigation indicator
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-nav');
    });
  }

  initCarousels() {
    const carousels = document.querySelectorAll('[data-carousel]');

    carousels.forEach(carousel => {
      const slides = carousel.querySelectorAll('.carousel-slide');
      const prevBtn = carousel.querySelector('.carousel-btn-prev');
      const nextBtn = carousel.querySelector('.carousel-btn-next');
      const dotsContainer = carousel.querySelector('.carousel-dots');

      if (slides.length === 0) return;

      let currentIndex = 0;

      // Create dots
      slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = `carousel-dot${index === 0 ? ' active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
      });

      const dots = dotsContainer.querySelectorAll('.carousel-dot');

      function goToSlide(index) {
        slides[currentIndex].classList.remove('active');
        dots[currentIndex].classList.remove('active');

        currentIndex = (index + slides.length) % slides.length;

        slides[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
      }

      function nextSlide() {
        goToSlide(currentIndex + 1);
      }

      function prevSlide() {
        goToSlide(currentIndex - 1);
      }

      prevBtn?.addEventListener('click', prevSlide);
      nextBtn?.addEventListener('click', nextSlide);

      // Touch/swipe support
      let touchStartX = 0;
      let touchEndX = 0;

      carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) nextSlide();
          else prevSlide();
        }
      }, { passive: true });
    });
  }
}

// Initialize
const app = new App();

if (typeof window !== 'undefined') {
  window.app = app;
}

export default app;
