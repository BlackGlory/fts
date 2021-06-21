type CustomErrorConsturctor = import('@blackglory/errors').CustomErrorConstructor

interface INamespaceStats {
  namespace: string
  buckets: number
  objects: number
}

interface IBucketStats {
  namespace: string
  bucket: string
  objects: number
}

interface IQueryResult {
 bucket: string
 id: string
}

type IQueryExpression =
| ITermExpression
| IPhraseExpression
| IPrefixExpression
| IAndExpression
| IOrExpression
| INotExpression

type ITermExpression = string
type IPhraseExpression = [
  import('./query-keyword').QueryKeyword.Phrase
, ...IQueryExpression[]
]
type IPrefixExpression = [
  import('./query-keyword').QueryKeyword.Prefix
, string
]
type IAndExpression = [
  IQueryExpression
, import('./query-keyword').QueryKeyword.And
, IQueryExpression
]
type IOrExpression = [
  IQueryExpression
, import('./query-keyword').QueryKeyword.Or
, IQueryExpression
]
type INotExpression = [
  import('./query-keyword').QueryKeyword.Not
, IQueryExpression
]

interface ICore {
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
    isBlocked(namespace: string): Promise<boolean>
    getAll(): Promise<string[]>
    add(namespace: string): Promise<void>
    remove(namespace: string): Promise<void>

    /**
     * @throws {Forbidden}
     */
    check(namespace: string): Promise<void>

    Forbidden: CustomErrorConsturctor
  }

  Whitelist: {
    isEnabled(): boolean
    isBlocked(namespace: string): Promise<boolean>
    getAll(): Promise<string[]>
    add(namespace: string): Promise<void>
    remove(namespace: string): Promise<void>

    /**
     * @throws {Forbidden}
     */
    check(namespace: string): Promise<void>

    Forbidden: CustomErrorConsturctor
  }

  TBAC: {
    isEnabled(): boolean

    /**
     * @throws {Unauthorized}
     */
    checkWritePermission(namespace: string, token?: string): Promise<void>

    /**
     * @throws {Unauthorized}
     */
    checkQueryPermission(namespace: string, token?: string): Promise<void>

    /**
     * @throws {Unauthorized}
     */
    checkDeletePermission(namespace: string, token?: string): Promise<void>

    Unauthorized: CustomErrorConsturctor

    Token: {
      getAllNamespaces(): Promise<string[]>
      getAll(namespace: string): Promise<Array<{
        token: string
        write: boolean
        query: boolean
        delete: boolean
      }>>

      setWriteToken(namespace: string, token: string): Promise<void>
      unsetWriteToken(namespace: string, token: string): Promise<void>

      setQueryToken(namespace: string, token: string): Promise<void>
      unsetQueryToken(namespace: string, token: string): Promise<void>

      setDeleteToken(namespace: string, token: string): Promise<void>
      unsetDeleteToken(namespace: string, token: string): Promise<void>
    }

    TokenPolicy: {
      getAllNamespaces(): Promise<string[]>
      get(namespace: string): Promise<{
        writeTokenRequired: boolean | null
        queryTokenRequired: boolean | null
      }>

      setWriteTokenRequired(namespace: string, val: boolean): Promise<void>
      unsetWriteTokenRequired(namespace: string): Promise<void>

      setQueryTokenRequired(namespace: string, val: boolean): Promise<void>
      unsetQueryTokenRequired(namespace: string): Promise<void>

      setDeleteTokenRequired(namespace: string, val: boolean): Promise<void>
      unsetDeleteTokenRequired(namespace: string): Promise<void>
    }
  }
}
