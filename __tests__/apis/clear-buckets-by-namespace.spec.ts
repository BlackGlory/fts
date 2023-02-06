import { startService, stopService, closeAllConnections, buildClient } from '@test/utils.js'
import { hasRawDocument, setRawDocument } from './utils.js'

beforeEach(startService)
afterEach(stopService)
afterAll(closeAllConnections)

describe('clearBucketsByNamespace', () => {
  test('empty', async () => {
    const client = await buildClient()
    const namespace1 = 'namespace-1'
    const namespace2 = 'namespace-2'
    const bucket = 'bucket'
    const id = 'id'
    await setRawDocument({
      namespace: namespace2
    , bucket
    , id
    , vector: ''
    })

    await client.clearBucketsByNamespace(namespace1)

    expect(await hasRawDocument(namespace2, bucket, id)).toBe(true)
  })

  test('not empty', async () => {
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
    await setRawDocument({
      namespace: namespace2
    , bucket
    , id
    , vector: ''
    })

    await client.clearBucketsByNamespace(namespace1)

    expect(await hasRawDocument(namespace1, bucket, id)).toBe(false)
    expect(await hasRawDocument(namespace2, bucket, id)).toBe(true)
  })
})
