import { createContext, useContext, useId, type ReactNode } from 'react'

import { Label } from '@nomos/components/label/label'
import { cn } from '@nomos/lib/cn'

/**
 * Les attributs que `Field` pose sur son contrôle : `aria-describedby` vers l'aide ou
 * l'erreur, `aria-invalid` en erreur. Le contrôle les consomme : la valeur du `Field`
 * l'emporte sur celle de l'appelant pour `aria-invalid`, et l'appelant garde son propre
 * `aria-describedby`, tenu à côté de celui du `Field`.
 */
export type FieldControlAria = {
  'aria-describedby'?: string
  'aria-invalid'?: boolean
}

const EMPTY: FieldControlAria = {}

const FieldContext = createContext<FieldControlAria>(EMPTY)

/**
 * Ce que le contrôle d'un `Field` reçoit : vide hors d'un `Field`, donc un contrôle
 * reste testable seul, sans provider (ADR 0015).
 */
export function useFieldControl(): FieldControlAria {
  return useContext(FieldContext)
}

/**
 * L'emplacement d'un champ : le libellé, le contrôle (fourni par l'appelant) et, dessous,
 * soit le message d'erreur, soit l'aide. **Aucun moteur** : l'app décide de l'état, de la
 * validation et du texte (ADR 0015). Le cœur ne fait que disposer — mais il porte
 * l'association ARIA entre le contrôle et son message.
 */
export type FieldProps = {
  label?: ReactNode
  hint?: ReactNode
  error?: string | null
  htmlFor?: string
  className?: string
  children: ReactNode
}

export function Field({ label, hint, error, htmlFor, className, children }: FieldProps) {
  const baseId = useId()
  const errorId = `${baseId}-error`
  const hintId = `${baseId}-hint`

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label ? <Label htmlFor={htmlFor}>{label}</Label> : null}
      <FieldContext.Provider
        value={{
          'aria-describedby': error ? errorId : hint ? hintId : undefined,
          'aria-invalid': error ? true : undefined,
        }}
      >
        {children}
      </FieldContext.Provider>
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
