import { db } from '@dao/data-in-postgresql/database.js'

interface IRawObject {
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

export async function setRawObject(raw: IRawObject): Promise<IRawObject> {
  await db.none(`
    INSERT INTO fts_object (namespace, bucket, id, vector)
    VALUES (
      $(namespace)
    , $(bucket)
    , $(id)
    , $(vector)::tsvector
    )
  `, raw)

  return raw
}

export async function hasRawObject(
  namespace: string
, bucket: string
, id: string
): Promise<boolean> {
  return !!await getRawObject(namespace, bucket, id)
}

export async function getRawObject(
  namespace: string
, bucket: string
, id: string
): Promise<IRawObject | null> {
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
      FROM fts_object
     WHERE namespace = $(namespace)
       AND bucket =  $(bucket)
       AND id = $(id)
  `, { namespace, bucket, id })
  if (!result) return null

  return result
}
