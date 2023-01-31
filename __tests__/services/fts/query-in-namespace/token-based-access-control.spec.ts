import { startService, stopService, getAddress, closeAllConnections } from '@test/utils.js'
import { AccessControlDAO } from '@dao/index.js'
import { fetch } from 'extra-fetch'
import { post } from 'extra-request'
import { url, pathname, searchParam, json } from 'extra-request/transformers'

beforeEach(startService)
afterEach(stopService)
afterAll(closeAllConnections)

describe('token-based access control', () => {
  describe('enabled', () => {
    describe('namespace need query tokens', () => {
      describe('token matched', () => {
        it('200', async () => {
          process.env.FTS_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const token = 'token'
          await AccessControlDAO.setQueryTokenRequired(namespace, true)
          await AccessControlDAO.setQueryToken({ namespace, token })

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/fts/${namespace}/query`)
          , searchParam('token', token)
          , json('')
          ))

          expect(res.status).toBe(200)
        })
      })

      describe('token does not matched', () => {
        it('401', async () => {
          process.env.FTS_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const token = 'token'
          await AccessControlDAO.setQueryTokenRequired(namespace, true)
          await AccessControlDAO.setQueryToken({ namespace, token })

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/fts/${namespace}/query`)
          , searchParam('token', 'bad')
          , json('')
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('no token', () => {
        it('401', async () => {
          process.env.FTS_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const token = 'token'
          await AccessControlDAO.setQueryTokenRequired(namespace, true)
          await AccessControlDAO.setQueryToken({ namespace, token })

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/fts/${namespace}/query`)
          , json('')
          ))

          expect(res.status).toBe(401)
        })
      })
    })

    describe('namespace does not need query tokens', () => {
      describe('QUERY_TOKEN_REQUIRED=true', () => {
        it('401', async () => {
          process.env.FTS_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.FTS_QUERY_TOKEN_REQUIRED = 'true'
          const namespace = 'namespace'

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/fts/${namespace}/query`)
          , json('')
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('QUERY_TOKEN_REQUIRED=false', () => {
        it('200', async () => {
          process.env.FTS_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.FTS_QUERY_TOKEN_REQUIRED = 'false'
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
  })

  describe('disabled', () => {
    describe('namespace need query tokens', () => {
      describe('no token', () => {
        it('200', async () => {
          const namespace = 'namespace'
          const token = 'token'
          await AccessControlDAO.setQueryTokenRequired(namespace, true)
          await AccessControlDAO.setQueryToken({ namespace, token })

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/fts/${namespace}/query`)
          , searchParam('token', token)
          , json('')
          ))

          expect(res.status).toBe(200)
        })
      })
    })

    describe('namespace does not need query tokens', () => {
      describe('QUERY_TOKEN_REQUIRED=true', () => {
        it('200', async () => {
          process.env.FTS_QUERY_TOKEN_REQUIRED = 'true'
          const namespace = 'namespace'
          const token = 'token'
          await AccessControlDAO.setQueryTokenRequired(namespace, true)
          await AccessControlDAO.setQueryToken({ namespace, token })

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/fts/${namespace}/query`)
          , searchParam('token', token)
          , json('')
          ))

          expect(res.status).toBe(200)
        })
      })
    })
  })
})
