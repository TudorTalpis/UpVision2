import { describe, it, expect, vi } from 'vitest'
import { prefersReduced, connectLenis } from '../gsap.js'

describe('gsap core', () => {
  it('prefersReduced reflects matchMedia', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true, addEventListener() {}, removeEventListener() {} })
    expect(prefersReduced()).toBe(true)
  })

  it('connectLenis subscribes to scroll and returns a disposer', () => {
    const handlers = []
    const lenis = { on: (e, fn) => handlers.push(fn), off: vi.fn() }
    const dispose = connectLenis(lenis)
    expect(handlers.length).toBe(1)
    expect(typeof dispose).toBe('function')
    dispose()
    expect(lenis.off).toHaveBeenCalled()
  })
})
