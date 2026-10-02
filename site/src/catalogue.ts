import { catalogue, type CatalogueEntry } from '@nomosui/react'

export type Brick = {
  name: string
  title: string
  summary: string
  level: CatalogueEntry['manifest']['level']
  entry: CatalogueEntry
}

/**
 * The site's bricks come straight from the catalogued inventory (ADR 0005): no page is
 * hand-listed, so the site can never diverge from the catalogue.
 */
export const bricks: Brick[] = catalogue.map((entry) => ({
  name: entry.manifest.name,
  title: entry.manifest.title,
  summary: entry.manifest.summary,
  level: entry.manifest.level,
  entry,
}))

export const levels: Brick['level'][] = ['jeton', 'primitive', 'bloc']

export function findBrick(name: string): Brick | undefined {
  return bricks.find((brick) => brick.name === name)
}
