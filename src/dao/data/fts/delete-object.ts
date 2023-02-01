import { db } from '../database.js'

export async function deleteObject(
  namespace: string
, bucket: string
, id: string
): Promise<void> {
  await db.none(`
    DELETE FROM fts_object
     WHERE namespace = $(namespace)
       AND bucket = $(bucket)
       AND id = $(id)
  `, { namespace, bucket, id })
}
