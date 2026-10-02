import { cleanup, render, screen } from '@testing-library/react'
import { catalogue } from '@nomosui/react'
import { afterEach, describe, expect, it } from 'vitest'

import { ManifestDocs } from './manifest'

afterEach(cleanup)

describe('manifest showcase', () => {
  it('renders every documented variant and usage of every brick', () => {
    for (const entry of catalogue) {
      render(<ManifestDocs manifest={entry.manifest} />)

      for (const variant of entry.manifest.variants) {
        expect(
          screen.getAllByText(variant.name).length,
          `${entry.manifest.name}: variante ${variant.name}`,
        ).toBeGreaterThan(0)
        for (const value of variant.values) {
          expect(
            screen.getAllByText(value).length,
            `${entry.manifest.name}: valeur ${value}`,
          ).toBeGreaterThan(0)
        }
      }

      for (const usage of entry.manifest.usages) {
        expect(
          screen.getAllByText(usage.when).length,
          `${entry.manifest.name}: usage`,
        ).toBeGreaterThan(0)
      }

      cleanup()
    }
  })
})
