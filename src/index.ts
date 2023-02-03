import { go } from '@blackglory/prelude'
import * as Data from '@dao/utils.js'
import { buildServer } from './server.js'
import { PORT, HOST, NODE_ENV, NodeEnv } from '@env/index.js'

// eslint-disable-next-line
go(async () => {
  await Data.ensureDatabase()
  await Data.migrateDatabase()

  const server = await buildServer()
  await server.listen({
    host: HOST()
  , port: PORT()
  })
  if (NODE_ENV() === NodeEnv.Test) process.exit()

  process.send?.('ready')
})
