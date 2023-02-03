import { FTSDAO } from '@dao/fts/index.js'
import { initializeDatabases, clearDatabases, closeAllConnections } from '@test/utils.js'
import { getRawObject, toVector } from './utils.js'

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
    const bucket = 'bucket'
    const id = 'id'
    const lexemes = ['lexeme']

    const result = await FTSDAO.setObject(namespace, bucket, id, lexemes)
    const obj = await getRawObject(namespace, bucket, id)

    expect(result).toBeUndefined()
    expect(obj).toStrictEqual({
      namespace
    , bucket
    , id
    , vector: await toVector(lexemes)
    })
  })
})
