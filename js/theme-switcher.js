/**
 * Theme Switcher
 * Handles light/dark mode toggle with localStorage persistence
 * and system preference detection
 */

export default class ThemeSwitcher {
  constructor() {
    this.theme = this.getStoredTheme() || this.getPreferredTheme();
    this.toggle = null;
    this.init();
  }

  /**
   * Initialize theme switcher
   */
  init() {
    // Apply initial theme
    this.applyTheme(this.theme);

    // Set up toggle button
    this.setupToggle();

    // Watch for system theme changes
    this.watchSystemTheme();

    // Theme ready
  }

  /**
   * Get theme from localStorage
   * @returns {string|null} Stored theme or null
   */
  getStoredTheme() {
    return localStorage.getItem('theme');
  }

  /**
   * Get system preferred theme
   * @returns {string} 'dark' or 'light'
   */
  getPreferredTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  /**
   * Apply theme to document
   * @param {string} theme - 'light' or 'dark'
   */
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.theme = theme;
    this.updateToggleUI();

    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  /**
   * Set up toggle button event listener
   */
  setupToggle() {
    this.toggle = document.getElementById('theme-toggle');

    if (!this.toggle) {
      // Toggle not found
      return;
    }

    this.toggle.addEventListener('click', () => {
      const newTheme = this.theme === 'light' ? 'dark' : 'light';
      this.applyTheme(newTheme);

      // Add a little feedback animation
      this.toggle.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.toggle.style.transform = 'scale(1)';
      }, 100);
    });

    // Keyboard accessibility
    this.toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggle.click();
      }
    });
  }

  /**
   * Update toggle button UI
   */
  updateToggleUI() {
    if (!this.toggle) return;

    const label = `Switch to ${this.theme === 'light' ? 'dark' : 'light'} mode`;
    this.toggle.setAttribute('aria-label', label);
    this.toggle.setAttribute('title', label);
  }

  /**
   * Watch for system theme changes
   */
  watchSystemTheme() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!this.getStoredTheme()) {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
    // Legacy browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener((e) => {
        if (!this.getStoredTheme()) {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  /**
   * Get current theme
   * @returns {string} Current theme ('light' or 'dark')
   */
  getCurrentTheme() {
    return this.theme;
  }

  /**
   * Set theme programmatically
   * @param {string} theme - 'light' or 'dark'
   */
  setTheme(theme) {
    if (theme === 'light' || theme === 'dark') {
      this.applyTheme(theme);
    } else {
      console.error('Invalid theme. Use "light" or "dark"');
    }
  }

  /**
   * Toggle theme
   */
  toggleTheme() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }

  /**
   * Reset to system preference
   */
  resetToSystemPreference() {
    localStorage.removeItem('theme');
    this.applyTheme(this.getPreferredTheme());
  }
}
