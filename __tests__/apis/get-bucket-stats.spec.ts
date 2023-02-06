import { setRawDocument } from './utils.js'
import { startService, stopService, closeAllConnections, buildClient } from '@test/utils.js'

beforeEach(startService)
afterEach(stopService)
afterAll(closeAllConnections)

describe('getBucketStats', () => {
  test('empty', async () => {
    const client = await buildClient()
    const namespace = 'namespace'
    const bucket = 'bucket'

    const result = await client.getBucketStats(namespace, bucket)

    expect(result).toStrictEqual({
      namespace
    , bucket
    , documents: 0
    })
  })

  test('not empty', async () => {
    const client = await buildClient()
    const namespace = 'namespace'
    const bucket = 'bucket'
    const id = 'id'
    await setRawDocument({
      namespace
    , bucket
    , id
    , vector: ''
    })

    const result = await client.getBucketStats(namespace, bucket)

    expect(result).toStrictEqual({
      namespace
    , bucket
    , documents: 1
    })
  })
})
