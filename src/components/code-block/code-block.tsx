import type { ReactNode } from 'react'

import { CopyButton } from '@nomos/components/copy-button/copy-button'
import { cn } from '@nomos/lib/cn'

/**
 * Le bloc de code : un `<pre><code>` scrollable, avec un bouton de copie. `code` est
 * le texte brut à copier ; `children` est ce qui s'affiche, ce qui laisse l'app poser
 * sa propre coloration syntaxique. Les libellés sont injectés : le cœur n'a pas d'i18n
 * (ADR 0002).
 */
export type CodeBlockProps = {
  /** Le texte brut à copier. Sert aussi de contenu affiché si `children` est absent. */
  code?: string
  /** Le contenu affiché ; permet à l'app de poser sa propre coloration. Défaut : `code`. */
  children?: ReactNode
  /** Le libellé du bouton de copie, injecté par l'app. */
  copyLabel?: string
  /** Le libellé transitoire après copie, injecté par l'app. */
  copiedLabel?: string
  /** Affiche le bouton de copie. Défaut : true. */
  showCopy?: boolean
  /** Les classes de l'appelant, fusionnées après celles du cœur. */
  className?: string
}

export function CodeBlock({
  code,
  children,
  copyLabel,
  copiedLabel,
  showCopy = true,
  className,
}: CodeBlockProps) {
  const copyValue = code ?? (typeof children === 'string' ? children : '')

  return (
    <div className={cn('relative rounded-md border bg-muted', className)}>
      {showCopy ? (
        <div className="absolute right-2 top-2">
          <CopyButton value={copyValue} label={copyLabel} copiedLabel={copiedLabel} size="sm" />
        </div>
      ) : null}
      <pre className="overflow-x-auto p-4 font-mono text-sm">
        <code>{children ?? code}</code>
      </pre>
    </div>
  )
}
