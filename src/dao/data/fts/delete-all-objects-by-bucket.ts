import { db } from '../database.js'

export async function deleteAllObjectsByBucket(
  namespace: string
, bucket: string
): Promise<void> {
  await db.none(`
    DELETE FROM fts_object
     WHERE namespace = $(namespace)
       AND bucket = $(bucket)
  `, { namespace, bucket })
}
