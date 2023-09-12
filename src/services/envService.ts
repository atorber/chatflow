/* eslint-disable sort-keys */
import { db } from '../db/tables.js'
import type { VikaBot } from '../db/vika-bot.js'

import { VikaSheet, IRecord } from '../db/vika.js'
import { log } from 'wechaty'
import { wait } from '../utils/utils.js'
import type { BotConfig } from '../types/config.js'

const envData = db.env

// 服务类
export class EnvChat {

  private db:VikaSheet
  vikaBot: VikaBot
  envsOnVika: any

  constructor (vikaBot:VikaBot) {
    this.vikaBot = vikaBot
    this.db = new VikaSheet(vikaBot.vika, vikaBot.dataBaseIds.envSheet)
    void this.init()
  }

  // 初始化
  async init () {
    await this.getEnv()
  }

  async getEnv () {
    const records = await this.db.findAll()
    // log.info('维格表中的记录：', JSON.stringify(records))
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
    return await this.getConfig()
  }

  // 获取环境变量配置
  async getConfig () {
    const sysConfig: any = {}
    const botConfig: any = {}
    const botConfigIdMap: any = {}
    const configRecords = await this.db.findAll()
    await wait(1000)
    // log.info(configRecords)

    for (let i = 0; i < configRecords.length; i++) {
      const record: IRecord = configRecords[i] as IRecord
      const fields = record.fields
      const recordId = record.recordId

      if (fields['标识|key']) {
        if (fields['值|value'] && [ '开启', '关闭' ].includes(fields['值|value'])) {
          botConfig[record.fields['标识|key'] as keyof(BotConfig)] = fields['值|value'] === '开启'
        } else {
          botConfig[record.fields['标识|key'] as keyof(BotConfig)] = fields['值|value'] || ''
        }
        botConfigIdMap[record.fields['标识|key'] as keyof(BotConfig)] = recordId
      }
    }

    this.envsOnVika = botConfigIdMap

    sysConfig['welcomeList'] = []
    sysConfig['botConfig'] = botConfig
    sysConfig['botConfigIdMap'] = botConfigIdMap

    // log.info('sysConfig:', JSON.stringify(sysConfig, null, '\t'))

    return sysConfig

  }

}
