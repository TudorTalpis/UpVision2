import { describe, it, expect } from 'vitest'
import { SERVICES, ADDONS } from '../data.js'

describe('positioning', () => {
  it('primary services are the five web-dev offers', () => {
    expect(SERVICES.map((s) => s.slug)).toEqual([
      'custom-websites', 'landing-pages', 'business-websites', 'web-applications', 'ecommerce',
    ])
  })

  it('no primary service is branding/marketing/product-strategy', () => {
    const banned = /brand|marketing|product strategy|digitaliz/i
    for (const s of SERVICES) expect(s.title).not.toMatch(banned)
  })

  it('automation is only an add-on, never a primary service', () => {
    expect(SERVICES.some((s) => /automation/i.test(s.title))).toBe(false)
    expect(ADDONS.map((a) => a.title)).toContain('Business automation')
  })
})
