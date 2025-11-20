'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Eye, DollarSign, Users } from 'lucide-react';
import { MetricCard } from './MetricCard';
import type { StatsData, RevenueData, UsersData, TimingInfo } from '../_types/dashboard';

/**
 * DoExample component
 * Demonstrates the CORRECT pattern: Using API route handlers for data fetching
 */
export function DoExample() {
  // Track request timestamps for each query
  const [statsRequested, setStatsRequested] = useState<string>('');
  const [revenueRequested, setRevenueRequested] = useState<string>('');
  const [usersRequested, setUsersRequested] = useState<string>('');

  // Track response timestamps
  const [statsResponded, setStatsResponded] = useState<string>('');
  const [revenueResponded, setRevenueResponded] = useState<string>('');
  const [usersResponded, setUsersResponded] = useState<string>('');

  // Track previous fetching state to detect transitions
  const [prevStatsFetching, setPrevStatsFetching] = useState<boolean>(true);
  const [prevRevenueFetching, setPrevRevenueFetching] = useState<boolean>(true);
  const [prevUsersFetching, setPrevUsersFetching] = useState<boolean>(true);

  // Set initial request timestamps on mount
  useEffect(() => {
    const now = new Date().toISOString();
    setStatsRequested(now);
    setRevenueRequested(now);
    setUsersRequested(now);
  }, []);

  // Stats query
  const statsQuery = useQuery<StatsData>({
    queryKey: ['stats', 'route-handler'],
    queryFn: async () => {
      const res = await fetch('/ux-cases/route-handlers-vs-server-actions/api/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    },
    refetchOnMount: 'always', // Refetch when toggle switches views
  });

  // Revenue query
  const revenueQuery = useQuery<RevenueData>({
    queryKey: ['revenue', 'route-handler'],
    queryFn: async () => {
      const res = await fetch('/ux-cases/route-handlers-vs-server-actions/api/revenue');
      if (!res.ok) throw new Error('Failed to fetch revenue');
      return res.json();
    },
    refetchOnMount: 'always', // Refetch when toggle switches views
  });

  // Users query
  const usersQuery = useQuery<UsersData>({
    queryKey: ['users', 'route-handler'],
    queryFn: async () => {
      const res = await fetch('/ux-cases/route-handlers-vs-server-actions/api/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      return res.json();
    },
    refetchOnMount: 'always', // Refetch when toggle switches views
  });

  // Track response times - detect when fetching transitions from true to false
  useEffect(() => {
    // When fetching starts, reset responded time and record request time
    if (statsQuery.isFetching && !prevStatsFetching) {
      setStatsRequested(new Date().toISOString());
      setStatsResponded('');
    }
    // When fetching completes, record response time
    if (!statsQuery.isFetching && prevStatsFetching && statsQuery.data) {
      setStatsResponded(new Date().toISOString());
    }
    setPrevStatsFetching(statsQuery.isFetching);
  }, [statsQuery.isFetching, statsQuery.data, prevStatsFetching]);

  useEffect(() => {
    if (revenueQuery.isFetching && !prevRevenueFetching) {
      setRevenueRequested(new Date().toISOString());
      setRevenueResponded('');
    }
    if (!revenueQuery.isFetching && prevRevenueFetching && revenueQuery.data) {
      setRevenueResponded(new Date().toISOString());
    }
    setPrevRevenueFetching(revenueQuery.isFetching);
  }, [revenueQuery.isFetching, revenueQuery.data, prevRevenueFetching]);

  useEffect(() => {
    if (usersQuery.isFetching && !prevUsersFetching) {
      setUsersRequested(new Date().toISOString());
      setUsersResponded('');
    }
    if (!usersQuery.isFetching && prevUsersFetching && usersQuery.data) {
      setUsersResponded(new Date().toISOString());
    }
    setPrevUsersFetching(usersQuery.isFetching);
  }, [usersQuery.isFetching, usersQuery.data, prevUsersFetching]);

  // Calculate durations
  const calculateDuration = (requested: string, responded: string): number | undefined => {
    if (!requested || !responded) return undefined;
    return new Date(responded).getTime() - new Date(requested).getTime();
  };

  const statsTiming: TimingInfo = {
    requestedAt: statsRequested,
    respondedAt: statsResponded || undefined,
    duration: calculateDuration(statsRequested, statsResponded),
  };

  const revenueTiming: TimingInfo = {
    requestedAt: revenueRequested,
    respondedAt: revenueResponded || undefined,
    duration: calculateDuration(revenueRequested, revenueResponded),
  };

  const usersTiming: TimingInfo = {
    requestedAt: usersRequested,
    respondedAt: usersResponded || undefined,
    duration: calculateDuration(usersRequested, usersResponded),
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-green-700 mb-6">
        Do: Use Route Handlers for Data Fetching
      </h2>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" aria-live="polite">
        <MetricCard
          title="Total Views"
          icon={<Eye className="h-5 w-5" />}
          value={statsQuery.data?.views ?? 0}
          subtitle={`${statsQuery.data?.conversionRate ?? '0%'} conversion rate`}
          timing={statsTiming}
          isLoading={statsQuery.isFetching}
        />

        <MetricCard
          title="Revenue"
          icon={<DollarSign className="h-5 w-5" />}
          value={revenueQuery.data?.total ?? 0}
          subtitle={`${revenueQuery.data?.growth ?? '+0%'} from last month`}
          timing={revenueTiming}
          isLoading={revenueQuery.isFetching}
        />

        <MetricCard
          title="Active Users"
          icon={<Users className="h-5 w-5" />}
          value={usersQuery.data?.activeUsers ?? 0}
          subtitle={`${usersQuery.data?.newToday ?? 0} new today`}
          timing={usersTiming}
          isLoading={usersQuery.isFetching}
        />
      </div>

      {/* Explanation */}
      <div className="p-6 bg-green-50 rounded-lg border border-green-200">
        <h3 className="text-lg font-semibold text-green-800 mb-4">Why This Works</h3>
        <ul className="space-y-2 text-green-700">
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">&#10003;</span>
            Route handlers support GET requests optimized for data fetching
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">&#10003;</span>
            HTTP caching with revalidate - responses can be cached at CDN level
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">&#10003;</span>
            Multiple requests run in parallel for better performance
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">&#10003;</span>
            Visible in browser DevTools network tab for debugging
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">&#10003;</span>
            Can be called from anywhere - external apps, webhooks, or React
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">&#10003;</span>
            RESTful API pattern - follows web standards
          </li>
        </ul>
      </div>
    </div>
  );
}
