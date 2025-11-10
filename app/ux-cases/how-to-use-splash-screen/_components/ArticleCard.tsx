'use client';

import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface Article {
  id: string;
  title: string;
  authorName: string;
  thumbnailUrl: string;
  excerpt: string;
}

interface ArticleCardProps {
  article: Article;
  deferImageLoad?: boolean;
  cacheBustTimestamp?: number;
  className?: string;
}

/**
 * Add cache-busting query parameter to image URL with a specific timestamp
 * This ensures the loading difference between Do and Don't is visible on every toggle
 */
function addCacheBusting(url: string, timestamp: number): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${timestamp}`;
}

/**
 * ArticleCard displays thumbnail, title, author, and excerpt.
 * Supports skeleton state while loading and error placeholder on image failure.
 * Uses cache-busting to ensure fresh network requests for educational demonstration.
 */
export function ArticleCard({ article, deferImageLoad = false, cacheBustTimestamp, className }: ArticleCardProps) {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>(
    deferImageLoad ? 'loading' : 'loading'
  );

  // Use provided timestamp or generate new one (fallback for Don't view)
  const timestamp = cacheBustTimestamp ?? Date.now();
  // Add cache-busting to image URL to force fresh network request
  const imageUrl = addCacheBusting(article.thumbnailUrl, timestamp);

  return (
    <article className={cn('flex gap-4 rounded-lg border p-4', className)}>
      {/* Thumbnail */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded bg-gray-200">
        {imageState === 'loading' && (
          <div className="h-full w-full animate-pulse bg-gray-300" aria-label="Loading thumbnail" />
        )}
        {imageState === 'error' && (
          <div
            className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400"
            aria-label="Thumbnail failed to load"
          >
            <AlertCircle className="h-8 w-8" />
          </div>
        )}
        {imageState !== 'error' && (
          <Image
            src={imageUrl}
            alt={article.title}
            fill
            sizes="96px"
            priority
            className={cn('object-cover', imageState === 'loading' && 'opacity-0')}
            onLoad={() => setImageState('loaded')}
            onError={() => setImageState('error')}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1 overflow-hidden">
        <h3 className="truncate font-semibold text-gray-900">{article.title}</h3>
        <p className="truncate text-sm text-gray-600">By {article.authorName}</p>
        <p className="line-clamp-1 text-sm text-gray-700">{article.excerpt}</p>
      </div>
    </article>
  );
}

/**
 * Skeleton placeholder for loading state
 */
export function ArticleCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex gap-4 rounded-lg border p-4', className)}>
      <div className="h-24 w-24 shrink-0 animate-pulse rounded bg-gray-200" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}

