import { useRef, useLayoutEffect } from 'react'
import { prefersReduced } from '../lib/gsap'

const GLYPHS = '!<>-_\\/[]{}—=+*^?#'
const DURATION = 850

/**
 * Decode-from-noise text effect. Driven by IntersectionObserver so it fires
 * reliably whenever the element (re)enters the viewport, and always settles
 * on the real text. Reduced-motion renders the text immediately.
 */
export default function ScrambleText({ text, as: Tag = 'span', className = '', amount = 0.6 }) {
  const displayRef = useRef(null)
  useLayoutEffect(() => {
    const el = displayRef.current
    if (!el) return
    if (prefersReduced()) { el.textContent = text; return }

    let raf, t0
    const render = (p) => {
      const reveal = Math.floor(p * text.length)
      let out = ''
      for (let i = 0; i < text.length; i++) {
        out += i < reveal ? text[i]
          : (text[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0])
      }
      el.textContent = out
    }
    const tick = (t) => {
      if (!t0) t0 = t
      const p = Math.min((t - t0) / DURATION, 1)
      render(p)
      if (p < 1) raf = requestAnimationFrame(tick)
      else el.textContent = text
    }
    const play = () => { t0 = 0; cancelAnimationFrame(raf); raf = requestAnimationFrame(tick) }

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) play() }),
      { threshold: amount }
    )
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [text, amount])

  return (
    <Tag className={className} aria-label={text}>
      {/* Visually hidden real text — always in the DOM for tests + screen readers */}
      <span style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>{text}</span>
      {/* Animated display span */}
      <span ref={displayRef} aria-hidden="true">{text}</span>
    </Tag>
  )
}
