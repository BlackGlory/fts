import { AccessControlDAO } from '@dao/index.js'

export function getAllNamespaces(): Promise<string[]> {
  return AccessControlDAO.getAllNamespacesWithTokens()
}

export function getAll(namespace: string): Promise<Array<{
  token: string
  write: boolean
  query: boolean
  delete: boolean
}>> {
  return AccessControlDAO.getAllTokens(namespace)
}

export function setWriteToken(namespace: string, token: string): Promise<void> {
  return AccessControlDAO.setWriteToken({ namespace: namespace, token })
}

export function unsetWriteToken(namespace: string, token: string): Promise<void> {
  return AccessControlDAO.unsetWriteToken({ namespace: namespace, token })
}

export function setQueryToken(namespace: string, token: string): Promise<void> {
  return AccessControlDAO.setQueryToken({ namespace: namespace, token })
}

export function unsetQueryToken(namespace: string, token: string): Promise<void> {
  return AccessControlDAO.unsetQueryToken({ namespace: namespace, token })
}

export function setDeleteToken(namespace: string, token: string): Promise<void> {
  return AccessControlDAO.setDeleteToken({ namespace: namespace, token })
}

export function unsetDeleteToken(namespace: string, token: string): Promise<void> {
  return AccessControlDAO.unsetDeleteToken({ namespace: namespace, token })
}
