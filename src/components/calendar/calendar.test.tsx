import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { Calendar, type CalendarLabels } from '@nomos/components/calendar/calendar'

/** Un jeu de libellés déjà formatés (le cœur n'a ni `Intl` ni i18n). */
const labels: CalendarLabels = {
  month: (month) => `${month.getFullYear()}-${month.getMonth() + 1}`,
  day: (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
  weekdays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  previous: 'Previous month',
  next: 'Next month',
}

const march = new Date(2026, 2, 1)

/** Reconstruit la date du jour focalisé depuis son nom accessible `Y-M-J`. */
function focusedDate(): Date {
  const [year, month, day] = (document.activeElement as HTMLElement)
    .getAttribute('aria-label')!
    .split('-')
    .map(Number)
  return new Date(year, month - 1, day)
}

describe('Calendar', () => {
  it('renders a grid with the weekday header and the month caption, without an app provider', () => {
    render(<Calendar month={march} onMonthChange={() => {}} labels={labels} />)

    expect(screen.getByRole('grid')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('2026-3')
    expect(screen.getAllByRole('columnheader')).toHaveLength(7)
    expect(screen.getByRole('button', { name: '2026-3-5' })).toBeInTheDocument()
  })

  it('asks for the previous and the next month', async () => {
    const user = userEvent.setup()
    const onMonthChange = vi.fn()
    render(<Calendar month={march} onMonthChange={onMonthChange} labels={labels} />)

    await user.click(screen.getByRole('button', { name: 'Next month' }))
    expect(onMonthChange).toHaveBeenCalledWith(new Date(2026, 3, 1))

    await user.click(screen.getByRole('button', { name: 'Previous month' }))
    expect(onMonthChange).toHaveBeenCalledWith(new Date(2026, 1, 1))
  })

  it('keeps a single tab stop on the grid (roving tabindex)', () => {
    render(
      <Calendar
        month={march}
        onMonthChange={() => {}}
        labels={labels}
        selected={new Date(2026, 2, 5)}
      />,
    )

    const buttons = screen.getAllByRole('gridcell').flatMap((cell) => {
      const button = cell.querySelector('button')
      return button ? [button] : []
    })
    expect(buttons.filter((button) => button.getAttribute('tabindex') === '0')).toHaveLength(1)
  })

  it('moves the focus with the arrow keys', () => {
    render(
      <Calendar
        month={march}
        onMonthChange={() => {}}
        labels={labels}
        selected={new Date(2026, 2, 5)}
      />,
    )

    fireEvent.keyDown(screen.getByRole('button', { name: '2026-3-5' }), { key: 'ArrowRight' })
    expect(document.activeElement).toHaveAccessibleName('2026-3-6')

    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
    expect(document.activeElement).toHaveAccessibleName('2026-3-13')

    fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' })
    expect(document.activeElement).toHaveAccessibleName('2026-3-12')
  })

  it('jumps to the week boundaries with Home and End', () => {
    render(
      <Calendar
        month={march}
        onMonthChange={() => {}}
        labels={labels}
        selected={new Date(2026, 2, 5)}
      />,
    )

    fireEvent.keyDown(screen.getByRole('button', { name: '2026-3-5' }), { key: 'Home' })
    expect(focusedDate().getDay()).toBe(0)

    fireEvent.keyDown(document.activeElement!, { key: 'End' })
    expect(focusedDate().getDay()).toBe(6)
  })

  it('changes the month with PageUp / PageDown and reports it', () => {
    const onMonthChange = vi.fn()
    render(
      <Calendar
        month={march}
        onMonthChange={onMonthChange}
        labels={labels}
        selected={new Date(2026, 2, 5)}
      />,
    )

    fireEvent.keyDown(screen.getByRole('button', { name: '2026-3-5' }), { key: 'PageDown' })
    expect(onMonthChange).toHaveBeenCalledWith(new Date(2026, 3, 5))
  })

  it('reports a month change when the arrow crosses the month boundary', () => {
    const onMonthChange = vi.fn()
    render(
      <Calendar
        month={march}
        onMonthChange={onMonthChange}
        labels={labels}
        selected={new Date(2026, 2, 31)}
      />,
    )

    fireEvent.keyDown(screen.getByRole('button', { name: '2026-3-31' }), { key: 'ArrowRight' })
    expect(onMonthChange).toHaveBeenCalledWith(new Date(2026, 3, 1))
  })

  it('marks the selected day and reports the pick', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <Calendar
        month={march}
        onMonthChange={() => {}}
        labels={labels}
        selected={new Date(2026, 2, 5)}
        onSelect={onSelect}
      />,
    )

    expect(screen.getByRole('button', { name: '2026-3-5' })).toHaveAttribute(
      'aria-selected',
      'true',
    )

    await user.click(screen.getByRole('button', { name: '2026-3-6' }))
    expect(onSelect).toHaveBeenCalledWith(new Date(2026, 2, 6))
  })

  it('disables a day the predicate rejects, and refuses the pick', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <Calendar
        month={march}
        onMonthChange={() => {}}
        labels={labels}
        isDateDisabled={(date) => date.getDate() === 4}
        onSelect={onSelect}
      />,
    )

    const disabled = screen.getByRole('button', { name: '2026-3-4' })
    expect(disabled).toBeDisabled()
    expect(disabled).toHaveAttribute('aria-disabled', 'true')

    await user.click(disabled)
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('stamps the days matched by a modifier with its class', () => {
    render(
      <Calendar
        month={march}
        onMonthChange={() => {}}
        labels={labels}
        modifiers={{ training: (date) => date.getDate() === 10 }}
        modifierClassNames={{ training: 'marker-training' }}
      />,
    )

    expect(screen.getByRole('button', { name: '2026-3-10' })).toHaveClass('marker-training')
    expect(screen.getByRole('button', { name: '2026-3-11' })).not.toHaveClass('marker-training')
  })

  it('hides the outside days when asked, keeping their cell', () => {
    const { rerender } = render(
      <Calendar month={march} onMonthChange={() => {}} labels={labels} showOutsideDays />,
    )
    const withOutside = screen.getAllByRole('gridcell').filter((c) => c.querySelector('button'))

    rerender(
      <Calendar month={march} onMonthChange={() => {}} labels={labels} showOutsideDays={false} />,
    )
    const withoutOutside = screen
      .getAllByRole('gridcell')
      .filter((c) => c.querySelector('button'))

    expect(withoutOutside).toHaveLength(31)
    expect(withoutOutside.length).toBeLessThan(withOutside.length)
  })

  it('focuses the selected day on mount when asked', () => {
    render(
      <Calendar
        month={march}
        onMonthChange={() => {}}
        labels={labels}
        selected={new Date(2026, 2, 5)}
        autoFocus
      />,
    )

    expect(document.activeElement).toHaveAccessibleName('2026-3-5')
  })
})
