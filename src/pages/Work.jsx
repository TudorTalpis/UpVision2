import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import PageHero from '../components/PageHero.jsx'
import { Reveal, Tilt } from '../components/Primitives.jsx'
import { setMeta } from '../lib/seo'
import { isTouch } from '../lib/hooks'
import { useLocale, useT, LocaleLink as Link } from '../lib/i18n'
import { useContent } from '../lib/i18n/content.js'

export default function Work() {
  const [hover, setHover] = useState(null)
  const preview = useRef(null)
  const touch = typeof window !== 'undefined' && isTouch()
  const { locale } = useLocale()
  const t = useT()
  const { PROJECTS } = useContent()

  useEffect(() => setMeta({
    title: 'Web Development Portfolio — UpVision Moldova',
    description: 'A selection of custom websites, web apps and online stores we have designed and built.',
    path: '/work', locale,
  }), [locale])

  useEffect(() => {
    if (touch) return
    const move = (e) => {
      if (preview.current) preview.current.style.transform = `translate(${e.clientX + 24}px, ${e.clientY - 120}px)`
    }
    addEventListener('mousemove', move)
    return () => removeEventListener('mousemove', move)
  }, [touch])

  return (
    <>
      <PageHero
        eyebrow={t('work.eyebrow')}
        titleLines={t('work.title').split('|')}
        intro={t('work.intro')}
      />

      {/* desktop: hover-reveal list · mobile: cards */}
      <section className="relative pb-[clamp(70px,11vh,150px)]">
        <div className="shell">
          {/* floating preview (desktop) */}
          {!touch && (
            <div ref={preview} className="fixed top-0 left-0 z-[40] pointer-events-none transition-opacity duration-300" style={{ opacity: hover !== null ? 1 : 0 }}>
              <div className="w-[300px] aspect-[16/11] rounded-xl overflow-hidden shadow-2xl" style={{ background: hover !== null ? `linear-gradient(150deg, ${PROJECTS[hover].accent}, ${PROJECTS[hover].accent}99)` : '#000' }}>
                <div className="w-full h-full grid place-items-center font-display text-white font-semibold text-3xl">{hover !== null && PROJECTS[hover].name}</div>
              </div>
            </div>
          )}

          <div className="hidden md:block border-t border-line">
            {PROJECTS.map((p, i) => (
              <Link key={p.slug} to={`/work/${p.slug}`} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
                className="group grid grid-cols-[64px_1.4fr_1fr_auto] items-center gap-6 py-8 border-b border-line transition-colors" data-cursor="Open case"
                style={{ opacity: hover === null || hover === i ? 1 : 0.4 }}>
                <span className="font-mono text-sm text-ink-faint">0{i + 1}</span>
                <h2 className="font-display text-[clamp(28px,4vw,52px)] font-medium group-hover:text-accent transition-colors group-hover:translate-x-2 duration-500">{p.name}</h2>
                <div>
                  <div className="font-mono text-[13px] text-ink-faint">{p.cat}</div>
                  <div className="text-gain font-semibold mt-1">{p.result}</div>
                </div>
                <span className="text-2xl text-ink-faint group-hover:text-accent transition-colors">↗</span>
              </Link>
            ))}
          </div>

          {/* mobile cards */}
          <div className="md:hidden grid gap-6">
            {PROJECTS.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.05}>
                <Link to={`/work/${p.slug}`} className="group block">
                  <Tilt max={4}>
                    <div className="relative aspect-[16/11] rounded-2xl overflow-hidden flex items-end p-6" style={{ background: `linear-gradient(150deg, ${p.accent}, ${p.accent}99)` }}>
                      <span className="font-display text-white font-semibold text-3xl">{p.result}</span>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div><h3 className="font-display text-xl font-semibold">{p.name}</h3><span className="font-mono text-xs text-ink-faint">{p.cat}</span></div>
                      <span className="text-xl text-ink-faint transition-transform group-hover:translate-x-1">↗</span>
                    </div>
                  </Tilt>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
