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
  className?: string;
}

/**
 * ArticleCard displays thumbnail, title, author, and excerpt.
 * Supports skeleton state while loading and error placeholder on image failure.
 */
export function ArticleCard({ article, deferImageLoad = false, className }: ArticleCardProps) {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>(
    deferImageLoad ? 'loading' : 'loading'
  );

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
            src={article.thumbnailUrl}
            alt={article.title}
            fill
            sizes="96px"
            className={cn('object-cover', imageState === 'loading' && 'opacity-0')}
            loading={deferImageLoad ? 'lazy' : 'eager'}
            onLoad={() => setImageState('loaded')}
            onError={() => setImageState('error')}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1">
        <h3 className="font-semibold text-gray-900">{article.title}</h3>
        <p className="text-sm text-gray-600">By {article.authorName}</p>
        <p className="text-sm text-gray-700 line-clamp-2">{article.excerpt}</p>
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

