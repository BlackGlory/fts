import { TokenDAO } from '@dao/config/access-control/index.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { getRawToken, hasRawToken, setRawToken } from './utils.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('token-based access control', () => {
  describe('getAllNamespacesWithTokens(): string[]', () => {
    it('return string[]', () => {
      const namespace1 = 'namespace-1'
      const token1 = 'token-1'
      const namespace2 = 'namespace-2'
      const token2 = 'token-2'
      const namespace3 = 'namespace-3'
      const token3 = 'token-3'
      setRawToken({
        token: token1
      , namespace: namespace1
      , query_permission: 1
      , write_permission: 0
      , delete_permission: 0
      })
      setRawToken({
        token: token2
      , namespace: namespace2
      , query_permission: 0
      , write_permission: 1
      , delete_permission: 0
      })
      setRawToken({
        token: token3
      , namespace: namespace3
      , query_permission: 0
      , write_permission: 0
      , delete_permission: 1
      })

      const result = TokenDAO.getAllNamespacesWithTokens()

      expect(result).toEqual([namespace1, namespace2, namespace3])
    })
  })

  describe('getAllTokens(namespace: string): TokenInfo[]', () => {
    it('return TokenInfo[]', () => {
      const namespace = 'namespace'
      const token1 = 'token-1'
      const token2 = 'token-2'
      const token3 = 'token-3'
      setRawToken({
        token: token1
      , namespace
      , query_permission: 1
      , write_permission: 0
      , delete_permission: 0
      })
      setRawToken({
        token: token2
      , namespace
      , query_permission: 0
      , write_permission: 1
      , delete_permission: 0
      })
      setRawToken({
        token: token3
      , namespace
      , query_permission: 0
      , write_permission: 0
      , delete_permission: 1
      })

      const result = TokenDAO.getAllTokens(namespace)

      expect(result).toEqual([
        { token: token1, query: true, write: false, delete: false }
      , { token: token2, query: false, write: true, delete: false }
      , { token: token3, query: false, write: false, delete: true }
      ])
    })
  })

  describe('WriteToken', () => {
    describe('hasWriteTokens(namespace: string): boolean', () => {
      describe('tokens exist', () => {
        it('return true', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , query_permission: 0
          , write_permission: 1
          , delete_permission: 0
          })

          const result = TokenDAO.hasWriteTokens(namespace)

          expect(result).toBe(true)
        })
      })

      describe('tokens do not exist', () => {
        it('return false', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , query_permission: 1
          , write_permission: 0
          , delete_permission: 0
          })

          const result = TokenDAO.hasWriteTokens(namespace)

          expect(result).toBe(false)
        })
      })
    })

    describe('matchWriteToken({ token: string; namespace: string }): boolean', () => {
      describe('token exist', () => {
        it('return true', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , query_permission: 0
          , write_permission: 1
          , delete_permission: 0
          })

          const result = TokenDAO.matchWriteToken({ token, namespace })

          expect(result).toBe(true)
        })
      })

      describe('token does not exist', () => {
        it('return false', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , query_permission: 1
          , write_permission: 0
          , delete_permission: 0
          })

          const result = TokenDAO.matchWriteToken({ token, namespace })

          expect(result).toBe(false)
        })
      })
    })

    describe('setWriteToken({ token: string; namespace: string })', () => {
      describe('token exists', () => {
        it('update row', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , query_permission: 1
          , write_permission: 0
          , delete_permission: 0
          })

          const result = TokenDAO.setWriteToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['write_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', () => {
          const token = 'token-1'
          const namespace = 'namespace'

          const result = TokenDAO.setWriteToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['write_permission']).toBe(1)
        })
      })
    })

    describe('unsetWriteToken({ token: string; namespace: string })', () => {
      describe('token exists', () => {
        it('return undefined', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , query_permission: 1
          , write_permission: 1
          , delete_permission: 0
          })

          const result = TokenDAO.unsetWriteToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['write_permission']).toBe(0)
        })
      })

      describe('token does not exist', () => {
        it('return undefined', () => {
          const token = 'token-1'
          const namespace = 'namespace'

          const result = TokenDAO.unsetWriteToken({ token, namespace })

          expect(result).toBeUndefined()
          expect(hasRawToken(token, namespace)).toBe(false)
        })
      })
    })
  })

  describe('QueryToken', () => {
    describe('hasQueryTokens(namespace: string): boolean', () => {
      describe('tokens exist', () => {
        it('return true', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , query_permission: 1
          , write_permission: 0
          , delete_permission: 0
          })

          const result = TokenDAO.hasQueryTokens(namespace)

          expect(result).toBe(true)
        })
      })

      describe('tokens do not exist', () => {
        it('return false', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , query_permission: 0
          , write_permission: 1
          , delete_permission: 0
          })

          const result = TokenDAO.hasQueryTokens(namespace)

          expect(result).toBe(false)
        })
      })
    })

    describe('matchQueryToken({ token: string; namespace: string }): boolean', () => {
      describe('tokens exist', () => {
        it('return true', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , query_permission: 1
          , write_permission: 0
          , delete_permission: 0
          })

          const result = TokenDAO.matchQueryToken({ token, namespace })

          expect(result).toBe(true)
        })
      })

      describe('tokens do not exist', () => {
        it('return false', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , query_permission: 0
          , write_permission: 1
          , delete_permission: 0
          })

          const result = TokenDAO.matchQueryToken({ token, namespace })

          expect(result).toBe(false)
        })
      })
    })

    describe('setQueryToken(token: string, namespace: string)', () => {
      describe('token exists', () => {
        it('update row', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , query_permission: 0
          , write_permission: 1
          , delete_permission: 0
          })

          const result = TokenDAO.setQueryToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['query_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', () => {
          const token = 'token-1'
          const namespace = 'namespace'

          const result = TokenDAO.setQueryToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['query_permission']).toBe(1)
        })
      })
    })

    describe('unsetQueryToken', () => {
      describe('token exists', () => {
        it('return undefined', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , query_permission: 1
          , write_permission: 1
          , delete_permission: 0
          })

          const result = TokenDAO.unsetQueryToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['query_permission']).toBe(0)
        })
      })

      describe('token does not exist', () => {
        it('return undefined', () => {
          const token = 'token-1'
          const namespace = 'namespace'

          const result = TokenDAO.unsetQueryToken({ token, namespace })

          expect(result).toBeUndefined()
          expect(hasRawToken(token, namespace)).toBe(false)
        })
      })
    })
  })

  describe('DeleteToken', () => {
    describe('matchDeleteToken({ token: string; namespace: string }): boolean', () => {
      describe('tokens exist', () => {
        it('return true', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , query_permission: 0
          , write_permission: 0
          , delete_permission: 1
          })

          const result = TokenDAO.matchDeleteToken({ token, namespace })

          expect(result).toBe(true)
        })
      })

      describe('tokens do not exist', () => {
        it('return false', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , query_permission: 0
          , write_permission: 0
          , delete_permission: 0
          })

          const result = TokenDAO.matchDeleteToken({ token, namespace })

          expect(result).toBe(false)
        })
      })
    })

    describe('setDeleteToken(token: string, id: string)', () => {
      describe('token exists', () => {
        it('update row', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , query_permission: 0
          , write_permission: 0
          , delete_permission: 0
          })

          const result = TokenDAO.setDeleteToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['delete_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', () => {
          const token = 'token-1'
          const namespace = 'namespace'

          const result = TokenDAO.setDeleteToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['delete_permission']).toBe(1)
        })
      })
    })

    describe('unsetDeleteToken', () => {
      describe('token exists', () => {
        it('return undefined', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , query_permission: 0
          , write_permission: 0
          , delete_permission: 1
          })

          const result = TokenDAO.unsetDeleteToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).toBeUndefined()
        })
      })

      describe('token does not exist', () => {
        it('return undefined', () => {
          const token = 'token-1'
          const namespace = 'namespace'

          const result = TokenDAO.unsetDeleteToken({ token, namespace })

          expect(result).toBeUndefined()
          expect(hasRawToken(token, namespace)).toBe(false)
        })
      })
    })
  })
})
