import { db } from '../database'

export async function* getAllBuckets(namespace: string): AsyncIterable<string> {
  const rows = await db.manyOrNone<{ bucket: string }>(`
    SELECT DISTINCT bucket
      FROM fts_object
     WHERE namespace = $(namespace)
  `, { namespace })

  yield* rows.map(row => row['bucket'])
}
