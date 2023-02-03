import { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } from '@env/index.js'
import { findMigrationFilenames, readMigrationFile } from 'migration-files'
import { map } from 'extra-promise'
import * as path from 'path'
import { migrate } from '@blackglory/pg-migrations'
import { getAppRoot } from '@utils/get-app-root.js'
import { Client } from '@utils/pg.js'

export async function migrateDatabase(targetVersion?: number): Promise<void> {
  const client = new Client({
    host: DB_HOST()
  , port: DB_PORT()
  , user: DB_USERNAME()
  , password: DB_PASSWORD()
  , database: DB_NAME()
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
    host: DB_HOST()
  , port: DB_PORT()
  , user: DB_USERNAME()
  , password: DB_PASSWORD()
  , database: 'postgres'
  })

  await client.connect()
  try {
    const result = await client.query(`
      SELECT datname
        FROM pg_database
       WHERE datname = $1
    `, [DB_NAME()])
    if (result.rowCount == 0) await client.query(`CREATE DATABASE "${DB_NAME()}"`)
  } finally {
    await client.end()
  }
}
