# Quickstart Guide: UX Cases Browser

**Feature**: UX Cases Browser  
**Date**: 2025-01-27  
**Purpose**: Get started with building interactive UX case examples

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Next.js 15.5.4+ project setup
- TypeScript 5.x
- Tailwind CSS configured
- Shadcn UI components installed

## Installation

### 1. Install Dependencies
```bash
npm install @tanstack/react-query zustand
npm install -D @testing-library/react @testing-library/jest-dom jest playwright
```

### 2. Setup Shadcn UI
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card sidebar toggle
```

### 3. Configure TanStack Query
```typescript
// app/providers.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

## Project Structure Setup

### 1. Create Folders (as needed)
```bash
# Minimal to start; add more only when reused
mkdir -p app/ux-cases/_components
mkdir -p tests/components tests/e2e
```

### 2. (Optional later) Feature-level shared folders
Create only when multiple pages under the feature reuse code:
```
app/ux-cases/_hooks
app/ux-cases/_stores
app/ux-cases/_consts
```

### 3. Test Folders
Already created minimally above; expand as needed.

## Implementation Steps

### 1. Static case routes (no dynamic `[slug]`)
Create a case folder per slug:

```
app/ux-cases/image-loading-blurhash/page.tsx
```

### 3. Individual Case Pages
Create Next.js pages for each case:

```typescript
// app/ux-cases/image-loading-blurhash/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function ImageLoadingBlurhashPage() {
  const [variant, setVariant] = useState<'do' | 'dont'>('do');
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        The Image loading UX - Blurhash, that uses from Slack or Discord
      </h1>
      
      <div className="mb-6">
        <Button 
          variant={variant === 'do' ? 'default' : 'outline'}
          onClick={() => setVariant('do')}
        >
          Good Example
        </Button>
        <Button 
          variant={variant === 'dont' ? 'default' : 'outline'}
          onClick={() => setVariant('dont')}
          className="ml-2"
        >
          Bad Example
        </Button>
      </div>
      
      <div className="border rounded-lg p-6">
        {variant === 'do' ? (
          <div>
            <h3 className="text-lg font-semibold mb-4">Good: Blurhash Loading</h3>
            {/* Your interactive blurhash example here */}
            <p>This shows a proper blurhash implementation...</p>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold mb-4">Bad: No Loading State</h3>
            {/* Your bad example here */}
            <p>This shows what happens without proper loading states...</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

### 4. Class composition with `cn()`
Prefer the helper to merge classes and allow overrides:

```typescript
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-lg border p-6', className)} {...props} />;
}
```

### 5. Home Page
Create a simple home page:

```typescript
// app/page.tsx
import Link from 'next/link';
// inline or import from a local module later when shared
const sidebarItems = [
  { id: 'image-loading-blurhash', title: 'The Image loading UX - Blurhash, that uses from Slack or Discord', href: '/ux-cases/image-loading-blurhash' },
  { id: 'form-validation', title: 'The Form validation UX - Real-time feedback like Stripe', href: '/ux-cases/form-validation' },
  { id: 'button-states', title: 'The Button states UX - Loading, disabled, and hover effects', href: '/ux-cases/button-states' },
];

export default function HomePage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">UX Cases Browser</h1>
      <p className="text-gray-600 mb-8">
        Learn UX best practices through interactive examples
      </p>
      
      <div className="grid gap-4">
        {sidebarItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="text-lg font-semibold">{item.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

## Testing Setup

### 1. Unit Tests
```typescript
// tests/components/Sidebar.test.tsx
import { render, screen } from '@testing-library/react';
import { Sidebar } from '@/app/ux-cases/_components/Sidebar';

describe('Sidebar', () => {
  it('renders list of UX cases', () => {
    render(<Sidebar />);
    expect(screen.getByText('UX Cases')).toBeInTheDocument();
    expect(screen.getByText('The Image loading UX - Blurhash, that uses from Slack or Discord')).toBeInTheDocument();
  });
});
```

### 2. E2E Tests
```typescript
// tests/e2e/case-navigation.spec.ts
import { test, expect } from '@playwright/test';

test('user can navigate to a UX case', async ({ page }) => {
  await page.goto('/');
  await page.click('text=The Image loading UX - Blurhash');
  await expect(page).toHaveURL('/ux-cases/image-loading-blurhash');
  await expect(page.locator('h1')).toContainText('The Image loading UX - Blurhash');
});
```

## Development Workflow

### 1. Start Development Server
```bash
npm run dev
```

### 2. Run Tests
```bash
npm run test
npm run test:e2e
```

### 3. Build for Production
```bash
npm run build
```

## Key Features Implementation

### 1. Sidebar Navigation
- Display list of UX cases with titles
- Use Next.js Link for navigation
- Simple hover effects

### 2. Individual Case Pages
- Each case is a Next.js page
- Do/Dont toggle within each page
- Interactive examples embedded in pages

### 3. Do/Dont Toggle
- Switch between good and bad examples
- State managed within each page
- Visual feedback with buttons

### 4. Simple Structure
- No complex state management
- No API calls needed
- Just Next.js pages and components

## Performance Optimization

### 1. Code Splitting
```typescript
const CaseViewer = lazy(() => import('./CaseViewer'));
```

### 2. Image Optimization
```typescript
import Image from 'next/image';

<Image
  src={case.doExample.imageUrl}
  alt={case.doExample.imageAlt}
  width={800}
  height={600}
  priority
/>
```

### 3. Caching
```typescript
const { data } = useQuery({
  queryKey: ['cases'],
  queryFn: fetchCases,
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

## Troubleshooting

### Common Issues
1. **Shadcn UI not working**: Check Tailwind CSS configuration
2. **TypeScript errors**: Ensure proper type definitions
3. **State not updating**: Check Zustand store setup
4. **Tests failing**: Verify test environment configuration

### Debug Tips
- Use React DevTools for state inspection
- Check browser console for errors
- Verify network requests in DevTools
- Test accessibility with screen readers

## Next Steps

1. Implement core components
2. Add state management
3. Create test suite
4. Optimize performance
5. Deploy to production

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Shadcn UI Components](https://ui.shadcn.com/)
- [TanStack Query Guide](https://tanstack.com/query/latest)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Testing Library Guide](https://testing-library.com/docs/)
