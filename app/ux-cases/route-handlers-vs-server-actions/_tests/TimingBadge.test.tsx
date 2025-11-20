/**
 * TimingBadge component tests
 * Tests timestamp formatting, duration display, and loading states
 */

import { render, screen } from '@testing-library/react';
import { TimingBadge } from '../_components/TimingBadge';
import type { TimingInfo } from '../_types/dashboard';

describe('TimingBadge', () => {
  describe('Loading state', () => {
    it('should show loading indicator when respondedAt is undefined', () => {
      const timing: TimingInfo = {
        requestedAt: '2025-01-01T12:00:00.000Z',
      };

      render(<TimingBadge timing={timing} />);

      expect(screen.getByText(/requested/i)).toBeInTheDocument();
      expect(screen.queryByText(/responded/i)).not.toBeInTheDocument();
    });

    it('should show gray styling while loading', () => {
      const timing: TimingInfo = {
        requestedAt: '2025-01-01T12:00:00.000Z',
      };

      const { container } = render(<TimingBadge timing={timing} />);

      // Should have loading/gray state styling
      expect(container.firstChild).toHaveClass('text-gray-500');
    });
  });

  describe('Completed state', () => {
    it('should show duration when response is received', () => {
      const timing: TimingInfo = {
        requestedAt: '2025-01-01T12:00:00.000Z',
        respondedAt: '2025-01-01T12:00:01.000Z',
        duration: 1000,
      };

      render(<TimingBadge timing={timing} />);

      expect(screen.getByText(/1000ms/i)).toBeInTheDocument();
    });

    it('should show green styling when loaded', () => {
      const timing: TimingInfo = {
        requestedAt: '2025-01-01T12:00:00.000Z',
        respondedAt: '2025-01-01T12:00:01.000Z',
        duration: 1000,
      };

      const { container } = render(<TimingBadge timing={timing} />);

      // Should have success/green state styling
      expect(container.firstChild).toHaveClass('text-green-600');
    });

    it('should format duration correctly for various values', () => {
      const testCases = [
        { duration: 100, expected: '100ms' },
        { duration: 1000, expected: '1000ms' },
        { duration: 2500, expected: '2500ms' },
      ];

      testCases.forEach(({ duration, expected }) => {
        const timing: TimingInfo = {
          requestedAt: '2025-01-01T12:00:00.000Z',
          respondedAt: '2025-01-01T12:00:01.000Z',
          duration,
        };

        const { unmount } = render(<TimingBadge timing={timing} />);
        expect(screen.getByText(new RegExp(expected, 'i'))).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Detailed variant', () => {
    it('should show full timestamps in detailed variant', () => {
      const timing: TimingInfo = {
        requestedAt: '2025-01-01T12:00:00.123Z',
        respondedAt: '2025-01-01T12:00:01.456Z',
        duration: 1333,
      };

      render(<TimingBadge timing={timing} variant="detailed" />);

      // Should show formatted times - check for time pattern HH:MM:SS
      // The actual time depends on local timezone
      expect(screen.getByText(/Requested:/)).toBeInTheDocument();
      expect(screen.getByText(/Responded:/)).toBeInTheDocument();
      expect(screen.getByText(/1333ms/)).toBeInTheDocument();
    });
  });

  describe('Inline variant', () => {
    it('should show compact display in inline variant', () => {
      const timing: TimingInfo = {
        requestedAt: '2025-01-01T12:00:00.000Z',
        respondedAt: '2025-01-01T12:00:01.000Z',
        duration: 1000,
      };

      render(<TimingBadge timing={timing} variant="inline" />);

      // Should primarily show duration
      expect(screen.getByText(/1000ms/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have appropriate aria-label', () => {
      const timing: TimingInfo = {
        requestedAt: '2025-01-01T12:00:00.000Z',
        respondedAt: '2025-01-01T12:00:01.000Z',
        duration: 1000,
      };

      render(<TimingBadge timing={timing} />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveAttribute('aria-label');
    });
  });
});
