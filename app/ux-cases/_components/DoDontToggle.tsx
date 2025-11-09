'use client';

import { XCircle, CheckCircle } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';
import { useDoDontView } from '../_hooks/useDoDontView';

export type ViewType = 'do' | 'dont';

interface DoDontToggleProps {
  className?: string;
}

/**
 * Shared Do/Don't toggle component
 * Uses useDoDontView hook to manage search params
 * Defaults to "Don't" when no view is specified in URL
 * Updates URL query param: ?view=do|dont
 */
export function DoDontToggle({ className }: DoDontToggleProps) {
  const { view, setView } = useDoDontView();

  return (
    <div className={cn('flex gap-2', className)}>
      <Toggle
        pressed={view === 'dont'}
        onPressedChange={(pressed) => pressed && setView('dont')}
        aria-label="Show Don&apos;t example"
        className={cn('data-[state=on]:bg-red-100 data-[state=on]:text-red-900')}
      >
        <XCircle className={cn('mr-1 h-4 w-4')} />
        Don&apos;t
      </Toggle>
      <Toggle
        pressed={view === 'do'}
        onPressedChange={(pressed) => pressed && setView('do')}
        aria-label="Show Do example"
        className={cn('data-[state=on]:bg-green-100 data-[state=on]:text-green-900')}
      >
        <CheckCircle className={cn('mr-1 h-4 w-4')} />
        Do
      </Toggle>
    </div>
  );
}

