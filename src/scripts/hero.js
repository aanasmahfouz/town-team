/**
 * Town Team Hero Section - Mouse Parallax Effects
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
    const container = document.getElementById('town-hero-canvas-container');
    if (!container) {
      console.warn('Town Team hero canvas container not found');
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
    const subtitle = document.querySelector('.town-hero-subtitle');
    const titleMain = document.querySelector('.town-hero-title-main');
    const titleOverlay = document.querySelector('.town-hero-title-overlay');
    const description = document.querySelector('.town-hero-description-wrapper');

    if (subtitle) {
      subtitle.style.transform = `translate(${x * -20}px, ${y * -20}px)`;
    }

    if (titleMain) {
      titleMain.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
    }

    if (titleOverlay) {
      titleOverlay.style.transform = `translate(${x * -40}px, ${y * -40}px)`;
    }

    if (description) {
      description.style.transform = `translate(${x * 15}px, ${y * 15}px)`;
    }
  }

  /**
   * Handle window resize (not needed without Three.js, but kept for compatibility)
   */
  function handleResize() {
    if (window.innerWidth < 1024 || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      window.removeEventListener('mousemove', handleMouseMove);
      updateTextParallax(0, 0);
    } else {
      window.addEventListener('mousemove', handleMouseMove);
    }
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    if (window.innerWidth >= 1024 && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    window.addEventListener('resize', handleResize);
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
    const heroSection = document.getElementById('town-hero-section');
    if (!heroSection) {
      console.warn('Town Team Hero Section not found - skipping initialization');
      return;
    }

    // Initialize particle system
    initParticleSystem();

    // Store cleanup function globally for potential manual cleanup
    window.townHeroCleanup = cleanup;
  }

  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already loaded
    init();
  }

})();
