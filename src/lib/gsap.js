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

if (typeof window !== 'undefined') {
  let rt
  window.addEventListener('resize', () => {
    clearTimeout(rt)
    rt = setTimeout(() => ScrollTrigger.refresh(), 200)
  })
}
