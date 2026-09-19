/**
 * Custom Follower Cursor
 * Optimized with gsap.quickTo for instant 60/120 FPS cursor response
 */

import { gsap } from 'gsap';

export function initCursor() {
  const cursorEl = document.querySelector('.cursor');
  if (!cursorEl) return;

  const isDesktop = () => window.innerWidth > 1024 && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // If not desktop with mouse, ensure cursor is hidden
  if (!isDesktop()) {
    gsap.set(cursorEl, { opacity: 0, display: 'none' });
    return;
  }

  const setX = gsap.quickTo(cursorEl, 'x', { duration: 0.15, ease: 'power2.out' });
  const setY = gsap.quickTo(cursorEl, 'y', { duration: 0.15, ease: 'power2.out' });

  window.addEventListener('mousemove', (e) => {
    if (!isDesktop()) {
      gsap.set(cursorEl, { opacity: 0, display: 'none' });
      return;
    }
    setX(e.clientX);
    setY(e.clientY);
    gsap.to(cursorEl, { opacity: 1, display: 'flex', duration: 0.2, overwrite: 'auto' });
  }, { passive: true });

  const interactiveElements = document.querySelectorAll('.cursoreffect');
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (!isDesktop()) return;
      const dataText = el.getAttribute('data-text');
      if (dataText && dataText !== 'null') {
        cursorEl.innerHTML = dataText;
      } else {
        cursorEl.innerHTML = '';
      }
      gsap.to(cursorEl, { scale: 7, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
    });

    el.addEventListener('mouseleave', () => {
      if (!isDesktop()) return;
      cursorEl.innerHTML = '';
      gsap.to(cursorEl, { scale: 1, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
    });
  });

  window.addEventListener('resize', () => {
    if (!isDesktop()) {
      cursorEl.innerHTML = '';
      gsap.set(cursorEl, { opacity: 0, display: 'none', scale: 1 });
    }
  }, { passive: true });
}
