import { Card, CardContent, CodeBlock } from '@nomosui/react'
import { sceneSnippets } from 'virtual:nomos-snippets'

import { useI18n } from '../i18n'
import { scenes } from '../scenarios'

/**
 * The layout gallery (#41): whole screens assembled from the bricks, each rendered and shown
 * in highlighted source (built at build time from the same file), so copyable and never dead.
 * The scenes live in `src/examples/scenes/`.
 *
 * These scenes are **site-owned**, deliberately distinct from the MCP's
 * `ui://nomos/composite/*` scenes (ADR 0037, superseding ADR 0031 dec. 1 for the gallery):
 * a composite is a view that takes host props and is not copyable, while a gallery scene
 * compiles in the site build and is. The published package ships no TSX, so the site could
 * render a composite but never show its source — the one thing this gallery is for.
 */
export function GalleryPage() {
  const { t } = useI18n()
  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">{t.gallery.title}</h1>
        <p className="max-w-2xl text-muted-foreground">{t.gallery.lead}</p>
      </header>

      {scenes.map((scene) => {
        const code = sceneSnippets[scene.name]
        return (
          <section key={scene.name} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold">{scene.title}</h2>
              <p className="max-w-2xl text-sm text-muted-foreground">{scene.summary}</p>
            </div>
            <Card>
              <CardContent className="flex items-center justify-center p-6">
                <scene.Example />
              </CardContent>
            </Card>
            {code ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-muted-foreground">{t.gallery.source}</p>
                <CodeBlock code={code.raw}>
                  <span dangerouslySetInnerHTML={{ __html: code.html }} />
                </CodeBlock>
              </div>
            ) : null}
          </section>
        )
      })}
    </article>
  )
}
