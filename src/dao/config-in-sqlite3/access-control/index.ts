import * as Blacklist from './blacklist'
import * as Whitelist from './whitelist'
import * as Token from './token'
import * as TokenPolicy from './token-policy'


const BlacklistDAO: IBlacklistDAO = {
  addBlacklistItem: asyncify(Blacklist.addBlacklistItem)
, getAllBlacklistItems: asyncify(Blacklist.getAllBlacklistItems)
, inBlacklist: asyncify(Blacklist.inBlacklist)
, removeBlacklistItem: asyncify(Blacklist.removeBlacklistItem)
}

const WhitelistDAO: IWhitelistDAO = {
  addWhitelistItem: asyncify(Whitelist.addWhitelistItem)
, getAllWhitelistItems: asyncify(Whitelist.getAllWhitelistItems)
, inWhitelist: asyncify(Whitelist.inWhitelist)
, removeWhitelistItem: asyncify(Whitelist.removeWhitelistItem)
}

const TokenDAO: ITokenDAO = {
  getAllNamespacesWithTokens: asyncify(Token.getAllNamespacesWithTokens)
, getAllTokens: asyncify(Token.getAllTokens)

, hasWriteTokens: asyncify(Token.hasWriteTokens)
, matchWriteToken: asyncify(Token.matchWriteToken)
, setWriteToken: asyncify(Token.setWriteToken)
, unsetWriteToken: asyncify(Token.unsetWriteToken)

, hasQueryTokens: asyncify(Token.hasQueryTokens)
, matchQueryToken: asyncify(Token.matchQueryToken)
, setQueryToken: asyncify(Token.setQueryToken)
, unsetQueryToken: asyncify(Token.unsetQueryToken)

, matchDeleteToken: asyncify(Token.matchDeleteToken)
, setDeleteToken: asyncify(Token.setDeleteToken)
, unsetDeleteToken: asyncify(Token.unsetDeleteToken)
}

const TokenPolicyDAO: ITokenPolicyDAO = {
  getAllNamespacesWithTokenPolicies: asyncify(TokenPolicy.getAllNamespacesWithTokenPolicies)
, getTokenPolicies: asyncify(TokenPolicy.getTokenPolicies)

, setWriteTokenRequired: asyncify(TokenPolicy.setWriteTokenRequired)
, unsetWriteTokenRequired: asyncify(TokenPolicy.unsetWriteTokenRequired)

, setQueryTokenRequired: asyncify(TokenPolicy.setQueryTokenRequired)
, unsetQueryTokenRequired: asyncify(TokenPolicy.unsetQueryTokenRequired)

, setDeleteTokenRequired: asyncify(TokenPolicy.setDeleteTokenRequired)
, unsetDeleteTokenRequired: asyncify(TokenPolicy.unsetDeleteTokenRequired)
}

export const AccessControlDAO: IAccessControlDAO = {
  ...BlacklistDAO
, ...WhitelistDAO
, ...TokenDAO
, ...TokenPolicyDAO
}

function asyncify<T extends any[], U>(fn: (...args: T) => U): (...args: T) => Promise<U> {
  return async function (this: unknown, ...args: T): Promise<U> {
    return Reflect.apply(fn, this, args)
  }
}
