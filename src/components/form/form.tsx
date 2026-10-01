import type { ComponentProps, ReactNode } from 'react'

import { cn } from '@nomos/lib/cn'

/**
 * Le bloc de mise en page d'un formulaire : une grille de champs et une zone d'actions,
 * dans un `<form>` sémantique. **Aucun moteur** — aucune validation, aucun état, aucun
 * texte : tout vient de l'appelant (ADR 0015). Les champs se groupent avec `Fieldset` et
 * se posent avec `Field` ; les actions sont des nœuds fournis (boutons de l'app).
 */
export type FormProps = ComponentProps<'form'> & {
  /** Deux colonnes de champs à partir du palier `md` ; une seule en dessous. */
  columns?: 1 | 2
  /** La zone d'actions, alignée à droite sous les champs. */
  actions?: ReactNode
}

export function Form({ columns = 1, actions, children, className, ...props }: FormProps) {
  return (
    <form className={cn('flex flex-col gap-6', className)} {...props}>
      <div className={cn('grid gap-4', columns === 2 && 'md:grid-cols-2')}>{children}</div>
      {actions ? <div className="flex items-center justify-end gap-2">{actions}</div> : null}
    </form>
  )
}
