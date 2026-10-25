import { useState, type ImgHTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@nomos/lib/cn'

/**
 * La config des variantes est exportée à côté de `avatarVariants` : le catalogue la lit
 * pour vérifier que le manifeste ne dérive pas des props réelles (ADR 0005). cva ne
 * porte pas la config sur la fonction qu'il rend, donc on l'écrit ici, une fois.
 */
export const avatarVariantsConfig = {
  variants: {
    size: {
      sm: 'size-8 text-micro',
      default: 'size-10 text-xs',
      lg: 'size-12 text-sm',
    },
  },
  defaultVariants: {
    size: 'default' as const,
  },
}

export const avatarVariants = cva(
  'flex shrink-0 overflow-hidden rounded-full bg-muted font-medium text-muted-foreground',
  avatarVariantsConfig,
)

export type AvatarProps = VariantProps<typeof avatarVariants> & {
  /** L'URL de l'image ; absente, le repli s'affiche directement. */
  src?: string
  /** Le texte alternatif : il nomme la personne (l'app le fournit, le cœur n'a pas d'i18n). */
  alt: string
  /** Le repli quand il n'y a pas d'image, ou qu'elle échoue : des initiales, une icône. */
  fallback: ReactNode
  /** Les classes de l'appelant, fusionnées après celles du cœur. */
  className?: string
  /** Des attributs natifs `<img>` transmis à l'image interne (`referrerPolicy`, `loading`, …). */
  imgProps?: ImgHTMLAttributes<HTMLImageElement>
}

/**
 * L'avatar : une image ronde, avec un repli quand elle manque ou échoue. Le natif suffit
 * (`<img>` + `onError`) — aucune dépendance, pas de Radix (ADR 0002, 0019). Le repli et
 * le texte alternatif viennent de l'app.
 */
export function Avatar({ src, alt, fallback, className, imgProps, size }: AvatarProps) {
  const [failed, setFailed] = useState(false)
  const showImage = Boolean(src) && !failed
  const { className: imgClassName, ...restImgProps } = imgProps ?? {}

  return (
    <span className={cn(avatarVariants({ size }), className)}>
      {showImage ? (
        <img
          {...restImgProps}
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className={cn('aspect-square size-full object-cover', imgClassName)}
        />
      ) : (
        <span role="img" aria-label={alt} className="flex size-full items-center justify-center">
          {fallback}
        </span>
      )}
    </span>
  )
}
