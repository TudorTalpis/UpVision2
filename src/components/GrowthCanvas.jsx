import { useEffect, useRef } from 'react'
import { isReduced } from '../lib/hooks'

/* A quiet "digital ecosystem": drifting nodes linked by faint lines,
   with a few accent nodes. Light-theme tuned, capped, pauses offscreen. */
export default function GrowthCanvas() {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current
    if (!c) return
    const ctx = c.getContext('2d')
    const reduced = isReduced()
    let w, h, dpr, nodes, raf, running = true

    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2)
      w = c.clientWidth; h = c.clientHeight
      c.width = w * dpr; c.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(Math.floor((w * h) / 30000), 70)
      nodes = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.6 + 0.6,
        accent: i % 7 === 0,
      }))
    }
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const n of nodes) {
        if (!reduced) { n.x += n.vx; n.y += n.vy }
        if (n.x < 0 || n.x > w) n.vx *= -1
        if (n.y < 0 || n.y > h) n.vy *= -1
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 140) {
            ctx.strokeStyle = `rgba(24,22,15,${(1 - d / 140) * 0.1})`
            ctx.lineWidth = 1
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = n.accent ? 'rgba(242,75,30,0.7)' : 'rgba(24,22,15,0.22)'
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill()
      }
      if (running) raf = requestAnimationFrame(draw)
    }
    resize(); draw()
    addEventListener('resize', resize)
    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting
      if (running) { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw) }
      else cancelAnimationFrame(raf)
    })
    io.observe(c)
    return () => { removeEventListener('resize', resize); io.disconnect(); cancelAnimationFrame(raf) }
  }, [])
  return <canvas ref={ref} className="absolute inset-0 w-full h-full" aria-hidden="true" />
}
