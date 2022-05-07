/* eslint-disable camelcase */
import type { SidecarPayloadHook } from './sidecar-body/payload-schemas.js'
// import type { NativePointer } from '@types/frida-gum'

/**
 * `args` at here is a Array, which is the arguments of the hooked function
 *  It will be transformed to a Object internally
 */
declare const __sidecar__payloadHook: (method: string, args: any[]) => SidecarPayloadHook

/**
 * declared in templates/agent.mustache
 */
// Huan(202109): `NativePointer` can not be found by eslint??? (But vscode can recognize it as well)
// eslint-disable-next-line
declare const __sidecar__moduleBaseAddress: NativePointer
