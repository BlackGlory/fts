import { db } from '../database'

export async function setObject(
  namespace: string
, id: string
, lexemes: string[]
): Promise<void> {
  await db.none(`
    INSERT INTO fts_object (namespace, id, vector)
    VALUES (
      $(namespace)
    , $(id)
    , to_tsvector('english', $(lexemes)) || to_tsvector('simple', $(lexemes))
    )
        ON CONFLICT (namespace, id)
        DO UPDATE SET vector = to_tsvector('english', $(lexemes))
                            || to_tsvector('simple', $(lexemes))
  `, { namespace, id , lexemes: lexemes.join(' ') })
}
