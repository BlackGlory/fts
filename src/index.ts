import { go } from '@blackglory/prelude'
import * as ConfigInSQLite3 from '@dao/config-in-sqlite3/database.js'
import * as DataInPostgreSQL from '@dao/data-in-postgresql/utils.js'
import { buildServer } from './server.js'
import { PORT, HOST, NODE_ENV, NodeEnv } from '@env/index.js'
import { youDied } from 'you-died'

go(async () => {
  ConfigInSQLite3.openDatabase()
  youDied(() => ConfigInSQLite3.closeDatabase())
  ConfigInSQLite3.prepareDatabase()

  await DataInPostgreSQL.ensureDatabase()
  await DataInPostgreSQL.migrateDatabase()

  const server = buildServer()
  await server.listen({
    host: HOST()
  , port: PORT()
  })
  if (NODE_ENV() === NodeEnv.Test) process.exit()

  process.send?.('ready')
})
