interface IFTSDAO {
  setObject(
    namespace: string
  , bucket: string
  , objectId: string
  , lexemes: string[]
  ): Promise<void>

  deleteObject(namespace: string, bucket: string, objectId: string): Promise<void>
  deleteAllObjectsByNamespace(namespace: string): Promise<void>
  deleteAllObjectsByBucket(namespace: string, bucket: string): Promise<void>

  getNamespaceStats(namespace: string): Promise<INamespaceStats>
  getBucketStats(namespace: string, bucket: string): Promise<IBucketStats>

  query(
    namespace: string
  , expression: IQueryExpression
  , options: {
      buckets?: string[]
      limit?: number
      offset?: number
    }
  ): AsyncIterable<IQueryResult>

  getAllNamespaces(): AsyncIterable<string>
  getAllBuckets(namespace: string): AsyncIterable<string>
}
