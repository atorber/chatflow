/* eslint-disable sort-keys */
import type { VikaBot } from '../db/vika-bot.js'
import { VikaSheet } from '../db/vika.js'
import { log } from 'wechaty'

// 服务类
export class KeywordChat {

  private db:VikaSheet
  vikaBot: VikaBot

  constructor (vikaBot:VikaBot) {
    this.vikaBot = vikaBot
    this.db = new VikaSheet(vikaBot.vika, vikaBot.dataBaseIds.keywordSheet)
    void this.init()
  }

  // 初始化
  async init () {
    await this.getRoom()
  }

  async getRoom () {
    const records = await this.db.findAll()
    // log.info('维格表中的记录：', JSON.stringify(records))
    return records
  }

  // 获取关键字
  async getKeywords () {
    const keywordsRecords = await this.db.findAll()
    log.info('关键词：\n', JSON.stringify(keywordsRecords))
  }

}
