import { db } from '@src/database.js'

export async function removeDocument(
  namespace: string
, bucket: string
, id: string
): Promise<void> {
  await db.none(`
    DELETE FROM fts_document
     WHERE namespace = $(namespace)
       AND bucket = $(bucket)
       AND id = $(id)
  `, { namespace, bucket, id })
}
