import type { ComponentProps } from 'react'
import { Slot } from '@radix-ui/react-slot'

import { cn } from '@nomos/lib/cn'

/**
 * Le lien texte du cœur. Il rend un `<a>` — pas un `<button>` comme `Button variant="link"`.
 * `href` et le libellé sont injectés : le cœur ne connaît aucun routing (ADR 0002).
 */
export type LinkProps = ComponentProps<'a'> & {
  /** Rend le style sur l'enfant au lieu d'un `<a>` (Radix `Slot`). */
  asChild?: boolean
}

export function Link({ className, asChild = false, ...props }: LinkProps) {
  const Comp = asChild ? Slot : 'a'
  return (
    <Comp
      className={cn(
        'text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
      {...props}
    />
  )
}
