--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE fts_object (
  namespace VARCHAR(255) NOT NULL
, id        VARCHAR(255) NOT NULL
, vector    tsvector     NOT NULL
, UNIQUE (namespace, id)
);

CREATE INDEX idx_fts_object_tsv
    ON fts_object
 USING GIN (vector);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE fts_object;
