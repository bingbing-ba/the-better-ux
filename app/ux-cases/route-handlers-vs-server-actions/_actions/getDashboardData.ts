'use server';

/**
 * Server Actions for Dashboard Data
 *
 * ⚠️ This is the WRONG pattern for data fetching!
 *
 * Server actions are designed for mutations (POST/PUT/DELETE), not data fetching.
 * Problems with this approach:
 * - No HTTP caching layer
 * - Not RESTful
 * - Can't be called from non-React contexts
 * - Invisible to browser DevTools network tab
 */

export async function getStats() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    views: 45234,
    conversions: 892,
    conversionRate: '1.97%',
  };
}

export async function getRevenue() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    total: 128450,
    growth: '+12.5%',
    currency: 'USD',
  };
}

export async function getUsers() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    activeUsers: 1247,
    newToday: 89,
    growthTrend: 'up' as const,
  };
}
