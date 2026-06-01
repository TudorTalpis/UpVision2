import { useRef, useLayoutEffect } from 'react'
import { gsap, registerGsap, prefersReduced } from '../lib/gsap'

/**
 * Char/word reveal. Splits `text` into spans and animates them in with a
 * stagger and an optional blur-to-sharp feel.
 *
 * play="scroll" (default): driven by ScrollTrigger, reverses on scroll up.
 * play="load": plays once on mount (for above-the-fold content like the hero).
 */
export default function SplitText({
  text, by = 'word', as: Tag = 'span', className = '',
  stagger = 0.045, y = '0.7em', blur = true, start = 'top 85%',
  play = 'scroll', delay = 0,
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
      const from = { yPercent: 70, autoAlpha: 0, filter: blur ? 'blur(10px)' : 'blur(0px)' }
      const to = {
        yPercent: 0, autoAlpha: 1, filter: 'blur(0px)',
        duration: 0.85, ease: 'expo.out', stagger,
      }
      if (play === 'load') {
        gsap.fromTo(targets, from, { ...to, delay })
      } else {
        gsap.fromTo(targets, from, {
          ...to,
          scrollTrigger: { trigger: root, start, toggleActions: 'play reverse play reverse' },
        })
      }
    }, ref)
    return () => ctx.revert()
  }, [text, by, stagger, blur, start, play, delay])

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
