import { getDatabase } from '@dao/config-in-sqlite3/database'

interface IRawBlacklist {
  namespace: string
}

interface IRawWhitelist {
  namespace: string
}

interface IRawTokenPolicy {
  namespace: string
  write_token_required: number | null
  query_token_required: number | null
  delete_token_required: number | null
}

interface IRawToken {
  token: string
  namespace: string
  write_permission: number
  query_permission: number
  delete_permission: number
}

export function setRawBlacklist(raw: IRawBlacklist): IRawBlacklist {
  getDatabase().prepare(`
    INSERT INTO fts_blacklist (namespace)
    VALUES ($namespace);
  `).run(raw)

  return raw
}

export function hasRawBlacklist(namespace: string): boolean {
  return !!getRawBlacklist(namespace)
}

export function getRawBlacklist(namespace: string): IRawBlacklist | null {
  return getDatabase().prepare(`
    SELECT *
      FROM fts_blacklist
     WHERE namespace = $namespace;
  `).get({ namespace })
}

export function setRawWhitelist(raw: IRawWhitelist): IRawWhitelist {
  getDatabase().prepare(`
    INSERT INTO fts_whitelist (namespace)
    VALUES ($namespace);
  `).run(raw)

  return raw
}

export function hasRawWhitelist(namespace: string): boolean {
  return !!getRawWhitelist(namespace)
}

export function getRawWhitelist(namespace: string): IRawWhitelist | null {
  return getDatabase().prepare(`
    SELECT *
      FROM fts_whitelist
     WHERE namespace = $namespace;
  `).get({ namespace })
}

export function setRawTokenPolicy<T extends IRawTokenPolicy>(raw: T): T {
  getDatabase().prepare(`
    INSERT INTO fts_token_policy (
      namespace
    , write_token_required
    , query_token_required
    , delete_token_required
    )
    VALUES (
      $namespace
    , $write_token_required
    , $query_token_required
    , $delete_token_required
    );
  `).run(raw)

  return raw
}

export function hasRawTokenPolicy(namespace: string): boolean {
  return !!getRawTokenPolicy(namespace)
}

export function getRawTokenPolicy(namespace: string): IRawTokenPolicy | null {
  return getDatabase().prepare(`
    SELECT *
      FROM fts_token_policy
     WHERE namespace = $namespace;
  `).get({ namespace })
}

export function setRawToken(raw: IRawToken): IRawToken {
  getDatabase().prepare(`
    INSERT INTO fts_token (
      token
    , namespace
    , write_permission
    , query_permission
    , delete_permission
    )
    VALUES (
      $token
    , $namespace
    , $write_permission
    , $query_permission
    , $delete_permission
    );
  `).run(raw)

  return raw
}

export function hasRawToken(token: string, namespace: string): boolean {
  return !!getRawToken(token, namespace)
}

export function getRawToken(token: string, namespace: string): IRawToken | null {
  return getDatabase().prepare(`
    SELECT *
      FROM fts_token
     WHERE token = $token
       AND namespace = $id;
  `).get({ token, id: namespace })
}
