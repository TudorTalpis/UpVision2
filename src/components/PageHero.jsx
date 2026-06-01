import SplitText from './SplitText.jsx'
import ScrambleText from './ScrambleText.jsx'

export default function PageHero({ eyebrow, titleLines, intro, children }) {
  return (
    <section className="relative pt-40 pb-[clamp(48px,8vh,96px)] overflow-hidden">
      <div className="ledger-grid" />
      <div className="shell relative z-10">
        <div className="eyebrow mb-7">
          <ScrambleText as="span" text={eyebrow} start="top 99%" />
        </div>
        <h1 className="display-lg max-w-[18ch]">
          {titleLines.map((l, i) => (
            <SplitText key={i} as="span" className="block" by="word" play="load" delay={0.1 + i * 0.12} text={l} />
          ))}
        </h1>
        {intro && (
          <p className="mt-8 text-[clamp(17px,1.5vw,20px)] text-ink-soft max-w-[56ch]">
            <SplitText as="span" by="word" blur={false} y="0.4em" stagger={0.012} play="load" delay={0.45} text={intro} />
          </p>
        )}
        {children}
      </div>
    </section>
  )
}
