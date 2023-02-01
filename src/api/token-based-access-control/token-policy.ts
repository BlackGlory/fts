import { AccessControlDAO } from '@dao/index.js'

export function getAllNamespaces(): string[] {
  return AccessControlDAO.TokenPolicy.getAllNamespacesWithTokenPolicies()
}

export function get(namespace: string): {
  writeTokenRequired: boolean | null
  queryTokenRequired: boolean | null
  deleteTokenRequired: boolean | null
} {
  return AccessControlDAO.TokenPolicy.getTokenPolicies(namespace)
}

export function setWriteTokenRequired(namespace: string, val: boolean): void {
  AccessControlDAO.TokenPolicy.setWriteTokenRequired(namespace, val)
}

export function unsetWriteTokenRequired(namespace: string): void {
  AccessControlDAO.TokenPolicy.unsetWriteTokenRequired(namespace)
}

export function setQueryTokenRequired(namespace: string, val: boolean): void {
  AccessControlDAO.TokenPolicy.setQueryTokenRequired(namespace, val)
}

export function unsetQueryTokenRequired(namespace: string): void {
  AccessControlDAO.TokenPolicy.unsetQueryTokenRequired(namespace)
}

export function setDeleteTokenRequired(namespace: string, val: boolean): void {
  AccessControlDAO.TokenPolicy.setDeleteTokenRequired(namespace, val)
}

export function unsetDeleteTokenRequired(namespace: string): void {
  AccessControlDAO.TokenPolicy.unsetDeleteTokenRequired(namespace)
}
