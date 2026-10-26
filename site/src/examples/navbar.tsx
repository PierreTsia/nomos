import { Link, Navbar } from '@nomosui/react'

export default function Example() {
  return (
    <div className="w-full overflow-hidden rounded-md border">
      <Navbar
        brand={<span className="font-semibold">Acme</span>}
        nav={
          <>
            <Link href="#/catalogue">Overview</Link>
            <Link href="#/tokens">Settings</Link>
          </>
        }
        actions={<Link href="#/docs/getting-started">Sign in</Link>}
      />
    </div>
  )
}
