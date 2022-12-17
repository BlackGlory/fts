import * as DAO from '@dao/data-in-postgresql/fts/get-namespace-stats'
import { setRawObject } from './utils'
import { initializeDatabases, clearDatabases, closeAllConnections } from '@test/utils'

jest.mock('@dao/config-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)
afterAll(closeAllConnections)

describe('getNamespaceStats(namespace: string): Promise<INamespaceStats>', () => {
  describe('empty', () => {
    it('return Promise<IStats>', async () => {
      const namespace = 'namespace'

      const result = await DAO.getNamespaceStats(namespace)

      expect(result).toStrictEqual({
        namespace
      , buckets: 0
      , objects: 0
      })
    })
  })

  describe('not empty', () => {
    it('return Promise<IStats>', async () => {
      const namespace = 'namespace'
      const id = 'id'
      await setRawObject({
        namespace
      , bucket: 'bucket'
      , id
      , vector: ''
      })

      const result = await DAO.getNamespaceStats(namespace)

      expect(result).toStrictEqual({
        namespace
      , buckets: 1
      , objects: 1
      })
    })
  })
})
