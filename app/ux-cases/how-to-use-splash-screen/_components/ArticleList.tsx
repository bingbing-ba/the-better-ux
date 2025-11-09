'use client';

import { ArticleCard, ArticleCardSkeleton, type Article } from './ArticleCard';
import { cn } from '@/lib/utils';

interface ArticleListProps {
  articles: Article[];
  deferImageLoad?: boolean;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

/**
 * ArticleList renders a list of articles with loading and error states.
 * Integrates skeletons while loading and error messages on failure.
 */
export function ArticleList({
  articles,
  deferImageLoad = false,
  isLoading = false,
  error = null,
  className,
}: ArticleListProps) {
  // Error state
  if (error) {
    return (
      <div
        className={cn('rounded-lg border border-red-200 bg-red-50 p-6 text-center', className)}
        role="alert"
      >
        <p className="text-red-900">{error}</p>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)} aria-live="polite" aria-busy="true">
        <p className="sr-only">Loading articles...</p>
        {Array.from({ length: 6 }).map((_, i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Loaded state
  return (
    <div className={cn('space-y-4', className)} role="list">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} deferImageLoad={deferImageLoad} />
      ))}
    </div>
  );
}

