import { useRef, type KeyboardEvent } from 'react'
import { Star } from 'lucide-react'

import { cn } from '@nomos/lib/cn'

/**
 * La note (ADR 0015) : `value` sur `max` étoiles, **contrôlée**. Interactive seulement si
 * l'app fournit `onValueChange` (sinon un affichage, `role="img"`). A11y : `radiogroup` de
 * `radio`, flèches et Home/End. Aucun libellé n'est inventé : le nom accessible vient de
 * l'appelant.
 */
export type RatingProps = {
  value: number
  /** Le nombre d'étoiles : 5 par défaut. */
  max?: number
  /** Rend la note interactive quand fourni ; l'app porte la valeur. */
  onValueChange?: (value: number) => void
  /** Affichage seul, même si `onValueChange` est fourni. */
  readOnly?: boolean
  /** Le nom accessible du groupe ; le cœur n'a pas d'i18n. */
  ariaLabel?: string
  className?: string
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function Rating({
  value,
  max = 5,
  onValueChange,
  readOnly = false,
  ariaLabel,
  className,
}: RatingProps) {
  const count = Math.max(0, Math.floor(max))
  const stars = Array.from({ length: count }, (_, index) => index + 1)
  const interactive = !readOnly && Boolean(onValueChange)
  const buttons = useRef(new Map<number, HTMLButtonElement>())

  const fill = (star: number) => (star <= value ? 'fill-current text-primary' : 'text-muted-foreground')

  if (!interactive) {
    return (
      <span
        role="img"
        aria-label={ariaLabel}
        className={cn('inline-flex items-center gap-0.5', className)}
      >
        {stars.map((star) => (
          <Star key={star} aria-hidden className={cn('size-4', fill(star))} />
        ))}
      </span>
    )
  }

  function select(next: number) {
    const chosen = clamp(next, 1, count)
    onValueChange?.(chosen)
    buttons.current.get(chosen)?.focus()
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault()
        select((value || 0) + 1)
        break
      case 'ArrowLeft':
      case 'ArrowDown':
        event.preventDefault()
        select((value || 1) - 1)
        break
      case 'Home':
        event.preventDefault()
        select(1)
        break
      case 'End':
        event.preventDefault()
        select(count)
        break
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      className={cn('inline-flex items-center gap-0.5', className)}
    >
      {stars.map((star) => (
        <button
          key={star}
          ref={(element) => {
            if (element) buttons.current.set(star, element)
            else buttons.current.delete(star)
          }}
          type="button"
          role="radio"
          aria-checked={star === value}
          aria-label={String(star)}
          tabIndex={star === (value || 1) ? 0 : -1}
          onClick={() => select(star)}
          className="rounded p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Star aria-hidden className={cn('size-4', fill(star))} />
        </button>
      ))}
    </div>
  )
}
