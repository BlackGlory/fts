import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, bucketSchema } from '@src/schema.js'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  server.get<{
    Params: {
      namespace: string
      bucket: string
    }
  }>(
    '/fts/:namespace/buckets/:bucket/stats'
  , {
      schema: {
        params: {
          namespace: namespaceSchema
        , bucket: bucketSchema
        }
      , response: {
          200: {
            namespace: { type: 'string' }
          , bucket: { type: 'string' }
          , objects: { type: 'integer' }
          }
        }
      }
    }
  , async (req, reply) => {
      const { namespace, bucket } = req.params

      const result = await api.FTS.getBucketStats(namespace, bucket)
      return reply.send(result)
    }
  )
}
