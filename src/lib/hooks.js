import { useEffect, useRef, useState } from 'react'

export const isTouch = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

export const isReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* 3D tilt-toward-pointer — desktop / fine-pointer only, transform-only.
   Tracks the pointer responsively, then eases back slowly on leave. */
export function useTilt(max = 6) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || isTouch() || isReduced()) return
    let raf
    const enter = () => { el.style.transition = 'transform 0.2s ease-out'; el.style.willChange = 'transform' }
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.transform =
          `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateY(-6px)`
      })
    }
    const reset = () => {
      cancelAnimationFrame(raf)
      // slow, eased return to rest
      el.style.transition = 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)'
      el.style.transform = ''
      el.style.willChange = 'auto'
    }
    el.addEventListener('mouseenter', enter)
    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', reset)
    return () => {
      el.removeEventListener('mouseenter', enter)
      el.removeEventListener('mousemove', move)
      el.removeEventListener('mouseleave', reset)
      cancelAnimationFrame(raf)
    }
  }, [max])
  return ref
}

/* Magnetic hover — desktop / fine-pointer only. */
export function useMagnetic(strength = 0.35) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || isTouch() || isReduced()) return
    let raf
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - (r.left + r.width / 2)) * strength
      const y = (e.clientY - (r.top + r.height / 2)) * strength
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => { el.style.transform = `translate(${x}px,${y}px)` })
    }
    const reset = () => { el.style.transform = 'translate(0,0)' }
    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', reset)
    return () => {
      el.removeEventListener('mousemove', move)
      el.removeEventListener('mouseleave', reset)
      cancelAnimationFrame(raf)
    }
  }, [strength])
  return ref
}

/* Typewriter that begins when `start` flips true. */
export function useTypewriter(lines, { speed = 18, start = false } = {}) {
  const [out, setOut] = useState([])
  const [done, setDone] = useState(false)
  useEffect(() => {
    if (!start) return
    let li = 0, ci = 0, alive = true
    const buf = lines.map((l) => ({ ...l, text: '' }))
    const tick = () => {
      if (!alive) return
      if (li >= lines.length) { setDone(true); return }
      const full = lines[li].text
      if (ci <= full.length) {
        buf[li] = { ...lines[li], text: full.slice(0, ci) }
        setOut(buf.slice(0, li + 1))
        ci++
        setTimeout(tick, speed)
      } else { li++; ci = 0; setTimeout(tick, 240) }
    }
    const t = setTimeout(tick, 250)
    return () => { alive = false; clearTimeout(t) }
  }, [start])
  return { out, done }
}

/* Count-up when `start` is true. Resets to 0 when start flips false (re-counts every pass). */
export function useCountUp(target, { start = false, dur = 1500, dec = 0 } = {}) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!start) { setVal(0); return }
    let raf, t0
    const step = (t) => {
      if (!t0) t0 = t
      const p = Math.min((t - t0) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(target * eased)
      if (p < 1) raf = requestAnimationFrame(step)
      else setVal(target)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [start, target, dur])
  return dec ? val.toFixed(dec) : Math.round(val)
}
