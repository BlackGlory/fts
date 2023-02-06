export enum QueryKeyword {
  And = 0
, Or = 1
, Not = 2
, Phrase = 3
, Prefix = 4
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

export interface INamespaceStats {
  namespace: string
  buckets: number
  documents: number
}

export interface IBucketStats {
  namespace: string
  bucket: string
  documents: number
}

export interface IDocumentQueryResult {
  bucket: string
  documentId: string
}

export interface IAPI {
  getNamespaceStats(namespace: string): INamespaceStats
  getBucketStats(namespace: string, bucket: string): IBucketStats

  getAllNamespaces(): string[]
  getAllBuckets(namespace: string): string[]

  setDocument(
    namespace: string
  , bucket: string
  , documentId: string
  , lexemes: string[]
  ): null

  removeDocument(
    namespace: string
  , bucket: string
  , documentId: string
  ): null

  clearBucketsByNamespace(namespace: string): null
  clearDocumentsByBucket(namespace: string, bucket: string): null

  queryDocuments(
    namespace: string
  , expression: IQueryExpression
  , options?: {
      buckets?: string[]
      limit?: number
      offset?: number
    }
  ): IDocumentQueryResult[]
}
