/* eslint-disable sort-keys */
import { db } from '../db/tables.js'
import type { VikaBot, TaskConfig, Notifications } from '../db/vika-bot.js'

import { VikaSheet } from '../db/vika.js'
import { log } from 'wechaty'
import { transformKeys } from './activityService.js'

const groupNoticeData = db.groupNotice

// 服务类
export class GroupNoticeChat {

  db:VikaSheet
  vikaBot: VikaBot
  envsOnVika: any
  roomWhiteList: any
  contactWhiteList: any
  reminderList: TaskConfig[] = []

  constructor (vikaBot:VikaBot) {
    this.vikaBot = vikaBot
    this.db = new VikaSheet(vikaBot.vika, vikaBot.dataBaseIds.groupNoticeSheet)
    void this.init()
  }

  // 初始化
  async init () {
    await this.getRecords()
  }

  async getRecords () {
    const records = await this.db.findAll()
    // log.info('维格表中的记录：', JSON.stringify(records))
    return records
  }

  // 获取群发通知
  async getGroupNotifications () {
    const query = {
      filterByFormula: '{状态|state}="待发送|waiting"',
    }
    // log.info('query:', JSON.stringify(query))
    const groupNotifications: Notifications[] = []
    try {
      const records = await this.db.findAll()
      // log.info('群发通知列表（原始）：\n', JSON.stringify(records))

      for (const record of records) {
        const fields = record.fields
        const recordId = record.recordId
        const fieldsNew: Notifications = transformKeys(fields) as Notifications
        // log.info('群发通知列表(格式化key)：\n', JSON.stringify(fieldsNew))

        if (fieldsNew.text && fieldsNew.type && (fieldsNew.id || fieldsNew.alias || fieldsNew.name) && fieldsNew.state === '待发送|waiting') {
          fieldsNew.recordId = recordId
          fieldsNew.type = fieldsNew.type.split('|')[1] || 'contact'
          if (fieldsNew.type === 'room') {
            fieldsNew.room = {
              id: fieldsNew.id,
              topic: fieldsNew.name,
            }
          } else {
            fieldsNew.contact = {
              id: fieldsNew.id,
              name: fieldsNew.name,
              alias: fieldsNew.alias,
            }
          }
          groupNotifications.push(fieldsNew)
        }
      }
      log.info('待发送的群发通知列表（添加接收人）：\n', JSON.stringify(groupNotifications))

      return groupNotifications
    } catch (e) {
      log.error('获取群发通知列表失败：\n', e)

      return []
    }
  }

}
