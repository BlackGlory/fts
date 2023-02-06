import { removeDocument as _removeDocument } from '@dao/remove-document.js'

export async function removeDocument(
  namespace: string
, bucket: string
, documentId: string
): Promise<null> {
  await _removeDocument(namespace, bucket, documentId)
  return null
}
