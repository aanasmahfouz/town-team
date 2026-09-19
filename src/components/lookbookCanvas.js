/**
 * Lookbook Canvas Component - 60 FPS Smooth Frame Scrubbing
 * Eliminates GPU memory stalls by resizing canvas only on window resize.
 * Uses controlled concurrency for frame prefetching.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getCachedAsset, putCachedAsset } from '../utils/cacheManager.js';

gsap.registerPlugin(ScrollTrigger);

export function initLookbookCanvas() {
  const canvas = document.querySelector('#frame');
  const frameWrap = document.querySelector('.frame-scroll-wrap');
  const featuresSection = document.querySelector('.features');

  if (!canvas || !frameWrap || !featuresSection) return;

  const context = canvas.getContext('2d', { alpha: false });
  const INTRO_SCALE = 0.72;
  const INTRO_RADIUS = 56;
  const FRAME_COUNT = 421;

  const frameState = {
    currentindex: 0,
    maxindex: FRAME_COUNT
  };

  const images = new Array(FRAME_COUNT).fill(null);
  let isCanvasReady = false;
  let canvasWidth = 0;
  let canvasHeight = 0;

  // 1. Efficient Canvas Dimension Management
  function updateCanvasSize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;

    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    context.scale(dpr, dpr);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'medium';

    drawFrame(Math.floor(frameState.currentindex));
  }

  // 2. Draw Frame - Fast and Zero Allocations
  function drawFrame(index) {
    const frameIndex = Math.max(0, Math.min(FRAME_COUNT - 1, Math.floor(index)));
    
    // Find exact or nearest loaded frame
    let img = images[frameIndex];
    if (!img || !img.complete || !img.naturalWidth) {
      // Find closest loaded frame to avoid black screen / flickering
      for (let offset = 1; offset < 20; offset++) {
        const left = images[frameIndex - offset];
        if (left?.complete && left.naturalWidth) { img = left; break; }
        const right = images[frameIndex + offset];
        if (right?.complete && right.naturalWidth) { img = right; break; }
      }
    }

    if (!img || !img.complete || !img.naturalWidth) return;

    const scaleX = canvasWidth / img.width;
    const scaleY = canvasHeight / img.height;
    const scale = Math.max(scaleX, scaleY);

    const newWidth = img.width * scale;
    const newHeight = img.height * scale;
    const offsetX = (canvasWidth - newWidth) / 2;
    const offsetY = (canvasHeight - newHeight) / 2;

    context.drawImage(img, offsetX, offsetY, newWidth, newHeight);
    frameState.currentindex = frameIndex;
  }

  // 3. Controlled Concurrency Frame Loader
  async function loadFrame(i) {
    if (images[i - 1]) return images[i - 1];

    const url = `/lookbook-frames/${i}.webp`;
    const img = new Image();
    img.crossOrigin = 'anonymous';

    // Try cache first
    const cachedUrl = await getCachedAsset(url);
    if (cachedUrl) {
      img.src = cachedUrl;
    } else {
      img.src = url;
    }

    images[i - 1] = img;

    return new Promise((resolve) => {
      img.onload = () => {
        if (i === 1 && !isCanvasReady) {
          isCanvasReady = true;
          drawFrame(0);
          frameWrap.style.opacity = '1';
        }
        resolve(img);
      };
      img.onerror = () => {
        resolve(null);
      };
    });
  }

  // Prefetch frames in priority order: first critical 40, then remaining in concurrent batches
  async function prefetchFrames() {
    // 1. Critical tier (1..40)
    for (let i = 1; i <= 40; i++) {
      await loadFrame(i);
    }

    // 2. Background queue for remaining frames (concurrency 6)
    const queue = [];
    for (let i = 41; i <= FRAME_COUNT; i++) {
      queue.push(i);
    }

    const CONCURRENCY = 6;
    async function worker() {
      while (queue.length > 0) {
        const nextFrame = queue.shift();
        if (nextFrame) {
          await loadFrame(nextFrame);
        }
      }
    }

    const workers = Array.from({ length: CONCURRENCY }, () => worker());
    Promise.all(workers);
  }

  // 4. GSAP ScrollTrigger Setup
  function setupScrollAnimation() {
    gsap.set(frameWrap, {
      scale: INTRO_SCALE,
      borderRadius: INTRO_RADIUS,
    });

    const progressIndicator = document.getElementById('videoProgressIndicator');
    const progressBarFill = document.getElementById('progressBarFill');
    const progressText = document.getElementById('progressText');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.features',
        scroller: document.documentElement,
        start: 'top top',
        end: '700% top',
        scrub: 1.5,
        pin: true,
        onEnter: () => progressIndicator?.classList.add('active'),
        onLeave: () => progressIndicator?.classList.remove('active'),
        onEnterBack: () => progressIndicator?.classList.add('active'),
        onLeaveBack: () => progressIndicator?.classList.remove('active'),
        onUpdate: (self) => {
          if (progressBarFill) {
            progressBarFill.style.width = `${self.progress * 100}%`;
          }
          if (progressText) {
            const progress = Math.round(self.progress * 100);
            if (progress < 25) progressText.textContent = 'Exploring Collection';
            else if (progress < 50) progressText.textContent = 'Discovering Details';
            else if (progress < 75) progressText.textContent = 'Viewing Craftsmanship';
            else if (progress < 100) progressText.textContent = 'Almost There';
            else progressText.textContent = 'Experience Complete';
          }
        }
      }
    });

    tl.to(frameState, {
      currentindex: FRAME_COUNT - 1,
      ease: 'none',
      duration: 9,
      onUpdate: () => drawFrame(Math.floor(frameState.currentindex))
    }, 0);

    tl.fromTo(frameWrap, {
      scale: INTRO_SCALE,
      borderRadius: INTRO_RADIUS,
    }, {
      keyframes: [
        { scale: 1.03, borderRadius: 12, duration: 1, ease: 'power2.out' },
        { scale: 1, borderRadius: 0, duration: 0.35, ease: 'power1.inOut' },
      ],
    }, 0);
  }

  // Initialize
  updateCanvasSize();
  window.addEventListener('resize', updateCanvasSize, { passive: true });
  prefetchFrames();
  setupScrollAnimation();
}

export default initLookbookCanvas;
