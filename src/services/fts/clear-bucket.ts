import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, bucketSchema } from '@src/schema.js'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  server.delete<{
    Params: {
      namespace: string
      bucket: string
    }
  }>(
    '/fts/:namespace/buckets/:bucket'
  , {
      schema: {
        params: {
          namespace: namespaceSchema
        , bucket: bucketSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const { namespace, bucket } = req.params

      await api.FTS.clearBucket(namespace, bucket)
      return reply
        .status(204)
        .send()
    }
  )
}
