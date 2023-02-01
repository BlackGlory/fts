import { getDatabase } from '../database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const getAllNamespacesWithTokenPolicies = withLazyStatic((): string[] => {
  const result = lazyStatic(() => getDatabase().prepare(`
    SELECT namespace
      FROM fts_token_policy;
  `), [getDatabase()])
    .all() as Array<{ namespace: string }>

  return result.map(x => x['namespace'])
})

export const getTokenPolicies = withLazyStatic((namespace: string): {
  writeTokenRequired: boolean | null
  queryTokenRequired: boolean | null
  deleteTokenRequired: boolean | null
} => {
  const row = lazyStatic(() => getDatabase().prepare(`
    SELECT write_token_required
         , query_token_required
         , delete_token_required
      FROM fts_token_policy
     WHERE namespace = $namespace;
  `), [getDatabase()])
    .get({ namespace }) as {
      write_token_required: number | null
    , query_token_required: number | null
    , delete_token_required: number | null
    } | undefined

  if (row) {
    const writeTokenRequired = row['write_token_required']
    const queryTokenRequired = row['query_token_required']
    const deleteTokenRequired = row['delete_token_required']
    return {
      writeTokenRequired:
        writeTokenRequired === null
        ? null
        : numberToBoolean(writeTokenRequired)
    , queryTokenRequired:
        queryTokenRequired === null
        ? null
        : numberToBoolean(queryTokenRequired)
    , deleteTokenRequired:
        deleteTokenRequired === null
        ? null
        : numberToBoolean(deleteTokenRequired)
    }
  } else {
    return {
      writeTokenRequired: null
    , queryTokenRequired: null
    , deleteTokenRequired: null
    }
  }
})

export const setWriteTokenRequired = withLazyStatic(function (
  namespace: string
, val: boolean
): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO fts_token_policy (namespace, write_token_required)
    VALUES ($namespace, $writeTokenRequired)
        ON CONFLICT(namespace)
        DO UPDATE SET write_token_required = $writeTokenRequired;
  `), [getDatabase()]).run({ namespace, writeTokenRequired: booleanToNumber(val) })
})

export const unsetWriteTokenRequired = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().transaction((namespace: string) => {
    lazyStatic(() => getDatabase().prepare(`
      UPDATE fts_token_policy
         SET write_token_required = NULL
       WHERE namespace = $namespace;
    `), [getDatabase()]).run({ namespace })

    deleteNoPoliciesRow(namespace)
  }), [getDatabase()])(namespace)
})

export const setQueryTokenRequired = withLazyStatic(function (
  namespace: string
, val: boolean
): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO fts_token_policy (namespace, query_token_required)
    VALUES ($namespace, $queryTokenRequired)
        ON CONFLICT(namespace)
        DO UPDATE SET query_token_required = $queryTokenRequired;
  `), [getDatabase()]).run({ namespace, queryTokenRequired: booleanToNumber(val) })
})

export const unsetQueryTokenRequired = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().transaction((namespace: string) => {
    lazyStatic(() => getDatabase().prepare(`
      UPDATE fts_token_policy
         SET query_token_required = NULL
       WHERE namespace = $namespace;
    `), [getDatabase()]).run({ namespace })

    deleteNoPoliciesRow(namespace)
  }), [getDatabase()])(namespace)
})

export const setDeleteTokenRequired = withLazyStatic(function (
  namespace: string
, val: boolean
): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO fts_token_policy (namespace, delete_token_required)
    VALUES ($namespace, $deleteTokenRequired)
        ON CONFLICT(namespace)
        DO UPDATE SET delete_token_required = $deleteTokenRequired;
  `), [getDatabase()]).run({ namespace, deleteTokenRequired: booleanToNumber(val) })
})

export const unsetDeleteTokenRequired = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().transaction((namespace: string) => {
    lazyStatic(() => getDatabase().prepare(`
      UPDATE fts_token_policy
         SET delete_token_required = NULL
       WHERE namespace = $namespace;
    `), [getDatabase()]).run({ namespace })

    deleteNoPoliciesRow(namespace)
  }), [getDatabase()])(namespace)
})

const deleteNoPoliciesRow = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().prepare(`
    DELETE FROM fts_token_policy
     WHERE namespace = $namespace
       AND write_token_required = NULL
       AND query_token_required = NULL
       AND delete_token_required = NULL
  `), [getDatabase()]).run({ namespace })
})

function numberToBoolean(val: number): boolean {
  if (val === 0) {
    return false
  } else {
    return true
  }
}

function booleanToNumber(val: boolean): number {
  if (val) {
    return 1
  } else {
    return 0
  }
}
