# Implementation Plan: UX Cases Browser

**Branch**: `001-ux-cases-browser` | **Date**: 2025-10-19 | **Spec**: specs/001-ux-cases-browser/spec.md
**Input**: Feature specification from `/specs/001-ux-cases-browser/spec.md`

**Note**: Generated via /speckit.plan based on the current spec and constitution.

## Summary

Build a UX Cases Browser with a landing list (newest-first) and static case pages under `/ux-cases/{slug}`. Each case can show "Do" and "Don't" views with a shared toggle that defaults to "Don't" and can be linked via `?view=do|dont`. The first case (Image Loading with Blurhash) demonstrates gray placeholder vs. blurhash preview without layout shift.

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 15.5.x (App Router)  
**Primary Dependencies**: React 19, Shadcn UI, Tailwind CSS, TanStack Query (providers only), react-blurhash, blurhash  
**Storage**: No backend; static case pages. Landing uses a small local metadata list.  
**Testing**: Jest, React Testing Library, Playwright  
**Target Platform**: Web (desktop and mobile)  
**Project Type**: Web app (Next.js, App Router)  
**Performance Goals**: Case open ≤2s; toggle swap ≤1s; no layout shift on images  
**Constraints**: Code clarity, accessibility, Shadcn style, <200 LOC per file guideline  
**Scale/Scope**: MVP with 1 static case; more cases added by creating new folders under `/ux-cases/{slug}`

## Constitution Check

Gates (PASS):
- Code Quality & DX: TypeScript, readable code, <200 LOC guideline
- Design & UX (Shadcn): Accessible components; style composition via `cn()` helper
- Performance & SEO: No layout shift during image loading; Core Web Vitals considered
- Content Language: English only
- Testing & QA: Unit + E2E planned
- Project Structure Standards: Static routes under `app/ux-cases/{slug}` (no dynamic `[slug]` for MVP)
- State Management Standards: Local state; TanStack Query provider present

## Project Structure

### Documentation (this feature)

```
specs/001-ux-cases-browser/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── README.md
└── tasks.md
```

### Source Code (repository root)

```
app/
├── layout.tsx
├── page.tsx                     # Landing: highlights + newest-first list
└── ux-cases/
    ├── _components/
    │   └── DoDontToggle.tsx    # Shared toggle, cn() for className
    ├── _data/
    │   └── cases.ts            # Minimal list used by landing only
    └── image-loading-blurhash/
        └── page.tsx            # First case (static route)

components/ui/                   # Shadcn components (button, card, toggle)
lib/
└── utils.ts                     # cn() helper available

tests/
├── components/
└── e2e/
```

**Structure Decision**: Next.js App Router with static case folders per constitution. Landing list uses local data; each case is a dedicated page. No sidebar in MVP.

## Complexity Tracking

N/A – No constitution violations.
