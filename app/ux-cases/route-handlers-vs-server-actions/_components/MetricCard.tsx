'use client';

import { cn } from '@/lib/utils';
import { TimingBadge } from './TimingBadge';
import type { MetricCardProps } from '../_types/dashboard';

/**
 * MetricCard component
 * Displays a single metric with value, subtitle, and timing information
 */
export function MetricCard({
  title,
  icon,
  value,
  subtitle,
  timing,
  isLoading = false,
}: MetricCardProps) {
  return (
    <article
      role="article"
      aria-label={`${title} metric card`}
      className={cn('border rounded-lg p-6 bg-white')}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-gray-500">{title}</h4>
        <div className="text-gray-400">{icon}</div>
      </div>

      {isLoading ? (
        <div
          data-testid="metric-card-skeleton"
          className="animate-pulse"
          aria-label="Loading metric data"
        >
          <div className="h-8 bg-gray-200 rounded w-24 mb-2" />
          {subtitle && <div className="h-4 bg-gray-100 rounded w-32" />}
        </div>
      ) : (
        <div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {typeof value === 'number' && title.toLowerCase().includes('revenue')
              ? `$${value.toLocaleString()}`
              : value.toLocaleString()}
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
      )}

      <div className="mt-4 pt-4 border-t" aria-live="polite">
        <TimingBadge timing={timing} variant="detailed" />
      </div>
    </article>
  );
}
