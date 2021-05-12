import { startService, stopService, getAddress, closeAllConnections } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { fetch } from 'extra-fetch'
import { del } from 'extra-request'
import { url, pathname } from 'extra-request/lib/es2018/transformers'

jest.mock('@dao/config-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)
afterAll(closeAllConnections)

describe('no access control', () => {
  it('200', async () => {
    const namespace = 'namespace'
    const bucket = 'bucket'

    const res = await fetch(del(
      url(getAddress())
    , pathname(`/fts/${namespace}/buckets/${bucket}`)
    ))

    expect(res.status).toBe(204)
  })
})
