/**
 * La surface publique du design system.
 *
 * Rien n'entre ici qui nomme un produit : le cœur est app-agnostique et partageable
 * (ADR 0002). Un composant qui a besoin d'un mot produit pour s'expliquer appartient
 * à l'app, pas à ce paquet.
 */
export { Alert } from '@nomos/components/alert/alert'
export type { AlertProps } from '@nomos/components/alert/alert'
export { alertManifest } from '@nomos/components/alert/manifest'

export { Badge, badgeVariants, badgeVariantsConfig } from '@nomos/components/badge/badge'
export type { BadgeProps } from '@nomos/components/badge/badge'

export { badgeManifest } from '@nomos/components/badge/manifest'

export { Button, buttonVariants, buttonVariantsConfig } from '@nomos/components/button/button'
export type { ButtonProps } from '@nomos/components/button/button'
export { buttonManifest } from '@nomos/components/button/manifest'

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@nomos/components/card/card'
export { cardManifest } from '@nomos/components/card/manifest'

export { Dialog } from '@nomos/components/dialog/dialog'
export type { DialogProps } from '@nomos/components/dialog/dialog'
export { dialogManifest } from '@nomos/components/dialog/manifest'

export { EmptyState } from '@nomos/components/empty-state/empty-state'
export type { EmptyStateProps } from '@nomos/components/empty-state/empty-state'
export { emptyStateManifest } from '@nomos/components/empty-state/manifest'

export { Chip } from '@nomos/components/chip/chip'
export type { ChipProps } from '@nomos/components/chip/chip'
export { chipManifest } from '@nomos/components/chip/manifest'

export { Freshness } from '@nomos/components/freshness/freshness'
export type { FreshnessProps } from '@nomos/components/freshness/freshness'
export { freshnessManifest } from '@nomos/components/freshness/manifest'

export { Input } from '@nomos/components/input/input'
export { inputManifest } from '@nomos/components/input/manifest'

export { NumberField } from '@nomos/components/number-field/number-field'
export { numberFieldManifest } from '@nomos/components/number-field/manifest'

export { SearchField } from '@nomos/components/search-field/search-field'
export type { SearchFieldProps } from '@nomos/components/search-field/search-field'
export { searchFieldManifest } from '@nomos/components/search-field/manifest'

export { Label } from '@nomos/components/label/label'
export { labelManifest } from '@nomos/components/label/manifest'

export { Fieldset } from '@nomos/components/fieldset/fieldset'
export { fieldsetManifest } from '@nomos/components/fieldset/manifest'

export { Field } from '@nomos/components/field/field'
export type { FieldProps } from '@nomos/components/field/field'
export { fieldManifest } from '@nomos/components/field/manifest'

export { Form } from '@nomos/components/form/form'
export type { FormProps } from '@nomos/components/form/form'
export { formManifest } from '@nomos/components/form/manifest'

export { FacetFilter } from '@nomos/components/facet-filter/facet-filter'
export type { Facet, FacetFilterProps, FacetOption } from '@nomos/components/facet-filter/facet-filter'
export { facetFilterManifest } from '@nomos/components/facet-filter/manifest'

export { DataTableToolbar } from '@nomos/components/data-table-toolbar/data-table-toolbar'
export type { DataTableToolbarProps } from '@nomos/components/data-table-toolbar/data-table-toolbar'
export { dataTableToolbarManifest } from '@nomos/components/data-table-toolbar/manifest'

export { DataTablePagination } from '@nomos/components/data-table-pagination/data-table-pagination'
export type { DataTablePaginationProps } from '@nomos/components/data-table-pagination/data-table-pagination'
export { dataTablePaginationManifest } from '@nomos/components/data-table-pagination/manifest'

export { FacetedDataTable } from '@nomos/features/faceted-data-table'
export type {
  ColumnManager,
  DataTableLabels,
  FacetDef,
  RowDetail,
  RowKey,
  RowSelection,
  TableState,
} from '@nomos/features/faceted-data-table'
export {
  dataTableFeatures,
  type DataTableColumnMeta,
  type DataTableFeatures,
} from '@nomos/features/data-table-features'

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
} from '@nomos/components/sheet/sheet'
export { sheetManifest } from '@nomos/components/sheet/manifest'
export { TooltipProvider } from '@nomos/internal/tooltip'

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@nomos/internal/select'

export { CompactMeter, Meter } from '@nomos/components/meter/meter'
export type { CompactMeterProps, MeterProps } from '@nomos/components/meter/meter'
export { meterManifest } from '@nomos/components/meter/manifest'

export { Separator } from '@nomos/components/separator/separator'
export { separatorManifest } from '@nomos/components/separator/manifest'

export { Skeleton } from '@nomos/components/skeleton/skeleton'
export { skeletonManifest } from '@nomos/components/skeleton/manifest'

export {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@nomos/components/table/table'
export { tableManifest } from '@nomos/components/table/manifest'

export { Textarea } from '@nomos/components/textarea/textarea'
export { textareaManifest } from '@nomos/components/textarea/manifest'

export { Checkbox } from '@nomos/components/checkbox/checkbox'
export { checkboxManifest } from '@nomos/components/checkbox/manifest'

export { Switch } from '@nomos/components/switch/switch'
export { switchManifest } from '@nomos/components/switch/manifest'

export { RadioGroup, RadioGroupItem } from '@nomos/components/radio/radio'
export { radioManifest } from '@nomos/components/radio/manifest'

export { Toggle, toggleVariants, toggleVariantsConfig } from '@nomos/components/toggle/toggle'
export type { ToggleProps } from '@nomos/components/toggle/toggle'
export { toggleManifest } from '@nomos/components/toggle/manifest'

export { ToggleGroup, ToggleGroupItem } from '@nomos/components/toggle-group/toggle-group'
export { toggleGroupManifest } from '@nomos/components/toggle-group/manifest'

export { Toast } from '@nomos/components/toast/toast'
export type { ToastProps } from '@nomos/components/toast/toast'
export { toastManifest } from '@nomos/components/toast/manifest'

export { ToastProvider, useToast } from '@nomos/features/toast'
export type { ToastApi, ToastOptions } from '@nomos/features/toast'

export { SelectionTree, Tree } from '@nomos/components/tree/tree'
export type { SelectionTreeProps, TreeProps, TreeNode } from '@nomos/components/tree/tree'
export { treeManifest } from '@nomos/components/tree/manifest'

export { Counter } from '@nomos/components/counter/counter'
export type { CounterProps } from '@nomos/components/counter/counter'
export { counterManifest } from '@nomos/components/counter/manifest'

export { ProgressBar } from '@nomos/components/progress-bar/progress-bar'
export type { ProgressBarProps } from '@nomos/components/progress-bar/progress-bar'
export { progressBarManifest } from '@nomos/components/progress-bar/manifest'

export { Rating } from '@nomos/components/rating/rating'
export type { RatingProps } from '@nomos/components/rating/rating'
export { ratingManifest } from '@nomos/components/rating/manifest'

export { Timeline } from '@nomos/components/timeline/timeline'
export type { TimelineItem, TimelineProps } from '@nomos/components/timeline/timeline'
export { timelineManifest } from '@nomos/components/timeline/manifest'

export { catalogue, componentNames, findComponent, validateCatalogue } from '@nomos/catalogue/registry'
export type { CatalogueEntry } from '@nomos/catalogue/registry'
export { componentManifestSchema } from '@nomos/catalogue/contract'
export type {
  ComponentManifest,
  ComponentProp,
  ComponentUsage,
  ComponentVariant,
} from '@nomos/catalogue/contract'

export { cn } from '@nomos/lib/cn'
export { TONES, toneClasses } from '@nomos/lib/tone'
export type { Tone } from '@nomos/lib/tone'

export { resolveSkin } from '@nomos/tokens/skin'
export { renderCss } from '@nomos/tokens/build.mjs'
export type { TokensDocument } from '@nomos/tokens/build.mjs'
export { tokensResource } from '@nomos/tokens/resource'