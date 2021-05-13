import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, bucketsSchema, tokenSchema } from '@src/schema'
import { Readable } from 'stream'
import { stringifyJSONStreamAsync, stringifyNDJSONStreamAsync } from 'extra-generator'
import accepts from 'fastify-accepts'

export const routes: FastifyPluginAsync<{ Core: ICore }> =
async function routes(server, { Core }) {
  server.register(accepts)

  server.post<{
    Params: {
      namespace: string
      buckets: string
    }
    Querystring: {
      token?: string
      limit?: number
    }
    Body: any
  }>(
    '/fts/:namespace/buckets/:buckets/query'
  , {
      schema: {
        params: {
          namespace: namespaceSchema
        , buckets: bucketsSchema
        }
      , querystring: {
          limit: { type: 'integer', exclusiveMinimum: 0 }
        , token: tokenSchema
        }
      , response: {
          200: {
            type: 'array'
          , items: {
              bucket: { type: 'string' }
            , id: { type: 'string' }
            }
          }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const buckets = req.params.buckets.split(',')
      const token = req.query.token
      const limit = req.query.limit
      const expression = req.body

      try {
        await Core.Blacklist.check(namespace)
        await Core.Whitelist.check(namespace)
        await Core.TBAC.checkQueryPermission(namespace, token)
      } catch (e) {
        if (e instanceof Core.Blacklist.Forbidden) return reply.status(403).send()
        if (e instanceof Core.Whitelist.Forbidden) return reply.status(403).send()
        if (e instanceof Core.TBAC.Unauthorized) return reply.status(401).send()
        throw e
      }

      const results = Core.FTS.query(namespace, expression, { buckets, limit })
      const accept = req.accepts().type([
        'application/json'
      , 'application/x-ndjson'
      ])
      if (accept === 'application/x-ndjson') {
        reply
          .status(200)
          .header('Content-Type', 'application/x-ndjson')
          .send(Readable.from(stringifyNDJSONStreamAsync(results)))
      } else {
        reply
          .status(200)
          .header('Content-Type', 'application/json')
          .send(Readable.from(stringifyJSONStreamAsync(results)))
      }
    }
  )
}
