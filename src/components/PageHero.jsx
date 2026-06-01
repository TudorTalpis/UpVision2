import { MaskTitle } from './Primitives.jsx'
import { motion } from 'framer-motion'

export default function PageHero({ eyebrow, titleLines, intro, children }) {
  return (
    <section className="relative pt-40 pb-[clamp(48px,8vh,96px)] overflow-hidden">
      <div className="ledger-grid" />
      <div className="shell relative z-10">
        <motion.div className="eyebrow mb-7" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {eyebrow}
        </motion.div>
        <MaskTitle as="h1" className="display-lg max-w-[18ch]" lines={titleLines} />
        {intro && (
          <motion.p className="mt-8 text-[clamp(17px,1.5vw,20px)] text-ink-soft max-w-[56ch]"
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}>
            {intro}
          </motion.p>
        )}
        {children}
      </div>
    </section>
  )
}
