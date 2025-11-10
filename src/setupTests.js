// Import testing library matchers for Vitest
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.matchMedia for components that use media queries (e.g., styled-components responsive design)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver for components that use intersection observer
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Mock ResizeObserver for components that use resize observer
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock window.scrollTo for components that use scroll behavior
window.scrollTo = vi.fn();

// Mock HTMLMediaElement.play() for video elements
HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);

// Suppress console errors/warnings during tests (optional - remove if you want to see them)
// const originalError = console.error;
// beforeAll(() => {
//   console.error = (...args) => {
//     if (
//       typeof args[0] === 'string' &&
//       args[0].includes('Warning: ReactDOM.render')
//     ) {
//       return;
//     }
//     originalError.call(console, ...args);
//   };
// });

// afterAll(() => {
//   console.error = originalError;
// });

