import { startService, stopService, closeAllConnections, buildClient } from '@test/utils.js'
import { hasRawDocument, setRawDocument } from './utils.js'

beforeEach(startService)
afterEach(stopService)
afterAll(closeAllConnections)

describe('removeDocument', () => {
  test('document exists', async () => {
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

    await client.removeDocument(namespace, bucket, id)

    expect(await hasRawDocument(namespace, bucket, id)).toBe(false)
  })

  test('document does not exist', async () => {
    const client = await buildClient()
    const namespace = 'namespace'
    const bucket = 'bucket'
    const id = 'id'

    await client.removeDocument(namespace, bucket, id)

    expect(await hasRawDocument(namespace, bucket, id)).toBe(false)
  })
})
