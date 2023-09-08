/* eslint-disable sort-keys */
import { db } from '../db/tables.js'
import type { VikaBot, TaskConfig } from '../db/vika-bot.js'
import { VikaSheet, IRecord } from '../db/vika.js'

import { log } from 'wechaty'

const noticeData = db.notice

type TaskFields = {
  '内容|desc'?: string;
  '时间|time'?: string;
  '周期|cycle'?: string;
  '通知目标类型|type'?: string;
  '昵称/群名称|name'?: string;
  '好友ID/群ID(选填)|id'?: string;
  '好友备注(选填)|alias'?: string;
  '启用状态|state'?: string;
};

// 服务类
export class NoticeChat {

  private db:VikaSheet
  vikaBot: VikaBot
  envsOnVika: any
  roomWhiteList: any
  contactWhiteList: any
  reminderList: TaskConfig[] = []

  constructor (vikaBot:VikaBot) {
    this.vikaBot = vikaBot
    this.db = new VikaSheet(vikaBot.vika, vikaBot.dataBaseIds.noticeSheet)
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

  // 获取定时提醒
  async getTimedTask (): Promise<TaskConfig[]> {
    const taskRecords: IRecord[] = await this.db.findAll()

    const timedTasks: TaskConfig[] = taskRecords
      .map((task: IRecord) => {
        const {
          '内容|desc': desc,
          '时间|time': time,
          '周期|cycle': cycle,
          '通知目标类型|type': type,
          '昵称/群名称|name': name,
          '好友ID/群ID(选填)|id': id,
          '好友备注(选填)|alias': alias,
          '启用状态|state': state,
        } = task.fields as TaskFields

        const isActive = state === '开启'
        const isContact = type === '好友'
        const target = isContact
          ? { name: name || '', id: id || '', alias: alias || '' }
          : { topic: name || '', id: id || '' }

        const taskConfig: TaskConfig = {
          id: task.recordId,
          msg: desc || '',
          time: time || '',
          cycle: cycle || '无重复',
          targetType: isContact ? 'contact' : 'room',
          target,
          active: isActive,
        }

        return isActive && desc && time && cycle && (name || id || alias) ? taskConfig : null
      })
      .filter(Boolean) as TaskConfig[]

    this.reminderList = timedTasks
    return this.reminderList
  }

}
