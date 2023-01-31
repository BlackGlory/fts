import { FTSDAO } from '@dao/index.js'

export async function prepareFTSs(buckets: string[]): Promise<void> {
  for (const bucket of buckets) {
    await FTSDAO.setObject('namespace', bucket, 'payload', ['lexeme'])
  }
}
