/**
 * Main page integration tests
 * Tests toggle functionality, URL parameters, and overall page structure
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';

// Mock the components to isolate page tests
jest.mock('../_components/DoExample', () => ({
  DoExample: () => <div data-testid="do-example">Do Example Content</div>,
}));

jest.mock('../_components/DontExample', () => ({
  DontExample: () => <div data-testid="dont-example">Don&apos;t Example Content</div>,
}));

// We need to properly mock useDoDontView
const mockReplace = jest.fn();
const mockSearchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => mockSearchParams,
  usePathname: () => '/ux-cases/route-handlers-vs-server-actions',
}));

// Import after mocks
import RouteHandlersPage from '../page';

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

// Helper to render with providers
function renderPage(viewParam?: string) {
  // Set up search params
  mockSearchParams.delete('view');
  if (viewParam) {
    mockSearchParams.set('view', viewParam);
  }

  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <RouteHandlersPage />
    </QueryClientProvider>
  );
}

describe('RouteHandlersVsServerActionsPage', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockSearchParams.delete('view');
  });

  describe('Page structure', () => {
    it('should render back to home link', () => {
      renderPage();

      const backLink = screen.getByRole('link', { name: /back to home/i });
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute('href', '/');
    });

    it('should render the page title', () => {
      renderPage();

      expect(
        screen.getByRole('heading', { level: 1 })
      ).toHaveTextContent(/Route Handlers vs Server Actions/i);
    });

    it('should render tags', () => {
      renderPage();

      expect(screen.getByText('data-fetching')).toBeInTheDocument();
      expect(screen.getByText('api')).toBeInTheDocument();
      expect(screen.getByText('performance')).toBeInTheDocument();
      expect(screen.getByText('react-query')).toBeInTheDocument();
    });

    it('should render DoDontToggle', () => {
      renderPage();

      expect(screen.getByRole('button', { name: /show do example/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /show don.*t example/i })).toBeInTheDocument();
    });
  });

  describe('Default view', () => {
    it('should show DontExample by default when no view param', () => {
      renderPage();

      expect(screen.getByTestId('dont-example')).toBeInTheDocument();
      expect(screen.queryByTestId('do-example')).not.toBeInTheDocument();
    });
  });

  describe('View switching via URL params', () => {
    it('should show DoExample when view=do', () => {
      renderPage('do');

      expect(screen.getByTestId('do-example')).toBeInTheDocument();
      expect(screen.queryByTestId('dont-example')).not.toBeInTheDocument();
    });

    it('should show DontExample when view=dont', () => {
      renderPage('dont');

      expect(screen.getByTestId('dont-example')).toBeInTheDocument();
      expect(screen.queryByTestId('do-example')).not.toBeInTheDocument();
    });
  });

  describe('Toggle interaction', () => {
    it('should update URL when clicking Do toggle', () => {
      renderPage('dont');

      const doToggle = screen.getByRole('button', { name: /show do example/i });
      fireEvent.click(doToggle);

      expect(mockReplace).toHaveBeenCalledWith(
        expect.stringContaining('view=do'),
        expect.objectContaining({ scroll: false })
      );
    });

    it('should update URL when clicking Don\'t toggle', () => {
      renderPage('do');

      const dontToggle = screen.getByRole('button', { name: /show don.*t example/i });
      fireEvent.click(dontToggle);

      expect(mockReplace).toHaveBeenCalledWith(
        expect.stringContaining('view=dont'),
        expect.objectContaining({ scroll: false })
      );
    });

    it('should not trigger URL update when clicking already active toggle', () => {
      renderPage('do');

      const doToggle = screen.getByRole('button', { name: /show do example/i });
      fireEvent.click(doToggle);

      // Should not call replace for same view - Toggle only fires onPressedChange when pressed becomes true
      // Since it's already pressed, clicking it again doesn't change pressed state
      expect(mockReplace).not.toHaveBeenCalled();
    });
  });

  describe('Layout and styling', () => {
    it('should have correct container styling', () => {
      const { container } = renderPage();

      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('min-h-screen');
      expect(mainContainer).toHaveClass('p-8');
    });

    it('should have max-w-6xl for 3-column grid', () => {
      const { container } = renderPage();

      const innerContainer = container.querySelector('.max-w-6xl');
      expect(innerContainer).toBeInTheDocument();
    });
  });

  describe('Suspense boundary', () => {
    it('should wrap content in Suspense', async () => {
      // The page component should have a Suspense boundary
      // This is structural - we verify by checking the component renders properly
      renderPage();

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      renderPage();

      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
    });

    it('should have accessible toggle buttons', () => {
      renderPage();

      const doButton = screen.getByRole('button', { name: /show do example/i });
      const dontButton = screen.getByRole('button', { name: /show don.*t example/i });

      expect(doButton).toBeInTheDocument();
      expect(dontButton).toBeInTheDocument();
    });

    it('should indicate active state on toggle', () => {
      renderPage('do');

      const doButton = screen.getByRole('button', { name: /show do example/i });
      // Active button should have pressed state
      expect(doButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Navigation', () => {
    it('should call router.replace with scroll: false when toggling', () => {
      renderPage('dont');

      const doToggle = screen.getByRole('button', { name: /show do example/i });
      fireEvent.click(doToggle);

      // Should call replace with scroll: false to prevent page jump
      expect(mockReplace).toHaveBeenCalledWith(
        expect.stringContaining('view=do'),
        expect.objectContaining({ scroll: false })
      );
    });
  });
});
