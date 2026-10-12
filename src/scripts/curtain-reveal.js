/**
 * CURTAIN REVEAL TRANSITION
 * Premium loading-to-hero transition with layered bottom-to-top wipe effect
 * 
 * Animation Flow:
 * 1. Loading progress bar fills (8 seconds)
 * 2. Black loading mask wipes away bottom-to-top (reveals gray layer)
 * 3. Gray curtain layer wipes away bottom-to-top (reveals hero section)
 * 4. Hero section scales up slightly and comes into focus
 * 5. Navigation fades in
 */

import { gsap } from 'gsap';

// Custom easing curves for premium feel
const EASE_CURTAIN_LIFT = 'power3.inOut';  // Weighty, deliberate curtain lift
const EASE_HERO_ARRIVE = 'power2.out';      // Hero scaling/focus reveal

// Slightly faster timing - balanced between speed and smoothness
const TIMING = {
  loadingProgress: 2.5,        // Progress bar duration
  curtain1Wipe: 0.6,           // Black loader wipe
  curtain2Wipe: 0.65,          // Gray curtain wipe
  curtain2Delay: 0.2,          // Gray starts 0.2s before loader finishes
  heroReveal: 0.75,            // Hero scale/blur/fade
  heroRevealDelay: 0.35,       // Hero starts revealing before gray finishes
  navFade: 0.4,                // Navigation fade
  navDelay: 0.4                // Navigation delay after hero starts
};

// Scroll locking during loading screen
function preventLoadingScroll(e) {
  e.preventDefault();
}

function preventLoadingKeys(e) {
  if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', 'Space'].includes(e.code)) {
    e.preventDefault();
  }
}

let isLoadingLocked = false;

function lockScrollDuringLoad() {
  if (isLoadingLocked) return;
  isLoadingLocked = true;
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  const stopSmoothScroll = () => {
    if (window.__locomotiveScroll) {
      if (typeof window.__locomotiveScroll.stop === 'function') {
        window.__locomotiveScroll.stop();
      }
      if (window.__locomotiveScroll.lenisInstance && typeof window.__locomotiveScroll.lenisInstance.stop === 'function') {
        window.__locomotiveScroll.lenisInstance.stop();
        window.__locomotiveScroll.lenisInstance.scrollTo(0, { immediate: true });
      }
    }
  };
  stopSmoothScroll();
  requestAnimationFrame(stopSmoothScroll);

  window.addEventListener('wheel', preventLoadingScroll, { passive: false });
  window.addEventListener('touchmove', preventLoadingScroll, { passive: false });
  window.addEventListener('keydown', preventLoadingKeys, { passive: false });
  document.documentElement.classList.add('loading-lock');
  document.body.classList.add('loading-lock');
}

function unlockScrollAfterLoad() {
  if (!isLoadingLocked) return;
  isLoadingLocked = false;
  window.removeEventListener('wheel', preventLoadingScroll);
  window.removeEventListener('touchmove', preventLoadingScroll);
  window.removeEventListener('keydown', preventLoadingKeys);
  document.documentElement.classList.remove('loading-lock');
  document.body.classList.remove('loading-lock');

  if (window.__locomotiveScroll) {
    if (typeof window.__locomotiveScroll.start === 'function') {
      window.__locomotiveScroll.start();
    }
    if (window.__locomotiveScroll.lenisInstance && typeof window.__locomotiveScroll.lenisInstance.start === 'function') {
      window.__locomotiveScroll.lenisInstance.start();
    }
  }

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'auto';
  }
  console.log('🔓 Scroll unlocked after loading completed');
}

/**
 * Initialize the curtain reveal transition
 */
export function initCurtainReveal() {
  lockScrollDuringLoad();

  const progress = document.querySelector('.progress');
  const loaderBlack = document.querySelector('.loader');
  const loaderGray = document.querySelector('.loader-curtain-gray');
  const heroSection = document.querySelector('#town-hero-section');
  const navigation = document.querySelector('#town-navigation');

  // Safety checks
  if (!progress || !loaderBlack || !loaderGray) {
    console.warn('⚠️ Curtain reveal elements not found');
    unlockScrollAfterLoad();
    return;
  }

  console.log('🎭 Initializing curtain reveal transition...');

  // Create master timeline
  const masterTimeline = gsap.timeline({
    onStart: () => {
      console.log('🎬 Curtain reveal started');
    },
    onComplete: () => {
      // Cleanup: Remove loader elements from DOM
      loaderBlack.remove();
      loaderGray.remove();
      unlockScrollAfterLoad();
      console.log('✅ Curtain reveal completed');
    }
  });

  // PHASE 1: Loading progress bar
  masterTimeline.to(progress, {
    width: '100%',
    ease: 'power1.inOut',
    duration: TIMING.loadingProgress
  });

  // PHASE 2: First curtain (black loader) wipes up
  // Add shadow effect as it lifts
  masterTimeline.call(() => {
    loaderBlack.setAttribute('data-transitioning', 'true');
    if (loaderBlack.querySelector) {
      const shadow = loaderBlack;
      gsap.to(shadow, {
        '--shadow-opacity': 1,
        duration: 0.3
      });
    }
  });

  masterTimeline.to(loaderBlack, {
    yPercent: -100,              // Move up and out of view
    ease: EASE_CURTAIN_LIFT,
    duration: TIMING.curtain1Wipe,
    force3D: true                // GPU acceleration
  });

  // PHASE 3: Second curtain (gray layer) wipes up
  // Starts BEFORE the first curtain finishes (overlap for fluidity)
  masterTimeline.call(() => {
    loaderGray.setAttribute('data-transitioning', 'true');
  }, null, `-=${TIMING.curtain2Delay}`);

  masterTimeline.to(loaderGray, {
    yPercent: -100,
    ease: EASE_CURTAIN_LIFT,
    duration: TIMING.curtain2Wipe,
    force3D: true
  }, `-=${TIMING.curtain2Delay}`);

  // PHASE 4: Hero section reveal with scale + blur-to-focus + subtle parallax
  // Starts DURING the gray curtain wipe (not after)
  if (heroSection) {
    masterTimeline.call(() => {
      heroSection.classList.add('visible');
    }, null, `-=${TIMING.heroRevealDelay}`);

    // Main hero reveal animation with layered properties
    masterTimeline.to(heroSection, {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      ease: EASE_HERO_ARRIVE,
      duration: TIMING.heroReveal,
      force3D: true,
      onComplete: () => {
        // Ensure hero is fully interactive
        heroSection.style.pointerEvents = 'all';
        // Clean up will-change for performance
        heroSection.style.willChange = 'auto';
      }
    }, `-=${TIMING.heroRevealDelay}`);
  }

  // PHASE 5: Navigation fade in with slight upward drift
  if (navigation) {
    masterTimeline.call(() => {
      navigation.classList.add('visible');
    }, null, `-=${TIMING.navDelay}`);

    // Set initial y position
    gsap.set(navigation, { y: 10, opacity: 0 });

    masterTimeline.to(navigation, {
      opacity: 1,
      y: 0,
      ease: 'power2.out',
      duration: TIMING.navFade,
      onComplete: () => {
        // Ensure navigation is fully interactive
        navigation.style.pointerEvents = 'all';
        navigation.style.willChange = 'auto';
      }
    }, `-=${TIMING.navDelay}`);
  }

  return masterTimeline;
}

/**
 * Fallback for reduced motion preference
 */
function initReducedMotionFallback() {
  lockScrollDuringLoad();
  const loaderBlack = document.querySelector('.loader');
  const loaderGray = document.querySelector('.loader-curtain-gray');
  const heroSection = document.querySelector('#town-hero-section');
  const navigation = document.querySelector('#town-navigation');

  setTimeout(() => {
    if (loaderBlack) loaderBlack.style.opacity = '0';
    if (loaderGray) loaderGray.style.opacity = '0';
    if (heroSection) {
      heroSection.classList.add('visible');
      heroSection.style.opacity = '1';
    }
    if (navigation) {
      navigation.classList.add('visible');
      navigation.style.opacity = '1';
    }

    setTimeout(() => {
      if (loaderBlack) loaderBlack.remove();
      if (loaderGray) loaderGray.remove();
      unlockScrollAfterLoad();
    }, 300);
  }, 1000);
}

/**
 * Check for reduced motion and initialize appropriate transition
 */
export function initLoadingTransition() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    console.log('♿ Reduced motion detected - using simple fade');
    initReducedMotionFallback();
  } else {
    initCurtainReveal();
  }
}

export default initLoadingTransition;
