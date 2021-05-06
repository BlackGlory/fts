import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, tokenSchema, lexemesSchema, idSchema } from '@src/schema'
import { WRITE_PAYLOAD_LIMIT } from '@env'

export const routes: FastifyPluginAsync<{ Core: ICore }> =
async function routes(server, { Core }) {
  server.post<{
    Params: {
      namespace: string
      id: string
    }
    Querystring: { token?: string }
    Body: string[]
  }>(
    '/fts/:namespace/objects/:id'
  , {
      schema: {
        params: {
          namespace: namespaceSchema
        , id: idSchema
        }
      , body: lexemesSchema
      , querystring: { token: tokenSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    , bodyLimit: WRITE_PAYLOAD_LIMIT()
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const id = req.params.id
      const lexemes = req.body
      const token = req.query.token

      try {
        await Core.Blacklist.check(namespace)
        await Core.Whitelist.check(namespace)
        await Core.TBAC.checkWritePermission(namespace, token)
      } catch (e) {
        if (e instanceof Core.Blacklist.Forbidden) return reply.status(403).send()
        if (e instanceof Core.Whitelist.Forbidden) return reply.status(403).send()
        if (e instanceof Core.TBAC.Unauthorized) return reply.status(401).send()
        throw e
      }

      await Core.FTS.set(namespace, id, lexemes)
      reply.status(204).send()
    }
  )
}
