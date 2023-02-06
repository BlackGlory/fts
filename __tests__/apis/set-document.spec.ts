import { startService, stopService, closeAllConnections, buildClient } from '@test/utils.js'
import { getRawDocument, toVector } from './utils.js'

beforeEach(startService)
afterEach(stopService)
afterAll(closeAllConnections)

describe('setDocument', () => {
  test('document does not exist', async () => {
    const client = await buildClient()
    const namespace = 'namespace'
    const bucket = 'bucket'
    const id = 'id'
    const lexemes = ['lexeme']

    await client.setDocument(namespace, bucket, id, lexemes)

    const document = await getRawDocument(namespace, bucket, id)
    expect(document).toStrictEqual({
      namespace
    , bucket
    , id
    , vector: await toVector(lexemes)
    })
  })

  test('document exists', async () => {
    const client = await buildClient()
    const namespace = 'namespace'
    const bucket = 'bucket'
    const id = 'id'
    const oldLexemes = ['old-lexeme']
    await client.setDocument(namespace, bucket, id, oldLexemes)
    const newLexemes = ['new-lexeme']

    await client.setDocument(namespace, bucket, id, newLexemes)

    const document = await getRawDocument(namespace, bucket, id)
    expect(document).toStrictEqual({
      namespace
    , bucket
    , id
    , vector: await toVector(newLexemes)
    })
  })
})
