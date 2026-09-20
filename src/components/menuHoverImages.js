/**
 * Menu Hover Images - Switch background images on menu item hover
 */

(function() {
  'use strict';

  function initMenuHoverImages() {
    const menuItems = document.querySelectorAll('.town-menu-item, .aura-menu-item');
    const bgImages = {
      home: document.querySelector('.town-menu-bg-image.home-bg, .aura-menu-bg-image.home-bg'),
      about: document.querySelector('.town-menu-bg-image.about-bg, .aura-menu-bg-image.about-bg'),
      collections: document.querySelector('.town-menu-bg-image.collections-bg, .aura-menu-bg-image.collections-bg'),
      shopping: document.querySelector('.town-menu-bg-image.shopping-bg, .aura-menu-bg-image.shopping-bg')
    };

    if (menuItems.length === 0) return;

    menuItems.forEach(item => {
      const activate = function() {
        const menuType = item.getAttribute('data-menu');
        
        // Remove active class from all images
        Object.values(bgImages).forEach(img => {
          if (img) img.classList.remove('active');
        });

        // Add active class to corresponding image
        if (bgImages[menuType]) {
          bgImages[menuType].classList.add('active');
        }
      };

      item.addEventListener('mouseenter', activate);
      item.addEventListener('touchstart', activate, { passive: true });
    });

    // Reset to home image when leaving menu items
    const menuOverlay = document.getElementById('town-menu-overlay') || document.getElementById('aura-menu-overlay');
    if (menuOverlay) {
      menuOverlay.addEventListener('mouseleave', function() {
        Object.values(bgImages).forEach(img => {
          if (img) img.classList.remove('active');
        });
        if (bgImages.home) {
          bgImages.home.classList.add('active');
        }
      });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMenuHoverImages);
  } else {
    initMenuHoverImages();
  }

})();
