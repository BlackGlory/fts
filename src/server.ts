import fastify from 'fastify'
import cors from 'fastify-cors'
import metricsPlugin = require('fastify-metrics')
import { Registry } from 'prom-client'
import { routes as fts } from '@services/fts'
import { routes as admin } from '@services/admin'
import { routes as robots } from '@services/robots'
import { HTTP2, PAYLOAD_LIMIT, NODE_ENV, NodeEnv } from '@env'
import { Core } from '@core'

type FTSLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'

export function buildServer() {
  const server = fastify({
    logger: getLoggerOptions()
  , maxParamLength: 600
    /* @ts-ignore */
  , http2: HTTP2()
  , bodyLimit: PAYLOAD_LIMIT()
  })
  server.register(metricsPlugin, {
    endpoint: '/metrics'
  , register: new Registry()
  })

  server.register(cors, { origin: true })
  server.register(fts, { Core })
  server.register(admin, { Core })
  server.register(robots)

  return server
}

function getLoggerOptions(): { level: FTSLevel } | boolean {
  switch (NODE_ENV()) {
    case NodeEnv.Test: return false
    case NodeEnv.Production: return { level: 'error' }
    case NodeEnv.Development: return { level: 'trace' }
    default: return false
  }
}
