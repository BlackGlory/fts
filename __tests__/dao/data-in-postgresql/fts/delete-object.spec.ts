import * as DAO from '@dao/data-in-postgresql/fts/delete-object'
import { initializeDatabases, clearDatabases, closeAllConnections } from '@test/utils'
import { hasRawObject, setRawObject } from './utils'
import '@blackglory/jest-matchers'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)
afterAll(closeAllConnections)

describe('deleteObject(namespace: string, id: string): Promise<void>', () => {
  describe('it exists', () => {
    it('return Promise<void>', async () => {
      const namespace = 'namespace'
      const id = 'id'
      await setRawObject({
        namespace
      , id
      , vector: ''
      })

      const result = await DAO.deleteObject(namespace, id)

      expect(result).toBeUndefined()
      expect(await hasRawObject(namespace, id)).toBeFalse()
    })
  })

  describe('it does not exist', () => {
    it('return Promise<void>', async () => {
      const namespace = 'namespace'
      const id = 'id'

      const result = await DAO.deleteObject(namespace, id)

      expect(result).toBeUndefined()
      expect(await hasRawObject(namespace, id)).toBeFalse()
    })
  })
})
