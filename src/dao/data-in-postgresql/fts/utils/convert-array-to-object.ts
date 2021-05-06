/**
 * 该函数将数组转换为"从1开始计数的字符串作为key, 元素作为value"的对象.
 * 设计该函数是为了创建基于一系列命名参数的动态SQL, 例如"keyword1, keyword2, keyword3...".
 */
export function convertArrayToObject<T>(
  arr: T[]
, {
    prefix = ''
  , postfix = ''
  }: { prefix?: string; postfix?: string } = {}
): { [key: string]: T } {
  const entries = arr.map((x, i) => [`${prefix}${i + 1}${postfix}`, x])

  return Object.fromEntries(entries)
}
