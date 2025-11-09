'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { DoDontToggle } from '@/app/ux-cases/_components/DoDontToggle';
import { useDoDontView } from '@/app/ux-cases/_hooks/useDoDontView';
import { SplashVideo } from './_components/SplashVideo';
import { ArticleList } from './_components/ArticleList';
import { fetchArticles } from './_components/articleService';
import { preloadThumbnails } from './_components/preloadHelper';
import type { Article } from './_components/ArticleCard';
import { Button } from '@/components/ui/button';

const MIN_SPLASH_DURATION = 1000; // 1 second
const MAX_SPLASH_DURATION = 5000; // 5 seconds

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
  const [articles, setArticles] = useState<Article[]>([]);
  const [dataReady, setDataReady] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const splashStartRef = useRef<number>(Date.now());

  // Fetch articles during splash
  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedArticles = await fetchArticles();
        setArticles(fetchedArticles);
        setDataReady(true);

        // For "Do" mode, preload thumbnails during splash
        if (viewType === 'do') {
          await preloadThumbnails(fetchedArticles);
          setImagesReady(true);
        }
      } catch (err) {
        console.error('[Splash] Data fetch failed:', err);
        setError('Oops there is something wrong, try again later');
        setDataReady(true); // Proceed even on error
      }
    };

    loadData();
  }, [viewType]);

  // Splash controller: min 1s, max 5s
  useEffect(() => {
    const elapsed = Date.now() - splashStartRef.current;
    const maxWait = Math.max(0, MAX_SPLASH_DURATION - elapsed);

    // Determine when to dismiss splash
    const checkDismiss = () => {
      const now = Date.now();
      const totalElapsed = now - splashStartRef.current;

      // Max cap reached
      if (totalElapsed >= MAX_SPLASH_DURATION) {
        dismissSplash();
        return;
      }

      // Don't mode: proceed when data ready
      if (viewType === 'dont' && dataReady && totalElapsed >= MIN_SPLASH_DURATION) {
        dismissSplash();
        return;
      }

      // Do mode: proceed when data + images ready
      if (viewType === 'do' && dataReady && imagesReady && totalElapsed >= MIN_SPLASH_DURATION) {
        dismissSplash();
        return;
      }
    };

    const dismissSplash = () => {
      setShowSplash(false);
    };

    // Check periodically
    const interval = setInterval(checkDismiss, 100);

    // Force dismiss at max cap
    const maxTimeout = setTimeout(() => {
      dismissSplash();
    }, maxWait);

    return () => {
      clearInterval(interval);
      clearTimeout(maxTimeout);
    };
  }, [dataReady, imagesReady, viewType]);

  if (showSplash) {
    return <SplashVideo />;
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">How to use splash screen</h1>
        <p className="mb-6 text-gray-700">
          Compare two approaches: preload during splash (Do) vs. load after splash (Don&apos;t).
        </p>
        <DoDontToggle />
      </header>

      <div className="flex flex-col gap-4 py-8">
        <Button>Primary</Button>
        <Button disabled>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
        <Button variant="destructive">Destructive</Button>
      </div>

      <main>
        <ArticleList articles={articles} deferImageLoad={viewType === 'dont'} error={error} />
      </main>
    </div>
  );
}
