/**
 * SplitText - Vanilla JavaScript implementation for scroll-triggered text reveals
 * Uses GSAP for animations
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Split text into spans for animation
 * @param {HTMLElement} element - The element containing text to split
 * @param {string} splitType - 'chars', 'words', or 'lines'
 * @returns {HTMLElement[]} Array of created span elements
 */
function splitTextIntoSpans(element, splitType = 'chars') {
  if (!element || !element.textContent) return [];

  const text = element.textContent;
  const spans = [];
  
  element.innerHTML = ''; // Clear original content
  
  if (splitType === 'chars') {
    // Split into individual characters
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const span = document.createElement('span');
      span.style.display = 'inline-block';
      span.textContent = char === ' ' ? '\u00A0' : char; // Preserve spaces
      element.appendChild(span);
      spans.push(span);
    }
  } else if (splitType === 'words') {
    // Split into words
    const words = text.split(' ');
    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.style.display = 'inline-block';
      span.textContent = word;
      element.appendChild(span);
      spans.push(span);
      
      // Add space after word (except last word)
      if (index < words.length - 1) {
        element.appendChild(document.createTextNode(' '));
      }
    });
  } else if (splitType === 'lines') {
    // For lines, we'll split by <br> or wrap each line
    const lines = text.split('\n');
    lines.forEach((line, index) => {
      const span = document.createElement('span');
      span.style.display = 'block';
      span.textContent = line;
      element.appendChild(span);
      spans.push(span);
    });
  }
  
  return spans;
}

/**
 * Animate split text on scroll
 * @param {string|HTMLElement} selector - Element selector or element
 * @param {object} options - Animation options
 */
export function animateSplitText(selector, options = {}) {
  const {
    splitType = 'chars',
    duration = 0.8,
    stagger = 0.03,
    ease = 'power3.out',
    y = 20,
    opacity = 0,
    delay = 0,
    trigger = null,
    start = 'top 80%',
    once = true
  } = options;

  // Wait for fonts to be loaded
  document.fonts.ready.then(() => {
    const elements = typeof selector === 'string' 
      ? document.querySelectorAll(selector)
      : [selector];

    elements.forEach(element => {
      if (!element) return;

      // Store original text in case we need it
      const originalText = element.textContent;
      element.setAttribute('data-original-text', originalText);

      // Split text into spans
      const spans = splitTextIntoSpans(element, splitType);

      if (spans.length === 0) return;

      // Set initial state
      gsap.set(spans, {
        opacity: opacity,
        y: y,
      });

      // Create scroll trigger animation
      ScrollTrigger.create({
        trigger: trigger || element,
        start: start,
        once: once,
        onEnter: () => {
          gsap.to(spans, {
            opacity: 1,
            y: 0,
            duration: duration,
            stagger: stagger,
            ease: ease,
            delay: delay,
          });
        }
      });
    });
  });
}

/**
 * Initialize split text animations for common elements
 */
export function initSplitTextAnimations() {
  // Animate section headings - trigger earlier
  animateSplitText('.abouthead h1', {
    splitType: 'chars',
    duration: 0.6,
    stagger: 0.05,
    ease: 'power2.out',
    y: 30,
    start: 'top 90%' // Changed from default 80% to 90%
  });

  // Animate "Latest Drops" heading
  animateSplitText('.products-wrapper h1', {
    splitType: 'chars',
    duration: 0.5,
    stagger: 0.02,
    ease: 'power3.out',
    y: 20,
    start: 'top 90%'
  });

  // Animate content section headings
  animateSplitText('.textdiv h1', {
    splitType: 'words',
    duration: 0.7,
    stagger: 0.08,
    ease: 'power2.out',
    y: 25,
    start: 'top 90%'
  });

  // Animate shopping slide headings
  animateSplitText('.slide1 h1, .slide2 h1, .slide3 h1', {
    splitType: 'chars',
    duration: 0.6,
    stagger: 0.03,
    ease: 'power3.out',
    y: 20,
    start: 'top 90%'
  });
}

export default animateSplitText;
