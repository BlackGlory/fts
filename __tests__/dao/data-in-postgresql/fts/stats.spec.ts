import * as DAO from '@dao/data-in-postgresql/fts/stats'
import { setRawObject } from './utils'
import { initializeDatabases, clearDatabases, closeAllConnections } from '@test/utils'
import '@blackglory/jest-matchers'

jest.mock('@dao/config-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)
afterAll(closeAllConnections)

describe('stats(): Promise<IStats>', () => {
  describe('empty', () => {
    it('return Promise<IStats>', async () => {
      const namespace = 'namespace'

      const result = await DAO.stats(namespace)

      expect(result).toStrictEqual({
        namespace
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
      , id
      , vector: ''
      })

      const result = await DAO.stats(namespace)

      expect(result).toStrictEqual({
        namespace
      , objects: 1
      })
    })
  })
})
