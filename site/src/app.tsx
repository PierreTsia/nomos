import { Footer, Link, Navbar } from '@nomosui/react'

import { DocsPage } from './pages/docs'
import { Landing } from './pages/landing'
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

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <Navbar
        className="px-6"
        brand={<Wordmark />}
        nav={
          <>
            <Link href="#/tokens" className={quietLink}>
              Tokens
            </Link>
            <Link href="#/docs/getting-started" className={quietLink}>
              Docs
            </Link>
          </>
        }
        actions={
          <>
            <Link href={NPM} target="_blank" rel="noreferrer" className={quietLink}>
              npm
            </Link>
            <Link href={REPO} target="_blank" rel="noreferrer" className={quietLink}>
              GitHub
            </Link>
          </>
        }
      />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        {route.kind === 'home' ? <Landing /> : null}
        {route.kind === 'tokens' ? <TokensPage /> : null}
        {route.kind === 'brick' ? <BrickPage name={route.name} /> : null}
        {route.kind === 'docs' ? <DocsPage slug={route.slug} /> : null}
      </main>

      <Footer
        className="px-6"
        brand={<Wordmark />}
        links={
          <>
            <Link href={REPO} target="_blank" rel="noreferrer" className={quietLink}>
              GitHub
            </Link>
            <Link href={NPM} target="_blank" rel="noreferrer" className={quietLink}>
              npm
            </Link>
            <Link href="#/" className={quietLink}>
              Catalog
            </Link>
            <Link href="#/tokens" className={quietLink}>
              Tokens
            </Link>
            <Link href="#/docs/getting-started" className={quietLink}>
              Docs
            </Link>
          </>
        }
        legal="Nomos · νόμος, the laws of the interface · MIT"
      />
    </div>
  )
}
