import { Badge, Card, CardContent, CardHeader, CardTitle } from '@nomosui/react'
import type { ComponentManifest } from '@nomosui/react'

import { useI18n } from '../i18n'

export function ManifestDocs({ manifest }: { manifest: ComponentManifest }) {
  const { t } = useI18n()
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          {t.manifest.props(manifest.props.length)}
        </h2>
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">{t.manifest.name}</th>
                <th className="px-4 py-2 font-medium">{t.manifest.type}</th>
                <th className="px-4 py-2 font-medium">{t.manifest.defaultValue}</th>
                <th className="px-4 py-2 font-medium">{t.manifest.description}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {manifest.props.map((prop) => (
                <tr key={prop.name}>
                  <td className="px-4 py-2 align-top">
                    <code>{prop.name}</code>
                    {prop.required ? <span className="text-destructive"> *</span> : null}
                  </td>
                  <td className="px-4 py-2 align-top">
                    <code className="text-muted-foreground">{prop.type}</code>
                  </td>
                  <td className="px-4 py-2 align-top">
                    {prop.default ? (
                      <code>{prop.default}</code>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2 align-top text-muted-foreground">{prop.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {manifest.variants.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {t.manifest.variants(manifest.variants.length)}
          </h2>
          <div className="flex flex-col gap-3">
            {manifest.variants.map((variant) => (
              <Card key={variant.name}>
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-base">
                      <code>{variant.name}</code>
                    </CardTitle>
                    {variant.default ? (
                      <Badge variant="secondary">{t.manifest.defaultBadge(variant.default)}</Badge>
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground">{variant.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {variant.values.map((value) => (
                      <Badge key={value} variant="outline">
                        {value}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          {t.manifest.usages(manifest.usages.length)}
        </h2>
        <div className="flex flex-col gap-3">
          {manifest.usages.map((usage, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-base">{usage.when}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-sm">
                <p>
                  <span className="text-muted-foreground">{t.manifest.use} </span>
                  <code>{usage.use}</code>
                </p>
                {usage.avoid ? (
                  <p>
                    <span className="text-muted-foreground">{t.manifest.avoid} </span>
                    <code>{usage.avoid}</code>
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
