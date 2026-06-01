import { Link } from 'react-router-dom'
import { Magnetic } from './Primitives.jsx'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="night relative overflow-hidden pt-[clamp(70px,11vh,140px)] pb-10">
      <div className="ledger-grid" style={{ opacity: 0.18 }} />
      <div className="shell relative z-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="display-lg max-w-[12ch]">
            Let’s turn it into <span className="serif-italic text-accent">revenue.</span>
          </h2>
          <Magnetic to="/contact" className="btn btn--accent self-start" cursor="Book a call" strength={0.3}>
            <span className="btn__dot" /> Book a strategy call
          </Magnetic>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10 mt-20 pb-12 border-b border-white/10">
          <div className="col-span-2 md:col-span-1">
            <div className="font-display text-2xl font-semibold">UpVision</div>
            <p className="text-paper/55 mt-4 max-w-[30ch] text-[15px]">
              We build growth systems — brand, product, software and the engine that turns them into business results.
            </p>
          </div>
          <FCol title="Explore" links={[['Work', '/work'], ['Services', '/services'], ['Process', '/process'], ['Pricing', '/pricing']]} />
          <FCol title="Studio" links={[['About', '/about'], ['Contact', '/contact']]} />
          <div>
            <h5 className="font-mono text-xs uppercase tracking-[0.14em] text-paper/45 mb-4">Connect</h5>
            <a className="block py-1 text-paper/70 hover:text-accent transition-colors" href="mailto:hello@upvision.studio">hello@upvision.studio</a>
            <a className="block py-1 text-paper/70 hover:text-accent transition-colors" href="#">LinkedIn</a>
            <a className="block py-1 text-paper/70 hover:text-accent transition-colors" href="#">Instagram</a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between gap-3 pt-7 font-mono text-[12px] text-paper/45">
          <span>© {year} UpVision Studio</span>
          <span>Idea → Research → Brand → Design → Build → Launch → Growth → Revenue</span>
        </div>
      </div>
    </footer>
  )
}

function FCol({ title, links }) {
  return (
    <div>
      <h5 className="font-mono text-xs uppercase tracking-[0.14em] text-paper/45 mb-4">{title}</h5>
      {links.map(([l, to]) => (
        <Link key={to} to={to} className="block py-1 text-paper/70 hover:text-accent transition-colors">{l}</Link>
      ))}
    </div>
  )
}
