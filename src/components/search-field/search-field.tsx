import { Search, X } from 'lucide-react'

import { Input } from '@nomos/components/input/input'
import { cn } from '@nomos/lib/cn'

/**
 * Le champ de recherche du cœur : une icône, un `<input type="search">` et un bouton
 * d'effacement qui n'apparaît que si le champ est rempli. Contrôlé par props ; aucun
 * état, aucun i18n — le libellé « effacer » est injecté (ADR 0015).
 */
export type SearchFieldProps = {
  value: string
  onChange: (value: string) => void
  /** Le libellé du bouton d'effacement (le cœur n'a pas d'i18n). */
  clearLabel: string
  placeholder?: string
  className?: string
}

export function SearchField({
  value,
  onChange,
  clearLabel,
  placeholder,
  className,
}: SearchFieldProps) {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9"
      />
      {value ? (
        <button
          type="button"
          aria-label={clearLabel}
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  )
}
