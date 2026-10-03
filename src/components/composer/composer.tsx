import { useEffect, useRef, type KeyboardEvent } from 'react'
import { ArrowUp, Square } from 'lucide-react'

import { Button } from '@nomos/components/button/button'
import { Textarea } from '@nomos/components/textarea/textarea'
import { cn } from '@nomos/lib/cn'

/**
 * Le composeur d'un message (ADR 0032) : une zone de saisie qui grandit, `Entrée` envoie,
 * `Maj+Entrée` passe à la ligne, et la garde IME protège les compositions en cours. Le
 * cœur est **piloté par props** (valeur + `onChange`), comme un contrôle de formulaire : il
 * ne possède aucun état (ADR 0015). Les libellés viennent de l'app.
 */
export type ComposerProps = {
  /** La valeur courante, possédée par l'app. */
  value: string
  /** Appelé à chaque frappe avec la nouvelle valeur. */
  onChange?: (value: string) => void
  /** Appelé sur `Entrée` ou au clic sur l'action d'envoi. */
  onSubmit?: () => void
  /** Appelé au clic sur l'action d'arrêt, quand une réponse est en cours. */
  onStop?: () => void
  /** Une réponse est en cours : l'action devient « arrêter ». */
  busy?: boolean
  /** Le texte indicatif de la zone de saisie. */
  placeholder: string
  /** Le libellé accessible de l'action d'envoi. */
  sendLabel: string
  /** Le libellé accessible de l'action d'arrêt. */
  stopLabel: string
  /** Les classes de l'appelant, fusionnées après celles du cœur. */
  className?: string
}

export function Composer({
  value,
  onChange,
  onSubmit,
  onStop,
  busy = false,
  placeholder,
  sendLabel,
  stopLabel,
  className,
}: ComposerProps) {
  const ref = useRef<HTMLTextAreaElement>(null)

  // La zone grandit avec le texte ; le plafond est porté par `max-h-40` (échelle de densité).
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      if (!busy) onSubmit?.()
    }
  }

  return (
    <div className={cn('flex items-end gap-2', className)}>
      <Textarea
        ref={ref}
        rows={1}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.target.value)}
        onKeyDown={handleKeyDown}
        className="max-h-40 min-h-10 resize-none overflow-y-auto"
      />
      {busy ? (
        <Button type="button" size="icon" variant="outline" aria-label={stopLabel} onClick={onStop}>
          <Square />
        </Button>
      ) : (
        <Button
          type="button"
          size="icon"
          aria-label={sendLabel}
          onClick={onSubmit}
          disabled={value.trim() === ''}
        >
          <ArrowUp />
        </Button>
      )}
    </div>
  )
}
