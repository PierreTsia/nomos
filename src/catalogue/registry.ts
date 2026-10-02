import type { ComponentType } from 'react'

import { Alert } from '@nomos/components/alert/alert'
import { alertManifest } from '@nomos/components/alert/manifest'
import { AlertDialog } from '@nomos/components/alert-dialog/alert-dialog'
import { alertDialogManifest } from '@nomos/components/alert-dialog/manifest'
import { Avatar } from '@nomos/components/avatar/avatar'
import { avatarManifest } from '@nomos/components/avatar/manifest'
import { ScrollArea } from '@nomos/components/scroll-area/scroll-area'
import { scrollAreaManifest } from '@nomos/components/scroll-area/manifest'
import { Tabs } from '@nomos/components/tabs/tabs'
import { tabsManifest } from '@nomos/components/tabs/manifest'
import { Accordion } from '@nomos/components/accordion/accordion'
import { accordionManifest } from '@nomos/components/accordion/manifest'
import { Collapsible } from '@nomos/components/collapsible/collapsible'
import { collapsibleManifest } from '@nomos/components/collapsible/manifest'
import { Badge, badgeVariantsConfig } from '@nomos/components/badge/badge'
import { badgeManifest } from '@nomos/components/badge/manifest'
import { Button, buttonVariantsConfig } from '@nomos/components/button/button'
import { buttonManifest } from '@nomos/components/button/manifest'
import { Card } from '@nomos/components/card/card'
import { cardManifest } from '@nomos/components/card/manifest'
import { Dialog } from '@nomos/components/dialog/dialog'
import { dialogManifest } from '@nomos/components/dialog/manifest'
import { DropdownMenu } from '@nomos/components/dropdown-menu/dropdown-menu'
import { dropdownMenuManifest } from '@nomos/components/dropdown-menu/manifest'
import { Chip, chipSizeClasses } from '@nomos/components/chip/chip'
import { chipManifest } from '@nomos/components/chip/manifest'
import { Kicker, kickerVariantsConfig } from '@nomos/components/kicker/kicker'
import { kickerManifest } from '@nomos/components/kicker/manifest'
import { CopyButton, copyButtonVariantsConfig } from '@nomos/components/copy-button/copy-button'
import { copyButtonManifest } from '@nomos/components/copy-button/manifest'
import { EmptyState } from '@nomos/components/empty-state/empty-state'
import { emptyStateManifest } from '@nomos/components/empty-state/manifest'
import { Checkbox } from '@nomos/components/checkbox/checkbox'
import { checkboxManifest } from '@nomos/components/checkbox/manifest'
import { DataTablePagination } from '@nomos/components/data-table-pagination/data-table-pagination'
import { dataTablePaginationManifest } from '@nomos/components/data-table-pagination/manifest'
import { DataTableToolbar } from '@nomos/components/data-table-toolbar/data-table-toolbar'
import { dataTableToolbarManifest } from '@nomos/components/data-table-toolbar/manifest'
import { FacetFilter } from '@nomos/components/facet-filter/facet-filter'
import { facetFilterManifest } from '@nomos/components/facet-filter/manifest'
import { Field } from '@nomos/components/field/field'
import { fieldManifest } from '@nomos/components/field/manifest'
import { Fieldset } from '@nomos/components/fieldset/fieldset'
import { fieldsetManifest } from '@nomos/components/fieldset/manifest'
import { Form } from '@nomos/components/form/form'
import { formManifest } from '@nomos/components/form/manifest'
import { Freshness } from '@nomos/components/freshness/freshness'
import { freshnessManifest } from '@nomos/components/freshness/manifest'
import { Input } from '@nomos/components/input/input'
import { inputManifest } from '@nomos/components/input/manifest'
import { Label } from '@nomos/components/label/label'
import { labelManifest } from '@nomos/components/label/manifest'
import { Link } from '@nomos/components/link/link'
import { linkManifest } from '@nomos/components/link/manifest'
import { Meter } from '@nomos/components/meter/meter'
import { meterManifest } from '@nomos/components/meter/manifest'
import { NumberField } from '@nomos/components/number-field/number-field'
import { numberFieldManifest } from '@nomos/components/number-field/manifest'
import { Popover } from '@nomos/components/popover/popover'
import { popoverManifest } from '@nomos/components/popover/manifest'
import { RadioGroup } from '@nomos/components/radio/radio'
import { radioManifest } from '@nomos/components/radio/manifest'
import { SearchField } from '@nomos/components/search-field/search-field'
import { searchFieldManifest } from '@nomos/components/search-field/manifest'
import { Select } from '@nomos/components/select/select'
import { selectManifest } from '@nomos/components/select/manifest'
import { Separator } from '@nomos/components/separator/separator'
import { separatorManifest } from '@nomos/components/separator/manifest'
import { Sheet, sheetVariantsConfig } from '@nomos/components/sheet/sheet'
import { sheetManifest } from '@nomos/components/sheet/manifest'
import { Skeleton } from '@nomos/components/skeleton/skeleton'
import { skeletonManifest } from '@nomos/components/skeleton/manifest'
import { Switch } from '@nomos/components/switch/switch'
import { switchManifest } from '@nomos/components/switch/manifest'
import { Table } from '@nomos/components/table/table'
import { tableManifest } from '@nomos/components/table/manifest'
import { Textarea } from '@nomos/components/textarea/textarea'
import { textareaManifest } from '@nomos/components/textarea/manifest'
import { Toast } from '@nomos/components/toast/toast'
import { toastManifest } from '@nomos/components/toast/manifest'
import { TooltipProvider } from '@nomos/components/tooltip/tooltip'
import { tooltipManifest } from '@nomos/components/tooltip/manifest'
import { Toggle, toggleVariantsConfig } from '@nomos/components/toggle/toggle'
import { toggleManifest } from '@nomos/components/toggle/manifest'
import { ToggleGroup } from '@nomos/components/toggle-group/toggle-group'
import { toggleGroupManifest } from '@nomos/components/toggle-group/manifest'
import { Tree } from '@nomos/components/tree/tree'
import { treeManifest } from '@nomos/components/tree/manifest'
import { Counter } from '@nomos/components/counter/counter'
import { counterManifest } from '@nomos/components/counter/manifest'
import { ProgressBar } from '@nomos/components/progress-bar/progress-bar'
import { progressBarManifest } from '@nomos/components/progress-bar/manifest'
import { Rating } from '@nomos/components/rating/rating'
import { ratingManifest } from '@nomos/components/rating/manifest'
import { Timeline } from '@nomos/components/timeline/timeline'
import { timelineManifest } from '@nomos/components/timeline/manifest'

import { componentManifestSchema, errorMessage, type ComponentManifest } from '@nomos/catalogue/contract'
import { toneClasses } from '@nomos/lib/tone'

/**
 * L'index du catalogue : **un inventaire, deux rendus** (ADR 0005). La page de style
 * le lit pour un humain, le serveur MCP le servira à un agent, et le test de cohérence
 * le confronte aux props réelles.
 *
 * Chaque entrée porte le manifeste, le composant lui-même (pour que la page de style
 * le rende et que le test l'interroge) et la config de variantes du composant, indexée
 * par le nom de la prop qui les porte.
 */

type VariantsConfig = {
  variants?: Record<string, Record<string, unknown>>
  defaultVariants?: Record<string, unknown>
}

export type CatalogueEntry = {
  manifest: ComponentManifest
  component: ComponentType<Record<string, unknown>>
  variantsConfig: Record<string, VariantsConfig>
}

export const catalogueEntries: CatalogueEntry[] = [
  {
    manifest: alertManifest,
    component: Alert as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: { tone: { variants: { tone: toneClasses }, defaultVariants: { tone: 'info' } } },
  },
  {
    manifest: alertDialogManifest,
    component: AlertDialog as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: avatarManifest,
    component: Avatar as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: scrollAreaManifest,
    component: ScrollArea as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: tabsManifest,
    component: Tabs as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: accordionManifest,
    component: Accordion as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {
      type: {
        variants: { type: { single: {}, multiple: {} } },
        defaultVariants: { type: 'single' },
      },
    },
  },
  {
    manifest: collapsibleManifest,
    component: Collapsible as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: badgeManifest,
    component: Badge as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: { variant: badgeVariantsConfig },
  },
  {
    manifest: buttonManifest,
    component: Button as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: { variant: buttonVariantsConfig, size: buttonVariantsConfig },
  },
  {
    manifest: cardManifest,
    component: Card as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: dialogManifest,
    component: Dialog as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: dropdownMenuManifest,
    component: DropdownMenu as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: emptyStateManifest,
    component: EmptyState as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: chipManifest,
    component: Chip as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {
      tone: { variants: { tone: toneClasses }, defaultVariants: { tone: 'neutral' } },
      size: { variants: { size: chipSizeClasses }, defaultVariants: { size: 'default' } },
    },
  },
  {
    manifest: kickerManifest,
    component: Kicker as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: { tone: kickerVariantsConfig },
  },
  {
    manifest: copyButtonManifest,
    component: CopyButton as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: { variant: copyButtonVariantsConfig, size: copyButtonVariantsConfig },
  },
  {
    manifest: freshnessManifest,
    component: Freshness as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: inputManifest,
    component: Input as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: numberFieldManifest,
    component: NumberField as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: popoverManifest,
    component: Popover as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: searchFieldManifest,
    component: SearchField as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: selectManifest,
    component: Select as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: labelManifest,
    component: Label as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: linkManifest,
    component: Link as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: fieldsetManifest,
    component: Fieldset as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: fieldManifest,
    component: Field as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: formManifest,
    component: Form as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: facetFilterManifest,
    component: FacetFilter as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: dataTableToolbarManifest,
    component: DataTableToolbar as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: dataTablePaginationManifest,
    component: DataTablePagination as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: meterManifest,
    component: Meter as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: separatorManifest,
    component: Separator as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: sheetManifest,
    component: Sheet as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: { side: sheetVariantsConfig },
  },
  {
    manifest: skeletonManifest,
    component: Skeleton as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: tableManifest,
    component: Table as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: textareaManifest,
    component: Textarea as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: checkboxManifest,
    component: Checkbox as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: switchManifest,
    component: Switch as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: radioManifest,
    component: RadioGroup as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: toggleManifest,
    component: Toggle as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: { variant: toggleVariantsConfig, size: toggleVariantsConfig },
  },
  {
    manifest: toggleGroupManifest,
    component: ToggleGroup as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: { variant: toggleVariantsConfig, size: toggleVariantsConfig },
  },
  {
    manifest: toastManifest,
    component: Toast as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {
      tone: { variants: { tone: toneClasses }, defaultVariants: { tone: 'info' } },
    },
  },
  {
    manifest: tooltipManifest,
    component: TooltipProvider as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: treeManifest,
    component: Tree as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: counterManifest,
    component: Counter as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: progressBarManifest,
    component: ProgressBar as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: ratingManifest,
    component: Rating as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
  {
    manifest: timelineManifest,
    component: Timeline as unknown as ComponentType<Record<string, unknown>>,
    variantsConfig: {},
  },
]

/**
 * Valide l'index : chaque manifeste respecte le contrat, et deux composants ne portent
 * pas le même nom. Une entrée refusée dit laquelle et pourquoi.
 */
export function validateCatalogue(entries: CatalogueEntry[]): CatalogueEntry[] {
  const seen = new Set<string>()
  return entries.map((entry) => {
    const name = entry.manifest?.name ?? '(sans nom)'
    const parsed = componentManifestSchema.safeParse(entry.manifest)
    if (!parsed.success) throw new Error(errorMessage(name, parsed.error))
    if (seen.has(parsed.data.name)) {
      throw new Error(`Catalogue : deux manifestes portent le nom \`${parsed.data.name}\`.`)
    }
    seen.add(parsed.data.name)
    return { ...entry, manifest: parsed.data }
  })
}

/** Le catalogue validé — c'est celui-là qu'on expose. */
export const catalogue: CatalogueEntry[] = validateCatalogue(catalogueEntries)

/** Les noms des composants du catalogue, dans l'ordre de l'index. */
export const componentNames: string[] = catalogue.map((entry) => entry.manifest.name)

/** Le composant et son manifeste, ou une erreur qui dit ce qui manque. */
export function findComponent(name: string): CatalogueEntry {
  const entry = catalogue.find((candidate) => candidate.manifest.name === name)
  if (!entry) {
    throw new Error(
      `Catalogue : composant introuvable : \`${name}\` (connus : ${componentNames.join(', ')}).`,
    )
  }
  return entry
}