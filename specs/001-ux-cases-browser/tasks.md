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

- [x] T001 Create project structure per implementation plan
- [x] T002 [P] Install dependencies: @tanstack/react-query, zustand, @testing-library/react, @testing-library/jest-dom, jest, playwright
- [ ] T003 [P] Setup Shadcn UI components: button, card, sidebar, toggle
- [x] T004 [P] Configure TanStack Query provider in app/providers.tsx
- [x] T005 [P] Create minimal folders: app/ux-cases/_components/, tests/components/, tests/e2e/
- [ ] T006 [P] (Optional later) Create feature-level shared folders only when reused: app/ux-cases/_hooks/, app/ux-cases/_stores/, app/ux-cases/_consts/
- [ ] T007 [P] (Optional later) Create root-level shared folders only when reused by multiple features: hooks/, stores/, const/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T008 Inline sidebar navigation items in app/ux-cases/_components/Sidebar.tsx (lift to shared module later if reused)
- [ ] T009 [P] Setup TypeScript configuration with strict typing
- [ ] T010 [P] Configure Tailwind CSS with Shadcn UI integration
- [ ] T011 [P] Setup Jest and React Testing Library configuration
- [ ] T012 [P] Setup Playwright for E2E testing
- [ ] T013 Create base layout structure in app/layout.tsx
- [ ] T014 Create utility functions in lib/utils.ts and lib/cn.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Browse UX Cases (Priority: P1) 🎯 MVP

**Goal**: Users can see a list of available UX cases in a sidebar and click on any case to view its content

**Independent Test**: Load the homepage and verify that cases are displayed in the sidebar and can be clicked to view content

### Tests for User Story 1

**NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T015 [P] [US1] Unit test for Sidebar component in tests/components/Sidebar.test.tsx
- [ ] T016 [P] [US1] E2E test for case navigation in tests/e2e/case-navigation.spec.ts

### Implementation for User Story 1

- [ ] T017 [US1] Define local sidebar items (id, title, href) in app/ux-cases/_components/Sidebar.tsx
- [ ] T018 [US1] Add types locally or in a nearby module when needed
- [ ] T019 [US1] Implement Sidebar component in app/ux-cases/_components/Sidebar.tsx
- [ ] T020 [US1] Create UXCasesLayout in app/ux-cases/layout.tsx
- [ ] T021 [US1] Update home page to display UX cases in app/page.tsx
- [ ] T022 [US1] Add responsive design and accessibility features to Sidebar

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Toggle Do/Don't Examples (Priority: P1)

**Goal**: Users can toggle between "Do" and "Don't" examples to see both good and bad practices for the same UX principle

**Independent Test**: View any case and verify that the toggle button switches between Do and Don't examples

### Tests for User Story 2

- [ ] T023 [P] [US2] Unit test for DoDontToggle component in tests/components/DoDontToggle.test.tsx
- [ ] T024 [P] [US2] E2E test for toggle functionality in tests/e2e/toggle-functionality.spec.ts

### Implementation for User Story 2

- [ ] T025 [US2] Create first UX case page in app/ux-cases/image-loading-blurhash/page.tsx
- [ ] T026 [US2] Implement DoDontToggle component in app/ux-cases/_components/DoDontToggle.tsx
- [ ] T027 [US2] Add interactive example content for image loading blurhash case
- [ ] T028 [US2] Implement state management for toggle functionality
- [ ] T029 [US2] Add visual feedback for toggle state changes
- [ ] T030 [US2] Create second UX case page in app/ux-cases/form-validation/page.tsx
- [ ] T031 [US2] Add interactive example content for form validation case

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Navigate Between Cases (Priority: P2)

**Goal**: Users can easily navigate between different UX cases to learn about various UX principles and best practices

**Independent Test**: Click through multiple cases in the sidebar and verify smooth transitions

### Tests for User Story 3

- [ ] T032 [P] [US3] E2E test for navigation between cases in tests/e2e/case-navigation.spec.ts
- [ ] T033 [P] [US3] Unit test for navigation state management in tests/hooks/useNavigation.test.tsx

### Implementation for User Story 3

- [ ] T034 [US3] Create third UX case page in app/ux-cases/button-states/page.tsx
- [ ] T035 [US3] Add interactive example content for button states case
- [ ] T036 [US3] Implement navigation state management in app/ux-cases/_stores/navigationStore.ts
- [ ] T037 [US3] Add browser back/forward button support
- [ ] T038 [US3] Implement smooth transitions between cases
- [ ] T039 [US3] Add loading states for case transitions
- [ ] T040 [US3] Implement toggle state persistence across navigation

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
Task: "Unit test for Sidebar component in tests/components/Sidebar.test.tsx"
Task: "E2E test for case navigation in tests/e2e/case-navigation.spec.ts"

# Launch all foundational tasks together:
Task: "Create SidebarItem interface in const/sidebarItems.ts"
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
