import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageHero from '../components/PageHero.jsx'
import { Reveal, Magnetic } from '../components/Primitives.jsx'
import { SERVICES, PROCESS } from '../lib/data'
import { setMeta, setJsonLd } from '../lib/seo'

export default function Services() {
  const [open, setOpen] = useState('web-design-development')
  useEffect(() => {
    setMeta({
      title: 'Services — Web development, branding, UI/UX & automation | UpVision',
      description: 'Website design & development, branding, UI/UX, automation, business digitalization and growth — delivered as one revenue-focused system.',
      path: '/services',
    })
    setJsonLd('ld-services', {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: SERVICES.map((s, i) => ({
        '@type': 'Service', position: i + 1, name: s.title, description: s.short,
        provider: { '@type': 'Organization', name: 'UpVision' },
      })),
    })
  }, [])

  return (
    <>
      <PageHero
        eyebrow="Capabilities"
        titleLines={['Everything from', 'idea to income.']}
        intro="Seven capabilities, one team. Engage them individually or as a complete growth system — either way, every deliverable maps to a business outcome."
      />

      <section className="relative pb-[clamp(70px,11vh,150px)]">
        <div className="shell">
          <div className="border-t border-line">
            {SERVICES.map((s) => {
              const isOpen = open === s.slug
              return (
                <div key={s.slug} className="border-b border-line">
                  <button
                    onClick={() => setOpen(isOpen ? '' : s.slug)}
                    className="w-full grid grid-cols-[44px_1fr_auto] md:grid-cols-[72px_1fr_1fr_auto] items-center gap-4 py-7 text-left transition-colors hover:opacity-100"
                    data-cursor={isOpen ? 'Close' : 'Open'}
                    style={{ opacity: isOpen ? 1 : 0.92 }}
                  >
                    <span className="font-mono text-sm text-accent">{s.n}</span>
                    <h2 className="font-display text-[clamp(24px,3.4vw,42px)] font-medium">{s.title}</h2>
                    <p className="hidden md:block text-ink-soft text-[15px]">{s.short}</p>
                    <span className={`text-2xl text-ink-faint transition-transform duration-500 ${isOpen ? 'rotate-45 text-accent' : ''}`}>+</span>
                  </button>
                  <motion.div initial={false} animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                    <div className="grid md:grid-cols-[72px_1.4fr_1fr] gap-6 pb-9 md:pl-0">
                      <span className="hidden md:block" />
                      <p className="text-ink-soft text-[17px] max-w-[52ch]">{s.body}
                        <span className="block mt-4 text-ink font-medium">Outcome — {s.outcome}</span>
                      </p>
                      <div>
                        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">Includes</span>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {s.deliverables.map((d) => <span key={d} className="font-mono text-[12px] px-3 py-1.5 rounded-full border border-line-strong text-ink-soft">{d}</span>)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* mini process strip */}
      <section className="relative py-[clamp(60px,9vh,120px)] night overflow-hidden">
        <div className="ledger-grid" style={{ opacity: 0.16 }} />
        <div className="shell relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <h2 className="display-md max-w-[14ch]">How we deliver it all.</h2>
            <Link to="/process" className="btn btn--ghost !text-paper !border-white/25 hover:!border-white self-start" data-cursor="Full process">Full process →</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden">
            {PROCESS.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.05} className="bg-night p-7">
                <span className="font-mono text-sm text-accent">{p.n}</span>
                <h3 className="font-display text-2xl font-semibold mt-3 mb-2">{p.title}</h3>
                <p className="text-paper/55 text-[15px]">{p.d}</p>
                <span className="inline-block mt-4 font-mono text-[12px] text-gain">→ {p.out}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  )
}

function CTA() {
  return (
    <section className="relative py-[clamp(70px,11vh,140px)] text-center">
      <div className="shell max-w-3xl mx-auto">
        <h2 className="display-md mb-7">Not sure which you need?</h2>
        <p className="text-lg text-ink-soft mb-9">Tell us the goal. We’ll map the shortest path to it — and tell you honestly what’s worth investing in first.</p>
        <Magnetic to="/contact" className="btn btn--accent" cursor="Book a call"><span className="btn__dot" /> Book a free strategy call</Magnetic>
      </div>
    </section>
  )
}
