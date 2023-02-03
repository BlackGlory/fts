import * as Data from '@dao/utils.js'
import { resetCache } from '@env/cache.js'
import { buildServer } from '@src/server.js'
import { db } from '@dao/database.js'
import Ajv from 'ajv'
import { UnpackedPromise } from 'hotypes'

const ajv = new Ajv.default()
let server: UnpackedPromise<ReturnType<typeof buildServer>>
let address: string

export function getAddress() {
  return address
}

export async function startService() {
  await Data.ensureDatabase()
  await Data.migrateDatabase()
  await initializeDatabases()

  server = await buildServer()
  address = await server.listen()
}

export async function stopService() {
  await server.close()

  await clearDatabases()
  resetEnvironment()
}

export async function initializeDatabases() {
  await Data.ensureDatabase()
  await Data.migrateDatabase()
}

export async function clearDatabases() {
  await Data.ensureDatabase()
  await Data.migrateDatabase(0)
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

  // reset memoize
  resetCache()
}

export function expectMatchSchema(data: unknown, schema: object): void {
  if (!ajv.validate(schema, data)) {
    throw new Error(ajv.errorsText())
  }
}
