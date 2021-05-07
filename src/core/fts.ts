import { FTSDAO } from '@dao'

export function set(
  namespace: string
, objectId: string
, lexemes: string[]
): Promise<void> {
  return FTSDAO.setObject(namespace, objectId, lexemes)
}

export function del(namespace: string, objectId: string): Promise<void> {
  return FTSDAO.deleteObject(namespace, objectId)
}

export function clear(namespace: string): Promise<void> {
  return FTSDAO.deleteAllObjects(namespace)
}

export function stats(namespace: string): Promise<IStats> {
  return FTSDAO.stats(namespace)
}

export function query(
  namespace: string
, expression: IQueryExpression
, options: { limit?: number; offset?: number }
): AsyncIterable<string> {
  return FTSDAO.query(namespace, expression, options)
}

export function getAllNamespaces(): AsyncIterable<string> {
  return FTSDAO.getAllNamespaces()
}
