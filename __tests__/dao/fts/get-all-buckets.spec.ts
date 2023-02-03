import { FTSDAO } from '@dao/fts/index.js'
import { toArrayAsync } from 'iterable-operator'
import { setRawObject } from './utils.js'
import { initializeDatabases, clearDatabases, closeAllConnections } from '@test/utils.js'

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

      const iter = FTSDAO.getAllBuckets(namespace2)
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

      const iter = FTSDAO.getAllBuckets(namespace)
      const result = await toArrayAsync(iter)

      expect(result).toStrictEqual([bucket])
    })
  })
})
