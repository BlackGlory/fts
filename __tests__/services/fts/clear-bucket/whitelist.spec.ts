import { startService, stopService, getAddress, closeAllConnections } from '@test/utils.js'
import { AccessControlDAO } from '@dao/index.js'
import { fetch } from 'extra-fetch'
import { del } from 'extra-request'
import { url, pathname } from 'extra-request/transformers'

beforeEach(startService)
afterEach(stopService)
afterAll(closeAllConnections)

describe('whitelist', () => {
  describe('enabled', () => {
    describe('namespace in whitelist', () => {
      it('204', async () => {
        process.env.FTS_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const namespace = 'namespace'
        const bucket = 'bucket'
        await AccessControlDAO.addWhitelistItem(namespace)

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/fts/${namespace}/buckets/${bucket}`)
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('namespace not in whitelist', () => {
      it('403', async () => {
        process.env.FTS_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const namespace = 'namespace'
        const bucket = 'bucket'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/fts/${namespace}/buckets/${bucket}`)
        ))

        expect(res.status).toBe(403)
      })
    })
  })

  describe('disabled', () => {
    describe('namespace not in whitelist', () => {
      it('204', async () => {
        const namespace = 'namespace'
        const bucket = 'bucket'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/fts/${namespace}/buckets/${bucket}`)
        ))

        expect(res.status).toBe(204)
      })
    })
  })
})
