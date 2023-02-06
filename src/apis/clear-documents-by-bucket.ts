import { removeAllDocumentsByBucket } from '@dao/remove-all-documents-by-bucket.js'

export async function clearDocumentsByBucket(
  namespace: string
, bucket: string
): Promise<null> {
  await removeAllDocumentsByBucket(namespace, bucket)
  return null
}
