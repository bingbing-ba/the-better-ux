# Implementation Plan: UX Cases Browser

**Branch**: `001-ux-cases-browser` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-ux-cases-browser/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a UX Cases Browser where users browse a landing list of cases (newest first), open a case detail page, and toggle between "Do" and "Don't" examples. No sidebar in MVP; navigation is between landing (`/`) and case pages (`/ux-cases/{slug}`). The toggle defaults to "Don't" and shared links can open a specific view. Use Next.js App Router with TypeScript and Shadcn UI.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 15.5.4  
**Primary Dependencies**: Next.js, React 19, Shadcn UI, Tailwind CSS, TanStack Query, Zustand  
**Storage**: No centralized model in MVP; each case is its own page. Landing uses a small static list of metadata for links/highlights.  
**Testing**: Jest, React Testing Library, Playwright for E2E  
**Target Platform**: Web browsers (desktop and mobile responsive)  
**Project Type**: Single web application  
**Performance Goals**: Case loading < 2 seconds, toggle response < 1 second, Core Web Vitals compliance  
**Constraints**: < 200 lines per file, Shadcn UI components only, English content only  
**Scale/Scope**: Launch with 1 case; scale later

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **Code Quality & Developer Experience**: TypeScript with strict typing, self-documenting code, < 200 lines per file  
✅ **Design & UX Guidelines**: Shadcn UI components only, accessible and consistent design  
✅ **Performance & SEO**: Core Web Vitals compliance, Next.js Image optimization, code splitting  
✅ **Content Language**: All content in English  
✅ **Testing & Quality**: Jest + React Testing Library + Playwright, 80% coverage requirement  
✅ **Project Structure**: Next.js App Router with underscore prefixes, feature-based organization  
✅ **State Management**: TanStack Query for server state, Zustand for global state  

**Status**: PASS - All constitution requirements met

## Project Structure

### Documentation (this feature)

```
specs/001-ux-cases-browser/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```
app/
├── page.tsx                    # Landing page: highlights + newest-first list
├── layout.tsx                  # Root layout
├── globals.css                 # Global styles
└── ux-cases/                   # Feature: UX Cases Browser
    ├── _components/            # Shared components for this feature (toggle, etc.)
    └── [slug]/                 # Individual case pages
        └── page.tsx

lib/                            # Shared utilities (create as needed)
├── utils.ts
└── cn.ts

tests/                          # Tests (create as needed)
├── components/
└── e2e/
```

**Structure Decision**: Next.js App Router with feature-based organization. Use underscore folders for non-routable dirs. Apply escalation-by-reuse. URLs: `/` (landing list), `/ux-cases` (optional alias list), `/ux-cases/{slug}` (details).

## Next Steps

1) Implement landing list with newest-first order, Trending/New highlights (manual + last 30 days).
2) Implement one case page under `/ux-cases/{slug}`.
3) Implement shared Do/Don't toggle with default to Don't and URL view support.
4) Add "Back to Home" action to case page.

## Complexity Tracking

*No constitution violations detected - all requirements met*
