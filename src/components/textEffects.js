/**
 * Text Effects & Dynamic Content
 * Handles paragraph text reveals, link slide hover effects, and interactive UI toggles
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initTextEffects() {
  // 1. Paragraph Reveal Effect
  const paraEl = document.querySelector('.para-effect');
  if (paraEl) {
    let clutter = '';
    paraEl.textContent.split('').forEach((char) => {
      if (char === ' ') {
        clutter += `<span> </span>`;
      } else {
        clutter += `<span>${char}</span>`;
      }
    });
    paraEl.innerHTML = clutter;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.para-effect',
        scroller: document.documentElement,
        scrub: 1,
        start: 'top 70%',
        end: 'top 20%',
      }
    });

    gsap.set('.para-effect span', { opacity: 0.01 });
    tl.to('.para-effect span', {
      opacity: 1,
      stagger: 0.03,
      ease: 'power4.out',
    });
  }

  // 2. Link Slide Hover Effect (Desktop screens > 1024px with hover support only)
  const isDesktop = () => window.innerWidth > 1024 && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  document.querySelectorAll('.text-effect').forEach((wrapper) => {
    [...wrapper.children].forEach((child) => {
      let clutter = '';
      child.textContent.split('').forEach((char) => {
        const c = char === ' ' ? '\u00A0' : char;
        clutter += `<span>${c}</span>`;
      });
      child.innerHTML = clutter;
    });

    wrapper.addEventListener('mouseenter', () => {
      if (!isDesktop()) return;
      if (wrapper.children[0]) {
        gsap.to(wrapper.children[0].querySelectorAll('span'), {
          y: '-106%',
          stagger: { amount: 0.2 },
          duration: 0.4,
          overwrite: 'auto'
        });
      }
      if (wrapper.children[1]) {
        gsap.to(wrapper.children[1].querySelectorAll('span'), {
          y: '-100%',
          stagger: { amount: 0.2 },
          duration: 0.4,
          overwrite: 'auto'
        });
      }
    });

    wrapper.addEventListener('mouseleave', () => {
      if (!isDesktop()) return;
      if (wrapper.children[0]) {
        gsap.to(wrapper.children[0].querySelectorAll('span'), {
          y: '0%',
          stagger: { amount: 0.2 },
          duration: 0.3,
          overwrite: 'auto'
        });
      }
      if (wrapper.children[1]) {
        gsap.to(wrapper.children[1].querySelectorAll('span'), {
          y: '0%',
          stagger: { amount: 0.2 },
          duration: 0.3,
          overwrite: 'auto'
        });
      }
    });
  });

  // 3. Original Side Navigation Toggle (if present)
  const rightBtn = document.querySelector('.right');
  const crossBtn = document.querySelector('.cross');
  const sideNav = document.querySelector('.sidenav');

  if (rightBtn && sideNav) {
    rightBtn.addEventListener('click', () => {
      gsap.to(sideNav, { right: 0, duration: 0.8, ease: 'power4.out' });
      gsap.from('.sidenav .foottext-wrap', {
        x: 100,
        opacity: 0,
        duration: 0.8,
        ease: 'power4.out',
        stagger: 0.2,
      });
      gsap.to('#collection-title, .right', { opacity: 0, duration: 0.3 });
    });
  }

  if (crossBtn && sideNav) {
    crossBtn.addEventListener('click', () => {
      gsap.to(sideNav, { right: '-40%', duration: 0.8, ease: 'power4.out' });
      gsap.to('#collection-title, .right', { opacity: 1, duration: 0.3 });
    });
  }

  // 4. Update Copyright Year dynamically
  const currentYear = new Date().getFullYear();
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = currentYear;
  const menuYearEl = document.querySelector('.menu-year');
  if (menuYearEl) menuYearEl.textContent = currentYear;
}
