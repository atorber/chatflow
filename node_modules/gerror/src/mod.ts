import { VERSION } from './version.js'

import {
  isEcmaError,
  isGrpcStatus,
  isGError,
  GError,
}                         from './gerror/gerror.js'
import type {
  EcmaError,
}                         from './gerror/ecma.js'
import type {
  GrpcStatus,
}                         from './gerror/grpc.js'

import {
  timeoutPromise,
  TimeoutPromiseGError,
}                         from './timeout-promise/mod.js'

import {
  wrapAsyncError,
  WrapAsync,
  WrapAsyncErrorCallback,
}                           from './wrap-async-error/wrap-async-error.js'

export type {
  WrapAsync,
  WrapAsyncErrorCallback,
  EcmaError,
  GrpcStatus,
}
export {
  GError,
  isEcmaError,
  isGError,
  isGrpcStatus,
  timeoutPromise,
  TimeoutPromiseGError,
  VERSION,
  wrapAsyncError,
}
