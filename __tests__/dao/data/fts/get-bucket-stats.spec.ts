import { FTSDAO } from '@dao/data/fts/index.js'
import { setRawObject } from './utils.js'
import { initializeDatabases, clearDatabases, closeAllConnections } from '@test/utils.js'

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

      const result = await FTSDAO.getBucketStats(namespace, bucket)

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

      const result = await FTSDAO.getBucketStats(namespace, bucket)

      expect(result).toStrictEqual({
        namespace
      , bucket
      , objects: 1
      })
    })
  })
})