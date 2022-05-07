import type {
  SidecarPayloadHook,
  SidecarPayloadLog,
}                     from '../../../sidecar-body/payload-schemas.js'

/* eslint camelcase: 0 */
declare module './payload.cjs' {

  export declare function __sidecar__payloadHook (
    method: string,
    args: any[],
  ): SidecarPayloadHook

  export declare function __sidecar__payloadLog (
    level: 'verbose' | 'silly',
    prefix: string,
    message: string,
  ): SidecarPayloadLog

}
