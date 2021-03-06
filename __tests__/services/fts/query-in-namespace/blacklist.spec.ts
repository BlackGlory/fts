import { startService, stopService, getAddress, closeAllConnections } from '@test/utils'
import { AccessControlDAO } from '@dao'
import { fetch } from 'extra-fetch'
import { post } from 'extra-request'
import { url, pathname, json } from 'extra-request/lib/es2018/transformers'

jest.mock('@dao/config-in-sqlite3/database')

beforeEach(startService)
afterEach(stopService)
afterAll(closeAllConnections)

describe('blacklist', () => {
  describe('enabled', () => {
    describe('namespace in blacklist', () => {
      it('403', async () => {
        process.env.FTS_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const namespace = 'namespace'
        await AccessControlDAO.addBlacklistItem(namespace)

        const res = await fetch(post(
          url(getAddress())
        , pathname(`/fts/${namespace}/query`)
        , json('')
        ))

        expect(res.status).toBe(403)
      })
    })

    describe('namespace not in blacklist', () => {
      it('200', async () => {
        process.env.FTS_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const namespace = 'namespace'

        const res = await fetch(post(
          url(getAddress())
        , pathname(`/fts/${namespace}/query`)
        , json('')
        ))

        expect(res.status).toBe(200)
      })
    })
  })

  describe('disabled', () => {
    describe('namespace in blacklist', () => {
      it('200', async () => {
        const namespace = 'namespace'
        await AccessControlDAO.addBlacklistItem(namespace)

        const res = await fetch(post(
          url(getAddress())
        , pathname(`/fts/${namespace}/query`)
        , json('')
        ))

        expect(res.status).toBe(200)
      })
    })
  })
})
