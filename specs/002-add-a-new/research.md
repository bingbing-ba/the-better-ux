# Research: How to use splash screen

## Unknowns resolved

### Decision: Splash timing (video-gated)
- Decision: Splash dismissal is gated by the video ending (no min/max timers).
- Rationale: Clear, deterministic user experience; aligns with educational demo using a single video.
- Alternatives considered: Timer caps (min/max); data-driven dismissal.

### Decision: Fallback behaviors
- Decision: Long data wait → loading text+icon; slow images → skeletons; data fail → error text; image fail → error icon placeholder.
- Rationale: Clear, non-blocking communication; preserves text content; educates effectively.
- Alternatives considered: Modal blockers; silent failures.

### Decision: Article fetching model
- Decision: Always call a server action for articles on initial load and on every toggle; the server action intentionally delays 1.5s before returning.
- Rationale: Demonstrates realistic loading behavior on each comparison; predictable latency for demo.
- Alternatives considered: Client-only fetch; cache reuse across toggles.

### Decision: Article list should differ on reload
- Decision: Fetch fresh data each page load and vary the visible list (rotation/randomized subset).
- Rationale: Reinforces server-driven nature; keeps demo feeling live.
- Alternatives considered: Static dataset; cache-first display.

### Decision: Splash video with black background
- Decision: Show a video element on a black background during splash; black background remains before playback is ready.
- Rationale: Sets expectation that something will happen soon without abrupt blank states.
- Alternatives considered: Static logo; progress ring only.

## Best practices

- Preload critical assets during splash for instant post-splash content (Do side).
- Use black background video to set expectation even before ready-to-play.
- Maintain accessibility: focus management, keyboard support, aria-live for loading messages, semantic lists.
- Record simple client timings to validate success criteria.
- Keep data shape stable and consistent across Do/Don't.
- **Splash on toggle**: Reset splash state when view changes; splash duration equals video duration.
- **State management**: Use `useDoDontView` hook for view management; re-fetch on each toggle.
- **Fetch strategy**: Use TanStack Query to start requests immediately; show list skeletons while pending (Do); start image loads after splash on Don't with image skeletons.
- **Cache-busting**: Disable browser caching for images using cache-busting query parameters (e.g., `?t=timestamp`) to ensure the loading difference between Do and Don't is visible on every toggle. This is critical for educational demonstration purposes.
