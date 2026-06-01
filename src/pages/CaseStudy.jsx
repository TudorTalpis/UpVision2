import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Reveal, MaskTitle, Magnetic } from '../components/Primitives.jsx'
import { PROJECTS, STAGES } from '../lib/data'
import { setMeta, setJsonLd } from '../lib/seo'

export default function CaseStudy() {
  const { slug } = useParams()
  const idx = PROJECTS.findIndex((p) => p.slug === slug)
  const p = PROJECTS[idx]
  const next = PROJECTS[(idx + 1) % PROJECTS.length]

  useEffect(() => {
    if (!p) return
    setMeta({
      title: `${p.name} — ${p.result} | UpVision case study`,
      description: `${p.summary} ${p.result}.`,
      path: `/work/${p.slug}`,
      type: 'article',
    })
    setJsonLd('ld-case', {
      '@context': 'https://schema.org', '@type': 'Article',
      headline: `${p.name}: ${p.result}`, about: p.cat,
      publisher: { '@type': 'Organization', name: 'UpVision' },
    })
  }, [slug])

  if (!p) return (
    <div className="shell pt-48 pb-32"><h1 className="display-md">Case not found.</h1><Link to="/work" className="btn btn--accent mt-8">Back to work</Link></div>
  )

  const metrics = [p.metricA, p.metricB, p.metricC]
  return (
    <>
      {/* hero */}
      <section className="relative pt-40 pb-[clamp(40px,6vh,80px)] overflow-hidden">
        <div className="ledger-grid" />
        <div className="shell relative z-10">
          <Link to="/work" className="font-mono text-[13px] text-ink-faint hover:text-accent transition-colors" data-cursor="Back">← All work</Link>
          <div className="flex flex-wrap items-center gap-3 mt-8 mb-6">
            <span className="font-mono text-[13px] text-ink-faint">{p.cat}</span>
            <span className="w-1 h-1 rounded-full bg-ink-faint" />
            <span className="font-mono text-[13px] text-ink-faint">{p.year}</span>
          </div>
          <MaskTitle className="display-lg max-w-[16ch]" lines={[p.name, p.result]} />
          <Reveal delay={0.4}><p className="mt-8 text-[clamp(17px,1.6vw,21px)] text-ink-soft max-w-[54ch]">{p.summary}</p></Reveal>
        </div>
      </section>

      {/* big mockup band */}
      <section className="relative pb-[clamp(50px,8vh,100px)]">
        <div className="shell">
          <Reveal>
            <div className="relative aspect-[16/9] rounded-[clamp(14px,2vw,28px)] overflow-hidden" style={{ background: `linear-gradient(150deg, ${p.accent}, ${p.accent}aa)` }}>
              <div className="absolute inset-0 opacity-25 mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
              {/* floating device */}
              <motion.div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[62%] aspect-[16/10] bg-panel rounded-t-xl border border-black/10 shadow-2xl overflow-hidden"
                initial={{ y: 60, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
                <div className="h-7 bg-paper-2 flex items-center gap-1.5 px-3"><i className="w-2 h-2 rounded-full bg-line-strong" /><i className="w-2 h-2 rounded-full bg-line-strong" /><i className="w-2 h-2 rounded-full bg-line-strong" /></div>
                <div className="p-5"><div className="font-display text-2xl font-semibold" style={{ color: p.accent }}>{p.name}</div><div className="h-2 w-2/3 bg-line rounded mt-3" /><div className="h-2 w-1/2 bg-line rounded mt-2" /><div className="flex gap-2 mt-4">{[0,1,2].map(i=><div key={i} className="flex-1 h-12 rounded-lg bg-paper-2" />)}</div></div>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* metrics */}
      <section className="relative py-[clamp(50px,8vh,100px)] bg-paper-2/40 border-y border-line">
        <div className="shell grid grid-cols-1 sm:grid-cols-3 gap-10">
          {metrics.map(([v, l], i) => (
            <Reveal key={i} delay={i * 0.1} className="text-center sm:text-left">
              <div className="font-display font-semibold text-gain leading-none" style={{ fontSize: 'clamp(44px,7vw,80px)', letterSpacing: '-0.03em' }}>{v}</div>
              <div className="text-ink-soft mt-3">{l}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* narrative */}
      <section className="relative py-[clamp(70px,11vh,150px)]">
        <div className="shell grid lg:grid-cols-[0.4fr_0.6fr] gap-[clamp(32px,5vw,90px)]">
          <div className="lg:sticky lg:top-32 self-start">
            <span className="eyebrow mb-6">The engagement</span>
            <h2 className="display-md mt-5">From {p.tags[0].toLowerCase()} to {p.tags[p.tags.length - 1].toLowerCase()}.</h2>
            <div className="flex flex-wrap gap-2 mt-7">
              {p.tags.map((t) => <span key={t} className="font-mono text-[12px] px-3 py-1.5 rounded-full border border-line-strong text-ink-soft">{t}</span>)}
            </div>
          </div>
          <div className="space-y-12">
            {[
              ['The challenge', `${p.name} had real demand but a digital presence that undersold it — confusing, slow, and disconnected from how the business actually made money.`],
              ['Our approach', 'We ran the engagement as one continuous system: research and positioning first, then brand, design and engineering — instrumented so we could prove the lift.'],
              ['The outcome', `${p.result}. More than a redesign — a measurable shift in how the business acquires and converts customers.`],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.05} className="border-t border-line pt-7">
                <span className="font-mono text-sm text-accent">0{i + 1}</span>
                <h3 className="font-display text-[clamp(24px,3vw,36px)] font-semibold mt-3 mb-3">{t}</h3>
                <p className="text-lg text-ink-soft max-w-[56ch]">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* next */}
      <section className="relative py-[clamp(50px,8vh,110px)] night overflow-hidden">
        <div className="ledger-grid" style={{ opacity: 0.16 }} />
        <Link to={`/work/${next.slug}`} className="shell relative z-10 flex items-center justify-between group" data-cursor="Next case">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-paper/50">Next case</span>
            <h2 className="display-md mt-3 group-hover:text-accent transition-colors">{next.name}</h2>
            <span className="text-gain font-semibold">{next.result}</span>
          </div>
          <span className="text-4xl group-hover:translate-x-2 transition-transform">→</span>
        </Link>
      </section>
    </>
  )
}
