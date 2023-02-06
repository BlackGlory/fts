import { db } from '@src/database.js'

export async function setDocument(
  namespace: string
, bucket: string
, id: string
, lexemes: string[]
): Promise<void> {
  // 同时使用english和simple是为了应对前缀查询时的边缘情况,
  // 如果不需要前缀查询, 则可以省去simple部分
  await db.none(
    `
      INSERT INTO fts_document (namespace, bucket, id, vector)
      VALUES (
        $(namespace)
      , $(bucket)
      , $(id)
      , to_tsvector('english', $(lexemes)) || to_tsvector('simple', $(lexemes))
      )
          ON CONFLICT (namespace, bucket, id)
          DO UPDATE SET vector = to_tsvector('english', $(lexemes))
                              || to_tsvector('simple', $(lexemes))
    `
  , {
      namespace
    , bucket
    , id
    , lexemes: lexemes.join(' ')
    }
  )
}
