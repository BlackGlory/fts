import { convertExpressionToTsquery } from '@dao/data-in-postgresql/fts/utils/convert-expression-to-tsquery'
import { ValueCollector } from 'value-collector'
import { QueryKeyword } from '@src/query-keyword'

describe('convertExpressionToTsquery(exp: Expression): string', () => {
  test('TermExpression', () => {
    const collector = new ValueCollector<string>('param')

    const result = convertExpressionToTsquery('string', collector)

    expect(result).toBe(`(to_tsquery('english', $(param1)) || to_tsquery('simple', $(param1)))`)
    expect(collector.toRecord()).toStrictEqual({ param1: 'string' })
  })

  test('PhraseExpression', () => {
    const collector = new ValueCollector<string>('param')

    const result = convertExpressionToTsquery([QueryKeyword.Phrase, 'A', 'B'], collector)

    expect(result).toBe(
      '('
    + `(to_tsquery('english', $(param1)) || to_tsquery('simple', $(param1)))`
    + ' <-> '
    + `(to_tsquery('english', $(param2)) || to_tsquery('simple', $(param2)))`
    + ')'
    )
    expect(collector.toRecord()).toStrictEqual({ param1: 'A', param2: 'B' })
  })

  test('PrefixExpression', () => {
    const collector = new ValueCollector<string>('param')

    const result = convertExpressionToTsquery([QueryKeyword.Prefix, 'A'], collector)

    expect(result).toBe(`CONCAT($(param1), ':*')::tsquery`)
    expect(collector.toRecord()).toStrictEqual({ param1: 'A' })
  })

  test('AndExpression', () => {
    const collector = new ValueCollector<string>('param')

    const result = convertExpressionToTsquery(['A', QueryKeyword.And, 'B'], collector)

    expect(result).toBe(
      '('
    + `(to_tsquery('english', $(param1)) || to_tsquery('simple', $(param1)))`
    + ' && '
    + `(to_tsquery('english', $(param2)) || to_tsquery('simple', $(param2)))`
    + ')'
    )
    expect(collector.toRecord()).toStrictEqual({ param1: 'A', param2: 'B' })
  })

  test('OrExpression', () => {
    const collector = new ValueCollector<string>('param')

    const result = convertExpressionToTsquery(['A', QueryKeyword.Or, 'B'], collector)

    expect(result).toBe(
      '('
    + `(to_tsquery('english', $(param1)) || to_tsquery('simple', $(param1)))`
    + ' || '
    + `(to_tsquery('english', $(param2)) || to_tsquery('simple', $(param2)))`
    + ')'
    )
    expect(collector.toRecord()).toStrictEqual({ param1: 'A', param2: 'B' })
  })

  test('NotExpression', () => {
    const collector = new ValueCollector<string>('param')

    const result = convertExpressionToTsquery([QueryKeyword.Not, 'A'], collector)

    expect(result).toBe(
      '('
    + '!! '
    + `(to_tsquery('english', $(param1)) || to_tsquery('simple', $(param1)))`
    + ')'
    )
    expect(collector.toRecord()).toStrictEqual({ param1: 'A' })
  })
})
