/**
 * Users API Route Handler
 * Returns active users and growth statistics
 *
 * This is the CORRECT pattern for data fetching in Next.js
 */

export const revalidate = 60; // ISR - revalidate every 60 seconds

export async function GET() {
  // Simulate API delay to make timing differences visible
  await new Promise(resolve => setTimeout(resolve, 1000));

  const data = {
    activeUsers: 1247,
    newToday: 89,
    growthTrend: 'up',
  };

  return Response.json(data);
}
