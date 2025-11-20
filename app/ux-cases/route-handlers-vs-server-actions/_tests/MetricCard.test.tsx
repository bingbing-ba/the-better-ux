/**
 * MetricCard component tests
 * Tests data rendering, loading states, and timing display
 */

import { render, screen } from '@testing-library/react';
import { MetricCard } from '../_components/MetricCard';
import type { TimingInfo } from '../_types/dashboard';

// Mock icon component
const MockIcon = () => <svg data-testid="mock-icon" />;

describe('MetricCard', () => {
  const defaultTiming: TimingInfo = {
    requestedAt: '2025-01-01T12:00:00.000Z',
    respondedAt: '2025-01-01T12:00:01.000Z',
    duration: 1000,
  };

  describe('Data rendering', () => {
    it('should render title and numeric value', () => {
      render(
        <MetricCard
          title="Total Views"
          icon={<MockIcon />}
          value={45234}
          timing={defaultTiming}
        />
      );

      expect(screen.getByText('Total Views')).toBeInTheDocument();
      // Number is formatted with toLocaleString()
      expect(screen.getByText('45,234')).toBeInTheDocument();
    });

    it('should render string value', () => {
      render(
        <MetricCard
          title="Conversion Rate"
          icon={<MockIcon />}
          value="1.97%"
          timing={defaultTiming}
        />
      );

      expect(screen.getByText('1.97%')).toBeInTheDocument();
    });

    it('should render subtitle when provided', () => {
      render(
        <MetricCard
          title="Revenue"
          icon={<MockIcon />}
          value={128450}
          subtitle="+12.5% from last month"
          timing={defaultTiming}
        />
      );

      expect(screen.getByText('+12.5% from last month')).toBeInTheDocument();
    });

    it('should render icon', () => {
      render(
        <MetricCard
          title="Stats"
          icon={<MockIcon />}
          value={100}
          timing={defaultTiming}
        />
      );

      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });
  });

  describe('Loading state', () => {
    it('should show skeleton when isLoading is true', () => {
      const loadingTiming: TimingInfo = {
        requestedAt: '2025-01-01T12:00:00.000Z',
      };

      render(
        <MetricCard
          title="Stats"
          icon={<MockIcon />}
          value={0}
          timing={loadingTiming}
          isLoading={true}
        />
      );

      // Should show skeleton animation element
      const skeleton = screen.getByTestId('metric-card-skeleton');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('animate-pulse');
    });

    it('should not show value when loading', () => {
      const loadingTiming: TimingInfo = {
        requestedAt: '2025-01-01T12:00:00.000Z',
      };

      render(
        <MetricCard
          title="Stats"
          icon={<MockIcon />}
          value={45234}
          timing={loadingTiming}
          isLoading={true}
        />
      );

      // Value should not be visible in loading state
      expect(screen.queryByText('45234')).not.toBeInTheDocument();
    });

    it('should still show title when loading', () => {
      const loadingTiming: TimingInfo = {
        requestedAt: '2025-01-01T12:00:00.000Z',
      };

      render(
        <MetricCard
          title="Stats"
          icon={<MockIcon />}
          value={0}
          timing={loadingTiming}
          isLoading={true}
        />
      );

      expect(screen.getByText('Stats')).toBeInTheDocument();
    });
  });

  describe('Timing display', () => {
    it('should display timing information inline', () => {
      render(
        <MetricCard
          title="Stats"
          icon={<MockIcon />}
          value={45234}
          timing={defaultTiming}
        />
      );

      // Should show duration
      expect(screen.getByText(/1000ms/i)).toBeInTheDocument();
    });

    it('should display timing info during loading state', () => {
      const loadingTiming: TimingInfo = {
        requestedAt: '2025-01-01T12:00:00.000Z',
      };

      render(
        <MetricCard
          title="Stats"
          icon={<MockIcon />}
          value={0}
          timing={loadingTiming}
          isLoading={true}
        />
      );

      // Should show that request was made
      expect(screen.getByText(/requested/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have role="article" and aria-label', () => {
      render(
        <MetricCard
          title="Stats"
          icon={<MockIcon />}
          value={45234}
          timing={defaultTiming}
        />
      );

      const card = screen.getByRole('article');
      expect(card).toHaveAttribute('aria-label', 'Stats metric card');
    });

    it('should announce loading state', () => {
      const loadingTiming: TimingInfo = {
        requestedAt: '2025-01-01T12:00:00.000Z',
      };

      render(
        <MetricCard
          title="Stats"
          icon={<MockIcon />}
          value={0}
          timing={loadingTiming}
          isLoading={true}
        />
      );

      // Should have aria-live for dynamic content
      const loadingIndicator = screen.getByLabelText(/loading/i);
      expect(loadingIndicator).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have card styling', () => {
      const { container } = render(
        <MetricCard
          title="Stats"
          icon={<MockIcon />}
          value={45234}
          timing={defaultTiming}
        />
      );

      // Should have border, rounded corners, and padding
      const card = container.firstChild;
      expect(card).toHaveClass('border');
      expect(card).toHaveClass('rounded-lg');
      expect(card).toHaveClass('p-6');
    });
  });
});
