import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import { Toast } from '@nomos/components/toast/toast'
import type { Tone } from '@nomos/lib/tone'

/**
 * La file de notifications (ADR 0020) : `ToastProvider` possède l'état (la file, les
 * minuteurs d'auto-fermeture) et `useToast` l'expose. La **présentation** est le `Toast`
 * du catalogue ; le cœur fournit la file, l'app le contenu. Aucune dépendance externe.
 */
export type ToastOptions = {
  tone?: Tone
  message: ReactNode
  description?: ReactNode
  action?: ReactNode
  /** Ne pas fermer automatiquement. */
  persistent?: boolean
  /** La durée avant auto-fermeture (ms), sinon celle du provider. */
  duration?: number
}

type ToastItem = ToastOptions & { id: string }

export type ToastApi = {
  /** Affiche une notification et rend son identifiant. */
  show: (options: ToastOptions) => string
  /** Met à jour une notification existante (même identifiant). */
  update: (id: string, options: Partial<ToastOptions>) => void
  /** Ferme une notification. */
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastApi | null>(null)

export function useToast(): ToastApi {
  const api = useContext(ToastContext)
  if (!api) throw new Error('useToast must be used under <ToastProvider>.')
  return api
}

const DEFAULT_DURATION = 4000

export function ToastProvider({
  children,
  closeLabel,
  duration = DEFAULT_DURATION,
}: {
  children: ReactNode
  /** Le libellé accessible du bouton de fermeture ; absent, pas de bouton (auto-fermeture). */
  closeLabel?: string
  /** La durée d'auto-fermeture par défaut (ms). */
  duration?: number
}) {
  const [items, setItems] = useState<ToastItem[]>([])
  const idRef = useRef(0)
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>())

  const clearTimer = useCallback((id: string) => {
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const dismiss = useCallback(
    (id: string) => {
      clearTimer(id)
      setItems((previous) => previous.filter((item) => item.id !== id))
    },
    [clearTimer],
  )

  const show = useCallback((options: ToastOptions) => {
    const id = `toast-${++idRef.current}`
    setItems((previous) => [...previous, { ...options, id }])
    return id
  }, [])

  const update = useCallback((id: string, options: Partial<ToastOptions>) => {
    setItems((previous) =>
      previous.map((item) => (item.id === id ? { ...item, ...options } : item)),
    )
  }, [])

  // Arme un minuteur par notification non persistante ; nettoie celles qui ont disparu.
  useEffect(() => {
    for (const item of items) {
      if (item.persistent) {
        clearTimer(item.id)
        continue
      }
      if (!timers.current.has(item.id)) {
        timers.current.set(
          item.id,
          setTimeout(() => dismiss(item.id), item.duration ?? duration),
        )
      }
    }
    for (const [id, timer] of timers.current) {
      if (!items.some((item) => item.id === id)) {
        clearTimeout(timer)
        timers.current.delete(id)
      }
    }
  }, [items, duration, dismiss, clearTimer])

  useEffect(() => {
    const armed = timers.current
    return () => {
      for (const timer of armed.values()) clearTimeout(timer)
      armed.clear()
    }
  }, [])

  const api = useMemo<ToastApi>(() => ({ show, update, dismiss }), [show, update, dismiss])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-toast flex flex-col items-center gap-2 p-4 sm:items-end"
      >
        {items.map((item) => {
          const common = {
            tone: item.tone,
            message: item.message,
            description: item.description,
            action: item.action,
          }
          return (
            <div
              key={item.id}
              className="pointer-events-auto w-full max-w-sm"
              onMouseEnter={() => clearTimer(item.id)}
              onMouseLeave={() => {
                if (!item.persistent && !timers.current.has(item.id)) {
                  timers.current.set(
                    item.id,
                    setTimeout(() => dismiss(item.id), item.duration ?? duration),
                  )
                }
              }}
            >
              {closeLabel ? (
                <Toast {...common} onClose={() => dismiss(item.id)} closeLabel={closeLabel} />
              ) : (
                <Toast {...common} />
              )}
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}