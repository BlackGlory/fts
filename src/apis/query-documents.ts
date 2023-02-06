import { queryDocuments as _queryDocuments } from '@dao/query-documents.js'
import { IQueryExpression, IDocumentQueryResult } from '@src/contract.js'

export function queryDocuments(
  namespace: string
, expression: IQueryExpression
, options: {
    buckets?: string[]
    limit?: number
    offset?: number
  } = {}
): Promise<IDocumentQueryResult[]> {
  return _queryDocuments(namespace, expression, options)
}
