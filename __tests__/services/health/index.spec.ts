import { startService, stopService, getAddress, closeAllConnections } from '@test/utils.js'
import { fetch } from 'extra-fetch'
import { get } from 'extra-request'
import { url, pathname } from 'extra-request/transformers'

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
