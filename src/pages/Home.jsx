import { useEffect } from 'react'
import { motion } from 'framer-motion'
import GrowthCanvas from '../components/GrowthCanvas.jsx'
import Journey from '../sections/Journey.jsx'
import { Reveal, MaskTitle, Magnetic, Stat } from '../components/Primitives.jsx'
import SplitText from '../components/SplitText.jsx'
import ScrambleText from '../components/ScrambleText.jsx'
import { SERVICES, PROJECTS, STATS, FAQ } from '../lib/data'
import { setMeta, setJsonLd, organizationLd, localBusinessLd, faqLd } from '../lib/seo'
import { useLocale, useT, LocaleLink as Link } from '../lib/i18n'

export default function Home() {
  const { locale } = useLocale()
  const t = useT()
  useEffect(() => {
    setMeta({
      title: 'UpVision — Custom Web Development in Moldova',
      description: 'We build fast, custom websites, landing pages, business sites, web apps and online stores for businesses in Moldova and beyond.',
      path: '/', locale,
    })
    setJsonLd('ld-org', organizationLd())
    setJsonLd('ld-local', localBusinessLd())
    setJsonLd('ld-faq', faqLd(FAQ))
  }, [locale])

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative min-h-[100svh] flex items-center pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-70"><GrowthCanvas /></div>
        <div className="ledger-grid" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(70% 50% at 50% 18%, transparent 40%, var(--color-paper) 100%)' }} />

        <div className="shell relative z-10">
          <motion.div className="mb-7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <ScrambleText key={locale} as="span" className="eyebrow" text={t('hero.eyebrow')} />
          </motion.div>

          <h1 className="display-xl font-semibold max-w-[15ch]">
            <SplitText key={`a${locale}`} as="span" className="block" by="word" play="load" delay={0.12} text={`${t('hero.l1')} ${t('hero.l2')} ${t('hero.l3')}`} />
            <SplitText key={`b${locale}`} as="span" className="block serif-italic text-accent" by="word" play="load" delay={0.78} text={t('hero.accent')} />
          </h1>

          <p className="mt-8 text-[clamp(17px,1.6vw,21px)] text-ink-soft max-w-[52ch]">
            <SplitText key={`c${locale}`} as="span" by="word" blur={false} y="0.4em" stagger={0.012} play="load" delay={0.9} text={t('hero.sub')} />
          </p>

          <motion.div className="mt-10 flex flex-wrap gap-3.5" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.82, duration: 0.8 }}>
            <Magnetic to="/contact" className="btn btn--accent" cursor="Book a call"><span className="btn__dot" /> {t('hero.ctaPrimary')}</Magnetic>
            <Magnetic to="/work" className="btn btn--ghost" cursor="See work">{t('hero.ctaSecondary')}</Magnetic>
          </motion.div>

          <motion.div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[12px] uppercase tracking-[0.14em] text-ink-faint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.8 }}>
            {t('hero.steps').split(',').map((w, i, a) => (
              <span key={w} className="flex items-center gap-8">{w}{i < a.length - 1 && <span className="text-accent">→</span>}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------- MANIFESTO ---------- */}
      <section className="relative py-[clamp(70px,11vh,150px)] border-y border-line bg-paper-2/40">
        <div className="shell">
          <div className="eyebrow mb-8"><ScrambleText key={locale} as="span" text={t('manifesto.eyebrow')} /></div>
          <MaskTitle
            key={locale}
            className="display-md font-medium max-w-[20ch] [&_em]:not-italic"
            lines={t('manifesto.title').split('|')}
          />
          <Reveal delay={0.2} className="mt-10 grid md:grid-cols-3 gap-8 max-w-5xl">
            {[
              [t('manifesto.c1t'), t('manifesto.c1d')],
              [t('manifesto.c2t'), t('manifesto.c2d')],
              [t('manifesto.c3t'), t('manifesto.c3d')],
            ].map(([title, desc]) => (
              <div key={title} className="border-t border-line-strong pt-5">
                <h3 className="font-display text-xl font-semibold mb-2">{title}</h3>
                <p className="text-ink-soft text-[15px]">{desc}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------- JOURNEY (the scene) ---------- */}
      <Journey />

      {/* ---------- SERVICES PREVIEW ---------- */}
      <section className="relative py-[clamp(70px,11vh,150px)] night overflow-hidden">
        <div className="ledger-grid" style={{ opacity: 0.16 }} />
        <div className="shell relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <span className="eyebrow mb-6"><ScrambleText key={locale} as="span" text={t('svcPrev.eyebrow')} /></span>
              <MaskTitle key={locale} className="display-md mt-5 max-w-[16ch]" lines={t('svcPrev.title').split('|')} />
            </div>
            <Link to="/services" className="btn btn--ghost !text-paper !border-white/25 hover:!border-white self-start" data-cursor="All services">{t('svcPrev.all')}</Link>
          </div>

          <div className="border-t border-white/12">
            {SERVICES.map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.06} x={-28}>
                <Link to="/services" className="group grid grid-cols-[40px_1fr_auto] md:grid-cols-[64px_1fr_1fr_auto] items-center gap-4 py-6 border-b border-white/12 transition-colors hover:bg-white/[0.03] hover:pl-2" data-cursor="Explore">
                  <span className="font-mono text-sm text-paper/40">{s.n}</span>
                  <h3 className="font-display text-[clamp(20px,2.6vw,30px)] font-medium group-hover:text-accent transition-colors">{s.title}</h3>
                  <p className="hidden md:block text-paper/55 text-[15px]">{s.short}</p>
                  <span className="text-paper/40 group-hover:text-accent group-hover:translate-x-1 transition-all">↗</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- WORK PREVIEW ---------- */}
      <section className="relative py-[clamp(70px,11vh,150px)]">
        <div className="shell">
          <div className="flex items-end justify-between gap-6 mb-12">
            <div>
              <span className="eyebrow mb-6"><ScrambleText key={locale} as="span" text={t('workPrev.eyebrow')} /></span>
              <MaskTitle key={locale} className="display-md mt-5 max-w-[14ch]" lines={t('workPrev.title').split('|')} />
            </div>
            <Link to="/work" className="btn btn--ghost self-start hidden sm:inline-flex" data-cursor="All work">{t('workPrev.all')}</Link>
          </div>

          <div className="grid md:grid-cols-2 gap-[clamp(20px,3vw,40px)]">
            {PROJECTS.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 2) * 0.08} className={i % 2 ? 'md:mt-16' : ''}>
                <Link to={`/work/${p.slug}`} className="group block transition-transform duration-500 ease-out hover:-translate-y-1.5" data-cursor="View case">
                  <div className="relative aspect-[16/11] rounded-2xl overflow-hidden flex items-end p-7" style={{ background: `linear-gradient(150deg, ${p.accent}, ${p.accent}99)` }}>
                    <div className="absolute inset-0 opacity-30 mix-blend-overlay transition-transform duration-700 ease-out group-hover:scale-110" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
                    <span className="relative z-10 block font-display text-white font-semibold text-[clamp(24px,3.4vw,40px)] leading-none max-w-[11ch] group-hover:translate-x-1 transition-transform">{p.result}</span>
                  </div>
                  <div className="flex items-start justify-between gap-4 mt-5">
                    <div>
                      <h3 className="font-display text-2xl font-semibold">{p.name}</h3>
                      <span className="font-mono text-[13px] text-ink-faint">{p.cat}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 justify-end max-w-[55%]">
                      {p.tags.map((tag) => <span key={tag} className="font-mono text-[11px] px-2.5 py-1 rounded-full border border-line text-ink-soft">{tag}</span>)}
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- PROOF STATS ---------- */}
      <section className="relative py-[clamp(60px,9vh,120px)] bg-paper-2/40 border-y border-line">
        <div className="shell grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
          {STATS.map((s) => <Stat key={s.label} {...s} />)}
        </div>
      </section>

      {/* ---------- PRICING TEASER ---------- */}
      <section className="relative py-[clamp(70px,11vh,150px)]">
        <div className="ledger-grid" />
        <div className="shell relative z-10 text-center max-w-3xl mx-auto">
          <span className="eyebrow justify-center mb-7" style={{ display: 'inline-flex' }}><ScrambleText key={locale} as="span" text={t('priceTeaser.eyebrow')} /></span>
          <MaskTitle key={locale} className="display-md mb-6" lines={t('priceTeaser.title').split('|')} />
          <Reveal delay={0.2}>
            <p className="text-lg text-ink-soft mb-10">{t('priceTeaser.body')}</p>
            <Magnetic to="/pricing" className="btn btn--accent" cursor="See pricing"><span className="btn__dot" /> {t('priceTeaser.cta')}</Magnetic>
          </Reveal>
        </div>
      </section>
    </>
  )
}
