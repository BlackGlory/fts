import { getDatabase } from '../database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const getAllBlacklistItems = withLazyStatic((): string[] => {
  const result = lazyStatic(() => getDatabase().prepare(`
    SELECT namespace
      FROM fts_blacklist;
  `), [getDatabase()])
    .all() as Array<{ namespace: string }>

  return result.map(x => x['namespace'])
})

export const inBlacklist = withLazyStatic((namespace: string): boolean => {
  const result = lazyStatic(() => getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM fts_blacklist
              WHERE namespace = $namespace
           ) AS exist_in_blacklist;
  `), [getDatabase()])
    .get({ namespace }) as { exist_in_blacklist: 1 | 0 }

  return result['exist_in_blacklist'] === 1
})

export const addBlacklistItem = withLazyStatic((namespace: string): void => {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO fts_blacklist (namespace)
    VALUES ($namespace)
        ON CONFLICT
        DO NOTHING;
  `), [getDatabase()]).run({ namespace })
})

export const removeBlacklistItem = withLazyStatic((namespace: string): void => {
  lazyStatic(() => getDatabase().prepare(`
    DELETE FROM fts_blacklist
     WHERE namespace = $namespace;
  `), [getDatabase()]).run({ namespace })
})
