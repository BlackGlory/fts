import { setDocument as _setDocument } from '@dao/set-document.js'

export async function setDocument(
  namespace: string
, bucket: string
, documentId: string
, lexemes: string[]
): Promise<null> {
  await _setDocument(namespace, bucket, documentId, lexemes)
  return null
}
