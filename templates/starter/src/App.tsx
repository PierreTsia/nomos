import { Button, Footer, Navbar, ToastProvider } from '@nomosui/react'

import { DashboardPage } from './pages/dashboard-page'
import { ItemsPage } from './pages/items-page'
import { NewItemPage } from './pages/new-item-page'
import { navigate, useHashRoute } from './router'

const NAV = [
  { path: '/', label: 'Dashboard' },
  { path: '/items', label: 'Items' },
]

export function App() {
  const route = useHashRoute()

  return (
    <ToastProvider closeLabel="Dismiss">
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Navbar
          brand={<span>Nomos Starter</span>}
          nav={NAV.map(({ path, label }) => (
            <a key={path} href={`#${path}`} className="text-sm text-muted-foreground hover:text-foreground">
              {label}
            </a>
          ))}
          actions={
            <Button size="sm" onClick={() => navigate('/items/new')}>
              New item
            </Button>
          }
        />

        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
          {route === '/items' ? (
            <ItemsPage />
          ) : route === '/items/new' ? (
            <NewItemPage />
          ) : (
            <DashboardPage />
          )}
        </main>

        <Footer
          brand={<span>Nomos Starter</span>}
          links={
            <>
              <a href="#/" className="text-muted-foreground hover:text-foreground">
                Dashboard
              </a>
              <a href="#/items" className="text-muted-foreground hover:text-foreground">
                Items
              </a>
            </>
          }
          legal="Built on Nomos — an app-agnostic design system."
        />
      </div>
    </ToastProvider>
  )
}
