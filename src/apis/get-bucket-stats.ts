import { getBucketStats as _getBucketStats } from '@dao/get-bucket-stats.js'
import { IBucketStats } from '@src/contract.js'

export function getBucketStats(namespace: string, bucket: string): Promise<IBucketStats> {
  return _getBucketStats(namespace, bucket)
}
