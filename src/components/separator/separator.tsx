import type { ComponentProps } from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'

import { cn } from '@nomos/lib/cn'

/**
 * Un séparateur : un trait de bordure qui sépare deux contenus, horizontal ou vertical.
 * Décoratif par défaut (Radix), donc invisible aux lecteurs d'écran sauf demande.
 */
export function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
      {...props}
    />
  )
}
