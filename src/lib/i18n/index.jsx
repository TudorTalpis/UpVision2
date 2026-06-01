import { createContext, useContext, useMemo, forwardRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import en from './en.js'
import ro from './ro.js'
import ru from './ru.js'

export const LOCALES = ['en', 'ro', 'ru']
export const DEFAULT_LOCALE = 'en'
export const LOCALE_LABELS = { en: 'EN', ro: 'RO', ru: 'RU' }
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

/* ---------- routing helpers ---------- */

/** Split a pathname into its locale prefix and the rest ('/ro/work' -> {locale:'ro', rest:'/work'}). */
export function splitLocale(pathname) {
  const m = pathname.match(/^\/(ro|ru)(\/.*|$)/)
  if (m) return { locale: m[1], rest: m[2] || '/' }
  return { locale: 'en', rest: pathname || '/' }
}

/** Build a path for `locale` from a locale-less rest path ('ro','/work' -> '/ro/work'). */
export function pathFor(locale, rest) {
  const clean = rest === '/' ? '' : rest
  return locale === 'en' ? (clean || '/') : `/${locale}${clean}`
}

/** Prefix a route with the currently active locale. */
export function useLocalePath() {
  const { locale } = useLocale()
  return (to) => pathFor(locale, to.startsWith('/') ? to : `/${to}`)
}

/** Navigate to the same page in another locale, preserving the sub-path. */
export function useSwitchLocale() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  return (target) => {
    const { rest } = splitLocale(pathname)
    navigate(pathFor(target, rest))
  }
}

/** <Link> that automatically prefixes the active locale. */
export const LocaleLink = forwardRef(function LocaleLink({ to, ...rest }, ref) {
  const localePath = useLocalePath()
  return <Link ref={ref} to={localePath(to)} {...rest} />
})
