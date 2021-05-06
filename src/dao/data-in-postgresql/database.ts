import {
  DB_HOST
, DB_PORT
, DB_USERNAME
, DB_PASSWORD
, DB_NAME
, NODE_ENV
, NodeEnv
} from '@env'
import bluebird from 'bluebird'
import pgPromise from 'pg-promise'

// 即使在支持追踪异步错误的Node.js v12里, pg模块也无法跟踪异步错误的堆栈.
// 这个问题可能在pg被重构后解决, 目前只能通过将Promise替换为Bluebird来实现堆栈跟踪.
if (NODE_ENV() !== NodeEnv.Production) bluebird.config({ longStackTraces: true })

export const db = pgPromise({ promiseLib: bluebird })({
  host: DB_HOST()
, port: DB_PORT()
, user: DB_USERNAME()
, password: DB_PASSWORD()
, database: DB_NAME()
})
