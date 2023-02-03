export enum QueryKeyword {
  And = 0
, Or = 1
, Not = 2
, Phrase = 3
, Prefix = 4
}

export interface INamespaceStats {
  namespace: string
  buckets: number
  objects: number
}

export interface IBucketStats {
  namespace: string
  bucket: string
  objects: number
}

export interface IQueryResult {
  bucket: string
  id: string
}

export type IQueryExpression =
| ITermExpression
| IPhraseExpression
| IPrefixExpression
| IAndExpression
| IOrExpression
| INotExpression

export type ITermExpression = string
export type IPhraseExpression = [
  QueryKeyword.Phrase
, ...IQueryExpression[]
]
export type IPrefixExpression = [
  QueryKeyword.Prefix
, string
]
export type IAndExpression = [
  IQueryExpression
, QueryKeyword.And
, IQueryExpression
]
export type IOrExpression = [
  IQueryExpression
, QueryKeyword.Or
, IQueryExpression
]
export type INotExpression = [
  QueryKeyword.Not
, IQueryExpression
]

export interface IAPI {
  isAdmin(password: string): boolean

  FTS: {
    set(
      namespace: string
    , bucket: string
    , objectId: string
    , lexemes: string[]
    ): Promise<void>

    del(namespace: string, bucket: string, objectId: string): Promise<void>
    clearNamespace(namespace: string): Promise<void>
    clearBucket(namespace: string, bucket: string): Promise<void>

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
}
