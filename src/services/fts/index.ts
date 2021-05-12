import { FastifyPluginAsync } from 'fastify'
import { routes as clearNamespaceRoutes } from './clear-namespace'
import { routes as clearBucketRoutes } from './clear-bucket'
import { routes as deleteRoutes } from './delete'
import { routes as getAllNamespacesRoutes } from './get-all-namespaces'
import { routes as getAllBucketRoutes } from './get-all-buckets'
import { routes as queryInNamespaceRoutes } from './query-in-namespace'
import { routes as queryInBucketsRoutes } from './query-in-buckets'
import { routes as setRoutes } from './set'
import { routes as getNamespaceStatsoutes } from './get-namespace-stats'
import { routes as getBucketStatsRoutes } from './get-bucket-stats'

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
