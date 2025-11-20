/**
 * DontExample component integration tests
 * Tests React Query integration with server actions and timing tracking
 */

import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DontExample } from '../_components/DontExample';

// Mock server actions
jest.mock('../_actions/getDashboardData', () => ({
  getStats: jest.fn(() =>
    Promise.resolve({
      views: 45234,
      conversions: 892,
      conversionRate: '1.97%',
    })
  ),
  getRevenue: jest.fn(() =>
    Promise.resolve({
      total: 128450,
      growth: '+12.5%',
      currency: 'USD',
    })
  ),
  getUsers: jest.fn(() =>
    Promise.resolve({
      activeUsers: 1247,
      newToday: 89,
      growthTrend: 'up',
    })
  ),
}));

import { getStats, getRevenue, getUsers } from '../_actions/getDashboardData';

// Helper to create a fresh QueryClient for each test
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
    },
  });
}

// Helper to render with QueryClient
function renderWithClient(ui: React.ReactElement) {
  const queryClient = createTestQueryClient();
  return {
    ...render(
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    ),
    queryClient,
  };
}

describe('DontExample', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial rendering', () => {
    it('should render the heading with warning style', () => {
      renderWithClient(<DontExample />);

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Don.*Server Actions/i);
    });

    it('should render 3 metric cards', async () => {
      renderWithClient(<DontExample />);

      await waitFor(() => {
        const cards = screen.getAllByRole('article');
        expect(cards).toHaveLength(3);
      });
    });
  });

  describe('Loading states', () => {
    it('should show loading state initially', () => {
      renderWithClient(<DontExample />);

      expect(screen.getAllByTestId('metric-card-skeleton')).toHaveLength(3);
    });

    it('should record requestedAt timestamp on mount', async () => {
      renderWithClient(<DontExample />);

      await waitFor(() => {
        const requestedElements = screen.getAllByText(/requested/i);
        expect(requestedElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Data fetching via server actions', () => {
    it('should call server actions and display stats data', async () => {
      renderWithClient(<DontExample />);

      await waitFor(() => {
        // Number is formatted with toLocaleString()
        expect(screen.getByText('45,234')).toBeInTheDocument();
      });

      expect(getStats).toHaveBeenCalled();
    });

    it('should fetch and display revenue data', async () => {
      renderWithClient(<DontExample />);

      await waitFor(() => {
        expect(screen.getByText('$128,450')).toBeInTheDocument();
      });

      expect(getRevenue).toHaveBeenCalled();
    });

    it('should fetch and display users data', async () => {
      renderWithClient(<DontExample />);

      await waitFor(() => {
        // Number is formatted with toLocaleString()
        expect(screen.getByText('1,247')).toBeInTheDocument();
      });

      expect(getUsers).toHaveBeenCalled();
    });

    it('should call all 3 server actions', async () => {
      renderWithClient(<DontExample />);

      await waitFor(() => {
        expect(getStats).toHaveBeenCalledTimes(1);
        expect(getRevenue).toHaveBeenCalledTimes(1);
        expect(getUsers).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Timing tracking', () => {
    it('should track and display duration after data loads', async () => {
      renderWithClient(<DontExample />);

      await waitFor(() => {
        const durationElements = screen.getAllByText(/ms/i);
        expect(durationElements.length).toBeGreaterThan(0);
      });
    });

    it('should show respondedAt after data loads', async () => {
      renderWithClient(<DontExample />);

      await waitFor(() => {
        const respondedElements = screen.getAllByText(/\d{2}:\d{2}:\d{2}/);
        expect(respondedElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Explanation section', () => {
    it('should show "Why This Is Wrong" explanation', () => {
      renderWithClient(<DontExample />);

      expect(screen.getByText(/Why This Is Wrong/i)).toBeInTheDocument();
    });

    it('should list problems with using server actions for data fetching', () => {
      renderWithClient(<DontExample />);

      expect(screen.getByText(/mutations/i)).toBeInTheDocument();
      expect(screen.getByText(/No caching mechanism/i)).toBeInTheDocument();
      expect(screen.getByText(/sequentially/i)).toBeInTheDocument();
    });

    it('should have red/warning styling', () => {
      const { container } = renderWithClient(<DontExample />);

      // Should have warning/red background
      const explanationSection = container.querySelector('.bg-red-50, .bg-orange-50');
      expect(explanationSection).toBeInTheDocument();
    });
  });

  describe('Error handling', () => {
    it('should handle server action errors gracefully', async () => {
      // Override with error
      (getStats as jest.Mock).mockRejectedValueOnce(new Error('Server error'));

      renderWithClient(<DontExample />);

      await waitFor(() => {
        // Should not crash the component
        expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      renderWithClient(<DontExample />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();

      const subheading = screen.getByRole('heading', { level: 3 });
      expect(subheading).toBeInTheDocument();
    });

    it('should use aria-live for loading announcements', () => {
      const { container } = renderWithClient(<DontExample />);

      const liveRegion = container.querySelector('[aria-live]');
      expect(liveRegion).toBeInTheDocument();
    });
  });

  describe('Styling differences from DoExample', () => {
    it('should use warning colors (red/orange) instead of success colors', () => {
      const { container } = renderWithClient(<DontExample />);

      // Should not have green colors, should have red/orange
      expect(container.querySelector('.bg-green-50')).not.toBeInTheDocument();
      expect(container.querySelector('.bg-red-50, .bg-orange-50')).toBeInTheDocument();
    });
  });

  describe('Refetch on mount', () => {
    it('should refetch data when component remounts', async () => {
      const queryClient = createTestQueryClient();

      // First render
      const { unmount } = render(
        <QueryClientProvider client={queryClient}>
          <DontExample />
        </QueryClientProvider>
      );

      // Wait for initial fetch
      await waitFor(() => {
        expect(getStats).toHaveBeenCalledTimes(1);
        expect(getRevenue).toHaveBeenCalledTimes(1);
        expect(getUsers).toHaveBeenCalledTimes(1);
      });

      // Unmount
      unmount();

      // Clear mock call counts
      (getStats as jest.Mock).mockClear();
      (getRevenue as jest.Mock).mockClear();
      (getUsers as jest.Mock).mockClear();

      // Second render (simulating toggle back to this view)
      render(
        <QueryClientProvider client={queryClient}>
          <DontExample />
        </QueryClientProvider>
      );

      // Should refetch data on remount
      await waitFor(() => {
        expect(getStats).toHaveBeenCalledTimes(1);
        expect(getRevenue).toHaveBeenCalledTimes(1);
        expect(getUsers).toHaveBeenCalledTimes(1);
      });
    });

    it('should show loading state again when remounting', async () => {
      const queryClient = createTestQueryClient();

      // First render and wait for data
      const { unmount } = render(
        <QueryClientProvider client={queryClient}>
          <DontExample />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('45,234')).toBeInTheDocument();
      });

      // Unmount
      unmount();

      // Second render
      render(
        <QueryClientProvider client={queryClient}>
          <DontExample />
        </QueryClientProvider>
      );

      // Should show loading state initially (refetching)
      expect(screen.getAllByTestId('metric-card-skeleton')).toHaveLength(3);
    });

    it('should reset timing info and show new duration on refetch', async () => {
      const queryClient = createTestQueryClient();

      // First render and wait for data
      const { unmount } = render(
        <QueryClientProvider client={queryClient}>
          <DontExample />
        </QueryClientProvider>
      );

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('45,234')).toBeInTheDocument();
      });

      // Should show duration after first load
      await waitFor(() => {
        const durationElements = screen.getAllByText(/ms/i);
        expect(durationElements.length).toBeGreaterThan(0);
      });

      // Unmount
      unmount();

      // Second render
      render(
        <QueryClientProvider client={queryClient}>
          <DontExample />
        </QueryClientProvider>
      );

      // Wait for refetch to complete
      await waitFor(() => {
        expect(screen.getByText('45,234')).toBeInTheDocument();
      });

      // Should show new duration (not 0ms from cached data)
      await waitFor(() => {
        const durationElements = screen.getAllByText(/\d+ms/i);
        expect(durationElements.length).toBeGreaterThan(0);
      });

      // Verify timing was recalculated (Requested/Responded timestamps should exist)
      expect(screen.getAllByText(/Requested:/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Responded:/i).length).toBeGreaterThan(0);
    });
  });
});
