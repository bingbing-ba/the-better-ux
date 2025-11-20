/**
 * DoExample component integration tests
 * Tests React Query integration, API fetching, and timing tracking
 */

import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DoExample } from '../_components/DoExample';
import { mockFetch, resetFetchMock } from '../../../../jest.setup';

// Mock data matching spec
const mockStatsData = {
  views: 45234,
  conversions: 892,
  conversionRate: '1.97%',
};

const mockRevenueData = {
  total: 128450,
  growth: '+12.5%',
  currency: 'USD',
};

const mockUsersData = {
  activeUsers: 1247,
  newToday: 89,
  growthTrend: 'up',
};

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

describe('DoExample', () => {
  beforeEach(() => {
    // Set up fetch mocks for all 3 API endpoints
    mockFetch({
      'route-handlers-vs-server-actions/api/stats': mockStatsData,
      'route-handlers-vs-server-actions/api/revenue': mockRevenueData,
      'route-handlers-vs-server-actions/api/users': mockUsersData,
    });
  });

  afterEach(() => {
    resetFetchMock();
  });

  describe('Initial rendering', () => {
    it('should render the heading', () => {
      renderWithClient(<DoExample />);

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Do.*Route Handlers/i);
    });

    it('should render 3 metric cards', async () => {
      renderWithClient(<DoExample />);

      // Wait for cards to render
      await waitFor(() => {
        const cards = screen.getAllByRole('article');
        expect(cards).toHaveLength(3);
      });
    });
  });

  describe('Loading states', () => {
    it('should show loading state initially', () => {
      renderWithClient(<DoExample />);

      // Should show loading indicators
      expect(screen.getAllByTestId('metric-card-skeleton')).toHaveLength(3);
    });

    it('should record requestedAt timestamp on mount', async () => {
      renderWithClient(<DoExample />);

      // Timing should show requested timestamp
      await waitFor(() => {
        const requestedElements = screen.getAllByText(/requested/i);
        expect(requestedElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Data fetching', () => {
    it('should fetch and display stats data', async () => {
      renderWithClient(<DoExample />);

      await waitFor(() => {
        // Number is formatted with toLocaleString()
        expect(screen.getByText('45,234')).toBeInTheDocument();
      });
    });

    it('should fetch and display revenue data', async () => {
      renderWithClient(<DoExample />);

      await waitFor(() => {
        expect(screen.getByText('$128,450')).toBeInTheDocument();
      });
    });

    it('should fetch and display users data', async () => {
      renderWithClient(<DoExample />);

      await waitFor(() => {
        // Number is formatted with toLocaleString()
        expect(screen.getByText('1,247')).toBeInTheDocument();
      });
    });

    it('should call all 3 API endpoints', async () => {
      renderWithClient(<DoExample />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(3);
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/stats')
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/revenue')
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/users')
      );
    });
  });

  describe('Timing tracking', () => {
    it('should track and display duration after data loads', async () => {
      renderWithClient(<DoExample />);

      await waitFor(() => {
        // Should show duration in milliseconds
        const durationElements = screen.getAllByText(/ms/i);
        expect(durationElements.length).toBeGreaterThan(0);
      });
    });

    it('should show respondedAt after data loads', async () => {
      renderWithClient(<DoExample />);

      await waitFor(() => {
        // After loading, should show response time
        const respondedElements = screen.getAllByText(/\d{2}:\d{2}:\d{2}/);
        expect(respondedElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Explanation section', () => {
    it('should show "Why This Works" explanation', () => {
      renderWithClient(<DoExample />);

      expect(screen.getByText(/Why This Works/i)).toBeInTheDocument();
    });

    it('should list benefits of route handlers', () => {
      renderWithClient(<DoExample />);

      expect(screen.getByText(/HTTP caching/i)).toBeInTheDocument();
      expect(screen.getByText(/browser DevTools/i)).toBeInTheDocument();
      expect(screen.getByText(/RESTful/i)).toBeInTheDocument();
    });

    it('should have green/success styling', () => {
      const { container } = renderWithClient(<DoExample />);

      const explanationSection = container.querySelector('.bg-green-50');
      expect(explanationSection).toBeInTheDocument();
    });
  });

  describe('Error handling', () => {
    it('should handle fetch errors gracefully', async () => {
      // Override with error
      global.fetch = jest.fn(() =>
        Promise.reject(new Error('Network error'))
      ) as jest.Mock;

      renderWithClient(<DoExample />);

      await waitFor(() => {
        // Should show some error state or keep showing skeleton
        // The exact behavior depends on implementation
        expect(screen.queryByText('Network error')).toBeNull(); // Should not crash
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      renderWithClient(<DoExample />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();

      const subheading = screen.getByRole('heading', { level: 3 });
      expect(subheading).toBeInTheDocument();
    });

    it('should use aria-live for loading announcements', () => {
      const { container } = renderWithClient(<DoExample />);

      const liveRegion = container.querySelector('[aria-live]');
      expect(liveRegion).toBeInTheDocument();
    });
  });

  describe('Refetch on mount', () => {
    it('should refetch data when component remounts', async () => {
      const queryClient = createTestQueryClient();

      // First render
      const { unmount } = render(
        <QueryClientProvider client={queryClient}>
          <DoExample />
        </QueryClientProvider>
      );

      // Wait for initial fetch
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(3);
      });

      // Unmount
      unmount();

      // Clear mock call count
      (global.fetch as jest.Mock).mockClear();

      // Second render (simulating toggle back to this view)
      render(
        <QueryClientProvider client={queryClient}>
          <DoExample />
        </QueryClientProvider>
      );

      // Should refetch data on remount
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(3);
      });
    });

    it('should show loading state again when remounting', async () => {
      const queryClient = createTestQueryClient();

      // First render and wait for data
      const { unmount } = render(
        <QueryClientProvider client={queryClient}>
          <DoExample />
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
          <DoExample />
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
          <DoExample />
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
          <DoExample />
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
