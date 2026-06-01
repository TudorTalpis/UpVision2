import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Magnetic } from '../components/Primitives.jsx'
import { setMeta, setJsonLd } from '../lib/seo'

const BUDGETS = ['< $7k', '$7–18k', '$18–40k', '$40k+']
const NEEDS = ['Website', 'Branding', 'UI/UX', 'Automation', 'Digitalization', 'Marketing', 'Strategy']

export default function Contact() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState({ name: '', email: '', company: '', budget: '', needs: [], note: '' })
  const [sent, setSent] = useState(false)

  useEffect(() => {
    setMeta({
      title: 'Contact — Book a free strategy call | UpVision',
      description: 'Tell us the goal and we’ll map the shortest path to it. Book a free 30-minute strategy call with a senior partner at UpVision.',
      path: '/contact',
    })
    setJsonLd('ld-org', {
      '@context': 'https://schema.org', '@type': 'Organization', name: 'UpVision',
      url: 'https://upvision.studio', email: 'hello@upvision.studio',
      sameAs: ['https://www.linkedin.com/', 'https://www.instagram.com/'],
    })
  }, [])

  const toggle = (n) => setData((d) => ({ ...d, needs: d.needs.includes(n) ? d.needs.filter((x) => x !== n) : [...d.needs, n] }))
  const canNext =
    (step === 0 && data.name && /.+@.+\..+/.test(data.email)) ||
    (step === 1 && data.budget && data.needs.length) || step === 2

  return (
    <section className="relative pt-40 pb-[clamp(70px,11vh,140px)] min-h-[100svh]">
      <div className="ledger-grid" />
      <div className="shell relative z-10 grid lg:grid-cols-2 gap-[clamp(40px,6vw,90px)] items-start">
        {/* left */}
        <div className="lg:sticky lg:top-32">
          <span className="eyebrow mb-7">Let’s begin</span>
          <h1 className="display-lg mt-5 mb-7 max-w-[12ch]">Tell us the goal.</h1>
          <p className="text-lg text-ink-soft max-w-[44ch] mb-9">
            Book a free 30-minute strategy call. You’ll leave with a clear view of
            what it takes to get there — whether or not we build it together.
          </p>
          <ul className="space-y-3 mb-9">
            {['Reply within one business day', 'A senior partner on the first call', 'No obligation, no hard sell'].map((t) => (
              <li key={t} className="flex items-center gap-3 text-ink-soft"><span className="text-accent">✦</span>{t}</li>
            ))}
          </ul>
          <a href="mailto:hello@upvision.studio" className="font-mono text-[15px] border-b border-accent pb-1" data-cursor="Email us">hello@upvision.studio</a>
        </div>

        {/* form card */}
        <div className="rounded-2xl border border-line bg-panel p-7 md:p-9 shadow-[0_40px_90px_-50px_rgba(24,22,15,0.4)]">
          {!sent && (
            <div className="flex gap-2 mb-8">
              {['You', 'Project', 'Details'].map((s, i) => (
                <span key={s} className={`flex-1 text-center font-mono text-[11px] uppercase tracking-[0.12em] pb-2.5 border-b-2 transition-colors ${i <= step ? 'text-accent border-accent' : 'text-ink-faint border-line'}`}>{s}</span>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="done" className="text-center py-10" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="w-16 h-16 mx-auto rounded-full bg-accent text-white grid place-items-center text-2xl mb-6">✓</div>
                <h3 className="font-display text-3xl font-semibold mb-3">Got it, {data.name.split(' ')[0] || 'there'}.</h3>
                <p className="text-ink-soft">We’re already thinking about it. Expect a note at <strong>{data.email}</strong> within a business day.</p>
              </motion.div>
            ) : (
              <motion.form key={step} onSubmit={(e) => { e.preventDefault(); setSent(true) }}
                initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
                {step === 0 && (
                  <div className="space-y-5">
                    <Field label="Your name"><input autoFocus value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} placeholder="Jordan Rivera" /></Field>
                    <Field label="Email"><input type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} placeholder="jordan@company.com" /></Field>
                    <Field label="Company (optional)"><input value={data.company} onChange={(e) => setData({ ...data, company: e.target.value })} placeholder="Company Inc." /></Field>
                  </div>
                )}
                {step === 1 && (
                  <div className="space-y-7">
                    <div>
                      <span className="text-[15px] text-ink-soft block mb-3">Rough budget</span>
                      <div className="flex flex-wrap gap-2.5">{BUDGETS.map((b) => <Chip key={b} on={data.budget === b} onClick={() => setData({ ...data, budget: b })}>{b}</Chip>)}</div>
                    </div>
                    <div>
                      <span className="text-[15px] text-ink-soft block mb-3">What do you need? (pick any)</span>
                      <div className="flex flex-wrap gap-2.5">{NEEDS.map((n) => <Chip key={n} on={data.needs.includes(n)} onClick={() => toggle(n)}>{n}</Chip>)}</div>
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <Field label="Tell us about the goal"><textarea rows={6} value={data.note} onChange={(e) => setData({ ...data, note: e.target.value })} placeholder="We want to…" /></Field>
                )}

                <div className="flex gap-3 mt-8">
                  {step > 0 && <button type="button" className="btn btn--ghost" onClick={() => setStep((s) => s - 1)}>Back</button>}
                  {step < 2
                    ? <button type="button" className="btn btn--accent disabled:opacity-40 disabled:pointer-events-none" disabled={!canNext} onClick={() => canNext && setStep((s) => s + 1)} data-cursor="Next"><span className="btn__dot" /> Continue</button>
                    : <button type="submit" className="btn btn--accent" data-cursor="Send"><span className="btn__dot" /> Send the brief</button>}
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-[15px] text-ink-soft block mb-2.5">{label}</span>
      <div className="[&_input]:w-full [&_textarea]:w-full [&_input]:bg-paper [&_textarea]:bg-paper [&_input]:border [&_textarea]:border [&_input]:border-line-strong [&_textarea]:border-line-strong [&_input]:rounded-xl [&_textarea]:rounded-xl [&_input]:px-4 [&_input]:py-3.5 [&_textarea]:px-4 [&_textarea]:py-3.5 [&_input]:text-[16px] [&_textarea]:text-[16px] [&_input]:outline-none [&_textarea]:outline-none focus-within:[&_input]:border-accent">
        {children}
      </div>
    </label>
  )
}

function Chip({ on, onClick, children }) {
  return (
    <button type="button" onClick={onClick}
      className={`px-4 py-2.5 rounded-full border text-[14px] transition-all ${on ? 'bg-accent border-accent text-white font-semibold' : 'border-line-strong text-ink-soft hover:border-ink'}`}>
      {children}
    </button>
  )
}
