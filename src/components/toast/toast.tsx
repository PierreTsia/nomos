import type { ReactNode } from 'react'
import { CircleAlert, CircleCheck, CircleX, Info, TriangleAlert } from 'lucide-react'

import { cn } from '@nomos/lib/cn'
import { toneClasses, type Tone } from '@nomos/lib/tone'

/** L'icône par défaut d'un ton ; `neutral` et `progress` restent sans icône. */
const defaultIcon: Partial<Record<Tone, ReactNode>> = {
  info: <Info className="size-4" />,
  attention: <CircleAlert className="size-4" />,
  warning: <TriangleAlert className="size-4" />,
  danger: <CircleX className="size-4" />,
  success: <CircleCheck className="size-4" />,
}

type ToastBase = {
  /** Le ton : une intention, pas une couleur (cf. `toneClasses`). Défaut `info`. */
  tone?: Tone
  /** Le message principal : une ligne, jamais une phrase. */
  message: ReactNode
  /** Un détail sous le message, plus discret (sortie de script, cause). */
  description?: ReactNode
  /** Une action : un bouton, un lien. */
  action?: ReactNode
  /** Remplace l'icône par défaut du ton. */
  icon?: ReactNode
  /** Les classes de l'appelant, fusionnées après celles du cœur. */
  className?: string
}

/**
 * Le bouton de fermeture exige son libellé accessible : `onClose` et `closeLabel` vont
 * ensemble, ou pas du tout (le cœur n'a pas d'i18n).
 */
type ToastClose =
  | { onClose?: undefined; closeLabel?: undefined }
  | { onClose: () => void; closeLabel: string }

export type ToastProps = ToastBase & ToastClose

/**
 * La notification : une carte flottante qui dit ce qu'une action a produit. Présentation
 * seule — la **file** et les minuteurs vivent dans `ToastProvider` (ADR 0020). L'app
 * fournit le message, l'action et le libellé de fermeture.
 */
export function Toast({
  tone = 'info',
  message,
  description,
  action,
  icon,
  onClose,
  closeLabel,
  className,
}: ToastProps) {
  return (
    <div
      role="status"
      className={cn(
        'pointer-events-auto flex w-full items-start gap-3 rounded-md border p-3 text-sm shadow-lg',
        toneClasses[tone],
        className,
      )}
    >
      <span aria-hidden className="mt-0.5 shrink-0">
        {icon ?? defaultIcon[tone] ?? null}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-medium">{message}</p>
        {description ? <p className="mt-0.5 text-xs opacity-90">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
      {onClose ? (
        <button
          type="button"
          aria-label={closeLabel}
          onClick={onClose}
          className="-m-1 shrink-0 rounded p-1 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <CircleX className="size-4" aria-hidden />
        </button>
      ) : null}
    </div>
  )
}