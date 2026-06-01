import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import PageHero from '../components/PageHero.jsx'
import { Reveal, Magnetic } from '../components/Primitives.jsx'
import { setMeta } from '../lib/seo'
import { useLocale, useT } from '../lib/i18n'
import { useContent } from '../lib/i18n/content.js'
import { useTilt, useCountUp } from '../lib/hooks'

export default function Pricing() {
  const { locale } = useLocale()
  const t = useT()
  const { PRICING, FAQ, pipe: PIPE } = useContent()
  useEffect(() => setMeta({
    title: 'Website Development Pricing in Moldova — UpVision',
    description: 'Transparent pricing for landing pages, business websites and custom web apps in Moldova. Investment ranges and what you get.',
    path: '/pricing', locale,
  }), [locale])

  return (
    <>
      <PageHero
        eyebrow={t('price.eyebrow')}
        titleLines={t('price.title').split('|')}
        intro={t('price.intro')}
      />

      {/* value pipeline */}
      <section className="relative pb-[clamp(50px,8vh,100px)]">
        <div className="shell">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {PIPE.map(([title, desc], i) => (
              <Reveal key={title} delay={i * 0.08}>
                <div className="group relative h-full rounded-xl border border-line p-5 bg-panel transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_20px_50px_-35px_rgba(24,22,15,0.6)]">
                  <span className="font-mono text-[12px] text-accent">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className={`font-display text-xl font-semibold mt-2 mb-2 ${i === 4 ? 'text-gain' : ''}`}>{title}</h3>
                  <p className="text-[14px] text-ink-soft">{desc}</p>
                  {i < PIPE.length - 1 && <span className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 text-accent text-lg z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>}
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
            {PRICING.map((tier, i) => (
              <Reveal key={tier.name} delay={i * 0.08} className="h-full">
                <TierCard tier={tier} t={t} />
              </Reveal>
            ))}
          </div>
          <p className="text-center font-mono text-[12px] text-ink-faint mt-8">{t('price.note')}</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-[clamp(60px,9vh,120px)] bg-paper-2/40 border-y border-line">
        <div className="shell grid lg:grid-cols-[0.35fr_0.65fr] gap-12">
          <h2 className="display-md">{t('price.faqHead')}</h2>
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
  const t = useT()
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
              <span className="eyebrow mb-6">{t('price.roiEyebrow')}</span>
              <h2 className="display-md mt-5 mb-8 text-[clamp(26px,3.4vw,40px)]">{t('price.roiT')}</h2>

              <Slider label={t('price.roiVisitors')} value={visitors} min={1000} max={50000} step={1000} onChange={setVisitors} format={(v) => v.toLocaleString()} />
              <Slider label={t('price.roiDeal')} value={deal} min={50} max={5000} step={50} onChange={setDeal} format={(v) => `$${v.toLocaleString()}`} />

              <p className="font-mono text-[12px] text-ink-faint mt-6">{t('price.roiAssume')}</p>
            </div>

            {/* output */}
            <div className="p-8 md:p-10 bg-paper-2/40">
              <div className="grid grid-cols-2 gap-6">
                <Out label={t('price.roiLeads')} value={leads.toLocaleString()} />
                <Out label={t('price.roiCustomers')} value={customers.toLocaleString()} />
              </div>
              <div className="mt-8 pt-7 border-t border-line">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">{t('price.roiRevenue')}</span>
                <div className="font-display font-semibold text-gain leading-none mt-2" style={{ fontSize: 'clamp(40px,6vw,68px)', letterSpacing: '-0.03em' }}>
                  ${revenue.toLocaleString()}
                </div>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gain-soft text-gain font-mono text-[13px]">
                  ▲ ${lift.toLocaleString()} {t('price.roiVs')}
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

/* Pricing tier — tilts toward the pointer (desktop) + animated price. */
function TierCard({ tier, t }) {
  const ref = useTilt(5)
  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden h-full rounded-2xl p-8 border flex flex-col transition-[box-shadow,border-color] duration-300 ${
        tier.featured
          ? 'night border-transparent shadow-[0_30px_80px_-40px_rgba(242,75,30,0.5)]'
          : 'bg-panel border-line hover:border-ink/25 hover:shadow-[0_30px_70px_-45px_rgba(24,22,15,0.5)]'
      }`}
    >
      {tier.featured && <span className="absolute top-6 right-6 font-mono text-[11px] uppercase tracking-widest px-3 py-1 rounded-full bg-accent text-white">{t('price.most')}</span>}
      <h3 className="font-display text-3xl font-semibold">{tier.name}</h3>
      <p className={`text-[15px] mt-2 ${tier.featured ? 'text-paper/60' : 'text-ink-soft'}`}>{tier.tag}</p>
      <div className="mt-7 mb-1 flex items-baseline gap-1">
        <span className="font-mono text-sm opacity-60">{t('price.from')}</span>
        <PriceCount invest={tier.invest} />
      </div>
      <span className={`font-mono text-[12px] ${tier.featured ? 'text-paper/50' : 'text-ink-faint'}`}>{tier.range} · {tier.horizon}</span>
      <div className={`my-6 h-px ${tier.featured ? 'bg-white/15' : 'bg-line'}`} />
      <ul className="space-y-3 flex-1">
        {tier.points.map((p) => (
          <li key={p} className="flex items-start gap-3 text-[15px]">
            <span className="text-gain mt-0.5 transition-transform duration-300 group-hover:scale-125">✓</span>
            <span className={tier.featured ? 'text-paper/85' : 'text-ink'}>{p}</span>
          </li>
        ))}
      </ul>
      <div className={`mt-6 mb-7 text-[14px] rounded-lg p-4 ${tier.featured ? 'bg-white/5 text-paper/80' : 'bg-gain-soft/60 text-ink'}`}>
        <span className="font-mono text-[11px] uppercase tracking-widest text-gain block mb-1">{t('price.return')}</span>{tier.returns}
      </div>
      <Magnetic to="/contact" className={`btn ${tier.featured ? 'btn--accent' : '!bg-ink !text-paper'} w-full justify-center`} cursor="Start" strength={0.2}>
        <span className="btn__dot" /> {tier.invest === 'Custom' ? t('price.talk') : `${t('price.start')} ${tier.name}`}
      </Magnetic>
      <span className="tilt-glare" aria-hidden="true" />
    </div>
  )
}

/* Counts the price up from 0 when scrolled into view. */
function PriceCount({ invest }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, amount: 0.6 })
  const isCustom = invest === 'Custom'
  const num = parseFloat(invest) || 0
  const dec = String(invest).includes('.') ? 1 : 0
  const val = useCountUp(num, { start: inView && !isCustom, dec })
  return (
    <span ref={ref} className="font-display text-5xl font-semibold tabular-nums">
      {isCustom ? 'Custom' : `$${val}k`}
    </span>
  )
}
