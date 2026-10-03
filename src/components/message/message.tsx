import { Fragment, type ReactNode } from 'react'

import { cn } from '@nomos/lib/cn'
import { toneClasses, type Tone } from '@nomos/lib/tone'
import type { ChatPart, ChatRole } from '@nomos/features/chat/types'

/**
 * Un message d'une conversation (ADR 0032) : un rôle, une suite ordonnée de **parts**, et
 * des emplacements injectés (avatar, actions, horodatage). Le placement (aligné à droite
 * pour l'utilisateur, à gauche sinon) et le ton viennent du cœur ; le **contenu** vient
 * de l'app, part par part. `renderPart` prime sur le rendu par défaut : markdown,
 * coloration, artefact métier restent côté app (ADR 0002).
 */
export type MessageProps = {
  /** Qui parle : décide de l'alignement et du ton. */
  role: ChatRole
  /** Les fragments de contenu, dans l'ordre. */
  parts: ChatPart[]
  /** Le rendu d'une part, fourni par l'app ; absent, le cœur rend un défaut neutre. */
  renderPart?: (part: ChatPart) => ReactNode
  /** L'avatar, injecté par l'app. */
  avatar?: ReactNode
  /** Les actions du message (copier, réessayer), injectées par l'app. */
  actions?: ReactNode
  /** L'horodatage déjà formaté, injecté par l'app. */
  timestamp?: ReactNode
  /** Les classes de l'appelant, fusionnées après celles du cœur. */
  className?: string
}

/** Le ton d'une part d'outil, par état — une intention, pas une couleur (ADR 0004). */
const TOOL_STATE_TONE: Record<'pending' | 'running' | 'success' | 'error', Tone> = {
  pending: 'neutral',
  running: 'progress',
  success: 'success',
  error: 'danger',
}

function DefaultPart({ part }: { part: ChatPart }) {
  switch (part.type) {
    case 'text':
      return (
        <p data-part="text" className="whitespace-pre-wrap text-body">
          {part.text}
        </p>
      )
    case 'reasoning':
      return (
        <p
          data-part="reasoning"
          className="whitespace-pre-wrap text-caption italic text-muted-foreground"
        >
          {part.text}
        </p>
      )
    case 'tool':
      return (
        <span
          data-part="tool"
          data-tool-state={part.state}
          className={cn(
            'inline-flex w-fit items-center rounded-sm border px-2 py-0.5 text-micro font-medium',
            toneClasses[TOOL_STATE_TONE[part.state]],
          )}
        >
          {part.label ?? part.name}
        </span>
      )
    case 'data':
      return (
        <pre
          data-part="data"
          className="overflow-x-auto rounded-md bg-background/40 p-2 text-micro text-muted-foreground"
        >
          {JSON.stringify(part.payload, null, 2)}
        </pre>
      )
  }
}

export function Message({
  role,
  parts,
  renderPart,
  avatar,
  actions,
  timestamp,
  className,
}: MessageProps) {
  const isUser = role === 'user'
  return (
    <div
      data-role={role}
      className={cn('flex w-full items-start gap-2', isUser ? 'flex-row-reverse' : 'flex-row', className)}
    >
      {avatar ? <div className="shrink-0">{avatar}</div> : null}
      <div
        className={cn(
          'flex min-w-0 max-w-[85%] flex-col gap-1',
          isUser ? 'items-end' : 'items-start',
        )}
      >
        <div
          className={cn(
            'flex w-full flex-col gap-1 rounded-lg px-3 py-2',
            isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground',
          )}
        >
          {parts.map((part, index) => (
            <Fragment key={index}>{renderPart ? renderPart(part) : <DefaultPart part={part} />}</Fragment>
          ))}
        </div>
        {actions || timestamp ? (
          <div className="flex items-center gap-2 px-1 text-micro text-muted-foreground">
            {timestamp}
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  )
}
