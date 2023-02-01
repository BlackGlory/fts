import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, tokenSchema, bucketSchema } from '@src/schema.js'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  server.delete<{
    Params: {
      namespace: string
      bucket: string
    }
    Querystring: { token?: string }
  }>(
    '/fts/:namespace/buckets/:bucket'
  , {
      schema: {
        params: {
          namespace: namespaceSchema
        , bucket: bucketSchema
        }
      , querystring: { token: tokenSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const { namespace, bucket } = req.params
      const token = req.query.token

      try {
        api.Blacklist.check(namespace)
        api.Whitelist.check(namespace)
        api.TBAC.checkDeletePermission(namespace, token)
      } catch (e) {
        if (e instanceof api.Blacklist.Forbidden) return reply.status(403).send()
        if (e instanceof api.Whitelist.Forbidden) return reply.status(403).send()
        if (e instanceof api.TBAC.Unauthorized) return reply.status(401).send()
        throw e
      }

      await api.FTS.clearBucket(namespace, bucket)
      return reply
        .status(204)
        .send()
    }
  )
}
