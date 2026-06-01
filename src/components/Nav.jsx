import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useMagnetic } from '../lib/hooks'
import { useT, useLocale, useLocalePath, useSwitchLocale, LOCALES, LOCALE_LABELS } from '../lib/i18n'

const LINKS = [
  { to: '/work', key: 'nav.work' },
  { to: '/services', key: 'nav.services' },
  { to: '/process', key: 'nav.process' },
  { to: '/pricing', key: 'nav.pricing' },
  { to: '/about', key: 'nav.about' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const cta = useMagnetic(0.3)
  const t = useT()
  const lp = useLocalePath()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => setOpen(false), [pathname])

  return (
    <>
      <header
        className="fixed top-0 inset-x-0 z-[9000] flex items-center justify-between transition-all duration-500"
        style={{
          padding: scrolled ? '12px clamp(20px,5vw,64px)' : '22px clamp(20px,5vw,64px)',
          background: scrolled ? 'rgba(245,242,236,0.72)' : 'transparent',
          backdropFilter: scrolled ? 'blur(14px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--color-line)' : '1px solid transparent',
        }}
      >
        <NavLink to={lp('/')} className="flex items-center gap-2.5" aria-label="UpVision home">
          <Logo />
          <span className="font-display text-[19px] font-semibold tracking-tight">UpVision</span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={lp(l.to)}
              data-cursor=""
              className={({ isActive }) =>
                `text-[15px] transition-colors relative ${isActive ? 'text-ink' : 'text-ink-soft hover:text-ink'}`
              }
            >
              {t(l.key)}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-5">
          <LangSwitcher />
          <NavLink ref={cta} to={lp('/contact')} className="btn btn--accent inline-flex !py-3 !px-5 !text-sm" data-cursor="Let's talk">
            <span className="btn__dot" /> {t('nav.cta')}
          </NavLink>
        </div>

        <button
          className="md:hidden flex flex-col gap-[5px] w-10 h-10 items-center justify-center"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          <span className={`block w-5 h-[2px] bg-ink transition-transform duration-400 ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
          <span className={`block w-5 h-[2px] bg-ink transition-transform duration-400 ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[8999] bg-paper-2 flex flex-col justify-center px-[clamp(20px,5vw,64px)] md:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            {LINKS.concat({ to: '/contact', key: 'nav.cta' }).map((l, i) => (
              <motion.div
                key={l.to}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.12 + i * 0.06 }}
              >
                <NavLink to={lp(l.to)} className="font-display font-medium flex items-baseline gap-4 py-2.5 border-b border-line text-[clamp(34px,11vw,60px)]">
                  <span className="font-mono text-accent text-xs">0{i + 1}</span>
                  {t(l.key)}
                </NavLink>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10">
              <LangSwitcher size="lg" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function LangSwitcher({ size = 'sm' }) {
  const { locale } = useLocale()
  const switchTo = useSwitchLocale()
  const big = size === 'lg'
  return (
    <div className={`flex items-center ${big ? 'gap-3' : 'gap-2'}`} role="group" aria-label="Language">
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span className={`text-ink-faint ${big ? 'mx-1 text-sm' : 'mr-2 text-[11px]'}`}>·</span>}
          <button
            type="button"
            onClick={() => switchTo(l)}
            aria-current={locale === l ? 'true' : undefined}
            data-cursor=""
            className={`font-mono uppercase tracking-[0.12em] transition-colors ${big ? 'text-base' : 'text-[12px]'} ${
              locale === l ? 'text-accent' : 'text-ink-soft hover:text-ink'
            }`}
          >
            {LOCALE_LABELS[l]}
          </button>
        </span>
      ))}
    </div>
  )
}

function Logo() {
  return (
    <span className="relative grid place-items-center w-9 h-9 rounded-[10px] bg-ink text-paper overflow-hidden">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 14L7 7l3 3 6-8" stroke="var(--color-accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="16" cy="2" r="1.6" fill="var(--color-accent)" />
      </svg>
    </span>
  )
}
