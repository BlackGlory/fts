import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, tokenSchema, bucketSchema } from '@src/schema'

export const routes: FastifyPluginAsync<{ Core: ICore }> =
async function routes(server, { Core }) {
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
        await Core.Blacklist.check(namespace)
        await Core.Whitelist.check(namespace)
        await Core.TBAC.checkDeletePermission(namespace, token)
      } catch (e) {
        if (e instanceof Core.Blacklist.Forbidden) return reply.status(403).send()
        if (e instanceof Core.Whitelist.Forbidden) return reply.status(403).send()
        if (e instanceof Core.TBAC.Unauthorized) return reply.status(401).send()
        throw e
      }

      await Core.FTS.clearBucket(namespace, bucket)
      reply.status(204).send()
    }
  )
}
