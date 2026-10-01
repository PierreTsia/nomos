import { useState, type ReactNode } from 'react'

import { cn } from '@nomos/lib/cn'

export type AvatarProps = {
  /** L'URL de l'image ; absente, le repli s'affiche directement. */
  src?: string
  /** Le texte alternatif : il nomme la personne (l'app le fournit, le cœur n'a pas d'i18n). */
  alt: string
  /** Le repli quand il n'y a pas d'image, ou qu'elle échoue : des initiales, une icône. */
  fallback: ReactNode
  /** Les classes de l'appelant, fusionnées après celles du cœur. */
  className?: string
}

/**
 * L'avatar : une image ronde, avec un repli quand elle manque ou échoue. Le natif suffit
 * (`<img>` + `onError`) — aucune dépendance, pas de Radix (ADR 0002, 0019). Le repli et
 * le texte alternatif viennent de l'app.
 */
export function Avatar({ src, alt, fallback, className }: AvatarProps) {
  const [failed, setFailed] = useState(false)
  const showImage = Boolean(src) && !failed

  return (
    <span
      className={cn(
        'flex size-10 shrink-0 overflow-hidden rounded-full bg-muted text-xs font-medium text-muted-foreground',
        className,
      )}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className="aspect-square size-full object-cover"
        />
      ) : (
        <span role="img" aria-label={alt} className="flex size-full items-center justify-center">
          {fallback}
        </span>
      )}
    </span>
  )
}
