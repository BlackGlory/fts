import { setRawDocument } from './utils.js'
import { startService, stopService, closeAllConnections, buildClient } from '@test/utils.js'

beforeEach(startService)
afterEach(stopService)
afterAll(closeAllConnections)

describe('getNamespaceStats', () => {
  test('empty', async () => {
    const client = await buildClient()
    const namespace = 'namespace'

    const result = await client.getNamespaceStats(namespace)

    expect(result).toStrictEqual({
      namespace
    , buckets: 0
    , documents: 0
    })
  })

  test('not empty', async () => {
    const client = await buildClient()
    const namespace = 'namespace'
    const id = 'id'
    await setRawDocument({
      namespace
    , bucket: 'bucket'
    , id
    , vector: ''
    })

    const result = await client.getNamespaceStats(namespace)

    expect(result).toStrictEqual({
      namespace
    , buckets: 1
    , documents: 1
    })
  })
})
