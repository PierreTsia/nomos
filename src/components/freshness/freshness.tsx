import type { HTMLAttributes } from 'react'

import { cn } from '@nomos/lib/cn'

/**
 * L'indicateur de fraîcheur d'une donnée : l'âge de la dernière mise à jour, avec une
 * pastille qui vire au rouge quand la donnée est périmée. Il se rend seul, hors d'une
 * table — une cellule comme un bandeau de provenance l'utilisent (ADR 0010).
 *
 * Aucun libellé ne vient de l'app : l'âge est déjà formaté par l'appelant (le cœur n'a
 * pas d'i18n), et c'est l'appelant qui décide du seuil de péremption via `stale`.
 */
export type FreshnessProps = HTMLAttributes<HTMLSpanElement> & {
  /** L'âge déjà formaté par l'appelant, ex. « il y a 2 heures ». */
  label: string
  /** L'horodatage absolu, pour l'infobulle ; absent, pas d'infobulle. */
  title?: string | null
  /** Vrai quand la donnée dépasse le seuil de péremption décidé par l'appelant. */
  stale?: boolean
}

export function Freshness({ label, title, stale = false, className, ...props }: FreshnessProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap text-xs',
        stale ? 'text-destructive' : 'text-muted-foreground',
        className,
      )}
      title={title ?? undefined}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          'size-1.5 shrink-0 rounded-full',
          stale ? 'bg-destructive' : 'bg-muted-foreground/50',
        )}
      />
      {label}
    </span>
  )
}
