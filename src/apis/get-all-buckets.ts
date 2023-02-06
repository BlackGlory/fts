import { getAllBuckets as _getAllBuckets } from '@dao/get-all-buckets.js'

export function getAllBuckets(namespace: string): Promise<string[]> {
  return _getAllBuckets(namespace)
}
