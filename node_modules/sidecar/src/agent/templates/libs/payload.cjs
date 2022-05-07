/********************************************
 * File: templates/lib/payload.cjs
 *
 * To make sure the payload typing is right
 * See: sidecar-body/payload-schema.ts
 ********************************************/
/**
 * SidecarPayloadHook
 */
const __sidecar__payloadHook = (
  method, // string
  args,   // Arguments, Array
) => ({
  payload: {
    /**
     * Convert `args` from Array to Object
     * to satisfy `SidecarPayloadHook` interface
     */
    args: {
      ...args,
    },
    method,
  },
  type: 'hook',
})

/**
 * SidecarPayloadLog
 */
const __sidecar__payloadLog = (
  level,    // verbose, silly
  prefix,   // module name
  message,  // string
) => ({
  payload: {
    level,
    message,
    prefix,
  },
  type : 'log',
})

/**
 * For unit testing under Node.js
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ...module.exports,
    __sidecar__payloadHook,
    __sidecar__payloadLog,
  }
}
