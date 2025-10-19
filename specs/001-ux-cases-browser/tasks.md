# Tasks: UX Cases Browser

**Input**: Design documents from `/specs/001-ux-cases-browser/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, quickstart.md

**Tests**: Tests are included as they are required by the constitution (80% coverage requirement).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- **Next.js App Router**: `app/`, `const/`, `lib/`, `tests/` at repository root
- Feature folders with underscore prefix: `app/ux-cases/_components/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per implementation plan ✅
- [x] T002 [P] Install dependencies: @tanstack/react-query, zustand, @testing-library/react, @testing-library/jest-dom, jest, playwright ✅
- [x] T003 [P] Setup Shadcn UI components: button, card, toggle ✅
- [x] T004 [P] Configure TanStack Query provider in app/providers.tsx ✅
- [x] T005 [P] Create minimal folders: app/ux-cases/_components/, tests/components/, tests/e2e/ ✅
- [ ] T005a [P] Install Blurhash libraries: `npm install react-blurhash blurhash`
- [ ] T006 [P] (Optional later) Create feature-level shared folders only when reused: app/ux-cases/_hooks/, app/ux-cases/_stores/, app/ux-cases/_consts/
- [ ] T007 [P] (Optional later) Create root-level shared folders only when reused by multiple features: hooks/, stores/, const/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 Create base routing: landing `app/page.tsx` and static case route folder `app/ux-cases/image-loading-blurhash/page.tsx` ✅
- [x] T009 [P] Setup TypeScript configuration with strict typing ✅
- [x] T010 [P] Configure Tailwind CSS with Shadcn UI integration ✅
- [x] T011 [P] Setup Jest and React Testing Library configuration ✅
- [x] T012 [P] Setup Playwright for E2E testing ✅
- [x] T013 Create base layout structure in app/layout.tsx ✅
- [x] T014 Create utility functions in lib/utils.ts and lib/cn.ts ✅

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Browse UX Cases (Priority: P1) 🎯 MVP

**Goal**: Users can see a landing list of cases (newest first) and click a case to open its page

**Independent Test**: Load the landing page and verify the list is newest-first and clickable to open a case

### Tests for User Story 1

**NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T015 [P] [US1] Unit test for landing list ordering and links in tests/components/LandingList.test.tsx
- [ ] T016 [P] [US1] E2E test: open case from landing list in tests/e2e/case-navigation.spec.ts

### Implementation for User Story 1

- [x] T017 [US1] Define small case metadata list (title, slug, createdAt, tags?, isTrending?) for landing ✅
- [x] T018 [US1] Implement landing list (newest-first) with optional Trending/New sections in app/page.tsx ✅
- [x] T019 [US1] Ensure list items are accessible and keyboard navigable ✅
- [x] T020 [US1] Add responsive layout for landing list ✅

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Toggle Do/Don't Examples (Priority: P1)

**Goal**: Users can toggle between "Do" and "Don't" examples to see both good and bad practices for the same UX principle

**Independent Test**: View any case and verify the toggle switches views, defaults to Don't, and respects a link-specified view

### Tests for User Story 2

- [ ] T023 [P] [US2] Unit test for DoDontToggle: default Don't and view query param in tests/components/DoDontToggle.test.tsx
- [ ] T024 [P] [US2] E2E test: toggle behavior and linkable view in tests/e2e/toggle-functionality.spec.ts

### Implementation for User Story 2

- [x] T025 [US2] Create first UX case page in app/ux-cases/image-loading-blurhash/page.tsx ✅
- [x] T026 [US2] Implement DoDontToggle component in app/ux-cases/_components/DoDontToggle.tsx ✅
- [x] T027 [US2] Add interactive example content for image loading blurhash case ✅
- [x] T028 [US2] Implement state management for toggle functionality ✅
- [x] T029 [US2] Add visual feedback for toggle state changes ✅

#### Case Supplement Tasks (Image Loading with Blurhash)

- [x] T029a [US2] Use these exact image URLs in the case page (order 1→4) ✅
- [x] T029b [US2] Apply provided blurhash strings (order 1→4) for the "Do" view previews ✅
- [x] T029c [US2] Ensure no layout shift in both views by reserving image dimensions up-front ✅
- [x] T029d [US2] Ensure perceived load is not instantaneous (~700–1200ms); simulate or throttle for demo ✅
- [x] T029e [US2] "Don't" view uses uniform gray placeholder (no blurhash) ✅
- [x] T029f [US2] Provide meaningful alt text describing problem (Don't) and improvement (Do) ✅
- [ ] T029g [US2] Replace gradient approximation with real `<Blurhash>` rendering for the Do view

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Navigate Between Pages (Priority: P2)

**Goal**: Users can easily move between landing and case pages; shared links open the specified view; browser navigation works

**Independent Test**: Navigate landing → case → landing and use back/forward; verify linkable view is respected

### Tests for User Story 3

- [ ] T032 [P] [US3] E2E test for landing/case/back flow in tests/e2e/case-navigation.spec.ts
- [ ] T033 [P] [US3] Unit test for reading view from URL and fallback behavior

### Implementation for User Story 3

- [x] T034 [US3] Add "Back to Home" link on case pages ✅
- [x] T035 [US3] Ensure browser back/forward works between landing and case ✅
- [x] T036 [US3] Respect `view` query param on load and when navigating ✅
- [x] T037 [US3] Add loading states for page transitions (if needed) ✅

### Tests for Case Supplement (US2, optional if enforcing TDD)

- [ ] T038 [P] [US2] Unit test: layout is stable (no DOM reflow changing reserved container size on load)
- [ ] T039 [P] [US2] E2E test: "Don't" shows gray placeholder; "Do" shows blurhash; both avoid layout shift; images appear within ~0.7–1.2s

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T041 [P] Add comprehensive unit tests for all components in tests/components/
- [ ] T042 [P] Add E2E tests for complete user journeys in tests/e2e/
- [ ] T043 [P] Implement performance optimizations (code splitting, lazy loading)
- [ ] T044 [P] Add SEO metadata and structured data
- [ ] T045 [P] Implement accessibility improvements (ARIA labels, keyboard navigation)
- [ ] T046 [P] Add error boundaries and error handling
- [ ] T047 [P] Implement responsive design for mobile devices
- [ ] T048 [P] Add loading states and skeleton components
- [ ] T049 [P] Optimize bundle size and Core Web Vitals
- [ ] T050 [P] Add documentation and README updates
- [ ] T051 [P] Run quickstart.md validation
- [ ] T052 [P] Code cleanup and refactoring
- [ ] T053 [P] Security hardening and validation

### Refactor & Consistency

- [x] T054 [P] Replace template literal className concatenation with `cn()` helper where applicable ✅

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Depends on US1 for navigation structure
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 and US2 for complete functionality

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, User Stories 1 and 2 can start in parallel
- All tests for a user story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Unit test for landing list ordering and links in tests/components/LandingList.test.tsx"
Task: "E2E test: open case from landing list in tests/e2e/case-navigation.spec.ts"

# Launch all foundational tasks together:
Task: "Create base routing: landing and case route scaffolds"
Task: "Setup TypeScript configuration with strict typing"
Task: "Configure Tailwind CSS with Shadcn UI integration"
```

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
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Sidebar navigation)
   - Developer B: User Story 2 (Do/Dont toggle)
   - Developer C: User Story 3 (Navigation between cases)
3. Stories complete and integrate independently

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
