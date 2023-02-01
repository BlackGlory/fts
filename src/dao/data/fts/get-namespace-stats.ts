import { db } from '../database.js'
import { INamespaceStats } from './contract.js'

export async function getNamespaceStats(
  namespace: string
): Promise<INamespaceStats> {
  const row = await db.one<{
    buckets: number
    objects: number
  }>(`
    SELECT COUNT(*)::integer AS objects
         , COUNT(DISTINCT bucket)::integer AS buckets
      FROM fts_object
     WHERE namespace = $(namespace);
  `, { namespace })

  return {
    namespace
  , objects: row.objects
  , buckets: row.buckets
  }
}