# UpVision Website Revamp — Design Spec

**Date:** 2026-06-01
**Status:** Approved (design); pending implementation plan
**Author:** Claude (with Tudor)

## 1. Goal

Reposition and elevate the existing UpVision site from a generic "full-service
agency" into a **premium custom web development studio**, while preserving the
existing "Growth Ledger" visual identity and overall page structure.

Three pillars:

1. **Positioning** — communicate "We build websites that help businesses grow,"
   not "we do everything."
2. **Motion** — significantly more scroll-driven animation that is **reversible
   by default** (plays on scroll down, reverses on scroll up), plus premium
   text animations, plus an interactive "watch a website get built" storytelling
   sequence.
3. **SEO / i18n / performance** — multilingual (EN/RO/RU) architecture with
   Moldova geo-targeting, static prerendering, and Lighthouse Perf/SEO/Best
   Practices all ≥ 90.

### Non-goals

- Not a redesign of the visual identity (colors, type, layout language stay).
- Not positioning UpVision as a branding, marketing, product, or automation
  studio. Automation is an optional add-on only.
- Not a backend/CMS build. Content stays file-based in `src/lib/`.

## 2. Current state (baseline)

- **Stack:** React 18, Vite 5, Tailwind 4, Framer Motion, Lenis (smooth scroll),
  GSAP (installed but **unused**), react-router-dom 6.
- **Content** is centralized in `src/lib/data.js` (single source of truth).
- **SEO** helpers in `src/lib/seo.js` (`setMeta`, `setJsonLd`) — client-side
  injection only; `setJsonLd` mostly unused; no geo targeting; generic titles.
- **Animation** is 100% Framer Motion. `Reveal` and `MaskTitle`
  (`src/components/Primitives.jsx`) and several pages use
  `viewport={{ once: true }}` → **everything animates once, nothing reverses.**
- **Storytelling** scene `src/sections/Journey.jsx` swaps 8 discrete stages via
  `AnimatePresence` keyed on an `active` index driven by `useInView`. It is not
  scrubbed and does not visually "build" a site.

### Key weaknesses

- W1. Positioning reads as "we do everything" (7 capabilities incl. branding,
  marketing, product strategy, automation as co-equal primary offers).
- W2. All scroll reveals fire once; site feels static; no reverse-on-scroll-up.
- W3. GSAP/ScrollTrigger not used at all; no scrub, no text-split effects.
- W4. SEO is client-rendered, generic, no structured data coverage, no Moldova
  geo signals, single language.

## 3. Decisions (locked)

| # | Decision |
|---|----------|
| D1 | Rebuild service offering around web development (see §4). |
| D2 | GSAP ScrollTrigger for scroll/scrub/reverse; keep Framer Motion for route transitions + small UI. No double-engine on the same element. |
| D3 | Multilingual EN/RO/RU. Build full i18n architecture now; write polished EN; RO/RU machine-drafted and clearly marked for native review. |
| D4 | Add static prerendering (SSG) so each locale × route ships real HTML with baked meta + JSON-LD. |
| D5 | Phase the work: Phase 1 = core revamp in EN (i18n-ready); Phase 2 = enable RO/RU + prerendering across locales. |
| D6 | All pricing numbers and case-study metrics are **illustrative placeholders**, kept as-is but marked in `data.js` for easy replacement. |

## 4. Positioning & content architecture

Content change lives mostly in `src/lib/data.js` + per-page copy.

### Primary services (replaces the 7 "capabilities")

| # | Service | One-liner |
|---|---------|-----------|
| 01 | Custom Websites | Bespoke sites engineered to convert, not templates. |
| 02 | Landing Pages | Single-purpose pages that turn campaigns into leads. |
| 03 | Business Websites | Credible, fast sites that win trust and inquiries. |
| 04 | Web Applications | Custom web apps and internal tools on a modern stack. |
| 05 | E-commerce | Storefronts built to sell and scale. |

### Secondary — "Add-ons, on request" (one light strip, never a headline)

Telegram bots · Business automation · Custom integrations · Workflow
automation. Framing: *"Already building your site? We can wire in automation
where it pays off."* Explicitly optional. **Max one mention per page.** Never
position UpVision as automation experts.

### Removed / reframed as primary offers

- Branding, standalone UI/UX, Marketing Assets, Product Strategy, Business
  Digitalization. UX/UI survives only as *part of how we build sites*, not a
  sold service.
- Pricing tiers re-anchored to website types (e.g. Landing → Business Site →
  Web App / E-commerce) instead of brand-system / growth-retainer framing.
  Existing numbers kept as illustrative placeholders.
- Case studies kept; tags retagged to web-dev language (drop "Brand",
  "Strategy" tag noise). Metrics kept as illustrative.

### Message hierarchy (every page)

website = investment with ROI → credibility / professionalism → lead generation.
Spine sentence: **"We build websites that help businesses grow."**

## 5. Animation system — reversible by default

Root cause of "too static": `once: true`. Reverse becomes the default.

### New module: `src/lib/gsap.js`

- Central `gsap.registerPlugin(ScrollTrigger, SplitText)`.
- Bump GSAP to ≥ 3.13 (SplitText is now free / included).
- Sync ScrollTrigger with Lenis: `lenis.on('scroll', ScrollTrigger.update)` and
  drive via the existing RAF loop. Single source of scroll truth.
- Expose `gsap.matchMedia()` helper for breakpoint-scoped animations.

### Rewritten primitives (`src/components/Primitives.jsx`)

- **`Reveal`** → GSAP-backed. Default
  `toggleActions: 'play reverse play reverse'` (plays down, reverses up, every
  pass). Transform + opacity only. GPU-friendly. Honors reduced-motion (renders
  final state, no animation).
- **`MaskTitle`** → masked line rise via GSAP + SplitText (lines), reversible.

### New primitives

- **`src/components/SplitText.jsx`** — char/word/line reveals: staggered
  entrance, blur-to-sharp, masked rise. Used for headlines. Rebuilds on resize
  (no broken responsive wrapping). Reduced-motion → final state.
- **`src/components/ScrambleText.jsx`** — scramble/decode effect for eyebrows
  and highlighted keywords (Linear/Stripe feel), ScrollTrigger-driven,
  reversible.

### Scrub policy

Scrub reserved for the storytelling scene and a few hero/parallax moments.
**Never scrub body copy** (hurts readability). Text reveals use toggleActions,
not scrub.

### Engine boundaries

Framer Motion retained for: route transitions (`App.jsx`), accordion
(`Services.jsx`), custom cursor. GSAP owns scroll-triggered + scrubbed motion.
No element animated by both engines.

## 6. Scroll storytelling — "watch a website get built"

Rebuild `src/sections/Journey.jsx` into a single **pinned, scrubbed**
ScrollTrigger timeline (sticky frame; scrub tied to scroll → plays forward and
backward). Sequence:

1. **Wireframe** draws in (stroked SVG boxes via `strokeDashoffset`).
2. Wireframe **fills into polished UI** (color, type, real layout).
3. UI **dissolves into code** (markup streams/types in).
4. Code is **edited** while scrolling (lines highlight/change).
5. Code **compiles** (terminal: build → ✓ a11y/seo/perf checks).
6. **Website appears** (finished site renders in the frame).
7. **Visitors arrive** (cursor dots / session counter ticks up).
8. **Growth metrics climb** (leads/revenue line + counters rise).

Implementation: transform/opacity/SVG `pathLength` only. Scrub means scrolling
up literally un-builds the site (reversible by construction).

**Responsive/reduced-motion:** `gsap.matchMedia` swaps to a stacked,
non-pinned fallback on narrow screens and for reduced-motion (no pinning on
mobile → avoids jank). Each step legible standalone.

## 7. SEO & i18n architecture

### Routing & i18n

- Routes: `/` (en, default), `/ro`, `/ru` via a locale path segment.
- `src/lib/i18n/` with `LocaleProvider`, a `t()` keyed dictionary, and
  `en.js` / `ro.js` / `ru.js`.
- EN written properly. RO/RU machine-drafted, each entry marked
  `// TODO: native review` for handoff to a translator.

### Metadata & structured data (`src/lib/seo.js`, made locale-aware)

- Per-locale `hreflang` alternates + `x-default`; locale-aware canonical.
- Site-wide `Organization` + **`LocalBusiness`** (Moldova / Chișinău,
  `areaServed`, geo coordinates).
- Per-page: `Service` list, `BreadcrumbList`, `FAQPage` where relevant.
- One `<h1>` per page; correct `h2/h3` order; semantic landmarks
  (`header/main/nav/footer`); descriptive `alt`; internal linking
  Services↔Work↔Pricing↔Contact.
- Target phrases worked in naturally (titles, H1s, meta, footer): "Web
  Development Moldova", "Website Development Moldova", "Custom Websites
  Moldova", "Business Websites Moldova", "E-commerce Development Moldova".

### Prerendering (Phase 2)

- Add Vite SSG (e.g. `vite-react-ssg` or a prerender plugin) → each of 3
  locales × each route emits static HTML with baked meta + JSON-LD.
- Regenerate `public/sitemap.xml` for all locale URLs; update `public/robots.txt`.

## 8. Performance & responsiveness guardrails

- Route-level `React.lazy` code splitting; dynamic-import GSAP plugins
  (`ScrollTrigger`/`SplitText`) only where used so the hero paints fast.
- Animate **only `transform`/`opacity`**; apply `will-change` transiently, clear
  after. Kill every ScrollTrigger/timeline on unmount (no leaks across routes).
- `gsap.matchMedia` to swap/disable heavy animations per breakpoint: pinning
  desktop-only, lighter sequences tablet, minimal mobile.
- Fluid sizing only: `clamp()`, `min()`, grid/flex. No fixed px layout widths.
- Verify each section at 360 / 768 / 1280 in the preview.
- **Targets: Lighthouse Performance / SEO / Best Practices each ≥ 90**, verified
  before claiming done.

## 9. Phasing

### Phase 1 (this engagement, built i18n-ready, English)

Positioning + content rewrite · GSAP reversible animation system · storytelling
rebuild · SEO foundations (semantics, meta, structured data, Moldova signals) ·
performance + responsiveness pass. Site fully works and is verifiable in EN.

### Phase 2

Enable RO/RU dictionaries + hreflang + static prerendering across all 3 locales;
regenerate sitemap. Additive on top of Phase 1 architecture, not a rewrite.

## 10. File-level change map

**New**

- `src/lib/gsap.js` — plugin registration + Lenis/ScrollTrigger sync + matchMedia helper.
- `src/lib/i18n/index.js`, `src/lib/i18n/en.js`, `ro.js`, `ru.js` — provider + dictionaries.
- `src/components/SplitText.jsx` — char/word/line text reveals.
- `src/components/ScrambleText.jsx` — scramble/keyword effect.

**Rewritten**

- `src/components/Primitives.jsx` — `Reveal`/`MaskTitle` → GSAP, reversible.
- `src/sections/Journey.jsx` — pinned scrubbed "build a website" storytelling.
- `src/lib/data.js` — web-dev positioning content; illustrative items marked.
- `src/lib/seo.js` — locale-aware meta + hreflang + LocalBusiness/Service/FAQ JSON-LD.
- Page copy across `src/pages/*` to the new positioning.

**Light touches**

- `src/App.jsx` — locale routing, ScrollTrigger/Lenis wiring, lazy routes.
- `src/index.css` — any new animation utility classes / will-change hygiene.
- `index.html` — base meta, theme, font hygiene.
- `vite.config.js` — code-split config; (Phase 2) SSG/prerender plugin.
- `public/sitemap.xml`, `public/robots.txt` — (Phase 2) locale URLs.

## 11. Risks & mitigations

- **Two animation libs → bundle weight.** Mitigate: dynamic-import GSAP plugins,
  lazy routes, no overlap of engines; measure with Lighthouse.
- **Pinned scrub jank on mobile.** Mitigate: `matchMedia` non-pinned fallback;
  disable pin under tablet breakpoint.
- **SplitText + responsive reflow breaks lines.** Mitigate: rebuild splits on
  resize; reduced-motion renders final state.
- **SPA SEO ceiling.** Mitigate: Phase 2 prerendering bakes HTML per locale.
- **RO/RU quality.** Mitigate: machine drafts clearly marked for native review;
  EN is the source of truth at launch.

## 12. Success criteria

- Positioning reads unmistakably as a web development studio; automation appears
  at most once per page as an optional add-on.
- Scroll reveals play on the way down and reverse on the way up, site-wide.
- Storytelling scene visibly builds (and un-builds) a website on scrub.
- Premium text animations (split/blur/scramble/mask) present on key headlines.
- Layouts intact and fluid at 360 / 768 / 1280; reduced-motion respected.
- i18n architecture in place (EN live; RO/RU stubbed-and-marked).
- Lighthouse Performance / SEO / Best Practices each ≥ 90.
