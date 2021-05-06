import * as DAO from '@dao/data-in-postgresql/fts/delete-all-objects'
import { initializeDatabases, clearDatabases, closeAllConnections } from '@test/utils'
import { hasRawObject, setRawObject } from './utils'
import '@blackglory/jest-matchers'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)
afterAll(closeAllConnections)

describe('deleteAllObjects(namespace: string): Promise<void>', () => {
  describe('empty', () => {
    it('return undefined', async () => {
      const namesapce1 = 'namespace-1'
      const namesapce2 = 'namespace-2'
      const id = 'id'
      await setRawObject({
        namespace: namesapce2
      , id
      , vector: ''
      })

      const result = await DAO.deleteAllObjects(namesapce1)

      expect(result).toBeUndefined()
      expect(await hasRawObject(namesapce2, id)).toBeTrue()
    })
  })

  describe('not empty', () => {
    it('return undefined', async () => {
      const namesapce1 = 'namespace-1'
      const namesapce2 = 'namespace-2'
      const id = 'id'
      await setRawObject({
        namespace: namesapce1
      , id
      , vector: ''
      })
      await setRawObject({
        namespace: namesapce2
      , id
      , vector: ''
      })

      const result = await DAO.deleteAllObjects(namesapce1)

      expect(result).toBeUndefined()
      expect(await hasRawObject(namesapce1, id)).toBeFalse()
      expect(await hasRawObject(namesapce2, id)).toBeTrue()
    })
  })
})
