import type { ReactNode } from 'react'
import { Badge, Card, CardContent, CardHeader, CardTitle, CodeBlock } from '@nomosui/react'

import { findBrick } from '../catalogue'
import { PrevNext } from '../components/prev-next'
import { useI18n } from '../i18n'
import { scenarioFor } from '../scenarios'
import { componentName, snippetFromExample } from '../snippet'
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

/** Un snippet copiable : un libellé, puis le `CodeBlock` du cœur (dogfood). */
function Snippet({ label, code }: { label: string; code: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <CodeBlock code={code} />
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

  const { manifest, component } = brick.entry
  const example = manifest.example as Record<string, unknown> | undefined
  const interfaceSnippet = example
    ? snippetFromExample(componentName(component, brick.title), example)
    : null
  const scenario = scenarioFor(brick.name)

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

      {scenario ? (
        <Beat title={t.brick.scenarioTitle} cardTitle={t.brick.scenarioCardTitle}>
          <scenario.Example />
        </Beat>
      ) : null}

      {interfaceSnippet ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {t.brick.snippetsTitle}
          </h2>
          <Snippet label={t.brick.snippetInterface} code={interfaceSnippet} />
          {scenario ? <Snippet label={t.brick.snippetScenario} code={scenario.source} /> : null}
        </section>
      ) : null}

      <ManifestDocs manifest={manifest} />

      <PrevNext name={brick.name} />
    </article>
  )
}
