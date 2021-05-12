import { FTSDAO } from '@dao'

export function set(
  namespace: string
, bucket: string
, objectId: string
, lexemes: string[]
): Promise<void> {
  return FTSDAO.setObject(namespace, bucket, objectId, lexemes)
}

export function del(
  namespace: string
, bucket: string
, objectId: string
): Promise<void> {
  return FTSDAO.deleteObject(namespace, bucket, objectId)
}

export function clearNamespace(namespace: string): Promise<void> {
  return FTSDAO.deleteAllObjectsByNamespace(namespace)
}

export function clearBucket(namespace: string, bucket: string): Promise<void> {
  return FTSDAO.deleteAllObjectsByBucket(namespace, bucket)
}

export function getNamespaceStats(namespace: string): Promise<INamespaceStats> {
  return FTSDAO.getNamespaceStats(namespace)
}

export function getBucketStats(
  namespace: string
, bucket: string
): Promise<IBucketStats> {
  return FTSDAO.getBucketStats(namespace, bucket)
}

export function query(
  namespace: string
, expression: IQueryExpression
, options: {
    limit?: number
    buckets?: string[]
  }
): AsyncIterable<IQueryResult> {
  return FTSDAO.query(namespace, expression, options)
}

export function getAllNamespaces(): AsyncIterable<string> {
  return FTSDAO.getAllNamespaces()
}

export function getAllBuckets(namespace: string): AsyncIterable<string> {
  return FTSDAO.getAllBuckets(namespace)
}
