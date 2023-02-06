import { db } from '@src/database.js'
import { INamespaceStats } from '@src/contract.js'

export async function getNamespaceStats(
  namespace: string
): Promise<INamespaceStats> {
  const row = await db.one<{
    buckets: number
    documents: number
  }>(`
    SELECT COUNT(*)::integer AS documents
         , COUNT(DISTINCT bucket)::integer AS buckets
      FROM fts_document
     WHERE namespace = $(namespace);
  `, { namespace })

  return {
    namespace
  , buckets: row.buckets
  , documents: row.documents
  }
}
