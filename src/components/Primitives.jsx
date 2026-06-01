import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useMagnetic, useCountUp } from '../lib/hooks'

/* Scroll reveal — words/blocks rise into place once. */
export function Reveal({ children, delay = 0, y = 28, className = '', as = 'div' }) {
  const M = motion[as] || motion.div
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </M>
  )
}

/* Headline with masked line-by-line rise. */
export function MaskTitle({ lines, className = '' }) {
  return (
    <h2 className={className}>
      {lines.map((l, i) => (
        <span key={i} style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.05em' }}>
          <motion.span
            style={{ display: 'block' }}
            initial={{ y: '110%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </h2>
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
  const inView = useInView(ref, { once: true, amount: 0.6 })
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
