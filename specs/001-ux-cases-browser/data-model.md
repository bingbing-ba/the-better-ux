# Data Model: UX Cases Browser

MVP has no centralized data model. Landing uses a tiny local metadata list to render links.

## Entities

### CaseMetadata (landing only)
- title: string
- slug: string
- createdAt: ISO date string
- tags?: string[]
- isTrending?: boolean

Notes:
- Each case is a static page under `/ux-cases/{slug}`.
- No persistence; values live in code for MVP.

