import { Badge } from '@nomosui/react'

import { tokenGroups, tokenSlots } from '../tokens'

export function TokensPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Tokens</h1>
        <p className="max-w-2xl text-muted-foreground">
          The names every component speaks in. The values live in one file, and a skin replaces
          them (ADR 0003, 0004).
        </p>
      </header>

      {tokenGroups.map((group) => (
        <section key={group} className="flex flex-col gap-2">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {group}
          </h2>
          <div className="flex flex-col divide-y divide-border rounded-md border border-border">
            {tokenSlots
              .filter((slot) => slot.path.startsWith(`${group}.`))
              .map((slot) => (
                <div
                  key={slot.path}
                  className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2 text-sm"
                >
                  <code>--nomos-{slot.path.replaceAll('.', '-')}</code>
                  <span className="flex flex-wrap gap-2">
                    {Object.entries(slot.modes).map(([mode, value]) => (
                      <Badge key={mode} variant="outline">
                        {mode}: {value}
                      </Badge>
                    ))}
                  </span>
                </div>
              ))}
          </div>
        </section>
      ))}
    </div>
  )
}
