import * as DAO from '@dao/data-in-postgresql/fts/get-bucket-stats'
import { setRawObject } from './utils'
import { initializeDatabases, clearDatabases, closeAllConnections } from '@test/utils'
import '@blackglory/jest-matchers'

jest.mock('@dao/config-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)
afterAll(closeAllConnections)

describe(`
  getBucketStats(namespace: string, bucket: string): Promise<IBucketStats>
`, () => {
  describe('empty', () => {
    it('return Promise<IStats>', async () => {
      const namespace = 'namespace'
      const bucket = 'bucket'

      const result = await DAO.getBucketStats(namespace, bucket)

      expect(result).toStrictEqual({
        namespace
      , bucket
      , objects: 0
      })
    })
  })

  describe('not empty', () => {
    it('return Promise<IStats>', async () => {
      const namespace = 'namespace'
      const bucket = 'bucket'
      const id = 'id'
      await setRawObject({
        namespace
      , bucket
      , id
      , vector: ''
      })

      const result = await DAO.getBucketStats(namespace, bucket)

      expect(result).toStrictEqual({
        namespace
      , bucket
      , objects: 1
      })
    })
  })
})
