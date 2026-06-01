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
