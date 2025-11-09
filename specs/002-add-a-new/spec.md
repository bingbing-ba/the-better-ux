# Feature Specification: How to use splash screen

**Feature Branch**: `002-add-a-new`  
**Created**: 2025-10-23  
**Status**: Draft  
**Input**: User description: "Add a new ux case, \"How to use splash screen\"\n1. As user enters page, sees a splash screen\n2. For \"Don't\" side, as splash screen end, images start to load.\n3. For \"Do\" side, as splash screen end, images are already loaded.\n4. Both case does load data to show images(eg. urls) during splash screen."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Experience the case with a splash screen (Priority: P1)

As a visitor opening the "How to use splash screen" UX case, I immediately see a splash screen with a video on a black background while the case prepares content. When the splash ends, I see the demo view with a Do/Don't toggle and a list of articles (thumbnail, title, author, excerpt).

**Why this priority**: Establishes the core pattern and sets the expectation that work happens during the splash to improve perceived performance.

**Independent Test**: Open the case URL, measure time from first paint to demo view rendered after splash. Verify splash appears on initial load and transitions cleanly to the demo.

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

### User Story 4 - Compare Do and Don't by toggling (Priority: P1)

As a visitor, I can toggle between Do and Don't views to see the difference in loading behavior. Each time I toggle, the splash screen appears again, allowing me to observe how each approach handles loading during the splash period.

**Why this priority**: This is the core educational value - users must be able to compare both approaches side-by-side by toggling to understand the performance difference.

**Independent Test**: Toggle between Do and Don't views multiple times; verify splash appears on each toggle and demonstrates the different loading behaviors.

**Acceptance Scenarios**:

1. **Given** I am viewing the Don't side after splash, **When** I toggle to Do, **Then** the splash screen appears again immediately.
2. **Given** I am viewing the Do side after splash, **When** I toggle to Don't, **Then** the splash screen appears again immediately.
3. **Given** I toggle to Do, **When** the splash is visible, **Then** images are preloaded during the splash period.
4. **Given** I toggle to Don't, **When** the splash is visible, **Then** images start loading only after the splash ends.
5. **Given** I toggle multiple times between Do and Don't, **When** each splash completes, **Then** I can clearly see the difference in image loading timing between the two approaches.
6. **Given** I toggle between views, **When** the splash appears, **Then** the same article dataset is used for both views (consistent comparison).

---

### Edge Cases

- Very slow network delays data for many seconds: splash should not block indefinitely; demo should show graceful states after a cap.
- Image request failures: demo should continue and communicate that some images could not load.
- User revisits the case: repeated visits should not repeatedly show long splash if data is already available.
- Rapid toggle between Do/Don't: each toggle triggers a new splash screen; state resets properly; data set remains identical across both sides; previous splash is dismissed cleanly when toggling.
- Toggling during splash: if user toggles while splash is visible, the current splash should be dismissed and a new splash should start for the new view.
- Multiple rapid toggles: system should handle rapid toggling gracefully, ensuring each view gets its own splash cycle without race conditions.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST show a splash screen immediately on entering the case.
- **FR-002**: While splash is visible, System MUST request the data needed to display images (e.g., image URLs and basic metadata).
- **FR-003**: For the Don't side, System MUST defer image network loading until after the splash is dismissed.
- **FR-004**: For the Do side, System MUST ensure images are already loaded by the time the splash is dismissed (preload during splash).
- **FR-005**: System MUST provide a control to switch between Do and Don't without reloading the page.
- **FR-005a**: System MUST show the splash screen every time the user toggles between Do and Don't views (not just on initial page load).
- **FR-005b**: When toggling between views, System MUST reset the splash state (show splash, reset timers, re-trigger loading logic) to demonstrate the loading difference for each view.
- **FR-006**: System MUST use the same image dataset for both Do and Don't views (for consistent comparison).
- **FR-007**: Splash duration MUST equal the video duration; there is no min/max timer. The splash is dismissed strictly when the video ends.
- **FR-008**: System MUST handle long waits and failures with explicit fallbacks:
  1) If data fetching exceeds 5,000 ms, show a loading text and icon while proceeding.
  2) If image load is taking too long, show skeleton (gray shimmer) placeholders for images.
  3) If data fetching fails, show text: "Opps there is something wrong, try again later".
  4) If an image fails to load, show a placeholder with an error icon.
- **FR-009**: System MUST NOT include a skip control on the splash screen (educational demo keeps experience consistent).
- **FR-010**: System MUST capture basic timing metrics (e.g., splash duration, time-to-first-image for each side) for internal verification.
- **FR-011**: Splash screen MUST present a video element with a black background so that, before playback is ready, the screen still communicates that something is about to happen. The video source MUST be `https://storage.googleapis.com/the-better-ux/tbu-logo-splash.mp4`. The splash MUST render the video only (no overlays/spinners).
- **FR-012**: System MUST fetch fresh article data on each page load (initial visit) and vary the visible list between page reloads (e.g., rotation or randomized subset) to reinforce that data is server-driven and not fixed.
- **FR-013**: When toggling between Do and Don't views, System MUST always re-fetch via a server action (no reuse of prior dataset) to ensure each toggle performs a real request.
- **FR-014**: System MUST handle view toggles gracefully: if a toggle occurs during an active splash, the current splash MUST be dismissed immediately and a new splash MUST start for the new view.
- **FR-015**: System MUST disable browser caching for images to ensure the loading difference between Do and Don't is visible on every toggle. Images MUST be loaded with cache-busting query parameters (e.g., `?t=timestamp`) to force fresh network requests for educational demonstration purposes.
- **FR-016**: On every Do/Don't render (including toggles), the client MUST call a server action to fetch articles.
- **FR-017**: The server action MUST intentionally delay its response by 1,500 ms before returning to simulate real-world latency.
- **FR-018**: The server action MUST return the article list (ids, titles, authors, thumbnail URLs, excerpts).
- **FR-019**: Both Do and Don't MUST start the server action request at the same time. Both sides MUST use skeletons while loading. The difference is timing and image handling:
  - Do: The page may render concurrently with the splash; list-level skeletons are shown while the server action is pending. Thumbnails MUST be preloaded during the splash so that when the video ends, images are already loaded.
  - Don't: The page renders only after the server action completes and the splash video ends; image loading MUST start only after splash ends. Image-level skeletons are shown until each image loads.

### Key Entities *(include if feature involves data)*

- **ImageAsset**: Represents an image to display; attributes: url, altText, width, height.
- **Article**: Represents an item in the post-splash list; attributes: id, title, authorName, thumbnailUrl, excerpt.
- **DemoRun**: Represents a single visit/run of the demo; attributes: startTime, splashShownAt, dataLoadedAt, splashDismissedAt, imagesVisibleAt_Do, imagesVisibleAt_Dont.

### Assumptions & Dependencies

- This is an educational UX case; no authentication or personalization is required.
- Images are non-sensitive demo assets; alt text is available or can be authored.
- Data source provides a finite list of images with stable URLs.
- Users may view on mobile or desktop; animations and timings should be comfortable across devices.
- **Browser caching is disabled for images** to ensure the loading difference is visible on every toggle (cache-busting query parameters added to image URLs).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of visits transition from first paint to demo view in ≤ 2.0 seconds on typical broadband.
- **SC-002**: On the Do side, 95% of images are visible within ≤ 200 ms after splash dismissal.
- **SC-003**: On the Don't side, time-to-first-image after splash is ≥ 400 ms in a controlled test to visibly contrast behaviors.
- **SC-004**: In a quick comprehension check, ≥ 80% of test users correctly identify that preloading during splash is the recommended approach.
- **SC-005**: Error rate for the case (blocking failures) remains < 1% of visits.
- **SC-006**: When toggling between Do and Don't views, 100% of toggles successfully trigger a new splash screen and demonstrate the loading difference.
- **SC-007**: Users can toggle between Do and Don't views at least 10 times in succession without errors or state inconsistencies.
