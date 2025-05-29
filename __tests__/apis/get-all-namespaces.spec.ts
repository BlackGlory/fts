import { describe, test, expect, beforeEach, afterEach, afterAll } from 'vitest'
import { setRawDocument } from './utils.js'
import { startService, stopService, closeAllConnections, buildClient } from '@test/utils.js'

beforeEach(startService)
afterEach(stopService)
afterAll(closeAllConnections)

describe('getAllNamespaces', () => {
  test('empty', async () => {
    const client = await buildClient()

    const result = await client.getAllNamespaces()

    expect(result).toStrictEqual([])
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

    const result = await client.getAllNamespaces()

    expect(result).toStrictEqual([namespace])
  })
})
