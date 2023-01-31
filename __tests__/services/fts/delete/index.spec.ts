import { startService, stopService, getAddress, closeAllConnections } from '@test/utils.js'
import { fetch } from 'extra-fetch'
import { del } from 'extra-request'
import { url, pathname } from 'extra-request/transformers'

beforeEach(startService)
afterEach(stopService)
afterAll(closeAllConnections)

describe('no access control', () => {
  it('200', async () => {
    const namespace = 'namespace'
    const bucket = 'bucket'
    const id = 'id'

    const res = await fetch(del(
      url(getAddress())
    , pathname(`/fts/${namespace}/buckets/${bucket}/objects/${id}`)
    ))

    expect(res.status).toBe(204)
  })
})
