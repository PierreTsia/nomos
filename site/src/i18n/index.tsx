import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

import { en, type Dictionary } from './en'
import { fr } from './fr'

export type Lang = 'en' | 'fr'

/**
 * Where the language lives — a deliberate choice (issue #60): the **stored preference** only,
 * never the URL. The hash already carries the route (`#/brick/button`), and a language segment
 * would fork every link and every bookmark; the site instead reads `localStorage['nomos-lang']`
 * and leaves the routes untouched. A first-time visitor gets the browser language (fr → fr,
 * anything else → en).
 */
const STORAGE_KEY = 'nomos-lang'

const dictionaries: Record<Lang, Dictionary> = { en, fr }

function resolveInitialLang(): Lang {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'en' || stored === 'fr') return stored
  return navigator.language.startsWith('fr') ? 'fr' : 'en'
}

type I18n = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Dictionary
}

/** Defaults to English so a component rendered outside the provider still has copy (tests). */
const I18nContext = createContext<I18n>({ lang: 'en', setLang: () => {}, t: en })

export function useI18n(): I18n {
  return useContext(I18nContext)
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(resolveInitialLang)

  const setLang = (next: Lang) => {
    localStorage.setItem(STORAGE_KEY, next)
    setLangState(next)
  }

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return (
    <I18nContext.Provider value={{ lang, setLang, t: dictionaries[lang] }}>
      {children}
    </I18nContext.Provider>
  )
}
