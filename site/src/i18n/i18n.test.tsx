import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { Sidebar } from '../components/sidebar'
import { en } from './en'
import { fr } from './fr'
import { LanguageProvider } from './index'
import { LanguageSwitch } from './language-switch'

afterEach(() => {
  cleanup()
  localStorage.clear()
  document.documentElement.lang = ''
})

/** Every key path of a dictionary, recursing into objects and arrays (functions are leaves). */
function keysOf(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((child, index) => keysOf(child, `${prefix}[${index}]`))
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) =>
      keysOf(child, prefix ? `${prefix}.${key}` : key),
    )
  }
  return [prefix]
}

/** Every string a dictionary holds (functions excluded — they are built at call time). */
function stringsOf(value: unknown): string[] {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.flatMap(stringsOf)
  if (value && typeof value === 'object') return Object.values(value).flatMap(stringsOf)
  return []
}

/**
 * The site's own sources, raw: used to prove no user-facing copy escaped into a component.
 * The i18n folder and the test files are the only legitimate homes for such strings.
 */
const sources = Object.entries(
  import.meta.glob('../**/*.{ts,tsx}', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>,
).filter(([path]) => !path.startsWith('./') && !path.includes('.test.'))

describe('dictionaries', () => {
  it('have the same keys, recursively (en and fr stay in step)', () => {
    expect(keysOf(fr)).toEqual(keysOf(en))
  })

  it('keep every multi-word user-facing string in a dictionary', () => {
    // Single words are ambiguous with identifiers, class names and URLs; multi-word copy is
    // not, so it must never be hardcoded outside the dictionaries (issue #60).
    const prose = [...new Set([...stringsOf(en), ...stringsOf(fr)].filter((text) => /\s/.test(text)))]
    expect(prose.length).toBeGreaterThan(0)

    for (const [path, source] of sources) {
      for (const text of prose) {
        expect(source.includes(text), `${path} hardcodes “${text}”`).toBe(false)
      }
    }
  })
})

describe('language runtime', () => {
  it('re-renders in the chosen language and moves <html lang>', () => {
    render(
      <LanguageProvider>
        <LanguageSwitch />
        <Sidebar route={{ kind: 'home' }} />
      </LanguageProvider>,
    )

    expect(screen.getByText(en.sidebar.browse)).toBeTruthy()
    expect(document.documentElement.lang).toBe('en')

    fireEvent.click(screen.getByRole('button', { name: 'FR' }))

    expect(screen.getByText(fr.sidebar.browse)).toBeTruthy()
    expect(screen.queryByText(en.sidebar.browse)).toBeNull()
    expect(document.documentElement.lang).toBe('fr')
    expect(localStorage.getItem('nomos-lang')).toBe('fr')
  })

  it('remembers the stored choice across mounts', () => {
    localStorage.setItem('nomos-lang', 'fr')
    render(
      <LanguageProvider>
        <Sidebar route={{ kind: 'home' }} />
      </LanguageProvider>,
    )

    expect(screen.getByText(fr.sidebar.browse)).toBeTruthy()
    expect(document.documentElement.lang).toBe('fr')
  })

  it('falls back to the browser language', () => {
    const original = navigator.language
    try {
      Object.defineProperty(navigator, 'language', { value: 'fr-CA', configurable: true })
      render(
        <LanguageProvider>
          <Sidebar route={{ kind: 'home' }} />
        </LanguageProvider>,
      )
      expect(screen.getByText(fr.sidebar.browse)).toBeTruthy()
    } finally {
      Object.defineProperty(navigator, 'language', { value: original, configurable: true })
    }
  })
})
