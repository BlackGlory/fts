import { startService, stopService, closeAllConnections, buildClient } from '@test/utils.js'
import { setRawDocument, toVector } from './utils.js'
import { QueryKeyword } from '@src/contract.js'

beforeEach(startService)
afterEach(stopService)
afterAll(closeAllConnections)

describe('queryDocuments', () => {
  test('namespace does not exist', async () => {
    const client = await buildClient()
    const namespace1 = 'namespace-1'
    const namespace2 = 'naemspace-2'
    const bucket = 'bucket'
    await setRawDocument({
      namespace: namespace1
    , bucket
    , id: 'id'
    , vector: await toVector(['one', 'two', 'three'])
    })

    const result = await client.queryDocuments(namespace2, 'three')

    expect(result).toStrictEqual([])
  })

  test('limit', async () => {
    const client = await buildClient()
    const namespace = 'namespace'
    const bucket = 'bucket'
    const id1 = 'id-1'
    const id2 = 'id-2'
    await setRawDocument({
      namespace
    , bucket
    , id: id1
    , vector: await toVector(['one', 'two', 'three'])
    })
    await setRawDocument({
      namespace
    , bucket
    , id: id2
    , vector: await toVector(['one', 'two', 'three'])
    })

    const result = await client.queryDocuments(namespace, 'three', { limit: 1 })

    expect(result).toStrictEqual([
      {
        bucket
      , documentId: id1
      }
    ])
  })

  test('buckets', async () => {
    const client = await buildClient()
    const namespace = 'namespace'
    const bucket1 = 'bucket-1'
    const bucket2 = 'bucket-2'
    const id = 'id'
    await setRawDocument({
      namespace
    , bucket: bucket1
    , id
    , vector: await toVector(['one', 'two', 'three'])
    })
    await setRawDocument({
      namespace
    , bucket: bucket2
    , id
    , vector: await toVector(['one', 'two', 'three'])
    })

    const result = await client.queryDocuments(
      namespace
    , 'three'
    , { buckets: [bucket1] }
    )

    expect(result).toStrictEqual([
      {
        bucket: bucket1
      , documentId: id
      }
    ])
  })

  describe('term expression', () => {
    test('not matched', async () => {
      const client = await buildClient()
      const namespace = 'namespace'
      const bucket = 'bucket'
      const id = 'id'
      await setRawDocument({
        namespace
      , bucket
      , id
      , vector: await toVector(['one', 'two'])
      })

      const result = await client.queryDocuments(namespace, 'three')

      expect(result).toStrictEqual([])
    })

    test('match', async () => {
      const client = await buildClient()
      const namespace = 'namespace'
      const bucket = 'bucket'
      const id = 'id'
      await setRawDocument({
        namespace
      , bucket
      , id
      , vector: await toVector(['one', 'two', 'three'])
      })

      const result = await client.queryDocuments(namespace, 'three')

      expect(result).toStrictEqual([
        {
          bucket
        , documentId: id
        }
      ])
    })
  })

  describe('phrase expression', () => {
    test('not matched', async () => {
      const client = await buildClient()
      const namespace = 'namespace'
      const bucket = 'bucket'
      const id = 'id'
      await setRawDocument({
        namespace
      , bucket
      , id
      , vector: await toVector(['one', 'two', 'three'])
      })

      const result = await client.queryDocuments(
        namespace
      , [QueryKeyword.Phrase, 'one', 'three']
      , {}
      )

      expect(result).toStrictEqual([])
    })

    test('match', async () => {
      const client = await buildClient()
      const namespace = 'namespace'
      const bucket = 'bucket'
      const id = 'id'
      await setRawDocument({
        namespace
      , bucket
      , id
      , vector: await toVector(['one', 'two', 'three'])
      })

      const result = await client.queryDocuments(
        namespace
      , [QueryKeyword.Phrase, 'two', 'three']
      )

      expect(result).toStrictEqual([
        {
          bucket
        , documentId: id
        }
      ])
    })
  })

  describe('prefix expression', () => {
    test('not match', async () => {
      const client = await buildClient()
      const namespace = 'namespace'
      const bucket = 'bucket'
      const id = 'id'
      await setRawDocument({
        namespace
      , bucket
      , id
      , vector: await toVector(['one'])
      })

      const result = await client.queryDocuments(
        namespace
      , [QueryKeyword.Prefix, 't']
      )

      expect(result).toStrictEqual([])
    })

    test('match', async () => {
      const client = await buildClient()
      const namespace = 'namespace'
      const bucket = 'bucket'
      const id = 'id'
      await setRawDocument({
        namespace
      , bucket
      , id
      , vector: await toVector(['one', 'two', 'three'])
      })

      const result = await client.queryDocuments(
        namespace
      , [QueryKeyword.Prefix, 't']
      )

      expect(result).toStrictEqual([
        {
          bucket
        , documentId: id
        }
      ])
    })
  })

  describe('and expression', () => {
    test('not match', async () => {
      const client = await buildClient()
      const namespace = 'namespace'
      const bucket = 'bucket'
      const id = 'id'
      await setRawDocument({
        namespace
      , bucket
      , id
      , vector: await toVector(['one', 'two', 'three'])
      })

      const result = await client.queryDocuments(
        namespace
      , ['one', QueryKeyword.And, 'four']
      )

      expect(result).toStrictEqual([])
    })

    test('match', async () => {
      const client = await buildClient()
      const namespace = 'namespace'
      const bucket = 'bucket'
      const id = 'id'
      await setRawDocument({
        namespace
      , bucket
      , id
      , vector: await toVector(['one', 'two', 'three'])
      })

      const result = await client.queryDocuments(
        namespace
      , ['one', QueryKeyword.And, 'three']
      )

      expect(result).toStrictEqual([
        {
          bucket
        , documentId: id
        }
      ])
    })
  })

  describe('or expression', () => {
    test('not match', async () => {
      const client = await buildClient()
      const namespace = 'namespace'
      const bucket = 'bucket'
      const id = 'id'
      await setRawDocument({
        namespace
      , bucket
      , id
      , vector: await toVector(['one', 'two', 'three'])
      })

      const result = await client.queryDocuments(
        namespace
      , ['four', QueryKeyword.Or, 'five']
      )

      expect(result).toStrictEqual([])
    })

    test('match', async () => {
      const client = await buildClient()
      const namespace = 'namespace'
      const bucket = 'bucket'
      const id = 'id'
      await setRawDocument({
        namespace
      , bucket
      , id
      , vector: await toVector(['one', 'two', 'three'])
      })

      const result = await client.queryDocuments(
        namespace
      , ['one', QueryKeyword.Or, 'four']
      )

      expect(result).toStrictEqual([
        {
          bucket
        , documentId: id
        }
      ])
    })
  })

  describe('not expression', () => {
    test('not match', async () => {
      const client = await buildClient()
      const namespace = 'namespace'
      const bucket = 'bucket'
      const id = 'id'
      await setRawDocument({
        namespace
      , bucket
      , id
      , vector: await toVector(['one', 'two', 'three'])
      })

      const result = await client.queryDocuments(
        namespace
      , [QueryKeyword.Not, 'one']
      )

      expect(result).toStrictEqual([])
    })

    test('match', async () => {
      const client = await buildClient()
      const namespace = 'namespace'
      const bucket = 'bucket'
      const id = 'id'
      await setRawDocument({
        namespace
      , bucket
      , id
      , vector: await toVector(['one', 'two', 'three'])
      })

      const result = await client.queryDocuments(
        namespace
      , [QueryKeyword.Not, 'four']
      )

      expect(result).toStrictEqual([
        {
          bucket
        , documentId: id
        }
      ])
    })
  })
})
