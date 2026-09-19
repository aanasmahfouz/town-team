/**
 * Menu Hover Images - Switch background images on menu item hover
 */

(function() {
  'use strict';

  function initMenuHoverImages() {
    const menuItems = document.querySelectorAll('.aura-menu-item');
    const bgImages = {
      home: document.querySelector('.aura-menu-bg-image.home-bg'),
      about: document.querySelector('.aura-menu-bg-image.about-bg'),
      collections: document.querySelector('.aura-menu-bg-image.collections-bg'),
      shopping: document.querySelector('.aura-menu-bg-image.shopping-bg')
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
    const menuOverlay = document.getElementById('aura-menu-overlay');
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
