import { db } from '../database.js'
import { IBucketStats } from './contract.js'

export async function getBucketStats(
  namespace: string
, bucket: string
): Promise<IBucketStats> {
  const row = await db.one<{ objects: number }>(`
    SELECT COUNT(*)::integer AS objects
      FROM fts_object
     WHERE namespace = $(namespace)
       AND bucket = $(bucket);
  `, { namespace, bucket })

  return {
    namespace
  , bucket
  , objects: row.objects
  }
}
