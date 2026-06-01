import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import SplitText from '../SplitText.jsx'
import ScrambleText from '../ScrambleText.jsx'

describe('text effects', () => {
  it('SplitText renders the full text content split into spans', () => {
    const { container } = render(<SplitText text="Grow" by="char" />)
    expect(container.textContent.replace(/​/g, '')).toBe('Grow')
    expect(container.querySelectorAll('[data-piece]').length).toBe(4)
  })

  it('ScrambleText renders its final text in the DOM', () => {
    const { container } = render(<ScrambleText text="Moldova" />)
    expect(container.textContent).toContain('Moldova')
  })
})
