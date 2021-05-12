import { FTSDAO } from '@dao'

export async function prepareFTSs(namespaces: string[]): Promise<void> {
  for (const namespace of namespaces) {
    await FTSDAO.setObject(namespace, 'bucket', 'payload', ['lexeme'])
  }
}
