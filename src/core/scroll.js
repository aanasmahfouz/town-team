/**
 * Smooth Scroll Core - LocomotiveScroll v5 & GSAP ScrollTrigger
 */

import LocomotiveScroll from 'locomotive-scroll';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let locomotiveScroll = null;

export function initSmoothScroll() {
  locomotiveScroll = new LocomotiveScroll({
    lenisOptions: {
      lerp: 0.05,
      smoothWheel: true
    }
  });

  function setupLenisScrollTrigger() {
    const lenis = locomotiveScroll.lenisInstance;
    if (!lenis) {
      requestAnimationFrame(setupLenisScrollTrigger);
      return;
    }

    lenis.on('scroll', ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    ScrollTrigger.addEventListener('refresh', () => lenis.resize());
    ScrollTrigger.refresh();
  }

  setupLenisScrollTrigger();
  return locomotiveScroll;
}

export function getScrollInstance() {
  return locomotiveScroll;
}
