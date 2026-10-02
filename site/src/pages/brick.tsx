import { Badge, Card, CardContent, CardHeader, CardTitle } from '@nomosui/react'

import { findBrick } from '../catalogue'
import { PrevNext } from '../components/prev-next'
import { useI18n } from '../i18n'
import { ManifestDocs } from './manifest'
import { Preview } from './preview'

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

  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold">{brick.title}</h1>
          <Badge variant="secondary">{brick.level}</Badge>
          <code className="text-sm text-muted-foreground">{brick.name}</code>
        </div>
        <p className="max-w-2xl text-muted-foreground">{brick.summary}</p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          {t.brick.previewTitle}
        </h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t.brick.previewCardTitle}</CardTitle>
          </CardHeader>
          <CardContent className="flex min-h-32 items-center justify-center">
            <Preview entry={brick.entry} />
          </CardContent>
        </Card>
      </section>

      <ManifestDocs manifest={brick.entry.manifest} />

      <PrevNext name={brick.name} />
    </article>
  )
}
