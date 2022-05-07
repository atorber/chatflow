import type { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import type { TargetProcess } from 'frida'

import { log } from '../../config.js'

type SpawnParameters = Parameters<typeof spawn>
export type SidecarTargetRawSpawn = [
  command : SpawnParameters[0],
  args?   : SpawnParameters[1],
]
export type SidecarTargetRaw =  TargetProcess
                              | SidecarTargetRawSpawn

interface SidecarTargetObjProcess {
  type: 'process',
  target: TargetProcess
}
export interface SidecarTargetObjSpawn {
  type: 'spawn',
  target: SidecarTargetRawSpawn,
}
export type SidecarTargetObj =  SidecarTargetObjProcess
                              | SidecarTargetObjSpawn

export type SidecarTarget = SidecarTargetRaw
                          | SidecarTargetObj

const sidecarTargetObjProcess = (target: TargetProcess) => ({
  target,
  type: 'process',
}) as SidecarTargetObjProcess

const sidecarTargetObjSpawn = (target: SidecarTargetRawSpawn) => ({
  target,
  type: 'spawn',
}) as SidecarTargetObjSpawn

const normalizeSidecarTarget = (
  target?: SidecarTarget,
): undefined | SidecarTargetObj => {
  if (typeof target === 'string' || typeof target === 'number') {
    return sidecarTargetObjProcess(target)
  } else if (Array.isArray(target)) {
    const command = path.resolve(process.cwd(), target[0])
    if (fs.existsSync(command)) {
      log.verbose('Sidecar', 'normalizeSidecarTarget() spawn command found: "%s"', command)
      target[0] = command
    } else {
      log.warn('Sidecar', 'normalizeSidecarTarget() spawn command not found: "%s"', command)
    }

    return sidecarTargetObjSpawn(target)
  } else {
    return target
  }
}

const isSidecarTargetProcess  = (target?: SidecarTarget): target is SidecarTargetObjProcess  => typeof target === 'object' && !Array.isArray(target) && target.type === 'process'
const isSidecarTargetSpawn    = (target?: SidecarTarget): target is SidecarTargetObjSpawn    => typeof target === 'object' && !Array.isArray(target) && target.type === 'spawn'

export {
  normalizeSidecarTarget,
  isSidecarTargetProcess,
  isSidecarTargetSpawn,
}
