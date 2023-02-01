import { CustomError } from '@blackglory/errors'
import {
  TOKEN_BASED_ACCESS_CONTROL
, QUERY_TOKEN_REQUIRED
, WRITE_TOKEN_REQUIRED
, DELETE_TOKEN_REQUIRED
} from '@env/index.js'
import { AccessControlDAO } from '@dao/index.js'
import * as TokenPolicy from './token-policy.js'
import * as Token from './token.js'
import { IAPI } from '../contract.js'

class Unauthorized extends CustomError {}

export const TBAC: IAPI['TBAC'] = {
  isEnabled
, checkWritePermission
, checkQueryPermission
, checkDeletePermission
, Unauthorized
, TokenPolicy
, Token
}

function isEnabled(): boolean {
  return TOKEN_BASED_ACCESS_CONTROL()
}

/**
 * @throws {Unauthorized}
 */
function checkWritePermission(namespace: string, token?: string): void {
  if (!isEnabled()) return

  const writeTokenRequired =
    TokenPolicy.get(namespace).writeTokenRequired ??
    WRITE_TOKEN_REQUIRED()

  if (writeTokenRequired) {
    if (!token) throw new Unauthorized()
    if (!AccessControlDAO.Token.matchWriteToken({ token, namespace })) {
      throw new Unauthorized()
    }
  }
}

/**
 * @throws {Unauthorized}
 */
function checkQueryPermission(namespace: string, token?: string): void {
  if (!isEnabled()) return

  const queryTokenRequired =
    TokenPolicy.get(namespace).queryTokenRequired ??
    QUERY_TOKEN_REQUIRED()

  if (queryTokenRequired) {
    if (!token) throw new Unauthorized()
    if (!AccessControlDAO.Token.matchQueryToken({ token, namespace })) {
      throw new Unauthorized()
    }
  }
}

/**
 * @throws {Unauthorized}
 */
function checkDeletePermission(namespace: string, token?: string): void {
  if (!isEnabled()) return

  const deleteTokenRequired =
    TokenPolicy.get(namespace).deleteTokenRequired ??
    DELETE_TOKEN_REQUIRED()

  if (deleteTokenRequired) {
    if (!token) throw new Unauthorized()
    if (!AccessControlDAO.Token.matchDeleteToken({ token, namespace })) {
      throw new Unauthorized()
    }
  }
}
