import { getDatabase } from '../database'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const getAllNamespacesWithTokens = withLazyStatic(function (): string[] {
  const result = lazyStatic(() => getDatabase().prepare(`
    SELECT namespace
      FROM fts_token;
  `), [getDatabase()]).all()

  return result.map(x => x['namespace'])
})

export const getAllTokens = withLazyStatic(function (
  namespace: string
): Array<{ token: string, write: boolean, query: boolean, delete: boolean }> {
  const result: Array<{
    token: string
    'write_permission': number
    'query_permission': number
    'delete_permission': number
  }> = lazyStatic(() => getDatabase().prepare(`
    SELECT token
         , write_permission
         , query_permission
         , delete_permission
      FROM fts_token
     WHERE namespace = $namespace;
  `), [getDatabase()]).all({ namespace })

  return result.map(x => ({
    token: x['token']
  , write: x['write_permission'] === 1
  , query: x['query_permission'] === 1
  , delete: x['delete_permission'] === 1
  }))
})

export const hasWriteTokens = withLazyStatic(function (namespace: string): boolean {
  const result = lazyStatic(() => getDatabase().prepare(`
    SELECT EXISTS(
             SELECT 1
               FROM fts_token
              WHERE namespace = $namespace
                AND write_permission = 1
           ) AS write_tokens_exist
  `), [getDatabase()]).get({ namespace })

  return result['write_tokens_exist'] === 1
})

export const matchWriteToken = withLazyStatic(function ({ token, namespace }: {
  token: string
  namespace: string
}): boolean {
  const result = lazyStatic(() => getDatabase().prepare(`
    SELECT EXISTS(
             SELECT 1
               FROM fts_token
              WHERE namespace = $namespace
                AND token = $token
                AND write_permission = 1
           ) AS matched
  `), [getDatabase()]).get({ token, namespace })

  return result['matched'] === 1
})

export const setWriteToken = withLazyStatic(function ({ token, namespace }: {
  token: string
  namespace: string
}): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO fts_token (token, namespace, write_permission)
    VALUES ($token, $namespace, 1)
        ON CONFLICT (token, namespace)
        DO UPDATE SET write_permission = 1;
  `), [getDatabase()]).run({ token, namespace })
})

export const unsetWriteToken = withLazyStatic(function (params: {
  token: string
  namespace: string
}): void {
  lazyStatic(() => getDatabase().transaction(({ token, namespace }: {
    token: string
    namespace: string
  }) => {
    lazyStatic(() => getDatabase().prepare(`
      UPDATE fts_token
         SET write_permission = 0
       WHERE token = $token
         AND namespace = $namespace;
    `), [getDatabase()]).run({ token, namespace })

    deleteNoPermissionToken({ token, namespace })
  }), [getDatabase()])(params)
})

export const hasQueryTokens = withLazyStatic(function (namespace: string): boolean {
  const result = lazyStatic(() => getDatabase().prepare(`
    SELECT EXISTS(
             SELECT 1
               FROM fts_token
              WHERE namespace = $namespace
                AND query_permission = 1
           ) AS query_tokens_exist
  `), [getDatabase()]).get({ namespace })

  return result['query_tokens_exist'] === 1
})

export const matchQueryToken = withLazyStatic(function ({ token, namespace }: {
  token: string;
  namespace: string
}): boolean {
  const result = lazyStatic(() => getDatabase().prepare(`
    SELECT EXISTS(
             SELECT 1
               FROM fts_token
              WHERE namespace = $namespace
                AND token = $token
                AND query_permission = 1
           ) AS matched
  `), [getDatabase()]).get({ token, namespace })

  return result['matched'] === 1
})

export const setQueryToken = withLazyStatic(function ({ token, namespace }: {
  token: string
  namespace: string
}): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO fts_token (token, namespace, query_permission)
    VALUES ($token, $namespace, 1)
        ON CONFLICT (token, namespace)
        DO UPDATE SET query_permission = 1;
  `), [getDatabase()]).run({ token, namespace })
})

export const unsetQueryToken = withLazyStatic(function (params: {
  token: string
  namespace: string
}): void {
  lazyStatic(() => getDatabase().transaction(({ token, namespace }: {
    token: string
    namespace: string
  }) => {
    lazyStatic(() => getDatabase().prepare(`
      UPDATE fts_token
         SET query_permission = 0
       WHERE token = $token
         AND namespace = $namespace;
    `), [getDatabase()]).run({ token, namespace })

    deleteNoPermissionToken({ token, namespace })
  }), [getDatabase()])(params)
})

export const matchDeleteToken = withLazyStatic(function ({ token, namespace }: {
  token: string;
  namespace: string
}): boolean {
  const result = lazyStatic(() => getDatabase().prepare(`
    SELECT EXISTS(
             SELECT 1
               FROM fts_token
              WHERE namespace = $namespace
                AND token = $token
                AND delete_permission = 1
           ) AS matched
  `), [getDatabase()]).get({ token, namespace })

  return result['matched'] === 1
})

export const setDeleteToken = withLazyStatic(function ({ token, namespace }: {
  token: string
  namespace: string
}): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO fts_token (token, namespace, delete_permission)
    VALUES ($token, $namespace, 1)
        ON CONFLICT (token, namespace)
        DO UPDATE SET delete_permission = 1;
  `), [getDatabase()]).run({ token, namespace })
})

export const unsetDeleteToken = withLazyStatic(function (params: {
  token: string
  namespace: string
}): void {
  lazyStatic(() => getDatabase().transaction(({ token, namespace }: {
    token: string
    namespace: string
  }) => {
    lazyStatic(() => getDatabase().prepare(`
      UPDATE fts_token
         SET delete_permission = 0
       WHERE token = $token
         AND namespace = $namespace;
    `), [getDatabase()]).run({ token, namespace })

    deleteNoPermissionToken({ token, namespace })
  }), [getDatabase()])(params)
})

const deleteNoPermissionToken = withLazyStatic(function ({ token, namespace }: {
  token: string
  namespace: string
}): void {
  lazyStatic(() => getDatabase().prepare(`
    DELETE FROM fts_token
     WHERE token = $token
       AND namespace = $namespace
       AND write_permission = 0
       AND query_permission = 0
       AND delete_permission = 0;
  `), [getDatabase()]).run({ token, namespace })
})
