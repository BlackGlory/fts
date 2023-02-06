import { go } from '@blackglory/prelude'
import { ensureDatabase, migrateDatabase } from '@src/database.js'
import { startServer } from './server.js'
import { PORT, HOST, NODE_ENV, NodeEnv } from '@env/index.js'
import { youDied } from 'you-died'

// eslint-disable-next-line
go(async () => {
  await ensureDatabase()
  await migrateDatabase()

  const closeServer = startServer(HOST(), PORT())
  youDied(closeServer)
  if (NODE_ENV() === NodeEnv.Test) process.exit()

  process.send?.('ready')
})
