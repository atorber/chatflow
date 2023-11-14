/* eslint-disable sort-keys */
/* eslint-disable sort-keys */
import type { TaskConfig, Notifications } from '../api/base-config.js'
import { VikaDB } from '../db/vika-db.js'
import { ChatFlowConfig } from '../api/base-config.js'

import { VikaSheet } from '../db/vika.js'
import { Wechaty, log } from 'wechaty'
import { transformKeys } from './activityService.js'
import type { BusinessRoom, BusinessUser } from '../plugins/mod.js'
import { generateRandomNumber, delay, logger } from '../utils/mod.js'
import {
  getContact,
  getRoom,
} from '../plugins/mod.js'
import { sendMsg } from './configService.js'

// import { db } from '../db/tables.js'
// const groupNoticeData = db.groupNotice
// logger.info(JSON.stringify(groupNoticeData))

// 服务类
export class GroupNoticeChat {

  static db:VikaSheet
  static envsOnVika: any
  static roomWhiteList: any
  static contactWhiteList: any
  static reminderList: TaskConfig[] = []
  static bot:Wechaty

  private constructor () {

  }

  // 初始化
  static async init () {
    this.db = new VikaSheet(VikaDB.vika, VikaDB.dataBaseIds.groupNoticeSheet)
    await this.getRecords()
    this.bot = ChatFlowConfig.bot

    log.info('初始化 GroupNoticeChat 成功...')
  }

  static async getRecords () {
    const records = await this.db.findAll()
    // logger.info('维格表中的记录：', JSON.stringify(records))
    return records
  }

  // 获取群发通知
  static async getGroupNotifications () {
    // const query = {
    //   filterByFormula: '{状态|state}="待发送|waiting"',
    // }
    // logger.info('query:', JSON.stringify(query))
    const groupNotifications: Notifications[] = []
    try {
      const records = await this.db.findAll()
      // logger.info('群发通知列表（原始）：\n', JSON.stringify(records))

      for (const record of records) {
        const fields = record.fields
        const recordId = record.recordId
        const fieldsNew: Notifications = transformKeys(fields) as Notifications
        // logger.info('群发通知列表(格式化key)：\n', JSON.stringify(fieldsNew))

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
      logger.info('待发送的群发通知列表（添加接收人）：\n', JSON.stringify(groupNotifications))

      return groupNotifications
    } catch (e) {
      logger.error('获取群发通知列表失败：\n', e)

      return []
    }
  }

  static async pubGroupNotifications () {
    const groupNotifications = await this.getGroupNotifications()
    const resPub: any[] = []
    const failRoom: any[] = []
    const failContact: any[] = []
    const successRoom: any[] = []
    const successContact: any[] = []

    for (const notice of groupNotifications) {
      const timestamp = new Date().getTime()
      // logger.info('当前消息：', JSON.stringify(notice))
      if (notice.type === 'room') {
        const room = await getRoom(this.bot, notice.room as BusinessRoom)
        if (room) {
          try {
            await sendMsg(room, notice.text)
            await delay(generateRandomNumber(200))
            resPub.push({
              recordId: notice.recordId,
              fields: {
                // '昵称/群名称|name':await room.topic(),
                // '好友ID/群ID|id':room.id,
                '状态|state': '发送成功|success',
                '发送时间|pubTime': timestamp,
              },
            })
            successRoom.push(notice)
            logger.info('发送成功：群-', await room.topic())
          } catch (e) {
            resPub.push({
              recordId: notice.recordId,
              fields: {
                '状态|state': '发送失败|fail',
                '发送时间|pubTime': timestamp,
                '信息|info':JSON.stringify(e),
              },
            })
            failRoom.push(notice)
            logger.error('发送失败：', e)
          }
        } else {
          resPub.push({
            recordId: notice.recordId,
            fields: {
              '状态|state': '发送失败|fail',
              '发送时间|pubTime': timestamp,
              '信息|info':'群不存在',
            },
          })
          failRoom.push(notice)
          logger.error('发送失败：群不存在', JSON.stringify(notice))
        }
      } else {
        const contact = await getContact(this.bot, notice.contact as BusinessUser)
        if (contact) {
          try {
            await sendMsg(contact, notice.text)
            await delay(generateRandomNumber(200))
            resPub.push({
              recordId: notice.recordId,
              fields: {
                // '昵称/群名称|name':contact.name,
                // '好友ID/群ID|id':contact.id,
                // '好友备注|alias':await contact.alias(),
                '状态|state': '发送成功|success',
                '发送时间|pubTime': timestamp,
              },
            })
            successContact.push(notice)
            logger.info('发送成功：\n好友-', contact.name())
          } catch (e) {
            resPub.push({
              recordId: notice.recordId,
              fields: {
                '状态|state': '发送失败|fail',
                '发送时间|pubTime': timestamp,
                '信息|info':JSON.stringify(e),
              },
            })
            failContact.push(notice)
            logger.error('发送失败：', e)
          }
        } else {
          resPub.push({
            recordId: notice.recordId,
            fields: {
              '状态|state': '发送失败|fail',
              '发送时间|pubTime': timestamp,
              '信息|info':'好友不存在',
            },
          })
          failContact.push(notice)
          logger.error('发送失败：好友不存在', JSON.stringify(notice))
        }
      }
    }
    for (let i = 0; i < resPub.length; i = i + 10) {
      const records = resPub.slice(i, i + 10)
      await this.db.update(records)
      logger.info('群发消息同步中...', i + 10)
      void await delay(1000)
    }

    return `\n发送成功:群${successRoom.length},好友${successContact.length}\n发送失败：群${failRoom.length},好友${failContact.length}`
  }

}
