import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, bucketSchema, tokenSchema, lexemesSchema, idSchema }
  from '@src/schema.js'
import { WRITE_PAYLOAD_LIMIT } from '@env/index.js'

export const routes: FastifyPluginAsync<{ Core: ICore }> =
async function routes(server, { Core }) {
  server.put<{
    Params: {
      namespace: string
      bucket: string
      id: string
    }
    Querystring: { token?: string }
    Body: string[]
  }>(
    '/fts/:namespace/buckets/:bucket/objects/:id'
  , {
      schema: {
        params: {
          namespace: namespaceSchema
        , bucket: bucketSchema
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
      const { namespace, bucket, id } = req.params
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

      await Core.FTS.set(namespace, bucket, id, lexemes)
      return reply
        .status(204)
        .send()
    }
  )
}
