import { Badge, Card, CardContent, CardHeader, CardTitle } from '@nomosui/react'

import { bricks, levels, type Brick } from '../catalogue'

const levelLabel: Record<Brick['level'], string> = {
  jeton: 'tokens',
  primitive: 'primitives',
  bloc: 'blocks',
}

export function Landing() {
  return (
    <div className="flex flex-col gap-8">
      <p className="max-w-2xl text-muted-foreground">
        Every brick of the catalogue, generated from its manifest — one inventory, one more
        rendering (ADR 0005).
      </p>

      {levels.map((level) => {
        const group = bricks.filter((brick) => brick.level === level)
        if (group.length === 0) return null
        return (
          <section key={level} className="flex flex-col gap-3">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              {levelLabel[level]} · {group.length}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.map((brick) => (
                <a key={brick.name} href={`#/brick/${brick.name}`} className="block">
                  <Card className="h-full transition-colors hover:border-ring">
                    <CardHeader>
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-base">{brick.title}</CardTitle>
                        <Badge variant="outline">{brick.name}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{brick.summary}</p>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
