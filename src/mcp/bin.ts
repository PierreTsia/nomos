import { readFileSync } from 'node:fs'

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

import { createDesignSystemServer } from '@nomos/mcp/server'

/**
 * Le point d'entrée stdio du serveur MCP du design system : `npm run mcp` depuis le
 * paquet. Il ne lit que le catalogue et la ressource de tokens, n'ouvre rien d'autre.
 *
 * `NOMOS_SKIN` pointe un overlay de skin (ADR 0022) : le serveur sert alors les valeurs de
 * cette app au lieu du défaut du cœur.
 */
const skinPath = process.env.NOMOS_SKIN
const skin = skinPath ? JSON.parse(readFileSync(skinPath, 'utf8')) : undefined

const server = createDesignSystemServer({ skin })
await server.connect(new StdioServerTransport())
