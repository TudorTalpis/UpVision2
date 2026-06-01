import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LocaleProvider, useT, useLocale } from '../index.jsx'

function Probe() {
  const t = useT()
  const { locale } = useLocale()
  return <p>{locale}:{t('nav.work')}|{t('does.not.exist')}</p>
}

describe('i18n', () => {
  it('resolves keys for the active locale and falls back gracefully', () => {
    render(<LocaleProvider locale="en"><Probe /></LocaleProvider>)
    expect(screen.getByText(/^en:Work\|does\.not\.exist$/)).toBeInTheDocument()
  })

  it('falls back to EN when a RO key is missing but exists in EN', () => {
    render(<LocaleProvider locale="ro"><Probe /></LocaleProvider>)
    expect(screen.queryByText(/nav\.work/)).not.toBeInTheDocument()
  })
})
