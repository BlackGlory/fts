import { queryDocuments as _queryDocuments } from '@dao/query-documents.js'
import { IQueryExpression, IDocumentQueryResult } from '@src/contract.js'
import { isntAbortSignal } from 'extra-abort'

export function queryDocuments(
  namespace: string
, expression: IQueryExpression
, options: {
    buckets?: string[]
    limit?: number
    offset?: number
  }
, signal?: AbortSignal
): Promise<IDocumentQueryResult[]>
export function queryDocuments(
  namespace: string
, expression: IQueryExpression
, signal?: AbortSignal
): Promise<IDocumentQueryResult[]>
export function queryDocuments(...args:
| [
    namespace: string
  , expression: IQueryExpression
  , options: {
      buckets?: string[]
      limit?: number
      offset?: number
    }
  , signal?: AbortSignal
  ]
| [
    namespace: string
  , expression: IQueryExpression
  , signal?: AbortSignal
  ]
): Promise<IDocumentQueryResult[]> {
  const [namespace, expression, optionsOrSignal] = args
  const options = isntAbortSignal(optionsOrSignal)
                ? optionsOrSignal
                : undefined

  return _queryDocuments(namespace, expression, options)
}
