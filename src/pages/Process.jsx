import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import PageHero from '../components/PageHero.jsx'
import { Reveal, Magnetic, Tilt } from '../components/Primitives.jsx'
import { setMeta } from '../lib/seo'
import { useLocale, useT } from '../lib/i18n'
import { useContent } from '../lib/i18n/content.js'

export default function Process() {
  const track = useRef(null)
  const { scrollYProgress } = useScroll({ target: track, offset: ['start 30%', 'end 70%'] })
  const fill = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const { locale } = useLocale()
  const t = useT()
  const { PROCESS } = useContent()

  useEffect(() => setMeta({
    title: 'How We Build Websites — UpVision Process',
    description: 'Our five-step process: Discover, Design, Build, Launch and Grow — a transparent path from idea to a website that pays for itself.',
    path: '/process', locale,
  }), [locale])

  return (
    <>
      <PageHero
        eyebrow={t('proc.eyebrow')}
        titleLines={t('proc.title').split('|')}
        intro={t('proc.intro')}
      />

      <section className="relative pb-[clamp(70px,11vh,150px)]">
        <div className="shell">
          <div ref={track} className="relative grid lg:grid-cols-[80px_1fr] gap-0">
            {/* spine */}
            <div className="hidden lg:block relative">
              <div className="sticky top-32 ml-9 w-px h-[60vh] bg-line">
                <motion.div className="absolute top-0 left-0 w-full bg-accent" style={{ height: fill }} />
              </div>
            </div>

            <div className="space-y-[clamp(40px,7vh,90px)]">
              {PROCESS.map((p, i) => (
                <Reveal key={p.n} delay={i * 0.03}>
                  <div className="grid md:grid-cols-[1fr_0.7fr] gap-8 border-t border-line pt-9">
                    <div>
                      <div className="flex items-center gap-4 mb-5">
                        <span className="grid place-items-center w-12 h-12 rounded-full border border-line-strong font-mono text-sm">{p.n}</span>
                        <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-faint">{t('proc.stage')} {p.n} / 05</span>
                      </div>
                      <h2 className="font-display text-[clamp(30px,4.5vw,56px)] font-semibold mb-4">{p.title}</h2>
                      <p className="text-lg text-ink-soft max-w-[48ch]">{p.d}</p>
                    </div>
                    <div className="md:pt-2">
                      <Tilt max={6} className="rounded-xl border border-line bg-panel p-6 will-change-transform transition-[box-shadow,border-color] duration-300 hover:border-accent/40 hover:shadow-[0_22px_55px_-42px_rgba(24,22,15,0.55)]">
                        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">{t('proc.youLeave')}</span>
                        <div className="font-display text-2xl font-semibold mt-2 text-gain">{p.out}</div>
                        <div className="mt-5 h-1.5 rounded-full bg-line overflow-hidden">
                          <motion.div className="h-full bg-gain rounded-full" initial={{ width: 0 }} whileInView={{ width: `${((i + 1) / PROCESS.length) * 100}%` }} viewport={{ once: false }} transition={{ duration: 1, delay: 0.2 }} />
                        </div>
                        <span className="font-mono text-[11px] text-ink-faint mt-2 inline-block">{Math.round(((i + 1) / PROCESS.length) * 100)}% {t('proc.toRevenue')}</span>
                      </Tilt>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-[clamp(60px,9vh,120px)] text-center bg-paper-2/40 border-y border-line">
        <div className="shell max-w-2xl mx-auto">
          <h2 className="display-md mb-7">{t('proc.ctaT')}</h2>
          <Magnetic to="/contact" className="btn btn--accent" cursor="Book a call"><span className="btn__dot" /> {t('proc.ctaBtn')}</Magnetic>
        </div>
      </section>
    </>
  )
}
