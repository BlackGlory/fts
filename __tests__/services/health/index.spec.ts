import { startService, stopService, getAddress, closeAllConnections } from '@test/utils'
import { fetch } from 'extra-fetch'
import { get } from 'extra-request'
import { url, pathname } from 'extra-request/lib/es2018/transformers'

jest.mock('@dao/config-in-sqlite3/database')

beforeEach(startService)
afterEach(stopService)
afterAll(closeAllConnections)

describe('robots', () => {
  describe('GET /robots.txt', () => {
    it('200', async () => {
      const res = await fetch(get(
        url(getAddress())
      , pathname('/health')
      ))

      expect(res.status).toBe(200)
    })
  })
})
