/* eslint-disable sort-keys */
import type { VikaBot } from '../db/vika-bot.js'

import { VikaSheet, IRecord } from '../db/vika.js'
import { log } from 'wechaty'
import { wait } from '../utils/utils.js'
import type { ProcessEnv } from '../types/env.js'

// import { db } from '../db/tables.js'
// const envData = db.env
// log.info(JSON.stringify(envData))

// 服务类
export class EnvChat {

  db!:VikaSheet
  vikaBot!: VikaBot
  envIdMap: any
  records!: IRecord[]
  envData: ProcessEnv | undefined
  vikaIdMap: any
  vikaData: any

  constructor () {
    this.getConfigFromEnv()
  }

  // 初始化
  async init (vikaBot:VikaBot) {
    this.vikaBot = vikaBot
    this.db = new VikaSheet(vikaBot.vika, vikaBot.dataBaseIds.envSheet)
    await this.getAll()
  }

  async getAll () {
    const records = await this.db.findAll()
    // log.info('维格表中的记录：', JSON.stringify(records))
    this.records = records
    return records
  }

  // 更新环境变量配置到云端
  async updateConfigToVika (config: any) {
    const functionOnStatus = config.functionOnStatus
    const botConfig = config.botConfig
    log.info('维格表内功能开关状态', functionOnStatus)
    log.info('维格表内基础配置信息', botConfig)
  }

  // 下载环境变量配置
  async downConfigFromVika () {
    return await this.getConfigFromVika()
  }

  // 从维格表中获取环境变量配置
  async getConfigFromVika () {
    const vikaIdMap: any = {}
    const vikaData: any = {}

    const configRecords = await this.getAll()

    await wait(1000)
    // log.info(configRecords)

    for (let i = 0; i < configRecords.length; i++) {
      const record: IRecord = configRecords[i] as IRecord
      const fields = record.fields
      const recordId = record.recordId

      if (fields['标识|key']) {
        if (fields['值|value'] && [ 'false', 'true' ].includes(fields['值|value'])) {
          vikaData[record.fields['标识|key'] as string] = fields['值|value'] === 'true'
        } else {
          vikaData[record.fields['标识|key'] as string] = fields['值|value'] || ''
        }
        vikaIdMap[record.fields['标识|key'] as string] = recordId
      }
    }

    this.vikaIdMap = vikaIdMap
    this.vikaData = vikaData

    // log.info('sysConfig:', JSON.stringify(sysConfig, null, '\t'))

    return this.vikaData
  }

  // 从环境变量中获取环境变量配置
  getConfigFromEnv () {
    const envData: any = {}

    const config:ProcessEnv = process.env
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

  // 将环境变量更新到云
  async updateCloud (config: { [x: string]: string }) {
    const newData: {
      recordId: string;
      fields: {
          [key: string]: any;
      };
  }[] = []
    for (const key in config) {
      if (Object.prototype.hasOwnProperty.call(config, key)) {
        if (process.env[key]) {
          config[key] = process.env[key]!
          const fields:{
            [key: string]: any;
        } = { '值|value':process.env[key] }
          const item = { recordId:this.envIdMap[key], fields }
          newData.push(item)
        }
      }
    }

    if (newData.length) {
      await this.db.update(newData)
    }

    return newData

  }

  // 将云端配置更新到环境变量
  updateEnv (config: { [s: string]: unknown } | ArrayLike<unknown>) {
    for (const [ key, value ] of Object.entries(config)) {
      process.env[key] = String(value)
    }

  }

}
