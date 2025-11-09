# Research: How to use splash screen

## Unknowns resolved

### Decision: Splash timing (min/max and proceed rules)
- Decision: Min 1,000 ms; Max 5,000 ms. Don't proceeds when data ready or at max cap; Do proceeds when data + images ready or at max cap.
- Rationale: Balances perceived performance with predictability; ensures Do contrast.
- Alternatives considered: Shorter caps (risk flicker), longer caps (risk perceived slowness).

### Decision: Fallback behaviors
- Decision: Long data wait → loading text+icon; slow images → skeletons; data fail → error text; image fail → error icon placeholder.
- Rationale: Clear, non-blocking communication; preserves text content; educates effectively.
- Alternatives considered: Modal blockers; silent failures.

### Decision: Article list should differ on reload
- Decision: Fetch fresh data each load and vary the visible list (rotation/randomized subset).
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
