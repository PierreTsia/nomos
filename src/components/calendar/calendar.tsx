import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@nomos/lib/cn'

import {
  addDays,
  addMonths,
  dayKey,
  isSameDay,
  isSameMonth,
  monthMatrix,
  startOfMonth,
  startOfWeek,
} from '@nomos/components/calendar/date'

/**
 * Les libellés du calendrier, **déjà formatés** par l'appelant : le cœur n'a ni `Intl`
 * ni i18n (ADR 0036, le patron de `Field.error`).
 */
export type CalendarLabels = {
  /** La légende du mois, par ex. `mars 2026`. */
  month: (month: Date) => string
  /** Le nom accessible d'un jour, par ex. `5 mars 2026`. */
  day: (date: Date) => string
  /** Sept libellés de jours, **déjà ordonnés** selon `weekStartsOn`. */
  weekdays: readonly string[]
  /** Le libellé accessible du bouton « mois précédent ». */
  previous: string
  /** Le libellé accessible du bouton « mois suivant ». */
  next: string
}

export type CalendarProps = {
  /** Le mois affiché (contrôlé). */
  month: Date
  /** Appelé quand la navigation demande un autre mois. */
  onMonthChange: (month: Date) => void
  /** Le jour sélectionné (contrôlé). */
  selected?: Date
  /** Appelé quand l'utilisateur choisit un jour. */
  onSelect?: (date: Date) => void
  /** Premier jour de la semaine : 0 (dimanche, défaut) ou 1 (lundi). */
  weekStartsOn?: 0 | 1
  /** Un jour désactivé ne peut être ni sélectionné ni focalisé. */
  isDateDisabled?: (date: Date) => boolean
  /** Des marqueurs par clé : chaque prédicat marque les jours qu'il reconnaît. */
  modifiers?: Record<string, (date: Date) => boolean>
  /** La classe posée sur les jours marqués, par clé de `modifiers`. */
  modifierClassNames?: Record<string, string>
  /** Affiche les jours hors du mois (grisés) plutôt qu'une cellule vide. */
  showOutsideDays?: boolean
  /** Le focus est posé sur le jour sélectionné (ou le premier du mois) au montage. */
  autoFocus?: boolean
  labels: CalendarLabels
  className?: string
}

const navButton =
  'inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'

/**
 * La grille d'un mois : présentation seule, contrôlée par props. Les libellés sont
 * injectés, les dates sont locales, et rien du métier (fuseau, min/max, locale) n'entre
 * dans le cœur (ADR 0036). Navigation clavier : `date.ts` + le `focused`.
 */
export function Calendar({
  month,
  onMonthChange,
  selected,
  onSelect,
  weekStartsOn = 0,
  isDateDisabled,
  modifiers,
  modifierClassNames,
  showOutsideDays = true,
  autoFocus = false,
  labels,
  className,
}: CalendarProps) {
  const weeks = monthMatrix(month, weekStartsOn, showOutsideDays)
  const [focused, setFocused] = useState<Date>(() => selected ?? month)
  const gridRef = useRef<HTMLTableElement>(null)
  // Le focus programmatique ne se pose qu'après une navigation (ou au montage si
  // `autoFocus`). Un ref d'**intention**, pas de « premier rendu » : sous StrictMode le
  // montage s'exécute deux fois, et un drapeau de premier rendu volerait le focus.
  const pendingFocus = useRef(autoFocus)

  // Le premier jour activable du mois affiché — le repli quand le jour focalisé sort du
  // mois ou tombe sur une date désactivée.
  const firstEnabled = (): Date => {
    for (const week of weeks) {
      for (const date of week) {
        if (date && !isDateDisabled?.(date)) return date
      }
    }
    return startOfMonth(month)
  }

  // Le jour porteur du tabindex : celui qu'on a focalisé s'il est dans le mois, sinon le
  // jour sélectionné (s'il est activable), sinon le premier jour activable. Dérivé, jamais
  // synchronisé par un effet (une prop `month` qui change ne doit pas écrire d'état).
  const candidate = isSameMonth(focused, month)
    ? focused
    : selected && isSameMonth(selected, month)
      ? selected
      : firstEnabled()
  const effectiveFocused = isDateDisabled?.(candidate) ? firstEnabled() : candidate

  // Déplace le focus DOM quand une navigation l'a demandé. Ne pose aucun état : c'est la
  // seule raison d'être de cet effet.
  useEffect(() => {
    if (!pendingFocus.current) return
    pendingFocus.current = false
    gridRef.current
      ?.querySelector<HTMLButtonElement>(`[data-day="${dayKey(effectiveFocused)}"]`)
      ?.focus()
  }, [effectiveFocused])

  const move = useCallback(
    (next: Date) => {
      if (isDateDisabled?.(next)) return
      pendingFocus.current = true
      setFocused(next)
      if (next.getMonth() !== month.getMonth() || next.getFullYear() !== month.getFullYear()) {
        onMonthChange(next)
      }
    },
    [isDateDisabled, month, onMonthChange],
  )

  const onKeyDown = (event: React.KeyboardEvent, date: Date) => {
    const moves: Record<string, Date> = {
      ArrowLeft: addDays(date, -1),
      ArrowRight: addDays(date, 1),
      ArrowUp: addDays(date, -7),
      ArrowDown: addDays(date, 7),
      PageUp: addMonths(date, -1),
      PageDown: addMonths(date, 1),
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      const start = startOfWeek(date, weekStartsOn)
      move(event.key === 'Home' ? start : addDays(start, 6))
      return
    }
    const next = moves[event.key]
    if (next) {
      event.preventDefault()
      move(next)
    }
  }

  const previousMonth = addMonths(month, -1)
  const nextMonth = addMonths(month, 1)

  return (
    <div className={cn('w-fit text-body', className)}>
      <div className="flex items-center justify-between px-1 py-1">
        <button
          type="button"
          aria-label={labels.previous}
          className={navButton}
          onClick={() => onMonthChange(previousMonth)}
        >
          <ChevronLeft className="size-4" aria-hidden />
        </button>
        <div role="status" aria-live="polite" className="font-medium text-foreground">
          {labels.month(month)}
        </div>
        <button
          type="button"
          aria-label={labels.next}
          className={navButton}
          onClick={() => onMonthChange(nextMonth)}
        >
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>

      <table
        ref={gridRef}
        role="grid"
        aria-label={labels.month(month)}
        className="w-full border-collapse"
      >
        <thead>
          <tr role="row">
            {labels.weekdays.map((weekday, index) => (
              <th
                key={index}
                scope="col"
                className="p-1 text-micro font-regular text-muted-foreground"
              >
                {weekday}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex} role="row">
              {week.map((date, dayIndex) => {
                if (!date) {
                  return <td key={dayIndex} role="gridcell" className="p-0" />
                }
                const outside = date.getMonth() !== month.getMonth()
                const isSelected = selected ? isSameDay(date, selected) : false
                const disabled = isDateDisabled?.(date) ?? false
                const marker = Object.entries(modifiers ?? {})
                  .filter(([, matches]) => matches(date))
                  .map(([key]) => modifierClassNames?.[key])
                  .filter(Boolean)
                  .join(' ')

                return (
                  <td key={dayIndex} role="gridcell" aria-selected={isSelected} className="p-0 text-center">
                    <button
                      type="button"
                      data-day={dayKey(date)}
                      aria-label={labels.day(date)}
                      aria-disabled={disabled || undefined}
                      disabled={disabled}
                      tabIndex={isSameDay(date, effectiveFocused) ? 0 : -1}
                      className={cn(
                        'inline-flex size-8 items-center justify-center rounded-md text-body transition-colors',
                        'hover:bg-accent hover:text-accent-foreground',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        'disabled:pointer-events-none disabled:opacity-50',
                        outside && 'text-muted-foreground',
                        isSelected && 'bg-primary text-primary-foreground hover:bg-primary/90',
                        marker,
                      )}
                      onClick={() => onSelect?.(date)}
                      onFocus={() => setFocused(date)}
                      onKeyDown={(event) => onKeyDown(event, date)}
                    >
                      {date.getDate()}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
