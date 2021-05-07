import { db } from '../database'
import { sql } from 'extra-sql-builder'
import { convertExpressionToTsquery, }
  from './utils/convert-expression-to-tsquery'
import { convertArrayToObject } from './utils/convert-array-to-object'
import { SortedValueCollector } from './utils/sorted-value-collector'

export async function* query(
  namespace: string
, expression: IQueryExpression
, options: { limit?: number; offset?: number }
): AsyncIterable<string> {
  const { limit, offset } = options
  const collector = new SortedValueCollector()
  const tsquery = convertExpressionToTsquery(expression, collector, { prefix: 'param' })
  const queryParameters = convertArrayToObject(collector.values, { prefix: 'param' })

  const rows = await db.manyOrNone<{ id: string; rank: number }>(sql`
    SELECT id
      FROM fts_object
     WHERE namespace = $(namespace)
       AND vector @@ ${tsquery}
    ${limit && 'LIMIT $(limit)'}
    ${offset && 'OFFSET $(offset)'}
  `, { namespace, limit, offset, ...queryParameters })

  yield* rows.map(x => x.id)
}
