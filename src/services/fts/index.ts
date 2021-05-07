import { FastifyPluginAsync } from 'fastify'
import { routes as clearRoutes } from './clear'
import { routes as deleteRoutes } from './delete'
import { routes as getAllNamespacesRoutes } from './get-all-namespaces'
import { routes as queryRoutes } from './query'
import { routes as setRoutes } from './set'
import { routes as statsRoutes } from './stats'

export const routes: FastifyPluginAsync<{ Core: ICore }> =
async function routes(server, { Core }) {
  server.register(clearRoutes, { Core })
  server.register(deleteRoutes, { Core })
  server.register(getAllNamespacesRoutes, { Core })
  server.register(queryRoutes, { Core })
  server.register(setRoutes, { Core })
  server.register(statsRoutes, { Core })
}
