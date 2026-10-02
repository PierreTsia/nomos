import type { ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@nomosui/react'

import { useI18n } from '../i18n'
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

function GettingStarted() {
  const { t } = useI18n()
  return (
    <>
      <Section title={t.docs.gettingStarted.installTitle}>
        <p>{t.docs.gettingStarted.installBody}</p>
        <Code>{`npm i @nomosui/react react react-dom`}</Code>
      </Section>
      <Section title={t.docs.gettingStarted.wireTitle}>
        <p>{t.docs.gettingStarted.wireBody}</p>
        <Code>{`@import 'tailwindcss';
@import '@nomosui/react/tokens/tokens.generated.css';
@import '@nomosui/react/tokens/theme.css';`}</Code>
      </Section>
      <Section title={t.docs.gettingStarted.useTitle}>
        <Code>{`import { Button, Card, CardContent } from '@nomosui/react'

<Card>
  <CardContent>
    <Button>Save</Button>
  </CardContent>
</Card>`}</Code>
      </Section>
      <Section title={t.docs.gettingStarted.skinTitle}>
        <p>{t.docs.gettingStarted.skinBody}</p>
      </Section>
    </>
  )
}

function Boundary() {
  const { t } = useI18n()
  return (
    <Section title={t.docs.boundary.title}>
      <p>{t.docs.boundary.body1}</p>
      <p>{t.docs.boundary.body2}</p>
    </Section>
  )
}

function Contributing() {
  const { t } = useI18n()
  return (
    <>
      <Section title={t.docs.contributing.runTitle}>
        <Code>{`npm ci
npm test           # vitest, jsdom
npm run lint
npm run typecheck
npm run mcp        # the stdio MCP server against the source`}</Code>
      </Section>
      <Section title={t.docs.contributing.replayTitle}>
        <p>{t.docs.contributing.replayBody}</p>
        <Code>{`npm run tokens          # tokens.generated.css + tokens.resource.json
npm run build:view      # src/mcp/view.generated.ts
npm run build:view-css  # src/mcp/view-css.generated.ts
npm run build:surface   # surface.generated.json`}</Code>
      </Section>
      <Section title={t.docs.contributing.changesetTitle}>
        <Code>{`npx changeset`}</Code>
        <p>{t.docs.contributing.changesetBody}</p>
      </Section>
    </>
  )
}

export function DocsPage({ slug }: { slug: DocsSlug }) {
  const { t } = useI18n()
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">{t.docs.title}</h1>
        <p className="max-w-2xl text-muted-foreground">{t.docs.lead}</p>
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
            {t.docs.labels[candidate]}
          </a>
        ))}
      </nav>

      {slug === 'getting-started' ? <GettingStarted /> : null}
      {slug === 'boundary' ? <Boundary /> : null}
      {slug === 'contributing' ? <Contributing /> : null}
    </div>
  )
}
