import { useEffect } from 'react'
import PageHero from '../components/PageHero.jsx'
import { Reveal, Stat, Magnetic } from '../components/Primitives.jsx'
import { setMeta } from '../lib/seo'
import { useLocale, useT } from '../lib/i18n'
import { useContent } from '../lib/i18n/content.js'

export default function About() {
  const { locale } = useLocale()
  const t = useT()
  const { STATS, values: VALUES, marquee: MARQUEE } = useContent()
  useEffect(() => setMeta({
    title: 'About UpVision — Web Development Studio in Moldova',
    description: 'UpVision is a founder-led web development studio in Chișinău, Moldova — building custom websites, web apps and online stores for businesses that want to grow.',
    path: '/about', locale,
  }), [locale])

  return (
    <>
      <PageHero
        eyebrow={t('about.eyebrow')}
        titleLines={t('about.title').split('|')}
        intro={t('about.intro')}
      />

      {/* marquee */}
      <div className="border-y border-line py-6 overflow-hidden bg-paper-2/30">
        <div className="flex w-max gap-12 font-display text-[clamp(26px,4vw,48px)] font-medium text-ink-faint" style={{ animation: 'marquee 32s linear infinite' }}>
          {[...MARQUEE, ...MARQUEE].map((m, i) => <span key={i} className="flex items-center gap-12 whitespace-nowrap">{m}<i className="text-accent text-[0.4em] not-italic">✳</i></span>)}
        </div>
      </div>

      {/* story + stats */}
      <section className="relative py-[clamp(70px,11vh,150px)]">
        <div className="shell grid lg:grid-cols-2 gap-[clamp(32px,5vw,90px)]">
          <Reveal>
            <span className="eyebrow mb-6">{t('about.whyEyebrow')}</span>
            <h2 className="display-md mt-5 mb-6">{t('about.whyT')}</h2>
            <div className="space-y-4 text-lg text-ink-soft max-w-[52ch]">
              <p>{t('about.p1')}</p>
              <p>{t('about.p2')}</p>
              <p>{t('about.p3')}</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-y-12 gap-x-6 self-center">
            {STATS.map((s) => <Stat key={s.label} {...s} big />)}
          </div>
        </div>
      </section>

      {/* values */}
      <section className="relative py-[clamp(60px,9vh,120px)] night overflow-hidden">
        <div className="ledger-grid" style={{ opacity: 0.16 }} />
        <div className="shell relative z-10">
          <h2 className="display-md mb-12 max-w-[16ch]">{t('about.valuesT')}</h2>
          <div className="grid sm:grid-cols-2 gap-px bg-white/10 rounded-2xl overflow-hidden">
            {VALUES.map(([title, desc], i) => (
              <Reveal key={title} delay={i * 0.05} className="bg-night p-8">
                <span className="font-mono text-sm text-accent">0{i + 1}</span>
                <h3 className="font-display text-2xl font-semibold mt-3 mb-3">{title}</h3>
                <p className="text-paper/60">{desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-[clamp(70px,11vh,140px)] text-center">
        <div className="shell max-w-2xl mx-auto">
          <h2 className="display-md mb-7">{t('about.ctaT')}</h2>
          <Magnetic to="/contact" className="btn btn--accent" cursor="Book a call"><span className="btn__dot" /> {t('about.ctaBtn')}</Magnetic>
        </div>
      </section>
    </>
  )
}
