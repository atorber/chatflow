/* eslint-disable sort-keys */
import type { VikaBot } from '../db/vika-bot.js'
import { VikaSheet, IRecord } from '../db/vika.js'
import { Room, Wechaty, log } from 'wechaty'
import { wait } from '../utils/utils.js'

// import { db } from '../db/tables.js'
// const roomData = db.room

// 服务类
export class RoomChat {

  private db:VikaSheet
  vikaBot: VikaBot
  rooms!: any[]

  constructor (vikaBot:VikaBot) {
    this.vikaBot = vikaBot
    this.db = new VikaSheet(vikaBot.vika, vikaBot.dataBaseIds.roomSheet)
    void this.init()
  }

  // 初始化
  async init () {
    const rooms = await this.getRoom()
    this.rooms = rooms
  }

  async getRoom () {
    const records = await this.db.findAll()
    // log.info('维格表中的记录：', JSON.stringify(records))
    return records
  }

  // 上传群列表
  async updateRooms (bot: Wechaty) {
    let updateCount = 0
    try {
      const rooms: Room[] = await bot.Room.findAll()
      log.info('最新微信群数量：', rooms.length)
      const recordsAll: any = []
      const recordExisting = await this.db.findAll()
      log.info('云端群数量：', recordExisting.length || '0')
      let wxids: string[] = []
      const recordIds: string[] = []
      if (recordExisting.length) {
        recordExisting.forEach((record: IRecord) => {
          if (record.fields['群ID|id']) {
            wxids.push(record.fields['群ID|id'] as string)
            recordIds.push(record.recordId)
          }
        })
      }

      if (bot.puppet.name() === 'wechaty-puppet' || bot.puppet.name() === 'wechaty-puppet-wechat4u<wechaty-puppet>') {
        const count = Math.ceil(recordIds.length / 10)
        for (let i = 0; i < count; i++) {
          const records = recordIds.splice(0, 10)
          log.info('删除：', records.length)
          await this.db.remove(records)
          await wait(1000)
        }
        wxids = []
      }

      for (let i = 0; i < rooms.length; i++) {
        const item: Room | undefined = rooms[i]
        if (item && !wxids.includes(item.id)) {
          let avatar: any = 'null'
          try {
            avatar = await item.avatar()
            avatar = avatar.name
          } catch (err) {
            // log.error('获取群头像失败：', err)
          }
          const ownerId = await item.owner()?.id
          //   log.info('第一个群成员：', ownerId)
          const fields = {
            '头像|avatar':avatar,
            '群ID|id': item.id,
            '群主ID|ownerId': ownerId || '',
            '群名称|topic': await item.topic() || '',
            '更新时间|updated': new Date().toLocaleString(),
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
          await this.db.insert(records)
          log.info('群列表同步完成...', i + records.length)
          updateCount = updateCount + records.length
          void await wait(1000)
        } catch (err) {
          log.error('群列表同步失败,待系统就绪后再管理群发送【更新通讯录】可手动更新...', i + 10)
          void await wait(1000)
        }
      }

      log.info('同步群列表完成，更新到云端群数量：', updateCount || '0')
    } catch (err) {
      log.error('更新群列表失败：', err)

    }

  }

}
