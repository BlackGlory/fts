import * as DAO from '@dao/data-in-postgresql/fts/get-all-namespaces.js'
import { toArrayAsync } from 'iterable-operator'
import { setRawObject } from './utils.js'
import { initializeDatabases, clearDatabases, closeAllConnections } from '@test/utils.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)
afterAll(closeAllConnections)

describe('getAllNamespaces(): AsyncIterable<string>', () => {
  describe('empty', () => {
    it('return AsyncIterable<string>', async () => {
      const iter = DAO.getAllNamespaces()
      const result = await toArrayAsync(iter)

      expect(result).toStrictEqual([])
    })
  })

  describe('not empty', () => {
    it('return AsyncIterable<string>', async () => {
      const namespace = 'namespace'
      const id = 'id'
      await setRawObject({
        namespace
      , bucket: 'bucket'
      , id
      , vector: ''
      })

      const iter = DAO.getAllNamespaces()
      const result = await toArrayAsync(iter)

      expect(result).toStrictEqual([namespace])
    })
  })
})
