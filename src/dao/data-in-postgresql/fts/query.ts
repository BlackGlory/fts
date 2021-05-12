import { db } from '../database'
import { sql } from 'extra-sql-builder'
import { convertExpressionToTsquery, }
  from './utils/convert-expression-to-tsquery'
import { convertArrayToObject } from './utils/convert-array-to-object'
import { SortedValueCollector } from './utils/sorted-value-collector'

export async function* query(
  namespace: string
, expression: IQueryExpression
, options: {
    buckets?: string[]
    limit?: number
  }
): AsyncIterable<IQueryResult> {
  const { limit, buckets } = options
  const collector = new SortedValueCollector()
  const tsquery = convertExpressionToTsquery(expression, collector, { prefix: 'param' })
  const queryParameters = convertArrayToObject(collector.values, { prefix: 'param' })

  // 经测试, tsquery的结果会在查询中被重用.
  // 因此即使用 WITH 子句(CTE)单独将结果保存到临时表, 也无法缩短查询时间.

  // 试验过很多通过改变SQL语句来干预PostgreSQL查询计划的trick, 但每一种trick都导致顾此失彼的查询.
  // 因此这些trick虽然在单个项目的性能上有绝对优势, 却无法在生产中被采用, 因为它们是不可维护的.

  // 最终采用 enable_seqscan = OFF 是因为它在任何一种情况下的查询性能都算不上差,
  // 而且在此案例中根本不可能存在顺序扫描.
  const rows = await db.manyOrNone<{
    bucket: string
    id: string
  }>(sql`
      SET LOCAL enable_seqscan = OFF;
      SELECT id
           , bucket
        FROM fts_object
       WHERE vector @@ ${tsquery}
         AND namespace = $(namespace)
    ${buckets && 'AND bucket IN ($(buckets:list))'}
    ${limit && 'LIMIT $(limit)'}
  `, { namespace, buckets, limit, ...queryParameters })

  yield* rows.map(x => ({
    bucket: x.bucket
  , id: x.id
  }))
}
