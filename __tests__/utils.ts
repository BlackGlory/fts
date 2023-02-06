import { resetCache } from '@env/cache.js'
import { startServer } from '@src/server.js'
import { db, ensureDatabase, migrateDatabase } from '@src/database.js'
import { createClient } from '@delight-rpc/websocket'
import { IAPI } from '@src/contract.js'
import { ClientProxy } from 'delight-rpc'
import { waitForEventEmitter } from '@blackglory/wait-for'
import { WebSocket } from 'ws'

let closeServer: ReturnType<typeof startServer>
let address: string

export function getAddress() {
  return address
}

export async function startService() {
  await initializeDatabase()
  closeServer = startServer('localhost', 8080)
  address = 'ws://localhost:8080'
}

export async function stopService() {
  await closeServer()
  await clearDatabases()
  resetEnvironment()
}

export async function initializeDatabase() {
  await ensureDatabase()
  await migrateDatabase()
}

export async function clearDatabases() {
  await ensureDatabase()
  await migrateDatabase(0)
}

export async function closeAllConnections() {
  await closeDatabaseConnections()
}

async function closeDatabaseConnections() {
  await db.$pool.end()
}

export function resetEnvironment() {
  // reset memoize
  resetCache()
}

export async function buildClient(): Promise<ClientProxy<IAPI>> {
  const ws = new WebSocket(address)
  await waitForEventEmitter(ws, 'open')
  const [client] = createClient<IAPI>(ws)
  return client
}
