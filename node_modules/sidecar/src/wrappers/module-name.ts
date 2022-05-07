import path from 'path'
import type { SidecarMetadata } from '../decorators/mod.js'
import {
  isSidecarTargetProcess,
  isSidecarTargetSpawn,
}                           from '../decorators/sidecar/target.js'

function moduleName (
  this: SidecarMetadata,
) {
  const targetObj = this.sidecarTarget
  if (!targetObj) {
    throw new Error('no target found in SidecarMetadata')
  }

  if (isSidecarTargetProcess(targetObj)) {
    return typeof targetObj.target === 'number'
      ? targetObj.target
      : path.win32.basename(targetObj.target)
  } else if (isSidecarTargetSpawn(targetObj)) {
    // See: https://nodejs.org/api/path.html
    return path.win32.basename(targetObj.target[0])
  } else {
    throw new Error('unknown target obj: ' + JSON.stringify(targetObj))
  }

}

export { moduleName }
