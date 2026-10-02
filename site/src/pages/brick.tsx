import { Badge, Card, CardContent, CardHeader, CardTitle } from '@nomosui/react'

import { findBrick } from '../catalogue'

export function BrickPage({ name }: { name: string }) {
  const brick = findBrick(name)

  if (!brick) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-muted-foreground">Unknown brick « {name} ».</p>
        <a href="#/" className="text-sm underline-offset-4 hover:underline">
          ← All bricks
        </a>
      </div>
    )
  }

  return (
    <article className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">{brick.title}</h1>
          <Badge variant="secondary">{brick.level}</Badge>
        </div>
        <p className="max-w-2xl text-muted-foreground">{brick.summary}</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Showcase</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Props, variants, usages and the rendered example arrive with the manifest showcase
            (#40). This page itself is generated from the catalogue (#39).
          </p>
        </CardContent>
      </Card>

      <a href="#/" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
        ← All bricks
      </a>
    </article>
  )
}
