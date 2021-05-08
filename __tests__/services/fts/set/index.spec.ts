import { startService, stopService, getAddress, closeAllConnections } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { fetch } from 'extra-fetch'
import { put } from 'extra-request'
import { url, pathname, json } from 'extra-request/lib/es2018/transformers'

jest.mock('@dao/config-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)
afterAll(closeAllConnections)

describe('no access control', () => {
  it('204', async () => {
    const namespace = 'namespace'
    const id = 'id'

    const res = await fetch(put(
      url(getAddress())
    , pathname(`/fts/${namespace}/objects/${id}`)
    , json([])
    ))

    expect(res.status).toBe(204)
  })
})
