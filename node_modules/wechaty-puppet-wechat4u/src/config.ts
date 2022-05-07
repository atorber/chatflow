// tslint:disable:no-reference

/// <reference path="./types.d.ts" />

import {
  log,
}             from 'wechaty-puppet'
import {
  FileBox,
}             from 'file-box'

import type { OperationOptions } from 'retry'
import promiseRetry from 'promise-retry'

import { packageJson } from './package-json.js'

const VERSION = packageJson.version || '0.0.0'
const NAME    = packageJson.name    || 'NONAME'

export function qrCodeForChatie (): FileBox {
  const CHATIE_OFFICIAL_ACCOUNT_QRCODE = 'http://weixin.qq.com/r/qymXj7DEO_1ErfTs93y5'
  return FileBox.fromQRCode(CHATIE_OFFICIAL_ACCOUNT_QRCODE)
}

export async function retry<T> (
  retryableFn: (
    retry: (error: Error) => never,
    attempt: number,
  ) => Promise<T>,
): Promise<T> {
  /**
   * 60 seconds: (to be confirmed)
   *  factor: 3
   *  minTimeout: 10
   *  maxTimeout: 20 * 1000
   *  retries: 9
   */
  const factor     = 3
  const minTimeout = 10
  const maxTimeout = 20 * 1000
  const retries    = 9
  // const unref      = true

  const retryOptions: OperationOptions = {
    factor,
    maxTimeout,
    minTimeout,
    retries,
  }
  return promiseRetry(retryOptions, retryableFn)
}

export {
  VERSION,
  NAME,
  log,
}
