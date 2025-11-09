# Quickstart: How to use splash screen

## Run locally
1. Install deps: `npm install`
2. Start dev: `npm run dev`
3. Visit: `/ux-cases/how-to-use-splash-screen`

## Build structure
- Create `app/ux-cases/how-to-use-splash-screen/page.tsx`
- Add `_components/`:
  - `SplashVideo.tsx` (black-bg video)
  - `ArticleList.tsx`, `ArticleCard.tsx`
  - `metrics.ts` (collect basic timings)
- Reuse `DoDontToggle` from `app/ux-cases/_components/DoDontToggle.tsx`

## Behaviors
- Splash: duration equals video length; dismissal happens when the video ends (no min/max timers).
- **Splash on toggle**: Splash screen MUST appear every time user toggles between Do and Don't views (not just on initial load).
- **Toggle behavior**: When toggling, reset splash state and always re-fetch data via a server action (real request each time).
- **Toggle during splash**: If user toggles while splash is visible, dismiss current splash immediately and start new splash for new view.
- Fallbacks: long data wait → loading text+icon; slow images → skeletons; data fail → error text; image fail → error icon placeholder.
- Articles: fetch fresh each page load and on every toggle via a server action with a 1.5s intentional delay; list varies between reloads.
- Do vs Don't:
  - Do: request starts immediately; page can render concurrently behind splash with list skeletons; thumbnails are preloaded during splash so they are ready when the video ends.
  - Don't: request starts immediately; page renders after data returned and after the video ends; thumbnails start loading after splash; image skeletons appear until loaded.

## Testing
- Unit/integration: data shaping and timing helpers; splash state reset on view change.
- E2E (Playwright):
  - Splash appears immediately on initial load; transitions cleanly.
  - **Toggle behavior**: Splash appears every time user toggles between Do and Don't.
  - **Toggle during splash**: Toggling during active splash dismisses current and starts new splash.
  - Don't: thumbnails start after splash; skeletons shown on slow images.
  - Do: thumbnails visible right after splash.
  - Reload changes article list.
  - Multiple rapid toggles (10+) work without errors or state inconsistencies.

## Notes
- Keep accessible: keyboard/focus states, aria-live for loading messages.
- Record timings for SC verification.
