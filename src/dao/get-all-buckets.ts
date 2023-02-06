import { db } from '@src/database.js'

export async function getAllBuckets(namespace: string): Promise<string[]> {
  const rows = await db.manyOrNone<{ bucket: string }>(`
    SELECT DISTINCT bucket
      FROM fts_document
     WHERE namespace = $(namespace)
  `, { namespace })

  return rows.map(row => row['bucket'])
}
