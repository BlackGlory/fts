import { isAdmin } from './admin.js'
import * as FTS from './fts.js'
import * as Blacklist from './blacklist.js'
import * as Whitelist from './whitelist.js'
import { TBAC } from './token-based-access-control/index.js'
import { IAPI } from './contract.js'

export const api: IAPI = {
  isAdmin
, FTS
, Blacklist
, Whitelist
, TBAC
}
