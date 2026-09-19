/**
 * Aura Hero Section - Mouse Parallax Effects
 * Converted from React/Next.js to vanilla JavaScript
 */

(function() {
  'use strict';

  // Mouse position state
  let mousePos = { x: 0, y: 0 };
  let targetX = 0;
  let targetY = 0;

  /**
   * Initialize the hero section with mouse parallax (no particles)
   */
  function initParticleSystem() {
    const container = document.getElementById('aura-hero-canvas-container');
    if (!container) {
      console.warn('Aura hero canvas container not found');
      return;
    }

    // Hide the canvas - we don't want particles
    container.style.display = 'none';

    // Setup event listeners for mouse parallax only
    setupEventListeners();
  }

  /**
   * Handle mouse movement for parallax effect
   */
  function handleMouseMove(event) {
    const x = (event.clientX / window.innerWidth - 0.5);
    const y = (event.clientY / window.innerHeight - 0.5);
    
    targetX = x;
    targetY = y;
    mousePos = { x, y };

    // Update text layer parallax
    updateTextParallax(x, y);
  }

  /**
   * Update text layer parallax effects
   */
  function updateTextParallax(x, y) {
    if (window.innerWidth <= 1024) return;
    const subtitle = document.querySelector('.aura-hero-subtitle');
    const titleMain = document.querySelector('.aura-hero-title-main');
    const titleOverlay = document.querySelector('.aura-hero-title-overlay');
    const description = document.querySelector('.aura-hero-description-wrapper');

    if (subtitle) {
      subtitle.style.transform = `translate(${x * -15}px, ${y * -15}px)`;
    }

    if (titleMain) {
      titleMain.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
    }

    if (titleOverlay) {
      titleOverlay.style.transform = `translate(${x * -25}px, ${y * -25}px)`;
    }

    if (description) {
      description.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
    }
  }

  /**
   * Handle window resize
   */
  function handleResize() {
    if (window.innerWidth <= 1024) {
      const elements = document.querySelectorAll('.aura-hero-subtitle, .aura-hero-title-main, .aura-hero-title-overlay, .aura-hero-description-wrapper');
      elements.forEach(el => { if (el) el.style.transform = ''; });
    }
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    // Only attach mousemove on desktop screens > 1024px with hover support
    window.addEventListener('mousemove', (e) => {
      if (window.innerWidth > 1024 && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        handleMouseMove(e);
      }
    }, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
  }

  /**
   * Cleanup function
   */
  function cleanup() {
    // Remove event listeners
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('resize', handleResize);
  }

  /**
   * Initialize when DOM is ready
   */
  function init() {
    // Check if we should initialize (hero section exists)
    const heroSection = document.getElementById('aura-hero-section');
    if (!heroSection) {
      console.warn('Aura hero section not found - skipping initialization');
      return;
    }

    // Initialize particle system
    initParticleSystem();

    // Store cleanup function globally for potential manual cleanup
    window.auraHeroCleanup = cleanup;
  }

  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already loaded
    init();
  }

})();
