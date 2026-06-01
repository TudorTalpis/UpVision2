import { useEffect } from 'react'
import { Magnetic } from '../components/Primitives.jsx'
import { setMeta } from '../lib/seo'

export default function NotFound() {
  useEffect(() => setMeta({ title: 'Page not found | UpVision', description: 'That page has moved or never existed.', path: '/404' }), [])
  return (
    <section className="relative min-h-[100svh] grid place-items-center text-center overflow-hidden">
      <div className="ledger-grid" />
      <div className="shell relative z-10">
        <div className="font-display font-semibold text-accent leading-none" style={{ fontSize: 'clamp(90px,22vw,260px)', letterSpacing: '-0.05em' }}>404</div>
        <p className="text-lg text-ink-soft mt-4 mb-9">This page didn’t make it past launch. Let’s get you back on track.</p>
        <Magnetic to="/" className="btn btn--accent" cursor="Home"><span className="btn__dot" /> Back to home</Magnetic>
      </div>
    </section>
  )
}
