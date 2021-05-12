import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, bucketSchema } from '@src/schema'

export const routes: FastifyPluginAsync<{ Core: ICore }> =
async function routes(server, { Core }) {
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

      const result = await Core.FTS.getBucketStats(namespace, bucket)
      reply.send(result)
    }
  )
}
