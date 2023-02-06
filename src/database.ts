import {
  POSTGRES_HOST
, POSTGRES_PORT
, POSTGRES_USERNAME
, POSTGRES_PASSWORD
, POSTGRES_DATABASE
, NODE_ENV
, NodeEnv
} from '@env/index.js'
import bluebird from 'bluebird'
import pgPromise from 'pg-promise'
import { findMigrationFilenames, readMigrationFile } from 'migration-files'
import { map } from 'extra-promise'
import * as path from 'path'
import { migrate } from '@blackglory/pg-migrations'
import { getAppRoot } from '@utils/get-app-root.js'
import { Client } from '@utils/pg.js'

// 即使在支持追踪异步错误的Node.js v12里, pg模块也无法跟踪异步错误的堆栈.
// 这个问题可能在pg被重构后解决, 目前只能通过将Promise替换为Bluebird来实现堆栈跟踪.
if (NODE_ENV() !== NodeEnv.Production) bluebird.config({ longStackTraces: true })

export const db = pgPromise({ promiseLib: bluebird })({
  host: POSTGRES_HOST()
, port: POSTGRES_PORT()
, user: POSTGRES_USERNAME()
, password: POSTGRES_PASSWORD()
, database: POSTGRES_DATABASE()
})

export async function migrateDatabase(targetVersion?: number): Promise<void> {
  const client = new Client({
    host: POSTGRES_HOST()
  , port: POSTGRES_PORT()
  , user: POSTGRES_USERNAME()
  , password: POSTGRES_PASSWORD()
  , database: POSTGRES_DATABASE()
  })

  await client.connect()
  try {
    const migrationsPath = path.join(getAppRoot(), 'migrations')
    const migrations = await map(
      await findMigrationFilenames(migrationsPath)
    , readMigrationFile
    )
    await migrate(client, migrations, targetVersion)
  } finally {
    await client.end()
  }
}

export async function ensureDatabase(): Promise<void> {
  const client = new Client({
    host: POSTGRES_HOST()
  , port: POSTGRES_PORT()
  , user: POSTGRES_USERNAME()
  , password: POSTGRES_PASSWORD()
  , database: 'postgres'
  })

  await client.connect()
  try {
    const result = await client.query(`
      SELECT datname
        FROM pg_database
       WHERE datname = $1
    `, [POSTGRES_DATABASE()])
    if (result.rowCount == 0) await client.query(`CREATE DATABASE "${POSTGRES_DATABASE()}"`)
  } finally {
    await client.end()
  }
}
