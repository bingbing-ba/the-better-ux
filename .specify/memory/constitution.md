<!--
Sync Impact Report:
Version change: 0.0.0 → 1.0.0
Modified principles: N/A
Added sections: N/A
Removed sections: N/A
Templates requiring updates: ⚠ pending - plan-template.md, spec-template.md, tasks-template.md
Follow-up TODOs: None
-->

# The Better UX Constitution

## Core Principles

### I. Code Quality & Developer Experience
All code MUST be written for developer readability and maintainability. Code MUST be self-documenting with clear variable names, function names, and minimal complexity. Complex logic MUST be broken into smaller, testable functions. Comments MUST explain the "why" not the "what". Code reviews MUST focus on readability and maintainability as primary concerns.

### II. Design & UX Guidelines (Shadcn UI)
All UI components MUST follow Shadcn UI design system principles. Components MUST be accessible, consistent, and reusable. Design decisions MUST prioritize user experience and component composition over custom styling. All interactive elements MUST have proper focus states, keyboard navigation, and screen reader support.

### III. Performance & SEO Optimization
All pages MUST achieve Core Web Vitals thresholds (LCP < 2.5s, FID < 100ms, CLS < 0.1). Images MUST be optimized using Next.js Image component with proper sizing and lazy loading. Code splitting MUST be implemented for route-based and component-based optimization. SEO metadata MUST be properly configured for all pages with structured data where applicable.

### IV. Content Language Standard
All content, documentation, comments, and user-facing text MUST be written in English. Code comments, commit messages, and documentation MUST use clear, professional English. Variable names and function names MUST use English words or commonly accepted technical terms.

### V. Testing & Quality Assurance
All features MUST have corresponding tests. Unit tests MUST cover business logic and utility functions. Integration tests MUST cover component interactions and API endpoints. E2E tests MUST cover critical user journeys. Test coverage MUST be maintained above 80% for new code.

### VI. Project Structure Standards
All code MUST follow the established structure for Next.js App Router with TypeScript and Server Actions. Create folders as needed to minimize clutter and lift code only when reuse is proven.

- New features: Create fixed route segments under `app/` (e.g., `app/ux-cases`, `app/[new-feature]`). Do not use a `features/` wrapper in URLs.
- Scope-based placement (escalation-by-reuse):
  - Page-level: When only a single page uses code, place local non-routable folders inside that page directory, e.g. `app/ux-cases/[case]/_components/`, `app/ux-cases/[case]/_hooks/`.
  - Feature-level: When multiple pages within the same feature reuse code, create shared non-routable folders at the feature root, e.g. `app/ux-cases/_components/`, `app/ux-cases/_hooks/`, `app/ux-cases/_stores/`, `app/ux-cases/_actions/`, `app/ux-cases/_consts/`.
  - Root-level: When multiple features reuse code, create global folders at repo root: `hooks/`, `stores/`, `actions/`, `const/` (same level as `app/`).
- Naming and routing:
  - Underscore-prefixed folders (e.g., `_components`, `_hooks`) are REQUIRED for non-routable directories in App Router.
  - The `ux-cases` route segment is FIXED as the feature container; individual cases live at `app/ux-cases/{slug}/page.tsx` as static folders (no dynamic `[slug]` for MVP).
- Proximity rule: Keep items closest to where they are used; elevate to feature-level or root-level only when reuse across pages or features is demonstrated.

### VII. State Management Standards
Server state management MUST use TanStack Query (React Query) for all API data fetching, caching, and synchronization. Client-side global state management MUST use Zustand for application-wide state. Local component state MUST use React's built-in useState and useReducer hooks. State logic MUST be organized in appropriate folders following the project structure standards.

## Development Standards

### Code Organization
- Components MUST be organized in feature-based directories with underscore prefix
- Shared utilities MUST be placed in `/lib` directory
- Styling MUST use Tailwind CSS with Shadcn UI components
- TypeScript MUST be used for all new code with strict type checking
- Code files SHOULD be kept under 200 lines for better readability and maintainability
- Large files SHOULD be split into smaller components or utilities, even if used only once, to improve code comprehension
 - Class composition MUST use a helper (e.g., `cn()`) to merge base and override styles; components SHOULD accept a `className` prop; avoid template literal concatenation for `className`.

### Performance Requirements
- Bundle size MUST be monitored and optimized
- Lazy loading MUST be implemented for non-critical components
- API responses MUST be cached appropriately
- Database queries MUST be optimized and indexed

## Governance

This constitution supersedes all other development practices. All pull requests and code reviews MUST verify compliance with these principles. Any amendments to this constitution require:
1. Documentation of the proposed change
2. Approval from project maintainers
3. Migration plan for existing code
4. Version increment following semantic versioning

**Version**: 1.2.0 | **Ratified**: 2025-10-14 | **Last Amended**: 2025-10-19