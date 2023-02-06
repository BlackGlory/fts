import { setRawDocument } from './utils.js'
import { startService, stopService, closeAllConnections, buildClient } from '@test/utils.js'

beforeEach(startService)
afterEach(stopService)
afterAll(closeAllConnections)

describe('getAllBuckets', () => {
  test('empty', async () => {
    const client = await buildClient()
    const namespace1 = 'namespace-1'
    const namespace2 = 'namespace-2'
    const bucket = 'bucket'
    const id = 'id'
    await setRawDocument({
      namespace: namespace1
    , bucket
    , id
    , vector: ''
    })

    const result = await client.getAllBuckets(namespace2)

    expect(result).toStrictEqual([])
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

    const result = await client.getAllBuckets(namespace)

    expect(result).toStrictEqual([bucket])
  })
})
