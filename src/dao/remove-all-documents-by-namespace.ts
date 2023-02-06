import { db } from '@src/database.js'

export async function removeAllDocumentsByNamespace(namespace: string): Promise<void> {
  await db.none(`
    DELETE FROM fts_document
     WHERE namespace = $(namespace)
  `, { namespace })
}
