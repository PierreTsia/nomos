import type { ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@nomosui/react'

import { docsSlugs, type DocsSlug } from '../router'

function Code({ children }: { children: ReactNode }) {
  return (
    <pre className="overflow-x-auto rounded-md border border-border bg-muted/50 p-4 text-xs">
      <code>{children}</code>
    </pre>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">{children}</CardContent>
    </Card>
  )
}

const labels: Record<DocsSlug, string> = {
  'getting-started': 'Getting started',
  boundary: 'The boundary rule',
  contributing: 'Contributing',
}

function GettingStarted() {
  return (
    <>
      <Section title="Install">
        <p>
          The core is <code>@nomosui/react</code>; React 19 is a peer.
        </p>
        <Code>{`npm i @nomosui/react react react-dom`}</Code>
      </Section>
      <Section title="Wire the tokens">
        <p>
          Import Tailwind, the token values (the single source, ADR 0004) and the raccord, in this
          order:
        </p>
        <Code>{`@import 'tailwindcss';
@import '@nomosui/react/tokens/tokens.generated.css';
@import '@nomosui/react/tokens/theme.css';`}</Code>
      </Section>
      <Section title="Use a brick">
        <Code>{`import { Button, Card, CardContent } from '@nomosui/react'

<Card>
  <CardContent>
    <Button>Save</Button>
  </CardContent>
</Card>`}</Code>
      </Section>
      <Section title="Make it yours: the skin">
        <p>
          An app's identity is an overlay, never a fork: a skin changes token <strong>values</strong>,
          never the names (ADR 0022).
        </p>
      </Section>
    </>
  )
}

function Boundary() {
  return (
    <Section title="Imports go one way">
      <p>
        An app may import Nomos; <strong>Nomos never imports app code</strong> (ADR 0002). If
        explaining a component needs a product word, it belongs to the app, not the heart.
      </p>
      <p>
        Inside the package, imports go through <code>@nomos/*</code> and never a relative path —
        ESLint enforces it.
      </p>
    </Section>
  )
}

function Contributing() {
  return (
    <>
      <Section title="Run it">
        <Code>{`npm ci
npm test           # vitest, jsdom
npm run lint
npm run typecheck
npm run mcp        # the stdio MCP server against the source`}</Code>
      </Section>
      <Section title="Replay the generated artifacts">
        <p>CI fails if a generated file has drifted from its source; replay and commit it.</p>
        <Code>{`npm run tokens          # tokens.generated.css + tokens.resource.json
npm run build:view      # src/mcp/view.generated.ts
npm run build:view-css  # src/mcp/view-css.generated.ts
npm run build:surface   # surface.generated.json`}</Code>
      </Section>
      <Section title="A change to the package needs a changeset">
        <Code>{`npx changeset`}</Code>
        <p>A structural change that contradicts a decision is raised in an ADR, never applied silently.</p>
      </Section>
    </>
  )
}

export function DocsPage({ slug }: { slug: DocsSlug }) {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Docs</h1>
        <p className="max-w-2xl text-muted-foreground">
          Install it, wire the tokens, and learn the one rule that keeps the seams clean: imports
          go one way.
        </p>
      </header>

      <nav className="flex flex-wrap gap-2 text-sm">
        {docsSlugs.map((candidate) => (
          <a
            key={candidate}
            href={`#/docs/${candidate}`}
            className={
              candidate === slug
                ? 'rounded-md bg-secondary px-3 py-1 text-secondary-foreground'
                : 'rounded-md px-3 py-1 text-muted-foreground hover:text-foreground'
            }
          >
            {labels[candidate]}
          </a>
        ))}
      </nav>

      {slug === 'getting-started' ? <GettingStarted /> : null}
      {slug === 'boundary' ? <Boundary /> : null}
      {slug === 'contributing' ? <Contributing /> : null}
    </div>
  )
}
