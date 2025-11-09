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
- Splash: min 1s, max 5s; Do waits for data+images; Don’t waits for data.
- Fallbacks: long data wait → loading text+icon; slow images → skeletons; data fail → error text; image fail → error icon placeholder.
- Articles: fetch fresh each load; list varies between reloads.

## Testing
- Unit/integration: data shaping and timing helpers.
- E2E (Playwright):
  - Splash appears immediately; transitions cleanly.
  - Don’t: thumbnails start after splash; skeletons shown on slow images.
  - Do: thumbnails visible right after splash.
  - Reload changes article list.

## Notes
- Keep accessible: keyboard/focus states, aria-live for loading messages.
- Record timings for SC verification.
