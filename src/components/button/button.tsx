import type { ComponentProps } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@nomos/lib/cn'

/**
 * Le bouton du cœur. La config des variantes est exportée à côté de `buttonVariants`,
 * comme celle du Badge : le catalogue la lit pour vérifier que le manifeste ne dérive
 * pas des props réelles (ADR 0005).
 */
export const buttonVariantsConfig = {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
    },
    size: {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
      touch: 'h-12 px-6',
      icon: 'h-10 w-10',
      'icon-lg': 'h-12 w-12',
    },
    shape: {
      default: '',
      pill: 'rounded-full',
    },
  },
  defaultVariants: {
    variant: 'default' as const,
    size: 'default' as const,
    shape: 'default' as const,
  },
}

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  buttonVariantsConfig,
)

export type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    /** Rend le style sur l'enfant au lieu d'un `<button>` (Radix `Slot`). */
    asChild?: boolean
  }

export function Button({ className, variant, size, shape, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size, shape, className }))} {...props} />
}
