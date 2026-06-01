import { describe, it, expect } from 'vitest'
import { localBusinessLd, faqLd, hreflangFor } from '../seo.js'

describe('seo builders', () => {
  it('localBusiness JSON-LD targets Moldova', () => {
    const ld = localBusinessLd()
    expect(ld['@type']).toBe('LocalBusiness')
    expect(ld.address.addressCountry).toBe('MD')
    expect(JSON.stringify(ld)).toMatch(/Moldova|Chișinău|Chisinau/)
  })

  it('faqLd builds a FAQPage from pairs', () => {
    const ld = faqLd([['Q1', 'A1']])
    expect(ld['@type']).toBe('FAQPage')
    expect(ld.mainEntity[0].acceptedAnswer.text).toBe('A1')
  })

  it('hreflangFor returns en/ro/ru + x-default', () => {
    const alts = hreflangFor('/services')
    expect(alts.map((a) => a.hreflang).sort()).toEqual(['en', 'ro', 'ru', 'x-default'])
  })
})
