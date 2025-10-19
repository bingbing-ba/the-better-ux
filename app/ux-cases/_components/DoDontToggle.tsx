'use client';

import { XCircle, CheckCircle } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';

export type ViewType = 'do' | 'dont';

interface DoDontToggleProps {
  value: ViewType;
  onChange: (value: ViewType) => void;
  className?: string;
}

/**
 * Shared Do/Don't toggle component
 * Defaults to "Don't" when no view is specified
 * Can be controlled via URL query param: ?view=do|dont
 */
export function DoDontToggle({ value, onChange, className }: DoDontToggleProps) {
  return (
    <div className={cn('flex gap-2', className)}>
      <Toggle
        pressed={value === 'dont'}
        onPressedChange={(pressed) => pressed && onChange('dont')}
        aria-label="Show Don&apos;t example"
        className={cn('data-[state=on]:bg-red-100 data-[state=on]:text-red-900')}
      >
        <XCircle className={cn('mr-1 h-4 w-4')} />
        Don&apos;t
      </Toggle>
      <Toggle
        pressed={value === 'do'}
        onPressedChange={(pressed) => pressed && onChange('do')}
        aria-label="Show Do example"
        className={cn('data-[state=on]:bg-green-100 data-[state=on]:text-green-900')}
      >
        <CheckCircle className={cn('mr-1 h-4 w-4')} />
        Do
      </Toggle>
    </div>
  );
}

