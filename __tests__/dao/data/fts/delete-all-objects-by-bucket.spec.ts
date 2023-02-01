import { FTSDAO } from '@dao/data/fts/index.js'
import { initializeDatabases, clearDatabases, closeAllConnections } from '@test/utils.js'
import { hasRawObject, setRawObject } from './utils.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)
afterAll(closeAllConnections)

describe(`
  deleteAllObjectsByBucket(namespace: string, bucket: string): Promise<void>
`, () => {
  describe('empty', () => {
    it('return undefined', async () => {
      const namespace = 'namespace'
      const bucket1 = 'bucket-1'
      const bucket2 = 'bucket-2'
      const id = 'id'
      await setRawObject({
        namespace
      , bucket: bucket2
      , id
      , vector: ''
      })

      const result = await FTSDAO.deleteAllObjectsByBucket(namespace, bucket1)

      expect(result).toBeUndefined()
      expect(await hasRawObject(namespace, bucket2, id)).toBe(true)
    })
  })

  describe('not empty', () => {
    it('return undefined', async () => {
      const namespace = 'namespace'
      const bucket1 = 'bucket-1'
      const bucket2 = 'bucket-2'
      const id = 'id'
      await setRawObject({
        namespace
      , bucket: bucket1
      , id
      , vector: ''
      })
      await setRawObject({
        namespace
      , bucket: bucket2
      , id
      , vector: ''
      })

      const result = await FTSDAO.deleteAllObjectsByBucket(namespace, bucket1)

      expect(result).toBeUndefined()
      expect(await hasRawObject(namespace, bucket1, id)).toBe(false)
      expect(await hasRawObject(namespace, bucket2, id)).toBe(true)
    })
  })
})
