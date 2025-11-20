/**
 * Stats API Route Handler
 * Returns view and conversion statistics
 *
 * This is the CORRECT pattern for data fetching in Next.js
 */

export const revalidate = 60; // ISR - revalidate every 60 seconds

export async function GET() {
  // Simulate API delay to make timing differences visible
  await new Promise(resolve => setTimeout(resolve, 1000));

  const data = {
    views: 45234,
    conversions: 892,
    conversionRate: '1.97%',
  };

  return Response.json(data);
}
