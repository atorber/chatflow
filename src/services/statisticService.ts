/* eslint-disable sort-keys */
import type { SkillInfoArray } from './wxopenaiService.js'
import { logger } from '../utils/mod.js'
import { ChatFlowConfig } from '../api/base-config.js'
import { Wechaty, log } from 'wechaty'
import { ServeGetStatistics } from '../api/statistic.js'

// import { db } from '../db/tables.js'
// const noticeData = db.notice
// logger.info(JSON.stringify(noticeData))

// 服务类
export class StatisticChat {

  static roomWhiteList: any
  static contactWhiteList: any
  static records: any
  static bot:Wechaty

  private constructor () {

  }

  // 初始化
  static async init () {
    const res = await ServeGetStatistics()
    this.records = res.data.items
    this.bot = ChatFlowConfig.bot

    log.info('初始化 QaChat 成功...')
  }

  // 获取定时提醒
  static async getQa (): Promise<SkillInfoArray> {
    await this.init()
    if (!this.records) {
      // Handle error
      return []
    }

    const skills: SkillInfoArray = this.records
      .filter((record: {recordId:string; fields:{[x: string]: any }}) => record.fields['启用状态|state'] === '启用' && record.fields['标准问题|title'] && record.fields['机器人回答|answer'])
      .map((record: {recordId:string; fields:{[x: string]: any }}) => {
        const question: string[] = []
        for (let i = 1; i <= 3; i++) {
          const similarQuestion = record.fields[`相似问题${i}(选填)|question${i}`]
          if (similarQuestion) {
            question.push(similarQuestion)
          }
        }

        return {
          skillname: record.fields['分类|skillname'] || '通用问题',
          title: record.fields['标准问题|title'],
          question,
          answer: [ record.fields['机器人回答|answer'] ],
        }
      })
    logger.info('skills:', JSON.stringify(skills))
    return skills
  }

}
