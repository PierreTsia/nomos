import { Check, ChevronDown } from 'lucide-react'

import { Badge } from '@nomos/components/badge/badge'
import { Button } from '@nomos/components/button/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@nomos/internal/dropdown-menu'
import { cn } from '@nomos/lib/cn'

/**
 * Le filtre à facettes : un menu à choix multiples sur une facette. Il ne connaît ni
 * la table ni l'i18n de l'app — les options, la sélection et le libellé « effacer »
 * sont injectés (ADR 0010).
 */
export type FacetOption = { value: string; label: string; count: number }

export type Facet = {
  id: string
  label: string
  options: FacetOption[]
  selected: string[]
  onChange: (next: string[]) => void
}

export type FacetFilterProps = Omit<Facet, 'id'> & {
  /** Le libellé de l'entrée qui efface la sélection (le cœur n'a pas d'i18n). */
  clearLabel: string
  className?: string
}

export function FacetFilter({
  label,
  options,
  selected,
  onChange,
  clearLabel,
  className,
}: FacetFilterProps) {
  const toggle = (value: string) => {
    onChange(
      selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value],
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={cn('h-8 gap-1 border-dashed', className)}>
          {label}
          {selected.length > 0 ? (
            <>
              <span className="mx-1 h-4 w-px bg-border" />
              <Badge variant="secondary" className="rounded px-1 text-[10px]">
                {selected.length}
              </Badge>
            </>
          ) : null}
          <ChevronDown className="size-3.5 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-72 w-56 overflow-y-auto">
        {options.map((option) => {
          const isSelected = selected.includes(option.value)
          return (
            <DropdownMenuItem
              key={option.value}
              onSelect={(event) => {
                event.preventDefault()
                toggle(option.value)
              }}
              className="gap-2"
            >
              <span
                className={cn(
                  'grid size-4 shrink-0 place-items-center rounded border',
                  isSelected ? 'border-primary bg-primary text-primary-foreground' : 'opacity-60',
                )}
              >
                {isSelected ? <Check className="size-3" /> : null}
              </span>
              <span className="flex-1 truncate">{option.label}</span>
              <span className="text-xs tabular-nums text-muted-foreground">{option.count}</span>
            </DropdownMenuItem>
          )
        })}
        {selected.length > 0 ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => onChange([])}
              className="justify-center text-xs text-muted-foreground"
            >
              {clearLabel}
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
