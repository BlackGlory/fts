import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, bucketsSchema, tokenSchema } from '@src/schema.js'
import { Readable } from 'stream'
import { stringifyJSONStreamAsync, stringifyNDJSONStreamAsync } from 'extra-generator'
import accepts from '@fastify/accepts'

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
      offset?: number
    }
    Body: IQueryExpression
  }>(
    '/fts/:namespace/buckets/:buckets/query'
  , {
      schema: {
        params: {
          namespace: namespaceSchema
        , buckets: bucketsSchema
        }
      , querystring: {
          limit: { type: 'integer', minimum: 1 }
        , offset: { type: 'integer', minimum: 0 }
        , token: tokenSchema
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const buckets = req.params.buckets.split(',')
      const { token, limit, offset } = req.query
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

      const results = Core.FTS.query(namespace, expression, { buckets, limit, offset })
      const accept = req.accepts().type([
        'application/json'
      , 'application/x-ndjson'
      ])
      if (accept === 'application/x-ndjson') {
        const stream = Readable.from(stringifyNDJSONStreamAsync(results))
        stream.once('error', err => reply.status(400).send(err))
        return reply
          .status(200)
          .header('Content-Type', 'application/x-ndjson')
          .send(stream)
      } else {
        const stream = Readable.from(stringifyJSONStreamAsync(results))
        stream.once('error', err => reply.status(400).send(err))
        return reply
          .status(200)
          .header('Content-Type', 'application/json')
          .send(stream)
      }
    }
  )
}
