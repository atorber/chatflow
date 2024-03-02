/* eslint-disable sort-keys */
import { Room, Wechaty, log } from 'wechaty'
import { delay, logger } from '../utils/utils.js'

import { ChatFlowConfig } from '../api/base-config.js'
import {
  ServeGetGroups,
  ServeUpdateGroups,
  ServeDeleteBatchGroups,
} from '../api/room.js'

// import { db } from '../db/tables.js'
// const roomData = db.room

// 服务类
export class RoomChat {

  static rooms: any[]
  static bot:Wechaty

  // 初始化
  static async init () {
    const res = await ServeGetGroups()
    const rooms = res.data.list
    this.rooms = rooms
    this.bot = ChatFlowConfig.bot

    log.info('初始化 RoomChat 成功...')
  }

  // 上传群列表
  static async updateRooms (puppet:string) {
    let updateCount = 0
    try {
      // 获取最新的群列表
      const rooms: Room[] = await this.bot.Room.findAll()
      log.info('最新微信群数量：', rooms.length)
      const recordsAll: any = []

      // 从云端获取已有的群列表
      const roomsRes = await ServeGetGroups()
      const recordExisting = roomsRes.data.list
      logger.info('云端群数量：' + recordExisting.length || '0')
      let wxids: string[] = []
      const recordIds: string[] = []
      if (recordExisting.length) {
        recordExisting.forEach((fields: any) => {
          if (fields['id']) {
            wxids.push(fields['id'] as string)
            recordIds.push(fields.recordId)
          }
        })
      }

      if (puppet === 'wechaty-puppet-wechat' || puppet === 'wechaty-puppet-wechat4u') {
        const count = Math.ceil(recordIds.length / 10)
        for (let i = 0; i < count; i++) {
          const records = recordIds.splice(0, 10)
          logger.info('删除：', records.length)
          await ServeDeleteBatchGroups(records)
          await delay(1000)
        }
        wxids = []
      }

      for (let i = 0; i < rooms.length; i++) {

        const item: Room | undefined = rooms[i]
        // if(item) log.info('头像信息：', (JSON.stringify((await item.avatar()).toJSON())))

        if (item && !wxids.includes(item.id)) {
          let avatar: any = 'null'
          try {
            avatar = (await item.avatar()).toJSON()
            avatar = avatar.url
          } catch (err) {
            // logger.error('获取群头像失败：' + err)
          }
          const ownerId = await item.owner()?.id
          //   logger.info('第一个群成员：' + ownerId)
          const fields = {
            avatar,
            id: item.id,
            ownerId: ownerId || '',
            topic: await item.topic() || '',
            updated: new Date().toLocaleString(),
          }
          const record = {
            fields,
          }
          recordsAll.push(record)
        }
      }

      for (let i = 0; i < recordsAll.length; i = i + 10) {
        const records = recordsAll.slice(i, i + 10)
        try {
          await ServeUpdateGroups(records)
          logger.info('群列表同步完成...' + i + records.length)
          updateCount = updateCount + records.length
          void await delay(1000)
        } catch (err) {
          logger.error('群列表同步失败,待系统就绪后再管理群发送【更新通讯录】可手动更新...' + i + 10)
          void await delay(1000)
        }
      }

      logger.info('同步群列表完成，更新到云端群数量：' + updateCount || '0')
    } catch (err) {
      logger.error('更新群列表失败：' + err)

    }

  }

}
