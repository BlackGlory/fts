import { db } from '@src/database.js'

export async function removeAllDocumentsByBucket(
  namespace: string
, bucket: string
): Promise<void> {
  await db.none(`
    DELETE FROM fts_document
     WHERE namespace = $(namespace)
       AND bucket = $(bucket)
  `, { namespace, bucket })
}
