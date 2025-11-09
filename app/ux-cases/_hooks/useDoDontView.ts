'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { ViewType } from '../_components/DoDontToggle';

/**
 * Hook for managing Do/Don't view state via URL search params
 * 
 * Returns:
 * - view: Current view ('do' | 'dont'), defaults to 'dont'
 * - setView: Function to update the view in URL search params
 * 
 * Usage:
 * ```typescript
 * const { view, setView } = useDoDontView();
 * ```
 * 
 * All cases with Do and Don't examples MUST use this hook
 */
export function useDoDontView() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get view from URL or default to 'dont'
  const viewParam = searchParams.get('view') as ViewType | null;
  const view: ViewType = viewParam === 'do' || viewParam === 'dont' ? viewParam : 'dont';

  // Update URL when view changes
  const setView = (newView: ViewType) => {
    const url = new URL(window.location.href);
    url.searchParams.set('view', newView);
    router.replace(url.pathname + url.search, { scroll: false });
  };

  return { view, setView };
}

