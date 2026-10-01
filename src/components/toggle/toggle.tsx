import type { ComponentProps } from 'react'
import * as TogglePrimitive from '@radix-ui/react-toggle'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@nomos/lib/cn'

/**
 * Le bouton à deux états : pressé ou non. Un `Switch` dit un réglage qui persiste ; un
 * `Toggle` est une bascule ponctuelle (mode d'affichage, filtre). Contrôlé par props —
 * `pressed` + `onPressedChange` — ou laissé libre via `defaultPressed` (ADR 0015).
 */
export const toggleVariantsConfig = {
  variants: {
    variant: {
      default: 'bg-transparent',
      outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
    },
    size: {
      default: 'h-10 px-3 min-w-10',
      sm: 'h-9 px-2.5 min-w-9',
      lg: 'h-11 px-5 min-w-11',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
} as const

export const toggleVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  toggleVariantsConfig,
)

export type ToggleProps = ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>

export function Toggle({ className, variant, size, ...props }: ToggleProps) {
  return (
    <TogglePrimitive.Root className={cn(toggleVariants({ variant, size }), className)} {...props} />
  )
}
