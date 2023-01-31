import * as DAO from '@dao/data-in-postgresql/fts/delete-object.js'
import { initializeDatabases, clearDatabases, closeAllConnections } from '@test/utils.js'
import { hasRawObject, setRawObject } from './utils.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)
afterAll(closeAllConnections)

describe(`
  deleteObject(
    namespace: string
  , bucket: string
  , id: string
  ): Promise<void>
`, () => {
  describe('it exists', () => {
    it('return Promise<void>', async () => {
      const namespace = 'namespace'
      const bucket = 'bucket'
      const id = 'id'
      await setRawObject({
        namespace
      , bucket
      , id
      , vector: ''
      })

      const result = await DAO.deleteObject(namespace, bucket, id)

      expect(result).toBeUndefined()
      expect(await hasRawObject(namespace, bucket, id)).toBe(false)
    })
  })

  describe('it does not exist', () => {
    it('return Promise<void>', async () => {
      const namespace = 'namespace'
      const bucket = 'bucket'
      const id = 'id'

      const result = await DAO.deleteObject(namespace, bucket, id)

      expect(result).toBeUndefined()
      expect(await hasRawObject(namespace, bucket, id)).toBe(false)
    })
  })
})
