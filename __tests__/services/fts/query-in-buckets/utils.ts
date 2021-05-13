import { FTSDAO } from '@dao'

export async function prepareFTSs(buckets: string[]): Promise<void> {
  for (const bucket of buckets) {
    await FTSDAO.setObject('namespace', bucket, 'payload', ['lexeme'])
  }
}
