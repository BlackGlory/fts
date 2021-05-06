import { isAdmin } from './admin'
import * as FTS from './fts'
import * as Blacklist from './blacklist'
import * as Whitelist from './whitelist'
import { TBAC } from './token-based-access-control'

export const Core: ICore = {
  isAdmin
, FTS
, Blacklist
, Whitelist
, TBAC
}
