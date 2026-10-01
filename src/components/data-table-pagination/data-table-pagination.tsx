import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@nomos/components/button/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@nomos/components/select/select'

/**
 * La pagination d'une table, en atome autonome : elle ne connaît pas TanStack, seulement
 * la page, les bornes et les rappels. Elle se rend donc hors d'une table. Aucun libellé
 * ne vient de l'app — ils sont injectés (ADR 0010).
 */
export type DataTablePaginationProps = {
  page: number
  pageCount: number
  pageSize: number
  onPageSizeChange: (size: number) => void
  onPrevious: () => void
  onNext: () => void
  canPrevious: boolean
  canNext: boolean
  rowsLabel: string
  pageOf: (page: number, total: number) => string
  previousLabel: string
  nextLabel: string
}

export function DataTablePagination({
  page,
  pageCount,
  pageSize,
  onPageSizeChange,
  onPrevious,
  onNext,
  canPrevious,
  canNext,
  rowsLabel,
  pageOf,
  previousLabel,
  nextLabel,
}: DataTablePaginationProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{rowsLabel}</span>
        <Select value={String(pageSize)} onValueChange={(value) => onPageSizeChange(Number(value))}>
          <SelectTrigger className="h-8 w-18">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[10, 25, 50, 100].map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{pageOf(page, pageCount)}</span>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={onPrevious}
          disabled={!canPrevious}
          aria-label={previousLabel}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={onNext}
          disabled={!canNext}
          aria-label={nextLabel}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
