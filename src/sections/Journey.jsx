import { useRef, useLayoutEffect } from 'react'
import { gsap, ScrollTrigger, registerGsap, prefersReduced } from '../lib/gsap'
import { Reveal } from '../components/Primitives.jsx'
import { useT } from '../lib/i18n'
import { useContent } from '../lib/i18n/content.js'

export default function Journey() {
  const root = useRef(null)
  const t = useT()
  const PHASES = useContent().journey

  useLayoutEffect(() => {
    registerGsap()
    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray('[data-phase]')
      const captions = gsap.utils.toArray('[data-caption]')
      const counters = gsap.utils.toArray('[data-counter]')
      const meter = root.current.querySelector('[data-meter]')
      const last = PHASES.length - 1

      // Map a 0..1 scroll progress to a "playhead" across the phases and
      // cross-fade only the active phase (plus its neighbour mid-transition).
      // Works at every width; scrubbed so scrolling up un-builds the site.
      const apply = (progress) => {
        const head = progress * last // 0..last
        steps.forEach((s, i) => {
          const d = Math.abs(i - head)
          gsap.set(s, { autoAlpha: d < 1 ? 1 - d : 0, y: (i - head) * 16 })
        })
        captions.forEach((c, i) => {
          gsap.set(c, { opacity: Math.abs(i - head) < 0.85 ? 1 : 0.32 })
        })
        if (meter) gsap.set(meter, { scaleX: progress })
        counters.forEach((c) => {
          const to = +c.dataset.counter
          c.textContent = Math.round(to * progress).toLocaleString()
        })
      }

      // Reduced motion: show the finished, live website and full value — no scrub.
      if (prefersReduced()) { apply(1); return }

      apply(0)
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => apply(self.progress),
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="journey" className="relative py-[clamp(80px,12vh,160px)]">
      <div className="ledger-grid" />
      <div className="shell relative z-10">
        <div className="max-w-[760px] mb-[clamp(40px,7vh,80px)]">
          <span className="eyebrow">{t('journey.eyebrow')}</span>
          <h2 className="display-lg mt-6 mb-5">
            {t('journey.title')} <span className="serif-italic text-accent">{t('journey.titleAccent')}</span>
          </h2>
          <p className="text-lg text-ink-soft max-w-[54ch]">{t('journey.sub')}</p>
        </div>

        {/* Desktop: pinned frame + scrubbed crossfade */}
        <div className="hidden lg:grid lg:grid-cols-[1.1fr_0.9fr] gap-[clamp(24px,4vw,64px)]">
          <div>
          <div className="lg:sticky lg:top-[16vh] rounded-2xl border border-line bg-panel shadow-[0_40px_90px_-50px_rgba(24,22,15,0.5)] overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-line bg-paper-2/60">
              <span className="flex gap-1.5">
                <i className="w-2.5 h-2.5 rounded-full bg-line-strong" />
                <i className="w-2.5 h-2.5 rounded-full bg-line-strong" />
                <i className="w-2.5 h-2.5 rounded-full bg-line-strong" />
              </span>
              <span className="font-mono text-xs text-ink-faint ml-1">upvision — building…</span>
            </div>
            <div className="relative h-[clamp(260px,42vh,380px)] bg-panel">
              {PHASES.map(([label], i) => (
                <div key={label} data-phase className="absolute inset-0 p-6 grid place-items-center text-center" style={{ opacity: 0 }}>
                  <PhaseVisual index={i} />
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-line bg-paper-2/50">
              <div className="flex items-center justify-between mb-2.5">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">{t('journey.value')}</span>
                <span className="font-mono text-xs text-gain"><b data-counter="127">0</b>k MRR</span>
              </div>
              <div className="h-1.5 rounded-full bg-line overflow-hidden">
                <div data-meter className="h-full rounded-full bg-gain origin-left" style={{ transform: 'scaleX(0)' }} />
              </div>
            </div>
          </div>
          </div>

          <div className="flex flex-col">
            {PHASES.map(([label, line], i) => (
              <div key={label} data-caption className="border-t border-line pt-5 pb-5 lg:min-h-[clamp(140px,22vh,240px)] flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="font-mono text-sm text-accent">0{i + 1}</span>
                  <h3 className="font-display text-xl font-semibold">{label}</h3>
                </div>
                <p className="text-ink-soft text-[15px] max-w-[40ch]">{line}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile / small screens: clean vertical sequence, each step reveals on scroll */}
        <div className="lg:hidden flex flex-col gap-5">
          {PHASES.map(([label, line], i) => (
            <Reveal key={label} y={20} className="rounded-2xl border border-line bg-panel overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-2.5 border-b border-line bg-paper-2/60">
                <span className="font-mono text-sm text-accent">0{i + 1}</span>
                <span className="font-display text-base font-semibold">{label}</span>
              </div>
              <div className="relative h-[clamp(180px,40vw,240px)] grid place-items-center p-5 text-center">
                <PhaseVisual index={i} />
              </div>
              <p className="text-ink-soft text-[14px] px-4 pb-4">{line}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function PhaseVisual({ index }) {
  switch (index) {
    case 0:
      return (
        <svg viewBox="0 0 220 130" className="w-[80%]">
          {[[10,10,200,18],[10,38,120,12],[10,58,200,40],[10,104,90,16]].map(([x,y,w,h],i)=>(
            <rect key={i} x={x} y={y} width={w} height={h} rx="3" fill="none" stroke="var(--color-line-strong)" strokeWidth="1.5" strokeDasharray="4 4" />
          ))}
        </svg>
      )
    case 1:
      return (
        <div className="w-[80%] rounded-xl overflow-hidden border border-line bg-[#15101f] text-left">
          <div className="flex items-center justify-between px-4 py-3"><span className="font-display text-white text-sm font-semibold">acme</span><span className="w-12 h-5 rounded-full bg-accent" /></div>
          <div className="px-4 pb-3"><div className="font-display text-white text-lg leading-tight">Grow your business online.</div><span className="inline-block mt-2 px-3 py-1.5 rounded-full bg-accent text-white text-xs font-semibold">Get started</span></div>
        </div>
      )
    case 2:
    case 3:
      return (
        <div className="w-[88%] bg-night rounded-lg p-4 font-mono text-[12px] leading-relaxed text-left">
          <div className="text-paper/40 mb-1">Hero.jsx</div>
          <div><span className="text-[#ff7b9c]">export function</span> <span className="text-[#7fd1c4]">Hero</span>() {'{'}</div>
          <div className="pl-6 text-[#9bd17f]">Grow your business online{index === 3 && <span className="inline-block w-1.5 h-3.5 bg-gain align-middle ml-0.5" style={{ animation: 'blink 1s steps(1) infinite' }} />}</div>
          <div>{'}'}</div>
        </div>
      )
    case 4:
      return (
        <div className="w-[88%] bg-night rounded-lg p-4 font-mono text-[12px] leading-relaxed text-left flex flex-col gap-1">
          <div className="text-paper">$ upvision build --prod</div>
          <div className="text-gain">✓ checks  a11y · seo · perf</div>
          <div className="text-accent">✓ built in 12.4s</div>
        </div>
      )
    case 5:
      return <div className="font-display text-2xl font-semibold">acme.com <span className="text-gain">is live</span></div>
    case 6:
      return (
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-xs text-ink-faint uppercase tracking-widest">Visitors today</span>
          <div className="font-display text-4xl font-semibold"><b data-counter="2480">0</b></div>
        </div>
      )
    case 7:
      return (
        <svg viewBox="0 0 320 120" preserveAspectRatio="none" className="w-[88%] h-[120px]">
          <path d="M0 110 C 80 100, 140 70, 200 50 S 300 12, 320 6" fill="none" stroke="var(--color-gain)" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )
    default:
      return null
  }
}
