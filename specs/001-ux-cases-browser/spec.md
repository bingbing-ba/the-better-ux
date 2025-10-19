# Feature Specification: UX Cases Application

**Feature Branch**: `001-ux-cases-browser`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "ok, now let's build an application, that users can get some cases from this website. The cases are about User Experience. Users can navigate each case thru sidebar. There is Do and Don't toggle button so user's can toggle cases."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse UX Cases (Priority: P1)

A user visits the website to learn about UX best practices by browsing through different UX cases. They can see a list of available cases on the landing page (sorted by newest first) and click on any case to view its content.

**Why this priority**: This is the core functionality - without being able to browse and view cases, the application has no value.

**Independent Test**: Can be fully tested by loading the landing page and verifying that cases are listed (newest first) and can be clicked to view content.

**Acceptance Scenarios**:

1. **Given** a user visits the landing page, **When** they view the list, **Then** items are shown in newest-first order
2. **Given** a user sees a case in the list, **When** they click on it, **Then** the case content is displayed in the main area
3. **Given** a user is viewing a case, **When** they click "Back to Home", **Then** they return to the landing page

---

### User Story 2 - Toggle Do/Don't Examples (Priority: P1)

A user viewing a UX case can toggle between "Do" and "Don't" examples to see both good and bad practices for the same UX principle.

**Why this priority**: The Do/Don't toggle is a core differentiator that provides educational value by showing contrasting examples.

**Independent Test**: Can be fully tested by viewing any case and verifying that the toggle switches views, defaults to "Don't" when unspecified, and respects a shared link that specifies the view.

**Acceptance Scenarios**:

1. **Given** a user is viewing a UX case that supports both views, **When** they see the Do/Don't toggle, **Then** they can click it to switch between examples
2. **Given** a user opens a case without specifying a view, **When** the page loads, **Then** the "Don't" view is shown by default
3. **Given** a user opens a case via a link that specifies a view, **When** the page loads, **Then** that specified view is shown

---

### User Story 3 - Navigate Between Cases (Priority: P2)

A user can easily move between the landing page and case pages to learn about various UX principles and best practices.

**Why this priority**: Navigation between cases enables users to explore multiple topics and get comprehensive UX education.

**Independent Test**: Can be fully tested by navigating from the landing page to multiple case pages and verifying smooth transitions without full page reloads.

**Acceptance Scenarios**:

1. **Given** a user is viewing one case, **When** they click "Back to Home" and select another case from the list, **Then** the new case opens without a full page reload
2. **Given** a user opens a shared case link with a specified view, **When** they use browser back/forward, **Then** the view in the URL is respected on navigation
3. **Given** a user is on a case, **When** they use the browser back/forward buttons, **Then** navigation between the landing and case pages works as expected

---

### Edge Cases

- What happens when there are no cases available?
- How does the system handle cases with missing Do or Don't examples?
- What happens when a user tries to access a case that doesn't exist?
- How does the system handle slow loading of case content?
- Only one case exists at launch; landing still loads and shows the single item
- A shared link includes an invalid view; system falls back to default "Don't"

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a landing page with a list of cases sorted by newest first
- **FR-002**: System SHOULD highlight Trending (manual) and New (created within last 30 days) when available
- **FR-003**: System MUST allow users to open a case from the landing list
- **FR-004**: System MUST provide a Do/Don't toggle on cases that support both views
- **FR-005**: System MUST default the case view to Don't on first open if not otherwise specified
- **FR-006**: System MUST allow sharing a link that opens a case in a specific view (link preserves the selected view)
- **FR-007**: System MUST load case content without requiring a full page reload
- **FR-008**: System MUST handle cases that have only Do or only Don't by omitting the toggle
- **FR-009**: System MUST provide visual feedback when switching between Do/Don't views
- **FR-010**: System MUST provide a clear "Back to Home" action from any case detail

### Key Entities *(include if feature involves data)*

- **UX Case**: A collection of UX examples with Do and Don't variants, containing title, description, and visual examples
- **Do Example**: A positive UX example showing best practices for a specific UX principle
- **Don't Example**: A negative UX example showing common mistakes for a specific UX principle

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view any UX case within 2 seconds of clicking on it
- **SC-002**: Users can toggle between Do/Don't examples in under 1 second
- **SC-003**: 95% of users can successfully navigate between different cases without confusion
- **SC-004**: Users can access all available cases without encountering loading errors
- **SC-005**: Users can return to the landing page from a case in one click
- **SC-006**: Users can complete a full case review (viewing both Do and Don't examples) in under 3 minutes
- **SC-007**: Opening a shared link with a specified view shows that view within 2 seconds

## Information Architecture (Routing)

- Landing page: `/` shows highlights (Trending/New) and the full list (newest first)
- Case detail pages: each case appears under `/ux-cases/{slug}` (e.g., `/ux-cases/image-loading-blurhash`)

## Content Guidelines (First Case)

- Structure (in order):
  1) Short title and purpose (1–2 lines)
  2) Do/Don't toggle (default to "Don't")
  3) Example panels: show the experience
  4) Why it matters: 2–4 concise bullets
  5) Optional references/links
- Visuals:
  - 1–2 screenshots or a short GIF per view (Do and Don't)
  - Max rendered size ~800×600, `.webp` preferred
  - Descriptive alt text (describe the UX issue or improvement)
  - File naming: `{slug}-{do|dont}-{n}.webp` (e.g., `image-loading-blurhash-dont-1.webp`)
  - Assets path: `public/ux-cases/{slug}/`

## Design Guidelines (Implementation-agnostic)

- Components SHOULD accept a `className` prop to allow safe extension/override of styles