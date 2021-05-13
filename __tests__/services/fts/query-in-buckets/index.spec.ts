import { startService, stopService, getAddress, closeAllConnections } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { prepareFTSs } from './utils'
import { fetch } from 'extra-fetch'
import { post } from 'extra-request'
import { url, pathname, json } from 'extra-request/lib/es2018/transformers'
import { toJSON } from 'extra-response'

jest.mock('@dao/config-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)
afterAll(closeAllConnections)

describe('no access control', () => {
  test('non-empty result', async () => {
    const namespace = 'namespace'
    const buckets = ['bucket-1', 'bucket-2']
    await prepareFTSs(buckets)

    const res = await fetch(post(
      url(getAddress())
    , pathname(`/fts/${namespace}/buckets/${buckets.join(',')}/query`)
    , json('lexeme')
    ))
    const result = await toJSON<IQueryResult[]>(res)

    expect(res.status).toBe(200)
    expect(result.length).toBeGreaterThanOrEqual(1)
    expect(result).toMatchSchema({
      type: 'array'
    , items: {
        type: 'object'
      , properties: {
          bucket: { type: 'string' }
        , id: { type: 'string' }
        }
      }
    })
  })

  test('empty result', async () => {
    const namespace = 'namespace'
    const buckets = ['bucket-1', 'bucket-2']

    const res = await fetch(post(
      url(getAddress())
    , pathname(`/fts/${namespace}/buckets/${buckets.join(',')}/query`)
    , json('lexeme')
    ))
    const result = await toJSON<IQueryResult[]>(res)

    expect(res.status).toBe(200)
    expect(result.length).toBe(0)
  })
})
