import { startService, stopService, getAddress, closeAllConnections } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import { fetch } from 'extra-fetch'
import { del } from 'extra-request'
import { url, pathname, searchParam } from 'extra-request/lib/es2018/transformers'

jest.mock('@dao/config-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)
afterAll(closeAllConnections)

describe('token-based access control', () => {
  describe('enabled', () => {
    describe('namespace need delete tokens', () => {
      describe('token matched', () => {
        it('204', async () => {
          process.env.FTS_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const bucket = 'bucket'
          const token = 'token'
          const id = 'id'
          await AccessControlDAO.setDeleteTokenRequired(namespace, true)
          await AccessControlDAO.setDeleteToken({ namespace, token })

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/fts/${namespace}/buckets/${bucket}/objects/${id}`)
          , searchParam('token', token)
          ))

          expect(res.status).toBe(204)
        })
      })

      describe('token does not matched', () => {
        it('401', async () => {
          process.env.FTS_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const bucket = 'bucket'
          const token = 'token'
          const id = 'id'
          await AccessControlDAO.setDeleteTokenRequired(namespace, true)
          await AccessControlDAO.setDeleteToken({ namespace, token })

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/fts/${namespace}/buckets/${bucket}/objects/${id}`)
          , searchParam('token', 'bad')
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('no token', () => {
        it('401', async () => {
          process.env.FTS_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const bucket = 'bucket'
          const token = 'token'
          const id = 'id'
          await AccessControlDAO.setDeleteTokenRequired(namespace, true)
          await AccessControlDAO.setDeleteToken({ namespace, token })

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/fts/${namespace}/buckets/${bucket}/objects/${id}`)
          ))

          expect(res.status).toBe(401)
        })
      })
    })

    describe('namespace does not need delete tokens', () => {
      describe('DELETE_TOKEN_REQUIRED=true', () => {
        it('401', async () => {
          process.env.FTS_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.FTS_DELETE_TOKEN_REQUIRED = 'true'
          const namespace = 'namespace'
          const bucket = 'bucket'
          const id = 'id'

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/fts/${namespace}/buckets/${bucket}/objects/${id}`)
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('DELETE_TOKEN_REQUIRED=false', () => {
        it('204', async () => {
          process.env.FTS_TOKEN_BASED_ACCESS_CONTROL = 'true'
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
    })
  })

  describe('disabled', () => {
    describe('namespace need delete tokens', () => {
      describe('no token', () => {
        it('204', async () => {
          const namespace = 'namespace'
          const bucket = 'bucket'
          const token = 'token'
          const id = 'id'
          await AccessControlDAO.setDeleteTokenRequired(namespace, true)
          await AccessControlDAO.setDeleteToken({ namespace, token })

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/fts/${namespace}/buckets/${bucket}/objects/${id}`)
          ))

          expect(res.status).toBe(204)
        })
      })
    })

    describe('namespace does not need delete tokens', () => {
      describe('DELETE_TOKEN_REQUIRED=true', () => {
        it('204', async () => {
          process.env.FTS_DELETE_TOKEN_REQUIRED = 'true'
          const namespace = 'namespace'
          const bucket = 'bucket'
          const token = 'token'
          const id = 'id'
          await AccessControlDAO.setDeleteTokenRequired(namespace, true)
          await AccessControlDAO.setDeleteToken({ namespace, token })

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/fts/${namespace}/buckets/${bucket}/objects/${id}`)
          ))

          expect(res.status).toBe(204)
        })
      })
    })
  })
})
