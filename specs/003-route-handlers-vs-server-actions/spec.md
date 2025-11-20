# Route Handlers vs Server Actions for Data Fetching - Specification

## Overview

This UX case demonstrates the **correct and incorrect patterns** for data fetching in Next.js applications using React Query. It educates developers on why API route handlers should be used for data fetching, while server actions should be reserved exclusively for mutations.

### Educational Goals

1. **Demonstrate the anti-pattern**: Using server actions for data fetching
2. **Show the correct pattern**: Using API route handlers with proper HTTP caching
3. **Visualize the differences**: Timing and performance implications through side-by-side comparison
4. **Align with Next.js best practices**: Proper separation of concerns

## Requirements

### Case Metadata

- **Title**: "Route Handlers vs Server Actions for Data Fetching"
- **Slug**: `route-handlers-vs-server-actions`
- **URL**: `/ux-cases/route-handlers-vs-server-actions?view=do|dont`
- **Default View**: `'dont'` (when no `view` param is present, handled by `useDoDontView()` hook)
- **Created**: 2025-11-15
- **Tags**: `['data-fetching', 'api', 'performance', 'react-query']`
- **Trending**: false

### Functional Requirements

#### FR1: Dashboard Data Fetching
- **3 independent API calls** for analytics dashboard:
  1. **Stats Endpoint**: Views count, conversion rate
  2. **Revenue Endpoint**: Total revenue, growth percentage
  3. **Users Endpoint**: Active users count, new users today
- Each API call must simulate **1-second delay** to make timing differences visible
- Both Do and Don't examples fetch **identical data**

#### FR2: React Query Integration
- Both examples MUST use **TanStack Query (React Query)**
- **3 separate `useQuery` hooks** - one dedicated hook for each API call (stats, revenue, users)
- Each query runs independently and can complete at different times
- Query configuration:
  - Do Example: Allow caching based on route handler revalidation
  - Don't Example: No special config (demonstrates lack of HTTP caching)

#### FR3: Timing Display
Track and display timing information **inline with each metric card**:
- **Requested At**: Timestamp when component mounts and query starts
- **Responded At**: Timestamp when data becomes available
- **Duration**: Calculated difference (should be ~1 second per call)
- Format: Human-readable timestamps (e.g., "14:23:45.123")

### Technical Specifications

#### API Route Handlers (Do Example)

**Endpoint 1: Stats**
```
GET /app/ux-cases/route-handlers-vs-server-actions/api/stats/route.ts

export const revalidate = 60; // Cache for 60 seconds

Response:
{
  views: number,
  conversions: number,
  conversionRate: string (percentage)
}

Delay: 1000ms
```

**Endpoint 2: Revenue**
```
GET /app/ux-cases/route-handlers-vs-server-actions/api/revenue/route.ts

export const revalidate = 60;

Response:
{
  total: number,
  growth: string (percentage),
  currency: string
}

Delay: 1000ms
```

**Endpoint 3: Users**
```
GET /app/ux-cases/route-handlers-vs-server-actions/api/users/route.ts

export const revalidate = 60;

Response:
{
  activeUsers: number,
  newToday: number,
  growthTrend: string
}

Delay: 1000ms
```

**Implementation Pattern**:
```typescript
export const revalidate = 60; // ISR - revalidate every 60 seconds

export async function GET() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const data = {
    // ... mock data
  };

  return Response.json(data);
}
```

#### Server Actions (Don't Example)

**File**: `_actions/getDashboardData.ts`

```typescript
'use server';

export async function getStats() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    views: 45234,
    conversions: 892,
    conversionRate: "1.97%"
  };
}

export async function getRevenue() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    total: 128450,
    growth: "+12.5%",
    currency: "USD"
  };
}

export async function getUsers() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    activeUsers: 1247,
    newToday: 89,
    growthTrend: "up"
  };
}
```

**Why This Is Wrong**:
- Server actions are designed for mutations (POST/PUT/DELETE)
- No HTTP caching layer
- Not RESTful
- Can't be called from non-React contexts
- Invisible to browser DevTools network tab

### Data Model

#### TypeScript Interfaces

```typescript
// _types/dashboard.ts

export interface StatsData {
  views: number;
  conversions: number;
  conversionRate: string;
}

export interface RevenueData {
  total: number;
  growth: string;
  currency: string;
}

export interface UsersData {
  activeUsers: number;
  newToday: number;
  growthTrend: 'up' | 'down' | 'stable';
}

export interface TimingInfo {
  requestedAt: string;   // ISO timestamp
  respondedAt?: string;  // ISO timestamp (undefined while loading)
  duration?: number;     // milliseconds
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  timing: TimingInfo;
  isLoading?: boolean;
}
```

### UI/UX Requirements

#### Layout Structure

Following ground spec requirements:

1. **Back to Home Link**
   ```tsx
   <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800">
     <ChevronLeft className="h-4 w-4" />
     Back to Home
   </Link>
   ```

2. **Header Section**
   ```tsx
   <h1 className="text-4xl font-bold mb-4">
     Route Handlers vs Server Actions for Data Fetching
   </h1>
   <div className="flex gap-2 mb-8">
     {tags.map(tag => <TagBadge key={tag} tag={tag} />)}
   </div>
   ```

3. **DoDontToggle Component**
   ```tsx
   <DoDontToggle /> {/* No props needed, uses useDoDontView hook */}
   ```

4. **Content Section**
   ```tsx
   {view === 'dont' ? <DontExample /> : <DoExample />}
   ```

#### Component Breakdown

**1. MetricCard Component**
```tsx
interface MetricCardProps {
  title: string;
  icon: React.ReactNode;
  value: string | number;
  subtitle?: string;
  timing: TimingInfo;
  isLoading?: boolean;
}
```

Features:
- Card with title, icon, and primary value
- Subtitle for secondary info (e.g., "+12.5% from last month")
- Inline timing display (requested/responded/duration)
- Loading skeleton state

**2. TimingBadge Component**
```tsx
interface TimingBadgeProps {
  timing: TimingInfo;
  variant?: 'inline' | 'detailed';
}
```

Features:
- Compact display of timing info
- Color coding (gray while loading, green when loaded)
- Tooltip with detailed timestamps

**4. DashboardSkeleton Component**
```tsx
function DashboardSkeleton() {
  return (
    // 3 skeleton cards with pulsing animation
  );
}
```

#### Styling Standards

- **Container**: `min-h-screen p-8 font-sans`
- **Max Width**: `max-w-6xl mx-auto` (wider than standard `max-w-4xl` to accommodate 3-column dashboard grid)
- **Grid Layout**: `grid grid-cols-1 md:grid-cols-3 gap-6` (3 metric cards)
- **Card Spacing**: `p-6 border rounded-lg`
- **Section Margins**: `mb-8`
- **Colors**:
  - Do Example: Blue/green accents
  - Don't Example: Red/orange accents
  - Loading: Gray pulse animation

#### Accessibility Requirements

- All metric cards have `role="article"` and `aria-label`
- Loading states announced with `aria-live="polite"`
- Timing info has `aria-label` for screen readers
- Keyboard navigation supported for toggle

### Implementation Pattern

#### Page Structure

```tsx
'use client';

import { Suspense } from 'react';
import { useDoDontView } from '@/app/ux-cases/_hooks/useDoDontView';
import { DoDontToggle } from '@/app/ux-cases/_components/DoDontToggle';

export default function RouteHandlersVsServerActionsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}

function PageContent() {
  const { view } = useDoDontView();

  return (
    <div className="min-h-screen p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Back to Home */}
        {/* Header */}
        <DoDontToggle />
        {view === 'dont' ? <DontExample /> : <DoExample />}
      </div>
    </div>
  );
}
```

#### DoExample Implementation

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

export function DoExample() {
  const [statsRequested, setStatsRequested] = useState<string>('');
  const [revenueRequested, setRevenueRequested] = useState<string>('');
  const [usersRequested, setUsersRequested] = useState<string>('');

  // Track when component mounts
  useEffect(() => {
    const now = new Date().toISOString();
    setStatsRequested(now);
    setRevenueRequested(now);
    setUsersRequested(now);
  }, []);

  const statsQuery = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const res = await fetch('/ux-cases/route-handlers-vs-server-actions/api/stats');
      return res.json();
    },
  });

  // Similar for revenue and users queries...

  // Track when data arrives
  const [statsResponded, setStatsResponded] = useState<string>('');
  useEffect(() => {
    if (statsQuery.data && !statsResponded) {
      setStatsResponded(new Date().toISOString());
    }
  }, [statsQuery.data]);

  // Calculate duration
  const statsDuration = statsRequested && statsResponded
    ? new Date(statsResponded).getTime() - new Date(statsRequested).getTime()
    : undefined;

  return (
    <div>
      <h2>✅ Do: Use Route Handlers for Data Fetching</h2>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Stats"
          value={statsQuery.data?.views}
          timing={{
            requestedAt: statsRequested,
            respondedAt: statsResponded,
            duration: statsDuration,
          }}
          isLoading={statsQuery.isLoading}
        />
        {/* Revenue and Users cards... */}
      </div>

      {/* Explanation */}
      <div className="mt-8 p-6 bg-green-50 rounded-lg">
        <h3>Why This Works</h3>
        <ul>
          <li>✅ Route handlers are designed for data fetching</li>
          <li>✅ HTTP caching with revalidate (60s)</li>
          <li>✅ Visible in browser DevTools</li>
          <li>✅ Can be called from anywhere (not just React)</li>
          <li>✅ RESTful and follows web standards</li>
        </ul>
      </div>
    </div>
  );
}
```

#### DontExample Implementation

Similar structure but:
- Uses `queryFn: () => getStats()` (server action)
- Red/orange warning theme
- Explanation of why this is an anti-pattern

### Success Criteria

#### Educational Effectiveness
- [ ] Clearly shows the difference between route handlers and server actions
- [ ] Timing visualization makes performance implications obvious
- [ ] Explanations are concise and actionable

#### Technical Correctness
- [ ] Both examples fetch identical data
- [ ] 1-second delay is consistent across all 6 API calls (3 per example)
- [ ] React Query integration works correctly
- [ ] Timing tracking is accurate (±50ms tolerance)

#### UX Standards
- [ ] Follows ground spec pattern exactly
- [ ] Uses `useDoDontView()` hook (no direct searchParams)
- [ ] Page layout order is correct (back link → header → toggle → content)
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Loading states are smooth and accessible
- [ ] Toggle switches views without page reload

#### Code Quality
- [ ] TypeScript types for all data structures
- [ ] Proper error handling in queries
- [ ] Accessible markup (ARIA labels, semantic HTML)
- [ ] Follows project code style (cn() for classNames, path aliases)
- [ ] No console errors or warnings

### Testing Requirements

#### Manual Testing Checklist
1. Both examples show 3 metric cards with loading → data states
2. Timing displays show ~1 second per API call
3. Toggle switches between Do/Don't without losing state
4. Browser back/forward navigation works correctly
5. URL param (?view=do|dont) updates correctly
6. Mobile responsive layout works

#### Automated Testing (Future)
- Unit tests for timing calculation logic
- Integration tests for React Query setup
- E2E tests for toggle and navigation behavior
- Visual regression tests for metric cards

## Implementation Notes

### File Structure

```
specs/003-route-handlers-vs-server-actions/
└── spec.md (this file)

app/ux-cases/route-handlers-vs-server-actions/
├── page.tsx
├── _components/
│   ├── DoExample.tsx
│   ├── DontExample.tsx
│   ├── MetricCard.tsx
│   ├── TimingBadge.tsx
│   └── DashboardSkeleton.tsx
├── _actions/
│   └── getDashboardData.ts
├── _types/
│   └── dashboard.ts
└── api/
    ├── stats/
    │   └── route.ts
    ├── revenue/
    │   └── route.ts
    └── users/
        └── route.ts
```

### Dependencies

All required dependencies are already in package.json:
- `@tanstack/react-query` (v5.90.3)
- `react` (v19.1.0)
- `next` (v15.5.4)

No new dependencies needed.

### Development Workflow

1. Create spec folder and this file ✓
2. Review and approve spec
3. Add case metadata to `_data/cases.ts`
4. Create folder structure
5. Implement API route handlers (Do)
6. Implement server actions (Don't)
7. Build shared components
8. Build DoExample component
9. Build DontExample component
10. Build main page.tsx
11. Manual testing
12. Refinement and polish

## References

- Ground Spec: `specs/ground-spec-ux-cases.md`
- CLAUDE.md project instructions: Section on "Data Fetching Architecture"
- Next.js Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- React Query Docs: https://tanstack.com/query/latest/docs/framework/react/overview
