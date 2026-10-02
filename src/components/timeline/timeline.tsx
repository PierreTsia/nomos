import type { HTMLAttributes } from 'react'

import { cn } from '@nomos/lib/cn'

/**
 * La frise (ADR 0015) : une suite d'événements datés, du plus récent au plus ancien.
 * Présentation seule — l'ordre, le format de `at` et le texte viennent de l'appelant.
 * Aucune donnée d'app, aucun état.
 */

type TimelineItemBase = {
  id: string
  /** La date/l'heure déjà formatée, fournie par l'appelant. */
  at: string
  label: string
  detail?: string
}

/**
 * L'état du point est une **intention** (`done` par défaut, `past` grisé), comme le
 * `tone` d'`Alert` — pas une couleur. La couleur seule ne suffit pas (WCAG) : un point
 * `past` porte obligatoirement `stateLabel`, le texte accessible fourni par l'app (le
 * cœur n'a pas d'i18n).
 */
export type TimelineItem = TimelineItemBase &
  ({ state?: 'done'; stateLabel?: string } | { state: 'past'; stateLabel: string })

export type TimelineProps = HTMLAttributes<HTMLOListElement> & {
  items: TimelineItem[]
  /** Le nom accessible de la frise ; le cœur n'a pas d'i18n. */
  ariaLabel?: string
}

export function Timeline({ items, ariaLabel, className, ...props }: TimelineProps) {
  return (
    <ol aria-label={ariaLabel} className={cn('relative flex flex-col', className)} {...props}>
      {items.map((item, index) => {
        const state = item.state ?? 'done'
        return (
          <li key={item.id} className="relative flex gap-3 pb-4 last:pb-0">
            {index < items.length - 1 ? (
              // Le rail court du centre du point au centre du suivant, derrière les
              // points : leur `ring-4 ring-background` le masque à chaque extrémité, et
              // le dernier item n'en porte pas — pas de queue pendante.
              <span
                aria-hidden
                data-rail
                className="absolute left-1 top-2 -bottom-2 w-px bg-border"
              />
            ) : null}
            <span
              aria-hidden
              data-state={state}
              className={cn(
                'relative z-10 mt-1 size-2.5 shrink-0 rounded-full ring-4 ring-background',
                state === 'past' ? 'bg-muted-foreground' : 'bg-primary',
              )}
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-sm font-medium">{item.label}</span>
                {item.stateLabel ? <span className="sr-only">{item.stateLabel}</span> : null}
                <time className="font-mono text-xs text-muted-foreground">{item.at}</time>
              </div>
              {item.detail ? <p className="text-xs text-muted-foreground">{item.detail}</p> : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
