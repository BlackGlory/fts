import { AccessControlDAO } from '@dao'

export function getAllNamespaces(): Promise<string[]> {
  return AccessControlDAO.getAllNamespacesWithTokenPolicies()
}

export function get(namespace: string): Promise<{
  writeTokenRequired: boolean | null
  queryTokenRequired: boolean | null
  deleteTokenRequired: boolean | null
}> {
  return AccessControlDAO.getTokenPolicies(namespace)
}

export function setWriteTokenRequired(namespace: string, val: boolean): Promise<void> {
  return AccessControlDAO.setWriteTokenRequired(namespace, val)
}

export function unsetWriteTokenRequired(namespace: string): Promise<void> {
  return AccessControlDAO.unsetWriteTokenRequired(namespace)
}

export function setQueryTokenRequired(namespace: string, val: boolean): Promise<void> {
  return AccessControlDAO.setQueryTokenRequired(namespace, val)
}

export function unsetQueryTokenRequired(namespace: string): Promise<void> {
  return AccessControlDAO.unsetQueryTokenRequired(namespace)
}

export function setDeleteTokenRequired(namespace: string, val: boolean): Promise<void> {
  return AccessControlDAO.setDeleteTokenRequired(namespace, val)
}

export function unsetDeleteTokenRequired(namespace: string): Promise<void> {
  return AccessControlDAO.unsetDeleteTokenRequired(namespace)
}
