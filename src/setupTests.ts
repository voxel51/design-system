import "@testing-library/jest-dom";

// HeadlessUI v2 uses ResizeObserver internally; jsdom doesn't include it.
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
