import type { Article } from './ArticleCard';

/**
 * Add cache-busting query parameter to image URL with a specific timestamp
 * This ensures the loading difference between Do and Don't is visible on every toggle
 */
export function addCacheBusting(url: string, timestamp: number): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${timestamp}`;
}

/**
 * Preload thumbnail images for immediate display
 * Uses cache-busting with a shared timestamp to ensure preloaded images match rendered images
 */
export async function preloadThumbnails(articles: Article[], timestamp: number): Promise<void> {
  const promises = articles.map((article) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve(); // Resolve even on error to avoid blocking
      // Use the same timestamp for preload and render
      img.src = addCacheBusting(article.thumbnailUrl, timestamp);
    });
  });

  await Promise.all(promises);
}

