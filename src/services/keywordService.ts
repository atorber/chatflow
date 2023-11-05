/* eslint-disable sort-keys */
import { ChatFlowConfig } from '../db/vika-bot.js'
import { VikaSheet, IRecord } from '../db/vika.js'
import { logger } from '../utils/mod.js'

// 服务类
export class KeywordChat {

  private db:VikaSheet
  records: IRecord[] | undefined

  constructor () {
    this.db = new VikaSheet(ChatFlowConfig.vika, ChatFlowConfig.dataBaseIds.keywordSheet)
    void this.init()
  }

  // 初始化
  async init () {
    await this.getKeywords()
  }

  // 获取关键字
  async getKeywords () {
    if (this.records) return this.records
    const keywordsRecords = await this.db.findAll()
    this.records = keywordsRecords
    logger.info('关键词：\n' + JSON.stringify(keywordsRecords))
    return this.records
  }

  async getKeywordsText () {
    const records = await this.getKeywords()
    let text :string = '【操作说明】\n'
    for (const record of records) {
      const fields = record.fields
      text += `${fields['指令名称|name']}：${fields['说明|desc']}\n`
    }
    return text
  }

  async getSystemKeywordsText () {
    const records = await this.getKeywords()
    let text :string = '【操作说明】\n'
    for (const record of records) {
      const fields = record.fields
      if (fields['类型|type'] === '系统指令') text += `${fields['指令名称|name']} : ${fields['说明|desc']}\n`
    }
    return text
  }

}
