import type { Article } from './ArticleCard';

/**
 * Preload thumbnail images for immediate display
 */
export async function preloadThumbnails(articles: Article[]): Promise<void> {
  const promises = articles.map((article) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve(); // Resolve even on error to avoid blocking
      img.src = article.thumbnailUrl;
    });
  });

  await Promise.all(promises);
}

