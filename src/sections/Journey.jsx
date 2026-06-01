import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { STAGES } from '../lib/data'

/* The signature scene: a single product artifact that evolves through
   all eight stages as you scroll. A sticky frame swaps its contents
   while a persistent growth meter fills — progress you can see. */
export default function Journey() {
  const [active, setActive] = useState(0)
  return (
    <section id="journey" className="relative py-[clamp(80px,12vh,160px)]">
      <div className="ledger-grid" />
      <div className="shell relative z-10">
        <div className="max-w-[760px] mb-[clamp(48px,8vh,96px)]">
          <span className="eyebrow">How value compounds</span>
          <h2 className="display-lg mt-6 mb-5">
            Watch an idea become <span className="serif-italic text-accent">revenue.</span>
          </h2>
          <p className="text-lg text-ink-soft max-w-[54ch]">
            Most studios hand you a deliverable and disappear. We walk the entire
            road — eight stages, one team — and every step adds measurable value.
          </p>
        </div>

        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-[clamp(32px,5vw,80px)] items-start">
          {/* sticky evolving artifact */}
          <div className="lg:sticky lg:top-[16vh]">
            <Artifact active={active} />
          </div>

          {/* stage copy blocks */}
          <div className="flex flex-col">
            {STAGES.map((s, i) => (
              <StageBlock key={s.id} stage={s} index={i} onActive={setActive} active={active === i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function StageBlock({ stage, index, onActive, active }) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.6, margin: '-30% 0px -30% 0px' })
  useEffect(() => { if (inView) onActive(index) }, [inView, index, onActive])
  return (
    <div
      ref={ref}
      className="min-h-[58vh] flex flex-col justify-center transition-opacity duration-500"
      style={{ opacity: active ? 1 : 0.32 }}
    >
      <div className="flex items-center gap-4 mb-4">
        <span className="font-mono text-sm text-accent">{stage.n}</span>
        <span className="h-px flex-1 bg-line" />
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-faint">Stage {stage.n} / 08</span>
      </div>
      <h3 className="font-display text-[clamp(32px,5vw,58px)] font-semibold tracking-tight">{stage.label}</h3>
      <p className="text-lg text-ink-soft mt-3 max-w-[40ch]">{stage.line}</p>
    </div>
  )
}

/* ---------- the evolving frame ---------- */
function Artifact({ active }) {
  const stage = STAGES[active]
  const fill = ((active + 1) / STAGES.length) * 100
  return (
    <div className="rounded-2xl border border-line bg-panel shadow-[0_40px_90px_-50px_rgba(24,22,15,0.5)] overflow-hidden">
      {/* window bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-line bg-paper-2/60">
        <span className="flex gap-1.5">
          <i className="w-2.5 h-2.5 rounded-full bg-line-strong" />
          <i className="w-2.5 h-2.5 rounded-full bg-line-strong" />
          <i className="w-2.5 h-2.5 rounded-full bg-line-strong" />
        </span>
        <span className="font-mono text-xs text-ink-faint ml-1">homemade — {stage.label.toLowerCase()}</span>
      </div>

      {/* stage canvas */}
      <div className="relative h-[300px] sm:h-[340px] bg-panel">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage.id}
            className="absolute inset-0 p-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <StageVisual id={stage.id} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* persistent growth meter */}
      <div className="px-5 py-4 border-t border-line bg-paper-2/50">
        <div className="flex items-center justify-between mb-2.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">Business value</span>
          <span className="font-mono text-xs text-gain data">{Math.round(fill)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-line overflow-hidden">
          <motion.div className="h-full rounded-full bg-gain" animate={{ width: `${fill}%` }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} />
        </div>
      </div>
    </div>
  )
}

function StageVisual({ id }) {
  switch (id) {
    case 'idea':
      return (
        <div className="h-full grid place-items-center">
          <div className="relative bg-[#fdf8ea] rounded-md p-6 -rotate-2 shadow-lg w-[80%]"
            style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px,transparent 1px)', backgroundSize: '100% 26px' }}>
            <p className="font-hand text-[26px] leading-tight text-ink">an app that pairs home cooks with hungry neighbours →</p>
            <span className="absolute -top-3 -right-3 font-hand text-lg bg-accent-soft px-3 py-1 rounded rotate-3">idea</span>
          </div>
        </div>
      )
    case 'research':
      return (
        <div className="h-full flex flex-col justify-center gap-3">
          <div className="font-mono text-xs text-ink-faint uppercase tracking-widest mb-1">Validation</div>
          {[['Demand', 'searched 40k/mo'], ['Willingness to pay', '$12 avg basket'], ['Competition', 'fragmented, weak UX']].map(([k, v], i) => (
            <motion.div key={k} className="flex items-center justify-between border-b border-line pb-2"
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.12 }}>
              <span className="flex items-center gap-2 text-sm"><span className="text-gain">✓</span>{k}</span>
              <span className="font-mono text-xs text-ink-soft">{v}</span>
            </motion.div>
          ))}
          <div className="mt-2 font-display text-2xl">TAM <span className="text-gain">$2.4B</span></div>
        </div>
      )
    case 'brand':
      return (
        <div className="h-full flex flex-col justify-center gap-5">
          <div className="font-display text-4xl font-semibold tracking-tight">homemade<span className="text-accent">.</span></div>
          <div className="flex gap-2.5">
            {['#c0552f', '#1f8a5b', '#18160f', '#f0e7d6'].map((c, i) => (
              <motion.span key={c} className="w-12 h-12 rounded-lg border border-line" style={{ background: c }}
                initial={{ scale: 0, rotate: -8 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.15 + i * 0.08, type: 'spring', stiffness: 220 }} />
            ))}
          </div>
          <div className="flex gap-6 font-mono text-xs text-ink-faint">
            <span>Aa Fraunces</span><span>Aa Hanken</span>
          </div>
        </div>
      )
    case 'design':
      return (
        <div className="h-full grid place-items-center">
          <div className="w-[78%] rounded-xl overflow-hidden border border-line bg-[#15101f]">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="font-display text-white text-sm font-semibold">homemade</span>
              <span className="w-14 h-5 rounded-full bg-accent" />
            </div>
            <div className="px-4 pb-3"><div className="font-display text-white text-xl leading-tight">Tonight’s table, cooked next door.</div>
              <span className="inline-block mt-3 px-3 py-1.5 rounded-full bg-accent text-white text-xs font-semibold">Order now</span></div>
            <div className="flex gap-2 px-4 pb-4">{[0, 1, 2].map((i) => <span key={i} className="flex-1 h-14 rounded-lg" style={{ background: 'linear-gradient(160deg,#c0552f55,#1f8a5b33)' }} />)}</div>
          </div>
        </div>
      )
    case 'build':
      return (
        <div className="h-full bg-night rounded-lg p-4 font-mono text-[12.5px] leading-relaxed">
          <div className="text-paper/40 mb-1">Hero.jsx</div>
          <div><span className="text-[#ff7b9c]">export function</span> <span className="text-[#7fd1c4]">Hero</span>() {'{'}</div>
          <div className="pl-3 text-paper/70">return (</div>
          <div className="pl-6"><span className="text-[#7fd1c4]">&lt;section</span> <span className="text-[#e7c46b]">className</span>=<span className="text-[#9bd17f]">"hero"</span><span className="text-[#7fd1c4]">&gt;</span></div>
          <div className="pl-9 text-[#9bd17f]">Tonight’s table…<span className="inline-block w-1.5 h-3.5 bg-gain align-middle ml-0.5" style={{ animation: 'blink 1s steps(1) infinite' }} /></div>
          <div className="pl-6 text-[#7fd1c4]">&lt;/section&gt;</div>
          <div className="pl-3 text-paper/70">)</div>
          <div>{'}'}</div>
        </div>
      )
    case 'launch':
      return (
        <div className="h-full bg-night rounded-lg p-4 font-mono text-[12.5px] leading-relaxed flex flex-col justify-center gap-1.5">
          <div className="text-paper">$ upvision deploy --prod</div>
          <div className="text-paper/50">› building production bundle…</div>
          <div className="text-gain">✓ checks  a11y · seo · perf</div>
          <div className="text-paper/50">› uploading to edge…</div>
          <div className="text-accent font-medium mt-1">✓ Live in 14.2s</div>
          <span className="inline-flex items-center gap-2 mt-3 self-start px-3 py-1.5 rounded-full bg-accent text-white text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-white" style={{ animation: 'blink 1.4s infinite' }} /> homemade.app is live
          </span>
        </div>
      )
    case 'growth':
      return (
        <div className="h-full flex flex-col justify-center">
          <div className="flex items-center justify-between mb-3 text-sm text-ink-soft"><span>Qualified leads / week</span><span className="text-gain font-mono">▲ 42%</span></div>
          <svg viewBox="0 0 320 130" preserveAspectRatio="none" className="w-full h-[150px]">
            <defs><linearGradient id="jg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-gain)" stopOpacity="0.35" /><stop offset="100%" stopColor="var(--color-gain)" stopOpacity="0" /></linearGradient></defs>
            <motion.path d="M0 118 C 60 110, 90 96, 130 90 S 210 56, 250 36 S 300 14, 320 6" fill="none" stroke="var(--color-gain)" strokeWidth="3" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: 'easeInOut' }} />
            <motion.path d="M0 118 C 60 110, 90 96, 130 90 S 210 56, 250 36 S 300 14, 320 6 L 320 130 L 0 130 Z" fill="url(#jg)"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.6 }} />
          </svg>
        </div>
      )
    case 'revenue':
      return (
        <div className="h-full flex flex-col items-center justify-center text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-ink-faint mb-2">Monthly recurring revenue</span>
          <div className="font-display font-semibold text-gain text-[clamp(48px,9vw,84px)] leading-none tracking-tight">$127k</div>
          <div className="flex gap-6 mt-5 font-mono text-xs text-ink-soft">
            <span>▲ 38% MoM</span><span>CAC ↓ 41%</span><span>LTV 9.2×</span>
          </div>
        </div>
      )
    default:
      return null
  }
}
