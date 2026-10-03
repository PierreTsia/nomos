import {
  Badge,
  Button,
  Card,
  Code,
  CopyButton,
  Heading,
  Kicker,
  Link,
  Text,
} from '@nomosui/react'

import { bricks, findBrick } from '../catalogue'
import { useI18n } from '../i18n'
import { Preview } from './preview'

const INSTALL = 'npm i @nomosui/react'

/** The six bricks the home showcases with a live render; the full grid lives on `#/catalogue`. */
const featured = ['button', 'card', 'table', 'tabs', 'timeline', 'alert']

/** The brand dot: the site wants the teal accent, which no Kicker tone carries. */
const accentDot = '[--kicker-dot:var(--color-primary)]'

/**
 * The marketing home (`#/`) — the front door (issue #57): the name, the agent-first
 * promise and the one-inventory story, then entry points to the catalogue and the docs.
 * The full catalogue grid lives on its own route (`#/catalogue`, ADR 0005).
 */
export function Home() {
  const { t } = useI18n()

  return (
    <div className="flex flex-col">
      <section className="relative flex flex-col items-center pb-16 pt-10 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-12 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-[100px]"
        />

        <Kicker dot className={`mb-8 ${accentDot}`}>
          {t.landing.kicker}
        </Kicker>

        <div
          aria-hidden
          className="bg-gradient-to-b from-foreground to-primary bg-clip-text text-6xl font-semibold leading-none tracking-tight text-transparent sm:text-8xl"
        >
          νόμος
        </div>

        <Heading level={1} className="mb-3 mt-6 text-4xl tracking-tight sm:text-5xl">
          Nomos
        </Heading>

        <Text className="mb-6 font-mono text-sm text-muted-foreground">
          {t.landing.greekMeaning}
        </Text>

        <Text size="lead" className="mb-10 max-w-2xl leading-relaxed text-muted-foreground sm:text-lg">
          {t.landing.lead}
        </Text>

        <div className="mx-auto flex w-full max-w-md items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-2 font-mono text-sm">
          <span className="flex items-center gap-2.5 overflow-hidden">
            <span className="select-none font-semibold text-primary">$</span>
            <code className="truncate">{INSTALL}</code>
          </span>
          <CopyButton value={INSTALL} variant="ghost" size="sm" className="shrink-0" />
        </div>

        <div className="mb-14 mt-9 flex w-full flex-col items-center justify-center gap-3.5 sm:w-auto sm:flex-row">
          <Button asChild className="w-full rounded-full sm:w-auto">
            <a href="#/catalogue">{t.landing.browseCatalog}</a>
          </Button>
          <Button asChild variant="outline" className="w-full rounded-full sm:w-auto">
            <a href="#/docs/getting-started">{t.landing.readDocs}</a>
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-xs text-muted-foreground">
          <span>{t.landing.statsBricks(bricks.length)}</span>
          <span className="text-border">·</span>
          <span>{t.landing.statsTiers}</span>
          <span className="text-border">·</span>
          <span>{t.landing.statsThemes}</span>
          <span className="text-border">·</span>
          <span className="text-primary">{t.landing.statsLicense}</span>
        </div>
      </section>

      <section className="flex flex-col gap-8 rounded-lg border border-border bg-card p-6 sm:p-10">
        <header className="flex flex-col gap-2">
          <Kicker dot className={accentDot}>
            {t.landing.agent.kicker}
          </Kicker>
          <Heading level={2} className="max-w-3xl text-3xl tracking-tight">
            {t.landing.agent.title}
          </Heading>
          <Text className="max-w-2xl text-muted-foreground">{t.landing.agent.lead}</Text>
        </header>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {t.landing.agent.flow.map((step, index) => (
            <div key={step.title} className="flex flex-col gap-2">
              <span className="font-mono text-xs text-primary">{index + 1}</span>
              <Heading level={4}>{step.title}</Heading>
              <Text size="caption" className="text-muted-foreground">
                {step.body}
              </Text>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-6">
          <Text size="caption" className="font-medium text-muted-foreground">
            {t.landing.agent.getsLabel}
          </Text>
          <div className="flex flex-wrap gap-2">
            {t.landing.agent.gets.map((item) => (
              <Badge key={item} variant="outline" className="font-mono">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <header className="mb-12 flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Kicker dot className={accentDot}>
              {t.landing.inventoryKicker}
            </Kicker>
            <Heading level={2} className="mt-2 text-3xl tracking-tight">
              {t.landing.inventoryTitle}
            </Heading>
            <Text className="mt-1.5 max-w-xl text-muted-foreground">
              {t.landing.inventoryBody}
            </Text>
          </div>
          <div className="flex items-center gap-2 self-start rounded border border-border bg-card px-3 py-1.5 font-mono text-xs text-muted-foreground md:self-auto">
            <span className="size-1.5 rounded-full bg-primary" />
            {t.landing.generated}
          </div>
        </header>

        <div className="rounded-lg border border-border bg-card p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {t.landing.renderings.map((rendering) => (
              <div key={rendering.kicker} className="space-y-1.5">
                <Kicker dot className={accentDot}>
                  {rendering.kicker}
                </Kicker>
                <Heading level={4}>{rendering.title}</Heading>
                <Text size="caption" className="text-muted-foreground">
                  {rendering.body}
                </Text>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6 border-t border-border py-16">
        <Kicker dot className={accentDot}>
          {t.landing.boundary.kicker}
        </Kicker>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Card>
            <div className="flex flex-col gap-2 p-6">
              <Heading level={4}>{t.landing.boundary.title}</Heading>
              <Text className="text-muted-foreground">{t.landing.boundary.body}</Text>
            </div>
          </Card>
          <Card>
            <div className="flex flex-col gap-2 p-6">
              <Heading level={4}>{t.landing.boundary.skinTitle}</Heading>
              <Text className="text-muted-foreground">{t.landing.boundary.skinBody}</Text>
            </div>
          </Card>
        </div>
      </section>

      <section className="flex flex-col gap-8 border-t border-border py-16">
        <header className="flex flex-col gap-1.5">
          <Heading level={2} className="text-3xl tracking-tight">
            {t.landing.showcaseTitle}
          </Heading>
          <Text className="max-w-2xl text-muted-foreground">{t.landing.showcaseLead}</Text>
        </header>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((name) => {
            const brick = findBrick(name)
            if (!brick) return null
            return (
              <Card
                key={brick.name}
                className="flex h-full flex-col p-5 transition-colors hover:border-ring"
              >
                <div className="mb-6 flex items-center justify-between font-mono text-xs">
                  <Link
                    href={`#/brick/${brick.name}`}
                    className="font-medium text-foreground hover:no-underline"
                  >
                    {brick.name}
                  </Link>
                  <span className="text-[11px] text-muted-foreground">{t.levels[brick.level]}</span>
                </div>

                <div className="flex min-h-[130px] items-center justify-center rounded-md border border-border bg-muted/40 p-5">
                  <Preview entry={brick.entry} />
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-border pt-3">
                  <Code className="font-mono text-[11px]">{`<${brick.name} />`}</Code>
                  <Link href={`#/brick/${brick.name}`} className="text-[11px]">
                    {t.landing.spec}
                  </Link>
                </div>
              </Card>
            )
          })}
        </div>

        <Link href="#/catalogue" className="self-start text-sm">
          {t.landing.browseAll}
        </Link>
      </section>

      <section className="flex flex-col items-center gap-4 border-t border-border py-16 text-center">
        <Heading level={2} className="text-2xl tracking-tight">
          {t.landing.entriesTitle}
        </Heading>
        <div className="flex w-full flex-col items-center justify-center gap-3.5 sm:w-auto sm:flex-row">
          <Button asChild className="w-full rounded-full sm:w-auto">
            <a href="#/catalogue">{t.landing.browseCatalog}</a>
          </Button>
          <Button asChild variant="outline" className="w-full rounded-full sm:w-auto">
            <a href="#/docs/getting-started">{t.landing.readDocs}</a>
          </Button>
        </div>
      </section>
    </div>
  )
}
