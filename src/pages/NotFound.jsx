import { useEffect } from 'react'
import { Magnetic } from '../components/Primitives.jsx'
import { setMeta } from '../lib/seo'
import { useLocale, useT } from '../lib/i18n'

export default function NotFound() {
  const { locale } = useLocale()
  const t = useT()
  useEffect(() => setMeta({ title: 'Page not found — UpVision', description: 'That page has moved or never existed.', path: '/404', locale }), [locale])
  return (
    <section className="relative min-h-[100svh] grid place-items-center text-center overflow-hidden">
      <div className="ledger-grid" />
      <div className="shell relative z-10">
        <div className="font-display font-semibold text-accent leading-none" style={{ fontSize: 'clamp(90px,22vw,260px)', letterSpacing: '-0.05em' }}>404</div>
        <p className="text-lg text-ink-soft mt-4 mb-9">{t('nf.body')}</p>
        <Magnetic to="/" className="btn btn--accent" cursor="Home"><span className="btn__dot" /> {t('nf.btn')}</Magnetic>
      </div>
    </section>
  )
}
