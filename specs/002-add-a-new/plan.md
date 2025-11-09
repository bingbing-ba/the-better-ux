# Implementation Plan: How to use splash screen

**Branch**: `002-add-a-new` | **Date**: 2025-01-27 | **Spec**: specs/002-add-a-new/spec.md
**Input**: Feature specification from `/specs/002-add-a-new/spec.md`

**Note**: Generated via /speckit.plan based on the current spec and constitution.

## Summary

This feature adds a new UX case demonstrating effective use of a splash screen to preload data and assets. The case contrasts two modes:
- Don't: page renders after data is fetched; images start loading after the splash video ends (visible delay with image skeletons).
- Do: page may render concurrently with splash (behind it); data is fetched immediately and images are preloaded during splash so they are ready when the video ends (instant display).

During the splash, both Do and Don't start a server action to fetch the article list. The server action intentionally delays 1,500 ms before returning. The Do side also preloads thumbnails during the splash so images are ready by the time the video ends. The splash presents a black-background video (only the video is shown) and its duration gates dismissal. After the video ends, users see a list of articles (thumbnail, title, author, excerpt). **Key requirement: The splash screen MUST appear every time the user toggles between Do and Don't views** and a real server action MUST be called on each toggle.

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 15.5.4 (App Router), React 19.1.0  
**Primary Dependencies**: Shadcn UI (radix, lucide), TailwindCSS 4, TanStack Query 5.90, Zustand 5.0, react-blurhash (where relevant)  
**Storage**: N/A (demo data fetched at runtime; no persistence required)  
**Testing**: Playwright 1.56 (E2E), Jest 30 + React Testing Library 16 (unit/integration)  
**Target Platform**: Web (Next.js App Router)  
**Project Type**: Web application (single repo)  
**Performance Goals**: Align with Success Criteria (e.g., Do-side thumbnails visible immediately after video ends; Don't-side images start at video end and show skeletons until loaded)  
**Constraints**: Constitution Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1); accessibility for all interactive components; splash must appear on every Do/Don't toggle; splash duration equals video duration  
**Scale/Scope**: One new case under `app/ux-cases/how-to-use-splash-screen/`; must handle rapid toggling (10+ times) without errors

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Gates (PASS):
- Code Quality & DX: TypeScript, readable code, <200 LOC guideline
- Design & UX (Shadcn): Accessible components; style composition via `cn()` helper
- Performance & SEO: No layout shift during image loading; Core Web Vitals considered
- Content Language: English only
- Testing & QA: Unit + E2E planned
- Project Structure Standards: Static routes under `app/ux-cases/{slug}` (no dynamic `[slug]` for MVP)
- State Management Standards: Local state; TanStack Query provider present; `useDoDontView` hook for view management

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
app/
└── ux-cases/
    ├── _components/
    │   └── DoDontToggle.tsx            # existing shared component
    ├── _hooks/
    │   └── useDoDontView.ts            # existing shared hook
    └── how-to-use-splash-screen/
        ├── page.tsx                    # case entry (wraps content in Suspense)
        └── _components/
            ├── SplashVideo.tsx         # black-bg video splash
            ├── ArticleList.tsx         # list layout + empty/loading states
            ├── ArticleCard.tsx         # thumbnail, title, author, excerpt
            ├── articleService.ts         # fetch articles (mock data)
            └── preloadHelper.ts        # preload thumbnails helper

tests/
├── components/
│   └── (unit tests for components)
└── e2e/
    └── (Playwright tests for splash behavior)
```

**Structure Decision**: Web application with App Router. Feature-local components live under the case folder (`app/ux-cases/how-to-use-splash-screen/_components/`). Shared components (`DoDontToggle`) and hooks (`useDoDontView`) reused from `app/ux-cases/_components/` and `app/ux-cases/_hooks/` per proximity rules. Follows ground spec pattern for UX cases. Use TanStack Query for client data fetching over server action endpoints.

## Complexity Tracking

N/A – No constitution violations.

## Key Implementation Notes

- Use `app/ux-cases/how-to-use-splash-screen/` with `_components/` for local components.
- Reuse `DoDontToggle` from `app/ux-cases/_components/DoDontToggle.tsx`.
- Reuse `useDoDontView` hook from `app/ux-cases/_hooks/useDoDontView.ts`.
- Always call a server action to fetch articles on initial load and on every toggle; the server action intentionally delays 1,500 ms before responding.
- Start the request for both Do and Don't immediately; use TanStack Query to manage loading states and cache-busting where needed.
- For Do: preload thumbnails during splash; ensure images are ready when the video ends.
- For Don't: begin image loading only after the splash video ends; show image skeletons until ready.
- Gate splash strictly on video end (no min/max timers).
- **CRITICAL**: Splash screen MUST appear every time user toggles between Do and Don't views (FR-005a, FR-005b).
- **CRITICAL**: On toggle, re-fetch data (FR-013 updated to always re-fetch).
- **CRITICAL**: Handle toggling during active splash gracefully - dismiss current splash immediately and start new splash for new view (FR-014).
- No skip control (FR-009).
- Follow ground spec pattern: wrap page in Suspense, use `useDoDontView` hook, read view from hook.
