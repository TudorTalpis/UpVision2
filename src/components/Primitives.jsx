import { useRef, useLayoutEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useMagnetic, useCountUp } from '../lib/hooks'
import { gsap, registerGsap, prefersReduced } from '../lib/gsap'

const REVERSIBLE = 'play reverse play reverse'

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

/* Headline with masked line-by-line rise — reversible. */
export function MaskTitle({ lines, className = '', as: Tag = 'h2' }) {
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
    <Tag ref={ref} className={className}>
      {lines.map((l, i) => (
        <span key={i} style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.05em' }}>
          <span data-line style={{ display: 'block' }}>{l}</span>
        </span>
      ))}
    </Tag>
  )
}

/* Magnetic link/button. */
export function Magnetic({ children, className = '', to, href, cursor, onClick, strength = 0.35, ...rest }) {
  const ref = useMagnetic(strength)
  const props = { ref, className, 'data-cursor': cursor, onClick, ...rest }
  if (to) return <Link to={to} {...props}>{children}</Link>
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
