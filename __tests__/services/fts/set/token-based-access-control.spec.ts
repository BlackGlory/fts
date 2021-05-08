import { startService, stopService, getAddress, closeAllConnections } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import { fetch } from 'extra-fetch'
import { post } from 'extra-request'
import { url, pathname, searchParam, json } from 'extra-request/lib/es2018/transformers'

jest.mock('@dao/config-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)
afterAll(closeAllConnections)

describe('token-based access control', () => {
  describe('enabled', () => {
    describe('namespace need write tokens', () => {
      describe('token matched', () => {
        it('204', async () => {
          process.env.FTS_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const token = 'token'
          const id = 'id'
          await AccessControlDAO.setWriteTokenRequired(namespace, true)
          await AccessControlDAO.setWriteToken({ namespace, token })

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/fts/${namespace}/objects/${id}`)
          , searchParam('token', token)
          , json([])
          ))

          expect(res.status).toBe(204)
        })
      })

      describe('token does not matched', () => {
        it('401', async () => {
          process.env.FTS_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const token = 'token'
          const id = 'id'
          await AccessControlDAO.setWriteTokenRequired(namespace, true)
          await AccessControlDAO.setWriteToken({ namespace, token })

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/fts/${namespace}/objects/${id}`)
          , searchParam('token', 'bad')
          , json([])
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('no token', () => {
        it('401', async () => {
          process.env.FTS_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const token = 'token'
          const id = 'id'
          await AccessControlDAO.setWriteTokenRequired(namespace, true)
          await AccessControlDAO.setWriteToken({ namespace, token })

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/fts/${namespace}/objects/${id}`)
          , json([])
          ))

          expect(res.status).toBe(401)
        })
      })
    })

    describe('namespace does not need write tokens', () => {
      describe('WRITE_TOKEN_REQUIRED=true', () => {
        it('401', async () => {
          process.env.FTS_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.FTS_WRITE_TOKEN_REQUIRED = 'true'
          const namespace = 'namespace'
          const id = 'id'

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/fts/${namespace}/objects/${id}`)
          , json([])
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('WRITE_TOKEN_REQUIRED=false', () => {
        it('204', async () => {
          process.env.FTS_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.FTS_WRITE_TOKEN_REQUIRED = 'false'
          const namespace = 'namespace'
          const id = 'id'

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/fts/${namespace}/objects/${id}`)
          , json([])
          ))

          expect(res.status).toBe(204)
        })
      })
    })
  })

  describe('disabled', () => {
    describe('namespace need write tokens', () => {
      describe('no token', () => {
        it('204', async () => {
          const namespace = 'namespace'
          const token = 'token'
          const id = 'id'
          await AccessControlDAO.setWriteTokenRequired(namespace, true)
          await AccessControlDAO.setWriteToken({ namespace, token })

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/fts/${namespace}/objects/${id}`)
          , json([])
          ))

          expect(res.status).toBe(204)
        })
      })
    })

    describe('namespace does not need write tokens', () => {
      describe('WRITE_TOKEN_REQUIRED=true', () => {
        it('204', async () => {
          process.env.FTS_WRITE_TOKEN_REQUIRED = 'true'
          const namespace = 'namespace'
          const token = 'token'
          const id = 'id'
          await AccessControlDAO.setWriteTokenRequired(namespace, true)
          await AccessControlDAO.setWriteToken({ namespace, token })

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/fts/${namespace}/objects/${id}`)
          , json([])
          ))

          expect(res.status).toBe(204)
        })
      })
    })
  })
})