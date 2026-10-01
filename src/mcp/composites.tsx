import type { ReactElement } from 'react'

import { Alert } from '@nomos/components/alert/alert'
import { Badge } from '@nomos/components/badge/badge'
import { Button } from '@nomos/components/button/button'
import { Card, CardContent, CardHeader, CardTitle } from '@nomos/components/card/card'
import { Field } from '@nomos/components/field/field'
import { Form } from '@nomos/components/form/form'
import { Input } from '@nomos/components/input/input'
import { NumberField } from '@nomos/components/number-field/number-field'

/**
 * Les **scènes composites** (ADR 0013) : plusieurs briques du catalogue assemblées en une
 * vue qui a du sens pour un agent — un formulaire complet, une carte de statut. Elles ne
 * sont pas au catalogue des composants : ce sont des **rendus**, servis comme vues MCP
 * Apps (`ui://nomos/composite/<nom>`). Aucune n'écrit ni ne possède d'état.
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
    title: 'Formulaire',
    summary: "Un formulaire de bout en bout — grille de champs et actions — monté avec les briques du cœur.",
    render: (props = {}) => (
      <div style={{ maxWidth: 640, margin: '0 auto', padding: 16 }}>
        <Form
          columns={2}
          actions={
            <>
              <Button variant="outline">Annuler</Button>
              <Button>{String(props.submitLabel ?? 'Enregistrer')}</Button>
            </>
          }
        >
          <Field label="Nom" htmlFor="scene-form-name">
            <Input id="scene-form-name" defaultValue={String(props.name ?? 'élément 42')} />
          </Field>
          <Field label="Score" htmlFor="scene-form-score" hint="de 1 à 5">
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
    title: 'Carte de statut',
    summary: "Un statut de production : une carte, une étiquette d'état et un bandeau de lacunes.",
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
              <CardTitle>{String(props.product ?? 'GymLogic')}</CardTitle>
              <Badge variant="outline">{String(props.status ?? 'disponible')}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Alert tone="warning" title="signaux illisibles">
              {String(props.gap ?? 'Sentry : jeton non configuré — une lacune, pas un zéro.')}
            </Alert>
          </CardContent>
        </Card>
      </div>
    ),
  },
]

export const compositeNames = composites.map((composite) => composite.name)

export function findComposite(name: string): Composite {
  const composite = composites.find((candidate) => candidate.name === name)
  if (!composite) {
    throw new Error(
      `Scènes : composite introuvable : \`${name}\` (connues : ${compositeNames.join(', ')}).`,
    )
  }
  return composite
}
