import { isString, isArray } from '@blackglory/types'
import { QueryKeyword } from '@src/query-keyword'
import { SortedValueCollector } from './sorted-value-collector'

export function convertExpressionToTsquery(
  exp: IQueryExpression
, collector: SortedValueCollector
, options: { prefix?: string; postfix?: string } = {}
): string {
  const { prefix = '', postfix = '' } = options

  if (isTermExpression(exp)) {
    const num = collector.next(exp)
    // 同时使用english和simple是为了应对前缀查询时的边缘情况,
    // 如果不需要前缀查询, 则可以省去simple部分
    return '('
         + `to_tsquery('english', $(${prefix}${num})${postfix})`
         + ' || '
         + `to_tsquery('simple', $(${prefix}${num}${postfix}))`
         + ')'
  }

  if (isPhraseExpression(exp)) {
    const result = (exp.slice(1) as IQueryExpression[])
      .map(x => convertExpressionToTsquery(x, collector, options))
      .join(' <-> ')

    return '(' + result + ')'
  }

  if (isPrefixExpression(exp)) {
    const num = collector.next(exp[1])
    return `CONCAT($(${prefix}${num}${postfix}), ':*')::tsquery`
  }

  if (isAndExpression(exp)) {
    return '('
         + convertExpressionToTsquery(exp[0], collector, options)
         + ' && '
         + convertExpressionToTsquery(exp[2], collector, options)
         + ')'
  }

  if (isOrExpression(exp)) {
    return '('
         + convertExpressionToTsquery(exp[0], collector, options)
         + ' || '
         + convertExpressionToTsquery(exp[2], collector, options)
         + ')'
  }

  if (isNotExpression(exp)) {
    return '('
         + '!! '
         + convertExpressionToTsquery(exp[1], collector, options)
         + ')'
  }

  throw new Error('Illegal expression')
}

function isExpression(exp: unknown): exp is IQueryExpression {
  return isTermExpression(exp)
      || isPhraseExpression(exp)
      || isPrefixExpression(exp)
      || isAndExpression(exp)
      || isOrExpression(exp)
      || isNotExpression(exp)
}

function isTermExpression(exp: unknown): exp is ITermExpression {
  return isString(exp)
}

function isPhraseExpression(exp: unknown): exp is IPhraseExpression {
  return isArray(exp)
      && exp.length >= 3
      && exp[0] === QueryKeyword.Phrase
      && exp.slice(1).every(isExpression)
}

function isPrefixExpression(exp: unknown): exp is IPrefixExpression {
  return isArray(exp)
      && exp.length === 2
      && exp[0] === QueryKeyword.Prefix
      && isString(exp[1])
}

function isAndExpression(exp: unknown): exp is IAndExpression {
  return isArray(exp)
      && exp.length === 3
      && exp[1] === QueryKeyword.And
      && isExpression(exp[0])
      && isExpression(exp[2])
}

function isOrExpression(exp: unknown): exp is IOrExpression {
  return isArray(exp)
      && exp.length === 3
      && exp[1] === QueryKeyword.Or
      && isExpression(exp[0])
      && isExpression(exp[2])
}

function isNotExpression(exp: unknown): exp is INotExpression {
  return isArray(exp)
      && exp.length === 2
      && exp[0] === QueryKeyword.Not
      && isExpression(exp[1])
}
