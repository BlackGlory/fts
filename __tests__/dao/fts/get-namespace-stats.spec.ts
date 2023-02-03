import { FTSDAO } from '@dao/fts/index.js'
import { setRawObject } from './utils.js'
import { initializeDatabases, clearDatabases, closeAllConnections } from '@test/utils.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)
afterAll(closeAllConnections)

describe('getNamespaceStats(namespace: string): Promise<INamespaceStats>', () => {
  describe('empty', () => {
    it('return Promise<IStats>', async () => {
      const namespace = 'namespace'

      const result = await FTSDAO.getNamespaceStats(namespace)

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

      const result = await FTSDAO.getNamespaceStats(namespace)

      expect(result).toStrictEqual({
        namespace
      , buckets: 1
      , objects: 1
      })
    })
  })
})
