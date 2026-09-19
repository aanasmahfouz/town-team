/**
 * Products Section & Video Showreel Scroll Animations
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initProductsAnimation() {
  // 1. Showreel Video Zoom
  gsap.from('.videodiv', {
    scale: 0.7,
    scrollTrigger: {
      trigger: '.videodiv',
      scroller: document.documentElement,
      start: 'top 80%',
      end: 'bottom bottom',
      scrub: 2,
    }
  });

  // 2. Helper to split text into characters
  const clutterText = (elementSelector) => {
    const el = document.querySelector(elementSelector);
    if (!el) return;
    let clutter = '';
    el.textContent.split('').forEach((char) => {
      if (char === ' ') {
        clutter += `<span> </span>`;
      } else {
        clutter += `<span class="inline-block">${char}</span>`;
      }
    });
    el.innerHTML = clutter;
  };

  clutterText('.products-wrapper>h1');

  gsap.from('.products-wrapper>h1>span', {
    opacity: 0,
    x: 200,
    stagger: {
      each: 0.1,
      from: 'start',
    },
    scrollTrigger: {
      scroller: document.documentElement,
      trigger: '.products-wrapper',
      start: 'top 20%',
      end: 'top 0%',
      scrub: 1,
    },
  });

  // 3. Products Pin Timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      scroller: document.documentElement,
      trigger: '.products',
      start: 'top 0',
      end: 'top -650%',
      scrub: 1,
      pin: true,
    },
  });

  tl.to('#right1', { top: '-120%', rotate: '-20deg', left: '-25%' }, 'a');
  tl.to('#left1', { top: '-120%', rotate: '20deg', left: '40%', delay: 0.2 }, 'a');
  tl.to('#right2', { top: '-120%', rotate: '-20deg', left: '-25%', delay: 0.4 }, 'a');
  tl.to('#left2', { top: '-120%', rotate: '20deg', left: '40%', delay: 0.6 }, 'a');
  tl.to('#right3', { top: '-120%', rotate: '-20deg', left: '-25%', delay: 0.8 }, 'a');
  tl.to('#left3', { top: '-120%', rotate: '20deg', left: '40%', delay: 1 }, 'a');

  tl.to('.products-wrapper>h1>span', {
    opacity: 0,
    x: -200,
    stagger: {
      each: 0.1,
      from: 'start',
    },
    scrollTrigger: {
      scroller: document.documentElement,
      trigger: '.products-wrapper',
      start: 'top -670%',
      end: 'top 0%',
      scrub: 1,
    },
  });

  // 4. Product Image Hover Overlays (Exclusively on desktop screens > 1024px with hover support)
  const isDesktop = () => window.innerWidth > 1024 && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  for (let i = 1; i <= 6; i++) {
    clutterText(`.product${i}`);
  }

  const allImgs = document.querySelectorAll('.product-imgs');
  allImgs.forEach((img, index) => {
    const num = index + 1;
    img.addEventListener('mouseenter', () => {
      if (!isDesktop()) return;
      gsap.to(`#overlay${num}`, { opacity: 1, duration: 0.3 });
      gsap.to(`.product${num}>span`, {
        opacity: 1,
        scale: 1,
        stagger: { amount: 0.3, from: 'start' },
      });
    });

    img.addEventListener('mouseleave', () => {
      if (!isDesktop()) return;
      gsap.to(`#overlay${num}`, { opacity: 0, delay: 0.3, duration: 0.3 });
      gsap.to(`.product${num}>span`, {
        opacity: 0,
        scale: 0,
        stagger: { amount: 0.3, from: 'start' },
      });
    });
  });

  window.addEventListener('resize', () => {
    if (!isDesktop()) {
      for (let i = 1; i <= 6; i++) {
        gsap.set(`#overlay${i}`, { opacity: 0 });
        gsap.set(`.product${i}>span`, { opacity: 0, scale: 0 });
      }
    }
  }, { passive: true });
}
