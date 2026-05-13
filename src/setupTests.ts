import "@testing-library/jest-dom";

// HeadlessUI v2 uses ResizeObserver internally; jsdom doesn't include it.
globalThis.ResizeObserver = class ResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
};
