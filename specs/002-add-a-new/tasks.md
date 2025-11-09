# Tasks: How to use splash screen

**Input**: Design documents from `/specs/002-add-a-new/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, quickstart.md, data-model.md

**Tests**: Tests are included as they are required by the constitution (80% coverage requirement).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions
- **Next.js App Router**: `app/`, `lib/`, `tests/` at repository root
- Feature folders with underscore prefix: `app/ux-cases/how-to-use-splash-screen/_components/`
- Shared components: `app/ux-cases/_components/`
- Shared hooks: `app/ux-cases/_hooks/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 [P] Create case folder structure: `app/ux-cases/how-to-use-splash-screen/` and `app/ux-cases/how-to-use-splash-screen/_components/` ✅
- [x] T002 [P] Verify shared components exist: `app/ux-cases/_components/DoDontToggle.tsx` and `app/ux-cases/_hooks/useDoDontView.ts` ✅
- [x] T003 [P] Add case metadata to `app/ux-cases/_data/cases.ts` with slug `'how-to-use-splash-screen'` ✅

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create base case page structure: `app/ux-cases/how-to-use-splash-screen/page.tsx` wrapped in Suspense ✅
- [x] T005 [P] Create Article type interface in `app/ux-cases/how-to-use-splash-screen/_components/ArticleCard.tsx` ✅
- [x] T006 [P] Create article service: `app/ux-cases/how-to-use-splash-screen/_components/articleService.ts` with `fetchArticles()` function ✅
- [x] T007 [P] Create preload helper: `app/ux-cases/how-to-use-splash-screen/_components/preloadHelper.ts` with `preloadThumbnails()` function ✅

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Experience the case with a splash screen (Priority: P1) 🎯 MVP

**Goal**: Users see a splash screen immediately on entering the case, and after splash ends, they see the demo view with Do/Don't toggle and article list

**Independent Test**: Open the case URL, measure time from first paint to demo view rendered after splash. Verify splash appears on initial load and transitions cleanly to the demo.

### Tests for User Story 1

**NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T008 [P] [US1] Unit test for splash screen visibility and transition in `tests/components/SplashVideo.test.tsx`
- [ ] T009 [P] [US1] E2E test: splash appears on page load and transitions to demo view in `tests/e2e/splash-screen.spec.ts`

### Implementation for User Story 1

- [x] T010 [US1] Create SplashVideo component in `app/ux-cases/how-to-use-splash-screen/_components/SplashVideo.tsx` with black background and video element ✅
- [x] T011 [US1] Implement splash state management in `app/ux-cases/how-to-use-splash-screen/page.tsx` (showSplash state, initial true) ✅
- [x] T012 (superseded) [US1] Implement splash dismissal logic in `app/ux-cases/how-to-use-splash-screen/page.tsx` (min 1s, max 5s, based on data ready) ✅
- [x] T012b [US1] Gate splash dismissal strictly by video end in `app/ux-cases/how-to-use-splash-screen/_components/SplashVideo.tsx` (no min/max timers) ✅
- [x] T013 [US1] Create ArticleCard component in `app/ux-cases/how-to-use-splash-screen/_components/ArticleCard.tsx` with thumbnail, title, author, excerpt ✅
- [x] T014 [US1] Create ArticleList component in `app/ux-cases/how-to-use-splash-screen/_components/ArticleList.tsx` to render list of articles ✅
- [x] T015 [US1] Integrate DoDontToggle component in `app/ux-cases/how-to-use-splash-screen/page.tsx` using `useDoDontView` hook ✅
- [x] T016 [US1] Implement article data fetching during splash in `app/ux-cases/how-to-use-splash-screen/page.tsx` (call `fetchArticles()` in useEffect) ✅
- [x] T017 [US1] Implement transition from splash to demo view in `app/ux-cases/how-to-use-splash-screen/page.tsx` (conditional render based on showSplash) ✅
- [x] T018 [US1] Ensure article list varies on page reload (articleService already implements randomization) ✅

**Checkpoint**: At this point, User Story 1 should be fully functional - splash appears on load and transitions to demo view

---

## Phase 4: User Story 2 - Demonstrate the "Don't" behavior (Priority: P2)

**Goal**: When splash ends on Don't side, images only start loading then, leading to visible delays or placeholders

**Independent Test**: Select the Don't view and measure time-to-first-image after splash dismissal; confirm network image loading starts after splash ends.

### Tests for User Story 2

- [ ] T019 [P] [US2] Unit test for Don't behavior: images start loading after splash in `tests/components/ArticleCard.test.tsx`
- [ ] T020 [P] [US2] E2E test: Don't view shows skeleton placeholders after splash in `tests/e2e/dont-behavior.spec.ts`

### Implementation for User Story 2

- [x] T021 [US2] Implement deferImageLoad prop in `app/ux-cases/how-to-use-splash-screen/_components/ArticleList.tsx` to control when images load ✅
- [x] T022 [US2] Implement skeleton placeholder in `app/ux-cases/how-to-use-splash-screen/_components/ArticleCard.tsx` for Don't view (gray shimmer) ✅
- [x] T023 [US2] Ensure images start loading only after splash dismissal for Don't view in `app/ux-cases/how-to-use-splash-screen/page.tsx` ✅
 - [x] T023b [US2] Ensure page render is deferred until data is fetched and the splash video ends (Don't view) ✅
- [x] T024 [US2] Implement error icon placeholder in `app/ux-cases/how-to-use-splash-screen/_components/ArticleCard.tsx` for failed image loads ✅
- [x] T025 [US2] Ensure text content remains visible even when images fail in `app/ux-cases/how-to-use-splash-screen/_components/ArticleCard.tsx` ✅

**Checkpoint**: At this point, User Story 2 should be fully functional - Don't view shows loading delays

---

## Phase 5: User Story 3 - Demonstrate the "Do" behavior (Priority: P3)

**Goal**: When splash ends on Do side, images are already loaded and appear immediately

**Independent Test**: Select the Do view and verify images are visible within a small threshold after splash dismissal; image requests occur during splash.

### Tests for User Story 3

- [ ] T026 [P] [US3] Unit test for Do behavior: images preloaded during splash in `tests/components/preloadHelper.test.tsx`
- [ ] T027 [P] [US3] E2E test: Do view shows images immediately after splash in `tests/e2e/do-behavior.spec.ts`

### Implementation for User Story 3

- [x] T028 [US3] Implement preloadThumbnails function in `app/ux-cases/how-to-use-splash-screen/_components/preloadHelper.ts` to preload all article thumbnails ✅
- [x] T029 [US3] Integrate preload logic in `app/ux-cases/how-to-use-splash-screen/page.tsx` for Do view (call preloadThumbnails during splash) ✅
- [x] T030 [US3] Ensure images are visible immediately after splash dismissal for Do view (no skeleton, no delay) ✅
- [x] T031 [US3] Update splash dismissal logic to wait for imagesReady when viewType is 'do' in `app/ux-cases/how-to-use-splash-screen/page.tsx` ✅
 - [x] T031b [US3] Render page concurrently behind splash with list skeletons while data is loading (Do view) ✅

**Checkpoint**: At this point, User Story 3 should be fully functional - Do view shows images immediately

---

## Phase 6: User Story 4 - Compare Do and Don't by toggling (Priority: P1) ⚠️ CRITICAL

**Goal**: Users can toggle between Do and Don't views to see the difference in loading behavior. Each time they toggle, the splash screen appears again.

**Independent Test**: Toggle between Do and Don't views multiple times; verify splash appears on each toggle and demonstrates the different loading behaviors.

### Tests for User Story 4

- [ ] T032 [P] [US4] Unit test for splash reset on view change in `tests/components/SplashScreen.test.tsx`
- [ ] T033 [P] [US4] E2E test: splash appears on every toggle in `tests/e2e/toggle-splash.spec.ts`
- [ ] T034 [P] [US4] E2E test: rapid toggling (10+ times) works without errors in `tests/e2e/rapid-toggle.spec.ts`

### Implementation for User Story 4

- [x] T035 [US4] **CRITICAL**: Reset splash state when view changes in `app/ux-cases/how-to-use-splash-screen/page.tsx` (useEffect watching viewType from useDoDontView) ✅
- [x] T036 [US4] **CRITICAL**: Reset splashStartRef when view changes in `app/ux-cases/how-to-use-splash-screen/page.tsx` (reset timer on view change) ✅
- [x] T037 [US4] **CRITICAL**: Reset dataReady and imagesReady states when view changes in `app/ux-cases/how-to-use-splash-screen/page.tsx` (but reuse articles array) ✅
- [x] T038 [US4] **CRITICAL**: Re-trigger data fetching and preloading when view changes in `app/ux-cases/how-to-use-splash-screen/page.tsx` (useEffect dependency on viewType) ✅
- [x] T039 [US4] **CRITICAL**: Handle toggling during active splash - dismiss current splash immediately and start new splash in `app/ux-cases/how-to-use-splash-screen/page.tsx` ✅
- [x] T040 (superseded) [US4] Ensure same article dataset is reused when toggling (no re-fetch, use existing articles state) ✅
- [x] T040b [US4] Always re-fetch via server action on toggle (no reuse); integrate with TanStack Query invalidate/refetch ✅
- [x] T041 [US4] Clean up intervals and timeouts properly when view changes in `app/ux-cases/how-to-use-splash-screen/page.tsx` (cleanup in useEffect) ✅
- [ ] T042 [US4] Test rapid toggling (10+ times) to ensure no race conditions or state inconsistencies

**Checkpoint**: At this point, User Story 4 should be fully functional - splash appears on every toggle

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T043a [P] Add cache-busting to image URLs to disable browser caching (force fresh network requests) in `app/ux-cases/how-to-use-splash-screen/_components/preloadHelper.ts` and `ArticleCard.tsx` ✅
- [x] T043b [P] Implement server action for articles with a 1.5s deliberate delay; wire client to call it on initial load and on every toggle ✅
- [ ] T043 [P] Add error handling for data fetch failures in `app/ux-cases/how-to-use-splash-screen/page.tsx` (show error message per FR-008)
- [ ] T044 [P] Add loading text and icon for long data waits (>5s) in `app/ux-cases/how-to-use-splash-screen/page.tsx` (per FR-008)
- [ ] T045 [P] Implement timing metrics collection in `app/ux-cases/how-to-use-splash-screen/_components/metrics.ts` (per FR-010)
- [ ] T046 [P] Add accessibility improvements: aria-live for loading messages, keyboard navigation, focus states
- [ ] T047 [P] Add responsive design for mobile devices
- [ ] T048 [P] Optimize bundle size and Core Web Vitals
- [ ] T049 [P] Add comprehensive unit tests for all components
- [ ] T050 [P] Add E2E tests for complete user journeys
- [ ] T051 [P] Code cleanup and refactoring (ensure <200 LOC per file)
- [x] T052 [P] Remove debug/test button components from `app/ux-cases/how-to-use-splash-screen/page.tsx` ✅

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Stories 1 and 4 can proceed in parallel (if staffed) after Foundational
  - User Story 2 depends on User Story 1 (needs splash and basic structure)
  - User Story 3 depends on User Story 2 (needs Don't behavior to contrast)
  - User Story 4 depends on User Stories 2 and 3 (needs both behaviors to toggle between)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 for splash structure
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Depends on US2 for contrast
- **User Story 4 (P1)**: Can start after Foundational (Phase 2) - Depends on US2 and US3 for both behaviors

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, User Stories 1 and 4 can start in parallel (if staffed)
- All tests for a user story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members (respecting dependencies)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo (Full feature!)
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Splash screen)
   - Developer B: User Story 4 (Toggle behavior) - can start in parallel with US1
3. After US1 and US4 complete:
   - Developer A: User Story 2 (Don't behavior)
   - Developer B: User Story 3 (Do behavior)
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Follow constitution requirements: TypeScript, Shadcn UI, < 200 lines per file
- Ensure all components are accessible and follow design system
- **CRITICAL**: User Story 4 (toggle behavior) is P1 priority and must be implemented correctly - splash MUST appear on every toggle
