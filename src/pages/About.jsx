import { useEffect } from 'react'
import PageHero from '../components/PageHero.jsx'
import { Reveal, Stat, Magnetic } from '../components/Primitives.jsx'
import { STATS } from '../lib/data'
import { setMeta } from '../lib/seo'
import { useLocale } from '../lib/i18n'

const VALUES = [
  ['Outcomes over output', "We're hired to move a number, not to deliver a folder of files. Every decision ladders up to a business result."],
  ['One team, no handoffs', 'Strategy, design and engineering sit together. Nothing gets lost in translation between agencies.'],
  ['Senior, hands-on', 'The people you meet are the people who do the work. No juniors hiding behind account managers.'],
  ['Build to last', "Clean systems and code your team can own and maintain — never a black box you can't escape."],
]

const MARQUEE = ['Strategy', 'Branding', 'UI/UX', 'React', 'Automation', 'SEO', 'Growth', 'Motion', 'E-commerce', 'Product']

export default function About() {
  const { locale } = useLocale()
  useEffect(() => setMeta({
    title: 'About UpVision — Web Development Studio in Moldova',
    description: 'UpVision is a founder-led web development studio in Chișinău, Moldova — building custom websites, web apps and online stores for businesses that want to grow.',
    path: '/about', locale,
  }), [locale])

  return (
    <>
      <PageHero
        eyebrow="The studio"
        titleLines={['Strategists,', 'designers,', 'engineers.']}
        intro="UpVision is a small, senior, founder-led studio. We got tired of watching great ideas die in handoffs between agencies — so we built one team that carries a vision from napkin to revenue."
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
            <span className="eyebrow mb-6">Why we exist</span>
            <h2 className="display-md mt-5 mb-6">We believe a website should pay for itself — many times over.</h2>
            <div className="space-y-4 text-lg text-ink-soft max-w-[52ch]">
              <p>Too many businesses are sold a "website" as a one-off cost: pretty, static, and disconnected from how the company actually makes money.</p>
              <p>We do the opposite. We treat your digital presence as a growth system — designed, built and tuned around the actions that generate revenue, and instrumented so you can see the return.</p>
              <p>The result is work that looks world-class and behaves like your best employee.</p>
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
          <h2 className="display-md mb-12 max-w-[16ch]">What we hold ourselves to.</h2>
          <div className="grid sm:grid-cols-2 gap-px bg-white/10 rounded-2xl overflow-hidden">
            {VALUES.map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.05} className="bg-night p-8">
                <span className="font-mono text-sm text-accent">0{i + 1}</span>
                <h3 className="font-display text-2xl font-semibold mt-3 mb-3">{t}</h3>
                <p className="text-paper/60">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-[clamp(70px,11vh,140px)] text-center">
        <div className="shell max-w-2xl mx-auto">
          <h2 className="display-md mb-7">Ready to build your website?</h2>
          <Magnetic to="/contact" className="btn btn--accent" cursor="Book a call"><span className="btn__dot" /> Start your project</Magnetic>
        </div>
      </section>
    </>
  )
}
