import { startService, stopService, getAddress, closeAllConnections } from '@test/utils'
import { prepareFTSs } from './utils'
import { fetch } from 'extra-fetch'
import { get } from 'extra-request'
import { url, pathname } from 'extra-request/lib/es2018/transformers'
import { toJSON } from 'extra-response'

jest.mock('@dao/config-in-sqlite3/database')

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
