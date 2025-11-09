import type { Article } from './ArticleCard';

/**
 * Mock article data for demo purposes
 */
const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Understanding React Server Components',
    authorName: 'Jane Smith',
    thumbnailUrl: 'https://picsum.photos/seed/article1/200/200',
    excerpt: 'A deep dive into how React Server Components work and why they matter for modern web development.',
  },
  {
    id: '2',
    title: 'Building Accessible UIs with Shadcn',
    authorName: 'John Doe',
    thumbnailUrl: 'https://picsum.photos/seed/article2/200/200',
    excerpt: 'Learn how to create fully accessible user interfaces using Shadcn UI components and best practices.',
  },
  {
    id: '3',
    title: 'Optimizing Next.js Performance',
    authorName: 'Alice Johnson',
    thumbnailUrl: 'https://picsum.photos/seed/article3/200/200',
    excerpt: 'Practical tips and techniques for improving the performance of your Next.js applications.',
  },
  {
    id: '4',
    title: 'TypeScript Design Patterns',
    authorName: 'Bob Williams',
    thumbnailUrl: 'https://picsum.photos/seed/article4/200/200',
    excerpt: 'Explore common design patterns and how to implement them effectively in TypeScript projects.',
  },
  {
    id: '5',
    title: 'Modern CSS Layout Techniques',
    authorName: 'Carol Martinez',
    thumbnailUrl: 'https://picsum.photos/seed/article5/200/200',
    excerpt: 'Master Flexbox, Grid, and other modern CSS layout approaches for responsive designs.',
  },
  {
    id: '6',
    title: 'State Management in React',
    authorName: 'David Lee',
    thumbnailUrl: 'https://picsum.photos/seed/article6/200/200',
    excerpt: 'Compare different state management solutions and choose the right one for your application.',
  },
  {
    id: '7',
    title: 'Web Performance Metrics',
    authorName: 'Emma Davis',
    thumbnailUrl: 'https://picsum.photos/seed/article7/200/200',
    excerpt: 'Understand Core Web Vitals and other key metrics that impact user experience.',
  },
  {
    id: '8',
    title: 'Building Design Systems',
    authorName: 'Frank Wilson',
    thumbnailUrl: 'https://picsum.photos/seed/article8/200/200',
    excerpt: 'A comprehensive guide to creating and maintaining effective design systems.',
  },
  {
    id: '9',
    title: 'API Design Best Practices',
    authorName: 'Grace Taylor',
    thumbnailUrl: 'https://picsum.photos/seed/article9/200/200',
    excerpt: 'Learn how to design RESTful and GraphQL APIs that are maintainable and developer-friendly.',
  },
  {
    id: '10',
    title: 'Testing React Applications',
    authorName: 'Henry Anderson',
    thumbnailUrl: 'https://picsum.photos/seed/article10/200/200',
    excerpt: 'Strategies for unit testing, integration testing, and E2E testing in React applications.',
  },
];

/**
 * Fetch articles with optional seed for deterministic ordering.
 * 
 * Example seeds:
 * - "test123" → deterministic selection for automated tests
 * - "demo" → fixed demo set for screenshots
 * - undefined → random shuffle for live demos
 */
export async function fetchArticles(seed?: string): Promise<Article[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 400));

  // Shuffle for variance between reloads (unless seed provided)
  if (!seed) {
    const shuffled = [...MOCK_ARTICLES];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 6);
  }

  // Deterministic selection when seed is provided
  const seedNum = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const startIdx = seedNum % MOCK_ARTICLES.length;
  const selected = [];
  for (let i = 0; i < 6; i++) {
    selected.push(MOCK_ARTICLES[(startIdx + i) % MOCK_ARTICLES.length]);
  }
  return selected;
}

