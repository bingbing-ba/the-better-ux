'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Blurhash } from 'react-blurhash';
import { cn } from '@/lib/utils';

// Gray placeholder component (Don't)
export function ImageWithGrayPlaceholder({ src, alt }: { src: string; alt: string }) {
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
          className={cn(
            'object-cover transition-opacity duration-300',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setLoaded(true)}
        />
      )}
    </div>
  );
}

// Blurhash placeholder component (Do)
export function ImageWithBlurhash({ src, blurhash, alt }: { src: string; blurhash: string; alt: string }) {
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
      <Blurhash hash={blurhash} width={'100%'} height={'100%'} punch={1} />
      {shouldShow && (
        <Image
          src={src}
          alt={alt}
          fill
          className={cn(
            'object-cover transition-opacity duration-500',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setLoaded(true)}
        />
      )}
    </div>
  );
}

