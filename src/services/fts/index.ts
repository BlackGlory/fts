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
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  server.register(clearNamespaceRoutes, { api })
  server.register(clearBucketRoutes, { api })
  server.register(deleteRoutes, { api })
  server.register(getAllNamespacesRoutes, { api })
  server.register(getAllBucketRoutes, { api })
  server.register(queryInNamespaceRoutes, { api })
  server.register(queryInBucketsRoutes, { api })
  server.register(setRoutes, { api })
  server.register(getNamespaceStatsoutes, { api })
  server.register(getBucketStatsRoutes, { api })
}
