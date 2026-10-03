import { Card, Code, Heading, Kicker, Link, Text } from '@nomosui/react'

import { bricks, levels } from '../catalogue'
import { useI18n } from '../i18n'

/**
 * The catalogue grid, on its own route (`#/catalogue`). The marketing home showcases a
 * few bricks; this page is the full inventory, grouped by level, derived from the
 * exported `catalogue` (ADR 0005) — a new brick appears here with no hand edit.
 */
export function CataloguePage() {
  const { t } = useI18n()
  const groups = levels
    .map((level) => ({ level, group: bricks.filter((brick) => brick.level === level) }))
    .filter(({ group }) => group.length > 0)

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">{t.catalogue.title}</h1>
        <p className="max-w-2xl text-muted-foreground">{t.catalogue.lead(bricks.length)}</p>
      </header>

      {groups.map(({ level, group }) => (
        <section key={level} className="flex flex-col gap-3">
          <Kicker>
            {t.levels[level]} · {group.length}
          </Kicker>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.map((brick) => (
              <Link
                key={brick.name}
                href={`#/brick/${brick.name}`}
                className="block text-foreground hover:no-underline"
              >
                <Card className="h-full transition-colors hover:border-ring">
                  <div className="flex flex-col gap-3 p-6">
                    <div className="flex items-center justify-between gap-2">
                      <Heading level={4}>{brick.title}</Heading>
                      <Code className="text-xs">{brick.name}</Code>
                    </div>
                    <Text className="text-muted-foreground">{brick.summary}</Text>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
