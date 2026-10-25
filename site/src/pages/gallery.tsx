import { Card, CardContent, CodeBlock } from '@nomosui/react'

import { useI18n } from '../i18n'
import { scenes } from '../scenarios'

/**
 * La galerie de layouts (#41) : des écrans entiers assemblés à partir des briques, chacun
 * rendu puis montré en source (`?raw`), donc copiable et jamais mort. Les scènes vivent
 * dans `src/examples/scenes/` — une source, deux rendus (l'aperçu et le snippet).
 */
export function GalleryPage() {
  const { t } = useI18n()
  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">{t.gallery.title}</h1>
        <p className="max-w-2xl text-muted-foreground">{t.gallery.lead}</p>
      </header>

      {scenes.map((scene) => (
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
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground">{t.gallery.source}</p>
            <CodeBlock code={scene.source} />
          </div>
        </section>
      ))}
    </article>
  )
}
