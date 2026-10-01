import type { ComponentProps } from 'react'

import { cn } from '@nomos/lib/cn'

/** Le libellé d'un champ : associé au contrôle par `htmlFor`. Tout texte vient de l'app. */
export function Label({ className, ...props }: ComponentProps<'label'>) {
  return <label className={cn('text-sm font-medium leading-none', className)} {...props} />
}
