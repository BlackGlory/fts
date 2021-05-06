import { getDatabase } from '../database'

export function getAllNamespacesWithTokens(): string[] {
  const result = getDatabase().prepare(`
    SELECT namespace
      FROM fts_token;
  `).all()

  return result.map(x => x['namespace'])
}

export function getAllTokens(
  namespace: string
): Array<{ token: string, write: boolean, query: boolean, delete: boolean }> {
  const result: Array<{
    token: string
    'write_permission': number
    'query_permission': number
    'delete_permission': number
  }> = getDatabase().prepare(`
    SELECT token
         , write_permission
         , query_permission
         , delete_permission
      FROM fts_token
     WHERE namespace = $namespace;
  `).all({ namespace })

  return result.map(x => ({
    token: x['token']
  , write: x['write_permission'] === 1
  , query: x['query_permission'] === 1
  , delete: x['delete_permission'] === 1
  }))
}

export function hasWriteTokens(namespace: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT 1
               FROM fts_token
              WHERE namespace = $namespace
                AND write_permission = 1
           ) AS write_tokens_exist
  `).get({ namespace })

  return result['write_tokens_exist'] === 1
}

export function matchWriteToken({ token, namespace }: {
  token: string
  namespace: string
}): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT 1
               FROM fts_token
              WHERE namespace = $namespace
                AND token = $token
                AND write_permission = 1
           ) AS matched
  `).get({ token, namespace })

  return result['matched'] === 1
}

export function setWriteToken({ token, namespace }: { token: string; namespace: string }) {
  getDatabase().prepare(`
    INSERT INTO fts_token (token, namespace, write_permission)
    VALUES ($token, $namespace, 1)
        ON CONFLICT (token, namespace)
        DO UPDATE SET write_permission = 1;
  `).run({ token, namespace })
}

export function unsetWriteToken({ token, namespace }: { token: string; namespace: string }) {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE fts_token
         SET write_permission = 0
       WHERE token = $token
         AND namespace = $namespace;
    `).run({ token, namespace })

    deleteNoPermissionToken({ token, namespace })
  })()
}

export function hasQueryTokens(namespace: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT 1
               FROM fts_token
              WHERE namespace = $namespace
                AND query_permission = 1
           ) AS query_tokens_exist
  `).get({ namespace })

  return result['query_tokens_exist'] === 1
}

export function matchQueryToken({ token, namespace }: {
  token: string;
  namespace: string
}): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT 1
               FROM fts_token
              WHERE namespace = $namespace
                AND token = $token
                AND query_permission = 1
           ) AS matched
  `).get({ token, namespace })

  return result['matched'] === 1
}

export function setQueryToken({ token, namespace }: { token: string; namespace: string }) {
  getDatabase().prepare(`
    INSERT INTO fts_token (token, namespace, query_permission)
    VALUES ($token, $namespace, 1)
        ON CONFLICT (token, namespace)
        DO UPDATE SET query_permission = 1;
  `).run({ token, namespace })
}

export function unsetQueryToken({ token, namespace }: { token: string; namespace: string }) {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE fts_token
         SET query_permission = 0
       WHERE token = $token
         AND namespace = $namespace;
    `).run({ token, namespace })

    deleteNoPermissionToken({ token, namespace })
  })()
}

export function matchDeleteToken({ token, namespace }: {
  token: string;
  namespace: string
}): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT 1
               FROM fts_token
              WHERE namespace = $namespace
                AND token = $token
                AND delete_permission = 1
           ) AS matched
  `).get({ token, namespace })

  return result['matched'] === 1
}

export function setDeleteToken({ token, namespace }: { token: string; namespace: string }) {
  getDatabase().prepare(`
    INSERT INTO fts_token (token, namespace, delete_permission)
    VALUES ($token, $namespace, 1)
        ON CONFLICT (token, namespace)
        DO UPDATE SET delete_permission = 1;
  `).run({ token, namespace })
}

export function unsetDeleteToken({ token, namespace }: { token: string; namespace: string }) {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE fts_token
         SET delete_permission = 0
       WHERE token = $token
         AND namespace = $namespace;
    `).run({ token, namespace })

    deleteNoPermissionToken({ token, namespace })
  })()
}

function deleteNoPermissionToken({ token, namespace }: { token: string, namespace: string }) {
  getDatabase().prepare(`
    DELETE FROM fts_token
     WHERE token = $token
       AND namespace = $namespace
       AND write_permission = 0
       AND query_permission = 0
       AND delete_permission = 0;
  `).run({ token, namespace })
}
