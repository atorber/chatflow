/* eslint-disable sort-keys */
import { VikaDB } from '../db/vika-db.js'
import { ChatFlowConfig } from '../api/base-config.js'
import { Wechaty, log } from 'wechaty'

import { VikaSheet, IRecord } from '../db/vika.js'
import { logger } from '../utils/mod.js'
import { ServeGetKeywords } from '../api/keyword.js'

// 服务类
export class KeywordChat {

  static db:VikaSheet
  static records: IRecord[] | undefined
  static bot:Wechaty

  private constructor () {

  }

  // 初始化
  static async init () {
    this.db = new VikaSheet(VikaDB.vika, VikaDB.dataBaseIds.keywordSheet)
    await this.getKeywords()
    this.bot = ChatFlowConfig.bot

    log.info('初始化 KeywordChat 成功...')
  }

  // 获取关键字
  static async getKeywords () {
    if (this.records) return this.records
    const keywordsRecords = await this.db.findAll()
    this.records = keywordsRecords
    logger.info('关键词：\n' + JSON.stringify(keywordsRecords))
    return this.records
  }

  static async getKeywordsText () {
    // const records = await this.getKeywords()
    const res = await ServeGetKeywords()
    const records = res.data.list

    let text :string = '【操作说明】\n'
    for (const fields of records) {
      text += `${fields['name']}：${fields['desc']}\n`
    }
    return text
  }

  static async getSystemKeywordsText () {
    // const records = await this.getKeywords()
    const res = await ServeGetKeywords()
    const records = res.data.list
    let text :string = '【操作说明】\n'
    for (const fields of records) {
      if (fields['type'] === '系统指令') text += `${fields['name']} : ${fields['desc']}\n`
    }
    return text
  }

}
