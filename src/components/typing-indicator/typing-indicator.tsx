import { cn } from '@nomos/lib/cn'

/**
 * L'indicateur de frappe : trois points qui attendent la réponse de l'assistant. Le
 * libellé est injecté (l'app le traduit) et porté par une région `status` vivante — le
 * cœur n'invente aucun mot (ADR 0015, 0032).
 */
export type TypingIndicatorProps = {
  /** Le texte accessible annoncé par le lecteur d'écran. */
  label: string
  /** Les classes de l'appelant, fusionnées après celles du cœur. */
  className?: string
}

const DELAYS = ['[animation-delay:0ms]', '[animation-delay:150ms]', '[animation-delay:300ms]']

export function TypingIndicator({ label, className }: TypingIndicatorProps) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={cn('inline-flex items-center', className)}
    >
      <span aria-hidden="true" className="flex items-end gap-1">
        {DELAYS.map((delay) => (
          <span
            key={delay}
            className={cn('size-1.5 animate-bounce rounded-sm bg-muted-foreground', delay)}
          />
        ))}
      </span>
      <span className="sr-only">{label}</span>
    </span>
  )
}
