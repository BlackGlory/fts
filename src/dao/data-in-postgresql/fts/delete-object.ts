import { db } from '../database'

export async function deleteObject(namespace: string, id: string): Promise<void> {
  await db.none(`
    DELETE FROM fts_object
     WHERE namespace = $(namespace)
       AND id = $(id)
  `, { namespace, id })
}
