import { convertExpressionToTsquery }
  from '@dao/data-in-postgresql/fts/utils/convert-expression-to-tsquery'
import { SortedValueCollector }
  from '@dao/data-in-postgresql/fts/utils/sorted-value-collector'
import { QueryKeyword } from '@src/query-keyword'

describe('convertExpressionToTsquery(exp: Expression): string', () => {
  test('WordExpression', () => {
    const collector = new SortedValueCollector()

    const result = convertExpressionToTsquery('string', collector)

    expect(result).toBe(`(to_tsquery('english', $(1)) || to_tsquery('simple', $(1)))`)
    expect(collector.values).toStrictEqual(['string'])
  })

  test('PhraseExpression', () => {
    const collector = new SortedValueCollector()

    const result = convertExpressionToTsquery([QueryKeyword.Phrase, 'A', 'B'], collector)

    expect(result).toBe(
      '('
    + `(to_tsquery('english', $(1)) || to_tsquery('simple', $(1)))`
    + ' <-> '
    + `(to_tsquery('english', $(2)) || to_tsquery('simple', $(2)))`
    + ')'
    )
    expect(collector.values).toStrictEqual(['A', 'B'])
  })

  test('PrefixExpression', () => {
    const collector = new SortedValueCollector()

    const result = convertExpressionToTsquery([QueryKeyword.Prefix, 'A'], collector)

    expect(result).toBe(`CONCAT($(1), ':*')::tsquery`)
    expect(collector.values).toStrictEqual(['A'])
  })

  test('AndExpression', () => {
    const collector = new SortedValueCollector()

    const result = convertExpressionToTsquery(['A', QueryKeyword.And, 'B'], collector)

    expect(result).toBe(
      '('
    + `(to_tsquery('english', $(1)) || to_tsquery('simple', $(1)))`
    + ' && '
    + `(to_tsquery('english', $(2)) || to_tsquery('simple', $(2)))`
    + ')'
    )
    expect(collector.values).toStrictEqual(['A', 'B'])
  })

  test('OrExpression', () => {
    const collector = new SortedValueCollector()

    const result = convertExpressionToTsquery(['A', QueryKeyword.Or, 'B'], collector)

    expect(result).toBe(
      '('
    + `(to_tsquery('english', $(1)) || to_tsquery('simple', $(1)))`
    + ' || '
    + `(to_tsquery('english', $(2)) || to_tsquery('simple', $(2)))`
    + ')'
    )
    expect(collector.values).toStrictEqual(['A', 'B'])
  })

  test('NotExpression', () => {
    const collector = new SortedValueCollector()

    const result = convertExpressionToTsquery([QueryKeyword.Not, 'A'], collector)

    expect(result).toBe(
      '('
    + '!! '
    + `(to_tsquery('english', $(1)) || to_tsquery('simple', $(1)))`
    + ')'
    )
    expect(collector.values).toStrictEqual(['A'])
  })
})
