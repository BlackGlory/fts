export interface IAccessControlDAO {
  Blacklist: IBlacklistDAO
  Whitelist: IWhitelistDAO
  Token: ITokenDAO
  TokenPolicy: ITokenPolicyDAO
}

export interface IBlacklistDAO {
  getAllBlacklistItems(): string[]
  inBlacklist(namespace: string): boolean
  addBlacklistItem(namespace: string): void
  removeBlacklistItem(namespace: string): void
}

export interface IWhitelistDAO {
  getAllWhitelistItems(): string[]
  inWhitelist(namespace: string): boolean
  addWhitelistItem(namespace: string): void
  removeWhitelistItem(namespace: string): void
}

export interface ITokenDAO {
  getAllNamespacesWithTokens(): string[]
  getAllTokens(namespace: string): Array<{
    token: string
    write: boolean
    query: boolean
    delete: boolean
  }>

  hasWriteTokens(namespace: string): boolean
  matchWriteToken(params: {
    token: string
    namespace: string
  }): boolean
  setWriteToken(params: {
    token: string
    namespace: string
  }): void
  unsetWriteToken(params: {
    token: string
    namespace: string
  }): void

  hasQueryTokens(namespace: string): boolean
  matchQueryToken(params: {
    token: string
    namespace: string
  }): boolean
  setQueryToken(params: {
    token: string
    namespace: string
  }): void
  unsetQueryToken(params: {
    token: string
    namespace: string
  }): void

  matchDeleteToken(params: {
    token: string
    namespace: string
  }): boolean
  setDeleteToken(params: {
    token: string
    namespace: string
  }): void
  unsetDeleteToken(params: {
    token: string
    namespace: string
  }): void
}

export interface ITokenPolicyDAO {
  getAllNamespacesWithTokenPolicies(): string[]
  getTokenPolicies(namespace: string): {
    writeTokenRequired: boolean | null
    queryTokenRequired: boolean | null
    deleteTokenRequired: boolean | null
  }

  setWriteTokenRequired(namespace: string, val: boolean): void
  unsetWriteTokenRequired(namespace: string): void

  setQueryTokenRequired(namespace: string, val: boolean): void
  unsetQueryTokenRequired(namespace: string): void

  setDeleteTokenRequired(namespace: string, val: boolean): void
  unsetDeleteTokenRequired(namespace: string): void
}
