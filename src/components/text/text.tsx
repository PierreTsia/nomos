import type { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@nomos/lib/cn'

/**
 * La config des variantes est exportée à côté de `textVariants` : le catalogue la lit pour
 * vérifier que le manifeste ne dérive pas des props réelles (ADR 0005).
 *
 * `size` lit l'échelle typographique sémantique (ADR 0004) : `text-body`, `text-lead`…
 * portent la taille **et** l'interligne des tokens.
 */
export const textVariantsConfig = {
  variants: {
    size: {
      lead: 'text-lead',
      body: 'text-body',
      caption: 'text-caption',
      micro: 'text-micro',
    },
  },
  defaultVariants: {
    size: 'body' as const,
  },
}

export const textVariants = cva('font-sans text-foreground', textVariantsConfig)

export type TextProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof textVariants> & {
    /** L'élément rendu : un paragraphe par défaut, un `span` pour un texte inline. */
    as?: 'p' | 'span'
  }

/**
 * Le texte courant : un paragraphe ou un `span`, à la taille sémantique choisie.
 * Présentation seule — le contenu vient de l'appelant.
 */
export const Text = ({ size, as: Tag = 'p', className, ...props }: TextProps) => (
  <Tag className={cn(textVariants({ size }), className)} {...props} />
)
