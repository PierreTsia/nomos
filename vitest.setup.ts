import '@testing-library/jest-dom/vitest'

/**
 * Radix (`Select`, `Popper`…) measures its nodes with `ResizeObserver`, which jsdom does
 * not provide. An inert shim is enough: the tests do not depend on the measurements.
 */
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver
