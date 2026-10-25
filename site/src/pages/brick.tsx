import type { ReactNode } from 'react'
import { Badge, Card, CardContent, CardHeader, CardTitle, CodeBlock } from '@nomosui/react'
import { brickSnippets, type SnippetCode } from 'virtual:nomos-snippets'

import { findBrick } from '../catalogue'
import { PrevNext } from '../components/prev-next'
import { useI18n } from '../i18n'
import { scenarioComponents } from '../scenarios'
import { ManifestDocs } from './manifest'
import { Preview } from './preview'

/** Un temps de la page : un titre, une carte qui rend la brique (ou le code). */
function Beat({ title, cardTitle, children }: { title: string; cardTitle: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">{title}</h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{cardTitle}</CardTitle>
        </CardHeader>
        <CardContent className="flex min-h-32 items-center justify-center">{children}</CardContent>
      </Card>
    </section>
  )
}

/** Un snippet copiable : un libellé, puis le `CodeBlock` du cœur au contenu coloré au build. */
function Snippet({ label, code }: { label: string; code: SnippetCode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <CodeBlock code={code.raw}>
        <span dangerouslySetInnerHTML={{ __html: code.html }} />
      </CodeBlock>
    </div>
  )
}

export function BrickPage({ name }: { name: string }) {
  const { t } = useI18n()
  const brick = findBrick(name)

  if (!brick) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-muted-foreground">{t.brick.unknown(name)}</p>
        <a href="#/" className="text-sm underline-offset-4 hover:underline">
          {t.brick.allBricks}
        </a>
      </div>
    )
  }

  const { manifest } = brick.entry
  const snippets = brickSnippets[brick.name] ?? {}
  const Scenario = scenarioComponents[brick.name]
  const hasSnippets = Boolean(snippets.interface || snippets.scenario)

  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold">{brick.title}</h1>
          <Badge variant="secondary">{t.levels[brick.level]}</Badge>
          <code className="text-sm text-muted-foreground">{brick.name}</code>
        </div>
        <p className="max-w-2xl text-muted-foreground">{brick.summary}</p>
      </header>

      <Beat title={t.brick.interfaceTitle} cardTitle={t.brick.interfaceCardTitle}>
        <Preview entry={brick.entry} />
      </Beat>

      {Scenario ? (
        <Beat title={t.brick.scenarioTitle} cardTitle={t.brick.scenarioCardTitle}>
          <Scenario />
        </Beat>
      ) : null}

      {hasSnippets ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {t.brick.snippetsTitle}
          </h2>
          {snippets.interface ? (
            <Snippet label={t.brick.snippetInterface} code={snippets.interface} />
          ) : null}
          {snippets.scenario ? (
            <Snippet label={t.brick.snippetScenario} code={snippets.scenario} />
          ) : null}
        </section>
      ) : null}

      <ManifestDocs manifest={manifest} />

      <PrevNext name={brick.name} />
    </article>
  )
}
