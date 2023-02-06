import { db } from '@src/database.js'
import { IBucketStats } from '@src/contract.js'

export async function getBucketStats(
  namespace: string
, bucket: string
): Promise<IBucketStats> {
  const row = await db.one<{ documents: number }>(`
    SELECT COUNT(*)::integer AS documents
      FROM fts_document
     WHERE namespace = $(namespace)
       AND bucket = $(bucket);
  `, { namespace, bucket })

  return {
    namespace
  , bucket
  , documents: row.documents
  }
}
