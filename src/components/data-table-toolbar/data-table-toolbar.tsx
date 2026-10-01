import type { ReactNode } from 'react'
import { Check, ChevronDown, ChevronUp, Search, X } from 'lucide-react'

import { Button } from '@nomos/components/button/button'
import { FacetFilter, type Facet } from '@nomos/components/facet-filter/facet-filter'
import { Input } from '@nomos/components/input/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@nomos/internal/dropdown-menu'
import { cn } from '@nomos/lib/cn'

/**
 * La barre d'outils d'une table : la recherche, les facettes, la gestion des colonnes et
 * le compte affiché. Elle ne connaît ni l'i18n de l'app ni ses query-params — libellés et
 * état sont injectés (ADR 0010).
 */
export type DataTableColumnOption = { id: string; label: string; visible: boolean }

export type DataTableToolbarProps = {
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  placeholder: string
  facets: Facet[]
  shownLabel: string
  canReset: boolean
  resetLabel: string
  clearFacetLabel: string
  onReset: () => void
  columns?: {
    label: string
    clearLabel: string
    options: DataTableColumnOption[]
    onToggle: (id: string, visible: boolean) => void
    onMove?: (id: string, direction: -1 | 1) => void
    moveUpLabel?: (label: string) => string
    moveDownLabel?: (label: string) => string
  }
  actions?: ReactNode
}

export function DataTableToolbar({
  globalFilter,
  onGlobalFilterChange,
  placeholder,
  facets,
  shownLabel,
  canReset,
  resetLabel,
  clearFacetLabel,
  onReset,
  columns,
  actions,
}: DataTableToolbarProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-xs">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={globalFilter}
          onChange={(event) => onGlobalFilterChange(event.target.value)}
          placeholder={placeholder}
          className="h-8 pl-9"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {facets.map((facet) => (
          <FacetFilter
            key={facet.id}
            label={facet.label}
            options={facet.options}
            selected={facet.selected}
            onChange={facet.onChange}
            clearLabel={clearFacetLabel}
          />
        ))}
        {columns ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1 border-dashed">
                {columns.label}
                <ChevronDown className="size-3.5 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {columns.options.map((option) => (
                <DropdownMenuItem
                  key={option.id}
                  onSelect={(event) => {
                    event.preventDefault()
                    columns.onToggle(option.id, !option.visible)
                  }}
                  className="gap-2"
                >
                  <span
                    className={cn(
                      'grid size-4 shrink-0 place-items-center rounded border',
                      option.visible
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'opacity-60',
                    )}
                  >
                    {option.visible ? <Check className="size-3" /> : null}
                  </span>
                  <span className="flex-1 truncate">{option.label}</span>
                  {columns.onMove ? (
                    <span className="flex items-center gap-0.5">
                      <button
                        type="button"
                        aria-label={columns.moveUpLabel?.(option.label) ?? option.label}
                        className="rounded p-0.5 text-muted-foreground hover:text-foreground"
                        onClick={(event) => {
                          event.stopPropagation()
                          event.preventDefault()
                          columns.onMove?.(option.id, -1)
                        }}
                      >
                        <ChevronUp className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label={columns.moveDownLabel?.(option.label) ?? option.label}
                        className="rounded p-0.5 text-muted-foreground hover:text-foreground"
                        onClick={(event) => {
                          event.stopPropagation()
                          event.preventDefault()
                          columns.onMove?.(option.id, 1)
                        }}
                      >
                        <ChevronDown className="size-3.5" />
                      </button>
                    </span>
                  ) : null}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => columns.options.forEach((option) => columns.onToggle(option.id, true))}
                className="justify-center text-xs text-muted-foreground"
              >
                {columns.clearLabel}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
        {canReset ? (
          <Button variant="ghost" size="sm" className="h-8" onClick={onReset}>
            {resetLabel}
            <X className="ml-1 size-3.5" />
          </Button>
        ) : null}
        <span className="ml-1 hidden text-xs text-muted-foreground sm:inline">{shownLabel}</span>
        {actions}
      </div>
    </div>
  )
}
