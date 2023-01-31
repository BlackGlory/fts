import { startService, stopService, getAddress, closeAllConnections } from '@test/utils.js'
import { fetch } from 'extra-fetch'
import { get } from 'extra-request'
import { url, pathname } from 'extra-request/transformers'

beforeEach(startService)
afterEach(stopService)
afterAll(closeAllConnections)

describe('no access control', () => {
  it('200', async () => {
    const namespace = 'namespace'

    const res = await fetch(get(
      url(getAddress())
    , pathname(`/fts/${namespace}/stats`)
    ))

    expect(res.status).toBe(200)
    expect(await res.json()).toStrictEqual({
      namespace
    , buckets: 0
    , objects: 0
    })
  })
})
