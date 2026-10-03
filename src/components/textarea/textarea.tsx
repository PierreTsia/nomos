import type { ComponentProps } from 'react'

import { useFieldControl } from '@nomos/components/field/field'
import { cn } from '@nomos/lib/cn'

/**
 * Un champ de saisie multiligne, stylé par les tokens. Rien d'autre que les props HTML —
 * plus, dans un `Field`, l'association ARIA avec le message d'erreur ou d'aide.
 */
export function Textarea({
  className,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...props
}: ComponentProps<'textarea'>) {
  const field = useFieldControl()
  const describedBy =
    [ariaDescribedBy, field['aria-describedby']].filter(Boolean).join(' ') || undefined

  return (
    <textarea
      aria-invalid={field['aria-invalid'] ?? ariaInvalid}
      aria-describedby={describedBy}
      className={cn(
        'flex min-h-16 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
