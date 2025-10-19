'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Blurhash } from 'react-blurhash';
import { cn } from '@/lib/utils';
import { DoDontToggle, ViewType } from '../_components/DoDontToggle';
import { cases } from '../_data/cases';

// Image assets from spec supplement
const IMAGES = [
  'https://storage.googleapis.com/the-better-ux/image-loading-blurhash/profile-1.png',
  'https://storage.googleapis.com/the-better-ux/image-loading-blurhash/profile-2.png',
  'https://storage.googleapis.com/the-better-ux/image-loading-blurhash/profile-3.png',
  'https://storage.googleapis.com/the-better-ux/image-loading-blurhash/profile-4.png',
];

// Blurhash strings from spec supplement (order 1→4)
const BLURHASHES = [
  ':VJ8Lut7%g9ZIBV@ozW;~WxukXR*DiWAWBofIotRi_oJxvWBjYoJW=WCs.V@ozoga#oft7aeaea}M{WCofofogt7RjaekCWBs:oJoft7WXRjoJf6RkayxuofWBWBayj[RjWB',
  ':fO:w*jZ?wbIR5oLNGayD*bH%1aeR*ofaxayo~ofROWCW=j[t7a}%2j@NHWVoJj[offQxuj[M{ayt7j]WBfRoIaeR*oft7aeRjayozazaeoLj[azWVj[ayayfPofWBWBofj[',
  ':QIqP|IU0fs,wHs:n%bI00^+%goLt6R*f6WV.TRk,:NFIpoeW=of9ut7w]%3RkoMbcayaet7xvNGWVWBoLj[-=NHR%WBNat7aeofafX9R-t7jZRks:axozt8bbNGn$WBoeof',
  ':SKK$qoz.TkCwHoeShj]~qWBM_WVIUjsWBay0KjsnMoftSbHxaj[.8ayR*jZoLWBRjoLjFj[M{j[j[ofoLfPRjj[t7WBt7oeRjWBofjtbHWVRioLWVa}Rjays:kCj[f6t7WB',
];

export default function ImageLoadingBlurhashPage() {
  return (
    <Suspense fallback={<div className={cn('flex min-h-screen items-center justify-center')}>Loading...</div>}>
      <ImageLoadingBlurhashContent />
    </Suspense>
  );
}

function ImageLoadingBlurhashContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

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

  // Find case metadata
  const caseMetadata = cases.find((c) => c.slug === 'image-loading-blurhash');

  return (
    <div className={cn('min-h-screen p-8 font-sans')}>
      <div className={cn('mx-auto max-w-4xl')}>
        {/* Back to Home */}
        <Link
          href="/"
          className={cn('mb-6 inline-block text-blue-600 underline hover:text-blue-800')}
        >
          ← Back to Home
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
          <DoDontToggle value={view} onChange={handleViewChange} />
        </div>

        {/* Content */}
        <div className={cn('rounded-lg border border-gray-200 p-8')}>
          {view === 'dont' ? (
            <DontExample />
          ) : (
            <DoExample />
          )}
        </div>
      </div>
    </div>
  );
}

// Don't example: gray placeholder, no blurhash, demo delay
function DontExample() {
  return (
    <div>
      <h2 className={cn('mb-4 text-2xl font-semibold text-red-900')}>❌ Don&apos;t</h2>
      <p className={cn('mb-6 text-gray-700')}>
        Loading images without a meaningful placeholder creates a jarring experience. Users see
        uniform gray boxes that suddenly pop in with content, missing the opportunity for visual
        continuity.
      </p>
      <div className={cn('grid grid-cols-2 gap-4')}>
        {IMAGES.map((src, idx) => (
          <ImageWithGrayPlaceholder
            key={idx}
            src={src}
            alt={`Profile ${idx + 1} - bad example with no visual preview while loading`}
          />
        ))}
      </div>
    </div>
  );
}

// Do example: blurhash placeholder, smooth transition, demo delay
function DoExample() {
  return (
    <div>
      <h2 className={cn('mb-4 text-2xl font-semibold text-green-900')}>✅ Do</h2>
      <p className={cn('mb-6 text-gray-700')}>
        Using Blurhash provides an instant visual preview while the full image loads. This
        technique, used by Slack and Discord, creates a smooth, professional loading experience
        with visual continuity.
      </p>
      <div className={cn('grid grid-cols-2 gap-4')}>
        {IMAGES.map((src, idx) => (
          <ImageWithBlurhash
            key={idx}
            src={src}
            blurhash={BLURHASHES[idx]}
            alt={`Profile ${idx + 1} - good example with blurhash preview for smooth loading`}
          />
        ))}
      </div>
    </div>
  );
}

// Gray placeholder component (Don't)
function ImageWithGrayPlaceholder({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Simulate demo delay ~700-1200ms
    const delay = Math.floor(Math.random() * 500) + 700;
    const timer = setTimeout(() => setShouldShow(true), delay);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn('relative aspect-square overflow-hidden rounded-lg')}>
      {/* Reserve space to prevent layout shift */}
      <div className={cn('absolute inset-0 bg-gray-300')} />
      {shouldShow && (
        <Image
          src={src}
          alt={alt}
          fill
          className={cn('object-cover transition-opacity duration-300', loaded ? 'opacity-100' : 'opacity-0')}
          onLoad={() => setLoaded(true)}
        />
      )}
    </div>
  );
}

// Blurhash placeholder component (Do)
function ImageWithBlurhash({ src, blurhash, alt }: { src: string; blurhash: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Simulate demo delay ~700-1200ms
    const delay = Math.floor(Math.random() * 500) + 700;
    const timer = setTimeout(() => setShouldShow(true), delay);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn('relative aspect-square overflow-hidden rounded-lg')}>
      {/* Real Blurhash preview */}
      <Blurhash
        hash={blurhash}
        width={'100%'}
        height={'100%'}
        punch={1}
      />
      {shouldShow && (
        <Image
          src={src}
          alt={alt}
          fill
          className={cn('object-cover transition-opacity duration-500', loaded ? 'opacity-100' : 'opacity-0')}
          onLoad={() => setLoaded(true)}
        />
      )}
    </div>
  );
}

// no-op: gradient approximation removed in favor of real Blurhash

