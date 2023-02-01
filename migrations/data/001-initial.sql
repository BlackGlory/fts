--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE fts_object (
  namespace VARCHAR(255) NOT NULL
, bucket    VARCHAR(255) NOT NULL
, id        VARCHAR(255) NOT NULL
, vector    tsvector     NOT NULL
, UNIQUE (namespace, bucket, id)
);

CREATE INDEX idx_fts_object_vector
    ON fts_object
 USING GIN (vector)
  WITH (fastupdate = ON);

-- getNamespaceStats
CREATE INDEX idx_namespace
    ON fts_object (namespace);

-- getBucketStats
CREATE INDEX idx_namespace_bucket
    ON fts_object (namespace, bucket);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE fts_object;
