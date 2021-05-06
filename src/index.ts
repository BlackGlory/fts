import { go } from '@blackglory/go'
import * as ConfigInSQLite3 from '@dao/config-in-sqlite3/database'
import * as DataInPostgreSQL from '@src/dao/data-in-postgresql/utils'
import { buildServer } from './server'
import { PORT, HOST, CI } from '@env'

process.on('exit', () => {
  ConfigInSQLite3.closeDatabase()
})
process.on('SIGHUP', () => process.exit(128 + 1))
process.on('SIGINT', () => process.exit(128 + 2))
process.on('SIGTERM', () => process.exit(128 + 15))

go(async () => {
  ConfigInSQLite3.openDatabase()
  ConfigInSQLite3.prepareDatabase()

  await DataInPostgreSQL.ensureDatabase()
  await DataInPostgreSQL.migrateDatabase()

  const server = buildServer()
  await server.listen(PORT(), HOST())
  if (CI()) await process.exit()

  process.send?.('ready')
})
