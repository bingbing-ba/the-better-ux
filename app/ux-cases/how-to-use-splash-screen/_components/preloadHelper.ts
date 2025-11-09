import type { Article } from './ArticleCard';

/**
 * Add cache-busting query parameter to image URL to force fresh network request
 * This ensures the loading difference between Do and Don't is visible on every toggle
 */
function addCacheBusting(url: string): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
}

/**
 * Preload thumbnail images for immediate display
 * Uses cache-busting to ensure fresh network requests for educational demonstration
 */
export async function preloadThumbnails(articles: Article[]): Promise<void> {
  const promises = articles.map((article) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve(); // Resolve even on error to avoid blocking
      // Add cache-busting to force fresh network request
      img.src = addCacheBusting(article.thumbnailUrl);
    });
  });

  await Promise.all(promises);
}

