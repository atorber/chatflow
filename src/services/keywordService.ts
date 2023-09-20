/* eslint-disable sort-keys */
import type { VikaBot } from '../db/vika-bot.js'
import { VikaSheet, IRecord } from '../db/vika.js'
import { log } from 'wechaty'

// 服务类
export class KeywordChat {

  private db:VikaSheet
  vikaBot: VikaBot
  records: IRecord[] | undefined

  constructor (vikaBot:VikaBot) {
    this.vikaBot = vikaBot
    this.db = new VikaSheet(vikaBot.vika, vikaBot.dataBaseIds.keywordSheet)
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
    // log.info('关键词：\n', JSON.stringify(keywordsRecords))
    return this.records
  }

  async getKeywordsText () {
    const records = await this.getKeywords()
    let text :string = '操作指令说明:\n'
    for (const record of records) {
      const fields = record.fields
      text += `\n${fields['指令名称|name']}：${fields['说明|desc']}`
    }
    return text
  }

  async getSystemKeywordsText () {
    const records = await this.getKeywords()
    let text :string = '操作指令说明:\n'
    for (const record of records) {
      const fields = record.fields
      if (fields['类型|type'] === '系统指令')       text += `\n${fields['指令名称|name']}：${fields['说明|desc']}`
    }
    return text
  }

}
