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
  await server.register(clearNamespaceRoutes, { api })
  await server.register(clearBucketRoutes, { api })
  await server.register(deleteRoutes, { api })
  await server.register(getAllNamespacesRoutes, { api })
  await server.register(getAllBucketRoutes, { api })
  await server.register(queryInNamespaceRoutes, { api })
  await server.register(queryInBucketsRoutes, { api })
  await server.register(setRoutes, { api })
  await server.register(getNamespaceStatsoutes, { api })
  await server.register(getBucketStatsRoutes, { api })
}
