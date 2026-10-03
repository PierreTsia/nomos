import type { ComponentProps } from 'react'

import { useFieldControl } from '@nomos/components/field/field'
import { cn } from '@nomos/lib/cn'

/**
 * Le champ de saisie du cœur : un `<input>` stylé par les tokens. Il n'impose aucune
 * validation ni aucun état d'app — l'appelant passe ses props HTML et ses classes.
 * Dans un `Field`, il exprime l'erreur (`aria-invalid`, `aria-describedby`).
 */
export function Input({
  className,
  type,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...props
}: ComponentProps<'input'>) {
  const field = useFieldControl()
  const describedBy =
    [ariaDescribedBy, field['aria-describedby']].filter(Boolean).join(' ') || undefined

  return (
    <input
      type={type}
      aria-invalid={field['aria-invalid'] ?? ariaInvalid}
      aria-describedby={describedBy}
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className,
      )}
      {...props}
    />
  )
}
