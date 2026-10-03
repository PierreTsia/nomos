import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste du Meter (ADR 0005). Il documente les deux tailles du même atome :
 * la barre large, qui a besoin du libellé du seuil, et la barre compacte d'une cellule.
 */
export const meterManifest: ComponentManifest = {
  name: 'meter',
  title: 'Meter',
  summary:
    'A bar that positions a value on a scale, with the threshold mark. Renders on its own, ' +
    "outside any table: a health card uses it just like a cell.",
  level: 'primitive',
  example: { label: 'spec', value: 2, max: 3, threshold: 2 },
  variants: [],
  props: [
    {
      name: 'value',
      type: 'number',
      required: true,
      check: 'rendered',
      description: "The measured value, clamped to the scale: it fills the bar.",
    },
    {
      name: 'max',
      type: 'number',
      required: true,
      check: 'rendered',
      description: "The top of the scale: 3 for a score, 1 for a Noul.",
    },
    {
      name: 'label',
      type: 'string',
      required: true,
      check: 'rendered',
      description: "The name of what is measured, to the left of the bar.",
    },
    {
      name: 'threshold',
      type: 'number | null',
      required: false,
      check: 'rendered',
      description: "The compared threshold, marked on the bar; absent, the bar has no mark.",
    },
    {
      name: 'confidence',
      type: 'number | null',
      required: false,
      check: 'rendered',
      description: "The confidence attached to the value, displayed as `c0.00` on the right.",
    },
    {
      name: 'thresholdLabel',
      type: '(threshold: number) => string',
      required: false,
      check: 'rendered',
      description:
        "The threshold text, injected by the caller: the core has no i18n (ADR 0010).",
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "The caller's classes, merged after those of the component.",
    },
  ],
  usages: [
    {
      when: "a health card shows a measurement's progress",
      use: '<Meter label="sessions" value={12} max={20} />',
      avoid: 'the compact bar, unreadable outside a dense cell',
    },
    {
      when: 'a dense table cell carries two measurements side by side',
      use: '<CompactMeter label="spec" value={2} max={3} threshold={2} />',
      avoid: "the wide bar: it doesn't fit in a column",
    },
    {
      when: 'a threshold is marked on the bar',
      use: 'thresholdLabel={t.meter.threshold} (the text comes from the app)',
      avoid: 'a hardcoded label in the core: it would be monolingual and tied to a product',
    },
  ],
}