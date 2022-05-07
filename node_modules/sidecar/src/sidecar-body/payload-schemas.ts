export interface SidecarPayloadLog {
  type    : 'log'
  payload : {
    level   : string,
    message : string,
    prefix  : string,
  }
}

export interface SidecarPayloadHook {
  type    : 'hook',
  payload : {
    method : string,
    args: {
      [k: string]: null | string | number
    },
    // data?: null | Buffer,
  }
}

export type SidecarPayload = SidecarPayloadHook
                                    | SidecarPayloadLog

export type SidecarPayloadType = SidecarPayload['type']

const isSidecarPayloadLog = (
  payload: SidecarPayload
): payload is SidecarPayloadLog => payload.type === 'log'

const isSidecarPayloadHook = (
  payload: SidecarPayload
): payload is SidecarPayloadHook => payload.type === 'hook'

export {
  isSidecarPayloadHook,
  isSidecarPayloadLog,
}
