import { startService, stopService, getAddress, closeAllConnections } from '@test/utils'
import { fetch } from 'extra-fetch'
import { put } from 'extra-request'
import { url, pathname, json } from 'extra-request/lib/es2018/transformers'

jest.mock('@dao/config-in-sqlite3/database')

beforeEach(startService)
afterEach(stopService)
afterAll(closeAllConnections)

describe('no access control', () => {
  it('204', async () => {
    const namespace = 'namespace'
    const bucket = 'bucket'
    const id = 'id'

    const res = await fetch(put(
      url(getAddress())
    , pathname(`/fts/${namespace}/buckets/${bucket}/objects/${id}`)
    , json([])
    ))

    expect(res.status).toBe(204)
  })
})
