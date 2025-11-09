'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DoDontToggle } from '../_components/DoDontToggle';
import { useDoDontView } from '../_hooks/useDoDontView';
import { cases } from '../_data/cases';
import { DontExample, DoExample } from './_components/Examples';

export default function ImageLoadingBlurhashPage() {
  return (
    <Suspense fallback={<div className={cn('flex min-h-screen items-center justify-center')}>Loading...</div>}>
      <ImageLoadingBlurhashContent />
    </Suspense>
  );
}

function ImageLoadingBlurhashContent() {
  // MUST use useDoDontView hook for all cases with Do/Dont examples
  const { view } = useDoDontView();

  // Find case metadata
  const caseMetadata = cases.find((c) => c.slug === 'image-loading-blurhash');

  return (
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
            {caseMetadata?.title || 'Image Loading with Blurhash'}
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

        {/* Content */}
        <div className={cn('rounded-lg border border-gray-200 p-8')}>
          {view === 'dont' ? <DontExample /> : <DoExample />}
        </div>
      </div>
    </div>
  );
}
