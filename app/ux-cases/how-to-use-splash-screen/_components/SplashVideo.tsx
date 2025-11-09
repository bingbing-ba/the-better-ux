'use client';

import { useEffect, useRef } from 'react';

interface SplashVideoProps {
  onVideoReady?: () => void;
}

/**
 * Splash screen with black background video.
 * Shows black background immediately even before video is ready to play.
 */
export function SplashVideo({ onVideoReady }: SplashVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      onVideoReady?.();
      video.play().catch((err) => {
        console.warn('[SplashVideo] Autoplay prevented:', err);
      });
    };

    video.addEventListener('canplay', handleCanPlay);
    return () => video.removeEventListener('canplay', handleCanPlay);
  }, [onVideoReady]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <video
        ref={videoRef}
        className="h-auto w-full max-w-2xl"
        autoPlay
        muted
        playsInline
        loop
        aria-label="Loading splash screen animation"
      >
        {/* Placeholder: replace with actual video source when available */}
        {/* <source src="/splash-video.mp4" type="video/mp4" /> */}
      </video>
      <div className="absolute inset-0 flex items-center justify-center text-white">
        <p className="text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
}

