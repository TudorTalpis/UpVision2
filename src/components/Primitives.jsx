import { Fragment, useRef, useLayoutEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useMagnetic, useCountUp, useTilt, isTouch } from '../lib/hooks'
import { useLocalePath } from '../lib/i18n'
import { gsap, ScrollTrigger, registerGsap, prefersReduced } from '../lib/gsap'

// Play when scrolled into view; reverse only when scrolled back up past it
// (so content stays visible as you continue down, and replays on the way up).
const REVERSIBLE = 'play none none reverse'

/* Scroll reveal — rises in on the way down, reverses on the way up, every pass. */
export function Reveal({ children, delay = 0, y = 28, x = 0, className = '', as = 'div' }) {
  const ref = useRef(null)
  const Tag = as
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReduced()) { gsap.set(el, { clearProps: 'all' }); return }
    registerGsap()
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { autoAlpha: 0, y, x },
        {
          autoAlpha: 1, y: 0, x: 0, duration: 0.8, delay, ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: REVERSIBLE },
        })
    }, ref)
    return () => ctx.revert()
  }, [delay, y, x])
  return <Tag ref={ref} className={className}>{children}</Tag>
}

/* Headline with word-by-word blur-to-sharp reveal — reverses on every pass. */
export function MaskTitle({ lines, className = '', as: Tag = 'h2' }) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const words = root.querySelectorAll('[data-word]')
    if (prefersReduced()) { gsap.set(words, { clearProps: 'all' }); return }
    registerGsap()
    const blur = isTouch() ? {} : { filter: 'blur(12px)' } // blur is janky on phones
    const ctx = gsap.context(() => {
      gsap.fromTo(words,
        { yPercent: 90, autoAlpha: 0, ...blur },
        {
          yPercent: 0, autoAlpha: 1, ...(isTouch() ? {} : { filter: 'blur(0px)' }), duration: 0.85, ease: 'expo.out', stagger: 0.06,
          scrollTrigger: { trigger: root, start: 'top 82%', toggleActions: REVERSIBLE },
        })
    }, ref)
    return () => ctx.revert()
  }, [lines])
  return (
    <Tag ref={ref} className={className}>
      {lines.map((l, i) => (
        <span key={i} style={{ display: 'block' }}>
          {l.split(' ').map((w, j) => (
            <Fragment key={j}>
              <span data-word style={{ display: 'inline-block', willChange: 'transform, opacity' }}>{w}</span>{' '}
            </Fragment>
          ))}
        </span>
      ))}
    </Tag>
  )
}

/* Scroll-linked parallax — drifts as you scroll (scrubbed). Keep speed small. */
export function Parallax({ children, speed = 0.12, className = '', as = 'div' }) {
  const ref = useRef(null)
  const Tag = as
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReduced()) return
    registerGsap()
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { yPercent: -speed * 100 },
        {
          yPercent: speed * 100, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        })
    }, ref)
    return () => ctx.revert()
  }, [speed])
  return <Tag ref={ref} className={className}>{children}</Tag>
}

/* Tilt-on-hover wrapper with a pointer-following glare. Eases back slowly
   on leave. Desktop only (the hook no-ops on touch / reduced-motion). */
export function Tilt({ children, className = '', max = 6, as = 'div' }) {
  const ref = useTilt(max)
  const Tag = as
  return (
    <Tag ref={ref} className={`relative overflow-hidden ${className}`}>
      {children}
      <span className="tilt-glare" aria-hidden="true" />
    </Tag>
  )
}

/* Magnetic link/button. */
export function Magnetic({ children, className = '', to, href, cursor, onClick, strength = 0.35, ...rest }) {
  const ref = useMagnetic(strength)
  const localePath = useLocalePath()
  const props = { ref, className, 'data-cursor': cursor, onClick, ...rest }
  if (to) return <Link to={localePath(to)} {...props}>{children}</Link>
  if (href) return <a href={href} {...props}>{children}</a>
  return <button {...props}>{children}</button>
}

/* Count-up stat. */
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

/* Infinite marquee row. */
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
