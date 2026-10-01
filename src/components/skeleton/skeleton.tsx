import type { ComponentProps } from 'react'

import { cn } from '@nomos/lib/cn'

/** Un bloc de chargement : une surface pulsante qui tient la place d'un contenu. */
export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />
}
