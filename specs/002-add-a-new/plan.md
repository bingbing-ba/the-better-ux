# Implementation Plan: How to use splash screen

**Branch**: `002-add-a-new` | **Date**: 2025-10-23 | **Spec**: ../spec.md  
**Input**: Feature specification from `/specs/002-add-a-new/spec.md`

## Summary

This feature adds a new UX case demonstrating effective use of a splash screen to preload data and assets. The case contrasts two modes:
- Don't: images start loading after the splash ends (visible delay).
- Do: images are preloaded during the splash (instant display). 

During the splash, the app fetches the article list and preloads thumbnails for the Do side. The splash presents a black-background video that sets user expectation even before playback is ready. After the splash, users see a list of articles with thumbnail, title, author, and excerpt. Reloading should yield a varied article list to convey server-driven data. Long waits and failures use clear fallbacks (loading text+icon, skeletons, error placeholders/messages). Timing metrics are recorded for verification.

## Technical Context

**Language/Version**: TypeScript (^5), React 19.1, Next.js 15.5.4  
**Primary Dependencies**: Shadcn UI (radix, lucide), TailwindCSS (^4), TanStack Query (5.90), Zustand (5.0), Blurhash (where relevant)  
**Storage**: N/A (demo data fetched at runtime; no persistence required)  
**Testing**: Playwright 1.56 (E2E), Jest 30 + RTL 16 (unit/integration)  
**Target Platform**: Web (Next.js App Router)  
**Project Type**: Web application (single repo)  
**Performance Goals**: Align with Success Criteria (e.g., Do-side thumbnails ≤200 ms post-splash)  
**Constraints**: Constitution Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1); accessibility for all interactive components  
**Scale/Scope**: One new case under `app/ux-cases/`

Key implementation notes:
- Use `app/ux-cases/how-to-use-splash-screen/` with `_components/` for local components.
- Reuse `DoDontToggle` from `app/ux-cases/_components/DoDontToggle.tsx`.
- Fetch article data during splash; for Do-side, preload thumbnails. 
- Enforce min splash 1s, max 5s; proceed per FR-007 semantics.
- No skip control.

## Constitution Check

GATE items derived from The Better UX Constitution:
- UI components follow Shadcn UI and are accessible (focus, keyboard, SR).  
- App Router structure with underscore-prefixed non-routable folders is respected.  
- Performance: meet CWV targets; lazy-load non-critical; use Next Image appropriately.  
- Content and docs in English.  
- Tests: provide unit/integration for logic and Playwright E2E for primary flows.  
- Proximity rule for component placement.

Result: Pass (no violations anticipated). Re-check after Phase 1 design.

## Project Structure

### Documentation (this feature)
```
specs/002-add-a-new/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Created by /speckit.tasks
```

### Source Code (repository root)
```
app/
└── ux-cases/
    ├── _components/
    │   └── DoDontToggle.tsx            # existing
    └── how-to-use-splash-screen/
        ├── page.tsx                    # case entry
        └── _components/
            ├── SplashVideo.tsx         # black-bg video splash
            ├── ArticleList.tsx         # list layout + empty/loading states
            ├── ArticleCard.tsx         # thumbnail, title, author, excerpt
            └── metrics.ts              # simple client timing metrics collector
```

**Structure Decision**: Web application with App Router. Feature-local components live under the case folder. Shared toggles reused from `ux-cases/_components` per proximity rules.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |

## Constitution Check (post-design)

Re-evaluated after Phase 1:
- Structure respects App Router and underscore folders ✓
- Accessibility requirements acknowledged ✓
- Performance targets measurable via SC and metrics ✓
- Tests planned (unit/integration + Playwright E2E) ✓

Status: Pass.
