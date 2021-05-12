export const tokenSchema = {
  type: 'string'
, pattern: '^[a-zA-Z0-9\\.\\-_]{0,255}$'
}

export const namespaceSchema = {
  type: 'string'
, pattern: '^[a-zA-Z0-9\\.\\-_]{0,255}$'
}

export const bucketSchema = {
  type: 'string'
, pattern: '^[a-zA-Z0-9\\.\\-_]{0,255}$'
}

export const bucketsSchema = {
  type: 'string'
, pattern: '^[a-zA-Z0-9\\.\\-_]{0,255}(?:,[a-zA-Z0-9\\.\\-_]{0,255})*$'
}

export const idSchema = {
  type: 'string'
, pattern: '^[a-zA-Z0-9\\.\\-_]{0,255}$'
}

export const lexemesSchema = {
  type: 'array'
, items: { type: 'string' }
}
