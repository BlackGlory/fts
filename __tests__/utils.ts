import * as ConfigInSQLite3 from '@dao/config/database.js'
import * as DataInPostgreSQL from '@dao/data/utils.js'
import { resetCache } from '@env/cache.js'
import { buildServer } from '@src/server.js'
import { db } from '@dao/data/database.js'
import Ajv from 'ajv'

const ajv = new Ajv.default()
let server: ReturnType<typeof buildServer>
let address: string

export function getAddress() {
  return address
}

export async function startService() {
  await DataInPostgreSQL.ensureDatabase()
  await DataInPostgreSQL.migrateDatabase()
  await initializeDatabases()

  server = buildServer()
  address = await server.listen()
}

export async function stopService() {
  await server.close()

  await clearDatabases()
  resetEnvironment()
}

export async function initializeDatabases() {
  ConfigInSQLite3.openDatabase()
  await ConfigInSQLite3.prepareDatabase()

  await DataInPostgreSQL.ensureDatabase()
  await DataInPostgreSQL.migrateDatabase()
}

export async function clearDatabases() {
  ConfigInSQLite3.closeDatabase()

  await DataInPostgreSQL.ensureDatabase()
  await DataInPostgreSQL.migrateDatabase(0)
}

export async function closeAllConnections() {
  await closeDatabaseConnections()
}

async function closeDatabaseConnections() {
  await db.$pool.end()
}

export function resetEnvironment() {
  // assigning a property on `process.env` will implicitly convert the value to a string.
  // use `delete` to delete a property from `process.env`.
  // see also: https://nodejs.org/api/process.html#process_process_env
  delete process.env.FTS_ADMIN_PASSWORD
  delete process.env.FTS_LIST_BASED_ACCESS_CONTROL
  delete process.env.FTS_TOKEN_BASED_ACCESS_CONTROL
  delete process.env.FTS_WRITE_TOKEN_REQUIRED
  delete process.env.FTS_QUERY_TOKEN_REQUIRED
  delete process.env.FTS_DELETE_TOKEN_REQUIRED
  delete process.env.FTS_JSON_VALIDATION
  delete process.env.FTS_DEFAULT_JSON_SCHEMA
  delete process.env.FTS_JSON_PAYLOAD_ONLY

  // reset memoize
  resetCache()
}

export function expectMatchSchema(data: unknown, schema: object): void {
  if (!ajv.validate(schema, data)) {
    throw new Error(ajv.errorsText())
  }
}
