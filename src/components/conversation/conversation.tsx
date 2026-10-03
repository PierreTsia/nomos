import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowDown } from 'lucide-react'

import { Button } from '@nomos/components/button/button'
import { cn } from '@nomos/lib/cn'

/**
 * La fenêtre d'une conversation (ADR 0032) : une région `log` vivante, ancrée en bas.
 * Le cœur possède le défilement (rester au bas quand un message arrive, revenir au bas à
 * la demande) ; l'app fournit le contenu et l'état vide. Aucune hauteur propre : l'app la
 * pose par `className`.
 */
export type ConversationProps = {
  /** Les messages, fournis par l'app. */
  children?: ReactNode
  /** Ce qu'on montre tant qu'il n'y a rien, injecté par l'app. */
  empty?: ReactNode
  /** Le nom accessible de la région de conversation. */
  label?: string
  /** Le libellé du bouton « revenir en bas » ; absent, le bouton n'apparaît pas. */
  scrollToBottomLabel?: string
  /** Les classes de l'appelant, fusionnées après celles du cœur. */
  className?: string
}

/** En deçà de cette distance au bas, on considère être « au bas ». */
const AWAY_FROM_BOTTOM = 24

export function Conversation({
  children,
  empty,
  label,
  scrollToBottomLabel,
  className,
}: ConversationProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [atBottom, setAtBottom] = useState(true)

  // Au bas, on suit le dernier message ; si l'utilisateur est remonté, on ne force pas.
  useEffect(() => {
    const el = viewportRef.current
    if (el && atBottom) el.scrollTop = el.scrollHeight
  }, [children, atBottom])

  function handleScroll() {
    const el = viewportRef.current
    if (!el) return
    setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight <= AWAY_FROM_BOTTOM)
  }

  function scrollToBottom() {
    const el = viewportRef.current
    if (el) el.scrollTop = el.scrollHeight
    setAtBottom(true)
  }

  const showEmpty = (children === undefined || children === null) && empty != null

  return (
    <div className={cn('relative min-h-0', className)}>
      <div
        ref={viewportRef}
        role="log"
        aria-label={label}
        onScroll={handleScroll}
        className="h-full overflow-y-auto"
      >
        {showEmpty ? (
          <div className="flex h-full items-center justify-center p-4">{empty}</div>
        ) : (
          children
        )}
      </div>
      {!atBottom && scrollToBottomLabel ? (
        <Button
          type="button"
          size="icon"
          variant="outline"
          aria-label={scrollToBottomLabel}
          onClick={scrollToBottom}
          className="absolute right-3 bottom-3"
        >
          <ArrowDown />
        </Button>
      ) : null}
    </div>
  )
}
