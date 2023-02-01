import { AccessControlDAO } from '@dao/index.js'

export function getAllNamespaces(): string[] {
  return AccessControlDAO.Token.getAllNamespacesWithTokens()
}

export function getAll(namespace: string): Array<{
  token: string
  write: boolean
  query: boolean
  delete: boolean
}> {
  return AccessControlDAO.Token.getAllTokens(namespace)
}

export function setWriteToken(namespace: string, token: string): void {
  AccessControlDAO.Token.setWriteToken({ namespace: namespace, token })
}

export function unsetWriteToken(namespace: string, token: string): void {
  AccessControlDAO.Token.unsetWriteToken({ namespace: namespace, token })
}

export function setQueryToken(namespace: string, token: string): void {
  AccessControlDAO.Token.setQueryToken({ namespace: namespace, token })
}

export function unsetQueryToken(namespace: string, token: string): void {
  AccessControlDAO.Token.unsetQueryToken({ namespace: namespace, token })
}

export function setDeleteToken(namespace: string, token: string): void {
  AccessControlDAO.Token.setDeleteToken({ namespace: namespace, token })
}

export function unsetDeleteToken(namespace: string, token: string): void {
  AccessControlDAO.Token.unsetDeleteToken({ namespace: namespace, token })
}
