import { getAllNamespaces as _getAllNamespaces } from '@dao/get-all-namespaces.js'

export function getAllNamespaces(): Promise<string[]> {
  return _getAllNamespaces()
}
