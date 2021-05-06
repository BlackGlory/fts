interface IBlacklistDAO {
  getAllBlacklistItems(): Promise<string[]>
  inBlacklist(namespace: string): Promise<boolean>
  addBlacklistItem(namespace: string): Promise<void>
  removeBlacklistItem(namespace: string): Promise<void>
}

interface IWhitelistDAO {
  getAllWhitelistItems(): Promise<string[]>
  inWhitelist(namespace: string): Promise<boolean>
  addWhitelistItem(namespace: string): Promise<void>
  removeWhitelistItem(namespace: string): Promise<void>
}

interface ITokenDAO {
  getAllNamespacesWithTokens(): Promise<string[]>
  getAllTokens(namespace: string): Promise<Array<{
    token: string
    write: boolean
    query: boolean
    delete: boolean
  }>>

  hasWriteTokens(namespace: string): Promise<boolean>
  matchWriteToken(params: { token: string; namespace: string }): Promise<boolean>
  setWriteToken(params: { token: string; namespace: string }): Promise<void>
  unsetWriteToken(params: { token: string; namespace: string }): Promise<void>

  hasQueryTokens(namespace: string): Promise<boolean>
  matchQueryToken(params: { token: string; namespace: string }): Promise<boolean>
  setQueryToken(params: { token: string; namespace: string }): Promise<void>
  unsetQueryToken(params: { token: string; namespace: string }): Promise<void>

  matchDeleteToken(params: { token: string; namespace: string }): Promise<boolean>
  setDeleteToken(params: { token: string; namespace: string }): Promise<void>
  unsetDeleteToken(params: { token: string; namespace: string }): Promise<void>
}

interface ITokenPolicyDAO {
  getAllNamespacesWithTokenPolicies(): Promise<string[]>
  getTokenPolicies(namespace: string): Promise<{
    writeTokenRequired: boolean | null
    queryTokenRequired: boolean | null
    deleteTokenRequired: boolean | null
  }>

  setWriteTokenRequired(namespace: string, val: boolean): Promise<void>
  unsetWriteTokenRequired(namespace: string): Promise<void>

  setQueryTokenRequired(namespace: string, val: boolean): Promise<void>
  unsetQueryTokenRequired(namespace: string): Promise<void>

  setDeleteTokenRequired(namespace: string, val: boolean): Promise<void>
  unsetDeleteTokenRequired(namespace: string): Promise<void>
}

interface IAccessControlDAO extends
  IBlacklistDAO
, IWhitelistDAO
, ITokenDAO
, ITokenPolicyDAO {}
