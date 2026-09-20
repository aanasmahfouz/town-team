/**
 * CURTAIN REVEAL TRANSITION (Real Asset-Tied)
 * Synchronized with true media loading across the site
 */

import { gsap } from 'gsap';
import { trackPageAssets } from './assetTracker.js';

const EASE_CURTAIN_LIFT = 'power3.inOut';
const EASE_HERO_ARRIVE = 'power2.out';

const TIMING = {
  curtain1Wipe: 0.6,
  curtain2Wipe: 0.65,
  curtain2Delay: 0.2,
  heroReveal: 0.75,
  heroRevealDelay: 0.35,
  navFade: 0.4,
  navDelay: 0.4
};

export function initRealAssetLoader(onLoaderFinished) {
  const progress = document.querySelector('.progress');
  const loaderBlack = document.querySelector('.loader');
  const loaderGray = document.querySelector('.loader-curtain-gray');
  const heroSection = document.querySelector('#town-hero-section');
  const navigation = document.querySelector('#town-navigation');

  if (!progress || !loaderBlack || !loaderGray) {
    if (onLoaderFinished) onLoaderFinished();
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let currentTargetPercent = 0;

  function handleProgress(percent) {
    if (percent > currentTargetPercent) {
      currentTargetPercent = percent;
      gsap.to(progress, {
        width: `${currentTargetPercent}%`,
        duration: 0.3,
        ease: 'power1.out',
        overwrite: 'auto'
      });
    }
  }

  function handleComplete() {
    // Ensure bar reaches 100% first
    gsap.to(progress, {
      width: '100%',
      duration: 0.2,
      ease: 'power1.out',
      onComplete: () => {
        if (prefersReducedMotion) {
          loaderBlack.style.opacity = '0';
          loaderGray.style.opacity = '0';
          if (heroSection) heroSection.classList.add('visible');
          if (navigation) navigation.classList.add('visible');
          setTimeout(() => {
            loaderBlack.remove();
            loaderGray.remove();
            if (onLoaderFinished) onLoaderFinished();
          }, 300);
          return;
        }

        executeCurtainWipe();
      }
    });
  }

  function executeCurtainWipe() {
    const tl = gsap.timeline({
      onComplete: () => {
        loaderBlack.remove();
        loaderGray.remove();
        if (onLoaderFinished) onLoaderFinished();
      }
    });

    // Phase 1: Black curtain wipes up
    tl.call(() => {
      loaderBlack.setAttribute('data-transitioning', 'true');
    });

    tl.to(loaderBlack, {
      yPercent: -100,
      ease: EASE_CURTAIN_LIFT,
      duration: TIMING.curtain1Wipe,
      force3D: true
    });

    // Phase 2: Gray curtain wipes up with overlap
    tl.call(() => {
      loaderGray.setAttribute('data-transitioning', 'true');
    }, null, `-=${TIMING.curtain2Delay}`);

    tl.to(loaderGray, {
      yPercent: -100,
      ease: EASE_CURTAIN_LIFT,
      duration: TIMING.curtain2Wipe,
      force3D: true
    }, `-=${TIMING.curtain2Delay}`);

    // Phase 3: Hero section reveals
    if (heroSection) {
      tl.call(() => {
        heroSection.classList.add('visible');
      }, null, `-=${TIMING.heroRevealDelay}`);

      tl.to(heroSection, {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        ease: EASE_HERO_ARRIVE,
        duration: TIMING.heroReveal,
        force3D: true,
        onComplete: () => {
          heroSection.style.pointerEvents = 'all';
          heroSection.style.willChange = 'auto';
        }
      }, `-=${TIMING.heroRevealDelay}`);
    }

    // Phase 4: Navigation fades in
    if (navigation) {
      tl.call(() => {
        navigation.classList.add('visible');
      }, null, `-=${TIMING.navDelay}`);

      gsap.set(navigation, { y: 10, opacity: 0 });

      tl.to(navigation, {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
        duration: TIMING.navFade,
        onComplete: () => {
          navigation.style.pointerEvents = 'all';
          navigation.style.willChange = 'auto';
        }
      }, `-=${TIMING.navDelay}`);
    }
  }

  // Start real asset tracking
  trackPageAssets({
    onProgress: handleProgress,
    onComplete: handleComplete,
    timeout: 8000
  });
}

export default initRealAssetLoader;
