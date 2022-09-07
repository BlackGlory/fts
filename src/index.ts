import { go } from '@blackglory/go'
import * as ConfigInSQLite3 from '@dao/config-in-sqlite3/database'
import * as DataInPostgreSQL from '@dao/data-in-postgresql/utils'
import { buildServer } from './server'
import { PORT, HOST, NODE_ENV, NodeEnv } from '@env'
import { youDied } from 'you-died'

go(async () => {
  ConfigInSQLite3.openDatabase()
  youDied(() => ConfigInSQLite3.closeDatabase())
  ConfigInSQLite3.prepareDatabase()

  await DataInPostgreSQL.ensureDatabase()
  await DataInPostgreSQL.migrateDatabase()

  const server = buildServer()
  await server.listen(PORT(), HOST())
  if (NODE_ENV() === NodeEnv.Test) process.exit()

  process.send?.('ready')
})
