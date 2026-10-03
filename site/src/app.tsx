import { useEffect } from 'react'

import { Footer, Link, Navbar } from '@nomosui/react'

import { Sidebar } from './components/sidebar'
import { useI18n } from './i18n'
import { LanguageSwitch } from './i18n/language-switch'
import { DocsPage } from './pages/docs'
import { Home } from './pages/home'
import { CataloguePage } from './pages/catalogue'
import { BrickPage } from './pages/brick'
import { TokensPage } from './pages/tokens'
import { useRoute } from './router'

const REPO = 'https://github.com/PierreTsia/nomos'
const NPM = 'https://www.npmjs.com/package/@nomosui/react'

const quietLink = 'text-sm text-muted-foreground hover:text-foreground'

function Wordmark() {
  return (
    <Link
      href="#/"
      className="flex items-center gap-2 font-mono text-base font-semibold tracking-tight text-foreground hover:no-underline"
    >
      <span aria-hidden className="size-2 rounded-full bg-primary" />
      Nomos
    </Link>
  )
}

export function App() {
  const route = useRoute()
  const { t } = useI18n()

  // A route change lands at the top of the content; the sidebar scroll is its own.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [route])

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <Navbar
        className="px-6"
        brand={<Wordmark />}
        nav={
          <>
            <Link href="#/catalogue" className={quietLink}>
              {t.nav.catalogue}
            </Link>
            <Link href="#/tokens" className={quietLink}>
              {t.nav.tokens}
            </Link>
            <Link href="#/docs/getting-started" className={quietLink}>
              {t.nav.docs}
            </Link>
          </>
        }
        actions={
          <>
            <Link href={NPM} target="_blank" rel="noreferrer" className={quietLink}>
              {t.nav.npm}
            </Link>
            <Link href={REPO} target="_blank" rel="noreferrer" className={quietLink}>
              {t.nav.github}
            </Link>
            <LanguageSwitch />
          </>
        }
      />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        {route.kind === 'home' ? (
          <Home />
        ) : (
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
            <Sidebar route={route} />
            <div className="min-w-0 flex-1">
              {route.kind === 'catalogue' ? <CataloguePage /> : null}
              {route.kind === 'tokens' ? <TokensPage /> : null}
              {route.kind === 'brick' ? <BrickPage name={route.name} /> : null}
              {route.kind === 'docs' ? <DocsPage slug={route.slug} /> : null}
            </div>
          </div>
        )}
      </main>

      <Footer
        className="px-6"
        brand={<Wordmark />}
        links={
          <>
            <Link href={REPO} target="_blank" rel="noreferrer" className={quietLink}>
              {t.nav.github}
            </Link>
            <Link href={NPM} target="_blank" rel="noreferrer" className={quietLink}>
              {t.nav.npm}
            </Link>
            <Link href="#/catalogue" className={quietLink}>
              {t.footer.catalog}
            </Link>
            <Link href="#/tokens" className={quietLink}>
              {t.footer.tokens}
            </Link>
            <Link href="#/docs/getting-started" className={quietLink}>
              {t.footer.docs}
            </Link>
          </>
        }
        legal={t.footer.legal}
      />
    </div>
  )
}
