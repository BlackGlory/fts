import { assert } from '@blackglory/prelude'

export function createAuthHeaders(adminPassword?: string) {
  const value = adminPassword ?? process.env.FTS_ADMIN_PASSWORD 
  assert(value, 'The value should not be undefined')

  return { 'Authorization': `Bearer ${value}` }
}
