import { startService, stopService, getAddress, closeAllConnections } from '@test/utils'
import { fetch } from 'extra-fetch'
import { del } from 'extra-request'
import { url, pathname } from 'extra-request/lib/es2018/transformers'

jest.mock('@dao/config-in-sqlite3/database')

beforeEach(startService)
afterEach(stopService)
afterAll(closeAllConnections)

describe('no access control', () => {
  it('200', async () => {
    const namespace = 'namespace'

    const res = await fetch(del(
      url(getAddress())
    , pathname(`/fts/${namespace}`)
    ))

    expect(res.status).toBe(204)
  })
})
