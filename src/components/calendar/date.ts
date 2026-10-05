/**
 * Les calculs de date du calendrier : purs, sans dépendance, en **heure locale**.
 * Un jour est bucketé par son année/mois/jour locaux ; le module ne normalise jamais en
 * UTC — l'ancrage de fuseau appartient à l'app appelante (ADR 0036).
 */

/** Le premier jour du mois d'une date. */
export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

/** Le dernier jour du mois d'une date (jour 0 du mois suivant). */
export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

/** La date décalée de `amount` jours (arithmétique locale, sans heure). */
export function addDays(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount)
}

/** La date décalée de `amount` mois, en conservant le jour demandé. */
export function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, date.getDate())
}

/** Vrai si les deux dates tombent le même jour local. */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/** Vrai si les deux dates tombent le même mois local. */
export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

/** Le premier jour de la semaine contenant `date`, selon `weekStartsOn` (0 = dimanche). */
export function startOfWeek(date: Date, weekStartsOn: 0 | 1): Date {
  const offset = (date.getDay() - weekStartsOn + 7) % 7
  return addDays(date, -offset)
}

/** La clé locale stable d'un jour, `YYYY-MM-DD` (pour les data-attributs et le focus). */
export function dayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

/**
 * La grille d'un mois : les semaines (chacune de 7 jours) qui couvrent le mois, la
 * première commençant au bord de semaine. Un jour hors du mois est `null` quand
 * `showOutsideDays` est faux — la cellule garde alors sa place (pas de grille qui saute).
 */
export function monthMatrix(
  month: Date,
  weekStartsOn: 0 | 1,
  showOutsideDays: boolean,
): (Date | null)[][] {
  const weeks: (Date | null)[][] = []
  const last = endOfMonth(month)
  let cursor = startOfWeek(startOfMonth(month), weekStartsOn)

  while (cursor.getTime() <= last.getTime()) {
    const week: (Date | null)[] = []
    for (let i = 0; i < 7; i += 1) {
      const date = addDays(cursor, i)
      week.push(isSameMonth(date, month) || showOutsideDays ? date : null)
    }
    weeks.push(week)
    cursor = addDays(cursor, 7)
  }
  return weeks
}
