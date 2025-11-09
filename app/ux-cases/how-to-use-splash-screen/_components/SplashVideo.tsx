'use client';

import { useEffect, useRef } from 'react';

interface SplashVideoProps {
  onVideoEnd?: () => void;
}

/**
 * Splash screen with black background video.
 * Shows only the video (no loading text overlay).
 * Dismissal is gated strictly by video end (FR-007, FR-011).
 */
export function SplashVideo({ onVideoEnd }: SplashVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      onVideoEnd?.();
    };

    video.addEventListener('ended', handleEnded);
    
    // Auto-play video
    video.play().catch((err) => {
      console.warn('[SplashVideo] Autoplay prevented:', err);
    });

    return () => video.removeEventListener('ended', handleEnded);
  }, [onVideoEnd]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <video
        ref={videoRef}
        className="h-auto w-full max-w-2xl"
        autoPlay
        muted
        playsInline
        aria-label="Loading splash screen animation"
      >
        <source src="https://storage.googleapis.com/the-better-ux/tbu-logo-splash.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

