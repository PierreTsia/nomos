import { Link, Footer } from '@nomosui/react'

export default function Example() {
  return (
    <div className="w-full overflow-hidden rounded-md border">
      <Footer
        brand={<span className="font-semibold">Acme</span>}
        links={
          <>
            <Link href="#/catalogue">Catalogue</Link>
            <Link href="#/tokens">Tokens</Link>
          </>
        }
        legal="© 2026 Acme · MIT"
      />
    </div>
  )
}
