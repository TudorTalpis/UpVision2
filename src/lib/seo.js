/* Lightweight per-route metadata + JSON-LD.
   In production this pairs with prerender/SSG so crawlers get static HTML. */
const SITE = 'https://upvision.studio'

export function setMeta({ title, description, path = '/', type = 'website' }) {
  document.title = title

  const ensure = (key, val, useProperty = false) => {
    const sel = useProperty ? `meta[property="${key}"]` : `meta[name="${key}"]`
    let el = document.head.querySelector(sel)
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute(useProperty ? 'property' : 'name', key)
      document.head.appendChild(el)
    }
    el.setAttribute('content', val)
  }

  ensure('description', description)
  ensure('og:title', title, true)
  ensure('og:description', description, true)
  ensure('og:type', type, true)
  ensure('og:url', SITE + path, true)
  ensure('twitter:card', 'summary_large_image')
  ensure('twitter:title', title)
  ensure('twitter:description', description)

  let canon = document.head.querySelector('link[rel="canonical"]')
  if (!canon) {
    canon = document.createElement('link')
    canon.setAttribute('rel', 'canonical')
    document.head.appendChild(canon)
  }
  canon.setAttribute('href', SITE + path)
}

export function setJsonLd(id, data) {
  let el = document.getElementById(id)
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = id
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}
