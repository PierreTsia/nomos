import type { HTMLAttributes } from 'react'

import { cn } from '@nomos/lib/cn'

/**
 * La frise (ADR 0015) : une suite d'événements datés, du plus récent au plus ancien.
 * Présentation seule — l'ordre, le format de `at` et le texte viennent de l'appelant.
 * Aucune donnée d'app, aucun état.
 */
export type TimelineItem = {
  id: string
  /** La date/l'heure déjà formatée, fournie par l'appelant. */
  at: string
  label: string
  detail?: string
}

export type TimelineProps = HTMLAttributes<HTMLOListElement> & {
  items: TimelineItem[]
  /** Le nom accessible de la frise ; le cœur n'a pas d'i18n. */
  ariaLabel?: string
}

export function Timeline({ items, ariaLabel, className, ...props }: TimelineProps) {
  return (
    <ol aria-label={ariaLabel} className={cn('relative flex flex-col', className)} {...props}>
      {items.map((item, index) => (
        <li key={item.id} className="relative flex gap-3 pb-4 last:pb-0">
          {index < items.length - 1 ? (
            <span aria-hidden className="absolute left-1 top-4 h-full w-px bg-border" />
          ) : null}
          <span
            aria-hidden
            className="relative z-10 mt-1 size-2.5 shrink-0 rounded-full bg-primary ring-4 ring-background"
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-sm font-medium">{item.label}</span>
              <time className="font-mono text-xs text-muted-foreground">{item.at}</time>
            </div>
            {item.detail ? <p className="text-xs text-muted-foreground">{item.detail}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  )
}
