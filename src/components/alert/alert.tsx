import type { ReactNode } from 'react'
import { CircleAlert, CircleCheck, CircleX, Info, LoaderCircle, TriangleAlert } from 'lucide-react'

import { cn } from '@nomos/lib/cn'
import { toneClasses, type Tone } from '@nomos/lib/tone'

/** L'icône par défaut d'un ton ; `neutral` reste sans icône. L'appelant peut la remplacer. */
const defaultIcon: Partial<Record<Tone, ReactNode>> = {
  info: <Info className="size-4" />,
  progress: <LoaderCircle className="size-4" />,
  attention: <CircleAlert className="size-4" />,
  warning: <TriangleAlert className="size-4" />,
  danger: <CircleX className="size-4" />,
  success: <CircleCheck className="size-4" />,
}

type AlertBase = {
  /** Le ton : une intention, pas une couleur (cf. `toneClasses`). Défaut `info`. */
  tone?: Tone
  /** Le titre du bandeau : court, jamais une phrase. */
  title: string
  /** Le contenu détaillé, sous le titre. */
  children?: ReactNode
  /** Ce qu'on peut faire : un bouton, un lien. */
  action?: ReactNode
  /** Remplace l'icône par défaut du ton. */
  icon?: ReactNode
  /** Les classes de l'appelant, fusionnées après celles du cœur. */
  className?: string
}

/**
 * Le bouton de fermeture exige son libellé accessible : `onClose` et `closeLabel` vont
 * ensemble, ou pas du tout (le cœur n'a pas d'i18n, il n'invente aucun texte).
 */
type AlertClose =
  | { onClose?: undefined; closeLabel?: undefined }
  | { onClose: () => void; closeLabel: string }

export type AlertProps = AlertBase & AlertClose

export function Alert({
  tone = 'info',
  title,
  children,
  action,
  icon,
  onClose,
  closeLabel,
  className,
}: AlertProps) {
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cn('flex items-start gap-3 rounded-md border p-4 text-sm', toneClasses[tone], className)}
    >
      <span aria-hidden className="mt-0.5 shrink-0">
        {icon ?? defaultIcon[tone] ?? null}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-medium">{title}</p>
        {children ? <div className="mt-0.5 opacity-90">{children}</div> : null}
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
