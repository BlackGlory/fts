import { ValueGetter } from 'value-getter'
import { assert, Getter, isNumber } from '@blackglory/prelude'
import { getCache } from './cache.js'

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

export const POSTGRES_HOST: Getter<string> =
  env('FTS_POSTGRES_HOST')
    .required()
    .memoize(getCache)
    .get()

export const POSTGRES_PORT: Getter<number> =
  env('FTS_POSTGRES_PORT')
    .convert(toInteger)
    .default(5432)
    .required()
    .memoize(getCache)
    .get()

export const POSTGRES_USERNAME: Getter<string> =
  env('FTS_POSTGRES_USERNAME')
    .required()
    .memoize(getCache)
    .get()

export const POSTGRES_PASSWORD: Getter<string> =
  env('FTS_POSTGRES_PASSWORD')
    .required()
    .memoize(getCache)
    .get()

export const POSTGRES_DATABASE: Getter<string> =
  env('FTS_POSTGRES_DATABASE')
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

export const WS_HEARTBEAT_INTERVAL: Getter<number> =
  env('FTS_WS_HEARTBEAT_INTERVAL')
    .convert(toInteger)
    .default(0)
    .assert(shouldBePositiveOrZero)
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

function shouldBePositiveOrZero(val: number) {
  assert(val === 0 || val > 0, 'should be positive or zero')
}
