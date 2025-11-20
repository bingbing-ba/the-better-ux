import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Utility to create mock timing info
export function createMockTimingInfo(options?: {
  requestedAt?: string;
  respondedAt?: string;
  duration?: number;
}) {
  const now = new Date();
  const requestedAt = options?.requestedAt || now.toISOString();
  const respondedAt = options?.respondedAt;
  const duration = options?.duration;

  return {
    requestedAt,
    respondedAt,
    duration,
  };
}

// Utility to wait for a specific time with tolerance
export function expectTimingWithTolerance(
  actual: number,
  expected: number,
  toleranceMs: number = 100
) {
  expect(actual).toBeGreaterThanOrEqual(expected - toleranceMs);
  expect(actual).toBeLessThanOrEqual(expected + toleranceMs);
}

// Mock fetch for API route testing
export function mockFetch(responses: Record<string, unknown>) {
  global.fetch = jest.fn((url: string | URL | Request) => {
    const urlString = typeof url === 'string' ? url : url.toString();

    for (const [pattern, response] of Object.entries(responses)) {
      if (urlString.includes(pattern)) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(response),
        } as Response);
      }
    }

    return Promise.reject(new Error(`No mock for ${urlString}`));
  }) as jest.Mock;
}

// Reset fetch mock
export function resetFetchMock() {
  if (global.fetch && typeof (global.fetch as jest.Mock).mockReset === 'function') {
    (global.fetch as jest.Mock).mockReset();
  }
}
