import * as DAO from '@dao/data-in-postgresql/fts/set-object'
import { initializeDatabases, clearDatabases, closeAllConnections } from '@test/utils'
import { getRawObject, toVector } from './utils'
import '@blackglory/jest-matchers'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)
afterAll(closeAllConnections)

describe(`
  async function setObject(
    namespace: string
  , id: string
  , lexemes: string[]
  ): Promise<void> {
`, () => {
  it('set object', async () => {
    const namespace = 'namespace'
    const id = 'id'
    const lexemes = ['lexeme']

    const result = await DAO.setObject(namespace, id, lexemes)
    const obj = await getRawObject(namespace, id)

    expect(result).toBeUndefined()
    expect(obj).toStrictEqual({
      namespace
    , id
    , vector: await toVector(lexemes)
    })
  })
})
