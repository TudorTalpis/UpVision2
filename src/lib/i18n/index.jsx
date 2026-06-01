import { createContext, useContext, useMemo } from 'react'
import en from './en.js'
import ro from './ro.js'
import ru from './ru.js'

export const LOCALES = ['en', 'ro', 'ru']
export const DEFAULT_LOCALE = 'en'
const DICTS = { en, ro, ru }

const LocaleContext = createContext({ locale: DEFAULT_LOCALE })

export function LocaleProvider({ locale = DEFAULT_LOCALE, children }) {
  const value = useMemo(() => ({ locale }), [locale])
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  return useContext(LocaleContext)
}

/** Resolve a dotted key for `locale`, falling back to EN, then to the key. */
export function translate(locale, key) {
  const dict = DICTS[locale] || en
  if (key in dict) return dict[key]
  if (key in en) return en[key]
  return key
}

export function useT() {
  const { locale } = useLocale()
  return useMemo(() => (key) => translate(locale, key), [locale])
}
