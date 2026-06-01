import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Reveal } from '../Primitives.jsx'

describe('Reveal (reduced motion)', () => {
  it('renders children visible (no opacity:0 lock) when reduced motion is on', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation((q) => ({
      matches: /reduce/.test(q), media: q, addEventListener() {}, removeEventListener() {},
    }))
    render(<Reveal>hello world</Reveal>)
    const el = screen.getByText('hello world')
    expect(el.style.opacity === '' || el.style.opacity === '1').toBe(true)
  })
})
