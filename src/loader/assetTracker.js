/**
 * Asset Tracker - Real-time asset loading monitor
 * Directly links the loader progress bar to actual network & media loading.
 */

export function trackPageAssets({ onProgress, onComplete, timeout = 10000 }) {
  const assetsToLoad = [];
  let loadedCount = 0;
  let hasCompleted = false;

  function notifyProgress() {
    const total = Math.max(1, assetsToLoad.length);
    const progress = Math.min(100, Math.round((loadedCount / total) * 100));
    if (onProgress) onProgress(progress, loadedCount, total);

    if (loadedCount >= total && !hasCompleted) {
      hasCompleted = true;
      if (onComplete) onComplete();
    }
  }

  function onItemDone() {
    loadedCount++;
    notifyProgress();
  }

  // 1. Fonts readiness
  if (document.fonts && document.fonts.ready) {
    assetsToLoad.push('fonts');
    document.fonts.ready.then(onItemDone).catch(onItemDone);
  }

  // 2. DOM Images
  const domImages = Array.from(document.querySelectorAll('img'));
  domImages.forEach((img) => {
    if (!img.src) return;
    assetsToLoad.push(img.src);
    if (img.complete && img.naturalWidth > 0) {
      setTimeout(onItemDone, 10);
    } else {
      img.addEventListener('load', onItemDone, { once: true });
      img.addEventListener('error', onItemDone, { once: true });
    }
  });

  // 3. Menu & CSS background images
  const bgElements = Array.from(document.querySelectorAll('.aura-menu-bg-image'));
  bgElements.forEach((el) => {
    const bg = window.getComputedStyle(el).backgroundImage;
    const match = bg.match(/url\(["']?([^"']*)["']?\)/);
    if (match && match[1]) {
      const url = match[1];
      assetsToLoad.push(url);
      const tempImg = new Image();
      tempImg.onload = onItemDone;
      tempImg.onerror = onItemDone;
      tempImg.src = url;
    }
  });

  // 4. Critical video: town-team-showreel
  const heroVideo = document.querySelector('.videodiv video');
  if (heroVideo) {
    assetsToLoad.push(heroVideo.currentSrc || heroVideo.src);
    if (heroVideo.readyState >= 2) {
      setTimeout(onItemDone, 10);
    } else {
      heroVideo.addEventListener('loadeddata', onItemDone, { once: true });
      heroVideo.addEventListener('canplay', onItemDone, { once: true });
      heroVideo.addEventListener('error', onItemDone, { once: true });
    }
  }

  // 5. Initial Lookbook critical frames (First 35 frames)
  const CRITICAL_FRAMES = 35;
  for (let i = 1; i <= CRITICAL_FRAMES; i++) {
    const frameUrl = `/lookbook-frames/${i}.webp`;
    assetsToLoad.push(frameUrl);
    const frameImg = new Image();
    frameImg.onload = onItemDone;
    frameImg.onerror = onItemDone;
    frameImg.src = frameUrl;
  }

  // Initial notification
  notifyProgress();

  // Watchdog timeout fallback to ensure page always reveals even under extreme packet loss
  const watchdogTimer = setTimeout(() => {
    if (!hasCompleted) {
      console.warn('⚠️ AssetTracker watchdog timeout reached. Forcing reveal.');
      loadedCount = assetsToLoad.length;
      notifyProgress();
    }
  }, timeout);

  return () => clearTimeout(watchdogTimer);
}
