# Feature Specification: How to use splash screen

**Feature Branch**: `002-add-a-new`  
**Created**: 2025-10-23  
**Status**: Draft  
**Input**: User description: "Add a new ux case, \"How to use splash screen\"\n1. As user enters page, sees a splash screen\n2. For \"Don't\" side, as splash screen end, images start to load.\n3. For \"Do\" side, as splash screen end, images are already loaded.\n4. Both case does load data to show images(eg. urls) during splash screen."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Experience the case with a splash screen (Priority: P1)

As a visitor opening the "How to use splash screen" UX case, I immediately see a splash screen with a video on a black background while the case prepares content. When the splash ends, I see the demo view with a Do/Don't toggle and a list of articles (thumbnail, title, author, excerpt).

**Why this priority**: Establishes the core pattern and sets the expectation that work happens during the splash to improve perceived performance.

**Independent Test**: Open the case URL, measure time from first paint to demo view rendered after splash. Verify splash appears once and transitions cleanly to the demo.

**Acceptance Scenarios**:

1. **Given** a fresh visit, **When** the page loads, **Then** a splash screen is shown immediately.
2. **Given** splash is visible, **When** data fetch completes, **Then** the demo view replaces the splash with a smooth transition.
3. **Given** the demo view shows, **When** I look at the UI, **Then** I see a Do/Don't toggle and a consistent set of images.
4. **Given** I reload the page, **When** content loads again, **Then** the article list (order and/or selection) differs from the prior load to communicate server-driven, non-fixed data.

---

### User Story 2 - Demonstrate the "Don't" behavior (Priority: P2)

As a visitor, when the splash ends on the Don't side, images only start loading then, leading to visible delays or placeholders.

**Why this priority**: Shows the anti-pattern and makes the contrast with the recommended approach obvious.

**Independent Test**: Select the Don't view and measure time-to-first-image after splash dismissal; confirm network image loading starts after splash ends.

**Acceptance Scenarios**:

1. **Given** the splash ends on Don't, **When** the article list appears, **Then** network requests for thumbnails begin only after splash dismissal.
2. **Given** slow network, **When** thumbnails are loading, **Then** user sees skeleton placeholders in each article card until thumbnails arrive.
3. **Given** data is ready but some images fail, **When** the list renders, **Then** failed thumbnails show an error icon placeholder while text content remains visible.

---

### User Story 3 - Demonstrate the "Do" behavior (Priority: P3)

As a visitor, when the splash ends on the Do side, images are already loaded and appear immediately.

**Why this priority**: Demonstrates the correct pattern: do the expensive work while the splash is visible to deliver instant content afterwards.

**Independent Test**: Select the Do view and verify images are visible within a small threshold after splash dismissal; image requests occur during splash.

**Acceptance Scenarios**:

1. **Given** the splash is visible on Do, **When** background work runs, **Then** article data and thumbnail requests occur during the splash period.
2. **Given** the splash is dismissed on Do, **When** the article list appears, **Then** thumbnails are already visible without additional waiting and text content is complete.

---

### Edge Cases

- Very slow network delays data for many seconds: splash should not block indefinitely; demo should show graceful states after a cap.
- Image request failures: demo should continue and communicate that some images could not load.
- User revisits the case: repeated visits should not repeatedly show long splash if data is already available.
- Rapid toggle between Do/Don't: state remains consistent; data set remains identical across both sides.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST show a splash screen immediately on entering the case.
- **FR-002**: While splash is visible, System MUST request the data needed to display images (e.g., image URLs and basic metadata).
- **FR-003**: For the Don't side, System MUST defer image network loading until after the splash is dismissed.
- **FR-004**: For the Do side, System MUST ensure images are already loaded by the time the splash is dismissed (preload during splash).
- **FR-005**: System MUST provide a control to switch between Do and Don't without reloading the page.
- **FR-006**: System MUST use the same image dataset for both Do and Don't views.
- **FR-007**: System MUST apply a minimum splash duration of 1,000 ms and a maximum wait cap of 5,000 ms. Don't view proceeds when data is ready or when the 5,000 ms cap is reached (whichever comes first). Do view proceeds when both data and images are ready or when the 5,000 ms cap is reached.
- **FR-008**: System MUST handle long waits and failures with explicit fallbacks:
  1) If data fetching exceeds 5,000 ms, show a loading text and icon while proceeding.
  2) If image load is taking too long, show skeleton (gray shimmer) placeholders for images.
  3) If data fetching fails, show text: "Opps there is something wrong, try again later".
  4) If an image fails to load, show a placeholder with an error icon.
- **FR-009**: System MUST NOT include a skip control on the splash screen (educational demo keeps experience consistent).
- **FR-010**: System MUST capture basic timing metrics (e.g., splash duration, time-to-first-image for each side) for internal verification.
- **FR-011**: Splash screen MUST present a video element with a black background so that, before playback is ready, the screen still communicates that something is about to happen.
- **FR-012**: System MUST fetch fresh article data on each load and vary the visible list between reloads (e.g., rotation or randomized subset) to reinforce that data is server-driven and not fixed.

### Key Entities *(include if feature involves data)*

- **ImageAsset**: Represents an image to display; attributes: url, altText, width, height.
- **Article**: Represents an item in the post-splash list; attributes: id, title, authorName, thumbnailUrl, excerpt.
- **DemoRun**: Represents a single visit/run of the demo; attributes: startTime, splashShownAt, dataLoadedAt, splashDismissedAt, imagesVisibleAt_Do, imagesVisibleAt_Dont.

### Assumptions & Dependencies

- This is an educational UX case; no authentication or personalization is required.
- Images are non-sensitive demo assets; alt text is available or can be authored.
- Data source provides a finite list of images with stable URLs.
- Users may view on mobile or desktop; animations and timings should be comfortable across devices.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of visits transition from first paint to demo view in ≤ 2.0 seconds on typical broadband.
- **SC-002**: On the Do side, 95% of images are visible within ≤ 200 ms after splash dismissal.
- **SC-003**: On the Don't side, time-to-first-image after splash is ≥ 400 ms in a controlled test to visibly contrast behaviors.
- **SC-004**: In a quick comprehension check, ≥ 80% of test users correctly identify that preloading during splash is the recommended approach.
- **SC-005**: Error rate for the case (blocking failures) remains < 1% of visits.
