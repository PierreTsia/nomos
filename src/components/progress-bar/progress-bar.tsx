import type { HTMLAttributes } from 'react'

import { cn } from '@nomos/lib/cn'

/**
 * La barre de progression (ADR 0015) : une valeur sur un total, sémantique ARIA
 * `progressbar` (`aria-valuenow/min/max`). Là où le `Meter` situe une valeur sur une
 * échelle avec un seuil, elle montre l'avancement d'une tâche. Aucun libellé n'est
 * inventé : l'appelant fournit `label`, ou rien.
 */

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value))
}

/** Une valeur non numérique est une donnée cassée : on la ramène à 0 plutôt qu'un CSS invalide. */
function finite(value: number | null | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

export type ProgressBarProps = HTMLAttributes<HTMLDivElement> & {
  /** L'avancement, sur `0..max`. */
  value: number
  /** Le total : `100` par défaut. */
  max?: number
  /** Le nom de ce qui avance ; sert aussi de nom accessible. */
  label?: string
  /** Affiche le pourcentage à droite, calculé (jamais un texte produit). */
  showValue?: boolean
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  className,
  ...props
}: ProgressBarProps) {
  const shown = finite(value)
  const peak = finite(max)
  const ratio = peak > 0 ? clamp01(shown / peak) : 0

  return (
    <div className={cn('flex flex-col gap-1', className)} {...props}>
      {label || showValue ? (
        <div className="flex items-baseline justify-between gap-2 text-xs">
          {label ? <span className="text-muted-foreground">{label}</span> : <span />}
          {showValue ? (
            <span className="font-mono tabular-nums">{Math.round(ratio * 100)}%</span>
          ) : null}
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={shown}
        aria-valuemin={0}
        aria-valuemax={peak}
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    </div>
  )
}
