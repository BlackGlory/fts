import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, bucketSchema, tokenSchema, lexemesSchema, idSchema }
  from '@src/schema.js'
import { WRITE_PAYLOAD_LIMIT } from '@env/index.js'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
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
        api.Blacklist.check(namespace)
        api.Whitelist.check(namespace)
        api.TBAC.checkWritePermission(namespace, token)
      } catch (e) {
        if (e instanceof api.Blacklist.Forbidden) return reply.status(403).send()
        if (e instanceof api.Whitelist.Forbidden) return reply.status(403).send()
        if (e instanceof api.TBAC.Unauthorized) return reply.status(401).send()
        throw e
      }

      await api.FTS.set(namespace, bucket, id, lexemes)
      return reply
        .status(204)
        .send()
    }
  )
}
