/**
 * Town Team Navigation - Navbar & Full-Screen Menu
 * Converted from React/Next.js to vanilla JavaScript
 */

(function() {
  'use strict';

  // State
  let isScrolled = false;
  let isMenuOpen = false;
  let lastScrollY = 0;
  let isNavVisible = true;
  let scrollThreshold = 100; // Minimum scroll distance to trigger hide/show
  let scrollDelta = 0;

  // DOM Elements (cached)
  let navElement = null;
  let menuOverlay = null;
  let menuBtn = null;
  let menuBtnIcon = null;

  /**
   * Initialize navigation functionality
   */
  function init() {
    // Cache DOM elements
    navElement = document.getElementById('town-navigation');
    menuOverlay = document.getElementById('town-menu-overlay');
    menuBtn = document.getElementById('town-menu-btn');
    menuBtnIcon = document.getElementById('town-menu-icon');

    if (!navElement || !menuOverlay || !menuBtn) {
      console.warn('Town Team Navigation elements not found - skipping initialization');
      return;
    }

    // Setup event listeners
    setupEventListeners();

    // Initial scroll check
    handleScroll();
  }

  /**
   * Setup all event listeners
   */
  function setupEventListeners() {
    // Scroll detection with throttling for performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(handleScroll, 10);
    }, { passive: true });

    // Menu button click
    menuBtn.addEventListener('click', toggleMenu);

    // Menu item clicks - close menu when clicked
    const menuItems = document.querySelectorAll('.town-menu-item');
    menuItems.forEach(item => {
      item.addEventListener('click', closeMenu);
    });

    // Close menu on Escape key
    document.addEventListener('keydown', handleKeyDown);
  }

  /**
   * Handle scroll event - add backdrop blur and show/hide navbar
   */
  function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollDirection = scrollY > lastScrollY ? 'down' : 'up';
    scrollDelta = Math.abs(scrollY - lastScrollY);

    // Update scrolled state (backdrop blur at 50px)
    const shouldBeScrolled = scrollY > 50;
    if (shouldBeScrolled !== isScrolled) {
      isScrolled = shouldBeScrolled;
      
      if (isScrolled && !isMenuOpen) {
        navElement.classList.add('scrolled');
      } else if (!isMenuOpen) {
        navElement.classList.remove('scrolled');
      }
    }

    // Show/hide navbar based on scroll direction
    // Only trigger if scroll delta is significant (prevents jitter)
    if (scrollDelta > 5 && !isMenuOpen) {
      if (scrollDirection === 'down' && scrollY > scrollThreshold) {
        // Scrolling down - hide navbar
        if (isNavVisible) {
          hideNavbar();
        }
      } else if (scrollDirection === 'up') {
        // Scrolling up - show navbar
        if (!isNavVisible) {
          showNavbar();
        }
      }
    }

    // Always show navbar at the very top
    if (scrollY < 10 && !isNavVisible) {
      showNavbar();
    }

    lastScrollY = scrollY;
  }

  /**
   * Hide the navbar (slide up)
   */
  function hideNavbar() {
    isNavVisible = false;
    navElement.classList.add('hidden');
  }

  /**
   * Show the navbar (slide down)
   */
  function showNavbar() {
    isNavVisible = true;
    navElement.classList.remove('hidden');
  }

  /**
   * Toggle menu open/close
   */
  function toggleMenu() {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function preventWheelScroll(e) {
    e.preventDefault();
  }

  function preventTouchScroll(e) {
    e.preventDefault();
  }

  function preventScrollKeys(e) {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', 'Space'].includes(e.code)) {
      e.preventDefault();
    }
  }

  function lockScroll() {
    window.addEventListener('wheel', preventWheelScroll, { passive: false });
    window.addEventListener('touchmove', preventTouchScroll, { passive: false });
    window.addEventListener('keydown', preventScrollKeys, { passive: false });
  }

  function unlockScroll() {
    window.removeEventListener('wheel', preventWheelScroll);
    window.removeEventListener('touchmove', preventTouchScroll);
    window.removeEventListener('keydown', preventScrollKeys);
  }

  /**
   * Open the full-screen menu
   */
  function openMenu() {
    isMenuOpen = true;

    // Make sure navbar is visible when opening menu
    showNavbar();

    // Update DOM classes
    navElement.classList.add('menu-open');
    navElement.classList.remove('scrolled');
    menuOverlay.classList.add('open');

    // Prevent background scroll and completely hide scrollbar while menu is open
    document.body.classList.add('town-menu-open');
    document.documentElement.classList.add('town-menu-open');
    if (window.__locomotiveScroll && window.__locomotiveScroll.lenisInstance && typeof window.__locomotiveScroll.lenisInstance.stop === 'function') {
      window.__locomotiveScroll.lenisInstance.stop();
    }
    lockScroll();

    // Update menu button icon
    updateMenuIcon();

    // Reset menu item animations
    resetMenuAnimations();
  }

  /**
   * Close the full-screen menu
   */
  function closeMenu() {
    isMenuOpen = false;

    // Update DOM classes
    navElement.classList.remove('menu-open');
    menuOverlay.classList.remove('open');

    // Re-enable body scroll
    document.body.classList.remove('town-menu-open');
    document.documentElement.classList.remove('town-menu-open');
    if (window.__locomotiveScroll && window.__locomotiveScroll.lenisInstance && typeof window.__locomotiveScroll.lenisInstance.start === 'function') {
      window.__locomotiveScroll.lenisInstance.start();
    }
    unlockScroll();

    // Restore scrolled state if needed
    handleScroll();

    // Update menu button icon
    updateMenuIcon();
  }

  /**
   * Update menu button icon (hamburger <-> X)
   */
  function updateMenuIcon() {
    if (!menuBtnIcon) return;

    if (isMenuOpen) {
      // Show X icon
      menuBtnIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `;
    } else {
      // Show hamburger menu icon
      menuBtnIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      `;
    }
  }

  /**
   * Reset menu item animations when opening
   */
  function resetMenuAnimations() {
    const menuItems = document.querySelectorAll('.town-menu-item');
    
    // Force reflow to restart animations
    menuItems.forEach(item => {
      item.style.animation = 'none';
      // Trigger reflow
      void item.offsetWidth;
      item.style.animation = '';
    });
  }

  /**
   * Handle keyboard events
   */
  function handleKeyDown(event) {
    // Close menu on Escape key
    if (event.key === 'Escape' && isMenuOpen) {
      closeMenu();
    }
  }

  /**
   * Smooth scroll to anchor links
   */
  function setupSmoothScroll() {
    // Handle all anchor links in navigation
    const anchorLinks = document.querySelectorAll('.town-nav-link[href^="#"], .town-menu-item[href^="#"]');
    
    anchorLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if href is just "#"
        if (href === '#') {
          e.preventDefault();
          return;
        }

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          e.preventDefault();
          
          // Close menu if open
          if (isMenuOpen) {
            closeMenu();
          }

          // Smooth scroll to target
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  /**
   * Cleanup function
   */
  function cleanup() {
    window.removeEventListener('scroll', handleScroll);
    document.removeEventListener('keydown', handleKeyDown);
    
    if (menuBtn) {
      menuBtn.removeEventListener('click', toggleMenu);
    }

    // Restore body scroll
    document.body.classList.remove('town-menu-open');
    unlockScroll();
  }

  /**
   * Initialize when DOM is ready
   */
  function onDOMReady() {
    init();
    setupSmoothScroll();

    // Store cleanup function globally for potential manual cleanup
    window.townNavigationCleanup = cleanup;
  }

  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onDOMReady);
  } else {
    // DOM already loaded
    onDOMReady();
  }

})();
