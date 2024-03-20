/* eslint-disable sort-keys */
// import type { IRecord } from '../db/vika.js'
import { log } from 'wechaty'
import { ChatFlowCore } from '../api/base-config.js'
import {
  ServeGetUserConfigObj,
} from '../api/user.js'

// import { ChatFlowCore } from '../api/base-config.js'
// const envData = ChatFlowCore.tables.env
// log.info(JSON.stringify(envData))

// 服务类
export class EnvChat {

  // 更新环境变量配置到云端
  static async updateConfigToVika (config: any) {
    log.info('当前环境变量：', config)
    // return await ServeUpdateConfig(config)
  }

  // 从维格表中获取环境变量配置
  static async getConfigFromVika () {
    log.info('从维格表中获取环境变量配置,getConfigFromVika ()')
    const res: any = await ServeGetUserConfigObj()
    ChatFlowCore.logger.info('从维格表中获取环境变量配置,ServeGetUserConfigObj res:' + JSON.stringify(res))

    const vikaData = res.data
    ChatFlowCore.logger.info('vikaData:' + JSON.stringify(vikaData))
    // log.info('sysConfig:', JSON.stringify(sysConfig, null, '\t'))

    return vikaData
  }

  // 从环境变量中获取环境变量配置
  static getConfigFromEnv () {
    const envData: any = {}

    const config:any = process.env
    // log.info(configRecords)

    for (const key in config) {
      if (Object.prototype.hasOwnProperty.call(config, key)) {
        if (process.env[key]) {
          if ([ 'false', 'true' ].includes(process.env[key] as string)) {
            envData[key] = process.env[key] === 'true'
          } else {
            envData[key] = process.env[key] || ''
          }
        }
      }
    }

    // log.info('sysConfig:', JSON.stringify(sysConfig, null, '\t'))

    return envData
  }

}
