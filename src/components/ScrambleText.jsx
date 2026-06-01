import { useRef, useLayoutEffect } from 'react'
import { gsap, registerGsap, prefersReduced } from '../lib/gsap'

const GLYPHS = '!<>-_\\/[]{}—=+*^?#'

/** Decode-from-noise effect, driven by ScrollTrigger, reversible. */
export default function ScrambleText({ text, as: Tag = 'span', className = '', start = 'top 90%' }) {
  const displayRef = useRef(null)
  useLayoutEffect(() => {
    const el = displayRef.current
    if (!el) return
    if (prefersReduced()) { el.textContent = text; return }
    registerGsap()
    const state = { p: 0 }
    const render = () => {
      const reveal = Math.floor(state.p * text.length)
      let out = ''
      for (let i = 0; i < text.length; i++) {
        out += i < reveal ? text[i]
          : (text[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0])
      }
      el.textContent = out
    }
    const ctx = gsap.context(() => {
      gsap.to(state, {
        p: 1, duration: 0.9, ease: 'power1.inOut', onUpdate: render,
        scrollTrigger: { trigger: el, start, toggleActions: 'play reverse play reverse' },
      })
    }, displayRef)
    return () => ctx.revert()
  }, [text, start])
  return (
    <Tag className={className} aria-label={text}>
      {/* Visually hidden real text — always in the DOM for tests and screen readers */}
      <span style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>{text}</span>
      {/* Animated display span */}
      <span ref={displayRef} aria-hidden="true">{text}</span>
    </Tag>
  )
}
