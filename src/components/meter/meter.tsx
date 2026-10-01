import type { HTMLAttributes } from 'react'

import { cn } from '@nomos/lib/cn'

/**
 * Le Meter : une barre qui montre où en est une valeur sur une échelle, avec la marque
 * du seuil quand il y en a un. Il sert une cellule de table **et** une carte de santé —
 * c'est ce qui en fait un atome et pas un détail interne à la table (ADR 0010).
 *
 * Aucun libellé ne vient de l'app : l'appelant passe le texte du seuil. Le cœur ne
 * connaît ni l'i18n de l'app ni un mot produit.
 */

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value))
}

/** Une valeur non numérique est une donnée cassée : on la ramène à 0 plutôt que de
 *  produire un `width: NaN%`, que le navigateur refuse — et jsdom avec lui. */
function finite(value: number | null | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

type Scale = {
  /** La valeur mesurée, sur `0..max`. */
  value: number
  /** Le haut de l'échelle (`3` pour un score, `1` pour un Noul). */
  max: number
  /** Le seuil de comparaison, marqué sur la barre. */
  threshold?: number | null
}

export type MeterProps = HTMLAttributes<HTMLDivElement> &
  Scale & {
    label: string
    decimals?: number
    confidence?: number | null
    /** Le texte du seuil, donné par l'appelant (le cœur n'a pas d'i18n). */
    thresholdLabel?: (threshold: number) => string
  }

export function Meter({
  label,
  value,
  max,
  threshold,
  decimals = 2,
  confidence,
  thresholdLabel,
  className,
  ...props
}: MeterProps) {
  const shown = finite(value)
  const peak = finite(max)
  const ratio = peak > 0 ? clamp01(shown / peak) : 0
  const mark = threshold != null && peak > 0 ? clamp01(finite(threshold) / peak) : null

  return (
    <div className={cn('flex items-center gap-3', className)} {...props}>
      <span
        className="w-40 shrink-0 truncate font-mono text-xs text-muted-foreground"
        title={label}
      >
        {label}
      </span>
      <div className="relative h-2 flex-1 rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${ratio * 100}%` }} />
        {mark != null ? (
          <div
            className="absolute top-1/2 h-3.5 w-0.5 -translate-y-1/2 rounded-full bg-foreground/60"
            style={{ left: `calc(${mark * 100}% - 1px)` }}
            title={thresholdLabel ? thresholdLabel(threshold as number) : undefined}
          />
        ) : null}
      </div>
      <span className="w-10 shrink-0 text-right font-mono text-xs tabular-nums">
        {shown.toFixed(decimals)}
      </span>
      <span className="w-11 shrink-0 text-right font-mono text-[11px] tabular-nums text-muted-foreground">
        {typeof confidence === 'number' && Number.isFinite(confidence)
          ? `c${confidence.toFixed(2)}`
          : ''}
      </span>
    </div>
  )
}

export type CompactMeterProps = HTMLAttributes<HTMLDivElement> &
  Scale & {
    label: string
  }

/** La même barre, en plus court : une cellule de table dense. */
export function CompactMeter({
  label,
  value,
  max,
  threshold,
  className,
  ...props
}: CompactMeterProps) {
  const shown = finite(value)
  const peak = finite(max)
  const ratio = peak > 0 ? clamp01(shown / peak) : 0
  const mark = threshold != null && peak > 0 ? clamp01(finite(threshold) / peak) : null

  return (
    <div className={cn('flex items-center gap-2', className)} {...props}>
      <span className="w-9 shrink-0 font-mono text-[10px] text-muted-foreground">{label}</span>
      <div className="relative h-1.5 w-24 rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${ratio * 100}%` }} />
        {mark != null ? (
          <div
            className="absolute top-1/2 h-2.5 w-px -translate-y-1/2 bg-foreground/60"
            style={{ left: `${mark * 100}%` }}
          />
        ) : null}
      </div>
      <span className="w-8 shrink-0 text-right font-mono text-[10px] tabular-nums">
        {shown.toFixed(2)}
      </span>
    </div>
  )
}