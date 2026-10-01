import type { ReactNode } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@nomos/components/card/card'
import { cn } from '@nomos/lib/cn'

/**
 * L'état vide d'une vue : une carte centrée à montrer quand une donnée manque ou est vide.
 * **Aucun moteur** — l'app fournit l'icône, les textes et l'action (ADR 0015). Le `detail`
 * brut sert à nommer la vraie panne plutôt que de la masquer.
 */
export type EmptyStateProps = {
  /** L'illustration ou l'icône, fournie par l'appelant. */
  icon?: ReactNode
  /** Le titre de l'état : court, jamais une phrase. */
  title: string
  /** Une description d'une phrase, optionnelle. */
  description?: string
  /** Le détail brut (message d'erreur, cause) — affiché tel quel, jamais masqué. */
  detail?: string
  /** Ce qu'on peut faire devant cet état : un bouton, un lien. */
  action?: ReactNode
  /** Passer le détail sur plusieurs lignes plutôt que de le laisser défiler. */
  wrap?: boolean
  /** Les classes de l'appelant, fusionnées après celles du cœur. */
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  detail,
  action,
  wrap = true,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn('mx-auto max-w-xl', className)}>
      <CardHeader>
        {icon ? <div className="mb-2">{icon}</div> : null}
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      {detail ? (
        <CardContent>
          <pre
            className={cn(
              'overflow-x-auto rounded-md bg-muted p-3 text-xs text-muted-foreground',
              wrap && 'whitespace-pre-wrap',
            )}
          >
            {detail}
          </pre>
        </CardContent>
      ) : null}
      {action ? <CardFooter className="gap-2">{action}</CardFooter> : null}
    </Card>
  )
}
