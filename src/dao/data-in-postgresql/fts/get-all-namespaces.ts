import { db } from '../database.js'

export async function* getAllNamespaces(): AsyncIterable<string> {
  const rows = await db.manyOrNone<{ namespace: string }>(`
    SELECT DISTINCT namespace
      FROM fts_object
  `)

  yield* rows.map(row => row['namespace'])
}
