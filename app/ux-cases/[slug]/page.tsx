'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DoDontToggle, ViewType } from '../_components/DoDontToggle';
import { cases } from '../_data/cases';

interface CasePageProps {
  params: Promise<{ slug: string }>;
}

export default function CasePage({ params }: CasePageProps) {
  const [slug, setSlug] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Unwrap params
  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  // Get view from URL or default to 'dont'
  const viewParam = searchParams.get('view') as ViewType | null;
  const [view, setView] = useState<ViewType>(
    viewParam === 'do' || viewParam === 'dont' ? viewParam : 'dont'
  );

  // Update URL when view changes
  const handleViewChange = (newView: ViewType) => {
    setView(newView);
    const url = new URL(window.location.href);
    url.searchParams.set('view', newView);
    router.replace(url.pathname + url.search, { scroll: false });
  };

  // Sync view with URL param changes
  useEffect(() => {
    if (viewParam === 'do' || viewParam === 'dont') {
      setView(viewParam);
    }
  }, [viewParam]);

  if (!slug) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Find case metadata
  const caseMetadata = cases.find((c) => c.slug === slug);

  if (!caseMetadata) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Case not found</h1>
          <Link href="/" className="text-blue-600 underline hover:text-blue-800">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Route to specific case component
  if (slug === 'image-loading-blurhash') {
    return (
      <ImageLoadingBlurhashCase
        view={view}
        onViewChange={handleViewChange}
        caseMetadata={caseMetadata}
      />
    );
  }

  // Default fallback
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold">Case implementation not found</h1>
        <Link href="/" className="text-blue-600 underline hover:text-blue-800">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

// Case-specific component
function ImageLoadingBlurhashCase({
  view,
  onViewChange,
  caseMetadata,
}: {
  view: ViewType;
  onViewChange: (v: ViewType) => void;
  caseMetadata: { title: string; tags?: string[] };
}) {
  return (
    <div className="min-h-screen p-8 font-sans">
      <div className="mx-auto max-w-4xl">
        {/* Back to Home */}
        <Link
          href="/"
          className="mb-6 inline-block text-blue-600 underline hover:text-blue-800"
        >
          ← Back to Home
        </Link>

        {/* Header */}
        <header className="mb-8">
          <h1 className="mb-4 text-4xl font-bold">{caseMetadata.title}</h1>
          <div className="flex gap-2">
            {caseMetadata.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Toggle */}
        <div className="mb-8">
          <DoDontToggle value={view} onChange={onViewChange} />
        </div>

        {/* Content */}
        <div className="rounded-lg border border-gray-200 p-8">
          {view === 'dont' ? (
            <div>
              <h2 className="mb-4 text-2xl font-semibold text-red-900">❌ Don&apos;t</h2>
              <p className="mb-6 text-gray-700">
                Loading images without a placeholder creates a jarring experience. Users see empty
                space that suddenly pops in, causing layout shifts and visual instability.
              </p>
              <div className="rounded-lg bg-gray-100 p-8 text-center">
                <div className="mx-auto h-64 w-64 animate-pulse bg-gray-300"></div>
                <p className="mt-4 text-sm text-gray-600">
                  Bad: No visual feedback while loading
                </p>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="mb-4 text-2xl font-semibold text-green-900">✅ Do</h2>
              <p className="mb-6 text-gray-700">
                Using Blurhash provides an instant visual preview while the full image loads. This
                technique, used by Slack and Discord, creates a smooth, professional loading
                experience.
              </p>
              <div className="rounded-lg bg-gray-100 p-8 text-center">
                <div
                  className="mx-auto h-64 w-64 rounded-lg"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(147, 197, 253, 0.8), rgba(191, 219, 254, 0.6))',
                  }}
                ></div>
                <p className="mt-4 text-sm text-gray-600">
                  Good: Blurhash placeholder provides instant visual context
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

