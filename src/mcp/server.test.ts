import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'

import { APP_VIEW_MIME, appViewUri, compositeViewUri } from '@nomos/mcp/app-view'
import { componentNames } from '@nomos/mcp/catalogue'
import { compositeNames } from '@nomos/mcp/composites'
import { TOKENS_URI, componentUri, createDesignSystemServer } from '@nomos/mcp/server'

/**
 * Le serveur MCP, éprouvé au protocole près : un vrai client branché au serveur par un
 * transport en mémoire. C'est le contrat de la surface agentique (ADR 0003) — outils,
 * ressources, et rien qui écrive.
 */
async function connect(): Promise<Client> {
  return connectWith({})
}

async function connectWith(skin: Record<string, unknown>): Promise<Client> {
  const server = createDesignSystemServer({ skin })
  const client = new Client({ name: 'test-client', version: '0.0.0' })
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)])
  return client
}

function textOf(result: unknown): string {
  const content = (result as { content: { type: string; text?: string }[] }).content
  return content.map((block) => block.text ?? '').join('')
}

describe('le serveur MCP du design system', () => {
  it('expose les trois outils de lecture, décrits au gabarit, et aucun n’écrit', async () => {
    const client = await connect()
    const { tools } = await client.listTools()
    const names = tools.map((tool) => tool.name)

    expect(names).toEqual(
      expect.arrayContaining(['list_components', 'get_component', 'preview_component']),
    )
    for (const tool of tools) {
      expect(tool.description, tool.name).toMatch(/USAGE/)
      expect(tool.description, tool.name).toMatch(/INPUTS/)
      expect(tool.description, tool.name).toMatch(/OUTPUT/)
      expect(tool.description, tool.name).toMatch(/EXAMPLES/)
      expect(tool.name, tool.name).toMatch(/^(list_|get_|preview_|render_)/)
    }
  })

  it('expose une vue ui:// par composant, référencée par l’outil de rendu', async () => {
    const client = await connect()
    const { resources } = await client.listResources()
    const uiUris = resources.map((resource) => resource.uri)

    const { tools } = await client.listTools()

    for (const name of componentNames) {
      expect(uiUris).toContain(appViewUri(name))

      const view = await client.readResource({ uri: appViewUri(name) })
      expect(view.contents[0]?.mimeType).toBe(APP_VIEW_MIME)

      const tool = tools.find((candidate) => candidate.name === `render_${name}`)
      expect(tool, `render_${name}`).toBeDefined()
      expect((tool as { _meta?: { ui?: { resourceUri?: string } } })._meta?.ui?.resourceUri).toBe(
        appViewUri(name),
      )
    }
  })

  it('expose la ressource des tokens et une ressource par composant', async () => {
    const client = await connect()
    const { resources } = await client.listResources()
    const uris = resources.map((resource) => resource.uri)

    expect(uris).toContain(TOKENS_URI)
    for (const name of componentNames) expect(uris).toContain(componentUri(name))
  })

  it('lit un composant par sa ressource', async () => {
    const client = await connect()
    const result = await client.readResource({ uri: componentUri('badge') })
    const first = result.contents[0]
    const text = first && 'text' in first ? first.text : ''

    expect(text).toContain('"name": "badge"')
  })

  it('répond à list_components, avec une recherche déterministe', async () => {
    const client = await connect()
    const all = JSON.parse(textOf(await client.callTool({ name: 'list_components', arguments: {} })))
    expect(all.map((entry: { name: string }) => entry.name).sort()).toEqual(
      [...componentNames].sort(),
    )

    const filtered = JSON.parse(
      textOf(await client.callTool({ name: 'list_components', arguments: { query: 'badge' } })),
    )
    expect(filtered.map((entry: { name: string }) => entry.name)).toEqual(['badge'])
  })

  it('répond à get_component et à preview_component', async () => {
    const client = await connect()
    const component = JSON.parse(
      textOf(await client.callTool({ name: 'get_component', arguments: { name: 'meter' } })),
    )
    expect(component.name).toBe('meter')

    const preview = JSON.parse(
      textOf(await client.callTool({ name: 'preview_component', arguments: { name: 'meter' } })),
    )
    expect(preview.example).toBeDefined()
    expect(preview.usages.length).toBeGreaterThan(0)
  })

  it('répond à une erreur plutôt que de lever, sur un nom inconnu', async () => {
    const client = await connect()
    const result = await client.callTool({ name: 'get_component', arguments: { name: 'grille' } })

    expect((result as { isError?: boolean }).isError).toBe(true)
  })

  it('expose les scènes composites : ressource ui://, listing et outil de rendu', async () => {
    const client = await connect()
    const { resources } = await client.listResources()
    const uris = resources.map((resource) => resource.uri)
    const { tools } = await client.listTools()

    for (const name of compositeNames) {
      expect(uris).toContain(compositeViewUri(name))

      const view = await client.readResource({ uri: compositeViewUri(name) })
      expect(view.contents[0]?.mimeType, name).toBe(APP_VIEW_MIME)

      const tool = tools.find((candidate) => candidate.name === `render_scene_${name}`)
      expect(tool, `render_scene_${name}`).toBeDefined()
      expect((tool as { _meta?: { ui?: { resourceUri?: string } } })._meta?.ui?.resourceUri).toBe(
        compositeViewUri(name),
      )
    }

    const scenes = JSON.parse(
      textOf(await client.callTool({ name: 'list_scenes', arguments: {} })),
    )
    expect(scenes.map((scene: { name: string }) => scene.name).sort()).toEqual(
      [...compositeNames].sort(),
    )
  })

  it('porte un skin (ADR 0022) : ses valeurs arrivent dans la vue et la ressource de tokens', async () => {
    const client = await connectWith({
      semantic: { color: { background: { $value: { colorSpace: 'hsl', components: [12, 34, 56] } } } },
    })

    const view = await client.readResource({ uri: appViewUri('freshness') })
    const html = view.contents[0] && 'text' in view.contents[0] ? view.contents[0].text : ''
    expect(html).toContain('--nomos-color-background: 12 34% 56%')

    const tokens = await client.readResource({ uri: TOKENS_URI })
    const resource = tokens.contents[0] && 'text' in tokens.contents[0] ? tokens.contents[0].text : ''
    expect(resource).toContain('12 34% 56%')
  })

  it('lève à la construction sur un emplacement de skin inconnu', () => {
    expect(() =>
      createDesignSystemServer({
        skin: { semantic: { color: { nope: { $value: 'x' } } } },
      }),
    ).toThrow(/emplacement inconnu/)
  })

  it('render_<nom> et render_scene_<nom> portent les données de l’outil (ADR 0023)', async () => {
    const client = await connect()

    const component = JSON.parse(
      textOf(
        await client.callTool({ name: 'render_badge', arguments: { props: { children: 'GL' } } }),
      ),
    )
    expect(component.props).toEqual({ children: 'GL' })

    const scene = JSON.parse(
      textOf(
        await client.callTool({
          name: 'render_scene_form',
          arguments: { props: { submitLabel: 'Valider' } },
        }),
      ),
    )
    expect(scene.props).toEqual({ submitLabel: 'Valider' })
  })
})
