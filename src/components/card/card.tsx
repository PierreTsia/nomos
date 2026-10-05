import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@nomos/lib/cn'

/**
 * La carte : une surface qui regroupe un contenu apparenté — un en-tête (titre +
 * description), un corps, un pied. En parts importables séparément ; aucune part ne
 * nomme un produit, les textes viennent de l'appelant.
 *
 * Le padding et le gap des parts passent par deux variables posées sur la coquille
 * (`--nomos-card-pad`, `--nomos-card-gap`, défaut sur `:root` dans `theme.css`) : une
 * variante change la respiration de toute la carte sans que l'appelant n'écrive `p-*`/`gap-*`,
 * et sans valeur figée (ADR 0008 — la densité multiplie `--spacing`).
 */
export const cardVariantsConfig = {
  variants: {
    padding: {
      default: '[--nomos-card-pad:calc(var(--spacing)*6)]',
      compact: '[--nomos-card-pad:calc(var(--spacing)*4)]',
      flush: '[--nomos-card-pad:0px]',
    },
    gap: {
      default: '[--nomos-card-gap:0px]',
      comfy: '[--nomos-card-gap:calc(var(--spacing)*4)]',
    },
    variant: {
      default: '',
      muted: 'border-border/50',
    },
  },
  defaultVariants: {
    padding: 'default' as const,
    gap: 'default' as const,
    variant: 'default' as const,
  },
}

export const cardVariants = cva(
  'flex flex-col gap-(--nomos-card-gap) rounded-lg border bg-card text-card-foreground shadow-sm',
  cardVariantsConfig,
)

export type CardProps = ComponentProps<'div'> & VariantProps<typeof cardVariants>

export function Card({ className, padding, gap, variant, ...props }: CardProps) {
  return <div className={cn(cardVariants({ padding, gap, variant }), className)} {...props} />
}

export function CardHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-1.5 p-(--nomos-card-pad)', className)} {...props} />
}

export function CardTitle({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
}

export function CardDescription({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('text-sm text-muted-foreground', className)} {...props} />
}

export function CardContent({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('p-(--nomos-card-pad) pt-0', className)} {...props} />
}

export function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex items-center p-(--nomos-card-pad) pt-0', className)} {...props} />
}
