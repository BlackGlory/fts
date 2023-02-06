import { db } from '@src/database.js'

export async function getAllNamespaces(): Promise<string[]> {
  const rows = await db.manyOrNone<{ namespace: string }>(`
    SELECT DISTINCT namespace
      FROM fts_document
  `)

  return rows.map(row => row['namespace'])
}
