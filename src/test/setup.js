import '@testing-library/jest-dom/vitest'

if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent() { return false },
  })
}

if (!window.IntersectionObserver) {
  window.IntersectionObserver = class {
    observe() {} unobserve() {} disconnect() {} takeRecords() { return [] }
  }
}
