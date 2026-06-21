import '@testing-library/jest-dom';
// Setting up any global mocks for browser environment
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
