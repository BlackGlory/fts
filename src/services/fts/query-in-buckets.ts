import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, bucketsSchema, tokenSchema } from '@src/schema.js'
import { Readable } from 'stream'
import { stringifyJSONStreamAsync, stringifyNDJSONStreamAsync } from 'extra-generator'
import accepts from '@fastify/accepts'
import { IAPI, IQueryExpression } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
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
        api.Blacklist.check(namespace)
        api.Whitelist.check(namespace)
        api.TBAC.checkQueryPermission(namespace, token)
      } catch (e) {
        if (e instanceof api.Blacklist.Forbidden) return reply.status(403).send()
        if (e instanceof api.Whitelist.Forbidden) return reply.status(403).send()
        if (e instanceof api.TBAC.Unauthorized) return reply.status(401).send()
        throw e
      }

      const results = api.FTS.query(namespace, expression, { buckets, limit, offset })
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
