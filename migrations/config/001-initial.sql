--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

-- 在WAL模式下, better-sqlite3可充分发挥性能
PRAGMA journal_mode = WAL;

-- SQLite 会将VARCHAR(255)转换为TEXT, 将BOOLEAN转换为NUMERIC, 使用这些数据类型是出于可读性考虑
-- fts资源本身是松散的, 没有自己的表

CREATE TABLE fts_blacklist (
  namespace VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE fts_whitelist (
  namespace VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE fts_token_policy (
  namespace             VARCHAR(255) NOT NULL UNIQUE
, write_token_required  BOOLEAN
, query_token_required  BOOLEAN
, delete_token_required BOOLEAN
);

CREATE TABLE fts_token (
  namespace         VARCHAR(255) NOT NULL
, token             VARCHAR(255) NOT NULL
, write_permission  BOOLEAN      NOT NULL DEFAULT 0 CHECK(write_permission IN (0,1))
, query_permission  BOOLEAN      NOT NULL DEFAULT 0 CHECK(query_permission IN (0,1))
, delete_permission BOOLEAN      NOT NULL DEFAULT 0 CHECK(delete_permission IN (0,1))
, UNIQUE (token, namespace)
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

PRAGMA journal_mode = DELETE;

DROP TABLE fts_blacklist;
DROP TABLE fts_whitelist;
DROP TABLE fts_token_policy;
DROP TABLE fts_token;
