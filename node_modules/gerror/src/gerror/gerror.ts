/**
 * [RFC] We need a better error system #159
 *  https://github.com/wechaty/puppet/issues/159
 */
import type { EcmaError }       from './ecma.js'
import { isEcmaError }          from './ecma.js'
import type { GrpcStatus }      from './grpc.js'
import {
  isGrpcStatus,
  Code,
}                               from './grpc.js'
import {
  isPuppetEventErrorPayload,
}                               from './puppet.js'

const isGError = (payload: any): payload is GError => payload instanceof Object
  && isEcmaError(payload)
  && isGrpcStatus(payload)

class GError extends Error implements GrpcStatus, EcmaError {

  /**
   * GrpcStatus additional properties
   */
  code     : number
  details? : string

  static stringify (payload: any): string {
    return JSON.stringify(
      this.from(payload),
    )
  }

  /**
   * GError.from() supports:
   *  - string
   *  - Error instance
   *  - GError instance
   *  - GrpcStatus object
   *  - EcmaError object
   *  - GError object
   *  - PuppetEventErrorPayload object/string
   */
  static from (payload: any): GError {
    /**
     * Huan(202110): in case of the payload is a Puppet Error Payload
     *  CAUTION: we must make sure the payload with a { data } property
     *    can be only the EventErrorPayload
     */
    if (isPuppetEventErrorPayload(payload)) {
      payload = payload.data
    }

    /**
     * Error, GError, GrpcStatus, EcmaError, GError, and string
     */
    if (payload instanceof Object || typeof payload === 'string') {
      try {
        return this.fromJSON(payload)
      } catch (_) {
        // ignore any error and pass on
      }
    }

    /**
     * `string` that can not be parsed to JSON
     */
    if (typeof payload === 'string') {
      const e = new Error(payload)
      e.name = 'GError'
      return this.from(e)
    }

    /**
     * others
     */
    const payloadType = typeof payload

    if (payload instanceof Object) {
      try {
        payload = JSON.stringify(payload)
      } catch (e) {
        payload = (e as Error).message
      }
    }

    const e = new Error(`${payload}`)
    e.name = 'GError: from(`' + payloadType + '`)'
    return this.from(e)
  }

  /**
   * From a gRPC standard error
   *  Protobuf
   */
  public static fromJSON (payload: string | GrpcStatus | EcmaError) {
    if (typeof payload === 'string') {
      payload = JSON.parse(payload)
    }

    if (!isEcmaError(payload) && !isGrpcStatus(payload)) {
      throw new Error('payload is neither EcmaError nor GrpcStatus')
    }

    const e = new this(payload)
    return e
  }

  constructor (
    payload: GrpcStatus | EcmaError,
  ) {
    super()

    /**
     * Common properties
     */
    this.message = payload.message || ''

    if (isGError(payload)) {
      this.code    = payload.code
      this.details = payload.details
      this.name    = payload.name
      this.stack   = payload.stack

    } else if (isGrpcStatus(payload)) {
      this.code    = payload.code
      this.details = payload.details
      /**
       * Convert gRPC error to EcmaError
       */
      this.name = Array.isArray(payload.details) && payload.details.length > 0
        ? payload.details[0]
        : Code[this.code] || String(this.code)

    } else if (isEcmaError(payload)) {
      this.name  = payload.name
      this.stack = payload.stack
      /**
       * Convert EcmaError to gRPC error
       */
      this.code     = Code.UNKNOWN
      this.details  = payload.stack

    } else {
      throw new Error('payload is neither EcmaError nor GrpcStatus')
    }
  }

  public toJSON (): GrpcStatus & EcmaError {
    return {
      code    : this.code,
      details : this.details,
      message : this.message,
      name    : this.name,
      stack   : this.stack,
    }
  }

  public toGrpcStatus (): GrpcStatus {
    return {
      code    : this.code,
      details : this.details,
      message : this.message,
    }
  }

  public toEcmaError (): EcmaError {
    return {
      message : this.message,
      name    : this.name,
      stack   : this.stack,
    }
  }

}

export {
  GError,
  isGError,
  isGrpcStatus,
  isEcmaError,
}
