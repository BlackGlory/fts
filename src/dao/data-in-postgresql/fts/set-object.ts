import { db } from '../database'

export async function setObject(
  namespace: string
, bucket: string
, id: string
, lexemes: string[]
): Promise<void> {
  await db.none(`
    INSERT INTO fts_object (namespace, bucket, id, vector)
    VALUES (
      $(namespace)
    , $(bucket)
    , $(id)
    , to_tsvector('english', $(lexemes)) || to_tsvector('simple', $(lexemes))
    )
        ON CONFLICT (namespace, bucket, id)
        DO UPDATE SET vector = to_tsvector('english', $(lexemes))
                            || to_tsvector('simple', $(lexemes))
  `, { namespace, bucket, id, lexemes: lexemes.join(' ') })
}
