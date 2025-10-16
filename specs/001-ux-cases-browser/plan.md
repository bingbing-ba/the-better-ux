# Implementation Plan: UX Cases Browser

**Branch**: `001-ux-cases-browser` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-ux-cases-browser/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a UX Cases Browser application that allows users to browse educational UX examples through a sidebar navigation system. Users can view different UX cases and toggle between "Do" and "Don't" examples to learn best practices. The application will use Next.js App Router with TypeScript, Shadcn UI components, and follow the established project structure standards.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 15.5.4  
**Primary Dependencies**: Next.js, React 19, Shadcn UI, Tailwind CSS, TanStack Query, Zustand  
**Storage**: Static JSON files for UX case data (no database required)  
**Testing**: Jest, React Testing Library, Playwright for E2E  
**Target Platform**: Web browsers (desktop and mobile responsive)  
**Project Type**: Single web application  
**Performance Goals**: Case loading < 2 seconds, toggle response < 1 second, Core Web Vitals compliance  
**Constraints**: < 200 lines per file, Shadcn UI components only, English content only  
**Scale/Scope**: Educational website with 10-50 UX cases, single-page application

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
├── page.tsx                    # Homepage with UX cases browser
├── layout.tsx                  # Root layout
├── globals.css                 # Global styles
└── ux-cases/                   # Feature: UX Cases Browser (fixed route)
    ├── _components/            # Shared components for this feature (create as needed)
    └── [case]/                 # Individual cases (variable)
        └── page.tsx

lib/                            # Shared utilities (create as needed)
├── utils.ts
└── cn.ts

tests/                          # Tests (create as needed)
├── components/
└── e2e/
```

**Structure Decision**: Next.js App Router with feature-based organization. Use underscore folders for non-routable dirs. Apply escalation-by-reuse: page-level first; promote to feature-level; promote to root only when reused by multiple features. No `features/` wrapper in URLs.

## Phase 1 Complete

✅ **Research Phase**: All technical unknowns resolved in `research.md`  
✅ **Quickstart Guide**: Implementation guide created in `quickstart.md`  
✅ **Agent Context**: Cursor IDE context updated with new technologies  

## Next Steps

The implementation plan is complete and ready for:
- `/speckit.tasks` - Break down into actionable development tasks
- `/speckit.implement` - Begin implementation

## Complexity Tracking

*No constitution violations detected - all requirements met*
