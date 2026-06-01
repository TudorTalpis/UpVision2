# UpVision Revamp — Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition UpVision as a custom web development studio and replace the static, play-once motion with a GSAP ScrollTrigger system that is reversible by default, including an interactive "watch a website get built" storytelling scene — built i18n-ready in English, with Moldova SEO foundations and ≥90 Lighthouse.

**Architecture:** Content stays file-based (`src/lib/data.js`) but is wrapped behind an i18n dictionary layer (`src/lib/i18n/`) so Phase 2 can add RO/RU without touching components. GSAP owns scroll-triggered + scrubbed motion via a single registration module (`src/lib/gsap.js`) synced to the existing Lenis instance; Framer Motion is retained only for route transitions, the mobile menu, the accordion, and the cursor. SEO helpers become locale-aware and emit Organization/LocalBusiness/Service/FAQ/Breadcrumb JSON-LD.

**Tech Stack:** React 18, Vite 5, Tailwind 4, GSAP 3.13+ (ScrollTrigger, SplitText), Lenis, Framer Motion, react-router-dom 6, Vitest + @testing-library/react + jsdom (added here for pure-logic TDD).

**Reference spec:** `docs/superpowers/specs/2026-06-01-upvision-revamp-design.md`

**Verification model:** Pure logic (i18n `t()`, SEO/JSON-LD builders, data-shape/positioning guards, reduced-motion gating) is TDD'd with Vitest. Visual/animation tasks are verified in the Vite preview at widths 360 / 768 / 1280 and with a Lighthouse pass; each such task lists explicit observable checks.

---

## File Structure

**New**
- `vitest.config.js` — test runner config (jsdom env).
- `src/test/setup.js` — testing-library + matchMedia/IO polyfills.
- `src/lib/i18n/index.js` — `LocaleProvider`, `useT`, `useLocale`, `t(dict, key)`.
- `src/lib/i18n/en.js`, `ro.js`, `ru.js` — dictionaries (EN authored; RO/RU drafted + marked).
- `src/lib/gsap.js` — plugin registration, Lenis↔ScrollTrigger sync, `mm` matchMedia helper, `prefersReduced`.
- `src/components/SplitText.jsx` — char/word/line reveal primitive.
- `src/components/ScrambleText.jsx` — scramble/keyword effect.
- `src/lib/__tests__/*.test.js`, `src/lib/i18n/__tests__/*.test.js` — unit tests.

**Rewritten**
- `src/lib/data.js` — web-dev positioning content; illustrative items flagged.
- `src/components/Primitives.jsx` — `Reveal`/`MaskTitle` → GSAP, reversible.
- `src/sections/Journey.jsx` — pinned scrubbed "build a website" scene.
- `src/lib/seo.js` — locale-aware meta + hreflang + JSON-LD builders.

**Modified**
- `src/App.jsx` — GSAP/Lenis wiring, ScrollTrigger refresh on route change.
- `src/main.jsx` — wrap router in `LocaleProvider`; lazy-load routes.
- `src/pages/*.jsx` — apply positioning copy, one `<h1>`, semantic landmarks, internal links, per-page meta + JSON-LD.
- `index.html` — base meta, `lang`, theme, geo tags.
- `package.json` — GSAP bump, test deps, `test` script.

---

## Task 1: Test tooling (Vitest)

**Files:**
- Modify: `package.json`
- Create: `vitest.config.js`, `src/test/setup.js`
- Create: `src/lib/__tests__/smoke.test.js`

- [ ] **Step 1: Install dev dependencies**

Run:
```bash
npm i -D vitest@^2 jsdom@^25 @testing-library/react@^16 @testing-library/jest-dom@^6 @testing-library/user-event@^14
npm i gsap@^3.13.0
```
Expected: installs succeed; `gsap` upgraded to ≥3.13 (SplitText now bundled free).

- [ ] **Step 2: Add test script to `package.json`**

In the `"scripts"` block add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Create `vitest.config.js`**

```js
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    css: false,
  },
})
```

- [ ] **Step 4: Create `src/test/setup.js`** (polyfills for animation guards)

```js
import '@testing-library/jest-dom/vitest'

// matchMedia: default to "no preference / fine pointer / wide"
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

// IntersectionObserver stub (Framer/util safety in jsdom)
if (!window.IntersectionObserver) {
  window.IntersectionObserver = class {
    observe() {} unobserve() {} disconnect() {} takeRecords() { return [] }
  }
}
```

- [ ] **Step 5: Create smoke test `src/lib/__tests__/smoke.test.js`**

```js
import { describe, it, expect } from 'vitest'

describe('test harness', () => {
  it('runs', () => { expect(1 + 1).toBe(2) })
})
```

- [ ] **Step 6: Run tests**

Run: `npm test`
Expected: PASS (1 test passed).

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.js src/test/setup.js src/lib/__tests__/smoke.test.js
git commit -m "test: add Vitest + testing-library harness; bump GSAP to 3.13"
```

---

## Task 2: i18n foundation

**Files:**
- Create: `src/lib/i18n/index.js`
- Create: `src/lib/i18n/en.js`, `src/lib/i18n/ro.js`, `src/lib/i18n/ru.js`
- Test: `src/lib/i18n/__tests__/i18n.test.jsx`

Dictionaries are flat key→string maps. `t()` resolves dotted keys, falls back to EN when a locale key is missing, and returns the key itself if absent everywhere (so missing copy is visible, never blank).

- [ ] **Step 1: Write failing test `src/lib/i18n/__tests__/i18n.test.jsx`**

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LocaleProvider, useT, useLocale } from '../index.js'

function Probe() {
  const t = useT()
  const { locale } = useLocale()
  return <p>{locale}:{t('nav.work')}|{t('does.not.exist')}</p>
}

describe('i18n', () => {
  it('resolves keys for the active locale and falls back gracefully', () => {
    render(<LocaleProvider locale="en"><Probe /></LocaleProvider>)
    expect(screen.getByText(/^en:Work\|does\.not\.exist$/)).toBeInTheDocument()
  })

  it('falls back to EN when a RO key is missing but exists in EN', () => {
    render(<LocaleProvider locale="ro"><Probe /></LocaleProvider>)
    // ro:<ro-or-en "Work"> — must not be the raw key
    expect(screen.queryByText(/nav\.work/)).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- i18n`
Expected: FAIL — cannot import `../index.js`.

- [ ] **Step 3: Create dictionaries**

`src/lib/i18n/en.js`:
```js
// English is the source of truth for all copy.
export default {
  'nav.work': 'Work',
  'nav.services': 'Services',
  'nav.process': 'Process',
  'nav.pricing': 'Pricing',
  'nav.about': 'About',
  'nav.cta': 'Start a project',

  'hero.eyebrow': 'Custom web development studio · Moldova',
  'hero.l1': 'We build',
  'hero.l2': 'websites that',
  'hero.l3': 'help businesses',
  'hero.accent': 'grow.',
  'hero.sub': 'UpVision designs and builds fast, custom websites and web apps for businesses in Moldova and beyond — engineered to win trust, generate leads and pay for themselves.',
  'hero.ctaPrimary': 'Start your project',
  'hero.ctaSecondary': 'See the work',

  'footer.tagline': 'We build websites that help businesses grow.',
  'footer.location': 'Custom web development · Chișinău, Moldova',
  'footer.addons': 'Add-ons on request: Telegram bots · automation · integrations',
}
```

`src/lib/i18n/ro.js`:
```js
// TODO: native review — machine-drafted Romanian. EN is source of truth.
export default {
  'nav.work': 'Proiecte',
  'nav.services': 'Servicii',
  'nav.process': 'Proces',
  'nav.pricing': 'Prețuri',
  'nav.about': 'Despre',
  'nav.cta': 'Începe un proiect',

  'hero.eyebrow': 'Studio de dezvoltare web · Moldova',
  'hero.l1': 'Construim',
  'hero.l2': 'site-uri care',
  'hero.l3': 'ajută afacerile',
  'hero.accent': 'să crească.',
  'hero.sub': 'UpVision proiectează și dezvoltă site-uri și aplicații web rapide, personalizate, pentru afaceri din Moldova și nu numai — create pentru a inspira încredere, a genera clienți și a se amortiza.',
  'hero.ctaPrimary': 'Începe proiectul',
  'hero.ctaSecondary': 'Vezi proiectele',

  'footer.tagline': 'Construim site-uri care ajută afacerile să crească.',
  'footer.location': 'Dezvoltare web personalizată · Chișinău, Moldova',
  'footer.addons': 'Opțional, la cerere: boți Telegram · automatizare · integrări',
}
```

`src/lib/i18n/ru.js`:
```js
// TODO: native review — machine-drafted Russian. EN is source of truth.
export default {
  'nav.work': 'Работы',
  'nav.services': 'Услуги',
  'nav.process': 'Процесс',
  'nav.pricing': 'Цены',
  'nav.about': 'О нас',
  'nav.cta': 'Начать проект',

  'hero.eyebrow': 'Студия веб-разработки · Молдова',
  'hero.l1': 'Мы создаём',
  'hero.l2': 'сайты, которые',
  'hero.l3': 'помогают бизнесу',
  'hero.accent': 'расти.',
  'hero.sub': 'UpVision проектирует и разрабатывает быстрые индивидуальные сайты и веб-приложения для бизнеса в Молдове и за её пределами — чтобы вызывать доверие, привлекать клиентов и окупаться.',
  'hero.ctaPrimary': 'Начать проект',
  'hero.ctaSecondary': 'Смотреть работы',

  'footer.tagline': 'Мы создаём сайты, которые помогают бизнесу расти.',
  'footer.location': 'Индивидуальная веб-разработка · Кишинёв, Молдова',
  'footer.addons': 'Дополнительно по запросу: Telegram-боты · автоматизация · интеграции',
}
```

- [ ] **Step 4: Create `src/lib/i18n/index.js`**

```jsx
import { createContext, useContext, useMemo } from 'react'
import en from './en.js'
import ro from './ro.js'
import ru from './ru.js'

export const LOCALES = ['en', 'ro', 'ru']
export const DEFAULT_LOCALE = 'en'
const DICTS = { en, ro, ru }

const LocaleContext = createContext({ locale: DEFAULT_LOCALE })

export function LocaleProvider({ locale = DEFAULT_LOCALE, children }) {
  const value = useMemo(() => ({ locale }), [locale])
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  return useContext(LocaleContext)
}

/** Resolve a dotted key for `locale`, falling back to EN, then to the key. */
export function translate(locale, key) {
  const dict = DICTS[locale] || en
  if (key in dict) return dict[key]
  if (key in en) return en[key]
  return key
}

export function useT() {
  const { locale } = useLocale()
  return useMemo(() => (key) => translate(locale, key), [locale])
}
```

- [ ] **Step 5: Run tests**

Run: `npm test -- i18n`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add src/lib/i18n
git commit -m "feat(i18n): add locale provider + EN dictionary, RO/RU drafted for review"
```

---

## Task 3: Reposition content in `data.js`

**Files:**
- Modify: `src/lib/data.js`
- Test: `src/lib/__tests__/positioning.test.js`

Positioning guard: a test asserts the primary services are the five web-dev offers and that no primary service is branding/marketing/product-strategy. Automation lives only in a separate `ADDONS` export.

- [ ] **Step 1: Write failing test `src/lib/__tests__/positioning.test.js`**

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- positioning`
Expected: FAIL — `SERVICES` still has old slugs / `ADDONS` undefined.

- [ ] **Step 3: Replace `SERVICES`, add `ADDONS`, and reframe related exports in `src/lib/data.js`**

Replace the entire `SERVICES` array with:
```js
export const SERVICES = [
  {
    slug: 'custom-websites', n: '01', title: 'Custom Websites',
    short: 'Bespoke sites engineered to convert — never a template.',
    body: 'Design and development of fast, accessible, search-friendly websites built around the actions that grow your business. Modern React stack, your content, your brand.',
    deliverables: ['Tailored design', 'React build', 'CMS & content', 'Core Web Vitals', 'Analytics wiring'],
    outcome: 'A site that earns its keep — faster load, higher conversion, lower cost-per-lead.',
  },
  {
    slug: 'landing-pages', n: '02', title: 'Landing Pages',
    short: 'Single-purpose pages that turn campaigns into leads.',
    body: 'High-converting landing pages for launches, ads and campaigns — built fast, instrumented for measurement, and tuned around one clear action.',
    deliverables: ['Conversion-first layout', 'Copy structure', 'Forms & tracking', 'A/B-ready', 'Fast load'],
    outcome: 'More qualified leads from the traffic you already pay for.',
  },
  {
    slug: 'business-websites', n: '03', title: 'Business Websites',
    short: 'Credible, fast sites that win trust and inquiries.',
    body: 'Professional websites for established businesses — clear structure, strong first impression, and the trust signals that turn visitors into inquiries.',
    deliverables: ['Sitemap & UX', 'Responsive design', 'SEO foundations', 'CMS', 'Lead capture'],
    outcome: 'A presence that makes customers choose you with confidence.',
  },
  {
    slug: 'web-applications', n: '04', title: 'Web Applications',
    short: 'Custom web apps and internal tools on a modern stack.',
    body: 'From customer portals to dashboards and internal tools — custom web applications built to be fast, reliable and maintainable by your team.',
    deliverables: ['Product UX', 'React app', 'Auth & data', 'Integrations', 'Maintainable code'],
    outcome: 'Software that removes friction and scales with the business.',
  },
  {
    slug: 'ecommerce', n: '05', title: 'E-commerce',
    short: 'Online stores built to sell and scale.',
    body: 'Fast, conversion-focused online stores — clean product experiences, reliable checkout, and the performance that keeps shoppers buying.',
    deliverables: ['Store UX', 'Catalog & checkout', 'Payments', 'Performance', 'Analytics'],
    outcome: 'More revenue per visitor and a store that grows with you.',
  },
]

/* Secondary — mentioned lightly, never as a primary offer. */
export const ADDONS = [
  { title: 'Telegram bots',      d: 'Customer or internal bots wired into your site and tools.' },
  { title: 'Business automation', d: 'Automate the repetitive work around your website where it pays off.' },
  { title: 'Custom integrations', d: 'Connect your site to CRMs, payments and the tools you already use.' },
  { title: 'Workflow automation',  d: 'Quiet systems that remove busywork once the site is live.' },
]
export const ADDONS_NOTE = 'Already building your site with us? We can wire in automation and integrations where they pay off — optional, on request.'
```

- [ ] **Step 4: Reframe `PROCESS`, `PRICING`, `PROJECTS`, `FAQ`, `STAGES` to web-dev language**

Replace `PRICING` with website-type tiers (illustrative numbers retained, flagged):
```js
// NOTE: prices and ranges are ILLUSTRATIVE placeholders — replace before launch.
export const PRICING = [
  {
    name: 'Landing Page', tag: 'One page, built to convert', invest: '1.5k', range: '$1.5k–$3k', horizon: '1–2 weeks',
    points: ['Single high-converting page', 'Custom design', 'Mobile-first build', 'SEO basics', 'Analytics & launch'],
    returns: 'Turns campaign and ad traffic into qualified leads.', featured: false,
  },
  {
    name: 'Business Website', tag: 'A credible presence that wins trust', invest: '4k', range: '$4k–$9k', horizon: '3–5 weeks',
    points: ['Up to 8 designed pages', 'React build + CMS', 'SEO foundations', 'Lead capture', 'Launch & analytics'],
    returns: 'A professional site that turns visitors into inquiries.', featured: true,
  },
  {
    name: 'Web App / Store', tag: 'Custom software or e-commerce', invest: '12k', range: '$12k+', horizon: '6–10 weeks',
    points: ['Product UX & design', 'Custom web app or store', 'Integrations & payments', 'Performance budget', 'Post-launch support'],
    returns: 'A system that removes friction and scales revenue.', featured: false,
  },
]
```

Replace `PROCESS` titles/copy to a build-focused flow:
```js
export const PROCESS = [
  { n: '01', title: 'Discover', d: 'We clarify your goal, audience and the actions that make you money — and scope the site around them.', out: 'Strategy & scope' },
  { n: '02', title: 'Design',   d: 'Structure, then high-fidelity design of every page and state — reviewed before a line of code.', out: 'Designed site' },
  { n: '03', title: 'Build',    d: 'Engineering on a modern React stack — fast, accessible, responsive, instrumented from day one.', out: 'Production site' },
  { n: '04', title: 'Launch',   d: 'QA, SEO, analytics and a go-live plan. Staging to the world, with a safety net.', out: 'Live website' },
  { n: '05', title: 'Grow',     d: 'Post-launch fixes, optimisation and reporting — optional automation where it pays off.', out: 'Compounding results' },
]
```

Update `PROJECTS[].tags` to web-dev terms (illustrative results kept) — replace each `tags` array:
- northwind: `['Web app', 'B2B site', 'CRO']`
- homemade: `['Web app', 'Launch', 'Performance']`
- atlas-health: `['Web app', 'Integrations', 'Automation']`
- faro-coffee: `['E-commerce', 'Performance', 'SEO']`

Add a top-of-file flag comment above `PROJECTS` and `STATS`:
```js
// NOTE: project results and stats below are ILLUSTRATIVE placeholders.
```

Replace `FAQ` with web-dev/Moldova framing:
```js
export const FAQ = [
  ['Is a website really an investment, not a cost?', 'A cost disappears; an investment returns. We scope every build around a measurable outcome — more qualified leads, higher conversion, lower acquisition cost — and instrument it so you can see the return.'],
  ['How fast can you build my website?', 'A landing page ships in 1–2 weeks, a business website in 3–5 weeks, and a web app or store in 6–10 weeks. We sequence delivery so something valuable ships early.'],
  ['Do you only build websites?', 'Websites and web apps are our core work. We can also add Telegram bots, integrations and automation on request — but only where they clearly pay off for your site.'],
  ['Do you work with businesses in Moldova?', 'Yes — we are a custom web development studio based in Chișinău, Moldova, working with local businesses and clients abroad.'],
  ['Who owns the work?', 'You do — code, design files, accounts. No lock-in. We build sites your team can actually maintain.'],
]
```

Leave `STAGES` as-is (it now feeds the rebuilt storytelling scene in Task 8).

- [ ] **Step 5: Run tests**

Run: `npm test -- positioning`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add src/lib/data.js src/lib/__tests__/positioning.test.js
git commit -m "feat(content): reposition around custom web development; automation as add-on"
```

---

## Task 4: GSAP core module

**Files:**
- Create: `src/lib/gsap.js`
- Test: `src/lib/__tests__/gsap-core.test.js`

This module registers plugins once, exposes a `prefersReduced()` guard, an `mm` (`gsap.matchMedia`) instance, and `connectLenis(lenis)` to drive `ScrollTrigger.update` from Lenis scroll.

- [ ] **Step 1: Write failing test `src/lib/__tests__/gsap-core.test.js`**

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- gsap-core`
Expected: FAIL — cannot import `../gsap.js`.

- [ ] **Step 3: Create `src/lib/gsap.js`**

```js
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let registered = false
export function registerGsap() {
  if (registered || typeof window === 'undefined') return
  gsap.registerPlugin(ScrollTrigger)
  registered = true
}

export function prefersReduced() {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Drive ScrollTrigger from Lenis; refresh ST when Lenis is ready. Returns disposer. */
export function connectLenis(lenis) {
  registerGsap()
  const onScroll = () => ScrollTrigger.update()
  lenis.on('scroll', onScroll)
  ScrollTrigger.refresh()
  return () => { lenis.off('scroll', onScroll) }
}

/** Shared matchMedia instance for breakpoint-scoped animations. */
export const mm = typeof window !== 'undefined' ? gsap.matchMedia() : null

export { gsap, ScrollTrigger }
```

- [ ] **Step 4: Run tests**

Run: `npm test -- gsap-core`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/gsap.js src/lib/__tests__/gsap-core.test.js
git commit -m "feat(motion): add GSAP/ScrollTrigger core with Lenis sync and matchMedia"
```

---

## Task 5: Wire GSAP into App + Lenis

**Files:**
- Modify: `src/App.jsx`

Verification is behavioral (preview), so no unit test here.

- [ ] **Step 1: Update `src/App.jsx` to connect Lenis→ScrollTrigger and refresh on route change**

Replace the Lenis `useEffect` body and add ScrollTrigger refresh on `pathname`:
```jsx
import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import Cursor from './components/Cursor.jsx'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import { isReduced } from './lib/hooks'
import { connectLenis, ScrollTrigger, registerGsap } from './lib/gsap'

export default function App() {
  const { pathname } = useLocation()
  const lenisRef = useRef(null)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  useEffect(() => {
    registerGsap()
    if (isReduced()) return
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, lerp: 0.1 })
    lenisRef.current = lenis
    window.__lenis = lenis
    const disconnect = connectLenis(lenis)
    let raf
    const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); disconnect(); lenis.destroy(); window.__lenis = null }
  }, [])

  useEffect(() => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
    // Let the new route paint, then recalc triggers.
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [pathname])

  return (
    <>
      <Cursor />
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />
      <Nav />
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Verify in preview**

Start dev server. Expected observable checks:
- Page scrolls smoothly (Lenis intact), no console errors mentioning GSAP/ScrollTrigger.
- Navigating between routes scrolls to top and does not throw.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat(motion): connect Lenis to ScrollTrigger and refresh on route change"
```

---

## Task 6: Reversible animation primitives

**Files:**
- Rewrite: `src/components/Primitives.jsx`
- Test: `src/components/__tests__/reveal-reduced.test.jsx`

`Reveal`/`MaskTitle` use ScrollTrigger with `toggleActions: 'play reverse play reverse'`. Under reduced-motion they render final state (no transform). Keep `Magnetic`, `Stat`, `Marquee` (Stat's count-up via existing hook is fine).

- [ ] **Step 1: Write failing test `src/components/__tests__/reveal-reduced.test.jsx`**

```jsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- reveal-reduced`
Expected: FAIL — current `Reveal` is Framer-based / not reduced-aware in this way.

- [ ] **Step 3: Rewrite `src/components/Primitives.jsx`**

```jsx
import { useRef, useLayoutEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useMagnetic, useCountUp } from '../lib/hooks'
import { gsap, registerGsap, prefersReduced } from '../lib/gsap'

const REVERSIBLE = 'play reverse play reverse'

/* Scroll reveal — rises in on the way down, reverses on the way up, every pass. */
export function Reveal({ children, delay = 0, y = 28, className = '', as = 'div' }) {
  const ref = useRef(null)
  const Tag = as
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReduced()) { gsap.set(el, { clearProps: 'all' }); return }
    registerGsap()
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1, y: 0, duration: 0.8, delay, ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: REVERSIBLE },
        })
    }, ref)
    return () => ctx.revert()
  }, [delay, y])
  return <Tag ref={ref} className={className}>{children}</Tag>
}

/* Headline with masked line-by-line rise — reversible. */
export function MaskTitle({ lines, className = '' }) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const inners = root.querySelectorAll('[data-line]')
    if (prefersReduced()) { gsap.set(inners, { yPercent: 0 }); return }
    registerGsap()
    const ctx = gsap.context(() => {
      gsap.fromTo(inners,
        { yPercent: 110 },
        {
          yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08,
          scrollTrigger: { trigger: root, start: 'top 80%', toggleActions: REVERSIBLE },
        })
    }, ref)
    return () => ctx.revert()
  }, [lines])
  return (
    <h2 ref={ref} className={className}>
      {lines.map((l, i) => (
        <span key={i} style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.05em' }}>
          <span data-line style={{ display: 'block' }}>{l}</span>
        </span>
      ))}
    </h2>
  )
}

/* Magnetic link/button (unchanged). */
export function Magnetic({ children, className = '', to, href, cursor, onClick, strength = 0.35, ...rest }) {
  const ref = useMagnetic(strength)
  const props = { ref, className, 'data-cursor': cursor, onClick, ...rest }
  if (to) return <Link to={to} {...props}>{children}</Link>
  if (href) return <a href={href} {...props}>{children}</a>
  return <button {...props}>{children}</button>
}

/* Count-up stat (unchanged behaviour). */
export function Stat({ v, suffix = '', label, dec = 0, big = false }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, amount: 0.6 })
  const val = useCountUp(v, { start: inView, dec })
  return (
    <div ref={ref}>
      <div className="font-display" style={{ fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1, fontSize: big ? 'clamp(40px,6vw,72px)' : 'clamp(30px,4vw,48px)' }}>
        {val}{suffix}
      </div>
      <div style={{ fontSize: 13, color: 'var(--color-ink-faint)', marginTop: 8 }}>{label}</div>
    </div>
  )
}

/* Infinite marquee row (unchanged). */
export function Marquee({ items, duration = 30, className = '' }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="flex w-max" style={{ animation: `marquee ${duration}s linear infinite` }}>
        {[...items, ...items].map((it, i) => (
          <span key={i} className="inline-flex items-center whitespace-nowrap">{it}</span>
        ))}
      </div>
    </div>
  )
}
```

Note: `useCountUp` currently only fires once (no reset). Because `useInView` now has `once: false`, change `useCountUp` in `src/lib/hooks.js` to reset to 0 when `start` flips false, so stats re-count when re-entering view:
```js
export function useCountUp(target, { start = false, dur = 1500, dec = 0 } = {}) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!start) { setVal(0); return }
    let raf, t0
    const step = (t) => {
      if (!t0) t0 = t
      const p = Math.min((t - t0) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(target * eased)
      if (p < 1) raf = requestAnimationFrame(step)
      else setVal(target)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [start, target, dur])
  return dec ? val.toFixed(dec) : Math.round(val)
}
```

- [ ] **Step 4: Run tests**

Run: `npm test -- reveal-reduced`
Expected: PASS.

- [ ] **Step 5: Verify in preview**

Observable checks at 1280: scroll a `Reveal`/`MaskTitle` into view (rises in), scroll back up past it then down again — it replays. Stats re-count on re-entry.

- [ ] **Step 6: Commit**

```bash
git add src/components/Primitives.jsx src/components/__tests__/reveal-reduced.test.jsx src/lib/hooks.js
git commit -m "feat(motion): reversible Reveal/MaskTitle via ScrollTrigger toggleActions"
```

---

## Task 7: SplitText & ScrambleText text primitives

**Files:**
- Create: `src/components/SplitText.jsx`, `src/components/ScrambleText.jsx`
- Test: `src/components/__tests__/text-effects.test.jsx`

SplitText splits its string into spans (`by="char"|"word"`), animates with stagger + optional blur, reversible, rebuilds on resize. ScrambleText decodes from random glyphs to the final string when scrolled into view, reversible.

- [ ] **Step 1: Write failing test `src/components/__tests__/text-effects.test.jsx`**

```jsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- text-effects`
Expected: FAIL — components do not exist.

- [ ] **Step 3: Create `src/components/SplitText.jsx`**

```jsx
import { useRef, useLayoutEffect } from 'react'
import { gsap, registerGsap, prefersReduced } from '../lib/gsap'

/**
 * Char/word reveal. Splits `text` into spans and animates them in with a
 * stagger; reverses on scroll up. `blur` adds a blur-to-sharp feel.
 */
export default function SplitText({
  text, by = 'word', as: Tag = 'span', className = '',
  stagger = 0.04, y = '0.6em', blur = true, start = 'top 85%',
}) {
  const ref = useRef(null)
  const pieces = by === 'char' ? Array.from(text) : text.split(/(\s+)/)

  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const targets = root.querySelectorAll('[data-piece]')
    if (prefersReduced()) { gsap.set(targets, { clearProps: 'all' }); return }
    registerGsap()
    const ctx = gsap.context(() => {
      gsap.fromTo(targets,
        { yPercent: 60, autoAlpha: 0, filter: blur ? 'blur(8px)' : 'none' },
        {
          yPercent: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.7, ease: 'expo.out', stagger,
          scrollTrigger: { trigger: root, start, toggleActions: 'play reverse play reverse' },
        })
    }, ref)
    return () => ctx.revert()
  }, [text, by, stagger, blur, start])

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {pieces.map((p, i) =>
        /\s+/.test(p)
          ? <span key={i} aria-hidden="true">{p}</span>
          : <span key={i} data-piece aria-hidden="true" style={{ display: 'inline-block', willChange: 'transform, opacity' }}>{p}</span>
      )}
    </Tag>
  )
}
```

- [ ] **Step 4: Create `src/components/ScrambleText.jsx`**

```jsx
import { useRef, useLayoutEffect } from 'react'
import { gsap, registerGsap, prefersReduced } from '../lib/gsap'

const GLYPHS = '!<>-_\\/[]{}—=+*^?#'

/** Decode-from-noise effect, driven by ScrollTrigger, reversible. */
export default function ScrambleText({ text, as: Tag = 'span', className = '', start = 'top 90%' }) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReduced()) { el.textContent = text; return }
    registerGsap()
    const state = { p: 0 }
    const render = () => {
      const reveal = Math.floor(state.p * text.length)
      let out = ''
      for (let i = 0; i < text.length; i++) {
        out += i < reveal ? text[i]
          : (text[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0])
      }
      el.textContent = out
    }
    const ctx = gsap.context(() => {
      gsap.to(state, {
        p: 1, duration: 0.9, ease: 'power1.inOut', onUpdate: render,
        scrollTrigger: { trigger: el, start, toggleActions: 'play reverse play reverse' },
      })
    }, ref)
    render()
    return () => ctx.revert()
  }, [text, start])
  return <Tag ref={ref} className={className} aria-label={text}>{text}</Tag>
}
```

- [ ] **Step 5: Run tests**

Run: `npm test -- text-effects`
Expected: PASS (2 tests).

- [ ] **Step 6: Add resize-rebuild safety for SplitText**

ScrollTrigger handles position recalculation via `ScrollTrigger.refresh()` (already called on route change). Add a debounced refresh on window resize in `src/lib/gsap.js` so split line-wrapping recalculates:
```js
if (typeof window !== 'undefined') {
  let rt
  window.addEventListener('resize', () => {
    clearTimeout(rt)
    rt = setTimeout(() => ScrollTrigger.refresh(), 200)
  })
}
```
Add this at the bottom of `src/lib/gsap.js` (after `mm`).

- [ ] **Step 7: Commit**

```bash
git add src/components/SplitText.jsx src/components/ScrambleText.jsx src/components/__tests__/text-effects.test.jsx src/lib/gsap.js
git commit -m "feat(motion): SplitText + ScrambleText reversible text primitives"
```

---

## Task 8: Storytelling scene — "watch a website get built"

**Files:**
- Rewrite: `src/sections/Journey.jsx`

Single pinned, scrubbed ScrollTrigger timeline on desktop; stacked non-pinned fallback on ≤768 and for reduced motion. The artifact frame transitions through 8 phases via transform/opacity/SVG `pathLength`.

- [ ] **Step 1: Rewrite `src/sections/Journey.jsx`**

```jsx
import { useRef, useLayoutEffect } from 'react'
import { gsap, registerGsap, prefersReduced, mm } from '../lib/gsap'

const PHASES = [
  ['Wireframe', 'A rough structure — boxes and intent.'],
  ['Design', 'Structure becomes a polished, branded interface.'],
  ['Code', 'The design turns into clean, modern code.'],
  ['Edit', 'We refine, line by line, until it’s right.'],
  ['Compile', 'It builds — accessibility, SEO and speed checked.'],
  ['Launch', 'The finished website goes live.'],
  ['Visitors', 'Real people arrive and start engaging.'],
  ['Growth', 'Leads and revenue climb, month after month.'],
]

export default function Journey() {
  const root = useRef(null)
  const frame = useRef(null)

  useLayoutEffect(() => {
    registerGsap()
    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray('[data-phase]')
      const counters = gsap.utils.toArray('[data-counter]')

      // Reduced motion / mobile: show everything, no pin, no scrub.
      if (prefersReduced()) { gsap.set(steps, { autoAlpha: 1 }); return }

      mm.add(
        {
          isDesktop: '(min-width: 769px)',
          isMobile: '(max-width: 768px)',
        },
        (context) => {
          const { isDesktop } = context.conditions
          if (!isDesktop) {
            // Mobile: each phase reveals independently, reversible, no pin.
            steps.forEach((s) => {
              gsap.fromTo(s, { autoAlpha: 0, y: 24 }, {
                autoAlpha: 1, y: 0, duration: 0.6, ease: 'expo.out',
                scrollTrigger: { trigger: s, start: 'top 80%', toggleActions: 'play reverse play reverse' },
              })
            })
            return
          }

          // Desktop: pinned, scrubbed master timeline. Scroll up un-builds it.
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: '+=' + (PHASES.length * 60) + '%',
              pin: frame.current,
              scrub: 1,
            },
          })
          steps.forEach((s, i) => {
            tl.fromTo(s, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1 }, i)
            if (i !== steps.length - 1) tl.to(s, { autoAlpha: 0, y: -30, duration: 1 }, i + 0.9)
          })
          // Growth meter + counters tied to overall progress.
          tl.fromTo('[data-meter]', { scaleX: 0 }, { scaleX: 1, duration: PHASES.length }, 0)
          counters.forEach((c) => {
            const to = +c.dataset.counter
            const obj = { v: 0 }
            tl.to(obj, { v: to, duration: PHASES.length, onUpdate: () => { c.textContent = Math.round(obj.v).toLocaleString() } }, 0)
          })
        }
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="journey" className="relative py-[clamp(80px,12vh,160px)]">
      <div className="ledger-grid" />
      <div className="shell relative z-10">
        <div className="max-w-[760px] mb-[clamp(40px,7vh,80px)]">
          <span className="eyebrow">How a website gets built</span>
          <h2 className="display-lg mt-6 mb-5">
            Watch an idea become a <span className="serif-italic text-accent">working website.</span>
          </h2>
          <p className="text-lg text-ink-soft max-w-[54ch]">
            From a rough wireframe to a live site winning customers — this is what
            we actually do, and how it turns into business growth.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-[clamp(24px,4vw,64px)] items-start">
          {/* pinned artifact frame */}
          <div ref={frame} className="rounded-2xl border border-line bg-panel shadow-[0_40px_90px_-50px_rgba(24,22,15,0.5)] overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-line bg-paper-2/60">
              <span className="flex gap-1.5">
                <i className="w-2.5 h-2.5 rounded-full bg-line-strong" />
                <i className="w-2.5 h-2.5 rounded-full bg-line-strong" />
                <i className="w-2.5 h-2.5 rounded-full bg-line-strong" />
              </span>
              <span className="font-mono text-xs text-ink-faint ml-1">upvision — building…</span>
            </div>
            <div className="relative h-[clamp(260px,42vh,380px)] bg-panel">
              {PHASES.map(([label], i) => (
                <div key={label} data-phase className="absolute inset-0 p-6 grid place-items-center text-center" style={{ opacity: 0 }}>
                  <PhaseVisual index={i} />
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-line bg-paper-2/50">
              <div className="flex items-center justify-between mb-2.5">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">Business value</span>
                <span className="font-mono text-xs text-gain"><b data-counter="127">0</b>k MRR</span>
              </div>
              <div className="h-1.5 rounded-full bg-line overflow-hidden">
                <div data-meter className="h-full rounded-full bg-gain origin-left" style={{ transform: 'scaleX(0)' }} />
              </div>
            </div>
          </div>

          {/* phase captions */}
          <div className="flex flex-col gap-[clamp(12px,2vh,20px)]">
            {PHASES.map(([label, line], i) => (
              <div key={label} className="border-t border-line pt-4">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="font-mono text-sm text-accent">0{i + 1}</span>
                  <h3 className="font-display text-xl font-semibold">{label}</h3>
                </div>
                <p className="text-ink-soft text-[15px] max-w-[40ch]">{line}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* Lightweight per-phase visuals (transform/opacity/SVG only). */
function PhaseVisual({ index }) {
  switch (index) {
    case 0: // wireframe
      return (
        <svg viewBox="0 0 220 130" className="w-[80%]">
          {[[10,10,200,18],[10,38,120,12],[10,58,200,40],[10,104,90,16]].map(([x,y,w,h],i)=>(
            <rect key={i} x={x} y={y} width={w} height={h} rx="3" fill="none" stroke="var(--color-line-strong)" strokeWidth="1.5" strokeDasharray="4 4" />
          ))}
        </svg>
      )
    case 1: // polished UI
      return (
        <div className="w-[80%] rounded-xl overflow-hidden border border-line bg-[#15101f] text-left">
          <div className="flex items-center justify-between px-4 py-3"><span className="font-display text-white text-sm font-semibold">acme</span><span className="w-12 h-5 rounded-full bg-accent" /></div>
          <div className="px-4 pb-3"><div className="font-display text-white text-lg leading-tight">Grow your business online.</div><span className="inline-block mt-2 px-3 py-1.5 rounded-full bg-accent text-white text-xs font-semibold">Get started</span></div>
        </div>
      )
    case 2: // code
    case 3: // edit
      return (
        <div className="w-[88%] bg-night rounded-lg p-4 font-mono text-[12px] leading-relaxed text-left">
          <div className="text-paper/40 mb-1">Hero.jsx</div>
          <div><span className="text-[#ff7b9c]">export function</span> <span className="text-[#7fd1c4]">Hero</span>() {'{'}</div>
          <div className="pl-6 text-[#9bd17f]">Grow your business online{index === 3 && <span className="inline-block w-1.5 h-3.5 bg-gain align-middle ml-0.5" style={{ animation: 'blink 1s steps(1) infinite' }} />}</div>
          <div>{'}'}</div>
        </div>
      )
    case 4: // compile
      return (
        <div className="w-[88%] bg-night rounded-lg p-4 font-mono text-[12px] leading-relaxed text-left flex flex-col gap-1">
          <div className="text-paper">$ upvision build --prod</div>
          <div className="text-gain">✓ checks  a11y · seo · perf</div>
          <div className="text-accent">✓ built in 12.4s</div>
        </div>
      )
    case 5: // launch
      return <div className="font-display text-2xl font-semibold">acme.com <span className="text-gain">is live</span></div>
    case 6: // visitors
      return (
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-xs text-ink-faint uppercase tracking-widest">Visitors today</span>
          <div className="font-display text-4xl font-semibold"><b data-counter="2480">0</b></div>
        </div>
      )
    case 7: // growth
      return (
        <svg viewBox="0 0 320 120" preserveAspectRatio="none" className="w-[88%] h-[120px]">
          <path d="M0 110 C 80 100, 140 70, 200 50 S 300 12, 320 6" fill="none" stroke="var(--color-gain)" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )
    default:
      return null
  }
}
```

- [ ] **Step 2: Verify in preview at 1280, 768, 360**

Observable checks:
- 1280: the frame **pins** while scrolling; phases cross-fade in order; scrolling **up** reverses the build; the MRR counter and meter track scroll position both directions.
- 768/360: no pin; each phase caption reveals on its own and reverses on scroll-up; no horizontal overflow.
- Console: no ScrollTrigger errors; navigating away and back does not duplicate pins (ctx.revert cleans up).

- [ ] **Step 3: Commit**

```bash
git add src/sections/Journey.jsx
git commit -m "feat(story): pinned scrubbed 'watch a website get built' scene with mobile fallback"
```

---

## Task 9: Locale-aware SEO + structured data

**Files:**
- Rewrite: `src/lib/seo.js`
- Modify: `index.html`
- Test: `src/lib/__tests__/seo.test.js`

`setMeta` becomes locale-aware (adds `og:locale`, hreflang alternates, locale canonical). New JSON-LD builders: `organizationLd`, `localBusinessLd`, `serviceListLd`, `faqLd`, `breadcrumbLd`.

- [ ] **Step 1: Write failing test `src/lib/__tests__/seo.test.js`**

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- seo`
Expected: FAIL — new exports do not exist.

- [ ] **Step 3: Rewrite `src/lib/seo.js`**

```js
/* Locale-aware per-route metadata + JSON-LD. Pairs with Phase 2 prerendering. */
const SITE = 'https://upvision.studio'
export const LOCALES = ['en', 'ro', 'ru']

const localePath = (locale, path) => {
  const clean = path === '/' ? '' : path
  return locale === 'en' ? `${SITE}${clean || '/'}` : `${SITE}/${locale}${clean}`
}

export function hreflangFor(path) {
  return [
    ...LOCALES.map((l) => ({ hreflang: l, href: localePath(l, path) })),
    { hreflang: 'x-default', href: localePath('en', path) },
  ]
}

function ensure(key, val, useProperty = false) {
  const sel = useProperty ? `meta[property="${key}"]` : `meta[name="${key}"]`
  let el = document.head.querySelector(sel)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(useProperty ? 'property' : 'name', key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', val)
}

export function setMeta({ title, description, path = '/', locale = 'en', type = 'website', image = `${SITE}/og.png` }) {
  document.title = title
  document.documentElement.lang = locale

  ensure('description', description)
  ensure('og:title', title, true)
  ensure('og:description', description, true)
  ensure('og:type', type, true)
  ensure('og:url', localePath(locale, path), true)
  ensure('og:image', image, true)
  ensure('og:locale', locale === 'en' ? 'en_US' : locale === 'ro' ? 'ro_MD' : 'ru_MD', true)
  ensure('twitter:card', 'summary_large_image')
  ensure('twitter:title', title)
  ensure('twitter:description', description)
  ensure('twitter:image', image)

  // canonical
  let canon = document.head.querySelector('link[rel="canonical"]')
  if (!canon) { canon = document.createElement('link'); canon.rel = 'canonical'; document.head.appendChild(canon) }
  canon.href = localePath(locale, path)

  // hreflang alternates
  document.head.querySelectorAll('link[data-hreflang]').forEach((n) => n.remove())
  for (const a of hreflangFor(path)) {
    const link = document.createElement('link')
    link.rel = 'alternate'
    link.hreflang = a.hreflang
    link.href = a.href
    link.setAttribute('data-hreflang', '1')
    document.head.appendChild(link)
  }
}

export function setJsonLd(id, data) {
  let el = document.getElementById(id)
  if (!el) { el = document.createElement('script'); el.type = 'application/ld+json'; el.id = id; document.head.appendChild(el) }
  el.textContent = JSON.stringify(data)
}

/* ---- builders ---- */
export function organizationLd() {
  return {
    '@context': 'https://schema.org', '@type': 'Organization', name: 'UpVision',
    url: SITE, logo: `${SITE}/logo.png`,
    sameAs: [],
    description: 'Custom web development studio in Moldova building websites that help businesses grow.',
  }
}

export function localBusinessLd() {
  return {
    '@context': 'https://schema.org', '@type': 'LocalBusiness', name: 'UpVision',
    url: SITE, image: `${SITE}/og.png`,
    description: 'Custom website and web app development in Chișinău, Moldova.',
    address: { '@type': 'PostalAddress', addressLocality: 'Chișinău', addressCountry: 'MD' },
    areaServed: ['Moldova', 'Europe', 'Worldwide'],
    knowsAbout: ['Web Development', 'Custom Websites', 'Business Websites', 'E-commerce Development', 'Web Applications'],
  }
}

export function serviceListLd(services) {
  return {
    '@context': 'https://schema.org', '@type': 'ItemList',
    itemListElement: services.map((s, i) => ({
      '@type': 'Service', position: i + 1, name: s.title, description: s.short,
      areaServed: 'Moldova', provider: { '@type': 'Organization', name: 'UpVision' },
    })),
  }
}

export function faqLd(pairs) {
  return {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: pairs.map(([q, a]) => ({
      '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
}

export function breadcrumbLd(items) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem', position: i + 1, name: it.name, item: SITE + it.path,
    })),
  }
}
```

- [ ] **Step 4: Update `index.html` base meta + geo**

Replace `<title>`/description block and add geo/lang baseline:
```html
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#f5f2ec" />
    <title>UpVision — Custom Web Development in Moldova</title>
    <meta name="description" content="UpVision is a custom web development studio in Chișinău, Moldova. We build fast websites, landing pages, business sites, web apps and online stores that help businesses grow." />
    <meta name="geo.region" content="MD" />
    <meta name="geo.placename" content="Chișinău" />
    <link rel="canonical" href="https://upvision.studio/" />
```
(keep existing font preconnect/links).

- [ ] **Step 5: Run tests**

Run: `npm test -- seo`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add src/lib/seo.js index.html src/lib/__tests__/seo.test.js
git commit -m "feat(seo): locale-aware meta, hreflang, LocalBusiness/Service/FAQ JSON-LD + Moldova geo"
```

---

## Task 10: Locale routing + lazy routes

**Files:**
- Modify: `src/main.jsx`

Add `/ro` and `/ru` route trees that render the same pages inside `LocaleProvider`, and lazy-load page chunks. `App` derives the locale from the route via an outlet context or a wrapper. Simplest: three sibling route trees, each wrapping `<App />` in a `LocaleProvider` with its locale.

- [ ] **Step 1: Rewrite `src/main.jsx`**

```jsx
import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { LocaleProvider } from './lib/i18n'

const Home = lazy(() => import('./pages/Home.jsx'))
const Services = lazy(() => import('./pages/Services.jsx'))
const Work = lazy(() => import('./pages/Work.jsx'))
const CaseStudy = lazy(() => import('./pages/CaseStudy.jsx'))
const Process = lazy(() => import('./pages/Process.jsx'))
const Pricing = lazy(() => import('./pages/Pricing.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

const fallback = <div style={{ minHeight: '60vh' }} />

const pageRoutes = [
  { index: true, element: <Home /> },
  { path: 'services', element: <Services /> },
  { path: 'work', element: <Work /> },
  { path: 'work/:slug', element: <CaseStudy /> },
  { path: 'process', element: <Process /> },
  { path: 'pricing', element: <Pricing /> },
  { path: 'about', element: <About /> },
  { path: 'contact', element: <Contact /> },
  { path: '*', element: <NotFound /> },
]

const tree = (locale) => ({
  path: locale === 'en' ? '/' : `/${locale}`,
  element: (
    <LocaleProvider locale={locale}>
      <Suspense fallback={fallback}><App /></Suspense>
    </LocaleProvider>
  ),
  children: pageRoutes,
})

const router = createBrowserRouter([tree('en'), tree('ro'), tree('ru')])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
```

- [ ] **Step 2: Verify in preview**

Observable checks: `/`, `/ro`, `/ru` all load; nav still works; lazy chunks load without errors; `document.documentElement.lang` updates per locale once pages call `setMeta` (Task 11).

- [ ] **Step 3: Commit**

```bash
git add src/main.jsx
git commit -m "feat(i18n): locale route trees (/ro, /ru) + lazy-loaded page chunks"
```

---

## Task 11: Apply positioning + SEO to pages

**Files:**
- Modify: `src/pages/Home.jsx`, `Services.jsx`, `Pricing.jsx`, `Work.jsx`, `Process.jsx`, `About.jsx`, `Contact.jsx`, `NotFound.jsx`, `CaseStudy.jsx`
- Modify: `src/components/PageHero.jsx` (ensure title renders as `<h1>` on inner pages)
- Modify: `src/components/Footer.jsx` (location + add-ons line + internal links)

Each page: one `<h1>`; web-dev copy; per-page `setMeta` with locale (from `useLocale`); relevant JSON-LD; internal links. Pull locale via `useLocale()` and pass `locale` into `setMeta`.

- [ ] **Step 1: Home — hero copy + JSON-LD + locale**

In `src/pages/Home.jsx`: replace `HERO_LINES` with `['We build', 'websites that', 'help businesses']` and accent line `grow.`; update sub-paragraph to the web-dev/Moldova version; change the pipeline word row to `['Discover','Design','Build','Launch','Grow']`; rename "MANIFESTO" copy to lead with the website-as-investment idea (keep structure). Update `useEffect`:
```jsx
import { useLocale } from '../lib/i18n'
import { setMeta, setJsonLd, organizationLd, localBusinessLd, faqLd } from '../lib/seo'
import { SERVICES, PROJECTS, STATS, FAQ } from '../lib/data'
// ...
const { locale } = useLocale()
useEffect(() => {
  setMeta({
    title: 'UpVision — Custom Web Development in Moldova',
    description: 'We build fast, custom websites, landing pages, business sites, web apps and online stores for businesses in Moldova and beyond.',
    path: '/', locale,
  })
  setJsonLd('ld-org', organizationLd())
  setJsonLd('ld-local', localBusinessLd())
  setJsonLd('ld-faq', faqLd(FAQ))
}, [locale])
```
Also: replace the SERVICES preview header/title to "Custom web development, end to end." and the section eyebrow to "What we build". Ensure the hero `<h1>` is the only `<h1>` on the page.

- [ ] **Step 2: Services — copy, accordion data, ADDONS strip, JSON-LD**

In `src/pages/Services.jsx`: change `PageHero` props to `eyebrow="What we build"`, `titleLines={['Custom websites,', 'built to grow.']}`, intro to the five-offer summary. Default `open` to `'custom-websites'`. After the accordion section and before the process strip, add an Add-ons strip:
```jsx
import { SERVICES, PROCESS, ADDONS, ADDONS_NOTE } from '../lib/data'
// ...
<section className="relative pb-[clamp(60px,9vh,120px)]">
  <div className="shell">
    <span className="eyebrow mb-6">Optional, on request</span>
    <p className="text-ink-soft max-w-[60ch] mb-7">{ADDONS_NOTE}</p>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {ADDONS.map((a) => (
        <div key={a.title} className="border border-line rounded-xl p-5">
          <h3 className="font-display text-lg font-semibold mb-1.5">{a.title}</h3>
          <p className="text-ink-soft text-[14px]">{a.d}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```
Update `setMeta`/`setJsonLd`:
```jsx
import { useLocale } from '../lib/i18n'
import { setMeta, setJsonLd, serviceListLd, breadcrumbLd } from '../lib/seo'
const { locale } = useLocale()
useEffect(() => {
  setMeta({
    title: 'Web Development Services in Moldova — UpVision',
    description: 'Custom websites, landing pages, business websites, web applications and e-commerce development in Moldova. Automation available on request.',
    path: '/services', locale,
  })
  setJsonLd('ld-services', serviceListLd(SERVICES))
  setJsonLd('ld-breadcrumb', breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }]))
}, [locale])
```

- [ ] **Step 3: Pricing — website-type tiers + copy + meta**

In `src/pages/Pricing.jsx`: consumes `PRICING` (already reframed in Task 3). Update hero/intro to "Priced around the website you need." Update `setMeta`:
```jsx
const { locale } = useLocale()
useEffect(() => setMeta({
  title: 'Website Development Pricing in Moldova — UpVision',
  description: 'Transparent pricing for landing pages, business websites and custom web apps in Moldova. Investment ranges and what you get.',
  path: '/pricing', locale,
}), [locale])
```
Add an illustrative-pricing note near tiers: `<p className="font-mono text-[11px] text-ink-faint mt-6">Ranges are indicative and confirmed after a short scoping call.</p>`

- [ ] **Step 4: Work + CaseStudy — retag copy + meta**

`src/pages/Work.jsx`: hero title → `['Websites that', 'drive results.']`, eyebrow "Selected work". `setMeta` title `'Web Development Portfolio — UpVision Moldova'`, path `/work`, with `locale`. `src/pages/CaseStudy.jsx`: ensure the project name renders as the only `<h1>`; switch its reveals from `once: true` to the rewritten reversible primitives where applicable; `setMeta` per project with `locale` and `breadcrumbLd([Home, Work, project])`.

- [ ] **Step 5: Process / About / Contact / NotFound — copy + h1 + meta + locale**

For each: pass `locale` to `setMeta`; web-dev copy; ensure a single `<h1>` (PageHero title). `src/pages/Process.jsx`: replace `once: true` ScrollTrigger/Framer once-only reveals with the reversible `Reveal`. Contact: keep the form; meta title `'Start a Web Project in Moldova — Contact UpVision'`. NotFound: meta `noindex` is unnecessary but set a clear title.

- [ ] **Step 6: PageHero renders `<h1>`**

In `src/components/PageHero.jsx`, the headline must be an `<h1>` on inner pages (Home’s hero already uses `<h1>`; MaskTitle renders `<h2>`). Add an `as` prop to `MaskTitle` (default `h2`) and pass `as="h1"` from `PageHero`:
```jsx
// Primitives MaskTitle signature becomes: function MaskTitle({ lines, className = '', as: Tag = 'h2' })
// and renders <Tag ref={ref} className={className}>…</Tag>
```
Then in `PageHero.jsx`: `<MaskTitle as="h1" className="display-lg max-w-[18ch]" lines={titleLines} />`.

- [ ] **Step 7: Footer — location, add-ons, internal links**

In `src/components/Footer.jsx`: add a line with `t('footer.location')` (Chișinău, Moldova), the `t('footer.addons')` line, and ensure internal links to Services/Work/Pricing/Contact exist for crawl depth. Use `useT` from `../lib/i18n`.

- [ ] **Step 8: Run full test suite**

Run: `npm test`
Expected: PASS (all suites green).

- [ ] **Step 9: Verify in preview at 1280 / 768 / 360**

Observable checks: each page shows exactly one `<h1>` (inspect); hero/section reveals replay on scroll up/down; Services shows the Add-ons strip clearly subordinate; no layout overflow at 360; `/ro` and `/ru` render (copy mostly EN-fallback, expected this phase).

- [ ] **Step 10: Commit**

```bash
git add src/pages src/components/PageHero.jsx src/components/Footer.jsx src/components/Primitives.jsx
git commit -m "feat(content/seo): web-dev positioning, single H1s, per-page meta + JSON-LD, internal links"
```

---

## Task 12: Performance, responsiveness & Lighthouse pass

**Files:**
- Modify: `src/index.css` (will-change hygiene, any utility additions)
- Modify: `vite.config.js` (manualChunks for vendor split, optional)

- [ ] **Step 1: Vendor chunk split (optional perf win)**

In `vite.config.js`:
```js
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173, open: false },
  build: {
    rollupOptions: {
      output: { manualChunks: { gsap: ['gsap', 'gsap/ScrollTrigger'], framer: ['framer-motion'] } },
    },
  },
})
```

- [ ] **Step 2: will-change hygiene in `src/index.css`**

Add a utility and ensure animated elements clear it; confirm only transform/opacity/filter are animated in custom CSS. Add:
```css
@media (prefers-reduced-motion: no-preference) {
  [data-piece], [data-line] { will-change: transform, opacity; }
}
```

- [ ] **Step 3: Build and run Lighthouse**

Run:
```bash
npm run build
npm run preview
```
Then run Lighthouse (preview tooling) against `/`, `/services`, `/pricing`.
Expected: **Performance ≥ 90, SEO ≥ 90, Best Practices ≥ 90** on each. Record scores.

- [ ] **Step 4: Fix regressions to hit targets**

If a metric < 90, address the specific finding (e.g., image dimensions, unused JS via more aggressive lazy-loading, contrast). Re-run until all three ≥ 90.

- [ ] **Step 5: Responsive sweep**

At 360 / 768 / 1280 confirm: no horizontal scroll, no fixed-px overflow, storytelling scene uses the correct (pinned vs stacked) mode, text remains legible, tap targets ≥ 44px.

- [ ] **Step 6: Commit**

```bash
git add vite.config.js src/index.css
git commit -m "perf: vendor split, will-change hygiene; verified Lighthouse ≥90 perf/seo/best-practices"
```

---

## Phase 1 Definition of Done

- Positioning reads as a custom web development studio; automation appears at most once per page as an optional add-on; no branding/marketing/product-strategy primary offers (positioning test green).
- All scroll reveals play down and reverse up site-wide; storytelling scene builds and un-builds on scrub (desktop) with a stacked fallback (mobile/reduced-motion).
- Premium text effects (split/blur/scramble/mask) present on key headlines.
- EN copy authored; RO/RU drafted and marked; `/`, `/ro`, `/ru` all render; hreflang + locale canonicals emitted.
- LocalBusiness/Organization/Service/FAQ/Breadcrumb JSON-LD present; one `<h1>` per page; Moldova geo signals in place.
- Layouts intact and fluid at 360 / 768 / 1280; reduced-motion respected.
- `npm test` green; Lighthouse Performance / SEO / Best Practices each ≥ 90.

## Out of scope (→ Phase 2 plan)

- Finalized native RO/RU translations (replace drafted strings).
- Static prerendering / SSG so each locale × route ships baked HTML + JSON-LD.
- Regenerated multi-locale `sitemap.xml` and updated `robots.txt`.
