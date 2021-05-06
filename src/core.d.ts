type CustomErrorConsturctor = import('@blackglory/errors').CustomErrorConstructor
type QueryExpression =
| WordExpression
| PhraseExpression
| PrefixExpression
| AndExpression
| OrExpression
| NotExpression

type WordExpression = string
type PhraseExpression = [
  import('./keyword').QueryKeyword.Phrase
, ...QueryExpression[]
]
type PrefixExpression = [
  import('./keyword').QueryKeyword.Prefix
, string
]
type AndExpression = [
  QueryExpression
, import('./keyword').QueryKeyword.And
, QueryExpression
]
type OrExpression = [
  QueryExpression
, import('./keyword').QueryKeyword.Or
, QueryExpression
]
type NotExpression = [
  import('./keyword').QueryKeyword.Not
, QueryExpression
]

interface ICore {
  isAdmin(password: string): boolean

  FTS: {
    set(namespace: string, objectId: string, lexemes: string[]): Promise<void>

    del(namespace: string, objectId: string): Promise<void>
    clear(namespace: string): Promise<void>

    query(
      namespace: string
    , expression: QueryExpression
    , options: { limit?: number; offset?: number }
    ): AsyncIterable<string>

    getAllNamespaces(): AsyncIterable<string>
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
