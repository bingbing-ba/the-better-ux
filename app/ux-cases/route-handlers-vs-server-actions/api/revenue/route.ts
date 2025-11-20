/**
 * Revenue API Route Handler
 * Returns revenue and growth statistics
 *
 * This is the CORRECT pattern for data fetching in Next.js
 */

export const revalidate = 60; // ISR - revalidate every 60 seconds

export async function GET() {
  // Simulate API delay to make timing differences visible
  await new Promise(resolve => setTimeout(resolve, 1000));

  const data = {
    total: 128450,
    growth: '+12.5%',
    currency: 'USD',
  };

  return Response.json(data);
}
