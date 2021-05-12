import * as DAO from '@dao/data-in-postgresql/fts/delete-all-objects-by-bucket'
import { initializeDatabases, clearDatabases, closeAllConnections } from '@test/utils'
import { hasRawObject, setRawObject } from './utils'
import '@blackglory/jest-matchers'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)
afterAll(closeAllConnections)

describe(`
  deleteAllObjectsByBucket(namespace: string, bucket: string): Promise<void>
`, () => {
  describe('empty', () => {
    it('return undefined', async () => {
      const namespace = 'namespace'
      const bucket1 = 'bucket-1'
      const bucket2 = 'bucket-2'
      const id = 'id'
      await setRawObject({
        namespace
      , bucket: bucket2
      , id
      , vector: ''
      })

      const result = await DAO.deleteAllObjectsByBucket(namespace, bucket1)

      expect(result).toBeUndefined()
      expect(await hasRawObject(namespace, bucket2, id)).toBeTrue()
    })
  })

  describe('not empty', () => {
    it('return undefined', async () => {
      const namespace = 'namespace'
      const bucket1 = 'bucket-1'
      const bucket2 = 'bucket-2'
      const id = 'id'
      await setRawObject({
        namespace
      , bucket: bucket1
      , id
      , vector: ''
      })
      await setRawObject({
        namespace
      , bucket: bucket2
      , id
      , vector: ''
      })

      const result = await DAO.deleteAllObjectsByBucket(namespace, bucket1)

      expect(result).toBeUndefined()
      expect(await hasRawObject(namespace, bucket1, id)).toBeFalse()
      expect(await hasRawObject(namespace, bucket2, id)).toBeTrue()
    })
  })
})
