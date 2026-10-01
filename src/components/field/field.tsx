import type { ReactNode } from 'react'

import { Label } from '@nomos/components/label/label'
import { cn } from '@nomos/lib/cn'

/**
 * L'emplacement d'un champ : le libellé, le contrôle (fourni par l'appelant) et, dessous,
 * soit le message d'erreur, soit l'aide. **Aucun moteur** : l'app décide de l'état, de la
 * validation et du texte (ADR 0015). Le cœur ne fait que disposer.
 */
export type FieldProps = {
  label?: ReactNode
  hint?: ReactNode
  error?: string | null
  htmlFor?: string
  className?: string
  children: ReactNode
}

export function Field({ label, hint, error, htmlFor, className, children }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label ? <Label htmlFor={htmlFor}>{label}</Label> : null}
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}
