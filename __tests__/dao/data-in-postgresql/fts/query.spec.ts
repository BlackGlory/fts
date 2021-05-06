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
  , options: { limit?: number; offset?: number }
  ): AsyncIterable<string> {
`, () => {
  describe('namespace does not exist', () => {
    it('return empty iterable', async () => {
      const namespace1 = 'namespace-1'
      const namespace2 = 'naemspace-2'
      await setRawObject({
        namespace: namespace1
      , id: 'id'
      , vector: await toVector(['one', 'two', 'three'])
      })

      const iter = await DAO.query(namespace2, 'three', {})
      const result = await toArrayAsync(iter)

      expect(iter).toBeAsyncIterable()
      expect(result).toStrictEqual([])
    })
  })

  describe('word expression', () => {
    describe('not matched', () => {
      it('return AsyncIterable<string>', async () => {
        const namespace = 'namespace'
        const id = 'id'
        await setRawObject({
          namespace
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
      it('return AsyncIterable<string>', async () => {
        const namespace = 'namespace'
        const id = 'id'
        await setRawObject({
          namespace
        , id
        , vector: await toVector(['one', 'two', 'three'])
        })

        const iter = await DAO.query(namespace, 'three', {})
        const result = await toArrayAsync(iter)

        expect(iter).toBeAsyncIterable()
        expect(result).toStrictEqual([id])
      })
    })
  })

  describe('phrase expression', () => {
    describe('not matched', () => {
      it('return AsyncIterable<string>', async () => {
        const namespace = 'namespace'
        const id = 'id'
        await setRawObject({
          namespace
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
      it('return AsyncIterable<string>', async () => {
        const namespace = 'namespace'
        const id = 'id'
        await setRawObject({
          namespace
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
        expect(result).toStrictEqual([id])
      })
    })
  })

  describe('prefix expression', () => {
    describe('not match', () => {
      it('return AsyncIterable<string>', async () => {
        const namespace = 'namespace'
        const id = 'id'
        await setRawObject({
          namespace
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
      it('return AsyncIterable<string>', async () => {
        const namespace = 'namespace'
        const id = 'id'
        await setRawObject({
          namespace
        , id
        , vector: await toVector(['one', 'two', 'three'])
        })

        const iter = await DAO.query(namespace, [QueryKeyword.Prefix, 't'], {})
        const result = await toArrayAsync(iter)

        expect(iter).toBeAsyncIterable()
        expect(result).toStrictEqual([id])
      })
    })
  })

  describe('and expression', () => {
    describe('not match', () => {
      it('return AsyncIterable<string>', async () => {
        const namespace = 'namespace'
        const id = 'id'
        await setRawObject({
          namespace
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
      it('return AsyncIterable<string>', async () => {
        const namespace = 'namespace'
        const id = 'id'
        await setRawObject({
          namespace
        , id
        , vector: await toVector(['one', 'two', 'three'])
        })

        const iter = await DAO.query(namespace, ['one', QueryKeyword.And, 'three'], {})
        const result = await toArrayAsync(iter)

        expect(iter).toBeAsyncIterable()
        expect(result).toStrictEqual([id])
      })
    })
  })

  describe('or expression', () => {
    describe('not match', () => {
      it('return AsyncIterable<string>', async () => {
        const namespace = 'namespace'
        const id = 'id'
        await setRawObject({
          namespace
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
      it('return AsyncIterable<string>', async () => {
        const namespace = 'namespace'
        const id = 'id'
        await setRawObject({
          namespace
        , id
        , vector: await toVector(['one', 'two', 'three'])
        })

        const iter = await DAO.query(namespace, ['one', QueryKeyword.Or, 'four'], {})
        const result = await toArrayAsync(iter)

        expect(iter).toBeAsyncIterable()
        expect(result).toStrictEqual([id])
      })
    })
  })

  describe('not expression', () => {
    describe('not match', () => {
      it('return AsyncIterable<string>', async () => {
        const namespace = 'namespace'
        const id = 'id'
        await setRawObject({
          namespace
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
      it('return AsyncIterable<string>', async () => {
        const namespace = 'namespace'
        const id = 'id'
        await setRawObject({
          namespace
        , id
        , vector: await toVector(['one', 'two', 'three'])
        })

        const iter = await DAO.query(namespace, [QueryKeyword.Not, 'four'], {})
        const result = await toArrayAsync(iter)

        expect(iter).toBeAsyncIterable()
        expect(result).toStrictEqual([id])
      })
    })
  })
})
