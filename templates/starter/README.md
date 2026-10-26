# Nomos starter

A runnable three-page app built on [`@nomosui/react`](https://www.npmjs.com/package/@nomosui/react):
a dashboard, a faceted list, and a form. It is the starting point an adopter (or an agent)
copies and fills — Nomos ships the bricks, this template owns the app.

## What's inside

- **App-side shell** — `src/App.tsx`: a `Navbar`, a `Footer`, a `ToastProvider`, and a tiny
  hash router (`src/router.ts`). Nomos has no layout brick and no router (ADR 0002); the app
  owns both.
- **Three pages** — `src/pages/`: `dashboard-page`, `items-page` (a `FacetedDataTable`),
  `new-item-page` (a form that raises a toast).
- **A skin** — `skin.json` (a semantic token overlay), compiled to `src/skin.generated.css`
  by `scripts/skin.build.mjs` via `renderCss(resolveSkin(tokens, skin))` (ADR 0022/0025).
  Every colour lives in `skin.json`; nothing is hardcoded.

## Run it

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check, derive the skin CSS, and build
npm test
```

`npm run dev` and `npm run build` replay `scripts/skin.build.mjs` first (`predev` / `prebuild`),
so a change to `skin.json` is always reflected. Run `npm run skin` alone to regenerate
`src/skin.generated.css` — do not edit that file by hand.

## Make it yours

1. **Rename** — set `name` in `package.json`; retitle the brand in `src/App.tsx`.
2. **Skin** — edit `skin.json`: override any **semantic** slot (`color.primary`, `color.brand`,
   `radius.control`, …). An unknown slot throws at build (the theme interface is the core
   default's); a `primitive` is refused. Then `npm run skin` (or just `npm run dev`).
3. **Pages** — replace `src/pages/*` and `src/data.ts`. Compose from the catalogue: every
   brick's props, variants and usages are in its manifest, served by the MCP
   (`npm run mcp`) and on the public catalogue. Map intent → bricks → pages.
4. **State, data, i18n** — all app-side. Fetch where the app fetches; pass labels as props
   (`FacetedDataTable` takes a `labels` object, never i18n from the heart).

## The boundary

This app imports Nomos; Nomos never imports this app. Nothing here may enter `@nomosui/react`,
and the core never reads `templates/**` (ADR 0002, 0028). Keep it that way and the heart stays
app-agnostic.
