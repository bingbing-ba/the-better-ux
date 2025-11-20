/**
 * TypeScript interfaces for dashboard data structures
 * Used by both Do (route handlers) and Don't (server actions) examples
 */

export interface StatsData {
  views: number;
  conversions: number;
  conversionRate: string;
}

export interface RevenueData {
  total: number;
  growth: string;
  currency: string;
}

export interface UsersData {
  activeUsers: number;
  newToday: number;
  growthTrend: 'up' | 'down' | 'stable';
}

export interface TimingInfo {
  requestedAt: string;   // ISO timestamp
  respondedAt?: string;  // ISO timestamp (undefined while loading)
  duration?: number;     // milliseconds
}

export interface MetricCardProps {
  title: string;
  icon: React.ReactNode;
  value: string | number;
  subtitle?: string;
  timing: TimingInfo;
  isLoading?: boolean;
}

export interface TimingBadgeProps {
  timing: TimingInfo;
  variant?: 'inline' | 'detailed';
}
