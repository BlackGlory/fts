import * as DAO from '@dao/data-in-postgresql/fts/get-all-buckets'
import { toArrayAsync } from 'iterable-operator'
import { setRawObject } from './utils'
import { initializeDatabases, clearDatabases, closeAllConnections } from '@test/utils'

jest.mock('@dao/config-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)
afterAll(closeAllConnections)

describe('getAllBuckets(namespace: string): AsyncIterable<string>', () => {
  describe('empty', () => {
    it('return AsyncIterable<string>', async () => {
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

      const iter = DAO.getAllBuckets(namespace2)
      const result = await toArrayAsync(iter)

      expect(result).toStrictEqual([])
    })
  })

  describe('not empty', () => {
    it('return AsyncIterable<string>', async () => {
      const namespace = 'namespace'
      const bucket = 'bucket'
      const id = 'id'
      await setRawObject({
        namespace
      , bucket
      , id
      , vector: ''
      })

      const iter = DAO.getAllBuckets(namespace)
      const result = await toArrayAsync(iter)

      expect(result).toStrictEqual([bucket])
    })
  })
})
