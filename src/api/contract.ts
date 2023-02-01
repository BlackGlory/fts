import { CustomErrorConstructor } from '@blackglory/errors'

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

  Blacklist: {
    isEnabled(): boolean
    isBlocked(namespace: string): boolean
    getAll(): string[]
    add(namespace: string): void
    remove(namespace: string): void

    /**
     * @throws {Forbidden}
     */
    check(namespace: string): void

    Forbidden: CustomErrorConstructor
  }

  Whitelist: {
    isEnabled(): boolean
    isBlocked(namespace: string): boolean
    getAll(): string[]
    add(namespace: string): void
    remove(namespace: string): void

    /**
     * @throws {Forbidden}
     */
    check(namespace: string): void

    Forbidden: CustomErrorConstructor
  }

  TBAC: {
    isEnabled(): boolean

    /**
     * @throws {Unauthorized}
     */
    checkWritePermission(namespace: string, token?: string): void

    /**
     * @throws {Unauthorized}
     */
    checkQueryPermission(namespace: string, token?: string): void

    /**
     * @throws {Unauthorized}
     */
    checkDeletePermission(namespace: string, token?: string): void

    Unauthorized: CustomErrorConstructor

    Token: {
      getAllNamespaces(): string[]
      getAll(namespace: string): Array<{
        token: string
        write: boolean
        query: boolean
        delete: boolean
      }>

      setWriteToken(namespace: string, token: string): void
      unsetWriteToken(namespace: string, token: string): void

      setQueryToken(namespace: string, token: string): void
      unsetQueryToken(namespace: string, token: string): void

      setDeleteToken(namespace: string, token: string): void
      unsetDeleteToken(namespace: string, token: string): void
    }

    TokenPolicy: {
      getAllNamespaces(): string[]
      get(namespace: string): {
        writeTokenRequired: boolean | null
        queryTokenRequired: boolean | null
      }

      setWriteTokenRequired(namespace: string, val: boolean): void
      unsetWriteTokenRequired(namespace: string): void

      setQueryTokenRequired(namespace: string, val: boolean): void
      unsetQueryTokenRequired(namespace: string): void

      setDeleteTokenRequired(namespace: string, val: boolean): void
      unsetDeleteTokenRequired(namespace: string): void
    }
  }
}
