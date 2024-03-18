/* eslint-disable sort-keys */
import type { SkillInfoArray } from './wxopenaiService.js'
import { logger } from '../utils/mod.js'
import { ChatFlowConfig } from '../api/base-config.js'
import { Wechaty, log } from 'wechaty'
import { ServeGetQas } from '../api/qa.js'

// import { db } from '../db/tables.js'
// const noticeData = db.notice
// logger.info(JSON.stringify(noticeData))

// 服务类
export class QaChat {

  static roomWhiteList: any
  static contactWhiteList: any
  static records: any
  static bot:Wechaty

  private constructor () {

  }

  // 初始化
  static async init () {
    try {
      const res = await ServeGetQas()
      const records = res.data.items
      this.records = records
      this.bot = ChatFlowConfig.bot
      log.info('初始化 QaChat 成功...')
    } catch (e) {
      log.info('初始化 QaChat 失败...', e)
    }
  }

  // 获取问答
  static async getQa (): Promise<SkillInfoArray> {
    await this.init()
    if (!this.records) {
      // Handle error
      return []
    }

    const skills: SkillInfoArray = this.records
      .filter((fields: { [x: string]: any ;recordId:string;}) => fields['state'] === '启用' && fields['title'] && fields['answer'])
      .map((fields: {[x: string]: any;recordId:string; }) => {
        const question: string[] = []
        for (let i = 1; i <= 3; i++) {
          const similarQuestion = fields[`question${i}`]
          if (similarQuestion) {
            question.push(similarQuestion)
          }
        }

        return {
          skillname: fields['skillname'] || '通用问题',
          title: fields['title'],
          question,
          answer: [ fields['answer'] ],
        }
      })
    logger.info('skills:', JSON.stringify(skills))
    return skills
  }

}
