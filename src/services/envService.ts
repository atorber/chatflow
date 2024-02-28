/* eslint-disable sort-keys */
import type { IRecord } from '../db/vika.js'
import { log } from 'wechaty'
import { delay } from '../utils/utils.js'
import type { ProcessEnv } from '../types/env.js'
import {
  ServeGetUserConfig,
  // ServeUpdateConfig,
} from '../api/user.js'

// import { db } from '../db/tables.js'
// const envData = db.env
// log.info(JSON.stringify(envData))

// 服务类
export class EnvChat {

  static envIdMap: any
  static records: IRecord[]
  static envData: ProcessEnv | undefined
  static vikaIdMap: any
  static vikaData: any

  // 初始化
  static async init () {
    EnvChat.getConfigFromEnv()
    this.records = await this.getAll()
    log.info('初始化 EnvChat 成功...', JSON.stringify(this.records))
  }

  static async getAll () {
    // const records = await this.db.findAll()
    // log.info('维格表中的记录：', JSON.stringify(records))
    const configRes = await ServeGetUserConfig()
    this.records = configRes.data.list
    return this.records
  }

  // 更新环境变量配置到云端
  static async updateConfigToVika (config: any) {
    log.info('当前环境变量：', config)
    // return await ServeUpdateConfig(config)
  }

  // 下载环境变量配置
  static async downConfigFromVika () {
    return await this.getConfigFromVika()
  }

  // 从维格表中获取环境变量配置
  static async getConfigFromVika () {
    log.info('从维格表中获取环境变量配置,getConfigFromVika ()')
    const vikaData: any = {}

    const configRecords = await EnvChat.getAll()

    await delay(500)
    // log.info(configRecords)

    for (let i = 0; i < configRecords.length; i++) {
      const fields:any = configRecords[i]

      if (fields['key']) {
        if (fields['value'] && [ 'false', 'true' ].includes(fields['value'])) {
          vikaData[fields['key'] as string] = fields['value'] === 'true'
        } else {
          vikaData[fields['key'] as string] = fields['value'] || ''
        }
      }
    }
    this.vikaData = vikaData

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

  getBotOps () {
    const puppet = EnvChat.envData?.WECHATY_PUPPET || 'wechaty-puppet-wechat'
    const token = EnvChat.envData?.WECHATY_TOKEN
    const ops: any = {
      name: 'chatflow',
      puppet,
      puppetOptions: {
        token,
      },
    }

    if (puppet === 'wechaty-puppet-service') {
      process.env['WECHATY_PUPPET_SERVICE_NO_TLS_INSECURE_CLIENT'] = 'true'
    }

    if ([ 'wechaty-puppet-wechat4u', 'wechaty-puppet-xp', 'wechaty-puppet-engine' ].includes(puppet)) {
      delete ops.puppetOptions.token
    }

    if (puppet === 'wechaty-puppet-wechat') {
      delete ops.puppetOptions.token
      ops.puppetOptions.uos = true
    }

    log.info('Wchaty配置信息:\n', JSON.stringify(ops))
    return ops
  }

}
