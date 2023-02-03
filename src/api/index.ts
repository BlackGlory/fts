import { isAdmin } from './admin.js'
import * as FTS from './fts.js'
import { IAPI } from './contract.js'

export const api: IAPI = {
  isAdmin
, FTS
}
