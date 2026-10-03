import type { ReactElement } from 'react'

import { Alert } from '@nomos/components/alert/alert'
import { Badge } from '@nomos/components/badge/badge'
import { Button } from '@nomos/components/button/button'
import { Card, CardContent, CardHeader, CardTitle } from '@nomos/components/card/card'
import { Field } from '@nomos/components/field/field'
import { Form } from '@nomos/components/form/form'
import { Input } from '@nomos/components/input/input'
import { NumberField } from '@nomos/components/number-field/number-field'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@nomos/components/sheet/sheet'

/**
 * Les **scènes composites** (ADR 0019) : plusieurs briques du catalogue assemblées en une
 * vue qui a du sens pour un agent — un formulaire complet, une carte de statut. Elles ne
 * sont pas au catalogue des composants : ce sont des **rendus**, servis comme vues MCP
 * Apps (`ui://nomos/composite/<nom>`) et exposés sur la surface publique JS (ADR 0031).
 * Aucune n'écrit ni ne possède d'état, et leurs défauts sont neutres : la copie se
 * **injecte par props** (ADR 0002).
 */
export type Composite = {
  name: string
  title: string
  summary: string
  /** Rend la scène pour des données propres à la scène (ADR 0023) ; sans données, son rendu par défaut. */
  render: (props?: Record<string, unknown>) => ReactElement
}

export const composites: Composite[] = [
  {
    name: 'form',
    title: 'Form',
    summary: 'An end-to-end form — a grid of fields and actions — assembled from the core bricks.',
    render: (props = {}) => (
      <div style={{ maxWidth: 640, margin: '0 auto', padding: 16 }}>
        <Form
          columns={2}
          actions={
            <>
              <Button variant="outline">Cancel</Button>
              <Button>{String(props.submitLabel ?? 'Save')}</Button>
            </>
          }
        >
          <Field label="Name" htmlFor="scene-form-name">
            <Input id="scene-form-name" defaultValue={String(props.name ?? 'Item 42')} />
          </Field>
          <Field label="Score" htmlFor="scene-form-score" hint="from 1 to 5">
            <NumberField
              id="scene-form-score"
              min={1}
              max={5}
              defaultValue="3"
              aria-label="score"
            />
          </Field>
        </Form>
      </div>
    ),
  },
  {
    name: 'status',
    title: 'Status card',
    summary: 'A status: a card, a state badge and a gap banner.',
    render: (props = {}) => (
      <div
        style={{
          maxWidth: 640,
          margin: '0 auto',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <Card>
          <CardHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CardTitle>{String(props.product ?? 'Product')}</CardTitle>
              <Badge variant="outline">{String(props.status ?? 'available')}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Alert tone="warning" title="missing signals">
              {String(props.gap ?? 'Monitoring: token not configured — a gap, not a zero.')}
            </Alert>
          </CardContent>
        </Card>
      </div>
    ),
  },
  {
    name: 'overlay',
    title: 'Overlay',
    summary: 'An open panel: the scrim, the stacking and the motion come from the tokens (ADR 0027).',
    render: (props = {}) => (
      <div style={{ padding: 16 }}>
        <Sheet open>
          <SheetTrigger asChild>
            <Button>{String(props.trigger ?? 'Open')}</Button>
          </SheetTrigger>
          <SheetContent side={(props.side as 'top' | 'bottom' | 'left' | 'right') ?? 'right'}>
            <SheetHeader>
              <SheetTitle>{String(props.title ?? 'Panel')}</SheetTitle>
              <SheetDescription>
                {String(props.body ?? 'A floating layer served as a view.')}
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    ),
  },
]

export const compositeNames = composites.map((composite) => composite.name)

export function findComposite(name: string): Composite {
  const composite = composites.find((candidate) => candidate.name === name)
  if (!composite) {
    throw new Error(
      `Scenes: composite not found: \`${name}\` (known: ${compositeNames.join(', ')}).`,
    )
  }
  return composite
}
