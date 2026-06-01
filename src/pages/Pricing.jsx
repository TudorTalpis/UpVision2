import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import PageHero from '../components/PageHero.jsx'
import { Reveal, Magnetic } from '../components/Primitives.jsx'
import { PRICING, FAQ } from '../lib/data'
import { setMeta } from '../lib/seo'
import { useLocale } from '../lib/i18n'

const PIPE = [
  ['Investment', 'You commit capital to a system, not an expense.'],
  ['Digital presence', 'A fast, credible, findable home for the business.'],
  ['Leads', 'Qualified traffic converts into real enquiries.'],
  ['Customers', 'A trustworthy experience closes the sale.'],
  ['Revenue', 'A compounding asset that pays back, then keeps paying.'],
]

export default function Pricing() {
  const { locale } = useLocale()
  useEffect(() => setMeta({
    title: 'Website Development Pricing in Moldova — UpVision',
    description: 'Transparent pricing for landing pages, business websites and custom web apps in Moldova. Investment ranges and what you get.',
    path: '/pricing', locale,
  }), [locale])

  return (
    <>
      <PageHero
        eyebrow="Investment, not expense"
        titleLines={['Priced around the', 'website you need.']}
        intro="Every number below is an input to a system designed to give you more back. Here's how the investment turns into revenue — and what each stage costs."
      />

      {/* value pipeline */}
      <section className="relative pb-[clamp(50px,8vh,100px)]">
        <div className="shell">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {PIPE.map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.08}>
                <div className="relative h-full rounded-xl border border-line p-5 bg-panel">
                  <span className="font-mono text-[12px] text-accent">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className={`font-display text-xl font-semibold mt-2 mb-2 ${i === 4 ? 'text-gain' : ''}`}>{t}</h3>
                  <p className="text-[14px] text-ink-soft">{d}</p>
                  {i < PIPE.length - 1 && <span className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 text-accent text-lg z-10">→</span>}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ROICalculator />

      {/* tiers */}
      <section className="relative py-[clamp(60px,9vh,120px)]">
        <div className="shell">
          <div className="grid lg:grid-cols-3 gap-5">
            {PRICING.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <div className={`relative h-full rounded-2xl p-8 border flex flex-col ${t.featured ? 'night border-transparent' : 'bg-panel border-line'}`}>
                  {t.featured && <span className="absolute top-6 right-6 font-mono text-[11px] uppercase tracking-widest px-3 py-1 rounded-full bg-accent text-white">Most chosen</span>}
                  <h3 className="font-display text-3xl font-semibold">{t.name}</h3>
                  <p className={`text-[15px] mt-2 ${t.featured ? 'text-paper/60' : 'text-ink-soft'}`}>{t.tag}</p>
                  <div className="mt-7 mb-1 flex items-baseline gap-1">
                    <span className="font-mono text-sm opacity-60">from</span>
                    <span className="font-display text-5xl font-semibold">{t.invest === 'Custom' ? 'Custom' : `$${t.invest}`}</span>
                  </div>
                  <span className={`font-mono text-[12px] ${t.featured ? 'text-paper/50' : 'text-ink-faint'}`}>{t.range} · {t.horizon}</span>
                  <div className={`my-6 h-px ${t.featured ? 'bg-white/15' : 'bg-line'}`} />
                  <ul className="space-y-3 flex-1">
                    {t.points.map((p) => (
                      <li key={p} className="flex items-start gap-3 text-[15px]"><span className="text-gain mt-0.5">✓</span><span className={t.featured ? 'text-paper/85' : 'text-ink'}>{p}</span></li>
                    ))}
                  </ul>
                  <div className={`mt-6 mb-7 text-[14px] rounded-lg p-4 ${t.featured ? 'bg-white/5 text-paper/80' : 'bg-gain-soft/60 text-ink'}`}>
                    <span className="font-mono text-[11px] uppercase tracking-widest text-gain block mb-1">The return</span>{t.returns}
                  </div>
                  <Magnetic to="/contact" className={`btn ${t.featured ? 'btn--accent' : '!bg-ink !text-paper'} w-full justify-center`} cursor="Start" strength={0.2}>
                    <span className="btn__dot" /> {t.invest === 'Custom' ? 'Talk to us' : `Start with ${t.name}`}
                  </Magnetic>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="text-center font-mono text-[12px] text-ink-faint mt-8">Ranges are starting points. Final investment is scoped to your goals after a free strategy call.</p>
          <p className="font-mono text-[11px] text-ink-faint mt-6">Ranges are indicative and confirmed after a short scoping call.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-[clamp(60px,9vh,120px)] bg-paper-2/40 border-y border-line">
        <div className="shell grid lg:grid-cols-[0.35fr_0.65fr] gap-12">
          <h2 className="display-md">Questions, answered.</h2>
          <div className="border-t border-line">
            {FAQ.map(([q, a], i) => <FaqItem key={i} q={q} a={a} />)}
          </div>
        </div>
      </section>
    </>
  )
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-line">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-6 py-6 text-left" data-cursor={open ? 'Close' : 'Open'}>
        <span className="font-display text-xl font-semibold">{q}</span>
        <span className={`text-2xl text-ink-faint transition-transform duration-500 shrink-0 ${open ? 'rotate-45 text-accent' : ''}`}>+</span>
      </button>
      <motion.div initial={false} animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
        <p className="text-ink-soft text-[16px] pb-6 max-w-[60ch]">{a}</p>
      </motion.div>
    </div>
  )
}

/* interactive ROI calculator */
function ROICalculator() {
  const [visitors, setVisitors] = useState(8000)
  const [deal, setDeal] = useState(450)
  const convNew = 0.035   // optimised site
  const convOld = 0.012   // typical baseline
  const leads = Math.round(visitors * convNew)
  const customers = Math.round(leads * 0.25)
  const revenue = customers * deal
  const baseline = Math.round(visitors * convOld * 0.25) * deal
  const lift = revenue - baseline

  return (
    <section className="relative py-[clamp(50px,8vh,100px)]">
      <div className="ledger-grid" />
      <div className="shell relative z-10">
        <Reveal>
          <div className="rounded-2xl border border-line bg-panel overflow-hidden grid lg:grid-cols-2">
            {/* controls */}
            <div className="p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-line">
              <span className="eyebrow mb-6">See the return</span>
              <h2 className="display-md mt-5 mb-8 text-[clamp(26px,3.4vw,40px)]">A back-of-napkin ROI.</h2>

              <Slider label="Monthly visitors" value={visitors} min={1000} max={50000} step={1000} onChange={setVisitors} format={(v) => v.toLocaleString()} />
              <Slider label="Avg. customer value" value={deal} min={50} max={5000} step={50} onChange={setDeal} format={(v) => `$${v.toLocaleString()}`} />

              <p className="font-mono text-[12px] text-ink-faint mt-6">Assumes a conversion lift from ~1.2% to ~3.5% and a 25% lead-to-customer close rate. Illustrative, not a guarantee.</p>
            </div>

            {/* output */}
            <div className="p-8 md:p-10 bg-paper-2/40">
              <div className="grid grid-cols-2 gap-6">
                <Out label="Qualified leads / mo" value={leads.toLocaleString()} />
                <Out label="New customers / mo" value={customers.toLocaleString()} />
              </div>
              <div className="mt-8 pt-7 border-t border-line">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">Estimated monthly revenue</span>
                <div className="font-display font-semibold text-gain leading-none mt-2" style={{ fontSize: 'clamp(40px,6vw,68px)', letterSpacing: '-0.03em' }}>
                  ${revenue.toLocaleString()}
                </div>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gain-soft text-gain font-mono text-[13px]">
                  ▲ ${lift.toLocaleString()} / mo vs. an average site
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Slider({ label, value, min, max, step, onChange, format }) {
  return (
    <label className="block mb-7">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[15px] text-ink-soft">{label}</span>
        <span className="font-mono text-lg font-medium">{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)}
        className="w-full accent-[var(--color-accent)] h-1.5 cursor-pointer" />
    </label>
  )
}

function Out({ label, value }) {
  return (
    <div>
      <div className="font-display text-4xl font-semibold leading-none">{value}</div>
      <div className="text-[13px] text-ink-faint mt-2">{label}</div>
    </div>
  )
}
