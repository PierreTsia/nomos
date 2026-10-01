import type { ReactNode } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

import { buttonVariants } from '@nomos/components/button/button'
import { cn } from '@nomos/lib/cn'

/**
 * La modale centrée : un déclencheur, un voile, une surface qui porte un titre, une
 * description, un corps et un pied. Le cœur ne fournit **aucun texte** : le libellé du
 * déclencheur, de la fermeture et des actions viennent de l'app. La couche flottante
 * (empilement, voile, mouvement) vient des tokens (ADR 0027), jamais d'une valeur en dur.
 */
export type DialogProps = {
  /** Le contenu du déclencheur : un mot ou un court libellé, pas une phrase. */
  trigger: ReactNode
  /** Le titre de la modale ; il nomme l'action ou la décision. */
  title: string
  /** Un sous-titre qui explique le titre, sous celui-ci. */
  description?: ReactNode
  /** Le corps de la modale : le formulaire, le contenu à décider. */
  body?: ReactNode
  /** Les actions, alignées à droite sur grand écran. */
  footer?: ReactNode
  /** Le libellé accessible du bouton de fermeture (le cœur n'a pas d'i18n). */
  closeLabel: string
  /** Contrôlé : l'état d'ouverture vit dans l'app. */
  open?: boolean
  /** Non contrôlé : l'état d'ouverture vit dans le composant. */
  defaultOpen?: boolean
  /** Rappelé quand l'utilisateur demande à ouvrir ou fermer. */
  onOpenChange?: (open: boolean) => void
  /** Les classes de l'appelant, fusionnées après celles du cœur. */
  className?: string
}

export function Dialog({
  trigger,
  title,
  description,
  body,
  footer,
  closeLabel,
  open,
  defaultOpen,
  onOpenChange,
  className,
}: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <DialogPrimitive.Trigger
        className={cn(buttonVariants({ variant: 'outline' }))}
      >
        {trigger}
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-overlay bg-scrim data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out" />
        <DialogPrimitive.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-overlay flex w-full max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-lg border bg-background p-6 text-foreground shadow-lg data-[state=open]:animate-content-in data-[state=closed]:animate-content-out',
            className,
          )}
        >
          <div className="flex flex-col gap-1.5">
            <DialogPrimitive.Title className="text-lg font-semibold">{title}</DialogPrimitive.Title>
            {description ? (
              <DialogPrimitive.Description className="text-sm text-muted-foreground">
                {description}
              </DialogPrimitive.Description>
            ) : null}
          </div>
          {body ? <div className="text-sm">{body}</div> : null}
          {footer ? (
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">{footer}</div>
          ) : null}
          <DialogPrimitive.Close
            aria-label={closeLabel}
            className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="size-4" aria-hidden />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
