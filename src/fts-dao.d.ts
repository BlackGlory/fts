interface IFTSDAO {
  setObject(namespace: string, objectId: string, lexemes: string[]): Promise<void>

  deleteObject(namespace: string, objectId: string): Promise<void>
  deleteAllObjects(namespace: string): Promise<void>

  stats(namespace: string): Promise<IStats>

  query(
    namespace: string
  , expression: QueryExpression
  , options: { limit?: number; offset?: number }
  ): AsyncIterable<string>

  getAllNamespaces(): AsyncIterable<string>
}
