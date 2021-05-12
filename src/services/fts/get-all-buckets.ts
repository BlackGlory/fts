import { FastifyPluginAsync } from 'fastify'
import { stringifyJSONStreamAsync, stringifyNDJSONStreamAsync } from 'extra-generator'
import { Readable } from 'stream'
import { namespaceSchema } from '@src/schema'
import accepts from 'fastify-accepts'

export const routes: FastifyPluginAsync<{ Core: ICore }> =
async function routes(server, { Core }) {
  server.register(accepts)

  server.get<{
    Params: { namespace: string }
  }>(
    '/fts/:namespace/buckets'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , (req, reply) => {
      const { namespace } = req.params
      const result = Core.FTS.getAllBuckets(namespace)

      const accept = req.accepts().type(['application/json', 'application/x-ndjson'])
      if (accept === 'application/x-ndjson') {
        reply
          .status(200)
          .header('Content-Type', 'application/x-ndjson')
          .send(Readable.from(stringifyNDJSONStreamAsync(result)))
      } else {
        reply
          .status(200)
          .header('Content-Type', 'application/json')
          .send(Readable.from(stringifyJSONStreamAsync(result)))
      }
    }
  )
}
