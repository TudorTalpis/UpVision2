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

  let canon = document.head.querySelector('link[rel="canonical"]')
  if (!canon) { canon = document.createElement('link'); canon.rel = 'canonical'; document.head.appendChild(canon) }
  canon.href = localePath(locale, path)

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
