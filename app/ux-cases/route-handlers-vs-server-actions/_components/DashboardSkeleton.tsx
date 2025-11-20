'use client';

import { cn } from '@/lib/utils';

/**
 * DashboardSkeleton component
 * Displays 3 skeleton cards for loading state
 */
export function DashboardSkeleton() {
  return (
    <div
      className={cn('grid grid-cols-1 md:grid-cols-3 gap-6')}
      aria-busy="true"
      aria-label="Loading dashboard metrics"
    >
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          data-testid="skeleton-card"
          className={cn(
            'border rounded-lg p-6 bg-white animate-pulse'
          )}
        >
          {/* Title skeleton */}
          <div className="flex items-center justify-between mb-4">
            <div
              data-testid="skeleton-title"
              className="h-4 bg-gray-200 rounded w-20"
            />
            <div className="h-5 w-5 bg-gray-200 rounded" />
          </div>

          {/* Value skeleton */}
          <div
            data-testid="skeleton-value"
            className="h-8 bg-gray-200 rounded w-24 mb-2"
          />
          <div className="h-4 bg-gray-100 rounded w-32" />

          {/* Timing skeleton */}
          <div className="mt-4 pt-4 border-t">
            <div className="h-3 bg-gray-100 rounded w-28 mb-1" />
            <div className="h-3 bg-gray-100 rounded w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}
