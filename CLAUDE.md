# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"The Better UX" is a Next.js 15.5 educational platform that demonstrates UX best practices through interactive Do/Don't examples. Each case study lives at `/ux-cases/{slug}` with a toggle to switch between good and bad UX patterns.

## Tech Stack

- **Framework**: Next.js 15.5.4 (App Router, Turbopack)
- **Runtime**: React 19.1.0
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Shadcn UI (Radix primitives, Lucide icons)
- **State Management**:
  - TanStack Query 5.90.3 (server state)
  - Zustand 5.0.8 (client state)
- **Testing**: Jest 30.2.0, Playwright 1.56.0, Testing Library

## Development Commands

```bash
# Development server (uses Turbopack)
npm run dev

# Production build (uses Turbopack)
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## Architecture

### Directory Structure

```
app/
├── page.tsx                    # Landing page (lists all cases)
├── layout.tsx                  # Root layout with Providers
├── providers.tsx               # TanStack Query provider setup
├── globals.css                 # Tailwind + custom globals
└── ux-cases/                   # All UX case studies
    ├── _data/
    │   └── cases.ts            # Case metadata registry (CaseMetadata[])
    ├── _components/
    │   └── DoDontToggle.tsx    # Shared toggle component
    ├── _hooks/
    │   └── useDoDontView.ts    # Hook for ?view=do|dont param
    └── {slug}/                 # Individual case pages
        ├── page.tsx            # Case page (wrapped in Suspense)
        ├── _components/        # Case-specific components (if needed)
        ├── _hooks/             # Case-specific hooks (if needed)
        ├── _stores/            # Case-specific Zustand stores (if needed)
        ├── _actions/           # Case-specific server actions (if needed)
        ├── _tests/             # Case-specific tests (if needed)
        ├── api/                # API route handlers (if needed, no underscore - used as route)
        └── _assets/            # Local assets (if needed)

components/
└── ui/                         # Shadcn UI components
    ├── button.tsx
    ├── card.tsx
    └── toggle.tsx

lib/
└── utils.ts                    # cn() utility for className merging

specs/                          # Feature specifications
└── ground-spec-ux-cases.md     # **CRITICAL: Read this before creating new cases**
```

### Colocation & Import Rules

**Folder Creation**: Create folders only when needed. If a case has no hooks, don't create `_hooks/`.

**Naming Convention**:
- **Underscore prefix** (`_`): Use for private/non-route folders to avoid Next.js routing conflicts
- **Plural form**: All private folders use plural names (`_components`, `_stores`, `_actions`, `_hooks`, `_tests`)
- **Exception**: `api` has no underscore since it's used as a route

**Promotion Rule**: If a local thing (component, hook, store, etc.) is used more than twice across cases, move it up to the shared level (e.g., `app/ux-cases/_components/`).

**Import Direction** (IMPORTANT):
- Local things can ONLY import from upper/shared levels
- Local things CANNOT import other local things
- This prevents circular dependencies and ensures clear dependency flow

```
✅ case/_components/Foo.tsx → imports from → app/ux-cases/_hooks/
✅ case/_components/Foo.tsx → imports from → @/components/ui/
❌ case/_components/Foo.tsx → imports from → case/_hooks/
```

### Data Fetching Architecture

**IMPORTANT**: This project uses a strict separation for server-side data operations:

- **API Route Handlers** (`app/api/*/route.ts` or `app/ux-cases/{slug}/api/*/route.ts`):
  - Use for ALL data fetching (GET requests)
  - Use TanStack Query to call these endpoints from client components
  - Example: `GET /api/articles` to fetch article list

- **Server Actions** (`'use server'`):
  - Use ONLY for mutations (POST, PUT, DELETE, PATCH operations)
  - Do NOT use for data fetching
  - Example: form submissions, database updates, external API mutations

**Pattern Example**:
```typescript
// ❌ DON'T: Server action for data fetching
'use server';
export async function getArticles() { /* ... */ }

// ✅ DO: API route handler for data fetching
// app/api/articles/route.ts
export async function GET() {
  return Response.json(articles);
}

// ✅ DO: Server action for mutations only
'use server';
export async function createArticle(data: FormData) { /* ... */ }
```

### UX Case Pattern (IMPORTANT)

Every UX case page **MUST** follow the ground spec at `specs/ground-spec-ux-cases.md`. Key requirements:

1. **URL Structure**: `/ux-cases/{slug}?view=do|dont`

2. **Hook Usage**: ALL cases with Do/Don't examples MUST use `useDoDontView()` hook

3. **Component Structure**:
   ```tsx
   'use client';
   import { Suspense } from 'react';
   import { useDoDontView } from '@/app/ux-cases/_hooks/useDoDontView';
   import { DoDontToggle } from '@/app/ux-cases/_components/DoDontToggle';

   export default function CasePage() {
     return (
       <Suspense fallback={<div>Loading...</div>}>
         <CaseContent />
       </Suspense>
     );
   }

   function CaseContent() {
     const { view } = useDoDontView(); // search params as single source of truth

     return (
       <>
         <DoDontToggle /> {/* No props needed */}
         {view === 'dont' ? <DontExample /> : <DoExample />}
       </>
     );
   }
   ```

4. **Page Layout Order** (strictly enforced):
   - Back to Home link (with ChevronLeft icon)
   - Header (title + tags from metadata)
   - DoDontToggle (if both views supported)
   - Content section (Do/Don't examples)

5. **Metadata Registration**: Add new cases to `app/ux-cases/_data/cases.ts`:
   ```typescript
   {
     title: "Your Case Title",
     slug: 'your-case-slug',
     createdAt: '2025-01-27', // ISO date string
     tags: ['tag1', 'tag2'],
     isTrending: false,
   }
   ```

### State Management Patterns

- **Search Params**: Single source of truth for view state (`?view=do|dont`)
  - Managed via `useDoDontView()` hook
  - Uses `router.replace()` with `scroll: false`
  - No local state needed for toggle

- **TanStack Query**: For fetching data from API route handlers
  - Call API routes from client components
  - Handle loading, error, and success states

- **Zustand**: For client-side global state (when needed)

### Image Configuration

`next.config.ts` allows remote images from:
- `storage.googleapis.com/the-better-ux/**`
- `cdn.simpleicons.org/github/**`
- `picsum.photos` (for demos)

### Path Aliases

TypeScript paths configured in `tsconfig.json`:
- `@/*` → Root directory (e.g., `@/app`, `@/components`, `@/lib`)

## Creating New UX Cases

**Before starting, read `specs/ground-spec-ux-cases.md`**

Checklist:
1. Create folder: `app/ux-cases/{slug}/`
2. Add metadata to `app/ux-cases/_data/cases.ts`
3. Create `page.tsx` with Suspense wrapper
4. Use `useDoDontView()` hook (REQUIRED for Do/Don't cases)
5. Add `DoDontToggle` component (no props needed)
6. Create case-specific folders only when needed:
   - `_components/` for case-specific components
   - `_hooks/` for case-specific hooks
   - `_stores/` for case-specific Zustand stores
   - `_actions/` for case-specific server actions (mutations only)
   - `_tests/` for case-specific tests
   - `api/` for API route handlers (no underscore)
   - `_assets/` for local assets
7. Follow spacing standards: `p-8`, `mb-8`, `max-w-4xl`
8. Use `cn()` from `@/lib/utils` for className composition
9. Add ARIA labels for accessibility
10. Test URL param handling and browser back/forward navigation
11. Remember: If a local thing is used >2 times across cases, promote it to shared level

## Code Style

- **TypeScript**: Strict mode enabled
- **Components**: Use `cn()` helper for className merging
- **Naming**: Kebab-case for slugs, PascalCase for components
- **Imports**: Use path aliases (`@/...`) for cleaner imports
- **Client Components**: Mark with `'use client'` when needed
- **API Routes**: Use standard Web API Response/Request objects

## Testing

Test directories exist but are currently empty:
- `tests/components/` - For component unit tests
- `tests/e2e/` - For Playwright E2E tests

When adding tests, follow ground spec requirements:
- Unit tests for view param handling
- E2E tests for toggle functionality
- E2E tests for browser navigation

## Important Notes

- **Turbopack**: All commands use `--turbopack` flag
- **Strict Patterns**: The UX case pattern is standardized - do not deviate without updating the ground spec
- **No Direct Search Params Access**: Always use `useDoDontView()` hook instead of accessing searchParams directly
- **Data Fetching vs Mutations**: API route handlers for fetching, server actions for mutations only
- **Asset Locations**: Store assets in `_assets/` folder within each case or use remote URLs
- **Default View**: Always default to `'dont'` when no view param specified

## Development Workflow

When implementing new features, follow this test-driven approach:

1. **Clarify the specification**
   - Review relevant specs in `specs/` directory
   - Understand requirements and edge cases
   - Identify integration points with existing code

2. **Write detailed tests first**
   - Document all test cases before coding
   - Include unit tests, integration tests, and E2E tests as needed
   - Be as detailed and specific as possible

3. **Implement incrementally**
   - After writing all tests, begin implementation
   - Do NOT write all code at once
   - Follow this cycle: write code for a subset of tests → run those tests → verify → move to next subset

4. **Iterate in small batches**
   - Consider proper test batch size
   - Code to meet the current test batch
   - Run and verify tests pass
   - Repeat until all tests pass