/**
 * DashboardSkeleton component tests
 * Tests skeleton rendering for loading states
 */

import { render, screen } from '@testing-library/react';
import { DashboardSkeleton } from '../_components/DashboardSkeleton';

describe('DashboardSkeleton', () => {
  describe('Rendering', () => {
    it('should render 3 skeleton cards', () => {
      render(<DashboardSkeleton />);

      const skeletonCards = screen.getAllByTestId('skeleton-card');
      expect(skeletonCards).toHaveLength(3);
    });

    it('should have pulse animation on each card', () => {
      render(<DashboardSkeleton />);

      const skeletonCards = screen.getAllByTestId('skeleton-card');
      skeletonCards.forEach((card) => {
        expect(card).toHaveClass('animate-pulse');
      });
    });

    it('should show title skeleton placeholder', () => {
      render(<DashboardSkeleton />);

      const titleSkeletons = screen.getAllByTestId('skeleton-title');
      expect(titleSkeletons).toHaveLength(3);
    });

    it('should show value skeleton placeholder', () => {
      render(<DashboardSkeleton />);

      const valueSkeletons = screen.getAllByTestId('skeleton-value');
      expect(valueSkeletons).toHaveLength(3);
    });
  });

  describe('Layout', () => {
    it('should have grid layout for 3 columns on desktop', () => {
      const { container } = render(<DashboardSkeleton />);

      const grid = container.firstChild;
      expect(grid).toHaveClass('grid');
      expect(grid).toHaveClass('grid-cols-1');
      expect(grid).toHaveClass('md:grid-cols-3');
      expect(grid).toHaveClass('gap-6');
    });

    it('should have card styling on skeleton cards', () => {
      render(<DashboardSkeleton />);

      const skeletonCards = screen.getAllByTestId('skeleton-card');
      skeletonCards.forEach((card) => {
        expect(card).toHaveClass('border');
        expect(card).toHaveClass('rounded-lg');
        expect(card).toHaveClass('p-6');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have aria-busy attribute', () => {
      const { container } = render(<DashboardSkeleton />);

      expect(container.firstChild).toHaveAttribute('aria-busy', 'true');
    });

    it('should have aria-label for screen readers', () => {
      const { container } = render(<DashboardSkeleton />);

      expect(container.firstChild).toHaveAttribute('aria-label', 'Loading dashboard metrics');
    });
  });
});
