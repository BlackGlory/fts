import * as DAO from '@dao/data-in-postgresql/fts/query'
import { initializeDatabases, clearDatabases, closeAllConnections } from '@test/utils'
import { setRawObject, toVector } from './utils'
import { toArrayAsync } from 'iterable-operator'
import { QueryKeyword } from '@src/query-keyword'
import '@blackglory/jest-matchers'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)
afterAll(closeAllConnections)

describe(`
  query(
    namespace: string
  , expression: QueryExpression
  , options: {
      buckets?: string[]
      limit?: number
      offset?: number
    }
  ): AsyncIterable<string> {
`, () => {
  describe('namespace does not exist', () => {
    it('return empty iterable', async () => {
      const namespace1 = 'namespace-1'
      const namespace2 = 'naemspace-2'
      const bucket = 'bucket'
      await setRawObject({
        namespace: namespace1
      , bucket
      , id: 'id'
      , vector: await toVector(['one', 'two', 'three'])
      })

      const iter = await DAO.query(namespace2, 'three', {})
      const result = await toArrayAsync(iter)

      expect(iter).toBeAsyncIterable()
      expect(result).toStrictEqual([])
    })
  })

  describe('limit', () => {
    it('return AsyncIterable', async () => {
      const namespace = 'namespace'
      const bucket = 'bucket'
      const id1 = 'id-1'
      const id2 = 'id-2'
      await setRawObject({
        namespace
      , bucket
      , id: id1
      , vector: await toVector(['one', 'two', 'three'])
      })
      await setRawObject({
        namespace
      , bucket
      , id: id2
      , vector: await toVector(['one', 'two', 'three'])
      })

      const iter = await DAO.query(namespace, 'three', { limit: 1 })
      const result = await toArrayAsync(iter)

      expect(iter).toBeAsyncIterable()
      expect(result).toStrictEqual([
        { bucket, id: id1 }
      ])
    })
  })

  describe('buckets', () => {
    it('return AsyncIterable', async () => {
      const namespace = 'namespace'
      const bucket1 = 'bucket-1'
      const bucket2 = 'bucket-2'
      const id = 'id'
      await setRawObject({
        namespace
      , bucket: bucket1
      , id
      , vector: await toVector(['one', 'two', 'three'])
      })
      await setRawObject({
        namespace
      , bucket: bucket2
      , id
      , vector: await toVector(['one', 'two', 'three'])
      })

      const iter = await DAO.query(namespace, 'three', { buckets: [bucket1] })
      const result = await toArrayAsync(iter)

      expect(iter).toBeAsyncIterable()
      expect(result).toStrictEqual([
        { bucket: bucket1, id }
      ])
    })
  })

  describe('term expression', () => {
    describe('not matched', () => {
      it('return AsyncIterable', async () => {
        const namespace = 'namespace'
        const bucket = 'bucket'
        const id = 'id'
        await setRawObject({
          namespace
        , bucket
        , id
        , vector: await toVector(['one', 'two'])
        })

        const iter = await DAO.query(namespace, 'three', {})
        const result = await toArrayAsync(iter)

        expect(iter).toBeAsyncIterable()
        expect(result).toStrictEqual([])
      })
    })

    describe('match', () => {
      it('return AsyncIterable', async () => {
        const namespace = 'namespace'
        const bucket = 'bucket'
        const id = 'id'
        await setRawObject({
          namespace
        , bucket
        , id
        , vector: await toVector(['one', 'two', 'three'])
        })

        const iter = await DAO.query(namespace, 'three', {})
        const result = await toArrayAsync(iter)

        expect(iter).toBeAsyncIterable()
        expect(result).toStrictEqual([
          { bucket, id }
        ])
      })
    })
  })

  describe('phrase expression', () => {
    describe('not matched', () => {
      it('return AsyncIterable', async () => {
        const namespace = 'namespace'
        const bucket = 'bucket'
        const id = 'id'
        await setRawObject({
          namespace
        , bucket
        , id
        , vector: await toVector(['one', 'two', 'three'])
        })

        const iter = await DAO.query(
          namespace
        , [QueryKeyword.Phrase, 'one', 'three']
        , {}
        )
        const result = await toArrayAsync(iter)

        expect(iter).toBeAsyncIterable()
        expect(result).toStrictEqual([])
      })
    })

    describe('match', () => {
      it('return AsyncIterable', async () => {
        const namespace = 'namespace'
        const bucket = 'bucket'
        const id = 'id'
        await setRawObject({
          namespace
        , bucket
        , id
        , vector: await toVector(['one', 'two', 'three'])
        })

        const iter = await DAO.query(
          namespace
        , [QueryKeyword.Phrase, 'two', 'three']
        , {}
        )
        const result = await toArrayAsync(iter)

        expect(iter).toBeAsyncIterable()
        expect(result).toStrictEqual([
          { bucket, id }
        ])
      })
    })
  })

  describe('prefix expression', () => {
    describe('not match', () => {
      it('return AsyncIterable', async () => {
        const namespace = 'namespace'
        const bucket = 'bucket'
        const id = 'id'
        await setRawObject({
          namespace
        , bucket
        , id
        , vector: await toVector(['one'])
        })

        const iter = await DAO.query(namespace, [QueryKeyword.Prefix, 't'], {})
        const result = await toArrayAsync(iter)

        expect(iter).toBeAsyncIterable()
        expect(result).toStrictEqual([])
      })
    })

    describe('match', () => {
      it('return AsyncIterable', async () => {
        const namespace = 'namespace'
        const bucket = 'bucket'
        const id = 'id'
        await setRawObject({
          namespace
        , bucket
        , id
        , vector: await toVector(['one', 'two', 'three'])
        })

        const iter = await DAO.query(namespace, [QueryKeyword.Prefix, 't'], {})
        const result = await toArrayAsync(iter)

        expect(iter).toBeAsyncIterable()
        expect(result).toStrictEqual([
          { bucket, id }
        ])
      })
    })
  })

  describe('and expression', () => {
    describe('not match', () => {
      it('return AsyncIterable', async () => {
        const namespace = 'namespace'
        const bucket = 'bucket'
        const id = 'id'
        await setRawObject({
          namespace
        , bucket
        , id
        , vector: await toVector(['one', 'two', 'three'])
        })

        const iter = await DAO.query(namespace, ['one', QueryKeyword.And, 'four'], {})
        const result = await toArrayAsync(iter)

        expect(iter).toBeAsyncIterable()
        expect(result).toStrictEqual([])
      })
    })

    describe('match', () => {
      it('return AsyncIterable', async () => {
        const namespace = 'namespace'
        const bucket = 'bucket'
        const id = 'id'
        await setRawObject({
          namespace
        , bucket
        , id
        , vector: await toVector(['one', 'two', 'three'])
        })

        const iter = await DAO.query(
          namespace
        , ['one', QueryKeyword.And, 'three']
        , {}
        )
        const result = await toArrayAsync(iter)

        expect(iter).toBeAsyncIterable()
        expect(result).toStrictEqual([
          { bucket, id }
        ])
      })
    })
  })

  describe('or expression', () => {
    describe('not match', () => {
      it('return AsyncIterable', async () => {
        const namespace = 'namespace'
        const bucket = 'bucket'
        const id = 'id'
        await setRawObject({
          namespace
        , bucket
        , id
        , vector: await toVector(['one', 'two', 'three'])
        })

        const iter = await DAO.query(namespace, ['four', QueryKeyword.Or, 'five'], {})
        const result = await toArrayAsync(iter)

        expect(iter).toBeAsyncIterable()
        expect(result).toStrictEqual([])
      })
    })

    describe('match', () => {
      it('return AsyncIterable', async () => {
        const namespace = 'namespace'
        const bucket = 'bucket'
        const id = 'id'
        await setRawObject({
          namespace
        , bucket
        , id
        , vector: await toVector(['one', 'two', 'three'])
        })

        const iter = await DAO.query(namespace, ['one', QueryKeyword.Or, 'four'], {})
        const result = await toArrayAsync(iter)

        expect(iter).toBeAsyncIterable()
        expect(result).toStrictEqual([
          { bucket, id }
        ])
      })
    })
  })

  describe('not expression', () => {
    describe('not match', () => {
      it('return AsyncIterable', async () => {
        const namespace = 'namespace'
        const bucket = 'bucket'
        const id = 'id'
        await setRawObject({
          namespace
        , bucket
        , id
        , vector: await toVector(['one', 'two', 'three'])
        })

        const iter = await DAO.query(namespace, [QueryKeyword.Not, 'one'], {})
        const result = await toArrayAsync(iter)

        expect(iter).toBeAsyncIterable()
        expect(result).toStrictEqual([])
      })
    })

    describe('match', () => {
      it('return AsyncIterable', async () => {
        const namespace = 'namespace'
        const bucket = 'bucket'
        const id = 'id'
        await setRawObject({
          namespace
        , bucket
        , id
        , vector: await toVector(['one', 'two', 'three'])
        })

        const iter = await DAO.query(namespace, [QueryKeyword.Not, 'four'], {})
        const result = await toArrayAsync(iter)

        expect(iter).toBeAsyncIterable()
        expect(result).toStrictEqual([
          { bucket, id }
        ])
      })
    })
  })
})
