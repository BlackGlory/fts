import { db } from '@src/database.js'
import { sql, ParameterCollector } from 'extra-sql-builder'
import { convertExpressionToTsquery } from './utils/convert-expression-to-tsquery.js'
import { IQueryExpression, IDocumentQueryResult } from '@src/contract.js'

export async function queryDocuments(
  namespace: string
, expression: IQueryExpression
, options: {
    buckets?: string[]
    limit?: number
    offset?: number
  } = {}
): Promise<IDocumentQueryResult[]> {
  const { buckets, limit, offset } = options
  const collector = new ParameterCollector<string>('param')
  const tsquery = convertExpressionToTsquery(expression, collector)

  // 经测试, tsquery的结果会在查询中被重用.
  // 因此即使用 WITH 子句(CTE)单独将结果保存到临时表, 也无法缩短查询时间.

  // 试验过很多通过改变SQL语句来干预PostgreSQL查询计划的trick, 但每一种trick都导致顾此失彼的查询.
  // 因此这些trick虽然在单个项目的性能上有绝对优势, 却无法在生产中被采用, 因为它们是不可维护的.

  // 最终采用 enable_seqscan = OFF 是因为它在任何一种情况下的查询性能都算不上差,
  // 而且在此案例中根本不可能存在顺序扫描.
  const rows = await db.manyOrNone<{
    bucket: string
    id: string
  }>(
    sql`
      SET LOCAL enable_seqscan = OFF;
      SELECT id
           , bucket
        FROM fts_document
       WHERE vector @@ ${tsquery}
         AND namespace = $(namespace)
      ${buckets && 'AND bucket IN ($(buckets:list))'}
       ORDER BY ts_rank(vector, ${tsquery}) DESC
              , namespace
              , bucket
              , id
      ${limit && 'LIMIT $(limit)'}
      ${offset && 'OFFSET $(offset)'}
    `
  , { namespace, buckets, limit, ...collector.toRecord() }
  )

  return rows.map(x => ({
    bucket: x.bucket
  , documentId: x.id
  }))
}
