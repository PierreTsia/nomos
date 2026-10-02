import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@nomosui/react'

export function App() {
  return (
    <main className="min-h-dvh bg-background p-8 text-foreground">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Nomos</h1>
          <Badge variant="secondary">catalogue site</Badge>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>The public site, generated from the catalogue</CardTitle>
            <CardDescription>
              A consumer of <code>@nomosui/react</code> — the ancillary skeleton of ADR 0028.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button>Primary</Button>
            <Button variant="outline">Outline</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
