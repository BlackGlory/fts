import { describe, test, expect, beforeEach, afterEach, afterAll } from 'vitest'
import { startService, stopService, buildClient, closeAllConnections } from '@test/utils.js'
import { hasRawDocument, setRawDocument } from './utils.js'

beforeEach(startService)
afterEach(stopService)
afterAll(closeAllConnections)

describe('clearDocumentsByBucket', () => {
  test('empty', async () => {
    const client = await buildClient()
    const namespace = 'namespace'
    const bucket1 = 'bucket-1'
    const bucket2 = 'bucket-2'
    const id = 'id'
    await setRawDocument({
      namespace
    , bucket: bucket2
    , id
    , vector: ''
    })

    await client.clearDocumentsByBucket(namespace, bucket1)

    expect(await hasRawDocument(namespace, bucket2, id)).toBe(true)
  })

  test('not empty', async () => {
    const client = await buildClient()
    const namespace = 'namespace'
    const bucket1 = 'bucket-1'
    const bucket2 = 'bucket-2'
    const id = 'id'
    await setRawDocument({
      namespace
    , bucket: bucket1
    , id
    , vector: ''
    })
    await setRawDocument({
      namespace
    , bucket: bucket2
    , id
    , vector: ''
    })

    await client.clearDocumentsByBucket(namespace, bucket1)

    expect(await hasRawDocument(namespace, bucket1, id)).toBe(false)
    expect(await hasRawDocument(namespace, bucket2, id)).toBe(true)
  })
})
