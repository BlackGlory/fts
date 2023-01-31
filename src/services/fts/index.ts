import { FastifyPluginAsync } from 'fastify'
import { routes as clearNamespaceRoutes } from './clear-namespace.js'
import { routes as clearBucketRoutes } from './clear-bucket.js'
import { routes as deleteRoutes } from './delete.js'
import { routes as getAllNamespacesRoutes } from './get-all-namespaces.js'
import { routes as getAllBucketRoutes } from './get-all-buckets.js'
import { routes as queryInNamespaceRoutes } from './query-in-namespace.js'
import { routes as queryInBucketsRoutes } from './query-in-buckets.js'
import { routes as setRoutes } from './set.js'
import { routes as getNamespaceStatsoutes } from './get-namespace-stats.js'
import { routes as getBucketStatsRoutes } from './get-bucket-stats.js'

export const routes: FastifyPluginAsync<{ Core: ICore }> =
async function routes(server, { Core }) {
  server.register(clearNamespaceRoutes, { Core })
  server.register(clearBucketRoutes, { Core })
  server.register(deleteRoutes, { Core })
  server.register(getAllNamespacesRoutes, { Core })
  server.register(getAllBucketRoutes, { Core })
  server.register(queryInNamespaceRoutes, { Core })
  server.register(queryInBucketsRoutes, { Core })
  server.register(setRoutes, { Core })
  server.register(getNamespaceStatsoutes, { Core })
  server.register(getBucketStatsRoutes, { Core })
}
