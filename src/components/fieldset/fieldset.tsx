import type { ComponentProps } from 'react'

import { cn } from '@nomos/lib/cn'

/** Un regroupement de champs apparentés ; l'app fournit le titre (`legend`). */
export function Fieldset({ className, ...props }: ComponentProps<'fieldset'>) {
  return <fieldset className={cn('flex flex-col gap-4', className)} {...props} />
}
