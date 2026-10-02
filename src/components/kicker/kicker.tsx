import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@nomos/lib/cn'
import type { Tone } from '@nomos/lib/tone'

/**
 * La couleur du point par ton. Le ton est une **intention**, pas une couleur : chaque
 * entrée lit un token sémantique du cœur (ADR 0004). Le `Record<Tone, string>` force
 * l'exhaustivité — un ton ajouté au vocabulaire fait rougir le typecheck.
 */
const kickerToneClasses: Record<Tone, string> = {
  neutral: '[--kicker-dot:var(--color-muted-foreground)]',
  info: '[--kicker-dot:var(--color-status-info)]',
  progress: '[--kicker-dot:var(--color-status-progress)]',
  attention: '[--kicker-dot:var(--color-status-attention)]',
  warning: '[--kicker-dot:var(--color-status-warning)]',
  danger: '[--kicker-dot:var(--color-status-danger)]',
  success: '[--kicker-dot:var(--color-status-success)]',
}

/**
 * La config des variantes est exportée à côté de `kickerVariants` : le catalogue la lit
 * pour vérifier que le manifeste ne dérive pas des props réelles (ADR 0005). Le ton pose
 * la couleur du point dans une variable, que le point lit — le libellé reste discret.
 */
export const kickerVariantsConfig = {
  variants: {
    tone: kickerToneClasses,
  },
  defaultVariants: {
    tone: 'neutral' as const,
  },
}

export const kickerVariants = cva(
  'inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground',
  kickerVariantsConfig,
)

export type KickerProps = VariantProps<typeof kickerVariants> & {
  /** Le libellé d'accroche : court, jamais une phrase. */
  children: ReactNode
  /** Affiche un point de ton devant le libellé. */
  dot?: boolean
  /** Les classes de l'appelant, fusionnées après celles du cœur. */
  className?: string
}

/**
 * Le kicker : une étiquette d'accroche, répétée au-dessus d'un titre. Présentation seule —
 * le texte est injecté par l'appelant (le cœur n'a pas d'i18n), le ton est une intention.
 */
export function Kicker({ tone, dot = false, children, className }: KickerProps) {
  return (
    <span className={cn(kickerVariants({ tone }), className)}>
      {dot ? (
        <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-[var(--kicker-dot)]" />
      ) : null}
      {children}
    </span>
  )
}
