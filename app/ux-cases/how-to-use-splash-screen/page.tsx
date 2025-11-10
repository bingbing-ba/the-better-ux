'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { DoDontToggle } from '@/app/ux-cases/_components/DoDontToggle';
import { useDoDontView } from '@/app/ux-cases/_hooks/useDoDontView';
import { cases } from '@/app/ux-cases/_data/cases';
import { SplashVideo } from './_components/SplashVideo';
import { ArticleList } from './_components/ArticleList';
import { getArticles } from './_actions/getArticles';
import { preloadThumbnails } from './_components/preloadHelper';

export default function HowToUseSplashScreenPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HowToUseSplashScreenContent />
    </Suspense>
  );
}

function HowToUseSplashScreenContent() {
  // MUST use useDoDontView hook for all cases with Do/Dont examples
  const { view: viewType } = useDoDontView();
  const [showSplash, setShowSplash] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  const [cacheBustTimestamp, setCacheBustTimestamp] = useState<number>(Date.now());

  // Always re-fetch via server action on initial load and on every toggle (FR-013, FR-016)
  const {
    data: articles,
    isLoading: isLoadingArticles,
    error: articlesError,
  } = useQuery({
    queryKey: ['articles', viewType], // Include viewType to force re-fetch on toggle
    queryFn: getArticles,
    staleTime: 0, // Always consider stale to force fresh fetch
    gcTime: 0, // Don't cache to ensure fresh fetch on toggle
  });

  // Preload images for Do view during splash (FR-004, FR-018)
  // Use the same timestamp for preload and render to ensure images match
  useEffect(() => {
    if (viewType === 'do' && articles && articles.length > 0 && !imagesPreloaded) {
      preloadThumbnails(articles, cacheBustTimestamp).then(() => {
        setImagesPreloaded(true);
      });
    } else if (viewType === 'dont') {
      // Reset preload state for Don't view
      setImagesPreloaded(false);
    }
  }, [viewType, articles, imagesPreloaded, cacheBustTimestamp]);

  // Reset splash state when view changes (FR-005a, FR-005b)
  // Generate new timestamp for cache-busting on each view change
  useEffect(() => {
    setShowSplash(true);
    setVideoEnded(false);
    setImagesPreloaded(false);
    setCacheBustTimestamp(Date.now()); // New timestamp for each view toggle
  }, [viewType]);

  // Handle video end - gate splash dismissal (FR-007, FR-011)
  const handleVideoEnd = () => {
    setVideoEnded(true);
    
    // Dismiss splash when video ends
    // For Do: also wait for images to be preloaded
    // For Don't: dismiss immediately after video ends
    if (viewType === 'do') {
      // Wait for images to be preloaded
      if (imagesPreloaded) {
        setShowSplash(false);
      }
    } else {
      // Don't: dismiss after video ends (data may still be loading, show skeletons)
      setShowSplash(false);
    }
  };

  // Dismiss splash for Do view when images are ready after video ended
  useEffect(() => {
    if (viewType === 'do' && videoEnded && imagesPreloaded && showSplash) {
      setShowSplash(false);
    }
  }, [viewType, videoEnded, imagesPreloaded, showSplash]);

  // Find case metadata
  const caseMetadata = cases.find((c) => c.slug === 'how-to-use-splash-screen');

  // For Don't: only render page after data is ready and video ends
  const shouldShowPage = viewType === 'do' || (!showSplash && !isLoadingArticles);

  return (
    <>
      {/* Splash video overlay - removed when showSplash is false */}
      {showSplash && <SplashVideo onVideoEnd={handleVideoEnd} />}

      {/* Page content - for Do: renders immediately; for Don't: renders after data + video */}
      {shouldShowPage && (
        <div className={cn('min-h-screen p-8 font-sans')}>
          <div className={cn('mx-auto max-w-4xl')}>
            {/* Back to Home with icon */}
            <Link
              href="/"
              className={cn('mb-6 inline-flex items-center gap-1 text-blue-600 hover:text-blue-800')}
            >
              <ChevronLeft className={cn('h-4 w-4')} />
              <span>Home</span>
            </Link>

            {/* Header */}
            <header className={cn('mb-8')}>
              <h1 className={cn('mb-4 text-4xl font-bold')}>
                {caseMetadata?.title || 'How to use splash screen'}
              </h1>
              {caseMetadata?.tags && (
                <div className={cn('flex gap-2')}>
                  {caseMetadata.tags.map((tag) => (
                    <span
                      key={tag}
                      className={cn('rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600')}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Toggle */}
            <div className={cn('mb-8')}>
              <DoDontToggle />
            </div>

            {/* Behavior description */}
            <div className={cn('mb-6 rounded-lg border border-gray-300 bg-gray-50 p-4')}>
              {viewType === 'do' ? (
                <p className={cn('text-sm text-gray-700')}>
                  ✅ <strong>Do:</strong> Images are already loaded when splash is on
                </p>
              ) : (
                <p className={cn('text-sm text-gray-700')}>
                  ❌ <strong>Don&apos;t:</strong> Images start to load after splash is off
                </p>
              )}
            </div>

            {/* Content */}
            <div className={cn('rounded-lg border border-gray-200 p-8')}>
              <ArticleList
                articles={articles || []}
                deferImageLoad={viewType === 'dont'}
                isLoading={isLoadingArticles}
                error={articlesError ? 'Oops there is something wrong, try again later' : null}
                cacheBustTimestamp={cacheBustTimestamp}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
