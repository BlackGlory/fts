--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

ALTER TABLE fts_object
RENAME TO fts_document;

ALTER INDEX idx_fts_object_vector
RENAME TO idx_fts_document_vector;

ALTER INDEX idx_namespace
RENAME TO idx_fts_document_namespace;

ALTER INDEX idx_namespace_bucket
RENAME TO idx_fts_document_namespace_bucket;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

ALTER TABLE fts_document
RENAME TO fts_object;

ALTER INDEX idx_fts_document_vector
RENAME TO idx_fts_object_vector;

ALTER INDEX idx_fts_document_namespace
RENAME TO idx_namespace;

ALTER INDEX idx_fts_document_namespace_bucket
RENAME TO idx_namespace_bucket;
