import { expectMatchSchema, startService, stopService, getAddress, closeAllConnections } from '@test/utils.js'
import { prepareFTSs } from './utils.js'
import { fetch } from 'extra-fetch'
import { post } from 'extra-request'
import { url, pathname, json } from 'extra-request/transformers'
import { toJSON } from 'extra-response'
import { IQueryResult } from '@api/contract.js'

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
    expectMatchSchema(result, {
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

  test('bad request', async () => {
    const namespace = 'namespace'
    const buckets = ['bucket-1', 'bucket-2'].join(',')

    const res = await fetch(post(
      url(getAddress())
    , pathname(`/fts/${namespace}/buckets/${buckets}/query`)
    , json('bad expression')
    ))

    expect(res.status).toBe(400)
  })
})
