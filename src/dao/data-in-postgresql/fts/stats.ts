import { db } from '../database'

export async function stats(namespace: string): Promise<IStats> {
  const row = await db.one<{ objects: number }>(`
    SELECT COUNT(*)::integer AS objects
      FROM fts_object
     WHERE namespace = $(namespace);
  `, { namespace })

  return {
    namespace
  , objects: row.objects
  }
}
