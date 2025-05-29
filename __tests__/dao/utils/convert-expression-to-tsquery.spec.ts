import { describe, test, expect } from 'vitest'
import { convertExpressionToTsquery } from '@dao/utils/convert-expression-to-tsquery.js'
import { ParameterCollector } from 'extra-sql-builder'
import { QueryKeyword } from '@src/contract.js'

describe('convertExpressionToTsquery', () => {
  test('TermExpression', () => {
    const collector = new ParameterCollector<string>('param')

    const result = convertExpressionToTsquery('string', collector)

    expect(result).toBe(`(to_tsquery('english', $(param1)) || to_tsquery('simple', $(param1)))`)
    expect(collector.toRecord()).toStrictEqual({ param1: 'string' })
  })

  test('PhraseExpression', () => {
    const collector = new ParameterCollector<string>('param')

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
    const collector = new ParameterCollector<string>('param')

    const result = convertExpressionToTsquery([QueryKeyword.Prefix, 'A'], collector)

    expect(result).toBe(`CONCAT($(param1), ':*')::tsquery`)
    expect(collector.toRecord()).toStrictEqual({ param1: 'A' })
  })

  test('AndExpression', () => {
    const collector = new ParameterCollector<string>('param')

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
    const collector = new ParameterCollector<string>('param')

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
    const collector = new ParameterCollector<string>('param')

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
