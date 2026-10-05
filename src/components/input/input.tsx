import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { useFieldControl } from '@nomos/components/field/field'
import { cn } from '@nomos/lib/cn'

/**
 * La config des variantes est exportée à côté de `inputVariants` : le catalogue la lit
 * pour vérifier que le manifeste ne dérive pas des props réelles (ADR 0005). Les hauteurs
 * suivent l'échelle `--spacing`, que la densité multiplie (ADR 0008) : aucune hauteur
 * figée en dur.
 */
export const inputVariantsConfig = {
  variants: {
    size: {
      sm: 'h-9 px-2.5 py-1.5 text-caption',
      md: 'h-10 px-3 py-2 text-base md:text-sm',
      lg: 'h-11 px-4 py-2 text-body',
    },
    variant: {
      default: '',
      flush:
        'border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0',
    },
    icon: {
      none: '',
      leading: 'pl-9',
    },
  },
  defaultVariants: {
    size: 'md' as const,
    variant: 'default' as const,
    icon: 'none' as const,
  },
}

export const inputVariants = cva(
  'flex w-full rounded-md border border-input bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  inputVariantsConfig,
)

export type InputProps = Omit<ComponentProps<'input'>, 'size'> &
  VariantProps<typeof inputVariants>

/**
 * Le champ de saisie du cœur : un `<input>` stylé par les tokens. Il n'impose aucune
 * validation ni aucun état d'app — l'appelant passe ses props HTML et ses classes.
 * Dans un `Field`, il exprime l'erreur (`aria-invalid`, `aria-describedby`).
 */
export function Input({
  className,
  type,
  size,
  variant,
  icon,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...props
}: InputProps) {
  const field = useFieldControl()
  const describedBy =
    [ariaDescribedBy, field['aria-describedby']].filter(Boolean).join(' ') || undefined

  return (
    <input
      type={type}
      aria-invalid={field['aria-invalid'] ?? ariaInvalid}
      aria-describedby={describedBy}
      className={cn(inputVariants({ size, variant, icon }), className)}
      {...props}
    />
  )
}
