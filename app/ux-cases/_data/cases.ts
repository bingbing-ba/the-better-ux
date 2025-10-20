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
    title: "Slack doesn’t ship gray boxes. You shouldn’t either.",
    slug: 'image-loading-blurhash',
    createdAt: '2025-10-19',
    tags: ['images', 'loading'],
    isTrending: false,
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

