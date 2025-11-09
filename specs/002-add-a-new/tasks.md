# Tasks: How to use splash screen

Branch: `002-add-a-new`  
Docs: `specs/002-add-a-new/`

## Phase 1 — Setup

- [X] T001 [P] Create route directory `app/ux-cases/how-to-use-splash-screen/` with `page.tsx`
- [X] T002 [P] Add local folder `app/ux-cases/how-to-use-splash-screen/_components/`
- [X] T003 [P] Confirm reuse of `app/ux-cases/_components/DoDontToggle.tsx`
- [X] T004 [P] Add metrics helper `metrics.ts` (collect/perf timestamps)

## Phase 2 — Foundational

- [X] T005 Create `SplashVideo.tsx` (black-bg video; accessible; no skip control)
- [X] T006 Create `ArticleCard.tsx` (thumbnail, title, author, excerpt; skeleton + error placeholder states)
- [X] T007 Create `ArticleList.tsx` (renders list; integrates skeletons and error placeholders)
- [X] T008 Implement fetch service for articles (fresh per load; seed support)
- [X] T009 Implement preload helper for thumbnails (used by Do side)

## Phase 3 — US1 (P1) Experience the case with a splash screen

Goal: Show splash video, fetch data in splash, then transition to article list view with Do/Don't toggle.
Independent test: From first paint to post-splash view, smooth transition; reload varies article list.

- [X] T010 Wire splash controller (min 1s, max 5s; proceed when data ready; no skip)
- [X] T011 Integrate article fetch during splash
- [X] T012 Render article list on splash end (uses `ArticleList`, `ArticleCard`)
- [X] T013 Add reload variance (order/selection differs across reloads)
- [X] T014 Record timings via `metrics.ts` (splash start/end; dataLoadedAt)

## Phase 4 — US2 (P2) Demonstrate the "Don't" behavior

Goal: Thumbnails only start after splash; visible skeletons during load; error icons on failures.
Independent test: Time-to-first-thumbnail begins after splash; skeletons visible on slow net.

- [X] T015 Add Don't mode switch behavior in `page.tsx` (defer thumbnail loads until post-splash)
- [X] T016 Ensure skeletons show while thumbnails load
- [X] T017 Ensure error icon placeholder appears on failed thumbnails
- [X] T018 Record `imagesVisibleAt_Dont` timing

## Phase 5 — US3 (P3) Demonstrate the "Do" behavior

Goal: Preload thumbnails during splash; immediate visibility after splash.
Independent test: Thumbnails visible ≤200 ms after splash; requests during splash.

- [X] T019 Add Do mode switch behavior in `page.tsx` (preload thumbnails during splash)
- [X] T020 Ensure thumbnails are ready on splash end
- [X] T021 Record `imagesVisibleAt_Do` timing

## Phase 6 — Polish & Cross-Cutting

- [X] T022 Accessibility pass (focus management, aria-live for loading messages, keyboard nav)
- [X] T023 Performance pass (Next Image usage, lazy/non-critical code split, CLS checks)
- [X] T024 Content pass (English copy: loading text, error messages)
- [X] T025 Add example seeds for deterministic demos during tests

## Dependencies
- Phase order: Setup → Foundational → US1 → US2 → US3 → Polish
- US1 depends on Setup + Foundational
- US2 and US3 depend on US1 (UI baseline) and Foundational (helpers)

## Parallel execution examples
- Setup: T001–T004 can run in parallel
- Foundational: T006–T009 can run in parallel after T005 scaffold
- US2: T016–T017 parallel after T015
- US3: T020–T021 parallel after T019

## Implementation strategy
- MVP: Complete US1
- Then add US2 (contrast), finally US3 (ideal pattern), followed by polish
