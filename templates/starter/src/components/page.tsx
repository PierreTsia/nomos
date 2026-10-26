import type { ReactNode } from 'react'

import { Heading, Text } from '@nomosui/react'

/** An app-side page wrapper (ADR 0002): Nomos has no layout brick, so the app owns one. */
export function Page({
  title,
  description,
  actions,
  children,
}: {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Heading level={1}>{title}</Heading>
          {description ? <Text tone="muted">{description}</Text> : null}
        </div>
        {actions}
      </div>
      {children}
    </div>
  )
}
