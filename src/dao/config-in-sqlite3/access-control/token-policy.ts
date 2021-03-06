import { getDatabase } from '../database'

export function getAllNamespacesWithTokenPolicies(): string[] {
  const result = getDatabase().prepare(`
    SELECT namespace
      FROM fts_token_policy;
  `).all()
  return result.map(x => x['namespace'])
}

export function getTokenPolicies(namespace: string): {
  writeTokenRequired: boolean | null
  queryTokenRequired: boolean | null
  deleteTokenRequired: boolean | null
} {
  const row: {
    'write_token_required': number | null
  , 'query_token_required': number | null
  , 'delete_token_required': number | null
  } = getDatabase().prepare(`
    SELECT write_token_required
         , query_token_required
         , delete_token_required
      FROM fts_token_policy
     WHERE namespace = $namespace;
  `).get({ namespace })
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
}

export function setWriteTokenRequired(namespace: string, val: boolean): void {
  getDatabase().prepare(`
    INSERT INTO fts_token_policy (namespace, write_token_required)
    VALUES ($namespace, $writeTokenRequired)
        ON CONFLICT(namespace)
        DO UPDATE SET write_token_required = $writeTokenRequired;
  `).run({ namespace, writeTokenRequired: booleanToNumber(val) })
}

export function unsetWriteTokenRequired(namespace: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE fts_token_policy
         SET write_token_required = NULL
       WHERE namespace = $namespace;
    `).run({ namespace })

    deleteNoPoliciesRow(namespace)
  })()
}

export function setQueryTokenRequired(namespace: string, val: boolean): void {
  getDatabase().prepare(`
    INSERT INTO fts_token_policy (namespace, query_token_required)
    VALUES ($namespace, $queryTokenRequired)
        ON CONFLICT(namespace)
        DO UPDATE SET query_token_required = $queryTokenRequired;
  `).run({ namespace, queryTokenRequired: booleanToNumber(val) })
}

export function unsetQueryTokenRequired(namespace: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE fts_token_policy
         SET query_token_required = NULL
       WHERE namespace = $namespace;
    `).run({ namespace })

    deleteNoPoliciesRow(namespace)
  })()
}

export function setDeleteTokenRequired(namespace: string, val: boolean): void {
  getDatabase().prepare(`
    INSERT INTO fts_token_policy (namespace, delete_token_required)
    VALUES ($namespace, $deleteTokenRequired)
        ON CONFLICT(namespace)
        DO UPDATE SET delete_token_required = $deleteTokenRequired;
  `).run({ namespace, deleteTokenRequired: booleanToNumber(val) })
}

export function unsetDeleteTokenRequired(namespace: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE fts_token_policy
         SET delete_token_required = NULL
       WHERE namespace = $namespace;
    `).run({ namespace })

    deleteNoPoliciesRow(namespace)
  })()
}

function deleteNoPoliciesRow(namespace: string): void {
  getDatabase().prepare(`
    DELETE FROM fts_token_policy
     WHERE namespace = $namespace
       AND write_token_required = NULL
       AND query_token_required = NULL
       AND delete_token_required = NULL
  `).run({ namespace })
}

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
