import { describe, expect, it } from 'vitest'

import {
  addDays,
  addMonths,
  dayKey,
  endOfMonth,
  isSameDay,
  isSameMonth,
  monthMatrix,
  startOfMonth,
  startOfWeek,
} from '@nomos/components/calendar/date'

/**
 * Les calculs de date du calendrier. Ils opèrent en **heure locale** (jamais de
 * normalisation UTC) : un jour est bucketé par son année/mois/jour locaux — l'ancrage
 * de fuseau reste chez l'app appelante.
 */
const day = (year: number, month: number, date: number) => new Date(year, month, date)

describe('les helpers de date du calendrier', () => {
  it('résume un jour par ses composantes locales (YYYY-MM-DD)', () => {
    expect(dayKey(day(2026, 2, 5))).toBe('2026-03-05')
    expect(dayKey(day(2026, 0, 1))).toBe('2026-01-01')
  })

  it('borne le mois à son premier et son dernier jour', () => {
    expect(isSameDay(startOfMonth(day(2026, 2, 15)), day(2026, 2, 1))).toBe(true)
    expect(isSameDay(endOfMonth(day(2026, 2, 15)), day(2026, 2, 31))).toBe(true)
    expect(isSameDay(endOfMonth(day(2026, 1, 10)), day(2026, 1, 28))).toBe(true)
  })

  it('avance et recule en franchissant un mois', () => {
    expect(isSameDay(addDays(day(2026, 0, 31), 1), day(2026, 1, 1))).toBe(true)
    expect(isSameDay(addMonths(day(2026, 0, 15), 1), day(2026, 1, 15))).toBe(true)
    expect(isSameDay(addMonths(day(2026, 11, 15), 1), day(2027, 0, 15))).toBe(true)
  })

  it('borne le jour au dernier du mois visé (pas de débordement)', () => {
    expect(isSameDay(addMonths(day(2026, 0, 31), 1), day(2026, 1, 28))).toBe(true)
    expect(isSameDay(addMonths(day(2026, 2, 31), 1), day(2026, 3, 30))).toBe(true)
    expect(isSameDay(addMonths(day(2026, 0, 31), -1), day(2025, 11, 31))).toBe(true)
  })

  it('compare un jour et un mois', () => {
    expect(isSameDay(day(2026, 2, 5), day(2026, 2, 5))).toBe(true)
    expect(isSameDay(day(2026, 2, 5), day(2026, 2, 6))).toBe(false)
    expect(isSameMonth(day(2026, 2, 5), day(2026, 2, 28))).toBe(true)
    expect(isSameMonth(day(2026, 2, 5), day(2026, 3, 1))).toBe(false)
  })

  it('démarre la semaine selon le premier jour demandé', () => {
    const d = day(2026, 2, 15)
    expect(startOfWeek(d, 0).getDay()).toBe(0)
    expect(startOfWeek(d, 1).getDay()).toBe(1)
    // Le lendemain du premier jour est toujours couvert (la semaine contient `d`).
    expect(startOfWeek(d, 1).getTime()).toBeLessThanOrEqual(d.getTime())
    expect(addDays(startOfWeek(d, 1), 6).getTime()).toBeGreaterThanOrEqual(d.getTime())
  })

  it('construit une matrice de semaines de 7 jours couvrant le mois', () => {
    const weeks = monthMatrix(day(2026, 2, 1), 0, true)
    for (const week of weeks) expect(week).toHaveLength(7)
    expect(weeks[0][0]?.getDay()).toBe(0)

    const inMonth = weeks.flat().filter((d) => d && d.getMonth() === 2)
    expect(inMonth).toHaveLength(31)
    expect(inMonth[0]?.getDate()).toBe(1)
    expect(inMonth[inMonth.length - 1]?.getDate()).toBe(31)
  })

  it('remplace les jours hors du mois par `null` quand ils sont masqués', () => {
    const weeks = monthMatrix(day(2026, 2, 1), 0, false)
    expect(weeks.flat().some((d) => d === null)).toBe(true)
    expect(weeks.flat().filter(Boolean)).toHaveLength(31)
  })
})
