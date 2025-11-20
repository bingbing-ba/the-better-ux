/**
 * Type definition tests for dashboard data structures
 * These tests verify that the TypeScript interfaces match the spec requirements
 */

import type {
  StatsData,
  RevenueData,
  UsersData,
  TimingInfo,
  MetricCardProps,
} from '../_types/dashboard';

describe('Dashboard Types', () => {
  describe('StatsData', () => {
    it('should accept valid stats data', () => {
      const stats: StatsData = {
        views: 45234,
        conversions: 892,
        conversionRate: '1.97%',
      };

      expect(stats.views).toBe(45234);
      expect(stats.conversions).toBe(892);
      expect(stats.conversionRate).toBe('1.97%');
    });
  });

  describe('RevenueData', () => {
    it('should accept valid revenue data', () => {
      const revenue: RevenueData = {
        total: 128450,
        growth: '+12.5%',
        currency: 'USD',
      };

      expect(revenue.total).toBe(128450);
      expect(revenue.growth).toBe('+12.5%');
      expect(revenue.currency).toBe('USD');
    });
  });

  describe('UsersData', () => {
    it('should accept valid users data', () => {
      const users: UsersData = {
        activeUsers: 1247,
        newToday: 89,
        growthTrend: 'up',
      };

      expect(users.activeUsers).toBe(1247);
      expect(users.newToday).toBe(89);
      expect(users.growthTrend).toBe('up');
    });

    it('should accept all growth trend values', () => {
      const trendsToTest: Array<'up' | 'down' | 'stable'> = ['up', 'down', 'stable'];

      trendsToTest.forEach((trend) => {
        const users: UsersData = {
          activeUsers: 100,
          newToday: 10,
          growthTrend: trend,
        };
        expect(users.growthTrend).toBe(trend);
      });
    });
  });

  describe('TimingInfo', () => {
    it('should accept timing with all fields populated', () => {
      const timing: TimingInfo = {
        requestedAt: '2025-01-01T12:00:00.000Z',
        respondedAt: '2025-01-01T12:00:01.000Z',
        duration: 1000,
      };

      expect(timing.requestedAt).toBe('2025-01-01T12:00:00.000Z');
      expect(timing.respondedAt).toBe('2025-01-01T12:00:01.000Z');
      expect(timing.duration).toBe(1000);
    });

    it('should accept timing with optional fields undefined (loading state)', () => {
      const timing: TimingInfo = {
        requestedAt: '2025-01-01T12:00:00.000Z',
      };

      expect(timing.requestedAt).toBe('2025-01-01T12:00:00.000Z');
      expect(timing.respondedAt).toBeUndefined();
      expect(timing.duration).toBeUndefined();
    });
  });

  describe('MetricCardProps', () => {
    it('should accept valid metric card props', () => {
      const props: MetricCardProps = {
        title: 'Stats',
        icon: null, // React.ReactNode can be null
        value: 45234,
        subtitle: '+12.5% from last month',
        timing: {
          requestedAt: '2025-01-01T12:00:00.000Z',
          respondedAt: '2025-01-01T12:00:01.000Z',
          duration: 1000,
        },
        isLoading: false,
      };

      expect(props.title).toBe('Stats');
      expect(props.value).toBe(45234);
      expect(props.subtitle).toBe('+12.5% from last month');
      expect(props.isLoading).toBe(false);
    });

    it('should accept string values', () => {
      const props: MetricCardProps = {
        title: 'Conversion Rate',
        icon: null,
        value: '1.97%',
        timing: {
          requestedAt: '2025-01-01T12:00:00.000Z',
        },
      };

      expect(props.value).toBe('1.97%');
    });

    it('should accept loading state without subtitle', () => {
      const props: MetricCardProps = {
        title: 'Revenue',
        icon: null,
        value: 0,
        timing: {
          requestedAt: '2025-01-01T12:00:00.000Z',
        },
        isLoading: true,
      };

      expect(props.isLoading).toBe(true);
      expect(props.subtitle).toBeUndefined();
    });
  });
});
