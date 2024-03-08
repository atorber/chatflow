/* eslint-disable sort-keys */
import type { Notifications } from '../api/base-config.js'
import { ChatFlowConfig } from '../api/base-config.js'
import { Wechaty, log } from 'wechaty'
import type { BusinessRoom, BusinessUser } from '../plugins/mod.js'
import { generateRandomNumber, delay, logger } from '../utils/mod.js'
import {
  getContact,
  getRoom,
} from '../plugins/mod.js'
import { sendMsg } from './configService.js'
import {
  ServeGetGroupnotices,
  ServeUpdateGroupnotices,
} from '../api/group-notice.js'

// import { db } from '../db/tables.js'
// const groupNoticeData = db.groupNotice
// logger.info(JSON.stringify(groupNoticeData))

// 服务类
export class GroupNoticeChat {

  static roomWhiteList: any
  static contactWhiteList: any
  static bot:Wechaty

  private constructor () {}

  // 初始化
  static async init () {
    this.bot = ChatFlowConfig.bot

    log.info('初始化 GroupNoticeChat 成功...')
  }

  // 获取群发通知
  static async getGroupNotifications () {
    // const query = {
    //   filterByFormula: '{状态|state}="待发送|waiting"',
    // }
    // logger.info('query:', JSON.stringify(query))
    const groupNotifications: Notifications[] = []
    try {
      const statisticsRes = await ServeGetGroupnotices()
      const records = statisticsRes.data.items
      // logger.info('群发通知列表（原始）：\n', JSON.stringify(records))

      for (const fields of records) {
        const recordId = fields.recordId
        // logger.info('群发通知列表(格式化key)：\n', JSON.stringify(fields))

        if (fields.text && fields.type && (fields.id || fields.alias || fields.name) && fields.state === '待发送|waiting') {
          fields.recordId = recordId
          fields.type = fields.type.split('|')[1] || 'contact'
          if (fields.type === 'room') {
            fields.room = {
              id: fields.id,
              topic: fields.name,
            }
          } else {
            fields.contact = {
              id: fields.id,
              name: fields.name,
              alias: fields.alias,
            }
          }
          groupNotifications.push(fields)
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
            notice.state = '发送成功|success'
            notice.pubTime = timestamp
            resPub.push(notice)
            successRoom.push(notice)
            logger.info('发送成功：群-', await room.topic())
          } catch (e) {
            notice.state = '发送失败|fail'
            notice.pubTime = timestamp
            notice.info = JSON.stringify(e)
            resPub.push(notice)
            failRoom.push(notice)
            logger.error('发送失败：', e)
          }
        } else {
          notice.state = '发送失败|fail'
          notice.pubTime = timestamp
          notice.info = '群不存在'
          resPub.push(notice)
          failRoom.push(notice)
          logger.error('发送失败：群不存在', JSON.stringify(notice))
        }
      } else {
        const contact = await getContact(this.bot, notice.contact as BusinessUser)
        if (contact) {
          try {
            await sendMsg(contact, notice.text)
            await delay(generateRandomNumber(200))
            notice.state = '发送成功|success'
            notice.pubTime = timestamp
            resPub.push(notice)
            successContact.push(notice)
            logger.info('发送成功：\n好友-', contact.name())
          } catch (e) {
            notice.state = '发送失败|fail'
            notice.pubTime = timestamp
            notice.info = JSON.stringify(e)
            resPub.push(notice)
            failContact.push(notice)
            logger.error('发送失败：', e)
          }
        } else {
          notice.state = '发送失败|fail'
          notice.pubTime = timestamp
          notice.info = '好友不存在'
          resPub.push(notice)
          failContact.push(notice)
          logger.error('发送失败：好友不存在', JSON.stringify(notice))
        }
      }
    }
    for (let i = 0; i < resPub.length; i = i + 10) {
      const records = resPub.slice(i, i + 10)
      await ServeUpdateGroupnotices(records)
      logger.info('群发消息同步中...', i + 10)
      void await delay(1000)
    }

    return `\n发送成功:群${successRoom.length},好友${successContact.length}\n发送失败：群${failRoom.length},好友${failContact.length}`
  }

}
