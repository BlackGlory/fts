import * as DAO from '@dao/data-in-postgresql/fts/delete-all-objects-by-namespace'
import { initializeDatabases, clearDatabases, closeAllConnections } from '@test/utils'
import { hasRawObject, setRawObject } from './utils'
import '@blackglory/jest-matchers'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)
afterAll(closeAllConnections)

describe('deleteAllObjectsByNamespace(namespace: string): Promise<void>', () => {
  describe('empty', () => {
    it('return undefined', async () => {
      const namespace1 = 'namespace-1'
      const namespace2 = 'namespace-2'
      const bucket = 'bucket'
      const id = 'id'
      await setRawObject({
        namespace: namespace2
      , bucket
      , id
      , vector: ''
      })

      const result = await DAO.deleteAllObjectsByNamespace(namespace1)

      expect(result).toBeUndefined()
      expect(await hasRawObject(namespace2, bucket, id)).toBeTrue()
    })
  })

  describe('not empty', () => {
    it('return undefined', async () => {
      const namespace1 = 'namespace-1'
      const namespace2 = 'namespace-2'
      const bucket = 'bucket'
      const id = 'id'
      await setRawObject({
        namespace: namespace1
      , bucket
      , id
      , vector: ''
      })
      await setRawObject({
        namespace: namespace2
      , bucket
      , id
      , vector: ''
      })

      const result = await DAO.deleteAllObjectsByNamespace(namespace1)

      expect(result).toBeUndefined()
      expect(await hasRawObject(namespace1, bucket, id)).toBeFalse()
      expect(await hasRawObject(namespace2, bucket, id)).toBeTrue()
    })
  })
})
