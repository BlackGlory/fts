import { db } from '../database'

export async function deleteAllObjects(namespace: string): Promise<void> {
  await db.none(`
    DELETE FROM fts_object
     WHERE namespace = $(namespace)
  `, { namespace })
}
