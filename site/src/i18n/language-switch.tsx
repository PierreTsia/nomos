import { useI18n, type Lang } from './index'

const base = 'cursor-pointer text-sm'
const active = 'font-semibold text-foreground'
const idle = 'text-muted-foreground hover:text-foreground'

const LANGS: Lang[] = ['en', 'fr']

/** The header toggle: two buttons, the active language pressed. Lives in the Navbar actions. */
export function LanguageSwitch() {
  const { lang, setLang, t } = useI18n()

  return (
    <span role="group" aria-label={t.language.label} className="flex items-center gap-1">
      {LANGS.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={`${base} ${lang === code ? active : idle}`}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </span>
  )
}
