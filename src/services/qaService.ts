/* eslint-disable sort-keys */
import { db } from '../db/tables.js'
import type { VikaBot, TaskConfig } from '../db/vika-bot.js'
import { VikaSheet } from '../db/vika.js'
import { log } from 'wechaty'
import type { SkillInfoArray } from './wxopenaiService.js'

const noticeData = db.notice

// 服务类
export class QaChat {

  private db: VikaSheet
  vikaBot: VikaBot
  envsOnVika: any
  roomWhiteList: any
  contactWhiteList: any
  reminderList: TaskConfig[] = []
  records: any

  constructor (vikaBot: VikaBot) {
    this.vikaBot = vikaBot
    this.db = new VikaSheet(vikaBot.vika, vikaBot.dataBaseIds.qaSheet)
    void this.init()
  }

  // 初始化
  async init () {
    const records = await this.getRecords()
    this.records = records
  }

  async getRecords () {
    const records = await this.db.findAll()
    // log.info('维格表中的记录：', JSON.stringify(records))
    return records
  }

  // 获取定时提醒
  async getQa () {
    const records = this.records()
    const skills:SkillInfoArray  = records.map((record: { [x: string]: any }) => {
      record['分类|skillname'] = record['分类|skillname'] || '通用问题'
      if (record['启用状态|state'] === '启用' && record['标准问题|title'] && record['机器人回答|answer']) {
        const question = []
        if (record['相似问题1(选填)|question1']) question.push(record['相似问题1(选填)|question1'])
        if (record['相似问题2(选填)|question2']) question.push(record['相似问题1(选填)|question2'])
        if (record['相似问题3(选填)|question2']) question.push(record['相似问题1(选填)|question3'])

        const skill = {
          skillname:record['分类|skillname'],
          title:record['标准问题|title'],
          question,
          answer:[
            record['机器人回答|answer'],
          ],
        }
        return skill
      } else {
        return undefined
      }

    })
    return skills
  }

}
