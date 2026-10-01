import type { ReactNode } from 'react'
import { X } from 'lucide-react'

import { cn } from '@nomos/lib/cn'
import { toneClasses, type Tone } from '@nomos/lib/tone'

/** La hauteur d'une puce selon sa taille. */
export const chipSizeClasses: Record<'default' | 'sm', string> = {
  default: 'h-6',
  sm: 'h-5 text-[11px]',
}

type ChipBase = {
  /** Le ton : une intention, pas une couleur (cf. `toneClasses`). Défaut `neutral`. */
  tone?: Tone
  /** La taille de la puce. Défaut `default`. */
  size?: 'default' | 'sm'
  /** Une icône de tête, fournie par l'appelant. */
  icon?: ReactNode
  /** Le libellé de la puce : court, jamais une phrase. */
  children: ReactNode
  /** Désactive le bouton de retrait. */
  disabled?: boolean
  /** Les classes de l'appelant, fusionnées après celles du cœur. */
  className?: string
}

/**
 * Le bouton de retrait exige son libellé accessible : `onRemove` et `removeLabel` vont
 * ensemble, ou pas du tout (le cœur n'a pas d'i18n, il n'invente aucun texte).
 */
type ChipRemove =
  | { onRemove: () => void; removeLabel: string }
  | { onRemove?: undefined; removeLabel?: undefined }

export type ChipProps = ChipBase & ChipRemove

/**
 * La puce : une étiquette compacte, éventuellement retirable. Présentation seule — l'app
 * fournit le libellé, l'icône et l'action de retrait (ADR 0015).
 */
export function Chip({
  tone = 'neutral',
  size = 'default',
  icon,
  children,
  onRemove,
  removeLabel,
  disabled = false,
  className,
}: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-1 rounded-full border px-2.5 text-xs font-medium',
        chipSizeClasses[size],
        toneClasses[tone],
        className,
      )}
    >
      {icon ? (
        <span aria-hidden className="shrink-0">
          {icon}
        </span>
      ) : null}
      <span className="truncate">{children}</span>
      {onRemove ? (
        <button
          type="button"
          aria-label={removeLabel}
          disabled={disabled}
          onClick={onRemove}
          className="-mr-1 shrink-0 rounded-full p-0.5 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
        >
          <X className="size-3" aria-hidden />
        </button>
      ) : null}
    </span>
  )
}