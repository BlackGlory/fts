import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, bucketSchema, idSchema } from '@src/schema.js'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  server.delete<{
    Params: {
      namespace: string
      bucket: string
      id: string
    }
  }>(
    '/fts/:namespace/buckets/:bucket/objects/:id'
  , {
      schema: {
        params: {
          namespace: namespaceSchema
        , bucket: bucketSchema
        , id: idSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const { namespace, bucket, id } = req.params

      await api.FTS.del(namespace, bucket, id)
      return reply
        .status(204)
        .send()
    }
  )
}
