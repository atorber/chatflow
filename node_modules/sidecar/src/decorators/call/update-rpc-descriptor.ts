import {
  log,
}                         from '../../config.js'
import { RET_SYMBOL }     from '../../ret.js'
import type { SidecarBody }    from '../../sidecar-body/mod.js'
import { DEBUG_CALL_RET_ERROR } from './constants.js'

function updateRpcDescriptor (
  target      : Function,
  propertyKey : string,
  descriptor  : PropertyDescriptor,
): PropertyDescriptor {
  log.verbose('Sidecar',
    'updateRpcDescriptor(%s, %s, descriptor)',
    target.constructor.name,
    propertyKey,
  )

  // console.log('value:', descriptor.value)
  const ret = descriptor.value()

  if (!(ret instanceof Promise)) {
    const e = new Error(`The "${target.constructor.name}.${propertyKey}" method return a non-promise: it must return the Ret() to make Sidecar @Call happy.`)
    console.error(e.stack)
    throw e
  } else {
    ret.then((result: any) => {
      /**
       * FIXME: Huan(202006)
       *  check Ret value and deal the error more gentle
       */
      if (result !== RET_SYMBOL) {
        const e = new Error(`The "${target.constructor.name}.${propertyKey}" method must return the Ret() to make Sidecar @Call happy.`)
        console.error(e.stack)
        throw e
      }
      return result
    }).catch((e: Error) => {
      (target as any)[DEBUG_CALL_RET_ERROR] = e
      console.error(e)
    })
  }

  async function proxyMethod (
    this: SidecarBody,
    ...args: any[]
  ) {
    // // https://github.com/huan/clone-class/blob/master/src/instance-to-class.ts
    // const klass = (this.constructor.name as any as typeof SidecarBody)

    // console.log('target:', target)
    // console.log('target.name:', target.name)
    // console.log('target.constructor.name:', target.constructor.name)

    log.verbose(
      `${target.constructor.name}<Sidecar>`,
      `${propertyKey}(%s)`,
      args.join(', '),
    )

    if (!this.script) {
      log.warn(`Sidecar<${target.constructor.name}>`,
        '%s(%s) updateRpcDescriptor() > proxyMethod() > "this.script" is undefined.',
        propertyKey,
        args.join(', '),
      )
      this.emit('error', new Error('proxyMethod() found this.script is undefined'))
      return
    }

    return this.script.exports[propertyKey]!(...args)
  }

  /**
   * Update the method
   */
  descriptor.value = proxyMethod
  return descriptor
}

export { updateRpcDescriptor }
