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
  it('200', async () => {
    const namespace = 'namespace'
    const buckets = ['bucket-1', 'bucket-2'].join(',')
    await prepareFTSs([namespace])

    const res = await fetch(post(
      url(getAddress())
    , pathname(`/fts/${namespace}/buckets/${buckets}/query`)
    , json('')
    ))

    expect(res.status).toBe(200)
    expect(await toJSON(res)).toMatchSchema({
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
})
