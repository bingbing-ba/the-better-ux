'use client';

import { Toggle } from '@/components/ui/toggle';

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
    <div className={`flex gap-2 ${className || ''}`}>
      <Toggle
        pressed={value === 'dont'}
        onPressedChange={(pressed) => pressed && onChange('dont')}
        aria-label="Show Don&apos;t example"
        className="data-[state=on]:bg-red-100 data-[state=on]:text-red-900"
      >
        ❌ Don&apos;t
      </Toggle>
      <Toggle
        pressed={value === 'do'}
        onPressedChange={(pressed) => pressed && onChange('do')}
        aria-label="Show Do example"
        className="data-[state=on]:bg-green-100 data-[state=on]:text-green-900"
      >
        ✅ Do
      </Toggle>
    </div>
  );
}

