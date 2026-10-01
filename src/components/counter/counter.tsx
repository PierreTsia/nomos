import type { HTMLAttributes } from 'react'

import { cn } from '@nomos/lib/cn'

/**
 * Le compteur (ADR 0015) : un nombre mis en avant, avec un suffixe et un libellé fournis
 * par l'app. Aucun formatage, aucune unité, aucune animation dans le cœur — le formatage
 * appartient à l'app (ADR 0010).
 */
export type CounterProps = HTMLAttributes<HTMLSpanElement> & {
  value: number
  /** L'unité ou le signe qui suit le nombre (`%`, `s`, `pts`), fourni par l'appelant. */
  suffix?: string
  /** Le nom de ce qui est compté. */
  label?: string
}

export function Counter({ value, suffix, label, className, ...props }: CounterProps) {
  return (
    <span className={cn('inline-flex items-baseline gap-1', className)} {...props}>
      <span className="font-mono text-2xl font-semibold tabular-nums">{value}</span>
      {suffix ? <span className="text-sm text-muted-foreground">{suffix}</span> : null}
      {label ? <span className="text-xs text-muted-foreground">{label}</span> : null}
    </span>
  )
}
