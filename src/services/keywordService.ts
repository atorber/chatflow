/* eslint-disable sort-keys */
import { ChatFlowConfig } from '../api/base-config.js'
import { Wechaty, log } from 'wechaty'
import { ServeGetKeywords } from '../api/keyword.js'

// 服务类
export class KeywordChat {

  static records: any[] | undefined
  static bot:Wechaty

  private constructor () {

  }

  // 初始化
  static async init () {
    this.bot = ChatFlowConfig.bot
    log.info('初始化 KeywordChat 成功...')
  }

  static async getKeywordsText () {
    // const records = await this.getKeywords()
    const res = await ServeGetKeywords()
    const records = res.data.items

    let text :string = '【操作说明】\n'
    for (const fields of records) {
      text += `${fields['name']}：${fields['desc']}\n`
    }
    return text
  }

  static async getSystemKeywordsText () {
    // const records = await this.getKeywords()
    const res = await ServeGetKeywords()
    const records = res.data.items
    let text :string = '【操作说明】\n'
    for (const fields of records) {
      if (fields['type'] === '系统指令') text += `${fields['name']} : ${fields['desc']}\n`
    }
    return text
  }

}
