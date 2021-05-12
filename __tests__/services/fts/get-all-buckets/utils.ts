import { FTSDAO } from '@dao'

export async function prepareFTSs(
  namespace: string
, buckets: string[]
): Promise<void> {
  for (const bucket of buckets) {
    await FTSDAO.setObject(namespace, bucket, 'payload', ['lexeme'])
  }
}
