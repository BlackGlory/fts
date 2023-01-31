// 可悲的pg包至今没有把导出做得符合现代方式,
// 以`import { Client } from 'pg'`方式导入在ESM环境下会失败.
import pg from 'pg'

// 若以`export const Client = pg.Client`方式重新导出, 则Client会被视作是值而不是类.
export class Client extends pg.Client {}
