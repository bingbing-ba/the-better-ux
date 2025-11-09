# Data Model: How to use splash screen

## Entities

### ImageAsset
- url: string (required, absolute URL)
- altText: string (required, non-empty)
- width: number (optional, > 0)
- height: number (optional, > 0)

Validation:
- url must be a valid URL; altText required for accessibility.

### Article
- id: string (required, stable identifier)
- title: string (required, 1–160 chars)
- authorName: string (required, 1–80 chars)
- thumbnailUrl: string (required, absolute URL)
- excerpt: string (required, 1–320 chars)

Validation:
- thumbnailUrl must be a valid URL; empty strings disallowed.

### DemoRun
- startTime: ISO timestamp
- splashShownAt: ISO timestamp
- dataLoadedAt: ISO timestamp (nullable on failure)
- splashDismissedAt: ISO timestamp
- imagesVisibleAt_Do: ISO timestamp (nullable)
- imagesVisibleAt_Dont: ISO timestamp (nullable)

Validation:
- Timestamps must be monotonically increasing when present.

## Relationships
- Article.thumbnailUrl references an ImageAsset by URL (no strict FK in demo).
- DemoRun captures one session of the demo; Articles are fetched per run.

## State
- Splash: pending → visible → dismissed (min 1s, max 5s cap).
- Data: fetching → loaded | failed | timeout-progress.
- Images (thumbnails): preloading (Do) | loading (Don’t) → visible | failed | skeleton.
