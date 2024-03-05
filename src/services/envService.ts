/* eslint-disable sort-keys */
// import type { IRecord } from '../db/vika.js'
import { log } from 'wechaty'
import { logger } from '../utils/utils.js'
import type { ProcessEnv } from '../types/env.js'
import {
  // ServeUpdateConfig,
  ServeGetUserConfigObj,
} from '../api/user.js'

// import { db } from '../db/tables.js'
// const envData = db.env
// log.info(JSON.stringify(envData))

// 服务类
export class EnvChat {

  // static records: IRecord[]
  static envData: ProcessEnv | undefined
  static vikaData: any

  // 初始化
  static async init () {
    EnvChat.getConfigFromEnv()
    // const configRes = await ServeGetUserConfig()
    // this.records = configRes.data.items
    // log.info('初始化 EnvChat 成功...', JSON.stringify(this.records))
  }

  // 更新环境变量配置到云端
  static async updateConfigToVika (config: any) {
    log.info('当前环境变量：', config)
    // return await ServeUpdateConfig(config)
  }

  // 从维格表中获取环境变量配置
  static async getConfigFromVika () {
    log.info('从维格表中获取环境变量配置,getConfigFromVika ()')
    const res: any = await ServeGetUserConfigObj()
    logger.info('从维格表中获取环境变量配置,ServeGetUserConfigObj res:' + JSON.stringify(res))
    const vikaData: any = res.data
    this.vikaData = vikaData
    logger.info('vikaData:' + JSON.stringify(vikaData))
    // log.info('sysConfig:', JSON.stringify(sysConfig, null, '\t'))

    return this.vikaData
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

    this.envData = envData

    // log.info('sysConfig:', JSON.stringify(sysConfig, null, '\t'))

    return envData
  }

}
