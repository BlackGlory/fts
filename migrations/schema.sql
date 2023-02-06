CREATE TABLE fts_document (
  namespace VARCHAR(255) NOT NULL
, bucket    VARCHAR(255) NOT NULL
, id        VARCHAR(255) NOT NULL
, vector    tsvector     NOT NULL
, UNIQUE (namespace, bucket, id)
);

CREATE INDEX idx_fts_document_vector
    ON fts_object
 USING GIN (vector)
  WITH (fastupdate = ON);

-- getNamespaceStats
CREATE INDEX idx_fts_document_namespace
    ON fts_document (namespace);

-- getBucketStats
CREATE INDEX idx_fts_document_namespace_bucket
    ON fts_document (namespace, bucket);
