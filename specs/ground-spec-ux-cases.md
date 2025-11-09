# Ground Specification: UX Cases

**Purpose**: Reusable patterns and standards for all UX case pages  
**Created**: 2025-01-27  
**Status**: Active  
**Applies To**: All pages under `/ux-cases/{slug}`

## Overview

This ground spec defines the common patterns that every UX case page MUST follow. It ensures consistency across all cases while allowing case-specific content and behavior.

## URL Structure & Routing

### Route Pattern
- **Path**: `/ux-cases/{slug}`
- **Query Parameter**: `?view=do|dont`
- **Example**: `/ux-cases/image-loading-blurhash?view=do`

### View Parameter Rules
- **Parameter Name**: `view`
- **Valid Values**: `do` | `dont`
- **Default Value**: `dont` (when not specified or invalid)
- **Behavior**: 
  - MUST be readable from URL on page load
  - MUST update URL when toggle changes (managed by DoDontToggle component)
  - MUST sync automatically when URL changes (browser back/forward)
  - MUST use `router.replace()` to avoid adding history entries
  - MUST use `scroll: false` option to prevent scroll jump
  - **Search params are the single source of truth** (no local state needed)

### Implementation Pattern

```typescript
'use client';

import { Suspense } from 'react';
import { DoDontToggle } from '@/app/ux-cases/_components/DoDontToggle';
import { useDoDontView } from '@/app/ux-cases/_hooks/useDoDontView';

export default function CasePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CaseContent />
    </Suspense>
  );
}

function CaseContent() {
  // Use hook to get current view (MUST use for all cases with Do/Dont)
  const { view } = useDoDontView();

  return (
    // ... page content
    <DoDontToggle /> {/* No props needed - uses useDoDontView internally */}
    {view === 'dont' ? <DontExample /> : <DoExample />}
  );
}
```

## Page Structure

### Required Layout Order

Every case page MUST follow this structure (in order):

1. **Back to Home Link** (with ChevronLeft icon)
2. **Header Section**
   - Title (from case metadata)
   - Tags (if available)
3. **Do/Don't Toggle** (if case supports both views)
4. **Content Section**
   - Do example (when `view === 'do'`)
   - Don't example (when `view === 'dont'`)

### Component Structure

```
app/ux-cases/{slug}/
├── page.tsx                    # Main page (wraps content in Suspense)
├── _components/                # Case-specific components
│   ├── DoExample.tsx           # "Do" view content
│   └── DontExample.tsx         # "Don't" view content
└── _assets/                    # Optional local assets folder
    └── (images, videos, etc.)
```

**Asset Locations**:
- **Local assets**: `app/ux-cases/{slug}/_assets/` folder
- **Remote assets**: Use full URL (e.g., `https://storage.googleapis.com/...`)
- Assets can be referenced from either location

## Shared Hooks

### useDoDontView Hook

**Location**: `app/ux-cases/_hooks/useDoDontView.ts`

**Purpose**: Centralized hook for managing Do/Don't view state via URL search params

**Usage**:
```typescript
import { useDoDontView } from '@/app/ux-cases/_hooks/useDoDontView';

function CaseContent() {
  const { view, setView } = useDoDontView();
  
  // view: Current view ('do' | 'dont'), defaults to 'dont'
  // setView: Function to update the view in URL search params
}
```

**Returns**:
- `view: ViewType` - Current view ('do' | 'dont'), defaults to 'dont' when not specified
- `setView: (newView: ViewType) => void` - Function to update the view in URL search params

**Requirements**:
- **MUST be used** by all case pages that have both Do and Don't examples
- **MUST be used** inside a `Suspense` boundary (case pages already provide this)
- Search params are the single source of truth (no local state needed)

**Behavior**:
- Reads view from URL `?view=do|dont` parameter
- Defaults to `'dont'` when no view is specified or invalid
- Updates URL when `setView` is called (uses `router.replace()` with `scroll: false`)
- Automatically syncs with browser back/forward navigation

## Shared Components

### DoDontToggle Component

**Location**: `app/ux-cases/_components/DoDontToggle.tsx`

**Usage**:
```typescript
import { DoDontToggle } from '@/app/ux-cases/_components/DoDontToggle';

<DoDontToggle className="optional-class" />
```

**Props**:
- `className?: string` - Optional className for styling
- **No value/onChange props needed** - Component manages search params internally

**Behavior**:
- **Uses `useDoDontView` hook internally** - Manages search params via the hook
- Defaults to "Don't" when no view is specified in URL
- Updates URL when toggle changes (uses `router.replace()` with `scroll: false`)
- Automatically syncs with browser back/forward navigation
- Shows both "Do" and "Don't" buttons
- Uses Lucide icons (XCircle for Don't, CheckCircle for Do)
- Accessible with ARIA labels
- **Search params are the single source of truth**

### Back to Home Link

**Required Pattern**:
```typescript
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

<Link
  href="/"
  className="mb-6 inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
>
  <ChevronLeft className="h-4 w-4" />
  <span>Home</span>
</Link>
```

## Case Metadata Integration

### Metadata Source

**Location**: `app/ux-cases/_data/cases.ts`

**Interface**:
```typescript
export interface CaseMetadata {
  title: string;
  slug: string;
  createdAt: string; // ISO date string
  tags?: string[];
  isTrending?: boolean;
}
```

### Usage Pattern

```typescript
import { cases } from '@/app/ux-cases/_data/cases';
import { DoDontToggle } from '@/app/ux-cases/_components/DoDontToggle';
import { useDoDontView } from '@/app/ux-cases/_hooks/useDoDontView';

function CaseContent() {
  const slug = 'your-case-slug';

  // MUST use useDoDontView hook for all cases with Do/Dont examples
  const { view } = useDoDontView();

  // Find case metadata by slug
  const caseMetadata = cases.find((c) => c.slug === slug);

  return (
    <>
      <h1>{caseMetadata?.title || 'Fallback Title'}</h1>
      {caseMetadata?.tags && (
        <div className="flex gap-2">
          {caseMetadata.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
              {tag}
            </span>
          ))}
        </div>
      )}
      <DoDontToggle /> {/* No props needed - uses useDoDontView internally */}
      {view === 'dont' ? <DontExample /> : <DoExample />}
    </>
  );
}
```

### Adding New Case Metadata

When creating a new case, add its metadata to `app/ux-cases/_data/cases.ts`:

```typescript
export const cases: CaseMetadata[] = [
  // ... existing cases
  {
    title: "Your Case Title",
    slug: 'your-case-slug',
    createdAt: '2025-01-27', // ISO date string
    tags: ['tag1', 'tag2'],
    isTrending: false,
  },
];
```

## Content Guidelines

### Page Container

**Required Classes**:
```typescript
<div className="min-h-screen p-8 font-sans">
  <div className="mx-auto max-w-4xl">
    {/* content */}
  </div>
</div>
```

### Header Section

**Required Structure**:
```typescript
<header className="mb-8">
  <h1 className="mb-4 text-4xl font-bold">
    {caseMetadata?.title || 'Case Title'}
  </h1>
  {caseMetadata?.tags && (
    <div className="flex gap-2">
      {caseMetadata.tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
        >
          {tag}
        </span>
      ))}
    </div>
  )}
</header>
```

### Toggle Section

**Required Structure**:
```typescript
<div className="mb-8">
  <DoDontToggle />
</div>
```

**Conditional Rendering**:
- Only show toggle if case supports both Do and Don't views
- If case only has one view, omit the toggle
- **No props needed** - component manages search params internally

### Content Section

**Required Structure**:
```typescript
<div className="rounded-lg border border-gray-200 p-8">
  {view === 'dont' ? <DontExample /> : <DoExample />}
</div>
```

## Styling Standards

### Utility Classes

- Use `cn()` helper from `@/lib/utils` for className composition
- Follow Tailwind CSS patterns
- Use Shadcn UI components where applicable

### Spacing

- Container padding: `p-8`
- Section margins: `mb-8` (between major sections)
- Max width: `max-w-4xl` (centered with `mx-auto`)

### Colors

- Back link: `text-blue-600 hover:text-blue-800`
- Tags: `bg-gray-100 text-gray-600`
- Content border: `border-gray-200`

## Accessibility Requirements

### Required ARIA Labels

- DoDontToggle buttons MUST have `aria-label` attributes
- Images MUST have descriptive `alt` text
- Links MUST be keyboard navigable

### Keyboard Navigation

- All interactive elements MUST be keyboard accessible
- Focus states MUST be visible
- Tab order MUST be logical

## Performance Requirements

### Loading States

- Use `Suspense` boundary for search params
- Provide loading fallback UI
- Avoid layout shift during loading

### Image Optimization

- Use Next.js Image component when applicable
- Provide proper dimensions to prevent layout shift
- Use appropriate image formats (WebP preferred)

## Testing Requirements

### Required Tests

Each case page SHOULD have:

1. **Unit Test**: View param handling and default behavior
2. **E2E Test**: Toggle functionality and URL updates
3. **E2E Test**: Browser back/forward navigation

### Test Patterns

```typescript
// Unit test example
describe('Case Page', () => {
  it('defaults to dont view when no param', () => {
    // Test default behavior
  });

  it('reads view param from URL', () => {
    // Test URL param reading
  });

  it('updates URL when toggle changes', () => {
    // Test URL updates
  });
});
```

## Edge Cases

### Invalid View Parameter

- If `?view=invalid`, default to `'dont'`
- Validate view param: only accept `'do'` or `'dont'`

### Missing Case Metadata

- If case not found in metadata, use fallback title
- Handle gracefully without breaking page

### Single View Cases

- If case only has Do OR Don't (not both):
  - Omit the toggle component
  - Show the single available view
  - Still respect URL param if provided (for consistency)

## Migration Checklist

When creating a new UX case page, verify:

- [ ] Route follows `/ux-cases/{slug}` pattern
- [ ] Page wrapped in Suspense for search params
- [ ] **MUST use `useDoDontView` hook** for all cases with Do/Dont examples
- [ ] View read from hook (no local state, no direct `searchParams` access)
- [ ] Default view is `'dont'` when not specified
- [ ] Back to Home link present with ChevronLeft icon
- [ ] Case metadata added to `_data/cases.ts`
- [ ] Header shows title and tags from metadata
- [ ] DoDontToggle used without props (if both views supported)
- [ ] Content section conditionally renders Do/Dont examples based on hook's view
- [ ] Uses `cn()` helper for className composition
- [ ] Follows spacing and styling standards
- [ ] Accessible (ARIA labels, keyboard navigation)
- [ ] Tests written for view param handling
- [ ] Assets placed in `_assets/` folder or use remote URLs

## Examples

### Minimal Case Page

```typescript
'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DoDontToggle } from '@/app/ux-cases/_components/DoDontToggle';
import { useDoDontView } from '@/app/ux-cases/_hooks/useDoDontView';
import { cases } from '@/app/ux-cases/_data/cases';
import { DoExample, DontExample } from './_components/Examples';

export default function YourCasePage() {
  return (
    <Suspense fallback={<div className={cn('flex min-h-screen items-center justify-center')}>Loading...</div>}>
      <YourCaseContent />
    </Suspense>
  );
}

function YourCaseContent() {
  const slug = 'your-case-slug';

  // MUST use useDoDontView hook for all cases with Do/Dont examples
  const { view } = useDoDontView();

  const caseMetadata = cases.find((c) => c.slug === slug);

  return (
    <div className={cn('min-h-screen p-8 font-sans')}>
      <div className={cn('mx-auto max-w-4xl')}>
        <Link
          href="/"
          className={cn('mb-6 inline-flex items-center gap-1 text-blue-600 hover:text-blue-800')}
        >
          <ChevronLeft className={cn('h-4 w-4')} />
          <span>Home</span>
        </Link>

        <header className={cn('mb-8')}>
          <h1 className={cn('mb-4 text-4xl font-bold')}>
            {caseMetadata?.title || 'Your Case Title'}
          </h1>
          {caseMetadata?.tags && (
            <div className={cn('flex gap-2')}>
              {caseMetadata.tags.map((tag) => (
                <span
                  key={tag}
                  className={cn('rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600')}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className={cn('mb-8')}>
          <DoDontToggle />
        </div>

        <div className={cn('rounded-lg border border-gray-200 p-8')}>
          {view === 'dont' ? <DontExample /> : <DoExample />}
        </div>
      </div>
    </div>
  );
}
```

## Version History

- **2025-01-27**: Initial ground spec created from `001-ux-cases-browser` patterns
- **2025-01-27**: Updated to use search params as single source of truth (DoDontToggle manages params directly, no local state in CaseContent)
- **2025-01-27**: Added `useDoDontView` hook - all cases with Do/Dont examples MUST use this hook

