import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema } from '@src/schema.js'

export const routes: FastifyPluginAsync<{ Core: ICore }> =
async function routes(server, { Core }) {
  server.get<{
    Params: { namespace: string }
  }>(
    '/fts/:namespace/stats'
  , {
      schema: {
        params: {
          namespace: namespaceSchema
        }
      , response: {
          200: {
            namespace: { type: 'string' }
          , buckets: { type: 'integer' }
          , objects: { type: 'integer' }
          }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace

      const result = await Core.FTS.getNamespaceStats(namespace)
      return reply.send(result)
    }
  )
}
