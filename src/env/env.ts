import { ValueGetter } from 'value-getter'
import { isNumber } from '@blackglory/prelude'
import { Getter } from '@blackglory/prelude'
import { assert } from '@blackglory/errors'
import { getCache } from './cache.js'
import * as path from 'path'
import { getAppRoot } from '@utils/get-app-root.js'

export enum ListBasedAccessControl {
  Disable
, Whitelist
, Blacklist
}

export enum NodeEnv {
  Test
, Development
, Production
}

export const NODE_ENV: Getter<NodeEnv | undefined> =
  env('NODE_ENV')
    .convert(val => {
      switch (val) {
        case 'test': return NodeEnv.Test
        case 'development': return NodeEnv.Development
        case 'production': return NodeEnv.Production
      }
    })
    .memoize(getCache)
    .get()

export const CI: Getter<boolean> =
  env('CI')
    .convert(toBool)
    .default(false)
    .memoize(getCache)
    .get()

export const DATA: Getter<string> =
  env('FTS_SQLITE_DATA')
    .default(path.join(getAppRoot(), 'data'))
    .memoize(getCache)
    .get()

export const DB_HOST: Getter<string> =
  env('FTS_POSTGRES_HOST')
    .required()
    .memoize(getCache)
    .get()

export const DB_PORT: Getter<number> =
  env('FTS_POSTGRES_PORT')
    .convert(toInteger)
    .default(5432)
    .required()
    .memoize(getCache)
    .get()

export const DB_USERNAME: Getter<string> =
  env('FTS_POSTGRES_USERNAME')
    .required()
    .memoize(getCache)
    .get()

export const DB_PASSWORD: Getter<string> =
  env('FTS_POSTGRES_PASSWORD')
    .required()
    .memoize(getCache)
    .get()

export const DB_NAME: Getter<string> =
  env('FTS_POSTGRES_NAME')
    .required()
    .memoize(getCache)
    .get()

export const HOST: Getter<string> =
  env('FTS_HOST')
    .default('localhost')
    .memoize(getCache)
    .get()

export const PORT: Getter<number> =
  env('FTS_PORT')
    .convert(toInteger)
    .default(8080)
    .memoize(getCache)
    .get()

export const PAYLOAD_LIMIT: Getter<number> =
  env('FTS_PAYLOAD_LIMIT')
    .convert(toInteger)
    .default(1048576)
    .assert(shouldBePositive)
    .memoize(getCache)
    .get()

export const WRITE_PAYLOAD_LIMIT: Getter<number> =
  env('FTS_WRITE_PAYLOAD_LIMIT')
    .convert(toInteger)
    .default(PAYLOAD_LIMIT())
    .assert(shouldBePositive)
    .memoize(getCache)
    .get()

export const ADMIN_PASSWORD: Getter<string | undefined> =
  env('FTS_ADMIN_PASSWORD')
    .memoize(getCache)
    .get()

function env(name: string): ValueGetter<string | undefined> {
  return new ValueGetter(name, () => process.env[name])
}

function toBool(val: string | boolean | undefined): boolean | undefined {
  if (val) return val === 'true'
  return false
}

function toInteger(val: string | number | undefined ): number | undefined {
  if (isNumber(val)) return val
  if (val) return Number.parseInt(val, 10)
}

function shouldBePositive(val: number) {
  assert(val > 0, 'should be positive')
}
