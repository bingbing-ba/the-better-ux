'use client';

import { cn } from '@/lib/utils';
import type { TimingBadgeProps } from '../_types/dashboard';

/**
 * TimingBadge component
 * Displays timing information for API calls
 */
export function TimingBadge({ timing, variant = 'inline' }: TimingBadgeProps) {
  const isLoading = !timing.respondedAt;

  // Format timestamp to human-readable time (HH:MM:SS.mmm)
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ms = date.getMilliseconds().toString().padStart(3, '0');
    return `${hours}:${minutes}:${seconds}.${ms}`;
  };

  if (variant === 'detailed') {
    return (
      <div
        role="status"
        aria-label={
          isLoading
            ? `Request started at ${formatTime(timing.requestedAt)}, waiting for response`
            : `Request completed in ${timing.duration}ms`
        }
        className={cn(
          'text-xs space-y-1',
          isLoading ? 'text-gray-500' : 'text-green-600'
        )}
      >
        <div>
          <span className="font-medium">Requested:</span> {formatTime(timing.requestedAt)}
        </div>
        {timing.respondedAt && (
          <div>
            <span className="font-medium">Responded:</span> {formatTime(timing.respondedAt)}
          </div>
        )}
        {timing.duration !== undefined && (
          <div>
            <span className="font-medium">Duration:</span> {timing.duration}ms
          </div>
        )}
      </div>
    );
  }

  // Inline variant (default)
  return (
    <span
      role="status"
      aria-label={
        isLoading
          ? `Request started at ${formatTime(timing.requestedAt)}, waiting for response`
          : `Request completed in ${timing.duration}ms`
      }
      className={cn(
        'text-xs',
        isLoading ? 'text-gray-500' : 'text-green-600'
      )}
    >
      {isLoading ? (
        <span>Requested at {formatTime(timing.requestedAt)}</span>
      ) : (
        <span>{timing.duration}ms</span>
      )}
    </span>
  );
}
