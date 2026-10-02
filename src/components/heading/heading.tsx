import type { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@nomos/lib/cn'

/**
 * La config des variantes est exportée à côté de `headingVariants` : le catalogue la lit
 * pour vérifier que le manifeste ne dérive pas des props réelles (ADR 0005).
 *
 * `level` porte à la fois la balise (`h1`..`h6`) et la taille sémantique : un seul mot dit
 * la hiérarchie, et la taille suit l'échelle des tokens (ADR 0004). Les valeurs sont des
 * chaînes parce que cva indexe ses variantes par nom.
 */
export const headingVariantsConfig = {
  variants: {
    level: {
      '1': 'text-display font-strong',
      '2': 'text-title font-strong',
      '3': 'text-lead font-strong',
      '4': 'text-body font-strong',
      '5': 'text-caption font-strong',
      '6': 'text-micro font-strong',
    },
  },
  defaultVariants: {
    level: '2' as const,
  },
}

export const headingVariants = cva('font-sans text-foreground', headingVariantsConfig)

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> &
  Omit<VariantProps<typeof headingVariants>, 'level'> & {
    /** Le niveau hiérarchique : il choisit la balise `h1`..`h6` et la taille sémantique. */
    level?: HeadingLevel
  }

/**
 * Le titre : la balise suit le niveau (`h1`..`h6`), la taille suit l'échelle sémantique.
 * Présentation seule — le texte vient de l'appelant.
 */
export const Heading = ({ level = 2, className, ...props }: HeadingProps) => {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  const levelKey = String(level) as keyof typeof headingVariantsConfig.variants.level
  return <Tag className={cn(headingVariants({ level: levelKey }), className)} {...props} />
}
