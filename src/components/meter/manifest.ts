import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste du Meter (ADR 0005). Il documente les deux tailles du même atome :
 * la barre large, qui a besoin du libellé du seuil, et la barre compacte d'une cellule.
 */
export const meterManifest: ComponentManifest = {
  name: 'meter',
  title: 'Meter',
  summary:
    'Une barre qui situe une valeur sur une échelle, avec la marque du seuil. Se rend ' +
    "seule, hors de toute table : une carte de santé l'utilise au même titre qu'une cellule.",
  level: 'primitive',
  example: { label: 'spec', value: 2, max: 3, threshold: 2 },
  variants: [],
  props: [
    {
      name: 'value',
      type: 'number',
      required: true,
      check: 'rendered',
      description: "La valeur mesurée, bornée à l'échelle : c'est elle qui remplit la barre.",
    },
    {
      name: 'max',
      type: 'number',
      required: true,
      check: 'rendered',
      description: "Le haut de l'échelle : 3 pour un score, 1 pour un Noul.",
    },
    {
      name: 'label',
      type: 'string',
      required: true,
      check: 'rendered',
      description: "Le nom de ce qui est mesuré, à gauche de la barre.",
    },
    {
      name: 'threshold',
      type: 'number | null',
      required: false,
      check: 'rendered',
      description: "Le seuil comparé, marqué sur la barre ; absent, la barre n'a pas de marque.",
    },
    {
      name: 'confidence',
      type: 'number | null',
      required: false,
      check: 'rendered',
      description: "La confiance attachée à la valeur, affichée en `c0.00` à droite.",
    },
    {
      name: 'thresholdLabel',
      type: '(threshold: number) => string',
      required: false,
      check: 'rendered',
      description:
        "Le texte du seuil, injecté par l'appelant : le cœur n'a pas d'i18n (ADR 0010).",
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "Les classes de l'appelant, fusionnées après celles du composant.",
    },
  ],
  usages: [
    {
      when: "une carte de santé montre l'avancement d'une mesure",
      use: '<Meter label="sessions" value={12} max={20} />',
      avoid: 'la barre compacte, illisible hors d’une cellule dense',
    },
    {
      when: 'une cellule de table dense porte deux mesures côte à côte',
      use: '<CompactMeter label="spec" value={2} max={3} threshold={2} />',
      avoid: 'la barre large : elle ne tient pas dans une colonne',
    },
    {
      when: 'un seuil est marqué sur la barre',
      use: 'thresholdLabel={t.meter.threshold} (le texte vient de l’app)',
      avoid: 'un libellé en dur dans le cœur : il serait monolingue et lié à un produit',
    },
  ],
}