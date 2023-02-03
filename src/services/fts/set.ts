import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, bucketSchema, lexemesSchema, idSchema }
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
      , response: {
          204: { type: 'null' }
        }
      }
    , bodyLimit: WRITE_PAYLOAD_LIMIT()
    }
  , async (req, reply) => {
      const { namespace, bucket, id } = req.params
      const lexemes = req.body

      await api.FTS.set(namespace, bucket, id, lexemes)
      return reply
        .status(204)
        .send()
    }
  )
}
