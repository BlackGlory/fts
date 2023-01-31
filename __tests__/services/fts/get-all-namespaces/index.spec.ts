import { startService, stopService, getAddress, closeAllConnections } from '@test/utils.js'
import { prepareFTSs } from './utils.js'
import { fetch } from 'extra-fetch'
import { get } from 'extra-request'
import { url, pathname } from 'extra-request/transformers'
import { toJSON } from 'extra-response'

beforeEach(startService)
afterEach(stopService)
afterAll(closeAllConnections)

describe('no access control', () => {
  it('200', async () => {
    const namespaces = ['namespace-1', 'namespace-2']
    await prepareFTSs(namespaces)

    const res = await fetch(get(
      url(getAddress())
    , pathname('/fts')
    ))

    expect(res.status).toBe(200)
    expect(await toJSON(res)).toStrictEqual(namespaces)
  })
})
