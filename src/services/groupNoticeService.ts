/* eslint-disable sort-keys */
import type { VikaBot, TaskConfig, Notifications } from '../db/vika-bot.js'

import { VikaSheet } from '../db/vika.js'
import { Message, Wechaty, log } from 'wechaty'
import { transformKeys } from './activityService.js'
import type { BusinessRoom, BusinessUser } from '../plugins/mod.js'
import { generateRandomNumber, wait } from '../utils/mod.js'
import {
  getContact,
  getRoom,
} from '../plugins/mod.js'
import { sendMsg } from './configService.js'

// import { db } from '../db/tables.js'
// const groupNoticeData = db.groupNotice
// log.info(JSON.stringify(groupNoticeData))

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
    // const query = {
    //   filterByFormula: '{状态|state}="待发送|waiting"',
    // }
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

  async pubGroupNotifications (bot: Wechaty, isVikaOk: any, messageService: { onMessage: (arg0: Message) => any }) {
    const groupNotifications = await this.getGroupNotifications()
    const resPub: any[] = []
    const failRoom: any[] = []
    const failContact: any[] = []
    const successRoom: any[] = []
    const successContact: any[] = []

    for (const notice of groupNotifications) {
      const timestamp = new Date().getTime()
      // log.info('当前消息：', JSON.stringify(notice))
      if (notice.type === 'room') {
        const room = await getRoom(bot, notice.room as BusinessRoom)
        if (room) {
          try {
            await sendMsg(room, notice.text, isVikaOk, messageService)
            await wait(generateRandomNumber(200))
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
            log.info('发送成功：群-', await room.topic())
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
            log.error('发送失败：', e)
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
          log.error('发送失败：群不存在', JSON.stringify(notice))
        }
      } else {
        const contact = await getContact(bot, notice.contact as BusinessUser)
        if (contact) {
          try {
            await sendMsg(contact, notice.text, isVikaOk, messageService)
            await wait(generateRandomNumber(200))
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
            log.info('发送成功：\n好友-', contact.name())
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
            log.error('发送失败：', e)
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
          log.error('发送失败：好友不存在', JSON.stringify(notice))
        }
      }
    }
    for (let i = 0; i < resPub.length; i = i + 10) {
      const records = resPub.slice(i, i + 10)
      await this.db.update(records)
      log.info('群发消息同步中...', i + 10)
      void await wait(1000)
    }

    return `\n发送成功:群${successRoom.length},好友${successContact.length}\n发送失败：群${failRoom.length},好友${failContact.length}`
  }

}
