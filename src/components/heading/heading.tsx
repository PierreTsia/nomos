import type { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@nomos/lib/cn'

/**
 * La config des variantes est exportée à côté de `headingVariants` : le catalogue la lit
 * pour vérifier que le manifeste ne dérive pas des props réelles (ADR 0005).
 *
 * `level` porte la balise (`h1`..`h6`) et la taille sémantique par défaut : un seul mot dit
 * la hiérarchie, et la taille suit l'échelle des tokens (ADR 0004). `size` la découple quand
 * la structure du document et la taille visuelle divergent (un `h2` rendu petit) ; `weight`
 * lit l'échelle des poids des tokens. Les valeurs sont des chaînes parce que cva indexe ses
 * variantes par nom.
 */
export const headingVariantsConfig = {
  variants: {
    level: {
      '1': 'text-display',
      '2': 'text-title',
      '3': 'text-lead',
      '4': 'text-body',
      '5': 'text-caption',
      '6': 'text-micro',
    },
    size: {
      micro: 'text-micro',
      caption: 'text-caption',
      body: 'text-body',
      lead: 'text-lead',
      title: 'text-title',
      display: 'text-display',
    },
    weight: {
      regular: 'font-regular',
      medium: 'font-medium',
      strong: 'font-strong',
    },
    tone: {
      default: '',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      danger: 'text-destructive',
    },
  },
  defaultVariants: {
    level: '2' as const,
    weight: 'strong' as const,
    tone: 'default' as const,
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
export const Heading = ({ level = 2, size, weight, tone, className, ...props }: HeadingProps) => {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  const levelKey = String(level) as keyof typeof headingVariantsConfig.variants.level
  return (
    <Tag className={cn(headingVariants({ level: levelKey, size, weight, tone }), className)} {...props} />
  )
}
