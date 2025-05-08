import { fileURLToPath } from 'url'

export default {
  target: 'node'
, mode: 'none'
, node: {
    global: true,
    __filename: true,
    __dirname: true,
  }
, entry: './lib/index.js'
, output: {
    path: fileURLToPath(new URL('dist', import.meta.url))
  , filename: 'index.cjs'
  }
, externals: {
    'pg-native': 'commonjs pg-native'
  , 'pg-cloudflare': 'commonjs pg-cloudflare'
  , 'bufferutil': 'commonjs bufferutil'
  , 'utf-8-validate': 'commonjs utf-8-validate'
  }
}
