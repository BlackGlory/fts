import { go } from '@blackglory/prelude'
import * as Config from '@dao/config/database.js'
import * as Data from '@dao/data/utils.js'
import { buildServer } from './server.js'
import { PORT, HOST, NODE_ENV, NodeEnv } from '@env/index.js'
import { youDied } from 'you-died'

// eslint-disable-next-line
go(async () => {
  Config.openDatabase()
  youDied(() => Config.closeDatabase())
  await Config.prepareDatabase()

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
