import { Landing } from './pages/landing'
import { BrickPage } from './pages/brick'
import { TokensPage } from './pages/tokens'
import { useRoute } from './router'

export function App() {
  const route = useRoute()

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border">
        <nav className="mx-auto flex max-w-4xl items-center gap-4 px-8 py-4">
          <a href="#/" className="font-semibold">
            Nomos
          </a>
          <a href="#/tokens" className="text-sm text-muted-foreground hover:text-foreground">
            Tokens
          </a>
          <span className="ml-auto text-xs text-muted-foreground">generated from the catalogue</span>
        </nav>
      </header>
      <main className="mx-auto max-w-4xl px-8 py-8">
        {route.kind === 'home' ? <Landing /> : null}
        {route.kind === 'tokens' ? <TokensPage /> : null}
        {route.kind === 'brick' ? <BrickPage name={route.name} /> : null}
      </main>
    </div>
  )
}
