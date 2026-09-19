/**
 * Cache Manager - High-Performance Cache Storage Helper
 * Provides instant repeat-load speed using CacheStorage API
 */

const CACHE_NAME = 'town-team-v1';

export async function getCachedAsset(url) {
  if (!('caches' in window)) return null;
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(url);
    if (response) {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
  } catch (e) {
    // Graceful fallback on private mode / disabled cache
  }
  return null;
}

export async function putCachedAsset(url, response) {
  if (!('caches' in window)) return;
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(url, response);
  } catch (e) {
    // Ignore cache quota or permission errors
  }
}

export async function prefetchToCache(urls, onProgress) {
  if (!('caches' in window)) return;
  try {
    const cache = await caches.open(CACHE_NAME);
    let completed = 0;
    const batchSize = 6;
    
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      await Promise.all(batch.map(async (url) => {
        try {
          const match = await cache.match(url);
          if (!match) {
            const resp = await fetch(url, { mode: 'cors', credentials: 'omit' });
            if (resp.ok) {
              await cache.put(url, resp);
            }
          }
        } catch (err) {
          // Ignore individual frame fetch errors
        } finally {
          completed++;
          if (onProgress) onProgress(completed, urls.length);
        }
      }));
    }
  } catch (e) {
    // Graceful fallback
  }
}
