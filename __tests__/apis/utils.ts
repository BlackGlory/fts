import { db } from '@src/database.js'

interface IRawDocument {
  namespace: string
  bucket: string
  id: string
  vector: string
}

export async function toVector(lexemes: string[]): Promise<string> {
  const result = await db.one<{ vector: string }>(`
    SELECT to_tsvector('english', $(lexemes))
        || to_tsvector('simple', $(lexemes)) AS vector
  `, { lexemes: lexemes.join(' ') })

  return result.vector
}

export async function setRawDocument(raw: IRawDocument): Promise<IRawDocument> {
  await db.none(`
    INSERT INTO fts_document (namespace, bucket, id, vector)
    VALUES (
      $(namespace)
    , $(bucket)
    , $(id)
    , $(vector)::tsvector
    )
  `, raw)

  return raw
}

export async function hasRawDocument(
  namespace: string
, bucket: string
, id: string
): Promise<boolean> {
  return !!await getRawDocument(namespace, bucket, id)
}

export async function getRawDocument(
  namespace: string
, bucket: string
, id: string
): Promise<IRawDocument | null> {
  const result = await db.oneOrNone<{
    namespace: string
    bucket: string
    id: string
    vector: string
  }>(`
    SELECT namespace
         , bucket
         , id
         , vector
      FROM fts_document
     WHERE namespace = $(namespace)
       AND bucket =  $(bucket)
       AND id = $(id)
  `, { namespace, bucket, id })
  if (!result) return null

  return result
}
