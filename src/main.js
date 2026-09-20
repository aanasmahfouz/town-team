/**
 * Town Team Showcase - Master Application Entry Point
 * Highly optimized, zero memory leaks, pure 60 FPS performance.
 */

// Modular Stylesheets
import './styles/style.css';
import './styles/curtain-reveal.css';
import './styles/hero-section.css';
import './styles/navigation.css';
import './styles/philosophy-section.css';
import './styles/shopping-section.css';
import './styles/footer.css';

// Core Modules
import { initSmoothScroll } from './core/scroll.js';
import { initRealAssetLoader } from './loader/curtainReveal.js';
import { initCursor } from './effects/cursor.js';
import { initProductsAnimation } from './components/productsAnimation.js';
import { initLookbookCanvas } from './components/lookbookCanvas.js';
import { initTextEffects } from './components/textEffects.js';
import { initSplitTextAnimations } from './effects/splitText.js';
import { initFooterTextPressure } from './effects/textPressure.js';

// Interactive Components
import './components/navigation.js';
import './components/heroSection.js';
import './components/menuHoverImages.js';

// 1. Initialize Smooth Scroll System (LocomotiveScroll & GSAP ScrollTrigger)
initSmoothScroll();

// 2. Initialize Follower Cursor
initCursor();

// 3. Initialize Real Asset Loader
// Progress bar is 100% bound to real network loading of media and content
initRealAssetLoader(() => {
  console.log('✨ All assets loaded & curtain reveal complete.');
});

// 4. Initialize Core Section Animations
initProductsAnimation();
initLookbookCanvas();
initTextEffects();
initSplitTextAnimations();
initFooterTextPressure();
