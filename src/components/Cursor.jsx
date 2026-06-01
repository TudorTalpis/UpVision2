import { useEffect, useRef, useState } from 'react'
import { isTouch } from '../lib/hooks'

export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const [label, setLabel] = useState('')
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (isTouch()) return
    document.body.classList.add('has-cursor')
    const pos = { x: innerWidth / 2, y: innerHeight / 2 }
    const rp = { ...pos }
    let raf
    const move = (e) => {
      pos.x = e.clientX; pos.y = e.clientY
      if (dot.current) dot.current.style.transform = `translate(${pos.x}px,${pos.y}px)`
    }
    const loop = () => {
      rp.x += (pos.x - rp.x) * 0.2; rp.y += (pos.y - rp.y) * 0.2
      if (ring.current) ring.current.style.transform = `translate(${rp.x}px,${rp.y}px)`
      raf = requestAnimationFrame(loop)
    }
    const over = (e) => {
      const t = e.target.closest('[data-cursor]')
      if (t) { setActive(true); setLabel(t.getAttribute('data-cursor') || '') }
      else if (e.target.closest('a,button')) { setActive(true); setLabel('') }
      else { setActive(false); setLabel('') }
    }
    addEventListener('mousemove', move)
    addEventListener('mouseover', over)
    loop()
    return () => {
      removeEventListener('mousemove', move)
      removeEventListener('mouseover', over)
      cancelAnimationFrame(raf)
      document.body.classList.remove('has-cursor')
    }
  }, [])

  if (typeof window !== 'undefined' && isTouch()) return null
  return (
    <>
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className={`cursor-ring ${active ? 'is-active' : ''} ${label ? 'has-label' : ''}`}>
        {label && <span>{label}</span>}
      </div>
    </>
  )
}
