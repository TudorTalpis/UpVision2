import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { SERVICES, ADDONS } from '../data.js'

const here = dirname(fileURLToPath(import.meta.url))
const src = (p) => readFileSync(resolve(here, '../../', p), 'utf8')

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

  // Guard against off-positioning copy drifting back into shared/secondary UI
  // as a selectable/advertised offering (this is how it slipped in before).
  it('shared UI does not advertise branding/marketing/digitalization as offerings', () => {
    const banned = /['"](Branding|Marketing|Digitalization|UI\/UX)['"]/
    for (const f of ['components/Footer.jsx', 'pages/Contact.jsx', 'pages/About.jsx']) {
      expect(src(f)).not.toMatch(banned)
    }
  })
})
