# FTS
一个受[Sonic]启发的Web友好的自托管ad-hoc微服务,
提供以WebSocket为通讯协议的全文搜索服务.

通常来说, 全文搜索引擎是由数据库, 分词器, 倒排索引, 查询语言等元素组合而成的软件.
FTS与一般全文搜索引擎的区别在于, 它解耦了全文搜索的分词器, 没有内置分词能力, 分词被完全委托给客户端来实现.

[Sonic]: https://github.com/valeriansaliou/sonic

## 缺点
- FTS在更新词典时必须由用户重写整个索引, 通信成本导致其效率比内置分词的全文搜索引擎慢得多.
- FTS使用的后端PostgreSQL所支持的全文搜索性能仅适用于小型数据集.
- FTS的查询结果不支持文本高亮.

## 术语
### 命名空间 namespace
桶的集合.

### 桶 bucket
文档的集合.

### 文档 document
词素的集合.

### 词素 lexeme
分词后得到的结果.

词素是否大小写敏感取决于其后端实现, 为了确保查询不受后端实现差异的影响, 应该总是将其转换为统一的大写或小写形式.

## Quickstart
```sh
docker run \
  --detach \
  --publish 8080:8080 \
  blackglory/fts
```

## Install
### 从源代码运行
```sh
git clone https://github.com/BlackGlory/fts
cd log
yarn install
yarn build
yarn bundle
yarn --silent start
```

### 从源代码构建
```sh
git clone https://github.com/BlackGlory/fts
cd fts
yarn install
yarn docker:build
```

### Recipes
#### docker-compose.yml
```yaml
version: '3.8'

services:
  fts:
    image: 'blackglory/fts'
    restart: always
    depends_on:
      - postgres
    environment:
      - 'FTS_POSTGRES_HOST=postgres'
      - 'FTS_POSTGRES_PORT=5432'
      - 'FTS_POSTGRES_USERNAME=postgres'
      - 'FTS_POSTGRES_PASSWORD=password'
      - 'FTS_POSTGRES_NAME=fts'
    volumes:
      - 'fts-data:/data'
    ports:
      - '8080:8080'

  postgres:
    image: 'postgres:15'
    environment:
      - 'POSTGRES_PASSWORD=password'
    volumes:
      - 'postgres-data:/var/lib/postgresql/data'

volumes:
  fts-data:
  postgres:
```

## API
```ts
interface INamespaceStats {
  buckets: number
  documents: number
}

interface IBucketStats {
  documents: number
}

interface IDocumentQueryResult {
  bucket: string
  documentId: string
}

interface IAPI {
  getNamespaceStats(namespace: string): INamespaceStats
  getBucketStats(namespace: string, bucket: string): IBucketStats

  getAllNamespaces(): string[]
  getAllBuckets(namespace: string): string[]

  setDocument(
    namespace: string
  , bucket: string
  , documentId: string
  , lexemes: string[]
  ): null

  removeDocument(
    namespace: string
  , bucket: string
  , documentId: string
  ): null

  clearBucketsByNamespace(namespace: string): null
  clearDocumentsByBucket(namespace: string, bucket: string): null

  queryDocuments(
    namespace: string
  , expression: IQueryExpression
  , options?: {
      buckets?: string[]
      limit?: number
      offset?: number
    }
  ): IDocumentQueryResult[]
}
```

## 查询语言
FTS的查询语言是一种以JSON数组表示的AST.

```ts
enum QueryKeyword {
  And = 0
, Or = 1
, Not = 2
, Phrase = 3
, Prefix = 4
}

type IQueryExpression =
| ITermExpression
| IPhraseExpression
| IPrefixExpression
| IAndExpression
| IOrExpression
| INotExpression

type ITermExpression = string

type IPhraseExpression = [
  QueryKeyword.Phrase
, ...IQueryExpression[]
]

type IPrefixExpression = [
  QueryKeyword.Prefix
, string
]

type IAndExpression = [
  IQueryExpression
, QueryKeyword.And
, IQueryExpression
]

type IOrExpression = [
  IQueryExpression
, QueryKeyword.Or
, IQueryExpression
]

type INotExpression = [
  QueryKeyword.Not
, IQueryExpression
]
```

```js
['a', AND, ['b', OR, [NOT, 'c']]]
// 相当于 'a' AND ('b' OR (NOT 'c'))
```

### `AND = 0`
逻辑与, 左值和右值可以嵌套其他表达式.

```js
['left', AND, 'right']
```

### `OR = 1`
逻辑或, 左值和右值可以嵌套其他表达式.

```js
['left', OR, 'right']
```

### `NOT = 2`
逻辑非, 右值可以嵌套其他表达式.

```js
[NOT, 'right']
```

### `PHRASE = 3`
由连续单词组成的短语.

```js
[PHRASE, 'a', 'b', 'c']
```

### `PREFIX = 4`
由单个词素构成的前缀搜索.

```js
[PREFIX, 'a']
```

## 环境变量
### `FTS_HOST`, `FTS_PORT`
通过环境变量`FTS_HOST`和`FTS_PORT`决定服务器监听的地址和端口,
默认值为`localhost`和`8080`.

### `FTS_WS_HEARTBEAT_INTERVAL`
通过环境变量`FTS_WS_HEARTBEAT_INTERVAL`可以设置WS心跳包(ping帧)的发送间隔, 单位为毫秒.
在默认情况下, 服务不会发送心跳包,
半开连接的检测依赖于服务端和客户端的运行平台的TCP Keepalive配置.

当`FTS_WS_HEARTBEAT_INTERVAL`大于零时,
服务会通过WS的ping帧按间隔发送心跳包.

### PostgreSQL连接信息
- `FTS_POSTGRES_HOST`: 主机名
- `FTS_POSTGRES_PORT`: 端口号, 默认为`5432`
- `FTS_POSTGRES_USERNAME`: 用户名
- `FTS_POSTGRES_PASSWORD`: 密码
- `FTS_POSTGRES_DATABASE`: 数据库

## 客户端
- JavaScript/TypeScript(Node.js, Browser): <https://github.com/BlackGlory/fts-js>
