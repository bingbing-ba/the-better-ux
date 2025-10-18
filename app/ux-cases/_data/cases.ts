/**
 * Case metadata for landing list
 * Each case is its own page component under /ux-cases/[slug]
 */

export interface CaseMetadata {
  title: string;
  slug: string;
  createdAt: string; // ISO date string
  tags?: string[];
  isTrending?: boolean;
}

export const cases: CaseMetadata[] = [
  {
    title: 'Image Loading with Blurhash',
    slug: 'image-loading-blurhash',
    createdAt: '2025-01-27',
    tags: ['images', 'loading', 'performance'],
    isTrending: true,
  },
];

/**
 * Get cases sorted by newest first
 */
export function getCasesSortedByDate(): CaseMetadata[] {
  return [...cases].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Get new cases (created within last 30 days)
 */
export function getNewCases(): CaseMetadata[] {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return getCasesSortedByDate().filter(
    c => new Date(c.createdAt) >= thirtyDaysAgo
  );
}

/**
 * Get trending cases (manually curated)
 */
export function getTrendingCases(): CaseMetadata[] {
  return getCasesSortedByDate().filter(c => c.isTrending);
}

