import { FTSDAO } from '@dao/fts/index.js'
import { initializeDatabases, clearDatabases, closeAllConnections } from '@test/utils.js'
import { hasRawObject, setRawObject } from './utils.js'

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

      const result = await FTSDAO.deleteAllObjectsByNamespace(namespace1)

      expect(result).toBeUndefined()
      expect(await hasRawObject(namespace2, bucket, id)).toBe(true)
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

      const result = await FTSDAO.deleteAllObjectsByNamespace(namespace1)

      expect(result).toBeUndefined()
      expect(await hasRawObject(namespace1, bucket, id)).toBe(false)
      expect(await hasRawObject(namespace2, bucket, id)).toBe(true)
    })
  })
})
