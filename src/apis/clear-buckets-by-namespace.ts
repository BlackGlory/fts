import { removeAllDocumentsByNamespace } from '@dao/remove-all-documents-by-namespace.js'

export async function clearBucketsByNamespace(namespace: string): Promise<null> {
  await removeAllDocumentsByNamespace(namespace)
  return null
}
