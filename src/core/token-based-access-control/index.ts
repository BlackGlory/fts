import { CustomError } from '@blackglory/errors'
import {
  TOKEN_BASED_ACCESS_CONTROL
, QUERY_TOKEN_REQUIRED
, WRITE_TOKEN_REQUIRED
, DELETE_TOKEN_REQUIRED
} from '@env'
import { AccessControlDAO } from '@dao'
import * as TokenPolicy from './token-policy'
import * as Token from './token'

class Unauthorized extends CustomError {}

export const TBAC: ICore['TBAC'] = {
  isEnabled
, checkWritePermission
, checkQueryPermission: checkQueryPermission
, checkDeletePermission
, Unauthorized
, TokenPolicy
, Token
}

function isEnabled() {
  return TOKEN_BASED_ACCESS_CONTROL()
}

/**
 * @throws {Unauthorized}
 */
async function checkWritePermission(namespace: string, token?: string) {
  if (!isEnabled()) return

  const writeTokenRequired =
    (await TokenPolicy.get(namespace)).writeTokenRequired
  ?? WRITE_TOKEN_REQUIRED()

  if (writeTokenRequired) {
    if (!token) throw new Unauthorized()
    if (!await AccessControlDAO.matchWriteToken({ token, namespace: namespace })) {
      throw new Unauthorized()
    }
  }
}

/**
 * @throws {Unauthorized}
 */
async function checkQueryPermission(namespace: string, token?: string) {
  if (!isEnabled()) return

  const queryTokenRequired =
    (await TokenPolicy.get(namespace)).queryTokenRequired
  ?? QUERY_TOKEN_REQUIRED()

  if (queryTokenRequired) {
    if (!token) throw new Unauthorized()
    if (!await AccessControlDAO.matchQueryToken({ token, namespace: namespace })) {
      throw new Unauthorized()
    }
  }
}

/**
 * @throws {Unauthorized}
 */
async function checkDeletePermission(namespace: string, token?: string) {
  if (!isEnabled()) return

  const deleteTokenRequired =
    (await TokenPolicy.get(namespace)).deleteTokenRequired
  ?? DELETE_TOKEN_REQUIRED()

  if (deleteTokenRequired) {
    if (!token) throw new Unauthorized()
    if (!await AccessControlDAO.matchDeleteToken({ token, namespace: namespace })) {
      throw new Unauthorized()
    }
  }
}
